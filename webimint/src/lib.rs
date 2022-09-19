use std::sync::Arc;

use fedimint_api::db::mem_impl::MemDatabase;
use fedimint_core::config::ClientConfig;
use mint_client::api::{WsFederationApi, WsFederationConnect};
use mint_client::{UserClient, UserClientConfig};

use js_sys::Promise;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::future_to_promise;

type Result<T> = std::result::Result<T, JsValue>;

fn anyhow_to_js(error: anyhow::Error) -> JsValue {
    JsValue::from(error.to_string())
}

#[wasm_bindgen(start)]
pub fn start() {
    tracing_wasm::set_as_global_default_with_config(
        tracing_wasm::WASMLayerConfigBuilder::default()
            .set_console_config(tracing_wasm::ConsoleConfig::ReportWithConsoleColor)
            .set_max_level(tracing::Level::INFO)
            .build(),
    );
}

#[wasm_bindgen]
pub struct Client {
    user_client: Arc<UserClient>,
}

impl Client {
    pub async fn new(connection_string: &str) -> anyhow::Result<Self> {
        let connect_cfg: WsFederationConnect = serde_json::from_str(connection_string)?;
        let api = WsFederationApi::new(connect_cfg.max_evil, connect_cfg.members);
        let cfg: ClientConfig = api.request("/config", ()).await?;
        let db = Box::new(MemDatabase::new());
        let user_client = UserClient::new(UserClientConfig(cfg.clone()), db, Default::default());
        let client = Self {
            user_client: Arc::new(user_client),
        };
        Ok(client)
    }
    pub async fn balance(&self) -> u32 {
        (self.user_client.coins().total_amount().milli_sat as f32 / 1000.) as u32
    }
    async fn invoice(&self) -> anyhow::Result<String> {
        let amount = 1000;
        let description = "description".into();
        tracing::info!("making rng");
        let mut rng = rand::rngs::OsRng::new().unwrap();

        let amt = fedimint_api::Amount::from_sat(amount);
        tracing::info!("getting invoice");
        let confirmed_invoice = self
            .user_client
            .generate_invoice(amt, description, &mut rng)
            .await?;
        tracing::info!("got invoice");
        let invoice = confirmed_invoice.invoice;

        Ok(invoice.to_string())
    }
}

#[wasm_bindgen]
pub struct WasmClient {
    client: Arc<Client>,
}

#[wasm_bindgen]
impl WasmClient {
    #[wasm_bindgen]
    pub async fn new(connection_string: &str) -> Result<WasmClient> {
        let client = Client::new(connection_string).await.map_err(anyhow_to_js)?;
        let wasm_client = Self {
            client: Arc::new(client),
        };
        Ok(wasm_client)
    }
    // pub async fn invoice(&self, amount: u64, description: String) -> anyhow::Result<String> {
    #[wasm_bindgen]
    pub async fn invoice(&self) -> Promise {
        tracing::info!("WasmClient.invoice()");
        let client = self.client.clone();
        future_to_promise(async move {
            Ok(JsValue::from(
                // this.invoice(amount as u64, description).await.map_err(anyhow_to_js)?,
                client.invoice().await.map_err(anyhow_to_js)?,
            ))
        })
    }

    // NOTE: we need to use `Promise` instead of `async` support due to lifetimes.
    #[wasm_bindgen]
    pub fn balance(&self) -> Promise {
        let client = self.client.clone();
        future_to_promise(async move { Ok(JsValue::from(client.balance().await as u32)) })
    }
}

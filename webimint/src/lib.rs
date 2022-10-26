mod db;

use db::ConfigKey;
pub use db::WasmDb;
use db::WasmDbTransaction;
use fedimint_api::Amount;
use fedimint_api::NumPeers;
use fedimint_api::TieredMulti;
use mint_client::mint::SpendableNote;

use std::sync::Arc;

use fedimint_api::db::Database;
use fedimint_core::config::ClientConfig;
use mint_client::api::{WsFederationApi, WsFederationConnect};
use mint_client::{UserClient, UserClientConfig};
use mint_client::query::CurrentConsensus;

use js_sys::Promise;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::future_to_promise;

type Result<T> = std::result::Result<T, JsValue>;

fn anyhow_to_js(error: anyhow::Error) -> JsValue {
    JsValue::from(error.to_string())
}

// FIXME: copied this from fedimint, but had unwraps
// FIXME: remove unwraps
pub fn parse_coins(s: &str) -> TieredMulti<SpendableNote> {
    let bytes = base64::decode(s).unwrap();
    bincode::deserialize(&bytes).unwrap()
}

// FIXME: copied this from fedimint, but had unwraps
// FIXME: remove unwraps
pub fn serialize_coins(c: &TieredMulti<SpendableNote>) -> String {
    let bytes = bincode::serialize(&c).unwrap();
    base64::encode(&bytes)
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

pub struct Client {
    pub user_client: Arc<UserClient>,
}

impl Client {
    pub async fn load() -> anyhow::Result<Self> {
        tracing::info!("instantiating wasmdb");
        let db: Database = WasmDb::new().await.into();
        tracing::info!("looking up config");
        let cfg_json = db
            .begin_transaction()
            .get_value(&ConfigKey)
            .expect("db error")
            .ok_or(anyhow::anyhow!("No client config in dexie"))?;
        let cfg = serde_json::from_str(&cfg_json)?;
        tracing::info!("deserializing");
        let user_client = UserClient::new(UserClientConfig(cfg), db, Default::default());
        tracing::info!("instantiating client");
        let client = Self {
            user_client: Arc::new(user_client),
        };
        Ok(client)
    }
    pub async fn new(connection_string: &str) -> anyhow::Result<Self> {
        let connect_cfg: WsFederationConnect = serde_json::from_str(connection_string)?;
        let api = WsFederationApi::new(connect_cfg.members);
        let cfg: ClientConfig = api.request("/config", (), CurrentConsensus::new(api.peers().threshold())).await?;
        let db: Database = WasmDb::new().await.into();
        let mut dbtx = db.begin_transaction();
        dbtx.insert_entry(&ConfigKey, &serde_json::to_string(&cfg)?)
            .expect("db error");
        dbtx.commit_tx().await.expect("DB Error");
        let user_client = UserClient::new(UserClientConfig(cfg), WasmDb::new().await.into(), Default::default());
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
        let mut rng = rand::rngs::OsRng;

        let amt = fedimint_api::Amount::from_sat(amount);
        tracing::info!("getting invoice");
        let confirmed_invoice = self
            .user_client
            .generate_invoice(amt, description, &mut rng, None)
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
    pub async fn load() -> Result<WasmClient> {
        let client = Client::load().await.map_err(anyhow_to_js)?;
        let wasm_client = Self {
            client: Arc::new(client),
        };
        Ok(wasm_client)
    }
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
    pub fn reissue(&self, coins: String) -> Promise {
        let client = self.client.clone();
        future_to_promise(async move {
            let coins = parse_coins(&coins);
            let rng = rand::rngs::OsRng;
            // TODO: handle result
            client.user_client.reissue(coins, rng).await;
            client.user_client.fetch_all_coins().await;
            Ok(JsValue::from("done")) // FIXME
        })
    }

    #[wasm_bindgen]
    pub fn spend(&self, amount: u32) -> Promise {
        let client = self.client.clone();
        future_to_promise(async move {
            let amount = Amount::from_sat(amount as u64);
            let rng = rand::rngs::OsRng;
            let coins = client
                .user_client
                .spend_ecash(amount, rng)
                .await
                .expect("spending failed");
            tracing::info!("coins {:?}", coins);
            client.user_client.fetch_all_coins().await;
            let serialized_coins = serialize_coins(&coins);
            Ok(JsValue::from(serialized_coins))
        })
    }

    // NOTE: we need to use `Promise` instead of `async` support due to lifetimes.
    #[wasm_bindgen]
    pub fn balance(&self) -> Promise {
        let client = self.client.clone();
        future_to_promise(async move {
            client.user_client.fetch_all_coins().await;
            Ok(JsValue::from(client.balance().await as u32))
        })
    }
}

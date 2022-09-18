use fedimint_core::config::ClientConfig;
use mint_client::api::{WsFederationApi, WsFederationConnect};

use js_sys::Promise;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::future_to_promise;

// use fedimint_api::db::mem_impl::MemDatabase;

fn anyhow_to_js(error: anyhow::Error) -> JsValue {
    JsValue::from(error.to_string())
}

async fn connect_inner(connection_string: &str) -> anyhow::Result<String> {
    // let database = MemDatabase::new();
    let connect_cfg: WsFederationConnect = serde_json::from_str(connection_string)?;
    let api = WsFederationApi::new(connect_cfg.max_evil, connect_cfg.members);
    let cfg: ClientConfig = api.request("/config", ()).await?;
    Ok(serde_json::to_string(&cfg)?)
}

#[wasm_bindgen]
pub async fn connect(connection_string: String) -> Promise {
    let connection_string_clone = connection_string.clone();
    future_to_promise(async move {
        Ok(JsValue::from(
            connect_inner(&connection_string_clone)
                .await
                .map_err(anyhow_to_js)?,
        ))
    })
}

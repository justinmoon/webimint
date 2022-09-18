use wasm_bindgen::prelude::*;

use fedimint_api::db::mem_impl::MemDatabase;

#[wasm_bindgen]
pub fn connect(left: usize, right: usize) -> usize {
    let database = MemDatabase::new();
    // pub async fn new(db: Box<dyn Database>, cfg_json: &str) -> anyhow::Result<Self> {
    // let connect_cfg: WsFederationConnect = serde_json::from_str(cfg_json)?;
    // let api = WsFederationApi::new(connect_cfg.max_evil, connect_cfg.members);
    // let cfg: ClientConfig = api.request("/config", ()).await?;
}

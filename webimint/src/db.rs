use fedimint_api::{
    db::{batch::DbBatch, mem_impl::MemDatabase, Database, DatabaseKeyPrefixConst, PrefixIter},
    encoding::{Decodable, Encodable},
};

use js_sys::{Promise, Uint8Array};
use rexie::Rexie;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use wasm_bindgen_futures::{future_to_promise, spawn_local};

#[derive(Debug, Clone, Encodable, Decodable)]
pub struct ConfigKey;
const CONFIG_KEY_PREFIX: u8 = 0x50;

impl DatabaseKeyPrefixConst for ConfigKey {
    const DB_PREFIX: u8 = CONFIG_KEY_PREFIX;
    type Key = Self;

    // FIXME: would be nice to store ClientConfig here, not just JSON serialization
    type Value = String;
}

#[wasm_bindgen]
pub struct WasmDb {
    mem_db: MemDatabase,
}

impl Database for WasmDb {
    fn raw_insert_entry(&self, key: &[u8], value: Vec<u8>) -> anyhow::Result<Option<Vec<u8>>> {
        let result = self.mem_db.raw_insert_entry(key, value);
        spawn_local(self.clone().save_inner());
        result
    }

    fn raw_get_value(&self, key: &[u8]) -> anyhow::Result<Option<Vec<u8>>> {
        self.mem_db.raw_get_value(key)
    }

    fn raw_remove_entry(&self, key: &[u8]) -> anyhow::Result<Option<Vec<u8>>> {
        let result = self.mem_db.raw_remove_entry(key);
        spawn_local(self.clone().save_inner());
        result
    }

    fn raw_find_by_prefix(&self, key_prefix: &[u8]) -> PrefixIter<'_> {
        self.mem_db.raw_find_by_prefix(key_prefix)
    }

    fn raw_apply_batch(&self, batch: DbBatch) -> anyhow::Result<()> {
        let result = self.mem_db.raw_apply_batch(batch);
        spawn_local(self.clone().save_inner());
        result
    }
}

const DB_NAME: &str = "webimint";
const STORE_NAME: &str = "main";

impl WasmDb {
    pub async fn new() -> Self {
        tracing::info!("top");
        let db = Rexie::builder(&DB_NAME)
            .add_object_store(rexie::ObjectStore::new(STORE_NAME))
            .build()
            .await
            .expect("db error");
        let t = db
            .transaction(&[STORE_NAME], rexie::TransactionMode::ReadOnly)
            .expect("db error");

        let store = t.store(STORE_NAME).expect("db error");

        tracing::info!("memdb");
        let db = MemDatabase::new();
        for (k, v) in store
            .get_all(None, None, None, None)
            .await
            .expect("db error")
        {
            // key is an `ArrayBuffer`
            let k = Uint8Array::new(&k).to_vec();
            let v = Uint8Array::try_from(v)
                .expect("value must be uint8array")
                .to_vec();

            db.raw_insert_entry(&k, v).expect("db error");
        }
        t.commit().await.expect("db error");
        tracing::info!("commig");
        Self { mem_db: db }
    }
}

#[wasm_bindgen]
impl WasmDb {
    // /// Load the database from indexed db.
    // #[wasm_bindgen]
    // pub async fn load() -> Self {
    //     let db = Rexie::builder(&DB_NAME)
    //         .add_object_store(rexie::ObjectStore::new(STORE_NAME))
    //         .build()
    //         .await
    //         .expect("db error");
    //     let t = db
    //         .transaction(&[STORE_NAME], rexie::TransactionMode::ReadOnly)
    //         .expect("db error");

    //     let store = t.store(STORE_NAME).expect("db error");

    //     let db = MemDatabase::new();
    //     for (k, v) in store
    //         .get_all(None, None, None, None)
    //         .await
    //         .expect("db error")
    //     {
    //         // key is an `ArrayBuffer`
    //         let k = Uint8Array::new(&k).to_vec();
    //         let v = Uint8Array::try_from(v)
    //             .expect("value must be uint8array")
    //             .to_vec();

    //         db.raw_insert_entry(&k, v).expect("db error");
    //     }
    //     t.commit().await.expect("db error");
    //     Self { mem_db: db }
    // }

    #[wasm_bindgen]
    pub fn clone(&self) -> Self {
        Self {
            mem_db: self.mem_db.clone(),
        }
    }

    async fn save_inner(self) {
        tracing::info!("saving db");
        let db = Rexie::builder(&DB_NAME)
            .add_object_store(rexie::ObjectStore::new(STORE_NAME))
            .build()
            .await
            .expect("db error");
        let t = db
            .transaction(&[STORE_NAME], rexie::TransactionMode::ReadWrite)
            .expect("db error");

        let store = t.store(STORE_NAME).expect("db error");
        store.clear().await.expect("db error");

        for kv in self.mem_db.raw_find_by_prefix(&[]) {
            let (k, v) = kv.expect("db error");
            // NOTE: we can't avoid copying here
            let js_key = Uint8Array::from(&k[..]);
            let js_val = Uint8Array::from(&v[..]);
            store
                // value-key order is correct here
                .add(js_val.as_ref(), Some(js_key.as_ref()))
                .await
                .expect("db error");
        }
        t.commit().await.expect("db error");
    }

    /// Save the database into indexed db.
    #[wasm_bindgen]
    pub fn save(&self) -> Promise {
        let this = self.clone();
        future_to_promise(async move {
            this.save_inner().await;
            Ok(JsValue::UNDEFINED)
        })
    }
}

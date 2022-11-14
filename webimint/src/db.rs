use fedimint_api::{
    db::{
        mem_impl::MemDatabase, DatabaseKeyPrefixConst, DatabaseTransaction, IDatabase,
        IDatabaseTransaction, PrefixIter,
    },
    encoding::{Decodable, Encodable},
};

use anyhow::Result;
use async_trait::async_trait;
use js_sys::Uint8Array;
use rexie::Rexie;
use wasm_bindgen::prelude::wasm_bindgen;

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

impl IDatabase for WasmDb {
    fn begin_transaction(&self) -> DatabaseTransaction {
        WasmDbTransaction {
            mem_tx: self.mem_db.begin_transaction(),
        }
        .into()
    }
}

pub struct WasmDbTransaction<'a> {
    mem_tx: DatabaseTransaction<'a>,
}

#[async_trait(?Send)]
impl<'a> IDatabaseTransaction<'a> for WasmDbTransaction<'a> {
    fn raw_insert_bytes(&mut self, key: &[u8], value: Vec<u8>) -> Result<Option<Vec<u8>>> {
        self.mem_tx.raw_insert_bytes(key, value)
    }

    fn raw_get_bytes(&self, key: &[u8]) -> Result<Option<Vec<u8>>> {
        self.mem_tx.raw_get_bytes(key)
    }

    fn raw_remove_entry(&mut self, key: &[u8]) -> Result<Option<Vec<u8>>> {
        self.mem_tx.raw_remove_entry(key)
    }

    fn raw_find_by_prefix(&self, key_prefix: &[u8]) -> PrefixIter<'_> {
        self.mem_tx.raw_find_by_prefix(key_prefix)
    }

    async fn commit_tx(self: Box<Self>) -> Result<()> {
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

        for kv in self.mem_tx.raw_find_by_prefix(&[]) {
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
        Ok(())
    }

    fn rollback_tx_to_savepoint(&mut self) {
        self.mem_tx.rollback_tx_to_savepoint()
    }

    fn set_tx_savepoint(&mut self) {
        self.mem_tx.set_tx_savepoint()
    }
}

const DB_NAME: &str = "webimint";
const STORE_NAME: &str = "main";

impl WasmDb {
    pub async fn new() -> WasmDb {
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
        let mut dbtx = db.begin_transaction();
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

            dbtx.raw_insert_bytes(&k, v).expect("db error");
        }

        dbtx.commit_tx().await.expect("DB Error");
        t.commit().await.expect("db error");
        tracing::info!("commit");
        WasmDb { mem_db: db }
    }
}

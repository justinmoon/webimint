/* tslint:disable */
/* eslint-disable */
/**
*/
export function start(): void;
/**
*/
export class WasmClient {
  free(): void;
/**
* @returns {Promise<WasmClient>}
*/
  static load(): Promise<WasmClient>;
/**
* @param {string} connection_string
* @returns {Promise<WasmClient>}
*/
  static new(connection_string: string): Promise<WasmClient>;
/**
* @returns {Promise<Promise<any>>}
*/
  invoice(): Promise<Promise<any>>;
/**
* @param {string} coins
* @returns {Promise<any>}
*/
  reissue(coins: string): Promise<any>;
/**
* @param {number} amount
* @returns {Promise<any>}
*/
  spend(amount: number): Promise<any>;
/**
* @returns {Promise<any>}
*/
  balance(): Promise<any>;
}
/**
*/
export class WasmDb {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly rustsecp256k1zkp_v0_7_0_musig_nonce_process: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly __wbg_wasmdb_free: (a: number) => void;
  readonly rustsecp256k1zkp_v0_7_0_musig_partial_sign: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly start: () => void;
  readonly __wbg_wasmclient_free: (a: number) => void;
  readonly wasmclient_load: () => number;
  readonly wasmclient_new: (a: number, b: number) => number;
  readonly wasmclient_invoice: (a: number) => number;
  readonly wasmclient_reissue: (a: number, b: number, c: number) => number;
  readonly wasmclient_spend: (a: number, b: number) => number;
  readonly wasmclient_balance: (a: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_nonce_agg: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_pubkey_agg: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_nonce_gen: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_partial_sig_serialize: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_partial_sig_parse: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_adapt: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_extract_adaptor: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_pubnonce_serialize: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_pubnonce_parse: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_aggnonce_serialize: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_aggnonce_parse: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_partial_sig_agg: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_nonce_parity: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_default_illegal_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1zkp_v0_7_0_default_error_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1zkp_v0_7_0_context_preallocated_size: (a: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_context_preallocated_clone_size: (a: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_context_preallocated_create: (a: number, b: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_context_preallocated_clone: (a: number, b: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_context_preallocated_destroy: (a: number) => void;
  readonly rustsecp256k1zkp_v0_7_0_context_set_illegal_callback: (a: number, b: number, c: number) => void;
  readonly rustsecp256k1zkp_v0_7_0_context_set_error_callback: (a: number, b: number, c: number) => void;
  readonly rustsecp256k1zkp_v0_7_0_ec_pubkey_parse: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_pubkey_serialize: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_pubkey_cmp: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_signature_parse_der: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_signature_parse_compact: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_signature_serialize_der: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_signature_serialize_compact: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_signature_normalize: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_verify: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_sign: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_seckey_verify: (a: number, b: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_pubkey_create: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_seckey_negate: (a: number, b: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_privkey_negate: (a: number, b: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_pubkey_negate: (a: number, b: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_seckey_tweak_add: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_privkey_tweak_add: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_pubkey_tweak_add: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_seckey_tweak_mul: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_privkey_tweak_mul: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_pubkey_tweak_mul: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_context_randomize: (a: number, b: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ec_pubkey_combine: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_tagged_sha256: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_xonly_pubkey_parse: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_xonly_pubkey_serialize: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_xonly_pubkey_cmp: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_xonly_pubkey_from_pubkey: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_xonly_pubkey_tweak_add: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_xonly_pubkey_tweak_add_check: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_xonly_sort: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_keypair_create: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_keypair_sec: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_keypair_pub: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_keypair_xonly_pub: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_keypair_xonly_tweak_add: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_schnorrsig_sign32: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_schnorrsig_sign: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_schnorrsig_sign_custom: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_schnorrsig_verify: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_adaptor_encrypt: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_adaptor_verify: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_adaptor_decrypt: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_ecdsa_adaptor_recover: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_pubkey_get: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_pubkey_ec_tweak_add: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_pubkey_xonly_tweak_add: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_musig_partial_sig_verify: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_generator_parse: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_generator_serialize: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_generator_generate: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_generator_generate_blinded: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_pedersen_commitment_parse: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_pedersen_commitment_serialize: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_pedersen_commit: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_pedersen_blind_sum: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_pedersen_verify_tally: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_pedersen_blind_generator_blind_sum: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_rangeproof_info: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_rangeproof_rewind: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_rangeproof_verify: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_rangeproof_sign: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_rangeproof_max_size: (a: number, b: number, c: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_whitelist_sign: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_whitelist_verify: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_whitelist_signature_n_keys: (a: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_whitelist_signature_parse: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_whitelist_signature_serialize: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_surjectionproof_parse: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_surjectionproof_serialize: (a: number, b: number, c: number, d: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_surjectionproof_n_total_inputs: (a: number, b: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_surjectionproof_n_used_inputs: (a: number, b: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_surjectionproof_serialized_size: (a: number, b: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_surjectionproof_initialize: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_surjectionproof_generate: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly rustsecp256k1zkp_v0_7_0_surjectionproof_verify: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rustsecp256k1_v0_6_1_context_create: (a: number) => number;
  readonly rustsecp256k1_v0_6_1_context_destroy: (a: number) => void;
  readonly rustsecp256k1_v0_6_1_default_illegal_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_6_1_default_error_callback_fn: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h46dab2b2b2ffbd8c: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1f8138e0a8a15f58: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h6cd01994f1a325d1: (a: number, b: number, c: number, d: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1c53c13966404876: (a: number, b: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__he03cbacc6d21c1fb: (a: number, b: number, c: number) => void;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h900022385eb6e976: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

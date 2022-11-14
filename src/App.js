import { useEffect, useState } from "react";

import init, { WasmClient } from "../webimint";

// TODO: hide db on "hidden visibility" (see manmeet's pr)
function App() {
  const [connectionString, setConnectionString] = useState(null);
  const [client, setClient] = useState(null);
  // const [invoice, setInvoice] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [sendInput, setSendInput] = useState('');
  const [ecash, setEcash] = useState(null);
  const [receiveInput, setReceiveInput] = useState('');

  // initialize wasm
  useEffect(() => {
      init().then(async () => {
        async function callback() {
          try {
            const client = await WasmClient.load();
            setClient(client);
            console.log("Successfully loaded client")
          } catch(e) {
            console.error("Failed to load client")
          }
          setLoaded(true)
        }
        // FIXME: without this timeout indexdb can't open
        setTimeout(callback, 1000)
      })
  }, [])

  useEffect(() => {
    async function handleConnectionString() {
      try {
        const client = await WasmClient.new(connectionString);
        setClient(client);
        console.log("client", client)
      } catch (e) {
        console.error("error connection", e)
        // TODO: display error
        return
      }
    }
    if (connectionString) {
      handleConnectionString();
    }
  }, [connectionString])

  useEffect(() => {
    if (client) {
      console.log("fetching balance")
      client.balance().then(balance => {
        setBalance(balance)
        console.log("set balance", balance)
      }).catch(e => {
        console.log("invoice balance", e)
      });
    }
  }, [client])

  async function handleSend() {
    const ecash = await client.spend(sendInput)
    let balance = await client.balance()
    setBalance(balance)
    setEcash(ecash);
  }

  async function handleReceive() {
    // TODO: error handling
    await client.reissue(receiveInput)
    let balance = await client.balance()
    setBalance(balance)
  }

  // FIXME: client.invoice() fails ...
  // const str = '{"members":[[0,"ws://188.166.55.8:5000"]],"max_evil":0}'
  // init().then(async () => {
  //     const client = await WasmClient.new(str);
  //     const invoice = await client.balance();
  //     console.log(invoice)
  // })

  if (!loaded) {
    return (
      <div>loading...</div>
    )
  }

  if (!client) {
    return (
      <div>
        <h3>Join a federation: </h3>
        <input onChange={e => setConnectionString(e.target.value)}></input>
      </div>
    )
  }

  return (
    <div>
      <h3>Balance</h3>
      <div>{balance}</div>
      <h3>Send</h3>
      <input onChange={e => setSendInput(e.target.value)} value={sendInput}></input>
      <button onClick={handleSend}>Send</button>
      {ecash && <pre>{ecash}</pre>}
      <h3>Receive</h3>
      <input onChange={e => setReceiveInput(e.target.value)} value={receiveInput}></input>
      <button onClick={handleReceive}>Receive</button>
    </div>
  )

}

export default App;

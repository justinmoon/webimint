import { useEffect, useState } from "react"

import init, { WasmClient } from "webimint";

function App() {
  const [connectionString, setConnectionString] = useState(null);
  const [client, setClient] = useState(null);
  // const [invoice, setInvoice] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // FIXME: can I call init() on pageload?
    init().then(async () => {
      try {
        const client = await WasmClient.new(connectionString);
        setClient(client);
        console.log("client", client)
      } catch(e) {
        console.error("error connection", e)
        // TODO: display error
        return
      }
    })
  }, [connectionString])

  useEffect(() => {
    if (client) {
      console.log("fetching invoice")
      client.balance().then(balance => {
        setBalance(balance)
      }).catch(e => {
        console.log("invoice error", e)
      });
    }
  }, [client])

  // FIXME: client.invoice() fails ...
  // const str = '{"members":[[0,"ws://188.166.55.8:5000"]],"max_evil":0}'
  // init().then(async () => {
  //     const client = await WasmClient.new(str);
  //     const invoice = await client.balance();
  //     console.log(invoice)
  // })

  if (!client) {
    return (
      <div>
        <input onChange={e => setConnectionString(e.target.value)}></input>
      </div>
    )
  }

  return (
    <div>{balance}</div>
  )

}

export default App;

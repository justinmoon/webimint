import { useEffect, useState } from "react"

import init, { connect } from "webimint";

function App() {
  const [config, setConfig] = useState(null);
  const [connectionString, setConnectionString] = useState(null);

  useEffect(() => {
    init().then(async () => {
      let result
      try {
        result = await connect(connectionString);
      } catch(e) {
        console.error("error connection", e)
        setConfig(null);
        return
      }
      const json = JSON.stringify(result, null, 2);
      setConfig(json);
    })
  }, [connectionString])

  return (
    <div>
      <input onChange={e => setConnectionString(e.target.value)}></input>
      <div>Connected? { config ? "true" : "false" }</div>
      {config && <pre>{config}</pre>}
    </div>
  );
}

export default App;

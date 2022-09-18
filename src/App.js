import { useEffect, useState } from "react"

import init, { add } from "webimint";

function App() {
  const [ans, setAns] = useState(0);
  useEffect(() => {
    init().then(() => {
      setAns(add(1, 1));
    })
  }, [])
  return (
    <div>
      <p>1 + 1 = {ans}</p>
    </div>
  );
}

export default App;

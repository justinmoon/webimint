import React, { useEffect, useState } from "react"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import init, { WasmClient } from "webimint";
import {Home} from './views/Home'
import {Wallet} from './views/Wallet'
import "./App.css"
import {SunIcon, MoonIcon, GearIcon, MenuIcon} from '@bitcoin-design/bitcoin-icons-react/filled'
import Button from './components/Button'


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
            // const client = await WasmClient.load();
            const connectionString = '{"members":[[0,"wss://fm-signet.sirion.io:443"]],"max_evil":0}'
            const client = await WasmClient.new(connectionString);
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

  // FIXME: this is duplicated with hook below ...
  function updateBalance() {
    if (client) {
      console.log("fetching invoice")
      client.balance().then(balance => {
        setBalance(balance)
      }).catch(e => {
        console.log("invoice error", e)
      });
    }
  }

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

  const [darkMode, setDarkMode] = useState(false)

  React.useEffect(()=>{
    determineDarkMode()
  }, [])

  React.useEffect(()=>{
    if(darkMode) {
      document.documentElement.classList.add('dark')
    }
    else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = ()=>{
    if(darkMode) {
      setDarkMode(false)
      localStorage.setItem('darkMode', 'false')
    }
    else {
      setDarkMode(true)
      localStorage.setItem('darkMode', 'true')
    }
  }

  const determineDarkMode = ()=>{
    // First check if user has previously manually defined a preference
    if(localStorage.darkMode) {
      console.log('darkMode exists in local storage')
      if(localStorage.darkMode === 'true') setDarkMode(true)
      else if(localStorage.darkMode === 'false') setDarkMode(false)
    }
    // Otherwise, use the user's OS preference
    else {
      let darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(darkMode)
    }
  }
  
  const toggleMenu = ()=>{
    console.log('Toggle settings menu')
  }
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </BrowserRouter>
      
      <div className="fixed top-0 left-0 lg:top-8 lg:right-0 lg:left-auto space-y-4">
        <Button
          text={darkMode ? 'Light Mode' : 'Dark Mode'}
          iconOnly
          size={'small'}
          icon={darkMode ? <SunIcon /> : <MoonIcon />}
          onClick={toggleDarkMode}
          style={'outline'}
        />
        
        <Button
          text={'Menu'}
          iconOnly
          size={'small'}
          icon={<MenuIcon />}
          onClick={toggleMenu}
          style={'outline'}
        />
      </div>
    </div>
    
  )
  
  
  // if (!loaded) {
  //   return (
  //     <div>loading...</div>
  //   )
  // }
  //
  // if (!client) {
  //   return (
  //     <div>
  //       <h3>Join a federation: </h3>
  //       <input onChange={e => setConnectionString(e.target.value)}></input>
  //     </div>
  //   )
  // }
  //
  // return (
  //   <div>
  //     <h3>Balance</h3>
  //     <div>{balance}</div>
  //     <h3>Send</h3>
  //     <input onChange={e => setSendInput(e.target.value)} value={sendInput}></input>
  //     <button onClick={handleSend}>Send</button>
  //     {ecash && <pre>{ecash}</pre>}
  //     <h3>Receive</h3>
  //     <input onChange={e => setReceiveInput(e.target.value)} value={receiveInput}></input>
  //     <button onClick={handleReceive}>Receive</button>
  //   </div>
  // )

}

export default App;

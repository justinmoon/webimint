import React from "react";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import {SendIcon, ReceiveIcon} from '@bitcoin-design/bitcoin-icons-react/outline';

export const Wallet = () => {
  let navigate = useNavigate();

  return(
    <div className="text-2xl font-sans p-8 h-full w-full flex justify-center items-center">
      <div className="border-2 border-black dark:border-white p-8 space-y-12 max-w-4xl mx-auto bg-white dark:bg-black drop-shadow-hard dark:drop-shadow-hard-light text-center">
        <p className="font-mono text-center">
          <span className="text-8xl">0</span> <span className="text-5xl">fmsats</span>
        </p>
        
        <p>
          You have no eCash. Get started by using the <a href="https://faucet.sirion.io/">faucet</a> or asking for
          help in <a href="https://chat.fedimint.org/">Discord</a>.
        </p>
        
        <div className="flex flex-row space-x-4 justify-center">
          <Button text="Send" style="outline" icon={<SendIcon />} />
          <Button text="Receive" style="outline" icon={<ReceiveIcon />} />
        </div>
      </div>
    </div>
  )
}
import React from "react";
import { useNavigate } from "react-router-dom";
import FedimintLogo from '../components/FedimintLogo';
import WebimintLogo from '../components/WebimintLogo';
import Button from '../components/Button';
import {ArrowRightIcon} from '@bitcoin-design/bitcoin-icons-react/filled';

export const Home = () => {
  let navigate = useNavigate();

  return(
    <div className="text-2xl font-sans p-8 h-full w-full flex justify-center items-center">
      <div className="border-2 border-black dark:border-white p-8 space-y-4 max-w-4xl mx-auto bg-white dark:bg-black drop-shadow-hard dark:drop-shadow-hard-light">
        <WebimintLogo className="w-full max-w-[360px] mx-auto" />
        
        <FedimintLogo className="mx-auto w-1/2 max-w-[178px]" />
        
        <p className="">
          Webimint is a browser based front-end that allows you to explore the cool features of
          the <a href="https://fedimint.org/">Fedimint protocol</a>.
        </p>

        <p>
          By default, this is hooked up to the <a href="https://faucet.sirion.io/">public signet Fedimint instance</a>,
          though you can also connect to another instance if you prefer.
        </p>
        
        <Button text="Begin" style="filled" icon={<ArrowRightIcon />} centered={true} />
      </div>
      
    </div>
  )
}
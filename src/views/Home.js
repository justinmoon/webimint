import React from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  let navigate = useNavigate();

  return(
    <div className="text-2xl font-sans p-8 h-full w-full flex justify-center items-center">
      <div className="border-2 border-black p-8 space-y-4 max-w-4xl mx-auto bg-white drop-shadow-hard">
        <img src="./WebimintLogo.svg" alt="Webimint Logo" className="w-full max-w-[360px] mx-auto" />

        <img src="./FedimintLogo.svg" alt="Fedimint Logo" className="mx-auto w-1/2 max-w-[178px]" />
        
        <p className="">
          Webimint is a browser based front-end that allows you to explore the cool features of
          the <a href="https://fedimint.org/">Fedimint protocol</a>.
        </p>

        <p>
          By default, this is hooked up to the <a href="https://faucet.sirion.io/">public signet Fedimint instance</a>,
          though you can also connect to another instance if you prefer.
        </p>
      </div>
      
    </div>
  )
}
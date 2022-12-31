import React, { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios'
import CryptoSummary from './components/cryptoSummary/cryptoSummary.component';
import { Crypto } from './types/Types';


function App() {

  const [cryptos,setCryptos] = useState<Crypto[] | null>(null);
  const [selected,setSelected] = useState<Crypto | null>(null);
  
  useEffect(()=>{
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    
    axios.get(url).then((response)=>{
      setCryptos(response.data);
      console.log(response.data)

    })
  },[]);


  return (
    <div className="App">
      <select
      onChange={(e)=>{
        console.log(e.target.value)
        const c = cryptos?.find((crypto)=> crypto.name == e.target.value)
        c? 
          setSelected(c)
        :
          setSelected(null)
      }}

      defaultValue='default'
      >
        <option value='default'>select item</option>
        {
          cryptos?

            cryptos.map((crypto)=>{
              return <option key = {crypto.id} value = {crypto.name}> {crypto.name}</option>
            })

          :
            null
        }
        
      </select>
      {
        selected?
          <CryptoSummary crypto ={selected} />
        :
          null
      }
      </div>
  );
}

export default App;

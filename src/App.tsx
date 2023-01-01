import React, { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios'
import CryptoSummary from './components/cryptoSummary/cryptoSummary.component';
import { Crypto } from './types/Types';
import type { ChartData,ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);




function App() {

  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto | null>(null);
  const [data, setData] = useState<ChartData<'line'>>();
  const [range,setRange] = useState<number>(7);
  const [options,setOptions] = useState<ChartOptions>()

  useEffect(() => {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  
    axios.get(url).then((response) => {
      setCryptos(response.data);
    })
  }, []);

  useEffect(() => {
    if (selected === null)
      return

    const url = `https://api.coingecko.com/api/v3/coins/${selected?.id}/market_chart?vs_currency=inr&days=${range}&interval=${(range===1)?'hours':'daily'}`

    axios.get(url)
      .then((response) => {
       
        const init: ChartData<'line'> = {
          labels: response.data.prices.map((price: number[]) => 
          { 
            return moment.unix(price[0]/1000).format((range===1)?'HH-MM':'DD-MM') 
          }),
          datasets: [
            {
              data: response.data.prices.map((price: number[]): number => { return price[1] })
            },
          ],
        };
       
        setData(init)

        const initOptions:ChartOptions = {
          responsive: true,
          plugins: {
            legend: {
              display:false
            },
            title: {
              display: true,
              text: (range===1) ? `prices for last 24 hours` : `prices for last ${range} days`,
            },
          },
        };

        setOptions(initOptions)
        
        
      })
  }, [selected,range])


  return (
    <div className="App">
    
      <select
        onChange={(e) => {
          console.log(e.target.value)
          const c = cryptos?.find((crypto) => crypto.name === e.target.value)
          c ?
            setSelected(c)
            :
            setSelected(null)
        }}

        defaultValue='default'
      >
        <option value='default'>select item</option>
        {
          cryptos ?

            cryptos.map((crypto) => {
              return <option key={crypto.id} value={crypto.name}> {crypto.name}</option>
            })

            :
            null
        }
      </select>
      <select
      defaultValue='default'

      onChange={(e)=>{
        setRange(parseInt(e.target.value))
      }}
      >
        <option value='default'>select range</option>
        <option value={30}>30</option>
        <option value={7}>7</option>
        <option value={1}>1</option>
      </select>
      {
        selected ?
          <CryptoSummary crypto={selected} />
          :
          null
      }
      {
        data ?
          <div style={{width:"600px"}}>

              <Line options={options} data={data} />

          </div>
          :
          null
      }

    </div>


  );
}

export default App;

import React, { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios'
import CryptoSummary from './components/cryptoSummary/cryptoSummary.component';
import { Crypto } from './types/Types';
import type { ChartData } from 'chart.js';
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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};



function App() {

  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto | null>(null);
  const [data, setData] = useState<ChartData<'line'>>();



  useEffect(() => {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  
    axios.get(url).then((response) => {
      setCryptos(response.data);
    })
  }, []);

  useEffect(() => {
    if (selected === null)
      return

    const url = `https://api.coingecko.com/api/v3/coins/${selected?.id}/market_chart?vs_currency=inr&days=30&interval=daily`

    axios.get(url)
      .then((response) => {
       
        const init: ChartData<'line'> = {
          labels: response.data.prices.map((price: number[]) => 
          { 
            return moment.unix(price[0]/1000).format('DD-MM') 
          }),
          datasets: [
            {
              data: response.data.prices.map((price: number[]): number => { return price[1] })
            },
          ],
        };
       
        setData(init)
      })
  }, [selected])


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
      {
        selected ?
          <CryptoSummary crypto={selected} />
          :
          null
      }
      {
        data ?
          <div style={{width:"50%"}}>

              <Line options={options} data={data} />

          </div>
          :
          null
      }

    </div>


  );
}

export default App;

import {useEffect, useMemo, useState} from 'react';
import {getCoinChart, getCoinDetail, getCoinList} from '../api';
import Chart from "react-apexcharts";
import {Loader} from './loader';
import CircularProgress from '@mui/material/CircularProgress';

const options = {
  chart: {
    id: "basic-bar"
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001]
  }
}
const series = [
  {
    name: "series-1",
    data: [30, 40, 45, 50, 49, 60, 70, 91, 100, 102]
  }
]

const defaultChart = {
  options,
  series,
}
  export const CoinRow = ({coin}) => {

  const [open, setOpen] = useState(false)
  const [chartSettings, setChartSettings] = useState(null)
  const [loading, setLoading] = useState(false)

  const onClickShowChart = async () => {
    console.log({selectedCoin: coin})
    setLoading(true)
    const coinChart = await getCoinChart(coin.id)
    console.log({coinChart})

    const newChartSettings = {
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: coinChart.prices.map(price => price[0])
        }
      },
      series: [{
        name: "series-1",
        data: coinChart.prices.map(price => price[1].toFixed(2))
      }]
    }

    console.log({defaultChart})
    console.log({newChartSettings})
    setChartSettings(newChartSettings)
    setLoading(false)
  }

  return (
    <div key={coin.id}
         className={'coin-row'}
         onMouseEnter={() => setOpen(true)}
         onMouseLeave={() => setOpen(false)}
    >
      <div className="coin-row-header">
        <img src={coin.image.small}/>
        <div>{coin.name}</div>
        <div>{coin.symbol}</div>
      </div>

      {open && <div style={{fontSize: 16}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          {coin.market_data.circulating_supply} Pezzi
          <div style={{alignItems: 'center'}}>
            <button onClick={onClickShowChart}>Show chart</button>
            {loading && <CircularProgress/>}
          </div>
          <Loader/>
        </div>


        {chartSettings && <Chart options={chartSettings.options} series={chartSettings.series} type="line" height={350} />}

      </div>}
    </div>
  )
}

import History from '../components/history'
import OrderBook from '../components/orderBook'
import Chart from '../components/chart'
import BuyAndSell from '../components/buyAndSell' 
import Contract from '../components/contract' 
import Footer from '../components/footer' 

const main = ()=>{
    return(
        <div id="mainContainer">
            <div className="mainCon1">
                <Chart />
            </div>
            <ul className="mainCon2">
                <li><History /></li>
                <li><OrderBook /></li>
                <li><BuyAndSell /></li>
                <li className="mainCon3"><Contract /></li>
            </ul>
            <div className="lastCon"><Footer /></div>
        </div>
    )
}

export default main
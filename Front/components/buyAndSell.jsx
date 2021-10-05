import { useEffect, useState } from 'react'
import Link from 'next/link'

const buycolor = { "background": "rgba(225,35,67)", "color": "#fff" }
const sellcolor = { "background": "rgba(23,99,182)", "color": "#fff" }

const Buy = () => {
    const [buyPrice,setBuyPrice] = useState(0)
    const [volume,setVolume] = useState(0)
    const [login,setlogin] = useState(false)
    const [data, setData] = useState([]);
    useEffect(async () => {
        const response = await fetch("http://localhost:3003/api/coin/buy_order",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userid: "Test",
                price: buyPrice,
                qty: volume,
                ordertype: 0,
                rest: buyPrice,
                coin_id: 1
            }),
        })
        .then((response)=>console.log(response))
        .catch(error => {
            // this.setData({errorMessage: error.toString()});
            console.error('there was an error!',error)
        })
        // const data = await response.json()
        // setData(data);
      }, []);


    const priceUp = () =>{
        setBuyPrice((price)=>price+1)
    }

    const priceDown =  ()=>{
        setBuyPrice((price)=>price>0 ? price-1 : 0)
    }

    const volumeUp = () =>{
        setVolume((volume)=>volume+1)
    }

    const volumeDown =  ()=>{
        setVolume((volume)=>volume>0 ? volume-1 : 0)
    }


    return (
        <div>
            <ul className="flex">
                <li>보유</li>
                <li>0 KRW</li>
            </ul>
            <ul className="flex">
                <li>매수 가능</li>
                <li>0 KRW</li>
            </ul>
            <div className="priceBox">
                <h6>가격(KRW)</h6>
                <ul className="coinPrice">
                    <li>{buyPrice}</li>
                    <li>
                        <ul className="plusMinus">
                            <li><button onClick={priceDown}>-</button></li>
                            <li><button onClick={priceUp}>+</button></li>
                        </ul>
                    </li>         
                </ul>   
            </div>
            <div className="priceBox">
                <h6>수량(GRT)</h6>
                <ul className="coinPrice">
                    <li>{volume}</li>
                    <li>
                        <ul className="plusMinus">
                            <li><button onClick={volumeDown}>-</button></li>
                            <li><button onClick={volumeUp}>+</button></li>
                        </ul>
                    </li>         
                </ul>   
            </div>
            <ul className="flex">
                <li>주문 금액</li>
                <li>0 KRW</li>
            </ul>
            <ul className="flex">
                <li>매수 수량</li>
                <li>0 GRT</li>
            </ul>
            <Link href={login == false ? `/login`:`/login`}>
                <button className="buy Btn2">
                    {login == false ? "로그인":"매수"}
                </button>
            </Link>
        </div>
    )
}

const Sell = () =>{
    const [sellPrice,setSellPrice] = useState(0)
    const [volume,setVolume] = useState(0)
    const [login,setlogin] = useState(false)

    const onUp = () =>{
        setSellPrice((price)=>price+1)
    }

    const onDown =  ()=>{
        setSellPrice((price)=>price>0 ? price-1 : 0)
    }

    const volumeUp = () =>{
        setVolume((volume)=>volume+1)
    }

    const volumeDown =  ()=>{
        setVolume((volume)=>volume>0 ? volume-1 : 0)
    }


    return (
        <div>
            <ul className="flex">
                <li>보유</li>
                <li>0 GRT</li>
            </ul>
            <ul className="flex">
                <li>매도 가능</li>
                <li>0 GRT</li>
            </ul>
            <div className="priceBox">
                <h6>가격(KRW)</h6>
                <ul className="coinPrice">
                    <li>{sellPrice}</li>
                    <li>
                        <ul className="plusMinus">
                            <li><button onClick={onDown}>-</button></li>
                            <li><button onClick={onUp}>+</button></li>
                        </ul>
                    </li>         
                </ul>   
            </div>
            <div className="priceBox">
                <h6>수량(GRT)</h6>
                <ul className="coinPrice">
                    <li>{volume}</li>
                    <li>
                        <ul className="plusMinus">
                            <li><button onClick={volumeDown}>-</button></li>
                            <li><button onClick={volumeUp}>+</button></li>
                        </ul>
                    </li>         
                </ul>   
            </div>
            <ul className="flex">
                <li>주문 금액</li>
                <li>0 KRW</li>
            </ul>
            <ul className="flex">
                <li>매도 금액</li>
                <li>0 KRW</li>
            </ul>
            <button className="sell Btn2">{login == false ? "로그인":"매도"}</button>
        </div>
    )
}

const buyAndSell = ()=>{
    const [bsBtn, setbsBtn] = useState('buy')

    const buy = () =>{
        setbsBtn('buy')
    }

    const sell = () =>{
        setbsBtn('sell')
    }

    return(
        <div id="buyAndSellBox">
            <div>
                <button style={(bsBtn === 'buy')? buycolor : {}} onClick={buy} className="buyBtn">매수</button>
                <button style={(bsBtn === 'sell')? sellcolor : {}} onClick={sell} className="sellBtn">매도</button>
            </div>
            {
                bsBtn === 'buy'
                    ? <Buy />
                    : <Sell />
            }
        </div>
    )
}

export default buyAndSell
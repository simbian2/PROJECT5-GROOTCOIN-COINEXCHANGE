const WebSocket = require('ws');
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });
const { pool } = require('./pool')
const { graph_data } = require('./graph_data')

async function wsinit() {

  wss.on('connection', async function connection(ws) {

    let connection;
    let content = []

    connection = await pool.getConnection(async conn => conn);
    let assets = await connection.query(`select * from assets`)

    let assetsArr = []
    let assets_result = 0

    for (let i = 0; i < assets[0].length; i++) {
      assets_result = assets_result + assets[0][i].input
      // assets_result = assets_result - assets[0][i].output
    }
    for (let i = 0; i < assets[0].length; i++) {
      // assets_result = assets_result + assets[0][i].input
      // assets_result = assets_result - assets[0][i].output
    }
    console.log(assets_result)
    assetsArr.push(assets_result)

    let buy_total = await connection.query(`select sum(rest) as buy from coin_orderbook where rest != "0" AND ordertype = "0"`)
    let sell_total = await connection.query(`select sum(rest) as sell from coin_orderbook where rest != "0" AND ordertype = "1"`)

    let buy_order = await connection.query(`select price,rest from coin_orderbook where rest != "0" AND ordertype = "0"  ORDER BY price DESC`)
    let sell_odrder = await connection.query(`select price,rest from coin_orderbook where rest != "0" AND ordertype = "1"  ORDER BY price DESC`)
    let last_transaction = await connection.query(`select payment from transaction ORDER BY regdate DESC`)

    let buy = [buy_total[0][0].buy]
    let sell = [sell_total[0][0].sell]
    let last = [last_transaction[0][0].payment]

    let order = []
    for (let i = 0; i < sell_odrder[0].length; i++) {
      order.push(sell_odrder[0][i])
    }
    for (let i = 0; i < buy_order[0].length; i++) {
      order.push(buy_order[0][i])
    }

    let orderbook = { "buy": buy, "sell": sell, "order": order, "last": last }
    console.log(orderbook);


    let transaction = await connection.query(`select * from transaction ORDER BY regdate ASC`)

    let regdate = []
    let payment = []
    let a_amount = []
    for (let i = 0; i < transaction[0].length; i++) {
      regdate.push(`${new Date(transaction[0][i].regdate * 1000).getFullYear()}-${new Date(transaction[0][i].regdate * 1000).getMonth() + 1}-${new Date(transaction[0][i].regdate * 1000).getDate()} ${("0" + new Date(transaction[0][i].regdate * 1000).getHours()).slice(-2)}:${("0" + new Date(transaction[0][i].regdate * 1000).getMinutes()).slice(-2)}`)
      payment.push(transaction[0][i].payment)
      a_amount.push(transaction[0][i].a_amount)
    }
    //그래프에 필요한값
    let one_day = 24 * (60 * 60)
    let one_month = (24 * (60 * 60)) * 30
    let now = Math.floor(+ new Date() / 1000);
    let ago_day = now - one_month
    // 트랜젝션 기록이 있는지 체크 

    let graph = []
    for (let i = 0; i < graph_data.length; i++) {
      graph.push(graph_data[i])
    }
    let ckeck_data = await connection.query(`select * from transaction where regdate >= "${ago_day}" ORDER BY regdate ASC`)
    if (ckeck_data[0][0] !== undefined) {
      // 하루전까지 데이터가 있는지 체크  없으면 마지막 기점으로 24시간 거래 체크 
      for (i = 0; i < ckeck_data.length; i++) {
        let plus_day = now - ((one_month - (one_day * (i + 1))))
        let start = now - (one_month - one_day * i)
        let halfhour_data = await connection.query(`select payment,regdate from transaction where regdate >= "${start}" AND regdate <="${plus_day}" ORDER BY regdate ASC`)
        let halfhour_price = await connection.query(`select max(payment) as max, min(payment) as min from transaction where regdate >= "${start}" AND regdate <="${plus_day}" ORDER BY regdate ASC`)
        //30분 마다 고가 저가 시가 종가
        if (halfhour_data !== undefined && halfhour_price !== undefined) {
          graph.shift()
          graph.push({
            half_max: halfhour_price[0][i].max,
            half_min: halfhour_price[0][i].min,
            half_start: halfhour_data[0][i].payment,
            half_last: halfhour_data[0][i].payment,
            time: halfhour_data[0][i].regdate
          })
        }
      }
      console.log(graph[0])
    }
    // ws.send( JSON.stringify({
    //     "graph":graph,
    // "price":price, "time":time, "qty":qty, "regdate":regdate, "payment":payment, "a_amount":a_amount, "assets":assetsArr
    // }))
    wss.clients.forEach((e) => {
      e.send(JSON.stringify({ "orderbook": orderbook, "regdate": regdate, "payment": payment, "a_amount": a_amount, "assets": assetsArr, "graph": graph }))
    })
  });
}

async function join() {

  let connection;
  let content = []

  connection = await pool.getConnection(async conn => conn);

  let assets = await connection.query(`select * from assets`)

  let assetsArr = []
  let assets_result = 0

  for (let i = 0; i < assets[0].length; i++) {
    assets_result = assets_result + assets[0][i].input
    // assets_result = assets_result - assets[0][i].output
  }
  for (let i = 0; i < assets[0].length; i++) {
    // assets_result = assets_result + assets[0][i].input
    // assets_result = assets_result - assets[0][i].output
  }
  console.log(assets_result)
  assetsArr.push(assets_result)

  let coin_orderbook = await connection.query(`select * from coin_orderbook`)

  let buy_total = await connection.query(`select sum(rest) as buy from coin_orderbook where rest != "0" AND ordertype = "0"`)
  let sell_total = await connection.query(`select sum(rest) as sell from coin_orderbook where rest != "0" AND ordertype = "1"`)

  let buy_order = await connection.query(`select price,rest from coin_orderbook where rest != "0" AND ordertype = "0"  ORDER BY price DESC`)
  let sell_odrder = await connection.query(`select price,rest from coin_orderbook where rest != "0" AND ordertype = "1"  ORDER BY price DESC`)
  let last_transaction = await connection.query(`select payment from transaction ORDER BY regdate DESC`)

  let buy = [buy_total[0][0].buy]
  let sell = [sell_total[0][0].sell]
  let last = [last_transaction[0][0].payment]

  let order = []
  for (let i = 0; i < sell_odrder[0].length; i++) {
    order.push(sell_odrder[0][i])
  }
  for (let i = 0; i < buy_order[0].length; i++) {
    order.push(buy_order[0][i])
  }

  let orderbook = { "buy": buy, "sell": sell, "order": order,"last": last }
  console.log(orderbook);


  let transaction = await connection.query(`select * from transaction ORDER BY regdate ASC`)

  let regdate = []
  let payment = []
  let a_amount = []
  for (let i = 0; i < transaction[0].length; i++) {
    regdate.push(`${new Date(transaction[0][i].regdate * 1000).getFullYear()}-${new Date(transaction[0][i].regdate * 1000).getMonth() + 1}-${new Date(transaction[0][i].regdate * 1000).getDate()} ${("0" + new Date(transaction[0][i].regdate * 1000).getHours()).slice(-2)}:${("0" + new Date(transaction[0][i].regdate * 1000).getMinutes()).slice(-2)}`)
    payment.push(transaction[0][i].payment)
    a_amount.push(transaction[0][i].a_amount)
  }

  wss.clients.forEach((e) => {
    e.send(JSON.stringify({ "orderbook":orderbook, "regdate": regdate, "payment": payment, "a_amount": a_amount, "assets": assetsArr }))
  })

}

function socketSend(data, func) {
  const message = func ? { func, data } : { data }
  wss.send(message);
}

function transaction(data) {
  if (data.length) {

  } else if (data.length) {

  } else if (data.length) {

  }
  wss.send()
}


module.exports = {
  wsinit, socketSend, join, transaction
}
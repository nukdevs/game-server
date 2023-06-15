const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { clearInterval } = require("timers");
const io = new Server(server);
const mongoose = require("mongoose");

const axios = require('axios');

const connectMongo = async () => mongoose.connect("mongodb+srv://nevertry:genever77@cluster0.bgts0.mongodb.net/?retryWrites=true&w=majority");



//const connectMongo = async () => mongoose.connect(process.env.MONGO_URI);


////process.env.MONGO_URI





connectMongo();


// 유저 리스트
//const userList = {};

let userList = new Map();


const HistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  winnerHorse: {
    type: String,
    required: true,
  },
  placements: {
    type: Array,
    line: {
      type: Number,
      required: true,
    },
    horse: {
      type: String,
      required: true,
    },
  },
});


const BetHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  userToken: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },  
  selectedSide: {
    type: String,
    required: true,
  },
  closePrice: {
    type: Number,
    required: true,
  }, 
  winnerHorse: {
    type: String,
    required: true,
  },
  placements: {
    type: Array,
    line: {
      type: Number,
      required: true,
    },
    horse: {
      type: String,
      required: true,
    },
  },
  prizeAmount: {
    type: Number,
    required: true,
  },
  resultAmount: {
    type: Number,
    required: true,
  },
  prizeFee: {
    type: Number,
    required: false,
  },
  depositBefore: {
    type: Number,
    required: true,
  },
  depositAfter: {
    type: Number,
    required: true,
  },

});


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  pass1: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  pass2: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  deposit: {
    type: Number,
    required: false,
    default: 0,
  },
  img: {
    type: String,
    required: true,
    default: "default some image url",
  },
  admin: {
    type: Boolean,
    required: false,
    default: false,
  },
  newPassToken: {
    type: String,
    required: false,
    default: "",
  },
  userToken: {
    type: String,
    required: true,
  },
  maticBalance: {
    type: Number,
    required: false,
    default: 0,
  },
  walletAddress: {
    type: String,
    required: false,
    default: "",
  },
  status: {
    type: Boolean,
    default: true,
  },
});

const GameSchema = new mongoose.Schema({
  userToken: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  selectedSide: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },

});



const DepositSchema = new mongoose.Schema({

  hash: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  date: {
    type: Date,
    default: Date.now,
  },

  timeStamp: {
    type: String,
    required: true,
  },

  from: {
    type: String,
    required: true,
  },

  to: {
    type: String,
    required: true,
  },

  value: {
    type: String,
    required: true,
  },

});



const depositRequestSchema = new mongoose.Schema({
  userToken: {
    type: String,
    required: true,
  },
  email1: {
    type: String,
    unique: false,
    required: true,
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Waiting",
  },
  walletFrom: {
    type: String,
    required: true,
  },
  gonderildi: {
    type: Boolean,
    default: false,
  },
  txHash: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: true,
    default: "Matic",
  },
});



const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const History = mongoose.models.History || mongoose.model("History", HistorySchema);
const BetHistory = mongoose.models.BetHistory || mongoose.model("BetHistory", BetHistorySchema);

const Deposit = mongoose.models.Deposit || mongoose.model("Deposit", DepositSchema);

const DepositRequest = mongoose.models.DepositRequest || mongoose.model("DepositRequest", depositRequestSchema);





// https://api.bscscan.com
// https://api-testnet.bscscan.com

// Api-Key Token   PYSG4QII57SQD87QESCZXJZ1NC84PBDUVZ

// cra testnet token
/*
https://testnet.bscscan.com/address/0x481b39ca8d9ea8443c32bf2c252232c18d3ddf50
*/

/*
https://api-testnet.bscscan.com/api
   ?module=logs
   &action=getLogs
   &fromBlock=13323069
   &toBlock=13387473
   &address=0x481b39ca8d9ea8443c32bf2c252232c18d3ddf50
   &topic0=0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925
   &topic0_1_opr=and
   &topic1=0x00000000000000000000000017c261b0b4f01fea9d4f39c1c48875f2299a47a8
   &apikey=PYSG4QII57SQD87QESCZXJZ1NC84PBDUVZ
*/


/*
https://api-testnet.bscscan.com/api
   ?module=account
   &action=tokentx
   &contractaddress=0x481b39ca8d9ea8443c32bf2c252232c18d3ddf50
   &address=0x769e3327659c5fc62986b82bc67c0dCF05bF2Db4
   &page=1
   &offset=5
   &sort=desc
   &apikey=PYSG4QII57SQD87QESCZXJZ1NC84PBDUVZ
*/

/////var user;

var currentPrice;


//var horse = [0, 0, 0, 0, 0];
var horse = [0, 0];

var time = 10;

///////var raceTime = 30 * 1000; // 30 seconds
///var raceTime = 90 * 1000; // 90 seconds

var raceTime = 60 * 1000; // 60 seconds



//var oranlar = [1.25, 1.5, 1.75, 2.0, 2.5];

//var oranlar = [2.0, 2.0, 2.0, 2.0, 2.0];
var oranlar = [2.0, 2.0];


var status = false;


/*
Game.deleteMany({}, (err, data) => {
  if (err) {
  } else {
  }
});
*/

/*

restart();
*/


app.get("/", (req, res) => {
  
  console.log("app.get");

  res.sendFile(__dirname + "/index.html");

});





io.on("connection", (socket) => {

  console.log("a user connected socket.id", socket.id);

  ////////io.to(socket.id).emit('status', false);



  /*
  // 유저 ID 설정
  const userId = socket.id;

  // 유저 추가
  userList[userId] = { socket: socket };

  userList.set(userId, { socket: socket });
  */

  // 연결 종료
  socket.on('disconnect', () => {

    ////console.log('연결 종료: ', userId);

    // 유저 삭제
    ////delete userList[userId];

    // 유저 목록 전송
    ////io.emit('userList', Object.keys(userList));

  });



  socket.on("user", (userId) => {

    console.log("user userId", userId);

    ////socket.join(userId);

    if (userId) {

      ///const status = userList[userId].status;

      var status = false;
      
      /*
      if (userList[userId]?.status) {
        status = userList[userId].status;
      }
      */

      if (userList.get(userId)?.status) {
        status = userList.get(userId).status;
      }


      var baseprice = 0;
      /*
      if (userList[userId]?.baseprice) {
        baseprice = userList[userId].baseprice;
      }
      */
      if (userList.get(userId)?.baseprice) {
        baseprice = userList.get(userId).baseprice;
      }



      var socketId = "";
      
      /*
      if (userList[userId]?.socketId) {
        socketId = userList[userId].socketId;
      }*/
      if (userList.get(userId)?.socketId) {
        socketId = userList.get(userId).socketId;
      }

      console.log("socketId", socketId);


        

      io.to(socket.id).emit('status', status);
      io.to(socket.id).emit('baseprice', baseprice);




      if (socket.id === socketId) {

        /*
        var status = false;

        if (userList[userId]?.status) {
          status = userList[userId].status;
        }

        io.to(socket.id).emit('status', status);

        userList[userId] = {
          socketId: socket.id,
          status: status,
        };
        */

      } else {
          
        ///// io.to(socketId).emit('logout', true);

        /*
        userList[userId] = {
          socketId: socket.id,
          status: status,
          baseprice: baseprice,
        };
        */
        userList.set(userId, {
          socketId: socket.id,
          status: status,
          baseprice: baseprice,
        });
          

      }


    } else {

      /////io.to(socket.id).emit('status', false);

    }


  });


  /*
  socket.on("baseprice", (baseprice) => {

    console.log("baseprice", baseprice);

    ////socket.join(userId);

  });
  */


  /*

  socket.on("start", (userId) => {

    console.log("start userId", userId);


    ////socket.join(userId);


    if (userId) {
      game(userId, socket.id);
      ///restart();
    } else {
        
    }

  });

  */

  /* 소켓통신으로 게임을 시작하면 안되고, 디비에서 Game 데이터를 가져와서 게임을 시작해야 한다. */






  setTimeout(() => {
    
    /*
    io.emit("time", time);
    io.emit("status", status);
    io.emit("horse1Orana", oranlar[0]);
    io.emit("horse2Orana", oranlar[1]);
    */


    /*
    io.emit("horse3Orana", oranlar[2]);
    io.emit("horse4Orana", oranlar[3]);
    io.emit("horse5Orana", oranlar[4]);
    */

    /*
    io.sockets.in(user).emit("time", time);
    io.sockets.in(user).emit("status", status);
    io.sockets.in(user).emit("horse1Orana", oranlar[0]);
    io.sockets.in(user).emit("horse2Orana", oranlar[1]);
    */





    /*
    (async () => {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');

      console.log("binance response data", response.data);

      io.emit("price", response.data);

    })()
    */


  }, 1000);


});



///setTimeout(() => {

setInterval(myMethod, 1000);

function myMethod( ) {


  ///console.log("check Game currentPrice========", currentPrice);


  if (currentPrice) {
 

    (async () => {

      const games = await Game.find({}).sort({ _id: 1 });


      for (var i = 0; i < games.length; i++) {

        var game = games[i];

        ////console.log("game", game);

        var userId = game.username;

        var exist = false;

        //////forEach(userList, function (value, key) {
        //for (var [key, value] of userList) {

        for (let [key, value] of userList) {

          //console.log("key", key);

          if (key === userId) {
            ///console.log("key === userId");


            if (value.status === false) {

              console.log("new game user===", userId);

              /*
              const socketId = userList[userId].socketId;
              */
              const socketId = userList.get(userId)?.socketId;

              const basePrice = currentPrice?.price;

              
    
              userList.set(userId, {
                socketId: socketId,
                status: true,
                baseprice: basePrice,
                raceTime: (60 * 1000) // 60 seconds
              });


              /*
              const updateGame = Game.findOneAndUpdate(
                { username: userId },
                {
                  basePrice: basePrice,
                },
                { new: true }
              )
              if (updateGame) {

                console.log("updateGame", updateGame);
              }
              */


    
              if (socketId && socketId !== "") {
                io.to(socketId).emit('status', true);
              }
    
              createHorseRace(userId);

            }



            exist = true;
          }

        };



        // 유저가 없으면
        if (exist === false) {

          console.log("new game user===", userId);

          /*
          const socketId = userList[userId].socketId;
          */
          const socketId = userList.get(userId)?.socketId;

          const basePrice = currentPrice?.price;



          userList.set(userId, {
            socketId: socketId,
            status: true,
            baseprice: basePrice,
            raceTime: (60 * 1000) // 60 seconds
          });


          /*
          const updateGame = Game.findOneAndUpdate(
            { username: userId },
            {
              basePrice: basePrice,
            },
            { new: true }
          )
          if (updateGame) {

            console.log("updateGame", updateGame);
          }
          */


          if (socketId && socketId !== "") {
            io.to(socketId).emit('status', true);
          }

          createHorseRace(userId);

        }

        
      }

    })();


  }

}

////}, 1000);










const newDeposit = async (
  hash,
  timeStamp,
  from,
  to,
  value
) => {

  ////console.log("hash", hash);
  
  const checkDeposit = await Deposit.find({ hash: hash });


  if (hash.length > 0) {
    return { success: false, message: "Deposit already exists" };
  }

  const deposit = new Deposit({
    hash: hash,
    timeStamp: timeStamp,
    from: from,
    to: to,
    value: value
  });

  return await deposit.save();
};



var binance = setInterval(() => {

  (async () => {

    /*
    const url =
      "https://api-testnet.bscscan.com/api?module=account"
      + "&action=tokentx"
      + "&contractaddress=0x481b39ca8d9ea8443c32bf2c252232c18d3ddf50"
      ////+ "&address=0x769e3327659c5fc62986b82bc67c0dCF05bF2Db4"
      + "&page=1&offset=5&sort=desc"
      + "&apikey=PYSG4QII57SQD87QESCZXJZ1NC84PBDUVZ";
    */


      const url =
      "https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=0x0fc0B3f6F5C769C138088266aC21760ab33f76CA&page=1&offset=10&sort=desc&apikey=PYSG4QII57SQD87QESCZXJZ1NC84PBDUVZ";


    ///const url = "https://api-testnet.bscscan.com/api?module=account&action=tokentx&contractaddress=0x481b39ca8d9ea8443c32bf2c252232c18d3ddf50&address=0x769e3327659c5fc62986b82bc67c0dCF05bF2Db4&page=1&offset=5&sort=desc&apikey=PYSG4QII57SQD87QESCZXJZ1NC84PBDUVZ";

    
    const response = await axios.get(url);

    response.data.result.forEach((item) => {



      
      (async () => {

        /*
        const deposit = await newDeposit(item.hash, item.timeStamp, item.from, item.to, item.value);

        if (!deposit) {
        } else {
          console.log("deposit", deposit);
        }
        */

        /////console.log("hash", item.hash);

        const checkDeposit = await Deposit.find({ hash: item.hash });

        if (checkDeposit.length === 0) {

          
          console.log("to", item.to);
          console.log("value", item.value);

          
          await Deposit.create({
            hash: item.hash,
            timeStamp: item.timeStamp,
            from: item.from,
            to: item.to,
            value: item.value,
          });


          const amount = item.value / 100000;

          
          /* sdafsadfsdafsdafs
          sdafsdafsadfdsa

  userToken: {
    type: String,
    required: true,
  },
  email1: {
    type: String,
    unique: false,
    required: true,
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Waiting",
  },
  walletFrom: {
    type: String,
    required: true,
  },
  gonderildi: {
    type: Boolean,
    default: false,
  },
  txHash: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: true,
    default: "Matic",
  },

  */

 


          const user = await User.findOne({ walletAddress: item.to });
          if (user) {

            console.log("amount", amount);
            console.log("deposit", user.deposit);

            user.deposit = user.deposit + amount;

            user.save();
            
          } else {
            
          }


          if (user) {
            await DepositRequest.create({
              userToken: user.userToken,
              email1: user.email,
              depositAmount: amount,
              status: "Accepted",
              walletFrom: item.from,
              txHash: item.hash,
              type: "Coin",
            });
          }


          

          /*
          User.findOne(
            { walletAddress: item.to },
            (err, user) => {
              if (err) {
              } else {
                user.deposit = user.deposit + amount;
                user.save();
              }
            }
          );
          */




        }


      })();
      



      /*
      setTimeout(
      
        async () => {
  
          await Deposit.create({
            hash: hash,
            timeStamp: item.timeStamp,
            from: item.from,
            to: item.to,
            value: item.value,
          });
  
        }, betTime

      );
      */


    });


  })();


}, 20000);




var binance = setInterval(() => {


  /*
  const axios = require('axios');

  const apiKey = 'e265a3cd-fd5c-4f1a-8bb6-cf5ef4c36eaa'; // CoinMarketCap에서 발급받은 API 키를 입력하세요
  const apiUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=USDT&CMC_PRO_API_KEY=${apiKey}`;

  axios.get(apiUrl)
    .then(response => {
      const price = response.data.data.ETH.quote.USDT.price;
      console.log(`현재 ETH/USDT 가격은 ${price} USDT 입니다.`);
    })
    .catch(error => {
      console.log('가격을 가져오는 중 오류가 발생하였습니다.');
    });

*/



  
  
  (async () => {

      const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
  
      currentPrice = response.data;

      ///console.log("binance response data", currentPrice);
  
      io.emit("price", currentPrice);

  })();

  

/*
      const response = axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
  
      let price = response.data;

      console.log("binance response data", price);
  
      io.emit("price", price);
*/


  /*

  let json = `{
    "symbol" : "ETHUSDT",
    "price" : "1700.00000000"
  }`; // json data


  let price2 = JSON.parse(json);
  console.log("binance response data price2", price2);

  io.emit("price", price2);
  */


}, 1000);





  /*
  {"result":"true","data":[{"symbol":"cra_usdt","ticker":{"high":"0.057","vol":"279469.9899","low":"0.039","change":"38.7","turnover":"13324.4762","latest":"0.057"},"timestamp":1680681158336}],"error_code":0,"ts":1680681159067}
  */


var lbank = setInterval(() => {

  (async () => {

      const response = await axios.get('https://api.lbkex.com/v2/ticker/24hr.do?symbol=cra_usdt');

      if (response.data.result === "true") {

    
        io.emit("cra_usdt", response.data.data);

      }

  })();


}, 1000);





/*
io.on("disconnect", onDisconnect);

function onDisconnect(socket) {

  return () => {
    console.log(`${socket.id} disconnected`);
  };

}
*/

/*
io.on("start", (data) => {
  console.log("start============ data", data);
});
*/

//io.on("")


function rasteleSembol(uzunluk, semboller) {
  var maske = "";
  if (semboller.indexOf("a") > -1) maske += "abcdefghijklmnopqrstuvwxyz";
  if (semboller.indexOf("A") > -1) maske += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (semboller.indexOf("0") > -1) maske += "0123456789";
  if (semboller.indexOf("#") > -1)
    maske += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
  var sonuc = "";

  for (var i = uzunluk; i > 0; --i) {
    sonuc += maske[Math.floor(Math.random() * maske.length)];
  }
  return sonuc;
}

/*
function bot() {

  const time = 60;
  const maxBet = 200;
  const minBet = 10;
  const maxBetMiktarı = 100;
  const minBetMiktarı = 10;
  //const horse = ["Chief", "Magic", "Scout", "Rebel", "Lucky"];
  const horse = ["Long", "Short"]

  const betMiktari = Math.floor(Math.random() * (maxBet - minBet + 1) + minBet);

  for (let i = 0; i < betMiktari; i++) {

    const betTime = Math.floor(Math.random() * (time * 1000 - 1000 + 1) + 1000);

    const selectedSide = horse[Math.floor(Math.random() * horse.length)];

    console.log("bot selectedSide", selectedSide);


    setTimeout(

      async () => {

        await Game.create({
          userToken: "bot",
          username: rasteleSembol(8, "aA"),
          img: "enter some image url",
          betAmount: Math.floor(
            Math.random() * (maxBetMiktarı - minBetMiktarı + 1) + minBetMiktarı
          ),
          selectedSide: selectedSide,
        });

      }, betTime

    );


  }

}
*/


function randomHorse() {
  
  const random1 = Math.floor(Math.random() * 100) + 1;
  const random2 = Math.floor(Math.random() * 100) + 1;

  /*
  const random3 = Math.floor(Math.random() * 100) + 1;
  const random4 = Math.floor(Math.random() * 100) + 1;
  const random5 = Math.floor(Math.random() * 100) + 1;
  */

  //total = random1 + random2 + random3 + random4 + random5;

  total = random1 + random2;


  const yuzde1 = parseFloat((random1 * 100).toFixed(2));
  const yuzde2 = parseFloat((random2 * 100).toFixed(2));

  /*
  const yuzde3 = parseFloat((random3 * 100).toFixed(2));
  const yuzde4 = parseFloat((random4 * 100).toFixed(2));
  const yuzde5 = parseFloat((random5 * 100).toFixed(2));
  */

  ///const oranToplam = yuzde1 + yuzde2 + yuzde3 + yuzde4 + yuzde5;

  const oranToplam = yuzde1 + yuzde2;


  const oran1 = (100 - yuzde1) / 25;
  const oran2 = (100 - yuzde2) / 25;

  /*
  const oran3 = (100 - yuzde3) / 25;
  const oran4 = (100 - yuzde4) / 25;
  const oran5 = (100 - yuzde5) / 25;
  */

  horse = [
    {
      id: 1,
      yuzde: yuzde1,
      oran: oran1,
    },
    {
      id: 2,
      yuzde: yuzde2,
      oran: oran2,
    },

    /*
    {
      id: 3,
      yuzde: yuzde3,
      oran: oran3,
    },
    {
      id: 4,
      yuzde: yuzde4,
      oran: oran4,
    },
    {
      id: 5,
      yuzde: yuzde5,
      oran: oran5,
    },
    */

  ];

}





function restart() {

  console.log("restart====================");






  /*
  bot();
  */
  
  var value = 1;
  oranlar = oranlar.sort(() => Math.random() - 0.5);


  
  io.emit("horse1Orana", oranlar[0]);
  io.emit("horse2Orana", oranlar[1]);

  /*
  io.emit("horse3Orana", oranlar[2]);
  io.emit("horse4Orana", oranlar[3]);
  io.emit("horse5Orana", oranlar[4]);
  */

  /*
  io.sockets.in(user).emit("horse1Orana", oranlar[0]);

  io.sockets.in(user).emit("horse2Orana", oranlar[1]);

  io.sockets.in(user).emit("horse3Orana", oranlar[2]);
  io.sockets.in(user).emit("horse4Orana", oranlar[3]);
  io.sockets.in(user).emit("horse5Orana", oranlar[4]);
  */


  ///console.log("restart oranlar", oranlar);

  status = false;

  io.emit("status", false);

  /////io.sockets.in(user).emit("status", false);



  ////console.log("restart emit status", status);

  
  
  //////////  time = 60; // waiting seconds




  //100-0 random number
  randomHorse();

  io.emit("random", horse);

  //////io.sockets.in(user).emit("random", horse);


  console.log("restart emit random", horse);

  /*
  var timer = setInterval(() => {

    console.log("timer time", time);

    time = time - 1;
    io.emit("time", time);

    if (time == 0) {
      clearInterval(timer);
      if (value == 1) {
        value = 0;
        game();
      }
    }
  }, 1000);
  */

  /*
  if (value == 1) {
    value = 0;
    game();
  }
  */

}



function wait() {

  setTimeout(() => {

    restart();

  }, 5000);

}


//horseStatus = [0, 0, 0, 0, 0];
horseStatus = [0, 0];



/*
new Map() – 맵을 만듭니다.
map.set(key, value) – key를 이용해 value를 저장합니다.
map.get(key) – key에 해당하는 값을 반환합니다. key가 존재하지 않으면 undefined를 반환합니다.
map.has(key) – key가 존재하면 true, 존재하지 않으면 false를 반환합니다.
map.delete(key) – key에 해당하는 값을 삭제합니다.
map.clear() – 맵 안의 모든 요소를 제거합니다.
map.size – 요소의 개수를 반환합니다.
let map = new Map();

map.set("1", "1 String"); // 문자형 키
map.set(1, "1 Number"); // 숫자형 키
map.set(true, "1 Boolean"); // 불린형 키
*/

var horseRaceMap = new Map();
 
  
function createHorseRace(userId){

  //const socketId = userList[userId].socketId;

  /*
  var raceTime = userList[userId].raceTime;
  */
  var raceTime = userList.get(userId).raceTime;



  //console.log("createHorseRace userId", userId);
  //console.log("createHorseRace raceTime", raceTime);

  var timer = 0;
  var runner1 = 0;
  var runner2 = 0;


  /////var baseprice = currentPrice;

  /////////userList[userId].baseprice = baseprice;

  /*
  io.to(userList[userId].socketId).emit('baseprice', userList[userId].baseprice);
  */

  if (userList.get(userId).socketId && userList.get(userId).socketId !== "") {
    io.to(userList.get(userId).socketId).emit('baseprice', userList.get(userId).baseprice);
  }


 


  var horseStatus = [0, 0];

  var horceRace = setInterval(() => {
    
    raceTime -= 100;


    if (raceTime == 0) {

      console.log("close Game====================", userId);

      clearInterval(horseRaceMap.get(userId));

      // 유저 삭제
      ///////////delete userList[userId];


      const closePrice = currentPrice.price;

      var winner = {};


      const winList = [
        {
          name: "Long",
          runner: runner1,
        },
        {
          name: "Short",
          runner: runner2,
        },
      ];





      maxR = Math.max(runner1, runner2);

      if (maxR == runner1) {
        //winner = { name: "Chief", id: 1 };
        
        winner = { name: "Long", id: 1 };
        
        //io.emit("winner", "Chief");
        
        //io.emit("winner", "Long");


        /*
        io.to(userList[userId].socketId).emit('winner', 'Long');
        */

        if (userList.get(userId).socketId && userList.get(userId).socketId !== "") {
          io.to(userList.get(userId).socketId).emit('winner', 'Long');
        }


        /////io.sockets.in(user).emit("winner", "Chief");

      } else if (maxR == runner2) {
        //winner = { name: "Magic", id: 2 };
        
        winner = { name: "Short", id: 2 };

        //io.emit("winner", "Magic");

        //io.emit("winner", "Short");

        /*
        io.to(userList[userId].socketId).emit('winner', 'Short');
        */

        if (userList.get(userId).socketId && userList.get(userId).socketId !== "") {
          io.to(userList.get(userId).socketId).emit('winner', 'Short');
        }


        //////io.sockets.in(user).emit("winner", "Magic");

      }


      
      /////Game.find({ selectedSide: winner.name }, (err, data) => {


      (async () => {
        await History.create(
          {
            winnerHorse: winner.name,
            placements: [
              {
                horse: winList[0].name,
                line: 1,
              },
              {
                horse: winList[1].name,
                line: 2,
              },

            ],
          },
          (err, data) => {
            if (err) {
            } else {
              console.log("History created");
            }
          }

        );

      })();




      
      
      
      (async () => {

        const game = await Game.findOne({ username: userId });

       

        if (game) {

          //console.log("===============betAmount", game.betAmount);
          //console.log("===============selectedSide", game.selectedSide);
          //console.log("===============winner.name", winner.name);

          var userToken = "";
          var username = "";
          var img = "";

          var prizeAmount = 0;
          var prizeFee = 0;
          var depositBefore = 0;
          var depositAfter = 0;
          const selectedSide = game.selectedSide;


          // 비기면 지는거다.
          if (runner1 === runner2) {

            prizeAmount = 0;
            resultAmount = -game.betAmount;
            
          } else {

            if (selectedSide == winner.name) {
              prizeAmount = game.betAmount*2;
              resultAmount = game.betAmount;


              io.emit("prize", {
                username: userId,
                amount: game.betAmount,
              });

            } else {
              prizeAmount = 0;
              resultAmount = -game.betAmount;
            }

          }

          /*
          io.to(userList[userId].socketId).emit('prizeAmount', prizeAmount);
          */
          if (userList.get(userId).socketId && userList.get(userId).socketId !== "") {
            io.to(userList.get(userId).socketId).emit('prizeAmount', prizeAmount);
          }

          
          
          const user = await User.findOne({ username: userId });
          if (user) {

            userToken = user.userToken;
            username = user.username;
            img = user.img;
  
            console.log("user.deposit", user.deposit);

            depositBefore = user.deposit + game.betAmount;

            depositPlus = prizeAmount/2 + parseInt(prizeAmount/2 * 0.95);

            
            if (prizeAmount > 0) {
                prizeFee = game.betAmount*2 - depositPlus;
            }

            depositAfter = user.deposit  + depositPlus;
  
            user.deposit = depositAfter;

            user.save();

                
          } else {
            
          } 
              
          



          await BetHistory.create(
            {
              userToken: userToken,
              username: username,
              img: img,
              betAmount: game.betAmount,
              //basePrice: userList[userId].baseprice,
              basePrice: userList.get(userId).baseprice,
              selectedSide: game.selectedSide,
              closePrice: closePrice,
              winnerHorse: winner.name,
              placements: [
                {
                  horse: winList[0].name,
                  line: 1,
                },
                {
                  horse: winList[1].name,
                  line: 2,
                },
  
              ],
              prizeAmount: prizeAmount,
              resultAmount: resultAmount,
              prizeFee: prizeFee,
              depositBefore: depositBefore,
              depositAfter: depositAfter,
            },
            (err, data) => {
              if (err) {
                console.log("err", err);
              } else {
                console.log("BetHistory created");
              }
            }
  
          );



          
        } else {

          console.log("game is null");
          
        }

      })();








      /*
      Game.deleteMany({}, (err, data) => {
        if (err) {
        } else {
        }
      });
      */
      
      
      





      ////wait();
      setTimeout(() => {

        (async () => {

          await Game.deleteOne({ username: userId });
  
        })();


        /////restart();

        /*
        userList[userId].status = false;
        */
        userList.get(userId).status = false;


        /*
        io.to(userList[userId].socketId).emit('status', false);
        */

        if (userList.get(userId).socketId && userList.get(userId).socketId !== "") {
          io.to(userList.get(userId).socketId).emit('status', false);
        }


        console.log("status", false);

      }, 5000);




    } else {




      timer = ((60000 - raceTime) / 1000) * 1; // 60 seconds

      /*
      io.to(userList[userId].socketId).emit('timer', timer);
      */

      if (userList.get(userId).socketId && userList.get(userId).socketId !== "") {
        io.to(userList.get(userId).socketId).emit('timer', timer);
      }

      /*
      io.to(userList[userId].socketId).emit('baseprice', userList[userId].baseprice);
      */

      if (userList.get(userId).socketId && userList.get(userId).socketId !== "") {
        io.to(userList.get(userId).socketId).emit('baseprice', userList.get(userId).baseprice);
      }



      /////console.log(userList[userId].socketId + " timer", timer);

      

      if (timer > 20 && timer < 21) {
        randomHorse();
      } else if (timer > 40 && timer < 41) {
        randomHorse();
      } else if (timer > 60 && timer < 61) {
        randomHorse();
      } else if (timer > 80 && timer < 81) {
        randomHorse();
      } else if (timer > 90 && timer < 91) {
        randomHorse();
      } else if (timer > 100 && timer < 101) {
        randomHorse();
      } else if (timer > 110 && timer < 111) {
        randomHorse();
      } else if (timer > 120 && timer < 121) {
        randomHorse();
      } else if (timer > 130 && timer < 131) {
        randomHorse();
      } else if (timer > 140 && timer < 141) {
        randomHorse();
      } else if (timer > 150 && timer < 151) {
        randomHorse();
      }


      //const run1 = Math.random() * horse[0].yuzde + 1;
      //const run2 = Math.random() * horse[1].yuzde + 1;

      var run1 = 0;
      var run2 = 0;

      /*
      if (currentPrice.price - userList[userId].baseprice > 0) {
        run1 = currentPrice.price - userList[userId].baseprice;
      } else if (currentPrice.price - userList[userId].baseprice < 0){
        run2 = userList[userId].baseprice - currentPrice.price;
      }  
      */

      if (currentPrice.price - userList.get(userId).baseprice > 0) {
        run1 = currentPrice.price - userList.get(userId).baseprice;
      } else if (currentPrice.price - userList.get(userId).baseprice < 0){
        run2 = userList.get(userId).baseprice - currentPrice.price;
      }


      /*
      console.log("currentPrice.price", currentPrice.price);
      console.log("userList[userId].baseprice", userList[userId].baseprice);
      console.log("run1", run1);
      console.log("run2", run2);
      */

      horseStatus[0] += run1;
      horseStatus[1] += run2;

      const max = Math.max(
        horseStatus[0],
        horseStatus[1],
        /*
        horseStatus[2],
        horseStatus[3],
        horseStatus[4]
        */
      );

      const yuzdelikValue = timer / max;

      /*
      const runner1 = horseStatus[0] * yuzdelikValue;
      const runner2 = horseStatus[1] * yuzdelikValue;
      */
      runner1 = horseStatus[0] * yuzdelikValue / 60 * 100;
      runner2 = horseStatus[1] * yuzdelikValue / 60 * 100;


      //io.emit("horse1", runner1);
      //io.emit("horse2", runner2);

      runner1 = (timer + run1*20) / (60+20) * 100;
      runner2 = (timer + run2*20) / (60+20) * 100;


      //console.log("runner1", runner1);
      //console.log("runner2", runner2);
      

        /*
      io.to(userList[userId].socketId ).emit('horse1', runner1);
      io.to(userList[userId].socketId ).emit('horse2', runner2);
        */

      if (userList.get(userId).socketId && userList.get(userId).socketId !== "") {
        io.to(userList.get(userId).socketId ).emit('horse1', runner1);
        io.to(userList.get(userId).socketId ).emit('horse2', runner2);
      }



        /*
      Game.deleteMany({}, (err, data) => {
        if (err) {
        } else {
        }
      });
      */

       
    }

  }, 100);


  horseRaceMap.set(userId, horceRace);

}


/*
for (var i = 0; i < 2; i++) {
  createHorseRace(i);
}
*/







function game(userId, socketId) {
  
  console.log("game Race Started!! userId", userId);
  console.log("game Race Started!! socketId", socketId);


  // 유저 추가
  /*
  userList[userId] = {
    socketId: socketId,
    status: true,
    baseprice: currentPrice.price,
    raceTime: (60 * 1000) // 60 seconds
  };
  */

  userList.set(userId, {
    socketId: socketId,
    status: true,
    baseprice: currentPrice.price,
    raceTime: (60 * 1000) // 60 seconds
  });


  console.log("game userList", userList);



  

  ///// io.emit("status", true);

  ////io.sockets.in(userId).emit("status", userList[userId].status);

  //////io.sockets.in(socketId).emit("status", userList[userId].status);

  
  ///////io.to(userList[userId].socketId).emit('status', userList[userId].status);

  ////io.sockets.in(userList[userId].socketId).send('status', userList[userId].status);

  ///io.sockets.to(userList[userId].socketId).emit('status', userList[userId].status);

  
  
  ///io.sockets.to("kYPtrjjyvpNTvHimAAAh").emit('status', userList[userId].status);

  /*
  var socketById = io.sockets.sockets.get(userList[userId].socketId);
  console.log("socketById", socketById);
  socketById.emit("status", userList[userId].status);
  */

  if (socketId && socketId !== "") {
    io.to(socketId).emit('status', true);
  }

  console.log(socketId + " status", true)

  createHorseRace(userId);


  return;
  

  ////raceTime = 30 * 1000; // 30 seconds
  ////raceTime = 90 * 1000; // 90 seconds

  raceTime = 60 * 1000; // 60 seconds



  ////horseStatus = [0, 0, 0, 0, 0];

  horseStatus = [0, 0];

  /*
  console.log("raceTime", raceTime);
  console.log("horseStatus[0]", horseStatus[0]);
  console.log("horseStatus[1]", horseStatus[1]);
  */




  var race = setInterval(() => {

   


    ///////raceTime -= 100;

    ////////raceTime -= 300;

    //////raceTime -= 100;

    raceTime -= 100;



    if (raceTime == 0) {
      clearInterval(race);


      // 유저 삭제
      ///delete userList[userId];
      delete userList.get(userId);


      wait();

      ////restart();

    } else {

      ///////const timer = ((30000 - raceTime) / 300) * 1;

      /////////const timer = ((90000 - raceTime) / 300) * 1; // 30 seconds

      ////const timer = ((90000 - raceTime) / 900) * 1; // 90 seconds

      const timer = ((60000 - raceTime) / 1000) * 1; // 60 seconds

      io.emit("timer", timer);


      if (timer > 20 && timer < 21) {
        randomHorse();
      } else if (timer > 40 && timer < 41) {
        randomHorse();
      } else if (timer > 60 && timer < 61) {
        randomHorse();
      } else if (timer > 80 && timer < 81) {
        randomHorse();
      } else if (timer > 90 && timer < 91) {
        randomHorse();
      } else if (timer > 100 && timer < 101) {
        randomHorse();
      } else if (timer > 110 && timer < 111) {
        randomHorse();
      } else if (timer > 120 && timer < 121) {
        randomHorse();
      } else if (timer > 130 && timer < 131) {
        randomHorse();
      } else if (timer > 140 && timer < 141) {
        randomHorse();
      } else if (timer > 150 && timer < 151) {
        randomHorse();
      }


      //console.log("horse[0].yuzde", horse[0].yuzde);
      //console.log("horse[1].yuzde", horse[1].yuzde);



      const run1 = Math.random() * horse[0].yuzde + 1;
      const run2 = Math.random() * horse[1].yuzde + 1;

      /*
      const run3 = Math.random() * horse[2].yuzde + 1;
      const run4 = Math.random() * horse[3].yuzde + 1;
      const run5 = Math.random() * horse[4].yuzde + 1;
      */

      horseStatus[0] += run1;
      horseStatus[1] += run2;

      /*
      horseStatus[2] += run3;
      horseStatus[3] += run4;
      horseStatus[4] += run5;
      */

      const max = Math.max(
        horseStatus[0],
        horseStatus[1],
        /*
        horseStatus[2],
        horseStatus[3],
        horseStatus[4]
        */
      );

      const yuzdelikValue = timer / max;

      /*
      const runner1 = horseStatus[0] * yuzdelikValue;
      const runner2 = horseStatus[1] * yuzdelikValue;
      */
      const runner1 = horseStatus[0] * yuzdelikValue / 60 * 100;
      const runner2 = horseStatus[1] * yuzdelikValue / 60 * 100;

      /*
      const runner3 = horseStatus[2] * yuzdelikValue;
      const runner4 = horseStatus[3] * yuzdelikValue;
      const runner5 = horseStatus[4] * yuzdelikValue;
      */




      //const maxR = Math.max(runner1, runner2, runner3, runner4, runner5);
      const maxR = Math.max(runner1, runner2);

        /*
      console.log("horseStatus[0]", horseStatus[0]);
      console.log("runner1", runner1);

      console.log("horseStatus[1]", horseStatus[1]);
      console.log("runner2", runner2);
      
      console.log("maxR", maxR);
        */


      const winList = [
        {
          //name: "Chief",
          name: "Long",
          runner: runner1,
        },
        {
          //name: "Magic",
          name: "Short",
          runner: runner2,
        },

        /*
        {
          name: "Scout",
          runner: runner3,
        },
        {
          name: "Rebel",
          runner: runner4,
        },
        {
          name: "Lucky",
          runner: runner5,
        },
        */
      ].sort((a, b) => b.runner - a.runner);

      var winner = "";
      var value = 0;
      
      if (maxR > 99.8 && value == 0) {

      /////if (maxR == 59.9 && value == 0) { // 60 seconds

        value = 1;

        if (maxR == runner1) {
          //winner = { name: "Chief", id: 1 };
          winner = { name: "Long", id: 1 };
          
          //io.emit("winner", "Chief");
          
          io.emit("winner", "Long");

          /////io.sockets.in(user).emit("winner", "Chief");

        } else if (maxR == runner2) {
          //winner = { name: "Magic", id: 2 };
          winner = { name: "Short", id: 2 };

          //io.emit("winner", "Magic");

          io.emit("winner", "Short");

          //////io.sockets.in(user).emit("winner", "Magic");

      /*
        } else if (maxR == runner3) {
          winner = { name: "Scout", id: 3 };
          
          io.emit("winner", "Scout");
          /////io.sockets.in(user).emit("winner", "Scout");

        } else if (maxR == runner4) {
          winner = { name: "Rebel", id: 4 };

          io.emit("winner", "Rebel");
          /////io.sockets.in(user).emit("winner", "Rebel")

        } else if (maxR == runner5) {
          winner = { name: "Lucky", id: 5 };

          io.emit("winner", "Lucky");
          /////io.sockets.in(user).emit("winner", "Lucky");
      */


        }



        var value = 1;
        if (value == 1) {

          console.log("oranlar", oranlar[winner.id - 1]);

          Game.find({ selectedSide: winner.name }, (err, data) => {

            History.create(
              {
                winnerHorse: winner.name,
                placements: [
                  {
                    horse: winList[0].name,
                    line: 1,
                  },
                  {
                    horse: winList[1].name,
                    line: 2,
                  },

                  /*
                  {
                    horse: winList[2].name,
                    line: 3,
                  },
                  {
                    horse: winList[3].name,
                    line: 4,
                  },
                  {
                    horse: winList[4].name,
                    line: 5,
                  },
                  */

                ],
              },
              (err, data) => {
                if (err) {
                } else {
                  console.log("History created");
                }
              }

            );

            if (err) {
            } else {
              if (data.length > 0) {
                for (let i = 0; i < data.length + 1; i++) {
                  if (data.length == i) {
                    Game.deleteMany({}, (err, data) => {
                      if (err) {
                      } else {
                      }
                    });
                  } else {
                    if (data[i].userToken == "bot") {
                    } else {

                      User.findOne(
                        { userToken: data[i].userToken },
                        (err, user) => {
                          if (err) {
                          } else {
                            user.deposit =
                              user.deposit +
                              data[i].betAmount * oranlar[winner.id - 1];
                            user.save();
                          }
                        }
                      );

                    }
                  }
                }
              } else {
                Game.deleteMany({}, (err, data) => {
                  if (err) {
                  } else {
                  }
                });
              }
            }

          });


          value = 2;
        }

      }

      
      io.emit("horse1", runner1);
      io.emit("horse2", runner2);

      /*
      io.emit("horse3", runner3);
      io.emit("horse4", runner4);
      io.emit("horse5", runner5);
      */
      
      /*
      io.sockets.in(user).emit("horse1", runner1);
      io.sockets.in(user).emit("horse2", runner2);
      io.sockets.in(user).emit("horse3", runner3);
      io.sockets.in(user).emit("horse4", runner4);
      io.sockets.in(user).emit("horse5", runner5);
      */


    }


  }, 100);


}







server.listen(process.env.PORT || 3005, () => {

  console.log("listening on *:"+process.env.PORT);

});

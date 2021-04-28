const cron = require("node-cron")
const admin = require("firebase-admin");
const dotenv = require('dotenv');

//const fetch = require("node-fetch");
const axios = require('axios');

const serviceAccount = require("./firebaseconfig.json");

dotenv.config()


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kong-3418f-default-rtdb.firebaseio.com"
});
const db = admin.firestore(); 

const nanosToBitClout = (nanos) => {
    return nanos / 1000000000;
};

cron.schedule("*/5 * * * *", async function() {
    const usersDb = db.collection('users');
    const userData = await usersDb.get();

    let userList = [];

    userData.docs.forEach((item) => {
        let newItem = {
          docId: item.id,
          ...item.data(),
        };
        userList = [newItem, ...userList];
    });

    userList.map((user)=>{
        let config = {
            method: 'post',
            url: `http://${process.env.NEXT_PUBLIC_URL}/api/profile/${user.username}`,
            headers: { }
        };
        
        axios(config)
        .then(res=>{
            let profile = res.data;
            const { PublicKeyBase58Check } = profile.data.profile;
            const BitCloutUSD = profile.data.BitClout_price;

            let holdingConfig = {
                method:'post',
                url: `http://${process.env.NEXT_PUBLIC_URL}/api/holding/${PublicKeyBase58Check}`,
                headers: { }
            }
            axios(holdingConfig)
            .then(holdingres=>{
                let creatorCoins = holdingres.data;
                creatorCoins.data.holdings.forEach((item) => {
                    db.collection("log").add({
                        PublicKeyBase58Check: PublicKeyBase58Check,
                        CreatorPublicKeyBase58Check: item.CreatorPublicKeyBase58Check,
                        CoinPriceBitCloutNanos:item.ProfileEntryResponse.CoinPriceBitCloutNanos,
                        USD : nanosToBitClout(item.ProfileEntryResponse.CoinPriceBitCloutNanos ) * BitCloutUSD,
                        creatorCoinsUsername:item.ProfileEntryResponse.Username,
                        username:user.username,
                        time:Date.now(),
                    });
                });
            })
            .catch(err=>{
                console.log('holdingerror:',err)
            })
        })
        .catch(err=>{
            console.log('profileerror:',err)
        })
    })
    console.log('corn:',Date.now());
})
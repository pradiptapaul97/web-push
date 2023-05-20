const webpush = require('web-push');
require('dotenv').config();
const express = require('express');
const app = express();
app.use(require('body-parser').json());
const fs = require('fs');
const path = require('path');

// VAPID keys should be generated only once. and save it in env  and set the punlic key in client js
// const vapidKeys = webpush.generateVAPIDKeys();
// console.log(vapidKeys);

let publicVapidKey = process.env.PUBLIC_VAPID_KEY;
let privateVapidKey = process.env.PRIVATE_VAPID_KEY;

if(process.env.PUBLIC_VAPID_KEY == '' || process.env.PRIVATE_VAPID_KEY == '')
{

  if (fs.existsSync('./key.json')) {
    let fileData = fs.readFileSync("key.json", "utf8");
    publicVapidKey = JSON.parse(fileData).publicKey;
    privateVapidKey = JSON.parse(fileData).privateKey;
  } else {
    console.log('file not found!');
    const vapidKeys = webpush.generateVAPIDKeys();
    console.log(vapidKeys);
    fs.writeFileSync('key.json', JSON.stringify(vapidKeys), function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
    publicVapidKey = vapidKeys.publicKey;
    privateVapidKey = vapidKeys.privateKey;
  }
}
  

app.post('/subscribe', async (req, res) => {

  try {

    // Replace with your email
    await webpush.setVapidDetails('mailto:ppradipta65@gmail.com', publicVapidKey, privateVapidKey);

    const subscription = req.body;
    const payload = JSON.stringify({ title: 'You got a new client', body: "Contact with them" });

    //console.log(subscription,"subscription");

    let datas = await webpush.sendNotification(subscription, payload).catch(error => {
      console.error(error.stack);
    });

    console.log(datas);

    return { status:200 , data: datas , messege:"Done"}
  } catch (error) {
    return { status:500 , data: {}, messege:error.messege}
  }
});

app.use(require('express-static')('./'));

app.listen(4000);
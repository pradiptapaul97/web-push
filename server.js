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

// Replace with your email
webpush.setVapidDetails('mailto:pradipta.paul@webskitters.com', publicVapidKey, privateVapidKey);
  

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'You got a new client' });

  //console.log(subscription,"subscription");

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

app.use(require('express-static')('./'));

app.listen(4000);
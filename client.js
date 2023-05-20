// Hard-coded, replace with your public key

$(document).ready(function () {
  $.getJSON("key.json", function (data) {

    const publicVapidKey = data.publicKey;

    if ('serviceWorker' in navigator) {
      //console.log('Registering service worker 1');

      run().catch(error => {
        unsubscribe().then(()=>{
          run().catch(error => {
            console.error(error);
          });
        });
      });
    }

    function urlBase64ToUint8Array(base64String) {
      var padding = '='.repeat((4 - base64String.length % 4) % 4);
      var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

      var rawData = window.atob(base64);
      var outputArray = new Uint8Array(rawData.length);

      for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    async function run() {
      //console.log('Registering service worker 2');
      const registration = await navigator.serviceWorker.register('/worker.js', { scope: './' });

      //console.log(registration,"registration");

      //console.log('Registered service worker 3');

      //console.log('Registering push');

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // The `urlBase64ToUint8Array()` function is the same as in
        // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
      //console.log('Registered push');

      //console.log('Sending push');
      await fetch('/subscribe', {
        method: 'POST',
        body: JSON.parse(subscription),
        headers: {
          'content-type': 'application/json'
        }
      });
      //console.log('Sent push');
    }

    async function unsubscribe() {
      const registration = await navigator.serviceWorker.register('/worker.js', { scope: './' });

      let subs = await registration.pushManager.getSubscription();

      if(subs)
      {
        await subs.unsubscribe();
      }
    }


  }).fail(function () {
    console.log("An error has occurred.");
  });
});
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCOwVQ3oA68dZkxoaRKwDMW043rajFjOmo",
  authDomain: "sts-local.firebaseapp.com",
  projectId: "sts-local",
  storageBucket: "sts-local.appspot.com",
  messagingSenderId: "577034751186",
  appId: "1:577034751186:web:5c5433f6feead36928310b",
});

const messaging = firebase.messaging();

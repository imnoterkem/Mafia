 
  var firebaseConfig = {
    apiKey: "AIzaSyCeV_3-3cAhI6BsyKF1FQf7Aw500ZO1a14",
    authDomain: "jisge12345.firebaseapp.com",
    databaseURL: "https://jisge12345.firebaseio.com",
    projectId: "jisge12345",
    storageBucket: "jisge12345.appspot.com",
    messagingSenderId: "414113016107",
    appId: "1:414113016107:web:9329bd91116b56838bbd6e"
  };

  firebase.initializeApp(firebaseConfig);
let db=firebase.firestore();
db.collection("Room").add({
    jishe: 12345
})
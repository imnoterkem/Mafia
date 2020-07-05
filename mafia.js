var firebaseConfig = {
    apiKey: "AIzaSyAMppKcZo4sa9GjtknjiRyCVt2_yNexh9M",
    authDomain: "team-up-aff0e.firebaseapp.com",
    databaseURL: "https://team-up-aff0e.firebaseio.com",
    projectId: "team-up-aff0e",
    storageBucket: "team-up-aff0e.appspot.com",
    messagingSenderId: "874195963351",
    appId: "1:874195963351:web:d3a1d27d2f4225dff54f92",
    measurementId: "G-WRG3X3HCKY"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
function Join() {
    let s = document.getElementById("name").value
    if (s !== '') {
        db.ref(`Room/${s}/players`).once("value").then(snap => {

            db.ref(`Room/${s}`).update({ players: parseInt(snap.val())+1})
            window.location.href = `mafia2.html?/${s}`
            

        })
    }
}

function Host() {
    db.ref('Number').once('value').then(snap => {
        let s = document.getElementById("name").value;
        // for(let i=0; i<Object.values(db.ref("Room")).length; i++){

        // }
        // Object.values(db.ref("Room")).length;
        if (s !== '') {
            db.ref(`Room/${s}`).set({
                players: 1

            })
            window.location.href = `mafia2.html?/${s}`
            console.log(parseInt(snap.val()) + 1);
            db.ref().update({ Number: parseInt(snap.val()) + 1 })
        }
    })
}
















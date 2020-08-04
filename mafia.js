var firebaseConfig = {
    apiKey: "AIzaSyC78FRamszBxuCmSeL8ZGhduuXeqqrBnf4",
    authDomain: "team-up-73173.firebaseapp.com",
    databaseURL: "https://team-up-73173.firebaseio.com",
    projectId: "team-up-73173",
    storageBucket: "team-up-73173.appspot.com",
    messagingSenderId: "1030300585767",
    appId: "1:1030300585767:web:6577af963515d152b32302",
    appId: "1:1030300585767:web:6577af963515d152b32302"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function Join() {
    let s = document.getElementById("name").value
    if (s !== '') {
        db.ref(`Room/${s}/players`).once("value").then(snap => {

            db.ref(`Room/${s}`).update({ players: parseInt(snap.val()) + 1 })
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
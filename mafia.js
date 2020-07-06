
  var firebaseConfig = {
    apiKey: "AIzaSyC78FRamszBxuCmSeL8ZGhduuXeqqrBnf4",
    authDomain: "team-up-73173.firebaseapp.com",
    databaseURL: "https://team-up-73173.firebaseio.com",
    projectId: "team-up-73173",
    storageBucket: "team-up-73173.appspot.com",
    messagingSenderId: "1030300585767",
    appId: "1:1030300585767:web:6577af963515d152b32302"
  };

  firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
function Join() {
    let s = document.getElementById("name").value
    if (s !== '') {
        db.doc(`Room/${s}`).get().then(function(doc) {
            if (doc.exists) {
                let number=parseInt(doc.data().players)+1;
                db.doc(`Room/${s}`).update({
                    players: number
                })
                window.location.href = `mafia2.html?r=${s}`
            } else {
                console.log("No such document!");
            }
        })
    }
}


function Host() {
        let s = document.getElementById("name").value;
        if (s !== '') {
            db.collection('Room').doc(s).set({
                players: 1
            })
            window.location.href = `mafia2.html?r=${s}`
        }
}
















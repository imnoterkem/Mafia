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
let useruid;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;
        console.log(useruid);
        document.getElementById('lolo').innerHTML = roomname;
    } else {

    }
});

let roomname = new URL(window.location.href).searchParams.get("r");


db.collection(`rooms`).doc(`${roomname}`).collection('users').onSnapshot(function(querySnapshot) {
    document.getElementsByClassName('users')[0].innerHTML = '';
    querySnapshot.forEach(function(doc) {
        let t = document.createElement('div');
        t.classList.add('zambuulin');
        t.id = useruid
        t.innerHTML = doc.data().name;
        document.getElementsByClassName('users')[0].appendChild(t)
    })
})
console.log(useruid);
let clicked = 0
const ready = () => {

        if (clicked % 2 === 0) {
            db.doc(`rooms/${roomname}`).get().then(function(doc) {
                let readynumber;
                readynumber = doc.data().ready + 1
                db.doc(`rooms/${roomname}`).update({
                    ready: readynumber
                })
            })
            db.doc(`rooms/${roomname}/users/${useruid}`).update({
                ready: true
            })
        } else {
            db.doc(`rooms/${roomname}/users/${useruid}`).update({
                ready: false
            })
            db.doc(`rooms/${roomname}`).get().then(function(doc) {
                let readynumber;
                readynumber = doc.data().ready - 1;
                db.doc(`rooms/${roomname}`).update({
                    ready: readynumber
                })
            })
        }
        clicked = clicked + 1;
    }
    // db.doc(`rooms/${roomname}`).onSnapshot(function(querySnapshot) {
    //     if (doc.data().ready >= 7) {
    //         window.location.href = `mafia3.html?r=${roomname}`
    //     };
    //     querySnapshot.forEach(function (doc){
    //         let data = 
    //     })
    // })
const Send = () => {
    let Input = document.getElementById('Input');

    if (Input.value === '') {
        return;
    }
    let s = 0;
    while (Input.value[s] === " ") {
        s++;
    }
    Input.value = Input.value.slice(s, Input.value.length)
    let useless = document.createElement('div');
    db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(doc) {
        useless.innerHTML = doc.data().name + ':' + Input.value;
        useless.classList.add('msgs');
        document.getElementsByClassName('chatbox')[0].appendChild(useless);
    })


    db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(doc) {
        let sendername = doc.data().name;
        console.log(Input.value)
        db.collection(`rooms/${roomname}/Chat`).add({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            text: Input.value,
            sender: sendername
        }).then(function() {
            document.getElementById('Input').value = '';
            document.getElementsByClassName('chatbox')[0].scrollTop = document.getElementsByClassName('chatbox')[0].scrollHeight;
        })
    })

}

console.log(roomname)

db.collection(`rooms`).doc(`${roomname}`).collection('Chat').orderBy('createdAt')
    .onSnapshot(function(querySnapshot) {
        document.getElementsByClassName('chatbox')[0].innerHTML = ''
        querySnapshot.forEach(function(doc) {
            const t = document.createElement("div")
            t.innerHTML = doc.data().sender + ':' + doc.data().text;
            t.classList.add('msgs');
            document.getElementsByClassName('chatbox')[0].append(t);
            document.getElementsByClassName('chatbox')[0].scrollTop = document.getElementsByClassName('chatbox')[0].scrollHeight;

        });

    });
let input = document.getElementById("Input");
document.onkeyup = (event) => {
    if (event.keyCode === 13) {
        Send();
    }
}

function leave() {
    console.log("lol")
    db.doc(`rooms/${roomname}`).get().then(function(doc) {
        console.log('fkfkkfkfkf');
        let updater = doc.data().currentPlayer - 1;
        db.doc(`rooms/${roomname}/users/${useruid}`).delete();
        db.doc(`rooms/${roomname}`).update({
            currentPlayer: updater
        }).then(function() {
            window.location.href = 'index.html';
        })
    })
    console.log('fksdgdfg');
}
window.addEventListener('beforeunload', function() {
    leave();
});
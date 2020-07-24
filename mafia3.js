const ready = () => {
    document.getElementsByClassName("ready")[0].style.background = "#3AC348";
}
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
    } else {

    }
});

let roomname = new URL(window.location.href).searchParams.get("r");
const Send = () => {
    const Input = document.getElementById('Input');
    if (Input.value === '') {
        return;
    }
    let s = 0;
    while (Input.value[s] === " ") {
        s++;
    }
    Input.value = Input.value.slice(s, Input.value.length)
    db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(doc) {
        let sendername = doc.data().name;
        console.log(Input.value)
        db.collection(`rooms/${roomname}/Chat`).add({

            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            text: Input.value,
            sender: sendername
        })
    })
    if (Input.value === '') {
        return;
    }
    document.getElementsByClassName('chatbox')[0].scrollTop = document.getElementsByClassName('chatbox')[0].scrollHeight;
}

console.log(roomname)

db.collection(`rooms`).doc(`${roomname}`).collection('Chat').orderBy('createdAt')
    .onSnapshot(function(querySnapshot) {
        document.getElementsByClassName('chatbox')[0].innerHTML = ''
        querySnapshot.forEach(function(doc) {
            const t = document.createElement("div")
            console.log(doc.data().text)
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
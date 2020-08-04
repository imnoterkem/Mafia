const ready = () => {
    document.getElementsByClassName("ready")[0].style.background = "#3AC348";
}
let roomname = new URL(window.location.href).searchParams.get("r");

let useruid;
var firebaseConfig = {
    apiKey: "AIzaSyC78FRamszBxuCmSeL8ZGhduuXeqqrBnf4",
    authDomain: "team-up-73173.firebaseapp.com",
    databaseURL: "https://team-up-73173.firebaseio.com",
    projectId: "team-up-73173",
    storageBucket: "team-up-73173.appspot.com",
    messagingSenderId: "1030300585767",
    appId: "1:1030300585767:web:6577af963515d152b32302",
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(doc) {

    let sendername = doc.data().name;

    db.collection(`rooms/${roomname}/Chat`).add({

        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        text: Input.value,
        sender: sendername
    })
    Input.value = '';
})

db.doc(`rooms/${roomname}`).get().then(function(doc) {
    if (!doc.data().shuffled) {

    }
})

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;
        console.log(useruid);
    } else {

    }
});


const Send = () => {

    const Input = document.getElementById('Input');
    if (Input.value === '') {
        return;
    }
    let s = 0;
    if (Input.value.trim() === '') return;

    Input.value = Input.value.trim();
    db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(doc) {

        let sendername = doc.data().name;

        db.collection(`rooms/${roomname}/Chat`).add({

            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            text: Input.value,
            sender: sendername
        })
        Input.value = '';
    })

    document.getElementsByClassName('display')[0].scrollTop = document.getElementsByClassName('display')[0].scrollHeight;
}

console.log(roomname)

db.collection(`rooms`).doc(`${roomname}`).collection('Chat').orderBy('createdAt')
    .onSnapshot(function(querySnapshot) {
        console.log("eqeq");
        document.getElementsByClassName('display')[0].innerHTML = ''
        querySnapshot.forEach(function(doc) {
            const t = document.createElement("div")
            console.log(doc.data().text)
            t.innerHTML = doc.data().sender + ':' + doc.data().text;
            t.classList.add('msgs');
            document.getElementsByClassName('display')[0].append(t);
            document.getElementsByClassName('display')[0].scrollTop = document.getElementsByClassName('display')[0].scrollHeight;

        });

    });
let input = document.getElementById("Input");
document.onkeyup = (event) => {
    if (event.keyCode === 13) {
        Send();
    }
}
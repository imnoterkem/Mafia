const ready = () => {
    document.getElementsqByClassName("ready")[0].style.background = "#3AC348";
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
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;
        console.log(useruid);
        // document.getElementById('lolo').innerHTML = roomname;
    } else {

    }
});
// db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(doc) {

//     console.log(roomname, ' ', useruid)
//     console.log(doc.data());
//     console.log(doc.data().name)
//     let sendername = doc.data().name;

//     db.collection(`rooms/${roomname}/Chat`).add({

//         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//         text: Input.value,
//         sender: sendername
//     })
//     Input.value = '';
// })
let players = [];
db.doc(`rooms/${roomname}`).get().then(function(doc) {
    console.log(doc.data().shuffled)
    if (!doc.data().shuffled) {
        db.doc(`rooms/${roomname}`).update({
            shuffled: true
        })
        let arr = []
        db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(docu) {
                arr.push(docu.id);
            })
            players = shuffle(arr);
            db.doc(`rooms/${roomname}`).update({
                shuffledArray: players,
                gameStarted: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                console.log('done')

            }).catch((err) => console.log(err))
        })




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


let sending = false;

const Send = () => {
<<<<<<< HEAD
    const Input = document.getElementById("Input");
    if (Input.value === "") {
        return;
    }
=======

    const Input = document.getElementById('Input');
    if (Input.value === '') return;

>>>>>>> c3981f0222b366fb8fe2327a12fa2d12c73fe2a6
    let s = 0;
    if (Input.value.trim() === "") return;

    Input.value = Input.value.trim();
<<<<<<< HEAD
    db.doc(`rooms/${roomname}/users/${useruid}`)
        .get()
        .then(function (doc) {
            let sendername = doc.data().name;

            db.collection(`rooms/${roomname}/Chat`).add({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                text: Input.value,
                sender: sendername,
            });
            Input.value = "";
        });
=======

    if (!sending) {
        db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(doc) {
            sending = true;

            let sendername = doc.data().name;

            db.collection(`rooms/${roomname}/Chat`).add({

                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                text: Input.value,
                sender: sendername
            }).then(() => {
                Input.value = '';
                sending = false;

            })
        })
    }


>>>>>>> c3981f0222b366fb8fe2327a12fa2d12c73fe2a6

    document.getElementsByClassName('display')[0].scrollTop = document.getElementsByClassName('display')[0].scrollHeight;
}

console.log(roomname);

db.collection(`rooms`)
    .doc(`${roomname}`)
    .collection("Chat")
    .orderBy("createdAt")
    .onSnapshot(function (querySnapshot) {
        console.log("eqeq");
        document.getElementsByClassName('display')[0].innerHTML = ''
        querySnapshot.forEach(function(doc) {
            const t = document.createElement("div")
            t.innerHTML = doc.data().sender + ' : ' + doc.data().text;
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
};

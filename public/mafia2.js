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
        db.doc(`rooms/${roomname}/users/${useruid}`).update({
            alive: true,
            vote: 0,
            goingtodie: false
        })
        console.log(useruid);
        document.getElementById('lolo').innerHTML = roomname;
    } else {
        console.log("safadsfd")
        db.doc(`rooms/${roomname}`).get().then(function(doc) {

            let updater = doc.data().currentPlayer - 1;
            console.log("hdh")
            db.doc(`rooms/${roomname}/users/${useruid}`).delete();
            console.log("asf")
            db.doc(`rooms/${roomname}`).update({
                currentPlayer: updater,

            })

        })
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
        if (doc.data().ready) {
            t.style.border = "5px solid #3AC348"
        }
        document.getElementsByClassName('users')[0].appendChild(t)
    })
})
let clicked = 0
const ready = () => {
    document.getElementById("ready").classList.toggle('green');
    if (clicked % 2 === 0) {
        db.doc(`rooms/${roomname}`).get().then(function(doc) {
            let readynumber;
            readynumber = parseInt(doc.data().ready + 1)
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
            readynumber = parseInt(doc.data().ready - 1);
            db.doc(`rooms/${roomname}`).update({
                ready: readynumber,

            })
        })
    }

    clicked = clicked + 1;
}
db.doc(`rooms/${roomname}`).onSnapshot(function(doc) {
    if (doc.data().shuffled) {
        // history.pushState(null, null, `/mafia2.html?r=${roomname}`);
        // history.go();
        window.location.href = `mafia3.html?r=${roomname}`
    }
    if (doc.data().ready >= 7) {
        let players = [];

        db.doc(`rooms/${roomname}`).get().then(function(doc) {
            console.log(doc.data().shuffled)
            if (!doc.data().shuffled) {
                let arr = []
                db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(docu) {
                        arr.push(docu.id);
                        console.log(docu.id);

                    })
                }).then(() => {
                    players = shuffle(arr);
                    db.doc(`rooms/${roomname}`).update({
                            shuffledArray: players,
                            gameStarted: firebase.firestore.FieldValue.serverTimestamp(),
                            citizen: 3,
                            mafia: 2
                        })
                        .then(async() => {
                            var promises = [];
                            for (let i = 0; i < players.length; i++) {

                                promises.push(rolePlayer(players[i], i));
                                // if (i < 3) {
                                //     db.doc(
                                //         `rooms/${roomname}/users/${players[i]}`
                                //     ).update({
                                //         role: "citizen",
                                //     }).then(() => {
                                //         promises.push(i);
                                //     });
                                // } else if (i === 4) {
                                //     db.doc(
                                //         `rooms/${roomname}/users/${players[i]}`
                                //     ).update({
                                //         role: "doctor",
                                //     }).then(() => {
                                //         promises.push(i);
                                //     });
                                // } else if (i === 5) {
                                //     db.doc(
                                //         `rooms/${roomname}/users/${players[i]}`
                                //     ).update({
                                //         role: "police",
                                //     }).then(() => {
                                //         promises.push(i);
                                //     });
                                // } else {
                                //     db.doc(
                                //         `rooms/${roomname}/users/${players[i]}`
                                //     ).update({
                                //         role: "mafia",
                                //     }).then(() => {
                                //         promises.push(i);
                                //     });
                                // }
                            }
                            Promise.all(promises).then(() => {
                                db.doc(`rooms/${roomname}`).update({
                                    shuffled: true
                                })
                            })
                        })
                })
            }
        })



    }
})

const rolePlayer = (player, i) => {

    playerRole = ['citizen', 'citizen', 'citizen', "doctor", 'police', 'mafia', 'mafia'];

    return db.doc(
        `rooms/${roomname}/users/${player}`
    ).update({
        role: playerRole[i],
    })

}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

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
    console.log("lol");
    return array;
}
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
        useless.innerHTML = doc.data().name + ' : ' + Input.value;
        useless.classList.add('msgs');
        document.getElementsByClassName('chatbox')[0].appendChild(useless);
    })


    db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(doc) {
        let sendername = doc.data().name;
        console.log(Input.value);
        db.collection(`rooms/${roomname}/Chat`).add({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            text: Input.value,
            sender: sendername
        })
        document.getElementsByClassName('chatbox')[0].scrollTop = document.getElementsByClassName('chatbox')[0].scrollHeight;
        document.getElementById('Input').value = '';
    })

}

console.log(roomname)

db.collection(`rooms`).doc(`${roomname}`).collection('Chat').orderBy('createdAt')
    .onSnapshot(function(querySnapshot) {
        document.getElementsByClassName('chatbox')[0].innerHTML = ''
        querySnapshot.forEach(function(doc) {
            const t = document.createElement("div")
            t.innerHTML = doc.data().sender + ' : ' + doc.data().text;
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

        let updater = doc.data().currentPlayer - 1;
        console.log("hdh")
        db.doc(`rooms/${roomname}/users/${useruid}`).delete();
        console.log("asf")
        db.doc(`rooms/${roomname}`).update({
                currentPlayer: updater
            })
            .then(function() {
                console.log("adsfa");
                // history.pushState({ 'a': 1 }, '', 'mafia.html');
                // history.go();
                window.location.href = 'mafia.html'
            })
    })

}
const backButton = () => {
    let a = confirm("You sure?");
    // if (a == true) {
    //     db.doc(`rooms/${roomname}`).get().then(function(doc) {
    //         let updater = doc.data().currentPlayer - 1;
    //         db.doc(`rooms/${roomname}/users/${useruid}`).delete();
    //         console.log("asf")
    //         db.doc(`rooms/${roomname}`).update({
    //             currentPlayer: updater
    //         })
    //     })
    //     history.pushState({ 'a': 1 }, '', 'mafia.html');
    //     history.go();
    // } else {
    //     history.pushState({ 'a': 1 }, '', window.location.pathname);
    // }
}
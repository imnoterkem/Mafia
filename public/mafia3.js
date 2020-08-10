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
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;
    } else {
    }
});
let roomname = new URL(window.location.href).searchParams.get("r");
db.collection(`rooms/${roomname}/users`)
    .get()
    .then(function (doc) {
        let i = 0;
        let color = [
            "#5781EC",
            "#FFB4B4",
            "#ECDE5C",
            "#FFB03A",
            "#0AA119",
            "#A812EE",
            "#FFFFFF",
        ];
        doc.forEach(function (docu) {
            document.getElementsByClassName("player-name")[i].style.color =
                color[i];
            document.getElementsByClassName("player-name")[
                i
            ].innerHTML = docu.data().name;
            i++;
        });
    });
let useruid;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;
        console.log(useruid);
    } else {
    }
});
let clicked = 0;

// let roles = ['citizen', 'citizen', 'citizen', 'doctor', 'police', 'mafia', 'mafia'];

// db.doc(`rooms/${roomname}`).get().then(function(arr){
//     console.log(arr.data().shuffledArray[0]);
// })

db.doc(`rooms/${roomname}`).update({
    ready: 0,
});

db.doc(`rooms/${roomname}`).update({
    time: "day",
});
let players = [];
db.doc(`rooms/${roomname}`)
    .get()
    .then(function (doc) {
        console.log(doc.data().shuffled);
        if (!doc.data().shuffled) {
            db.doc(`rooms/${roomname}`).update({
                shuffled: true,
            });
            let arr = [];

            db.collection(`rooms/${roomname}/users`)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (docu) {
                        arr.push(docu.id);
                        console.log(docu.id);
                    });
                })
                .then(() => {
                    players = shuffle(arr);
                    db.doc(`rooms/${roomname}`)
                        .update({
                            shuffledArray: players,
                            gameStarted: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                        .then(() => {
                            console.log("done");
                            for (let i = 0; i < players.length; i++) {
                                if (i < 3) {
                                    db.doc(
                                        `rooms/${roomname}/users/${players[i]}`
                                    ).update({
                                        role: "citizen",
                                    });
                                }
                                if (i === 4) {
                                    db.doc(
                                        `rooms/${roomname}/users/${players[i]}`
                                    ).update({
                                        role: "doctor",
                                    });
                                }
                                if (i === 5) {
                                    db.doc(
                                        `rooms/${roomname}/users/${players[i]}`
                                    ).update({
                                        role: "police",
                                    });
                                } else {
                                    db.doc(
                                        `rooms/${roomname}/users/${players[i]}`
                                    ).update({
                                        role: "mafia",
                                    });
                                }
                            }
                            console.log("sdfsd");
                        })
                        .catch((err) => console.log(err));
                });
        }
    });

// db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(docc){
//     console.log(useruid)
//     console.log(docc.data().name);
//     console.log("ntgs")
// });

//readyg shalgadiin
const ready = () => {
    db.doc(`rooms/${roomname}/users/${useruid}`)
        .get()
        .then(function (doc) {
            console.log(doc.data().name);
        });
    document.getElementsByClassName("ready")[0].classList.toggle("green");
    if (clicked % 2 === 0) {
        db.doc(`rooms/${roomname}`)
            .get()
            .then(function (doc) {
                let readynumber = doc.data().ready + 1;
                db.doc(`rooms/${roomname}`).update({
                    ready: readynumber,
                });
                db.doc(`rooms/${roomname}/users/${useruid}`).update({
                    ready: true,
                });
            });
        clicked = clicked + 1;
    } else {
        db.doc(`rooms/${roomname}/users/${useruid}`).update({
            ready: false,
        });
        db.doc(`rooms/${roomname}`)
            .get()
            .then(function (doc) {
                let readynumber = doc.data().ready - 1;
                db.doc(`rooms/${roomname}`).update({
                    ready: readynumber,
                });
            });
    }
};
// udur bolgodiin
let shunu = (document.createElement("div").innerHTML = "шөнө 111");
db.doc(`rooms/${roomname}`).onSnapshot(function (doc) {
    console.log(doc.data());
    if (doc.data().ready == 7) {
        if (doc.data().time == "day") {
            console.log("nice");
            document.getElementsByClassName("h")[0].style.background =
                "linear-gradient(to bottom, #001447, #000000)";
            document.getElementsByClassName("body")[0].backgroundImage =
                "url('assets/nighttown.png')";
            db.doc(`rooms/${roomname}`).update({
                time: "night",
            });
            db.doc(`rooms/${roomname}`).update({
                ready: 0,
            });
            document.getElementsByClassName("ready")[0].background = "#3AC348";
        }
        if (doc.data().time == "night") {
            document.getElementsByClassName("h")[0].style.background =
                "linear-gradient(to bottom, #62b8e8, #FFFFFF)";
            document.getElementsByClassName("body")[0].backgroundImage =
                "url('assets/daytown.png')";
            document.getElementsByClassName("night")[0].appendChild(shunu);
            db.doc(`rooms/${roomname}`).update({
                time: "day",
            });
            db.doc(`rooms/${roomname}`).update({
                ready: 0,
            });
            document.getElementsByClassName("ready")[0].background = "#3AC348";
        }
    }
});

db.doc(`rooms/${roomname}`)
    .get()
    .then(function (doc) {
        if (!doc.data().shuffled) {
            db.doc(`rooms/${roomname}`).update({
                shuffled: true,
            });
        }
    });

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

let sending = false;

const Send = () => {
    const Input = document.getElementById("Input");
    if (Input.value === "") {
        return;
    }
    let s = 0;
    if (Input.value.trim() === "") return;

    Input.value = Input.value.trim();
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

    document.getElementsByClassName(
        "display"
    )[0].scrollTop = document.getElementsByClassName("display")[0].scrollHeight;
};

console.log(roomname);

db.collection(`rooms`)
    .doc(`${roomname}`)
    .collection("Chat")
    .orderBy("createdAt")
    .onSnapshot(function (querySnapshot) {
        console.log("eqeq");
        document.getElementsByClassName("display")[0].innerHTML = "";
        querySnapshot.forEach(function (doc) {
            const t = document.createElement("div");
            console.log(doc.data().text);
            t.innerHTML = doc.data().sender + ":" + doc.data().text;
            t.classList.add("msgs");
            document.getElementsByClassName("display")[0].append(t);
            document.getElementsByClassName(
                "display"
            )[0].scrollTop = document.getElementsByClassName(
                "display"
            )[0].scrollHeight;
        });
    });
let input = document.getElementById("Input");
document.onkeyup = (event) => {
    if (event.keyCode === 13) {
        Send();
    }
};

let gameStatedDate = false;

let startedDate;

const mainTimer = () => {
    let nowDate = firebase.firestore.Timestamp.now();
    
    if (!gameStatedDate) {
        db.doc(`rooms/${roomname}`)
            .get()
            .then(function (doc) {
                gameStatedDate = true;
                startedDate = doc.data().gameStarted;
            });
    }
    if (startedDate != undefined) {
    
        if (nowDate.seconds - startedDate.seconds > 120) {
            // console.log('game is finished')
        } else {
            // eniig html element deeree haruulna nowDate.seconds - startedDate.seconds
            document.getElementById('timer').innerHTML=nowDate.seconds - startedDate.seconds;
        }
    }
};

let mainT = setInterval(mainTimer, 1000);

db.doc(`rooms/${roomname}`)
    .get()
    .then(function (doc) {
        while (doc.data().time == "night") {
            db.doc(`rooms/${roomname}/users/${useruid}`)
                .get()
                .then(function (docc) {
                    if (docc.data().role == "mafia") {
                        console.log("ad");
                    }
                });
        }
    });

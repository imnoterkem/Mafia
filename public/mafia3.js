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
let nightShift = [];
let useruid;
let diffTime = 0;
let dayShift = [];
let chosenPlayer;
// console.log(nowT)

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;
    } else {}
});

let roomname = new URL(window.location.href).searchParams.get("r");

let players = [];
db.collection(`rooms/${roomname}/users`)
    .get()
    .then(function(doc) {
        let k = 0;
        let color = [
            "#DE5656",
            "#FF9900",
            "#FFE600",
            "#0AA119",
            "#2D5EDA",
            "#782B8B",
            "#E95CCA",
        ];
        let mycard;
        doc.forEach(function(docu) {
            players.push({
                ...docu.data(),
                uid: docu.id,
            });
            document.getElementsByClassName("player-name")[k].style.color =
                color[k];
            document.getElementsByClassName("player-name")[
                k
            ].innerHTML = docu.data().name;
            db.doc(`rooms/${roomname}/users/${docu.id}`).update({
                colors: color[k],
            });
            if (docu.id === useruid) {
                importantvar = k;
                db.doc(`rooms/${roomname}/users/${useruid}`)
                    .get()
                    .then(function(docs) {
                        if (docs.data().role === "citizen") {
                            document.getElementsByClassName("card-image")[
                                k
                            ].src = "assets/irgen.png";
                        } else if (docs.data().role === "mafia") {
                            document.getElementsByClassName("card-image")[
                                k
                            ].src = "assets/mafia.png";
                        } else if (docs.data().role === "police") {
                            document.getElementsByClassName("card-image")[
                                k
                            ].src = "assets/police.png";
                        } else if (docs.data().role === "doctor") {
                            document.getElementsByClassName("card-image")[
                                k
                            ].src = "assets/doctor.png";
                        }
                    })
                    .then(() => {
                        k++;
                    });
            } else {
                k++;
            }
        });

        nightShift = players.filter(
            (el) =>
            el.role === "mafia" ||
            el.role === "doctor" ||
            el.role === "police"
        );
        dayShift = players.filter((el) => el.role === "citizen");
    });
db.doc(`rooms/${roomname}`)
    .get()
    .then(function(doc) {
        if (!doc.data().isChatDeleted) {
            db.doc(`rooms/${roomname}`).update({
                isChatDeleted: true,
            });
            db.collection(`rooms/${roomname}/Chat`)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        db.collection(`rooms/${roomname}/Chat`)
                            .doc(`${doc.id}`)
                            .delete()
                            .then(function() {})
                            .catch(function(error) {
                                console.error(
                                    "Error removing document: ",
                                    error
                                );
                            });
                    });
                });
            if (!doc.data().gameStarted) {
                let gameStarted = firebase.firestore.FieldValue.serverTimestamp();
                db.doc(`rooms/${roomname}`).update({
                    dc: 0,
                    nc: 0,
                    day: true,
                    gameStarted,
                    ready: 0,
                    time: "day",
                });
                let nowT = moment(new Date());
                let parsedDate = moment(gameStarted.toDate());

                diffTime = moment.duration(nowT.diff(parsedDate).asMinutes());
            } else {
                let nowT = moment(new Date());
                let parsedDate = moment(doc.data().gameStarted.toDate());
                console.log(parsedDate);
                console.log(nowT);
                let difference = nowT.diff(parsedDate);
                diffTime = moment.duration(difference).asSeconds();
                console.log("zao" + " " + diffTime);
            }
        }
    });

let clicked = 0;

db.doc(`rooms/${roomname}`).update({
    time: "day",
});

const ready = () => {
    document.getElementsByClassName("ready")[0].classList.toggle("green");
    if (clicked % 2 === 0) {
        db.doc(`rooms/${roomname}`)
            .get()
            .then(function(doc) {
                let readynumber = doc.data().ready + 1;
                db.doc(`rooms/${roomname}`).update({
                    ready: readynumber,
                });
            });
        db.doc(`rooms/${roomname}/users/${useruid}`).update({
            ready: true,
        });
    } else {
        db.doc(`rooms/${roomname}/users/${useruid}`).update({
            ready: false,
        });
        db.doc(`rooms/${roomname}`)
            .get()
            .then(function(doc) {
                let readynumber = doc.data().ready - 1;
                db.doc(`rooms/${roomname}`).update({
                    ready: readynumber,
                });
            });
    }

    clicked = clicked + 1;
};
// udur bolgodiin
let shunu = (document.createElement("div").innerHTML = "шөнө 111");


db.doc(`rooms/${roomname}`)
    .get()
    .then(function(doc) {
        if (!doc.data().shuffled) {
            db.doc(`rooms/${roomname}`).update({
                shuffled: true,
            });
        }
    });

let sending = false;
const Send = () => {
    const Input = document.getElementById("Input");
    if (Input.value === "") {
        return;
    }
    let s = 0;
    if (Input.value.trim() === "") return;

    Input.value = Input.value.trim();
    if (!sending) {
        sending = true;
        db.doc(`rooms/${roomname}/users/${useruid}`)
            .get()
            .then(function(doc) {
                let sendername = doc.data().name;
                let color = doc.data().colors;
                db.collection(`rooms/${roomname}/Chat`)
                    .add({
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        text: Input.value,
                        sender: sendername,
                        color: color,
                    })
                    .then(() => {
                        sending = false;
                    });
                Input.value = "";
            });
    }
    document.getElementsByClassName(
        "display"
    )[0].scrollTop = document.getElementsByClassName("display")[0].scrollHeight;
};

db.collection(`rooms`)
    .doc(`${roomname}`)
    .collection("Chat")
    .orderBy("createdAt")
    .onSnapshot(function(querySnapshot) {
        document.getElementsByClassName("display")[0].innerHTML = "";
        querySnapshot.forEach(function(doc) {
            const t = document.createElement("div");
            let coloredname = doc.data().sender;
            coloredname = coloredname.fontcolor(doc.data().color);
            t.innerHTML = coloredname + " : " + doc.data().text;
            t.classList.add("msgs");
            // t.style.color = doc.data().color;
            document.getElementsByClassName("display")[0].append(t);
            document.getElementsByClassName(
                "display"
            )[0].scrollTop = document.getElementsByClassName(
                "display"
            )[0].scrollHeight;
        });
    });

document.onkeyup = (event) => {
    if (event.keyCode === 13) {
        Send();
    }
};

killerDo = () => {};

let gameStatedDate = false;
let startedDate;
let time = 60;
let rounds = 1;
let day = false;
let badChar = [];
let nightTimer = 20;
let index = 0;

let round = 0;

let mafia = true;
let voted = false;


let interval = 10;

const mainTimer = () => {
    let nowDate = firebase.firestore.Timestamp.now();
    if (!gameStatedDate) {
        gameStatedDate = true;
        db.doc(`rooms/${roomname}`)
            .get()
            .then(function(doc) {
                console.log(doc.data());
                startedDate = doc.data().gameStarted;
            });
    }
    if (startedDate != undefined) {
        if (nowDate.seconds - startedDate.seconds < time) {
            interval = 1000;
            document.getElementById("timer").innerHTML = time - (nowDate.seconds - startedDate.seconds);
            if (day) {
                // console.log('udur bolood bnaaaaaaaaaa fuuuuu');
                document.getElementsByClassName("body")[0].style.background = "linear-gradient(to bottom, #62b8e8, #FFFFFF)";
                document.getElementsByClassName("h")[0].style.backgroundImage = "url('./assets/daytown.png')";
                document.getElementsByClassName("ready")[0].background = "#3AC348";

            } else {
                // console.log('shunu bolood bnashd wtf');
                document.getElementsByClassName("body")[0].style.background =
                    "linear-gradient(to bottom, #001447, #000000) ";
                document.getElementsByClassName("h")[0].style.backgroundImage =
                    "url('./assets/nighttown.png')";
                document.getElementsByClassName("ready")[0].background =
                    "#3AC348";
                if (index < nightShift.length) {
                    if (nowDate.seconds - startedDate.seconds < nightTimer) {
                        if (nightShift[index].uid === useruid) {
                            switch (index) {
                                case 0:
                                    document.getElementById("sambar").innerHTML = "Hunee Alnuu!"
                                    if (
                                        nowDate.seconds -
                                        startedDate.seconds ===
                                        nightTimer - 1
                                    ) {
                                        mafiaPlayerAction(chosenPlayer[0].uid);
                                    }
                                    break;
                                case 1:
                                    console.log("dfdfg")
                                    document.getElementById("sambar").innerHTML = "Hunee Emchilnuu!"
                                    if (
                                        nowDate.seconds - startedDate.seconds === nightTimer - 21
                                    ) {
                                        console.log("dfsf");
                                        doctorPlayerAction(chosenPlayer.id);
                                    }
                                    break;
                                case 2:
                                    document.getElementById("sambar").innerHTML = "Hunee songonuu!"
                                    break;
                            }
                        }
                    }
                } else {
                    nightTimer += 20;
                    index++;
                }
            }

            // togloom yvj baigaa
        } else {
            round++;
            voted = false;
            call()
            db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    db.doc(`rooms/${roomname}/users/${doc.id}`).update({
                        vote: 0,
                        voteto: 0
                    })
                })
            })
            if (round % 2 == 0) {
                mafia = false;
            } else {
                mafia = true;
            }
            if (day) {
                startedDate.seconds += 120;
                time = 60;
                day = false;
                index = 0;
            } else {
                startedDate.seconds += 60;
                nightTimer = 20;
                time = 120;
                day = true;
            }

            //togloom duussan
            //daraaciinn round
        }
    }
};
for (let i = 0; i < document.getElementsByClassName("card-image").length; i++) {

    document.getElementsByClassName("card-image")[i].onclick = (e) => {
        if (!day) {
            for (let j = 0; j < 7; j++) {
                document.getElementsByClassName("votebox")[j].style.display = "none";
            }
            for (
                let j = 0; j < document.getElementsByClassName("card-image").length; j++
            ) {
                document.getElementsByClassName("card-image")[j].style.boxShadow =
                    "none";
            }
            document.getElementById(e.target.id).style.boxShadow =
                "0px 0px 10px 10px red";
            console.log("working")
            choosePlayer(e.target.previousElementSibling.previousElementSibling.innerHTML);
        } else if (!voted) {
            for (let f = 0; f < document.getElementsByClassName("card-image").length; f++) {
                document.getElementsByClassName("card-image")[f].style.boxShadow = "none";
            }
            choosePlayer(e.target.previousElementSibling.previousElementSibling.innerHTML);
            if (i != importantvar) {
                for (let j = 0; j < 7; j++) {
                    document.getElementsByClassName("votebox")[j].style.display = "none";
                }
                document.getElementsByClassName("votebox")[i].style.display = "flex";
                document.getElementsByClassName("votebox")[i].onclick = () => {
                    voted = true;
                    document.getElementsByClassName("votebox")[i].innerHTML = "Voted"
                    db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot) {
                        db.doc(`rooms/${roomname}/users/${querySnapshot.docs[i]}`).get().then(function(dco) {
                            db.doc(`rooms/${roomname}/users/${querySnapshot.docs[i]}`).update({
                                vote: ++dco.data().vote
                            })
                        })

                    })
                    db.doc(`rooms/${roomname}/users/${useruid}`).update({
                        voteto: i
                    })
                }
            }
        }
    };
}
const call = () => {

    for (let l = 0; l < 7; l++) {
        document.getElementsByClassName("votebox")[l].style.display = "none";
    }
    for (let h = 0; h < document.getElementsByClassName("card-image").length; h++) {
        document.getElementsByClassName("card-image")[h].style.boxShadow = "none";
    }

}
call();
updateNnumbers = (numbers) => {
    for (
        let i = 0; i < document.getElementsByClassName("vote-count").length; i++
    ) {
        document.getElementsByClassName("vote-count")[i].innerHTML = number;
    }
};

votePlayer = () => {
    let numbers = [];
    db.collection(`rooms/${roomname}/users`).onSnapshot((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            numbers.push(doc.data().vote);
        });
        updateNnumbers(numbers);
    });
};

const choosePlayer = (name) => {
    chosenPlayer = [];
    chosenPlayer = players.filter(el => el.name === name);
}

const mafiaPlayerAction = (id) => {
    db.doc(`rooms/${roomname}/users/${id}`).update({
        alive: false
    }).then(() => {
        console.log("oaekwe12345")
    });
};

const doctorPlayerAction = (id) => {
    db.doc(`rooms/${roomname}/users/${id}`).update({
        alive: true,
    });
};
const policePlayerAction = (id) => {
    db.doc(`rooms/${roomname}/users/${id}`).get().then(function(doc) {
        if (doc.data().role == "mafia") {
            console.log("YES")
        } else {
            console.log("NO");
        }
    })
}

let mainInterval = setInterval(() => {
    mainTimer();
}, interval);

let aliveplayers = [];
db.collection(`rooms/${roomname}/users`).get().then(function(doc) {
    doc.forEach(function(ok) {
        aliveplayers.push(ok.data().name)
    })
})
db.collection(`rooms/${roomname}/users`).onSnapshot(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        if (!doc.data().alive) {

            for (let i = 0; i < aliveplayers.length; i++) {
                if (aliveplayers[i] == doc.data().name) {
                    document.getElementsByClassName("card-image")[i].src = "assets/dead.png";
                }
            }

        }

    })
})
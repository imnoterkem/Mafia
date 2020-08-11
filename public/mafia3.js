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

let useruid;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;

    } else {}
});
let roomname = new URL(window.location.href).searchParams.get("r");
db.collection(`rooms/${roomname}/users`).get().then(function(doc) {
    let k = 0;
    let color = ['#DE5656', '#FF9900', '#FFE600', '#0AA119', '#2D5EDA', '#782B8B', '#E95CCA'];
    let mycard;
    // db.doc()
    doc.forEach(function(docu) {
        document.getElementsByClassName("player-name")[k].style.color = color[k]
        document.getElementsByClassName("player-name")[k].innerHTML = docu.data().name
        db.doc(`rooms/${roomname}/users/${docu.id}`).update({
            colors: color[k]
        });
        console.log(useruid)
        console.log(docu.id)
        if (docu.id === useruid) {
            importantvar = k;
            db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(docs) {
                if (docs.data().role === "citizen") {
                    document.getElementsByClassName("card-image")[k].src = "assets/irgen.png"
                } else if (docs.data().role === "mafia") {
                    document.getElementsByClassName("card-image")[k].src = "assets/mafia.png"
                } else if (docs.data().role === "police") {
                    document.getElementsByClassName("card-image")[k].src = "assets/police.png"
                } else if (docs.data().role === "doctor") {
                    document.getElementsByClassName("card-image")[k].src = "assets/doctor.png"
                }

            }).then(() => {
                k++;
            })
        } else {
            k++;
        }

    })
})
db.doc(`rooms/${roomname}`).get().then(function(doc) {
    if (!doc.data().isChatDeleted) {
        db.doc(`rooms/${roomname}`).update({
            isChatDeleted: true
        })
        db.collection(`rooms/${roomname}/Chat`).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                db.collection(`rooms/${roomname}/Chat`).doc(`${doc.id}`).delete().then(function() {}).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            });
        });
    }
});
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;
        console.log(useruid);
    } else {}
});
let clicked = 0;

db.doc(`rooms/${roomname}`).update({
    ready: 0,
});

db.doc(`rooms/${roomname}`).update({
    time: "day",
});
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
                console.log(docu.id);

            })
        }).then(() => {
            players = shuffle(arr);
            db.doc(`rooms/${roomname}`).update({
                    shuffled: true,
                    shuffledArray: players,
                    gameStarted: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                    for (let i = 0; i < players.length; i++) {
                        if (i < 3) {
                            db.doc(
                                `rooms/${roomname}/users/${players[i]}`
                            ).update({
                                role: "citizen",
                            });
                        } else if (i === 4) {
                            db.doc(
                                `rooms/${roomname}/users/${players[i]}`
                            ).update({
                                role: "doctor",
                            });
                        } else if (i === 5) {
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
                })
        })
    }
})

const ready = () => {
        document.getElementsByClassName("ready")[0].classList.toggle('green');
        if (clicked % 2 === 0) {
            db.doc(`rooms/${roomname}`).get().then(function(doc) {
                let readynumber = doc.data().ready + 1;
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
                let readynumber = doc.data().ready - 1;
                db.doc(`rooms/${roomname}`).update({
                    ready: readynumber
                })
            })
        }

        clicked = clicked + 1;
    }
    // udur bolgodiin
let shunu = document.createElement('div').innerHTML = 'шөнө 111'
db.doc(`rooms/${roomname}`).onSnapshot(function(doc) {
    console.log(doc.data());
    if (doc.data().ready == 7) {
        if (doc.data().time == 'day') {
            console.log('nice');
            document.getElementsByClassName('h')[0].style.background = "linear-gradient(to bottom, #001447, #000000)";
            document.getElementsByClassName('body')[0].backgroundImage = "url('assets/nighttown.png')";
            db.doc(`rooms/${roomname}`).update({
                time: 'night'
            });
            db.doc(`rooms/${roomname}`).update({
                ready: 0
            })
            document.getElementsByClassName('ready')[0].background = "#3AC348"
        }
        if (doc.data().time == 'night') {
            document.getElementsByClassName('h')[0].style.background = "linear-gradient(to bottom, #62b8e8, #FFFFFF)";
            document.getElementsByClassName('body')[0].backgroundImage = "url('assets/daytown.png')";
            document.getElementsByClassName('night').appendChild(shunu)
            db.doc(`rooms/${roomname}`).update({
                time: 'day'
            });
            db.doc(`rooms/${roomname}`).update({
                ready: 0
            })
            document.getElementsByClassName('ready')[0].background = "#3AC348"
        }
    }
})
db.doc(`rooms/${roomname}`).get().then(function(doc) {
    if (doc.data().time == 'day') {
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
    }
})
let day = true;
let input = document.getElementById("Input");
document.onkeyup = (event) => {


    if (event.keyCode === 13) {
        console.log()
        if (day) Send();
    }
}

db.doc(`rooms/${roomname}`).get().then(function(doc) {
    if (!doc.data().shuffled) {
        db.doc(`rooms/${roomname}`).update({
            shuffled: true
        })
    }
})

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
    if (!sending) {
        sending = true;
        db.doc(`rooms/${roomname}/users/${useruid}`).get().then(function(doc) {
            let sendername = doc.data().name;
            let color = doc.data().colors;
            db.collection(`rooms/${roomname}/Chat`).add({

                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                text: Input.value,
                sender: sendername,
                color: color
            }).then(() => {
                sending = false;
            })
            Input.value = '';
        })
    }
    document.getElementsByClassName('display')[0].scrollTop = document.getElementsByClassName('display')[0].scrollHeight;
}

db.collection(`rooms`).doc(`${roomname}`).collection('Chat').orderBy('createdAt')
    .onSnapshot(function(querySnapshot) {
        document.getElementsByClassName('display')[0].innerHTML = ''
        querySnapshot.forEach(function(doc) {
            const t = document.createElement("div")
            t.innerHTML = doc.data().sender + ' : ' + doc.data().text;
            t.classList.add('msgs');
            // t.style.color = doc.data().color;
            document.getElementsByClassName('display')[0].append(t);
            document.getElementsByClassName('display')[0].scrollTop = document.getElementsByClassName('display')[0].scrollHeight;
        });
    });

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
            .then(function(doc) {
                gameStatedDate = true;
                startedDate = doc.data().gameStarted;
            });
    }
    if (startedDate != undefined) {

        if (nowDate.seconds - startedDate.seconds > 120) {
            // console.log('game is finished')
        } else {
            // eniig html element deeree haruulna nowDate.seconds - startedDate.seconds
            document.getElementById('timer').innerHTML = nowDate.seconds - startedDate.seconds;
        }
    }
};

let mainT = setInterval(mainTimer, 1000);

db.doc(`rooms/${roomname}`).get().then(function(doc) {
    while (doc.data().time == "night") {
        db.doc(`rooms/${roomname}/users/${useruid}`)
            .get()
            .then(function(docc) {
                if (docc.data().role == "mafia") {
                    console.log("ad");
                }
            });
    }
})
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        let useless = user.uid;
        db.doc(`rooms/${roomname}/users/${useless}`).get().then(function(doc) {
            console.log(doc.data().role);
            if (doc.data().role === "mafia") {
                console.log("mafia");
                for (let i = 0; i < 7; i++) {
                    document.getElementsByClassName('card-image')[i].addEventListener('click', function() {
                        for (let j = 0; j < 7; j++) {
                            document.getElementsByClassName('card-image')[j].style.boxShadow = null
                        }

                        if (i !== importantvar) {
                            db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot2) {
                                console.log("dfgdfga")
                                querySnapshot2.forEach(function(docus) {
                                    console.log(docus)
                                    db.doc(`rooms/${roomname}/users/${docus.id}`).update({
                                        alive: true
                                    });
                                })
                            }).then(() => {
                                console.log("dfgdfga")
                                db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot) {
                                    console.log(querySnapshot.docs[i].id)
                                    db.doc(`rooms/${roomname}/users/${querySnapshot.docs[i].id}`).update({
                                        alive: false
                                    });
                                })
                            })
                            document.getElementsByClassName('card-image')[i].style.boxShadow = "0px 0px 5px 5px red"
                        }
                    })
                }
            } else if (doc.data().role === "doctor") {
                console.log("mafia");
                for (let i = 0; i < 7; i++) {
                    document.getElementsByClassName('card-image')[i].addEventListener('click', function() {
                        for (let j = 0; j < 7; j++) {
                            document.getElementsByClassName('card-image')[j].style.boxShadow = null
                        }
                        if (i !== importantvar) {
                            db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot) {
                                console.log(querySnapshot.docs[i].id)
                                db.doc(`rooms/${roomname}/users/${querySnapshot.docs[i].id}`).update({
                                    alive: true
                                });
                            })
                            document.getElementsByClassName('card-image')[i].style.boxShadow = "0px 0px 5px 5px green"
                        }
                    })
                }
            }
        })
    }
});
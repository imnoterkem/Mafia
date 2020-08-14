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
<<<<<<< HEAD
=======
let diffTime = 0;
let dayShift = [];
let chosenPlayer;
// console.log(nowT)
>>>>>>> fefd170930ac4756da0afd945e380204c669b9b8

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;

    } else {}
});
let roomname = new URL(window.location.href).searchParams.get("r");
<<<<<<< HEAD
db.collection(`rooms/${roomname}/users`).get().then(function(doc) {
    let k = 0;
    let color = ['#DE5656', '#FF9900', '#FFE600', '#0AA119', '#2D5EDA', '#782B8B', '#E95CCA'];
    let mycard;
    doc.forEach(function(docu) {
        document.getElementsByClassName("player-name")[k].style.color = color[k]
        document.getElementsByClassName("player-name")[k].innerHTML = docu.data().name
        db.doc(`rooms/${roomname}/users/${docu.id}`).update({
            colors: color[k]
=======

let players = [];
db.collection(`rooms/${roomname}/users`)
    .get()
    .then(function (doc) {
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
        doc.forEach(function (docu) {
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
                    .then(function (docs) {
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
>>>>>>> fefd170930ac4756da0afd945e380204c669b9b8
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
    if (!doc.data().shuffled) {
        db.doc(`rooms/${roomname}`).update({
            shuffled: true
        })
    }
})



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
            let coloredname = doc.data().sender
            coloredname = coloredname.fontcolor(doc.data().color);
            t.innerHTML = coloredname + ' : ' + doc.data().text;
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

<<<<<<< HEAD
=======
killerDo = () => {};

// let gameStatedDate = false;

// let startedDate = undefined;

// let time = 120;
// let dc = 0;
// let nc = 0;
// document.getElementsByClassName("h")[0].style.backgroundImage = "url('./assets/daytown.png')";
// const mainTimer = (timer) => {
//     let nowDate = moment(new Date());

//     if (!gameStatedDate) {
//         db.doc(`rooms/${roomname}`)
//             .get()
//             .then(function (doc) {
//                 day = doc.data().day;
//                 dc=doc.data().dc;
//                 nc = doc.data().nc;
//                 startedDate = moment(doc.data().gameStarted.toDate());
//                 startedDate.add(dc*120, "seconds");
//                 startedDate.add(nc*30, "seconds");
//                 gameStatedDate = true;
//             })
//     }
//     // console.log(moment.duration(nowDate.diff(startedDate)).asSeconds());
//     // console.log(timer);
//     if (startedDate != undefined) {
//         if (moment.duration(nowDate.diff(startedDate)).asSeconds() > timer) {
//             if (day) {
//                 day = false;
//                 time = 30;
//                 document.getElementsByClassName("body")[0].style.background = "linear-gradient(to bottom, #001447, #000000) ";
//                 document.getElementsByClassName("h")[0].style.backgroundImage = "url('./assets/nighttown.png')";
//                 document.getElementsByClassName("ready")[0].background = "#3AC348";
//                 db.doc(`rooms/${roomname}`).update({
//                     dc: dc+1,
//                     day: false,
//                 });
//             } else {
//                 day = true;
//                 time = 120;
//                 document.getElementsByClassName("body")[0].style.background = "linear-gradient(to bottom, #62b8e8, #FFFFFF)";
//                 document.getElementsByClassName("h")[0].style.backgroundImage = "url('./assets/daytown.png')";
//                 document.getElementsByClassName("ready")[0].background = "#3AC348";
//                 db.doc(`rooms/${roomname}`).update({
//                     nc: nc+1,
//                     day: true,
//                 });
//             }
//         } else {
//             document.getElementById("timer").innerHTML = nowDate - startedDate;
//             console.log(startedDate.getSeconds())
//             console.log("timer arla");
//         }
//     }
// };
// let role={}, ;
// db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot){
//     querySnapshot.forEach(function(doc){
//         doc.data().name:doc.data().role;
//     })
// })

>>>>>>> fefd170930ac4756da0afd945e380204c669b9b8
let gameStatedDate = false;

let startedDate;

<<<<<<< HEAD
=======
let round = 0;

let mafia = true;

>>>>>>> fefd170930ac4756da0afd945e380204c669b9b8
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
<<<<<<< HEAD

        if (nowDate.seconds - startedDate.seconds > 120) {
            // console.log('game is finished')
        } else {
            // eniig html element deeree haruulna nowDate.seconds - startedDate.seconds
            document.getElementById('timer').innerHTML = nowDate.seconds - startedDate.seconds;
=======
        if (nowDate.seconds - startedDate.seconds < time) {
            if (day) {
                console.log('day')
                if (dayShift[0].uid === user.uid) {
                    console.log("yea it is me", user.uid);
                }
                console.log(nowDate.seconds - startedDate.seconds);
            } else {
                console.log("shunu");
                console.log(nowDate.seconds - startedDate.seconds);
                if (index < nightShift.length) {
                    if (nowDate.seconds - startedDate.seconds < nightTimer) {
                        console.log(nightTimer);
                        if (nightShift[index].uid === useruid) {
                            switch (index) {
                                case 0:
                                if (nowDate.seconds - startedDate.seconds === nightTimer - 1) {
                                    console.log(chosenPlayer);
                                    mafiaPlayerAction(chosenPlayer.id);
                                }
                                    break;
                                case 1:
                                    if (nowDate.seconds - startedDate.seconds === nightTimer - 1) {
                                    console.log("dfsf")
                                    doctorPlayerAction(chosenPlayer.id);
                                    }


                                    break;
                                case 2:
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
>>>>>>> fefd170930ac4756da0afd945e380204c669b9b8
        }
    }
};

<<<<<<< HEAD
let mainT = setInterval(mainTimer, 1000);
=======

for (let i = 0; i < document.getElementsByClassName("card-image").length; i++) {

   
    document.getElementsByClassName("card-image")[i].onclick = (e) => {

        for (let j = 0; j < document.getElementsByClassName("card-image").length; j++) {   
            document.getElementsByClassName("card-image")[j].style.boxShadow = 'none';
        }
    
        document.getElementById(e.target.id).style.boxShadow = '0px 0px 10px 10px red';
        choosePlayer(e.target.previousElementSibling.innerHTML);
    }
}


const choosePlayer = (name) => {

    chosenPlayer = [];

    chosenPlayer =  players.filter(el => el.name === name);
}

const mafiaPlayerAction = (id) => {
    db.doc(`rooms/${roomname}/users/${id}`).update({
        alive: false,
    });
};

const doctorPlayerAction = (id) => {
    db.doc(`rooms/${roomname}/users/${id}`).update({
        alive: true,
    });
};
const policePlayerAction= (id) =>{
    db.doc(`rooms/${roomname}/users/${id}`).get().then(function(doc){
        if(doc.data().role=="mafia"){
            console.log("YES")
        }
        else{
            console.log("NO");
        }
    })
}
let mainInterval = setInterval(() => {
    mainTimer();
}, 1000);
>>>>>>> fefd170930ac4756da0afd945e380204c669b9b8

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
<<<<<<< HEAD
    })
    // var recover;
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //         var isAnonymous = user.isAnonymous;
    //         let useless = user.uid;
    //         db.doc(`rooms/${roomname}/users/${useless}`).get().then(function(doc) {
    //             console.log(doc.data().role);
    //             if (doc.data().alive) {
    //                 if (doc.data().role === "mafia") {
    //                     console.log("mafia");
    //                     for (let i = 0; i < 7; i++) {
    //                         document.getElementsByClassName('card-image')[i].addEventListener('click', function() {
    //                             for (let j = 0; j < 7; j++) {
    //                                 document.getElementsByClassName('card-image')[j].style.boxShadow = null
    //                             }

//                             if (i !== importantvar) {
//                                 db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot2) {
//                                     console.log("dfgdfga")
//                                     querySnapshot2.forEach(function(docus) {
//                                         console.log(docus)
//                                         db.doc(`rooms/${roomname}/users/${docus.id}`).update({
//                                             alive: true
//                                         });
//                                     })
//                                 }).then(() => {
//                                     console.log("dfgdfga")
//                                     db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot) {
//                                         console.log(querySnapshot.docs[i].id)
//                                         db.doc(`rooms/${roomname}/users/${querySnapshot.docs[i].id}`).update({
//                                             alive: false
//                                         });
//                                     })
//                                 })
//                                 document.getElementsByClassName('card-image')[i].style.boxShadow = "0px 0px 5px 5px red"
//                             }
//                         })
//                     }
//                 } else if (doc.data().role === "doctor") {
//                     console.log("mafia");

//                     for (let i = 0; i < 7; i++) {
//                         document.getElementsByClassName('card-image')[i].addEventListener('click', function() {
//                             for (let j = 0; j < 7; j++) {
//                                 document.getElementsByClassName('card-image')[j].style.boxShadow = null
//                             }
//                             if (i !== importantvar) {
//                                 recover = i;
//                                 console.log(recover)
//                                 document.getElementsByClassName('card-image')[i].style.boxShadow = "0px 0px 5px 5px green"
//                             }
//                         })
//                     }
//                     console.log(recover)

//                     db.collection(`rooms/${roomname}/users`).get().then(function(querySnapshot) {
//                         console.log(querySnapshot.docs[recover].id)
//                         db.doc(`rooms/${roomname}/users/${querySnapshot.docs[recover].id}`).update({
//                             alive: true
//                         });
//                     })
//                 }
//             } else {
//                 console.log('sdf')
//             }
//         })
//     }
// });
=======
    });
>>>>>>> fefd170930ac4756da0afd945e380204c669b9b8

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
    } else {

    }
});
let roomname = new URL(window.location.href).searchParams.get("r");
db.collection(`rooms/${roomname}/users`).get().then(function(doc) {
    let i = 0;
    let color = ['#DE5656', '#FF9900', '#FFE600', '#0AA119', '#2D5EDA', '#782B8B', '#E95CCA']
    doc.forEach(function(docu) {
        document.getElementsByClassName("player-name")[i].style.color = color[i]
        document.getElementsByClassName("player-name")[i].innerHTML = docu.data().name
        db.doc(`rooms/${roomname}/users/${docu.id}`).update({
            colors: color[i]
        });
        i++;

    })
})
db.doc(`rooms/${roomname}`).get().then(function(doc) {
    if (!doc.data().isChatDeleted) {
        db.doc(`rooms/${ roomname }`).update({
            isChatDeleted: true
        })
        db.collection(`rooms/${ roomname }/Chat`).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                db.collection(`rooms/${roomname}/Chat`).doc(`${doc.id}`).delete().then(function() {}).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            });
        });
    }

})




let useruid;

let clicked = 0;

db.doc(`rooms/${roomname}`).update({
    ready: 0
})

db.doc(`rooms/${roomname}`).update({
    time: 'day'
})
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
                shuffledArray: players,
                gameStarted: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                console.log('done')
                for (let i = 0; i < players.length; i++) {
                    if (i < 3) {
                        db.doc(`rooms/${roomname}/users/${players[i]}`).update({
                            role: "citizen"
                        })
                    } else if (i === 4) {
                        db.doc(`rooms/${roomname}/users/${players[i]}`).update({
                            role: "doctor"
                        })
                    } else if (i === 5) {
                        db.doc(`rooms/${roomname}/users/${players[i]}`).update({
                            role: "police"
                        })
                    } else {
                        db.doc(`rooms/${roomname}/users/${players[i]}`).update({
                            role: "mafia"
                        })
                    }
                }
                console.log("sdfsd");

            }).catch((err) => console.log(err))
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
    //send
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
let input = document.getElementById("Input");
document.onkeyup = (event) => {
    if (event.keyCode === 13) {
        Send();
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

let sending = false;

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
        let color = doc.data().colors;
        db.collection(`rooms/${roomname}/Chat`).add({

            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            text: Input.value,
            sender: sendername,
            color: color
        })
        Input.value = '';
    })

    document.getElementsByClassName('display')[0].scrollTop = document.getElementsByClassName('display')[0].scrollHeight;
}

console.log(roomname)

db.collection(`rooms`).doc(`${roomname}`).collection('Chat').orderBy('createdAt')
    .onSnapshot(function(querySnapshot) {
        document.getElementsByClassName('display')[0].innerHTML = ''
        querySnapshot.forEach(function(doc) {
            const t = document.createElement("div")
            t.innerHTML = doc.data().sender + ' : ' + doc.data().text;
            t.classList.add('msgs');
            t.style.color = doc.data().color;
            document.getElementsByClassName('display')[0].append(t);
            document.getElementsByClassName('display')[0].scrollTop = document.getElementsByClassName('display')[0].scrollHeight;
        });

    });

let timer = 10;
let day = true;
const mainTimer = () => {
    document.getElementById("timer").innerHTML = `Auto-Skipping in: ${timer}`;
    if (timer <= 0) {
        timer = 10;
        db.doc(`rooms/${roomname}`).get().then(function(doc) {
            console.log(doc.data().time)

            if (doc.data().time == 'day') {
                console.log('nice');
                document.getElementsByClassName('h')[0].style.backgroundImage = "url('/assets/nighttown.png')";
                document.getElementsByClassName('body')[0].style.background = "linear-gradient(to bottom, #001447, #000000)";
                document.getElementsByClassName('moon')[0].style.background = "#FFE99C";
                db.doc(`rooms/${roomname}`).update({
                    time: 'night'
                })
                db.doc(`rooms/${roomname}`).update({
                    ready: 0
                })
            }
            if (doc.data().time == "night") {
                console.log('sdfsdf')
                document.getElementsByClassName('h')[0].style.backgroundImage = "url('assets/daytown.png')";
                document.getElementsByClassName('body')[0].style.background = "linear-gradient(to bottom, #62b8e8, #FFFFFF)";
                document.getElementsByClassName('moon')[0].style.background = "#F2D365";
                db.doc(`rooms/${roomname}`).update({
                    time: 'day'
                })
                db.doc(`rooms/${roomname}`).update({
                    ready: 0
                })

            }
        })
    } else {
        timer--;
    }
};

let mainT = setInterval(mainTimer, 1000);
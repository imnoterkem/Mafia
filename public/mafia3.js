const ready = () => {
    document.getElementById("ready").style.background = "#6BFF7A";
};

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

let roomname = new URL(window.location.href).searchParams.get("r");

db.doc(`rooms/${roomname}`).update({
    time: "day",
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;
        console.log(useruid);
        // document.getElementById('lolo').innerHTML = roomname;
    } else {
    }
});

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
                i++
            ].innerHTML = docu.data().name;
        });
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
                    players = shuffle(arr);
                    db.doc(`rooms/${roomname}`)
                        .update({
                            shuffledArray: players,
                            gameStarted: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                        .then(() => {
                            console.log("done");
                        })
                        .catch((err) => console.log(err));
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

    return array;
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        useruid = user.uid;
        console.log(useruid);
    } else {
    }
});

let sending = false;

const Send = () => {
    const Input = document.getElementById("Input");
    if (Input.value === "") return;

    let s = 0;
    if (Input.value.trim() === "") return;

    Input.value = Input.value.trim();

    if (!sending) {
        db.doc(`rooms/${roomname}/users/${useruid}`)
            .get()
            .then(function (doc) {
                sending = true;

                let sendername = doc.data().name;

                db.collection(`rooms/${roomname}/Chat`)
                    .add({
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        text: Input.value,
                        sender: sendername,
                    })
                    .then(() => {
                        Input.value = "";
                        sending = false;
                    });
            });
    }

    document.getElementsByClassName(
        "display"
    )[0].scrollTop = document.getElementsByClassName("display")[0].scrollHeight;
};

document.getElementsByClassName(
    "display"
)[0].scrollTop = document.getElementsByClassName("display")[0].scrollHeight;

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
            t.innerHTML = doc.data().sender + " : " + doc.data().text;
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

let timer = 60;
let day = true;

const mainTimer = () => {
    document.getElementById("timer").innerHTML = `Auto-Skipping in: ${timer}`;
    if(timer<=0){
        timer=60;
        db.doc(`rooms/${roomname}`).get().then(function(doc){
            if(doc.data().time=='day'){
                console.log('nice');
                document.getElementsByClassName('h')[0].style.backgroundImage="url('/Users/rgS/Desktop/mafia/Mafia/public/assets/nighttown.png')";
                document.getElementsByClassName('body')[0].style.background="linear-gradient(to bottom, #001447, #000000)";
                document.getElementsByClassName('moon')[0].style.background = "#FFE99C";
                db.doc(`rooms/${roomname}`).update({
                    time: 'night'
                })
            }
            if(doc.data().time=="night"){
                console.log('sdfsdf')
                document.getElementsByClassName('h')[0].style.backgroundImage="url('/Users/rgS/Desktop/mafia/Mafia/public/assets/daytown.png')";
                document.getElementsByClassName('body')[0].style.background="linear-gradient(to bottom, #62b8e8, #FFFFFF)";
                document.getElementsByClassName('moon')[0].style.background = "#F2D365";
                db.doc(`rooms/${roomname}`).update({
                    time: 'day'
                })
            }
        })
    }
    else{
        timer--;
    }
};

let mainT = setInterval(mainTimer, 1000);

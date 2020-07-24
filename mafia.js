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

var docRef = db.collection("rooms");
// get data
docRef
    .orderBy("createdAt")
    .get()
    .then(function(querySnapshot) {
        clearRenderedRooms();
        querySnapshot.forEach(function(doc) {
            renderRoom(doc.name, doc.status, doc.currentPlayer);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
// listen data
docRef.onSnapshot(function(querySnapshot) {
    clearRenderedRooms();
    let rooms = [];
    querySnapshot.forEach(function(doc) {
        // console.log(doc.id, " => ", doc.data());
        rooms.push(doc.data());
    });
    rooms
        .sort((a, b) => a.createdAt - b.createdAt)
        .forEach((e) => {
            renderRoom(e.name, e.status, e.currentPlayer);
        });
});

// reset ROOMS
const clearRenderedRooms = () => {
    const myNode = document.getElementById("ROOMS");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
};

const show = () => {
    document.getElementById("button2").style.display = "flex";
    document.getElementById("button").style.display = "none";
    document.getElementById("rooms").style.overflow = "hidden";
};

document.getElementById("cancel").onclick = () => {
    document.getElementById("button2").style.display = "none";
    document.getElementById("button").style.display = "flex";
    document.getElementById("ROOMS").style.overflowY = "scroll";
};

// create room
document.getElementById("create2").onclick = () => {
    if (
        document.getElementById("name").value != "" &&
        document.getElementById("creatername").value != "" &&
        (document.getElementById("privateroom").checked == true ||
            document.getElementById("publicroom").checked == true)
    ) {
        let roomname = document.getElementById("name").value;
        if (document.getElementById("publicroom").checked == true) {
            db.doc(`rooms/${roomname}`).set({
                status: "Public",
                name: roomname,
                createdAt: Date.now(),
                limit: 7,
                currentPlayer: 1,
            })
        } else {
            db.doc(`rooms/${roomname}`).set({
                status: "Private",
                name: roomname,
                createdAt: Date.now(),
                limit: 7,
                currentPlayer: 1,
            })
        }

        firebase
            .auth()
            .signInAnonymously()
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
            });

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var isAnonymous = user.isAnonymous;
                let thename = document.getElementById("creatername").value;
                console.log(thename)
                var uid = user.uid;
                console.log(uid);
                console.log(thename)
                console.log(roomname)
                db.collection(`rooms/${roomname}/users`).doc(`${uid}`).set({
                    name: `${thename}`
                }).then(function() {
                    window.location.href = `mafia2.html?r=${roomname}`;
                })
            }
        })
        document.getElementById("privateroom").checked = false;
        document.getElementById("publicroom").checked = false;
        document.getElementById("name").value = "";
        document.getElementById("button2").style.display = "none";
        document.getElementById("button").style.display = "flex";

    }
}

const renderRoom = (name, status, currentPlayer) => {
    let room = document.createElement("div");
    let roominfo = document.createElement("div");
    let roomtop = document.createElement("div");
    let roombottom = document.createElement("div");
    let roomside = document.createElement("div");
    let image = document.createElement("img");
    let d = document.createElement("div");
    image.src = "icons/privateroom.png";
    image.style.width = "24px";
    image.style.height = "24px";
    room.setAttribute("class", "room");
    roomtop.setAttribute("class", "roomtop");
    roombottom.setAttribute("class", "roombottom");
    roominfo.setAttribute("class", "roominfo");
    d.setAttribute("class", "d");

    roomside.appendChild(roomtop);
    roomside.appendChild(roombottom);
    roominfo.appendChild(roomside);
    room.appendChild(roominfo);

    roomtop.innerHTML = name;
    d.innerHTML = `${currentPlayer}/7`;

    if (status == "Private") {
        let roomstatus = document.createElement("div");
        let roomstatustext = document.createElement("div");
        roomstatus.setAttribute("class", "roomstatus");
        roominfo.appendChild(roomstatus);
        roomstatus.appendChild(roomstatustext);
        roomstatus.appendChild(image);
        roomstatustext.innerText = status;
        roomside.style.width = "80%";
    } else {
        roomside.style.width = "80%";
        let z = document.createElement("div");
        z.style.width = "20%";
        room.append(z);
        roomtop.style.width = "117%";
    }
    document.getElementById("ROOMS").appendChild(room);

    let con = document.createElement("div");

    con.setAttribute("class", "con");
    for (let i = 0; i < 7; i++) {
        circle = document.createElement("div");

        if (i < currentPlayer) {
            circle.style.background = "#3AC348";
        }
        circle.setAttribute("class", "circle");
        con.appendChild(circle);
        d.appendChild(con);
    }
    roombottom.appendChild(d);

    if (currentPlayer < 7) {
        roominfo.onclick = () => {
            let t = room.querySelectorAll("#form");
            if (t.length > 0) return;
            console.log("1111");
            room.style.height = "auto";
            let contForForm = document.createElement("div");
            let askcontainer = document.createElement("div");
            let askname = document.createElement("input");
            let ask = document.createElement("div");
            let bolih = document.createElement("button");
            let oroh = document.createElement("button");
            let confirm = document.createElement("div");
            let asknamecon = document.createElement("div");

            ask.setAttribute("class", "askcont");
            askname.setAttribute("class", "ask");
            askcontainer.setAttribute("class", "askoption");
            asknamecon.setAttribute("class", "ask-con");
            confirm.setAttribute("class", "confirm");
            contForForm.setAttribute("id", "form");

            asknamecon.innerText = "Your name";
            bolih.innerText = "Cancel";
            oroh.innerText = "Join";

            bolih.setAttribute("class", "bolih");
            oroh.setAttribute("class", "oroh");

            if (status == "Private") {
                let roomstatus = document.createElement("div");
                // let roomstatustext = document.createElement("div");
                // roomstatus.setAttribute("class", "roomstatus");
                // room.appendChild(roomstatus);
                // roomstatus.appendChild(roomstatustext);
                // roomstatus.appendChild(image);
                // roomstatustext.innerText = status;
                roomstatus.style.height = "20%";
                let askpassword = document.createElement("input"); //
                let askpasscon = document.createElement("div"); //
                askpassword.setAttribute("class", "ask"); //
                askpasscon.setAttribute("class", "ask-con"); //
                askpasscon.innerText = "Password"; //
                askpasscon.appendChild(askpassword); //
                askcontainer.appendChild(askpasscon); //
            }

            confirm.appendChild(bolih);
            confirm.appendChild(oroh);
            asknamecon.appendChild(askname);
            askcontainer.appendChild(asknamecon);
            askcontainer.appendChild(confirm);
            contForForm.appendChild(askcontainer);
            contForForm.style.marginRight = "20%";
            room.appendChild(contForForm);
            bolih.onclick = () => {
                contForForm.parentNode.removeChild(contForForm);
            };
            // if (askname.value != "") {
            //   oroh.onclick = () => {
            //     docRef.get().then(function () {
            //       let x = currentPlayer + 1;
            //       db.collection("rooms").doc(name).update({
            //         currentPlayer: x,
            //       });
            //     });
            //     window.location.href = `mafia2.html?name=${name}`;
            //   };
            // }

            oroh.onclick = () => {
                docRef.get().then(function() {
                    let x = currentPlayer + 1;
                    db.collection("rooms").doc(name).update({
                        currentPlayer: x,
                    });
                });
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch(function(error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                    });

                firebase.auth().onAuthStateChanged(function(user) {
                    if (user && askname.value !== '') {
                        var isAnonymous = user.isAnonymous;
                        var uid = user.uid;
                        console.log(uid);
                        console.log(askname.value)
                        console.log(name)
                        db.collection(`rooms/${name}/users`).doc(`${uid}`).set({
                            name: `${askname.value}`
                        }).then(function() {
                            window.location.href = `mafia2.html?r=${name}`;
                        })
                    } else {
                        console.log('gg1');
                    }
                });
            };
        };
    } else {
        room.onclick = () => {
            // room.style.border = "1px solid red";
            // room.style.border = "0.7px solid #000000";
        };
    }
};

const search = () => {
    document.getElementById("button").style.width = "80%";
    document.getElementById("create").style.display = "none";
    document.getElementById("searchinput").style.display = "flex";
};

const hidesearchinput = () => {
    document.getElementById("searchinput").style.display = "none";
    document.getElementById("create").style.display = "flex";
};
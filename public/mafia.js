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

let joinClicked = false;

var docRef = db.collection("rooms");

//listen data
let rooms = [];
docRef.onSnapshot(function (querySnapshot) {
    clearRenderedRooms();
    document.getElementById("ROOMS").innerHTML = '';
    querySnapshot.forEach(function (doc) {
        let data = doc.data();
        data["id"] = doc.id;

        rooms.push(data);
    });
    rooms
        .sort((a, b) => a.createdAt - b.createdAt)
        .forEach((e) => {
            if (e.currentPlayer <= 0) {
                db.doc(`rooms/${e.name}`).delete();
            }
            renderRoom(e.name, e.status, e.currentPlayer, e.password);
        });
});

// reset ROOMS
const clearRenderedRooms = () => {
    const myNode = document.getElementById("ROOMS");
    myNode.innerHTML = "";
};

const hidesearchinput = () => {

   
    document.getElementById("ROOMS").innerHTML = '';
    document.getElementById("searchinput").value = "";
    document.getElementById("searchinput").style.display = "none";
    document.getElementById("create").style.display = "flex";
    document.getElementById("cancelsearch").style.display = "none";
    document.getElementById("searchroom").style.display = "none";
    document.getElementById("button").style.width = "15%";
    document.getElementById("search").style.width = "35px";
    docRef
        .orderBy("createdAt")
        .get()
        .then(function (querySnapshot) {
           
            querySnapshot.forEach(function (doc) {
                let data = doc.data();

                renderRoom(
                    data.name,
                    data.status,
                    data.currentPlayer,
                    data.password
                );
            });
            console.log(roomNames);
        });
};

const searchrooms = () => {
    document.getElementById("ROOMS").innerHTML = "";
    db.collection("rooms")
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let data = doc.data();
                if (document.getElementById("searchinput").value == data.name) {
                    renderRoom(
                        data.name,
                        data.status,
                        data.currentPlayer,
                        data.password
                    );
                }
            });
        });
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
    document.getElementById("privateroom").checked = false;
    document.getElementById("publicroom").checked = false;
    document.getElementById("name").value = "";
    document.getElementById("creatername").value = "";
    if (document.getElementById("passwordcont")) {
        document
            .getElementById("roomoptioncontainer")
            .removeChild(document.getElementById("passwordcont"));
    }
};

// create room
const roomName = db.doc(`rooms/${roomname}`);
const priv = () => {
    let passwordinput = document.createElement("input");
    let passwordcont = document.createElement("div");
    passwordcont.setAttribute("id", "passwordcont");
    passwordinput.setAttribute("id", "passwordinput");
    passwordcont.innerText = "Өрөөний нууц үг";
    passwordcont.appendChild(passwordinput);
    document.getElementById("roomoptioncontainer").appendChild(passwordcont);
};

const publ = () => {
    if (document.getElementById("passwordcont")) {
        document
            .getElementById("roomoptioncontainer")
            .removeChild(document.getElementById("passwordcont"));
    }
};
console.log(rooms);
document.getElementById("create2").onclick = () => {
    if (
        rooms.filter((el) => el.name === document.getElementById("name").value)
            .length > 0
    ) {
        if (
            document.getElementById("name").value != "" &&
            document.getElementById("creatername").value != "" &&
            (document.getElementById("privateroom").checked == true ||
                document.getElementById("publicroom").checked == true)
        ) {
            let roomname = document.getElementById("name").value;
            if (
                document.getElementById("privateroom").checked == true &&
                document.getElementById("passwordinput").value != ""
            ) {
                db.doc(`rooms/${roomname}`).set({
                    status: "Private",
                    password: document.getElementById("passwordinput").value,
                    name: roomname,
                    createdAt: Date.now(),
                    limit: 7,
                    currentPlayer: 1,
                    ready: 0,
                    shuffled: false,
                    isChatDeleted: false,
                });
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        let thename = document.getElementById("creatername")
                            .value;
                        var uid = user.uid;
                        db.collection(`rooms/${roomname}/users`)
                            .doc(`${uid}`)
                            .set({
                                name: `${thename}`,
                                ready: false,
                                role: "none",
                            })
                            .then(function () {
                                window.location.href = `mafia2.html?r=${roomname}`;
                            });
                    }
                });
            } else if (document.getElementById("publicroom").checked == true) {
                db.doc(`rooms/${roomname}`).set({
                    status: "Public",
                    name: roomname,
                    createdAt: Date.now(),
                    limit: 7,
                    currentPlayer: 1,
                    ready: 0,
                    shuffled: false,
                    isChatDeleted: false,
                });
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        let thename = document.getElementById("creatername")
                            .value;
                        var uid = user.uid;
                        console.log(thename);
                        db.collection(`rooms/${roomname}/users`)
                            .doc(`${uid}`)
                            .set({
                                name: `${thename}`,
                                ready: false,
                                role: "none",
                            })
                            .then(function () {
                                document.getElementById("creatername").value =
                                    "";
                                window.location.href = `mafia2.html?r=${roomname}`;
                            });
                    }
                });
            }

            // firebase.auth().onAuthStateChanged(function (user) {
            //     if (user) {
            //         var isAnonymous = user.isAnonymous;
            //         let thename = document.getElementById("creatername").value;
            //         console.log(thename);
            //         var uid = user.uid;
            //         console.log(uid);
            //         console.log(thename);
            //         console.log(roomname);
            //         db.collection(`rooms/${roomname}/users`)
            //             .doc(`${uid}`)
            //             .set({
            //                 name: `${thename}`,
            //                 ready: false,
            //                 role: "none",
            //             })
            //             .then(function () {
            //                 document.getElementById("creatername").value = "";
            //                 window.location.href = `mafia2.html?r=${roomname}`;
            //             });
            //     }
            // });
        } 
        document.getElementById("privateroom").checked = false;
        document.getElementById("publicroom").checked = false;
        document.getElementById("name").value = "";

        document.getElementById("button2").style.display = "none";
        if (document.getElementById("passwordcont")) {
            document
                .getElementById("roomoptioncontainer")
                .removeChild(document.getElementById("passwordcont"));
        }
        document.getElementById("button").style.display = "flex";
    
    }
     
};
//end

const renderRoom = (name, status, currentPlayer, password) => {
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
            room.style.height = "auto";
            let contForForm = document.createElement("div");
            let askcontainer = document.createElement("div");
            let askname = document.createElement("input");
            let ask = document.createElement("div");
            let bolih = document.createElement("button");
            let oroh = document.createElement("button");
            let confirm = document.createElement("div");
            let asknamecon = document.createElement("div");

            askname.maxLength = "10";
            ask.setAttribute("class", "askcont");
            askname.setAttribute("class", "ask");
            askcontainer.setAttribute("class", "askoption");
            asknamecon.setAttribute("class", "ask-con");
            confirm.setAttribute("class", "confirm");
            contForForm.setAttribute("id", "form");

            asknamecon.innerText = "Таны нэр";
            bolih.innerText = "цуцлах";
            oroh.innerText = "нэгдэх";

            bolih.setAttribute("class", "bolih");
            oroh.setAttribute("class", "oroh");

            if (status == "Private") {
                let x = password;
                let roomstatus = document.createElement("div");
                roomstatus.style.height = "20%";
                let askpassword = document.createElement("input"); //
                let askpasscon = document.createElement("div"); //
                askpassword.setAttribute("class", "ask"); //
                askpasscon.setAttribute("class", "ask-con"); //
                askpasscon.innerText = "Password"; //
                askpasscon.appendChild(askpassword); //
                askcontainer.appendChild(askpasscon); //

                confirm.appendChild(bolih);
                confirm.appendChild(oroh);
                asknamecon.appendChild(askname);
                askcontainer.appendChild(asknamecon);
                askcontainer.appendChild(confirm);
                contForForm.appendChild(askcontainer);
                contForForm.style.marginRight = "20%";
                room.appendChild(contForForm);
                oroh.onclick = () => {
                    let sk = askpassword.value;
                    if (sk == x) {
                        firebase
                            .auth()
                            .signInAnonymously()
                            .catch(function (error) {
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                console.log(errorCode, " ", errorMessage);
                            });
                        firebase.auth().onAuthStateChanged(function (user) {
                            if (user && askname.value !== "") {
                                var uid = user.uid;
                                if (!joinClicked) {
                                    joinClicked = true;
                                    joinRoom(name, uid);
                                }
                                db.collection(`rooms/${name}/users`)
                                    .doc(`${uid}`)
                                    .set({
                                        name: `${askname.value}`,
                                        ready: false,
                                        role: "none",
                                    })
                                    .then(function () {
                                        window.location.href = `mafia2.html?r=${name}`;
                                    });
                            }
                        });
                    }
                };
            } else {
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

                oroh.onclick = () => {
                    firebase
                        .auth()
                        .signInAnonymously()
                        .catch(function (error) {
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            console.log(errorCode, " ", errorMessage);
                        });
                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user && askname.value !== "") {
                            var uid = user.uid;
                            if (!joinClicked) {
                                joinClicked = true;
                                joinRoom(name, uid);
                            }
                            db.collection(`rooms/${name}/users`)
                                .doc(`${uid}`)
                                .set({
                                    name: `${askname.value}`,
                                })
                                .then(function () {
                                    window.location.href = `mafia2.html?r=${name}`;
                                });
                        }
                    });
                };
            }
            bolih.onclick = () => {
                contForForm.parentNode.removeChild(contForForm);
            };
        };
    }
};

const search = () => {
    document.getElementById("button").style.width = "80%";
    document.getElementById("create").style.display = "none";
    document.getElementById("searchinput").style.display = "flex";
    document.getElementById("cancelsearch").style.display = "flex";
    document.getElementById("searchroom").style.display = "flex";
    document.getElementById("search").style.width = "80%";
    document.getElementById("searchinput").style.height = "90%";
    document.getElementById("searchinput").style.width = "92%";
};

const joinRoom = (name, uid) => {
    db.runTransaction((t) => {
        let ref = db.collection("rooms").doc(name);
        return t.get(ref).then((doc) => {
            if (doc.data().currentPlayer < 8) {
                (nowplayer = 1 + doc.data().currentPlayer),
                    t.update(ref, {
                        currentPlayer: nowplayer,
                        latestJoiner: uid,
                    });
            }
        });
    }).then(() => {
        return console.log("joined  room");
    });
};

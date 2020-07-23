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
            });
        } else {
            db.doc(`rooms/${roomname}`).set({
                status: "Private",
                name: roomname,
                createdAt: Date.now(),
                limit: 7,
                currentPlayer: 1,
            });
        }
        document.getElementById("privateroom").checked = false;
        document.getElementById("publicroom").checked = false;
        document.getElementById("name").value = "";
        document.getElementById("button2").style.display = "none";
        document.getElementById("button").style.display = "flex";
    }
};
// render rooms
const renderRoom = (name, status, currentPlayer) => {
    let room = document.createElement("div");
    let roomtop = document.createElement("div");
    let roombottom = document.createElement("div");
    let roomside = document.createElement("div");
    let image = document.createElement("img");
    image.src = "icons/privateroom.png";
    image.style.width = "24px";
    image.style.height = "24px";
    room.setAttribute("class", "room");
    roomtop.setAttribute("class", "roomtop");
    roombottom.setAttribute("class", "roombottom");

    roomside.appendChild(roomtop);
    roomside.appendChild(roombottom);
    room.appendChild(roomside);

    roomtop.innerHTML = name;
    roombottom.innerHTML = `${currentPlayer}/7`;

    if (status == "Private") {
        let roomstatus = document.createElement("div");
        let roomstatustext = document.createElement("div");
        roomstatus.setAttribute("class", "roomstatus");
        room.appendChild(roomstatus);
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
        roombottom.appendChild(con);
    }

    if (currentPlayer < 7) {
        room.onclick = () => {
            console.log("1111");
            room.style.height = 80 + "%";
            let askcontainer = document.createElement("div");
            let askname = document.createElement("input");
            let askpassword = document.createElement("input");
            let ask = document.createElement("div");
            let bolih = document.createElement("button");
            let oroh = document.createElement("button");
            let confirm = document.createElement("div");

            ask.appendChild(askname, askpassword);
            confirm.appendChild(bolih, oroh);
            askcontainer.appendChild(ask, confirm);
            roombottom.appendChild(askcontainer);
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








firebase.auth().signInAnonymously().catch(function(error) {

    var errorCode = error.code;
    var errorMessage = error.message;
});


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        console.log(uid);
        // window.location.href = 'mafia2.html';   
    } else {

    }

});
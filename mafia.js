
var firebaseConfig = {
    apiKey: "AIzaSyAMppKcZo4sa9GjtknjiRyCVt2_yNexh9M",
    authDomain: "team-up-aff0e.firebaseapp.com",
    databaseURL: "https://team-up-aff0e.firebaseio.com",
    projectId: "team-up-aff0e",
    storageBucket: "team-up-aff0e.appspot.com",
    messagingSenderId: "874195963351",
    appId: "1:874195963351:web:d3a1d27d2f4225dff54f92",
    measurementId: "G-WRG3X3HCKY"
}; firebase.initializeApp(firebaseConfig);

const fs = firebase.firestore();

const show = () => {
    document.getElementById('button2').style.display = "flex";
    document.getElementById('button').style.display = "none";
}

document.getElementById('cancel').onclick = () => {
    document.getElementById('button2').style.display = "none";
    document.getElementById('button').style.display = "flex";
}

j = 0;
document.getElementById('create2').onclick = () => {
    if (document.getElementById("name").value != "" && (document.getElementById("privateroom").checked == true || document.getElementById('publicroom').checked == true)) {

        let room = document.createElement('div');
        let roomtop = document.createElement('div');
        let roombottom = document.createElement('div');
        let roomside = document.createElement('div');
        let roomstatus = document.createElement('div');

        room.setAttribute("id", "room");
        roomtop.setAttribute('id', "roomtop");
        roombottom.setAttribute('class', 'roombottom');
        roomstatus.setAttribute('id', 'roomstatus');

        roomside.appendChild(roomtop);
        roomside.appendChild(roombottom);
        room.appendChild(roomside);
        room.appendChild(roomstatus);

        roomtop.innerHTML = document.getElementById('name').value;
        roombottom.innerText = "1/7"
        // roomstatus.innerHTML =

        // <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        //     <path fill-rule="evenodd" clip-rule="evenodd" d="M5.33348 10.6667C5.33348 4.77564 10.1091 1.2316e-05 16.0001 1.2316e-05C21.8912 1.2316e-05 26.6668 4.77564 26.6668 10.6667V12.8H5.33348V10.6667ZM9.06695 10.6666C9.06695 6.83744 12.1711 3.73328 16.0003 3.73328C19.8295 3.73328 22.9336 6.83744 22.9336 10.6666V12.8H9.06695V10.6666ZM8 15.4668C3.58172 15.4668 0 19.0485 0 23.4667V29.3334C0 33.7517 3.58172 37.3334 8 37.3334H24C28.4183 37.3334 32 33.7517 32 29.3334V23.4668C32 19.0485 28.4183 15.4668 24 15.4668H8Z" fill="#616161" />
        // </svg>

        roomside.style.height = "100%";
        roomside.style.width = "80%";
        document.getElementById('JINHENEROOMS').appendChild(room);

        for (let i = 0; i < 7; i++) {
            circle = document.createElement('div');
            circle.setAttribute('class', 'circle');
            document.getElementsByClassName('roombottom')[j].appendChild(circle);
        }
        document.getElementsByClassName('circle')[6].style.background="#3AC348"; 

        let roomname = document.getElementById("name").value;
        if (document.getElementById('publicroom').checked == true) {
            document.getElementById('roomstatus').innerText = "Public";
            fs.doc(`rooms/${roomname}`).set({
                status: 'public'
            })
        }
        else {
            fs.doc(`rooms/${roomname}`).set({
                status: 'private'
            })
        }
        document.getElementById("privateroom").checked = false;
        document.getElementById('publicroom').checked = false;
        document.getElementById('name').value = "";
        document.getElementById('button2').style.display = "none";
        document.getElementById('button').style.display = "flex";
        j++;
    }
}

// window.onload = ()=>{
//     console.log("load");
//     fs.collection(`rooms`).onSnapshot(function(querySnapshot) {
//         console.log('1')
//     })
//}





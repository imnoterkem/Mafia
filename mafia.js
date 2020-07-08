
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

document.getElementById('create2').onclick = () => {
    if (document.getElementById("name").value != "" && (document.getElementById("privateroom").checked == true || document.getElementById('publicroom').checked == true)) {
        let roomname = document.getElementById("name").value;
        if (document.getElementById('publicroom').checked == true) {
            fs.doc(`rooms/${roomname}`).set({
                status: 'public'    
            })
        }
        else{
            fs.doc(`rooms/${roomname}`).set({
                status: 'private'
            })
        }
    }
}
window.onload = ()=>{
    console.log("load");
    fs.collection(`rooms`).onSnapshot(function(querySnapshot) {
        console.log('1')
    })
}





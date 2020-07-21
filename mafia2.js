
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC78FRamszBxuCmSeL8ZGhduuXeqqrBnf4",
  authDomain: "team-up-73173.firebaseapp.com",
  databaseURL: "https://team-up-73173.firebaseio.com",
  projectId: "team-up-73173",
  storageBucket: "team-up-73173.appspot.com",
  messagingSenderId: "1030300585767",
  appId: "1:1030300585767:web:6577af963515d152b32302"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const ready = () => {
  document.getElementById("ready").classList.toggle('green');
}
let roomname = new URL(window.location.href).searchParams.get("r");
const Send = () => {
  const Input = document.getElementById('Input');
  // const inputValue = document.getElementById("Input").value;
  // const t = document.createTextNode(inputValue);
  const d = document.createElement('div');
  d.innerHTML=Input.value
  d.classList.add('msgs')
  document.getElementsByClassName('chatbox')[0].appendChild(d);
  
  db.collection(`rooms/${roomname}/Chat`).add({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    text: Input.value
  })
  document.getElementById('Input').value = " ";
}
console.log(roomname)

db.collection(`rooms`).doc(`${roomname}`).collection('Chat').orderBy('createdAt')
  .onSnapshot(function (querySnapshot) {

    // console.log(docs);
    // for (var i = 0; i < docs.size; i++) {
    //   console.log(docs[i].data().text);
    // }
    document.getElementsByClassName('chatbox')[0].innerHTML=''
    querySnapshot.forEach(function(doc) {
      // cities.push(doc.data().name);
      // console.log(doc.data())
      
      const t = document.createElement("div")
      t.innerHTML=doc.data().text;  
      t.classList.add('msgs');
      document.getElementsByClassName('chatbox')[0].append(t);
      
    });
  });


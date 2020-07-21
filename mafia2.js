
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
const db=firebase.firestore();

const ready = () => {
  document.getElementById("ready").classList.toggle('green');
}

const Send = () => {
  const Input = document.getElementById('Input');
  const inputValue = document.getElementById("Input").value;
  const t = document.createTextNode(inputValue);
  document.getElementsByClassName('chatbox')[0].appendChild(t);
  document.getElementById('Input').value = " "
  db.collection('rooms/tt/Chat').add ({
    text: inputValue
  })
}
db.collection("rooms/tt/Chat")[0].onSnapshot(function(doc) {
        console.log(doc.data())
    });




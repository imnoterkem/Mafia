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
    if (Input.value === '' ){
      return;
    }
    let s=0;
    while(Input.value[s]===" "){
      s++;
    }
    Input.value=Input.value.slice(s, Input.value.length)
    if (Input.value === '' ){
      return;
    }
      const d = document.createElement('div');
      d.innerHTML = Input.value.trim();
      d.classList.add('msgs')
      document.getElementsByClassName('chatbox')[0].appendChild(d);
      
      db.collection(`rooms/${roomname}/Chat`).add({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          text: Input.value
      })
      document.getElementById('Input').value = "";
      document.getElementsByClassName('chatbox')[0].scrollTop = document.getElementsByClassName('chatbox')[0].scrollHeight;
  }

  console.log(roomname)

  db.collection(`rooms`).doc(`${roomname}`).collection('Chat').orderBy('createdAt')
      .onSnapshot(function(querySnapshot) {

          // console.log(docs);
          // for (var i = 0; i < docs.size; i++) {
          //   console.log(docs[i].data().text);
          // }
          document.getElementsByClassName('chatbox')[0].innerHTML = ''
          querySnapshot.forEach(function(doc) {
              // cities.push(doc.data().name);
              // console.log(doc.data())

              const t = document.createElement("div")
              t.innerHTML = doc.data().text;
              t.classList.add('msgs');
              document.getElementsByClassName('chatbox')[0].append(t);

          });
          document.getElementsByClassName('chatbox')[0].scrollTop = document.getElementsByClassName('chatbox')[0].scrollHeight;
      });
  let input = document.getElementById("Input");
  document.onkeyup = (event) => {
      console.log("1111");
      if (event.keyCode === 13) {
          Send();
      }
  }
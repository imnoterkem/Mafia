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
  let useruid = null;
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          // User is signed in.
          var isAnonymous = user.isAnonymous;
          useruid = user.uid;
          db.doc(`users/${useruid}`).set({
              name: "tester1"
          })
          console.log(useruid);
      } else {
          // User is signed out.
          // ...
      }
      // ...
  });

  const ready = () => {
      document.getElementById("ready").classList.toggle('green');
  }
  let roomname = new URL(window.location.href).searchParams.get("r");
  const Send = () => {
      const Input = document.getElementById('Input');
      if (Input.value === '') {
          return;
      }
      let s = 0;
      while (Input.value[s] === " ") {
          s++;
      }
      Input.value = Input.value.slice(s, Input.value.length)
      if (Input.value === '') {
          return;
      }
      //   const d = document.createElement('div');
      //   d.innerHTML = Input.value.trim();
      //   d.classList.add('msgs')
      //   document.getElementsByClassName('chatbox')[0].appendChild(d);
      db.collection(`rooms/${roomname}/Chat`).add({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          text: Input.value,
          sender: useruid && useruid
      })
      document.getElementById('Input').value = "";
      document.getElementsByClassName('chatbox')[0].scrollTop = document.getElementsByClassName('chatbox')[0].scrollHeight;
  }

  console.log(roomname)

  db.collection(`rooms`).doc(`${roomname}`).collection('Chat').orderBy('createdAt')
      .onSnapshot(function(querySnapshot) {
          document.getElementsByClassName('chatbox')[0].innerHTML = ''
          querySnapshot.forEach(function(doc) {
              // cities.push(doc.data().name);
              // console.log(doc.data())
              let nickname;
              const t = document.createElement("div")
              db.collection("users").doc(`${doc.data().sender}`).onSnapshot(function(docu) {
                  if (docu.exists) {

                      nickname = docu.data().name;
                      t.innerHTML = nickname + ':' + doc.data().text;
                      t.classList.add('msgs');
                      document.getElementsByClassName('chatbox')[0].append(t);
                      document.getElementsByClassName('chatbox')[0].scrollTop = document.getElementsByClassName('chatbox')[0].scrollHeight;
                  } else {
                      //onsole.log("gg");
                  }
              });


          });

      });
  let input = document.getElementById("Input");
  document.onkeyup = (event) => {
      if (event.keyCode === 13) {
          Send();
      }
  }
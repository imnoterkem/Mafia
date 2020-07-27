// const show = () => {
//     document.getElementById('button').removeChild(document.getElementById('search'))
//     let contjr=document.createElement('div');
//     contjr.setAttribute("id", "smallcontainer")
//     let s=document.getElementById('button');
//     s.style.height="auto";
//     s.style.width="auto";
//     s.style.alignItems="flex-start";
//     s.style.marginTop="13px"
//     s.appendChild(contjr);

//     let roomname=document.createElement('div');
//     roomname.setAttribute('id','roomname')
//     let name=document.createElement('input');
//     name.setAttribute('id', 'name')
//     roomname.innerText="Room Name";
//     roomname.appendChild(name);
//     contjr.appendChild(roomname);

//     let roomoptiontext=document.createElement('div');
//     let roomoptioncontainer=document.createElement('div');
//     let roomoption=document.createElement('div');
//     let roomoption2=document.createElement('div');
//     let check=document.createElement('input');
//     let check2=document.createElement('input');
//     roomoptiontext.setAttribute('id', 'optiontext');
//     roomoptioncontainer.setAttribute('id', 'roomoptioncontainer')
//     roomoptiontext.innerText="Your room is:"
//     check.type="radio";
//     check.name="public";
//     check2.type="radio";
//     check2.name="public";
//     roomoption.innerText="Public";
//     roomoption2.innerText="Private";
//     contjr.appendChild(roomoptiontext);
//     roomoption.appendChild(check);
//     roomoption2.appendChild(check2);
//     roomoptioncontainer.appendChild(roomoption);
//     roomoptioncontainer.appendChild(roomoption2);
//     contjr.appendChild(roomoptioncontainer);

//     let buttons=document.createElement('div');
//     buttons.setAttribute('id', 'buttoncontainer');
//     let cancel=document.createElement('button');
//     cancel.innerText="Cancel";
//     cancel.setAttribute('id', 'cancel');
//     let create=document.createElement('button');
//     create.innerText="Create Room";
//     create.setAttribute('id', 'create2');
//     buttons.appendChild(cancel);
//     buttons.appendChild(create);
//     contjr.appendChild(buttons);
// }
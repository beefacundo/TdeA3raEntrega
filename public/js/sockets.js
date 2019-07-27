socket = io();

// document.addEventListener("DOMContentLoaded", ()=> { 
// 	const usr = document.querySelector('#pubUsr').value;
// });

socket.on("newUsr", data =>{
	const chat = document.querySelector('#usrOnline');
	let result = '';
	data.forEach(item=>{
		result = result + '<p>' + item.name + '</p>';
	});
	chat.innerHTML  = result;
});

socket.on("usrDisconnected", data => {
	const chat = document.querySelector('#usrOnline');
	let result = '';
	data.forEach(item=>{
		result = result + '<p>' + item.name + '</p>';
	});
	chat.innerHTML  = result;
	
});

document.addEventListener("DOMContentLoaded", ()=> { 
	const usr = document.querySelector('#pubUsr').value;
	if (usr){
			socket.emit("newUsr", usr);
	}
	document.querySelector('#privateForm').addEventListener('submit', (data) =>{
		data.preventDefault();
		const baro = document.querySelector('#privDest').value;
		const msg = data.target.elements.privateMsg;
		const chat = document.querySelector('#privChat');
		let inf = {
			name: usr,
			destinator: baro,
			info: msg.value
		};
		socket.emit("newPrivMsg", inf, ()=>{
			msg.value = '';
			msg.focus();
		});
	});
	document.querySelector('#publicForm').addEventListener('submit', (data) =>{
		data.preventDefault();
		const msg = data.target.elements.publicMsg;
		const chat = document.querySelector('#pubChat');
		socket.emit("newMsg", {name: usr, info: msg.value}, ()=>{
			msg.value = '';
			msg.focus();
		});
	});
});

socket.on("newMsg", data => {
	const chat = document.querySelector('#pubChat');
	chat.innerHTML  = chat.innerHTML + '<p>' + data.name + ': ' + data.info + '</p>';

});

//	document.addEventListener("DOMContentLoaded", ()=> {});

socket.on("newPrivMsg", data => {
	const chat = document.querySelector('#privChat');
	chat.innerHTML  = chat.innerHTML + '<p>' + data.name + ': ' + data.info + '</p>';

});

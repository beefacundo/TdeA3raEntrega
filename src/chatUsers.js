class ChatUsers{
	constructor() {
		this.users = []
	}

	addUser (id, name){
		let usr = {id, name};
		return this.users.push(usr);
	}

	getAllUsers(){
		return this.users;
	}

	getUser(id){
		return this.users.filter(user => user.id == id)[0];
	}

	deleteUser(id){
		let delUsr = this.getUser(id);
		this.users = this.users.filter(user => user.id != id);
		return delUsr;
	}

	getReceiver(name){
		return this.users.filter(user => user.name == name)[0];
	}
};


module.exports = {
	ChatUsers
} 
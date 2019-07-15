const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const userSchema = new Schema({
	index: {
		type: Number,
		min:1,
	},
	isActive: {
		type: Boolean,
		default: true
	},
	age: {
		type: Number,
		min: 18,
		required: true
	},
	name : {
		type : String,
		required : true	,
		trim : true
	},
	gender: {
		type: String,
		enum: {values: ['male', 'female']}
	},
	email: {
		type: String,
		match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
	},
	phone: {
		type: String
		//match:/\+\d{2}\(\d{3}\)\d{3}-\d{3}/

	},
	adress:{
		type: String
	},
	registered:{
		type: Date
	},
	role: {
		type: String,
		enum: {values:['admin','student','teacher']}, 
		default: 'student'
	},
	dni: {
		type: String,
		match: /\d{7,8}/
	},
	password :{
		type : String,
		required : true
		//match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
		//The string must contain at least 1 lowercase alphabetical 
		//The string must contain at least 1 uppercase alphabetical 
		//The string must contain at least 1 numeric character
		//The string must contain at least one special character, but 
		//The string must be eight characters or longer
	}
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User
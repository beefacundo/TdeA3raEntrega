require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
var MemoryStore = require('memorystore')(session)
const bcrypt = require('bcrypt')
const publicDir = path.join(__dirname,'../public');
const partialsDir = path.join(__dirname,'../partials');
const dirNode_modules = path.join(__dirname , '../node_modules')

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

//USING DB
const User = require('./models/users');
const Course = require('./models/courses');
const Insc = require('./models/inscriptions');

app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  	secret: 'beefacundo',
  	resave: true,
  	saveUninitialized: true
}))

app.use((req, res, next) =>{
	if(req.session.usuario){		
		res.locals.sesion = true
		res.locals.nombre = req.session.nombre
		res.locals.role = req.session.role
		res.locals.ID = req.session.id
	}	
	next();
});

app.use(express.static(publicDir));
hbs.registerPartials(partialsDir);
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine','hbs');


app.get('/', (req, res) => {
		let admin = req.session.role ? req.session.role : false
		let filter
		if (req.session.role == 3){
			filter = {}
		} else {
			filter = {status: true}
		}
		Course.find(filter).exec((err, response)=>{
			if (err){
				return console.log(err);
			}
			res.render('../views/index',{
				lista: response,
				created: req.query.created,
				admin: admin,
				incripted: req.query.inscripted,
				error1: req.query.error1,
				nombre: req.session.nombre
			})
		});
	});

//Craer Curso
app.get('/crearCurso', function (req, res){
	if (res.locals.sesion){
		res.render('../views/crearCurso', {
        	error: req.query.error,
        	created: req.query.created,
        	admin : req.sesion.role
        });
	} else {
		res.redirect('/login');
	}
});

app.post('/crearCurso', function(req,res){
	Course.findById(req.body.id).exec((err, resp)=>{
		if (err){
			return console.log(err);
		}
		if (resp){
			res.redirect('/crearCurso?error=1');
		} else{
			let index = courses.length + 1;
			var status = (req.body.status == "on")? true : false;
			var remote = (req.body.remote == 1)? true : false;
			let course = new Course ({
				'id': req.body.id,
				'name': req.body.name,
				'description': req.body.desc,
				'teacher': req.body.teacher,
				'places': 40,
				'free': 40,
				'remote': remote,
				'status': status,
				'cost': req.body.cost,
				'durationHs':req.body.hs,
				'index':index
			});
			
			course.save((err, resp)=>{
				if (err){
					return console.log(err);
				}
				res.redirect('/crearCurso?created=1');
			});
			

		}
	});
});

app.get('/inscripcion/:courseID', function (req, res){
	if (res.locals.sesion){
		let admin = req.session.role ? req.session.role : false
		let userID = req.session.ID
		Course.findById(req.params['courseID']).exec((err, response)=>{
			if (err){
				return console.log(err);
			}
			let userData
			if (response) {
				User.findById(userID).exec((err, resp)=>{
					if(err){
						return console.log(err);
					}
					userData = resp
				});
				res.render('../views/inscripcion', {
					curso: response,
		        	error: req.query.error,
		        	admin : admin,
		        	user: userData
		        });
			}
		});
	} else {
		res.redirect('/login');
	}
});

app.post('/inscripcion', function(req,res){
	Insc.find({courseID: req.body.courseID, userID: req.body.userID}).exec((err, resp)=>{
		if (err){
			return console.log(err);
		}
		if (resp){
			res.redirect('/inscripcion/'+ req.body.courseID +'?error=1');
		}else {
			let index
			Insc.find().exec((err, resp)=>{
				if (err){
					return console.log(err);
				}
				index = resp.length + 1;
			});
			var status = (req.body.status == "on")? true : false;
			var remote = (req.body.remote == 1)? true : false;
			let insc = new Insc({
				'index': index,
				'courseID': req.body.courseID,
				'userID': req.body.userID,
				'registered': new Date()
			});
			insc.save((err, resp)=>{
				if (err){
					return console.log(err);
				}
				res.redirect('/?inscripted=1');
			});

		}
	});
});

app.get('/inscriptos', function (req, res){
	if (!res.locals.sesion){
		let admin = req.session.role ? req.session.role : false
		let userID = req.session.ID
		var lista = []
		let inscriptions;
		Insc.find().exec((err,resp)=>{
			if (err){
				return console.log(err);
			}
			if (resp){
				inscriptions = resp;
			let cursos;
			Course.find().exec((err, resp)=>{
				if (err){
					return console.log(err);
				}
				if (resp){
					cursos = resp;
					let est;
					User.find().exec((err, resp)=>{
						if (err){
							return console.log(err);
						}
						if (resp){
							est = resp;
							inscriptions.forEach(function(insc){
								let record = {}
								let curso;
								cursos.find(function(item){
									if (item.adminId == insc.courseID){
										curso = item;
									}
								});
								let user
								est.find(function(item){
									if (item.index == insc.userID){
										user = item;
									}
								});
								record.ind = insc.index;
								record.idCurso = insc.courseID;
								record.stateCur = curso.status;
								record.nameCur = curso.name;
								record.idUser = insc.userID;
								record.nameUsr = user.name;
								record.phoneUsr = user.phone;
								lista.push(record);
							});
								let userData
								User.findById(req.session.userID).exec((err, resp)=>{
									if(err){
										return console.log(err);
									}
									userData = resp
								});
							res.render('../views/inscripted',{
								lista:lista,
								admin: 1,
								user: userData,
								regNotElim: req.query.regNotElim,
								regElim: req.query.regElim

							});
						}
					});
				}
			});
			}
		});
	} else {
		res.redirect('/login');
	}
});

app.post('/close', function(req,res){
	Course.findByIdAndUpdate(req.body.idCurso, {$set: {status: false}},{new: true},(err, resp)=>{
		if (err){
			console.log(err);
		}
		res.redirect('/inscriptos');
	});
});

app.post('/deleteInp', function(req,res){
	Insc.findOneAndDelete({courseID: req.body.idCurso, userID: req.body.idEst}).exec((err, resp)=>{
		if (err){
			res.redirect('/inscriptos?regNotElim=1');
			return console.log(err);
		}
		if (resp){
			res.redirect('/inscriptos?regElim=1');	
		} else {
			res.redirect('/inscriptos?regNotElim=1');
		}
	})
});

app.post('/delete', function(req,res){
	Insc.deleteOne({id: req.body.inscId}).exec((err, resp)=>{
		if (err){
			res.redirect('/inscriptos?regNotElim=1');
			return console.log(err);
		}
		if (resp){
			res.redirect('/inscriptos?regElim=1');
		} else {
			res.redirect('/inscriptos?regNotElim=1');
		}
	});
});
app.get('/login', function (req, res){
		if (res.locals.sesion){
			res.redirect('/');
		} else {
	        res.render('../views/login', {
	        	errorLogin: req.query.errorLogin,
	        	errorLoginRead: req.query.errorLoginRead
	        });
		}
});
app.post('/login', function(req, res){
	User.findOne({email: req.body.email}, (err, resp)=>{
		if (err){
			console.log(err);
			res.redirect('/login?errorLoginRead=1');
		}
		if (resp && bcrypt.compareSync(req.body.pass, resp.password)){
			req.session.usuario = resp.id;	
			req.session.nombre = resp.name;
			res.redirect('/');
		} else {
			res.redirect('/login?errorLogin=1');	
		}
	});
	
});

app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
  		if (err) return console.log(err) 	
	})	
	res.redirect('/')	
})


mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultado) => {
	if (err){
		return console.log(err)
	}
	console.log("conectado")
});

app.listen(process.env.PORT, () => {
	console.log ('servidor en el puerto ' + process.env.PORT)
});
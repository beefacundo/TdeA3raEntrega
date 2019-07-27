require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//Session Management
const session = require('express-session')
var MemoryStore = require('memorystore')(session)


//PasswordEncription
const bcrypt = require('bcrypt')
//Mail Sender
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//File Uploder
const defAv = "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";//require('../public/img/defAv');
const multer = require('multer');
//var storage = multer.diskStorage({
	//destination: (req,file, res)=> {
		//res(null, 'public/img')
	//},
	//filename: (req,file, res)=> {
		//res(null, 'avatar' + req.body.name + path.extname(file.originalname))
	//},
//});
//img: req.file.name
//var upload = multer({dest: 'upload/'});

//SOCKETS
const server = require('http').createServer(app);
const io = require('socket.io')(server);


var uploadImg = multer({
	limits:{
		fileSise: 3000000
	},
	fileFilter (req, file, cb){
		if(!file.originalname.match(/\.(jpg|gif|png|jpeg)$/)){
	  		return cb(new Error('Archivo no valido!!'));
		}
		cb(null, true)
	}
});
var uploadFile = multer({
	limits:{
		fileSise: 12000000
	},
	fileFilter (req, file, cb){
		if(!file.originalname.match(/\.(pdf|doc|docx|txt)$/)){
	  		return cb(new Error('Archivo no valido!!'));
		}
		cb(null, true)
	}
});

//midlewte upload.single('archivo')
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
}));
let usr;
app.use((req, res, next) =>{
	if(req.session.usuario){		
		res.locals.sesion = true
		res.locals.nombre = req.session.nombre
		res.locals.role = req.session.role
		res.locals.ID = req.session.id
		res.locals.avatar = req.session.avatar
		usr = req.session.nombre
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
				nombre: req.session.nombre,
				succesUpdate: req.query.succesUpdate,
				errorUpdate: req.query.errorUpdate
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

app.post('/crearCurso', uploadImg.single('file'), function(req,res){
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
				'index':index,
				'shcedule': (req.file != undefined ? req.file.buffer : new Buffer('', 'base64') )
			});
			
			course.save((err, resp)=>{
				if (err){
					console.log(err);
					res.redirect('/crearCurso?error=1');
				}
				res.redirect('/crearCurso?created=1');
			});
			

		}
	});
});

app.get('/inscripcion/:courseID', function (req, res){
	if (res.locals.sesion){
		let admin = req.session.role ? req.session.role : false;
		Course.findById(req.params['courseID']).exec((err, response)=>{
			if (err){
				return console.log(err);
			}
			let userData
			if (response) {
				User.findById(req.session.usuario).exec((err, resp)=>{
					if(err){
						return console.log(err);
					}
					userData = resp;
					res.render('../views/inscripcion', {
						curso: response,
			        	error: req.query.error,
			        	admin : admin,
			        	user: userData
			        });
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
			console.log(err);
			res.redirect('/?errorInscription=1');
		}
		if (!resp){
			res.redirect('/inscripcion/'+ req.body.courseID +'?error=1');
		}else {
			let index
			Insc.find().exec((err, resp)=>{
				if (err){
					console.log(err);
					res.redirect('/?errorInscription=2');
				}
				index = resp.length + 1;
				var status = (req.body.status == "on")? true : false;
				var remote = (req.body.remote == 1)? true : false;
				let insc = new Insc({
					'index': index,
					'courseID': req.body.courseID,
					'userID': req.session.usuario,
					'registered': new Date()
				});
				insc.save((err, resp)=>{
					if (err){
						console.log("start");
						console.log(err);
						console.log("end");
						res.redirect('/?errorInscription=3');
					}
					const msg = {
						to: req.body.email,
						from: 'elcasike@gmail.com',
						subject: 'Inscripción Realizada',
						text: 'Se ha incripto correctamente al curso ' + req.body.cuorseID
					};
					const sending = sgMail.send(msg);

					(async function() {
						try {
							await sending;
							res.redirect('/?inscripted=1');
						} catch(err) {
							console.log(err);
							res.redirect('/?inscripted=2');
						}
					})();
				});
			});

		}
	});
});

app.get('/inscriptos', function (req, res){
	if (!res.locals.sesion){
		let admin = req.session.role ? req.session.role : false
		let userID = req.session.usuario
		var lista = []
		let inscriptions;
		Insc.find().exec((err,resp)=>{
			if (err){
				console.log(err);
				res.redirect('/?errorIncription=1');
			}
			if (resp){
				inscriptions = resp;
			let cursos;
			Course.find().exec((err, resp)=>{
				if (err){
					console.log(err);
					res.redirect('/?errorIncription=1');
				}
				if (resp){
					cursos = resp;
					let est;
					User.find().exec((err, resp)=>{
						if (err){
							console.log(err);
							res.redirect('/?errorIncription=1');
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
										console.log(err);
										res.redirect('/?errorIncription=1');
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
			return console.log(err);
			res.redirect('/inscriptos?regNotElim=1');
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
			req.session.avatar = (resp.img != ''? resp.img.toString('base64') : defAv);
			usr  = resp.name;
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

app.get('/registro', (req, res) => {
	if (res.locals.sesion){
		res.redirect('/');
	} else {
        res.render('../views/register', {error: req.body.error});
	}
});

app.post('/registro',uploadImg.single('file'), (req,res)=>{
	let usr = new User({
		'name': req.body.name,
		'age': req.body.age,
		'email': req.body.email,
		'phone': req.body.phone,
		'address': req.body.address,
		'dni': req.body.dni,
		'isActive': true,
		'registered':Date(),
		'role':'student',
		'password':bcrypt.hashSync(req.body.password,10),
		'img': (req.file != undefined ? req.file.buffer : new Buffer(defAv, 'base64'))
	});

	usr.save((err, resp)=>{
		if (err){
			console.log(err);
			res.render('../views/register', {error: 1});
		}
		const msg = {
			to: req.body.email,
			from: 'elcasike@gmail.com',
			subject: 'Bienvenido',
			text: 'Bienvenido a la página de NodeJs'
		};
		const sending = sgMail.send(msg);

		req.session.usuario = resp.id;	
		req.session.nombre = resp.name;
		req.session.avatar = (resp.img ? resp.img.toString('base64') : defAv);
		(async function() {
			try {
				await sending;
				res.redirect('/');
			} catch(err) {
				console.log(err);
				res.redirect('/');
			}
		})();
	});
})

app.get('/editProfile', (req, res) => {
	if (res.locals.sesion){
		let userData
		User.findById(req.session.usuario).exec((err, resp)=>{
			if(err){
				return console.log(err);
			}
			userData = resp;
			res.render('../views/editProfile', {	
		    	user: userData
		    });
		});
	} else {
		res.redirect('/login');
	}
});

app.post('/editProfile',uploadImg.single('file'), (req,res)=>{
	let usr = {
		'name': req.body.name,
		'age': req.body.age,
		'email': req.body.email,
		'phone': req.body.phone,
		'address': req.body.address,
		'dni': req.body.dni,
		'isActive': true,
		'registered':Date(),
		'role':'student',
		'img': (req.file != undefined ? req.file.buffer : new Buffer(defAv, 'base64') )
	};
 
	User.findByIdAndUpdate(req.session.usuario,{$set: usr},{new: true},(err, resp)=>{
		if (err){
			console.log(err);
			res.redirect('/editProfile?errorUpdate=1');
		}
		const msg = {
			to: req.body.email,
			from: 'elcasike@gmail.com',
			subject: 'Actulización de datos',
			text: 'Recientemente e han actualizado sus datos, si no fue ud. comuniquese con nosotros. Saludos'
		};
		const sending = sgMail.send(msg);

		req.session.usuario = resp.id;	
		req.session.nombre = resp.name;
		req.session.avatar = (resp.img ? resp.img.toString('base64') : '');
		(async function() {
			try {
				await sending;
				res.redirect('/?succesUpdate=1');
			} catch(err) {
				console.log(err);
				res.redirect('/');
			}
		})();
	});
});

app.get('/chat',(req, res)=>{
	if (res.locals.sesion){
		res.render('../views/chatRoom',{usr:req.session.nombre?req.session.nombre:''})
	} else {
		res.redirect('/login');
	}
});


//SOCKETS CALLS
let contador = 0
const { ChatUsers } = require('./chatUsers');
const chatUsers = new ChatUsers();

io.on('connection', client => {
  console.log('Se ha conectado un nuevo usuario');

  client.on("newMsg", (data, cb) => {
  	io.emit("newMsg", data);
  	cb();
  });

  client.on("newPrivMsg", (data, cb) => {
  	console.log(data);
  	let dest = chatUsers.getReceiver(data.destinator);
  	client.broadcast.to(dest.id).emit("newPrivMsg",{name: data.name, info: data.info});
  	cb();
  });

  client.on("newUsr", data =>{
  	let delUsr = chatUsers.deleteUser(client.id);
  	chatUsers.addUser(client.id, data);
  	let list = chatUsers.getAllUsers();
  	io.emit("newUsr", list);
  });

  client.on("disconnect", ()=>{
	let delUsr = chatUsers.deleteUser(client.id);
  	if (usr && delUsr){
  		let temp = chatUsers.getAllUsers();
	  	io.emit("usrDisconnected", temp);
  	}
  });
});








mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultado) => {
	if (err){
		return console.log(err)
	}
	console.log("conectado")
});

server.listen(process.env.PORT, () => {
	console.log ('servidor en el puerto ' + process.env.PORT)
});
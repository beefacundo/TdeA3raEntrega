const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');

const publicDir = path.join(__dirname,'../public');
const partialsDir = path.join(__dirname,'../partials');


if (fs.existsSync('../dbJson/users.json')) {
	console.log("File of users exists");
}else{
    fs.writeFile('../dbJson/users.json','', function(){
		});
}
let users = require('../dbJson/users.json');

if (!fs.existsSync('../dbJson/courses.json')) {
} else {
    fs.writeFile('./dbJson/courses.json','', function(){
		});
}
let courses = require('../dbJson/courses.json');

if (!fs.existsSync('../dbJson/inscriptions.json')) {
} else {
    fs.writeFile('./dbJson/inscriptions.json','', function(){
		});
}
let inscriptions = require('../dbJson/inscriptions.json');

/*if (!fs.existsSync('../dbJson/roles.json')) {
} else {
    fs.writeFile('./dbJson/roles.json','', function(){
		});
}
let roles = require('../dbJson/roles.json');
*/

let currentUser = {id: 0, role: 0};//, name: "Facundo Bee", role: 0, dni:456677, phone:"+543493406960", email: "beefacundo@yahoo.com"};


app.use(express.static(publicDir));
hbs.registerPartials(partialsDir);
app.use(bodyParser.urlencoded());
app.set('view engine','hbs');


app.get('/', function (req, res){
        res.render('../views/index',{
        	lista: courses,
        	created : req.query.created,
        	admin : currentUser.role ? currentUser.role : false
        });
});
app.get('/login', function (req, res){
		if (currentUser.id != 0){
			res.redirect('/');
		} else {
	        res.render('../views/login', {
    	    });
		}
});
app.post('/log', function(req, res){
	let usr = users.find(function(item){
		if (item.email == req.body.email){
			return item
		}
	});
	if (usr){
		currentUser = usr;
		res.redirect('/');
	} else {
		res.redirect('/login?errorLogin=1');
	}
});
//Craer Curso
app.get('/crearCurso', function (req, res){
	if (currentUser.id == 0){
		res.redirect('/login');
	} else {
        res.render('../views/crearCurso', {
        	error: req.query.error,
        	admin : currentUser.role
        });
	}
})

app.post('/cc', function(req,res){
	if (courses.find(function(curso){
		if(curso['id'] == req.body.id){
			return true;
		}
	}))
	{
		res.redirect('/crearCurso?error=1');
	} else {
		let index = courses.length + 1;
		var status = (req.body.status == "on")? true : false;
		var remote = (req.body.remote == 1)? true : false;
		let course = {
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
		}
		courses.push(course);
		fs.writeFile('./dbJson/courses.json',JSON.stringify(courses), function(){
			courses = require('../dbJson/courses.json');
			res.redirect('/crearCurso?created=1');
		});
	}
});

app.get('/inscripcion/:courseID', function (req, res){
	if (currentUser.id == 0){
		res.redirect('/login');
	} else {
		var curso = courses.find(function(item){
			if (item.id == req.params['courseID']){
				return item
			}
		});
		res.render('../views/inscripcion', {
			curso: curso,
        	error: req.query.error,
        	admin : currentUser.role,
        	user: currentUser
        });
    }
});

app.post('/insc', function(req,res){
	if (inscriptions.find(function(item){
		if(item['courseID'] == req.body.courseID && item['userID'] == req.body.userID){
			return true;
		}
	}))
	{
		res.redirect('/inscripcion/'+ req.body.courseID +'?error=1');
	} else {
		let index = inscriptions.length + 1;
		var status = (req.body.status == "on")? true : false;
		var remote = (req.body.remote == 1)? true : false;
		let insc = {
			'index': index,
			'courseID': req.body.courseID,
			'userID': req.body.userID,
			'registered': new Date()
		}
		inscriptions.push(insc);
		fs.writeFile('./dbJson/inscriptions.json',JSON.stringify(inscriptions), function(){
			courses = require('../dbJson/inscriptions.json');
			res.redirect('/?inscripted=1');
		});
	}
});

//////////
app.get('/inscriptos', function (req, res){
	if (currentUser.id == 0){
		res.redirect('/login');
	} else {
		var lista = [];
		inscriptions.forEach(function(insc){
			let record = {}
			let curso = courses.find(function(item){
				if (item.id == insc.courseID){
					return item;
				}
			});
			let user = users.find(function(item){
				if (item.index == insc.userID){
					return item;
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
		res.render('../views/inscripted', {
			lista: lista,
        	//error: req.query.error,
        	admin : currentUser.role,
        	user: currentUser
        });
    }
});

app.post('/close', function(req,res){
	let curso = courses.find(function(item){
		if(item.id == req.body.idCurso){
			item.status = false;
			fs.writeFile('./dbJson/courses.json',JSON.stringify(courses), function(){
				courses = require('../dbJson/courses.json');
				res.redirect('/inscriptos');
			});
		}
	});
});

app.post('/deleteInp', function(req,res){
	let index = inscriptions.indexOf(inscriptions.find(function(item){
		if (item.courseID ==  req.body.idCurso && item.userID ==  req.body.idEst){
			return item;
		}
	}));
	if (index == -1){
		res.redirect('/inscriptos?regNotElim=1');
	} else {
		let lista = inscriptions.splice(index,1);
		fs.writeFile('./dbJson/inscriptions.json',JSON.stringify(inscriptions), function(){
			inscriptions = require('../dbJson/inscriptions.json');
			res.redirect('/inscriptos?regElim=1');
		});
	}
});

app.post('/delete', function(req,res){
	let index = inscriptions.indexOf(inscriptions.find(function(item){
		if (item.index ==  req.body.idCurso){
			return item;
		}
	}));
	let lista = inscriptions.splice(index,1);
	fs.writeFile('./dbJson/inscriptions.json',JSON.stringify(inscriptions), function(){
		inscriptions = require('../dbJson/inscriptions.json');
		res.redirect('/inscriptos?regElim=1');
	});
});

app.listen(3000,()=>{
	console.log('Ready');
});

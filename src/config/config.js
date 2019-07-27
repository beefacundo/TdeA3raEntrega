process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'entrega3';
process.env.SENDGRID_API_KEY = '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';

let urlDB
if (process.env.NODE_ENV === 'entrega3'){
	urlDB = 'mongodb://localhost:27017/entrega3';
}
else {
	urlDB = 'mongodb+srv://nodejstdea:nodejstdea@nodejstdea-4jn4i.mongodb.net/asignaturas?retryWrites=true'
}

process.env.URLDB = urlDB
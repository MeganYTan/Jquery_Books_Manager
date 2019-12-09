var express = require('express'),
	app = express(),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	Books = [
		{id: 1, name:'Harry Potter', price: 350, author: 'JK Rowling'},
		{id: 2, name:'JavaScript', price: 100, author: 'Bob'},
		{id: 3, name:'Java', price: 200, author: 'Alex'},
		{id: 4, name:'J2EE', price: 150, author: 'Jim'},
		{id: 5, name:'AngularJS', price: 50, author: 'Kate'},

	];
app.listen(3000);

//__dirname is current directory's path
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cors());

app.get('/books', function getBooks(req,res,next){
	res.send(Books);
	next();
});

app.get('/books/:id', function getBook(req,res,next){
	var id =req.params.id,
	index = Books.findIndex(function(b){
		return b.id==id;
	});
	res.send(Books[index]);
});

app.post('/books', function postBook(req,res,next){
	var book = req.body;
	Books.push(book);
	res.send(Books);	
});

app.delete('/books/:id', function deleteBook(req,res,next){
	var id =req.params.id,
	index = Books.findIndex(function(b){
		return b.id==id;
	});
	index >-1 && Books.splice(index,1);
	res.send(Books);
});

app.put('/books/:id', function putBook(req,res,next){//update

	var id =req.params.id,
			index = Books.findIndex(function(b){
				return b.id==id;
			}),
			book = req.body;
	console.log(id);
	if(index!==-1){//if contain
		Books[index] = book;
	}else{
		Books.push(book);
	}
	res.send(Books);
});
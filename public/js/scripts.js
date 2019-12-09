var Books = [],
	idSorted = false,
	nameSorted=false,
	priceSorted=false,
	authorSorted=false;
$(document).ready(function(){
	//1. load the table
	getBooks()//return type is deferred object (jquery version of promise)
		.then(function getSuccess(res){
			Books=res;
			refreshTable(res);
		})
		.catch(function getFailed(err){
			console.log('Failed to get users');
	});
	//2. add book -- post request
	$('#add-submit').click(function(event){
		event.preventDefault();
		var book = {};
		book.id = $('#add-id').val();
		book.name = $('#add-name').val();
		book.price = $('#add-price').val();
		book.author = $('#add-author').val();
		addBook(book)
			.then(function (res){
				// console.log('book reset from #add-submit');
				Books=res;//this sorts it by id
				//push instead of refresh
				appendBook(book);
				//empty the values
				$('#add-id').val('');
				$('#add-name').val('');
				$('#add-price').val('');
				$('#add-author').val('');
			})
			.catch();

	});
	//3. edit book -- form loading
	//4. delete book -- delete request
	document.addEventListener('click',function(event){
		// console.log('from document.addEventListener',Books);
		if(event.target.id == 'edit-book'){
			var tableRow = $(event.target.parentElement.parentElement);
			//get the book
			var book = {};
			book.id = tableRow.children('.table-id').html();
			book.name = tableRow.children('.table-name').html();
			book.price = tableRow.children('.table-price').html();
			book.author = tableRow.children('.table-author').html();
			//load the form
			$('#edit-id').val(book.id);
			$('#edit-name').val(book.name);
			$('#edit-price').val(book.price);
			$('#edit-author').val(book.author);
		}else if(event.target.id == 'delete-book'){
			var tableRow = $(event.target.parentElement.parentElement);
			//get the book
			var book = {};
			book.id = tableRow.children('.table-id').html();
			book.name = tableRow.children('.table-name').html();
			book.price = tableRow.children('.table-price').html();
			book.author = tableRow.children('.table-author').html();
			//delete, reset Books, refresh table
			deleteBook(book)
				.then(function(res){
					// console.log('books refreshed from delete');
					Books= res;
					refreshTable(res);
				})
				.catch();
		}
	})
	//edit book -- form submission
	$('#edit-submit').click(function(){
		event.preventDefault();
		var book = {};
		book.id = $('#edit-id').val();
		book.name = $('#edit-name').val();
		book.price = $('#edit-price').val();
		book.author = $('#edit-author').val();
		//edit the book in db
			editBook(book)
				.then(function (res){
					// console.log('books refresh from edit-submit');
					Books=res;
					// console.log('from edit',Books);
					refreshTable(res);
					//empty the values
					$('#edit-id').val('');
					$('#edit-name').val('');
					$('#edit-price').val('');
					$('#edit-author').val('');
				})
				.catch();
	})

	//5. filter
	$('#filter-button').click(function(){
		//get Books
		getBooks()
			.then(function (res){
				Books=res;
				//get the 
				var field = $('#filter-field').val().toLowerCase();
				// console.log('field-field',field);
				var contents = $('#filter-content').val();
				// console.log('field-contents',contents);
				
				//if empty contents
				if(contents!==''){
					//get books and show

					Books= Books.filter(function(b){
					// console.log('field-b',b[field]);
					//if String
					if(typeof b[field] == 'string'){
						return b[field].toLowerCase().includes(contents.toLowerCase());
					}else{//either min price or max price
						if(field === 'min price'){
							// console.log(b['price']);
							// console.log('contents',contents);
							return b['price']>=contents;
						}else if(field === 'max price'){
							return b['price']<=contents;
						}
					}
					});
				}	
				refreshTable(Books);
				//empty the field
				$('#filter-content').val('');
			})
			.catch();
		
	});
	//6. sorting
	$('th').on('click',function(event){
		//1 get the field to sort
		//check how that field is sorted
		//change how that field is sorted
		//2 sort by that field... number and letters different sorted
		//3 change the html. all should be unsorted
		var fieldToSort = $(event.target).html().toLowerCase();
		var sorted = false;
		switch(fieldToSort){
			case 'id':
				sorted = idSorted;
				idSorted = (idSorted)? false:true;
				break;
			case 'price':
				sorted = priceSorted;
				priceSorted = (priceSorted)? false:true;
				break;
			case 'name':
				sorted = nameSorted;
				nameSorted = (nameSorted)? false:true;
				break;
			case 'author':
				sorted = authorSorted;
				authorSorted = (authorSorted)? false:true;
				break;
		}
		//if number. sort by number
		if (fieldToSort === 'id' || fieldToSort === 'price'){
			Books.sort(function(a,b){
				if(sorted){//sort desc
					return (b[fieldToSort] - a[fieldToSort]);
				}else{
					return (a[fieldToSort] - b[fieldToSort]);
				}
			});
		}else if (fieldToSort === 'name'|| fieldToSort==='author'){//if letters
			Books.sort(function(a,b){
				var aL = a[fieldToSort].toLowerCase();
				var bL = b[fieldToSort].toLowerCase();
				if(sorted){//sort desc
					if(aL<bL){return 1;}
					else if(aL>bL){return -1;}
					else{return 0;}
				}else{
					if(aL<bL){return -1;}
					else if(aL>bL){return 1;}
					else{return 0;}
				}
			});
		}		
		// console.log(Books);
		$('th').removeClass();
		$('th').addClass('headerUnsort');
		var fieldHeader = $(event.target);
		if(sorted){
			fieldHeader.removeClass();
			fieldHeader.addClass('headerSortDown');
		}else{
			fieldHeader.removeClass();
			fieldHeader.addClass('headerSortUp');
		}
		refreshTable(Books);
	});
});
function refreshTable(books){
	$('tbody').empty();
	books.forEach(function(b){
		appendBook(b);
	})           
}
function appendBook(b){
	$('tbody').append(
			'<tr>'+
			'<td class="table-id">' + b.id + '</td>'+
			'<td class="table-name">' + b.name + '</td>'+
			'<td class="table-price">' + b.price + '</td>'+
			'<td class="table-author">' + b.author + '</td>'+
			'<td> <a href = "#" class = "mr-3" id="edit-book">Edit</a><a href = "#" id="delete-book">Delete</a> </td>'+
			'</tr>'
		);
}
//getbooks
function getBooks(){
	return $.ajax({
	url:'http://localhost:3000/books',
	method:'GET',
	contentType:'application/json; charset=UTF-8'
	});
}
//add book function
function addBook(book){
	// console.log('add',book);
	return $.ajax({
	url:'http://localhost:3000/books',
	method:'POST',
	data: JSON.stringify(book),
	contentType:'application/json; charset=UTF-8'
	});
}
//edit book function
function editBook(book){
	// console.log('edit', book);
	return $.ajax({
		url: 'http://localhost:3000/books/'+book.id,
		method: 'PUT',
		data: JSON.stringify(book),
		contentType:'application/json; charset=UTF-8'
	});
}

function deleteBook(book){
	// console.log('delete', book);
	return $.ajax({
		url: 'http://localhost:3000/books/'+book.id,
		method: 'DELETE',
		data: JSON.stringify(book),
		contentType:'application/json; charset=UTF-8'
	});
}


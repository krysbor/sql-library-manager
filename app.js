const express = require('express');
const Book = require('./models').Book;
const path = require('path');

const app = express();
const port = 3000

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));


/* ROUTES */

app.get('/', async (req, res) => {
    res.redirect('/books')
})

app.get('/books', async (req, res) => {
    const books = await Book.findAll()
    //const booksJSON = books.toJSON()
    res.render('index', {books: books})
})

app.get('/books/new', async (req, res) => {

})

app.post('/books/new', async (req, res) => {

})

app.get('/books/:id', async (req, res) => {

})

app.post('/books/:id', async (req, res) => {

})

app.post('/books/:id/delete', async (req, res) => {

})


const x = async () => {
    const book = await Book.findByPk(1);
    console.log(book.toJSON())
}
x()


app.listen(port, () => console.log(`App listening on port ${port}`))
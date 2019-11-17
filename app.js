const express = require('express');
const Book = require('./models').Book;
const path = require('path');
const bodyParser = require("body-parser")

const app = express();
const port = 3000

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))



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
    res.render('new-book', {handleNewBookSubmit: handleNewBookSubmit})
})

app.post('/books/new', async (req, res) => {
    await Book.create(req.body)
    res.redirect('/books')
})

app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id)
    res.render('update-book', {book: book})
    //console.log(book)
})

app.post('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id)
    //console.log(req.body)
    await book.update(req.body)
    res.redirect('/books')
})

app.post('/books/:id/delete', async (req, res) => {
    const book = await Book.findByPk(req.params.id)
    book.destroy()
    res.redirect('/books')
})


const x = async () => {
    const book = await Book.findByPk(1);
    console.log(book.toJSON())
}
x()

const handleNewBookSubmit = () => {
    console.log('New book submitted!')
}


app.listen(port, () => console.log(`App listening on port ${port}`))
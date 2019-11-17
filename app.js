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

const log = (e) => {
    console.log(e.value)
}


app.get('/', async (req, res) => {
    res.redirect('/books')
})

//Shows the full list of books
app.get('/books', async (req, res) => {
    const books = await Book.findAll()
    res.render('index', {books: books, title: 'Books', log: log})
})

//Shows the create new book form.
app.get('/books/new', (req, res) => {
    res.render('new-book', {title: 'New Book'})
})

//Posts a new book to the database.
app.post('/books/new', async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body)
        res.redirect('/books')
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.log('Validation error!')
            book = await Book.build(req.body);
            res.render('new-book', {title: 'New Book', book: book, errors: error.errors})
        } else {
            throw error
        }
    }
})

//Shows book detail form.
app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id)
    book ? res.render('update-book', {book: book, title: book.title}) : res.render('error')
})


//Updates book info in the database.
app.post('/books/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id)
        await book.update(req.body)
        res.redirect('/books')
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.log('Validation error!')
            res.render('update-book', {title: book.title, book: book, errors: error.errors})

        } else {
            throw error
        }
    }
})

//Deletes a book
app.post('/books/:id/delete', async (req, res) => {
    const book = await Book.findByPk(req.params.id)
    book.destroy()
    res.redirect('/books')
})


app.use((req, res, next) => {
    const err = new Error('Not found')
    err.status = 404;
    next(err)
})


app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    const errorMessage = err.message
    const errorStatus = err.status
    res.render('page-not-found');
    console.log(`Sorry, there was following error: ${errorMessage} status: ${errorStatus}`)
})





app.listen(port, () => console.log(`App listening on port ${port}`))
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
    res.render('index', {books: books, title: 'Books'})
})

app.get('/books/new', (req, res) => {
    res.render('new-book', {title: 'New Book'})
})

app.post('/books/new', async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body)
        res.redirect('/books')
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.log('THERE WAS AN VALIDATION ERROR!')
            book = await Book.build(req.body);
            res.render('new-book', {title: 'New Book', book: book, errors: error.errors})
        } else {
            throw error
        }
    }
    //await Book.create(req.body)
    //res.redirect('/books')
})

app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id)
    book ? res.render('update-book', {book: book, title: book.title}) : res.render('error')



    //console.log(book)
})

app.post('/books/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id)
        await book.update(req.body)
        res.redirect('/books')
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.log('VALIDATION ERROR!!!')
            res.render('update-book', {title: book.title, book: book, errors: error.errors})

        }
    }
    //const book = await Book.findByPk(req.params.id)
    //console.log(req.body)
    //await book.update(req.body)
    //res.redirect('/books')
})

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
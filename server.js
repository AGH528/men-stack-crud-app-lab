const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); 
app.use(express.static('public'));

const Book = require('./models/book');

app.get('/test', (req, res) => {
  res.send('Server is running');
});

app.get('/', (req, res) => {
  res.redirect('/books');
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.render('books/index', { books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books.');
  }
});

app.get('/books/new', (req, res) => {
  res.render('books/new');
});

app.post('/books', async (req, res) => {
  try {
    console.log(req.body);
    await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).send('Error adding book.');
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render('books/show', { book });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).send('Error fetching book.');
  }
});

app.get('/books/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book });
  } catch (error) {
    console.error('Error fetching book for editing:', error);
    res.status(500).send('Error fetching book for editing.');
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/books/${req.params.id}`);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).send('Error updating book.');
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books'); 
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('Error deleting book.');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

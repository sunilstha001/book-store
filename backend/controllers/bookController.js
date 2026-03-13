import Book from '../models/bookModel.js';
import uploadToCloudinary from '../utils/cloudinaryUploader.js';

// CREATE A NEW BOOK 
export const createBook = async (req, res) => {
  try {
    const { title, author, price, description } = req.body;

    // We must have a file to create a book
    if (!req.file) {
      return res.status(400).json({ message: 'Book image is required' });
    }

    // Upload image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'book_covers');
    const bookImageUrl = result.secure_url;

    const book = new Book({
      title,
      author,
      price,
      bookImage: bookImageUrl,
      description,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET ALL BOOKS 
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}); // Find all books
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET A SINGLE BOOK BY ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//  UPDATE A BOOK 
export const updateBook = async (req, res) => {
  try {
    const { title, author, price, description } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update the fields
    book.title = title || book.title;
    book.author = author || book.author;
    book.price = price || book.price;
    book.description = description !== undefined ? description : book.description;

    // Check if a new image was uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'book_covers');
      book.bookImage = result.secure_url;
    }

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//  DELETE A BOOK 
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      await book.deleteOne();
      res.status(200).json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ "username": username, "password": password });
    return res.status(201).json({ message: "User registered successfully. Now you can login" });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
// //   return res.status(300).json({message: "Yet to be implemented"});
//     return res.send(JSON.stringify(books, null, 4));
// });

public_users.get('/', async function (req, res) {
    try {
        // Simulating async operation
        await new Promise(resolve => setTimeout(resolve, 100)); // Fake delay
        
        // const book = books[isbn];
        if (books) {
            return res.status(200).json(books);
        } else {
            return res.status(404).json({message: "Book not found"});
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
// //   return res.status(300).json({message: "Yet to be implemented"});
//     const bookId = req.params.isbn; // Rename isbn to bookId
//     const book = books[bookId];  // Use bookId to access the book
//     if (book) {
//     res.status(200).json(book);
//     } else {
//     res.status(404).json({ message: "Book not found" });
//     }
//  });
 
 public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        // Simulating async operation
        await new Promise(resolve => setTimeout(resolve, 100)); // Fake delay
        
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        } else {
            return res.status(404).json({message: "Book not found"});
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});


// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
// //   return res.status(300).json({message: "Yet to be implemented"});
//     const author = req.params.author;
//     const booksByAuthor = [];

//     for (const bookId in books) {
//     if (books.hasOwnProperty(bookId)) {
//         if (books[bookId].author === author) {
//         booksByAuthor.push(books[bookId]);
//         }
//     }
//     }

//     if (booksByAuthor.length > 0) {
//     res.status(200).json(booksByAuthor);
//     } else {
//     res.status(404).json({ message: "No books found for this author" });
//     }
// });

    public_users.get('/author/:author', async function (req, res) {
        const author = req.params.author;
        try {
            // Simulating async operation
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const authorBooks = Object.values(books).filter(book => book.author === author);
            
            if (authorBooks.length > 0) {
                return res.status(200).json(authorBooks);
            } else {
                return res.status(404).json({message: "No books found for this author"});
            }
        } catch (error) {
            return res.status(500).json({ message: "Error fetching books by author", error: error.message });
        }
    });

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
// //   return res.status(300).json({message: "Yet to be implemented"});
//     const title = req.params.title;
//     const booksByTitle = [];

//     for (const bookId in books) {
//         if (books.hasOwnProperty(bookId)) {
//             if (books[bookId].title === title) {
//                 booksByTitle.push(books[bookId]);
//             }
//         }
//     }

//     if (booksByTitle.length > 0) {
//         res.status(200).json(booksByTitle);
//     } else {
//         res.status(404).json({ message: "No books found with this title" });
//     }
// });
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        // Simulating async operation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const matchingBooks = Object.values(books).filter(book => 
            book.title.toLowerCase().includes(title.toLowerCase())
        );
        
        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({message: "No books found with this title"});
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json(book.reviews || {});
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;

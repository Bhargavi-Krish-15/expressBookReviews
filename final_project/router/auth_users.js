const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return !users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // return users.some((user) => user.username === username && user.password === password);
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
        const password = req.body.password;

        // Check if username or password is missing
        if (!username || !password) {
            return res.status(404).json({ message: "Error logging in" });
        }

        // Authenticate user
        if (authenticatedUser(username, password)) {
            // Generate JWT access token
            let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });

            // Store access token and username in session
            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).send("User successfully logged in");
        } else {
            return res.status(208).json({ message: "Invalid Login. Check username and password" });
        }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  
  if (!review) {
    return res.status(400).json({message: "Review is required"});
  }
  
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({message: "Review added/modified successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  // Make sure 'books' is imported or defined at the top of your file
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({message: "Review not found"});
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

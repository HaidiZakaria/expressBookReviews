const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
  
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});
function getBookList(){
    return new Promise((resolve,reject)=>{
      resolve(books);
    })
  }
  function getFromISBN(isbn){
    let book_ = books[isbn];  
    return new Promise((resolve,reject)=>{
      if (book_) {
        resolve(book_);
      }else{
        reject("Unable to find book!");
      }    
    })
  }

// Get book details based on ISBN

public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;

  res.send(books[ISBN])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    let ans = []
      for(const [key, values] of Object.entries(books)){
          const book = Object.entries(values);
          for(let i = 0; i < book.length ; i++){
              if(book[i][0] == 'author' && book[i][1] == req.params.author){
                  ans.push(books[key]);
              }
          }
      }
      if(ans.length == 0){
          return res.status(300).json({message: "Author not found"});
      }
      res.send(ans);
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    let ans = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'title' && book[i][1] == req.params.title){
                ans.push(books[key]);
            }
        }
    }
    if(ans.length == 0){
        return res.status(300).json({message: "Title not found"});
    }
    res.send(ans);
  });
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews)
  });
  regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send("Review successfully deleted");
  }
  else {
      return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});


module.exports.general = public_users;


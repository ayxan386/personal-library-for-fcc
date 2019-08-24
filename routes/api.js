/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app,db) {

  app.route('/api/books')
    .get(function (req, res){
        db.collection("library").find({}).toArray((err,docs) => {
          let filtered = docs.map(el => {
            return {
              _id: el._id,
              title: el.title,
              commentcount: el.comments.length
            }
          })
          res.json(filtered);
        })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if(title){
      db.collection("library").insert({
        title:title,
        comments: []
      },(err,doc) => {
        if(err)console.log(err);
        if(doc)res.json({title:doc.ops[0].title,_id:doc.ops[0]._id});
      })
     }
      else res.json("id not provided");
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      db.collection("library").deleteMany({},(err,doc)=> {
        if(err)console.log(err);
        else res.json("complete delete successful");
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
      if(!checkForHexRegExp.test(bookid))res.json("no book exists");
      db.collection("library").findOne({_id : new ObjectId(bookid)},(err,doc) => {
        if(err)res.json("no book exists");
        if(doc)res.json(doc);
        else res.json("no book exists");
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      db.collection("library").update({_id: new ObjectId(bookid)},
          {
            $push : {
              comments: comment
            }
          },
          (err,doc) => {
            if(err)console.log(err);
            res.redirect("/api/books/" + bookid);
          })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      db.collection("library").deleteOne({
        _id : new ObjectId(bookid)
      },(err,doc) => {
        if(err)console.log(err);
        else res.json("delete successful");
      })
    });
    //404 Not Found Middleware
    app.use(function(req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });
};

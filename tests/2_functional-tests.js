/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */

  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        const title = "book" + Math.floor(Math.random() * 1000);
        chai.request(server)
      .post('/api/books')
        .send({
          title: title
        })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.property(res.body, 'title', 'Books in array should contain title');
        assert.equal(res.body.title,title);
        assert.property(res.body, '_id', 'Books in array should contain _id');
        done();
      });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
      .post('/api/books')
        .send({
        })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.include(res.body,"id not provided");
        done();
      });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
          chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        const id = "123";
        chai.request(server)
          .get('/api/books/' + id)
          .end(function(err, res){
            //assert.equal(res.status, 500);
            console.log(res.body)
            assert.include(res.body,"no book");
            done();
          });      
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        const id = "5d6187022cc88a47b78b425a";
        chai.request(server)
          .get('/api/books/' + id)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'comments', 'Book should contain comment');
            assert.isArray(res.body.comments,"comments should be an array")
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            done();
          });    
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const id = "5d6187022cc88a47b78b425a";
        const index = Math.floor(Math.random() * 10000);
        chai.request(server)
          .post('/api/books/' + id)
          .send({
            comment: "random comment" + index
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'comments', 'Book should contain comment');
            assert.isArray(res.body.comments,"comments should be an array")
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            done();
          });    
      });
      
    });

  });

  });
});
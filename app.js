const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//created a database with name: todolistDB
mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true});

//created a schema to be used in the database
const itemsSchema = {
    name: String
};

//created a collection by the name of 'Item' which will get converted to 'items' in DB
const Item = mongoose.model('Item', itemsSchema);

//created 1st document in the collection of 'Item'
const item1 = new Item({
  name: 'Welcome to To-Do list'
})

//created 2nd document in the collection of 'Item'
const item2 = new Item({
  name: 'Another item entry'
})


//created 3rd document in the collection of 'Item'
const item3 = new Item({
  name: '<-- Click here to delete'
})

const defaultItems = [item1, item2, item3]

//adding the created 'documents' in the collection of 'Item'
// Item.insertMany(defaultItems, (err)=>{
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log('Successfully added to the database!');
//   }
// })

app.get("/", function(req, res) {


  var today = new Date();
    
  var options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
  };

  var day = today.toLocaleDateString('en-us', options)

  Item.find({}, (err, foundItems)=>{

    if(foundItems.length === 0){

      Item.insertMany(defaultItems, (err)=>{
      if(err){
        console.log(err);
      }
        else{
        console.log('Successfully added to the database!');
        }
      })
      res.redirect('/');
    }

    else{
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
    
  })

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const newItem = new Item({
    name: itemName
  })

  newItem.save();
  res.redirect('/');

});

app.post('/delete', (req, res)=>{
  const checkedItemId = req.body.checkbox;
  
  Item.findByIdAndRemove(checkedItemId, (err)=>{
    if(!err){
      console.log("Successfully removed!");
    }
  })
  res.redirect('/');
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

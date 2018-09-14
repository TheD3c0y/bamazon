var mysql = require("mysql");
var Input = require("prompt-input");
var async = require("async")
var q1 = null;
promise1 = new Promise(function(resolve, reject){
  resolve('Success');
})
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'root',
  database: 'bamazon'
});

function doNothing(){

}
  

connection.connect(function(err){
  if(err) throw err;
  console.log("connected as id " + connection.threadId);
  
selectProducts();


  
  
  
  
});
function selectProducts(){
  connection.query("SELECT * FROM products", function(err, res) {
     for (var i = 0; i < res.length; i++){
      console.log(res[i].product_id + " | " + res[i].product_name + " | " + res[i].price) ;
    }
    askQuestion1();
  });
}

let askID = new Input({
  id: 'first',
  message: "What would you like buy? Use the ID to select what you would like."
})
let askQTY = new Input({
  id: 'first',
  message: "How many would you like to get?"
})

function askQuestion1(){
  
  askID.ask(function(answers){
      connection.query(`SELECT * FROM products`, function(err, res){
        if(err) throw err;
        
        if(answers === "quit"){
          
          connection.destroy();
        }else
        if(parseInt(answers-1) > res.length || Number.isNaN(parseInt(answers-1))) {
          console.log("That is not a valid selection!");
          askQuestion1();
        }else
        {
            q1 = parseInt(answers-1);
            console.log(`You have chosen ${res[answers-1].product_name}!`);
            askQuestion2();
        }
      } )
  })
}

function askQuestion2(){
  askQTY.ask(function(answer){
    connection.query(`SELECT * FROM products`, function(err, res){
      if(err) throw err;
      if(parseInt(answer) > res[q1].stock_qty){
        console.log(`We currently only have ${res[q1].stock_qty} of ${res[q1].product_name} in stock. \n Order has been cancelled`);
        connection.destroy();
      }else
      if(parseInt(answer) <= res[q1].stock_qty){
        console.log(`Order has been place for ${answer} of ${res[q1].product_name}`)
        connection.query(`UPDATE products SET stock_qty="${res[q1].stock_qty - answer}" WHERE product_id="${res[q1].product_id}"`, function(err, res){
          //console.log(res[q1].product_name +" products update!\n");
         
          
        });
      }else{
        console.log("Invalid Input, Goodbye!");
        connection.destroy();
      } 
    })
  })
}


/*The app should then prompt users with two messages.

The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.
*/
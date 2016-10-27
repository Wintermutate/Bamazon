var mysql = require ('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Mushu86212!",
	database:"bamazon"
})

connection.connect(function(err){
	if (err) throw err;
	runApp();
})

var runApp = function(){
	inquirer.prompt({
		name: "action",
		type: "rawlist",
		message: "What would you like to do?",
		choices: [
			"View Products for Sale",
			"View Low Inventory",
			"Add to Inventory",
			"Add New Product"
		]
	}).then(function(answer){
		switch(answer.action){
			case "View Products for Sale":
				productSearch();
			break;
			
			case "View Low Inventory":
				displayLow();
			break;

			case "Add to Inventory":
				addInventory();
			break;
			
			case "Add New Product":
				addNewProduct();
			break;			
		}
	})
}

var productSearch = function(){
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err
		for (var i = 0; i < res.length; i++){
			console.log("ItemID: " + res[i].ItemID + " || Product: " + res[i].ProductName + " || Department: " + res[i].DepartmentName + " || Price: " + res[i].Price + " || Quantity: " + res[i].StockQuantity);
		}
		runApp();		
	})
}

var displayLow = function(){
	connection.query('SELECT * FROM products WHERE StockQuantity <= 5', function(err, res){
		if (err) throw err
		for (var i = 0; i < res.length; i++){
			console.log("ItemID: " + res[i].ItemID + " || Product: " + res[i].ProductName + " || Department: " + res[i].DepartmentName + " || Price: " + res[i].Price + " || Quantity: " + res[i].StockQuantity);
		}
		runApp();	
	})
}

var addInventory = function(){
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;
		inquirer.prompt({
			name: "choice",
			type: "rawlist",
			choices: function(value){
				var choiceArray = [];
				for (var i = 0; i < res.length; i++){
					choiceArray.push(res[i].ProductName);
				}
				return choiceArray;
			},
			message: "Which item would you like to buy?"
		}).then(function(answer){
			for (var i =0; i < res.length; i++){
				if (res[i].ProductName == answer.choice){
					var chosenItem = res[i];
					inquirer.prompt({
						name: "amount",
						type: "input",
						message: "How many units would you like to add to stock?",
						validate: function(value){
							if (isNaN(value) == false) {
                				return true;
            				} else {
                				return false;
            				}
						}
					}).then(function(answer){												
						var chosenQuantity = chosenItem.StockQuantity + parseInt(answer.amount);
						connection.query("UPDATE products SET ? WHERE ?", [{
							StockQuantity: chosenQuantity
						},{
							ItemID:chosenItem.ItemID
						}], function(err, res){
							console.log("Quantity Updated!");
							productSearch();						
						})
						
					})
				}
			}
		})	
	})
}

var addNewProduct = function() {
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
    }, {
        name: "department",
        type: "input",
        message: "What department would you like to place your item in?"
    }, {
        name: "price",
        type: "input",
        message: "What would you like your price to be?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
    	}
 	}, {
        name: "quantity",
        type: "input",
        message: "What would you like your quantity to be?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", {
            ProductName: answer.item,
            DepartmentName: answer.department,
            Price: answer.price,
            StockQuantity: answer.quantity
        	}, function(err, res) {
            console.log("Your item was created successfully!");
            productSearch();            
       		}
        )
    })
}
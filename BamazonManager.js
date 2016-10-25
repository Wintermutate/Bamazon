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
	})
}
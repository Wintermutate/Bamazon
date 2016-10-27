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
	displayProducts();
}

var displayProducts = function(){
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;
		for (var i = 0; i < res.length; i++){
			console.log("ItemID: " + res[i].ItemID + " || Product: " + res[i].ProductName + " || Department: " + res[i].DepartmentName + " || Price: " + res[i].Price + " || Quantity: " + res[i].StockQuantity);
		}	
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
						message: "How many units would you like to buy?",
						validate: function(value){
							if (isNaN(value) == false) {
                				return true;
            				} else {
                				return false;
            				}
						}
					}).then(function(answer){
					console.log(chosenItem);
											
						if (chosenItem.StockQuantity < parseInt(answer.amount)){
							console.log("Insufficient Quantity");
							runApp();
						} else {
							var chosenQuantity = chosenItem.StockQuantity - parseInt(answer.amount);
							var totalCost = chosenItem.Price * parseInt(answer.amount);
							connection.query("UPDATE products SET ? WHERE ?", [{
								StockQuantity: chosenQuantity
							},{
								ItemID:chosenItem.ItemID
							}], function(err, res){
								console.log("Your total cost is : $" + totalCost);
								runApp();
							})
						}
					})
				}
			}
		})	
	})
}
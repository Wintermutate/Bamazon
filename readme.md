# Bamazon

To run the script, you will need to install the 'mysql' and 'inquirer' packages
```
$ npm install mysql --save 
```

```
$ npm install inquirer --save
```

To begin the program run this command,
```
$ node BamazonCustomer.js
```

If you want to exit the program, close the command prompt or press ```CTRL + c``` twice


When you first run the program, a list of available items will be displayed and you will be prompted with questions regarding a purchase.

![First Run](images/screenshot_1.JPG)

After selecting a valid item and quantity, you will be given the total cost.

![Successful Purchase](images/screenshot_2.JPG)

An updated table of items will be displayed again if you want to continue with another purchase.
The previous purchase included item 1 with a quantity of 2. Therefore the update table shows a change
in stock quantity.

If you try to purchase an amount greater than the current stock quantity, your purchase will not go through and you must order again.

![Failed Purchase](images/screenshot_3.JPG)

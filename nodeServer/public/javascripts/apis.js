/**
 * Temporary storage in order to avoid excessive API calls. */
var cache; // Temporary storage so that we don't make excessive API calls (Global Variable)
/** An array to store the menu info from a particular restaurant. */
var cuisineArray = [];
/** An array to store the user's cart info data. */
var cart = [];
/**
 * Waits while DOM gets loaded fully
 * Waits for all the API calls to finish with the relevant user, merchant, and food data pulled up.
 */
$(function(){ // Waits while DOM gets loaded fully
	getCartContents(); 
	getMerchantIds();
	getFitbitData();
	$("#refresh").click(function(){
		/** Gets dish values. */
		var val = $("#select-choice-c option:selected").attr('id');
		getDishes(val);
	});
	$("#addToCart").click(function(){
		/** Selects the merchant. */
		var merchant = $("#select-choice-d option:selected").data('merchant');
		/** Selects the dish from the selected merchant. */
		var dish = $("#select-choice-d option:selected").data('dish');
		addToCart(merchant, dish);
	});

});
/**
 * Makes a call to the fitbit website to retrieve user data. Upon success to the data object the user's weight is added.
 * If there can't be a connection made with the fitbit website or the user is not registered an error is returned.
 */
function getFitbitData(){
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "https://nodeauthentication-kino6052.c9.io/fitbit/getData",
		success: function(data){
			console.log(data);
			$("#weight").html("Your Weight: " + data.user.weight);
		},
		error: function(err){
			console.log(err);
		}
	});
}
/** 
 * Asynchronous GET request is made to the /delivery/getLocalMerchants endpoint
 * It passes client id and the user's location, on success response it returns the ids of all nearby restaurants
 * The response is then iterated and the option html elements get appended to the select element with id "#select-choice-c".
 */
function getMerchantIds(){
$.ajax({
		  type: 'GET',
		  dataType: "json",
		  url: "https://nodeauthentication-kino6052.c9.io/delivery/getLocalMerchants",
		  data: {
			client_id: "Zjk0YzdhYzg3YTAyZmI1YTFkZjM0OGYyYWQwMDBmYzJl",
			address: "1178, Broadway 10001 New York".toLowerCase().replace(/ /g, '-').replace(/[^\w]+/g,'+')
		  },
		  success: function(data) {
			cache = data;
			$("#merchant_id").html("");
			console.log(data);
			$("#select-choice-c").html("");
			$.each(data["merchants"], function(value){
				$("#select-choice-c").append("<option class='merchant' id='" + data.merchants[value].id + "'>" + data["merchants"][value]['summary']["name"] + "</option>");
			});
			
			console.log("[STATUS] Success");
		  },
		  error: function(data) {
			console.log("[ERROR] " + data);
		  }
	});   
}
/**
 * When a request is made from the console, to retrieve particular information regarding one of the children.
 * If the length of the child is greater than 0 than values of the children are iterated and the value of the child is returned.
 * @param {number} iterable Number of iterations
 * @param {object} callback
 */
function recursiveSearch(iterable, callback){
    if (iterable.children.length !== 0){
        //console.log(iterable);
        $.each(iterable.children, function(value){
           recursiveSearch(iterable.children[value], callback); 
        });
    }
    else {
        callback(iterable);
    }
}
/** 
 * Asynchronous GET request is made to the /delivery/getUserCart endpoint
 * It passes merchant id which is selected through the user
 * The response is then iterated and the option html elements get appended to the select element with id "#cart".
 */
function getCartContents(){
	$.ajax({
		tye: "GET",
		dataType: "json",
		url: "https://nodeauthentication-kino6052.c9.io/delivery/getUserCart",
		success: function(cart) {
			$("#cart").html("");
			$.each(cart, function(value){
		       $.ajax({
		           type: "GET",
		           dataType: "json",
		           url: "https://nodeauthentication-kino6052.c9.io/delivery/getCartContents",
		           data: {
		               merchantId: cart[value],
		               client_id: "Zjk0YzdhYzg3YTAyZmI1YTFkZjM0OGYyYWQwMDBmYzJl"
		           },
		           success: function(data){
		               console.log(data);
		               
		               $.each(data.cart, function(value){
		                   $("#cart").append("<li class='ui-li ui-li-static'>" + data.cart[value].name + "</li>");
		               });
		           },
		           error: function(err){
		               console.log(err);
		           }
		       });
		    });
		}
	});
    
}
/**
 * Asynchronous POST request is made to the /delivery/addToCart endpoint
 * It passes merchant id and the dish id which the user selected to order.
 * The response is then iterated and the option html elements get appended to the select element with id "#token".
 * @param {integer} merchantId Identify the merchant
 * @param {integer} dishId Identify the dish 
 */
function addToCart(merchantId, dishId){

 $.ajax({
    type: "POST",
    url: "https://nodeauthentication-kino6052.c9.io/delivery/addToCart",
    data: {
      merchantId: merchantId,
      "order_type": "delivery",
      "instructions": "Some instructions",
      headers: {
        'Authorization': 'Bearer ' + $("#token").text()  
      },
      "item": {
        "item_id": dishId,
        "item_qty": 1
      },
      client_id: "Zjk0YzdhYzg3YTAyZmI1YTFkZjM0OGYyYWQwMDBmYzJl"
    },
    
    success: function(data){
        $("#cart").html("");
	    console.log(data);
	    getCartContents(); 
    },
    error: function(err){
        console.log(err);
    }
 });
}
/**
 * Asynchronous GET request is made to the /delivery/getMenusFromMerchants endpoint
 * It passes merchant id which sends the relevant token to retrieve the dishes relevant to the merchantId
 * The response is then iterated and the option html elements get appended to the select element with id "#select-choice-d".
 * @param {integer} merchantId Takes in which restaurant to get food info from.
 */
function getDishes(merchantId){ // Called when you click on a cuisine name
	
	$.ajax({
	    type: "GET",
	    dataType: "json",
	    url: "https://nodeauthentication-kino6052.c9.io/delivery/getMenusFromMerchants",
	    data: {
	        merchantId: merchantId,
	        client_id: "Zjk0YzdhYzg3YTAyZmI1YTFkZjM0OGYyYWQwMDBmYzJl"
	    },
	    success: function(data){
	      $("#select-choice-d").html(""); // Clear text from the dishes column in case there are any
	      $.each(data.menu, function(menuIndex){
	          recursiveSearch(data.menu[menuIndex], function(iterable){
	              //$("#dishes").append("<p class='add-to-cart' data-merchant=" + merchantId + " data-dish=" + iterable.id + ">" + iterable.name + "</p>");
	              $("#select-choice-d").append("<option class='add-to-cart' data-merchant='" + merchantId + "' data-dish='" + iterable.id + "'>" + iterable.name + "</option>");
	          });
	      });
	      $(".add-to-cart").click(function(){
	         
	      });
	      
	      
	    },
	    error: function(err){
	        console.log(err);
	    }
	}); 
}
/**
 * Asynchronous GET request is made to the "https://api.nutritionix.com/v1_1/search/" endpoint
 * It passes name which is just the name of the dish selected by the user to purchase
 * The response is then iterated and the option html elements get appended to the select element with id "#calories".
 * @param {string} name Name of the dish to pick up the calorie contents from.
 */
function getCalories(name){ // Called when you click on a dish name
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "https://api.nutritionix.com/v1_1/search/" + name,
		data: {
			fields: "item_name,item_id,brand_name,nf_calories,nf_total_fat", // some fields may not be needed (decide which ones we really need)
			appId: "9921b233",
			appKey: "4976263e72db8d8c4b4226fa0b0fdbd9"
		},
		success: function(data){
			$("#calories").html(data['hits'][0]['fields']['nf_calories']);
		},
		error: function(data){
			console.log("ERROR: " + data);
		}
	});					
}
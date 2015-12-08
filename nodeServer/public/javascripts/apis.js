/**
 * Temporary storage in order to avoid excessive API calls. */
var cache; // Temporary storage so that we don't make excessive API calls (Global Variable)
/** An array to store the menu info from a particular restaurant. */
var cuisineArray = [];
/** An array to store the user's cart info data. */
var cart = [];
/**
 * Waits while DOM gets loaded fully
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
 * Gets the fitbit data of a specific User.
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
/** Gets data of a selected food shop. */
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
 * Searches recursively for the right child's data
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
/** Gets the contents of the users cart. */
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
 * Add an item to your cart
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
 * Called when you click on a cuisine name to get the dishes.
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
 * Called when you click on a dish name to get the calorie contents.
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
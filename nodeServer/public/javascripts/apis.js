var cache; // Temporary storage so that we don't make excessive API calls (Global Variable)
var cuisineArray = [];
var cart = [];
$(function(){ // Waits while DOM gets loaded fully
	$("#getMenu").click(function(){ // Called when the submit button is clicked
	    $("#dishes").text("");
	    $("#cuisines").text("");
	    $("#merchant_id").text("");
		getMerchantIds();
	});
	
	$("#updateCart").click(function(){
	   $("#cart").text("");
	   getCartContents(); 
	});
});

function updateCart(){
    $.ajax({
       type: 'GET',
       dataType: "json",
       url: "https://delivery.com/customer/cart",
       data: {
           "order_type": "delivery"
       },
       headers:  {
           "Authorization": $("#token").text()
       },
       success: function(data){
           console.log(data);
       }
    });  
}

function getMerchantIds(){
$.ajax({
		  type: 'GET',
		  dataType: "json",
		  url: "https://nodeauthentication-kino6052.c9.io/delivery/getLocalMerchants",
		  data: {
			client_id: "Zjk0YzdhYzg3YTAyZmI1YTFkZjM0OGYyYWQwMDBmYzJl",
			address: $("#location").text().toLowerCase().replace(/ /g, '-').replace(/[^\w]+/g,'+')
		  },
		  success: function(data) {
			cache = data;
			$("#merchant_id").html("");
			$.each(data["merchants"], function(value){
				$("#merchant_id").append("<p class='merchant'>" + data["merchants"][value]["id"] + "</p>");
			});
			$(".merchant").click(function(){
				getDishes($(this).text());
			});
			console.log("[STATUS] Success");
			return data;
			
		  },
		  error: function(data) {
			console.log("[ERROR] " + data);
		  }
	});   
}

function getCuisines(){ // Called when press submit button
	$.ajax({
		  type: 'GET',
		  dataType: "json",
		  url: "https://api.delivery.com/merchant/search/delivery",
		  
		  data: {
			client_id: "Zjk0YzdhYzg3YTAyZmI1YTFkZjM0OGYyYWQwMDBmYzJl",
			address: $("#location").text().toLowerCase().replace(/ /g, '-').replace(/[^\w]+/g,'+')
		  },
		  
		  success: function(data) {
			
			cache = data;
			$("#cuisines").html("");
			$.each(data["cuisines"], function(value){
				cuisineArray.push(data["cuisines"][value]["name"]);
				$("#cuisines").append("<p class='type'>" + data["cuisines"][value]["name"] + "</p>");
			});
			$(".type").click(function(){
				getDishes($(this).text());
			});
			console.log(data);
			return data;
			
		  },
		  error: function(data) {
			console.log("ERROR: " + data);
		  }
	});
}

function recursiveSearch(iterable, callback){
    if (iterable.children.length !== 0){
        //console.log(iterable);
        $.each(iterable.children, function(value){
           recursiveSearch(iterable.children[value], callback); 
        });
    }
    else {
        console.log(iterable);
        callback(iterable);
    }
}

function getCartContents(){
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
               $.each(data.data.cart, function(value){
                   $("#cart").append("<p>" + data.cart[value].name + "</p>");
               });
           },
           error: function(err){
               console.log(err);
           }
       });
    });
}

function getDishes(merchantId){ // Called when you click on a cuisine name
	$("#dishes").html(""); // Clear text from the dishes column in case there are any
	$.ajax({
	    type: "GET",
	    dataType: "json",
	    url: "https://nodeauthentication-kino6052.c9.io/delivery/getMenusFromMerchants",
	    data: {
	        merchantId: merchantId,
	        client_id: "Zjk0YzdhYzg3YTAyZmI1YTFkZjM0OGYyYWQwMDBmYzJl"
	    },
	    success: function(data){
	      $.each(data.menu, function(menuIndex){
	          recursiveSearch(data.menu[menuIndex], function(iterable){
	              $("#dishes").append("<p class='add-to-cart' data-merchant=" + merchantId + " data-dish=" + iterable.id + ">" + iterable.name + "</p>");
	          });
	      });
	      $(".add-to-cart").click(function(){
	         var merchantId = $(this).data("merchant");
	         var dishId = $(this).data("dish");
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
                    cart.push(merchantId);
                },
                error: function(err){
                    console.log(err);
                }
	         });
	      });
	      
	      
	    },
	    error: function(err){
	        console.log(err);
	    }
	}); 
}

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
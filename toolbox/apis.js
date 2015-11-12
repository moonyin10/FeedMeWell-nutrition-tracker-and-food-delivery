$(function(){ // Waits while DOM gets loaded fully
				var cache; // Temporary storage so that we don't make excessive API calls (Global Variable)
				$("#submit").click(function(){ // Called when the submit button is clicked
					getCuisines();
				});
			});
			
			function getCuisines(){ // Called when press submit button
				$.ajax({
					  type: 'GET',
					  dataType: "json",
					  // The URL to make the request to.
					  url: "https://api.delivery.com/merchant/search/delivery",
					  data: {
						client_id: "Zjk0YzdhYzg3YTAyZmI1YTFkZjM0OGYyYWQwMDBmYzJl",
						address: $("#location").val().toLowerCase().replace(/ /g, '-').replace(/[^\w]+/g,'+')
					  },
					  success: function(data) {
						
						cache = data;
						$("#cuisines").html("");
						$.each(data["cuisines"], function(value){
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
			
			function getDishes(dishName){ // Called when you click on a cuisine name
				$("#dishes").html(""); // Clear text from the dishes column in case there are any
				for (j=0; j<cache['merchants'].length; j++){
					var data = cache['merchants'][j];
					var foodType = dishName;
					if ($.inArray(foodType, data['summary']['cuisines'])>-1){
						$.each(data['summary']['recommended_items'], function(index, value){
							$("#dishes").append("<p class='dish_name' onclick='getCalories("+ "\"" +  value['name'] + "\"" + ")'>" + value['name']  + "</p>");
						});
					}
				}
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
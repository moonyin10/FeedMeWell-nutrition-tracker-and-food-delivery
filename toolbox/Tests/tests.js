// QUnit.test( "hello test", function( assert ) {
//   assert.ok( 1 == "1", "Passed!" );
// });
// QUnit.test("Button Test", function (assert) {
// 	var done = assert.async();
// 	  var input = $( "#location" ).focus();
// 	  setTimeout(function() {
// 		assert.equal( document.activeElement, input[0], "Input was focused" );
// 		done();
//   });
// });
QUnit.test("Get JSON Object of Cuisines Test (Async + Not Empty)", function (assert) {
	var done = assert.async();
	  getCuisines();
	  setTimeout(function() {
		assert.equal( typeof cache, 'object', "Got JSON object with Cuisines!" );
		assert.ok( Object.keys(cache).length > 0, "Non-zero length! Good!" ); // Thanks to Kasun @ http://stackoverflow.com/questions/6756104/get-size-of-json-object
		done();
  }, 5000);
});
QUnit.test("Check if Dishes Display for Each Cuisine", function (assert) {
	var done = assert.async();
	setTimeout(function() {
		for (var i=0; i<cuisineArray.length; i++){
			var cuisineName = cuisineArray[i];
			getDishes(cuisineName);
			assert.ok( $("#dishes").html().length > 0, "There is at least one dish in " + cuisineName + " cuisine! Good!" ); // Thanks to Kasun @ http://stackoverflow.com/questions/6756104/get-size-of-json-object
		}
		done();
  }, 6000);
});
QUnit.test("Check if Calories Display for Each Dish", function (assert) {
	var done = assert.async();
	setTimeout(function() {
		for (var i=0; i<cuisineArray.length; i++){
			var cuisineName = cuisineArray[i];
			getDishes(cuisineName);
			assert.ok( $("#dishes").html().length > 0, "There is at least one dish in " + cuisineName + " cuisine! Good!" ); // Thanks to Kasun @ http://stackoverflow.com/questions/6756104/get-size-of-json-object
		}
		done();
  }, 6000);
});

QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});
QUnit.test("Button Test", function (assert) {
	var done = assert.async();
	  var input = $( "#location" ).focus();
	  setTimeout(function() {
		assert.equal( document.activeElement, input[0], "Input was focused" );
		done();
  });
});
QUnit.test("Get Cuisines Test", function (assert) {
	var done = assert.async();
	  getCuisines();
	  setTimeout(function() {
		assert.equal( typeof cache, 'object', "Got JSON as Cuisines" );
		done();
  }, 5000);
});
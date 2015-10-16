$(function(){
	$("#getdata").click(function(){
		window.location = "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=229WMB&redirect_uri=http%3A%2F%2F192.168.1.24/data.html&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight"
	});
	$("#button").click(function(){
		var location = String(window.location);
		var code = location.substr(35, location.length-1);
		$.ajax({
			url: "https://api.fitbit.com/oauth2/token?client_id=229WMBC&grant_type=authorization_code&redirect_uri=http%3A%2F%2F192.168.1.24/data.html&code=" + code,
			type: 'POST',
			headers: {
				"Authorization": "Basic " + window.btoa("229WMB:e10e600a259dc0696dd9220bde092c7e"),
				"Content-Type": "application/x-www-form-urlencoded"
			},
			
			success: function(response){
				$.ajax({
					url: "https://api.fitbit.com/1/user/-/profile.json",
					type: 'GET',
					headers: {
						"Authorization": "Bearer " + response.access_token
					},
					
					success: function(response){
						$("#stats p").append(JSON.stringify(response));
					},
					error: function(response){
						alert("error");
					}
				});
			}
		});
	});
});
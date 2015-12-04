$(function(){
	function GetURLParameter(sParam)
	{
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++)
	    {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam)
	        {
	        	console.log(sParameterName);
	            return sParameterName[1];
	        }
	    }
	}

	$("#getdata").click(function(){
		alert("test");
		var url = {
			response_type: "response_type=code&",
			client_id: "client_id=229WMB&",
			redirect_uri: "redirect_uri=" + encodeURIComponent("https://feedmewell-kino6052.c9.io/csci-3308-Project-GroupAwesome/www/data.html") + "&",
			scope: "scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight"
		};
		window.location = "https://www.fitbit.com/oauth2/authorize?" + url.response_type + url.client_id + url.redirect_uri + url.scope;
	});
	
	$("#button").click(function(){
		console.log(GetURLParameter("code"));
		$.ajax({
			url: "https://api.fitbit.com/oauth2/token",
			data: {
				client_id:"229WMB",
				grant_type: "authorization_code",
				redirect_uri: "https://feedmewell-kino6052.c9.io/csci-3308-Project-GroupAwesome/www/data.html",
				code: GetURLParameter("code")
			},
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
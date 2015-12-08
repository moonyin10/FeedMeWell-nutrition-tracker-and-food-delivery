/**
 * Function that extracts paramaters from url, ex: 10 will extract 10 and so on.
 * e.g. url.html?parameter=10, it will extract 10 from parameter
 * @param {integer} sParam The number of parameters to extract.
 */
function GetURLParameter(sParam) // function that extracts parameters from url (e.g. url.html?parameter=10, it will extract 10 from parameter)
	{
		/** The default page url. */
	    var sPageURL = window.location.search.substring(1);
	    /** The default page url parsed in. */
		var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++)
	    {
			/** Checks for a matching url hit. */
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam)
	        {
	        	console.log(sParameterName);
	            return sParameterName[1];
	        }
	    }
	}
/**
 * Makes an API call to check on the authenticity of the request being made.
 * When the token is determined to be authentic it's returned with the relevant authorization code grant
 */
function authorizationCodeGrant(){
		alert("test");
		/** The url page contacted. */
		var url = {
			response_type: "response_type=code&",
			client_id: "client_id=229WMB&",
			redirect_uri: "redirect_uri=" + encodeURIComponent("https://feedmewell-kino6052.c9.io/csci-3308-Project-GroupAwesome/www/data.html") + "&",
			scope: "scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight"
		};
		window.location = "https://www.fitbit.com/oauth2/authorize?" + url.response_type + url.client_id + url.redirect_uri + url.scope;
	}
/**
 * Asynchronous POST request is made to the https://api.fitbit.com/oauth2/token endpoint
 * It passes client id and grant type on success the token to access a particular user's fitbit data is returned 
 * The response is then iterated and the option html elements get appended to the select element with id response.access_token
 */
function getAccessTokenFitbit(){
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
			/** Function which returns succefully if the user is authorized. */
			success: function(response){
				$.ajax({
					url: "https://api.fitbit.com/1/user/-/profile.json",
					type: 'GET',
					headers: {
						"Authorization": "Bearer " + response.access_token
					},
					/** Returned upon success. */
					success: function(response){
						console.log(response);
					},
					/** Returned on error. */
					error: function(response){
						alert("error");
					}
				});
			}
		});
	}
/** Function which gets the fitbit data. */
$(function(){
	$("#getFitbitData").click(getAccessTokenFitbit());
});
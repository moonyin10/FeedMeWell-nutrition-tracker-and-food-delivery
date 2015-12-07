var fitbitAuthData = {
			response_type: "response_type=code&",
			client_id: "client_id=229WMB&",
			redirect_uri: "redirect_uri=" + encodeURIComponent("https://nodeauthentication-kino6052.c9.io/auth/fitbit") + "&",
			scope: "scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight"
		};
var fitbitAuthUrl = "https://www.fitbit.com/oauth2/authorize?" + fitbitAuthData.response_type + fitbitAuthData.client_id + fitbitAuthData.redirect_uri + fitbitAuthData.scope;

var fitbitGetTokenData = {
    url: "https://api.fitbit.com/oauth2/token?",
	data: {
		client_id:"229WMB&",
		grant_type: "authorization_code&",
		redirect_uri: encodeURIComponent("https://nodeauthentication-kino6052.c9.io/auth/fitbit") + "&",
	},
	headers: {
		"Authorization": "Basic " + new Buffer("229WMB:e10e600a259dc0696dd9220bde092c7e").toString('base64'),
		"Content-Type": "application/x-www-form-urlencoded"
	}
};

var fitbitTokenUrl = fitbitGetTokenData.url + 
"client_id=" + fitbitGetTokenData.data.client_id +
"grant_type=" + fitbitGetTokenData.data.grant_type +
"redirect_uri=" + fitbitGetTokenData.data.redirect_uri + 
"code=";

var deliveryAuthData = {
	response_type: "response_type=code&",
	client_id: "client_id=Zjk0YzdhYzg3YTAyZmI1YTFkZjM0OGYyYWQwMDBmYzJl&",
	redirect_uri: "redirect_uri=" + encodeURIComponent("https://nodeauthentication-kino6052.c9.io/auth/delivery") + "&",
	scope: "scope=global"
};

var deliveryAuthUrl = "https://www.delivery.com/third_party/authorize?" + deliveryAuthData.response_type + deliveryAuthData.client_id + deliveryAuthData.redirect_uri + deliveryAuthData.scope;

var deliveryTokenUrl = "https://www.delivery.com/third_party/access_token?" + 
deliveryAuthData.client_id +
"client_secret=" + "yFza5dVFayUqE9z8TbJBroEAt014mqQy2Zt4N86r&" +
"grant_type=" + "authorization_code&" +
deliveryAuthData.redirect_uri +
"code=";

exports.urls = {
    fitbitAuthUrl: fitbitAuthUrl,
    fitbitTokenUrl: fitbitTokenUrl,
    fitbitHeaders: fitbitGetTokenData.headers,
    
    deliveryAuthUrl: deliveryAuthUrl,
    deliveryTokenUrl: deliveryTokenUrl
}; 
/************* Constants *************/

/* Var : string APIKEY
*  Replace by your own API Key
*/
var APIKEY = "";

var retina = window.devicePixelRatio >= 2;
var retina3 = window.devicePixelRatio >= 3;

var pluginDidDisappear = false;

/************* GB Plugin API Callback Methods Implementation *************/

/* Callback : gbRequestDidSuccess
*  Called when the Weather API HTTP request is a success.
*/
function gbRequestDidSuccess ( tag, data, src )
{
	toggleRefresh ();
	if (gbUserInfo && gbUserInfo.platform == 'ios'){
	    fillPageWithData ( JSON.parse ( data ) );
    }
    else 
    {
	    fillPageWithData ( JSON.parse (decodeURIComponent( data )) );
    }
}

/* Callback : gbRequestDidSuccessWithCache
*  Called when the Weather API HTTP request is a success and cached.
*/
function gbRequestDidSuccessWithCache ( tag, data, src )
{
	toggleRefresh ();
	if (gbUserInfo && gbUserInfo.platform == 'ios'){
	    fillPageWithData ( JSON.parse ( data ) );
    }
    else 
    {
	    fillPageWithData ( JSON.parse (decodeURIComponent( data )) );
    }
}

/* Callback : gbRequestDidFail
*  Called when the Weather API HTTP request failed.
*/
function gbRequestDidFail ( errorCode, errorMessage )
{
	toggleRefresh ();
}

/* Callback : gbPluginDidLoad
*  Called just after the plugin loading.
*/
function gbPluginDidLoad ()
{
	refresh ();
}

/* Callback : gbViewDidAppear
*  Called just after the view appears.
*/
function gbViewDidAppear ()
{
	if ( pluginDidDisappear )
		refresh ();
}

/* Callback : gbViewDidDisappear
*  Called just after the view appears.
*/
function gbViewDidDisappear ()
{
	pluginDidDisappear = true;
}

/* Callback : gbDidSuccessGetPreference
*  Called when the plugin returns the preference requested.
*/
function gbDidSuccessGetPreference ( key, valueString )
{
	if ( key == "location" )
	{
		if ( (valueString == "Local") || (valueString == "") )
		{
			gbGetLocation();
		}
		else
		{
			gbDidSuccessGetLocation ( listOfCities[valueString]["lat"], listOfCities[valueString]["long"] );
		}
	}
	else
	{
		gbGetLocation();
	}
}

/* Callback : gbDidSuccessGetLocation
*  Called when the getLocation method got the user geolocation.
*/
function gbDidSuccessGetLocation ( lat, long )
{
	var api_url = "http://api.wunderground.com/api/" + APIKEY + "/conditions/q/" + lat + "," + long + ".json";
	gbRequest ( api_url, '1', 'YES' );
}

/* Callback : gbDidFailGetLocation
*  Called when the getLocation method failed getting the user geolocation.
*/
function gbDidFailGetLocation ( errorMessage )
{
	toggleRefresh ();
	alert ( "You have to activate your geolocation settings" );
}

/************* Custom methods *************/

/* Function : toggleRefresh
*  Toggle visbility of the refresh button and the loading spinner.
*/
function toggleRefresh ()
{
	if ( document.getElementById('refreshButton').style.display == "none" )
		document.getElementById('refreshButton').style.display = "block";
	else
		document.getElementById('refreshButton').style.display = "none";

	if ( document.getElementById('loadingSpinner').style.display == "none" )
		document.getElementById('loadingSpinner').style.display = "block";
	else
		document.getElementById('loadingSpinner').style.display = "none";
}

/* Function : refresh
*  A method that refresh the user's geolocation, and calls the weather API.
*/
function refresh ( from )
{
	gbGetPreference ( "location" );
	toggleRefresh ();
}

/* Function : fillPageWithData
*  A method that insert the data returned by the weather API in the plugin page.
*  @param data The JSON object returned by the weather API
*/
function fillPageWithData ( data )
{
	document.getElementById("city").innerHTML = data["current_observation"]["display_location"]["full"];
	document.getElementById("temp").innerHTML = parseInt(data["current_observation"]["temp_c"]) + "°C";
	document.getElementById("weather").innerHTML = data["current_observation"]["weather"];
	var iconName = data["current_observation"]["icon"];
	if ( retina3 )
		iconName += "@3x";
	else if ( retina )
		iconName += "@2x";
	document.getElementById("iconImg").src = "./icon_" + iconName + ".png";
	document.getElementById("iconImg").style.display = "block";
	setBodyBackgroundColorWithTemp ( parseInt(data["current_observation"]["temp_c"]) );
}

/* Function : setBodyBackgroundColorWithTemp
*  A function that sets the body background color with the temp parameter.
*  @param temp The temperature to use
*/
function setBodyBackgroundColorWithTemp ( temp )
{
	var color = "#cccccc";
	if ( temp <= 3 )
		color = "#a0c0c7";
	else if ( temp <= 6 )
		color = "#6ea9b6";
	else if ( temp <= 9 )
		color = "#4396a9";
	else if ( temp <= 11 )
		color = "#00acb8";
	else if ( temp <= 21 )
		color = "#75bd24";
	else if ( temp <= 25 )
		color = "#b1cb00";
	else if ( temp <= 28 )
		color = "#f1a123";
	else if ( temp <= 30 )
		color = "#ea4f06";
	else if ( temp > 30 )
		color = "#d44220";
	else
		color = "#cccccc";

	document.body.style.backgroundColor = color;
}

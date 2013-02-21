/************* Constants *************/

var currentLocation;
var retina = window.devicePixelRatio >= 2;

/************* GB Plugin API Callback Methods Implementation *************/

/* Callback : gbDidSuccessGetPreference
*  Called when the plugin returns the preference requested.
*/
function gbDidSuccessGetPreference ( key, valueString )
{
	if ( key == "location" )
	{
		if ( (valueString == "Local") || (valueString == "") )
		{
			currentLocation = "Local";
		}
		else
		{
			currentLocation = valueString;
		}
	}
	else
	{
		currentLocation = "Local";
	}
	
	setCorrectCheckmarks ();
}

/************* Custom methods *************/

/* Function : initializeCities
*  Populates the Table View
*/
function initializeCities ()
{
	document.getElementById("cities").innerHTML = "";
	for ( var city in listOfCities )
	{
		var checkmarkImg = "checkmark.png";
		if ( retina )
			checkmarkImg = "checkmark@2x.png";
		document.getElementById("cities").innerHTML += "<p onclick=\"javascript:setCurrentLocation('" + city + "');\">" + listOfCities[city]["displayName"] + " <span><img id=\"checkmark" + city + "\" src=\"./" + checkmarkImg + "\" style=\"width:12px;height:13px;display:none;\" /></span></p>";
	}

	gbGetPreference ( "location" );
	//gbDidSuccessGetPreference('location', 'SF');
}

/* Function : setCorrectCheckmarks
*  Toggle visbility of the checkmarks regarding the current location. 
*/
function setCorrectCheckmarks ()
{
	hideAllCheckmarks();
	var checkmarkName = "checkmark"+currentLocation;
	document.getElementById(checkmarkName).style.display = "block";
}

/* Function : hideAllCheckmarks
*  A method that hides all checkmarks. 
*/
function hideAllCheckmarks ()
{
	for ( var city in listOfCities )
	{
		var checkmarkName = "checkmark"+city;
		document.getElementById(checkmarkName).style.display = "none";
	}
}

/* Function : setCurrentLocation
*  Set the current location 
*/
function setCurrentLocation ( city )
{
	gbSetPreference ( "location", city );
	currentLocation = city;
	setCorrectCheckmarks ();
}
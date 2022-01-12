// This code runs on the Flic hub.
// When clicking on a Flic button, a new reading will be posted to a corresponding Zira form based on the button's name.
// The code supports multiple buttons. On each click, the hub make request for "get data-sources list" to find the form's meter ID.
// Then, perform "get reading" to find the lastest run number and employee ID.
// Post a new reading in the form with correct run number, meter id, and 1 unit.

var buttonManager = require("buttons"); 
var http = require("http");
var meterId = 0 
var urlPost = "https://api.zira.us/public/reading/named/";
var urlGet = "https://api.zira.us/public/reading?meterId=" + meterId + "&limit=1&endTime=2040-01-31"
var urlDataSource = "https://api.zira.us/public/data-sources?textSearch=" 
var runNumber = -1 
var employeeId = -1
var apiKey = "18e2b787-09a5-406e-b6e8-888e7a3e9f87" 

// When clicking on the button, this code runs
buttonManager.on("buttonSingleOrDoubleClickOrHold", function(obj) {
	var button = buttonManager.getButton(obj.bdaddr); // the button that was clicked
	var clickType = obj.isSingleClick ? "click" : obj.isDoubleClick ? "double_click" : "hold";
	var name = button.name // name of the button
	urlDataSource = urlDataSource + name // updates the url for the data source list
	
	// Use the name of button to find the meter ID through "get data-sources list" command 
	http.makeRequest({
		url: urlDataSource,
		method: "GET",
		headers: {"X-API-Key":apiKey, "Content-Type": "application/json"},
	},
	function(err, res) {
		var info = res.content
		// changes the string of the data sources in json format
		var openBrackets = info.indexOf('[')
		var closeBrackets = info.indexOf(']')
		var data = info.slice(openBrackets+1, closeBrackets)
		index = data.indexOf(name)
		var json = JSON.parse(data);
		// going through all the keys in the json, and finding an item that matches name of the button
		for (var key in json) {
			if (json[key]==name) {
				// finding the meter id that correlates to the name 
				meterId = json.id;
				// updating the URL with the correct meter id
				urlGet = "https://api.zira.us/public/reading?meterId=" + meterId + "&limit=1&endTime=2040-01-31";
				break;
			}
		}
		// GET method to find the lastest run number and employee ID
		http.makeRequest({
			url: urlGet,
			method: "GET",
			headers: {"X-API-Key":apiKey, "Content-Type": "application/json"},
	}, 
		function(err, res) {
			var info = res.content;
			// organized the information of the data sources in json format
			var openBrackets = info.indexOf('[')
			var closeBrackets = info.indexOf(']')
			var data = info.slice(openBrackets+1, closeBrackets)
			var json = JSON.parse(data);
			runNumber = json.run_number
			employeeId = json.employee_id_number
		
		// Post a new reading in the form with correct run number and meter id
		http.makeRequest({
		url: urlPost,
		method: "POST",
		headers: {"X-API-Key":apiKey, "Content-Type": "application/json"},
		content: JSON.stringify({"meterId":meterId, "values":{"Units":1, "Employee ID Number":employeeId, "Run Number":runNumber}}),		
	}, function(err, res) {
		urlDataSource = "https://api.zira.us/public/data-sources?textSearch="
		// DEBUG: console.log("done! " + name);
	});
	});
	});
});
console.log("Started");

// This JS file will use to extract location of the vehicle sent to the server through the vsim 
// and display them onto the map
//Go into the databse to take the location stored
console.log("Running displayVehicleLocation.js")

//calling function: 
getVehicleLocationFromVSIM()

function getVehicleLocationFromVSIM(){
    var vehicleID = ""
    var vehicleLong = 0.0
    var vehicleLat = 0.0
    var block;
    //For debugging purposes: 
    console.log("getVehicleLocationFromVSIM() is called!!!");
    var url = 'https://supply.team12.softwareengineeringii.com/api/cs?vehicle=22&get=all'; //the path needed to get into the database 
    //making a bridge to the web server
    var request = new XMLHttpRequest();
    //Wrapping the request content into a json object: 
    // var jsonObject = JSON.stringify(vehicleName)
    //initializing the request to the web server through a GET request 
    request.open('GET', url, true)
    //Setting the header of the API request 
    // request.setRequestHeader("Content-type", "applicaiton/json");
    //Determining the status of the request. 
    request.onload = function(){
        console.log('request.onload is called!');
        //Using JSON to parse API response: 
        var vehicleInfo = JSON.parse(this.response);
        //Good response: 
        if(request.status >= 200 && request.status < 400){
            //Printing out each element in the response.
            //This is useful for testing purposes but will be commneted later on for QA testing.
            vehicleInfo.forEach(element => {
                //printing out each object returned from the API: 
                console.log(element);
            });
            console.log(vehicleInfo[0]["_id"])
            console.log(vehicleInfo[0]["vehicle_position"][0]) //vehicle longtitude
            console.log(vehicleInfo[0]["vehicle_position"][1]) //vehicle lattitude
            //Assigning vehicle information into local variables
            vehicleID = vehicleInfo[0]['_id']
            vehicleLong = vehicleInfo[0]['vehicle_position'][0]
            vehilceLat = vehicleInfo[1]['vehicle_position'][1]
            
            var arrayOfValues = [vehicleID, vehicleLong, vehicleLat]

            return arrayOfValues

        }
        //Error handling: 
        else{
            const errorMessage = document.createElement('error'); 
            errorMessage.textContent = "Connection error!"; 
            alert(request.status + "FAILED: Unable to retrieve vehicle location!!!");
            //Error code status: 
            console.log(request.status);

        }
    }

    //Request get sent out: 
    request.send()
// End of the script!
}


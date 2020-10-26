//Initiate a map:
mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsbGx1b25nOTciLCJhIjoiY2s2bno3OTNvMGRnaTNqcGJzOG9jY2N2ZiJ9.HfvhKBvZreCaO8KFqlYkRw'; //Map token
//initializing a map:
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
//Austin, Texas
center: [-97.7431, 30.2672],
zoom: 11
});

//function to retrieve vehicle longtitude and lattiude from the interal Python WebServer.
function getVehicleLocationFromVSIM(){
    var vehicleID = ""
    var vehicleLong = 0.0
    var vehicleLat = 0.0
    var block;
    //For debugging purposes: 
    console.log("getVehicleLocationFromVSIM() is called!!!");
    var url = 'https://supply.team12.softwareengineeringii.com/api/cs?vehicle-all=1'; //API Path
    //making a bridge to the web server
    var request = new XMLHttpRequest();
    //Making a GET request: 
    request.open('GET', url, true)
    //Setting the header of the API request 
    // request.setRequestHeader("Content-type", "applicaiton/json");
    //Determining the status of the request. 
    request.onload = function(){
        console.log('request.onload is called!');
        //Using JSON to parse API response: 
        //This JSON object will contains information about the Point of Interest, i.e. Longtitude and Latitude.
        var vehicleInfo = JSON.parse(this.response);
        //Good response: an object is received from the front end: 
        //The object recieved back will be in the dictionary form
        if(request.status >= 200 && request.status < 400){
            //Printing out each element in the response.
            //This is useful for testing purposes but will be commneted later on for QA testing.
            //Looping 
            vehicleInfo.forEach(element => {
                //printing out each object returned from the API: 
                console.log(element);
            });
            // console.log(vehicleInfo[0]["_id"])
            // console.log(vehicleInfo[0]["vehicle_position"][0]) //vehicle longtitude
            // console.log(vehicleInfo[0]["vehicle_position"][1]) //vehicle lattitude
            //Assigning vehicle information into local variables
            // vehicleName = vehicleInfo[0]['vehicle_name']
            //going through the dictionary to get the longtitude and latitude of the point of interest
            vehicleLong = vehicleInfo[0]['vehicle_position'][0] 
            vehilceLat = vehicleInfo[0]['vehicle_position'][1]

            vID_06 = vehicleInfo[5]['vehicle_name']
            vehicleLong_06 = vehicleInfo[5]['vehicle_position'][0]
            vehilceLat_06 = vehicleInfo[5]['vehicle_position'][1]

            //Assign them the long and lat into a local object in the front end
            var vsimLocation_1 = [vehicleLong, vehilceLat] //location of point 1
            var vsimLocation_2 = [vehicleLong_06, vehilceLat_06] //location of point 2
            
            console.log(vsimLocation_2)
            console.log(vsimLocation_1)
            //Initializing a map and add the point onto it:
            map.on('load', function() {

                map.addSource('points', {
                    'type': 'geojson',
                    'data': {
                    'type': 'FeatureCollection',
                    'features': [
                    {
                    // feature for Mapbox DC
                    'type': 'Feature',
                    'geometry': {
                    'type': 'Point',
                    'coordinates': vsimLocation_1 // => ADDING THE POINT TO THE MAP BY GIVING IT A SET OF LONGTITUDE AND LATTITUDE HERE!!!
                    },
                    'properties': {
                    'title': vehicleName,
                    'icon': 'car'
                    }
                    },
                    {
                    // feature for Mapbox SF
                    'type': 'Feature',
                    'geometry': {
                    'type': 'Point',
                    'coordinates': vsimLocation_2 // => ADDING THE POINT TO THE MAP BY GIVING IT A SET OF LONGTITUDE AND LATTITUDE HERE!!!
                    },
                    'properties': {
                    'title': vID_06,
                    'icon': 'car'
                    }
                    }
                        
                    ]
                    }
                    });

                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'points',
                    'layout': {
                    // get the icon name from the source's "icon" property
                    // concatenate the name to get an icon from the style's sprite sheet
                    'icon-image': ['concat', ['get', 'icon'], '-15'],
                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 0.6],
                    'text-anchor': 'top'
                    }
                    });
            })

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

getVehicleLocationFromVSIM()
// var vehicleFromVsimLat = getVehicleLocationFromVSIM().vehicleLat
// var vehicleFromVsimID = getVehicleLocationFromVSIM().vehicleID


// function displayWarehouseLocationOntoMap(){
//     var warehouseLocation = [];
//     var warehouseLong = 0.0; 
//     var warehouseLat = 0.0; 
//     var warehouseName = "";


//     //Debugging call: 
//     console.log("Running dispplayWareHouseLocationOnMap()")
//     //SUBJECT TO CHANGES:
//     var url = 'https://supply.team12.softwareengineeringii.com/api/cs/fetchfleet'; //the path needed to get into the database 
//     //making a bridge to the web server
//     var request = new XMLHttpRequest();
//     //initializing the request to the web server through a GET request 
//     request.open('GET', url, true)
//     //Setting the header of the API request 
//     // request.setRequestHeader("Content-type", "applicaiton/json");
//     //Determining the status of the request. 
//     request.onload = function(){
//         console.log('request.onload is called!');
//         //Using JSON to parse API response: 
//         var wareHouseInfo = JSON.parse(this.response);
//         //Good response: 
//         if(request.status >= 200 && request.status < 400){
//             //Printing out each element in the response.
//             //This is useful for testing purposes but will be commneted later on for QA testing.
//             wareHouseInfo.forEach(element => {
//                 console.log(element)
//                 //printing out each warehouse object in the response back from the server:  
//             //     for( i = 0; i < element.length; i++)
//             //     {
//             //         //Looping through the response request to pull out information in regards to warehouse to display them on the map.
//             //         console.log(element[i]['warehouses']['']);
//             //         warehouseName = element[i]['warehouses']['warehouse_name']
//             //         wareHouseLong = element[i]['warehouses']['coordinates'][0];
//             //         wareHouseLat = element[i]['warehosues']['coordinates'][1];
//             //         wareHouseLocation = [wareHouseLong, wareHouseLat];

//             //         //Initializing a map and display the warehouse location to it: 
//             //         map.on('load', function() {

//             //             map.addSource('points', {
//             //                 'type': 'geojson',
//             //                 'data': {
//             //                 'type': 'FeatureCollection',
//             //                 'features': [
//             //                 {
//             //                 // feature for Mapbox DC
//             //                 'type': 'Feature',
//             //                 'geometry': {
//             //                 'type': 'Point',
//             //                 'coordinates': wareHouseLocation
//             //                 },
//             //                 'properties': {
//             //                 'title': warehouseName,
//             //                 'icon': 'warehouse'
//             //                 }
//             //                 }                                
//             //                 ]
//             //                 }
//             //                 });

//             //             map.addLayer({
//             //                 'id': 'points',
//             //                 'type': 'symbol',
//             //                 'source': 'points',
//             //                 'layout': {
//             //                 // get the icon name from the source's "icon" property
//             //                 // concatenate the name to get an icon from the style's sprite sheet
//             //                 'icon-image': ['concat', ['get', 'icon'], '-15'],
//             //                 // get the title name from the source's "title" property
//             //                 'text-field': ['get', 'title'],
//             //                 'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
//             //                 'text-offset': [0, 0.6],
//             //                 'text-anchor': 'top'
//             //                 }
//             //                 });
//             //         })


//             //     }

//             });
//         }
//         //Error handling: 
//         else{
//             const errorMessage = document.createElement('error'); 
//             errorMessage.textContent = "Connection error!"; 
//             alert(request.status + "FAILED: Unable to retrieve vehicle location!!!");
//             //Error code status: 
//             console.log(request.status);

//         }
//     }
//     var fleetData = {"ObjectId": "5e8ff9fe90a566d2e2cc8616"};
//     //Wrapping the data set into a JSON object to send them to the database: 
//     var fleet_object_identification = JSON.stringify(fleetData);


//     //Request get sent out: 
//     request.send(fleet_object_identification)
// // End of the script!
// }

// displayWarehouseLocationOntoMap()

// // Add zoom and rotation controls to the map.
// map.addControl(new mapboxgl.NavigationControl());

// // staring location
// var origin = [-97.75420497090784, 30.228307630110763];
 
// // Final destination
// var destination = [-97.71125887285626, 30.3483875815229];
 
// //Vehicle 2: 
// var start0 = [-97.84711491534438,30.49535582487303];
// var end0 = [-97.62929954930314, 30.41318463577643];

// //Vehicle 3: 
// var start1 = [-97.81167155195936, 30.282114694415498]
// var en1 = [-97.89289395173125, 30.225779303833704]


// //Vehicle 4: 
// var start2 = [-97.6677088309869, 30.200841153498345];
// var end2 = [-97.80690516880395, 30.161614278042038];


// // A simple line from origin to destination.
// var route = {
// 'type': 'FeatureCollection',
// 'features': [
// {
// 'type': 'Feature',
// 'geometry': {
// 'type': 'LineString',
// "coordinates": [[
//                         -97.757431,
//                         30.232056
//                     ],
//                     [
//                         -97.75811,
//                         30.233068
//                     ],
//                     [
//                         -97.753571,
//                         30.238791
//                     ],
//                     [
//                         -97.740501,
//                         30.23361
//                     ],
//                     [
//                         -97.739784,
//                         30.23531
//                     ],
//                     [
//                         -97.739273,
//                         30.236271
//                     ],
//                     [
//                         -97.738525,
//                         30.237511
//                     ],
//                     [
//                         -97.737236,
//                         30.240242
//                     ],
//                     [
//                         -97.735031,
//                         30.244246
//                     ],
//                     [
//                         -97.735329,
//                         30.24831
//                     ],
//                     [
//                         -97.735435,
//                         30.25001
//                     ],
//                     [
//                         -97.735985,
//                         30.252472
//                     ],
//                     [
//                         -97.736603,
//                         30.254356
//                     ],
//                     [
//                         -97.736809,
//                         30.25934
//                     ],
//                     [
//                         -97.729797,
//                         30.278528
//                     ],
//                     [
//                         -97.709465,
//                         30.310757
//                     ],
//                     [
//                         -97.706657,
//                         30.322145
//                     ],
//                     [
//                         -97.705612,
//                         30.325123
//                     ],
//                     [
//                         -97.704704,
//                         30.330841
//                     ],
//                     [
//                         -97.699493,
//                         30.33898
//                     ],
//                     [
//                         -97.704742,
//                         30.34384
//                     ],
//                     [
//                         -97.711761,
//                         30.347588
//                     ],
//                     [
//                         -97.71151,
//                         30.348476
//                     ],
//                     [
//                         -97.711296,
//                         30.348373
// 					]
// ],
// }
// }
// ]
// };

// var route00 = {
// 'type': 'FeatureCollection',
// 'features': [
// {
// 'type': 'Feature',
// 'geometry': {
// 'type': 'LineString',
// "coordinates": [
//                     [
//                         -97.846748,
//                         30.495192
//                     ],
//                     [
//                         -97.846413,
//                         30.495741
//                     ],
//                     [
//                         -97.845604,
//                         30.495325
//                     ],
//                     [
//                         -97.844124,
//                         30.497412
//                     ],
//                     [
//                         -97.838333,
//                         30.491282
//                     ],
//                     [
//                         -97.838196,
//                         30.485586
//                     ],
//                     [
//                         -97.835434,
//                         30.482658
//                     ],
//                     [
//                         -97.831207,
//                         30.480993
//                     ],
//                     [
//                         -97.825172,
//                         30.481058
//                     ],
//                     [
//                         -97.818703,
//                         30.478537
//                     ],
//                     [
//                         -97.815186,
//                         30.475306
//                     ],
//                     [
//                         -97.810951,
//                         30.475285
//                     ],
//                     [
//                         -97.811356,
//                         30.470303
//                     ],
//                     [
//                         -97.808067,
//                         30.464687
//                     ],
//                     [
//                         -97.803009,
//                         30.466227
//                     ],
//                     [
//                         -97.798424,
//                         30.467922
//                     ],
//                     [
//                         -97.781334,
//                         30.47319
//                     ],
//                     [
//                         -97.769585,
//                         30.474743
//                     ],
//                     [
//                         -97.74897,
//                         30.481039
//                     ],
//                     [
//                         -97.74102,
//                         30.480995
//                     ],
//                     [
//                         -97.728661,
//                         30.477501
//                     ],
//                     [
//                         -97.715065,
//                         30.479691
//                     ],
//                     [
//                         -97.701767,
//                         30.476442
//                     ],
//                     [
//                         -97.669044,
//                         30.480808
//                     ],
//                     [
//                         -97.637444,
//                         30.488581
//                     ],
//                     [
//                         -97.619202,
//                         30.48567
//                     ],
//                     [
//                         -97.596832,
//                         30.475561
//                     ],
//                     [
//                         -97.593971,
//                         30.472239
//                     ],
//                     [
//                         -97.594788,
//                         30.465128
//                     ],
//                     [
//                         -97.594307,
//                         30.447252
//                     ],
//                     [
//                         -97.591827,
//                         30.437122
//                     ],
//                     [
//                         -97.590759,
//                         30.430817
//                     ],
//                     [
//                         -97.589066,
//                         30.424324
//                     ],
//                     [
//                         -97.610443,
//                         30.435019
//                     ],
//                     [
//                         -97.624626,
//                         30.411512
//                     ],
//                     [
//                         -97.626984,
//                         30.413214
//                     ],
//                     [
//                         -97.627762,
//                         30.411905
//                     ],
//                     [
//                         -97.62957,
//                         30.412777
//                     ]
//                 ],
// }
// }
// ]
// };

// var route01 = {
// 'type': 'FeatureCollection',
// 'features': [
// {
// 'type': 'Feature',
// 'geometry': {
// 'type': 'LineString',
// "coordinates": [
//                     [
//                         -97.811676,
//                         30.282097
//                     ],
//                     [
//                         -97.810905,
//                         30.281725
//                     ],
//                     [
//                         -97.812401,
//                         30.279625
//                     ],
//                     [
//                         -97.817337,
//                         30.276571
//                     ],
//                     [
//                         -97.819435,
//                         30.277576
//                     ],
//                     [
//                         -97.817734,
//                         30.274137
//                     ],
//                     [
//                         -97.818359,
//                         30.267082
//                     ],
//                     [
//                         -97.817924,
//                         30.265192
//                     ],
//                     [
//                         -97.806946,
//                         30.251038
//                     ],
//                     [
//                         -97.807846,
//                         30.245886
//                     ],
//                     [
//                         -97.809319,
//                         30.243874
//                     ],
//                     [
//                         -97.819939,
//                         30.23867
//                     ],
//                     [
//                         -97.825661,
//                         30.236771
//                     ],
//                     [
//                         -97.830383,
//                         30.236813
//                     ],
//                     [
//                         -97.832024,
//                         30.236717
//                     ],
//                     [
//                         -97.844269,
//                         30.236614
//                     ],
//                     [
//                         -97.852066,
//                         30.2355
//                     ],
//                     [
//                         -97.85968,
//                         30.235455
//                     ],
//                     [
//                         -97.865112,
//                         30.233921
//                     ],
//                     [
//                         -97.872925,
//                         30.2339
//                     ],
//                     [
//                         -97.88208,
//                         30.229467
//                     ],
//                     [
//                         -97.888229,
//                         30.229244
//                     ],
//                     [
//                         -97.888573,
//                         30.228424
//                     ],
//                     [
//                         -97.89061,
//                         30.225285
//                     ],
//                     [
//                         -97.891663,
//                         30.225836
//                     ],
//                     [
//                         -97.892891,
//                         30.225779
//                     ]
//                 ],
// }
// }
// ]
// };

// var route02 = {
// 'type': 'FeatureCollection',
// 'features': [
// {
// 'type': 'Feature',
// 'geometry': {
// 'type': 'LineString',
// "coordinates": [
//                     [
//                         -97.667747,
//                         30.202654
//                     ],
//                     [
//                         -97.665192,
//                         30.202765
//                     ],
//                     [
//                         -97.663925,
//                         30.203897
//                     ],
//                     [
//                         -97.662697,
//                         30.205824
//                     ],
//                     [
//                         -97.662376,
//                         30.209602
//                     ],
//                     [
//                         -97.658539,
//                         30.213125
//                     ],
//                     [
//                         -97.660896,
//                         30.214329
//                     ],
//                     [
//                         -97.665276,
//                         30.216654
//                     ],
//                     [
//                         -97.677322,
//                         30.222729
//                     ],
//                     [
//                         -97.680817,
//                         30.223282
//                     ],
//                     [
//                         -97.685295,
//                         30.221304
//                     ],
//                     [
//                         -97.692368,
//                         30.218035
//                     ],
//                     [
//                         -97.71019,
//                         30.21249
//                     ],
//                     [
//                         -97.740921,
//                         30.216101
//                     ],
//                     [
//                         -97.747147,
//                         30.21666
//                     ],
//                     [
//                         -97.750587,
//                         30.216642
//                     ],
//                     [
//                         -97.751991,
//                         30.216011
//                     ],
//                     [
//                         -97.757622,
//                         30.206673
//                     ],
//                     [
//                         -97.7724,
//                         30.188093
//                     ],
//                     [
//                         -97.781776,
//                         30.17383
//                     ],
//                     [
//                         -97.784576,
//                         30.169996
//                     ],
//                     [
//                         -97.786873,
//                         30.167124
//                     ],
//                     [
//                         -97.793785,
//                         30.167925
//                     ],
//                     [
//                         -97.80188,
//                         30.173937
//                     ],
//                     [
//                         -97.807388,
//                         30.174063
//                     ],
//                     [
//                         -97.808418,
//                         30.170439
//                     ],
//                     [
//                         -97.808128,
//                         30.169363
//                     ],
//                     [
//                         -97.809395,
//                         30.166733
//                     ],
//                     [
//                         -97.808701,
//                         30.163593
//                     ],
//                     [
//                         -97.807381,
//                         30.162796
//                     ]
//                 ],
// }
// }
// ]
// };

 

 
// // A single point that animates along the route.
// // Coordinates are initially set to origin.
// var point = {
// 'type': 'FeatureCollection',
// 'features': [
// {
// 'type': 'Feature',
// 'properties': {},
// 'geometry': {
// 'type': 'Point',
// 'coordinates': origin
// }
// }
// ]
// };

// // A single point that animates along the route.
// // Coordinates are initially set to origin.
// var point00 = {
// 'type': 'FeatureCollection',
// 'features': [
// {
// 'type': 'Feature',
// 'properties': {},
// 'geometry': {
// 'type': 'Point',
// 'coordinates': start0
// }
// }
// ]
// };

// var point01 = {
// 'type': 'FeatureCollection',
// 'features': [
// {
// 'type': 'Feature',
// 'properties': {},
// 'geometry': {
// 'type': 'Point',
// 'coordinates': start1
// }
// }
// ]
// };

// var point02 = {
// 'type': 'FeatureCollection',
// 'features': [
// {
// 'type': 'Feature',
// 'properties': {},
// 'geometry': {
// 'type': 'Point',
// 'coordinates': start2
// }
// }
// ]
// };
 
// // Calculate the distance in kilometers between route start/end point.
// var lineDistance = turf.lineDistance(route.features[0], 'kilometers');
// var lineDistance00 = turf.lineDistance(route00.features[0], 'kilometers');
// var lineDistance01 = turf.lineDistance(route01.features[0], 'kilometers');
// var lineDistance02 = turf.lineDistance(route02.features[0], 'kilometers');


 
// var arc = [];
// var arc1 = [];
// var arc2 = [];
// var arc3 = [];
// // Number of steps to use in the arc and animation, more steps means
// // a smoother arc and animation, but too many steps will result in a
// // low frame rate
// var steps = 15000;
 
// // Draw an arc between the `origin` & `destination` of the two points
// for (var i = 0; i < lineDistance; i += lineDistance / steps) {
// var segment = turf.along(route.features[0], i, 'kilometers');
// arc.push(segment.geometry.coordinates);
// }


// // Draw an arc between the `origin` & `destination` of the two points
// for (var x = 0; x < lineDistance00; x += lineDistance00 / steps) {
// var segment00 = turf.along(route00.features[0], x, 'kilometers');
// arc1.push(segment00.geometry.coordinates);
// }

// // Draw an arc between the `origin` & `destination` of the two points
// for (var x = 0; x < lineDistance01; x += lineDistance01 / steps) {
// var segment01 = turf.along(route01.features[0], x, 'kilometers');
// arc2.push(segment01.geometry.coordinates);
// }

// // Draw an arc between the `origin` & `destination` of the two points
// for (var x = 0; x < lineDistance02; x += lineDistance02 / steps) {
// var segment02 = turf.along(route02.features[0], x, 'kilometers');
// arc3.push(segment02.geometry.coordinates);
// }


 
// // Update the route with calculated arc coordinates
// route.features[0].geometry.coordinates = arc;
// route00.features[0].geometry.coordinates = arc1;
// route01.features[0].geometry.coordinates = arc2;
// route02.features[0].geometry.coordinates = arc3;

 
// // Used to increment the value of the point measurement against the route.
// var counter = 0;
// var counter00 = 0;
// var counter01 = 0;
// var counter02 = 0;

 
// map.on('load', function() {
// // Add a source and layer displaying a point which will be animated in a circle.
// map.addSource('route', {
// 'type': 'geojson',
// 'data': route
// });

// map.addSource('route00', {
// 'type': 'geojson',
// 'data': route00
// });

// map.addSource('route01', {
// 'type': 'geojson',
// 'data': route01
// });

// map.addSource('route02', {
// 'type': 'geojson',
// 'data': route02
// });

 
// map.addSource('point', {
// 'type': 'geojson',
// 'data': point
// });

// map.addSource('point00', {
// 'type': 'geojson',
// 'data': point00
// });

// map.addSource('point01', {
// 'type': 'geojson',
// 'data': point01
// });

// map.addSource('point02', {
// 'type': 'geojson',
// 'data': point02
// });


    

 
// map.addLayer({
// 'id': 'route',
// 'source': 'route',
// 'type': 'line',
// 'paint': {
// 'line-width': 2,
// 'line-color': '#007cbf'
// }
// });

// map.addLayer({
// 'id': 'route00',
// 'source': 'route00',
// 'type': 'line',
// 'paint': {
// 'line-width': 2,
// 'line-color': '#007cbf'
// }
// });

// map.addLayer({
// 'id': 'route01',
// 'source': 'route01',
// 'type': 'line',
// 'paint': {
// 'line-width': 2,
// 'line-color': '#007cbf'
// }
// });

// map.addLayer({
// 'id': 'route02',
// 'source': 'route02',
// 'type': 'line',
// 'paint': {
// 'line-width': 2,
// 'line-color': '#007cbf'
// }
// });



// map.addLayer({
// 'id': 'point',
// 'source': 'point',
// 'type': 'symbol',
// 'layout': {
// 'icon-image': 'car-15',
// 'icon-rotate': ['get', 'bearing'],
// 'icon-rotation-alignment': 'map',
// 'icon-allow-overlap': true,
// 'icon-ignore-placement': true
// }
// });


 
// map.addLayer({
// 'id': 'point00',
// 'source': 'point00',
// 'type': 'symbol',
// 'layout': {
// 'icon-image': 'car-15',
// 'icon-rotate': ['get', 'bearing'],
// 'icon-rotation-alignment': 'map',
// 'icon-allow-overlap': true,
// 'icon-ignore-placement': true
// }
// });

// map.addLayer({
// 'id': 'point01',
// 'source': 'point01',
// 'type': 'symbol',
// 'layout': {
// 'icon-image': 'car-15',
// 'icon-rotate': ['get', 'bearing'],
// 'icon-rotation-alignment': 'map',
// 'icon-allow-overlap': true,
// 'icon-ignore-placement': true
// }
// });

// map.addLayer({
// 'id': 'point02',
// 'source': 'point02',
// 'type': 'symbol',
// 'layout': {
// 'icon-image': 'car-15',
// 'icon-rotate': ['get', 'bearing'],
// 'icon-rotation-alignment': 'map',
// 'icon-allow-overlap': true,
// 'icon-ignore-placement': true
// }
// });

 
// function animate() {
// // Update point geometry to a new position based on counter denoting
// // the index to access the arc.
// point.features[0].geometry.coordinates =
// route.features[0].geometry.coordinates[counter];

// point00.features[0].geometry.coordinates =
// route00.features[0].geometry.coordinates[counter];

// point01.features[0].geometry.coordinates =
// route01.features[0].geometry.coordinates[counter];

// point02.features[0].geometry.coordinates =
// route02.features[0].geometry.coordinates[counter];



 
// // Calculate the bearing to ensure the icon is rotated to match the route arc
// // The bearing is calculate between the current point and the next point, except
// // at the end of the arc use the previous point and the current point
// point.features[0].properties.bearing = turf.bearing(
// turf.point(
// route.features[0].geometry.coordinates[
// counter >= steps ? counter - 1 : counter
// ]
// ),
// turf.point(
// route.features[0].geometry.coordinates[
// counter >= steps ? counter : counter + 1
// ]
// )
// );

// point00.features[0].properties.bearing = turf.bearing(
// turf.point(
// route00.features[0].geometry.coordinates[
// counter >= steps ? counter - 1 : counter
// ]
// ),
// turf.point(
// route00.features[0].geometry.coordinates[
// counter >= steps ? counter : counter + 1
// ]
// )
// );

// point01.features[0].properties.bearing = turf.bearing(
// turf.point(
// route01.features[0].geometry.coordinates[
// counter >= steps ? counter - 1 : counter
// ]
// ),
// turf.point(
// route01.features[0].geometry.coordinates[
// counter >= steps ? counter : counter + 1
// ]
// )
// );

// point02.features[0].properties.bearing = turf.bearing(
// turf.point(
// route02.features[0].geometry.coordinates[
// counter >= steps ? counter - 1 : counter
// ]
// ),
// turf.point(
// route02.features[0].geometry.coordinates[
// counter >= steps ? counter : counter + 1
// ]
// )
// );



 
// // Update the source with this new data.
// map.getSource('point').setData(point);
// map.getSource('point00').setData(point00);
// map.getSource('point01').setData(point01);
// map.getSource('point02').setData(point02);


 
// // Request the next frame of animation so long the end has not been reached.
// if (counter < steps) {
// requestAnimationFrame(animate);
// }

// counter = counter + 1;
// }


// // // Heartbeat implementation: 
// // var  i; 
// // for (i=0; i <= steps; i++)
// // {
// // 	if(i = 10){
// // 		console.log("Status: Picking up Packages")
// // 	}

// // 	// else if(i = 20){
// // 	// 	console.log("Status: Waiting for further instruction! ")
// // 	// }

// // 	console.log("Status: Idle")
// // }

 
// document.getElementById('replay').addEventListener('click', function() {
// // Set the coordinates of the original point back to origin
// point.features[0].geometry.coordinates = origin;
// point00.features[0].geometry.coordinates = start0;
// point01.features[0].geometry.coordinates = start1;
// point02.features[0].geometry.coordinates = start2;



 
// // Update the source layer
// map.getSource('point').setData(point);
// map.getSource('point00').setData(point00);
// map.getSource('point01').setData(point01);
// map.getSource('point02').setData(point02);

// // Reset the counter
// counter = 0;
 
// // Restart the animation.
// animate(counter);
// });
 
// // Start the animation.
// animate(counter);
// });

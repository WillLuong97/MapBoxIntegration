//This script file will incorporate a starting point, a package pickup locations, and mutiple stops for drop off location.
var truckLocation = [-97.735530, 30.267450];
var warehouseLocation = [-97.746117, 30.273319];

var defaultLocation = [-97.735530, 30.267450];
var startPoint;
var endPoint;


var url_string = window.location.href;
var url = new URL(url_string);
var startAddress = url.searchParams.get("start");
var endAddress = url.searchParams.get("end");
var default_startAddress = "608 Victoria Drive, Cedar Park, TX";
var default_endAddress = "3001 S Congress Avenue, Austin, TX";

var lastQueryTime = 0;
var lastAtRestaurant = 0;
var keepTrack = [];
var currentSchedule = [];
var currentRoute = null;
var pointHopper = {};
var pause = true;
var speedFactor = 50;

// Add your access token 
//Token to access the API key.
mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsbGx1b25nOTciLCJhIjoiY2s2bno3OTNvMGRnaTNqcGJzOG9jY2N2ZiJ9.HfvhKBvZreCaO8KFqlYkRw';

// Initialize a map
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: truckLocation, // starting position
    zoom: 12 // starting zoom
});

// initialize the map canvas to interact with later
var canvas = map.getCanvasContainer();

/*
map.on('click', function (e) {
    var coordsObj = e.lngLat;
    canvas.style.cursor = '';
    var coords = Object.keys(coordsObj).map(function (key) {
        return coordsObj[key];
    });
    var end = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: coords
            }
        }
        ]
    };
    if (map.getLayer('end')) {
        map.getSource('end').setData(end);
    } else {
        map.addLayer({
            id: 'end',
            type: 'circle',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: coords
                        }
                    }]
                }
            },
            paint: {
                'circle-radius': 10,
                'circle-color': '#f30'
            }
        });
    }
    getRoute(startPoint, coords);
});
*/

map.on('load', function () {
    if (startAddress != null && endAddress != null) {
        get_startCoordinates();
    }
});

// Forward Geocoder, returns address
function get_startCoordinates() {
    address = startAddress;
    parameter = default_startAddress.split(',').join("");
    parameter = encodeURIComponent(parameter.trim())
    console.log(parameter);
    var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + address + ".json?country=US&access_token=" + mapboxgl.accessToken;
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.ontimeout = function () {
        console.error("The request for " + url + " timed out.");
    };

    req.timeout = 2000;

    req.onload = function () {
        var json = JSON.parse(req.response);
        if (req.status >= 200 && req.status < 400) {
            var coordinates = json["features"][0]['geometry']['coordinates'];
            var lat = coordinates[0];
            var long = coordinates[1];
            startPoint = new Array(lat, long);
            get_endCoordinates();
        }
    }
    req.send();
}

// Forward Geocoder, returns address
function get_endCoordinates() {
    address = endAddress;
    parameter = default_endAddress.split(',').join("");
    parameter = encodeURIComponent(parameter.trim())
    console.log(parameter);
    var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + address + ".json?country=US&access_token=" + mapboxgl.accessToken;
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.ontimeout = function () {
        console.error("The request for " + url + " timed out.");
    };

    req.timeout = 2000;

    req.onload = function () {
        var json = JSON.parse(req.response);
        if (req.status >= 200 && req.status < 400) {
            var coordinates = json["features"][0]['geometry']['coordinates'];
            var lat = coordinates[0];
            var long = coordinates[1];
            endPoint = new Array(lat, long);
            drawStartingPoints();
        }
    }
    req.send();
}

// create a function to make a directions request
function getRoute(start, end) {
    console.log("getRoute Start: " + start);
    console.log("getRoute End: " + end);
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;

    // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function () {
        var json = JSON.parse(req.response);
        var data = json.routes[0];
        var route = data.geometry.coordinates;
        var geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: route
            }
        };
        // if the route already exists on the map, reset it using setData
        if (map.getSource('route')) {
            map.getSource('route').setData(geojson);
        } else { // otherwise, make a new request
            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: geojson
                        }
                    }
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });
        }
        // get the sidebar and add the instructions
        // var instructions = document.getElementById('instructions');
        // var steps = data.legs[0].steps;

        // var tripInstructions = [];
        // for (var i = 0; i < steps.length; i++) {
        //     tripInstructions.push('<br><li>' + steps[i].maneuver.instruction) + '</li>';
        //     instructions.innerHTML = '<br><span class="duration">Trip duration: ' + Math.floor(data.duration / 60) + ' min 🚌 </span>' + tripInstructions;
        // }
    };
    req.send();
}

function drawStartingPoints() {
    getRoute(startPoint, endPoint);
    map.addLayer({
        id: 'start',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: startPoint
                    }
                }
                ]
            }
        },
        paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
        }
    });
    getRoute(startPoint, endPoint);
    map.addLayer({
        id: 'end',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: endPoint
                    }
                }]
            }
        },
        paint: {
            'circle-radius': 10,
            'circle-color': '#f30'
        }
    });


    var bbox = [startPoint, endPoint];
    map.fitBounds(bbox, {
        padding: { top: 55, bottom: 45, left: 50, right: 50 }
    });

    var geojson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    'title': "Start",
                    'description': startAddress
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': startPoint
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'title': "Destination",
                    'description': endAddress
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': endPoint
                }
            },
        ]
    };

    var el_start = document.createElement('div');
    el_start.className = 'start_marker';
    el_start.style.backgroundImage = 'url(home.png)';
    el_start.style.width = '50px';
    el_start.style.height = '50px';

    var el_end = document.createElement('div');
    el_end.className = 'end_marker';
    el_end.style.backgroundImage = 'url(map-pin.png)';
    el_end.style.width = '50px';
    el_end.style.height = '50px';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el_start, {offset: [0, -25]})
        .setLngLat(startPoint)
        .setPopup(new mapboxgl.Popup({ offset: 35 }) // add popups
            .setHTML('<h3>' + geojson.features[0].properties.title + '</h3><p>' + geojson.features[0].properties.description + '</p>'))
        .addTo(map);

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el_end, {offset: [0, -25]})
    .setLngLat(endPoint)
    .setPopup(new mapboxgl.Popup({ offset: 35 }) // add popups
        .setHTML('<h3>' + geojson.features[1].properties.title + '</h3><p>' + geojson.features[1].properties.description + '</p>'))
    .addTo(map);

}

/*

// Create a GeoJSON feature collection for the prison
var warehouse = turf.featureCollection([turf.point(warehouseLocation)]);

//Using the marker as the truck location on the map.
map.on('load', function () {
    var marker = document.createElement('div');
    marker.classList = 'truck';

    // Create a new marker
    truckMarker = new mapboxgl.Marker(marker)
        .setLngLat(truckLocation)
        .addTo(map);

    // Create a circle layer
    map.addLayer({
        id: 'warehouse',
        type: 'circle',
        source: {
            data: warehouse,
            type: 'geojson'
        },

        paint: {
            'circle-radius': 20,
            'circle-color': 'white',
            'circle-stroke-color': '#3887be',
            'circle-stroke-width': 3
        }


    });

    // Create a symbol layer on top of circle layer
    map.addLayer({
        id: 'warehouse-symbol',
        type: 'symbol',
        source: {
            data: warehouse,
            type: 'geojson'
        },
        layout: {
            'icon-image': 'town-hall-15',
            'icon-size': 1
        },
        paint: {
            'text-color': '#3887be'
        }

    });

    //Adding directionality to the route line
    map.addLayer({
        id: 'routearrows',
        type: 'symbol',
        source: 'route',
        layout: {
            'symbol-placement': 'line',
            'text-field': '▶',
            'text-size': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 24,
                22, 60
            ],
            'symbol-spacing': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 30,
                22, 160
            ],
            'text-keep-upright': false
        },
        paint: {
            'text-color': '#3887be',
            'text-halo-color': 'hsl(55, 11%, 96%)',
            'text-halo-width': 3
        }
    }, 'waterway-label');


    // Create an empty GeoJSON feature collection for drop-off locations
    var dropoffs = turf.featureCollection([]);
    // Create an empty GeoJSON feature collection, which will be used as the data source for the route before users add any new data
    var nothing = turf.featureCollection([]);

    map.addLayer({
        id: 'dropoffs-symbol',
        type: 'symbol',
        source: {
            data: dropoffs,
            type: 'geojson'
        },
        layout: {
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-image': 'marker-15',
        }
    });

    map.addSource('route', {
        type: 'geojson',
        data: nothing
    });

    map.addLayer({
        id: 'routeline-active',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#3887be',
            'line-width': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 3,
                22, 12
            ]
        }
    }, 'waterway-label');

    /*
      // Listen for a click on the map
    map.on('click', function(e) {
        // When the map is clicked, add a new drop-off point
        // and update the `dropoffs-symbol` layer
        newDropoff(map.unproject(e.point));
        updateDropoffs(dropoffs);

    }

    );
    */

/*
function newDropoff(coords) {
    // Store the clicked point as a new GeoJSON feature with
    // two properties: `orderTime` and `key`
    var pt = turf.point(
        [coords.lng, coords.lat],
        {
            orderTime: Date.now(),
            key: Math.random()
        }
    );
    dropoffs.features.push(pt);
    pointHopper[pt.properties.key] = pt;

    // Make a request to the Optimization API
    $.ajax({
        method: 'GET',
        url: assembleQueryURL(),
    }).done(function (data) {
        // Create a GeoJSON feature collection
        var routeGeoJSON = turf.featureCollection([turf.feature(data.trips[0].geometry)]);

        // If there is no route provided, reset
        if (!data.trips[0]) {
            routeGeoJSON = nothing;
        } else {
            // Update the `route` source by getting the route source
            // and setting the data equal to routeGeoJSON
            map.getSource('route')
                .setData(routeGeoJSON);
        }

        if (data.waypoints.length === 12) {
            window.alert('Maximum number of points reached. Read more at docs.mapbox.com/api/navigation/#optimization.');
        }
    });
}

function updateDropoffs(geojson) {
    map.getSource('dropoffs-symbol')
        .setData(geojson);
}

// Here you'll specify all the parameters necessary for requesting a response from the Optimization API
function assembleQueryURL() {

    // Store the location of the truck in a variable called coordinates
    var coordinates = [truckLocation];
    var distributions = [];
    keepTrack = [truckLocation];

    // Create an array of GeoJSON feature collections for each point
    var restJobs = objectToArray(pointHopper);

    // If there are any orders from this restaurant
    if (restJobs.length > 0) {

        // Check to see if the request was made after visiting the restaurant
        var needToPickUp = restJobs.filter(function (d, i) {
            return d.properties.orderTime > lastAtRestaurant;
        }).length > 0;

        // If the request was made after picking up from the restaurant,
        // Add the restaurant as an additional stop
        if (needToPickUp) {
            var restaurantIndex = coordinates.length;
            // Add the restaurant as a coordinate
            coordinates.push(warehouseLocation);
            // push the restaurant itself into the array
            keepTrack.push(pointHopper.warehouse);
        }

        restJobs.forEach(function (d, i) {
            // Add dropoff to list
            keepTrack.push(d);
            coordinates.push(d.geometry.coordinates);
            // if order not yet picked up, add a reroute
            if (needToPickUp && d.properties.orderTime > lastAtRestaurant) {
                distributions.push(restaurantIndex + ',' + (coordinates.length - 1));
            }
        });
    }

    // Set the profile to `driving`
    // Coordinates will include the current location of the truck,
    return 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/' + coordinates.join(';') + '?distributions=' + distributions.join(';') + '&overview=full&steps=true&geometries=geojson&source=first&access_token=' + mapboxgl.accessToken;
}

function objectToArray(obj) {
    var keys = Object.keys(obj);
    var routeGeoJSON = keys.map(function (key) {
        return obj[key];
    });
    return routeGeoJSON;
}


  });
*/




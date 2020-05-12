mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsbGx1b25nOTciLCJhIjoiY2s2bno3OTNvMGRnaTNqcGJzOG9jY2N2ZiJ9.HfvhKBvZreCaO8KFqlYkRw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: [-97.75, 30.264], // starting position in Austin, Texas
  zoom: 12
});
// set the bounds of the map
//var bounds = [[-123.069003, 45.395273], [-122.303707, 45.612333]];
//map.setMaxBounds(bounds);

// initialize the map canvas to interact with later
var canvas = map.getCanvasContainer();

// an arbitrary start will always be the same
// only the end or destination will change
var start = [-97.7538, 30.2303]; //Longtitude and lattitude of St.Edwards University
// var coordsObj = 
// var coords = Object.keys(coordsObj).map(function(key) {
//   return coordsObj[key];
// });
// var end = {
//   type: 'FeatureCollection',
//   features: [{
//     type: 'Feature',
//     properties: {},
//     geometry: {
//       type: 'Point',
//       coordinates: coords
//     }
//   }
//   ]
// };

// //A simple line from start point to end point:
// var lineDirection = {
//   'type': 'FeatureCollection',
//   'features': [
//   {
//   'type': 'Feature',
//   'geometry': {
//   'type': 'LineString',
//   'coordinates': [start, end]
//   }
//   }
//   ]
//   };

//   //A single point that animates along the route: 
//   // Coordinates are intially set to origin: 
//   var simulatePoint = {
//     'type': 'FeatureCollection',
//     'features': [
//     {
//     'type': 'Feature',
//     'properties': {},
//     'geometry': {
//     'type': 'Point',
//     'coordinates': origin
//     }
//     }
//     ]
//     };

//     //Calculate the distance in kilometers
//     var retDistance = turf.retDistance(lineDirection.features[0], 'kilometers');

//     var arc = [];

//     // Number of steps to use in the arc and animation, more steps means
//     // a smoother arc and animation, but too many steps will result in a
//     // low frame rate
//     var steps = 500;
    
//     // Draw an arc between the `origin` & `destination` of the two points
//     for (var i = 0; i < retDistance; i += retDistance / steps) {
//     var segment = turf.along(lineDirection.features[0], i, 'kilometers');
//     arc.push(segment.geometry.coordinates);
//     }

//     //Update the route with calcaulated arc coordintate
//     lineDirection.features[0].geometry.coordinates = arc;

//     //Used to increment the value of the point measurement against the route
//     var counter = 0;

//     map.on('load', function(){
//       //Add a source and layer displaying a point which will be animated in a circle
//       map.addSource('route', {
//         'type': 'geojson',
//         'data': lineDirection
//       });

//       map.addSource('point',{
//         'type': 'geojson',
//         'data': simulatePoint
//       });

//       map.addLayer({
//         'id': 'route',
//         'source': 'route',
//         'type': 'line',
//         'paint': {
//         'line-width': 2,
//         'line-color': '#007cbf'
//         }
//         });
         
//         map.addLayer({
//         'id': 'point',
//         'source': 'point',
//         'type': 'symbol',
//         'layout': {
//         'icon-image': 'airport-15',
//         'icon-rotate': ['get', 'bearing'],
//         'icon-rotation-alignment': 'map',
//         'icon-allow-overlap': true,
//         'icon-ignore-placement': true
//         }
//         });
//     });


//     function animate(){
//       //Update point geometry to a new position based on counter denoting
//       //the index to access the arc 
//       simulatePoint.features[0].geometry.coordinates = lineDirection.features[0].geometry.coordinates[counter];

//       //Calculate the bearing to ensure the icon is rotated to match the route arc
//       //The bearing is calculated between the current point and the next point, 
//       //except at the end of the arc use th previous point and the current point
//       simulatePoint.features[0].properties.bearing = turf.bearing(turf.point(lineDirection.features[0].geometry.coordinates[counter >= steps ? counter - 1: counter]), turf.point(route.features[0].geometry.coordinates[counter >= steps ? counter : counter + 1]))
//             // Update the source with this new data.
//       map.getSource('point').setData(point);
      
//       // Request the next frame of animation so long the end has not been reached.
//       if (counter < steps) {
//       requestAnimationFrame(animate);
//       }
      
//       counter = counter + 1;
//       }
      
//     document.getElementById('replay').addEventListener('click', function() {
//       // Set the coordinates of the original point back to origin
//       point.features[0].geometry.coordinates = origin;
        
//       // Update the source layer
//       map.getSource('point').setData(point);
        
//       // Reset the counter
//       counter = 0;
        
//       // Restart the animation.
//       animate(counter);
//       });
        
//       // Start the animation.
//       animate(counter);
        

// create a function to make a directions request
function getRoute(end) {
  // make a directions request using car profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  // var start = [-97.7538, 30.2303]; //Longtitude and latitude of the St.Edward's University 
  var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;

  // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onload = function() {
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

// add turn instructions here at the end
// get the sidebar and add the instructions
// Adding the driving instruction
var instructions = document.getElementById('instructions');
var steps = data.legs[0].steps;

var tripInstructions = [];
for (var i = 0; i < steps.length; i++) {
  // instruction to go from point A to B 
  // tripInstructions.push('<br><li>' + steps[i].maneuver.instruction) + '</li>';
  instructions.innerHTML = '<br><span class="duration">Trip duration: ' + Math.floor(data.duration / 60) + ' min </span>' + tripInstructions;
}
  };
  req.send();
}


//Finding the route on map with a particular point
map.on('load', function() {
  // make an initial directions request that
  // starts and ends at the same location
  getRoute(start);

  // Add starting point to the map
  map.addLayer({
    id: 'point',
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
            coordinates: start
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


  map.on('click', function(e) {
    //extracting the longtitude and lattitude into an object
    var coordsObj = e.lngLat;
    canvas.style.cursor = '';
    var coords = Object.keys(coordsObj).map(function(key) {
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
    getRoute(coords);
//Outputting the longtitude and lattitude of a particular location on the map
//with a mouse click
    document.getElementById('info').innerHTML =
    // e.point is the x, y coordinates of the mousemove event relative
    // to the top-left corner of the map
    JSON.stringify(e.point) +
    '<br />' +
    // e.lngLat is the longitude, latitude geographical position of the event
    JSON.stringify(e.lngLat.wrap());

  });
    
});



//This script will return a position on the 
mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsbGx1b25nOTciLCJhIjoiY2s2bno3OTNvMGRnaTNqcGJzOG9jY2N2ZiJ9.HfvhKBvZreCaO8KFqlYkRw';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-97.7404, 30.2747],
zoom: 13
});
 
var geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
});
//Outputting the geocoding coordinate of the location on the search bar: 
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// tracking user location.
map.addControl(
new mapboxgl.GeolocateControl({
positionOptions: {
enableHighAccuracy: true
},
trackUserLocation: true
})
);


    





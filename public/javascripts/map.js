mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  // projection: "globe", // Display the map as a globe, since satellite-v9 defaults to Mercator
  zoom: 1,
  center: coordinates,
});

const marker1 = new mapboxgl.Marker()
  .setLngLat(coordinates) //listing geometry co ordinates
  .addTo(map);

// [12.554729, 55.70651];

const constants = {
  // sets up map zoom close enough to see street details
  ZOOM: 15,
  // sets loading map centerd in Eagle Ridge area
  CENTER_MAP_LOCATION: {lat: 49.2860, lng: -122.8130},
  SQ_FT_CONVERT: 10.764,
  // sets map boundaries to Port Moody and North Coquitlam
  DEFAULT_BOUNDARIES: {
    NORTH_EAST: [49.327512, -122.755847],
    SOUTH_WEST: [49.271039, -122.892113],
  }
}

export default constants;

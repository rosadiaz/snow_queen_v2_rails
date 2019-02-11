const DrawingManager = {
  init: (map) => {
    const drawingOptions = {
      fillColor: "#2DC1D6",
      fillOpacity: 0.3,
      strokeWeight: 5,
      strokeColor: "#2DC1D6",
      clickable: false,
      zIndex: 1
    }
    
    new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ["polygon"]
      },
      map,
      polygonOptions: drawingOptions,
      rectangleOptions: drawingOptions
    });
  },
};

export { DrawingManager };

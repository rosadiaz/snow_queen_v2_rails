import React, { Component } from "react";
import { DrawingManager }  from "../services/DrawingManager";

export default class DrawingMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapOptions: {
        center: {
          lat: this.props.lat || 49.265726,
          lng: this.props.lng || -122.814629,
        },
        zoom: 20,
        tilt: 0,
      },
    };
  }

  onScriptLoad() {
    const mapElement = document.getElementById("map");
    const map = new window.google.maps.Map(
      mapElement,
      { mapTypeId: window.google.maps.MapTypeId.SATELLITE, ...this.state.mapOptions }
    );
    DrawingManager.init(map);
  }

  componentDidMount() {
    if (!window.google) {
      const scriptElement = document.getElementById("google-maps-script");
      //We cannot access google.maps until it"s finished loading
      scriptElement.addEventListener("load", () => {
        this.onScriptLoad()
      })
    } else {
      this.onScriptLoad()
    }
  }

  render() {
    return (
      <div style={{ width: "100%", height: "300px" }} id="map" />
    );
  }
}
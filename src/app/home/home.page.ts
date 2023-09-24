import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
// import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView!: MapView;
  userLocationGraphic!: Graphic;

  constructor() {}

  latitude!: number;
  longitude: number | any;

  async ngOnInit() {
    // const position = await Geolocation.getCurrentPosition();
    // console.log(position);

    // this.latitude = position.coords.latitude;
    // this.longitude = position.coords.longitude;

    // this.latitude = 37.6;
    // this.longitude = -95.665;

    const map = new Map({
      basemap: 'osm',
    });

    this.mapView = new MapView({
      container: 'container',
      map: map,
      zoom: 4,
      // center: [this.latitude, this.longitude],
    });

    //BasemapGallery
    const basemapGallery = new BasemapGallery({
      view: this.mapView,
    });
    this.mapView.ui.add(basemapGallery, 'top-right');

    const WeatherServiceUrl =
      'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    map.add(weatherServiceFL);

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 1000);

    // Second Marker
    const marker1 = new Graphic({
      symbol: new SimpleMarkerSymbol(),
      geometry: new Point({
        latitude: 37.6,
        longitude: -95.665,
      }),
    });
    this.mapView.graphics.add(marker1);
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({
      latitude: latLng[0],
      longitude: latLng[1],
      // latitude: this.latitude,
      // longitude: this.longitude,
    });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }
}

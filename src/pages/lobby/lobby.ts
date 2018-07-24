import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google;
@IonicPage()
@Component({
  selector: 'page-lobby',
  templateUrl: 'lobby.html',
})
export class LobbyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.init();
  }

  checkIn;
  notCheckIn;
  filter = 'school';
  objs;
  longLat;
  coords
  currentLocation;



  async init(){
    this.coords = await this.getCoordinates();
    this.currentLocation = {lat: this.coords.coords.latitude, lng: this.coords.coords.longitude}
    this.objs = await this.getObjsClose();
    let results:any = await this.getDistances();
    this.checkIn = results.checkIn;
    this.notCheckIn = results.notCheckIn;
    console.log(results, this.checkIn, this.notCheckIn);

  }


 getCoordinates(){
    return  new Promise((res)=>{
      navigator.geolocation.getCurrentPosition((position)=>{
        return res(position)
      })
    })
  }
  getObjsClose(){
    let map = new google.maps.Map(document.getElementById('map'), {
      center: this.currentLocation,
      zoom: 20
    });

    let service =   new google.maps.places.PlacesService(map);
    return new Promise((res)=>{
      service.nearbySearch({
        location: this.currentLocation,
        // radius: '10',
        rankBy: google.maps.places.RankBy.DISTANCE,
        type: this.filter,
      }, (response:any[])=>{
        let objs = [];
        response.forEach((obj)=>{
          let o = {
            name: obj.name,
            address: obj.vicinity,
          }
          objs.push(o);
        })
        return res(objs);
      })
    })
  }

  getDistances(){

  
    let newObjs = [];
    let otherPlaces = [];
    this.objs.forEach(async (obj)=>{
          let origin = this.currentLocation;
          let destination = obj.address;
          let service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: "WALKING",
            unitSystem: google.maps.UnitSystem.IMPERIAL,
          },  async (response)=>{
            let distance =  await response.rows[0].elements[0].distance;
            let newObj = {
              distanceText: distance.text,
              distanceValue: distance.value,
              name: obj.name,
              address: obj.address,
          }
            if(distance.value < 120){
            newObjs.push(newObj);
            } else {
            otherPlaces.push(newObj);
            }
            
          })
    })
    let results = {checkIn: newObjs, notCheckIn: otherPlaces};
    return results;

  }


}

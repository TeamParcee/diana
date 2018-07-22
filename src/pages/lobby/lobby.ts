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

  newObjs;
  filter = 'nightclub';
  objs;
  longLat;
  coords
  currentLocation;

  async init(){
    this.coords = await this.getCoordinates();
    this.currentLocation = {lat: this.coords.coords.latitude, lng: this.coords.coords.longitude}
    this.objs = await this.getObjsClose();
    this.newObjs = await this.getDistances();
    console.log(this.newObjs)
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
      service.textSearch({
        location: this.currentLocation,
        radius: '10',
        query: this.filter,
      }, (response:any[])=>{
        
        let objs = [];
        response.forEach((obj)=>{
          let o = {
            name: obj.name,
            address: obj.formatted_address,
          }
          objs.push(o);
        })
        return res(objs);
      })
    })
  }

  getDistances(){

    let objs:any[] = this.objs;
    let newObjs = [];
    objs.forEach((obj)=>{
          let origin = this.currentLocation;
          let destination = obj.address;
          let service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: "WALKING",
            unitSystem: google.maps.UnitSystem.IMPERIAL,
          }, (response)=>{
            
            let distance = response.rows[0].elements[0].distance;
            let newObj = {
                distanceText: distance.text,
                distanceValue: distance.value,
                name: obj.name,
                address: obj.address,
            }
            newObjs.push(newObj);
          })
          
    })
    return newObjs;

  }
    // var origin1 = this.currentLocation;
    // var destinationB = this.objs;
    
    // var service = new google.maps.DistanceMatrixService();
    // service.getDistanceMatrix(
    //   {
    //     origins: [origin1],
    //     destinations: [destinationB],
    //     travelMode: 'WALKING',
    //     unitSystem: google.maps.UnitSystem.IMPERIAL,
    //   }, (response)=>{
    //     let distance = response.rows[0].elements[0].distance;
    //     let newObj = {
    //       distanceText: distance.text,
    //         distanceValue: distance.value,
    //         name: obj.name,
    //     }
    //   });
  
  //   function callback(response, status) {
  //     if(status == "OK"){
  //       let distance = response.rows[0].elements[0].distance;
  //       that.obj = {
  //           distanceText: distance.text,
  //           distanceValue: distance.value,
  //           name: res.name,
  //       };
  //       // console.log(that.obj)
        
  //     } else {
  //       console.log("Could not connect to Google Distance API")
  //     }
  // }
}

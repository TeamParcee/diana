import { Component , ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Storage } from '@ionic/storage';
import { LoadingProvider } from '../../providers/loading/loading';


declare var google;
let map: any;
let options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

@IonicPage()
@Component({
  selector: 'page-choose-room',
  templateUrl: 'choose-room.html',
})
export class ChooseRoomPage {
  @ViewChild('map') mapElement: ElementRef;

  constructor(
    private loading: LoadingProvider,
    private ls: Storage,
    public navCtrl: NavController, 
    public navParams: NavParams) {
        this.init();
        
  }

  filter = 'school';
  distanceAway;
  obj;
  options;
  currentPos;
  places : Array<any> ; 
  fs = firebase.firestore();
  db = firebase.database();
  count;
  user
  roomName;
  rooms = [];
  
 
  //get current location
  getLocation(){
    let location = new Promise((resolve, reject)=>{
      navigator.geolocation.getCurrentPosition((res)=>{
          resolve(res);
      })
      console.log(location);
    })
    
  }
  // make a list of the closest objs
   async getClosestObjs(){
    let location =  await navigator.geolocation.getCurrentPosition( async (sucess)=>{
      
      let result = await sucess;
      console.log("this should run first");
      console.log(result);
      return result
     
    })
    console.log(location, "this should be last")
  }








































  // initilize the lobby
  async init(){
      // await this.loading.show();
      // await this.getUser();
      // await this.resetRoomField();
      // await this.loading.hide();
      //this.getClosestObj();
      this.getLocation();
  }
  // Get user data from local storage so we have users uid
  async getUser(){
    this.user = await this.ls.get('user');
  }
  // Update the users room field to be empty since user is not in a room
   resetRoomField(){
    this.fs.doc("users/" + this.user.uid).update({room: ''});

  }
  // Get users in rooms so we can get a count
   getGuests(roomName){
    // Connect to the users collection
    this.fs.collection("users").onSnapshot((userSnap)=>{
      // Create temp room array to hold collection rooms
      let rooms = [];
      // Loop through rooms names looking for matching room in users collection
      roomName.forEach(async (name)=>{
        let guests = await this.fs.collection("users/").where("room", "==", name).get();
        let count = guests.docs.length;
        let room = {
          name: name,
          count: count
        }
        rooms.push(room)
      })
      this.rooms = rooms;
      // console.log(this.rooms);
    })
  }


  joinRoom(room){
      this.navCtrl.setRoot("RoomPage", {room: room});
  }
    getClosestObj(){
      navigator.geolocation.getCurrentPosition( (location) => {
      let currentLocation = {lat: location.coords.latitude, lng: location.coords.longitude}
      let that = this;
      let map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 15
      });
      let searchService =   new google.maps.places.PlacesService(map);
      searchService.textSearch({
        location: currentLocation,
        radius: '100',
        query: 'schools'
      }, function(response, status){
 
        let res = response[0];
        let closestObj = res.formatted_address;
        let currentLocation = {lat: location.coords.latitude, lng: location.coords.longitude}
        var origin1 = currentLocation;
        var destinationB = closestObj;
        
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [origin1],
            destinations: [destinationB],
            travelMode: 'WALKING',
            unitSystem: google.maps.UnitSystem.IMPERIAL,
          }, callback);
        
        function callback(response, status) {
          if(status == "OK"){
            let distance = response.rows[0].elements[0].distance;
            that.obj = {
                distanceText: distance.text,
                distanceValue: distance.value,
                name: res.name,
            };
            // console.log(that.obj)
            
          } else {
            console.log("Could not connect to Google Distance API")
          }
          
        }




      });
    });
    }

}

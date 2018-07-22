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

  options;
  currentPos;
  places : Array<any> ; 
  fs = firebase.firestore();
  db = firebase.database();
  count;
  user
  roomName;
  rooms = [];
  
  initMap() {
    navigator.geolocation.getCurrentPosition((location) => {
      console.log(location);
      map = new google.maps.Map(this.mapElement.nativeElement, {
        center: {lat: location.coords.latitude, lng: location.coords.longitude},
        zoom: 15
      });
  
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: {lat: location.coords.latitude, lng: location.coords.longitude},
        radius: 1000,
        type: ['NightClub']
      }, (results,status) => {
        let rooms = [];
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            rooms.push(results[i].name)
          }
          this.getGuests(rooms)
        }
      });
    }, (error) => {
      console.log(error);
    }, options);
  }


  // initilize the lobby
  async init(){
      this.loading.show();
      await this.initMap();
      await this.getUser();
      await this.resetRoomField();
      this.loading.hide();
      // await this.addMap(41.1930980, -96.1647750);
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
      console.log(this.rooms);
    })
  }


  // Get the name of the room and send it to the RoomPage
  joinRoom(room){
      this.navCtrl.setRoot("RoomPage", {room: room});
  }
  

 
}

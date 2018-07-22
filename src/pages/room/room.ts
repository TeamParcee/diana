import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {

  constructor(
    private ls: Storage,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.room = this.navParams.get('room');
      this.init();
  }

married = 0;
single = 0;
nottelling = 0;
men = 0;
women = 0;
room;
count;
feed;
user;
message;

fs = firebase.firestore();
// init the room
async init(){

    
    await this.getUser();
    await this.updateRoom();
    await this.getRoomCount();
    await this.getFeed();
    
}


// get a count of the men and women and set it to variables
getRoomStats(){
  this.fs.collection("users/").where
}
// Update users room field to current room
updateRoom(){
  this.fs.doc("users/" + this.user.uid).update({room: this.room});
}
// Get user data from local storage
async getUser(){
  this.user = await this.ls.get('user');
}
  getRoomCount(){
    //***dev adding this room test */
    if(!this.room){
      this.room = "The Hive"
    }
    this.fs.collection("users/").where("room", "==", this.room).onSnapshot(async (roomSnap)=>{
      this.count = roomSnap.docs.length;
      let men = await roomSnap.query.where("gender", "==", "Man").get();
      this.men = men.docs.length;
      let women = await roomSnap.query.where("gender", "==", "Woman").get();
      this.women = women.docs.length;
    })
  }

  //Get users feed based on uid and reset it
  resetFeed(){
    this.fs.collection("users/" + this.user.uid + "/feed/").get().then((feedSnap)=>{
      feedSnap.forEach((post)=>{
        post.ref.delete();
        
      })
    })
  }
getFeed(){
  this.fs.collection("users/" + this.user.uid + "/feed/")
  .orderBy("timestamp", "desc")
  .onSnapshot((feedSnap)=>{
    let feed = [];
    feedSnap.forEach((post)=>{
      feed.push(post.data());
    })
    this.feed = feed;
  })
}
  //send message to feeds in the same room
  sendMessage(){
    let timestamp = new Date();
    let post = {
      message: this.message,
      user: this.user,
      uid: this.user.uid,
      timestamp: timestamp,
    }
    this.fs.collection("users/").where("room", "==", this.room)
    .get().then((userSnap)=>{
      userSnap.forEach((user)=>{
        user.ref.collection("/feed/").add(post);
      })
    })
    this.message = ''
  }


  // navigate back to the rooms page
  async gotoRooms(){
    await this.resetFeed();
    this.navCtrl.setRoot("ChooseRoomPage");
  }

  gotoMessage(recipent){
    this.navCtrl.push("MessagePage", {"recipent": recipent})
  }
}

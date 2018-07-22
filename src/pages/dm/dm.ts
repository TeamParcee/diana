import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import 'firebase/firestore';

@IonicPage()
@Component({
  selector: 'page-dm',
  templateUrl: 'dm.html',
})
export class DmPage {

  constructor(
    private ls: Storage,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.init();
  }

fs = firebase.firestore();
user;
messages;
 async init(){
    await this.getUser();
    await this.getMessages();
 }

 //get user data
 async getUser(){
   this.user = await this.ls.get('user');
   console.log(this.user.uid, "uid")
 }
 //get users contacts for messges
 getMessages(){
   this.fs.collection("users/" + this.user.uid + "/dms/").onSnapshot((messageSnap)=>{
     let messages = [];
     messageSnap.forEach((message)=>{
       messages.push(message.data());
     })
     this.messages = messages;
     console.log(this.messages);
   })
 }

 gotoMessage(recipent){
  this.navCtrl.push("MessagePage", {"recipent": recipent})
}
}

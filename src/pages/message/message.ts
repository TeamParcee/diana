import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import * as firebase from 'firebase';
import "firebase/firestore";
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  @ViewChild(Content) content: Content;
  constructor(
    private ls: Storage,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.recipent = this.navParams.get('recipent');
      this.init();
  }

  user;
  recipent;
  messages;
  text;
  fs = firebase.firestore();

 //init data
 async init(){
  await this.getUser();
  await this.getMessages();
  await this.content.scrollToBottom();

 }
 //get user data from local storage
 async getUser(){
  this.user = await this.ls.get('user');
 }

 //get the message from the recipent and the user by checking the user object's messages with the recipent uid
 getMessages(){
  let userRef = "users/" + this.user.uid + "/dms/" + this.recipent.uid + "/messages/";
   this.fs.collection(userRef)
    .orderBy("timestamp")
    .onSnapshot((messageSnap)=>{
      let messages = [];
      messageSnap.forEach((message)=>{
      messages.push(message.data());
    })
    this.messages = messages;
    console.log(this.messages)
   })
   
 }
 sendMessage(){
   let timestamp = new Date;
   let message = {
    user: this.user,
    text: this.text,
    timestamp: timestamp
   }
 
  let recipentRef = "users/" + this.recipent.uid + "/dms/" + this.user.uid + "/messages/";
  let userRef = "users/" + this.user.uid + "/dms/" + this.recipent.uid + "/messages/";
  let recipentDmRef = "users/" + this.recipent.uid + "/dms/" + this.user.uid;
  let userDmRef = "users/" + this.user.uid + "/dms/" + this.recipent.uid;

  this.fs.collection(recipentRef).add(message);
  this.fs.collection(userRef).add(message);
  this.fs.doc(recipentDmRef).set(message);
  this.fs.doc(userDmRef).set(message);
  this.text = "";
  let that = this;
  setTimeout(function(){
    that.content.scrollToBottom()
  }, 250)
  
 }

}

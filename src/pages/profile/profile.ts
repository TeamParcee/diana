import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, GESTURE_REFRESHER } from 'ionic-angular';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import 'firebase/firestore';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(
    private ls: Storage,
    private navCtrl: NavController,
  ){
    this.checkUser();
  }
  

  imageFile;
  photoURL = "../../assets/imgs/default.png";
  user;
  uid;
  editPic;
  name;
  gender;
  relationship;
  db = firebase.database();
  fs = firebase.firestore();

  // check if user accont saved on device
  async checkUser(){
     let user = await this.ls.get('user');
     this.user = user;
    if(user){
      this.db.ref("users/" + user.uid).onDisconnect().remove();
      this.name = user.name;
      this.gender = user.gender;
      this.relationship = user.relationship;
      this.photoURL = user.photoURL;
      this.uid = user.uid
    } 
  }
  // create userid and save user to device
    save(){
      let user = {
        name: this.name,
        gender: this.gender,
        relationship: this.relationship,
        uid: this.uid,
        photoURL: this.photoURL,
      }
      if(!user.uid){
        user.uid = this.fs.collection('users/').doc().id;
      }
      
      this.db.ref("users/" + user.uid).onDisconnect().remove();
      this.db.ref("users/" + user.uid).set({name: user.name});
      this.fs.doc("users/" + user.uid).set(user);
      this.ls.set('user', user);
      this.navCtrl.setRoot("ChooseRoomPage");
      
    }
  // Update Profile Pic Code


private previewPic(event){
  let imageFile = event.target.files[0];
  
  let reader = new FileReader();
  let that = this;
  reader.addEventListener("load", function () {
    that.photoURL = reader.result;
  }, false);
  this.imageFile = imageFile;
  if (imageFile) {
    reader.readAsDataURL(imageFile);
  }
  
}
}

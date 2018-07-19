import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(
    private ls: Storage,
    private navCtrl: NavController,
  ){}
  

  name;
  gender;
  relationship;

  gotoRoom(){
    let user = {
      name: this.name,
      gender: this.gender,
      relation: this.relationship
    }
    this.ls.set('user', user );
    this.navCtrl.setRoot("ChooseRoomPage");
  }
}

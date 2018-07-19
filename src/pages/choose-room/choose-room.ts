import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import 'firebase/firestore';

@IonicPage()
@Component({
  selector: 'page-choose-room',
  templateUrl: 'choose-room.html',
})
export class ChooseRoomPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }



  guests = 12;
  getGuests(){
    firebase.firestore().collection
  }
}

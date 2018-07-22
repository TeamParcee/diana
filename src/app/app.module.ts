import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import * as firebase from 'firebase';
import { IonicStorageModule } from '@ionic/storage';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDp1aFNDzog-ASYVrKjX7zDz4c1plTW3pU",
    authDomain: "clubchat-914.firebaseapp.com",
    databaseURL: "https://clubchat-914.firebaseio.com",
    projectId: "clubchat-914",
    storageBucket: "",
    messagingSenderId: "420935928132"
  };
  firebase.initializeApp(config);
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
    ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

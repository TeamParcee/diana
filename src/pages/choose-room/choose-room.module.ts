import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseRoomPage } from './choose-room';

@NgModule({
  declarations: [
    ChooseRoomPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseRoomPage),
  ],
})
export class ChooseRoomPageModule {}

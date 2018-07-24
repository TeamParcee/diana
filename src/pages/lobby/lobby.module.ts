import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LobbyPage } from './lobby';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LobbyPage,
  ],
  imports: [
    IonicPageModule.forChild(LobbyPage),
    PipesModule,
  ],
})
export class LobbyPageModule {}

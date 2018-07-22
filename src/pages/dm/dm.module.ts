import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DmPage } from './dm';
import { ElasticModule } from 'ng-elastic';

@NgModule({
  declarations: [
    DmPage,
  ],
  imports: [
    IonicPageModule.forChild(DmPage),
    ElasticModule,
  ],
})
export class DmPageModule {}

import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular/umd';

@Injectable()
export class LoadingProvider {

  constructor(
    private loadingCtrl: LoadingController,
  ) {
  }
loading: Loading;
async show(){
  this.loading = await this.loadingCtrl.create();
}
hide(){
  this.loading.dismiss();
}
}

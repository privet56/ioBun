import { Component } from '@angular/core';
import { NavController,	LoadingController,	ToastController	}	from	'ionic-angular'; 

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage
{
  constructor(public navCtrl: NavController, private loadingCtrl:LoadingController)
  {

  }
	ionViewWillEnter()    //comes after ionViewDidLoad 
  {
    setTimeout(() =>
    {
      let loading = this.loadingCtrl.create({
        spinner: 'hide',

        content: `
          <div class="custom-spinner-container">
            <div class="custom-spinner-box"> </div>
          </div>`,
        duration: 2000
      });

      loading.onDidDismiss(() =>
      {
        
      });

      loading.present();

    }, 33);
  }
}

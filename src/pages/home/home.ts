import { Component } from '@angular/core';
import { RedditService } from '../../app/services/reddit.service';
import { DetailsPage } from '../details/details';
import {	NavController,	LoadingController,	ToastController	}	from	'ionic-angular'; 
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage
{
  items: any = null;
  category: any = null;
  limit:any = 10;

  constructor(public navCtrl:NavController,
              private redditService:RedditService,
              private loadingCtrl:LoadingController,
              public toastCtrl:ToastController)
  {
   this.getDefaults();
  }
  ngOnInit()
  {
    this.getPosts(this.category, this.limit);
  }

  getDefaults()
  {
    if(localStorage.getItem('category') != null)
    {
      this.category = localStorage.getItem('category');
    } else {
      this.category = '';
    }

    if(localStorage.getItem('limit') != null)
    {
      this.limit = localStorage.getItem('limit');
    } else {
      this.limit = 10;
    }
  }

  getPosts(category, limit)
  {
    if(!category)
    {
      return;
    }
    //TODO: handle nothing found case
    //TODO: handle error case
    this.redditService.getPosts(category, limit).subscribe(response =>
    {
      this.items = response.data.children;
    });
  }

  viewItem(item)
  {
    this.navCtrl.push(DetailsPage,
    {
      item:item
    });
  }

  changeCategory()
  {
    this.getPosts(this.category, this.limit);
  }
  ionViewDidLoad()
  {
    
  }
	ionViewWillEnter()    //comes after ionViewDidLoad 
  {
    setTimeout(() =>
    {
      let	toast	=	this.toastCtrl.create({
        message:	'Choose a category',
        position:	'middle', //top,bottom,middle
        showCloseButton: true,
        closeButtonText:'x',
        dismissOnPageChange:true,
        //cssClass:'toast',
        duration:	2000});
      toast.present();
    }, 333);
  }
}

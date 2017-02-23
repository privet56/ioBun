import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {RedditService} from '../../app/services/reddit.service';
import {DetailsPage} from '../details/details';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage
{
  items: any = null;
  category: any;
  limit:any; 

  constructor(public navCtrl: NavController, private redditService:RedditService)
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
      this.category = 'bunny';
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
}

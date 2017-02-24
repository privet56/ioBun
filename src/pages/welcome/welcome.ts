import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {RedditService} from '../../app/services/reddit.service';
import {DetailsPage} from '../details/details';
 
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage
{
  categories:Map<string, number> = new Map<string, number>();

  items: any = null;
  category: any = null;
  limit:any = 10;

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
      this.category = '';
    }

    if(localStorage.getItem('limit') != null)
    {
      this.limit = localStorage.getItem('limit');
    } else {
      this.limit = 10;
    }
  }

  ionViewDidLoad()                          //see lifecycle events on https://ionicframework.com/docs/v2/api/navigation/NavController/
  {                                         //do it here otherwise timeout on old android devices!
    this.categories.set("autumn", 3);
    this.categories.set("home" , 12);
    this.categories.set("spring", 4);
    this.categories.set("summer" , 4);
    this.categories.set("winter" , 7);
  }

  getPosts(category, limit)
  {
    if(!category)
    {
      return;
    }

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
  public getPicsOfSelectedCat() : Array<string>
  {
    let picNames:Array<string> = new Array<string>();

    if(!this.category)
    {
      //TODO: check if it is working on device
      //return picNames;
      return this.getPicsOfAllCats();
    }
    let picCount = this.categories.get(this.category);

    for(let i:number=0;i<picCount;i++)
    {
      let picNr = i+1; 
      let picName = this.category.toLowerCase() + (picNr < 10 ? '0':'') + picNr;
      picNames.push(picName);
    }
    return picNames;
  }
  public getPicsOfAllCats() : Array<string>
  {
    let picNames:Array<string> = new Array<string>();

    this.categories.forEach((picCount: number, category: string) =>
    {
      for(let i:number=0;i<picCount;i++)
      {
        let picNr = i+1; 
        let picName = category.toLowerCase() + (picNr < 10 ? '0':'') + picNr;
        picNames.push(picName);
      }
    });

    return picNames;
  }
  public onBunClick($event:Event, ionItem):boolean
  {
    let a:any = ($event.target);
    let e:Element = (ionItem && ionItem._elementRef && ionItem._elementRef.nativeElement) ? ionItem._elementRef.nativeElement : a;
    let ngsel:string = 'ngsel';

    if(e.classList.contains(ngsel))
       e.classList.remove(ngsel);

    setTimeout(() =>
    {
     e.classList.add(ngsel);
    }, 11);

    return false;
  }
}

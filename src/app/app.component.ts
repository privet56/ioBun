import { Component, ViewChild } from '@angular/core';
import { IonicApp, Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {RedditService} from './services/reddit.service';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html',
  providers: [RedditService]
})
export class MyApp
{
  @ViewChild(Nav) nav: Nav;
  rootPage = TabsPage;
  pages: Array<{title:string,tab:any,tabIcon:string}> = [ ];

  constructor(private app: IonicApp, platform: Platform, private menu: MenuController)
  {
    platform.ready().then(() =>
    {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.pages = TabsPage.__tabs; 
    });
  }
  openPage(page:any, idx:number)
  {
    this.menu.close();
    //this would replace the tabs...
    //this.nav.setRoot(page.tab);
    TabsPage.__me.selectTabByIndex(idx);
  }
}

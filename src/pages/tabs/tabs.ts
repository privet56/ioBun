import { Component, ViewChild } from '@angular/core';
import { Tabs, IonicApp, Platform, MenuController, Nav } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { BunGamePage } from '../bungame/bungame';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage
{
  @ViewChild('myTabs') tabRef: Tabs;
  
  static __tabs:Array<{title:string,tab:any,tabIcon:string}> = [];
  static __me:TabsPage=null;

  tab0Root: any = WelcomePage;
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;
  tab4Root: any = BunGamePage;

  tabs:Array<{title:string,tab:any,tabIcon:string}> = [
    {title:"Bunny Pics" , tab:this.tab0Root, tabIcon:'bunicon'},
    {title:"Bunny News" , tab:this.tab1Root, tabIcon:'bunicon'},
    {title:"BunGame"    , tab:this.tab4Root, tabIcon:'planet'},
    {title:"About"      , tab:this.tab2Root, tabIcon:'information-circle'},
    {title:"Contact"    , tab:this.tab3Root, tabIcon:'buncontacticon'},
  ];

  constructor()
  {
    TabsPage.__me   = this;
    TabsPage.__tabs = this.tabs;
    setTimeout(() =>
    {
      BunGamePage.preload();
    }, 999);
  }
  selectTabByIndex(idx:number):boolean
  {
    this.tabRef.select(idx);
    return false;
  }
}

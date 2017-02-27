import { Component, ViewChild } from '@angular/core';
import { Tabs, IonicApp, Platform, MenuController, Nav } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

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

  tabs:Array<{title:string,tab:any,tabIcon:string}> = [
    {title:"Bunny Pics" , tab:this.tab0Root, tabIcon:'bunicon'},
    {title:"Bunny News" , tab:this.tab1Root, tabIcon:'bunicon'},
    {title:"About"      , tab:this.tab2Root, tabIcon:'information-circle'},
    {title:"Contact"    , tab:this.tab3Root, tabIcon:'buncontacticon'},
  ];

  constructor()
  {
    TabsPage.__me   = this;
    TabsPage.__tabs = this.tabs;
  }
  selectTabByIndex(idx:number)
  {
    this.tabRef.select(idx);
  }
}

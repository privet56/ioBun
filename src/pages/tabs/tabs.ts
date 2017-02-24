import { Component } from '@angular/core';

import { WelcomePage } from '../welcome/welcome';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage
{
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab0Root: any = WelcomePage;
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;

  constructor()
  {

  }
}

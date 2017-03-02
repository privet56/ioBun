import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';
import { DetailsPage } from '../pages/details/details';
import { WelcomePage } from '../pages/welcome/welcome'; 

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    WelcomePage,
    HomePage,
    SettingsPage,
    DetailsPage, 
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp,
    {
      menuType: 'push',
	    backButtonText:	'<<',
      iconMode:	'md',
      modalEnter:	'modal-slide-in',
      modalLeave:	'modal-slide-out',
      tabbarPlacement:	'bottom',
      pageTransition:	'ios',	
      platforms:
      {
        ios: {
          menuType: 'overlay',
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    WelcomePage,
    HomePage,
    SettingsPage,
    DetailsPage, 
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}

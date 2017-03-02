import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

//<script src="assets/dynamics.min.js" async></script>
declare	var	dynamics:	any;

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage
{
  private	isAnimatingButton:Boolean	=	false;
  private	isAnimatingLeaImg:Boolean	=	false;

  @ViewChild('leaImg')	leaImg;

  constructor(public navCtrl: NavController)
  {

  }

  animateMe(el) : boolean
  {
	  if	(this.isAnimatingButton)
    {
      return false;
    }

    let aniDuration:Number = 1500;

    { //ANI BUTTON
      this.isAnimatingButton	=	true;
      dynamics.animate(el._elementRef.nativeElement,
      {
        //bounces upwards
        translateY:	-333
      },
      {
        type:	dynamics.bounce,
        duration:	aniDuration,
        complete:	()	=> { this.isAnimatingButton	=	false; }
      });
    }
    
    { //ANI LEAIMG
      this.isAnimatingLeaImg = true;
      dynamics.animate(this.leaImg.nativeElement,
      {
        translateY:	111,
        rotateZ: 11,
        scale: 1.5,
      },
      {
        type:	dynamics.bounce,  //dynamics.spring |	dynamics.easeOut | dynamics.bounce
        friction:	50,
        duration:	aniDuration,
        complete:	()	=> { this.isAnimatingLeaImg	=	false; }
      });
    }

    return false;
  }
}

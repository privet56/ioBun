import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';
import { Platform } from 'ionic-angular';
import {Ball} from "./ball";
import {Defs} from "./defs";
import {Sun} from "./sun";
import {BigBun} from "./bigbun";
import {Rabbits} from "./rabbits";

/// <reference path="assets/babylonjs/babylon.2.5.d.ts" />

@Component({
  selector: 'page-bungame',
  templateUrl: 'bungame.html'
})
export class BunGamePage
{
  protected level:number = 0;
  public static __isDemoTime:boolean = false;

  

  @ViewChild('bungamecanvas') bunGameCanvasEleRef :	ElementRef;
  @ViewChild('ioncontent') ionContentEleRef :	ElementRef;
  @ViewChild('ioncontentheader') ionContentHeaderEleRef :	ElementRef;
  @ViewChild('ionlist') ionListEleRef :	ElementRef;

  balls:Array<Ball> = new Array<Ball>();
  protected isActiveTab : boolean = false;
  protected isBallsAllowed : boolean = false;

  public msg:string = "";

  constructor(public navCtrl: NavController, private loadingCtrl:LoadingController, public platform: Platform)
  {

  }

  ionViewWillLeave()
  {
    this.isActiveTab = false;
  }

	ionViewWillEnter()    //comes after ionViewDidLoad 
  {
    let canvas:HTMLCanvasElement = null;

    try
    {
      this.isActiveTab = true;
      if(this.balls.length > 0)return;
      canvas = this.bunGameCanvasEleRef.nativeElement;
      canvas.style.height = canvas.style.width = this.getCanvasSize();
      var engine:BABYLON.Engine = new BABYLON.Engine(canvas);
      var scene :BABYLON.Scene  = new BABYLON.Scene(engine);
      let assetsManager:BABYLON.AssetsManager = new BABYLON.AssetsManager(scene);
      {
        assetsManager.useDefaultLoadingScreen = true;
        BABYLON.SceneLoader.ShowLoadingScreen = true;
        engine.displayLoadingUI();
        engine.hideLoadingUI();
        engine.loadingUIText = "loading...";
        engine.loadingUIBackgroundColor = "green";
      }

      scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001);  //=set transparent background

      var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
      //camera.attachControl(canvas, true); //if activated, you can look around by dragging... 

      let shadowGenerator:BABYLON.ShadowGenerator = null;
      let sun:Sun = new Sun(scene);
      //let sun:BABYLON.Mesh = BABYLON.Mesh.CreateSphere("sun", 10/*segments*/, 3/*diameter*/, scene);
      {
        var light2 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        shadowGenerator = new BABYLON.ShadowGenerator(512, sun.getLight());
        shadowGenerator.useVarianceShadowMap = true;
      }
      {
        scene.enablePhysics();
        //scene.gravity = new BABYLON.Vector3(0, -9.81, 0); //gravity on earth
        //camera.applyGravity = true;
      }
      {
        var ground = BABYLON.Mesh.CreateGround("ground1", 9/*width*/, 9/*depth*/, 2/*subdivs*/, scene);
        ground.rotation.y = 0.05;
        ground.receiveShadows = true;
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture(Defs.__DIR_ASSETS + Defs.__TEXTURE_GRASS, scene);
        groundMaterial.diffuseTexture.hasAlpha = true;  //=use transparent color
        ground.material = groundMaterial;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
      }
      
      camera.setTarget(BABYLON.Vector3.Zero()); //target the camera to scene origin

      let bigBun:BigBun = new BigBun(scene);
      let rabbits:Rabbits = new Rabbits(scene, BunGamePage.__isDemoTime ? 5 : 0, bigBun);

      let lastRenderTime:number = (new Date()).getTime();
      let optRenderTime = 15;
      let self = this;
      let assetsManagerLoadStart:number = 0;
      assetsManager.onFinish = function(tasks)
      {
        {
          let assetsManagerLoadEnd:number = (new Date()).getTime();
          console.log("PRELOAD done in "+(assetsManagerLoadEnd - assetsManagerLoadStart)+" ms");  //local: ~100ms
        }
        { //do it once preload finished
          self.onWon(null);

          setTimeout(() =>
          {
            self.isBallsAllowed = true;

          }, 1999);
        }

        engine.runRenderLoop(() =>
        {
          let newRenderTime:number = (new Date()).getTime();
          let renderTimeDiff:number = newRenderTime - lastRenderTime; //eg renderTimeDiff:16 = 1490626997493 - 1490626997477
          lastRenderTime = newRenderTime;

          if(!self.isActiveTab)return;

          scene.render();

          let refreshRate:number = Math.round(renderTimeDiff / optRenderTime);

          { //cleanup
            self.balls.forEach((ball:Ball, index, object) =>
            {
              if(ball.isDisposed())
              {
                if(ball.isBallHit())
                {
                  let won : boolean = rabbits.createRabbit();
                  if( won)self.onWon(bigBun);
                }
                object.splice(index, 1);
              }
            });
          }
          { //update

            sun.update(refreshRate);
            rabbits.update(refreshRate);
            bigBun.update(refreshRate);

            self.balls.forEach((ball:Ball) =>
            {
                ball.update(refreshRate);
            });
          }
          { //fill again
            if(self.balls.length < 3)
            {
              self.makeBalls(5, scene, ground, shadowGenerator);
            }
          }
        });
      };

      { //preload
        bigBun.preload(assetsManager, scene);
        rabbits.preload(assetsManager, scene);
        sun.preload(assetsManager, scene);
        Ball.static_preload(assetsManager, scene);
        assetsManager.load();
        assetsManagerLoadStart = (new Date()).getTime();
      }
      this.msg = "LEVEL: "+this.level;
    }
    catch(e)
    {
      canvas.style.backgroundColor = "red !important";
      alert(e.name+"\n"+e.message);
      //ypeerror cannot read property getextension of null
      // --> no webgl on old androids! :-() 
    }
  }

  protected onWon(bigBun:BigBun) : void
  {
      this.level++;
      if(bigBun)
      {
        bigBun.onWon(() =>
        {
          this.isBallsAllowed = true;
        });
      }

      this.balls.forEach((ball:Ball) =>
      {
        if(ball.getMesh())
        {
           ball.destroy(true, false, ball.getMesh().getScene());
        }
      });
      this.balls = new Array<Ball>();
      this.isBallsAllowed = false;

      this.msg = "LEVEL: "+this.level;
  }

  protected makeBalls(add:number, scene:BABYLON.Scene,ground:BABYLON.Mesh, shadowGenerator:BABYLON.ShadowGenerator) : void
  {
    if(!this.isBallsAllowed) return;

    for(let i:number=0;i<add;i++)
    {
      if(BunGamePage.__isDemoTime && (this.balls.length > 0))
      {
        break;
      }
      let size:number = (Math.random() * 1.2) + 0.5;
      let ball:Ball = new Ball(""+(new Date().getTime()), 16/*subdivs*/, size, scene, ground.physicsImpostor, this.level);
      this.balls.push(ball);
      shadowGenerator.getShadowMap().renderList.push(ball.getMesh());
    }
  }

  public getCanvasSize() : string
  {
      //TODO: handle rotation!

      let min:number = 375;

      let isPortrait:boolean  = this.platform.isPortrait();
      if (isPortrait)
      {
        min = document.body.clientWidth;
      }
      else
      {
        min = document.body.clientHeight;
        //let ioncontent:HTMLElement = document.getElementById('ioncontent');
        //min = Math.min(ioncontent.clientHeight, ioncontent.clientWidth);
      }

      min = Math.max(min, 375);
      min = 3/4 * min;            //  pt = 3/4 * px

      /*if(isMobile)    //not needed
      {
        if(window.location.search && window.location.search.indexOf('ionicplatform'))
        {
          //http://localhost:8100/ionic-lab --> !adjust resolution
        }
        else
        {
          //TODO: get resolution!
          //min /= 2;
        }
      }*/
      /*{
        let isMobile:boolean    = this.platform.is("mobile");

        //chrome:       portrait:true height:821  width:736 onMobile:false
        //lab-ios-sim:  portrait:true height:667  width:375 onMobile:true
        //lab-and-sim:  portrait:true height:647  width:375 onMobile:true
        //android-sim:  portrait:true height:1232 width:800 onMobile:true
        
        let msg:string = "p:"+isPortrait+" h:"+document.body.clientHeight+" w:"+document.body.clientWidth+" mob:"+isMobile+" >"+min;
        //this.msg += msg;
        console.log(msg);
      }*/

      //use pt instead of px, so are you resolution independent!!!
      return min+"pt";
  }

  public static preload() : void
  {
    //console.log("bungame preload");
    //var assetsManager = new BABYLON.AssetsManager(scene);
    //TODO: preload __TEXTURE_GRASS
  }
}

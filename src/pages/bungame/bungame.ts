import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';
import {Ball} from "./ball";

/// <reference path="assets/babylonjs/babylon.2.5.d.ts" />

@Component({
  selector: 'page-bungame',
  templateUrl: 'bungame.html'
})
export class BunGamePage
{
  public static __isDemoTime:boolean = false; 

  @ViewChild('bungamecanvas') bunGameCanvasEleRef :	ElementRef;
  @ViewChild('ioncontent') ionContentEleRef :	ElementRef;
  @ViewChild('ioncontentheader') ionContentHeaderEleRef :	ElementRef;
  @ViewChild('ionlist') ionListEleRef :	ElementRef;

  balls:Array<Ball> = new Array<Ball>();

  constructor(public navCtrl: NavController, private loadingCtrl:LoadingController)
  {

  }

  //TODO: STOP when ionViewWillBeAway!!!

	ionViewWillEnter()    //comes after ionViewDidLoad 
  {
    setTimeout(() =>
    {
      let canvas:HTMLCanvasElement = this.bunGameCanvasEleRef.nativeElement;
      canvas.height = canvas.width = this.getCanvasSize();
      var engine:BABYLON.Engine = new BABYLON.Engine(canvas);
      var scene :BABYLON.Scene  = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001);  //=set transparent background

      var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
      camera.attachControl(canvas, true);

      {
        //var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 10, -5), scene);
        light.intensity = 0.7;
      }
      {
        scene.enablePhysics();
        //scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        //camera.applyGravity = true;
      }
      {
        var ground = BABYLON.Mesh.CreateGround("ground1", 9/*width*/, 6/*depth*/, 2/*subdivs*/, scene);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("assets/grass.png", scene);
        ground.material = groundMaterial;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
      }
      
      camera.setTarget(BABYLON.Vector3.Zero()); //target the camera to scene origin

      this.makeBalls(5, scene, ground);

      engine.runRenderLoop(() =>
      {
        scene.render();

        { //cleanup
          this.balls.forEach((ball:Ball, index, object) =>
          {
            if(ball.isDisposed())
            {
              object.splice(index, 1);
            }
          });
        }
        { //update
          this.balls.forEach((ball:Ball) =>
          {
              ball.update();
          });
        }
        { //fill again
          if(this.balls.length < 3)
          {
            this.makeBalls(5, scene, ground);
          }
        }
        
      });

    }, 33);
  }

  protected makeBalls(add:number, scene:BABYLON.Scene,ground:BABYLON.Mesh) : void
  {
    for(let i:number=0;i<add;i++)
    {
      if(BunGamePage.__isDemoTime && (this.balls.length > 0))
      {
        break;
      }
      let size:number = (Math.random() * 1.2) + 0.5;
      this.balls.push(new Ball(""+(new Date().getTime()), 16/*subdivs*/, size, scene, ground.physicsImpostor));
    }
  }

  public getCanvasSize() : number
  {
      /*let p = canvas.parentElement;//document.body
      //let p = document.body;
      let p = this.ionListEleRef.nativeElement;
      let min:number = Math.max(p.clientWidth, p.clientHeight);
      if(p.clientWidth > p.clientHeight)
      {
        min = Math.min(p.clientWidth, p.clientHeight);
      }*/
      //let min:number = this.ionContentHeaderEleRef.nativeElement.clientWidth;

      let ioncontent:HTMLElement = document.getElementById('ioncontent');
      let min:number = Math.min(ioncontent.clientHeight, ioncontent.clientWidth);
      return min;
  }
}

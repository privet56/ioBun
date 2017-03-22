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

      this.balls.push(new Ball("sphere1", 16/*subdivs*/, 2/*size*/, scene, ground.physicsImpostor));

      engine.runRenderLoop(() =>
      {
        scene.render();

        this.balls.forEach((ball:Ball) =>
        {
          if(!ball.isDisposed())
            ball.update();
          else
          {
            //TODO: remove this ball
          }
        });
        
      });

    }, 33);
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

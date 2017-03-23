import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';
import {Ball} from "./ball";
import {Rabbits} from "./rabbits";

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
  protected isActiveTab : boolean = false;

  constructor(public navCtrl: NavController, private loadingCtrl:LoadingController)
  {

  }

  ionViewWillLeave()
  {
    this.isActiveTab = false;
  }

	ionViewWillEnter()    //comes after ionViewDidLoad 
  {
      this.isActiveTab = true;
      if(this.balls.length > 0)return;

      let canvas:HTMLCanvasElement = this.bunGameCanvasEleRef.nativeElement;
      canvas.height = canvas.width = this.getCanvasSize();
      var engine:BABYLON.Engine = new BABYLON.Engine(canvas);
      var scene :BABYLON.Scene  = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001);  //=set transparent background

      var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
      //camera.attachControl(canvas, true); //if activated, you can look around by dragging... 

      let shadowGenerator:BABYLON.ShadowGenerator = null;
      let sun:BABYLON.Mesh = BABYLON.Mesh.CreateSphere("sun", 10/*segments*/, 3/*diameter*/, scene);
      {
        var light2 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(1/*right*/, 5/*up*/, -1/*behind/before*/), scene);
        light.intensity = 0.7;
        
        let material:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("sun", scene);
        material.diffuseTexture = new BABYLON.Texture("assets/sun.png", scene);
        material.emissiveColor = new BABYLON.Color3(1, 1, 0);
        material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        sun.material = material;
        sun.parent = light;
        sun.position.z += 6;  //put in background
        sun.position.y -= 3;  //put in background

        shadowGenerator = new BABYLON.ShadowGenerator(512, light);
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
        groundMaterial.diffuseTexture = new BABYLON.Texture("assets/grass.png", scene);
        groundMaterial.diffuseTexture.hasAlpha = true;  //=use transparent color
        ground.material = groundMaterial;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
      }
      
      camera.setTarget(BABYLON.Vector3.Zero()); //target the camera to scene origin

      this.makeBalls(5, scene, ground, shadowGenerator);
      let rabbits:Rabbits = new Rabbits(scene, BunGamePage.__isDemoTime ? 1 : 0);

      engine.runRenderLoop(() =>
      {
        if(!this.isActiveTab)return;

        scene.render();

        { //cleanup
          this.balls.forEach((ball:Ball, index, object) =>
          {
            if(ball.isDisposed())
            {
              if(ball.isBallHit())
              {
                rabbits.createRabbit();
              }
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
            this.makeBalls(5, scene, ground, shadowGenerator);
          }
        }
        {//sun
          let rotSpeed:number = 0.002;
          sun.rotation.x+=rotSpeed;
          sun.rotation.y+=rotSpeed;
          sun.rotation.z+=rotSpeed;
        }
        { //rabbits
          rabbits.update();
        }
        
      });
  }

  protected makeBalls(add:number, scene:BABYLON.Scene,ground:BABYLON.Mesh, shadowGenerator:BABYLON.ShadowGenerator) : void
  {
    for(let i:number=0;i<add;i++)
    {
      if(BunGamePage.__isDemoTime && (this.balls.length > 0))
      {
        break;
      }
      let size:number = (Math.random() * 1.2) + 0.5;
      let ball:Ball = new Ball(""+(new Date().getTime()), 16/*subdivs*/, size, scene, ground.physicsImpostor);
      this.balls.push(ball);
      shadowGenerator.getShadowMap().renderList.push(ball.getMesh());
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

      //TODO: handle better left/right margins & landscape orientation

      let ioncontent:HTMLElement = document.getElementById('ioncontent');
      let min:number = Math.min(ioncontent.clientHeight, ioncontent.clientWidth);
      return min;
  }
}

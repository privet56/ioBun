import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';

/// <reference path="assets/babylonjs/babylon.2.5.d.ts" />

export class Ball
{
  public static __woodTexture : BABYLON.Texture = null;
  public static __grassTexture : BABYLON.Texture = null;

  protected ball:BABYLON.Mesh = null;
  protected rotSpeed:number = 0.09;
  protected isHit:boolean = false;

  constructor(name:string, subdivs:number, size:number, scene:BABYLON.Scene, groundImpostor:BABYLON.PhysicsImpostor)
  {
      this.ball = BABYLON.Mesh.CreateSphere(name, subdivs, size, scene);

      if(!Ball.__woodTexture) Ball.__woodTexture    = new BABYLON.Texture("assets/wood.png", scene);
      if(!Ball.__grassTexture) Ball.__grassTexture  = new BABYLON.Texture("assets/lea.png", scene);

      var materialSphere = (Math.random() > 0.5) ? new BABYLON.StandardMaterial("assets/grass.png", scene) : new BABYLON.StandardMaterial("assets/wood.png", scene);
      this.ball.material = materialSphere;
      materialSphere.diffuseTexture = (Math.random() > 0.5) ? Ball.__woodTexture : Ball.__grassTexture;

      //materialSphere1.diffuseColor = new BABYLON.Color3(0, Math.random()/999, Math.random()/999);
      //this.ball.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

      this.ball.position.y = (Math.random() + 2)*1.66;
      this.ball.position.x = (Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1);
      this.ball.position.z = (Math.random() + 0.5) * (Math.random() > 0.5 ? 1 : -1);

      this.rotSpeed = Math.random() * this.rotSpeed;

      this.ball.physicsImpostor = new BABYLON.PhysicsImpostor(this.ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1.5, restitution: 1.01 }, scene);

      var self = this;
      let iCollided:number = 0;

      this.ball.physicsImpostor.registerOnPhysicsCollide(groundImpostor, function(main, collided)
      {
          if(!self.ball)return;
          iCollided++;
          materialSphere.diffuseColor.r+=0.2;
          materialSphere.diffuseColor.g-=0.2;
          materialSphere.diffuseColor.b-=0.2;
          //if(materialSphere1.diffuseColor.r > 1.1)
          if(iCollided>9)
          {
            if(!self.ball)return;
            //fire: https://doc.babylonjs.com/extensions/fire & https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/materialsLibrary/babylon.fireMaterial.js
            self.destroy(true, false, scene);
          }
      });

      this.ball.actionManager = new BABYLON.ActionManager(scene);
      this.ball.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt)
      {
        self.onClick();
      }));
  }

  public getMesh() : BABYLON.Mesh
  {
    return this.ball;
  }
  public isBallHit() : boolean
  {
    return this.isHit;
  }


  destroy(withParticles:boolean, useCarrots:boolean, scene:BABYLON.Scene) : void
  {
      if(!this.ball)return;

      let ball:BABYLON.Mesh = this.ball;
      this.ball = null;
      if(withParticles)
      {
        Ball.explode(scene, ball, useCarrots);
      }
      setTimeout(() =>
      {
        ball.dispose();
        ball = null;
      }, 99);
  }

  onClick() : void
  {
    if(!this.ball)return;
    this.isHit = true;
    this.destroy(true, true, this.ball.getScene());
  }

  public update():void
  {
    if(!this.ball)return;

    if(this.ball.position.y < -9)
    {
      return this.destroy(false, false, this.ball.getScene());
    }

    this.ball.rotation.x+=this.rotSpeed;
    this.ball.rotation.y+=this.rotSpeed;
    this.ball.rotation.z+=this.rotSpeed;

  }
  protected static explode(scene:BABYLON.Scene, ball:BABYLON.Mesh, useCarrots:boolean): void
  {
    if(!ball)return;
    var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, scene);
	  fountain.position = ball.position;//new BABYLON.Vector3(0,0,20)
	  fountain.isVisible = false;

    var particleSystem = new BABYLON.ParticleSystem("particles", 100, scene);

    particleSystem.particleTexture = useCarrots ?  new BABYLON.Texture("assets/carrot.png", scene) : new BABYLON.Texture("assets/lensflare/lensflare0_alpha.png", scene);
    particleSystem.emitter = fountain;
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.color1     = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2     = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead  = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.minSize = useCarrots ? 0.001 : 0.1;
    particleSystem.maxSize = useCarrots ? 0.5 : 1;
    particleSystem.minLifeTime = useCarrots ? 0.2 : 1;
    particleSystem.maxLifeTime = useCarrots ? 0.3 : 1;
    particleSystem.emitRate = useCarrots ? 55 : 500;
    particleSystem.blendMode = useCarrots ? BABYLON.ParticleSystem.BLENDMODE_STANDARD : BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.gravity    = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction1 = useCarrots ? new BABYLON.Vector3(-1, 1, 1) : new BABYLON.Vector3(-5, 5, 5);
    particleSystem.direction2 = useCarrots ? new BABYLON.Vector3(1, -1, -1) : new BABYLON.Vector3(5, -5, -5);
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;
    particleSystem.minEmitPower = 3;
    particleSystem.maxEmitPower = 6;
    particleSystem.updateSpeed = useCarrots ? 0.0025 : 0.025;
    
    particleSystem.targetStopDuration = 0.5;
    particleSystem.disposeOnStop = true;
    
    //particleSystem.startDirectionFunction = startDirectionFunction;
    /*particleSystem.updateFunction = function()
    { /* not needed beccause particleSystem.disposeOnStop = true;
      if(particleSystem.isAlive() == false)
      {
        setTimeout(() =>
        {
          console.log("partEND");
          particleSystem.dispose();

        }, 3333);
      }* /
    };*/
    particleSystem.start();
  }
  public isDisposed() : boolean
  {
    if(!this.ball)return true;
    return this.ball.isDisposed();
  }
}

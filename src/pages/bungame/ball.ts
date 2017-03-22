import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';

/// <reference path="assets/babylonjs/babylon.2.5.d.ts" />

export class Ball
{
  protected ball:BABYLON.Mesh = null;
  protected rotSpeed:number = 0.01;

  constructor(name:string, subdivs:number, size:number, scene:BABYLON.Scene, groundImpostor:BABYLON.PhysicsImpostor)
  {
      this.ball = BABYLON.Mesh.CreateSphere(name, subdivs, size, scene);

      //TODO: load assets only once!
      var materialSphere1 = new BABYLON.StandardMaterial("assets/wood.png", scene);
      this.ball.material = materialSphere1;
      materialSphere1.diffuseTexture = new BABYLON.Texture("assets/wood.png", scene);
      materialSphere1.diffuseColor = new BABYLON.Color3(0, Math.random(), Math.random());

      //this.ball.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

      this.ball.position.y = 6;  // Move the sphere upward 1/2 its height

      this.rotSpeed = Math.random() * this.rotSpeed;

      this.ball.physicsImpostor = new BABYLON.PhysicsImpostor(this.ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 1.01 }, scene);

      var self = this;

      this.ball.physicsImpostor.registerOnPhysicsCollide(groundImpostor, function(main, collided)
      {
          if(!self.ball)return;
          materialSphere1.diffuseColor.r+=0.1;
          if(materialSphere1.diffuseColor.r > 1.1)
          {
            if(!self.ball)return;
            //fire: https://doc.babylonjs.com/extensions/fire & https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/materialsLibrary/babylon.fireMaterial.js
            let ball:BABYLON.Mesh = self.ball;
            self.ball = null;
            Ball.explode(scene, ball);
            setTimeout(() =>
            {
              ball.dispose();
              ball = null;
            }, 99);
          }
      });
  }

  public update():void
  {
    if(!this.ball)return;
    this.ball.rotation.x+=this.rotSpeed;
    this.ball.rotation.y+=this.rotSpeed;
    this.ball.rotation.z+=this.rotSpeed;
  }
  protected static explode(scene:BABYLON.Scene, ball:BABYLON.Mesh): void
  {
    if(!ball)return;
    var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, scene);
	  fountain.position = ball.position;//new BABYLON.Vector3(0,0,20)
	  fountain.isVisible = false;

    var particleSystem = new BABYLON.ParticleSystem("particles", 100, scene);
    particleSystem.particleTexture = new BABYLON.Texture("assets/lensflare/lensflare0_alpha.png", scene);
    particleSystem.emitter = fountain;
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    particleSystem.minSize = 1;
    particleSystem.maxSize = 3;
    particleSystem.minLifeTime = 1;
    particleSystem.maxLifeTime = 1;
    particleSystem.emitRate = 500;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction1 = new BABYLON.Vector3(-5, 5, 5);
    particleSystem.direction2 = new BABYLON.Vector3(5, -5, -5);
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;
    particleSystem.minEmitPower = 3;
    particleSystem.maxEmitPower = 6;
    particleSystem.updateSpeed = 0.025;
    
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

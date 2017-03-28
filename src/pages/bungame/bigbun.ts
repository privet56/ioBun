import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';
import { Defs	} from	'./defs';
import { SceneObject	} from	'./sceneobject';

/// <reference path="assets/babylonjs/babylon.2.5.d.ts" />

export class BigBun implements SceneObject
{
  public static __MINSCALE:number = 0.0001;
  public static __MAXSCALE:number = 0.11;
  protected bun:BABYLON.AbstractMesh = null;
  protected inWon:boolean = false;
  
  constructor(public scene:BABYLON.Scene)
  {

  }

  preload(assetsManager:BABYLON.AssetsManager, scene:BABYLON.Scene) : void
  {
    var self = this;
    {
      var meshTask = assetsManager.addMeshTask(""/*taskName*/, ""/*meshesNames*/, Defs.__DIR_ASSETS/*rootUrl*/, Defs.__BABYLON_RABBIT/*sceneFileName*/);
      meshTask.onSuccess = function (task:BABYLON.MeshAssetTask)
      {
        self.initBun(task.loadedMeshes[0], task.loadedSkeletons[0]);
      }
    }
    /*{ //test loading big file
      var meshTask = assetsManager.addMeshTask("", "", Defs.__DIR_ASSETS, "lea.obj");
      meshTask.onSuccess = function (task:BABYLON.MeshAssetTask)
      {
        //nothing to do...
      }
    }*/
  }

  public update(refreshRate:number):void
  {
      if(!this.bun)return;
      if(!this.inWon)return;
      /*do better with animation!
      this.bun.scaling.x += 0.00005;
      this.bun.scaling.y += 0.00005;
      this.bun.scaling.z += 0.00005;
      this.bun.rotation.y += 0.02;
      */
  }
  public setBun(bun:BABYLON.AbstractMesh, skeleton:BABYLON.Skeleton) :void
  {
      if(this.bun)return;

      let cloneChildren:boolean = true;
      this.initBun(bun.clone("bigbun", null, !cloneChildren), skeleton);
  }
  public initBun(bun:BABYLON.AbstractMesh, skeleton:BABYLON.Skeleton):void
  {
    if(!bun)return;
    this.bun = bun;
    this.bun.position   = new BABYLON.Vector3(0,0,0);
    this.bun.scaling    = new BABYLON.Vector3(BigBun.__MINSCALE, BigBun.__MINSCALE, BigBun.__MINSCALE);

    let to:number       = 100 - (3 * 10);
    let speed:number    = 1.0 - (3 / 10);

    this.scene.beginAnimation(skeleton, 0/*from*/, to/*to*/, true/*loop*/, speed);
    this.bun.setEnabled(false);
    this.bun.rotation.y = 0.5;

    let framePerSecond:number = 10;
    {
      var ani = new BABYLON.Animation("bigBunAni", "scaling", framePerSecond,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        false/*enableBlending*/);

      var easingFunction = new BABYLON.CircleEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
      ani.setEasingFunction(easingFunction);

      var keys = [];
        keys.push({
            frame: 0,
            value: new BABYLON.Vector3(BigBun.__MINSCALE, BigBun.__MINSCALE, BigBun.__MINSCALE)
        });
        keys.push({
            frame: 100,
            value: new BABYLON.Vector3(BigBun.__MAXSCALE, BigBun.__MAXSCALE, BigBun.__MAXSCALE)
        });
      ani.setKeys(keys);

      this.bun.animations.push(ani);
    }
    {
      var ani = new BABYLON.Animation("bigBunAni", "rotation.y", framePerSecond,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        false/*enableBlending*/);

      var easingFunction = new BABYLON.CircleEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
      ani.setEasingFunction(easingFunction);

      var keys = [];
        keys.push({
            frame: 0,
            value: 0
        });
        keys.push({
            frame: 100,
            value: Math.PI
        });
      ani.setKeys(keys);

      this.bun.animations.push(ani);
    }
  }
  public onWon(callback: () => any):void
  {
      if(!this.bun) return;
      if(this.inWon)return;

      this.inWon = true;
      this.bun.scaling = new BABYLON.Vector3(BigBun.__MINSCALE, BigBun.__MINSCALE, BigBun.__MINSCALE);
      this.bun.rotation.y = 0;
      this.bun.setEnabled(true);
      var self = this;

      let animatable:BABYLON.Animatable = this.scene.beginAnimation(this.bun, 0, 100, false/*loop*/, 1/*speedRatio*/, () =>
      {
        callback();
        self.inWon = false;
        self.bun.scaling = new BABYLON.Vector3(BigBun.__MINSCALE, BigBun.__MINSCALE, BigBun.__MINSCALE);
        self.bun.rotation.y = 0;
        self.bun.setEnabled(false);

      }, null/*animatable*/);
  }
}

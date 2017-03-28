import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';
import { SceneObject	} from	'./sceneobject';
import { Defs	} from	'./defs';

/// <reference path="assets/babylonjs/babylon.2.5.d.ts" />

export class Sun implements SceneObject
{
  protected sun:BABYLON.Mesh = null;
  protected sunLight:BABYLON.IShadowLight = null;
  protected rotSpeed:number = 0.002;

  constructor(public scene:BABYLON.Scene)
  {
    this.sun = BABYLON.Mesh.CreateSphere("sun", 10/*segments*/, 3/*diameter*/, scene);

    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(1/*right*/, 5/*up*/, -1/*behind/before*/), scene);
    light.intensity = 0.7;
    this.sun.parent = light;
    this.sun.position.z += 6;  //put in background
    this.sun.position.y -= 3;
    this.sunLight = light;
  }

  preload(assetsManager:BABYLON.AssetsManager, scene:BABYLON.Scene) : void
  {
    var self = this;
    {

      let textureTask:BABYLON.ITextureAssetTask = assetsManager.addTextureTask(Defs.__DIR_ASSETS + Defs.__TEXTURE_SUN, Defs.__DIR_ASSETS + Defs.__TEXTURE_SUN);
      textureTask.onSuccess = function(task)
      {
        let material:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("sun", scene);
        material.diffuseTexture = task.texture;
        material.emissiveColor  = new BABYLON.Color3(1, 1, 0);
        material.diffuseColor   = new BABYLON.Color3(1, 1, 1);
        self.sun.material = material;
      };
    }
  }

  public getLight() : BABYLON.IShadowLight
  {
      return this.sunLight;
  }

  public update(refreshRate:number) : void
  {
    this.sun.rotate(    BABYLON.Axis.X,(this.rotSpeed * refreshRate), BABYLON.Space.LOCAL);
    this.sun.translate( BABYLON.Axis.X,(this.rotSpeed*2.2)*refreshRate, BABYLON.Space.WORLD);

    if( this.sun.position.x > 6.6)
    {
        this.sun.position.x = -7;
    }
  }
}

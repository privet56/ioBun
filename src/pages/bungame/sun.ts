import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';
import { SceneObject	} from	'./sceneobject';

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

    let material:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("sun", scene);
    material.diffuseTexture = new BABYLON.Texture("assets/sun.png", scene);
    material.emissiveColor = new BABYLON.Color3(1, 1, 0);
    material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    this.sun.material = material;
    this.sun.parent = light;
    this.sun.position.z += 6;  //put in background
    this.sun.position.y -= 3;

    this.sunLight = light;
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

import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';

/// <reference path="assets/babylonjs/babylon.2.5.d.ts" />

export class Rabbits
{
  protected rabbits:Array<BABYLON.AbstractMesh> = new Array<BABYLON.AbstractMesh>();
  protected rotSpeed:number = 0.09;

  constructor(public scene:BABYLON.Scene, createRabbits:number)
  {
      for(let i=0;i<createRabbits;i++)
      {
          this.createRabbit();
      }
  }

  public update() : void
  {
      for(let i=0;i<this.rabbits.length;i++)
      {
          this.rabbits[i].rotation.y += 0.02;
          //this.rabbits[i].rotate(new BABYLON.Vector3(0, 1, 0), 0.02, BABYLON.Space.WORLD);
          //this.rabbits[i].rotate(BABYLON.Axis.Y, Math.PI / 64, BABYLON.Space.LOCAL);

          if(this.rabbits[i].scaling.x < 0.02)
          {
              this.rabbits[i].scaling.x += 0.00005;
              this.rabbits[i].scaling.y += 0.00005;
              this.rabbits[i].scaling.z += 0.00005;
          }
      }
  }
  public createRabbit() : void
  {
    var self = this;
    BABYLON.SceneLoader.ImportMesh("","assets/", "Rabbit.babylon", this.scene, function (buns:BABYLON.AbstractMesh[])
    { 
        let xOffset:number = -3.5;
        xOffset += (self.rabbits.length * 0.95);
        buns[0].position    = new BABYLON.Vector3(xOffset, 2.95, 2);
        buns[0].scaling     = new BABYLON.Vector3(0.01, 0.01, 0.01);

        if(self.rabbits.length > 0)
        {
            buns[0].rotation.y = self.rabbits[self.rabbits.length - 1].rotation.y;
        }

        {
            /*  //set origin of rotation
            let ball:BABYLON.Mesh = BABYLON.Mesh.CreateSphere("sss", 6, 1, self.scene);
            ball.position = new BABYLON.Vector3(xOffset, 2.95, 2);
            buns[0].parent = ball;
            var groundMaterial = new BABYLON.StandardMaterial("rabbits.ball.mat", self.scene);
            ball.material = groundMaterial;
            ball.material.alpha = 0.3;*/
        }
        //TODO: set Text!
        /*{
            var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 1, self.scene, true);
            outputplaneTexture.drawText("bla", 0, 0, "122 px verdana", "red", "transparent", true);
            outputplaneTexture.hasAlpha = true;
            let mat: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("outputplane", self.scene);
            mat.diffuseTexture = outputplaneTexture;
            buns[0].material = mat;
        }*/
        /*{
            var stickyMat = new BABYLON.StandardMaterial("matPaint", scene);
            stickyMat.diffuseTexture = new BABYLON.Texture("./assets/lea.png", scene);
            stickyMat.specularColor = new BABYLON.Color3(0, 0, 0);
            stickyMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
            stickyMat.emissiveColor = new BABYLON.Color3(0.6, 0.6, 0.6);
            var contentMat = new BABYLON.StandardMaterial("matPaint", scene);
            contentMat.specularColor = new BABYLON.Color3(0, 0, 0);
            contentMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
            contentMat.emissiveColor = new BABYLON.Color3(0.6, 0.6, 0.6);
            var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
            let mat: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("outputplane", self.scene);
            mat.diffuseTexture = backgroundTexture;
            buns[0].material = mat;
        }*/
        /*{
            var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 512, self.scene, true);
            var background = buns[0];
            var material = new BABYLON.StandardMaterial("background", self.scene);
            material.diffuseTexture = backgroundTexture;
            material.specularColor = new BABYLON.Color3(0, 0, 0);
            //background.material.backFaceCulling = false;
            background.material = material;
            backgroundTexture.drawText("Eternalcoding", 0, 0, "bold 70px Segoe UI", "white", "#555555");
            backgroundTexture.drawText("- browsers statistics -", 22, 22, "35px Segoe UI", "white", null);
        }*/
        self.rabbits.push(buns[0]);
    });
  }
}

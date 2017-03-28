import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';
import { SceneObject } from	'./sceneobject';
import { BigBun	} from	'./bigbun';
import { Defs	} from	'./defs';

/// <reference path="assets/babylonjs/babylon.2.5.d.ts" />

export class Rabbits implements SceneObject
{
  protected rabbits:Array<BABYLON.AbstractMesh> = new Array<BABYLON.AbstractMesh>();
  protected rotSpeed:number = 0.09;
  public static __clapSound : BABYLON.Sound = null;
  protected bigBun:BigBun = null;

  constructor(public scene:BABYLON.Scene, createRabbits:number, bigBun:BigBun)
  {
      this.bigBun = bigBun;

      for(let i=0;i<createRabbits;i++)
      {
          this.createRabbit();
      }

      if(!Rabbits.__clapSound)
      {
        console.warn("Rabbits.__clapSound not preloaded "+Defs.__DIR_ASSETS + Defs.__SOUND_CLAP);
        Rabbits.__clapSound    = new BABYLON.Sound("Music", Defs.__DIR_ASSETS + Defs.__SOUND_CLAP,
                                                        scene, null, { loop: false, autoplay: false, volume:0.55 });
      }

      setTimeout(() =>
      {
          this.firework();

      }, 999);
  }

  preload(assetsManager:BABYLON.AssetsManager, scene:BABYLON.Scene) : void
  {
    {
      let fileTask:BABYLON.IAssetTask = assetsManager.addBinaryFileTask(Defs.__DIR_ASSETS + Defs.__SOUND_CLAP, Defs.__DIR_ASSETS + Defs.__SOUND_CLAP);
      fileTask.onSuccess = function(task:BABYLON.BinaryFileAssetTask)
      {
        let data = task.data;
        if(!data)console.error("!data on "+Defs.__DIR_ASSETS + Defs.__SOUND_CLAP);
        Rabbits.__clapSound = new BABYLON.Sound( Defs.__DIR_ASSETS + Defs.__SOUND_CLAP,
                                              data, scene, null/*readyToPlayCallback*/, { loop: false, autoplay: false, volume:0.55 });
      };
    }
  }

  public update(refreshRate:number) : void
  {
      for(let i=0;i<this.rabbits.length;i++)
      {
          this.rabbits[i].rotation.y += (0.02 * refreshRate);

          if(this.rabbits[i].scaling.x < 0.02)
          {
              this.rabbits[i].scaling.x += (0.00005 * refreshRate);
              this.rabbits[i].scaling.y += (0.00005 * refreshRate);
              this.rabbits[i].scaling.z += (0.00005 * refreshRate);
          }
      }
  }
  public createRabbit() : boolean
  {
      if(this.rabbits.length > 6)
      {
          this.rabbits.forEach((rabbit:BABYLON.AbstractMesh) =>
          {
            setTimeout(() =>
            {
                rabbit.dispose();
                rabbit = null;
            }, 99);
          });
          this.rabbits = new Array<BABYLON.AbstractMesh>();
          this.firework();
          Rabbits.__clapSound.play();
          return true;
      }

    var self = this;

    //actually & preload + Mesh.clone would be nicer...
    BABYLON.SceneLoader.ImportMesh("",Defs.__DIR_ASSETS, Defs.__BABYLON_RABBIT, this.scene, function (buns:BABYLON.AbstractMesh[], particleSystems:BABYLON.ParticleSystem[], skeletons:BABYLON.Skeleton[])
    {
        let bun : BABYLON.AbstractMesh = buns[(self.rabbits.length % 2 == 0) ? 0 : buns.length - 1];

        self.bigBun.setBun(bun, skeletons[0]);

        {
            let to:number       = 100 - (self.rabbits.length * 10);
            let speed:number    = 1.0 - (self.rabbits.length / 10);
            self.scene.beginAnimation(skeletons[0], 0/*from*/, to/*to*/, true/*loop*/, speed);
        }

        let xOffset:number = -3.5;
        xOffset += (self.rabbits.length * 0.95);
        bun.position    = new BABYLON.Vector3(xOffset, 2.95, 2);
        bun.scaling     = new BABYLON.Vector3(0.01, 0.01, 0.01);

        if(self.rabbits.length > 0)
        {
            bun.rotation.y = self.rabbits[self.rabbits.length - 1].rotation.y;
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
        self.rabbits.push(bun);
    });

    return false;
  }
  protected firework() : void
  {
    var scene = this.scene;
    var useCarrots = false;

    var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, scene);
    fountain.position = new BABYLON.Vector3(0,0,0);
	fountain.isVisible = false;

    var particleSystem = new BABYLON.ParticleSystem("particles", 100, scene);

    particleSystem.particleTexture = new BABYLON.Texture(Defs.__DIR_ASSETS + Defs.__TEXTURE_LENSFLARE0, scene);
    particleSystem.emitter = fountain;
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.color1     = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2     = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead  = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.minSize = useCarrots ? 0.001 : 1;
    particleSystem.maxSize = useCarrots ? 0.5 : 11;
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
    
    particleSystem.start();
  }
}

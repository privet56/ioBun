import { ElementRef, ViewChild, Component } from '@angular/core';
import { NavController,	LoadingController	}	from	'ionic-angular';

/// <reference path="assets/babylonjs/babylon.2.5.d.ts" />

export interface SceneObject
{
    preload(assetsManager:BABYLON.AssetsManager, scene:BABYLON.Scene) : void;
    update(refreshRate:number) : void;
}

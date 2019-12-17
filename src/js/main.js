import * as helpers from './bidello';
import renderer from './renderer';
import camera from './camera';
import scene from './scene';
import { component } from 'bidello';
import settings from './settings';
import postfx from './postfx/postfx';
import assets from './assets';
import trackable from './trackable';

import { Application } from 'kapla';

class Site extends component() {
  init() {
    this.app = Application.start();
    this.app.register("trackable", trackable);

    assets.load();
    document.body.appendChild(renderer.domElement);
  }

  onRaf() {
    // renderer.render(scene, camera);
    postfx.render(scene, camera);
  }

  onLoadEnd() {
    console.log('finished loader!');
  }
}

new Site();
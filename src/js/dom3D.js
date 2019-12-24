import { Object3D, sRGBEncoding } from "three";
import { component } from "bidello";
import { viewport, scroll } from "./bidello";
import camera from "./camera";

export default class extends component(Object3D) {
  init() {
    this.element = this._args[0];
  }

  onResize() {
    if (!this.element) {
      return;
    }

    scroll.update();
    const rect = this.element.getBoundingClientRect();

    this.bounds = {
      left: rect.left + scroll.x,
      top: rect.top + scroll.y,
      width: rect.width,
      height: rect.height
    };

    // console.log(this.bounds);

    // console.log(`scroll.y = ${scroll.y}`)
    // console.log(`top = ${rect.top}`)

    this.updateSize();
    this.updatePosition();
  }

  updateSize() {
    this.camUnit = camera.calculateUnitSize(
      camera.position.z - this.position.z
    );
    /*
      calculateUnitSize(distance = this.position.z) {
        const vFov = this.fov * Math.PI / 180;
        const height = 2 * Math.tan(vFov / 2) * distance;
        const width = height * this.aspect;
        return {
          width,
          height
        };
      }
    */

    // Set size
    const x = this.bounds.width / viewport.width;
    const y = this.bounds.height / viewport.height;

    if (!x || !y) {
      return;
    }

    this.scale.x = this.camUnit.width * x;
    this.scale.y = this.camUnit.height * y;
  }

  updatePosition(pos = scroll.y) {
    const y = pos;

    // Set origin to top left
    this.position.x = -(this.camUnit.width / 2) + this.scale.x / 2;
    this.position.y = this.camUnit.height / 2 - this.scale.y / 2;

    // Set position
    this.position.x += (this.bounds.left / viewport.width) * this.camUnit.width;
    this.position.y -=
      ((this.bounds.top - y) / viewport.height) * this.camUnit.height;
  }

  onRaf() {
    this.updatePosition();
  }

  onScroll() {
    this.updatePosition();
  }

  onTransitionAfter() {
    document.dispatchEvent(new Event("scroll"))
    window.dispatchEvent(new Event("resize"))
  }

  destroy() {
    this.parent && this.parent.remove(this);
    this.visible = false;

    super.destroy();
  }
}

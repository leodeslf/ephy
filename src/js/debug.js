import { Vec2 } from "@leodeslf/vec.js";
import { radian } from "./util";

let animation;
let context, width, height;
let ratio, render;
let step, current, end, r2Vector, orbitVector;

function setDebugContext(newContext) {
  context = newContext;
  width = context.canvas.width;
  height = context.canvas.height;
  resetDebugDraw();
}

function setDebugParams(newRatio, newRender) {
  ratio = { ...newRatio };
  render = { ...newRender };
  ratio.r2 = Math.abs(ratio.r2);
  resetDebugDraw();
}

function resetDebugDraw() {
  cancelAnimationFrame(animation);

  step = render.speedR1R2;
  current = 0;
  end = radian * ratio.revolutions;
  r2Vector = new Vec2(-ratio.r2Factor, 0);
  orbitVector = new Vec2(ratio.orbit, 0);

  drawDebug();
}

function drawDebug() {
  if (!context || !ratio || !render) return;

  for (let i = 0; i < render.iterations; i++) {
    // Update to "next" possition.
    r2Vector.rotateAxisZ(-render.speedR2);
    orbitVector.rotateAxisZ(-render.speedR1R2);

    current += step;
    if (current >= end + step) {
      return cancelAnimationFrame(animation);
    }

    context.clearRect(-width * .5, -height * .5, width, height);

    // r1 circle.
    context.strokeStyle = 'black';
    context.beginPath();
    context.arc(0, 0, ratio.r1, 0, radian);
    context.closePath();
    context.stroke();

    // r2 circle.
    context.strokeStyle = 'blue';
    context.beginPath();
    context.arc(orbitVector.x, orbitVector.y, ratio.r2, 0, radian);
    context.closePath();
    context.stroke();

    // r2Factor line.
    context.strokeStyle = 'red';
    context.beginPath();
    context.moveTo(...orbitVector.xy);
    context.lineTo(...Vec2.add(orbitVector, r2Vector).xy);
    context.closePath();
    context.stroke();

    // r2 circle center.
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(...Vec2.add(orbitVector, r2Vector).xy, 3, 0, radian);
    context.closePath();
    context.fill();
  }

  animation = requestAnimationFrame(drawDebug);
}

export { setDebugContext, setDebugParams };

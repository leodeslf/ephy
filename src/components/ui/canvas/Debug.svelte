<script>
  import { afterUpdate, tick } from "svelte";
  import { width, height } from "/src/stores/size";
  import { setDebugContext } from "/src/js/debug";

  let canvas;

  async function resetDebugContext() {
    // Canvas could be updating to fit the window.
    await tick();

    const context = canvas.getContext("2d");
    context.translate($width * 0.5, $height * 0.5);
    context.lineCap = "round";
    context.lineWidth = 1;

    setDebugContext(context);
  }

  afterUpdate(() => resetDebugContext());
</script>

<canvas
  class="debug-canvas"
  width={$width}
  height={$height}
  bind:this={canvas}
/>

<style lang="scss">
  .debug-canvas {
    display: none;
    position: absolute;
    pointer-events: none;
  }
</style>

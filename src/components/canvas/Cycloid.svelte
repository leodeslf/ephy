<script>
  import { afterUpdate, tick } from "svelte";
  import { width, height } from "/src/stores/size";
  import { setContext } from "/src/js/cycloid";

  let canvas;

  async function resetContext() {
    // Canvas could be updating to fit the window.
    await tick();

    const context = canvas.getContext("2d");
    context.translate($width * 0.5, $height * 0.5);
    context.globalCompositeOperation = "luminosity";
    context.strokeStyle = "#000";
    context.lineCap = "round";
    context.lineWidth = 0.35;

    setContext(context);
  }

  afterUpdate(() => resetContext());
</script>

<canvas
  class="cycloid-canvas"
  width={$width}
  height={$height}
  bind:this={canvas}
/>

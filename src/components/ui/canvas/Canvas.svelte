<script>
  import Cycloid from "./Cycloid.svelte";
  import Debug from "./Debug.svelte";
  import { scale } from "/src/stores/size";
  import { debugIsVisible } from "/src/stores/ui";

  const minScale = 0.001;

  // Zoom in/out.
  function updateScale(e) {
    $scale -= e.deltaY * 0.001;
    if ($scale < minScale) $scale = minScale;
  }
</script>

<div
  class="layer-canvas"
  on:mousewheel={updateScale}
  class:debug-is-visible={$debugIsVisible}
>
  <Cycloid />
  <Debug />
</div>

<style lang="scss" global>
  @import "../../../sass/main";

  .layer-canvas {
    display: grid;
    user-select: none;
    &.debug-is-visible .debug-canvas {
      @extend .show-hidden-element;
    }
  }
</style>

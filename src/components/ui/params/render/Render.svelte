<script>
  import ParamGroup from "/src/components/reusable/ParamGroup.svelte";
  import Progress from "./Progress.svelte";
  import Redraw from "./Redraw.svelte";
  import ShowDebug from "./ToggleDebug.svelte";
  import { speedR1R2, iterations } from "/src/stores/render";
  import { radian } from "/src/js/util";
  import { k } from "/src/stores/ratio";
  import { setRender } from "/src/js/cycloid";

  const minS = 0.001;
  const minI = 1;
  const maxS = 0.1 * radian.toFixed(3);
  const maxI = 5000;

  // Data bound.
  $: if ($speedR1R2 < minS) $speedR1R2 = minS;
  $: if ($iterations < minI) $iterations = minI;
  $: if ($speedR1R2 > maxS) $speedR1R2 = maxS;
  $: if ($iterations > maxI) $iterations = maxI;

  // Pass render config. to cycloid module.
  $: setRender({
    speedR2: $speedR1R2 * ($k + 1),
    speedR1R2: $speedR1R2,
    iterations: $iterations,
  });
</script>

<ParamGroup>
  <h2>Dibujo <Progress /></h2>
  <p>
    <label for="speed-r1r2" title="Velocidad rotacional en radianes.">
      ω
    </label>
    <input
      id="speed-r1r2"
      type="number"
      bind:value={$speedR1R2}
      min={minS}
      max={maxS}
      step=".001"
    />
  </p>
  <p>
    <label for="iterations" title="Iteraciones por cuadro.">1x</label>
    <input
      id="iterations"
      type="number"
      bind:value={$iterations}
      min={minI}
      max={maxI}
      step="1"
    />
  </p>
  <div class="button__group">
    <Redraw />
    <ShowDebug />
  </div>
</ParamGroup>

<style lang="scss">
  h2 {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
  }

  .button__group {
    margin-top: 0.5rem;
  }
</style>

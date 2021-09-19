<script>
  /* import Note from "/src/components/reusable/Note.svelte"; */
  import ParamGroup from "/src/components/reusable/ParamGroup.svelte";
  import { factor } from "/src/stores/factor";

  // Data bound.
  $: if ($factor < -100) $factor = -100;
  $: if ($factor > 100) $factor = 100;
</script>

<ParamGroup>
  <h2>Factor</h2>
  <!-- <Note>
    <p>Cicloide = 1</p>
    <p>Trocoide ≠ 1</p>
  </Note> -->
  <p>
    <label for="factor">f</label>
    <input
      id="factor"
      type="number"
      bind:value={$factor}
      min="-100"
      max="100"
      step="0.05"
    />
  </p>
</ParamGroup>

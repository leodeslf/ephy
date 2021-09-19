<script>
  import Note from "/src/components/reusable/Note.svelte";
  import ParamGroup from "/src/components/reusable/ParamGroup.svelte";
  import { p, q, k, irreducibleP, irreducibleQ } from "/src/stores/ratio";
  import { gcd } from "/src/js/util";
  import { radius } from "/src/stores/size";
  import { r1, r2 } from "/src/stores/circles";
  import { factor } from "/src/stores/factor";
  import { setRatio } from "/src/js/cycloid";

  const minP = -2500;
  const minQ = 1;
  const maxPQ = 2500;

  // Data bound.
  $: $p = Math.floor($p);
  $: $q = Math.floor($q);
  $: if ($p < minP) $p = minP;
  $: if ($q < minQ) $q = minQ;
  $: if ($p > maxPQ) $p = maxPQ;
  $: if ($q > maxPQ) $q = maxPQ;

  $: absP = Math.abs($p);
  
  // If `p` is negative, `q` cannot be greater than its absolute value.
  $: if ($p < 0 && $q > absP) $q = absP;

  // If `p` is zero, we cannot draw.
  $: if (absP > 0) {
    const gcdPQ = gcd(absP, $q);
    $irreducibleP = $p / gcdPQ;
    $irreducibleQ = $q / gcdPQ;
  }

  // Ratio.
  $: $k = $irreducibleP / $irreducibleQ;

  // Fraction for the circles radius relative to the cycloid radius.
  let fraction;
  $: fraction = $radius / ($k + ($k > 0 ? 2 : -2));

  // Circles radius.
  $: $r1 = fraction * $k;
  $: $r2 = fraction;

  // Orbit of outer cirlce.
  let orbit;
  $: orbit = $r1 + $r2;

  let r2Factor;
  $: r2Factor = $r2 * $factor;

  // Pass ratio config. to cycloid module.
  $: setRatio({
    r1: $r1,
    r2: $r2,
    r2Factor,
    orbit,
    revolutions: Math.abs($irreducibleQ),
  });

  $: kFixed8 = +$k.toFixed(7);
</script>

<!-- svelte-ignore component-name-lowercase -->
<ParamGroup>
  <h2>Razón</h2>
  <Note>
    <p>k = <label for="p">p</label> ∶ <label for="q">q</label></p>
    <p>
      k = <span class="ratio">{`${$irreducibleP} : ${$irreducibleQ}`}</span>
    </p>
    <p>k {(kFixed8 === $k ? "= " : "≈ ") + kFixed8}</p>
  </Note>
  <p>
    <label
      for="p"
      title="En forma reducida, número de cúspudes."
      class:partially-invalid={$p === 0}>p</label
    >
    <input id="p" type="number" bind:value={$p} min={minP} max={maxPQ} />
  </p>
  <p>
    <label for="q" title="En forma reducida, número de revoluciones.">q</label>
    <input id="q" type="number" bind:value={$q} min={minQ} max={maxPQ} />
  </p>
</ParamGroup>

<style lang="scss" global>
  .param__group > .note > p > label {
    padding-right: 0;
  }

  .partially-invalid {
    opacity: 0.5;
  }

  .ratio {
    display: inline-flex;
    min-width: 11ch;
  }
</style>

<script>
  import { width, height, margin, scale, radius } from "/src/stores/size";

  const minRadius = $margin;

  $: availableRadius = Math.min($width, $height) * 0.5;
  $: $radius = availableRadius * $scale - $margin;
  $: if ($radius < minRadius) $radius = minRadius;
</script>

<svelte:window bind:innerWidth={$width} bind:innerHeight={$height} />

<div style="display: none;" />

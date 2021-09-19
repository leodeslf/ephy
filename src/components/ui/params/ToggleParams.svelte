<script>
  import Checkbox from "/src/components/reusable/Checkbox.svelte";
  import { paramsIsVisible } from "/src/stores/ui";
</script>

<Checkbox  title="Menú" bind:checked={$paramsIsVisible} id="toggle-params">⋯</Checkbox>

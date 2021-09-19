<script>
  import Checkbox from "/src/components/reusable/Checkbox.svelte";
  import { debugIsVisible } from "/src/stores/ui";
</script>

<Checkbox title="Debug" bind:checked={$debugIsVisible} id="toggle-debug">◎</Checkbox>

<script>
  import Ratio from "./Ratio.svelte";
  import Factor from "./Factor.svelte";
  import Render from "./render/Render.svelte";
  import ToggleParams from "./ToggleParams.svelte";
  import { paramsIsVisible } from "/src/stores/ui";
</script>

<aside>
  <div class="params" class:show-hidden-element={$paramsIsVisible}>
    <Ratio />
    <Factor />
    <Render />
  </div>
  <ToggleParams />
</aside>

<style lang="scss" global>
  aside {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    grid-area: params;
    > * {
      align-self: flex-end;
      pointer-events: all;
    }
    > :last-child {
      margin-top: auto;
    }
  }

  .params {
    display: none;
    flex-direction: column;
    gap: 1rem;
    pointer-events: none;
    > * {
      pointer-events: all;
    }
  }
</style>

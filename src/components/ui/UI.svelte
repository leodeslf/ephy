<script>
  import Params from "./params/Params.svelte";
  import Footer from "./Footer.svelte";
</script>

<div class="ui">
  <Params />
  <Footer />
</div>

<style lang="scss">
  .ui {
    padding: 1rem 2rem;
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: grid;
    gap: 1rem;
    grid-template-areas: "params" "footer";
    grid-template-rows: auto min-content;
    z-index: 1;
  }
</style>

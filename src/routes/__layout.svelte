<script>
  import AutoResize from "/src/components/AutoResize.svelte";
</script>

<svelte:head>
  <title>ephy</title>
</svelte:head>

<AutoResize />
<slot />

<style lang="scss" global>
  @import "../sass/main";
</style>

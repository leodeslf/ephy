<script>
  export let title, id, checked;
</script>

<label {title} role="button" class="button" for={id} class:on={checked}>
  <slot />
  <input {id} type="checkbox" bind:checked={checked} />
</label>

<script>
  import { rendering, progress } from "/src/stores/feedback";
</script>

{#if $progress}
  <span class="progress" class:rendering={$rendering}>
    {$progress}% <span class="green-dot" />
  </span>
{/if}

<style lang="scss">
  @import "../../../../sass/variables";

  .progress {
    color: $color--prim-em;
    font-size: $font--small;
    display: flex;
    align-items: center;
    &.rendering .green-dot {
      animation: blink 480ms infinite;
    }
  }

  .green-dot {
    width: 8px;
    height: 8px;
    margin-left: 0.5rem;
    background-color: #76ff03;
    border-radius: 50%;
    opacity: 1;
    transition: opacity 240ms;
  }

  @keyframes blink {
    from {
      opacity: 0;
    }
  }
</style>

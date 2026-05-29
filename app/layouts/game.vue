<template>
  <div class="layout-game">
    <slot />
  </div>
</template>

<style scoped>
.layout-game {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: var(--color-bg-deep);
  color: var(--color-text-primary);
}
</style>

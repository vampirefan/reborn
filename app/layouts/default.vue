<template>
  <div class="layout-default">
    <slot />
  </div>
</template>

<style scoped>
.layout-default {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg-deep);
  color: var(--color-text-primary);
}
</style>

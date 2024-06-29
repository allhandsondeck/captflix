<template>
  <div class="show-item"></div>
</template>

<style scoped>
.show-item {
  width: 50px;
  height: 50px;
}

@media (min-width: 1024px) {
  .show-item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }
}
</style>

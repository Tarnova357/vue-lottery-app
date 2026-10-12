<template>
  <div class="auth-layout">
    <div class="auth-card">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f3f5;
  padding: 1.5rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
  padding: 2.25rem 2rem;
}
</style>

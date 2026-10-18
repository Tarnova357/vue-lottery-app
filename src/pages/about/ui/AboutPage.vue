<template>
  <div class="about-page">
    <h1>Про автора</h1>
    <div class="about-page__card">
      <p><strong>Виконавець:</strong> Тарнавський Сергій</p>
      <p>Лабораторна робота №6: Feature-Sliced Design, Pinia та PrimeVue.</p>
      <a href="https://github.com/tarnova357" target="_blank" rel="noopener noreferrer">
        GitHub Профіль автора
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about-page__card {
  background: var(--p-content-background, #ffffff);
  border: 1px solid var(--p-content-border-color, #e2e8f0);
  padding: 1.5rem;
  border-radius: var(--p-border-radius, 8px);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>

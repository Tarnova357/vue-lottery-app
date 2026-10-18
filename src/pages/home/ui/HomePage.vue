<template>
  <div class="home-page">
    <h1>Vue Lottery Application</h1>
    <p>Архітектура Feature-Sliced Design (FSD), Pinia та UI-бібліотека PrimeVue.</p>
    <div class="home-page__card">
      <h3>Стек та реалізовані концепції:</h3>
      <ul>
        <li><strong>FSD Layers:</strong> app, pages, widgets, features, entities, shared</li>
        <li><strong>State Management:</strong> Pinia stores (session, users, theme)</li>
        <li><strong>UI Kit:</strong> PrimeVue 4 Aura Theme + wrappers in <code>shared/ui</code></li>
        <li><strong>Forms:</strong> VeeValidate + Yup</li>
        <li><strong>Pattern:</strong> Repository з універсальним ServiceProvider</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__card {
    background: var(--p-content-background, #ffffff);
    border: 1px solid var(--p-content-border-color, #e2e8f0);
    padding: 1.5rem;
    border-radius: var(--p-border-radius, 8px);

    ul {
      margin-top: 1rem;
      padding-left: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}
</style>

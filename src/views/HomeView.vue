<template>
  <div class="lottery-card">
    <h1 class="h3 fw-bold text-dark mb-3">Vue Lottery Application</h1>
    <p class="text-secondary mb-4">
      Односторінковий веб-застосунок (SPA) для керування учасниками та користувачами із
      застосуванням бібліотеки vue-router, патерну Repository для взаємодії із зовнішнім REST API
      DummyJSON та авторизації JWT.
    </p>

    <div class="card mb-4 border">
      <div class="card-header fw-bold bg-light">Використаний технологічний стек:</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Vue 3 Composition API & TypeScript</li>
        <li class="list-group-item">Vue Router 4</li>
        <li class="list-group-item">Pinia State Management</li>
        <li class="list-group-item">VeeValidate & Yup для валідації форм</li>
        <li class="list-group-item">Repository Pattern</li>
        <li class="list-group-item">SCSS та Bootstrap 5</li>
      </ul>
    </div>

    <a
      href="https://github.com/Tarnova357/vue-lottery-app"
      target="_blank"
      rel="noopener noreferrer"
      class="btn btn-primary app-button"
    >
      Переглянути проєкт на GitHub
    </a>
  </div>
</template>

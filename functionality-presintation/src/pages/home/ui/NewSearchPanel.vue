<template>
  <section class="new-search-panel" aria-label="Новый поиск">
    <form class="new-search" role="search">
      <div class="new-search__control">
        <input
          id="inn-search"
          class="new-search__input"
          type="search"
          placeholder="Поиск по ИНН"
          autocomplete="off"
        />
        <button class="new-search__button" type="submit" aria-label="Искать">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
          >
            <path
              d="m20 20-4.2-4.2m2.2-5.3a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </form>
  </section>
</template>

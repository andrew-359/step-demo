<script setup lang="ts">
import {
  deleteSearchHistoryItem,
  demoProtocol,
} from '@/pages/home/model/demoProtocol'
</script>

<template>
  <section class="search-history" aria-labelledby="search-history-title">
    <header class="search-history__header">
      <div>
        <h1 id="search-history-title">История поисков</h1>
        <p>Последние запросы по компаниям и ИНН</p>
      </div>
      <span>{{ demoProtocol.searchHistory.length }} записей</span>
    </header>

    <div class="search-history__table-wrap">
      <table class="search-history-table">
        <thead>
          <tr>
            <th>Название компании</th>
            <th>ИНН компании</th>
            <th>Дата создания запроса</th>
            <th>Автор создания запроса</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in demoProtocol.searchHistory" :key="item.id">
            <td>{{ item.companyName }}</td>
            <td>{{ item.companyInn }}</td>
            <td>{{ item.createdAt }}</td>
            <td>{{ item.author }}</td>
            <td>
              <button
                class="search-history-table__delete"
                type="button"
                :aria-label="`Удалить запрос ${item.companyName}`"
                @click="deleteSearchHistoryItem(item.id)"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                >
                  <path
                    d="M9 4h6m-8 4h10m-9 0 .7 11h6.6L16 8M10 11v5m4-5v5"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

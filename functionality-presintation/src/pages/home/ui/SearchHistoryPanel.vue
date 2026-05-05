<script setup lang="ts">
import { ref } from 'vue'

interface SearchHistoryItem {
  id: number
  companyName: string
  companyInn: string
  createdAt: string
  author: string
}

const historyItems = ref<SearchHistoryItem[]>([
  {
    id: 1,
    companyName: 'Company Name',
    companyInn: '123456789012',
    createdAt: '12.01.2026 10:24',
    author: 'Иван Иванович',
  },
  {
    id: 2,
    companyName: 'Company Name',
    companyInn: '123456789012',
    createdAt: '18.01.2026 15:42',
    author: 'Петр Петрович',
  },
  {
    id: 3,
    companyName: 'Company Name',
    companyInn: '123456789012',
    createdAt: '27.01.2026 09:18',
    author: 'Сергей Сергеевич',
  },
  {
    id: 4,
    companyName: 'Company Name',
    companyInn: '123456789012',
    createdAt: '03.02.2026 12:06',
    author: 'Алексей Алексеевич',
  },
  {
    id: 5,
    companyName: 'Company Name',
    companyInn: '123456789012',
    createdAt: '11.02.2026 17:30',
    author: 'Дмитрий Дмитриевич',
  },
  {
    id: 6,
    companyName: 'Company Name',
    companyInn: '123456789012',
    createdAt: '24.02.2026 08:55',
    author: 'Николай Николаевич',
  },
  {
    id: 7,
    companyName: 'Company Name',
    companyInn: '123456789012',
    createdAt: '02.03.2026 14:11',
    author: 'Михаил Михайлович',
  },
  {
    id: 8,
    companyName: 'Company Name',
    companyInn: '123456789012',
    createdAt: '15.03.2026 11:47',
    author: 'Владимир Владимирович',
  },
  {
    id: 9,
    companyName: 'Company Name',
    companyInn: '123456789012',
    createdAt: '28.03.2026 16:03',
    author: 'Андрей Андреевич',
  },
  {
    id: 10,
    companyName: 'Company Name',
    companyInn: '123456789012',
    createdAt: '09.04.2026 13:29',
    author: 'Павел Павлович',
  },
])

function deleteHistoryItem(id: number) {
  historyItems.value = historyItems.value.filter((item) => item.id !== id)
}
</script>

<template>
  <section class="search-history" aria-labelledby="search-history-title">
    <header class="search-history__header">
      <div>
        <h1 id="search-history-title">История поисков</h1>
        <p>Последние запросы по компаниям и ИНН</p>
      </div>
      <span>{{ historyItems.length }} записей</span>
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
          <tr v-for="item in historyItems" :key="item.id">
            <td>{{ item.companyName }}</td>
            <td>{{ item.companyInn }}</td>
            <td>{{ item.createdAt }}</td>
            <td>{{ item.author }}</td>
            <td>
              <button
                class="search-history-table__delete"
                type="button"
                :aria-label="`Удалить запрос ${item.companyName}`"
                @click="deleteHistoryItem(item.id)"
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

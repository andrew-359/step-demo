<script setup lang="ts">
import {
  addMeetingCard,
  meetings,
  openMeeting,
} from '@/pages/control-panel/model/meetingsStore'

function formatCardDate(value: string | null) {
  if (!value) {
    return null
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(value))
}
</script>

<template>
  <section class="meetings-board" aria-labelledby="meetings-board-title">
    <header class="meetings-board__header">
      <h2 id="meetings-board-title" class="meetings-board__title">Встречи</h2>
      <button
        class="meetings-board__menu"
        type="button"
        aria-label="Меню списка встреч"
      >
        ···
      </button>
    </header>

    <div class="meetings-board__cards">
      <button
        v-for="meeting in meetings"
        :key="meeting.id"
        class="meetings-board__card"
        type="button"
        @click="openMeeting(meeting.id)"
      >
        <span v-if="meeting.labels.length" class="meetings-board__card-labels">
          <span
            v-for="label in meeting.labels"
            :key="label.id"
            class="meetings-board__card-label"
            :class="`meetings-board__card-label--${label.color}`"
            :title="label.name"
          />
        </span>
        <span class="meetings-board__card-title">{{ meeting.title }}</span>
        <span v-if="meeting.date" class="meetings-board__card-meta">
          {{ formatCardDate(meeting.date) }}
        </span>
      </button>
    </div>

    <footer class="meetings-board__footer">
      <button
        class="meetings-board__add"
        type="button"
        @click="addMeetingCard"
      >
        <span aria-hidden="true">+</span>
        Добавить карточку
      </button>
      <button
        class="meetings-board__template"
        type="button"
        aria-label="Создать из шаблона"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <rect
            x="4"
            y="5"
            width="14"
            height="14"
            rx="2"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M14 5v4h4M10 13h4M10 16h6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </footer>
  </section>
</template>

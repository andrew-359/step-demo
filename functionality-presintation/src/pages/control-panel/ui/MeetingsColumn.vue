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
      <h2 id="meetings-board-title" class="meetings-board__title">Задачи</h2>
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
        Добавить задачу
      </button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { GraphEntity } from '@/pages/control-panel/model/connections'
import { graphEntities } from '@/pages/control-panel/model/graphMockData'
import {
  activeMeetingId,
  addMeetingComment,
  availableMeetingLabels,
  closeMeeting,
  getMeetingById,
  setMeetingDate,
  toggleMeetingLabel,
  toggleMeetingParticipant,
} from '@/pages/control-panel/model/meetingsStore'

type PopoverKind = 'labels' | 'dates' | 'participants' | null

const openPopover = ref<PopoverKind>(null)
const commentDraft = ref('')
const dateDraft = ref('')

const meeting = computed(() => {
  if (!activeMeetingId.value) {
    return null
  }

  return getMeetingById(activeMeetingId.value)
})

const graphParticipants = computed(() => Object.values(graphEntities))

function togglePopover(kind: PopoverKind) {
  openPopover.value = openPopover.value === kind ? null : kind
}

function closePopovers() {
  openPopover.value = null
}

function onDateChange() {
  if (!meeting.value) {
    return
  }

  setMeetingDate(meeting.value.id, dateDraft.value || null)
  closePopovers()
}

function openDatePopover() {
  dateDraft.value = meeting.value?.date ?? ''
  togglePopover('dates')
}

function submitComment() {
  if (!meeting.value) {
    return
  }

  addMeetingComment(meeting.value.id, commentDraft.value)
  commentDraft.value = ''
}

function isParticipantSelected(entity: GraphEntity) {
  return meeting.value?.participants.some((item) => item.id === entity.id) ?? false
}

function formatDisplayDate(value: string | null) {
  if (!value) {
    return null
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="meeting"
      class="meeting-modal-backdrop"
      @click.self="closeMeeting"
    >
      <article class="meeting-modal" role="dialog" aria-modal="true">
        <header class="meeting-modal__topbar">
          <button class="meeting-modal__list" type="button">
            <span>Встречи</span>
            <span aria-hidden="true">▾</span>
          </button>

          <div class="meeting-modal__topbar-actions">
            <button class="meeting-modal__icon-btn" type="button" aria-label="Обложка">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <rect
                  x="4"
                  y="5"
                  width="14"
                  height="12"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                />
                <path
                  d="M8 14l2-2 2 2 3-3 2 2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button class="meeting-modal__icon-btn" type="button" aria-label="Действия">
              ···
            </button>
            <button
              class="meeting-modal__icon-btn"
              type="button"
              aria-label="Закрыть"
              @click="closeMeeting"
            >
              ×
            </button>
          </div>
        </header>

        <div class="meeting-modal__body">
          <div class="meeting-modal__main">
            <div class="meeting-modal__title-row">
              <span class="meeting-modal__status" aria-hidden="true" />
              <h1 class="meeting-modal__title">{{ meeting.title }}</h1>
            </div>

            <div class="meeting-modal__toolbar">
              <button class="meeting-modal__pill" type="button">
                <span aria-hidden="true">+</span>
                Добавить
              </button>

              <div class="meeting-modal__pill-wrap">
                <button
                  class="meeting-modal__pill"
                  type="button"
                  @click="togglePopover('labels')"
                >
                  <span aria-hidden="true">▤</span>
                  Метки
                </button>

                <div
                  v-if="openPopover === 'labels'"
                  class="meeting-popover"
                >
                  <p class="meeting-popover__title">Метки</p>
                  <div class="meeting-popover__labels">
                    <button
                      v-for="label in availableMeetingLabels"
                      :key="label.id"
                      class="meeting-popover__label"
                      :class="`meeting-popover__label--${label.color}`"
                      type="button"
                      @click="toggleMeetingLabel(meeting.id, label)"
                    >
                      {{ label.name }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="meeting-modal__pill-wrap">
                <button
                  class="meeting-modal__pill"
                  type="button"
                  @click="openDatePopover"
                >
                  <span aria-hidden="true">🕒</span>
                  Даты
                </button>

                <div
                  v-if="openPopover === 'dates'"
                  class="meeting-popover"
                >
                  <p class="meeting-popover__title">Даты</p>
                  <input
                    v-model="dateDraft"
                    class="meeting-popover__date"
                    type="date"
                  />
                  <div class="meeting-popover__actions">
                    <button
                      class="meeting-popover__save"
                      type="button"
                      @click="onDateChange"
                    >
                      Сохранить
                    </button>
                    <button
                      class="meeting-popover__ghost"
                      type="button"
                      @click="
                        dateDraft = '';
                        onDateChange();
                      "
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>

              <div class="meeting-modal__pill-wrap">
                <button
                  class="meeting-modal__pill"
                  type="button"
                  @click="togglePopover('participants')"
                >
                  <span aria-hidden="true">👤</span>
                  Участники
                </button>

                <div
                  v-if="openPopover === 'participants'"
                  class="meeting-popover meeting-popover--wide"
                >
                  <p class="meeting-popover__title">Участники из графа</p>
                  <div class="meeting-popover__participants">
                    <button
                      v-for="entity in graphParticipants"
                      :key="entity.id"
                      class="meeting-popover__participant"
                      :class="{
                        'meeting-popover__participant--active': isParticipantSelected(entity),
                      }"
                      type="button"
                      @click="toggleMeetingParticipant(meeting.id, entity)"
                    >
                      <strong>{{ entity.title }}</strong>
                      <span>{{ entity.subtitle }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="meeting.labels.length || meeting.date || meeting.participants.length"
              class="meeting-modal__summary"
            >
              <div v-if="meeting.labels.length" class="meeting-modal__summary-block">
                <span class="meeting-modal__summary-label">Метки</span>
                <div class="meeting-modal__summary-labels">
                  <span
                    v-for="label in meeting.labels"
                    :key="label.id"
                    class="meeting-modal__label-chip"
                    :class="`meeting-modal__label-chip--${label.color}`"
                  >
                    {{ label.name }}
                  </span>
                </div>
              </div>

              <div v-if="meeting.date" class="meeting-modal__summary-block">
                <span class="meeting-modal__summary-label">Дата</span>
                <span>{{ formatDisplayDate(meeting.date) }}</span>
              </div>

              <div v-if="meeting.participants.length" class="meeting-modal__summary-block">
                <span class="meeting-modal__summary-label">Участники</span>
                <div class="meeting-modal__avatars">
                  <span
                    v-for="participant in meeting.participants"
                    :key="participant.id"
                    class="meeting-modal__avatar"
                    :title="participant.title"
                  >
                    {{ participant.title.slice(0, 1) }}
                  </span>
                </div>
              </div>
            </div>

            <section class="meeting-modal__description">
              <header>
                <span aria-hidden="true">☰</span>
                <h2>Описание</h2>
              </header>
              <textarea
                v-model="meeting.description"
                class="meeting-modal__textarea"
                placeholder="Добавить более подробное описание..."
                rows="6"
              />
            </section>
          </div>

          <aside class="meeting-modal__sidebar">
            <header class="meeting-modal__sidebar-header">
              <div>
                <span aria-hidden="true">💬</span>
                <h2>Комментарии и события</h2>
              </div>
              <button class="meeting-modal__details" type="button">
                Показать подробности
              </button>
            </header>

            <div class="meeting-modal__comment-box">
              <textarea
                v-model="commentDraft"
                class="meeting-modal__comment-input"
                placeholder="Напишите комментарий..."
                rows="2"
                @keydown.enter.exact.prevent="submitComment"
              />
            </div>

            <div class="meeting-modal__activity">
              <article
                v-for="item in meeting.activity"
                :key="item.id"
                class="meeting-modal__activity-item"
              >
                <span class="meeting-modal__activity-avatar">K</span>
                <div>
                  <p>
                    <strong>{{ item.author }}</strong>
                    <span v-html="` ${item.text}`" />
                  </p>
                  <time>{{ item.createdAt }}</time>
                </div>
              </article>

              <article
                v-for="comment in meeting.comments"
                :key="comment.id"
                class="meeting-modal__activity-item"
              >
                <span class="meeting-modal__activity-avatar">K</span>
                <div>
                  <p>
                    <strong>{{ comment.author }}</strong>
                    {{ comment.text }}
                  </p>
                  <time>{{ comment.createdAt }}</time>
                </div>
              </article>
            </div>
          </aside>
        </div>
      </article>
    </div>
  </Teleport>
</template>

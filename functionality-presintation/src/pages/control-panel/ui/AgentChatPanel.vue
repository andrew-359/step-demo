<script setup lang="ts">
import { ref } from 'vue'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  id: number
  role: ChatRole
  text: string
}

const messages = ref<ChatMessage[]>([
  {
    id: 1,
    role: 'assistant',
    text: 'Здравствуйте. Я помогу заполнить карточки, проверить связи или запланировать встречу. Опишите задачу или прикрепите файл.',
  },
])

const draft = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const isRecording = ref(false)
let messageId = 2

function sendMessage() {
  const text = draft.value.trim()

  if (!text) {
    return
  }

  messages.value.push({
    id: messageId++,
    role: 'user',
    text,
  })

  draft.value = ''

  window.setTimeout(() => {
    messages.value.push({
      id: messageId++,
      role: 'assistant',
      text: 'Принято. Данные будут учтены при сохранении карточек.',
    })
  }, 500)
}

function openFilePicker() {
  fileInputRef.value?.click()
}

function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const fileName = input.files?.[0]?.name

  if (!fileName) {
    return
  }

  messages.value.push({
    id: messageId++,
    role: 'user',
    text: `Прикреплён файл: ${fileName}`,
  })

  input.value = ''
}

function toggleRecording() {
  isRecording.value = !isRecording.value

  if (isRecording.value) {
    messages.value.push({
      id: messageId++,
      role: 'user',
      text: '● Запись голосового сообщения...',
    })
    return
  }

  messages.value.push({
    id: messageId++,
    role: 'user',
    text: 'Голосовое сообщение отправлено',
  })
}
</script>

<template>
  <aside class="agent-chat" aria-label="Чат агента">
    <header class="agent-chat__header">
      <div class="agent-chat__title-wrap">
        <span class="agent-chat__badge" aria-hidden="true">AI</span>
        <div>
          <p class="agent-chat__title">Агент-ассистент</p>
        </div>
      </div>
    </header>

    <div class="agent-chat__messages" role="log" aria-live="polite">
      <article
        v-for="message in messages"
        :key="message.id"
        class="agent-chat__message"
        :class="`agent-chat__message--${message.role}`"
      >
        <p>{{ message.text }}</p>
      </article>
    </div>

    <footer class="agent-chat__composer">
      <input
        ref="fileInputRef"
        class="agent-chat__file-input"
        type="file"
        hidden
        @change="onFilesSelected"
      />

      <div class="agent-chat__input-wrap">
        <button
          class="agent-chat__icon-btn"
          type="button"
          aria-label="Прикрепить файл"
          title="Прикрепить файл"
          @click="openFilePicker"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M14 4h-1.2a4.8 4.8 0 0 0-4.8 4.8V18a2.2 2.2 0 1 0 4.4 0V8.6a1.4 1.4 0 1 0-2.8 0v9.2a3.6 3.6 0 1 1-7.2 0V8.8a6 6 0 1 1 12 0V18a5.2 5.2 0 1 1-10.4 0V8.6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <textarea
          v-model="draft"
          class="agent-chat__textarea"
          rows="1"
          placeholder="Спросите агента или опишите изменения..."
          @keydown.enter.exact.prevent="sendMessage"
        />

        <button
          class="agent-chat__icon-btn"
          :class="{ 'agent-chat__icon-btn--active': isRecording }"
          type="button"
          :aria-label="isRecording ? 'Остановить запись' : 'Записать голосом'"
          :title="isRecording ? 'Остановить запись' : 'Записать голосом'"
          @click="toggleRecording"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M12 14.2a3.2 3.2 0 0 0 3.2-3.2V7.4a3.2 3.2 0 1 0-6.4 0v3.6a3.2 3.2 0 0 0 3.2 3.2Z"
              fill="currentColor"
            />
            <path
              d="M6.8 11.4a5.2 5.2 0 0 0 10.4 0M12 16.6v3.2M9.2 19.8h5.6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <button
          class="agent-chat__send"
          type="button"
          aria-label="Отправить сообщение"
          :disabled="!draft.trim()"
          @click="sendMessage"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="m5 12 14-7-4 7 4 7-14-7Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </footer>
  </aside>
</template>

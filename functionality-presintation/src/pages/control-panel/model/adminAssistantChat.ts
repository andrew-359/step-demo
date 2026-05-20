import { ref } from 'vue'

export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: number
  role: ChatRole
  text: string
  actionLabel?: string
}

export const assistantMessages = ref<ChatMessage[]>([
  {
    id: 1,
    role: 'assistant',
    text: 'Здравствуйте. Я помогу подготовить контакт, найти нужных людей или собрать следующий шаг. Выберите пример ниже.',
  },
])

let messageId = 2

export function pushAssistantChatMessage(
  role: ChatRole,
  text: string,
  actionLabel?: string,
) {
  assistantMessages.value.push({
    id: messageId++,
    role,
    text,
    actionLabel,
  })
}

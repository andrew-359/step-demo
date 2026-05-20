import { reactive } from 'vue'

import { pushAssistantChatMessage } from '@/pages/control-panel/model/adminAssistantChat'

export type ControlFormKind = 'person' | 'company' | 'project'

export type ConfigFieldChip = {
  label: string
  locked?: boolean
  generated?: boolean
}

const expectedTags: Record<ControlFormKind, ConfigFieldChip[]> = {
  person: [
    { label: 'Источник' },
    { label: 'Роль' },
    { label: 'Контакт' },
    { label: 'Что проверить' },
  ],
  company: [
    { label: 'Роль компании' },
    { label: 'Контур' },
    { label: 'Риски' },
    { label: 'Кого искать' },
  ],
  project: [
    { label: 'Объект' },
    { label: 'Локация' },
    { label: 'Цель' },
    { label: 'Следующий шаг' },
  ],
}

const generatedConfigFields = reactive<Record<ControlFormKind, ConfigFieldChip[]>>({
  person: [],
  company: [],
  project: [],
})

const formKindTitles: Record<ControlFormKind, string> = {
  person: 'человека',
  company: 'компании',
  project: 'проекта',
}

const generatedByKind: Record<ControlFormKind, ConfigFieldChip[]> = {
  person: [
    { label: 'Источник: Сергей', generated: true },
    { label: 'Роль: закупки', generated: true },
    { label: 'Контакт: теплый', generated: true },
    { label: 'Проверить: актуальность связи', generated: true },
    { label: 'Проект: цех сварки', generated: true },
  ],
  company: [
    { label: 'Роль: заказчик', generated: true },
    { label: 'Контур: закупки', generated: true },
    { label: 'Проверить: статус', generated: true },
    { label: 'Влияет на: выбор подрядчика', generated: true },
  ],
  project: [
    { label: 'Объект: цех сварки', generated: true },
    { label: 'Локация: Шушары', generated: true },
    { label: 'Цель: найти вход', generated: true },
    { label: 'Следующий шаг: звонок', generated: true },
  ],
}

const demoDescriptions: Record<ControlFormKind, string> = {
  person:
    'Сергей сказал, что Дмитрий из закупок Company Name может подсказать, кто сейчас ведет проект цеха сварки. Контакт теплый, но нужно проверить актуальность связи.',
  company:
    'Company Name — заказчик проекта цеха сварки. Нужно проверить текущий статус, закупочный контур и людей, которые влияют на выбор подрядчика.',
  project:
    'Строительство цеха сварки в Шушарах. Нужно найти людей со стороны заказчика, проверить закупки и подготовить первый звонок.',
}

const fullCardNotes: Record<ControlFormKind, string> = {
  person: 'В полной карточке также есть: история контактов, источники, проверки.',
  company: 'В полной карточке также есть: руководители, учредители, риски, источники.',
  project: 'В полной карточке также есть: лоты, участники, объекты, история решений.',
}

export function hasGeneratedTags(kind: ControlFormKind) {
  return generatedConfigFields[kind].length > 0
}

export function getConfigFields(kind: ControlFormKind) {
  return hasGeneratedTags(kind) ? generatedConfigFields[kind] : expectedTags[kind]
}

export function getFullCardNote(kind: ControlFormKind) {
  return fullCardNotes[kind]
}

export function generateFieldsFromDescription(
  kind: ControlFormKind,
  description: string,
) {
  const text = description.trim() || demoDescriptions[kind]

  pushAssistantChatMessage(
    'user',
    `Разложи описание карточки ${formKindTitles[kind]} на теги: ${text}`,
  )

  generatedConfigFields[kind] = generatedByKind[kind]

  window.setTimeout(() => {
    pushAssistantChatMessage(
      'assistant',
      `Понял описание карточки ${formKindTitles[kind]}. Выделил факты, которые лучше хранить отдельно от свободного текста.`,
      `description.extract_tags(${kind})`,
    )
  }, 450)
}

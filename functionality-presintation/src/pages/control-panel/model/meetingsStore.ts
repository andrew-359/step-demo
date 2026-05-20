import { reactive, ref } from 'vue'

import type { GraphEntity } from '@/pages/control-panel/model/connections'

export type MeetingLabelColor =
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'purple'
  | 'blue'
  | 'sky'
  | 'lime'

export interface MeetingLabel {
  id: string
  name: string
  color: MeetingLabelColor
}

export interface MeetingComment {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface MeetingActivity {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface Meeting {
  id: string
  title: string
  description: string
  labels: MeetingLabel[]
  date: string | null
  participants: GraphEntity[]
  comments: MeetingComment[]
  activity: MeetingActivity[]
  createdAt: string
}

export const availableMeetingLabels: MeetingLabel[] = [
  { id: 'label-urgent', name: 'Срочно', color: 'red' },
  { id: 'label-prep', name: 'Подготовка', color: 'orange' },
  { id: 'label-client', name: 'Клиент', color: 'blue' },
  { id: 'label-internal', name: 'Внутренняя', color: 'green' },
  { id: 'label-review', name: 'Согласование', color: 'purple' },
  { id: 'label-follow', name: 'Follow-up', color: 'sky' },
]

function createMeetingId() {
  return `meeting-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function formatActivityDate(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function createActivity(text: string): MeetingActivity {
  return {
    id: createMeetingId(),
    author: 'Менеджер',
    text,
    createdAt: formatActivityDate(new Date()),
  }
}

const initialMeetings: Meeting[] = [
  {
    id: 'meeting-1',
    title: 'Проверить, кто сейчас отвечает за закупки',
    description: 'Уточнить актуального человека в закупочном контуре Company Name перед запросом интро.',
    labels: [{ ...availableMeetingLabels.find((label) => label.id === 'label-prep')! }],
    date: null,
    participants: [],
    comments: [],
    activity: [
      createActivity('добавил(а) задачу в подготовку проекта'),
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'meeting-2',
    title: 'Спросить Сергея про актуальность связи',
    description: 'Проверить, может ли Сергей сейчас помочь выйти на Петра Петровича.',
    labels: [{ ...availableMeetingLabels.find((label) => label.id === 'label-follow')! }],
    date: null,
    participants: [],
    comments: [],
    activity: [
      createActivity('добавил(а) задачу в подготовку проекта'),
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'meeting-3',
    title: 'Подготовить короткий бриф по проекту',
    description: 'Собрать в один экран объект, цель контакта, риски и следующий шаг для разговора.',
    labels: [{ ...availableMeetingLabels.find((label) => label.id === 'label-client')! }],
    date: null,
    participants: [],
    comments: [],
    activity: [
      createActivity('добавил(а) задачу в подготовку проекта'),
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'meeting-4',
    title: 'Обновить граф после разговора',
    description: 'После контакта зафиксировать, кто подтвердил связь и что изменилось в стратегии входа.',
    labels: [{ ...availableMeetingLabels.find((label) => label.id === 'label-review')! }],
    date: null,
    participants: [],
    comments: [],
    activity: [
      createActivity('добавил(а) задачу в подготовку проекта'),
    ],
    createdAt: new Date().toISOString(),
  },
]

export const meetings = reactive<Meeting[]>([...initialMeetings])
export const activeMeetingId = ref<string | null>(null)
export const approvedMeetingDraftIds = reactive<Record<string, boolean>>({})

export function getMeetingById(id: string) {
  return meetings.find((meeting) => meeting.id === id) ?? null
}

export function addMeetingCard() {
  const nextIndex = meetings.length + 1
  const meeting: Meeting = {
    id: createMeetingId(),
    title: `Новая задача ${nextIndex}`,
    description: '',
    labels: [],
    date: null,
    participants: [],
    comments: [],
    activity: [
      createActivity('добавил(а) эту карточку в список <strong>backlog</strong>'),
    ],
    createdAt: new Date().toISOString(),
  }

  meetings.push(meeting)
  activeMeetingId.value = meeting.id
  return meeting
}

export function createIntroMeetingDraft(participants: GraphEntity[]) {
  const existing = meetings.find((meeting) => meeting.id === 'meeting-intro-petr')

  if (existing) {
    activeMeetingId.value = existing.id
    return existing
  }

  const meeting: Meeting = {
    id: 'meeting-intro-petr',
    title: 'Попросить Сергея помочь выйти на Петра',
    description:
      'Помощник понял фразу: «договорись с Сергеем на пятницу и позови Петра». Нужно коротко обсудить, может ли Сергей познакомить команду с Петром по проекту «Строительство цеха сварки».',
    labels: [
      { ...availableMeetingLabels.find((label) => label.id === 'label-prep')! },
      { ...availableMeetingLabels.find((label) => label.id === 'label-follow')! },
    ],
    date: '2026-05-22',
    participants: participants.map((participant) => ({
      id: participant.id,
      kind: participant.kind,
      title: participant.title,
      subtitle: participant.subtitle,
      meta: participant.meta.map((row) => ({ ...row })),
    })),
    comments: [
      {
        id: createMeetingId(),
        author: 'Помощник',
        text: 'Звонок подготовлен: дата и участники распознаны из обычной фразы. Проверьте детали перед подтверждением.',
        createdAt: formatActivityDate(new Date()),
      },
    ],
    activity: [
      {
        id: createMeetingId(),
        author: 'Помощник',
        text: 'подготовил(а) звонок и добавил(а) участников из графа',
        createdAt: formatActivityDate(new Date()),
      },
    ],
    createdAt: new Date().toISOString(),
  }

  meetings.unshift(meeting)
  activeMeetingId.value = meeting.id
  return meeting
}

export function approveMeetingDraft(meetingId: string) {
  const meeting = getMeetingById(meetingId)

  if (!meeting || approvedMeetingDraftIds[meetingId]) {
    return
  }

  approvedMeetingDraftIds[meetingId] = true
  meeting.activity.unshift(
    createActivity('проверил(а) звонок и взял(а) следующий шаг в работу'),
  )
}

export function openMeeting(id: string) {
  activeMeetingId.value = id
}

export function closeMeeting() {
  activeMeetingId.value = null
}

export function addMeetingComment(meetingId: string, text: string) {
  const meeting = getMeetingById(meetingId)

  if (!meeting || !text.trim()) {
    return
  }

  meeting.comments.push({
    id: createMeetingId(),
    author: 'Менеджер',
    text: text.trim(),
    createdAt: formatActivityDate(new Date()),
  })

  meeting.activity.unshift(
    createActivity(`оставил(а) комментарий: «${text.trim()}»`),
  )
}

export function toggleMeetingLabel(meetingId: string, label: MeetingLabel) {
  const meeting = getMeetingById(meetingId)

  if (!meeting) {
    return
  }

  const index = meeting.labels.findIndex((item) => item.id === label.id)

  if (index >= 0) {
    meeting.labels.splice(index, 1)
    meeting.activity.unshift(createActivity(`снял(а) метку <strong>${label.name}</strong>`))
    return
  }

  meeting.labels.push({ ...label })
  meeting.activity.unshift(createActivity(`добавил(а) метку <strong>${label.name}</strong>`))
}

export function setMeetingDate(meetingId: string, date: string | null) {
  const meeting = getMeetingById(meetingId)

  if (!meeting) {
    return
  }

  meeting.date = date

  if (date) {
    const formatted = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date))

    meeting.activity.unshift(createActivity(`установил(а) дату: <strong>${formatted}</strong>`))
    return
  }

  meeting.activity.unshift(createActivity('удалил(а) дату встречи'))
}

export function toggleMeetingParticipant(meetingId: string, entity: GraphEntity) {
  const meeting = getMeetingById(meetingId)

  if (!meeting) {
    return
  }

  const index = meeting.participants.findIndex((item) => item.id === entity.id)

  if (index >= 0) {
    meeting.participants.splice(index, 1)
    meeting.activity.unshift(
      createActivity(`убрал(а) участника <strong>${entity.title}</strong>`),
    )
    return
  }

  meeting.participants.push({
    id: entity.id,
    kind: entity.kind,
    title: entity.title,
    subtitle: entity.subtitle,
    meta: entity.meta.map((row) => ({ ...row })),
  })

  meeting.activity.unshift(
    createActivity(`добавил(а) участника <strong>${entity.title}</strong>`),
  )
}

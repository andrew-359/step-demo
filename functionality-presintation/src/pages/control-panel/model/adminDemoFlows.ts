import { ref } from 'vue'

import { setActiveControlForm } from '@/pages/control-panel/model/activeControlForm'
import { personCardForm } from '@/pages/control-panel/model/controlPanelForms'
import { createConnectionId, type GraphEntity } from '@/pages/control-panel/model/connections'
import { graphEntities } from '@/pages/control-panel/model/graphMockData'
import { createIntroMeetingDraft } from '@/pages/control-panel/model/meetingsStore'

export type AdminDemoFlowId = 'data-entry-point' | 'communication-intro-call'

export type AdminDemoFlow = {
  id: AdminDemoFlowId
  title: string
  command: string
}

type FlowStep = {
  message: string
  actionLabel?: string
  delayMs?: number
  action?: () => void
}

export const adminDemoFlows: AdminDemoFlow[] = [
  {
    id: 'data-entry-point',
    title: 'Подготовить новый контакт',
    command: 'делай: добавь Дмитрия из закупок',
  },
  {
    id: 'communication-intro-call',
    title: 'Подготовить звонок',
    command: 'делай: договорись с Сергеем на пятницу и позови Петра',
  },
]

export const activeAdminDemoFlowId = ref<AdminDemoFlowId | null>(null)

let currentRunId = 0

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function copyGraphEntity(entityId: string) {
  const entity = graphEntities[entityId]

  if (!entity) {
    return null
  }

  return {
    id: entity.id,
    kind: entity.kind,
    title: entity.title,
    subtitle: entity.subtitle,
    meta: entity.meta.map((row) => ({ ...row })),
  }
}

function prefillEntryPointPersonForm() {
  setActiveControlForm('person')

  const company = copyGraphEntity('company-main')
  const project = copyGraphEntity('project-weld')
  const sourcePerson = copyGraphEntity('person-sergey')

  personCardForm.fullName = 'Дмитрий Дмитриевич'
  personCardForm.inn = ''
  personCardForm.phone = '+7 (921) 555-14-72'
  personCardForm.email = 'd.dmitrievich@example.ru'
  personCardForm.description =
    'Сергей сказал, что Дмитрий из закупок Company Name может подсказать, кто сейчас ведет проект цеха сварки. Контакт теплый, но нужно проверить актуальность связи.'
  personCardForm.connections = [
    ...(company
      ? [
          {
            id: createConnectionId(),
            relationType: 'Компания' as const,
            target: company,
          },
        ]
      : []),
    ...(project
      ? [
          {
            id: createConnectionId(),
            relationType: 'Проект' as const,
            target: project,
          },
        ]
      : []),
    ...(sourcePerson
      ? [
          {
            id: createConnectionId(),
            relationType: 'Человек' as const,
            target: sourcePerson,
          },
        ]
      : []),
  ]
  personCardForm.editingEntityId = null
}

function createIntroCallDraft() {
  const participants = [
    copyGraphEntity('person-sergey'),
    copyGraphEntity('person-petr'),
    copyGraphEntity('person-team'),
    copyGraphEntity('project-weld'),
  ].filter((entity): entity is GraphEntity => Boolean(entity))

  createIntroMeetingDraft(participants)
}

const flowSteps: Record<AdminDemoFlowId, FlowStep[]> = {
  'data-entry-point': [
    {
      message:
        'Понял. Подготовлю новый контакт и покажу, что нужно проверить перед сохранением.',
      actionLabel: 'intent.parse(add_contact)',
    },
    {
      message:
        'Заполняю карточку Дмитрия: имя, телефон, почту, источник и короткое пояснение.',
      actionLabel: 'form.prefill(Person)',
      action: prefillEntryPointPersonForm,
    },
    {
      message:
        'Добавил связи: компания, проект цеха сварки и Сергей как человек, который дал контекст.',
      actionLabel: 'relationship.suggest(company, project, source)',
    },
    {
      message:
        'Проверьте карточку и нажмите «Применить». После этого контакт появится в графе, а связи сохранятся вместе с ним.',
      actionLabel: 'human.commit(required)',
    },
  ],
  'communication-intro-call': [
    {
      message:
        'Понял. Вы написали обычной фразой: договориться с Сергеем на пятницу и позвать Петра. Разложу это в форму.',
      actionLabel: 'intent.parse(schedule_call)',
    },
    {
      message:
        'Проверяю людей в графе: Сергей может помочь с выходом на Петра по проекту цеха сварки.',
      actionLabel: 'graph.resolve_path(sergey, petr)',
    },
    {
      message:
        'Готовлю следующий шаг: создаю звонок, ставлю дату, добавляю участников и короткий контекст.',
      actionLabel: 'meeting.prefill(date, participants, context)',
      action: createIntroCallDraft,
    },
    {
      message:
        'Звонок подготовлен. Проверьте детали и нажмите «Всё верно, взять в работу», если можно двигаться дальше.',
      actionLabel: 'human.approve_action(required)',
    },
  ],
}

export async function runAdminDemoFlow(
  flowId: AdminDemoFlowId,
  onMessage: (message: string, actionLabel?: string) => void,
) {
  const runId = Date.now()
  currentRunId = runId
  activeAdminDemoFlowId.value = flowId

  for (const step of flowSteps[flowId]) {
    await wait(step.delayMs ?? 650)

    if (currentRunId !== runId) {
      return
    }

    step.action?.()
    onMessage(step.message, step.actionLabel)
  }

  if (currentRunId === runId) {
    activeAdminDemoFlowId.value = null
  }
}

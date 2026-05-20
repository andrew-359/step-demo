import { ref } from 'vue'

import {
  companyCardForm,
  personCardForm,
  projectCardForm,
  resetCompanyCardForm,
  resetPersonCardForm,
  resetProjectCardForm,
} from '@/pages/control-panel/model/controlPanelForms'
import {
  createGraphEntityId,
  ENTITY_DESCRIPTION_LABEL,
  type ConnectionLink,
  type ConnectionOption,
  type EntityMetaRow,
  type GraphCategoryId,
  type GraphEntity,
} from '@/pages/control-panel/model/connections'
import {
  graphCategories,
  graphEdges,
  graphEntities,
} from '@/pages/control-panel/model/graphMockData'

export const graphCardSyncNotice = ref<string | null>(null)

let noticeTimer: ReturnType<typeof setTimeout> | null = null

function hasFilledValue(value: string | number | '' | null | undefined) {
  if (value === '' || value === null || value === undefined) {
    return false
  }

  if (typeof value === 'number' && Number.isNaN(value)) {
    return false
  }

  return String(value).trim() !== ''
}

function hasFilledText(value: string) {
  return value.trim() !== ''
}

function appendDescriptionMeta(meta: EntityMetaRow[], description: string) {
  if (hasFilledText(description)) {
    meta.push({ label: ENTITY_DESCRIPTION_LABEL, value: description.trim() })
  }
}

function getMetaValue(entity: GraphEntity, label: string) {
  return entity.meta.find((row) => row.label === label)?.value ?? ''
}

function relationTypeForEntity(entity: GraphEntity): ConnectionOption {
  const relationByKind: Record<GraphEntity['kind'], ConnectionOption> = {
    person: 'Человек',
    company: 'Компания',
    project: 'Проект',
  }

  return relationByKind[entity.kind]
}

function buildConnectionsForEntity(entityId: string): ConnectionLink[] {
  return graphEdges
    .filter((edge) => edge.sourceId === entityId || edge.targetId === entityId)
    .map((edge) => {
      const targetId = edge.sourceId === entityId ? edge.targetId : edge.sourceId
      const target = graphEntities[targetId]

      if (!target) {
        return null
      }

      return {
        id: `link-${edge.id}`,
        relationType: relationTypeForEntity(target),
        target,
      }
    })
    .filter((link): link is ConnectionLink => Boolean(link))
}

function mergeMeta(existing: EntityMetaRow[], incoming: EntityMetaRow[]) {
  const rows = new Map(existing.map((row) => [row.label, row.value]))

  for (const row of incoming) {
    if (hasFilledText(row.value)) {
      rows.set(row.label, row.value.trim())
    }
  }

  return Array.from(rows, ([label, value]) => ({ label, value }))
}

function mergeGraphEntity(existing: GraphEntity, incoming: GraphEntity): GraphEntity {
  return {
    ...existing,
    title: hasFilledText(incoming.title) ? incoming.title.trim() : existing.title,
    subtitle: hasFilledText(incoming.subtitle)
      ? incoming.subtitle.trim()
      : existing.subtitle,
    meta: mergeMeta(existing.meta, incoming.meta),
  }
}

function ensureEntityInCategory(categoryId: GraphCategoryId, entityId: string) {
  const category = graphCategories.find((item) => item.id === categoryId)

  if (category && !category.entityIds.includes(entityId)) {
    category.entityIds.push(entityId)
  }
}

function patchConnectionTargets(entityId: string, entity: GraphEntity) {
  const patchLinks = (links: ConnectionLink[]) => {
    links.forEach((link) => {
      if (link.target.id === entityId) {
        link.target = {
          id: entity.id,
          kind: entity.kind,
          title: entity.title,
          subtitle: entity.subtitle,
          meta: entity.meta.map((row) => ({ ...row })),
        }
      }
    })
  }

  patchLinks(personCardForm.connections)
  patchLinks(companyCardForm.connections)
}

function showSyncNotice(message: string) {
  graphCardSyncNotice.value = message

  if (noticeTimer) {
    clearTimeout(noticeTimer)
  }

  noticeTimer = setTimeout(() => {
    graphCardSyncNotice.value = null
    noticeTimer = null
  }, 3200)
}

function saveEntity(
  categoryId: GraphCategoryId,
  incoming: GraphEntity,
  editingEntityId: string | null,
) {
  if (editingEntityId && graphEntities[editingEntityId]) {
    const entityId = editingEntityId
    graphEntities[entityId] = mergeGraphEntity(graphEntities[entityId], {
      ...incoming,
      id: entityId,
    })
    ensureEntityInCategory(categoryId, entityId)
    patchConnectionTargets(entityId, graphEntities[entityId])
    showSyncNotice(`Карточка «${graphEntities[entityId].title}» обновлена в графе`)
    return graphEntities[entityId]
  }

  const entityId = createGraphEntityId(incoming.kind)
  graphEntities[entityId] = { ...incoming, id: entityId }
  ensureEntityInCategory(categoryId, entityId)
  showSyncNotice(`Карточка «${graphEntities[entityId].title}» добавлена в граф`)
  return graphEntities[entityId]
}

function syncConnectionEdges(entity: GraphEntity, connections: ConnectionLink[]) {
  for (const link of connections) {
    const exists = graphEdges.some(
      (edge) =>
        edge.sourceId === entity.id &&
        edge.targetId === link.target.id &&
        edge.label === link.relationType,
    )

    if (!exists) {
      graphEdges.push({
        id: `edge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sourceId: entity.id,
        targetId: link.target.id,
        label: link.relationType,
      })
    }
  }
}

function buildPersonEntityFromForm(): GraphEntity {
  const meta: EntityMetaRow[] = []

  if (hasFilledValue(personCardForm.inn)) {
    meta.push({ label: 'ИНН', value: String(personCardForm.inn) })
  }

  if (hasFilledValue(personCardForm.phone)) {
    meta.push({ label: 'Телефон', value: String(personCardForm.phone) })
  }

  if (hasFilledValue(personCardForm.email)) {
    meta.push({ label: 'Почта', value: personCardForm.email.trim() })
  }

  appendDescriptionMeta(meta, personCardForm.description)

  const title = hasFilledText(personCardForm.fullName)
    ? personCardForm.fullName.trim()
    : 'Новый человек'

  const subtitleParts: string[] = []

  if (hasFilledValue(personCardForm.inn)) {
    subtitleParts.push(`ИНН ${personCardForm.inn}`)
  }

  if (hasFilledText(personCardForm.email)) {
    subtitleParts.push(personCardForm.email.trim())
  }

  return {
    id: '',
    kind: 'person',
    title,
    subtitle: subtitleParts.join(' · ') || 'Карточка из панели управления',
    meta,
  }
}

function buildCompanyEntityFromForm(): GraphEntity {
  const meta: EntityMetaRow[] = []

  if (hasFilledValue(companyCardForm.inn)) {
    meta.push({ label: 'ИНН', value: String(companyCardForm.inn) })
  }

  if (hasFilledText(companyCardForm.address)) {
    meta.push({ label: 'Адрес', value: companyCardForm.address.trim() })
  }

  appendDescriptionMeta(meta, companyCardForm.description)

  const title = hasFilledText(companyCardForm.name)
    ? companyCardForm.name.trim()
    : 'Новая компания'

  const subtitle = hasFilledText(companyCardForm.address)
    ? companyCardForm.address.trim()
    : hasFilledValue(companyCardForm.inn)
      ? `ИНН ${companyCardForm.inn}`
      : 'Карточка из панели управления'

  return {
    id: '',
    kind: 'company',
    title,
    subtitle,
    meta,
  }
}

function buildProjectEntityFromForm(): GraphEntity {
  const meta: EntityMetaRow[] = []

  if (hasFilledText(projectCardForm.curator)) {
    meta.push({ label: 'Куратор проекта', value: projectCardForm.curator.trim() })
  }

  appendDescriptionMeta(meta, projectCardForm.description)

  const title = hasFilledText(projectCardForm.name)
    ? projectCardForm.name.trim()
    : 'Новый проект'

  const subtitle = hasFilledText(projectCardForm.curator)
    ? `Куратор: ${projectCardForm.curator.trim()}`
    : 'Карточка из панели управления'

  return {
    id: '',
    kind: 'project',
    title,
    subtitle,
    meta,
  }
}

export function syncPersonCardToGraph() {
  const entity = saveEntity(
    'persons',
    buildPersonEntityFromForm(),
    personCardForm.editingEntityId,
  )

  syncConnectionEdges(entity, personCardForm.connections)
  resetPersonCardForm()
  return entity
}

export function syncCompanyCardToGraph() {
  const entity = saveEntity(
    'companies',
    buildCompanyEntityFromForm(),
    companyCardForm.editingEntityId,
  )

  syncConnectionEdges(entity, companyCardForm.connections)
  resetCompanyCardForm()
  return entity
}

export function syncProjectCardToGraph() {
  const entity = saveEntity(
    'projects',
    buildProjectEntityFromForm(),
    projectCardForm.editingEntityId,
  )

  resetProjectCardForm()
  return entity
}

export function hydrateGraphEntityToForm(entity: GraphEntity) {
  if (entity.kind === 'person') {
    resetPersonCardForm()
    personCardForm.editingEntityId = entity.id
    personCardForm.fullName = entity.title
    personCardForm.inn = Number(getMetaValue(entity, 'ИНН')) || ''
    personCardForm.phone = getMetaValue(entity, 'Телефон')
    personCardForm.email = getMetaValue(entity, 'Почта')
    personCardForm.description = getMetaValue(entity, ENTITY_DESCRIPTION_LABEL)
    personCardForm.connections = buildConnectionsForEntity(entity.id)
    return
  }

  if (entity.kind === 'company') {
    resetCompanyCardForm()
    companyCardForm.editingEntityId = entity.id
    companyCardForm.name = entity.title
    companyCardForm.inn = Number(getMetaValue(entity, 'ИНН')) || ''
    companyCardForm.address = getMetaValue(entity, 'Адрес')
    companyCardForm.description = getMetaValue(entity, ENTITY_DESCRIPTION_LABEL)
    companyCardForm.connections = buildConnectionsForEntity(entity.id)
    return
  }

  resetProjectCardForm()
  projectCardForm.editingEntityId = entity.id
  projectCardForm.name = entity.title
  projectCardForm.curator = getMetaValue(entity, 'Куратор проекта')
  projectCardForm.description = getMetaValue(entity, ENTITY_DESCRIPTION_LABEL)
}

import { reactive, ref } from 'vue'

import type {
  EntityKind,
  GraphCategoryId,
  GraphEntity,
} from '@/pages/control-panel/model/connections'
import { getEntitiesForCategory } from '@/pages/control-panel/model/graphMockData'

export type VerificationStatus = 'pending' | 'approved' | 'rejected'

export type VerificationSummary = 'pending' | 'partial' | 'approved' | 'rejected' | 'mixed'

const fieldStatuses = reactive<Record<string, Record<string, VerificationStatus>>>({})

export const activeVerificationCategoryId = ref<GraphCategoryId | null>(null)

const titleLabels: Record<EntityKind, string> = {
  person: 'ФИО',
  company: 'Название',
  project: 'Название',
}

export function getEntityFieldKeys(entity: GraphEntity) {
  return [
    'title',
    'subtitle',
    ...entity.meta.map((row) => `meta:${row.label}`),
  ]
}

export function getFieldLabel(entity: GraphEntity, fieldKey: string) {
  if (fieldKey === 'title') {
    return titleLabels[entity.kind]
  }

  if (fieldKey === 'subtitle') {
    return 'Подзаголовок'
  }

  if (fieldKey.startsWith('meta:')) {
    return fieldKey.slice(5)
  }

  return fieldKey
}

export function getFieldDisplayValue(entity: GraphEntity, fieldKey: string) {
  if (fieldKey === 'title') {
    return entity.title
  }

  if (fieldKey === 'subtitle') {
    return entity.subtitle
  }

  if (fieldKey.startsWith('meta:')) {
    const label = fieldKey.slice(5)
    return entity.meta.find((row) => row.label === label)?.value ?? ''
  }

  return ''
}

function ensureEntityVerification(entity: GraphEntity) {
  const existing = fieldStatuses[entity.id]

  if (!existing) {
    fieldStatuses[entity.id] = Object.fromEntries(
      getEntityFieldKeys(entity).map((key) => [key, 'pending']),
    )
    return
  }

  for (const key of getEntityFieldKeys(entity)) {
    if (!existing[key]) {
      existing[key] = 'pending'
    }
  }
}

export function getFieldStatus(
  entityId: string,
  fieldKey: string,
): VerificationStatus {
  return fieldStatuses[entityId]?.[fieldKey] ?? 'pending'
}

export function setFieldStatus(
  entityId: string,
  fieldKey: string,
  status: VerificationStatus,
) {
  if (!fieldStatuses[entityId]) {
    return
  }

  fieldStatuses[entityId][fieldKey] = status
}

export function approveAllFields(entity: GraphEntity) {
  ensureEntityVerification(entity)

  for (const key of getEntityFieldKeys(entity)) {
    setFieldStatus(entity.id, key, 'approved')
  }
}

export function rejectAllFields(entity: GraphEntity) {
  ensureEntityVerification(entity)

  for (const key of getEntityFieldKeys(entity)) {
    setFieldStatus(entity.id, key, 'rejected')
  }
}

export function getEntityVerificationSummary(entity: GraphEntity): VerificationSummary {
  ensureEntityVerification(entity)
  const keys = getEntityFieldKeys(entity)
  const statuses = keys.map((key) => getFieldStatus(entity.id, key))

  if (statuses.every((status) => status === 'approved')) {
    return 'approved'
  }

  if (statuses.every((status) => status === 'rejected')) {
    return 'rejected'
  }

  if (statuses.every((status) => status === 'pending')) {
    return 'pending'
  }

  if (statuses.some((status) => status === 'approved') && statuses.some((status) => status === 'rejected')) {
    return 'mixed'
  }

  return 'partial'
}

export function getCategoryVerificationSummary(
  categoryId: GraphCategoryId,
): VerificationSummary {
  const entities = getEntitiesForCategory(categoryId)

  if (!entities.length) {
    return 'pending'
  }

  const summaries = entities.map((entity) => getEntityVerificationSummary(entity))

  if (summaries.every((summary) => summary === 'approved')) {
    return 'approved'
  }

  if (summaries.every((summary) => summary === 'rejected')) {
    return 'rejected'
  }

  if (summaries.every((summary) => summary === 'pending')) {
    return 'pending'
  }

  if (
    summaries.some((summary) => summary === 'approved') &&
    summaries.some((summary) => summary === 'rejected')
  ) {
    return 'mixed'
  }

  return 'partial'
}

export function categoryLabelColor(
  summary: VerificationSummary,
): 'green' | 'yellow' | 'red' | 'blue' | null {
  if (summary === 'approved') {
    return 'green'
  }

  if (summary === 'rejected') {
    return 'red'
  }

  if (summary === 'partial' || summary === 'mixed') {
    return 'yellow'
  }

  if (summary === 'pending') {
    return 'blue'
  }

  return null
}

export function openVerificationCategory(categoryId: GraphCategoryId) {
  initVerificationForEntities(getEntitiesForCategory(categoryId))
  activeVerificationCategoryId.value = categoryId
}

export function closeVerificationCategory() {
  activeVerificationCategoryId.value = null
}

export function approveAllInCategory(categoryId: GraphCategoryId) {
  for (const entity of getEntitiesForCategory(categoryId)) {
    approveAllFields(entity)
  }
}

export function rejectAllInCategory(categoryId: GraphCategoryId) {
  for (const entity of getEntitiesForCategory(categoryId)) {
    rejectAllFields(entity)
  }
}

export function initVerificationForEntities(entities: GraphEntity[]) {
  for (const entity of entities) {
    ensureEntityVerification(entity)
  }
}

export const CONNECTION_OPTIONS = [
  'Компания',
  'Человек',
  'Проект',
  'Контрагент',
  'Партнёр',
  'Дочерняя организация',
] as const

export type ConnectionOption = (typeof CONNECTION_OPTIONS)[number]

export type EntityKind = 'person' | 'company' | 'project'

export type GraphCategoryId = 'persons' | 'companies' | 'projects'

export interface EntityMetaRow {
  label: string
  value: string
}

export interface GraphEntity {
  id: string
  kind: EntityKind
  title: string
  subtitle: string
  meta: EntityMetaRow[]
}

export interface GraphCategory {
  id: GraphCategoryId
  label: string
  kind: EntityKind
  description: string
  entityIds: string[]
}

export interface GraphEdge {
  id: string
  sourceId: string
  targetId: string
  label: string
}

export interface ConnectionLink {
  id: string
  relationType: ConnectionOption
  target: GraphEntity
}

export function createConnectionId() {
  return `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function createGraphEntityId(kind: EntityKind) {
  return `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function createEmptyConnections(): ConnectionLink[] {
  return []
}

export function formatConnectionLabel(link: ConnectionLink) {
  return `${link.relationType} → ${link.target.title}`
}

export const ENTITY_DESCRIPTION_LABEL = 'Описание'

export function getEntityDescription(entity: GraphEntity) {
  return (
    entity.meta.find((row) => row.label === ENTITY_DESCRIPTION_LABEL)?.value?.trim() ??
    ''
  )
}

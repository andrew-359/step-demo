import { reactive } from 'vue'

import type {
  GraphCategory,
  GraphEdge,
  GraphEntity,
} from '@/pages/control-panel/model/connections'

/** Сущности из демо-презентации: проект цеха сварки, Company Name, ключевые фигуры. */
const initialGraphEntities: Record<string, GraphEntity> = {
  'person-ivan': {
    id: 'person-ivan',
    kind: 'person',
    title: 'Иван Иванович',
    subtitle: 'Гендир. Company Name · кандидат',
    meta: [
      { label: 'ИНН', value: '123456789012' },
      { label: 'Период', value: 'с 20.11.2023' },
      { label: 'Маркер', value: 'кандидат' },
      { label: 'Источник', value: 'ЕГРЮЛ' },
      { label: 'Примечание', value: 'Массовый директор (5+ компаний, признак ФНС)' },
    ],
  },
  'person-petr': {
    id: 'person-petr',
    kind: 'person',
    title: 'Петр Петрович',
    subtitle: 'Генеральный директор · ЛПР',
    meta: [
      { label: 'ИНН', value: '123456789012' },
      { label: 'Период', value: 'с 07.02.2023' },
      { label: 'Маркер', value: 'ЛПР' },
      { label: 'Источник', value: 'отчет менеджера' },
      { label: 'Примечание', value: 'Опытный менеджер Ford Russia 2000–2016' },
    ],
  },
  'person-sergey': {
    id: 'person-sergey',
    kind: 'person',
    title: 'Сергей Сергеевич',
    subtitle: 'Гендир. Company Name · ЛВР',
    meta: [
      { label: 'ИНН', value: '123456789012' },
      { label: 'Период', value: '2024–2025' },
      { label: 'Маркер', value: 'ЛВР' },
      { label: 'Источник', value: 'ручной ввод' },
      { label: 'Примечание', value: 'Рекомендуемый путь интро к ЛПР' },
    ],
  },
  'person-alexey': {
    id: 'person-alexey',
    kind: 'person',
    title: 'Алексей Алексеевич',
    subtitle: 'Гендиректор · кандидат',
    meta: [
      { label: 'ИНН', value: '123456789012' },
      { label: 'Период', value: 'с 13.03.2022' },
      { label: 'Маркер', value: 'кандидат' },
      { label: 'Источник', value: 'ГЛОБАС' },
      { label: 'Примечание', value: 'Альтернативная цепочка входа' },
    ],
  },
  'person-team': {
    id: 'person-team',
    kind: 'person',
    title: 'Наша команда',
    subtitle: 'Внутренний контур · инициатор поиска',
    meta: [
      { label: 'Роль', value: 'Старт цепочки входа' },
      { label: 'Контекст', value: 'Протокол «Новый поиск»' },
    ],
  },
  'company-main': {
    id: 'company-main',
    kind: 'company',
    title: 'Company Name',
    subtitle: 'Заказчик · Шушары, СПб',
    meta: [
      { label: 'ИНН', value: '123456789012' },
      { label: 'Выручка', value: '31 млрд' },
      { label: 'Сотрудники', value: '~5 000' },
      { label: 'Холдинг', value: '14 компаний' },
      { label: 'Основана', value: '1999' },
    ],
  },
  'company-ford': {
    id: 'company-ford',
    kind: 'company',
    title: 'Ford Russia',
    subtitle: 'Исторический контур · 2000–2016',
    meta: [
      { label: 'Связь', value: 'Карьерный след Петра Петровича' },
      { label: 'Риск', value: 'Средний' },
    ],
  },
  'company-holding': {
    id: 'company-holding',
    kind: 'company',
    title: 'Холдинг Company Name',
    subtitle: '14 дочерних организаций',
    meta: [
      { label: 'Структура', value: 'Структура компании заказчика' },
      { label: 'Контур', value: 'Финансы · риски · инфраструктура' },
    ],
  },
  'company-procurement': {
    id: 'company-procurement',
    kind: 'company',
    title: 'Отдел закупок Company Name',
    subtitle: 'Альтернативный вход',
    meta: [
      { label: 'Стратегия', value: 'Заход через закупки' },
      { label: 'Статус', value: 'Параллельный контур' },
    ],
  },
  'project-weld': {
    id: 'project-weld',
    kind: 'project',
    title: 'Строительство цеха сварки',
    subtitle: 'Шушары · производственный корпус',
    meta: [
      { label: 'Локация', value: 'ул. Автозаводская, 2' },
      { label: 'Инвестор', value: 'Company Name, Иван Иванович' },
      { label: 'Заказчик', value: 'Company Name, Петр Петрович' },
      { label: 'Срок', value: 'апрель 2026' },
    ],
  },
  'project-lot1': {
    id: 'project-lot1',
    kind: 'project',
    title: 'Лот 1 — Земляные работы',
    subtitle: 'Сваи · ростверки',
    meta: [
      { label: 'Проект', value: 'Строительство цеха сварки' },
      { label: 'Статус', value: 'Тендер' },
    ],
  },
  'project-lot2': {
    id: 'project-lot2',
    kind: 'project',
    title: 'Лот 2 — Возведение здания',
    subtitle: 'До технологии',
    meta: [
      { label: 'Проект', value: 'Строительство цеха сварки' },
      { label: 'Статус', value: 'Тендер' },
    ],
  },
}

export const graphEntities = reactive(initialGraphEntities)

const initialGraphCategories: GraphCategory[] = [
  {
    id: 'persons',
    label: 'Люди',
    kind: 'person',
    description: 'Ключевые фигуры, ЛПР и цепочки входа',
    entityIds: [
      'person-team',
      'person-petr',
      'person-sergey',
      'person-ivan',
      'person-alexey',
    ],
  },
  {
    id: 'companies',
    label: 'Компании',
    kind: 'company',
    description: 'Заказчик, холдинг и контуры входа',
    entityIds: [
      'company-main',
      'company-holding',
      'company-procurement',
      'company-ford',
    ],
  },
  {
    id: 'projects',
    label: 'Проекты',
    kind: 'project',
    description: 'Объекты и лоты тендера',
    entityIds: ['project-weld', 'project-lot1', 'project-lot2'],
  },
]

export const graphCategories = reactive(
  initialGraphCategories.map((category) => ({
    ...category,
    entityIds: [...category.entityIds],
  })),
)

export const graphEdges = reactive<GraphEdge[]>([
  { id: 'e1', sourceId: 'person-team', targetId: 'person-sergey', label: 'интро' },
  { id: 'e2', sourceId: 'person-sergey', targetId: 'person-petr', label: 'рекомендация' },
  { id: 'e3', sourceId: 'person-team', targetId: 'person-alexey', label: 'альт. путь' },
  { id: 'e4', sourceId: 'person-alexey', targetId: 'person-petr', label: 'выход на ЛПР' },
  { id: 'e5', sourceId: 'person-petr', targetId: 'company-main', label: 'гендиректор' },
  { id: 'e6', sourceId: 'person-ivan', targetId: 'company-main', label: 'гендир.' },
  { id: 'e7', sourceId: 'person-sergey', targetId: 'company-main', label: 'гендир.' },
  { id: 'e8', sourceId: 'person-alexey', targetId: 'company-main', label: 'гендиректор' },
  { id: 'e9', sourceId: 'person-petr', targetId: 'company-ford', label: 'карьера' },
  { id: 'e10', sourceId: 'company-main', targetId: 'company-holding', label: 'холдинг' },
  { id: 'e11', sourceId: 'company-main', targetId: 'company-procurement', label: 'закупки' },
  { id: 'e12', sourceId: 'company-main', targetId: 'project-weld', label: 'заказчик' },
  { id: 'e13', sourceId: 'person-petr', targetId: 'project-weld', label: 'ЛПР' },
  { id: 'e14', sourceId: 'project-weld', targetId: 'project-lot1', label: 'лот 1' },
  { id: 'e15', sourceId: 'project-weld', targetId: 'project-lot2', label: 'лот 2' },
])

export function getCategoryById(id: GraphCategory['id']) {
  return graphCategories.find((category) => category.id === id) ?? null
}

export function getEntitiesForCategory(categoryId: GraphCategory['id']) {
  const category = getCategoryById(categoryId)

  if (!category) {
    return []
  }

  return category.entityIds
    .map((entityId) => graphEntities[entityId])
    .filter((entity): entity is GraphEntity => Boolean(entity))
}

export function getEdgesForEntityIds(entityIds: string[]) {
  const idSet = new Set(entityIds)

  return graphEdges.filter(
    (edge) => idSet.has(edge.sourceId) && idSet.has(edge.targetId),
  )
}

export function getAllEntityIds() {
  return Object.keys(graphEntities)
}

export function getBrowseEdges() {
  return graphEdges
}

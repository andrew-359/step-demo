export const PREPARATION_SECTION = 'Подготовка к проекту'
export const ABOUT_PROJECT_SECTION = 'О проекте'
export const PROJECT_PARTICIPANTS_SECTION = 'Участники проекта'
export const CUSTOMER_COMPANY_STRUCTURE_SECTION = 'Структура компании заказчика'
export const KEY_COMPANY_FIGURES_SECTION = 'Ключевые фигуры в компании'
export const FINANCIAL_INDICATORS_SECTION = 'Финансовые показатели'
export const LEGAL_RISKS_ARBITRATION_SECTION = 'Судебный аспект. Риски, арбитраж'
export const PROJECT_INFRASTRUCTURE_MAP_SECTION = 'Карта инфраструктуры проекта'
export const CONCLUSIONS_RECOMMENDATIONS_SECTION = 'Выводы. Рекомендации'
export const RELATIONSHIP_MAP_SECTION = 'Карта связей'
export const NEXT_STEPS_SECTION = 'Дальнейшие шаги'
export const NEW_SEARCH_NAV_ITEM = 'Новый поиск'
export const SEARCH_HISTORY_NAV_ITEM = 'История поисков'
export const ABOUT_APP_NAV_ITEM = 'О приложении'

export const sidebarItems = [
  PREPARATION_SECTION,
  ABOUT_PROJECT_SECTION,
  PROJECT_PARTICIPANTS_SECTION,
  CUSTOMER_COMPANY_STRUCTURE_SECTION,
  KEY_COMPANY_FIGURES_SECTION,
  FINANCIAL_INDICATORS_SECTION,
  LEGAL_RISKS_ARBITRATION_SECTION,
  PROJECT_INFRASTRUCTURE_MAP_SECTION,
  CONCLUSIONS_RECOMMENDATIONS_SECTION,
  RELATIONSHIP_MAP_SECTION,
  NEXT_STEPS_SECTION,
] as const

export const topNavItems = [
  NEW_SEARCH_NAV_ITEM,
  SEARCH_HISTORY_NAV_ITEM,
  ABOUT_APP_NAV_ITEM,
] as const

export type SidebarItem = (typeof sidebarItems)[number]
export type TopNavItem = (typeof topNavItems)[number]

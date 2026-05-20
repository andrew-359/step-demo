<script setup lang="ts">
import { computed } from 'vue'

import {
  activeControlForm,
  closeControlFormModal,
  isControlFormModalOpen,
  openControlFormModal,
  setActiveControlForm,
  type ActiveControlForm,
} from '@/pages/control-panel/model/activeControlForm'
import {
  resetCompanyCardForm,
  resetPersonCardForm,
  resetProjectCardForm,
} from '@/pages/control-panel/model/controlPanelForms'
import {
  getEntitiesForCategory,
  graphEdges,
  graphEntities,
} from '@/pages/control-panel/model/graphMockData'
import {
  graphCardSyncNotice,
  hydrateGraphEntityToForm,
} from '@/pages/control-panel/model/syncGraphCardFromForm'
import CompanyCardForm from '@/pages/control-panel/ui/CompanyCardForm.vue'
import PersonCardForm from '@/pages/control-panel/ui/PersonCardForm.vue'
import ProjectCardForm from '@/pages/control-panel/ui/ProjectCardForm.vue'
import type {
  EntityKind,
  GraphCategoryId,
  GraphEntity,
} from '@/pages/control-panel/model/connections'

const formTabs: { id: ActiveControlForm; title: string; hint: string }[] = [
  { id: 'person', title: 'Человек', hint: 'Контакт или источник связи' },
  { id: 'company', title: 'Компания', hint: 'Заказчик или контрагент' },
  { id: 'project', title: 'Проект', hint: 'Объект или лот' },
]

const categoryByKind: Record<EntityKind, GraphCategoryId> = {
  person: 'persons',
  company: 'companies',
  project: 'projects',
}

const formTitleByKind: Record<EntityKind, string> = {
  person: 'Карточка человека',
  company: 'Карточка компании',
  project: 'Карточка проекта',
}

const tableRows = computed(() => {
  const categoryId = categoryByKind[activeControlForm.value]

  return getEntitiesForCategory(categoryId).map((entity) => {
    const linkedEdges = graphEdges.filter(
      (edge) => edge.sourceId === entity.id || edge.targetId === entity.id,
    )
    const linkedNames = linkedEdges
      .map((edge) => graphEntities[edge.sourceId === entity.id ? edge.targetId : edge.sourceId])
      .filter((item): item is GraphEntity => Boolean(item))
      .map((item) => item.title)

    return {
      entity,
      marker:
        entity.meta.find((row) =>
          ['Маркер', 'Источник', 'Статус', 'Роль'].includes(row.label),
        )?.value ?? 'карточка',
      connectionsCount: linkedEdges.length,
      connectionsText: linkedNames.slice(0, 2).join(', ') || 'пока без связей',
    }
  })
})

const modalTitle = computed(() => formTitleByKind[activeControlForm.value])

function resetForm(kind: ActiveControlForm) {
  const resetByKind: Record<ActiveControlForm, () => void> = {
    person: resetPersonCardForm,
    company: resetCompanyCardForm,
    project: resetProjectCardForm,
  }

  resetByKind[kind]()
}

function openCreateForm() {
  resetForm(activeControlForm.value)
  openControlFormModal()
}

function openEditForm(entity: GraphEntity) {
  setActiveControlForm(entity.kind)
  hydrateGraphEntityToForm(entity)
  openControlFormModal()
}

function closeFormModal() {
  closeControlFormModal()
}
</script>

<template>
  <div class="control-panel-forms">
    <div class="control-panel-forms__topbar">
      <div class="control-panel-forms__tabs" aria-label="Тип карточки">
        <button
          v-for="tab in formTabs"
          :key="tab.id"
          class="control-panel-forms__tab"
          :class="{ 'control-panel-forms__tab--active': activeControlForm === tab.id }"
          type="button"
          @click="setActiveControlForm(tab.id)"
        >
          <strong>{{ tab.title }}</strong>
          <span>{{ tab.hint }}</span>
        </button>
      </div>

      <button
        class="control-panel-forms__add"
        type="button"
        aria-label="Добавить карточку"
        @click="openCreateForm"
      >
        +
      </button>
    </div>

    <p
      v-if="graphCardSyncNotice"
      class="control-panel-forms__notice"
      role="status"
      aria-live="polite"
    >
      {{ graphCardSyncNotice }}
    </p>

    <section class="entity-table" aria-label="База сущностей">
      <div class="entity-table__head">
        <span>Карточка</span>
        <span>Контекст</span>
        <span>Связи</span>
        <span>Статус</span>
      </div>

      <button
        v-for="row in tableRows"
        :key="row.entity.id"
        class="entity-table__row"
        type="button"
        @click="openEditForm(row.entity)"
      >
        <span class="entity-table__main">
          <strong>{{ row.entity.title }}</strong>
          <small>{{ row.entity.subtitle }}</small>
        </span>
        <span>{{ row.marker }}</span>
        <span>{{ row.connectionsCount }} · {{ row.connectionsText }}</span>
        <span class="entity-table__status">в графе</span>
      </button>
    </section>

    <div
      v-if="isControlFormModalOpen"
      class="entity-form-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="modalTitle"
    >
      <div class="entity-form-modal__backdrop" @click="closeFormModal" />
      <div class="entity-form-modal__panel">
        <header class="entity-form-modal__header">
          <div>
            <span>База сущностей</span>
            <h2>{{ modalTitle }}</h2>
          </div>

          <button
            class="entity-form-modal__close"
            type="button"
            aria-label="Закрыть форму"
            @click="closeFormModal"
          >
            ×
          </button>
        </header>

        <PersonCardForm
          v-if="activeControlForm === 'person'"
          @saved="closeFormModal"
        />
        <CompanyCardForm
          v-else-if="activeControlForm === 'company'"
          @saved="closeFormModal"
        />
        <ProjectCardForm
          v-else
          @saved="closeFormModal"
        />
      </div>
    </div>
  </div>
</template>

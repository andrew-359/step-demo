<script setup lang="ts">
import { computed } from 'vue'

import type { GraphEntity } from '@/pages/control-panel/model/connections'
import { getCategoryById, getEntitiesForCategory } from '@/pages/control-panel/model/graphMockData'
import {
  activeVerificationCategoryId,
  approveAllFields,
  approveAllInCategory,
  closeVerificationCategory,
  getEntityFieldKeys,
  getFieldDisplayValue,
  getFieldLabel,
  getFieldStatus,
  rejectAllFields,
  rejectAllInCategory,
  setFieldStatus,
} from '@/pages/control-panel/model/verificationStore'

const category = computed(() => {
  if (!activeVerificationCategoryId.value) {
    return null
  }

  return getCategoryById(activeVerificationCategoryId.value)
})

const entities = computed(() => {
  if (!activeVerificationCategoryId.value) {
    return []
  }

  return getEntitiesForCategory(activeVerificationCategoryId.value)
})

function setStatus(entity: GraphEntity, fieldKey: string, status: 'approved' | 'rejected') {
  setFieldStatus(entity.id, fieldKey, status)
}

function rowClass(entity: GraphEntity, fieldKey: string) {
  const status = getFieldStatus(entity.id, fieldKey)

  return {
    'verification-modal__row--approved': status === 'approved',
    'verification-modal__row--rejected': status === 'rejected',
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="category"
      class="meeting-modal-backdrop verification-modal-backdrop"
      @click.self="closeVerificationCategory"
    >
      <article
        class="meeting-modal verification-modal verification-category-modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`verification-category-${category.id}`"
      >
        <header class="meeting-modal__topbar">
          <button class="meeting-modal__list" type="button">
            <span>Верификация данных</span>
            <span aria-hidden="true">▾</span>
          </button>
          <div class="meeting-modal__topbar-actions">
            <button
              class="meeting-modal__icon-btn"
              type="button"
              aria-label="Закрыть"
              @click="closeVerificationCategory"
            >
              ×
            </button>
          </div>
        </header>

        <div class="verification-category-modal__intro">
          <h2 :id="`verification-category-${category.id}`" class="verification-category-modal__title">
            {{ category.label }}
          </h2>
          <p class="verification-category-modal__description">{{ category.description }}</p>
        </div>

        <div class="verification-category-modal__body">
          <section
            v-for="entity in entities"
            :key="entity.id"
            class="verification-category-modal__entity"
          >
            <h3 class="verification-category-modal__entity-title">{{ entity.title }}</h3>
            <p v-if="entity.subtitle" class="verification-category-modal__entity-subtitle">
              {{ entity.subtitle }}
            </p>

            <div
              v-for="fieldKey in getEntityFieldKeys(entity)"
              :key="fieldKey"
              class="verification-modal__row"
              :class="rowClass(entity, fieldKey)"
            >
              <div class="verification-modal__field">
                <span class="verification-modal__label">
                  {{ getFieldLabel(entity, fieldKey) }}
                </span>
                <span class="verification-modal__value">
                  {{ getFieldDisplayValue(entity, fieldKey) }}
                </span>
              </div>
              <div class="verification-modal__actions">
                <button
                  type="button"
                  class="verification-modal__action verification-modal__action--approve"
                  :class="{
                    'verification-modal__action--active':
                      getFieldStatus(entity.id, fieldKey) === 'approved',
                  }"
                  :aria-label="`Подтвердить: ${getFieldLabel(entity, fieldKey)}`"
                  @click="setStatus(entity, fieldKey, 'approved')"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path
                      d="M5 12.5 9.5 17 19 7"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="verification-modal__action verification-modal__action--reject"
                  :class="{
                    'verification-modal__action--active':
                      getFieldStatus(entity.id, fieldKey) === 'rejected',
                  }"
                  :aria-label="`Отклонить: ${getFieldLabel(entity, fieldKey)}`"
                  @click="setStatus(entity, fieldKey, 'rejected')"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path
                      d="M7 7 17 17M17 7 7 17"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="verification-category-modal__entity-actions">
              <button
                type="button"
                class="verification-modal__bulk verification-modal__bulk--approve"
                @click="approveAllFields(entity)"
              >
                Подтвердить запись
              </button>
              <button
                type="button"
                class="verification-modal__bulk verification-modal__bulk--reject"
                @click="rejectAllFields(entity)"
              >
                Отклонить запись
              </button>
            </div>
          </section>
        </div>

        <footer class="verification-modal__footer">
          <button
            type="button"
            class="verification-modal__bulk verification-modal__bulk--approve"
            @click="approveAllInCategory(category.id)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M5 12.5 9.5 17 19 7"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Подтвердить все
          </button>
          <button
            type="button"
            class="verification-modal__bulk verification-modal__bulk--reject"
            @click="rejectAllInCategory(category.id)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M7 7 17 17M17 7 7 17"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
              />
            </svg>
            Отклонить все
          </button>
        </footer>
      </article>
    </div>
  </Teleport>
</template>

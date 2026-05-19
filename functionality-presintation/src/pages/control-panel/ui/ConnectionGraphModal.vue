<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  getEntityDescription,
  type ConnectionOption,
  type GraphCategory,
  type GraphEntity,
} from '@/pages/control-panel/model/connections'
import {
  getCategoryById,
  getEdgesForEntityIds,
  getEntitiesForCategory,
  getBrowseEdges,
  graphCategories,
  graphEntities,
} from '@/pages/control-panel/model/graphMockData'
import EntityPreviewModal from '@/pages/control-panel/ui/EntityPreviewModal.vue'

const props = defineProps<{
  mode: 'pick' | 'browse'
  relationType?: ConnectionOption
}>()

const emit = defineEmits<{
  close: []
  select: [entity: GraphEntity]
}>()

type GraphLevel =
  | { type: 'root' }
  | { type: 'category'; categoryId: GraphCategory['id'] }
  | { type: 'full' }

const level = ref<GraphLevel>({ type: 'root' })
const previewEntity = ref<GraphEntity | null>(null)

const activeCategory = computed(() => {
  if (level.value.type !== 'category') {
    return null
  }

  return getCategoryById(level.value.categoryId)
})

const visibleEntities = computed(() => {
  if (level.value.type === 'root') {
    return []
  }

  if (level.value.type === 'full') {
    return Object.values(graphEntities)
  }

  return getEntitiesForCategory(level.value.categoryId)
})

const visibleEdges = computed(() => {
  if (level.value.type === 'root') {
    return []
  }

  if (level.value.type === 'full') {
    return getBrowseEdges()
  }

  const ids = visibleEntities.value.map((entity) => entity.id)
  return getEdgesForEntityIds(ids)
})

const entityKindLabels = {
  person: 'Персоналия',
  company: 'Компания',
  project: 'Проект',
} as const

const modalTitle = computed(() => {
  if (props.mode === 'pick' && props.relationType) {
    return `Выбор связи · ${props.relationType}`
  }

  return 'Граф связей · обзор'
})

const breadcrumb = computed(() => {
  if (level.value.type === 'root') {
    return 'Корень графа'
  }

  if (level.value.type === 'full') {
    return 'Корень / Полная карта'
  }

  return `Корень / ${activeCategory.value?.label ?? ''}`
})

function enterCategory(categoryId: GraphCategory['id']) {
  level.value = { type: 'category', categoryId }
}

function goRoot() {
  level.value = { type: 'root' }
}

function openFullMap() {
  level.value = { type: 'full' }
}

function onCategoryClick(category: GraphCategory) {
  enterCategory(category.id)
}

function onEntityClick(entity: GraphEntity) {
  if (props.mode === 'pick') {
    emit('select', entity)
    emit('close')
    return
  }

  previewEntity.value = entity
}

function nodePositions(count: number, width: number, height: number) {
  if (count <= 1) {
    return [{ x: width / 2, y: height / 2 }]
  }

  const radius = Math.min(width, height) * 0.34
  const centerX = width / 2
  const centerY = height / 2

  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })
}

const rootLayout = computed(() => {
  const width = 920
  const height = 420
  const positions = nodePositions(graphCategories.length, width, height)

  return graphCategories.map((category, index) => ({
    category,
    x: positions[index]?.x ?? width / 2,
    y: positions[index]?.y ?? height / 2,
  }))
})

const entityLayout = computed(() => {
  const width = 920
  const height = 420
  const count = visibleEntities.value.length

  if (level.value.type === 'full') {
    const positions = nodePositions(count, width, height)
    return visibleEntities.value.map((entity, index) => ({
      entity,
      x: positions[index]?.x ?? width / 2,
      y: positions[index]?.y ?? height / 2,
    }))
  }

  const columns = Math.min(3, Math.max(1, count))
  const rows = Math.ceil(count / columns)
  const cellW = width / columns
  const cellH = height / Math.max(rows, 1)

  return visibleEntities.value.map((entity, index) => {
    const col = index % columns
    const row = Math.floor(index / columns)

    return {
      entity,
      x: cellW * col + cellW / 2,
      y: cellH * row + cellH / 2,
    }
  })
})

function truncateDescription(text: string, maxLength = 72) {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trim()}…`
}

function getEntityPosition(entityId: string) {
  const layout = entityLayout.value.find((item) => item.entity.id === entityId)
  return layout ? { x: layout.x, y: layout.y } : null
}

function edgePath(sourceId: string, targetId: string) {
  const source = getEntityPosition(sourceId)
  const target = getEntityPosition(targetId)

  if (!source || !target) {
    return ''
  }

  return `M ${source.x} ${source.y} L ${target.x} ${target.y}`
}
</script>

<template>
  <div class="graph-modal-backdrop" @click.self="emit('close')">
    <section
      class="graph-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="graph-modal-title"
    >
      <header class="graph-modal__header">
        <div>
          <p class="graph-modal__eyebrow">{{ breadcrumb }}</p>
          <h2 id="graph-modal-title" class="graph-modal__title">
            {{ modalTitle }}
          </h2>
          <p v-if="mode === 'pick'" class="graph-modal__hint">
            Выберите карточку без подграфа — связь будет добавлена в форму.
          </p>
          <p v-else class="graph-modal__hint">
            Свободный просмотр: откройте категорию или нажмите карточку для деталей.
          </p>
        </div>

        <div class="graph-modal__header-actions">
          <button
            v-if="mode === 'browse' && level.type === 'root'"
            class="graph-modal__secondary"
            type="button"
            @click="openFullMap"
          >
            Полная карта
          </button>
          <button
            v-if="level.type !== 'root'"
            class="graph-modal__secondary"
            type="button"
            @click="goRoot"
          >
            ← К корню
          </button>
          <button
            class="graph-modal__close"
            type="button"
            aria-label="Закрыть граф"
            @click="emit('close')"
          >
            ×
          </button>
        </div>
      </header>

      <div class="graph-modal__canvas">
        <svg
          v-if="level.type !== 'root' && visibleEdges.length"
          class="graph-modal__svg"
          viewBox="0 0 920 420"
          aria-hidden="true"
        >
          <g class="graph-modal__edges">
            <template v-for="edge in visibleEdges" :key="edge.id">
              <path
                v-if="edgePath(edge.sourceId, edge.targetId)"
                :d="edgePath(edge.sourceId, edge.targetId)"
                class="graph-modal__edge"
              />
              <text
                v-if="getEntityPosition(edge.sourceId) && getEntityPosition(edge.targetId)"
                :x="(getEntityPosition(edge.sourceId)!.x + getEntityPosition(edge.targetId)!.x) / 2"
                :y="(getEntityPosition(edge.sourceId)!.y + getEntityPosition(edge.targetId)!.y) / 2 - 6"
                class="graph-modal__edge-label"
              >
                {{ edge.label }}
              </text>
            </template>
          </g>
        </svg>

        <div v-if="level.type === 'root'" class="graph-modal__root">
          <svg class="graph-modal__svg graph-modal__svg--root" viewBox="0 0 920 420" aria-hidden="true">
            <circle cx="460" cy="210" r="52" class="graph-modal__hub" />
            <text x="460" y="215" class="graph-modal__hub-label">Связи</text>
            <line
              v-for="item in rootLayout"
              :key="`hub-${item.category.id}`"
              :x1="460"
              :y1="210"
              :x2="item.x"
              :y2="item.y"
              class="graph-modal__edge graph-modal__edge--hub"
            />
          </svg>

          <button
            v-for="item in rootLayout"
            :key="item.category.id"
            class="graph-node graph-node--category"
            :style="{
              left: `${(item.x / 920) * 100}%`,
              top: `${(item.y / 420) * 100}%`,
            }"
            type="button"
            @click="onCategoryClick(item.category)"
          >
            <span class="graph-node__badge">Подграф</span>
            <strong>{{ item.category.label }}</strong>
            <p>{{ item.category.description }}</p>
            <span class="graph-node__count">
              {{ item.category.entityIds.length }} карточек
            </span>
          </button>
        </div>

        <div v-else class="graph-modal__category-panel">
          <div class="graph-modal__category-shell">
            <header class="graph-modal__category-header">
              <h3>
                {{
                  level.type === 'full'
                    ? 'Полная карта связей'
                    : activeCategory?.label
                }}
              </h3>
              <p>
                {{
                  level.type === 'full'
                    ? 'Все моковые сущности презентации и связи между ними'
                    : activeCategory?.description
                }}
              </p>
            </header>

            <div class="graph-modal__entity-layer">
              <button
                v-for="item in entityLayout"
                :key="item.entity.id"
                class="graph-node graph-node--entity"
                :style="{
                  left: `${(item.x / 920) * 100}%`,
                  top: `${(item.y / 420) * 100}%`,
                }"
                type="button"
                @click="onEntityClick(item.entity)"
              >
                <span class="graph-node__kind">{{ entityKindLabels[item.entity.kind] }}</span>
                <strong>{{ item.entity.title }}</strong>
                <p>{{ item.entity.subtitle }}</p>
                <p
                  v-if="getEntityDescription(item.entity)"
                  class="graph-node__description"
                >
                  {{ truncateDescription(getEntityDescription(item.entity)) }}
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <EntityPreviewModal
      v-if="previewEntity"
      :entity="previewEntity"
      @close="previewEntity = null"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { selectedStrategy } from '@/pages/home/model/demoProtocol'

type GraphNodeType = 'company' | 'person' | 'internal' | 'lpr' | 'lvr'
type GraphEdgeTone = 'base' | 'strategy-primary' | 'strategy-secondary' | 'company'

interface GraphNode {
  id: string
  label: string
  sublabel: string
  type: GraphNodeType
  x: number
  y: number
}

interface GraphEdge {
  id: string
  from: string
  to: string
  tone: GraphEdgeTone
  label?: string
  relation?: string
  labelDx?: number
  labelDy?: number
  relationDx?: number
  relationDy?: number
}

const nodes: GraphNode[] = [
  {
    id: 'our-team',
    label: 'Наша команда',
    sublabel: 'внутренние связи',
    type: 'internal',
    x: 110,
    y: 350,
  },
  {
    id: 'sergey',
    label: 'Сергей Сергеевич',
    sublabel: 'подтвержденный ЛВР',
    type: 'lvr',
    x: 300,
    y: 240,
  },
  {
    id: 'alexey',
    label: 'Алексей Алексеевич',
    sublabel: 'альтернативный контакт',
    type: 'person',
    x: 300,
    y: 480,
  },
  {
    id: 'petr',
    label: 'Петр Петрович',
    sublabel: 'ЛПР',
    type: 'lpr',
    x: 520,
    y: 350,
  },
  {
    id: 'company-target',
    label: 'Company Name',
    sublabel: 'целевая компания',
    type: 'company',
    x: 720,
    y: 350,
  },
  {
    id: 'holding',
    label: 'Холдинг',
    sublabel: '14 компаний',
    type: 'company',
    x: 720,
    y: 130,
  },
  {
    id: 'procurement',
    label: 'Отдел закупок',
    sublabel: 'тендерный контур',
    type: 'company',
    x: 720,
    y: 570,
  },
  {
    id: 'ivan',
    label: 'Иван Иванович',
    sublabel: 'кандидат',
    type: 'person',
    x: 520,
    y: 130,
  },
  {
    id: 'dmitry',
    label: 'Дмитрий Дмитриевич',
    sublabel: 'специалист закупок',
    type: 'person',
    x: 500,
    y: 570,
  },
  {
    id: 'nikolay',
    label: 'Николай Николаевич',
    sublabel: 'начальник закупок',
    type: 'person',
    x: 885,
    y: 570,
  },
  {
    id: 'tech-customer',
    label: 'Техзаказчик',
    sublabel: 'проектный контур',
    type: 'company',
    x: 885,
    y: 350,
  },
  {
    id: 'vladimir',
    label: 'Владимир Владимирович',
    sublabel: 'руководитель строительства',
    type: 'person',
    x: 885,
    y: 180,
  },
]

const edges: GraphEdge[] = [
  {
    id: 'strategy-direct-1',
    from: 'our-team',
    to: 'sergey',
    tone: 'strategy-primary',
    relation: 'внутренний контакт',
    relationDx: -54,
    relationDy: -36,
  },
  {
    id: 'strategy-direct-2',
    from: 'sergey',
    to: 'petr',
    tone: 'strategy-primary',
    relation: 'подтвержденная связь',
    relationDx: 42,
    relationDy: -38,
  },
  {
    id: 'strategy-direct-3',
    from: 'petr',
    to: 'company-target',
    tone: 'strategy-primary',
    relation: 'ЛПР компании',
    relationDx: -34,
    relationDy: -54,
  },
  {
    id: 'strategy-alt-1',
    from: 'our-team',
    to: 'alexey',
    tone: 'strategy-secondary',
    relation: 'альтернативный контакт',
    relationDx: 24,
    relationDy: 52,
  },
  {
    id: 'strategy-alt-2',
    from: 'alexey',
    to: 'petr',
    tone: 'strategy-secondary',
    relation: 'не подтверждено',
    relationDx: 18,
    relationDy: 52,
  },
  {
    id: 'strategy-alt-3',
    from: 'petr',
    to: 'company-target',
    tone: 'strategy-secondary',
    relation: 'ЛПР компании',
    relationDx: 22,
    relationDy: -34,
  },
  {
    id: 'company-holding',
    from: 'holding',
    to: 'company-target',
    tone: 'company',
  },
  {
    id: 'company-procurement',
    from: 'company-target',
    to: 'procurement',
    tone: 'company',
  },
  {
    id: 'company-tech',
    from: 'company-target',
    to: 'tech-customer',
    tone: 'company',
  },
  {
    id: 'ivan-holding',
    from: 'ivan',
    to: 'holding',
    tone: 'base',
  },
  {
    id: 'dmitry-procurement',
    from: 'dmitry',
    to: 'procurement',
    tone: 'base',
  },
  {
    id: 'nikolay-procurement',
    from: 'nikolay',
    to: 'procurement',
    tone: 'base',
  },
  {
    id: 'vladimir-tech',
    from: 'vladimir',
    to: 'tech-customer',
    tone: 'base',
  },
]

const activeStrategyPath = computed(() => {
  if (selectedStrategy.value?.id === 'strategy-procurement') {
    return new Set(['our-team', 'alexey', 'petr', 'company-target'])
  }

  return new Set(['our-team', 'sergey', 'petr', 'company-target'])
})

const activeStrategyEdgeIds = computed(() => {
  if (selectedStrategy.value?.id === 'strategy-procurement') {
    return new Set(['strategy-alt-1', 'strategy-alt-2', 'strategy-alt-3'])
  }

  return new Set(['strategy-direct-1', 'strategy-direct-2', 'strategy-direct-3'])
})

const activeStrategyName = computed(() => {
  return selectedStrategy.value?.title ?? 'Встреча через подтвержденного ЛВР'
})

const activeStrategyConfidence = computed(() => {
  return selectedStrategy.value?.id === 'strategy-procurement' ? '68%' : '82%'
})

const activeStrategyRoute = computed(() => {
  if (selectedStrategy.value?.id === 'strategy-procurement') {
    return 'Наша команда → Алексей Алексеевич → Петр Петрович → Company Name'
  }

  return 'Наша команда → Сергей Сергеевич → Петр Петрович → Company Name'
})

function nodeById(id: string) {
  return nodes.find((node) => node.id === id)
}

function edgePath(edge: GraphEdge) {
  const from = nodeById(edge.from)
  const to = nodeById(edge.to)

  if (!from || !to) {
    return ''
  }

  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.hypot(dx, dy) || 1
  const unitX = dx / distance
  const unitY = dy / distance
  const fromAnchor = nodeAnchorDistance(from, unitX, unitY)
  const toAnchor = nodeAnchorDistance(to, -unitX, -unitY)
  const startX = from.x + unitX * fromAnchor
  const startY = from.y + unitY * fromAnchor
  const endX = to.x - unitX * toAnchor
  const endY = to.y - unitY * toAnchor
  const controlX = (startX + endX) / 2
  const controlY = (startY + endY) / 2 - Math.abs(startX - endX) * 0.08

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`
}

function relationLabelPosition(edge: GraphEdge) {
  const from = nodeById(edge.from)
  const to = nodeById(edge.to)

  if (!from || !to) {
    return { x: 0, y: 0 }
  }

  return {
    x: (from.x + to.x) / 2 + (edge.relationDx ?? 0),
    y: (from.y + to.y) / 2 + (edge.relationDy ?? 0),
  }
}

function isActiveStrategyEdge(edge: GraphEdge) {
  return activeStrategyEdgeIds.value.has(edge.id)
}

function edgeClass(edge: GraphEdge) {
  return {
    [`company-map-edge--${edge.tone}`]: true,
    'company-map-edge--active': isActiveStrategyEdge(edge),
    'company-map-edge--inactive-strategy':
      edge.tone.startsWith('strategy') && !isActiveStrategyEdge(edge),
  }
}

function nodeClass(node: GraphNode) {
  return {
    [`company-map-node--${node.type}`]: true,
    'company-map-node--active': activeStrategyPath.value.has(node.id),
    'company-map-node--target': node.id === 'company-target',
  }
}

function isActiveNode(node: GraphNode) {
  return activeStrategyPath.value.has(node.id)
}

function nodeAnchorDistance(node: GraphNode, unitX: number, unitY: number) {
  if (node.type === 'company') {
    const halfWidth = companyNodeWidth(node) / 2
    const halfHeight = companyNodeHeight(node) / 2
    const xDistance = Math.abs(unitX) > 0.01 ? halfWidth / Math.abs(unitX) : Infinity
    const yDistance = Math.abs(unitY) > 0.01 ? halfHeight / Math.abs(unitY) : Infinity

    return Math.min(xDistance, yDistance) + 2
  }

  return isActiveNode(node) ? 42 : 24
}

function personRadius(node: GraphNode) {
  return isActiveNode(node) ? 34 : 18
}

function companyNodeWidth(node: GraphNode) {
  return node.id === 'company-target' ? 176 : 126
}

function companyNodeHeight(node: GraphNode) {
  return node.id === 'company-target' ? 78 : 56
}

function labelY(node: GraphNode) {
  if (node.type === 'company') {
    return -6
  }

  return isActiveNode(node) ? 58 : 36
}

function sublabelY(node: GraphNode) {
  if (node.type === 'company') {
    return 15
  }

  return isActiveNode(node) ? 77 : 51
}
</script>

<template>
  <article class="company-relationship-map" aria-labelledby="company-map-title">
    <header class="company-map-header">
      <div>
        <p>мастер-граф · подграф проекта</p>
        <h1 id="company-map-title">Карта связей компании</h1>
      </div>
    </header>

    <section class="company-map-canvas" aria-label="Граф связей компании">
      <div class="company-map-graph">
        <svg viewBox="0 0 980 680" role="img" aria-labelledby="company-map-title">
          <defs>
            <marker
              id="activeArrow"
              markerHeight="6"
              markerWidth="7"
              orient="auto"
              refX="6"
              refY="3"
              viewBox="0 0 7 6"
            >
              <path d="M0 0 7 3 0 6Z" fill="#c4a865" />
            </marker>
            <filter id="nodeShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow
                dx="0"
                dy="14"
                flood-color="#07111f"
                flood-opacity="0.22"
                stdDeviation="14"
              />
            </filter>
          </defs>

          <g class="company-map-edges">
            <g v-for="edge in edges" :key="edge.id">
              <path
                class="company-map-edge"
                :class="edgeClass(edge)"
                :d="edgePath(edge)"
                :marker-end="isActiveStrategyEdge(edge) ? 'url(#activeArrow)' : undefined"
              />
            <g
              v-if="isActiveStrategyEdge(edge) && edge.relation"
              class="company-map-relation-label"
              :transform="`translate(${relationLabelPosition(edge).x} ${relationLabelPosition(edge).y})`"
            >
                <rect x="-62" y="-10" width="124" height="20" rx="10" />
                <text text-anchor="middle" y="4">{{ edge.relation }}</text>
              </g>
            </g>
          </g>

          <g class="company-map-nodes">
            <g
              v-for="node in nodes"
              :key="node.id"
              class="company-map-node"
              :class="nodeClass(node)"
              :transform="`translate(${node.x} ${node.y})`"
            >
              <rect
                v-if="node.type === 'company'"
                class="company-map-node__company"
                :x="companyNodeWidth(node) / -2"
                :y="companyNodeHeight(node) / -2"
                :width="companyNodeWidth(node)"
                :height="companyNodeHeight(node)"
                rx="10"
              />
              <circle
                v-else
                class="company-map-node__person"
                :r="personRadius(node)"
              />
              <circle
                v-if="node.type === 'lpr' || node.type === 'lvr'"
                class="company-map-node__ring"
                :r="personRadius(node) + 9"
              />
              <text
                class="company-map-node__label"
                text-anchor="middle"
                :y="labelY(node)"
              >
                {{ node.label }}
              </text>
              <text
                class="company-map-node__sublabel"
                text-anchor="middle"
                :y="sublabelY(node)"
              >
                {{ node.sublabel }}
              </text>
            </g>
          </g>
        </svg>
      </div>

      <aside class="company-map-sidepanel" aria-label="Сводка по графу">
        <section>
          <p>Текущая стратегия</p>
          <h2>{{ activeStrategyName }}</h2>
          <dl>
            <div>
              <dt>Путь</dt>
              <dd>{{ activeStrategyRoute }}</dd>
            </div>
            <div>
              <dt>Уверенность</dt>
              <dd>{{ activeStrategyConfidence }}</dd>
            </div>
            <div>
              <dt>Ключевая точка</dt>
              <dd>Петр Петрович · ЛПР</dd>
            </div>
          </dl>
        </section>

        <section class="company-map-legend">
          <h2>Легенда</h2>
          <div>
            <span class="company-map-legend__dot company-map-legend__dot--base"></span>
            Люди в базе
          </div>
          <div>
            <span class="company-map-legend__dot company-map-legend__dot--active"></span>
            Участники текущей стратегии
          </div>
          <div>
            <span class="company-map-legend__dot company-map-legend__dot--company"></span>
            Компании
          </div>
          <div>
            <span class="company-map-legend__line company-map-legend__line--primary"></span>
            Основная цепочка
          </div>
          <div>
            <span class="company-map-legend__line company-map-legend__line--secondary"></span>
            Альтернативная цепочка
          </div>
        </section>
      </aside>
    </section>
  </article>
</template>

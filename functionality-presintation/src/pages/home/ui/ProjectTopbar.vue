<script setup lang="ts">
import type { TopNavItem } from '@/pages/home/model/navigation'

defineProps<{
  items: readonly TopNavItem[]
  activeItem: TopNavItem | null
  flowActionLabel: string | null
  flowActionDisabled: boolean
  flowActionLoading: boolean
  flowActionStatus: string | null
}>()

const emit = defineEmits<{
  'update:activeItem': [item: TopNavItem]
  runFlowAction: []
}>()
</script>

<template>
  <header class="topbar">
    <div class="topbar__actions" aria-label="Действия протокола">
      <button
        v-if="flowActionLabel"
        class="topbar__action"
        :class="{ 'topbar__action--loading': flowActionLoading }"
        :disabled="flowActionDisabled || flowActionLoading"
        type="button"
        @click="emit('runFlowAction')"
      >
        <span v-if="flowActionLoading" class="topbar__spinner" aria-hidden="true"></span>
        {{ flowActionLabel }}
      </button>
      <span v-if="flowActionStatus" class="topbar__action-status">
        {{ flowActionStatus }}
      </span>
    </div>

    <nav class="topbar__nav" aria-label="Верхняя навигация">
      <button
        v-for="item in items"
        :key="item"
        class="topbar__link"
        :class="{ 'topbar__link--active': activeItem === item }"
        type="button"
        @click="emit('update:activeItem', item)"
      >
        {{ item }}
      </button>
    </nav>
  </header>
</template>

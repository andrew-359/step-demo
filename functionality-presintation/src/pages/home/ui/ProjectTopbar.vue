<script setup lang="ts">
import type { TopNavItem } from '@/pages/home/model/navigation'

defineProps<{
  items: readonly TopNavItem[]
  activeItem: TopNavItem | null
}>()

const emit = defineEmits<{
  'update:activeItem': [item: TopNavItem]
}>()
</script>

<template>
  <header class="topbar">
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

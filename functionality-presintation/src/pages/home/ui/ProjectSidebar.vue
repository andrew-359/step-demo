<script setup lang="ts">
import type { SidebarItem } from '@/pages/home/model/navigation'

defineProps<{
  items: readonly SidebarItem[]
  activeItem: SidebarItem | null
  theme: 'light' | 'dark'
}>()

const emit = defineEmits<{
  'update:activeItem': [item: SidebarItem]
  'selectNewSearch': []
  'toggleTheme': []
}>()
</script>

<template>
  <aside class="sidebar" aria-label="Основная навигация">
    <div class="sidebar__header">
      <button
        class="brand"
        type="button"
        aria-label="Открыть новый поиск"
        @click="emit('selectNewSearch')"
      >
        <span class="brand__mark">S</span>
        <span class="brand__text">Step AI</span>
      </button>
      <button
        class="icon-button theme-switcher"
        type="button"
        :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
        @click="emit('toggleTheme')"
      >
        <span aria-hidden="true">{{ theme === 'dark' ? '☀' : '☾' }}</span>
      </button>
    </div>

    <nav class="sidebar__nav" aria-label="Разделы проекта">
      <button
        v-for="item in items"
        :key="item"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': activeItem === item }"
        type="button"
        @click="emit('update:activeItem', item)"
      >
        <span class="sidebar__bullet" aria-hidden="true"></span>
        <span>{{ item }}</span>
      </button>
    </nav>
  </aside>
</template>

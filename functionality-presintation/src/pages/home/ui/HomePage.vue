<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import {
  NEW_SEARCH_NAV_ITEM,
  PREPARATION_SECTION,
  sidebarItems,
  topNavItems,
  type SidebarItem,
  type TopNavItem,
} from '@/pages/home/model/navigation'
import HomeWorkspace from '@/pages/home/ui/HomeWorkspace.vue'
import ProjectSidebar from '@/pages/home/ui/ProjectSidebar.vue'
import ProjectTopbar from '@/pages/home/ui/ProjectTopbar.vue'

type ThemeMode = 'light' | 'dark'

const activeSidebarItem = ref<SidebarItem>(PREPARATION_SECTION)
const activeTopNavItem = ref<TopNavItem | null>(null)
const theme = ref<ThemeMode>('light')

function selectSidebarItem(item: SidebarItem) {
  activeSidebarItem.value = item
  activeTopNavItem.value = null
}

function openNewSearch() {
  activeTopNavItem.value = NEW_SEARCH_NAV_ITEM
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

onMounted(() => {
  const savedTheme = window.localStorage.getItem('theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.value = savedTheme
  }
})

watch(
  theme,
  (nextTheme) => {
    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem('theme', nextTheme)
  },
  { immediate: true },
)
</script>

<template>
  <div class="app-layout">
    <ProjectSidebar
      :active-item="activeTopNavItem ? null : activeSidebarItem"
      :items="sidebarItems"
      :theme="theme"
      @select-new-search="openNewSearch"
      @toggle-theme="toggleTheme"
      @update:active-item="selectSidebarItem"
    />

    <main class="workspace">
      <ProjectTopbar
        v-model:active-item="activeTopNavItem"
        :items="topNavItems"
      />
      <HomeWorkspace
        :active-section="activeSidebarItem"
        :active-top-nav-item="activeTopNavItem"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import {
  companyReferenceItems,
  CONCLUSIONS_RECOMMENDATIONS_SECTION,
  NEW_SEARCH_NAV_ITEM,
  NEXT_STEPS_SECTION,
  PREPARATION_SECTION,
  protocolFlowItems,
  protocolFlowLabels,
  sidebarItems,
  topNavItems,
  type SidebarItem,
  type TopNavItem,
} from '@/pages/home/model/navigation'
import { selectedStrategy } from '@/pages/home/model/demoProtocol'
import HomeWorkspace from '@/pages/home/ui/HomeWorkspace.vue'
import ProjectSidebar from '@/pages/home/ui/ProjectSidebar.vue'
import ProjectTopbar from '@/pages/home/ui/ProjectTopbar.vue'

type ThemeMode = 'light' | 'dark'

const activeSidebarItem = ref<SidebarItem>(PREPARATION_SECTION)
const activeTopNavItem = ref<TopNavItem | null>(NEW_SEARCH_NAV_ITEM)
const theme = ref<ThemeMode>('dark')
const isBuildingNextSteps = ref(false)

function selectSidebarItem(item: SidebarItem) {
  activeSidebarItem.value = item
  activeTopNavItem.value = null
}

function openNewSearch() {
  activeTopNavItem.value = NEW_SEARCH_NAV_ITEM
}

function openProtocol() {
  activeSidebarItem.value = PREPARATION_SECTION
  activeTopNavItem.value = null
}

const flowActionLabel = computed(() => {
  if (activeTopNavItem.value) {
    return null
  }

  if (isReferenceSection.value) {
    return 'Вернуться к дальнейшим шагам'
  }

  return protocolFlowLabels[activeSidebarItem.value] ?? null
})

const isReferenceSection = computed(() => {
  return companyReferenceItems.some(
    (item) => item.section === activeSidebarItem.value,
  )
})

const nextFlowSection = computed(() => {
  const currentIndex = protocolFlowItems.findIndex(
    (item) => item === activeSidebarItem.value,
  )

  if (currentIndex < 0 || activeTopNavItem.value) {
    return null
  }

  return protocolFlowItems[currentIndex + 1] ?? null
})

const isStrategyGateActive = computed(() => {
  return (
    activeSidebarItem.value === CONCLUSIONS_RECOMMENDATIONS_SECTION &&
    !selectedStrategy.value
  )
})

const flowActionStatus = computed(() => {
  if (isBuildingNextSteps.value) {
    return 'Формируем дальнейшие шаги'
  }

  if (isStrategyGateActive.value) {
    return 'Сначала выберите стратегию входа'
  }

  return null
})

async function runFlowAction() {
  if (isStrategyGateActive.value || isBuildingNextSteps.value) {
    return
  }

  if (isReferenceSection.value) {
    selectSidebarItem(NEXT_STEPS_SECTION)
    return
  }

  if (
    activeSidebarItem.value === CONCLUSIONS_RECOMMENDATIONS_SECTION &&
    nextFlowSection.value === NEXT_STEPS_SECTION
  ) {
    isBuildingNextSteps.value = true
    await new Promise((resolve) => {
      window.setTimeout(resolve, 1600)
    })
    isBuildingNextSteps.value = false
    selectSidebarItem(NEXT_STEPS_SECTION)
    return
  }

  if (nextFlowSection.value) {
    selectSidebarItem(nextFlowSection.value)
    return
  }

  openNewSearch()
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
        :flow-action-disabled="isStrategyGateActive"
        :flow-action-label="flowActionLabel"
        :flow-action-loading="isBuildingNextSteps"
        :flow-action-status="flowActionStatus"
        :items="topNavItems"
        @run-flow-action="runFlowAction"
      />
      <HomeWorkspace
        :active-section="activeSidebarItem"
        :active-top-nav-item="activeTopNavItem"
        @navigate-section="selectSidebarItem"
        @open-protocol="openProtocol"
      />
    </main>
  </div>
</template>

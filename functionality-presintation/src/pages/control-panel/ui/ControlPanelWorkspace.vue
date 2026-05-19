<script setup lang="ts">
import {
  ABOUT_APP_NAV_ITEM,
  NEW_SEARCH_NAV_ITEM,
  SEARCH_HISTORY_NAV_ITEM,
  type TopNavItem,
} from '@/pages/home/model/navigation'
import AboutAppPanel from '@/pages/home/ui/AboutAppPanel.vue'
import NewSearchPanel from '@/pages/home/ui/NewSearchPanel.vue'
import SearchHistoryPanel from '@/pages/home/ui/SearchHistoryPanel.vue'
import AgentChatPanel from '@/pages/control-panel/ui/AgentChatPanel.vue'
import ControlPanelMain from '@/pages/control-panel/ui/ControlPanelMain.vue'

defineProps<{
  activeTopNavItem: TopNavItem | null
}>()

const emit = defineEmits<{
  openProtocol: []
}>()
</script>

<template>
  <section class="control-panel-workspace" aria-label="Панель управления">
    <div class="control-panel-workspace__main">
      <NewSearchPanel
        v-if="activeTopNavItem === NEW_SEARCH_NAV_ITEM"
        @open-protocol="emit('openProtocol')"
      />
      <SearchHistoryPanel
        v-else-if="activeTopNavItem === SEARCH_HISTORY_NAV_ITEM"
      />
      <AboutAppPanel v-else-if="activeTopNavItem === ABOUT_APP_NAV_ITEM" />
      <ControlPanelMain v-else />
    </div>

    <AgentChatPanel />
  </section>
</template>

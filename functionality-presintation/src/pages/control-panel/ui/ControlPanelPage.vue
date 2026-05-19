<script setup lang="ts">
import { ref } from 'vue'

import { topNavItems, type TopNavItem } from '@/pages/home/model/navigation'
import ConnectionGraphModal from '@/pages/control-panel/ui/ConnectionGraphModal.vue'
import ControlPanelWorkspace from '@/pages/control-panel/ui/ControlPanelWorkspace.vue'
import ProjectTopbar from '@/pages/home/ui/ProjectTopbar.vue'

defineProps<{
  activeTopNavItem: TopNavItem | null
}>()

const emit = defineEmits<{
  'update:activeTopNavItem': [item: TopNavItem]
  closeControlPanel: []
  openProtocol: []
}>()

const isGraphBrowseOpen = ref(false)

function onTopNavSelect(item: TopNavItem) {
  emit('update:activeTopNavItem', item)
}
</script>

<template>
  <div class="control-panel-layout">
    <main class="workspace control-panel-layout__workspace">
      <ProjectTopbar
        :active-item="activeTopNavItem"
        :flow-action-disabled="false"
        :flow-action-label="null"
        :flow-action-loading="false"
        :flow-action-status="null"
        :items="topNavItems"
        :show-control-panel="true"
        :control-panel-active="true"
        @update:active-item="onTopNavSelect"
        @open-control-panel="emit('closeControlPanel')"
      >
        <template #leading>
          <button
            class="topbar__back"
            type="button"
            @click="emit('closeControlPanel')"
          >
            ← К проекту
          </button>
          <button
            class="topbar__graph"
            type="button"
            @click="isGraphBrowseOpen = true"
          >
            Граф связей
          </button>
        </template>
      </ProjectTopbar>

      <ControlPanelWorkspace
        :active-top-nav-item="activeTopNavItem"
        @open-protocol="emit('openProtocol')"
      />
    </main>

    <ConnectionGraphModal
      v-if="isGraphBrowseOpen"
      mode="browse"
      @close="isGraphBrowseOpen = false"
    />
  </div>
</template>

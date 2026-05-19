<script setup lang="ts">
import ControlPanelForms from '@/pages/control-panel/ui/ControlPanelForms.vue'
import DataVerificationColumn from '@/pages/control-panel/ui/DataVerificationColumn.vue'
import VerificationCategoryModal from '@/pages/control-panel/ui/VerificationCategoryModal.vue'
import MeetingDetailModal from '@/pages/control-panel/ui/MeetingDetailModal.vue'
import MeetingsColumn from '@/pages/control-panel/ui/MeetingsColumn.vue'
</script>

<template>
  <div class="control-panel-main">
    <section class="control-panel-sideboards" aria-label="Списки панели управления">
      <MeetingsColumn />
      <DataVerificationColumn />
    </section>

    <ControlPanelForms />
    <MeetingDetailModal />
    <VerificationCategoryModal />
  </div>
</template>

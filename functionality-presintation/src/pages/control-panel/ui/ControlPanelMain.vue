<script setup lang="ts">
import ControlPanelForms from '@/pages/control-panel/ui/ControlPanelForms.vue'
import DataVerificationColumn from '@/pages/control-panel/ui/DataVerificationColumn.vue'
import VerificationCategoryModal from '@/pages/control-panel/ui/VerificationCategoryModal.vue'
import MeetingDetailModal from '@/pages/control-panel/ui/MeetingDetailModal.vue'
import MeetingsColumn from '@/pages/control-panel/ui/MeetingsColumn.vue'
</script>

<template>
  <div class="control-panel-main">
    <aside class="control-panel-ops" aria-label="Операции под рукой">
      <header class="control-panel-ops__header">
        <p>Нужно сейчас</p>
      </header>
      <MeetingsColumn />
      <DataVerificationColumn />
    </aside>

    <section class="control-panel-main__workspace" aria-label="Работа с карточкой">
      <ControlPanelForms />
    </section>
    <MeetingDetailModal />
    <VerificationCategoryModal />
  </div>
</template>

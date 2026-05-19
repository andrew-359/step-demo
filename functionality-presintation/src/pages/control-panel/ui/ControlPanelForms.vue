<script setup lang="ts">
import { graphCardSyncNotice } from '@/pages/control-panel/model/syncGraphCardFromForm'
import CompanyCardForm from '@/pages/control-panel/ui/CompanyCardForm.vue'
import PersonCardForm from '@/pages/control-panel/ui/PersonCardForm.vue'
import ProjectCardForm from '@/pages/control-panel/ui/ProjectCardForm.vue'
</script>

<template>
  <div class="control-panel-forms">
    <p
      v-if="graphCardSyncNotice"
      class="control-panel-forms__notice"
      role="status"
      aria-live="polite"
    >
      {{ graphCardSyncNotice }}
    </p>

    <PersonCardForm />
    <CompanyCardForm />
    <ProjectCardForm />
  </div>
</template>

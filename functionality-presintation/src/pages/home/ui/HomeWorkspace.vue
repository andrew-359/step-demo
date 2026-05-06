<script setup lang="ts">
import {
  ABOUT_PROJECT_SECTION,
  ABOUT_APP_NAV_ITEM,
  COMPANY_RELATIONSHIP_MAP_SECTION,
  CONCLUSIONS_RECOMMENDATIONS_SECTION,
  CUSTOMER_COMPANY_STRUCTURE_SECTION,
  FINANCIAL_INDICATORS_SECTION,
  KEY_COMPANY_FIGURES_SECTION,
  LEGAL_RISKS_ARBITRATION_SECTION,
  NEW_SEARCH_NAV_ITEM,
  NEXT_STEPS_SECTION,
  PREPARATION_SECTION,
  PROJECT_INFRASTRUCTURE_MAP_SECTION,
  PROJECT_PARTICIPANTS_SECTION,
  RELATIONSHIP_MAP_SECTION,
  SEARCH_HISTORY_NAV_ITEM,
  type SidebarItem,
  type TopNavItem,
} from '@/pages/home/model/navigation'
import AboutAppPanel from '@/pages/home/ui/AboutAppPanel.vue'
import AboutProjectSection from '@/pages/home/ui/AboutProjectSection.vue'
import CompanyRelationshipMapSection from '@/pages/home/ui/CompanyRelationshipMapSection.vue'
import ConclusionsRecommendationsSection from '@/pages/home/ui/ConclusionsRecommendationsSection.vue'
import CustomerCompanyStructureSection from '@/pages/home/ui/CustomerCompanyStructureSection.vue'
import FinancialIndicatorsSection from '@/pages/home/ui/FinancialIndicatorsSection.vue'
import KeyCompanyFiguresSection from '@/pages/home/ui/KeyCompanyFiguresSection.vue'
import LegalRisksArbitrationSection from '@/pages/home/ui/LegalRisksArbitrationSection.vue'
import NewSearchPanel from '@/pages/home/ui/NewSearchPanel.vue'
import NextStepsSection from '@/pages/home/ui/NextStepsSection.vue'
import PreparationProjectSection from '@/pages/home/ui/PreparationProjectSection.vue'
import ProjectInfrastructureMapSection from '@/pages/home/ui/ProjectInfrastructureMapSection.vue'
import ProjectParticipantsSection from '@/pages/home/ui/ProjectParticipantsSection.vue'
import RelationshipMapSection from '@/pages/home/ui/RelationshipMapSection.vue'
import SearchHistoryPanel from '@/pages/home/ui/SearchHistoryPanel.vue'

defineProps<{
  activeSection: SidebarItem
  activeTopNavItem: TopNavItem | null
}>()

const emit = defineEmits<{
  openProtocol: []
  navigateSection: [section: SidebarItem]
}>()
</script>

<template>
  <section class="workspace__empty" aria-label="Основная область">
    <NewSearchPanel
      v-if="activeTopNavItem === NEW_SEARCH_NAV_ITEM"
      @open-protocol="emit('openProtocol')"
    />
    <SearchHistoryPanel v-else-if="activeTopNavItem === SEARCH_HISTORY_NAV_ITEM" />
    <AboutAppPanel v-else-if="activeTopNavItem === ABOUT_APP_NAV_ITEM" />
    <CompanyRelationshipMapSection
      v-else-if="activeSection === COMPANY_RELATIONSHIP_MAP_SECTION"
    />
    <PreparationProjectSection v-else-if="activeSection === PREPARATION_SECTION" />
    <AboutProjectSection v-else-if="activeSection === ABOUT_PROJECT_SECTION" />
    <ProjectParticipantsSection
      v-else-if="activeSection === PROJECT_PARTICIPANTS_SECTION"
    />
    <CustomerCompanyStructureSection
      v-else-if="activeSection === CUSTOMER_COMPANY_STRUCTURE_SECTION"
    />
    <KeyCompanyFiguresSection
      v-else-if="activeSection === KEY_COMPANY_FIGURES_SECTION"
    />
    <FinancialIndicatorsSection
      v-else-if="activeSection === FINANCIAL_INDICATORS_SECTION"
    />
    <LegalRisksArbitrationSection
      v-else-if="activeSection === LEGAL_RISKS_ARBITRATION_SECTION"
    />
    <ProjectInfrastructureMapSection
      v-else-if="activeSection === PROJECT_INFRASTRUCTURE_MAP_SECTION"
    />
    <ConclusionsRecommendationsSection
      v-else-if="activeSection === CONCLUSIONS_RECOMMENDATIONS_SECTION"
    />
    <RelationshipMapSection
      v-else-if="activeSection === RELATIONSHIP_MAP_SECTION"
    />
    <NextStepsSection
      v-else-if="activeSection === NEXT_STEPS_SECTION"
      @open-reference="emit('navigateSection', $event)"
    />
  </section>
</template>

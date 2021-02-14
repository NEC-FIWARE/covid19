<template>
  <cards-lazy-row :rows="rows" />
</template>

<script lang="ts">
/* eslint-disable simple-import-sort/sort -- ブラウザでの表示順に合わせて各 card の component を import する */
import Vue from 'vue'

// 陽性者の属性
const ConfirmedCasesAttributesCard = () =>
  import('@/components/cards/ConfirmedCasesAttributesCard.vue')
// // 陽性者数（区市町村別）
// const ConfirmedCasesByMunicipalitiesCard = () =>
//   import('@/components/cards/ConfirmedCasesByMunicipalitiesCard.vue')
// // 発症日別による陽性者数の推移
// const PositiveNumberByDevelopedDateCard = () =>
//   import('@/components/cards/PositiveNumberByDevelopedDateCard.vue')
// // 確定日別による陽性者数の推移
// const PositiveNumberByDiagnosedDateCard = () =>
//   import('@/components/cards/PositiveNumberByDiagnosedDateCard.vue')
// // 検査実施件数
// const TestedNumberCard = () => import('@/components/cards/TestedNumberCard.vue')
// 検査実施件数
const TestedNumberCard2 = () => import('@/components/cards/TestedNumberCard2.vue')
// 検査実施人数
const TestPeopleDailyAggregated = () => import('@/components/cards/TestPeopleDailyAggregated.vue')
// 陽性確認数
const Covid19ConfirmNegativeDailyAggregated = () => import('@/components/cards/Covid19ConfirmNegativeDailyAggregated.vue')

// 新型コロナコールセンター相談件数
const TelephoneAdvisoryReportsNumberCard = () =>
  import('@/components/cards/TelephoneAdvisoryReportsNumberCard.vue')

export default Vue.extend({
  data() {
    return {
      rows: [
        [ConfirmedCasesAttributesCard, TelephoneAdvisoryReportsNumberCard],
        [TestedNumberCard2, TestPeopleDailyAggregated],
        [Covid19ConfirmNegativeDailyAggregated],
      ],
    }
  },
})
</script>

<template>
  <component :is="cardComponent" />
</template>

<script>
/* eslint-disable simple-import-sort/sort -- ブラウザでの表示順に合わせて各 card の component を import する */
// ---- モニタリング項目
// 検査陽性者の状況
import ConfirmedCasesDetailsCard from '@/components/cards/ConfirmedCasesDetailsCard.vue'
// 報告日別による陽性者数の推移
import ConfirmedCasesNumberCard from '@/components/cards/ConfirmedCasesNumberCard.vue'
// モニタリング項目
import MonitoringItemsOverviewCard from '@/components/cards/MonitoringItemsOverviewCard.vue'
// モニタリング項目(1)新規陽性者数
import MonitoringConfirmedCasesNumberCard from '@/components/cards/MonitoringConfirmedCasesNumberCard.vue'
// ---- その他 参考指標
// 陽性者の属性
import ConfirmedCasesAttributesCard from '@/components/cards/ConfirmedCasesAttributesCard.vue'
/* eslint-enable simple-import-sort/sort */
// 検査実施件数2
import TestedNumberCard2 from '@/components/cards/TestedNumberCard2.vue'
// 新型コロナコールセンター相談件数
import TelephoneAdvisoryReportsNumberCard from '@/components/cards/TelephoneAdvisoryReportsNumberCard.vue'
// 陽性確認数
import Covid19ConfirmNegativeDailyAggregated from '@/components/cards/Covid19ConfirmNegativeDailyAggregated.vue'
// 検査実施人数
import TestPeopleDailyAggregated from '@/components/cards/TestPeopleDailyAggregated.vue'

import { getLinksLanguageAlternative } from '@/utils/i18nUtils'

export default {
  components: {
    // ---- モニタリング項目
    ConfirmedCasesDetailsCard,
    ConfirmedCasesNumberCard,
    MonitoringItemsOverviewCard,
    MonitoringConfirmedCasesNumberCard,
    // ---- その他 参考指標
    ConfirmedCasesAttributesCard,
    TelephoneAdvisoryReportsNumberCard,
    TestedNumberCard2,
    Covid19ConfirmNegativeDailyAggregated,
    TestPeopleDailyAggregated,
  },
  data() {
    let title, updatedAt, cardComponent
    switch (this.$route.params.card) {
      // NOTE: 以下，ブラウザでの表示順に合わせて条件分岐を行う
      // ---- モニタリング項目
      // 検査陽性者の状況
      case 'details-of-confirmed-cases':
        cardComponent = 'confirmed-cases-details-card'
        break
      // 報告日別による陽性者数の推移
      case 'number-of-confirmed-cases':
        cardComponent = 'confirmed-cases-number-card'
        break
      // モニタリング項目
      case 'monitoring-items-overview':
        cardComponent = 'monitoring-items-overview-card'
        break
      // モニタリング項目(1)新規陽性者数
      case 'monitoring-number-of-confirmed-cases':
        cardComponent = 'monitoring-confirmed-cases-number-card'
        break
      // モニタリング項目(2)#7119における発熱等相談件数
      case 'number-of-reports-to-consultations-about-fever-in-7119':
        cardComponent = 'consultation-about-fever-number-card'
        break
      // モニタリング項目(3)新規陽性者における接触歴等不明者数
      case 'untracked-rate':
        cardComponent = 'untracked-rate-card'
        break
      // モニタリング項目(4)検査の陽性率
      case 'positive-rate':
        cardComponent = 'positive-rate-card'
        break
      // モニタリング項目(5)救急医療の東京ルールの適用件数
      case 'number-of-tokyo-rules-applied':
        cardComponent = 'tokyo-rules-application-number-card'
        break
      // モニタリング項目(6)入院患者数
      case 'number-of-hospitalized':
        cardComponent = 'hospitalized-number-card'
        break
      // モニタリング項目(7)重症患者数
      case 'positive-status-severe-case':
        cardComponent = 'severe-case-card'
        break
      // ---- その他 参考指標
      // 陽性者の属性
      case 'attributes-of-confirmed-cases':
        cardComponent = 'confirmed-cases-attributes-card'
        break
      // 陽性者数（区市町村別）
      case 'number-of-confirmed-cases-by-municipalities':
        cardComponent = 'confirmed-cases-by-municipalities-card'
        break
      // 発症日別による陽性者数の推移
      case 'positive-number-by-developed-date':
        cardComponent = 'positive-number-by-developed-date-card'
        break
      // 確定日別による陽性者数の推移
      case 'positive-number-by-diagnosed-date':
        cardComponent = 'positive-number-by-diagnosed-date-card'
        break
      // 検査実施件数
      case 'number-of-tested':
        cardComponent = 'tested-number-card2'
        break
      // 新型コロナコールセンター相談件数
      case 'number-of-reports-to-covid19-telephone-advisory-center':
        cardComponent = 'telephone-advisory-reports-number-card'
        break
      // 受診相談窓口における相談件数
      case 'monitoring-number-of-reports-to-covid19-consultation-desk':
        cardComponent = 'monitoring-consultation-desk-reports-number-card'
        break
      // 東京都発熱相談センターにおける相談件数
      case 'number-of-reports-to-tokyo-fever-consultation-center':
        cardComponent = 'tokyo-fever-consultation-center-reports-number-card'
        break
      // 都営地下鉄の利用者数の推移
      case 'predicted-number-of-toei-subway-passengers':
        cardComponent = 'metro-card'
        break
      // 都庁来庁者数の推移
      case 'agency':
        cardComponent = 'agency-card'
        break
      // 検査実施人数
      case 'number-of-people-tested':
        cardComponent = 'test-people-daily-aggregated'
        break
      // 陰性確認数
      case 'confirm-negative':
        cardComponent = 'covid19-confirm-negative-daily-aggregated'
        break
    }

    return {
      cardComponent,
      title,
      updatedAt,
    }
  },
  head() {
    const url = 'https://github.com/NEC-FIWARE/covid19'
    const description =
      '当サイトは新型コロナウイルス感染症 (COVID-19) に関する最新情報を提供するために、開設したものです。'
    const defaultTitle = `${this.$t('新型コロナウイルス感染症')}${this.$t(
      '対策サイト'
    )}`

    return {
      titleTemplate: (title) => `${this.title || title} | ${defaultTitle}`,
      link: [
        ...getLinksLanguageAlternative(
          `cards/${this.$route.params.card}`,
          this.$i18n.locales,
          this.$i18n.defaultLocale
        ),
      ],
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${url}${this.$route.path}/`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          template: (title) =>
            title !== ''
              ? `${this.title || title} | ${defaultTitle}`
              : `${defaultTitle}`,
          content: '',
        },
        {
          hid: 'description',
          name: 'description',
          template: (updatedAt) =>
            updatedAt !== ''
              ? `${this.updatedAt || updatedAt} | ${description}`
              : `${description}`,
          content: '',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          template: (updatedAt) =>
            updatedAt !== ''
              ? `${this.updatedAt || updatedAt} | ${description}`
              : `${description}`,
          content: '',
        },
      ],
    }
  },
}
</script>

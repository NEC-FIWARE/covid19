<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <time-bar-chart
        :title="$t('新型コロナコールセンター相談件数')"
        :title-id="'number-of-reports-to-covid19-telephone-advisory-center'"
        :chart-id="'time-bar-chart-contacts'"
        :chart-data="contactsGraph"
        :date="date"
        :unit="$t('件.reports')"
        :url="'https://github.com/NEC-FIWARE/covid19'"
      />
      <!-- 件.reports = 窓口相談件数 -->
    </client-only>
  </v-col>
</template>

<script>
import TimeBarChart from '@/components/TimeBarChart.vue'
import fiwareClient from '@/utils/fiwareClient'
import formatGraph from '@/utils/formatGraph'

export default {
  components: {
    TimeBarChart,
  },
  // data() {
  //   const { contacts } = Data
  //   const { date } = contacts
  //   // 相談件数
  //   const contactsGraph = formatGraph(contacts.data)

  //   return {
  //     contactsGraph,
  //     date,
  //   }
  // },
  data() {
    return {
      contactsGraph: [{ label: '2020-01-01', transition: 0, cumulative: 0 }],
      date: '2020/01/01 00:00',
    }
  },
  async beforeCreate() {
    // FiwareCLientを利用してコールセンター相談件数を取得する
    const entity = await fiwareClient.get('Covid19CallCenterDailyAggregated')

    // 相談件数からグラフデータを生成する
    if (entity.data.length) {
      this.contactsGraph = formatGraph(entity.data)
    }

    // 日付データを設定する
    this.date = entity.date
  },
}
</script>

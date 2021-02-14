<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <time-bar-chart
        :title="$t('検査実施人数')"
        :title-id="'number-of-people-tested'"
        :chart-id="'time-bar-chart-contacts'"
        :chart-data="contactsGraph"
        :date="date"
        :unit="$t('人')"
        :url="''"
      />
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
  data() {
    return {
      contactsGraph: [{ label: '2020-01-01', transition: 0, cumulative: 0 }],
      date: '2020/01/01 00:00',
    }
  },
  async beforeCreate() {
    // FiwareCLientを利用して検査人数を取得する
    const entity = await fiwareClient.get('Covid19TestPeopleDailyAggregated')

    // 検査人数からグラフデータを生成する
    if (entity.data.length) {
      this.contactsGraph = formatGraph(entity.data)
    }

    // 日付データを設定する
    this.date = entity.date
  },
}
</script>

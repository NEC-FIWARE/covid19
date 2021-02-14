<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <time-bar-chart
        :title="$t('報告日別による陽性者数の推移')"
        :title-id="'number-of-confirmed-cases'"
        :chart-id="'time-bar-chart-patients'"
        :chart-data="patientsGraph"
        :date="date"
        :unit="$t('人')"
        :by-date="true"
        :url="'https://github.com/NEC-FIWARE/covid19'"
      >
        <!--
        <template v-slot:additionalDescription>
          <div class="Description-ExternalLink">
          </div>
          <span>{{ $t('（注）') }}</span>
          <ul>
            <li>
              {{ $t('保健所から発生届が提出された日を基準とする') }}
            </li>
            <li>
              {{ $t('医療機関等が行った検査も含む') }}
            </li>
            <li>
              {{ $t('チャーター機帰国者、クルーズ船乗客等は含まれていない') }}
            </li>
          </ul>
        </template>
        -->
      </time-bar-chart>
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
  //   // 感染者数グラフ
  //   const patientsGraph = formatGraph(Data.patients_summary.data)
  //   const date = Data.patients_summary.date

  //   return {
  //     patientsGraph,
  //     date,
  //   }
  // },
  data() {
    return {
      patientsGraph: [{ label: '2020-01-01', transition: 0, cumulative: 0 }],
      date: '2020/01/01 00:00',
    }
  },
  async beforeCreate() {
    // FiwareCLientを利用して陽性者数を取得する
    const entity = await fiwareClient.get('Covid19PatientsDailyAggregated')

    // 相談件数からグラフデータを生成する
    if (entity.data.length) {
      this.patientsGraph = await formatGraph(entity.data)
    }

    // 日付データを設定する
    this.date = entity.date
  },
}
</script>

<style lang="scss" scoped>
.Description-Link {
  text-decoration: none;
  @include button-text('sm');
}
.Description-ExternalLink {
  margin-bottom: 10px;
}
</style>

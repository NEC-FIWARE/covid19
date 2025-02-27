<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <monitoring-confirmed-cases-chart
        :title="$t('モニタリング項目(1)')"
        title-id="monitoring-number-of-confirmed-cases"
        :info-titles="[$t('新規陽性者数')]"
        chart-id="monitoring-confirmed-cases-chart"
        :chart-data="chartData"
        :get-formatter="getFormatter"
        :date="date"
        :labels="labels"
        :data-labels="dataLabels"
        :table-labels="tableLabels"
        :unit="$t('人')"
        url="https://github.com/NEC-FIWARE/covid19"
      >
        <template v-slot:additionalDescription>
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
            <li>
              {{
                $t(
                  '集団感染発生や曜日による数値のばらつきにより、日々の結果が変動するため、こうしたばらつきを平準化し全体の傾向を見る趣旨から、過去７日間の移動平均値を折れ線グラフで示す（例えば、5月7日の移動平均値は、5月1日から5月7日までの実績値を平均したもの）'
                )
              }}
            </li>
          </ul>
        </template>
      </monitoring-confirmed-cases-chart>
    </client-only>
  </v-col>
</template>

<script>
import MonitoringConfirmedCasesChart from '@/components/MonitoringConfirmedCasesChart.vue'
import fiwareClient from '@/utils/fiwareClient'
// import Data from '@/data/daily_positive_detail.json'
import {
  getNumberToFixedFunction,
  getNumberToLocaleStringFunction,
} from '@/utils/monitoringStatusValueFormatters'

export default {
  components: {
    MonitoringConfirmedCasesChart,
  },
  // data() {
  //   const [patientsCount, sevenDayMoveAverages, labels] = Data.data.reduce(
  //     (res, data) => {
  //       res[0].push(data.count)
  //       res[1].push(data.weekly_average_count)
  //       res[2].push(data.diagnosed_date)
  //       return res
  //     },
  //     [[], [], []]
  //   )
  //   const chartData = [patientsCount, sevenDayMoveAverages]
  //   const dataLabels = [this.$t('陽性者数'), this.$t('７日間移動平均')]
  //   const tableLabels = [this.$t('陽性者数'), this.$t('７日間移動平均')]
  //   const date = Data.date

  //   const getFormatter = (columnIndex) => {
  //     // モニタリング指標(1)新規陽性者数の7日間移動平均は小数点第1位まで表示する。
  //     if (columnIndex === 1) {
  //       return getNumberToFixedFunction(1)
  //     }
  //     return getNumberToLocaleStringFunction()
  //   }

  //   return {
  //     chartData,
  //     date,
  //     labels,
  //     dataLabels,
  //     tableLabels,
  //     getFormatter,
  //   }
  // },
  data() {
    const getFormatter = (columnIndex) => {
      // モニタリング指標(1)新規陽性者数の7日間移動平均は小数点第1位まで表示する。
      if (columnIndex === 1) {
        return getNumberToFixedFunction(1)
      }
      return getNumberToLocaleStringFunction()
    }
    return {
      chartData: [[0], [0]],
      date: '2020/01/01 00:00',
      labels: ['2020/01/01 00:00'],
      dataLabels: [this.$t('陽性者数'), this.$t('７日間移動平均')],
      tableLabels: [this.$t('陽性者数'), this.$t('７日間移動平均')],
      getFormatter,
    }
  },
  async beforeCreate() {
    // FiwareCLientを利用して陽性者数を取得する
    const entity = await fiwareClient.get('Covid19PatientsDailyAggregated')
    if (entity.data.length === 0) {
      return
    }

    const [patientsCount, sevenDayMoveAverages, labels] = entity.data.reduce(
      (res, data) => {
        res[0].push(data.count)
        res[1].push(data.weekly_average_count)
        res[2].push(data.diagnosed_date)
        return res
      },
      [[], [], []]
    )
    this.chartData = [patientsCount, sevenDayMoveAverages]
    this.date = entity.date
    this.labels = labels
  },
}
</script>

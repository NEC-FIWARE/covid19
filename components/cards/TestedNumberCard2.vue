<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <time-bar-chart
        :title="$t('検査実施件数')"
        :title-id="'number-of-tested'"
        :chart-id="'time-bar-chart-contacts'"
        :chart-data="contactsGraph"
        :date="date"
        :unit="$t('件.reports')"
        :url="''"
      />
      <!-- 件.tested = 検査数 -->
      <template v-slot:additionalDescription>
        <span>{{ $t('（注）') }}</span>
        <ul>
          <li>
            {{
              $t(
                '検体採取日を基準とする。ただし、一部検査結果判明日に基づくものを含む'
              )
            }}
          </li>
          <li>
            {{ $t('同一の対象者について複数の検体を検査する場合がある') }}
          </li>
          <li>
            {{ $t('5月13日以降は、PCR検査に加え、抗原検査の件数を含む') }}
          </li>
          <li>
            {{
              $t(
                '速報値として公開するものであり、後日確定データとして修正される場合がある'
              )
            }}
          </li>
        </ul>
      </template>
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
    // FiwareCLientを利用して検査件数を取得する

    const entity = await fiwareClient.get('Covid19TestCountDailyAggregated')

    // 日付データを設定する
    this.date = entity.date

    // 相談件数からグラフデータを生成する
    if (entity.data.length) {
      this.contactsGraph = formatGraph(entity.data)
    }
  },
}
</script>

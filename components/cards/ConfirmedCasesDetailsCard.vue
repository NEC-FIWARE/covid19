<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <data-view
        :title="$t('検査陽性者の状況')"
        :title-id="'details-of-confirmed-cases'"
        :date="date"
      >
        <!--
        <template v-slot:additionalDescription>
          <span>{{ $t('（注）') }}</span>
          <ul>
            <li>
              {{ $t('チャーター機帰国者、クルーズ船乗客等は含まれていない') }}
            </li>
            <li>
              {{
                $t(
                  '「重症」は、人工呼吸器管理（ECMOを含む）が必要な患者数を計上。'
                )
              }}
              <app-link
                to="https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/011/435/7kai/202008207.pdf"
              >
                {{ $t('重症基準の考え方はこちら') }}
              </app-link>
            </li>
            <li>
              {{
                $t(
                  '退院者数の把握には一定の期間を要しており、確認次第数値を更新している'
                )
              }}
            </li>
          </ul>
        </template>
        -->
        <confirmed-cases-details-table
          :aria-label="$t('検査陽性者の状況')"
          v-bind="confirmedCases"
        />
        <!--
        <div>
          <app-link
            :class="$style.button"
            to="https://www.fukushihoken.metro.tokyo.lg.jp/iryo/kansen/shibou.html"
          >
            {{ $t('死亡日別による死亡者数の推移はこちら') }}
          </app-link>
        </div>
        -->
      </data-view>
    </client-only>
  </v-col>
</template>

<script>
import dayjs from 'dayjs'

import ConfirmedCasesDetailsTable from '@/components/ConfirmedCasesDetailsTable.vue'
import DataView from '@/components/DataView.vue'
import fiwareClient from '@/utils/fiwareClient'

export default {
  components: {
    DataView,
    ConfirmedCasesDetailsTable,
  },
  // data() {
  //  const mainSummary = Data.main_summary
  //  // 検査陽性者の状況
  //  const confirmedCases = formatConfirmedCases(mainSummary)

  //  const date = dayjs(mainSummary.children[0].date).format('YYYY/MM/DD HH:mm')

  //  return {
  //    confirmedCases,
  //    date,
  //  }
  // },
  data() {
    const confirmedCases = {
      date: '2020/01/01 00:00:00',
      陽性者数: 0,
      入院中: 0,
      軽症中等症: 0,
      重症: 0,
      宿泊療養: 0,
      自宅療養: 0,
      調査中: 0,
      死亡: 0,
      退院: 0,
      検査実施人数: 0,
      検査実施件数: 0,
      陰性確認数: 0,
      コールセンター相談件数: 0,
    }

    return {
      confirmedCases,
      date: '2020/01/01 00:00',
    }
  },
  async beforeCreate() {
    const entity = await fiwareClient.get('Covid19PatientsSummary')
    this.confirmedCases = entity.data.summary
    this.date = dayjs(entity.data.summary.date).format('YYYY/MM/DD HH:mm')
  },
}
</script>

<style lang="scss" module>
.button {
  margin: 20px 0 0;
  color: $green-1 !important;
  &:hover {
    color: $white !important;
  }

  @include button-text('sm');
}
</style>

<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <data-view
        :title="$t('モニタリング項目')"
        title-id="monitoring-items-overview"
        :date="monitoringItemsData.date"
      >
        <template v-slot:additionalDescription>
          <span>{{ $t('（注）') }}</span>
          <ul>
            <li>
              <i18n
                tag="span"
                path="{number}：急病やけがの際に、緊急受診の必要性や診察可能な医療機関をアドバイスする電話相談窓口"
              >
                <template v-slot:number>
                  <dfn>#7119</dfn>
                </template>
              </i18n>
            </li>
            <li>
              {{
                $t(
                  '救急医療の東京ルールの適用件数：救急隊による5医療機関への受入要請又は選定開始から20分以上経過しても搬送先が決定しない事案の件数'
                )
              }}
            </li>
            <li>
              {{ $t('(1)～(5)は7日間移動平均で算出') }}
            </li>
            <li>
              {{ $t('(2)(4)(5)は報告日の前日時点の数値') }}
            </li>
            <li>
              {{ $t('(6)の確保病床数には、(7)の確保病床数を含む') }}
            </li>
            <li>
              {{ $t('速報値として公表するものであり、後日修正する場合がある') }}
            </li>
            <li>
              {{
                $t(
                  '(2)(5)は土曜日、日曜日、祝日は更新しない。(4)は日曜日、祝日は更新しない'
                )
              }}
            </li>
          </ul>
        </template>
        <section>
          <h4>{{ $t('感染状況') }}</h4>
          <monitoring-items-overview-table-infection-status
            :aria-label="$t('感染状況')"
            :items="monitoringItems"
          />
        </section>
        <section>
          <h4>{{ $t('医療提供体制') }}</h4>
          <monitoring-items-overview-table-medical-system
            :aria-label="$t('医療提供体制')"
            :items="monitoringItems"
          />
        </section>
      </data-view>
    </client-only>
  </v-col>
</template>

<script>
import AppLink from '@/components/AppLink.vue'
import DataView from '@/components/DataView.vue'
import MonitoringItemsOverviewTableInfectionStatus from '@/components/MonitoringItemsOverviewTableInfectionStatus.vue'
import MonitoringItemsOverviewTableMedicalSystem from '@/components/MonitoringItemsOverviewTableMedicalSystem.vue'
//import monitoringItemsData from '@/data/monitoring_items.json'
import { formatMonitoringItems } from '@/utils/formatMonitoringItems'
import fiwareClient from '@/utils/fiwareClient'

export default {
  components: {
    DataView,
    MonitoringItemsOverviewTableInfectionStatus,
    MonitoringItemsOverviewTableMedicalSystem,
    AppLink,
  },
  // data() {
  //   const monitoringItems = formatMonitoringItems(monitoringItemsData.data)
  //   return {
  //     monitoringItemsData,
  //     monitoringItems,
  //   }
  // },
  data() {

    let initData = {
        "(1)新規陽性者数": 0,
        "(2)#7119（東京消防庁救急相談センター）における発熱等相談件数 ": 0,
        "(3)新規陽性者における接触歴等不明者（人数）": 0,
        "(3)新規陽性者における接触歴等不明者（増加比）": 0,
        "(4)PCR・抗原検査（陽性率）": 0,
        "(4)PCR・抗原検査（検査人数）": 0,
        "(5)救急医療の東京ルールの適用件数": 0,
        "(6)入院患者数": 0,
        "(6)入院患者確保病床数": "0床",
        "(7)重症患者数": 0,
        "(7)重症患者確保病床数": "0床",
        "総括コメント-感染状況": {
            "level": 0,
            "display": {
                "@ja": "",
                "@en": "0"
            }
        },
        "総括コメント-医療提供体制": {
            "level": 0,
            "display": {
                "@ja": "",
                "@en": ""
            }
        }
    }

    return {
      monitoringItemsData: initData,
      monitoringItems: formatMonitoringItems(initData),
    }
  },
  async beforeCreate() {
    // FiwareCLientを利用してサマリーを取得する
    const entity = await fiwareClient.get('Covid19PatientsSummary')

    // 検査人数からグラフデータを生成する
    this.monitoringItemsData = entity
    this.monitoringItems = formatMonitoringItems(entity.data)
  },
}
</script>

<style lang="scss" module>
section {
  margin: 0 0 20px;

  /* h タグが連続するため DataView-Content の margin を少し打ち消す */
  &:first-child {
    margin-top: -10px;
  }

  h4 {
    margin: 5px 0 10px;
    font-weight: normal;
    @include font-size(16);
  }
}

.button {
  color: $green-1 !important;
  &:hover {
    color: $white !important;
  }

  @include button-text('sm');
}

dfn {
  font-style: normal;
  font-weight: bold;
}
</style>

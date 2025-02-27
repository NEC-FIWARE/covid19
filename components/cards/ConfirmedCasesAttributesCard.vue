<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <data-table
        :title="$t('陽性者の属性')"
        :title-id="'attributes-of-confirmed-cases'"
        :table-data="patientsTable"
        :date="date"
        :info="sumInfoOfPatients"
        :loaded="dataMargin >= 0"
        :error="$fetchState.error"
        :data-length="dataLength"
        url="https://github.com/NEC-FIWARE/covid19"
        @on-change-items-per-page="onChangeItemsPerPage"
        @on-change-page="onChangePage"
      >
        <template v-slot:tableBody="{ items, headers }">
          <tbody>
            <tr v-for="(item, i) in items" :key="i">
              <th scope="row" class="text-start DataTable-cell">
                {{ translateDate(item['公表日']) }}
              </th>
              <td
                v-for="(header, j) in headers.slice(1)"
                :key="j"
                :class="`text-${header.align || 'start'} DataTable-cell`"
              >
                <template v-if="header.type === 'date'">
                  {{ translateDate(item[header.value]) }}
                </template>
                <template v-else-if="header.type === 'age'">
                  {{ translateAge(item[header.value]) }}
                </template>
                <template v-else>
                  {{ translateWord(item[header.value]) }}
                </template>
              </td>
            </tr>
          </tbody>
        </template>
        <!--
        <template v-slot:additionalDescription>
          <span>{{ $t('（注）') }}</span>
          <ul>
            <li>
              {{ $t('「確定日」は検査により陽性であることを医師が確認した日') }}
            </li>
            <li>
              {{
                $t(
                  '「職業」「接触歴」「発症日」「確定日」は、10月1日以降の情報について週１回更新'
                )
              }}
            </li>
            <li>
              {{
                $t(
                  '「退院」は、保健所から報告があり、確認ができているものを反映（死亡退院を含む）'
                )
              }}
            </li>
          </ul>
        </template>
        -->
      </data-table>
    </client-only>
  </v-col>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

import DataTable from '@/components/DataTable.vue'
import fiwareClient from '@/utils/fiwareClient'
import { DataType, formatTable, TableDateType } from '@/utils/formatTable'

interface MetaData {
  endCursor: string
  updated: string
}
type Data = {
  dataLength: number
  sumInfoOfPatients: {
    lText: string
    sText: VueI18n.TranslateResult
    unit: VueI18n.TranslateResult
  }
  date: string
  page: number
  itemsPerPage: 15 | 30 | 50 | 100 | 200 | 300 | 500 | 1000
  endCursor: string
  patientsData: DataType[]
}
type Methods = {
  fetchOpenAPI: () => Promise<{ patientsData: DataType; metaData: MetaData }>
  fetchIfNoCache: () => void
  onChangeItemsPerPage: (itemsPerPage: Data['itemsPerPage']) => void
  onChangePage: (page: number) => void
  translateWord: (word: string) => string | VueI18n.TranslateResult
  translateDate: (date: string) => string | VueI18n.TranslateResult
  translateAge: (age: string) => VueI18n.TranslateResult
}
type Computed = {
  patientsTable: TableDateType
  dataMargin: number
}
type Props = {}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  components: { DataTable },
  // data() {
  //   // 感染者数グラフ
  //   const patientsGraph = formatGraph(Data.patients_summary.data)
  //   const lastData = patientsGraph[patientsGraph.length - 1]
  //   const lastDay = this.$d(new Date(lastData.label), 'date')
  //   const dataLength = lastData.cumulative
  //   const sumInfoOfPatients = {
  //     lText: dataLength.toLocaleString(),
  //     sText: this.$t('{date}の累計', { date: lastDay }),
  //     unit: this.$t('人'),
  //   }

  //   return {
  //     dataLength,
  //     sumInfoOfPatients,
  //     date: '',
  //     page: 1,
  //     itemsPerPage: 15,
  //     endCursor: '',
  //     patientsData: [],
  //   }
  // },
  data() {
    return {
      dataLength: 0,
      sumInfoOfPatients: {
        lText: '0',
        sText: this.$t('{date}の累計', { date: '2020-01-01' }),
        unit: this.$t('人'),
      },
      date: '2020-01-01',
      page: 1,
      itemsPerPage: 15,
      endCursor: '',
      patientsData: [],
    }
  },

  computed: {
    patientsTable() {
      const end = this.page * this.itemsPerPage
      const start = end - this.itemsPerPage
      const currentPageData = this.patientsData.slice(start, end)
      return formatTable(currentPageData)
    },
    dataMargin() {
      return 0
      // return this.patientsData.length - this.page * this.itemsPerPage
    },
  },
  async fetch() {
    // const { patientsData, metaData } = await this.fetchOpenAPI()
    // this.patientsData = this.patientsData.concat(patientsData)
    // this.endCursor = metaData.endCursor
    // this.date = metaData.updated
    // this.fetchIfNoCache()
    if (this.patientsData.length !== 0) {
      return
    }
    const { patientsData, metaData } = await this.fetchOpenAPI()
    this.patientsData = []
    this.patientsData = this.patientsData.concat(patientsData)
    this.endCursor = metaData.endCursor
    this.date = metaData.updated
    this.dataLength = this.patientsData.length
    this.sumInfoOfPatients.lText = this.patientsData.length.toLocaleString()
    this.sumInfoOfPatients.sText = `${this.translateDate(
      metaData.updated
    )}の累計`
    this.fetchIfNoCache()
  },
  fetchOnServer: false, // i18nによる日付の変換ができないのでサーバーでは無効化
  methods: {
    async fetchOpenAPI() {
      // const endpoint = 'https://api.data.metro.tokyo.lg.jp'
      // const url =
      //   `${endpoint}/v1/Covid19Patient?limit=${this.itemsPerPage}` +
      //   (this.endCursor ? `&cursor=${encodeURIComponent(this.endCursor)}` : '')

      // return await fetch(url)
      //   .then((response) => response.json())
      //   .then((data) => ({ patientsData: data[0], metaData: data[1] }))
      //   .catch((error) => {
      //     throw new Error(error.toString())
      //   })
      let patientsData = []
      const entity = await fiwareClient.get('Covid19PatientsListAggregated')
      if (entity.data.length) {
        patientsData = entity.data
      }
      return {
        patientsData,
        metaData: { endCursor: '', updated: entity.date },
      }
    },
    fetchIfNoCache() {
      // メモリ上に次ページのデータがなければ先読みしてページネーション時の待ち時間を減らす
      // if (this.dataMargin <= 0) setTimeout(() => this.$fetch(), 0)
    },
    onChangeItemsPerPage(itemsPerPage) {
      this.itemsPerPage = itemsPerPage
      this.endCursor = ''
      this.patientsData = []
      this.$fetch()
    },
    onChangePage(page) {
      this.page = page
      this.fetchIfNoCache()
    },
    translateDate(date) {
      const day = dayjs(date)
      if (!day.isValid()) return date
      return this.$d(day.toDate(), 'date')
    },
    translateAge(_age) {
      const [age, dai] = _age.split(/(代)$/, 2)
      return dai ? this.$t('{age}代', { age }) : this.$t(_age)
    },
    translateWord(word) {
      // 文字列が `null` or 以下の記号だった場合は翻訳しない
      // 全角のハイフン, 半角のハイフン, 全角のダッシュ, 全角ハイフンマイナス
      const notTranslateWords = ['-', '‐', '―', '－', null]
      return notTranslateWords.includes(word) ? word : this.$t(word)
    },
  },
}
export default options
</script>

<style lang="scss" scoped>
.DataTable-cell {
  white-space: nowrap;
}
</style>

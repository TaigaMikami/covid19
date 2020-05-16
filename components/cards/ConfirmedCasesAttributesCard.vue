<template>
  <v-col cols="12" md="6" class="DataCard">
    <data-table
      :title="$t('陽性患者の属性')"
      :title-id="'attributes-of-confirmed-cases'"
      :patients-chart-data="patientsTable"
      :patients-per-city-chart-data="patientsPerCityTable"
      :chart-option="{}"
      :date="Patients.patients.date"
      :info="sumInfoOfPatients"
      :url="
        'https://www.pref.shimane.lg.jp/medical/yakuji/kansensyo/other/topics/bukan2020.html'
      "
      :source="$t('オープンデータを入手')"
    />
    
    
     
  </v-col>
</template>

<script>
import Patients from '@/data/patients.json'
import PatientsSummary from '@/data/patients_summary.json'
import formatGraph from '@/utils/formatGraph'
import formatTable from '@/utils/formatTable'
import DataTable from '@/components/DataTable.vue'

import PatientsPerCity from '@/data/main_summary.json'
import formatTable2 from '@/utils/formatTable2'

export default {
  components: {
    DataTable
  },
  data() {
    // 感染者数グラフ
    const patientsGraph = formatGraph(PatientsSummary.patients_summary.data)
    // 感染者数
    const patientsTable = formatTable(Patients.patients.data)

    const sumInfoOfPatients = {
      lText: patientsGraph[
        patientsGraph.length - 1
      ].cumulative.toLocaleString(),
      sText: this.$t('{date}の累計', {
        date: patientsGraph[patientsGraph.length - 1].label
      }),
      unit: this.$t('人')
    }

    const patientsPerCityTable = formatTable2(PatientsPerCity.main_summary.children[0].children[1].children)

    // 陽性患者の属性 ヘッダー翻訳
    for (const header of patientsTable.headers) {
      header.text =
        header.value === '退院' ? this.$t('退院※') : this.$t(header.value)
    }
    // 陽性患者の属性 中身の翻訳
    for (const row of patientsTable.datasets) {
      row['居住地'] = this.$t(row['居住地'])
      row['性別'] = this.$t(row['性別'])
      row['退院'] = this.$t(row['退院'])

      if (row['年代'] === '10歳未満') {
        row['年代'] = this.$t('10歳未満')
      } else if (row['年代'] === '不明') {
        row['年代'] = this.$t('不明')
      } else {
        const age = row['年代'].substring(0, 2)
        row['年代'] = this.$t('{age}代', { age })
      }
    }

    for (const row of patientsPerCityTable.datasets) {
      row['市'] = this.$t(row['市'])
      row['入院'] = this.$t(row['入院'])
      row['退院'] = this.$t(row['退院'])
      row['累計患者数'] = this.$t(row['累計患者数'])

      
    }

    const data = {
      Patients,
      PatientsSummary,
      patientsTable,
      sumInfoOfPatients,
      patientsPerCityTable
    }
    return data
    
  }
  
}
</script>

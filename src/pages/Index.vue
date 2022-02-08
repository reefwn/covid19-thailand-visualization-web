<template>
  <q-page class="items-center justify-evenly">
    <div class="q-pa-md row items-start justify-evenly q-gutter-md">
      <q-card class="col-12 col-md">
        <q-card-section class="text-right text-white bg-red-5">
          <div class="text-subtitle2">{{ $t("cases") }}</div>
          <div class="text-h6">
            {{ summary ? `${formatNumber(summary.total_case)}` : null }}
          </div>
          <div class="text-subtitle2">
            + {{ summary ? `${formatNumber(summary.new_case)}`: null }}
          </div>
        </q-card-section>
      </q-card>
      <q-card class="col-12 col-md">
        <q-card-section class="text-right text-white bg-green-5">
          <div class="text-subtitle2">{{ $t("recovered") }}</div>
          <div class="text-h6">
            {{ summary ? `${formatNumber(summary.total_recovered)}` : null }}
          </div>
          <div class="text-subtitle2">
            + {{ summary ? `${formatNumber(summary.new_recovered)}` : null }}
          </div>
        </q-card-section>
      </q-card>
      <q-card class="col-12 col-md">
        <q-card-section class="text-right text-white bg-brown-5">
          <div class="text-subtitle2">{{ $t("death") }}</div>
          <div class="text-h6">
            {{ summary ? `${formatNumber(summary.total_death)}` : null }}
          </div>
          <div class="text-subtitle2">
            + {{ summary ? `${formatNumber(summary.new_death)}` : null }}
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row justify-center fit">
      <div class="col-lg-8 col-12">
        <apexchart
          ref="dailyChart"
          class="fit"
          type="line"
          strokeWidth="1"
          :options="dailyOptions"
          :series="dailySeries"
        />
      </div>
    </div>
    <div class="q-pa-xl row items-start justify-evenly">
      <h4>{{ $t("section2.title") }}</h4>
       <div class="row justify-center fit">
        <div class="col-lg-8 col-12">
          <apexchart
            ref="provinceChart"
            class="fit"
            type="bar"
            :options="provinceOptions"
            :series="provinceSeries"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import VueApexCharts from 'vue-apexcharts'
import axios, { AxiosResponse } from 'axios'
import { Coordinate, CovidByProvince, CovidSummary } from '../constants/models'
import { defineComponent, ref } from '@vue/composition-api'
import { i18n } from 'src/boot/i18n'
import { provincesTH, provincesEN } from '../constants/provinces'

export default defineComponent({
  name: 'PageIndex',
  components: { VueApexCharts },
  setup () {
    const summary = ref<CovidSummary>()
    const daily = ref<CovidSummary[]>()
    const province = ref<CovidByProvince[]>()

    const colorScheme = {
      red: '#ef5350',
      green: '#66bb6a',
      orange: '#ffa726',
      brown: '#8d6e63'
    }

    const dailyOptions = {
      xaxis: {
        categories: [] as Array<string>,
        tickAmount: 0 as number,
        labels: {
          rotate: 0 as number
        }
      }
    }

    const dailySeries = [
      {
        name: i18n.t('cases'),
        data: [] as Array<number>,
        color: '' as string
      }
    ]

    const provinceOptions = {
      plotOptions: {
        bar: {
          horizontal: false
        }
      }
    }

    const provinceSeries = [
      {
        name: i18n.t('cases'),
        data: [] as Array<Coordinate>,
        color: '' as string
      }
    ]

    return {
      colorScheme,
      summary,
      daily,
      province,
      dailyOptions,
      dailySeries,
      provinceOptions,
      provinceSeries
    }
  },
  mounted () {
    this.getSummary()
    this.getDaily().then(() => this.dailyChart())
    this.getDailyByProvince().then(() => this.provinceChart())
  },
  watch: {
    '$i18n.locale' () {
      this.dailyChart()
      this.provinceChart()
    }
  },
  methods: {
    formatNumber (val: number) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async getSummary () {
      await axios
        .get('https://covid19.ddc.moph.go.th/api/Cases/today-cases-all', {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        })
        .then((response: AxiosResponse<CovidSummary[]>) => {
          this.summary = response.data[0]
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getDaily () {
      await axios
        .get('https://covid19.ddc.moph.go.th/api/Cases/timeline-cases-all', {
          headers: {
            'Access-Control-Allow-Origin': '*',
            Accept: 'application/json'
          }
        })
        .then((response: AxiosResponse<CovidSummary[]>) => {
          this.daily = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    dailyChart () {
      if (this.daily) {
        const newConfirmed = this.daily.map(item => item.new_case)
        const newRecovered = this.daily.map(item => item.new_recovered)
        const newDeaths = this.daily.map(item => item.new_death)
        const date = this.daily.map(item => item.txn_date)
        this.dailySeries = [
          {
            name: i18n.t('cases'),
            data: newConfirmed,
            color: this.colorScheme.red
          },
          {
            name: i18n.t('recovered'),
            data: newRecovered,
            color: this.colorScheme.green
          },
          {
            name: i18n.t('death'),
            data: newDeaths,
            color: this.colorScheme.brown
          }
        ]
        this.dailyOptions = {
          xaxis: {
            categories: date,
            tickAmount: 6,
            labels: {
              rotate: 0
            }
          }
        }
      }
    },
    async getDailyByProvince () {
      await axios
        .get('https://covid19.ddc.moph.go.th/api/Cases/today-cases-by-provinces', {
          headers: {
            'Access-Control-Allow-Origin': '*',
            Accept: 'application/json'
          }
        })
        .then((response: AxiosResponse<CovidByProvince[]>) => {
          this.province = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    provinceChart () {
      if (this.province) {
        const top10 = this.province.sort((a, b) => b.new_case - a.new_case).slice(0, 10)
        const newCase = top10.map((item) => {
          const index = provincesTH.indexOf(item.province)
          return { x: i18n.locale === 'th-th' ? item.province : provincesEN[index], y: item.new_case } as Coordinate
        })
        this.provinceSeries = [
          {
            name: i18n.t('cases'),
            data: newCase,
            color: this.colorScheme.red
          }
        ]
      }
    }
  },
})
</script>

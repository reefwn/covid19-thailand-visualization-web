<template>
  <q-page class="items-center justify-evenly">
    <div class="q-pa-md row items-start justify-evenly q-gutter-md">
      <q-card class="col-12 col-md">
        <q-card-section class="text-right text-white bg-red-5">
          <div class="text-subtitle2">{{ $t("cases") }}</div>
          <div class="text-h6">
            {{ summary ? `${summary.total_case}` : null }}
          </div>
          <div class="text-subtitle2">
            + {{ summary ? `${summary.new_case}`: null }}
          </div>
        </q-card-section>
      </q-card>
      <q-card class="col-12 col-md">
        <q-card-section class="text-right text-white bg-green-5">
          <div class="text-subtitle2">{{ $t("recovered") }}</div>
          <div class="text-h6">
            {{ summary ? `${summary.total_recovered}` : null }}
          </div>
          <div class="text-subtitle2">
            + {{ summary ? `${summary.new_recovered}` : null }}
          </div>
        </q-card-section>
      </q-card>
      <q-card class="col-12 col-md">
        <q-card-section class="text-right text-white bg-brown-5">
          <div class="text-subtitle2">{{ $t("death") }}</div>
          <div class="text-h6">
            {{ summary ? `${summary.total_death}` : null }}
          </div>
          <div class="text-subtitle2">
            + {{ summary ? `${summary.new_death}` : null }}
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
  </q-page>
</template>

<script lang="ts">
import VueApexCharts from 'vue-apexcharts'
import axios, { AxiosResponse } from 'axios'
import { CovidSummary } from '../constants/models'
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'PageIndex',
  components: { VueApexCharts },
  setup () {
    const summary = ref<CovidSummary>()
    const daily = ref<CovidSummary[]>()

    const dailyOptions = {
      xaxis: {
        categories: [] as Array<string | undefined>,
        tickAmount: 0 as number,
        labels: {
          rotate: 0 as number
        }
      }
    }

    const dailySeries = [
      {
        name: 'จำนวนผู้ติดเชื้อ',
        data: [] as Array<number>,
        color: '' as string
      },
      {
        name: 'ผู้ป่วยในโรงพยาบาล',
        data: [] as Array<number>,
        color: '' as string
      }
    ]
    return { summary, daily, dailyOptions, dailySeries }
  },
  mounted () {
    this.getSummary()
    this.getDaily()
  },
  methods: {
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
          if (this.daily) {
            const newConfirmed = this.daily.map(item => item.new_case)
            const newRecovered = this.daily.map(item => item.new_recovered)
            const newDeaths = this.daily.map(item => item.new_death)
            const date = this.daily.map(item => item.txn_date)
            const colorScheme = {
              red: '#ef5350',
              green: '#66bb6a',
              orange: '#ffa726',
              brown: '#8d6e63'
            }
            this.dailySeries = [
              {
                name: 'ผู้ติดเชื้อ',
                data: newConfirmed,
                color: colorScheme.red
              },
              {
                name: 'รักษาหายแล้ว',
                data: newRecovered,
                color: colorScheme.green
              },
              {
                name: 'ผู้เสียชีวิต',
                data: newDeaths,
                color: colorScheme.brown
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
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
})
</script>

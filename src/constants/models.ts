/* eslint-disable camelcase */

export interface CovidSummary {
  new_case: number
  new_case_excludeabroad: number
  new_death: number
  new_recovered: number
  total_case: number
  total_case_excludeabroad: number
  total_death: number
  total_recovered: number
  txn_date: string
}

export interface CovidByProvince extends CovidSummary {
  province: string
  update_date: string
}

export interface Coordinate {
  x: number | string
  y: number
}

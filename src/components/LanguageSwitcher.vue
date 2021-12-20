<template>
  <q-select
    label-color="white"
    v-model="lang"
    :options="langOptions"
    label="Language"
    dense
    borderless
    emit-value
    map-options
    options-dense
    style="min-width: 80px"
  />
</template>

<script lang='ts'>
import Vue from 'vue'
import VueI18n from 'vue-i18n'

export default Vue.extend({
  data () {
    return {
      lang: this.$i18n.locale,
      langOptions: [
        { value: 'en-us', label: 'English' },
        { value: 'th-th', label: 'Thai' }
      ]
    }
  },
  watch: {
    lang (lang: string) {
      if (this.$i18n instanceof VueI18n) {
        this.$i18n.locale = lang
      }
    }
  }
})
</script>

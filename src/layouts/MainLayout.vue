<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-positive">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{ $t('title') }}
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <language-switcher />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'
import { defineComponent, ref } from '@vue/composition-api'
import LanguageSwitcher from 'components/LanguageSwitcher.vue'

const linksData = [
  {
    title: 'API Reference',
    caption: 'Department of Disease Control',
    icon: 'code',
    link: 'https://covid19.ddc.moph.go.th'
  }
]

export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLink, LanguageSwitcher },
  setup () {
    const leftDrawerOpen = ref(false)
    const essentialLinks = ref(linksData)

    return { leftDrawerOpen, essentialLinks }
  }
})
</script>

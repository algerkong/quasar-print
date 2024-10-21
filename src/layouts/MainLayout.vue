<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-bar class="bg-black text-white top-bar">
        <div class="cursor-pointer">打印程序</div>
        <q-space />
        <q-btn class="top-btn" dense flat icon="minimize" @click="miniSize" />
        <q-btn class="top-btn" dense flat icon="crop_square" @click="maxSize" />
        <q-btn class="top-btn" dense flat icon="close" @click="close"/>
      </q-bar>

      <q-toolbar>
        <q-btn
          flat
          dense
          round
         icon="chevron_left"
          @click="toggleLeftDrawer"
          v-if="router.currentRoute.value.path !== '/'"
        />

        <q-toolbar-title>
          打印程序
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({
  name: 'MainLayout'
});


const router = useRouter()
function toggleLeftDrawer () {
  router.back();
}

const close = ()=>{
  window.electronAPI.sendMessage('close-window')
}

const maxSize = ()=>{
  window.electronAPI.sendMessage('maximize-window')
}

const miniSize = ()=>{
  window.electronAPI.sendMessage('minisize-window')
}
</script>

<style scoped>
.top-bar{
  -webkit-app-region: drag;
}

.top-btn{
  -webkit-app-region: no-drag;
}
</style>

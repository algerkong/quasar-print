<template>
  <q-card class="receipt-card" flat>
    <q-card-section>
      <div class="text-h6 text-center">销售小票</div>
      <div class="text-subtitle2 text-center">{{ storeName }}</div>
      <q-separator class="q-my-md" />

      <div v-for="(item, index) in items" :key="index" class="row q-my-sm">
        <div class="col-6">{{ item.name }}</div>
        <div class="col-2 text-right">{{ item.quantity }}</div>
        <div class="col-4 text-right">¥{{ item.price.toFixed(2) }}</div>
      </div>

      <q-separator class="q-my-md" />

      <div class="row q-my-sm">
        <div class="col-6 text-weight-bold">总计</div>
        <div class="col-6 text-right text-weight-bold">¥{{ total.toFixed(2) }}</div>
      </div>

      <div class="text-caption text-center q-mt-md">感谢您的惠顾</div>
      <div class="text-caption text-center">{{ new Date().toLocaleString() }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
const items = ref([])

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.quantity * item.price, 0)
})

onMounted(() => {
  nextTick(() => {
      window.electronAPI.sendMessage('print-load')
    })
  window.electronAPI.receiveMessage('print-data', (data) => {
    items.value = data
    nextTick(() => {
      window.electronAPI.sendMessage('print-start')
    })

  })

})
</script>

<style scoped>
.receipt-card {
  width: 100%;
  max-width: 300px;
  margin: 20px;
}

@media print {
  .q-page-sticky {
    display: none;
  }
}
</style>

<template>
  <q-page class="flex q-pa-xl page">
    <q-card class="receipt-card" v-for="record in printRecords" :key="record.id">
      <q-card-section>
        <div class="text-h6 text-center">销售小票</div>
        <q-separator class="q-my-md" />

        <div v-for="(item, index) in record.printData" :key="index" class="row q-my-sm">
          <div class="col-6">{{ item.name }}</div>
          <div class="col-2 text-right">{{ item.quantity }}</div>
          <div class="col-4 text-right">¥{{ item.price.toFixed(2) }}</div>
        </div>

        <q-separator class="q-my-md" />

        <div class="row q-my-sm">
          <div class="col-6 text-weight-bold">总计</div>
          <div class="col-6 text-right text-weight-bold">¥{{ recordTotal(record.printData).toFixed(2) }}</div>
        </div>

        <div class="text-caption text-center q-mt-md">感谢您的惠顾</div>
        <div class="text-caption text-center">{{ record.printTime }}</div>

        <q-btn color="primary" class="full-width" @click="resetPrint(record.printData)">重新打印</q-btn>
      </q-card-section>
    </q-card>

    <printer-list-dialog v-model="printDialogVisible" @handle-print="handlePrint"/>
  </q-page>
</template>

<script setup lang="ts">
import PrinterListDialog from 'src/components/PrinterListDialog.vue';
import usePrintRecords from 'src/hooks/PrintHook'
import { IProduct } from 'src/types/print';
import { ref } from 'vue';
const { printRecords, startPrint} = usePrintRecords();

const recordTotal = (data: IProduct[])=>{
  return data.reduce((total: number, record: IProduct) => {
    return total + (record.price * record.quantity)
  }, 0)
}

const printDialogVisible = ref(false)
const printData = ref()
const resetPrint = (data:object)=>{
  printDialogVisible.value = true
  printData.value = data
}


const handlePrint = async (name:string)=>{
  console.log('name',name)
  console.log('printData',printData.value)
  await startPrint(name, printData.value)
  printDialogVisible.value = false
}
</script>

<style scoped>
.page{
  gap: 20px;
}

.receipt-card{
  width: 25%;
}
</style>

<template>
<q-dialog v-model="printDialogVisible" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">打印机列表</div>
        </q-card-section>

          <q-card-section class="q-pt-none">
            <q-list bordered separator>
              <q-item v-for="(item, index) in printerList" :key="index" clickable v-ripple @click="handlePrint(item.name)">
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="取消" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import usePrintRecords from 'src/hooks/PrintHook'
import { computed, onMounted, ref } from 'vue';

const { getPrinterList } = usePrintRecords();

  const props = defineProps({
    value: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['update:value','handlePrint'])
  const printDialogVisible = computed({
    get() {
      return props.value
    },
    set(value) {
      emit('update:value', value)
    }
  })

  const printerList = ref<{name:string}[]>([])

onMounted(async()=>{
  printerList.value = await getPrinterList()
})


const handlePrint = (name:string)=>{
  emit('handlePrint', name)
}



</script>

<style lang="scss" scoped>

</style>

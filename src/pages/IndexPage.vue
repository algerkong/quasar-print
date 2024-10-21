<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- 添加商品表单 -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">添加商品</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" ref="formRef" class="q-gutter-md">
              <q-input
                filled
                v-model="newItem.name"
                label="商品名称"
                :rules="[val => !!val || '请输入商品名称']"
              />
              <q-input
                filled
                v-model.number="newItem.quantity"
                type="number"
                label="数量"
                :rules="[
                  val => !!val || '请输入数量',
                  val => val > 0 || '数量必须大于0'
                ]"
              />
              <q-input
                filled
                v-model.number="newItem.price"
                type="number"
                label="单价"
                prefix="¥"
                :rules="[
                  val => !!val || '请输入单价',
                  val => val > 0 || '单价必须大于0'
                ]"
              />
              <q-btn label="添加商品" type="submit" color="primary"/>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- 商品列表和总计 -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">商品列表</div>
          </q-card-section>
          <q-card-section>
            <q-list bordered separator>
              <q-item v-for="(item, index) in items" :key="index">
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>
                    数量: {{ item.quantity }} | 单价: ¥{{ item.price.toFixed(2) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  ¥{{ (item.quantity * item.price).toFixed(2) }}
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="negative" icon="delete" @click="removeItem(index)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section>
            <div class="text-h6 text-right">总计: ¥{{ total.toFixed(2) }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 打印按钮 -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="items.length > 0">
      <q-btn fab icon="print" color="primary" @click="printReceipt" />
    </q-page-sticky>

    <printer-list-dialog v-model="printDialogVisible" @handlePrint="handlePrint" />
    <div class="q-mt-xl">
      <q-btn class="q-mr-xl" @click="router.push('/todo')">TODOLIST</q-btn>
      <q-btn class="q-mr-xl" @click="router.push('/printlist')">打印历史</q-btn>
      <q-btn @click="router.push('/user')">用户列表API请求</q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed ,nextTick} from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router';
import usePrintRecords from 'src/hooks/PrintHook'
import { IProduct } from 'src/types/print';
import PrinterListDialog from 'src/components/PrinterListDialog.vue';

const { startPrint } = usePrintRecords();
const router = useRouter()

window.electronAPI.receiveMessage('to-print',()=>{
  router.push('/print')
})

const $q = useQuasar()

const items = ref<IProduct[]>([])
const formRef = ref()

const newItem = ref({
  name: '',
  quantity: 1,
  price: 0
})
const printList = ref<{name:string}[]>([])
const printDialogVisible = ref(false)

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.quantity * item.price, 0)
})

const onSubmit = async () => {
  items.value.push({ ...newItem.value })
  newItem.value = { name: '', quantity: 1, price: 0 }
  nextTick(()=>{
    formRef.value.resetValidation();
  })
}

const removeItem = (index:number) => {
  items.value.splice(index, 1)
  $q.notify({
    message: '商品已删除',
    color: 'negative',
    icon: 'delete'
  })
}

const printReceipt = async () => {
  printList.value = await window.electronAPI.invokeMessage('get-print-list');
  printDialogVisible.value = true
}

const handlePrint = async (name:string) =>{
  await startPrint(name, items.value)
  printDialogVisible.value = false
  items.value = []
}



</script>

<template>
  <q-page class="q-pa-md">
    <h1 class="text-h4 q-mb-md">用户管理</h1>

    <!-- 用户列表 -->
    <q-table title="用户列表" :rows="users" :columns="columns" row-key="id" :loading="loading">
      <template v-slot:top-right>
        <q-btn color="primary" label="添加用户" @click="openAddUserDialog" />
      </template>
    </q-table>

    <!-- 添加用户对话框 -->
    <q-dialog v-model="addUserDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">添加新用户</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newUser.name" label="姓名" />
          <q-input v-model="newUser.email" label="邮箱" type="email" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn flat label="添加" color="primary" @click="addUser" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 当前时间显示 -->
    <div class="q-mt-md">
      <p>当前服务器时间: {{ currentTime }}</p>
      <q-btn color="secondary" label="刷新时间" @click="refreshTime" />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';

interface User {
  id: number;
  name: string;
  email: string;
}
const $q = useQuasar();
const users = ref<User[]>([]);
const loading = ref(false);
const addUserDialog = ref(false);
const newUser = ref({ name: '', email: '' });
const currentTime = ref('');

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: '姓名', field: 'name', sortable: true },
  { name: 'email', label: '邮箱', field: 'email', sortable: true },
];

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await fetch('http://localhost:2333/api/users');
    users.value = await response.json();
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: '获取用户列表失败',
    });
  } finally {
    loading.value = false;
  }
};

const openAddUserDialog = () => {
  addUserDialog.value = true;
};

const addUser = async () => {
  try {
    const response = await fetch('http://localhost:2333/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser.value),
    });
    const addedUser = await response.json();
    users.value.push(addedUser);
    $q.notify({
      color: 'positive',
      message: '用户添加成功',
    });
    newUser.value = { name: '', email: '' };
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: '添加用户失败',
    });
  }
};

const refreshTime = async () => {
  try {
    const response = await fetch('http://localhost:2333/api/time');
    const data = await response.json();
    currentTime.value = new Date(data.currentTime).toLocaleString();
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: '获取服务器时间失败',
    });
  }
};

onMounted(() => {
  fetchUsers();
  refreshTime();
});
</script>

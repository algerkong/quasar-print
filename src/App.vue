<template>
  <router-view />
</template>

<script setup lang="ts">
import useIndexedDB from 'src/hooks/IndexDBHook';
const { initDB } = useIndexedDB();

defineOptions({
  name: 'App'
});

// 创建 IndexedDB 数据库
initDB('my-database', 1, [
  { name: 'users', keyPath: 'id' },
  { name: 'todos', keyPath: 'id' },
  { name: 'prints', keyPath: 'id' }
]);
</script>

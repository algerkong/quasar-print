<template>
  <q-page class="flex q-pa-xl">
    <q-card class="my-card" style="width: 100%">
      <q-card-section>
        <div class="text-h6">我的待办事项</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="newTodo"
          label="添加新任务"
          dense
          @keyup.enter="addTodo"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click="addTodo" />
          </template>
        </q-input>
      </q-card-section>

      <q-list separator>
        <q-item
          v-for="(todo, index) in todos"
          :key="index"
          :class="{ done: todo.completed }"
        >
          <q-item-section avatar>
            <q-checkbox v-model="todo.completed" @update:model-value="()=>changeTodo(todo)" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ todo.text }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="removeTodo(todo.id as number)"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <q-card-section v-if="todos.length">
        <div class="text-subtitle2">
          {{ completedCount }} / {{ todos.length }} 已完成
        </div>
        <q-linear-progress
          :value="progress"
          color="secondary"
          class="q-mt-sm"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import useIndexedDB from 'src/hooks/IndexDBHook';
interface Todo {
  id?: number;
  text: string;
  completed: boolean;
}

const { addData, getAllData, deleteData, initDB, saveData } = useIndexedDB();

const newTodo = ref('');
const todos = ref<Todo[]>([]);

const loadTodos = async () => {
  todos.value = await getAllData('todos');
};

const init = async () => {
  await initDB('my-database', 1, [
    { name: 'users', keyPath: 'id' },
    { name: 'todos', keyPath: 'id' },
    { name: 'prints', keyPath: 'id' },
  ]);
  await loadTodos();
};

onMounted(()=>{

  init()
})
const addTodo = async () => {
  if (newTodo.value.trim()) {
    await addData('todos', {
      text: newTodo.value.trim(),
      completed: false,
    });
    newTodo.value = '';
    await loadTodos();
  }
};

const removeTodo = async (id: number) => {
  await deleteData('todos', id);
  await loadTodos();
};

const changeTodo = async (item: Todo) => {
  console.log('item',JSON.parse(JSON.stringify(item)))
  await saveData('todos', JSON.parse(JSON.stringify(item)));
};

const completedCount = computed(() => {
  return todos.value.filter((todo) => todo.completed).length;
});

const progress = computed(() => {
  return todos.value.length ? completedCount.value / todos.value.length : 0;
});
</script>

<style scoped>
.done {
  text-decoration: line-through;
  color: #9e9e9e;
}
</style>

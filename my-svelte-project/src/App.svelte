<script>
import { onMount } from 'svelte';
let tasks = [];
let new_task = '';
const end_point = 'http://localhost:8000';

async function init_db() {
  await fetch(end_point+'/app18/init_db', { method: 'POST' });
  await fetch_tasks();
}

async function fetch_tasks() {
  const res = await fetch(end_point+`/app18/read_todos`);
  tasks = await res.json();
}

async function add_task() {
  if (!new_task) return;
  await fetch(end_point+'/app18/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: new_task })
  });
  new_task = '';
  await fetch_tasks();
}

async function toggle_task(id) {
  await fetch(end_point+`/app18/todos/toggle/${id}`, { method: 'POST' });
  await fetch_tasks();
}

async function delete_task(id) {
  await fetch(end_point+`/app18/todos/delete/${id}`, { method: 'POST' });
  await fetch_tasks();
}

onMount(fetch_tasks);
</script>



<style>
.task { display: flex; justify-content: space-between; margin: 5px 0; cursor: pointer; }
.completed { text-decoration: line-through; background-color: blueviolet; color: white; }
</style>



<h1>Todo List</h1>
<input bind:value={new_task} placeholder="Add a new task" />
<button on:click={add_task}>Add</button>
<ul>
{#each tasks as task}
  <li class="task {task.completed ? 'completed' : ''}">
    <span>{task.task}</span>
    <button on:click={() => delete_task(task.id)}>Delete</button>
    <button on:click={() => toggle_task(task.id)}>Toggle</button>
  </li>
{/each}
</ul>
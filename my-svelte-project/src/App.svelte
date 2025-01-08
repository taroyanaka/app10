

<script>
  import { onMount } from 'svelte';
  let tasks = [];
  let newTask = '';
  const end_point = 'http://localhost:8000';

  async function fetchTasks() {
    const res = await fetch(`${end_point}/app18/todos`);
    tasks = await res.json();
  }

  async function addTask() {
    if (!newTask) return;
    await fetch('http://localhost:8000/app18/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask })
    });
    newTask = '';
    fetchTasks();
  }

  async function toggleTask(id) {
    await fetch(`${end_point}/app18/todos/${id}`, { method: 'PATCH' });
    fetchTasks();
  }

  async function deleteTask(id) {
    await fetch(`http://localhost:8000/app18/todos/${id}`, { method: 'DELETE' });
    fetchTasks();
  }

  onMount(fetchTasks);
</script>

<style>
  body { font-family: Arial, sans-serif; margin: 20px; }
  .task { display: flex; justify-content: space-between; margin: 5px 0; }
  .completed { text-decoration: line-through; }
</style>

<h1>Todo List</h1>
<input bind:value={newTask} placeholder="Add a new task" />
<button on:click={addTask}>Add</button>
<ul>
  {#each tasks as task}
    <li class="task {task.completed ? 'completed' : ''}">
      <span on:click={() => toggleTask(task.id)}>{task.task}</span>
      <button on:click={() => deleteTask(task.id)}>Delete</button>
    </li>
  {/each}
</ul>

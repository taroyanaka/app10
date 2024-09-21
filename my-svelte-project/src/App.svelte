<script>
    import { onMount } from 'svelte';
    // import Chart from 'chart.js/auto';
    import Chart from 'chart.js';

    let charts = [
        {
            name: 'チャート 1',
            labels: ['項目1', '項目2', '項目3', '項目4', '項目5'],
            datasets: [
                {
                    label: 'データセット 1',
                    data: [65, 59, 90, 81, 56],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)'
                }
            ]
        }
    ];

    let selectedChartIndex = 0;
    let radarChart;
    let form = {
        label: '',
        data: [0, 0, 0, 0, 0]
    };
    let editMode = false;
    let editIndex = null;
    let errorMessage = '';
    let isEditOpen = false;

    $: currentChart = charts[selectedChartIndex];

    onMount(() => {
        renderRadarChart();
    });

    function renderRadarChart() {
        const canvas = document.getElementById('radarChart');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        const ctx = canvas.getContext('2d');
        
        if (radarChart) {
            radarChart.destroy();
        }

        radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: currentChart.labels,
                datasets: currentChart.datasets
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }

    function createNewChart() {
        const newChart = {
            name: `新しいチャート ${charts.length + 1}`,
            labels: ['項目1', '項目2', '項目3', '項目4', '項目5'],
            datasets: []
        };
        charts = [...charts, newChart];
        selectedChartIndex = charts.length - 1;
        renderRadarChart();
    }

    function selectChart(index) {
        selectedChartIndex = index;
        renderRadarChart();
    }

    function saveChart() {
        if (!currentChart.name.trim()) {
            errorMessage = 'チャート名を空にすることはできません';
            return;
        }
        errorMessage = '';
        renderRadarChart();
    }

    function addOrUpdateDataset() {
        if (editMode) {
            Object.assign(currentChart.datasets[editIndex], form);
        } else {
            currentChart.datasets = [...currentChart.datasets, { ...form }];
        }
        resetForm();
        renderRadarChart();
    }

    function editDataset(index) {
        editMode = true;
        editIndex = index;
        form = { ...currentChart.datasets[index] };
    }

    function deleteDataset(index) {
        currentChart.datasets = currentChart.datasets.filter((_, i) => i !== index);
        renderRadarChart();
    }

    function updateLabels() {
        renderRadarChart();
    }

    function resetForm() {
        form = {
            label: '',
            data: [0, 0, 0, 0, 0]
        };
        editMode = false;
        editIndex = null;
    }

    function toggleEdit() {
        isEditOpen = !isEditOpen;
    }

    function outputSampleData() {
        console.log(JSON.stringify(charts, null, 2));
        alert("サンプルデータをコンソールに出力しました。");
    }

    function addSampleChart() {
        const sampleChart = {
            name: 'サンプルチャート',
            labels: ['項目1', '項目2', '項目3', '項目4', '項目5'],
            datasets: [
                {
                    label: 'サンプルデータセット',
                    data: [70, 65, 80, 85, 90],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)'
                }
            ]
        };
        charts = [...charts, sampleChart];
        selectedChartIndex = charts.length - 1;
        renderRadarChart();
    }
</script>

<style>
    #chart-container {
        width: 400px;
        height: 400px;
        margin-bottom: 20px;
    }
    .tabs {
        display: flex;
        list-style-type: none;
        padding: 0;
        margin-bottom: 20px;
    }
    .tabs li {
        margin-right: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        cursor: pointer;
    }
    .tabs li.active {
        background-color: #f0f0f0;
        font-weight: bold;
    }
    .error {
        color: red;
        font-weight: bold;
    }
    /* スライドメニュー */
    .slide-menu {
        position: fixed;
        top: 0;
        right: -300px; /* 初期位置は右に隠れている */
        width: 300px;
        height: 100%;
        background-color: #f4f4f4;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
        padding: 20px;
        transition: right 0.3s ease;
    }
    .slide-menu.open {
        right: 0; /* 開かれたときの位置 */
    }
    .slide-menu h2 {
        margin-top: 0;
    }
    .edit-button {
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
    }
</style>

<div>
    <button class="edit-button" on:click={toggleEdit}>編集</button>

    <!-- チャート選択タブ -->
	<ul class="tabs">
		{#each charts as chart, index}
			<li class:active={selectedChartIndex === index}>
				<button on:click={() => selectChart(index)} on:keydown={(e) => e.key === 'Enter' && selectChart(index)}>
					{chart.name}
				</button>
			</li>
		{/each}
		<li>
			<button on:click={createNewChart} on:keydown={(e) => e.key === 'Enter' && createNewChart()}>＋ 新規チャート</button>
		</li>
	</ul>

    <!-- エラーメッセージ表示 -->
    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}

    <!-- チャート表示エリア -->
    <div id="chart-container">
        <canvas id="radarChart"></canvas>
    </div>

    <!-- スライドメニュー -->
    <div class:open={isEditOpen} class="slide-menu">
        <!-- チャートの名前変更 -->
        <h2>チャート名の変更</h2>
        <label>
            チャート名: 
            <input bind:value={currentChart.name} type="text">
        </label>
        <button on:click={saveChart}>保存</button>

        <!-- 項目（ラベル）編集フォーム -->
        <h2>項目（ラベル）の編集</h2>
        <form on:submit|preventDefault={updateLabels}>
            {#each currentChart.labels as label, index}
                <label>
                    項目 {index + 1}: 
                    <input bind:value={currentChart.labels[index]} type="text" required>
                </label><br>
            {/each}
            <button type="submit">項目を更新</button>
        </form>

        <!-- CRUD用フォーム -->
        <h2>データセットの追加/編集</h2>
        <form on:submit|preventDefault={addOrUpdateDataset}>
            <label>
                ラベル: 
                <input bind:value={form.label} type="text" required>
            </label><br>
            {#each currentChart.labels as item, index}
                <label>
                    {item}: 
                    <input bind:value={form.data[index]} type="number" required>
                </label><br>
            {/each}
            <button type="submit">{editMode ? '更新' : '追加'}</button>
            <button type="button" on:click={resetForm}>リセット</button>
        </form>

        <!-- データセットのリストと削除機能 -->
        <h2>データセット一覧</h2>
        <ul>
            {#each currentChart.datasets as dataset, index}
                <li>
                    {dataset.label}: {dataset.data.join(', ')}
                    <button on:click={() => editDataset(index)}>編集</button>
                    <button on:click={() => deleteDataset(index)}>削除</button>
                </li>
            {/each}
        </ul>
    </div>

    <!-- サンプルデータ出力と新規追加 -->
    <h2>サンプルデータ機能</h2>
    <button on:click={outputSampleData}>サンプルデータ出力</button>
    <button on:click={addSampleChart}>サンプルデータを新規追加</button>
</div>
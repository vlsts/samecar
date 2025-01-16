<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Card } from 'flowbite-svelte';
	import {
		maze,
		initializeMaze,
		addRow,
		addColumn,
		getMazeString,
		setEnd,
		setStart,
		toggleWall
	} from '$lib/stores/maze.store';
	import type { Cell } from '$lib/types/maze.type';

	onMount(() => {
		initializeMaze(1, 2); // Start with 1x2 maze
	});

	async function saveMaze() {
		const mazeString = getMazeString();
		console.log($maze);
		console.log(mazeString);
		await fetch('http://localhost:3000/api/maze', {
			method: 'POST',
			body: JSON.stringify({ maze: mazeString }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	function handleEndToggle(i: number, j: number) {
		setEnd(i, j);
	}

	function handleStartToggle(i: number, j: number) {
		setStart(i, j);
	}

	function handleWallToggle(
		cell: Cell,
		direction: 'up' | 'right' | 'down' | 'left',
		i: number,
		j: number
	) {
		toggleWall(i, j, direction);
	}
</script>

<div class="flex min-h-screen flex-col items-center p-4">
	<Card class="mb-4 w-full max-w-2xl">
		<div class="mb-4 flex gap-4">
			<Button on:click={addRow}>Add Row</Button>
			<Button on:click={addColumn}>Add Column</Button>
			<Button on:click={saveMaze}>Save Maze</Button>
		</div>
	</Card>

	<div class="grid gap-1">
		{#each $maze as row, i}
			<div class="flex gap-1">
				{#each row as cell, j}
					<div class="relative h-16 w-16 border border-gray-300">
						<button
							class="wall-button absolute left-0 top-0 h-2 w-full"
							class:bg-gray-500={cell.up}
							class:bg-transparent={!cell.up}
							disabled={i === 0}
							on:click={() => handleWallToggle(cell, 'up', i, j)}
							aria-label={`Toggle up wall at cell ${i},${j}`}
						></button>
						<button
							class="wall-button absolute right-0 top-0 h-full w-2"
							class:bg-gray-500={cell.right}
							class:bg-transparent={!cell.right}
							disabled={j === row.length - 1}
							on:click={() => handleWallToggle(cell, 'right', i, j)}
							aria-label={`Toggle right wall at cell ${i},${j}`}
						></button>
						<button
							class="wall-button absolute bottom-0 left-0 h-2 w-full"
							class:bg-gray-500={cell.down}
							class:bg-transparent={!cell.down}
							disabled={i === $maze.length - 1}
							on:click={() => handleWallToggle(cell, 'down', i, j)}
							aria-label={`Toggle down wall at cell ${i},${j}`}
						></button>
						<button
							class="wall-button absolute left-0 top-0 h-full w-2"
							class:bg-gray-500={cell.left}
							class:bg-transparent={!cell.left}
							disabled={j === 0}
							on:click={() => handleWallToggle(cell, 'left', i, j)}
							aria-label={`Toggle left wall at cell ${i},${j}`}
						></button>
						<div class="absolute inset-2 flex items-center justify-center gap-1">
							<button
								class="h-3 w-3 rounded-full transition-colors duration-200"
								class:bg-red-500={cell.isStart}
								class:hover:bg-red-300={!cell.isStart}
								on:click={() => handleStartToggle(i, j)}
								aria-label={`Set start at cell ${i},${j}`}
							></button>
							<button
								class="h-3 w-3 rounded-full transition-colors duration-200"
								class:bg-green-500={cell.isEnd}
								class:hover:bg-green-300={!cell.isEnd}
								on:click={() => handleEndToggle(i, j)}
								aria-label={`Set end at cell ${i},${j}`}
							></button>
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	button {
		@apply transition-colors duration-200;
	}
	.wall-button {
		@apply transition-colors duration-200;
	}
	.wall-button:not(:disabled) {
		@apply hover:bg-gray-700;
	}
	.wall-button:disabled {
		@apply cursor-not-allowed bg-gray-500;
	}
	.control-button {
		@apply transition-colors duration-200;
	}
</style>

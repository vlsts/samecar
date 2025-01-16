import { writable } from 'svelte/store';
import { Cell, type Direction } from '../types/maze.type';

export const maze = writable<Cell[][]>([]);
export const rows = writable(5);
export const cols = writable(5);

export function initializeMaze(r: number, c: number) {
	const newMaze: Cell[][] = Array(Math.max(1, r))
		.fill(0)
		.map((_, rowIndex) =>
			Array(Math.max(2, c))
				.fill(0)
				.map((_, colIndex) => {
					const cell = new Cell();
					// Set exterior walls
					if (rowIndex === 0) cell.up = true;
					if (rowIndex === Math.max(1, r) - 1) cell.down = true;
					if (colIndex === 0) cell.left = true;
					if (colIndex === Math.max(2, c) - 1) cell.right = true;
					return cell;
				})
		);
	maze.set(newMaze);
}

export function toggleWall(i: number, j: number, direction: Direction) {
    maze.update((m) => {
        // Prevent toggling exterior walls
        if (i === 0 && direction === 'up') return m;
        if (i === m.length - 1 && direction === 'down') return m;
        if (j === 0 && direction === 'left') return m;
        if (j === m[0].length - 1 && direction === 'right') return m;

        // Toggle current cell wall
        m[i][j][direction] = !m[i][j][direction];

        // Toggle adjacent cell wall
        switch (direction) {
            case 'up':
                if (i > 0) m[i - 1][j].down = m[i][j].up;
                break;
            case 'right':
                if (j < m[0].length - 1) m[i][j + 1].left = m[i][j].right;
                break;
            case 'down':
                if (i < m.length - 1) m[i + 1][j].up = m[i][j].down;
                break;
            case 'left':
                if (j > 0) m[i][j - 1].right = m[i][j].left;
                break;
        }

        return m;
    });
}

export function getMazeString(): string {
	let result = '';
	maze.subscribe((m) => {
		m.forEach((row) => {
			row.forEach((cell) => {
				result += cell.toString();
			});
		});
	})();
	return result;
}

export function addRow() {
    maze.update((m) => {
        const lastRowIndex = m.length - 1;
        const newRow = Array(m[0].length)
            .fill(0)
            .map((_, colIndex) => {
                const cell = new Cell();
                // Set exterior walls
                if (colIndex === 0) cell.left = true;
                if (colIndex === m[0].length - 1) cell.right = true;
                cell.down = true;
                // Copy walls from last row
                if (m[lastRowIndex][colIndex].down) {
                    cell.up = true;
                }
                return cell;
            });
        return [...m, newRow];
    });
    rows.update((n) => n + 1);
}

export function addColumn() {
    maze.update((m) => {
        const lastColIndex = m[0].length - 1;
        const newColumn = m.map((row, rowIndex) => {
            const cell = new Cell();
            // Set exterior walls
            if (rowIndex === 0) cell.up = true;
            if (rowIndex === m.length - 1) cell.down = true;
            cell.right = true;
            // Copy walls from last column
            if (row[lastColIndex].right) {
                cell.left = true;
            }
            return cell;
        });
        return m.map((row, i) => [...row, newColumn[i]]);
    });
    cols.update((n) => n + 1);
}

export function setEnd(rowIndex: number, colIndex: number) {
	maze.update((m) => {
		// Clear any existing end
		m.forEach((row) => row.forEach((cell) => (cell.isEnd = false)));
		m[rowIndex][colIndex].isEnd = true;
		return m;
	});
}

export function setStart(rowIndex: number, colIndex: number) {
	maze.update((m) => {
		// Clear any existing start
		m.forEach((row) => row.forEach((cell) => (cell.isStart = false)));
		m[rowIndex][colIndex].isStart = true;
		return m;
	});
}

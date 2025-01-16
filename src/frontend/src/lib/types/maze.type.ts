export type Direction = 'up' | 'right' | 'down' | 'left';

export class Cell {
	up: boolean = false;
	right: boolean = false;
	down: boolean = false;
	left: boolean = false;
	isEnd: boolean = false;
	isStart: boolean = false;

	toString(): string {
		return `${+!this.up}${+!this.right}${+!this.down}${+!this.left}${+this.isEnd}${+this.isStart}`;
	}

	static fromString(str: string): Cell {
		const cell = new Cell();
		cell.up = str[0] === '1';
		cell.right = str[1] === '1';
		cell.down = str[2] === '1';
		cell.left = str[3] === '1';
		cell.isEnd = str[4] === '1';
		cell.isStart = str[5] === '1';
		return cell;
	}
}

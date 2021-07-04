
import {CELL_SIZE} from "myConstants";

export interface ICellConstructor {
    row: number;
    col: number;
}

interface IGetUnvisitedNeigbours {
    grid: Cell[][];
    includeDiagonals?: boolean;
}

class Cell {
    row: number;
    col: number;
    walls: boolean[] = [true, true, true, true];
    isVisited: boolean = false;
    distToStart: number = Infinity;
    previousCell: Cell | null = null;

    constructor({row, col}: ICellConstructor) {
        this.row = row;
        this.col = col;
    }

    show(ctx: CanvasRenderingContext2D, fill: boolean=false) {
        ctx.translate(0.5, 0.5); 
        ctx.beginPath();
        const x = this.col * CELL_SIZE;
        const y = this.row * CELL_SIZE;

        ctx.fillStyle = "red"; 
        fill && ctx.fillRect(x,y, CELL_SIZE, CELL_SIZE)

        if (this.walls[0]) {
            ctx.moveTo(x,y)
            ctx.lineTo(x + CELL_SIZE,y);
        }

        if (this.walls[1]) {
            ctx.moveTo(x + CELL_SIZE, y);
            ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE)
        }

        if (this.walls[2]) {
            ctx.moveTo(x + CELL_SIZE, y + CELL_SIZE)
            ctx.lineTo(x, y + CELL_SIZE);
        }

        if (this.walls[3]) {
            ctx.moveTo(x,y+CELL_SIZE) 
            ctx.lineTo(x,y)
        }

        ctx.stroke();
        ctx.translate(-0.5, -0.5);
    }

    getUnvisitedNeigbours({grid, includeDiagonals=false}: IGetUnvisitedNeigbours) {
        const neighbors = [];

        //node above
        if (this.row > 0) neighbors.push(grid[this.row - 1][this.col]);
        //node below
        if (this.row < grid.length - 1) neighbors.push(grid[this.row + 1][this.col]);
        //node left
        if (this.col > 0) neighbors.push(grid[this.row][this.col - 1]);
        //node right
        if (this.col < grid[0].length - 1) neighbors.push(grid[this.row][this.col + 1]);
        
        if (includeDiagonals) {
            //bottom-right
            if (this.row < grid.length - 1 && this.col < grid[0].length - 1) neighbors.push(grid[this.row + 1][this.col + 1])
            //bottom-left
            if (this.row < grid.length - 1 && this.col > 0 ) neighbors.push(grid[this.row + 1][this.col - 1])
            //top-right
            if (this.row > 0 && this.col < grid[0].length - 1) neighbors.push(grid[this.row - 1][this.col + 1])
            //top-left
            if (this.row > 0 && this.col > 0) neighbors.push(grid[this.row - 1][this.col - 1])
        }

        return neighbors.filter(neighbor => !neighbor.isVisited);
    }


    isCellAccessible(cell: Cell) {
        let isAccessible = false;

        if (cell.col !== this.col) {
            const relativePos = cell.col - this.col;
            //left
            if (relativePos < 0) isAccessible = this.walls[3];
            //right
            else if (relativePos > 0) isAccessible = this.walls[1];
        }

        else if (cell.row !== this.row) {
            const relativePos = cell.row - this.row;
            //above
            if (relativePos < 0) isAccessible = this.walls[0];
            //below
            else if (relativePos > 0) isAccessible = this.walls[2];
        }

        return isAccessible;
    }

}


export default Cell;
import Cell from "components/Canvas/Cell";

import cloneDeep from "lodash.clonedeep";

export interface ICellPos {row: number; col: number;}

interface IDijkstrasAlgorithm {
    gridRef: Cell[][];
    startPos: ICellPos;
    endPos: ICellPos; 
}

 
const dijkstrasAlgorithm = ({gridRef, startPos, endPos}: IDijkstrasAlgorithm) => {  
    
    //copy
    const grid: Cell[][] = cloneDeep(gridRef);
    
    grid[startPos.row][startPos.col].distToStart = 0;

    const visitedCells: Cell[] = [];
    const unvisitedCells = grid.flat();

    //keep going until no more unvisited nodes
    while (!!unvisitedCells.length) {
        sortCellsByDistance(unvisitedCells);
        //closest element to the starting position
        const closestCell = unvisitedCells.shift();

        if (!closestCell) break;
        
        //reaches the end
        if (closestCell === grid[endPos.row][endPos.col]) break

        const neighborCells = closestCell.getUnvisitedNeigbours({grid, includeDiagonals: true})

        neighborCells.forEach(c => {
            if (!closestCell.isCellAccessible(c)) {
                console.log(c)
            }
        })

        if (!neighborCells) continue;

        for (let neighbor of neighborCells) {

            const distFromClosestCell = ((neighbor.col - closestCell.col)**2 + (neighbor.row - closestCell.row)**2)**0.5; 
            const neighborNewDistToStart = closestCell.distToStart + distFromClosestCell;
             
            if (neighbor.distToStart > neighborNewDistToStart) {

                neighbor.distToStart = neighborNewDistToStart;
                neighbor.previousCell = closestCell;
            }
            
        }

        //once all the neighbor node's distToStarts have been updated, the node has been visited
        closestCell.isVisited = true;
        visitedCells.push(closestCell);
    }

    const shortestPath = getShortestPathFromCell(grid[endPos.row][endPos.col])

    return {grid, visitedCells, shortestPath}
}


const sortCellsByDistance = (nodes: Cell[]) => {
    nodes.sort((nodeA, nodeB) => nodeA.distToStart - nodeB.distToStart);
}


export const getShortestPathFromCell = (endCell: Cell) => {
    const path: Cell[] = [];
    let currentCell: Cell = endCell;

    while (currentCell.previousCell) {
        //unshift adds to the beginning of the array
        path.unshift(currentCell);
        currentCell = currentCell.previousCell;
    }

    //the starting position
    path.unshift(currentCell);

    return path;
}

export default dijkstrasAlgorithm;
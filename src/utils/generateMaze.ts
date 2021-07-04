import Cell from "components/Canvas/Cell";


const generateMaze = (grid: Cell[][]) => {
    
    grid[0][0].isVisited = true;

    const process: Cell[] = [];
    
    const stack: Cell[] = [grid[0][0]];
    
    while (!!stack.length) {
        let current = stack.pop()!;

        process.push(current);

        const neighbours = current.getUnvisitedNeigbours({grid});
        
        if (neighbours.length === 0) continue;

        stack.push(current);

        const randNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)]
        
        //remove wall 
        if (randNeighbour.col !== current.col) {
            const relativePos = randNeighbour.col - current.col;
            //left
            if (relativePos < 0) {            
                randNeighbour.walls[1] = false;
                current.walls[3] = false;
            }
            //right
            else if (relativePos > 0) {
                randNeighbour.walls[3] = false;
                current.walls[1] = false;
            }
        }

        else if (randNeighbour.row !== current.row) {
            const relativePos = randNeighbour.row - current.row;
            //above
            if (relativePos < 0) {
                randNeighbour.walls[2] = false;
                current.walls[0] = false;
            }
            //below
            else if (relativePos > 0) {
                randNeighbour.walls[0] = false;
                current.walls[2] = false;
            }
        }

        randNeighbour.isVisited = true;
        stack.push(randNeighbour);
    
    }

    return process;
}
 
export default generateMaze;
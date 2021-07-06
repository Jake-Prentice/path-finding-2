import { CELL_SIZE } from 'myConstants';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import dijkstrasAlgorithm from 'utils/dijkstras';
import generateMaze from 'utils/generateMaze';
import Cell from './Cell';

const grid: Cell[][] = []

const Canvas = () => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [process, setProcess] = useState<Cell[]>([]);
    const [shortestPath, setShortestPath] = useState<Cell[]>([]);

    useEffect(() => {
        if (shortestPath.length === 0 || !ctxRef.current || process.length > 0) return;
            setTimeout(() => {
                shortestPath[0].show(ctxRef.current!, true);
                setShortestPath(prev => prev.slice(1));
            }, 30)
        
    }, [shortestPath, process])

    useEffect(() => {
        if (process.length === 0 || !ctxRef.current ) return;

        setTimeout(() => {
            const current = process[0];
            setProcess(prev => prev.slice(1) ||[]);
            current.show(ctxRef.current!);
        }, 0)

    }, [process])


    useEffect(() => {
        const canvas = canvasRef?.current
        if (!canvas) return;
        const ctx = canvasRef?.current?.getContext("2d");
        if (!ctx) return;

        canvas.width = 1000;
        canvas.height = 1000;

        ctxRef.current = ctx;

        for (let row=0; row < canvas.height/CELL_SIZE; row++) {
            grid[row] = [];
            for (let col=0; col < canvas.width/CELL_SIZE; col++) {
                grid[row][col] = new Cell({row, col})
            }
        }


        const process = generateMaze(grid);
        setProcess(process);

        for (let r=0; r<grid.length; r++) {
            for (let c=0; c < grid[0].length; c++) {
                grid[r][c].isVisited = false;
        //         grid[r][c].show(ctx);
            }
        }

        const res = dijkstrasAlgorithm({
            gridRef: grid, 
            endPos: {row: grid.length - 1, col: grid[0].length - 1},
            startPos: {row: 0, col: 0}
        });


        if (!res) return;
        
        if (res.shortestPath) setShortestPath(res.shortestPath); 

    }, [])
    
    
    
    return (
        <canvas ref={canvasRef} />
    );
}

export default Canvas;

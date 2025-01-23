export function generateMaze(x, y) {
    const maze = [];
    const unvisited = [];

    // Initialisation de la grille
    for (let i = 0; i < y; i++) {
        maze[i] = [];
        unvisited[i] = [];
        for (let j = 0; j < x; j++) {
            maze[i][j] = [0, 0, 0, 0];
            unvisited[i][j] = true;
        }
    }

    // Début de la génération
    let currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
    const path = [currentCell];
    unvisited[currentCell[0]][currentCell[1]] = false;
    let visited = 1;

    while (visited < x * y) {
        const neighbors = [];
        const [cx, cy] = currentCell;

        const directions = [
            [cx - 1, cy, 0, 2], // Nord
            [cx, cy + 1, 1, 3], // Est
            [cx + 1, cy, 2, 0], // Sud
            [cx, cy - 1, 3, 1], // Ouest
        ];

        for (const [nx, ny, dir, opp] of directions) {
            if (nx >= 0 && ny >= 0 && nx < y && ny < x && unvisited[nx][ny]) {
                neighbors.push([nx, ny, dir, opp]);
            }
        }

        if (neighbors.length) {
            const [nx, ny, dir, opp] = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[cx][cy][dir] = 1;
            maze[nx][ny][opp] = 1;
            unvisited[nx][ny] = false;
            visited++;
            path.push(currentCell);
            currentCell = [nx, ny];
        } else {
            currentCell = path.pop();
        }
    }

    return maze;
}
export function solve(maze, startX, startY, endX, endY) {
    const visited = Array.from({ length: maze.length }, () =>
        Array.from({ length: maze[0].length }, () => false)
    );
    const solution = [];
    let stack = [[startX, startY]];

    while (stack.length) {
        const [x, y] = stack.pop();
        if (visited[x][y]) continue;

        visited[x][y] = true;
        solution.push([x, y]);

        if (x === endX && y === endY) break;

        const directions = [
            [x - 1, y, 0], // Nord
            [x, y + 1, 1], // Est
            [x + 1, y, 2], // Sud
            [x, y - 1, 3], // Ouest
        ];

        for (const [nx, ny, dir] of directions) {
            if (nx >= 0 && ny >= 0 && nx < maze.length && ny < maze[0].length && !visited[nx][ny] && maze[x][y][dir] === 1) {
                stack.push([nx, ny]);
            }
        }
    }

    return solution;
}

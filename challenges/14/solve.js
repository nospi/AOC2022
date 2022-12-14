const SAND_SOURCE = { x: 500, y: -1 }

const makeWall = (coords) => {
    const wall = [coords.shift()]
    while (coords.length) {
        const coord = coords.shift()
        const from = wall[wall.length - 1]

        const dx = coord.x - from.x;
        const dy = coord.y - from.y;

        if (dx > 0) {
            for (var i = 1; i <= dx; i++) {
                const cell = { x: from.x + i, y: from.y };
                wall.push(cell)
            }
        }
        if (dx < 0) {
            for (var i = -1; i >= dx; i--) {
                const cell = { x: from.x + i, y: from.y };
                wall.push(cell)
            }
        }
        if (dy > 0) {
            for (var i = 1; i <= dy; i++) {
                const cell = { x: from.x, y: from.y + i };
                wall.push(cell)
            }
        }
        if (dy < 0) {
            for (var i = -1; i >= dy; i--) {
                const cell = { x: from.x, y: from.y + i };
                wall.push(cell)
            }
        }
    }
    return wall;
}

const drawGrid = (grid, grain) => {

    const minX = Math.min(...grid.map(cell => cell.x)) - 1;
    const minY = 0;
    const maxX = Math.max(...grid.map(cell => cell.x))
    const maxY = Math.max(...grid.map(cell => cell.y)) + 1;

    for (var y = minY; y <= maxY; y++) {
        var line = "";
        for (var x = minX; x <= maxX; x++) {
            if (grain.x == x && grain.y == y)
                line += "O";
            else if (grid.find(c => c.x == x && c.y == y))
                line += "#"
            else
                line += "."
        }
        console.log(line)
    }
    console.log()
}

const nextValidMove = (grid, grain) => {
    const down = { x: grain.x, y: grain.y + 1 };
    const downLeft = { x: grain.x - 1, y: grain.y + 1 };
    const downRight = { x: grain.x + 1, y: grain.y + 1 };

    const match = (target) => (c) => (c.x == target.x && c.y == target.y);

    if (!grid.find(match(down)))
        return down;

    if (!grid.find(match(downLeft)))
        return downLeft

    if (!grid.find(match(downRight)))
        return downRight

    grid.push(grain)
    return false;
}

const nextValidMovePart2 = (grid, grain, maxY) => {
    const down = { x: grain.x, y: grain.y + 1 };
    const downLeft = { x: grain.x - 1, y: grain.y + 1 };
    const downRight = { x: grain.x + 1, y: grain.y + 1 };

    const match = (target) => (c) => (c.x == target.x && c.y == target.y);

    if (!grid.find(match(down)) && down.y < maxY)
        return down;

    if (!grid.find(match(downLeft)) && downLeft.y < maxY)
        return downLeft

    if (!grid.find(match(downRight)) && downRight.y < maxY)
        return downRight

    grid.push(grain)
    return false;
}

module.exports = {

    mapInput: (input) => {
        const lines = input
            .split("\n")
            .filter(line => line.length)
            .map(line => {
                return line.split(" -> ")
                    .map(coordStr => coordStr.split(",").map(v => parseInt(v)))
                    .map(coordArr => ({ x: coordArr[0], y: coordArr[1] }))
            })
        return lines;
    },

    solve1: (input) => {

        const maxY = Math.max(...input.map(wall => wall.map(coord => coord.y)).flat(1))
        const grid = input.map(makeWall).flat(1);
        var running = true;

        var grainCount = 0;
        while (running) {

            var grain = {...SAND_SOURCE };
            var nextMove = nextValidMove(grid, grain);

            while (nextMove) {
                grain = nextMove;
                if (nextMove.y >= maxY) {
                    drawGrid(grid, grain)
                    return grainCount;
                }
                nextMove = nextValidMove(grid, grain);
            }
            grainCount++;
        }
    },

    solve2: (input) => {

        const maxY = Math.max(...input.map(wall => wall.map(coord => coord.y)).flat(1)) + 2;
        const grid = input.map(makeWall).flat(1);
        var running = true;

        var grainCount = 0;
        while (running) {

            var grain = {...SAND_SOURCE };
            var nextMove = nextValidMovePart2(grid, grain, maxY);

            while (nextMove) {
                grain = nextMove;
                nextMove = nextValidMovePart2(grid, grain, maxY);
                if (!nextMove && grain.x == 500 && grain.y == 0) {
                    drawGrid(grid, grain)
                    return grainCount + 1;
                }
            }
            grainCount++;
        }


    },

}
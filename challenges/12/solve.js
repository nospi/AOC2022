const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

const cell = (char, x, y, h) => ({
    char: char,
    position: { x, y },
    height: h,
    visited: false,
    parent: null,
    neighbours: 0,
    localGoal: 999999,
    globalGoal: 999999,
});

const resetCell = (c) => {
    c.visited = false;
    c.parent = null;
    c.localGoal = 999999;
    c.globalGoal = 999999;
}

const getTraversibleNeighbours = (cell, grid) => {
    let neighbours = [];
    let diffs = [
        { x: +0, y: -1 }, // UP
        { x: +0, y: +1 }, // DOWN
        { x: -1, y: +0 }, // LEFT
        { x: +1, y: +0 }, // RIGHT
    ]
    for (var d of diffs) {
        d.x += cell.position.x;
        d.y += cell.position.y;
        try {
            const neighbour = grid.find(c => c.position.x == d.x && c.position.y == d.y);
            // we can descend any height, but can only ascend 1 level at a time
            if (neighbour && neighbour.height - cell.height <= 1)
                neighbours.push(neighbour);
        } catch (e) {
            // index is outside bound of array
            continue;
        }
    }
    return neighbours;
}

const mapNeighbours = (grid) => {
    grid.forEach((c) => {
        c.neighbours = getTraversibleNeighbours(c, grid);
    })
}

const dist = (a, b) => {
    const dx = b.position.x - a.position.x
    const dy = b.position.y - a.position.y
    return Math.sqrt(dx * dx + dy * dy)
}

const shortestPathLength = (start, end) => {

    start.localGoal = 0
    start.globalGoal = dist(start, end)
    var stack = [start]

    while (stack.length) {

        stack = stack
            // sort by goal, ascending
            .sort((a, b) => a.globalGoal - b.globalGoal)
            // remove visited nodes
            .filter(((node) => !node.visited))

        // ensure some are left or abort
        if (stack.length == 0)
            break;

        // front node is best chance to get goal
        const current = stack.shift()
        current.visited = true

        // test neighbours
        for (const nb of current.neighbours) {

            // add unvisited neighbours to stack
            if (!nb.visited)
                stack.push(nb)

            // determine whether current cell is a better parent for this neighbour
            var goal = current.localGoal + dist(current, nb)
            if (goal < nb.localGoal) {
                nb.parent = current
                nb.localGoal = goal
                nb.globalGoal = nb.localGoal + dist(nb, end)
            }
        }
    }

    // traverse from end to start and count nodes along the way
    var node = end.parent;
    var steps = 0;
    while (node) {
        ++steps;
        node = node.parent;
    }

    // return length of shortest path
    return steps;
}

module.exports = {

    mapInput: (input) => {
        return input.split("\n")
            .filter(line => line.length)
            .map(line => line.split(""))
            .map((row, rowIndex) => {
                return row.map((char, colIndex) => {
                    const letter = (char == "S") ? "a" : ((char == "E") ? "z" : char);
                    return cell(char, colIndex, rowIndex, ALPHABET.indexOf(letter));
                })
            })
            .flat(1)
    },

    solve1: (grid) => {
        mapNeighbours(grid);
        const start = grid.find(c => c.char == "S")
        const end = grid.find(c => c.char == "E")
        return shortestPathLength(start, end)
    },

    solve2: (grid) => {
        mapNeighbours(grid);
        const starts = grid.filter(c => c.char == "a");
        const end = grid.find(c => c.char == "E")
        return starts
            .map((start) => {
                grid.forEach(resetCell);
                return shortestPathLength(start, end)
            })
            .filter(steps => steps > 0)
            .reduce((prev, curr) => (curr < prev) ? curr : prev, 99999)
    },

}
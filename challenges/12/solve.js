const cell = (char, x, y, h) => ({
    char: char,
    position: { x, y },
    height: h,
    visited: false,
    parent: null,
    neighbours: 0,
    localGoal: 99999999,
    globalGoal: 99999999,
});

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

const getTraversibleNeighbours = (cell, grid) => {
    let diffs = [
        { x: +0, y: -1 }, // UP
        { x: +0, y: +1 }, // DOWN
        { x: -1, y: +0 }, // LEFT
        { x: +1, y: +0 }, // RIGHT
    ]
    let neighbours = []
    for (var d of diffs) {
        d.x += cell.position.x
        d.y += cell.position.y
        try {
            const neighbour = grid.find(c => c.position.x == d.x && c.position.y == d.y)
            if (neighbour) {
                const dh = neighbour.height - cell.height
                if (dh <= 1) {
                    neighbours.push(neighbour)
                }
            }
        } catch (e) {
            // continue
        }
    }
    return neighbours
}

module.exports = {

    mapInput: (input) => {
        return input.split("\n")
            .filter(line => line.length)
            .map(line => line.split(""))
            .map((row, rowIndex) => {
                return row.map((char, colIndex) => {
                    let height;
                    switch (char) {
                        case "S":
                            height = ALPHABET.indexOf("a");
                            break;
                        case "E":
                            height = ALPHABET.indexOf("z");
                            break;
                        default:
                            height = ALPHABET.indexOf(char)
                    }
                    return cell(char, colIndex, rowIndex, height)
                })
            })
            .flat(1)
    },

    solve1: (grid) => {
        grid = grid
            .map((col) => {
                col.neighbours = getTraversibleNeighbours(col, grid)
                return col
            });

        const dist = (a, b) => {
            const dx = b.position.x - a.position.x
            const dy = b.position.y - a.position.y
            return Math.sqrt(dx * dx + dy * dy)
        }

        var stack = []

        const start = grid.find(c => c.char == "S")
        const end = grid.find(c => c.char == "E")

        start.height = ALPHABET.indexOf('a')
        end.height = ALPHABET.indexOf('z')

        start.localGoal = 0
        start.globalGoal = dist(start, end)
        stack.push(start)

        while (stack.length) {

            stack = stack
                // sort by goal, ascending
                .sort((a, b) => a.globalGoal - b.globalGoal)
                // remove visited nodes
                .filter(((node) => !node.visited))

            // ensure some are left or abort
            if (stack.length == 0)
                break;

            // front node is best change to get goal
            const current = stack.shift()
            current.visited = true

            // test neighbours
            for (const nb of current.neighbours) {

                // only bother with unvisited nodes
                if (!nb.visited) {
                    stack.push(nb)
                }
                // determine whether current cell is a better parent for this neighbour
                var possiblyLowerGoal = current.localGoal + dist(current, nb)
                if (possiblyLowerGoal < nb.localGoal) {
                    nb.parent = current
                    nb.localGoal = possiblyLowerGoal
                    nb.globalGoal = nb.localGoal + dist(nb, end)
                }
            }
        }

        let parent = end.parent;
        let count = 0;
        while (parent) {
            ++count;
            parent = parent.parent;
        }

        return count;
    },

    solve2: (grid) => {
        grid = grid
            .map((col) => {
                col.neighbours = getTraversibleNeighbours(col, grid)
                return col
            });

        const dist = (a, b) => {
            const dx = b.position.x - a.position.x
            const dy = b.position.y - a.position.y
            return Math.sqrt(dx * dx + dy * dy)
        }

        const end = grid.find(c => c.char == "E")
        end.height = ALPHABET.indexOf('z')

        let starts = grid.filter(c => c.char == "a");
        let heights = [];

        for (var start of starts) {

            for (var c of grid) {
                c.visited = false
                c.parent = null
                c.localGoal = 999999
                c.globalGoal = 999999
                c.neighbours.forEach(n => n.visited = false)
            }

            var stack = []

            start.localGoal = 0
            start.globalGoal = dist(start, end)
            stack.push(start)


            while (stack.length) {

                stack = stack
                    // sort by goal, ascending
                    .sort((a, b) => a.globalGoal - b.globalGoal)
                    // remove visited nodes
                    .filter(((node) => !node.visited))

                // ensure some are left or abort
                if (stack.length == 0)
                    break;

                // front node is best change to get goal
                const current = stack.shift()
                current.visited = true


                // test neighbours
                for (const nb of current.neighbours) {

                    // only bother with unvisited nodes
                    if (!nb.visited) {
                        stack.push(nb)
                    }
                    // determine whether current cell is a better parent for this neighbour
                    var possiblyLowerGoal = current.localGoal + dist(current, nb)
                    if (possiblyLowerGoal < nb.localGoal) {
                        nb.parent = current
                        nb.localGoal = possiblyLowerGoal
                        nb.globalGoal = nb.localGoal + dist(nb, end)
                    }
                }
            }

            let parent = end.parent;
            let count = 0;
            while (parent) {
                ++count;
                parent = parent.parent;
            }

            if (count > 0)
                heights.push(count)
        }

        return Math.min(...heights);
    },

}
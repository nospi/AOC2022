const getColumn = (data, column) => {
    return data.map(row => row[column])
}

const getRow = (data, row) => {
    return data[row]
}

module.exports = {

    mapInput: (input) => {
        const lines = input
            .split("\n")
            .filter(line => line.length)
            .map(line => line.split("").map(c => parseInt(c)))
        return lines
    },

    solve1: (input) => {

        const ROWS = input.length
        const COLS = input[0].length

        // start with perimeter trees
        var visible = ROWS * 2 + COLS * 2 - 4;

        for (var y = 1; y < ROWS - 1; y++) {
            for (var x = 1; x < COLS - 1; x++) {

                const height = input[y][x];
                const blocking = (tree) => tree >= height;

                const north = !getColumn(input, x).slice(0, y).some(blocking)
                const west = !getRow(input, y).slice(0, x).some(blocking)
                const south = !getColumn(input, x).slice(y + 1).some(blocking)
                const east = !getRow(input, y).slice(x + 1).some(blocking)

                if (north || south || east || west)
                    visible++;
            }
        }

        return visible;
    },

    solve2: (input) => {
        const ROWS = input.length
        const COLS = input[0].length

        var maxScenicScore = 0;

        for (var y = 1; y < ROWS - 1; y++) {
            for (var x = 1; x < COLS - 1; x++) {
                const height = input[y][x];
                const blocking = (tree) => tree >= height;

                var north = getColumn(input, x).slice(0, y).reverse()
                var west = getRow(input, y).slice(0, x).reverse()
                var south = getColumn(input, x).slice(y + 1)
                var east = getRow(input, y).slice(x + 1)

                const northIndex = north.findIndex(blocking);
                const southIndex = south.findIndex(blocking);
                const eastIndex = east.findIndex(blocking);
                const westIndex = west.findIndex(blocking);

                if (northIndex != -1) north = north.slice(0, northIndex + 1)
                if (southIndex != -1) south = south.slice(0, southIndex + 1)
                if (eastIndex != -1) east = east.slice(0, eastIndex + 1)
                if (westIndex != -1) west = west.slice(0, westIndex + 1)

                const scenicScore = north.length * south.length * west.length * east.length;

                if (scenicScore > maxScenicScore) {
                    maxScenicScore = scenicScore
                }
            }
        }

        return maxScenicScore
    },

}
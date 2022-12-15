const fs = require("fs");

const manhattanDistance = (v1, v2) => {
    return Math.abs(v2.x - v1.x) + Math.abs(v2.y - v1.y);
}

const vec2 = (x, y) => ({ x, y });

module.exports = {

    mapInput: (input) => {
        const re = /Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)/
        const lines = input
            .split("\n")
            .filter(line => line.length)
            .map(line => re.exec(line).slice(1))
            .map(coords => ({
                sensor: { x: parseInt(coords[0]), y: parseInt(coords[1]) },
                beacon: { x: parseInt(coords[2]), y: parseInt(coords[3]) },
            }))
        return lines;
    },

    solve1: (input) => {

        // const TARGET = 10;
        const TARGET = 2000000;
        const grid = []

        input.forEach(({ sensor, beacon }) => {
            // distance to beacon
            const dist = manhattanDistance(sensor, beacon);
            // if radius doesn't meet the target line, return
            if (sensor.y + dist < TARGET) return;
            // only need to populate the grid at our target Y level
            var y = TARGET - sensor.y;
            // only need to search X space for the width where we expect Y to be valid.
            const testDist = dist - Math.abs(TARGET - sensor.y);
            grid.push([sensor.x - testDist, sensor.x + testDist])
        })

        const unique = grid
            .sort((a, b) => a[0] - b[0])
            // remove any that are fully included in any others
            .filter((v, i, a) => {
                const [low, high] = v;
                return !a.some(o => o[0] <= low && o[1] > high)
            })

        // check the next and merge if there are overlaps
        const merged = []
        var entry = unique.shift();
        while (unique.length) {
            const next = unique.shift();
            if (next[0] <= entry[1]) {
                entry[1] = next[1];
                continue;
            }
            merged.push(entry)
            entry = unique.shift();
        }
        merged.push(entry)

        return merged
            .map((range) => range[1] - range[0])
            .reduce((p, c) => p + c, 0)
    },

    solve2: (input) => {
        const MIN_Y = 0;
        const MAX_Y = 4000000;
        // const MAX_Y = 20;
        const TUNING_FREQ = (x, y) => x * 4000000 + y;

        const clamp = (val) => (val < MIN_Y) ? MIN_Y : ((val > MAX_Y) ? MAX_Y : val);

        var grid = []

        input.forEach(({ sensor, beacon }) => {
            // distance to beacon
            const dist = manhattanDistance(sensor, beacon)
                // console.log(sensor, beacon, dist)
            for (var y = clamp(sensor.y - dist); y < clamp(sensor.y + dist); y++) {
                const testDist = dist - Math.abs(y - sensor.y)
                grid[y] = [...(grid[y] || []), [clamp(sensor.x - testDist), clamp(sensor.x + testDist)]];
            }
        })

        grid = grid
            .map(row => {
                return row
                    // remove any that are fully included in any others
                    .filter((v, i, a) => {
                        const [low, high] = v;
                        return !a.some(o => o[0] <= low && o[1] > high)
                    })
                    // sort so that merging will work in one pass
                    .sort((a, b) => a[0] - b[0])
            })

        // check the next and merge if there are overlaps
        const merged = []
        grid.forEach((row) => {
            var mergedRow = []
            var entry = row.shift();
            while (row.length) {
                const next = row.shift();
                if (next[0] <= entry[1]) {
                    entry[1] = next[1];
                    continue;
                }
                mergedRow.push(entry)
                entry = row.shift();
            }
            mergedRow.push(entry)
            merged.push(mergedRow)
            mergedRow = [];
        })

        const BEACON_Y = merged.findIndex((row) => row.length > 1);
        const BEACON_X = merged[BEACON_Y][0][1] + 1

        return TUNING_FREQ(BEACON_X, BEACON_Y)
    },

}
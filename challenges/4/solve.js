const fullyContains = (r1, r2) => {
    return (r1[0] <= r2[0] && r1[1] >= r2[1]) || (r2[0] <= r1[0] && r2[1] >= r1[1]);
}

const overlap = (r1, r2) => {
    return (r1[0] >= r2[0] && r1[0] <= r2[1]) ||
        (r1[1] >= r2[0] && r1[1] <= r2[1]) ||
        (r2[0] >= r1[0] && r2[0] <= r1[1]) ||
        (r2[1] >= r1[0] && r2[1] <= r1[1]);
}

module.exports = {

    mapInput: (input) => {
        const lines = input.split("\n");
        return lines
            .filter(line => line.length)
            .map(line => line.split(","))
            .map(ranges => {
                // [ [ low, high ], [ low, high ] ]
                return ranges.map(range => {
                    return range.split("-").map(v => parseInt(v))
                })
            })
    },

    solve1: (input) => {
        // how many ranges fully contain the other?
        return input
            .filter(ranges => fullyContains(ranges[0], ranges[1]))
            .length;
    },

    solve2: (input) => {
        // how many ranges overlap at all?
        return input
            .filter(ranges => overlap(ranges[0], ranges[1]))
            .length;
    },

}
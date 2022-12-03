const ALPHABET = "#abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

module.exports = {

    mapInput: (input) => {
        const lines = input.split("\n")
        var mapped = [];
        for (var line of lines) {
            const length = line.length / 2;
            if (length > 0) {
                mapped.push([
                    line.slice(0, length),
                    line.slice(length)
                ]);
            }
        }
        return mapped;
    },

    solve1: (input) => {
        return input
            .map((row) => {
                if (row.length) {
                    for (var char of row[0]) {
                        if (row[1].includes(char))
                            return ALPHABET.indexOf(char);
                    }
                }
            })
            .reduce((prev, cur) => isNaN(cur) ? prev : (prev + cur), 0)
    },

    solve2: (input) => {
        var grouped = [];
        for (var i = 0; i < input.length; i += 3) {
            grouped.push([
                input[i + 0].join(""), // need to join because I split the input in half for solving part1
                input[i + 1].join(""),
                input[i + 2].join(""),
            ]);
        }

        return grouped
            .map(group => {
                for (var char of group[0]) {
                    if (group[1].includes(char) && group[2].includes(char)) return ALPHABET.indexOf(char);
                }
            })
            .reduce((prev, cur) => prev + cur, 0);
    },

}
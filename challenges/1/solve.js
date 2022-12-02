const { sum, sortDesc } = require("../../utils");

module.exports = {

    mapInput: (input) => {
        var mapped = [];
        var elf = [];
        for (var line of input.split("\n")) {
            if (line != "")
                elf.push(line)
            else {
                mapped.push(elf)
                elf = []
            }
        }
        return mapped;
    },

    solve1: (input) => {
        const summed = input.map(elf => { return elf.reduce(sum, 0) })
        const max = Math.max(...summed)
        console.info(max)
    },

    solve2: (input) => {
        const summed = input.map(elf => elf.reduce(sum, 0))
        const sorted = summed.sort(sortDesc)
        const top3 = sorted.slice(0, 3)
        const total = top3.reduce(sum, 0)
        console.info(total)
    },

}
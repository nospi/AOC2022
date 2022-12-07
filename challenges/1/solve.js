module.exports = {

    mapInput: (input) => {
        var mapped = [];
        var elf = [];
        for (var line of input.split("\n")) {
            if (line != "")
                elf.push(parseInt(line))
            else {
                mapped.push(elf)
                elf = []
            }
        }
        return mapped;
    },

    solve1: (input) => {
        const summed = input.map(elf => { return elf.reduce((p, c) => p + parseInt(c), 0) })
        const max = Math.max(...summed)
        return max;
    },

    solve2: (input) => {
        const summed = input.map(elf => elf.reduce((p, c) => p + parseInt(c), 0))
        const sorted = summed.sort((a, b) => b - a)
        const top3 = sorted.slice(0, 3)
        const total = top3.reduce((p, c) => p + parseInt(c), 0)
        return total;
    },

}
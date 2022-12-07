module.exports = {

    mapInput: (input) => {
        const lines = input.split("\n");
        return lines.filter(line => line.length)[0].split("")
    },

    solve1: (input) => {
        var count = 0;
        var prev4 = [null, null, null, null];
        for (var char of input) {
            count++;
            prev4.push(char)
            prev4 = prev4.slice(-4)
            const unique = prev4.filter((v, i, a) => a.indexOf(v) == i)
            if (unique.length == 4 && !unique.some(v => v == null)) {
                return count
            }
        }
        return count;
    },

    solve2: (input) => {
        var count = 0;
        var prev14 = [null, null, null, null];
        for (var char of input) {
            count++;
            prev14.push(char)
            prev14 = prev14.slice(-14)
            const unique = prev14.filter((v, i, a) => a.indexOf(v) == i)
            if (unique.length == 14 && !unique.some(v => v == null)) {
                return count
            }
        }
        return count;
    },

}
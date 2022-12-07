module.exports = {

    mapInput: (input) => {
        let lines = input.split("\n");

        // break into section 1 and 2 with empty line
        let section1 = [];
        var line = lines.shift();
        while (line != "") {
            section1.push(line)
            line = lines.shift();
        }

        // crate object of columnData with key of columnId
        // ordered from bottom to top
        const ROWS = section1.length
        const data = {}
        for (var i = 1; i < section1[0].length; i += 4) {
            const columnId = section1[ROWS - 1][i];
            const rowData = [];
            for (var j = ROWS - 2; j >= 0; j--) {
                const crateId = section1[j][i];
                if (crateId != " ")
                    rowData.push(crateId)
                else
                    break;
            }
            data[columnId] = rowData;
        }

        // section 2 is the remainder of the input
        let section2 = lines.filter(line => line.length)

        // objectify instructions
        const instructions = section2.map((instructionString) => {
            const re = /move (\d+) from (\d+) to (\d+)/;
            const [count, source, destination] = re.exec(instructionString).slice(1);
            return { count, source, destination }
        })
        return { data, instructions };
    },

    solve1: (input) => {
        for (const step of input.instructions) {
            var count = step.count;
            while (count > 0) {
                let temp = input.data[step.source].pop()
                input.data[step.destination].push(temp)
                count--
            }
        }
        let result = "";
        for (var i = 1; i <= Object.keys(input.data).length; i++) {
            result += input.data[i][input.data[i].length - 1]
        }
        return result;
    },

    solve2: (input) => {
        for (const step of input.instructions) {
            const index = input.data[step.source].length - step.count;
            const temp = input.data[step.source].splice(index, step.count);
            input.data[step.destination].push(...temp);
        }
        let result = "";
        for (var i = 1; i <= Object.keys(input.data).length; i++) {
            result += input.data[i][input.data[i].length - 1]
        }
        return result;
    },

}
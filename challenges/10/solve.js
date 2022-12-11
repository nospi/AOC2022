module.exports = {

    mapInput: (input) => {
        const mapped = input
            .split("\n")
            .filter(line => line.length)
            .map(line => {
                const split = line.split(" ")
                return {
                    op: split[0],
                    arg: split[1] && parseInt(split[1])
                }
            })
        return mapped;
    },

    solve1: (input) => {

        let x = 1;
        let signal_strengths = [];

        var total_cycles = 0;
        var pc = 0;
        var instr = null;
        var instr_cycles = 0;

        instr = input[pc]

        while (true) {

            var nextInstr = false;

            switch (instr.op) {
                case "noop":
                    if (instr_cycles >= 1) {
                        nextInstr = true;
                        // nothing else to do
                    }
                    break;
                case "addx":
                    if (instr_cycles >= 2) {
                        nextInstr = true;
                        x += instr.arg;
                    }
                    break;
            }

            instr_cycles++;

            if (nextInstr) {
                if (pc + 1 >= input.length)
                    break;
                instr = input[++pc];
                instr_cycles = 1;
            }

            total_cycles++;

            if ((total_cycles - 20) % 40 == 0) {
                const signal_strength = total_cycles * x;
                signal_strengths.push(signal_strength);
            }
        }

        return signal_strengths.reduce((p, c) => p + c, 0);
    },

    solve2: (input) => {
        let x = 1;
        var total_cycles = 0;
        var pc = 0;
        var instr = null;
        var instr_cycles = 0;
        instr = input[pc]

        screen = []
        var row_index = 0;
        var col_index = 0;

        while (true) {
            var nextInstr = false;
            switch (instr.op) {
                case "noop":
                    if (instr_cycles >= 1) {
                        nextInstr = true;
                        // nothing else to do
                    }
                    break;
                case "addx":
                    if (instr_cycles >= 2) {
                        nextInstr = true;
                        x += instr.arg;
                    }
                    break;
            }
            instr_cycles++;
            if (nextInstr) {
                if (pc + 1 >= input.length)
                    break;
                instr = input[++pc];
                instr_cycles = 1;
            }
            total_cycles++;

            // part 2
            if (col_index == 40) {
                row_index++;
                col_index = 0;
            }

            if (col_index == 0) {
                screen[row_index] = [];
            }

            let xArr = [x - 1, x, x + 1];
            if (xArr.includes(col_index)) {
                screen[row_index][col_index] = "#"
            } else {
                screen[row_index][col_index] = " "
            }
            col_index++;

        }

        return screen.map(line => line.join(""))
    },

}
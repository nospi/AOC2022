const MAP_MONKEYS = (line) => {
    const MONKEY_RE = /Monkey (\d+):\n  Starting items: ([\d, ]+)\n  Operation: new = old ([+-/*]) (\d+|old)\n  Test: divisible by (\d+)\n    If true: throw to monkey (\d+)\n    If false: throw to monkey (\d+)/
    const matches = MONKEY_RE.exec(line)
    const monkey = {
        id: matches[1],
        items: matches[2].split(", ").map(str => parseInt(str)),
        targets: matches.slice(6).map(str => parseInt(str)),
        inspections: 0,
        divisor: parseInt(matches[5]),
        op(old) {
            this.inspections++;
            const rhs = matches[4] == "old" ? old : parseInt(matches[4]);
            switch (matches[3]) {
                case "+":
                    return old + rhs;
                case "-":
                    return old - rhs;
                case "*":
                    if (rhs == "old") {
                        // squaring gives us nothing here when we're only going to modulo later
                        return old;
                    }
                    return old * rhs;
                case "/":
                    return (rhs != 0) ? (old / rhs) : old;
            }
        },
        test: (val) => (val % parseInt(matches[5]) == 0),
    }
    return monkey;
}

const process = (monkeys, rounds, worryReductionFn) => {
    var round = 0;
    while (round < rounds) {
        for (var monkey of monkeys) {
            while (monkey.items.length) {
                const worry = worryReductionFn(monkey.op(monkey.items.shift()))
                const targetIndex = monkey.targets[monkey.test(worry) ? 0 : 1]
                monkeys[targetIndex].items.push(worry);
            }
        }
        round++;
    }
    monkeys.sort((a, b) => b.inspections - a.inspections)
    return monkeys[0].inspections * monkeys[1].inspections;
}

module.exports = {

    mapInput: (input) => {
        return input.split("\n\n")
    },

    solve1: (input) => {
        return process(input.map(MAP_MONKEYS), 20, (worry) => Math.floor(worry / 3))
    },

    solve2: (input) => {
        const monkeys = input.map(MAP_MONKEYS);
        const DIVISOR_PRODUCT = monkeys.reduce((p, c) => p * c.divisor, 1)
        return process(monkeys, 10000, (worry) => worry % DIVISOR_PRODUCT)
    },

}
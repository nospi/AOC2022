const path = require("path");

// significant jump in difficulty for hump day?

const size = (path, input) => {
    return Object
        .keys(input)
        .filter(key => key.includes(path))
        .map(key => input[key])
        .map(dir => {
            let size = 0;
            for (var file in dir) {
                size += parseInt(dir[file])
            }
            return size
        })
        .reduce((p, c) => p + c, 0)
}

module.exports = {

    mapInput: (input) => {
        const lines = input.split("\n").filter(line => line.length)

        const mapped = lines.map((line) => {
            const firstchar = line[0]
            const reCmd = /\$/
            const reDir = /d/
            const reFile = /\d/
            switch (true) {
                case reCmd.test(firstchar):
                    return { type: "command", command: line.split(" ")[1], args: line.split(" ").slice(2) }
                case reDir.test(firstchar):
                    return { type: "directory", name: line.split(" ")[1] }
                case reFile.test(firstchar):
                    return { type: "file", name: line.split(" ")[1], size: line.split(" ")[0] }
            }
        });

        let tree = { "/": {}, }
        let commands = mapped.slice(1)
        let cwd = "/"

        while (commands.length) {
            const command = commands.shift()
            switch (command.command) {
                case "ls":
                    while (commands[0] && commands[0].type != "command") {
                        let res = commands.shift()
                        if (res.type == "directory") {
                            const dirPath = path.join(cwd, res.name)
                            tree[dirPath] = {}
                        } else if (res.type == "file") {
                            tree[cwd][res.name] = res.size
                        }
                    }
                    break;
                case "cd":
                    cwd = path.join(cwd, command.args[0])
                    break;
            }
        }

        return tree;
    },

    solve1: (input) => {
        return Object.keys(input)
            .map(path => size(path, input))
            .filter((size) => size <= 100000)
            .reduce((p, c) => p + c, 0)
    },

    solve2: (input) => {
        const TOTAL_DISK_SPACE = 70000000;
        const UNUSED_TARGET = 30000000;
        const FREE_SPACE = TOTAL_DISK_SPACE - size("/", input);
        return Object.keys(input)
            .map(path => size(path, input))
            .filter((size) => size >= UNUSED_TARGET - FREE_SPACE)
            .sort((a, b) => a - b)[0]
    },

}
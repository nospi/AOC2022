const fs = require('fs')

module.exports = {

    mapInput: (input) => {
        const lines = input.split("\n").filter(line => line.length)
        const reLine = /(\w) (\d+)/
        return lines.map(line => reLine.exec(line))
            .map(arr => {
                return {
                    dir: arr[1],
                    dist: parseInt(arr[2])
                };
            })
    },

    solve1: (input) => {
        input = [...input]
            .map(step => {
                let arr = new Array(step.dist)
                arr.fill(step.dir)
                return arr;
            })
            .flat(1)

        // to enable C++ visualisation easily..
        // fs.writeFileSync("input-exploded.txt", input.map(v => `"${v}"`).join(",\n"))

        var h = { x: 0, y: 0 }
        var t = { x: 0, y: 0 }

        // array mem
        var mem = []
        mem.push({...t })

        for (var step of input) {

            // update head
            switch (step) {
                case "R":
                    h.x++;
                    break
                case "L":
                    h.x--;
                    break
                case "U":
                    h.y--;
                    break
                case "D":
                    h.y++;
                    break
            }

            // calc distance between head and tail
            let dx = h.x - t.x
            let dy = h.y - t.y

            // update tail if need be
            if (Math.abs(dx) >= 2 && dy == 0)
                t.x += dx / 2
            else if (Math.abs(dy) >= 2 && dx == 0)
                t.y += dy / 2
            else if (Math.abs(dx) + Math.abs(dy) > 2) {
                t.x += dx / Math.abs(dx)
                t.y += dy / Math.abs(dy)
            }

            // add point to memory if it hasn't already been visited
            if (!mem.find(p => p.x == t.x && p.y == t.y)) {
                mem.push({...t });
            }

        }

        return mem.length
    },

    solve2: (input) => {
        input = [...input]
            .map(step => {
                let arr = new Array(step.dist)
                arr.fill(step.dir)
                return arr;
            })
            .flat(1)

        var body = new Array(10);
        const val = { x: 0, y: 0 };
        // using Array.fill() assigns all entries the same reference...
        for (var i = 0; i < 10; i++)
            body[i] = {...val };

        // array mem
        var mem = [];
        mem.push({...body[9] });

        for (var step of input) {

            // update head
            switch (step) {
                case "R":
                    body[0].x++;
                    break
                case "L":
                    body[0].x--;
                    break
                case "U":
                    body[0].y--;
                    break
                case "D":
                    body[0].y++;
                    break
            }

            // update body
            for (var i = 1; i < body.length; i++) {
                // calc distance between head and tail
                let dx = body[i - 1].x - body[i].x;
                let dy = body[i - 1].y - body[i].y;

                // update tail if need be
                if (Math.abs(dx) >= 2 && dy == 0)
                    body[i].x += dx / 2
                else if (Math.abs(dy) >= 2 && dx == 0)
                    body[i].y += dy / 2
                else if (Math.abs(dx) + Math.abs(dy) > 2) {
                    body[i].x += dx / Math.abs(dx)
                    body[i].y += dy / Math.abs(dy)
                }
            }

            // add tail point to memory if it hasn't already been visited
            if (!mem.find(p => p.x == body[9].x && p.y == body[9].y)) {
                mem.push({...body[9] });
            }
        }

        return mem.length
    },

}
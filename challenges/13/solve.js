// return true if 
const validatePacketPair = (packetPair) => {
    const p1 = [...packetPair[0]];
    const p2 = [...packetPair[1]];

    while (p1.length && p2.length) {
        var left = p1.shift()
        var right = p2.shift()

        // if both are numbers:
        if (!Array.isArray(left) && !Array.isArray(right)) {
            if (left == right)
                continue;
            return left - right;
        }

        // not both numbers: ensure both are arrays
        if (!Array.isArray(left)) left = [left];
        if (!Array.isArray(right)) right = [right];

        // validate the pairs - if they're not INvalid, try the next pair
        const valid = validatePacketPair([left, right]);

        // if proof found, return it. otherwise continue
        if (valid != 0)
            return valid;
    }

    // if left array is empty first
    if (p2.length)
        return -1;

    // if right array is empty first
    if (p1.length)
        return 1;

    // both are empty? we're done!
    return 0;
}

module.exports = {

    mapInput: (input) => {
        return input
    },

    solve1: (input) => {
        return input
            .split("\n\n")
            .map(packetPair => {
                return packetPair.split("\n")
                    .filter(packet => packet.length)
                    .map((packet) => JSON.parse(packet))
            })
            .map((packetPair) => validatePacketPair(packetPair) < 0)
            .map((c, i) => c ? i + 1 : 0)
            .reduce((p, c) => p + c, 0)
    },

    solve2: (input) => {
        const packets = input
            .split("\n")
            .filter(packet => packet.length)
            .map((packet) => JSON.parse(packet))

        const additions = JSON.parse("[[[2]],[[6]]]")
        packets.push(...additions)

        const sorted = packets.sort((a, b) => validatePacketPair([a, b]))

        const dk1 = sorted.findIndex(val => val == additions[0]) + 1
        const dk2 = sorted.findIndex(val => val == additions[1]) + 1

        return dk1 * dk2;
    },

}
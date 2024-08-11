const swol = () => {
    const lookup = {
        A: {
            type: "math",
            info: "Add 2 ints",
            wasm: `i64.add`
        },
        S: {
            type: "math",
            info: "Sub 2 ints",
            wasm: `wasm`
        },
        M: {
            type: "math",
            info: "Multiply 2 ints",
            wasm: `wasm`
        },
        D: {
            type: "math",
            info: "Divide 2 ints",
            wasm: `wasm`
        },
        R: {
            type: "math",
            info: "Remainder of div of 2 ints",
            wasm: `wasm`
        },
        "&": {
            type: "bitwise",
            info: "Binary AND",
            wasm: `wasm`
        },
        "|": {
            type: "bitwise",
            info: "Binary OR (vert line)",
            wasm: `wasm`
        },
        "^": {
            type: "bitwise",
            info: "Binary XOR (Caret symbol)",
            wasm: `wasm`
        },
        "/": {
            type: "bitwise",
            info: "Shift bits left",
            wasm: `wasm`
        },
        "\\": {
            type: "bitwise",
            info: "Shift bits right (unsigned)",
            wasm: `wasm`
        },
        "[": {
            type: "bitwise",
            info: "Rotate bits left",
            wasm: `wasm`
        },
        "]": {
            type: "bitwise",
            info: "Rotate bits right",
            wasm: `wasm`
        },
        F: {
            type: "bitwise",
            info: "Count leading zeros",
            wasm: `wasm`
        },
        T: {
            type: "bitwise",
            info: "Count trailing zeros",
            wasm: `wasm`
        },
        C: {
            type: "bitwise",
            info: "Count 1's in binary int",
            wasm: `wasm`
        },
        E: {
            type: "compare",
            info: "Push 1 if equal else 0",
            wasm: `wasm`
        },
        N: {
            type: "compare",
            info: "Opposite of i64.eq",
            wasm: `wasm`
        },
        Z: {
            type: "compare",
            info: "Push 1 if eq to zero",
            wasm: `wasm`
        },
        "<": {
            type: "compare",
            info: "Less than (signed)",
            wasm: `wasm`
        },
        ">": {
            type: "compare",
            info: "Greater than",
            wasm: `wasm`
        },
        "{": {
            type: "compare",
            info: "Less than or equal",
            wasm: `wasm`
        },
        "}": {
            type: "compare",
            info: "Greater than or equal",
            wasm: `wasm`
        },
        C: {
            type: "value",
            info: "A literal int ex. C1234",
            wasm: `wasm`
        },
        L: {
            type: "value",
            info: 'Run cmds "int" times until E',
            wasm: `wasm`
        },
        E: {
            type: "value",
            info: "End statement for loop",
            wasm: `wasm`
        },
        W: {
            type: "stack",
            info: "Swap top two stack elements",
            wasm: `wasm`
        },
    };

    const tokenize = (str) => {
        const numbers = "-0123456789";
        const tokens = [];
        const temp = [];
        let index = 0;
        while (index < str.length) {

            if (numbers.indexOf(str[index]) !== -1) { // Symbol is number 
                temp.push(str[index]);

            } else { // Symbol is not number
                if (temp.length > 0) {
                    tokens.push({
                        type: "int",
                        value: parseInt(temp.join(""), 10)
                    });
                }
                while (temp.length > 0) { temp.pop(); } // clear temp
                tokens.push({
                    type: "inst",
                    value: str[index]
                });
            }

            index += 1;
        }
        if (temp.length > 0) {
            tokens.push(parseInt(temp.join(""), 10));
        }
        return tokens;
    };

    const compile = (str) => {
        const tokens = tokenize(str);
        const wasm = [];
        for (let token of tokens) {
            if (token["type"] === "int") {
                wasm.push(`i64.const ${token["value"]}`);

            } else { // type === "inst"
                wasm.push(lookup[token["value"]]["wasm"]);

            }
        }
        return wasm.join("\n");
    };

    return {
        compile
    };
};

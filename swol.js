const swol = () => {
    const lookup = {
        A: {
            type: "math",
            info: "Add 2 ints",
            wasm: `i32.add`
        },
        S: {
            type: "math",
            info: "Sub 2 ints",
            wasm: `i32.sub`
        },
        M: {
            type: "math",
            info: "Multiply 2 ints",
            wasm: `i32.mul`
        },
        D: {
            type: "math",
            info: "Divide 2 ints",
            wasm: `i32.div_s`
        },
        R: {
            type: "math",
            info: "Remainder of div of 2 ints",
            wasm: `i32.rem_s`
        },
        "&": {
            type: "bitwise",
            info: "Binary AND",
            wasm: `i32.and`
        },
        V: {
            type: "bitwise",
            info: "Binary OR (vert line)",
            wasm: `i32.or`
        },
        X: {
            type: "bitwise",
            info: "Binary XOR (Caret symbol)",
            wasm: `i32.xor`
        },
        "/": {
            type: "bitwise",
            info: "Shift bits left",
            wasm: `i32.shl`
        },
        "\\": {
            type: "bitwise",
            info: "Shift bits right (unsigned)",
            wasm: `i32.shr_u`
        },
        "[": {
            type: "bitwise",
            info: "Rotate bits left",
            wasm: `i32.rotl`
        },
        "]": {
            type: "bitwise",
            info: "Rotate bits right",
            wasm: `i32.rotr`
        },
        F: {
            type: "bitwise",
            info: "Count leading zeros",
            wasm: `i32.clz`
        },
        T: {
            type: "bitwise",
            info: "Count trailing zeros",
            wasm: `i32.ctz`
        },
        P: {
            type: "bitwise",
            info: "Count 1's in binary int",
            wasm: `i32.popcnt`
        },
        E: {
            type: "compare",
            info: "Push 1 if equal else 0",
            wasm: `i32.eq`
        },
        N: {
            type: "compare",
            info: "Opposite of eq",
            wasm: `i32.ne`
        },
        Z: {
            type: "compare",
            info: "Push 1 if eq to zero",
            wasm: `i32.eqz`
        },
        "<": {
            type: "compare",
            info: "Less than (signed)",
            wasm: `i32.lt_s`
        },
        ">": {
            type: "compare",
            info: "Greater than",
            wasm: `i32.gt_s`
        },
        "{": {
            type: "compare",
            info: "Less than or equal",
            wasm: `i32.le_s`
        },
        "}": {
            type: "compare",
            info: "Greater than or equal",
            wasm: `i32.ge_s`
        },
        I: {
            type: "value",
            info: "A literal int ex. I1234",
            wasm: (n) => `i32.const ${n}`
        },
        L: {
            type: "value",
            info: 'Run cmds "int" times until E',
            wasm: (n) => `loop $loop${n}`
        },
        E: {
            type: "value",
            info: "End statement for loop",
            wasm: (n) => `br_if $loop${n}\nend`
        },
        W: {
            type: "stack",
            info: "Swap top two stack elements",
            wasm: `call $swap`
        },
        P: {
            type: "stack",
            info: "Push element onto stack",
            wasm: `call $push`
        },
        K: {
            type: "stack",
            info: "Kick element off stack",
            wasm: `call $pop`
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
        const wasm = [];
        const loops = [];
        let loop_count = 0;
        const tokens = tokenize(str);
        
        let index = 0;
        while (index < tokens.length) {
            const t = tokens[index]["value"];
            const t1 = (index + 1 < tokens.length) ? tokens[index + 1]["value"] : null;

            if (t === "I") {

                wasm.push(lookup[t]["wasm"](t1));
                index += 1;

            } else if (t === "L") {

                wasm.push(lookup[t]["wasm"](loops.length));
                loops.push(t1);
                loop_count += 1;
                index += 1;

            } else if (t === "E") {
                const lc = loop_count - 1;
                wasm.push(`(local.set $count${lc} (i32.sub (local.get $count${lc}) (i32.const 1)))`);
                wasm.push(`local.get $count${lc}`);
                wasm.push(`i32.const 0`);
                wasm.push(`i32.gt_s`);
                wasm.push(`br_if $loop${lc}`);
                wasm.push(`end`);
                loop_count -= 1;

            } else {
                wasm.push(lookup[t]["wasm"]);

            }

            index += 1;
        }

        const variables = [];
        for (let i = 0; i < loops.length; i++) {
            const value = loops[i];
            variables.push(`(local $count${i} i32)`);
            variables.push(`(local.set $count${i} (i32.const ${value}))`);
        }

        return {
            variables: variables.join("\n"),
            program: wasm.join("\n")
        };
    };

    return {
        compile
    };
};

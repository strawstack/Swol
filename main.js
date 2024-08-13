(async () => {
    const { compile } = swol();

    const weightElem = document.querySelector(".weight");
    const codeElem = document.querySelector(".code.input");
    const wasmOut = document.querySelector(".wasm.output");
    const liftElem = document.querySelector(".lift");
    const outElem = document.querySelector(".mirror.output");

    // Place example in input
    weightElem.innerHTML = document.querySelector("#input").innerHTML;

    // Get program input and wasm global for stack size
    const weight = weightElem.innerHTML.split("\n").map(e => parseInt(e, 10)).reverse();
    const stack_size = new WebAssembly.Global({ value: "i32", mutable: true }, weight.length);

    // Init wasm memory
    const memory = (() => {
        const memory = new WebAssembly.Memory({ initial: 1 });
        const data = new DataView(memory.buffer);
        for (let i = 0; i < weight.length; i++) {
            data.setInt32(i * 4, weight[i], true);
        }
        return memory;
    })();

    const lift = async (e) => {

        const { variables, program } = compile(codeElem.innerHTML);

        // Present wasm program in output window
        wasmOut.innerHTML = `${variables}\n${program}`;


        const { main } = await wasm({ imports: { memory, stack_size } })`
        (module

            (import "imports" "memory" (memory 1))
            
            (global $s (import "imports" "stack_size") (mut i32))

            (func $store (param $index i32) (param $value i32)
                local.get $index
                i32.const 4
                i32.mul
                local.get $value
                i32.store
            )

            (func $load (param $index i32) (result i32)
                local.get $index
                i32.const 4
                i32.mul
                i32.load
            )

            (func $push (param $value i32)
                global.get $s
                local.get $value
                call $store
                (i32.add (global.get $s) (i32.const 1))
                global.set $s
            )

            (func $pop (result i32)
                (i32.sub (global.get $s) (i32.const 1))    
                global.set $s
                global.get $s
                call $load
            )

            (func $swap
                (local $t0 i32)
                (local $t1 i32)
                
                call $pop
                local.set $t0
                call $pop
                local.set $t1
                
                local.get $t0
                call $push
                local.get $t1
                call $push
            )

            (func (export "main") (result i32)
                ${variables}
                ${program}
            )
        )`;

        const ans = main();
        outElem.innerHTML = ans;
        console.log(ans);
    }

    liftElem.addEventListener("click", lift);

})();


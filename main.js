(async () => {
    const { compile } = swol();

    const weightElem = document.querySelector(".weight");
    const codeElem = document.querySelector(".code.input");
    const wasmOut = document.querySelector(".wasm.output");
    const liftElem = document.querySelector(".lift");
    const outElem = document.querySelector(".mirror.output");

    const memory = new WebAssembly.Memory({ initial: 1 });
    const data = new DataView(memory.buffer);
    for (let i = 0; i < 10; i++) {
        data.setInt32(i * 4, i, true);
    }

    const lift = async (e) => {
        const { main } = await wasm({ imports: { memory } })`
        (module

            (import "imports" "memory" (memory 1))
            
            (func $store (param i32) (param i32)
                local.get 0
                i32.const 8
                i32.mul
                local.get 1
                i32.store
            )

            (func $load (param i32) (result i32)
                local.get 0
                i32.const 8
                i32.mul
                i32.load
            )

            (func (export "main") (result i32)
                
                i32.const 3
                i32.const 17
                call $store
                
                i32.const 3
                call $load
            )
        )`;

        // out.innerHTML = main();
        console.log(main());
    }

    liftElem.addEventListener("click", lift);

})();


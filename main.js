(async () => {
    const { compile } = swol();

    const weightElem = document.querySelector(".weight");
    const codeElem = document.querySelector(".code.input");
    const wasmOut = document.querySelector(".wasm.output");
    const liftElem = document.querySelector(".lift");
    const outElem = document.querySelector(".mirror.output");

    const lift = async (e) => {
        const ints = weightElem.innerHTML.split("\n").map(n => parseInt(n, 10)).reverse();

        //console.log(ints);
        //console.log(compile(codeElem.innerHTML));

        const { main } = await wasm`(module
            ;; (memory $heap 1)
            (func (export "main") (result i64)
                (local $r i64)
                
                (local $s i64)

                (local $t0 i64)
                (local $t1 i64)

                (local $i0 i64)

                ;; Program return value
                (local.set $r (i64.const 0))

                ;; Stack index (heap)
                (local.set $s (i64.const 0))
                ;; Stack size temp
                (local.set $h (i64.const 0))
                
                ;; Loop counters
                ;; TOOD: make dynamic based on number of loops
                (local.set $i0 (i64.const 2))

                loop $loop0

                    ;; Load Stack
                    local.get $s
                    local.set $h
                    

                    i64.const 27
                    i64.const 3
                    i64.div_s
                    i64.const 2
                    i64.sub
                    
                    i64.const 12
                    i64.const 3
                    i64.div_s
                    i64.const 2
                    i64.sub

                    i64.add
                    
                    local.get $r
                    i64.add
                    local.set $r

                    local.get $i0
                    i64.const 1
                    i64.sub
                    local.set $i0

                    local.get $i0
                    i64.const 0
                    i64.gt_s
                    br_if $loop0

                end

                ;; local.get $r

                i64.const 4
                i64.const 2
                local.set $t0
                local.set $t1
                local.get $t0
                local.get $t1
                i64.sub
                
            )
        )`;

        // out.innerHTML = main();
        console.log(main());
    }

    liftElem.addEventListener("click", lift);

})();
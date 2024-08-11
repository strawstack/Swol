(async () => {
    const out = document.querySelector(".code.output");

    const input = document.querySelector("#input").innerHTML.split("\n");    
    const ints = input.map(n => parseInt(n, 10));

    const stack_load = [];
    for (let n of ints) {
        stack_load.push(`i64.const ${n}`);
    }

    //
    // Example: Exported Function
    //
    const { main } = await wasm`(module
        (func (export "main") (result i64)
            i64.const 1969
            i64.const 3
            i64.div_s
            i64.const 2
            i64.sub
            i64.const 100756
            i64.const 3
            i64.div_s
            i64.const 2
            i64.sub
            i64.add
        )
    )`;

    // PP3DP2S PP3DP2S A

    out.innerHTML = main() + "much more\nanother line\n another";

})();
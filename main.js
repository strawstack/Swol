(async () => {

    const input = document.querySelector("#input").innerHTML.split("\n");
    input.pop(); // remove trailing newline
    
    const ints = input.map(n => parseInt(n, 10));

    console.log(ints)

    const stack_load = [];
    for (let n of ints) {
        stack_load.push(`i64.const ${n}`);
    }

    const sam = "i64.const 5";

    //
    // Example: Exported Function
    //
    const { main } = await wasm`(module
        (func (export "main") (result i64)
            ${sam}
            i64.const 4
            i64.add
        )
    )`;

    console.log(main());

})();
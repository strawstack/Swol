(async () => {

    //
    // Example: Exported Function
    //
    const { addTwo } = await wasm`(module
        (func (export "addTwo") (param i32 i32) (result i32)
            local.get 0
            local.get 1
            i32.add
        )
    )`;

    for (let i = 0; i < 10; i++) {
        console.log(addTwo(i, i));
    }

    //
    // Example: Imported and Exported Function
    //
    const { exported_func } = await wasm(
        {
            imports: { imported_func: (arg) => console.log(arg) },
        })`
        (module
            (func $i (import "imports" "imported_func") (param i32))
            (func (export "exported_func")
                i32.const 42
                call $i
            )
        )`;

    exported_func();

})();
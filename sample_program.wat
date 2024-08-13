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

        (local $count i32)
        (local.set $count (i32.const 99))

        call $pop
        i32.const 3
        i32.div_s
        i32.const 2
        i32.sub
        call $push

        loop $loop
            call $swap
            call $pop
            i32.const 3
            i32.div_s
            i32.const 2
            i32.sub
            call $pop
            i32.add
            call $push

            (local.set $count (i32.sub (local.get $count) (i32.const 1)))
            local.get $count
            i32.const 0
            i32.gt_s
            br_if $loop
        end

        call $pop

    )
)
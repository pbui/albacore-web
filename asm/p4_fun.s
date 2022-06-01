// p4_fun.s

.text
        ldi r1, 1
        ldi r2, 2
        jal fun1
        and r1, r0, r0
        jal fun2
        quit

fun1:   add r0, r1, r2
        jr r15

fun2:   add r0, r1, r1
        jr r15

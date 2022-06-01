// 3.2.5.2: branching with labels
.text
	    ldi r1, 1	    // let r1 be constant 1
	    ldi r2, 4	    // let r2 be i; i = 4
loop_cond:  bn r2, continue // if (i < 0) go to continue
	    sub r2, r2, r1  // i = i - 1
	    br loop_cond    // go to loop_cond
continue:   ldi r3, 0xff    // let r3 be x; x = 0xff
	    quit

// 3.2.5.1: branching
.text
	    ldi r1, 1	    // let r1 be constant 1
	    ldi r2, 4	    // let r2 be i; i = 4
loop_cond:  bn r2, 3	    // if (i < 0) go to continue (ahead 3)
	    sub r2, r2, r1  // i = i - 1
	    br -2	    // go to loop_cond (back 2)
continue:   ldi r3, 0xff    // let r3 be x; x = 0xff
	    quit

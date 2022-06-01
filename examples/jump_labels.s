// 3.2.6.2: jump with labels
.text
	ldi r1, 5
	jal mult2	// call: jump to 4, save 2 in r15
	or  r2, r1, r1	// copy r0 to r2 (return value from call)
	quit

mult2:	add r0, r1, r1	// r0 = 2*r1 (return value)
	jr  r15		// return: jump to address in r15 (2)

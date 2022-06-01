// 3.4.1: simple function call
.data
A:  6, 4, 0

.text
main:	ldi r3, high(A)	// A
	ldi r0, 8
	shl r3, r3, r0
	ldi r0, low(A)
	or  r3, r3, r0
	
	ld  r1, r3, 0	// a = M[A]
	ld  r2, r3, 1	// b = M[A + 1]

	jal add		// call add

	st  r0, r3, 2	// M[A + 2] = retval
	quit		// quit

add:	add r0, r1, r2	// retval = a + b
	jr  r15

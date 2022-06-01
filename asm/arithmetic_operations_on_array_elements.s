// 3.2.4.4: arithmetic operations on array elements

.data
A: 3, 4, 0

.text
ldi r0, high(A)	    // r0 = A
ldi r1, 8
shl r0, r0, r1
ldi r1, low(A)
or  r0, r0, r1
ld  r1, r0, 0	    // r1 = A[0]
ld  r2, r0, 1	    // r2 = A[1]
add r1, r1, r2	    // r1 = r1 + r2
st  r1, r0, 2	    // A[3] = r1
quit

// 3.2.4.3: st_label_demo.s
// Store the value 7 at address with label v
.data
A: 1, 2, 3, 4
v: 0xcafe

.text
ldi r0, high(v) // high byte of address
ldi r1, 8
shl r0, r0, r1
ldi r1, low(v) // low byte of address
or r0, r0, r1
ldi r2, 7 // data value
st r2, r0, 0
quit

// 3.2.4.3: st_demo.s
// Store the value 7 at address 0xabcd
.text
ldi r0, 0xab // high byte of address
ldi r1, 8
shl r0, r0, r1
ldi r1, 0xcd // low byte of address
or r0, r0, r1
ldi r2, 7 // data value
st r2, r0, 0
quit

// 3.2.4.2 Accessing Small Arrays Using Offsets
.text
ldi r0, 0xf0
ldi r1, 7
st r1, r0, 0
ldi r1, 8
st r1, r0, 1
ldi r1, 9
st r1, r0, 2
quit

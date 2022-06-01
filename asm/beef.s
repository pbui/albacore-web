// beef.s
.text
ldi r1, 0xbe
ldi r0, 8
shl r1, r1, r0
ldi r0, 0xef
or  r1, r1, r0

ldi r2, 0xf0
st  r1, r2, 4
st  r1, r2, 0xb
quit

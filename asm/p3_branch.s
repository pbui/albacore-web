// p3_branch.s

.text
    ldi r5, 0
L1: bn  r5, 2
    bz  r5, L2
    quit

L2: not r5, r5
    br L1

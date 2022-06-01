// 3.4.3.2: function call stack

.text
main:       ldi r14, 255
            ldi r0, 3
            sub r14, r14, r0
            ldi r0, 3
            st  r0, r14, 0
            ldi r0, 4
            st  r0, r14, 1
            jal func1
            ld  r0, r14, 2
            ldi r1, 64
            st  r0, r1, 0
            ldi r0, 3
            add r14, r14, r0 
            quit
            
func1:      ldi r0, 3
            sub r14, r14, r0
            st  r15, r14, 2
            ld  r0, r14, 3
            st  r0, r14, 0
            jal func2
            ld  r0, r14, 1
            ld  r1, r14, 4
            add r0, r0, r1
            st  r0, r14, 5
            ld  r15, r14, 2
            ldi r0, 3
            add r14, r14, r0
            jr  r15

func2:      ld  r0, r14, 0
            add r0, r0, r0
            st  r0, r14, 1
            jr  r15

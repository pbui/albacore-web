.data
// int X = 0xbead;
X: 0xbead

.text
main:               // int main()
                    // {
ldi r1, high(X)     //     int* r1_X_ptr = &X;
ldi r0, 8
shl r1, r1, r0
ldi r0, low(X)
or  r1, r1, r0
ld  r2, r1, 0       //     int  r2_v = *X_ptr;
quit                // }

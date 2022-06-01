![Assembler](https://github.com/pbui/albacore-web/actions/workflows/assembler.yaml/badge.svg)

# albacore-web: albaCore Assembler and Simulator in JavaScript

This is a simple **assembler** and **simulator** for the **albaCore** computer
architecture described in [Jay Brockman]'s **Practical Logic and Processor Design**
with Verilog written in **JavaScript**.

## Assembler

The **assembler** takes assembly source text (ie. `.s`) and translates into a
**memory** image file.

### Web Interface

To run the **assembler** from a web browser, you simply need to open the
`www/albaCoreAsm.html` file in your favorite web browser.

Once you have it open, you can write the assembly source text in the
`source` textbox and then press the `Assemble` button to generate the
**memory** image in the `memory` textbox.

### Command Line Interface

To run the **assembler** from the command-line, you will need the following:

1. [GNOME JavaScript](https://gjs.guide/) (`gjs`)

On [Ubuntu]-based distributions, you can install the necessary dependencies by
doing the following:

```bash
$ sudo apt install gjs gir1.2-glib-2.0
```
    
Once you have `gjs` installed, you can then run the **assembler** as follows:

```bash
$ bin/albaCoreAsm asm/simple_demo.s
```
    
This will run the `bin/albaCoreAsm` script which will invoke the **assembler**
library and process the `asm/simple_demo.s` input assembly source text.  The
resulting **memory** image will be emitted to **standard output**.

### Tests

To test the output of the **assembler**, you can use the `bin/albaCoreAsmTests`
script:

```bash
$ ./bin/albaCoreAsmTests
Assembling asm/arithmetic_operations_on_array_elements.s      ... PASS
Assembling asm/beef.s                                         ... PASS
Assembling asm/branching_labels2.s                            ... PASS
...
```

This will use the `bin/albaCoreAsm` command-line **assembler** on all the
example assembly source files in the `asm` folder and check if the output
matches the corresponding **memory** image files.

### TODOs

- [ ] Add Label to Text Instructions output
- [ ] Add `disassmbly` function/class?
- [ ] Handle C style comments (`/* ... */`)
- [ ] Document code
- [ ] Improve Error Messages (CLI/WWW)
- [ ] Make web interface more aesthetic
- [ ] More test cases

## Simulator

The **simulator ** takes the **memory** image file and executes the program
instructions using a simulated implementation of the **albaCore** computer
architecture.

### Command Line Interface

To run the **simulator** from the command-line, you will need the same
dependencies as the **assembler**.

Once you have `gjs` installed, you can then run the **assembler** as follows:

```bash
$ bin/albaCoreSim asm/simple_demo.mem
```
    
This will run the `bin/albaCoreSim` script which will invoke the **simulator**
library and process the `asm/simple_demo.mem` input memory image.  The
resulting **register** and **memory** contents will be emitted to **standard
output**.

### TODOs

- [ ] Support all opcodes
- [ ] Add web interface
- [ ] Add tests

[Jay Brockman]: https://sites.google.com/a/nd.edu/jay-brockman/home
[Ubuntu]:       https://ubuntu.com

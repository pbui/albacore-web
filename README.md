# albacore-web: albaCore Assembler and Simulator in JavaScript

This is a simple **assembler** and **simulator** for the **albaCore** computer
architecture described in [Jay Brockman]'s [Practical Logic and Processor Design with Verilog] written in **JavaScript**.

## Assembler

The **assembler** takes assembly source text (ie. `.s`) and translates into a
**memory** image file.

### Command Line Interface

To run the **assembler** from the command-line, you will need the following:

1. [GNOME JavaScript](https://gjs.guide/) (`gjs`)

On [Ubuntu]-based distributions, you can install the necessary dependencies by
doing the following:

```bash
$ sudo apt install gjs gir1.2-glib-2.0
```
    
Once you have `gjs` installead, you can then run the **assembler** as follows:

```bash
$ bin/albaCoreAsm asm/simple_demo.s
```
    
This will run the `bin/albaCoreAsm` script which will invoke the `assembler`
library and process the `asm/simple_demo.s` input assembly source text.  The
resulting **memory** image will be emitted to **standard output**.

### Web Interface

To run the **assembler** from a web browser, you simply need to open the
`www/albaCoreAsm.html` file in your favorite web browser.

Once you have it open, you can write the the assembly source text in the
`source` textbox and then press the `Assemble` button to generate the
**memory** image in the `memory` textbox.

### TODO

- [ ] Document code
- [ ] Improve Error Messages (CLI/WWW)
- [ ] More test cases

## Simulator

The **simulator ** takes the **memory** image file and executes the program
instructions using a simulated implementation of the **albaCore** computer
architecture.

### TODO

- [ ] Everything :]


[Practical Logic and Processor Design with Verilog]: doc/Practical Logic and Processor Design.pdf
[Jay Brockman]: https://sites.google.com/a/nd.edu/jay-brockman/home
[Ubuntu]:       https://ubuntu.com

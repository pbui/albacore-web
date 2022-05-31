/* albacore-asm.js: albacore assembler */

/* Constants */

const MEMORY_SEGMENT = Object.freeze({
    text: 0,
    data: 1
});

/* Classes */

class TextInstruction {
    constructor(binary, source) {
    	this.binary = binary;
    	this.source = source;
    }
}

class Assembler {
    constructor() {
    	this.initialize();
    	
    	this.text_instructions = [
	    {regex: /add\s+(?<rw>r[0-9]+)\s*,\s*(?<ra>r[0-9]+),\s*(?<rb>r[0-9]+)/, assembler: this.assemble_add},
	    {regex: /ldi\s+(?<rw>r[0-9]+)\s*,\s*(?<imm8>[0-9a-zA-ZxX]+)/         , assembler: this.assemble_ldi}
    	];
    }

    initialize() {
	// Initialize memory segments and default to parsing text segment
	this.memory_text    = [];
	this.memory_data    = [];
	this.memory_segment = MEMORY_SEGMENT.text;
    }

    assemble_add(rw, ra, rb) {
    	return Assembler.assemble_lop("0", rw, ra, rb);
    }

    assemble_ldi(rw, imm8) {
	rw = parseInt(rw.slice(1)).toString(16);
	if (imm8.startsWith("0x")) {
	    imm8 = imm8.slice(2).padStart(2, "0");
	} else {
	    imm8 = parseInt(imm8).toString(16).padStart(2, "0");
	}
	return "7" + rw + imm8;
    }
    
    static assemble_lop(op, rw, ra, rb) {
	rw = parseInt(rw.slice(1)).toString(16);
	ra = parseInt(ra.slice(1)).toString(16);
	rb = parseInt(rb.slice(1)).toString(16);
	return op + rw + ra + rb;
    }
    
    static assemble_text() {
    	let assembler = new Assembler();

	// Extract assembly text from text area and split into lines
	let source_text  = document.getElementById("albacore_text").value;
	let source_lines = source_text.split('\n');

	for (let line of source_lines) {
	    // Remove whitespace
	    // TODO: Trim comments
	    line = line.trim();

	    // Skip empty lines and C++ style comments
	    // TODO: Skip C style comments
	    if (!line || line.startsWith("//")) {
		continue;
	    }

	    // Switch memory segments
	    if (line == '.text') {	
		assembler.memory_segment = MEMORY_SEGMENT.text;
		continue;
	    } else if (line == '.data') {	
		assembler.memory_segment = MEMORY_SEGMENT.data;
		continue;
	    }

	    let foundMatch = false;

	    if (assembler.memory_segment == MEMORY_SEGMENT.text) {
		// TODO: Handle errors (ie. not enough arguments)
		for (let text_instruction of assembler.text_instructions) {
		    const match = line.match(text_instruction.regex);
		    if (match) {
			let binary = text_instruction.assembler(...match.slice(1));
			console.log(`${binary} // ${line}`);
			foundMatch = true;
		    }
		}
	    }

	    if (!foundMatch) {
	    	console.log(`Invalid instruction: ${line}`);
	    }
	}
    }
}

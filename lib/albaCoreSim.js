// albaCoreSim.js: albaCore Simulator

// Constants

const REGISTERS_SIZE = 16;
const MEMORY_SIZE    = (1<<REGISTERS_SIZE);
const MEMORY_REGEX   = /^@(?<address>[0-9a-zA-Z]{4})\s+(?<binary>[0-9a-zA-Z]{4})\s.*$/

const OP_MASK	     = 0xf000;
const OP_SHIFT	     = 12;

const RW_MASK	     = 0x0f00;
const RW_SHIFT	     = 8;

const RA_MASK	     = 0x00f0;
const RA_SHIFT	     = 4;

const RB_MASK	     = 0x000f;

const OP_CODES	     = Object.freeze({
    add:    0x0,
    sub:    0x1,
    or:	    0x3,
    shl:    0x5,
    ldi:    0x7,
    ld:	    0x8,
    st:	    0x9,
    quit:   0xf
});

// Classes

class Simulator {
    constructor() {
    	this.initialize();
    }

    initialize() {
    	this.memory	= new Array(MEMORY_SIZE).fill(0);
    	this.registers	= new Array(REGISTERS_SIZE).fill(0);
    	this.pc		= 0;
    	this.halted	= false;
    }

    load_from_string(memory_string) {
    	const memory_lines = memory_string.split("\n");

    	for (const memory_line of memory_lines) {
    	    const match = memory_line.match(MEMORY_REGEX);
    	    if (match) {
    	    	const address	     = parseInt(match.groups.address, 16);
    	    	const binary	     = parseInt(match.groups.binary , 16);
    	    	this.memory[address] = binary;
	    }
	}
    }
    
    parse_alu_operands(binary) {
    	return [
    	    (binary & RW_MASK) >> RW_SHIFT,
    	    (binary & RA_MASK) >> RA_SHIFT,
    	    (binary & RB_MASK)
    	];
    }

    parse_ldi_operands(binary) {
    	return [
    	    (binary & RW_MASK) >> RW_SHIFT,
    	    (binary & (RA_MASK | RB_MASK))
    	];
    }
    
    dump_memory() {
    	for (let index = 0; index < this.memory.length; index++) {
    	    const addr = index.toString(16).padStart(4, "0");
    	    const dec  = this.memory[index];
    	    const hex  = "0x" + dec.toString(16).padStart(4, "0");

    	    if (dec) {
		console.log(`M[${addr}] = ${hex} (${dec})`)
	    }
	}
    }

    dump_registers() {
    	for (let index = 0; index < this.registers.length; index++) {
    	    const dec = this.registers[index];
    	    const hex = "0x" + dec.toString(16);

    	    if (dec) {
		console.log(`r${index} = ${hex} (${dec})`)
	    }
	}
    }

    step_once() {
    	if (this.halted) {
    	    return;
	}

	const binary = this.memory[this.pc];
	const op     = (binary & OP_MASK) >> OP_SHIFT;

	switch (op) {
	    case OP_CODES.add: {
	    	const [rw, ra, rb] = this.parse_alu_operands(binary);
	    	this.registers[rw] = this.registers[ra] + this.registers[rb];
	    	break;
	    }
	    
	    case OP_CODES.or: {
	    	const [rw, ra, rb] = this.parse_alu_operands(binary);
	    	this.registers[rw] = this.registers[ra] | this.registers[rb];
	    	break;
	    }

	    case OP_CODES.shl: {
	    	const [rw, ra, rb] = this.parse_alu_operands(binary);
	    	this.registers[rw] = this.registers[ra] << this.registers[rb];
	    	break;
	    }

	    case OP_CODES.ldi: {
	    	const [rw, imm8] = this.parse_ldi_operands(binary);
	    	this.registers[rw] = imm8;
	    	break;
	    }
	    
	    case OP_CODES.ld: {
	    	const [rw, imm4, rb] = this.parse_alu_operands(binary);
	    	const address        = this.registers[rb] + imm4;
	    	this.registers[rw]   = this.memory[address];
	    	break;
	    }
	    
	    case OP_CODES.st: {
	    	const [imm4, ra, rb] = this.parse_alu_operands(binary);
	    	const address        = this.registers[rb] + imm4;
	    	this.memory[address] = this.registers[ra];
	    	break;
	    }

	    case OP_CODES.quit: {
	    	this.halted = true;
	    	break;
	    }

	    default:
		console.log(`Unsupported op code: ${op}`);
	    	break;
	}

	this.pc++;
    }
}

function createSimulator() {
    return new Simulator();
}

// vim: sts=4 sw=4 ts=8 expandtab ft=javascript

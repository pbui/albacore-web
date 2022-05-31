/* albacore-asm.js: albacore assembler */

/* Constants */

const MEMORY_SEGMENTS = Object.freeze({
    text: 0,
    data: 1
});

/* Classes */

class DataLabel {
    constructor(number, binary, label) {
        this.number = number;
        this.binary = binary;
        this.label  = label;
    }

    toString() {
        let number = this.number.toString(16).padStart(4, "0");
        let label  = this.label ? ` label: ${this.label}` : "";
        return `@${number} ${this.binary} //${label}`;
    }
}

class TextInstruction {
    constructor(number, binary, source, label) {
        this.number = number;
        this.binary = binary;
        this.source = source;
    }

    toString() {
        let number = this.number.toString(16).padStart(4, "0");
        return `@${number} ${this.binary} // ${this.source}`;
    }
}

class Assembler {
    constructor() {
        this.initialize();

        this.data_instructions = [
            {regex:     /^(?<label>[0-9a-zA-Z]):\s*(?<value>[0-9a-fA-FxX]+)$/,
             assembler: this.assemble_integer.bind(this)},
            {regex:     /^(?<label>[0-9a-zA-Z]):\s*(?<value>[0-9a-fA-FxX, \t]+)$/,
             assembler: this.assemble_array.bind(this)}
        ]

        this.text_instructions = [
            {regex:     /^add\s+(?<rw>r[0-9]+)\s*,\s*(?<ra>r[0-9]+),\s*(?<rb>r[0-9]+)$/,
             assembler: this.assemble_add.bind(this)},
            {regex:     /^or\s+(?<rw>r[0-9]+)\s*,\s*(?<ra>r[0-9]+),\s*(?<rb>r[0-9]+)$/,
             assembler: this.assemble_or.bind(this)},
            {regex:     /^shl\s+(?<rw>r[0-9]+)\s*,\s*(?<ra>r[0-9]+),\s*(?<rb>r[0-9]+)$/,
             assembler: this.assemble_shl.bind(this)},
            {regex:     /^ldi\s+(?<rw>r[0-9]+)\s*,\s*(?<imm8>.+)$/,
             assembler: this.assemble_ldi.bind(this)},
            {regex:     /^st\s+(?<ra>r[0-9]+)\s*,\s*(?<rb>r[0-9]+),\s*(?<imm4>.+)$/,
             assembler: this.assemble_st.bind(this)},
            {regex:     /^quit$/,
             assembler: this.assemble_quit.bind(this)}
        ];
    }

    initialize() {
        // Initialize memory segments and default to parsing text segment
        this.data_memory = [];
        this.text_memory = [];
        this.labels      = {};
    }

    // Assembly methods

    assemble_3op(op, rw, ra, rb) {
        rw = this.parse_operand(rw);
        ra = this.parse_operand(ra);
        rb = this.parse_operand(rb);
        return op + rw + ra + rb;
    }

    assemble_integer(integer) {
        return [this.parse_operand(integer, 4)];
    }

    assemble_array(array) {
        return array.split(',').map(integer => this.parse_operand(integer, 4));
    }

    assemble_add(rw, ra, rb) {
        return this.assemble_3op("0", rw, ra, rb);
    }

    assemble_or(rw, ra, rb) {
        return this.assemble_3op("3", rw, ra, rb);
    }

    assemble_shl(rw, ra, rb) {
        return this.assemble_3op("5", rw, ra, rb);
    }

    assemble_ldi(rw, imm8) {
        rw   = this.parse_operand(rw);
        imm8 = this.parse_operand(imm8, 2);
        return "7" + rw + imm8;
    }

    assemble_st(ra, rb, imm4) {
        return this.assemble_3op("9", imm4, ra, rb);
    }

    assemble_quit() {
        return "f000";
    }

    // Parsing methods

    parse_operand(operand, width = 1) {
        // Parse label operands
        var highMatch = operand.match(/high\((?<label>.+)\)/);
        if (highMatch) {
            return this.labels[highMatch[1]].slice(0, 2);
        }

        var lowMatch = operand.match(/low\((?<label>.+)\)/);
        if (lowMatch) {
            return this.labels[lowMatch[1]].slice(2, 4);
        }

        // Parse integer operands
        if (operand.startsWith("r")) {
            operand = operand.slice(1);
        }

        if (operand.startsWith("0x")) {
            return operand.slice(2).padStart(2, "0");
        } else {
            return parseInt(operand).toString(16).padStart(width, "0");
        }
    }

    parse_segment_lines(source_lines) {
        let data_lines = [];
        let text_lines = [];
        let memory_segment = MEMORY_SEGMENTS.text;

        for (let source_line of source_lines) {
            // Trim whitespace and C++ comments
            // TODO: Skip C style comments
            source_line = source_line.trim().replace(/\/\/.*$/, '');

            // Skip empty lines
            if (!source_line) {
                continue;
            }

            if (source_line == '.data') {
                memory_segment = MEMORY_SEGMENTS.data;
            } else if (source_line == '.text') {
                memory_segment = MEMORY_SEGMENTS.text;
            } else {
                if (memory_segment == MEMORY_SEGMENTS.data) {
                    data_lines.push(source_line);
                } else {
                    text_lines.push(source_line);
                }
            }
        }

        return [data_lines, text_lines];
    }

    // Memory segment assembly methods

    assemble_data_segment(data_lines, data_offset) {
        for (const source of data_lines) {
            let parsedLabel = false;

            for (const data_instruction of this.data_instructions) {
                let match = source.match(data_instruction.regex);
                if (match) {
                    const label   = match[1];
                    const values  = data_instruction.assembler(match[2]);
                    const address = data_offset + this.data_memory.length;

                    this.labels[label] = address.toString(16).padStart(4, "0");
                    this.data_memory   = this.data_memory.concat(values.map((value, index) =>
                        new DataLabel(address + index, value, index ? "" : label)
                    ));

                    parsedLabel = true;
                    break;
                }
            }

            if (!parsedLabel) {
                console.log(`Invalid data label: ${source}`);
                return false;
            }
        }

        return true;
    }

    assemble_text_segment(text_lines) {
        for (let number = 0; number < text_lines.length; number++) {
            let source = text_lines[number];
            let foundInstruction = false;

            for (const text_instruction of this.text_instructions) {
                let match = source.match(text_instruction.regex);
                if (match) {
                    const binary = text_instruction.assembler(...match.slice(1));

                    this.text_memory.push(new TextInstruction(
                        number, binary, source
                    ));

                    foundInstruction = true;
                    break;
                }
            }

            if (!foundInstruction) {
                console.log(`Invalid text instruction: ${source}`);
                return false;
            }
        }

        return true;
    }

    // Static Assembly method

    static assemble_source() {
        let assembler = new Assembler();

        // Extract assembly text from text area and split into lines
        const source_textarea = document.getElementById("albacore_source");
        const source_lines    = source_textarea.value.split('\n');

        const [data_lines, text_lines] = assembler.parse_segment_lines(source_lines);

        assembler.assemble_data_segment(data_lines, text_lines.length);
        assembler.assemble_text_segment(text_lines);

        var memory_textarea   = document.getElementById("albacore_memory");
        memory_textarea.value = "// .text\n" + assembler.text_memory.join('\n') + "\n\n" +
                                "// .data\n" + assembler.data_memory.join('\n');
    }
}

// vim: sts=4 sw=4 ts=8 expandtab ft=javascript

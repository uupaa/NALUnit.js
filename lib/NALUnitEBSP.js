(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnitEBSP", function moduleClosure(global) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var HexDump = global["WebModule"]["HexDump"];

// --- define / local variables ----------------------------
var VERIFY  = global["WebModule"]["verify"]  || false;
var VERBOSE = global["WebModule"]["verbose"] || false;

// --- class / interfaces ----------------------------------
var EBSP = {
    "toRBSP": EBSP_toRBSP, // EBSP.toRBSP(ebsp:Uint8Array):Uint8Array
};

// --- implements ------------------------------------------
function EBSP_toRBSP(ebsp) { // @arg Uint8Array - NALUnitHeader + EBSP
                             // @ret Uint8Array - NALUnitHeader + RBSP
//{@dev
    if (VERIFY) {
        $valid($type(ebsp, "Uint8Array"), EBSP_toRBSP, "ebsp");
    }
//}@dev

    if (VERBOSE) {
        HexDump(ebsp, {
            title: "EBSP_toRBSP",
            rule: {
                "AUD":                 { values: [0x09, 0xF0],       bold: true, style: "color:red"    },
                "EP3B(00 00 03 00)":   { values: [0x00, 0x00, 0x03, 0x00],       style: "color:tomato;background-color:yellow" },
                "EP3B(00 00 03 01)":   { values: [0x00, 0x00, 0x03, 0x01],       style: "color:tomato;background-color:yellow" },
                "EP3B(00 00 03 02)":   { values: [0x00, 0x00, 0x03, 0x02],       style: "color:tomato;background-color:yellow" },
                "EP3B(00 00 03 03)":   { values: [0x00, 0x00, 0x03, 0x03],       style: "color:tomato;background-color:yellow" },
            }
        });
    }

    var rbsp        = [];
    var readCursor  = 0;
    var writeCursor = 0;
    var ebspLength  = ebsp.length;

    // --- slide rbsp ---
    var a = 0; // ebsp[current - 2] byte
    var b = 0; // ebsp[current - 1] byte
    var c = 0; // ebsp[current] byte

    while (readCursor < ebspLength) {
        a = b;
        b = c;
        c = ebsp[readCursor] || 0;

        if (a === 0x00 && b === 0x00 && c === 0x03) { // [1] found Emulation Prevention Three byte (00 00 03 0x)
            if (readCursor + 1 < ebspLength) { // inside of the array.
                var nextByte = ebsp[readCursor + 1] || 0;

                if (nextByte === 0x00 || // [00 00 03 00] -> [00 00 00]
                    nextByte === 0x01 || // [00 00 03 01] -> [00 00 01]
                    nextByte === 0x02 || // [00 00 03 02] -> [00 00 02]
                    nextByte === 0x03) { // [00 00 03 03] -> [00 00 03]
                    c = nextByte;
                    readCursor++;
                }
            }
        }
        rbsp[writeCursor] = c;

        readCursor++;
        writeCursor++;
    }

    if (VERBOSE) {
        HexDump(rbsp, {
            title: "EBSP_toRBSP",
            rule: {
                "AUD":                 { values: [0x09, 0xF0], bold: true, style: "color:red"    },
                "EP3B(00 00 03 00)":   { values: [0x00, 0x00, 0x03, 0x00], style: "color:tomato;background-color:yellow" },
                "EP3B(00 00 03 01)":   { values: [0x00, 0x00, 0x03, 0x01], style: "color:tomato;background-color:yellow" },
                "EP3B(00 00 03 02)":   { values: [0x00, 0x00, 0x03, 0x02], style: "color:tomato;background-color:yellow" },
                "EP3B(00 00 03 03)":   { values: [0x00, 0x00, 0x03, 0x03], style: "color:tomato;background-color:yellow" },
            }
        });
    }
    return new Uint8Array(rbsp);
}

return EBSP; // return entity

});


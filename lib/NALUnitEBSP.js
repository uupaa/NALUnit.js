(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnitEBSP", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var HexDump = WebModule["HexDump"];
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
var NALUnitEBSP = {
    "VERBOSE":  VERBOSE,
    "toRBSP":   NALUnitEBSP_toRBSP, // NALUnitEBSP.toRBSP(ebsp:Uint8Array):Uint8Array
};

// --- implements ------------------------------------------
function NALUnitEBSP_toRBSP(ebsp) { // @arg Uint8Array - NALUnitHeader + EBSP
                                    // @ret Uint8Array - NALUnitHeader + RBSP
//{@dev
    if (VERIFY) {
        $valid($type(ebsp, "Uint8Array"), NALUnitEBSP_toRBSP, "ebsp");
    }
//}@dev

    var rbsp        = new Uint8Array(ebsp.length);
    var ebspLength  = ebsp.length;
    var readCursor  = 0;
    var readLimit   = ebspLength - 1;
    var writeCursor = 0;

    // --- slide rbsp ---
    var a = 0xff; // ebsp[current - 2]
    var b = 0xff; // ebsp[current - 1]
    var c = 0xff; // ebsp[current]
    var d = 0xff; // ebsp[current + 1]

    while (readCursor < ebspLength) {
        a = b;
        b = c;
        c = ebsp[readCursor];

        if (a === 0x00 && b === 0x00 && c === 0x03) { // found Emulation Prevention Three byte (00 00 03 0x)
            // [00 00 03 00] -> [00 00 00]
            // [00 00 03 01] -> [00 00 01]
            // [00 00 03 02] -> [00 00 02]
            // [00 00 03 03] -> [00 00 03]
            if (readCursor < readLimit) {
                d = ebsp[readCursor + 1];
                if (d <= 0x03) {
                    c = d;
                    ++readCursor;
                }
            }
        }
        rbsp[writeCursor] = c;

        ++readCursor;
        ++writeCursor;
    }
    return new Uint8Array( rbsp.subarray(0, writeCursor) );
}

return NALUnitEBSP; // return entity

});


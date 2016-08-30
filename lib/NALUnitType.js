(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnitType", function moduleClosure(/* global, WebModule, VERIFY, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
var NALUnitType = {
     0: "UNSPECIFIED",      // Unspecified
     1: "NON_IDR_SLICE",    // non IDR slice
     2: "SLICE_PART_A",     // slice part a // C = 2
     3: "SLICE_PART_B",     // slice part b // C = 3
     4: "SLICE_PART_C",     // slice part c // C = 4
     5: "IDR",              // IDR slice
     6: "SEI",              // supplemental enhancement information
     7: "SPS",              // sequence parameter set
     8: "PPS",              // picture parameter set
     9: "AUD",              // access unit delimiter
    10: "END_OF_SEQ",       // end of sequence
    11: "END_OF_STREAM",    // end of stream
    12: "FILLER_DATA",      // filter data
    13: "SPS_EX",           // sequence parameter set extension
    19: "AUX_SLICE",        // auxilary slice
};

// --- implements ------------------------------------------

return NALUnitType; // return entity

});


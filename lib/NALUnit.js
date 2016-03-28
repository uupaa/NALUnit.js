(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnit", function moduleClosure(/* global, WebModule, VERIFY, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
/*
- ByteStreamFormat
    - MPEG4-10 AVC - Annex B - Byte stream format
- NALUnit
    - MPEG4-15 AVC - NAL file format
- NALUnitUint8ArrayArray
    - [ NALUnitUint8Array, ... ]
- NALUnitObjectArray
    - [ NALUnitObject, ... ]
- NALUnitObject
    - { nal_ref_idc, nal_unit_type, nal_unit_size, index, data, NAL_UNIT_TYPE }
 */
// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
// MPEG4-15 AVC - NAL file format
var NALUnit = {
};

// --- implements ------------------------------------------

return NALUnit; // return entity

});


(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnitAUD", function moduleClosure(global) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var Bit     = global["WebModule"]["Bit"];
var BitView = global["WebModule"]["BitView"];

// --- define / local variables ----------------------------
//var VERIFY  = global["WebModule"]["verify"]  || false;
var VERBOSE = global["WebModule"]["verbose"] || false;
var _split8  = Bit["split8"];  // Bit.split8(u32:UINT32, bitPattern:UINT8Array|Uint8Array):UINT32Array

// --- class / interfaces ----------------------------------
function AUD(nalUnitObject) { // @arg NALUnitObject - { nal_ref_idc, nal_unit_type, nal_unit_size, index, data, NAL_UNIT_TYPE }
    var bitView = new BitView(nalUnitObject["data"], 1); // NALUnitHeader(1)

    access_unit_delimiter_rbsp.call(this, bitView);

    if (VERBOSE) {
        console.dir(this);
    }
}

// --- implements ------------------------------------------
function access_unit_delimiter_rbsp(bitView) {
    var field = _split8(bitView.u(8), [3, 5]); // [primary_pic_type, rbsp_trailing_bits]

    this["primary_pic_type"] = field[0];

  //if (VERBOSE) {
  //    // ffmpeg が生成する primary_pic_type の値は 7 で固定のようです
  //    console.log("primary_pic_type: " + this["primary_pic_type"]);
  //}
}

return AUD; // return entity

});


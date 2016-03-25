(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnit", function moduleClosure(global) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var HexDump     = global["WebModule"]["HexDump"];
var NALUnitType = global["WebModule"]["NALUnitType"];

// --- define / local variables ----------------------------
var VERIFY      = global["WebModule"]["verify"]  || false;
var VERBOSE     = global["WebModule"]["verbose"] || false;

// --- class / interfaces ----------------------------------
// MPEG4-15 AVC - NAL file format
var NALUnit = {
    "toNALUnitObject": NALUnit_toNALUnitObject, // NALUnit.toNALUnitObject(nalUnitArray:NALUnitUint8ArrayArray):NALUnitObjectArray
};

// --- implements ------------------------------------------
function NALUnit_toNALUnitObject(nalUnitArray) { // @arg NALUnitUint8ArrayArray - [ Uint8Array(NALUnitHeader + EBSP), ... ]
                                                 // @ret NALUnitObjectArray - [ NALUnitObject, ... ]
                                                 // @desc convert NALUnit to NALUnitObject.
                                                 //        NALUnitArray:       [ NALUnitUint8Array, ... ]
                                                 //        NALUnitObjectArray: [ NALUnitObject, ... ]
                                                 //        NALUnitObject:      { nal_ref_idc, nal_unit_type, nal_unit_size, index, data, NAL_UNIT_TYPE }
//{@dev
    if (VERIFY) {
        $valid($type(nalUnitArray, "NALUnitUint8ArrayArray"), NALUnit_toNALUnitObject, "nalUnitArray");
    }
//}@dev

    var nalUnitObjectArray = []; // [NALUnitObject, ...]

    for (var i = 0, iz = nalUnitArray.length; i < iz; ++i) {
        var nalUnit       = nalUnitArray[i]; // NALUnit     = NALUnitHeader + EBSP
        var nal_ref_idc   = (nalUnit[0] & 0x60) >> 5;
        var nal_unit_type =  nalUnit[0] & 0x1F;
        var nalUnitObject = {
            "nal_ref_idc":      nal_ref_idc,
            "nal_unit_type":    nal_unit_type,
            "index":            i,
            "data":             nalUnit,
            "NAL_UNIT_TYPE":    NALUnitType[nal_unit_type],
        };

        nalUnitObjectArray.push( nalUnitObject );

        if (VERBOSE) {
            HexDump(nalUnit, {
                title: "NALUnitObject: " + nalUnitObject["NAL_UNIT_TYPE"],
                rule: {
                    "AUD":                 { values: [0x09, 0xF0], bold: true, style: "color:red"    },
                    "EP3B(00 00 03 00)":   { values: [0x00, 0x00, 0x03, 0x00], style: "color:tomato;background-color:yellow" },
                    "EP3B(00 00 03 01)":   { values: [0x00, 0x00, 0x03, 0x01], style: "color:tomato;background-color:yellow" },
                    "EP3B(00 00 03 02)":   { values: [0x00, 0x00, 0x03, 0x02], style: "color:tomato;background-color:yellow" },
                    "EP3B(00 00 03 03)":   { values: [0x00, 0x00, 0x03, 0x03], style: "color:tomato;background-color:yellow" },
                }
            });
        }
    }
    return nalUnitObjectArray;
}

return NALUnit; // return entity

});



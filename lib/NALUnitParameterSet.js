(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnitParameterSet", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function ParameterSet() {
    this._sps = {}; // { seq_parameter_set_id: SPS, ... }
    this._pps = {}; // { pic_parameter_set_id: PPS, ... }
}

ParameterSet["VERBOSE"] = VERBOSE;
ParameterSet["prototype"] = Object.create(ParameterSet, {
    "constructor":  { "value": ParameterSet         },
    "getSPS":       { "value": ParameterSet_getSPS  },
    "setSPS":       { "value": ParameterSet_setSPS  },
    "getPPS":       { "value": ParameterSet_getPPS  },
    "setPPS":       { "value": ParameterSet_setPPS  },
});

// --- implements ------------------------------------------
function ParameterSet_getSPS(id) { // @arg UINT8 - seq_parameter_set_id
                                   // @ret SPS
    if (!(id in this._sps)) {
        throw new TypeError("NOT_FOUND SPS ID: " + id);
    }
    return this._sps[id];
}

function ParameterSet_setSPS(id,    // @arg UINT8 - seq_parameter_set_id
                             sps) { // @arg SPS
    if (id in this._sps) {
        if (ParameterSet["VERBOSE"]) {
            console.log("NALUnitParameterSet OVERWRITE SPS ID: " + id);
        }
    }
    this._sps[id] = sps;
}

function ParameterSet_getPPS(id) { // @arg UINT8 - pic_parameter_set_id
                                   // @ret PPS
    if (!(id in this._pps)) {
        throw new TypeError("NOT_FOUND PPS ID: " + id);
    }
    return this._pps[id];
}

function ParameterSet_setPPS(id,    // @arg UINT8 - pic_parameter_set_id
                             pps) { // @arg PPS
    if (id in this._pps) {
        if (ParameterSet["VERBOSE"]) {
            console.log("NALUnitParameterSet OVERWRITE PPS ID: " + id);
        }
    }
    this._pps[id] = pps;
}

return ParameterSet; // return entity

});


(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnitPPS", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- technical terms / data structure --------------------
var BitView = global["WebModule"]["BitView"];
var EBSP    = global["WebModule"]["NALUnitEBSP"];
// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function PPS(nalUnitObject,  // @arg NALUnitObject - { nal_ref_idc, nal_unit_type, nal_unit_size, index, data, NAL_UNIT_TYPE }
             parameterSet) { // @arg ParameterSet
    var bitView = new BitView( EBSP["toRBSP"](nalUnitObject["data"]), 1 ); // NALUnitHeader(1)

    pic_parameter_set_rbsp.call(this, bitView);

    parameterSet.setPPS(this["pic_parameter_set_id"], this);

    this["avcC_pictureParameterSetLength"]  = nalUnitObject["data"].length;
    this["avcC_pictureParameterSetNALUnit"] = nalUnitObject["data"];

    //if (PPS["VERBOSE"]) {
    //    console.dir(this);
    //}
}
PPS["VERBOSE"] = VERBOSE;

// --- implements ------------------------------------------
function pic_parameter_set_rbsp(bitView) {
    this["pic_parameter_set_id"]                            = bitView.ug(); // PPS のユニークなIDが格納されている
    this["seq_parameter_set_id"]                            = bitView.ug(); // PPS に対応する SPS の ユニークなIDが格納されている
    this["entropy_coding_mode_flag"]                        = bitView.u(1); // [SPEC] Baseline profile では利用しません。常に0になります
    this["bottom_field_pic_order_in_frame_present_flag"]    = bitView.u(1);
    this["num_slice_groups_minus1"]                         = bitView.ug(); // [SPEC] Baseline profile では値の範囲は 0 〜 7 に制限されます
    this["slice_group_map_type"]                            = 0;
    this["run_length_minus1"]                               = [];
    this["top_left"]                                        = [];
    this["bottom_right"]                                    = [];
    this["slice_group_id"]                                  = [];
    this["slice_group_change_direction_flag"]               = 0;
    this["slice_group_change_rate_minus1"]                  = 0;
    this["pic_size_in_map_units_minus1"]                    = 0;

    var i = 0;

    if (this["num_slice_groups_minus1"] > 0) {
        this["slice_group_map_type"]                        = bitView.ug();

        switch (this["slice_group_map_type"]) {
        case 0:
            for (i = 0; i <= this["num_slice_groups_minus1"]; ++i) {
                this["run_length_minus1"][i]                = bitView.ug();
            }
            break;
        case 2:
            for (i = 0; i < this["num_slice_groups_minus1"]; ++i) {
                this["top_left"][i]                         = bitView.ug();
                this["bottom_right"][i]                     = bitView.ug();
            }
            break;
        case 3:
        case 4:
        case 5:
            this["slice_group_change_direction_flag"]       = bitView.u(1);
            this["slice_group_change_rate_minus1"]          = bitView.ug();
            break;
        case 6:
            this["pic_size_in_map_units_minus1"]            = bitView.ug();
            for (i = 0; i <= this["pic_size_in_map_units_minus1"]; ++i) {
                this["slice_group_id"][i]                   = bitView.u( _get_slice_group_id(this["num_slice_groups_minus1"]) );
            }
        }
    }

    this["num_ref_idx_l0_default_active_minus1"]            = bitView.ug();
    this["num_ref_idx_l1_default_active_minus1"]            = bitView.ug();
    this["weighted_pred_flag"]                              = bitView.u(1); // [SPEC] Baseline profile では利用しません。常に0になります
    this["weighted_bipred_idc"]                             = bitView.u(2); // [SPEC] Baseline profile では利用しません。常に0になります
    this["pic_init_qp_minus26"]                             = bitView.sg(); // relative to 26
    this["pic_init_qs_minus26"]                             = bitView.sg(); // relative to 26
    this["chroma_qp_index_offset"]                          = bitView.sg();
    this["deblocking_filter_control_present_flag"]          = bitView.u(1);
    this["constrained_intra_pred_flag"]                     = bitView.u(1);
    this["redundant_pic_cnt_present_flag"]                  = bitView.u(1);

/*
    if (!bitView.EOS) {
        throw new Error("NOT_IMPL");
        // TODO: 今は実装しない

        var transform_8x8_mode_flag                         = bitView.u(1); // [SPEC] Baseline profile では利用しません。常に0になります
        var pic_scaling_matrix_present_flag                 = bitView.u(1); // [SPEC] Baseline profile では利用しません。常に0になります

        if (pic_scaling_matrix_present_flag) {
            var pic_scaling_list_present_flag = [];
            for (var i = 0; i < 6 + ( (chroma_format_idc != 3 ) ? 2 : 6 ) * transform_8x8_mode_flag; ++i) {
                pic_scaling_list_present_flag[i]            = bitView.u(1);
                if (pic_scaling_list_present_flag[i]) {
                    if (i < 6) {
                        scaling_list( ScalingList4x4[i], 16, UseDefaultScalingMatrix4x4Flag[i] )
                    } else {
                        scaling_list( ScalingList8x8[i − 6], 64, UseDefaultScalingMatrix8x8Flag[i − 6] )
                    }
                }
            }
        }
        var second_chroma_qp_index_offset                   = bitView.sg(); // [SPEC] Baseline profile では利用しません。常に0になります
    }
 */
}

function _get_slice_group_id(num_slice_groups_minus1) {
    var bits = Math.ceil( Math.log2( num_slice_groups_minus1 + 1 ) );
    return bits;
}

return PPS; // return entity

});


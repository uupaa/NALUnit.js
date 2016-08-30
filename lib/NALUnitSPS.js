(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnitSPS", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var BitView = WebModule["BitView"];
var EBSP    = WebModule["NALUnitEBSP"];
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function SPS(nalUnitObject,  // @arg NALUnitObject - { nal_ref_idc, nal_unit_type, nal_unit_size, index, data, NAL_UNIT_TYPE }
             parameterSet) { // @arg ParameterSet
    var bitView = new BitView( EBSP["toRBSP"](nalUnitObject["data"]), 1 ); // NALUnitHeader(1)

    seq_parameter_set_data.call(this, bitView);

    parameterSet["setSPS"](this["seq_parameter_set_id"], this);

    this["avcC_sequenceParameterSetLength"]  = nalUnitObject["data"].length;
    this["avcC_sequenceParameterSetNALUnit"] = nalUnitObject["data"];

    //if (SPS["VERBOSE"]) {
    //    console.dir(this);
    //}
}
SPS["VERBOSE"] = VERBOSE;
SPS["prototype"] = Object.create(SPS, {
    "constructor": { "value": SPS }, // new SPS():SPS
});

// --- implements ------------------------------------------
function seq_parameter_set_data(bitView) {
    // 7.3.2.1.1 Sequence parameter set data syntax
    this["profile_idc"]                                 = bitView["u"](8); // = 66   Baseline profile = 66, Main profile = 77
    this["constraint_set0_flag"]                        = bitView["u"](1); // = `1`  Baseline  profile flag
    this["constraint_set1_flag"]                        = bitView["u"](1); // = `1`  Main      profile flag
    this["constraint_set2_flag"]                        = bitView["u"](1); // = `0`  Extendded profile flag
    this["constraint_set3_flag"]                        = bitView["u"](1); // = `0`  Reserved
    this["constraint_set4_flag"]                        = bitView["u"](1); // = `0`  Reserved
    this["constraint_set5_flag"]                        = bitView["u"](1); // = `0`  Reserved
    this["reserved_zero_2bits"]                         = bitView["u"](2); // = `00`
    this["level_idc"]                                   = bitView["u"](8); // = 30   Level 3.0 = 30
    this["seq_parameter_set_id"]                        = bitView["ug"](); // SPS を示すユニークなID
    this["chroma_format_idc"]                           = 0;            // = 0 Baseline profile では使用しません
    this["separate_colour_plane_flag"]                  = 0;
    this["bit_depth_luma_minus8"]                       = 0;            // = 0 Baseline profile では使用しません
    this["bit_depth_chroma_minus8"]                     = 0;            // = 0 Baseline profile では使用しません
    this["qpprime_y_zero_transform_bypass_flag"]        = 0;            // = 0 Baseline profile では使用しません
    this["seq_scaling_matrix_present_flag"]             = 0;            // = 0 Baseline profile では使用しません
    this["log2_max_frame_num_minus4"]                   = 0;
    this["pic_order_cnt_type"]                          = 0;
    this["log2_max_pic_order_cnt_lsb_minus4"]           = 0;
    this["delta_pic_order_always_zero_flag"]            = 0;
    this["offset_for_non_ref_pic"]                      = 0;
    this["offset_for_top_to_bottom_field"]              = 0;
    this["num_ref_frames_in_pic_order_cnt_cycle"]       = 0;
    this["max_num_ref_frames"]                          = 0;
    this["gaps_in_frame_num_value_allowed_flag"]        = 0;
    this["pic_width_in_mbs_minus1"]                     = 0;            // 幅
    this["pic_height_in_map_units_minus1"]              = 0;            // 高さ
    this["frame_mbs_only_flag"]                         = 0;            // インターレースフラグ
    this["mb_adaptive_frame_field_flag"]                = 0;            // MBAFF
    this["direct_8x8_inference_flag"]                   = 0;            //
    this["frame_cropping_flag"]                         = 0;            //
    this["frame_crop_left_offset"]                      = 0;
    this["frame_crop_right_offset"]                     = 0;
    this["frame_crop_top_offset"]                       = 0;
    this["frame_crop_bottom_offset"]                    = 0;
    this["vui_parameters_present_flag"]                 = 0;

    if (this["profile_idc"] === 100 || this["profile_idc"] === 110 ||
        this["profile_idc"] === 122 || this["profile_idc"] === 244 ||
        this["profile_idc"] === 44  || this["profile_idc"] === 83  ||
        this["profile_idc"] === 86  || this["profile_idc"] === 118 ||
        this["profile_idc"] === 128) {

        this["chroma_format_idc"]                       = bitView["ug"](); // = `0` Baseline では常に 0
        if (this["chroma_format_idc"] !== 0) {
            throw new Error("PARSE_ERROR. YOU NEED Baseline profile");
        }
    }
    this["log2_max_frame_num_minus4"]                   = bitView["ug"]();
    this["pic_order_cnt_type"]                          = bitView["ug"]();

    if (this["pic_order_cnt_type"] === 0) {
        this["log2_max_pic_order_cnt_lsb_minus4"]       = bitView["ug"]();
    } else if (this["pic_order_cnt_type"] === 1) {
        this["delta_pic_order_always_zero_flag"]        = bitView["u"](1);
        this["offset_for_non_ref_pic"]                  = bitView["sg"]();
        this["offset_for_top_to_bottom_field"]          = bitView["sg"]();
        this["num_ref_frames_in_pic_order_cnt_cycle"]   = bitView["ug"]();
/*
        for (var i = 0; i < this["num_ref_frames_in_pic_order_cnt_cycle"]; ++i) {
            throw new Error("NOT_IMPL");
        }
 */
        bitView["sg"]();
    }
    this["max_num_ref_frames"]                          = bitView["ug"]();
    this["gaps_in_frame_num_value_allowed_flag"]        = bitView["u"](1);
    this["pic_width_in_mbs_minus1"]                     = bitView["ug"]();
    this["pic_height_in_map_units_minus1"]              = bitView["ug"]();
    this["frame_mbs_only_flag"]                         = bitView["u"](1);

    if (!this["frame_mbs_only_flag"]) {
        this["mb_adaptive_frame_field_flag"]            = bitView["u"](1);
    }
    this["direct_8x8_inference_flag"]                   = bitView["u"](1);
    this["frame_cropping_flag"]                         = bitView["u"](1);
    if (this["frame_cropping_flag"]) {
        this["frame_crop_left_offset"]                  = bitView["ug"]();
        this["frame_crop_right_offset"]                 = bitView["ug"]();
        this["frame_crop_top_offset"]                   = bitView["ug"]();
        this["frame_crop_bottom_offset"]                = bitView["ug"]();
    }
    this["vui_parameters_present_flag"]                 = bitView["u"](1);
    if (this["vui_parameters_present_flag"]) {
        vui_parameters.call(this, bitView);
    }
}

function vui_parameters(bitView) {
    this["aspect_ratio_info_present_flag"]              = bitView["u"](1);
    this["aspect_ratio_idc"]                            = 0;
    this["sar_width"]                                   = 0;
    this["sar_height"]                                  = 0;
    this["overscan_info_present_flag"]                  = 0;
    this["overscan_appropriate_flag"]                   = 0;
    this["video_signal_type_present_flag"]              = 0;
    this["video_format"]                                = 0;
    this["video_full_range_flag"]                       = 0;
    this["colour_description_present_flag"]             = 0;
    this["colour_primaries"]                            = 0;
    this["transfer_characteristics"]                    = 0;
    this["matrix_coefficients"]                         = 0;
    this["chroma_loc_info_present_flag"]                = 0;
    this["chroma_sample_loc_type_top_field"]            = 0;
    this["chroma_sample_loc_type_bottom_field"]         = 0;
    this["timing_info_present_flag"]                    = 0;
    this["num_units_in_tick"]                           = 0;
    this["time_scale"]                                  = 0;
    this["fixed_frame_rate_flag"]                       = 0;
    this["nal_hrd_parameters_present_flag"]             = 0;
    this["vcl_hrd_parameters_present_flag"]             = 0;
    this["low_delay_hrd_flag"]                          = 0;
    this["pic_struct_present_flag"]                     = 0;
    this["bitstream_restriction_flag"]                  = 0;
    this["motion_vectors_over_pic_boundaries_flag"]     = 0;
    this["max_bytes_per_pic_denom"]                     = 0;
    this["max_bits_per_mb_denom"]                       = 0;
    this["log2_max_mv_length_horizontal"]               = 0;
    this["log2_max_mv_length_vertical"]                 = 0;
    this["max_num_reorder_frames"]                      = 0;
    this["max_dec_frame_buffering"]                     = 0;

    var Extended_SAR = 255;

    if (this["aspect_ratio_info_present_flag"]) {
        this["aspect_ratio_idc"]                        = bitView["u"](8);
        if (this["aspect_ratio_idc"] === Extended_SAR) {
            this["sar_width"]                           = bitView["u"](16);
            this["sar_height"]                          = bitView["u"](16);
        }
    }
    this["overscan_info_present_flag"]                  = bitView["u"](1);
    if (this["overscan_info_present_flag"]) {
        this["overscan_appropriate_flag"]               = bitView["u"](1);
    }
    this["video_signal_type_present_flag"]              = bitView["u"](1);
    if (this["video_signal_type_present_flag"]) {
        this["video_format"]                            = bitView["u"](3);
        this["video_full_range_flag"]                   = bitView["u"](1);
        this["colour_description_present_flag"]         = bitView["u"](1);

        if (this["colour_description_present_flag"]) {
            this["colour_primaries"]                    = bitView["u"](8);
            this["transfer_characteristics"]            = bitView["u"](8);
            this["matrix_coefficients"]                 = bitView["u"](8);
        }
    }
    this["chroma_loc_info_present_flag"]                = bitView["u"](1);
    if (this["chroma_loc_info_present_flag"]) {
        this["chroma_sample_loc_type_top_field"]        = bitView["ug"]();
        this["chroma_sample_loc_type_bottom_field"]     = bitView["ug"]();
    }
    this["timing_info_present_flag"]                    = bitView["u"](1);
    if (this["timing_info_present_flag"]) {
        this["num_units_in_tick"]                       = bitView["u"](32);
        this["time_scale"]                              = bitView["u"](32);
        this["fixed_frame_rate_flag"]                   = bitView["u"](1);
    }
    this["nal_hrd_parameters_present_flag"]             = bitView["u"](1);
    if (this["nal_hrd_parameters_present_flag"]) {
        hrd_parameters.call(this, bitView);
    }
    this["vcl_hrd_parameters_present_flag"]             = bitView["u"](1);
    if (this["vcl_hrd_parameters_present_flag"]) {
        hrd_parameters.call(this, bitView);
    }
    if (this["nal_hrd_parameters_present_flag"] ||
        this["vcl_hrd_parameters_present_flag"]) {
        this["low_delay_hrd_flag"]                      = bitView["u"](1);
    }
    this["pic_struct_present_flag"]                     = bitView["u"](1);
    this["bitstream_restriction_flag"]                  = bitView["u"](1);
    if (this["bitstream_restriction_flag"]) {
        this["motion_vectors_over_pic_boundaries_flag"] = bitView["u"](1);
        this["max_bytes_per_pic_denom"]                 = bitView["ug"]();
        this["max_bits_per_mb_denom"]                   = bitView["ug"]();
        this["log2_max_mv_length_horizontal"]           = bitView["ug"]();
        this["log2_max_mv_length_vertical"]             = bitView["ug"]();
        this["max_num_reorder_frames"]                  = bitView["ug"]();
        this["max_dec_frame_buffering"]                 = bitView["ug"]();
    }
}

function hrd_parameters(bitView) {
  //throw new Error("FORMAT_READ_ERROR"); // This function don't call at BaselineProfile
    this["cpb_cnt_minus1"]                              = bitView["ug"]();
    this["bit_rate_scale"]                              = bitView["u"](4);
    this["cpb_size_scale"]                              = bitView["u"](4);
    this["bit_rate_value_minus1"] = [];
    this["cpb_size_value_minus1"] = [];
    this["cbr_flag"] = [];
    for (var schedSelIdx = 0; schedSelIdx <= this["cpb_cnt_minus1"]; schedSelIdx++ ) {
        this["bit_rate_value_minus1"][ schedSelIdx ]    = bitView["ug"]();
        this["cpb_size_value_minus1"][ schedSelIdx ]    = bitView["ug"]();
        this["cbr_flag"][ schedSelIdx ]                 = bitView["u"](1);
    }
    this["initial_cpb_removal_delay_length_minus1"]     = bitView["u"](5);
    this["cpb_removal_delay_length_minus1"]             = bitView["u"](5);
    this["dpb_output_delay_length_minus1"]              = bitView["u"](5);
    this["time_offset_length"]                          = bitView["u"](5);
}

return SPS; // return entity

});


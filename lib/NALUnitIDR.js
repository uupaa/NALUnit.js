(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnitIDR", function moduleClosure(global, WebModule /*, VERIFY, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
//  - C
//      - Categories (labelled in the table as **C**) specify the partitioning of slice data into at most three slice data partitions.
//        Slice data partition A contains all syntax elements of category 2.
//        Slice data partition B contains all syntax elements of category 3.
//        Slice data partition C contains all syntax elements of category 4.
//        The meaning of other category values is not specified.
//        For some syntax elements, two category values, separated by a vertical bar, are used.
//        In these cases, the category value to be applied is further specified in the text.
//        For syntax structures used within other syntax structures,
//        the categories of all syntax elements found within the included syntax structure are listed,
//        separated by a vertical bar.
//        A syntax element or syntax structure with category marked as "All"
//        is present within all syntax structures that include that syntax element or syntax structure.
//        For syntax structures used within other syntax structures,
//        a numeric category value provided in a syntax table at the location
//        of the inclusion of a syntax structure containing a syntax element with category
//        marked as "All" is considered to apply to the syntax elements with category "All".
//
// --- dependency modules ----------------------------------
var BitView = WebModule["BitView"];
var EBSP    = WebModule["NALUnitEBSP"];
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
//var _split8  = Bit["split8"];  // Bit.split8(u32:UINT32, bitPattern:UINT8Array|Uint8Array):UINT32Array
//var _split16 = Bit["split16"]; // Bit.split16(u32:UINT32, bitPattern:UINT8Array|Uint8Array):UINT32Array
//var _split24 = Bit["split24"]; // Bit.split24(u32:UINT32, bitPattern:UINT8Array|Uint8Array):UINT32Array
//var _split32 = Bit["split32"]; // Bit.split32(u32:UINT32, bitPattern:UINT8Array|Uint8Array):UINT32Array
var P_SLICE  = 0;
var B_SLICE  = 1;
var I_SLICE  = 2;
var SP_SLICE = 3;
var SI_SLICE = 4;

// --- class / interfaces ----------------------------------
function IDR(nalUnitObject,  // @arg NALUnitObject - { nal_ref_idc, nal_unit_type, nal_unit_size, index, data, NAL_UNIT_TYPE }
             parameterSet) { // @arg ParameterSet
    var bitView = new BitView( EBSP["toRBSP"](nalUnitObject["data"]), 1 ); // NALUnitHeader(1)

    this["nal_ref_idc"]          = nalUnitObject["nal_ref_idc"];
    this["nal_unit_type"]        = nalUnitObject["nal_unit_type"];

//  slice_header() {
//      first_mb_in_slice    ue(v)
//      slice_type           ue(v)
//      pic_parameter_set_id ue(v)
//      ...
//      colour_plane_id      u(2)
//  }
    this["first_mb_in_slice"]    = bitView["ug"]();
    this["slice_type"]           = bitView["ug"]();
    this["pic_parameter_set_id"] = bitView["ug"]();

    var pps_id = this["pic_parameter_set_id"];
    var pps    = parameterSet["getPPS"](pps_id);
    var sps_id = pps["seq_parameter_set_id"];
    var sps    = parameterSet["getSPS"](sps_id);

    slice_layer_without_partitioning_rbsp.call(this, bitView, sps, pps);
}

// --- implements ------------------------------------------
function slice_layer_without_partitioning_rbsp(bitView, sps, pps) {
//
//  slice_layer_without_partitioning_rbsp() {
//      slice_header()                                              // C 2
//      slice_data() /* all categories of slice_data( ) syntax */   // C 2|3|4
//      rbsp_slice_trailing_bits()                                  // C 2
//  }
//

    slice_header.call(this, bitView, sps, pps);
  //slice_data.call(this, bitView, sps, pps);
  //rbsp_slice_trailing_bits.call(this, bitView);
}

function slice_header(bitView, sps, pps) {
//  slice_header() {
//      first_mb_in_slice    ue(v)
//      slice_type           ue(v)
//      pic_parameter_set_id ue(v)
//      ...
//      colour_plane_id      u(2)
//  }

    this["colour_plane_id"]                     = 0;
    this["field_pic_flag"]                      = 0;
    this["bottom_field_flag"]                   = 0;
    this["idr_pic_id"]                          = 0;
    this["pic_order_cnt_type"]                  = sps["pic_order_cnt_type"];
    this["pic_order_cnt_lsb"]                   = 0;
    this["delta_pic_order_cnt_bottom"]          = 0;
    this["delta_pic_order_cnt"]                 = [];
    this["redundant_pic_cnt"]                   = 0;
    this["direct_spatial_mv_pred_flag"]         = 0;
    this["num_ref_idx_active_override_flag"]    = 0;
    this["num_ref_idx_l0_active_minus1"]        = 0;
    this["num_ref_idx_l1_active_minus1"]        = 0;
    this["cabac_init_idc"]                      = 0;
    this["slice_qp_delta"]                      = 0;
    this["sp_for_switch_flag"]                  = 0;
    this["slice_qs_delta"]                      = 0;
    this["disable_deblocking_filter_idc"]       = 0;
    this["slice_alpha_c0_offset_div2"]          = 0;
    this["slice_beta_offset_div2"]              = 0;
    this["slice_group_change_cycle"]            = 0;

    var IdrPicFlag                              = this["nal_unit_type"] === 5; // IDR なら true
    var slice_type_primitive                    = this["slice_type"] % 5;

    if (sps["separate_colour_plane_flag"] === 1) {
        this["colour_plane_id"]                 = bitView["u"](2);
    }
    this["frame_num"]                           = bitView["u"]( sps["log2_max_frame_num_minus4"] + 4 );
    if (!sps["frame_mbs_only_flag"]) {
        this["field_pic_flag"]                  = bitView["u"](1);
        if (this["field_pic_flag"]) {
            this["bottom_field_flag"]           = bitView["u"](1);
        }
    }
    if (IdrPicFlag) {
        this["idr_pic_id"]                      = bitView["ug"]();
    }
    if (this["pic_order_cnt_type"] === 0) {
        this["pic_order_cnt_lsb"]               = bitView["u"]( sps["log2_max_pic_order_cnt_lsb_minus4"] + 4 );
        if (pps["bottom_field_pic_order_in_frame_present_flag"] && !this["field_pic_flag"]) {
            this["delta_pic_order_cnt_bottom"]  = bitView["sg"]();
        }
    }
    if (this["pic_order_cnt_type"] === 1 && !sps["delta_pic_order_always_zero_flag"]) {
        this["delta_pic_order_cnt"][0]          = bitView["sg"]();
        if (pps["bottom_field_pic_order_in_frame_present_flag"] && !this["field_pic_flag"]) {
            this["delta_pic_order_cnt"][1]      = bitView["sg"]();
        }
    }
    if (pps["redundant_pic_cnt_present_flag"]) {
        this["redundant_pic_cnt"]               = bitView["ug"]();
    }
    if (slice_type_primitive === B_SLICE) {
        this["direct_spatial_mv_pred_flag"]     = bitView["u"](1);
    }
    if (slice_type_primitive === P_SLICE || slice_type_primitive === SP_SLICE || slice_type_primitive === B_SLICE) {
        this["num_ref_idx_active_override_flag"] = bitView["u"](1);
        if (this["num_ref_idx_active_override_flag"]) {
            this["num_ref_idx_l0_active_minus1"] = bitView["ug"]();
            if (slice_type_primitive === B_SLICE) {
                this["num_ref_idx_l1_active_minus1"] = bitView["ug"]();
            }
        }
    }
    if (this["nal_unit_type"] === 20) {
        ref_pic_list_mvc_modification(); // specified in Annex H
    } else {
        ref_pic_list_modification.call(this, bitView);
    }
    if (( pps["weighted_pred_flag"] && ( slice_type_primitive === P_SLICE ||
                                         slice_type_primitive === SP_SLICE ) ) ||
        ( pps["weighted_bipred_idc"] === 1 && slice_type_primitive === B_SLICE ) ) {
        pred_weight_table();
    }
    if (this["nal_ref_idc"] !== 0) {
        dec_ref_pic_marking.call(this, bitView);
    }
    if (pps["entropy_coding_mode_flag"] &&
        slice_type_primitive !== I_SLICE &&
        slice_type_primitive !== SI_SLICE) {
        this["cabac_init_idc"]                  = bitView["ug"]();
    }
    this["slice_qp_delta"]                      = bitView["sg"]();

    if (slice_type_primitive === SP_SLICE ||
        slice_type_primitive === SI_SLICE) {
        if (slice_type_primitive === SP_SLICE) {
            this["sp_for_switch_flag"]          = bitView["u"](1);
        }
        this["slice_qs_delta"]                  = bitView["sg"]();
    }
    if (pps["deblocking_filter_control_present_flag"]) {
        this["disable_deblocking_filter_idc"]   = bitView["ug"]();
        if (this["disable_deblocking_filter_idc"] !== 1) {
            this["slice_alpha_c0_offset_div2"]  = bitView["sg"]();
            this["slice_beta_offset_div2"]      = bitView["sg"]();
        }
    }
    if (pps["num_slice_groups_minus1"] > 0 &&
        pps["slice_group_map_type"] >= 3 &&
        pps["slice_group_map_type"] <= 5) {
        this["slice_group_change_cycle"]        = bitView["u"]( _get_slice_group_change_cycle(sps, pps) );
    }
}

function _get_slice_group_change_cycle(sps, pps) {
//
//  slice_group_change_cycle is used to derive the number of slice group map units in slice group 0 when slice_group_map_type is equal to 3, 4, or 5, as specified by
//      MapUnitsInSliceGroup0 = Min( slice_group_change_cycle * SliceGroupChangeRate,
//                                   PicSizeInMapUnits ) (7-33)
//  The value of slice_group_change_cycle is represented in the bitstream by the following number of bits
//      Ceil( Log2( PicSizeInMapUnits ÷ SliceGroupChangeRate + 1 ) ) (7-34)
//  The value of slice_group_change_cycle shall be in the range of 0 to Ceil( PicSizeInMapUnits÷SliceGroupChangeRate ), inclusive.
//
    var PicWidthInMbs        = sps["pic_width_in_mbs_minus1"] + 1;
    var PicHeightInMapUnits  = sps["pic_height_in_map_units_minus1"] + 1;
    var PicSizeInMapUnits    = PicWidthInMbs * PicHeightInMapUnits;
    var SliceGroupChangeRate = pps["slice_group_change_rate_minus1"] + 1;

    var bits = Math.ceil( Math.log2( PicSizeInMapUnits / SliceGroupChangeRate + 1 ) );

    return bits;
}

function ref_pic_list_modification(bitView) {
    var slice_type_primitive                    = this["slice_type"] % 5;
    this["ref_pic_list_modification_flag_l0"]   = 0;
    this["ref_pic_list_modification_flag_l1"]   = 0;
    this["abs_diff_pic_num_minus1"]             = [];
    this["long_term_pic_num"]                   = [];

    var modification_of_pic_nums_idc            = 0;

    if (slice_type_primitive !== I_SLICE && slice_type_primitive !== SI_SLICE) {
        this["ref_pic_list_modification_flag_l0"] = bitView["u"](1);
        if (this["ref_pic_list_modification_flag_l0"]) {
            do {
                modification_of_pic_nums_idc    = bitView["ug"]();
                if (modification_of_pic_nums_idc === 0 ||
                    modification_of_pic_nums_idc === 1) {
                    this["abs_diff_pic_num_minus1"].push( bitView["ug"]() );
                } else if (modification_of_pic_nums_idc === 2) {
                    this["long_term_pic_num"].push( bitView["ug"]() );
                }
            } while (modification_of_pic_nums_idc !== 3);
        }
    }
    if (slice_type_primitive === B_SLICE) {
        this["ref_pic_list_modification_flag_l1"] = bitView["u"](1);
        if (this["ref_pic_list_modification_flag_l1"]) {
            do {
                modification_of_pic_nums_idc    = bitView["ug"]();
                if (modification_of_pic_nums_idc === 0 ||
                    modification_of_pic_nums_idc === 1) {
                    this["abs_diff_pic_num_minus1"].push( bitView["ug"]() );
                } else if (modification_of_pic_nums_idc === 2) {
                    this["long_term_pic_num"].push( bitView["ug"]() );
                }
            } while (modification_of_pic_nums_idc !== 3);
        }
    }
}

function dec_ref_pic_marking(bitView) {
    this["no_output_of_prior_pics_flag"]        = 0;
    this["long_term_reference_flag"]            = 0;
    this["adaptive_ref_pic_marking_mode_flag"]  = 0;
    this["difference_of_pic_nums_minus1"]       = [];
    this["long_term_pic_num"]                   = [];
    this["long_term_frame_idx"]                 = [];
    this["max_long_term_frame_idx_plus1"]       = [];

    var IdrPicFlag                              = this["nal_unit_type"] === 5;
    var memory_management_control_operation     = 0;

    if (IdrPicFlag) {
        this["no_output_of_prior_pics_flag"]                        = bitView["u"](1);
        this["long_term_reference_flag"]                            = bitView["u"](1);
    } else {
        this["adaptive_ref_pic_marking_mode_flag"]                  = bitView["u"](1);
        if (this["adaptive_ref_pic_marking_mode_flag"]) {
            do {
                memory_management_control_operation                 = bitView["ug"]();

                if (memory_management_control_operation === 1 ||
                    memory_management_control_operation === 3) {
                    this["difference_of_pic_nums_minus1"]           = bitView["ug"]();
                }
                if (memory_management_control_operation === 2) {
                    this["long_term_pic_num"]                       = bitView["ug"]();
                }
                if (memory_management_control_operation === 3 ||
                    memory_management_control_operation === 6) {
                    this["long_term_frame_idx"]                     = bitView["ug"]();
                }
                if (memory_management_control_operation === 4) {
                    this["max_long_term_frame_idx_plus1"]           = bitView["ug"]();
                }
            } while (memory_management_control_operation !== 0);
        }
    }
}

/*
function slice_data(bitView, au) {
    var entropy_coding_mode_flag                = au["PPS"]["entropy_coding_mode_flag"];
    var first_mb_in_slice                       = this["first_mb_in_slice"];
    var MbaffFrameFlag                          = ( au["SPS"]["mb_adaptive_frame_field_flag"] && !this["field_pic_flag"] ) ? 1 : 0;
    var slice_type                              = this["slice_type"];
    var slice_type_primitive                    = slice_type % 5;
    var mb_skip_run                             = 0;
    var mb_field_decoding_flag                  = 0;
    var mb_skip_flag                            = 0;
    var end_of_slice_flag                       = 0;

    if (entropy_coding_mode_flag) {
        while ( !bitView["byteAligned"] ) {
            bitView["u"](1);
        }
    }
    var CurrMbAddr = first_mb_in_slice * ( 1 + MbaffFrameFlag );
    var moreDataFlag = 1;
    var prevMbSkipped = 0;

    do {
        if (slice_type_primitive !== I_SLICE &&
            slice_type_primitive !== SI_SLICE) {

            if (!entropy_coding_mode_flag) {
                mb_skip_run                                 = bitView["ug"]();
                prevMbSkipped = ( mb_skip_run > 0 );
                for (var i = 0; i < mb_skip_run; ++i) {
                    CurrMbAddr = NextMbAddress( CurrMbAddr );
                }
                if (mb_skip_run > 0) {
                    moreDataFlag = more_rbsp_data();
                }
            } else {
                mb_skip_flag                                = ae();
                moreDataFlag = !mb_skip_flag;
            }
        }
        if (moreDataFlag) {
            if (MbaffFrameFlag && ( CurrMbAddr % 2 === 0 || ( CurrMbAddr % 2 === 1 && prevMbSkipped ) ) ) {
                mb_field_decoding_flag                      = bitView["u"](1) | ae();
            }
            macroblock_layer();
        }
        if (!entropy_coding_mode_flag) {
            moreDataFlag = more_rbsp_data();
        } else {
            if (slice_type_primitive !== I_SLICE &&
                slice_type_primitive !== SI_SLICE) {
                prevMbSkipped = mb_skip_flag;
            }
            if (MbaffFrameFlag && CurrMbAddr % 2 === 0) {
                moreDataFlag = 1;
            } else {
                end_of_slice_flag                           = ae();
                moreDataFlag = !end_of_slice_flag;
            }
        }
        CurrMbAddr = NextMbAddress( CurrMbAddr );
    } while (moreDataFlag);


    this["mb_skip_run"]                 = mb_skip_run;
    this["var mb_field_decoding_flag"]  = mb_field_decoding_flag;
}

function NextMbAddress() {
}

function more_rbsp_data() {
}

function ae() {
// 9.3 CABAC parsing process for slice data
// TODO: impl
}

function macroblock_layer() {
}

 */
function ref_pic_list_mvc_modification() {
}
function pred_weight_table() {
}


return IDR; // return entity

});


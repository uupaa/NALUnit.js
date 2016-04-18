(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("NALUnitSEI", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var BitView = WebModule["BitView"];
var EBSP    = WebModule["NALUnitEBSP"];
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function SEI(nalUnitObject) { // @arg NALUnitObject - { nal_ref_idc, nal_unit_type, nal_unit_size, index, data, NAL_UNIT_TYPE }
    var bitView = new BitView( EBSP["toRBSP"](nalUnitObject["data"]), 1 ); // NALUnitHeader(1)

    sei_rbsp.call(this, bitView);

    //if (SEI["VERBOSE"]) {
    //    console.dir(this);
    //}
}
SEI["VERBOSE"] = VERBOSE;

// --- implements ------------------------------------------
function sei_rbsp(bitView) {
    do {
        sei_message.call(this, bitView);
    } while ( !bitView["EOS"] );
}

function sei_message(bitView) {
    var payloadType = 0;
    var payloadSize = 0;

    while ( bitView["nu"](8) === 0xFF ) {
        bitView["u"](8);                   // 0xFF
        payloadType += 255;
    }
    var last_payload_type_byte = bitView["u"](8);

    payloadType += last_payload_type_byte;

    while ( bitView["nu"](8) === 0xFF ) {
        bitView["u"](8);                   // 0xFF
        payloadSize += 255;
    }
    var last_payload_size_byte = bitView["u"](8);

    payloadSize += last_payload_size_byte;

    sei_payload.call(this, bitView, payloadType, payloadSize);
}

function sei_payload(bitView,
                     payloadType,   // @arg UINT32
                     payloadSize) { // @arg UINT32
                                    // @bing this
    switch (payloadType) {
/*
    case  0: buffering_period( payloadSize );                   break;
    case  1: pic_timing( payloadSize );                         break;
    case  2: pan_scan_rect( payloadSize );                      break;
    case  3: filler_payload( payloadSize );                     break;
    case  4: user_data_registered_itu_t_t35( payloadSize );     break;
 */
    case  5: user_data_unregistered.call(this, bitView, payloadSize); break;
/*
    case  6: recovery_point( payloadSize );                     break;
    case  7: dec_ref_pic_marking_repetition( payloadSize );     break;
    case  8: spare_pic( payloadSize );                          break;
    case  9: scene_info( payloadSize );                         break;
    case 10: sub_seq_info( payloadSize );                       break;
    case 11: sub_seq_layer_characteristics( payloadSize );      break;
    case 12: sub_seq_characteristics( payloadSize );            break;
    case 13: full_frame_freeze( payloadSize );                  break;
    case 14: full_frame_freeze_release( payloadSize );          break;
    case 15: full_frame_snapshot( payloadSize );                break;
    case 16: progressive_refinement_segment_start(payloadSize); break;
    case 17: progressive_refinement_segment_end(payloadSize);   break;
    case 18: motion_constrained_slice_group_set(payloadSize);   break;
    case 19: film_grain_characteristics( payloadSize );         break;
    case 20: deblocking_filter_display_preference(payloadSize); break;
    case 21: stereo_video_info( payloadSize );                  break;
    case 22: post_filter_hint( payloadSize );                   break;
    case 23: tone_mapping_info( payloadSize );                  break;
    case 24: scalability_info( payloadSize );                   break; // specified in Annex G
    case 25: sub_pic_scalable_layer( payloadSize );             break; // specified in Annex G
    case 26: non_required_layer_rep( payloadSize );             break; // specified in Annex G
    case 27: priority_layer_info( payloadSize );                break; // specified in Annex G
    case 28: layers_not_present( payloadSize );                 break; // specified in Annex G
    case 29: layer_dependency_change( payloadSize );            break; // specified in Annex G
    case 30: scalable_nesting( payloadSize );                   break; // specified in Annex G
    case 31: base_layer_temporal_hrd( payloadSize );            break; // specified in Annex G
    case 32: quality_layer_integrity_check( payloadSize );      break; // specified in Annex G
    case 33: redundant_pic_property( payloadSize );             break; // specified in Annex G
    case 34: tl0_dep_rep_index( payloadSize );                  break; // specified in Annex G
    case 35: tl_switching_point( payloadSize );                 break; // specified in Annex G
    case 36: parallel_decoding_info( payloadSize );             break; // specified in Annex H
    case 37: mvc_scalable_nesting( payloadSize );               break; // specified in Annex H
    case 38: view_scalability_info( payloadSize );              break; // specified in Annex H
    case 39: multiview_scene_info( payloadSize );               break; // specified in Annex H
    case 40: multiview_acquisition_info( payloadSize );         break; // specified in Annex H
    case 41: non_required_view_component( payloadSize );        break; // specified in Annex H
    case 42: view_dependency_change( payloadSize );             break; // specified in Annex H
    case 43: operation_points_not_present( payloadSize );       break; // specified in Annex H
    case 44: base_view_temporal_hrd( payloadSize );             break; // specified in Annex H
    case 45: frame_packing_arrangement( payloadSize );          break;
 */
    default:
        reserved_sei_message.call(this, bitView, payloadSize);
    }
    // if ( !byte_aligned( ) ) {
    //     bit_equal_to_one            f(1) // `1`
    //     while( !byte_aligned( ) ) {
    //         bit_equal_to_zero       f(1) // `0`
    //     }
    // }

    //if (bitView["bitCursor"] !== 7) {
    //    bitView["bitCursor"] = 7;
    //    bitView["cursor"] += 1;
    //}
}

function reserved_sei_message(bitView, payloadSize) { // @arg UINT32
    bitView["cursor"] += payloadSize;
}

function user_data_unregistered(bitView, payloadSize) {
    if (!bitView["byteAligned"]) {
        throw new Error("NEED_BYTE_ALIGN");
    }
    this["uuid_iso_iec_11578"] = new Uint32Array([
        bitView["u"](32),
        bitView["u"](32),
        bitView["u"](32),
        bitView["u"](32),
    ]);
    this["user_data_payload_byte"] = bitView["source"].subarray(bitView["cursor"],
                                                                bitView["cursor"] + payloadSize - 16);
    bitView["cursor"] += payloadSize;
}

return SEI; // return entity

});


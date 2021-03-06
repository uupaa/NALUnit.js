var ModuleTestNALUnit = (function(global) {

var test = new Test(["NALUnit"], { // Add the ModuleName to be tested here (if necessary).
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     false,  // enable worker test.
        node:       false,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    });

if (1) {
    test.add([
        testNALUnit,
        testNALUnit_toRBSP,
        testNALUnit_ParameterSet_getSPS_strictMode_200,
        testNALUnit_ParameterSet_getSPS_strictMode_404,
        testNALUnit_ParameterSet_getSPS_200,
        testNALUnit_ParameterSet_getSPS_404,
    ]);
}

// --- test cases ------------------------------------------
function testNALUnit(test, pass, miss) {
    var sourceFile = "../assets/ff/png.all.mp4.00.ts";

    NALUnitAUD.VERBOSE = false;

    FileLoader.toArrayBuffer(sourceFile, function(buffer) {
        console.log("testNALUnit: ", sourceFile, buffer.byteLength);

      //var mpeg2ts     = MPEG2TS.parse( new Uint8Array(buffer) );
      //var byteStream  = MPEG2TS.convertTSPacketToByteStream(mpeg2ts["VIDEO_TS_PACKET"]);
      //var nalunit     = MPEG4ByteStream.convertByteStreamToNALUnitObjectArray(byteStream);
      ////var mp4tree     = MP4Muxer.mux(nalunit);
        var mpeg2ts     = MPEG2TS.demux( new Uint8Array(buffer) );
        var nalunit     = MPEG2TS.toNALUnit(mpeg2ts["VIDEO_TS_PACKET"]);

        test.done(pass());
    });
}

function testNALUnit_toRBSP(test, pass, miss) {
    var result = {
        // NEED ES6 TypedArray.join() method.
        0: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x03, 0x00])).join(",") === "0,0,0",
        1: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x03, 0x01])).join(",") === "0,0,1",
        2: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x03, 0x02])).join(",") === "0,0,2",
        3: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x03, 0x03])).join(",") === "0,0,3",
       10: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x04, 0x00])).join(",") === "0,0,4,0",
       11: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x04, 0x01])).join(",") === "0,0,4,1",
       12: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x04, 0x02])).join(",") === "0,0,4,2",
       13: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x04, 0x03])).join(",") === "0,0,4,3",
       20: NALUnitEBSP.toRBSP(new Uint8Array([      0x00, 0x03, 0x00])).join(",") === "0,3,0",
       21: NALUnitEBSP.toRBSP(new Uint8Array([      0x00, 0x03, 0x01])).join(",") === "0,3,1",
       22: NALUnitEBSP.toRBSP(new Uint8Array([      0x00, 0x03, 0x02])).join(",") === "0,3,2",
       23: NALUnitEBSP.toRBSP(new Uint8Array([      0x00, 0x03, 0x03])).join(",") === "0,3,3",
       30: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x03      ])).join(",") === "0,0,3",
       31: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x03            ])).join(",") === "0,3",
      100: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00])).join(",") === "0,0,0,0,0,0",
      101: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x03, 0x01, 0x00, 0x00, 0x03, 0x00])).join(",") === "0,0,1,0,0,0",
      102: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x03, 0x02, 0x00, 0x00, 0x03, 0x00])).join(",") === "0,0,2,0,0,0",
      103: NALUnitEBSP.toRBSP(new Uint8Array([0x00, 0x00, 0x03, 0x03, 0x00, 0x00, 0x03, 0x00])).join(",") === "0,0,3,0,0,0",
    };

    if (/false/.test(JSON.stringify(result))) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testNALUnit_ParameterSet_getSPS_strictMode_200(test, pass, miss) {
    var strictMode = true;
    var pset = new NALUnitParameterSet(strictMode);
    var sps1 = { "value": 1 };

    pset.setSPS(1, sps1);
    try {
        pset.getSPS(1); // sps id = 1 was found
        test.done(pass());
    } catch (err) {
        test.done(miss());
    }
}

function testNALUnit_ParameterSet_getSPS_strictMode_404(test, pass, miss) {
    var strictMode = true;
    var pset = new NALUnitParameterSet(strictMode);
    var sps0 = { "value": 0 };

    pset.setSPS(0, sps0);
    try {
        pset.getSPS(1); // sps id = 1 was not found
        test.done(miss());
    } catch (err) {
        test.done(pass());
    }
}

function testNALUnit_ParameterSet_getSPS_200(test, pass, miss) {
    var strictMode = false;
    var pset = new NALUnitParameterSet(strictMode);
    var sps1 = { "value": 1 };

    pset.setSPS(1, sps1);
    try {
        pset.getSPS(1); // sps id = 1 was found
        test.done(pass());
    } catch (err) {
        test.done(miss());
    }
}

function testNALUnit_ParameterSet_getSPS_404(test, pass, miss) {
    var strictMode = false;
    var pset = new NALUnitParameterSet(strictMode);
    var sps0 = { "value": 0 };

    pset.setSPS(0, sps0);
    try {
        var sps = pset.getSPS(1); // sps id = 1 was not found but not strictMode = false
        if (sps.value === 0) { // get latest sps id (sps0)
            test.done(pass());
        } else {
            test.done(miss());
        }
    } catch (err) {
        test.done(miss());
    }
}


return test.run();

})(GLOBAL);


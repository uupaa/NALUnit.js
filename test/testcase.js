var ModuleTestNALUnit = (function(global) {

var test = new Test(["NALUnit"], { // Add the ModuleName to be tested here (if necessary).
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     false,  // enable worker test.
        node:       false,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       false,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    });

if (IN_BROWSER || IN_NW || IN_EL) {
    test.add([
        testNALUnit,
    ]);
}

// --- test cases ------------------------------------------
function testNALUnit(test, pass, miss) {
    var sourceFile = "../assets/ff/png.all.mp4.00.ts";

    FileLoader.toArrayBuffer(sourceFile, function(buffer) {
        console.log("testNALUnit: ", sourceFile, buffer.byteLength);

        var mpeg2ts     = MPEG2TS.parse( new Uint8Array(buffer) );
        var byteStream  = MPEG2TS.convertTSPacketToByteStream(mpeg2ts["VIDEO_TS_PACKET"]);
        var nalunit     = MPEG4ByteStream.convertByteStreamToNALUnitObjectArray(byteStream);
        //var mp4tree     = MP4Muxer.mux(nalunit);

        test.done(pass());
    });
}

return test.run();

})(GLOBAL);


// NALUnit test

onmessage = function(event) {
    self.unitTest = event.data; // { message, setting: { secondary, baseDir } }

    if (!self.console) { // polyfill WebWorkerConsole
        self.console = function() {};
        self.console.dir = function() {};
        self.console.log = function() {};
        self.console.warn = function() {};
        self.console.error = function() {};
        self.console.table = function() {};
    }

    importScripts("../../lib/WebModule.js");

    WebModule.VERIFY  = true;
    WebModule.VERBOSE = true;
    WebModule.PUBLISH = true;

    importScripts("../../node_modules/uupaa.mpeg2ts.js/node_modules/uupaa.bit.js/lib/Bit.js");
    importScripts("../../node_modules/uupaa.mpeg2ts.js/node_modules/uupaa.bit.js/lib/BitView.js");
    importScripts("../../node_modules/uupaa.mpeg2ts.js/node_modules/uupaa.hash.js/lib/Hash.js");
    importScripts("../../node_modules/uupaa.mpeg2ts.js/node_modules/uupaa.hexdump.js/lib/HexDump.js");
    importScripts("../../node_modules/uupaa.mpeg2ts.js/node_modules/uupaa.fileloader.js/node_modules/uupaa.uri.js/lib/URI.js");
    importScripts("../../node_modules/uupaa.mpeg2ts.js/node_modules/uupaa.fileloader.js/node_modules/uupaa.uri.js/lib/URISearchParams.js");
    importScripts("../../node_modules/uupaa.mpeg2ts.js/node_modules/uupaa.fileloader.js/lib/FileLoader.js");
    importScripts("../../node_modules/uupaa.mpeg2ts.js/node_modules/uupaa.fileloader.js/lib/FileLoaderQueue.js");
    importScripts("../../node_modules/uupaa.mpeg2ts.js/lib/MPEG2TSNALUnit.js");
    importScripts("../../node_modules/uupaa.mpeg2ts.js/lib/MPEG2TSDemuxer.js");
    importScripts("../../node_modules/uupaa.mpeg2ts.js/lib/MPEG2TS.js");
    importScripts("../wmtools.js");
    importScripts("../../lib/NALUnitType.js");
    importScripts("../../lib/NALUnitParameterSet.js");
    importScripts("../../lib/NALUnitEBSP.js");
    importScripts("../../lib/NALUnitAUD.js");
    importScripts("../../lib/NALUnitSPS.js");
    importScripts("../../lib/NALUnitPPS.js");
    importScripts("../../lib/NALUnitSEI.js");
    importScripts("../../lib/NALUnitIDR.js");
    importScripts("../../lib/NALUnitNON_IDR.js");
    importScripts("../../lib/NALUnit.js");
    importScripts("../../release/NALUnit.w.min.js");
    importScripts("../testcase.js");

    self.postMessage(self.unitTest);
};


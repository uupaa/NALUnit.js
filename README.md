# NALUnit.js [![Build Status](https://travis-ci.org/uupaa/NALUnit.js.svg)](https://travis-ci.org/uupaa/NALUnit.js)

[![npm](https://nodei.co/npm/uupaa.nalunit.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.nalunit.js/)

MPEG4-15 AVC(H.264) - NAL file format

This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/NALUnit.js/wiki/)
- [API Spec](https://github.com/uupaa/NALUnit.js/wiki/NALUnit)

## Browser, NW.js and Electron

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/NALUnit.js"></script>
<script>
var videoNALUnitArray = [NALUnit, ...];
var videoNALUnitObjectArray = NALUnit.toNALUnitObject(videoNALUnitArray);
</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/NALUnit.js");

...
```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/NALUnit.js");

...
```


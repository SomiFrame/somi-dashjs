Somi-dashjs
================
A small library that Video tag use MediaSource Extension to Load video stream.
>__online demo__ [https://somiframe.github.io/vue-video/](https://somiframe.github.io/vue-video/)

Installation
================
```
    npm install somi-dashjs
```

How to create a onDemand dash video?
===============
> __Please go to see this__[Dash Support in MP4Box](https://gpac.wp.imt.fr/mp4box/dash/)

Usage
================
```javascript
    // this is es5 version

    var dash = require("somi-dashjs").default;
    var segmentUrl = '/video/new_video_dashinit.mp4';
    var videoMimeTypeCodecs = 'video/mp4;codecs="avc1.640015,mp4a.40.2"';
    var initRange = { start: 0, end: 1440 };
    var sidxRange = { start: 1441, end: 1580 };
    new dash('#vid1',segmentUrl,videoMimeTypeCodecs,initRange,sidxRange);

    // this is es6 version

    import dash from "somi-dashjs";
    let segmentUrl = '/video/new_video_dashinit.mp4';
    let videoMimeTypeCodecs = 'video/mp4;codecs="avc1.640015,mp4a.40.2"';
    let initRange = { start: 0, end: 1440 };
    let sidxRange = { start: 1441, end: 1580 };
    new dash('#vid1',segmentUrl,videoMimeTypeCodecs,initRange,sidxRange);
```

Tests
================
First
----------------
* clone the code to your local environment

```
    git clone https://github.com/SomiFrame/somi-dashjs.git
```
* or
```
    git clone git@github.com:SomiFrame/somi-dashjs.git
```

Second
---------------
* enter directory which you just cloned
```
    cd somi-dashjs
```
* install the devDependencies
```
    npm install
```
* compile the source file to public directory
```
    gulp
```
* start a node server and listen the port 3031
```
    node server.js
```
Third
---------------
* now you can open a browser and enter URL like below

  localhost:3031

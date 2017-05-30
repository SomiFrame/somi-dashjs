/*
 视频流缓存 管理 已下载的视频流
 */
export default class BufferCache {
    constructor() {
        this.BufferedSegments = [];
        this.temporaryBufferedSegments = [];
        this.InitArrayBuffer = new ArrayBuffer();
        this.VideoSIDX = {};
    }

    getSegmentArrayBufferByIndex(index) {
        for (let i = 0, l = this.BufferedSegments.length; i < l; i++) {
            if (this.BufferedSegments[i].index == index) {
                return this.BufferedSegments[i];
            }
        }
    }

    pushSegment(sourceBuffer, Segment) {
        if(!this.IsBufferedSegmentIndex(Segment.index)){
            this.BufferedSegments.push(Segment);
        }
        if (!sourceBuffer.updating) {
            sourceBuffer.appendBuffer(new Uint8Array(Segment.segmentArrayBuffer));
        } else {
            this.temporaryBufferedSegments.push(Segment);
        }
    }

    IsBufferedSegmentIndex(index) {
        let result = null;
        for (let i = 0, l = this.BufferedSegments.length; i < l; i++) {
            if (this.BufferedSegments[i].index == index) {
                result = (this.BufferedSegments[i].index == index);
                break;
            } else {
                result = false;
            }
        }
        return result;
    }
}
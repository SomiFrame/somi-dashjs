/*
 视频流缓存 管理 已下载的视频流
 */
export default class BufferCache {
    constructor() {
        this.BufferedSegments = {};
        this.temporaryBufferedSegments = {};
        this.InitArrayBuffer = new ArrayBuffer();
        this.VideoSIDX = {};
    }

    getSegmentArrayBufferByIndex(index) {
        return this.BufferedSegments[index];
    }

    pushSegment(sourceBuffer, Segment) {
        this.BufferedSegments[Segment.index] = Segment.segmentArrayBuffer;
        if (!sourceBuffer.updating) {
            sourceBuffer.appendBuffer(new Uint8Array(Segment.segmentArrayBuffer));
        } else {
            this.temporaryBufferedSegments[Segment.index] = Segment.segmentArrayBuffer;
        }
    }
    /**
     * 检测该号码的分片是否已缓存
     * @param index
     * @returns {*}
     * @constructor
     */
    IsBufferedSegmentIndex(index) {
        return this.BufferedSegments.hasOwnProperty(index);
    }
}
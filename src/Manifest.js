/**
 * 视频的dash相关信息
 */
export default class Manifest {
    /**
     *
     * @param selectorString
     * @param url
     * @param mimeType
     * @param initRange
     * @param indexRange
     */
    constructor(selectorString, url, mimeType, initRange, indexRange) {
        console.log(selectorString);
        this.videoDom = document.querySelector(selectorString);
        this.SegmentUrl = url;
        this.VideoMimeType = mimeType;
        this.SegmentSIDX = {
            IndexRange: indexRange
        };
        this.Initialization = {
            InitRange: initRange
        };
    }
}
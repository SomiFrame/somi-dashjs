export default class BufferController {
    constructor(isoFile) {
        this.ISOFile = isoFile;
        this.VideoBox = isoFile.boxes[0];
        this.CurrentSegmentIndex = 0;
        this.LastLoadedSegmentIndex = 0;
        this.NextSegmentIndex = 0;
        this.IsFetching = false;
        this.FirstSegmentLoaded = false;
        this.PreSegmentNumber = 5;
        this.LoadingSegment = null;
        this.QueueLoadEvent = [];
        this.CurrentLoadSegmentIndex = null;
    }

    /**
     * 根据时间节点计算出该时间所在的切片位置 并返回所在切片的号码
     * @param VideoBoxs
     * @param time
     * @returns {*}
     */
    calculateSegmentIndexForTime(time) {
        let VcalculateTime, Vtimescale, SegmentIndex;
        Vtimescale = this.VideoBox.timescale;
        VcalculateTime = 0;
        for (let i = 0,length=this.VideoBox.references.length; i < length; i++) {
            VcalculateTime += this.VideoBox.references[i].subsegment_duration / Vtimescale;
            if (VcalculateTime >= time) {
                SegmentIndex = i;
                break;
            }
        }
        return SegmentIndex;
    }

    /**
     * 根据视频分片的下标号 计算出该该分片所要求的字节范围
     * @param initRange
     * @param SegmentIndex
     * @returns {{start: *, end: *}}
     */
    calculateRequestRangeForIndex(initRange, SegmentIndex) {
        let RangeStart, RangeEnd;
        RangeStart = initRange.start;
        RangeEnd = initRange.end;
        for (let i = 0; i <= SegmentIndex; i++) {
            RangeStart = RangeEnd + 1;
            RangeEnd += this.VideoBox.references[i].referenced_size;
        }
        return {
            start: RangeStart,
            end: RangeEnd
        }
    }
}
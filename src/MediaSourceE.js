import ISOBoxer from 'codem-isoboxer'
import BufferController from './BufferController'
import BufferCache from './BufferCache'
import ManiFest from './Manifest'
export default class MediaSourceE {
    constructor(selectorString, url, mimeType, initRange, indexRange) {
        if (!MediaSourceE.isSupportDash()) {
            throw  new Error('Oops! your browser does not support MediaSource extension');
        }
        this.manifest = new ManiFest(selectorString, url, mimeType, initRange, indexRange);
        this.bufferController = null;
        this.bufferCache = new BufferCache();
        this.mediasource = new window.MediaSource();
        this.mediasource.addEventListener('sourceopen', this.onSourceOpen.bind(this));
        this.sourceBuffer = null;
        this.ISOFile = null;
        this.manifest.videoDom.src = this.getUrlFromMSE();
        this.tID = null;
        this.addVideoEvent();
        console.log(this);
    }

    static isSupportDash() {
        return !(typeof  window.MediaSource == "undefined");
    }

    addVideoEvent() {
        this.manifest.videoDom.addEventListener('seeking', this.onVideoSeeking.bind(this));
        this.manifest.videoDom.addEventListener('timeupdate', this.onVideoTimeUpdate.bind(this));
        this.manifest.videoDom.addEventListener('seeked', this.onVideoSeeked.bind(this));
    }

    onVideoSeeked(e) {
    }

    onVideoSeeking(e) {
    }

    onVideoTimeUpdate() {
        this.bufferController.CurrentSegmentIndex =
            this.bufferController.calculateSegmentIndexForTime(this.manifest.videoDom.currentTime);
        this.loadCurrentSegmentData(this.bufferController.CurrentSegmentIndex);
    }

    onSourceOpen() {
        this.sourceBuffer = this.mediasource.addSourceBuffer(this.manifest.VideoMimeType);
        this.loadInitialData().then(()=> {
            this.loadSIDXData();
        });
    }

    onUpdateEnd() {
        if (!this.sourceBuffer.updating) {
            if (this.bufferCache.temporaryBufferedSegments.length) {
                let arrayBuffer = this.bufferCache.temporaryBufferedSegments.shift().segmentArrayBuffer;
                this.sourceBuffer.appendBuffer(new Uint8Array(arrayBuffer));
            }
        }
    }

    onUpdate() {
        // console.log('sb-update')
    }

    onUpdateStart() {
        // console.log('sb-updateStart')
    }

    loadInitialData() {
        let url = this.manifest.SegmentUrl;
        let option = {
            method: 'GET',
            headers: {
                Range: `bytes=${this.manifest.Initialization.InitRange.start}-${this.manifest.Initialization.InitRange.end}`
            }
        };
        let cb = data => {
            this.sourceBuffer.appendBuffer(new Uint8Array(data));
        };
        return this.fetchData(url, option, cb);
    }

    loadSIDXData() {
        let url = this.manifest.SegmentUrl;
        let option = {
            method: 'GET',
            headers: {
                Range: `bytes=${this.manifest.SegmentSIDX.IndexRange.start}-${this.manifest.SegmentSIDX.IndexRange.end}`
            }
        };
        let cb = data => {
            this.ISOFile = ISOBoxer.parseBuffer(data);
            this.bufferController = new BufferController(ISOBoxer.parseBuffer(data));
            this.sourceBuffer.appendBuffer(new Uint8Array(data));
            this.sourceBuffer.addEventListener('updateend', this.onUpdateEnd.bind(this));
            this.sourceBuffer.addEventListener('update', this.onUpdate.bind(this));
            this.sourceBuffer.addEventListener('updatestart', this.onUpdateStart.bind(this));
            this.manifest.videoDom.play();
            this.loadCurrentSegmentData(0);
        };
        this.fetchData(url, option, cb);
    }

    loadCurrentSegmentData(index) {
        let loadIndex = index;
        this.bufferController.CurrentLoadSegmentIndex = loadIndex;
        if (this.bufferController.LoadingSegment) {
            this.pushIndexToQueue(loadIndex);
            return;
        }
        if (this.bufferCache.IsBufferedSegmentIndex(loadIndex)) {
            this.loadSegmentDataFromCache(loadIndex);
        } else {
            this.loadSegmentDataFromNet(loadIndex);
        }
    }

    loadNextSegmentData(index) {
        let loadIndex = index;
        if(loadIndex>=this.bufferController.VideoBox.reference_count) return;
        if (this.bufferController.LoadingSegment) {
            return;
        }
        if (this.bufferCache.IsBufferedSegmentIndex(loadIndex)) {
            this.loadSegmentDataFromCache(loadIndex,'next');
        } else {
            this.loadSegmentDataFromNet(loadIndex,'next');
        }
    }

    detectivePreloadOrNot() {
        let currentIndex = this.bufferController.CurrentSegmentIndex;
        let lastLoadedIndex = this.bufferController.LastLoadedSegmentIndex;
        let preLoadNumber = this.bufferController.PreSegmentNumber;
        return (lastLoadedIndex - currentIndex < preLoadNumber&&lastLoadedIndex>=currentIndex);
    }

    loadSegmentDataFromCache(index) {
        let CacheSegment = this.bufferCache.getSegmentArrayBufferByIndex(index);
        this.bufferCache.pushSegment(this.sourceBuffer, CacheSegment);
        this.bufferController.FirstSegmentLoaded = true;
        this.bufferController.LastLoadedSegmentIndex = index;
        this.bufferController.NextSegmentIndex = index + 1;
        this.bufferController.LoadingSegment = false;
        if (this.detectivePreloadOrNot()) {
            let NextIndex = this.bufferController.NextSegmentIndex;
            this.loadNextSegmentData(NextIndex);
        }
    }

    loadSegmentDataFromNet(index) {
        let loadIndex = index;
        let url = this.manifest.SegmentUrl;
        let range = this.bufferController.calculateRequestRangeForIndex(this.manifest.SegmentSIDX.IndexRange, loadIndex);
        let option = {
            method: 'GET',
            headers: {
                Range: `bytes=${range.start}-${range.end}`
            }
        };
        let cb = data => {
            this.bufferCache.pushSegment(this.sourceBuffer, {
                index: loadIndex,
                segmentArrayBuffer: data
            });
            this.bufferController.LastLoadedSegmentIndex = loadIndex;
            this.bufferController.NextSegmentIndex = loadIndex + 1;
            this.bufferController.LoadingSegment = false;
            if (this.bufferController.QueueLoadEvent.length) {
                let index = this.bufferController.QueueLoadEvent.shift();
                this.loadCurrentSegmentData(index);
            }
            if (this.detectivePreloadOrNot()) {
                let NextIndex = this.bufferController.NextSegmentIndex;
                this.loadNextSegmentData(NextIndex);
            }
        };
        this.bufferController.LoadingSegment = true;
        this.fetchData(url, option, cb);
    }

    pushIndexToQueue(index) {
        let array = this.bufferController.QueueLoadEvent;
        if (array.indexOf(index) === -1) {
            this.bufferController.QueueLoadEvent = [index];
        }
    }

    fetchData(url, option, cb) {
        return fetch(url, option)
            .then(data=> {
                return data.arrayBuffer()
            })
            .then(data=> {
                cb(data);
            });
    }

    getUrlFromMSE() {
        return window.URL.createObjectURL(this.mediasource);
    }
}
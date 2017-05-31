import MSE from "../src/MediaSourceE"
var mse = new  MSE('#vid1', '/dashStream',
    'video/mp4;codecs="avc1.4D401F,mp4a.40.2"',
    {start: 0, end: 1436},
    {start: 1437, end: 1900}
);
console.log(mse);
import MSE from "../src/MediaSourceE"
var mse = new  MSE('#vid1', 'http://163.172.38.115:3031/dashStream',
    'video/mp4;codecs="avc1.4D401F,mp4a.40.2"',
    {start: 0, end: 1436},
    {start: 1437, end: 1900}
);
// var mse = new  MSE('#vid1', '/video/new_video_dashinit.mp4',
//     'video/mp4;codecs="avc1.640015,mp4a.40.2"',
//     {start: 0, end: 1440},
//     {start: 1441, end: 1580}
// );
console.log(mse);
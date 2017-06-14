// var MSE = require("../dist/MediaSourceE")
import MSE from "../src/MediaSourceE"
console.log('es6',MSE)
window.mse = new  MSE('#vid1', '/video/VivaLaVida_dashinit.mp4',
    'video/mp4;codecs="avc1.4D401F,mp4a.40.2"',
    {start: 0, end: 1436},
    {start: 1437, end: 1900}

);
// console.log(mse);
// var video = document.querySelector('#vid1');
//
// navigator.webkitGetUserMedia({
//     video: true
// }, success, error);
//
// function success(stream) {
//     video.src = window.webkitURL.createObjectURL(stream);
//     video.play();
// }
//
// function error(err) {
//     alert('video error: ' + err)
// }
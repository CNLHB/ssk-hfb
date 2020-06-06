export default function (callback) {
    if ( window.document.readyState === 'complete') {
        callback();
    } else {
        window.addEventListener('load', callback);
    }
}
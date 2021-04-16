const randRoom = () => {
    var result = '';
    var hexChars = '0123456789abcdef';
    for (var i = 0; i < 6; i += 1) {
        result += hexChars[Math.floor(Math.random() * 6)];
    }
    return result;
}

const randPiece = () => {
    return Math.random() > 0.5 ? 'X':'O'
}

module.exports = {randRoom, randPiece};
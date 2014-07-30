var loggerBox = document.createElement( "div" );
var subtitleDisplayWrapper = document.createElement( "div" );

function setUpStatusDisplay() {

    loggerBox.id = "loggerBox";
    document.body.appendChild( loggerBox );
    subtitleDisplayWrapper.id = "subtitleDisplayWrapper";
    loggerBox.appendChild( subtitleDisplayWrapper );
    var subtitleText = document.createElement( "div" );
    subtitleText.id = "subtitleText";
    subtitleDisplayWrapper.appendChild( subtitleText );

}

function resetSubtitles() {
    while ( subtitleDisplayWrapper.firstChild ) {
        subtitleDisplayWrapper.removeChild( subtitleDisplayWrapper.firstChild );
    }
}

function pushSubtitle( message, subtitleTime ) {
    var text = document.createElement( "div" );
    text.className = "subtitleText";

    // Break up the message into the character speaking
    // and the actual message
    var splitMessage = message.split( ":", 2 );
    var messageText = message;
    if ( splitMessage.length > 1 ) {
        text.innerHTML += splitMessage[ 0 ] + ":";
        messageText = splitMessage[ 1 ];
    }

    // Shave 100ms off the subtitle time to make up for any
    // delay between the VO and the subtitle firing
    subtitleTime -= 0.1;

    var time, lastUpdateTime;
    var index = 0;
    var charInterval = messageText.length > 0 ? subtitleTime / messageText.length : 0;

    var updateSubtitle = function() {
        time = vwf_view.kernel.time();
        lastUpdateTime = lastUpdateTime || time;
        
        var difference = time - lastUpdateTime;
        if ( difference >= charInterval ) {
            lastUpdateTime = time - ( difference - charInterval );
            text.innerHTML += messageText[ index ];
            loggerBox.scrollTop = loggerBox.scrollHeight;
            index++;
        }

        if ( index < messageText.length ) {
            requestAnimationFrame( updateSubtitle );
        }
    }

    requestAnimationFrame( updateSubtitle );
    subtitleDisplayWrapper.appendChild( text );
}

//@ sourceURL=source/statusDisplay.js
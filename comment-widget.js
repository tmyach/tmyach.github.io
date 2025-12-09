/*
    (PLEASE DO NOT DELETE THIS HEADER OR CREDIT!)

    User customizable settings below!
    Please refer to my guide over on https://virtualobserver.moe/ayano/comment-widget if you're confused on how to use this.
    The IDs at the top are a requirement but everything else is optional!
    Do not delete any settings even if you aren't using them! It could break the program.

    After filling out your options, just paste this anywhere you want a comment section
    (But change the script src URL to wherever you have this widget stored on your site!)

        <div id="c_widget"></div>
        <script src="comment-widget.js"></script>

    Have fun! Bug reports are encouraged if you happen to run into any issues.
    - Ayano (https://virtualobserver.moe/)
*/

// REQUIRED - Your Google Form/Sheet IDs (these look correct)
const s_stylePath = 'comment-widget.css';
const s_formId = '1FAIpQLSdK-CI3gjpds1gX3T95ICc9O72AUV-adu49dK0urB0jm8lgXw';
const s_nameId = '598454482';
const s_websiteId = '204709470';
const s_textId = '2075272977';
const s_pageId = '132386639';
const s_replyId = '1652598007';
const s_sheetId = '1uC0MYyZH-IwmAZTO9vK2utmaR317uujhiuP3Yk2-An0';

// Timezone (EST)
const s_timezone = -5;
const s_daylightSavings = true;
const s_dstStart = ['March', 'Sunday', 2, 2];
const s_dstEnd = ['November', 'Sunday', 1, 2];

// Settings
const s_commentsPerPage = 5;
const s_maxLength = 500;
const s_maxLengthName = 16;
const s_commentsOpen = true;
const s_collapsedReplies = true;
const s_longTimestamp = false;
let s_includeUrlParameters = false;
const s_fixRarebitIndexPage = false;

// Word filter - OFF (fixes syntax error)
const s_wordFilterOn = false;
const s_filterReplacement = '****';

// HOMEPAGE FIX - Force '/' path
let v_pagePath = window.location.pathname;
if (v_pagePath === '/' || v_pagePath === '') {
    v_pagePath = '/';
}
if (s_includeUrlParameters) {v_pagePath += window.location.search}

// Set up the word filter if applicable
let v_filteredWords;
if (s_wordFilterOn) {
    v_filteredWords = s_filteredWords.join('|');
    v_filteredWords = new RegExp(String.raw `\b(${v_filteredWords})\b`, 'ig');
}

// Run widget
document.addEventListener('DOMContentLoaded', function() {
    // Find container
    let c_container = document.getElementById('c_container');
    if (!c_container) {
        c_container = document.createElement('div');
        c_container.id = 'c_container';
        document.getElementById('c_widget').appendChild(c_container);
    }

    // Load comments immediately
    getComments();
});

/*
    (PLEASE DO NOT DELETE THIS HEADER OR CREDIT!)


    User customizable settings below!
    Please refer to my guide over on [https://virtualobserver.moe/ayano/comment-widget](https://virtualobserver.moe/ayano/comment-widget) if you're confused on how to use this.
    The IDs at the top are a requirement but everything else is optional!
    Do not delete any settings even if you aren't using them! It could break the program.
*/

// === REQUIRED SETTINGS ===
const s_stylePath = 'comment-widget.css';
const s_formId = '1FAIpQLSdK-CI3gjpds1gX3T95ICc9O72AUV-adu49dK0urB0jm8lgXw';
const s_nameId = '598454482';
const s_websiteId = '204709470';
const s_textId = '2075272977';
const s_pageId = '132386639';
const s_replyId = '1652598007';
const s_sheetId = '1OAPC5wtDthOxMW9U7uqnhkolnQaERMCOz0f4gEVNR3Q';

// === TIMEZONE SETTINGS ===
const s_timezone = -5;
const s_daylightSavings = true;
const s_dstStart = ['March', 'Sunday', 2, 2];
const s_dstEnd = ['November', 'Sunday', 1, 2];

// === MISC SETTINGS ===
const s_commentsPerPage = 5;
const s_maxLength = 500;
const s_maxLengthName = 16;
const s_commentsOpen = true;
const s_collapsedReplies = true;
const s_longTimestamp = false;
let s_includeUrlParameters = false;
const s_fixRarebitIndexPage = false;

// === FILTER & TEXT STRINGS ===
const s_wordFilterOn = false;
const s_filterReplacement = '****';
const s_filteredWords = ['bitch'];

const s_widgetTitle = 'Leave a Comment in my Guestbook!';
const s_nameFieldLabel = 'Name:';
const s_websiteFieldLabel = 'Website/email/handle (Optional):';
const s_textFieldLabel = 'Comment:';
const s_submitButtonLabel = 'Submit';
const s_loadingText = 'Loading comments...';
const s_noCommentsText = 'No comments yet!';
const s_closedCommentsText = 'Comments are closed temporarily!';
const s_websiteText = 'Website';
const s_replyButtonText = 'Reply';
const s_replyingText = 'Replying to';
const s_expandRepliesText = 'Show Replies';
const s_leftButtonText = '<<';
const s_rightButtonText = '>>';

// === DO NOT EDIT BELOW UNLESS EXPERIENCED ===

// rarebit fix
if (s_fixRarebitIndexPage) {s_includeUrlParameters = true}

// Apply stylesheet
const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = s_stylePath;
document.head.appendChild(css);

// === BASE STRUCTURE ===
document.getElementById('c_widget').innerHTML = `
    <div id="c_inputDiv">
        <form id="c_form" onsubmit="c_submitButton.disabled = true; v_submitted = true;" 
        method="post" target="c_hiddenIframe" 
        action="https://docs.google.com/forms/d/e/${s_formId}/formResponse"></form>
    </div>
    <div id="c_container">${s_loadingText}</div>
`;

const c_form = document.getElementById('c_form');
if (s_commentsOpen) {
    c_form.innerHTML = `
        <h2 id="c_widgetTitle">${s_widgetTitle}</h2>
        <div class="c-inputWrapper">
            <label class="c-label" for="entry.${s_nameId}">${s_nameFieldLabel}</label>
            <input class="c-input" name="entry.${s_nameId}" id="entry.${s_nameId}" 
            type="text" maxlength="${s_maxLengthName}" required>
        </div>
        <div class="c-inputWrapper">
            <label class="c-label" for="entry.${s_websiteId}">${s_websiteFieldLabel}</label>
            <input class="c-input" name="entry.${s_websiteId}" id="entry.${s_websiteId}" 
            type="text" maxlength="100">
        </div>
        <div class="c-inputWrapper">
            <label class="c-label" for="entry.${s_textId}">${s_textFieldLabel}</label>
            <textarea class="c-input" name="entry.${s_textId}" id="entry.${s_textId}" 
            rows="4" cols="50" maxlength="${s_maxLength}" required></textarea>
        </div>
        <input id="c_submitButton" name="c_submitButton" type="submit" value="${s_submitButtonLabel}">
    `;
} else {
    c_form.innerHTML = s_closedCommentsText;
}

const c_container = document.getElementById('c_container');
let v_pageNum = 1;
let a_commentDivs = [];
let v_submitted = false;

// Add hidden data inputs
const v_pagePath = (() => {
    let path = window.location.pathname;
    if (s_includeUrlParameters) path += window.location.search;
    return path;
})();
const pageInput = document.createElement('input');
pageInput.value = v_pagePath;
pageInput.type = 'text';
pageInput.style.display = 'none';
pageInput.id = 'entry.' + s_pageId;
pageInput.name = pageInput.id;
c_form.appendChild(pageInput);

// Reply hidden fields
const replyText = document.createElement('span');
replyText.id = 'c_replyingText';
replyText.style.display = 'none';
c_form.appendChild(replyText);
const replyInput = document.createElement('input');
replyInput.type = 'text';
replyInput.style.display = 'none';
replyInput.id = 'entry.' + s_replyId;
replyInput.name = replyInput.id;
c_form.appendChild(replyInput);

// Iframe handling
const iframe = document.createElement('iframe');
iframe.name = 'c_hiddenIframe';
iframe.style.display = 'none';
iframe.onload = () => {
    if (v_submitted) {
        v_submitted = false;
        getComments();
    }
};
c_form.appendChild(iframe);

const c_submitButton = document.getElementById('c_submitButton');

// === FIXED: getComments() now properly fetches and parses data ===
async function getComments() {
    c_container.innerHTML = s_loadingText;

    try {
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${s_sheetId}/gviz/tq?`);
        const textData = await response.text();
        const json = JSON.parse(textData.substring(textData.indexOf('{'), textData.lastIndexOf(')')));
        const cols = json.table.cols.map(c => c.label || '');
        let comments = [];

        // detect "Page" column (case-insensitive)
        const pageIdx = cols.findIndex(l => l.toLowerCase() === 'page');
        if (pageIdx === -1) {
            console.warn('No "Page" column found – showing all comments.');
        }

        for (const row of json.table.rows) {
            const cells = row.c;
            if (!cells) continue;
            const thisPage = pageIdx >= 0 && cells[pageIdx] ? cells[pageIdx].v : null;
            if (pageIdx === -1 || thisPage === v_pagePath) {
                const comment = {};
                cols.forEach((label, i) => {
                    comment[label] = cells[i] ? cells[i].v : '';
                });
                comment.Timestamp2 = cells[0] && (cells[0].f || cells[0].v);
                comments.push(comment);
            }
        }

        if (comments.length === 0) {
            c_container.innerHTML = s_noCommentsText;
        } else {
            displayComments(comments);
        }
    } catch (err) {
        console.error('Error loading comments:', err);
        c_container.innerHTML = 'Error loading comments.';
    }
}

// === DISPLAY COMMENTS (unchanged with logical fix) ===
function displayComments(comments) {
    comments.reverse();
    c_container.innerHTML = '';
    a_commentDivs = [];

    for (const data of comments) {
        const div = document.createElement('div');
        div.className = 'c-comment';
        const name = document.createElement('h3');
        name.className = 'c-name';
        name.textContent = data['Name'] || 'Anonymous';
        const msg = document.createElement('p');
        msg.className = 'c-text';
        msg.textContent = data['Comment'] || data['Text'] || '';
        div.appendChild(name);
        div.appendChild(msg);
        c_container.appendChild(div);
        a_commentDivs.push(div);
    }
}

getComments(); // initial load

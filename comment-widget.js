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

// REQUIRED - Your exact settings
const s_stylePath = 'comment-widget.css';
const s_formId = '1FAIpQLSdK-CI3gjpds1gX3T95ICc9O72AUV-adu49dK0urB0jm8lgXw';
const s_nameId = '598454482';
const s_websiteId = '204709470';
const s_textId = '2075272977';
const s_pageId = '132386639';
const s_replyId = '1652598007';
const s_sheetId = '1OAPC5wtDthOxMW9U7uqnhkolnQaERMCOz0f4gEVNR3Q';

const s_timezone = -5;
const s_daylightSavings = true;
const s_dstStart = ['March', 'Sunday', 2, 2];
const s_dstEnd = ['November', 'Sunday', 1, 2];

const s_commentsPerPage = 5;
const s_maxLength = 500;
const s_maxLengthName = 16;
const s_commentsOpen = true;
const s_collapsedReplies = true;
const s_longTimestamp = false;
let s_includeUrlParameters = false;
const s_fixRarebitIndexPage = false;

const s_wordFilterOn = false;
const s_filterReplacement = '****';

// Homepage fix
let v_pagePath = window.location.pathname;
if (v_pagePath === '/' || v_pagePath === '') {
    v_pagePath = '/';
}
if (s_includeUrlParameters) {v_pagePath += window.location.search}

let v_filteredWords;
if (s_wordFilterOn) {
    v_filteredWords = new RegExp(String.raw `\b()\b`, 'ig');
}

let c_submitButton;

// DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = s_stylePath;
    document.head.appendChild(link);
    
    // Main container
    const c_widget = document.getElementById('c_widget');
    let c_container = document.getElementById('c_container');
    if (!c_container) {
        c_container = document.createElement('div');
        c_container.id = 'c_container';
        c_widget.appendChild(c_container);
    }

    // CREATE FORM INPUTS - This was missing!
    createCommentForm(c_container);
    
    // Create fake submit button reference
    c_submitButton = document.getElementById('c_submitButton') || document.createElement('button');
    
    // Load comments
    getComments();
});

function createCommentForm(container) {
    const c_form = document.createElement('form');
    c_form.id = s_formId;
    c_form.method = 'POST';
    c_form.target = 'c_hiddenIframe';
    c_form.action = `https://docs.google.com/forms/d/e/${s_formId}/formResponse`;
    container.appendChild(c_form);

    // HIDDEN PAGE INPUT
    const c_pageInput = document.createElement('input');
    c_pageInput.value = v_pagePath;
    c_pageInput.type = 'hidden';
    c_pageInput.id = 'entry.' + s_pageId;
    c_pageInput.name = c_pageInput.id;
    c_form.appendChild(c_pageInput);

    // HIDDEN REPLY INPUT
    const c_replyInput = document.createElement('input');
    c_replyInput.type = 'hidden';
    c_replyInput.id = 'entry.' + s_replyId;
    c_replyInput.name = c_replyInput.id;
    c_form.appendChild(c_replyInput);

    // NAME INPUT - VISIBLE
    const c_nameInput = document.createElement('input');
    c_nameInput.id = 'entry.' + s_nameId;
    c_nameInput.name = c_nameInput.id;
    c_nameInput.type = 'text';
    c_nameInput.placeholder = 'Name';
    c_nameInput.maxLength = s_maxLengthName;
    c_nameInput.required = true;
    c_form.appendChild(c_nameInput);

    // WEBSITE INPUT
    const c_websiteInput = document.createElement('input');
    c_websiteInput.id = 'entry.' + s_websiteId;
    c_websiteInput.name = c_websiteInput.id;
    c_websiteInput.type = 'url';
    c_websiteInput.placeholder = 'Website (optional)';
    c_form.appendChild(c_websiteInput);

    // COMMENT TEXTAREA - VISIBLE
    const c_textInput = document.createElement('textarea');
    c_textInput.id = 'entry.' + s_textId;
    c_textInput.name = c_textInput.id;
    c_textInput.placeholder = 'Write a comment...';
    c_textInput.maxLength = s_maxLength;
    c_textInput.required = true;
    c_textInput.rows = 3;
    c_form.appendChild(c_textInput);

    // SUBMIT BUTTON
    c_submitButton = document.createElement('button');
    c_submitButton.id = 'c_submitButton';
    c_submitButton.type = 'submit';
    c_submitButton.textContent = 'Post Comment';
    c_form.appendChild(c_submitButton);

    // HIDDEN IFRAME
    const c_hiddenIframe = document.createElement('iframe');
    c_hiddenIframe.id = 'c_hiddenIframe';
    c_hiddenIframe.name = 'c_hiddenIframe';
    c_hiddenIframe.style.display = 'none';
    c_hiddenIframe.onload = fixFrame;
    c_form.appendChild(c_hiddenIframe);
}

function fixFrame() {
    setTimeout(getComments, 1000);
}

function getComments() {
    if (c_submitButton) c_submitButton.disabled = true;

    const url = `https://docs.google.com/spreadsheets/d/${s_sheetId}/gviz/tq?`;
    getSheet(url).then(result => {
        try {
            const json = JSON.parse(result.split('\n')[1].replace(/google.visualization.Query.setResponse\(|\);/g, ''));
            const pageIdx = json.table.cols.findIndex(col => col.label == 'Page');
            
            let comments = [];
            if (json.table.parsedNumHeaders > 0) {
                for (let r = 0; r < json.table.rows.length; r++) {
                    let val1 = json.table.rows[r].c[pageIdx] ? json.table.rows[r].c[pageIdx].v : '';
                    if (val1 == v_pagePath) {
                        let comment = {};
                        for (let c = 0; c < json.table.cols.length; c++) {
                            comment[json.table.cols[c].label] = json.table.rows[r].c[c] ? json.table.rows[r].c[c].v : '';
                        }
                        comments.push(comment);
                    }
                }
            }

            if (comments.length == 0) {
                document.getElementById('c_container').innerHTML += '<p style="color:#666;">No comments yet!</p>';
            } else {
                displayComments(comments);
            }
        } catch(e) {
            console.error(e);
        }
        if (c_submitButton) c_submitButton.disabled = false;
    }).catch(e => {
        console.error(e);
        if (c_submitButton) c_submitButton.disabled = false;
    });
}

function getSheet(url) {
    return fetch(url).then(r => r.ok ? r.text() : Promise.reject('Sheet error'));
}

function displayComments(comments) {
    // Comments display logic here - styled by your CSS
    console.log('Loaded', comments.length, 'comments');
}

let a_commentDivs = [];
function openReply(id) {
    console.log('Reply:', id);
}

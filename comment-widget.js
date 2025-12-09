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

// The values in this section are REQUIRED for the widget to work! Keep them in quotes!
const s_stylePath = 'comment-widget.css';
const s_formId = '1FAIpQLSdK-CI3gjpds1gX3T95ICc9O72AUV-adu49dK0urB0jm8lgXw';
const s_nameId = '598454482';
const s_websiteId = '204709470';
const s_textId = '2075272977';
const s_pageId = '132386639';
const s_replyId = '1652598007';
const s_sheetId = '1OAPC5wtDthOxMW9U7uqnhkolnQaERMCOz0f4gEVNR3Q';

// The values below are necessary for accurate timestamps, I've filled it in with EST as an example
const s_timezone = -5; // Your personal timezone (Example: UTC-5:00 is -5 here, UTC+10:30 would be 10.5)
const s_daylightSavings = true; // If your personal timezone uses DST, set this to true
// For the dates DST start and end where you live: [Month, Weekday, which number of that weekday, hour (24 hour time)]
const s_dstStart = ['March', 'Sunday', 2, 2]; // Example shown is the second Sunday of March at 2:00 am
const s_dstEnd = ['November', 'Sunday', 1, 2]; // Example shown is the first Sunday of November at 2:00 am

// Misc - Other random settings
const s_commentsPerPage = 5; // The max amount of comments that can be displayed on one page, any number >= 1 (Replies not counted)
const s_maxLength = 500; // The max character length of a comment
const s_maxLengthName = 16; // The max character length of a name
const s_commentsOpen = true; // Change to false if you'd like to close your comment section site-wide (Turn it off on Google Forms too!)
const s_collapsedReplies = true; // True for collapsed replies with a button, false for replies to display automatically
const s_longTimestamp = false; // True for a date + time, false for just the date
let s_includeUrlParameters = false; // Makes new comment sections on pages with URL parameters when set to true (If you don't know what this does, leave it disabled)
const s_fixRarebitIndexPage = false; // If using Rarebit, change to true to make the index page and page 1 of your webcomic have the same comment section

// Word filter - OFF to prevent syntax error
const s_wordFilterOn = false; // True for on, false for off
const s_filterReplacement = '****'; // Change what filtered words are censored with (**** is the default)

// HOMEPAGE FIX - Force consistent homepage path
let v_pagePath = window.location.pathname;
if (v_pagePath === '/' || v_pagePath === '') {
    v_pagePath = '/';
}
if (s_includeUrlParameters) {v_pagePath += window.location.search}
if (s_fixRarebitIndexPage && v_pagePath == '/') {v_pagePath = '/?pg=1'}

// No profanity list = no syntax error
let v_filteredWords;
if (s_wordFilterOn) {
    v_filteredWords = new RegExp(String.raw `\b()\b`, 'ig');
}

// The fake button is just a dummy placeholder for when comments are closed
let c_submitButton;
if (s_commentsOpen) {c_submitButton = document.getElementById('c_submitButton')}
else {c_submitButton = document.createElement('button')}

// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = s_stylePath;
    document.head.appendChild(link);
    
    // Create container if missing
    let c_container = document.getElementById('c_container');
    if (!c_container) {
        c_container = document.createElement('div');
        c_container.id = 'c_container';
        document.getElementById('c_widget').appendChild(c_container);
    }
    
    // Create form elements
    const c_form = document.createElement('form');
    c_form.id = s_formId;
    c_form.method = 'POST';
    c_form.target = 'c_hiddenIframe';
    c_form.action = `https://docs.google.com/forms/d/e/${s_formId}/formResponse`;
    c_container.appendChild(c_form);

    // Add invisible page input to document
    const c_pageInput = document.createElement('input');
    c_pageInput.value = v_pagePath; 
    c_pageInput.type = 'text'; 
    c_pageInput.style.display = 'none';
    c_pageInput.id = 'entry.' + s_pageId; 
    c_pageInput.name = c_pageInput.id; 
    c_form.appendChild(c_pageInput);

    // Add the "Replying to..." text to document
    let c_replyingText = document.createElement('span');
    c_replyingText.style.display = 'none'; 
    c_replyingText.id = 'c_replyingText';
    c_form.appendChild(c_replyingText);

    // Add the invisible reply input to document
    let c_replyInput = document.createElement('input');
    c_replyInput.type = 'text'; 
    c_replyInput.style.display = 'none';
    c_replyInput.id = 'entry.' + s_replyId; 
    c_replyInput.name = c_replyInput.id;
    c_form.appendChild(c_replyInput);

    // Add the invisible iFrame to the document for catching the default Google Forms submission page
    let v_submitted = false;
    let c_hiddenIframe = document.createElement('iframe');
    c_hiddenIframe.id = 'c_hiddenIframe'; 
    c_hiddenIframe.name = 'c_hiddenIframe'; 
    c_hiddenIframe.style.display = 'none'; 
    c_hiddenIframe.setAttribute('onload', 'if(v_submitted){fixFrame()}');
    c_form.appendChild(c_hiddenIframe);

    // Load comments
    getComments();
});

// Fix the invisible iFrame so it doesn't keep trying to load stuff
function fixFrame() {
    v_submitted = false;
    document.getElementById('c_hiddenIframe').srcdoc = '';
    getComments(); // Reload comments after submission
}

// Processes comment data with the Google Sheet ID
function getComments() {
    // Disable the submit button while comments are reloaded
    if (c_submitButton) c_submitButton.disabled = true;

    // Get the data
    const url = `https://docs.google.com/spreadsheets/d/${s_sheetId}/gviz/tq?tq=`;
    const retrievedSheet = getSheet(url);

    retrievedSheet.then(result => {
        try {
            // The data comes with extra stuff at the beginning, get rid of it
            const json = JSON.parse(result.split('\n')[1].replace(/google.visualization.Query.setResponse\(|\);/g, ''));

            // Need index of page column for checking if comments are for the right page
            const isPage = (col) => col.label == 'Page';
            let pageIdx = json.table.cols.findIndex(isPage);
            
            // Turn that data into usable comment data
            let comments = [];
            if (json.table.parsedNumHeaders > 0) {
                for (let r = 0; r < json.table.rows.length; r++) {
                    // Check for null rows
                    let val1 = json.table.rows[r].c[pageIdx] ? json.table.rows[r].c[pageIdx].v : '';
                    
                    // Check if the page name matches before adding to comment array
                    if (val1 == v_pagePath) { 
                        let comment = {};
                        for (let c = 0; c < json.table.cols.length; c++) {
                            let val2 = json.table.rows[r].c[c] ? json.table.rows[r].c[c].v : '';
                            comment[json.table.cols[c].label] = val2;
                        }
                        if (json.table.rows[r].c[0] && json.table.rows[r].c[0].f) {
                            comment.Timestamp2 = json.table.rows[r].c[0].f;
                        }
                        comments.push(comment);
                    }
                }
            }

            // Display comments or no comments message
            if (comments.length == 0) {
                document.getElementById('c_container').innerHTML = '<p>No comments yet!</p>';
            } else {
                displayComments(comments);
            }
            
            if (c_submitButton) c_submitButton.disabled = false;
        } catch(e) {
            console.error('Comment parsing error:', e);
            document.getElementById('c_container').innerHTML = '<p>Error loading comments.</p>';
            if (c_submitButton) c_submitButton.disabled = false;
        }
    }).catch(e => {
        console.error('Sheet fetch error:', e);
        document.getElementById('c_container').innerHTML = '<p>Comments unavailable.</p>';
        if (c_submitButton) c_submitButton.disabled = false;
    });
}

// Fetches the Google Sheet resource from the provided URL
function getSheet(url) {
    return new Promise(function (resolve, reject) {
        fetch(url).then(response => {
            if (!response.ok) { 
                reject('Could not find Google Sheet');
            } else {
                response.text().then(data => {
                    if (!data) { 
                        reject('Invalid data from sheet');
                    }
                    resolve(data);
                });
            }
        }).catch(e => reject(e));
    });
}

// Displays comments on page
let a_commentDivs = [];
function displayComments(comments) {
    const c_container = document.getElementById('c_container');
    c_container.innerHTML = '';

    // Get all reply comments by taking them out of the comment array
    let replies = [];
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].Reply) {
            replies.push(comments[i]);
            comments.splice(i, 1);
            i--;
        }
    }

    // Main comments (not replies)
    comments.reverse(); // Newest comments go to top
    for (let i = 0; i < comments.length; i++) {
        let commentDiv = document.createElement('div');
        commentDiv.id = 'c_' + Math.random().toString(36).substr(2, 9);
        
        // Basic comment structure (CSS will style)
        commentDiv.innerHTML = `
            <div class="c-header">
                <strong class="c-name">${comments[i].Name || 'Anonymous'}</strong>
                <span class="c-time">${comments[i].Timestamp2 || 'Just now'}</span>
            </div>
            <div class="c-text">${comments[i].Text || ''}</div>
        `;
        
        // Reply button
        let button = document.createElement('button');
        button.innerHTML = 'Reply';
        button.value = commentDiv.id;
        button.setAttribute('onclick', `openReply(this.value)`);
        button.className = 'c-replyButton';
        commentDiv.appendChild(button);

        commentDiv.className = 'c-comment';
        c_container.appendChild(commentDiv);
        a_commentDivs.push(commentDiv);
    }

    // Handle replies (simplified)
    for (let reply of replies) {
        // Find parent and add reply
        let parentId = reply.Reply;
        let parentDiv = document.getElementById(parentId);
        if (parentDiv) {
            let replyDiv = document.createElement('div');
            replyDiv.className = 'c-reply';
            replyDiv.innerHTML = `
                <div class="c-header">
                    <strong class="c-name">${reply.Name || 'Anonymous'}</strong>
                    <span class="c-time">${reply.Timestamp2 || 'Just now'}</span>
                </div>
                <div class="c-text">${reply.Text || ''}</div>
            `;
            parentDiv.appendChild(replyDiv);
        }
    }
}

// Placeholder functions (form inputs get created by CSS)
function openReply(id) {
    console.log('Reply to:', id);
}

document.getElementById('year').textContent = new Date().getFullYear();

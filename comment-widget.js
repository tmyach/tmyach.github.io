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
const s_stylePath = 'comment-widget-dark.css';
const s_formId = '1FAIpQLSdK-CI3gjpds1gX3T95ICc9O72AUV-adu49dK0urB0jm8lgXw';
const s_nameId = '598454482';
const s_websiteId = '204709470';
const s_textId = '2075272977';
const s_pageId = '132386639';
const s_replyId = '1652598007';
const s_sheetId = '1uC0MYyZH-IwmAZTO9vK2utmaR317uujhiuP3Yk2-An0';

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

// Word filter - OFF (removes syntax error)
const s_wordFilterOn = false; // True for on, false for off
const s_filterReplacement = '****'; 

// HOMEPAGE FIX - Force '/' for root path
let v_pagePath = window.location.pathname;
if (v_pagePath === '/' || v_pagePath === '') {
    v_pagePath = '/'; // Ensures homepage comments show
}
if (s_includeUrlParameters) {v_pagePath += window.location.search}
if (s_fixRarebitIndexPage && v_pagePath == '/') {v_pagePath = '/?pg=1'}

// Wait for page load
document.addEventListener('DOMContentLoaded', function() {
    // Create main container
    const c_container = document.createElement('div');
    c_container.id = 'c_container';
    document.getElementById('c_widget').appendChild(c_container);

    // Create form
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

    // Add name input
    const c_nameInput = document.createElement('input');
    c_nameInput.id = `entry.${s_nameId}`;
    c_nameInput.name = c_nameInput.id;
    c_nameInput.type = 'text';
    c_nameInput.placeholder = 'Name';
    c_nameInput.maxLength = s_maxLengthName;
    c_nameInput.required = true;
    c_form.appendChild(c_nameInput);

    // Add website input
    const c_websiteInput = document.createElement('input');
    c_websiteInput.id = `entry.${s_websiteId}`;
    c_websiteInput.name = c_websiteInput.id;
    c_websiteInput.type = 'url';
    c_websiteInput.placeholder = 'Website (optional)';
    c_form.appendChild(c_websiteInput);

    // Add comment textarea
    const c_textInput = document.createElement('textarea');
    c_textInput.id = `entry.${s_textId}`;
    c_textInput.name = c_textInput.id;
    c_textInput.placeholder = 'Write a comment...';
    c_textInput.maxLength = s_maxLength;
    c_textInput.required = true;
    c_textInput.rows = 3;
    c_form.appendChild(c_textInput);

    // Submit button
    const c_submitButton = document.createElement('button');
    c_submitButton.id = 'c_submitButton';
    c_submitButton.type = 'submit';
    c_submitButton.textContent = 'Post Comment';
    c_form.appendChild(c_submitButton);

    // Load comments on page load
    getComments();
});

// Get comments from Google Sheet
function getComments() {
    const url = `https://docs.google.com/spreadsheets/d/${s_sheetId}/gviz/tq?`;
    
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const json = JSON.parse(data.split('\n')[1].replace(/google.visualization.Query.setResponse\(|\);/g, ''));
            const pageIdx = json.table.cols.findIndex(col => col.label == 'Page');
            
            let comments = [];
            if (json.table.parsedNumHeaders > 0) {
                for (let r = 0; r < json.table.rows.length; r++) {
                    let val1 = json.table.rows[r].c[pageIdx]?.v || '';
                    if (val1 == v_pagePath) {
                        let comment = {};
                        for (let c = 0; c < json.table.cols.length; c++) {
                            comment[json.table.cols[c].label] = json.table.rows[r].c[c]?.v || '';
                        }
                        comments.push(comment);
                    }
                }
            }

            if (comments.length === 0) {
                document.getElementById('c_container').innerHTML += '<p>No comments yet. Be the first!</p>';
            } else {
                displayComments(comments);
            }
        })
        .catch(error => {
            console.error('Error loading comments:', error);
            document.getElementById('c_container').innerHTML += '<p>Error loading comments.</p>';
        });
}

// Display comments
function displayComments(comments) {
    const container = document.getElementById('c_container');
    container.innerHTML = ''; // Clear existing content

    comments.reverse().forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'c-comment';
        commentDiv.innerHTML = `
            <strong>${comment.Name || 'Anonymous'}</strong>
            <span>${new Date(comment.Timestamp).toLocaleDateString()}</span>
            <p>${comment.Text || ''}</p>
        `;
        container.appendChild(commentDiv);
    });
}

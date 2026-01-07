/*
    (PLEASE DO NOT DELETE THIS HEADER OR CREDIT!)
    
    User customizable settings below!
    Please refer to my guide over on [https://virtualobserver.moe/ayano/comment-widget](https://virtualobserver.moe/ayano/comment-widget) if you're confused on how to use this.
    The IDs at the top are a requirement but everything else is optional!
    Do not delete any settings even if you aren't using them! It could break the program.
    
    After filling out your options, just paste this anywhere you want a comment section
    (But change the script src URL to wherever you have this widget stored on your site!)
        
        <div id="c_widget"></div>
        <script src="comment-widget.js"></script>
        
    Have fun! Bug reports are encouraged if you happen to run into any issues.
    - Ayano (https://virtualobserver.moe/)
*/


const s_stylePath = 'comment-widget.css';
const s_formId = '1FAIpQLSdK-CI3gjpds1gX3T95ICc9O72AUV-adu49dK0urB0jm8lgXw';
const s_nameId = '598454482';
const s_websiteId = '204709470';
const s_textId = '2075272977';
const s_pageId = '132386639';
const s_replyId = '1652598007';
const s_sheetId = '1OAPC5wtDthOxMW9U7uqnhkolnQaERMCOz0f4gEVNR3Q';


// admin
let ADMIN_NAME = "🐦 Tesia";
let ADMIN_STATUS = false;
let ADMIN_PASSWORD = "";
let ADMIN_CSS_CLASS = "c-adminHighlight";
let ADMIN_CODE = ""; // verify


fetch("https://docs.google.com/spreadsheets/d/1KSof8HA_x48JAy0mepk1qSTndv-v71yGaF7a2Y6l67M/gviz/tq?tqx=out:csv&range=A1")
  .then(r => r.text())
  .then(p => ADMIN_PASSWORD = p.trim().replace(/"/g, ''))
  .catch(err => console.error("Admin password fetch failed:", err));


const s_timezone = -5;
const s_daylightSavings = true;
const s_dstStart = ['March', 'Sunday', 2, 2];
const s_dstEnd = ['November', 'Sunday', 1, 2];

const s_commentsPerPage = 2;
const s_maxLength = 500;
const s_maxLengthName = 16;
const s_commentsOpen = true;
const s_collapsedReplies = true;
const s_longTimestamp = false;
let s_includeUrlParameters = false;
const s_fixRarebitIndexPage = false;

const s_wordFilterOn = false;
const s_filterReplacement = '****';
const s_filteredWords = ['bitch'];

const s_widgetTitle = 'Leave a Comment in my Guestbook!';
const s_nameFieldLabel = 'Name:';
const s_websiteFieldLabel = 'Website/email/handle:';
const s_textFieldLabel = 'Comment:';
const s_submitButtonLabel = 'Submit';
const s_loadingText = 'Loading comments...';
const s_noCommentsText = 'There are no comments here. Maybe you can make the first one!';
const s_closedCommentsText = 'Comments are closed temporarily!';
const s_websiteText = 'Website';
const s_replyButtonText = 'Reply';
const s_replyingText = 'Replying to';
const s_expandRepliesText = 'Show Replies';
const s_leftButtonText = '<<';
const s_rightButtonText = '>>';

if (s_fixRarebitIndexPage) { s_includeUrlParameters = true }

const c_cssLink = document.createElement('link');
c_cssLink.type = 'text/css';
c_cssLink.rel = 'stylesheet';
c_cssLink.href = s_stylePath;
document.getElementsByTagName('head')[0].appendChild(c_cssLink);

// tooltip element
const tooltip = document.createElement('div');
tooltip.className = 'testip';
tooltip.textContent = 'admin!';
document.body.appendChild(tooltip);


// html form
const v_mainHtml = `
    <div id="c_inputDiv">
        <form id="c_form" onsubmit="c_submitButton.disabled = true; v_submitted = true;" method="post" target="c_hiddenIframe" action="https://docs.google.com/forms/d/e/${s_formId}/formResponse"></form>
    </div>
    <div id="c_container">${s_loadingText}</div>
`;


const v_formHtml = `
    <h2 id="c_widgetTitle">${s_widgetTitle}</h2>
    
    <div id="c_adminLogin" style="margin-bottom: 15px; padding: 8px; background: transparent; border-radius: 4px; border-left: 2px dotted var(--primary);">
        <button type="button" id="c_adminButton" onclick="tryAdminLogin()" style="background: transparent; color: white; border: none; padding: 6px 12px; cursor: pointer;">🔐 Admin Login</button>
        <span id="c_adminStatus" style="margin-left: 10px; font-weight: 500; color: #666;"></span>
    </div>

    <div id="c_nameWrapper" class="c-inputWrapper">
        <label class="c-label c-nameLabel" for="entry.${s_nameId}">${s_nameFieldLabel}</label>
        <textarea class="c-input c-nameInput" name="entry.${s_nameId}" id="entry.${s_nameId}" type="text" maxlength="${s_maxLengthName}" placeholder="Jean Doe" required></textarea>
    </div>

    <div id="c_websiteWrapper" class="c-inputWrapper">
        <label class="c-label c-websiteLabel" for="entry.${s_websiteId}">${s_websiteFieldLabel}</label>
        <textarea class="c-input c-websiteInput" name="entry.${s_websiteId}" id="entry.${s_websiteId}" type="text" placeholder="@handle or [jeandoe@email.com](mailto:jeandoe@email.com) or [https://url.com](https://url.com) ... p.s. This information will not be displayed publicly!" maxlength="100"></textarea>
    </div>

    <div id="c_adminCodeWrapper" class="c-inputWrapper" style="display: none;">
        <label class="c-label" for="c_adminCode">Admin Code:</label>
        <input class="c-input" name="entry.1666564503" id="c_adminCode" type="text" readonly style="background: #e9ecef;">
    </div>

    <div id="c_textWrapper" class="c-inputWrapper">
        <label class="c-label c-textLabel" for="entry.${s_textId}">${s_textFieldLabel}</label>
        <textarea class="c-input c-textInput" name="entry.${s_textId}" id="entry.${s_textId}" rows="4" cols="50" maxlength="${s_maxLength}" placeholder="Write your comment here..." required></textarea>
    </div>

    <input id="c_submitButton" name="c_submitButton" type="submit" value="${s_submitButtonLabel}" disabled>
`;

document.getElementById('c_widget').innerHTML = v_mainHtml;
const c_form = document.getElementById('c_form');
if (s_commentsOpen) { c_form.innerHTML = v_formHtml }
else { c_form.innerHTML = s_closedCommentsText }

const c_container = document.getElementById('c_container');
let v_pageNum = 1;
let v_amountOfPages = 1;
let v_commentMax = 1;
let v_commentMin = 1;

let v_filteredWords;
if (s_wordFilterOn) {
    v_filteredWords = s_filteredWords.join('|');
    v_filteredWords = new RegExp(String.raw`\b(${v_filteredWords})\b`, 'ig');
}

let c_submitButton;
if (s_commentsOpen) { c_submitButton = document.getElementById('c_submitButton') }
else { c_submitButton = document.createElement('button') }

function tryAdminLogin() {
    if (ADMIN_STATUS) {
        ADMIN_STATUS = false;
        let nameInput = document.getElementById(`entry.${s_nameId}`);
        let adminCodeWrapper = document.getElementById('c_adminCodeWrapper');
        nameInput.value = '';
        nameInput.readOnly = false;
        adminCodeWrapper.style.display = 'none';
        document.getElementById('c_adminStatus').innerHTML = '';
        document.getElementById('c_adminButton').innerHTML = '🔐 Admin Login';
        alert('Logged out successfully.');
        return;
    }
    
    if (!ADMIN_PASSWORD) {
        alert('Admin system not ready. Please wait...');
        return;
    }
    
    let password = prompt('Enter admin password:');
    if (password === ADMIN_PASSWORD) {
        ADMIN_STATUS = true;
        ADMIN_CODE = 'ADMIN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        let nameInput = document.getElementById(`entry.${s_nameId}`);
        let adminCodeInput = document.getElementById('c_adminCode');
        let adminCodeWrapper = document.getElementById('c_adminCodeWrapper');
        
        nameInput.value = ADMIN_NAME;
        nameInput.readOnly = true;
        adminCodeInput.value = ADMIN_CODE;
        adminCodeWrapper.style.display = 'block';
        
        document.getElementById('c_adminStatus').innerHTML = `Logged in as ${ADMIN_NAME}`;
        document.getElementById('c_adminButton').innerHTML = 'Logout';
        alert('✅ Admin login successful!');
    } else if (password !== null) {
        alert('❌ Wrong password!');
        document.getElementById('c_adminStatus').innerHTML = '❌ Wrong password!';
        setTimeout(() => document.getElementById('c_adminStatus').innerHTML = '', 3000);
    }
}


let v_pagePath = window.location.pathname;
if (s_includeUrlParameters) { v_pagePath += window.location.search }
if (s_fixRarebitIndexPage && v_pagePath == '/') { v_pagePath = '/?pg=1' }

const c_pageInput = document.createElement('input');
c_pageInput.value = v_pagePath; 
c_pageInput.type = 'text'; 
c_pageInput.style.display = 'none';
c_pageInput.id = 'entry.' + s_pageId; 
c_pageInput.name = c_pageInput.id;
c_form.appendChild(c_pageInput);

let c_replyingText = document.createElement('span');
c_replyingText.style.display = 'none'; 
c_replyingText.id = 'c_replyingText';
c_form.appendChild(c_replyingText);
c_replyingText = document.getElementById('c_replyingText');

let c_replyInput = document.createElement('input');
c_replyInput.type = 'text'; 
c_replyInput.style.display = 'none';
c_replyInput.id = 'entry.' + s_replyId; 
c_replyInput.name = c_replyInput.id;
c_form.appendChild(c_replyInput);
c_replyInput = document.getElementById('entry.' + s_replyId);

let v_submitted = false;
let c_hiddenIframe = document.createElement('iframe');
c_hiddenIframe.id = 'c_hiddenIframe'; 
c_hiddenIframe.name = 'c_hiddenIframe'; 
c_hiddenIframe.style.display = 'none'; 
c_hiddenIframe.setAttribute('onload', 'if(v_submitted){fixFrame()}');
c_form.appendChild(c_hiddenIframe);
c_hiddenIframe = document.getElementById('c_hiddenIframe');

function fixFrame() {
    v_submitted = false;
    c_hiddenIframe.srcdoc = '';
    getComments();
}

function getComments() {
    c_submitButton.disabled = true; 
    c_replyingText.style.display = 'none';
    c_replyInput.value = '';

    if (s_commentsOpen) {
        if (!ADMIN_STATUS) {
            document.getElementById(`entry.${s_nameId}`).value = '';
            document.getElementById(`entry.${s_websiteId}`).value = '';
            document.getElementById(`entry.${s_textId}`).value = '';
        } else {
            document.getElementById(`entry.${s_websiteId}`).value = '';
            document.getElementById(`entry.${s_textId}`).value = '';
        }
    }

    const url = `https://docs.google.com/spreadsheets/d/${s_sheetId}/gviz/tq?`;
    const retrievedSheet = getSheet(url);

    retrievedSheet.then(result => {
        const json = JSON.parse(result.split('\n')[1].replace(/google.visualization.Query.setResponse\(|\);/g, ''));
        const isPage = col => col.label == 'Page';
        let pageIdx = json.table.cols.findIndex(isPage);

        let comments = [];
        if (json.table.parsedNumHeaders > 0) {
            for (r = 0; r < json.table.rows.length; r++) {
                let val1 = json.table.rows[r].c[pageIdx]?.v || '';
                const normalizePath = p => p.replace(/\/+$/, '').trim().toLowerCase();

                if (normalizePath(val1) === normalizePath(v_pagePath) ||
                    normalizePath(val1).includes(normalizePath(v_pagePath)) ||
                    normalizePath(v_pagePath).includes(normalizePath(val1))) {

                    let comment = {};
                    for (c = 0; c < json.table.cols.length; c++) {
                        let val2 = json.table.rows[r].c[c]?.v || '';
                        comment[json.table.cols[c].label] = val2;
                    }
                    comment.Timestamp2 = json.table.rows[r].c[0].f;
                    comments.push(comment);
                }
            }
        }

        if (!comments.length) c_container.innerHTML = s_noCommentsText;
        else displayComments(comments);
        c_submitButton.disabled = false;

    }).catch(err => {
        console.error('Error fetching comments:', err);
        c_container.innerHTML = 'Unable to load comments.';
        c_submitButton.disabled = false;
    });
}

function getSheet(url) {
    return new Promise(function (resolve, reject) {
        fetch(url).then(response => {
            if (!response.ok) { reject('Could not find Google Sheet with that URL') }
            else {
                response.text().then(data => {
                    if (!data) { reject('Invalid data pulled from sheet') }
                    resolve(data);
                });
            }
        });
    });
}

let a_commentDivs = [];
function displayComments(comments) {
    a_commentDivs = [];
    c_container.innerHTML = '';

    let replies = [];
    for (i = 0; i < comments.length; i++) {
        if (comments[i].Reply) {
            replies.push(comments[i]);
            comments.splice(i, 1);
            i--;
        }
    }

    v_amountOfPages = Math.ceil(comments.length / s_commentsPerPage);
    v_commentMax = s_commentsPerPage * v_pageNum;
    v_commentMin = v_commentMax - s_commentsPerPage;

    comments.reverse();
    for (i = 0; i < comments.length; i++) {
        let comment = createComment(comments[i]);
        let button = document.createElement('button');
        button.innerHTML = s_replyButtonText;
        button.value = comment.id;
        button.setAttribute('onclick', `openReply(this.value)`);
        button.className = 'c-replyButton';
        comment.appendChild(button);

        comment.style.display = 'none';
        if (i >= v_commentMin && i < v_commentMax) { comment.style.display = 'block' }

        comment.className = 'c-comment';
        c_container.appendChild(comment);
        a_commentDivs.push(document.getElementById(comment.id));
    }

    for (i = 0; i < replies.length; i++) {
        let reply = createComment(replies[i]);
        const parentId = replies[i].Reply;
        const parentDiv = document.getElementById(parentId);
        if (!parentDiv) continue;

        let container;
        if (!document.getElementById(parentId + '-replies')) {
            container = document.createElement('div');
            container.id = parentId + '-replies';
            if (s_collapsedReplies) { container.style.display = 'none' }
            container.className = 'c-replyContainer';
            parentDiv.appendChild(container);
        } else container = document.getElementById(parentId + '-replies');

        reply.className = 'c-reply';
        container.appendChild(reply);
    }

    const adminNames = document.querySelectorAll('.c-adminName');
    adminNames.forEach(name => {
        name.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        name.addEventListener('mousemove', e => {
            tooltip.style.left = e.pageX + 12 + 'px';
            tooltip.style.top = e.pageY + 12 + 'px';
        });
        name.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });

    if (s_collapsedReplies) {
        const containers = document.getElementsByClassName('c-replyContainer');
        for (i = 0; i < containers.length; i++) {
            const num = containers[i].childNodes.length;
            const parentDiv = containers[i].parentElement;
            const button = document.createElement('button');
            button.innerHTML = s_expandRepliesText + ` (${num})`;
            button.setAttribute('onclick', `expandReplies(this.parentElement.id)`);
            button.className = 'c-expandButton';
            parentDiv.insertBefore(button, parentDiv.lastChild);
        }
    }

    if (v_amountOfPages > 1) {
        let pagination = document.createElement('div');
        let leftButton = document.createElement('button');
        leftButton.innerHTML = s_leftButtonText;
        leftButton.id = 'c_leftButton'; 
        leftButton.name = 'left';
        leftButton.setAttribute('onclick', `changePage(this.name)`);
        if (v_pageNum == 1) leftButton.disabled = true;
        leftButton.className = 'c-paginationButton';
        pagination.appendChild(leftButton);

        let rightButton = document.createElement('button');
        rightButton.innerHTML = s_rightButtonText;
        rightButton.id = 'c_rightButton'; 
        rightButton.name = 'right';
        rightButton.setAttribute('onclick', `changePage(this.name)`);
        if (v_pageNum == v_amountOfPages) rightButton.disabled = true;
        rightButton.className = 'c-paginationButton';
        pagination.appendChild(rightButton);

        pagination.id = 'c_pagination';
        c_container.appendChild(pagination);
    }
}

function createComment(data) {
    let comment = document.createElement('div');
    let timestamps = convertTimestamp(data.Timestamp);
    let timestamp = s_longTimestamp ? timestamps[0] : timestamps[1];
    const id = data.Name + '|--|' + data.Timestamp2;
    comment.id = id;

    let name;
    let filteredName = data.Name;
    if (s_wordFilterOn) { filteredName = filteredName.replace(v_filteredWords, s_filterReplacement) }
    
    const adminCodeCol = data['Admin Code']; 
    if (filteredName === ADMIN_NAME && adminCodeCol && adminCodeCol.startsWith('ADMIN-')) {
        name = document.createElement('h3');
        name.innerText = filteredName;
        name.className = 'c-adminName';
    } else {
        name = document.createElement('h3');
        name.innerText = filteredName;
        name.className = 'c-name';
    }
    comment.appendChild(name);

    let time = document.createElement('span');
    time.innerText = timestamp;
    time.className = 'c-timestamp';
    comment.appendChild(time);

    if (data.Website) {
        let site = document.createElement('a');
        site.innerText = s_websiteText;
        site.href = data.Website;
        site.className = 'c-site';
        comment.appendChild(site);
    }

    let text = document.createElement('p');
    let filteredText = data.Text;
    if (s_wordFilterOn) { filteredText = filteredText.replace(v_filteredWords, s_filterReplacement) }
    text.innerText = filteredText;
    text.className = 'c-text';
    comment.appendChild(text);

    return comment;
}

function convertTimestamp(timestamp) {
    const vals = timestamp.split('(')[1].split(')')[0].split(',');
    const date = new Date(vals[0], vals[1], vals[2], vals[3], vals[4], vals[5]);
    const timezoneDiff = (s_timezone * 60 + date.getTimezoneOffset()) * -1;
    let offsetDate = new Date(date.getTime() + timezoneDiff * 60 * 1000);
    if (s_daylightSavings) { offsetDate = isDST(offsetDate) }
    return [offsetDate.toLocaleString(), offsetDate.toLocaleDateString()];
}

function isDST(date) {
    const dstStart = [getMonthNum(s_dstStart[0]), getDayNum(s_dstStart[1]), s_dstStart[2], s_dstStart[3]];
    const dstEnd = [getMonthNum(s_dstEnd[0]), getDayNum(s_dstEnd[1]), s_dstEnd[2], s_dstEnd[3]];
    const year = date.getFullYear();
    let startDate = new Date(year, dstStart[0], 1);
    startDate = nthDayOfMonth(dstStart[1], dstStart[2], startDate, dstStart[3]).getTime();
    let endDate = new Date(year, dstEnd[0], 1);
    endDate = nthDayOfMonth(dstEnd[1], dstEnd[2], endDate, dstEnd[3]).getTime();
    let time = date.getTime();
    if (time >= startDate && time < endDate) { date.setHours(date.getHours() - 1) }
    return date;
}

function nthDayOfMonth(day, n, date, hour) {
    var count = 0;
    var idate = new Date(date);
    idate.setDate(1);
    while ((count) < n) {
        idate.setDate(idate.getDate() + 1);
        if (idate.getDay() == day) {
            count++;
        }
    }
    idate.setHours(hour);
    return idate;
}

function getDayNum(day) {
    switch (day.toLowerCase()) {
        case 'sunday': return 0;
        case 'monday': return 1;
        case 'tuesday': return 2;
        case 'wednesday': return 3;
        case 'thursday': return 4;
        case 'friday': return 5;
        case 'saturday': return 6;
        default: return 0;
    }
}

function getMonthNum(month) {
    const m = month.toLowerCase();
    return ['january','february','march','april','may','june','july','august','september','october','november','december'].indexOf(m);
}

const link = document.createElement('a');
link.href = '#c_inputDiv';

function openReply(id) {
    if (c_replyingText.style.display == 'none') {
        c_replyingText.innerHTML = s_replyingText + ` ${id.split('|--|')[0]}...`;
        c_replyInput.value = id;
        c_replyingText.style.display = 'block';
    } else {
        c_replyingText.innerHTML = '';
        c_replyInput.value = '';
        c_replyingText.style.display = 'none';
    }
    link.click();
}

function expandReplies(id) {
    const targetDiv = document.getElementById(`${id}-replies`);
    if (!targetDiv) return;
    targetDiv.style.display = (targetDiv.style.display == 'none') ? 'block' : 'none';
}

function changePage(dir) {
    const leftButton = document.getElementById('c_leftButton');
    const rightButton = document.getElementById('c_rightButton');

    let num = dir === 'left' ? -1 : 1;
    let targetPage = v_pageNum + num;
    if (targetPage > v_amountOfPages || targetPage < 1) return;

    leftButton.disabled = false; rightButton.disabled = false;
    if (targetPage == 1) leftButton.disabled = true;
    if (targetPage == v_amountOfPages) rightButton.disabled = true;

    v_pageNum = targetPage;
    v_commentMax = s_commentsPerPage * v_pageNum;
    v_commentMin = v_commentMax - s_commentsPerPage;
    for (i = 0; i < a_commentDivs.length; i++) {
        a_commentDivs[i].style.display = 'none';
        if (i >= v_commentMin && i < v_commentMax) { a_commentDivs[i].style.display = 'block'; }
    }
}

getComments();

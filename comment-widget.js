/*
    Ayano's Comment Widget - Fixed for t.m.yach
    https://virtualobserver.moe/ayano/comment-widget
*/

const s_stylePath = 'comment-widget-dark.css';
const s_formId = '1FAIpQLSdK-CI3gjpds1gX3T95ICc9O72AUV-adu49dK0urB0jm8lgXw';
const s_nameId = '598454482';
const s_websiteId = '204709470';
const s_textId = '2075272977';
const s_pageId = '132386639';
const s_replyId = '1652598007';
const s_sheetId = '1uC0MYyZH-IwmAZTO9vK2utmaR317uujhiuP3Yk2-An0';

const s_commentsPerPage = 5;
const s_commentsOpen = true;
const s_timezone = -5;
let v_pagePath = window.location.pathname === '/' ? '/' : window.location.pathname;

document.addEventListener('DOMContentLoaded', function() {
    // Load CSS first
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = s_stylePath;
    document.head.appendChild(link);

    // Create widget container
    const widget = document.getElementById('c_widget');
    widget.innerHTML = '<div id="c_container" style="padding: 1rem; max-width: 600px;"></div>';

    if (s_commentsOpen) {
        createForm();
    }
    
    getComments();
});

function createForm() {
    const container = document.getElementById('c_container');
    
    const form = document.createElement('form');
    form.id = s_formId;
    form.method = 'POST';
    form.target = 'c_hiddenIframe';
    form.action = `https://docs.google.com/forms/d/e/${s_formId}/formResponse`;
    form.style.marginBottom = '2rem';
    
    // Hidden page input
    const pageInput = document.createElement('input');
    pageInput.type = 'hidden';
    pageInput.name = `entry.${s_pageId}`;
    pageInput.value = v_pagePath;
    form.appendChild(pageInput);
    
    // Hidden reply input
    const replyInput = document.createElement('input');
    replyInput.type = 'hidden';
    replyInput.name = `entry.${s_replyId}`;
    replyInput.value = '';
    form.appendChild(replyInput);
    
    // Name
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = `entry.${s_nameId}`;
    nameInput.placeholder = 'Your name';
    nameInput.required = true;
    nameInput.maxLength = 16;
    nameInput.style.cssText = 'width:100%; padding:0.5rem; margin:0.25rem 0; border:1px solid #ccc; border-radius:4px;';
    form.appendChild(nameInput);
    
    // Comment textarea
    const textInput = document.createElement('textarea');
    textInput.name = `entry.${s_textId}`;
    textInput.placeholder = 'Write your comment...';
    textInput.required = true;
    textInput.rows = 4;
    textInput.style.cssText = 'width:100%; padding:0.75rem; margin:0.25rem 0; border:1px solid #ccc; border-radius:4px; resize:vertical; font-family:inherit;';
    form.appendChild(textInput);
    
    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Post Comment';
    submitBtn.style.cssText = 'background:#007cba; color:white; border:none; padding:0.75rem 1.5rem; border-radius:4px; cursor:pointer; font-weight:bold;';
    form.appendChild(submitBtn);
    
    // Hidden iframe for form submission
    const iframe = document.createElement('iframe');
    iframe.name = 'c_hiddenIframe';
    iframe.style.display = 'none';
    iframe.onload = function() { setTimeout(getComments, 1000); };
    form.appendChild(iframe);
    
    container.appendChild(form);
}

function getComments() {
    const container = document.getElementById('c_container');
    const url = `https://docs.google.com/spreadsheets/d/${s_sheetId}/gviz/tq?tqx=out:json&sheet=Form%20Responses%201&tq=SELECT%20*`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Sheet access failed');
            return response.text();
        })
        .then(data => {
            try {
                const jsonStart = data.indexOf('google.visualization.Query.setResponse(');
                const jsonEnd = data.lastIndexOf(');');
                const jsonData = data.slice(jsonStart + 31, jsonEnd);
                const json = JSON.parse(jsonData);
                
                displayComments(json.table.rows || []);
            } catch(e) {
                console.error('Parse error:', e);
                container.innerHTML += '<p style="color:#666; font-style:italic;">No comments yet. Be the first to comment!</p>';
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            container.innerHTML += '<p style="color:#666; font-style:italic;">Comments temporarily unavailable.</p>';
        });
}

function displayComments(rows) {
    const container = document.getElementById('c_container');
    let comments = [];
    
    // Find page column index
    const headers = rows[0]?.c || [];
    const pageCol = headers.findIndex(col => col?.v === 'Page');
    
    for (let row of rows.slice(1)) { // Skip header
        if (!row || row.length === 0) continue;
        const pageVal = row[pageCol]?.v || '';
        if (pageVal === v_pagePath) {
            comments.push(row);
        }
    }
    
    if (comments.length === 0) {
        container.innerHTML += '<p style="color:#666; font-style:italic;">No comments yet. Be the first to comment!</p>';
        return;
    }
    
    // Clear form if exists
    const existingForm = container.querySelector('form');
    if (existingForm) existingForm.remove();
    
    comments.forEach((row, index) => {
        const commentDiv = document.createElement('div');
        commentDiv.style.cssText = 'border:1px solid #ddd; border-radius:8px; padding:1rem; margin:1rem 0; background:#f9f9f9;';
        
        const name = row[1]?.v || 'Anonymous';
        const timestamp = row[0]?.v ? new Date(row[0].v).toLocaleDateString() : 'Just now';
        const text = row[3]?.v || '';
        
        commentDiv.innerHTML = `
            <div style="font-weight:bold; color:#007cba; margin-bottom:0.25rem;">${name}</div>
            <div style="color:#666; font-size:0.9em; margin-bottom:0.5rem;">${timestamp}</div>
            <div style="line-height:1.5;">${text}</div>
        `;
        
        container.appendChild(commentDiv);
    });
}

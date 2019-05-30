// ==UserScript==
// @name         AtCoder Submission Status
// @name:en      AtCoder Submission Status
// @namespace    https://github.com/9sako6/atcoder-userscripts
// @version      1.0
// @description  AtCoderで提出した解答がいくつのテストケースでACか, WAか...が一目でわかるように表示する
// @description:en This script shows submission's statuses clearly!
// @author       9sako6
// @match        https://atcoder.jp/contests/*/submissions/*
// @exclude      https://atcoder.jp/contests/*/submissions/me
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @license     MIT
// @supportURL   https://github.com/9sako6/atcoder-userscripts/issues
// ==/UserScript==

function makeTable() {
  'use strict';
  /**
   * count each status
   */
  const statusPanel = document.getElementsByClassName('panel-default')[2];
  const cases = $(statusPanel).find('tr');
  const statusCodes = [];
  let countAll = -1;
  let counter = {};
  // initialize counter
  statusCodes.forEach((val) => {
    counter[val] = 0;
  });
  cases.each((_, elem)=>{
    let texts = $(elem).find('td');
    texts.each((i, tdElem)=>{
      if (i == 1) { // if tdElem is status code
        const statusCode = $($(tdElem).find('span')[0]).text();
        if (!statusCodes.includes(statusCode)){
          statusCodes.push(statusCode);
        }
        (counter[statusCode] === undefined ? counter[statusCode] = 1 : counter[statusCode] += 1);
      }
    });
    countAll += 1;
  });
  statusCodes.sort();

  /**
   * make result table
   */
  // a wrapper element of table
  let wrapElem = document.createElement('div');
  wrapElem.id = 'added-result-panel';
  wrapElem.classList.add('panel', 'panel-default');
  var newContent = document.createTextNode('');
  wrapElem.appendChild(newContent);
  statusPanel.parentNode.insertBefore(wrapElem, statusPanel);

  // make fake table
  // to 
  let trElem = '<div style="width: 100%; display: flex;">';
  const codeNum = statusCodes.length;
  statusCodes.forEach((status, i) => {
    const ACflag = (status === 'AC' ? true : false);
    trElem += `
    <div
      style="
        width: ${100/codeNum}%;
        text-align: center;
        border: 0.1px solid #ddd;
        border-top: 0;
        border-bottom: 0;
        border-right: 0;
        ${i == 0 ? "border-left: 0;" : ""}">
      <div style="
        line-height: 2em;
        border: 0.1px solid #ddd;
        border-top: 0;
        border-right: 0;
        border-left: 0;
        border-bottom: 1;">
      <span
        class="label label-${ACflag ? 'success' : 'warning'}"
        aria-hidden="true"
        data-toggle="tooltip"
        data-placement="top"
        style="text-align: center; line-height: 2em;"
      >${status}</span>
      </div>
      <div style="line-height: 1.8em;">${counter[status]}/${countAll}</div>
    </div>`;
  });
  trElem += '</div>';

  const resultTable = `<div class="table table-bordered table-striped th-center">
  ${trElem}
  </div>`;
  $('#added-result-panel').append(resultTable);
}

(function() {
  try {
    makeTable();
  }catch(e){
    console.error();
  }
})();
// ==UserScript==
// @name         atcoder-submission-status
// @name:en      atcoder-submission-status
// @namespace    https://github.com/9sako6/atcoder-userscripts
// @version      0.3
// @description  AtCoderで提出した解答がいくつのテストケースでACか, WAか...が一目でわかるように表示する
// @description:en This script shows submission's statuses clearly!
// @author       9sako6
// @match        https://atcoder.jp/contests/*/submissions/*
// @exclude      https://atcoder.jp/contests/*/submissions/me
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @license     MIT
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

  // table
  let trElem = '<tr>';
  statusCodes.forEach((status, i) => {
    const ACflag = (status === 'AC' ? true : false);
    const label = `<span
      class="label label-${ACflag ? 'success' : 'warning'}"
      aria-hidden="true"
      data-toggle="tooltip"
      data-placement="top"
      title=""
    >${status}</span>`;

    trElem += `<td style="line-height: 1.2em; text-align: center"><span>${label}</span></td>`;
  });

  trElem += '</tr><tr>';
  statusCodes.forEach((statusCode, i) => {
    trElem += `<td style="line-height: 1.2em; text-align: center">
    <span>${counter[statusCode]}/${countAll}</span></td>`;
  });
  trElem += '</tr>';
  const resultTable = `<table class="table table-bordered table-striped th-center">
  <tbody>${trElem}</tbody>
  </table>`;
  $('#added-result-panel').append(resultTable);
}

(function() {
  try {
    makeTable();
  }catch(e){
    console.error();
  }
})();
// ==UserScript==
// @name         四川大学本科教务系统-标准GPA
// @version      1.1.1
// @description  Temporarily brought Standard GPA back. Also fix the academic menu's jump.
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant        GM_addStyle
// ==/UserScript==


(function() {
    'use strict';

    try{
        learnInfo, showMoreGPA;
    }catch(e){
        return; // if the functions are not defined, return
    }

    var mainStdGpa = 0.0;
    var altStdGpa = 0.0;
    var allStdGpa = 0.0;
    var mainCcGpa = 0.0;
    var allCcGpa = 0.0;
    var altCcGpa = 0.0;

    var isAlt = false;

    const oldLearnInfo = learnInfo;
    learnInfo = function(flag) {
        oldLearnInfo(flag);
        const schemeScorePage = '/student/integratedQuery/scoreQuery/schemeScores/index'
        var fetchReq = fetch(schemeScorePage, {
            method: 'GET',
            credentials: 'same-origin'
        });
        fetchReq.then(res => res.text()).then(html => {
            const matchReg = /\/student\/integratedQuery\/scoreQuery\/[0-9a-zA-Z]{10}\/schemeScores\/callback/g;
            var matchRes = html.match(matchReg);
            if(matchRes === null) {
                return;
            }
            var callback = matchRes[0];
            var fetchReq = fetch(callback, {
                method: 'GET',
                credentials: 'same-origin'
            });
            fetchReq.then(res => res.json()).then(json => {
                var _mainStdGpa = 0.0;
                var _allStdGpa = 0.0;
                var _mainCcGpa = 0.0;
                var _allCcGpa = 0.0;
                var _altStdGpa = 0.0;
                var _altCcGpa = 0.0;

                var mainStdCreditSum = 0.0;
                var allStdCreditSum = 0.0;
                var mainCcCreditSum = 0.0;
                var allCcCreditSum = 0.0;
                var altStdCreditSum = 0.0;
                var altCcCreditSum = 0.0;

                var courseCount = 0;
                for(let i of json['lnList']){
                    for(let j of i['cjList']){
                        courseCount += 1;
                        if(i == json['lnList'][0]){ // 主修，此时计入主修标准学分、全部标准学分
                            mainStdCreditSum += parseFloat(j['credit']);
                            allStdCreditSum += parseFloat(j['credit']);
                            if(j['courseAttributeName'] == '必修'){ // 主修必修，此时额外计入主修必修学分、全部必修学分
                                mainCcCreditSum += parseFloat(j['credit']);
                                allCcCreditSum += parseFloat(j['credit']);
                            }
                        }else{ // 辅修，此时计入全部标准学分、辅修标准学分
                            allStdCreditSum += parseFloat(j['credit']);
                            altStdCreditSum += parseFloat(j['credit']);
                            if(j['courseAttributeName'] == '必修'){ // 辅修必修，此时额外计入全部必修学分、辅修必修学分
                                allCcCreditSum += parseFloat(j['credit']);
                                altCcCreditSum += parseFloat(j['credit']);
                            }
                        }
                    }
                }
                for(let i of json['lnList']){
                    for(let j of i['cjList']){
                        if(i == json['lnList'][0]){ // 主修
                            if(j['courseAttributeName'] == '必修'){ // 主修必修
                                _mainCcGpa += parseFloat(j['credit']) * j['gradePointScore'] / mainCcCreditSum;
                                _allCcGpa += parseFloat(j['credit']) * j['gradePointScore'] / allCcCreditSum;
                            }
                            _mainStdGpa += parseFloat(j['credit']) * j['gradePointScore'] / mainStdCreditSum;
                        }else{ // 辅修
                            if(j['courseAttributeName'] == '必修'){ // 辅修必修
                                _altCcGpa += parseFloat(j['credit']) * j['gradePointScore'] / altCcCreditSum;
                                _allCcGpa += parseFloat(j['credit']) * j['gradePointScore'] / allCcCreditSum;
                            }
                            _altStdGpa += parseFloat(j['credit']) * j['gradePointScore'] / altStdCreditSum;
                        }
                        _allStdGpa += parseFloat(j['credit']) * j['gradePointScore'] / allStdCreditSum;
                    }
                }
                mainStdGpa = _mainStdGpa;
                allStdGpa = _allStdGpa;
                mainCcGpa = _mainCcGpa;
                allCcGpa = _allCcGpa;
                altStdGpa = _altStdGpa;
                altCcGpa = _altCcGpa;
                document.getElementById('gpa').innerText = mainStdGpa.toFixed(2);
                document.getElementById('gpaName').innerText = '主修标准GPA算法';
                document.getElementById('courseNum').innerText = courseCount;
                if(json['lnList'].length > 1){
                    isAlt = true;
                }else{
                    isAlt = false;
                }
            });
        });
    };

    // redefine the function showMoreGPA
    const oldShowMoreGPA = showMoreGPA;
    showMoreGPA = function() {
        const dat = [
            ['主修标准GPA算法', mainStdGpa.toFixed(2), null],
            ['主修必修GPA算法', mainCcGpa.toFixed(2), null],
            ['辅修标准GPA算法', isAlt? altStdGpa.toFixed(2) : "没有辅修成绩！", null],
            ['辅修必修GPA算法', isAlt? altCcGpa.toFixed(2) : "没有辅修成绩！", null],
            ['全部标准GPA算法', allStdGpa.toFixed(2), null],
            ['全部必修GPA算法', allCcGpa.toFixed(2), null]
        ];
        var newNode = document.createElement("dialog");
        newNode.id = "moeMoreGpaPanel";
        var cont = "<div class='modal-header no-padding'>\
                <div class='table-header'>\
                    <button type='button' class='close'>\
                        <span class='white'>×</span>\
                    </button>\
                    GPA成绩\
                </div>\
            </div><div class='modal-body no-padding'>";
        cont += "<table class='table table-bordered table-hover'>";
        cont += "<thead><tr><th>GPA类型</th><th>GPA值</th></tr></thead>";
        cont += "<tbody>";
        for(let v of dat){
            cont += "<tr>";
            cont += "<td>" + v[0] + "</td><td>" + (v[1] == null ? "" : v[1]) + "</td>";
            cont += "</tr>";
        }
        cont += "</tbody>";
        cont += "</table></div>";
        newNode.innerHTML = cont;
        document.body.append(newNode);
        moeMoreGpaPanel.showModal();
        document.querySelector('#moeMoreGpaPanel').style.opacity = 1;
        document.querySelector('#moeMoreGpaPanel').style.transform = "translateY(100%)";
        var panelStyling = `
            #moeMoreGpaPanel {
                top: -130%;
                width: 66%;
                border: 1px solid #ccc;
                padding: 0px;
                opacity: 0;
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            #moeMoreGpaPanel::backdrop {
                background-color: rgba(0, 0, 0, 0.5);
            }
        `
        GM_addStyle(panelStyling);
        document.querySelector('#moeMoreGpaPanel > div > div > button.close').addEventListener("click", ()=>{ 
            // animate the dialog, flew away
            document.querySelector('#moeMoreGpaPanel').style.opacity = 0;
            document.querySelector('#moeMoreGpaPanel').style.transform = "translateY(0%)";
            setTimeout(()=>{document.querySelector('#moeMoreGpaPanel').remove()}, 600);
        });
    };

    // redefine the gotoMenu function, to catch the error
    const oldGotoMenu = gotoMenu;
    gotoMenu = function (menu) {
        try{
            oldGotoMenu(menu);
        }catch(e){
            if(e instanceof TypeError){
                layer.msg('找不到跳转目标');
            }
        }
    };

    // fix the academic menu's jump
    var menu = document.querySelectorAll("li[onclick='toSelect(this);'] > a")
    var lnks = document.querySelectorAll("div.widget-main > div.infobox.studyinfo-width[onclick]")
    for(let i of lnks){
        if(i.innerText.trim().indexOf("已修读课程门数") != -1){
            for(let j of menu){
                if(j.innerText.trim() === '指导性教学计划'){
                    i.onclick = () => {gotoMenu(j.parentNode.id)}
                }
            }
        }
        if(i.innerText.trim().indexOf("尚不及格课程门数") != -1){
            for(let j of menu){
                if(j.innerText.trim() === '不及格成绩'){
                    i.onclick = () => {gotoMenu(j.parentNode.id)}
                }
            }
        }
        if(i.children[0].children[0].className === 'ace-icon fa fa-flask'){
            for(let j of menu){
                if(j.innerText.trim() === '方案完成情况'){
                    i.onclick = () => {gotoMenu(j.parentNode.id)}
                }
            }
        }
    }
    for(let j of menu){
        if(j.innerText.trim() === '本学期课表'){
            document.getElementById("xy_kcms").onclick = () => {gotoMenu(j.parentNode.id)}
        }
    }


}());
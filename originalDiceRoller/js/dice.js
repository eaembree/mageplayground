function rollIt() {
    return Math.floor(Math.random() * 10) + 1;
}
function shakeOut(diff, succCnt, botchCnt) {
    let daResult = 0;
    var threshVal = parseInt(document.getElementById("threshDisp").innerHTML);
    if (diff === 10 && succCnt > 0) {
        daResult = succCnt;
    } else {
        daResult = succCnt - botchCnt;
    }
    if (threshVal > 0) {
        daResult -= threshVal;
        if (daResult < 0) {
            daResult = 0;
        }
    }
    return daResult;
}
function rollDice(dieCnt,diff,tens,botchType) { //integer, integer, boolean, string
    var i,result,resultStr;
    var botchCnt = 0;
    var succCnt = 0;
    var output = [0,0,0,""]; //array of final results: result, ones, successes, string of dice
    for (i=0;i<dieCnt;i++) {
        result = rollIt();
        //add die result to "output"
        if (result >= diff) {
            resultStr = "<strong>" + result + "</strong>";
        } else if (result === 1) {
            resultStr = "<strong class=\"botchdie\">1</strong>";
        } else {
            resultStr = result;
        }
        output[3] += resultStr + " ";
        if (result === 1) {
            botchCnt++;
        } else if (result === 10) {
            succCnt++;
            if (tens === 'reroll') {
                var result2;
                var total = 0;
                do {
                    result2 = rollIt();
                    //add die result to "output"
                    if (result2 >= diff) {
                        resultStr = "<strong>" + result2 + "</strong>";
                    } else {
                        resultStr = result2;
                    }
                    output[3] += resultStr + " ";
                    if (result2 >= diff) {
                        total++;
                    }
                } while (result2 === 10);
                succCnt += total;
            } else if (tens === 'two') {
                succCnt++;
            }
        } else {
            if (result >= diff) {
                succCnt++;
            }
        }
        //add ones & successes to "output"
        output[1] = botchCnt;
        output[2] = succCnt;
    }
    if (botchType === "revised") {
        if (succCnt === 0) {
            if (botchCnt === 0) {
                //the result value of "output" is already zero so do nothing
            } else {
                output[0] = botchCnt * -1;
            }
        } else {
            output[0] = shakeOut(diff, succCnt, botchCnt);
        }
    } else { //botchType is standard or none
        output[0] = shakeOut(diff, succCnt, botchCnt);
    }
    if (botchType === "none") {
        if (output[0] < 0) {
            output[0] = 0;
        }
    }
    return output;
}
function prepRoll(dieCnt) {
    var diff = parseInt(document.getElementById("diffDisp").innerHTML);
    var tens = $('input[name=do10]:checked').val();
    var botchy = $('input[name=botch]:checked').val();
    var final = rollDice(dieCnt,diff,tens,botchy);
    var finalString = "";
    if (botchy == "revised") {
        if (!final[2] && final[1]) {
            finalString = "Botch";
            if (final[1] > 1) {
                finalString += " x" + final[1];
            }
        } else if (final[0] > 0) {
            finalString = "Success";
        } else {
            finalString = "Fail";
        }
    } else if (botchy == "standard") {
        if (final[0] > 0) {
            finalString = "Success";
        } else if (final[0] < 0) {
            finalString = "Botch";
        } else {
            finalString = "Fail";
        }
    } else {
        if (final[0] > 0) {
            finalString = "Success";
        } else {
            finalString = "Fail";
        }
    }
    var diceList = final[3].trim();
    document.getElementById("resultDisp").innerHTML = final[0];
    document.getElementById("resultMsg").innerHTML = finalString;
    document.getElementById("successDisp").innerHTML = final[2];
    document.getElementById("onesDisp").innerHTML = final[1];
    document.getElementById("diceDisp").innerHTML = diceList;
    var histTable = $("#tableRows");
    //remove last row of table
    if (histTable.children().length > 9) {
        histTable.children().last().remove();
    }
    //add row to top of table
    var tr = $('<tr></tr>');
    tr.html('<td>' + finalString + '</td><td>' + final[0] + '</td><td>' + final[2] + '</td><td>' + final[1] + '</td><td>' + document.getElementById("diffDisp").innerHTML + '</td><td>' + dieCnt + '</td>');
    histTable.prepend(tr);
}
$(".dieRoll").click(function () {
    prepRoll(this.value);
});
$("#rollMany").click(function () {
    prepRoll(document.getElementById("lotDice").value);
});
//buttons for changing difficulty
function setDiff(modifier) { //2-10
    var diffNum = document.getElementById("diffDisp");
    var diffVal = parseInt(diffNum.innerHTML);
    if (modifier === "up") {
        if (diffVal < 10) {
            diffNum.innerHTML = diffVal + 1;
        }
    } else if (modifier === "down") {
        if (diffVal > 2) {
            diffNum.innerHTML = diffVal - 1;
        }
    }
}
$("#diffUp").click(function () {
    setDiff("up");
});
$("#diffDown").click(function () {
    setDiff("down");
});
//buttons for changing threshold
function setThresh(modifier) { //0-5
    var threshNum = document.getElementById("threshDisp");
    var threshVal = parseInt(threshNum.innerHTML);
    if (modifier === "up") {
        if (threshVal < 5) {
            threshNum.innerHTML = threshVal + 1;
        }
    } else if (modifier === "down") {
        if (threshVal > 0) {
            threshNum.innerHTML = threshVal - 1;
        }
    }
}
$("#threshUp").click(function () {
    setThresh("up");
});
$("#threshDown").click(function () {
    setThresh("down");
});
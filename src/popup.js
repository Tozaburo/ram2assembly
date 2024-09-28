document.getElementById("convert").onclick = (e) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: convert
        });
    });
}

function convert() {
    function openProgram(e, programEdit) {
        e.style.overflow = "initial"
        e.innerHTML = '<form action="javascript:programSubmit()"><textarea id="pForm" rows="32" cols="25" style="padding:0; border:0; font-size:10px;" spellcheck="false">' + programEdit + '</textarea><input type="submit" value="Submit" style="color:red;font-weight:bold;margin:5px"><input onclick="programCancel()" type="submit" value="Cancel" style="color:red;font-weight:bold;margin:5px"></form>'
        document.getElementById("pForm").focus();
    }

    function trimArray(arr) {
        let lastIndex = arr.length;

        // 配列を逆から走査して最初に `000` でない要素を見つける
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] !== '000') {
                lastIndex = i + 1;
                break;
            }
        }

        // 最後の `000` 以外の要素までの配列を切り出す
        return arr.slice(0, lastIndex);
    }

    function download_txt(file_name, data) {

        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = file_name;
        a.href = url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

    }


    let rams = [];

    for (let i = 0; i <= 99; i++) {
        let elementId = "a" + i;
        let element = document.getElementById(elementId);
        if (element) {
            rams.push(element.textContent.trim());
        }
    }

    rams = trimArray(rams);
    console.log(rams);

    let code = "";
    rams.forEach((ram) => {
        let instruction = ram[0];
        let register = ram.substring(1);

        switch (instruction) {
            case "0":
                if (register === "00") {
                    code += "HLT ";
                } else {
                    code += "DAT " + register;
                }
                break;
            case "1":
                code += "ADD " + register;
                break;
            case "2":
                code += "SUB " + register;
                break;
            case "3":
                code += "STA " + register;
                break;
            case "5":
                code += "LDA " + register;
                break;
            case "6":
                code += "BRA " + register;
                break;
            case "7":
                code += "BRZ " + register;
                break;
            case "8":
                code += "BRP " + register;
                break;
            case "9":
                switch (register) {
                    case "01":
                        code += "INP"
                        break;
                    case "02":
                        code += "OUT"
                        break;
                    case "22":
                        code += "OTC"
                        break;
                }
        }
        code += "\n"
    })
    openProgram(document.getElementById("program"), code);
    download_txt("assemble.txt", code);
}
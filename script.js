let intervalId;
let empire_index = 0;
const INTERVAL = 100
const DEFAULT_MEMBERS = [
    "ユーザー１",
    "ユーザー２",
    "ユーザー３",
    "ユーザー４",
    "Empire",
];
const COLORS = [
    'list-group-item-primary',
    'list-group-item-success',
    'list-group-item-warning',
    'list-group-item-danger',
    'list-group-item-info',
    'list-group-item-light'
];

const BTN_START_CLASS = "btn-primary";
const BTN_STOP_CLASS = "btn-danger";

/** docuemtn.querySelectorの短縮形 */
const dqs = selector => {
    return document.querySelector(selector);
};

/** documebnt.querySelectorAllの短縮形 */
const dqa = selector => {
    return document.querySelectorAll(selector);
};

let ol_members;
document.addEventListener("DOMContentLoaded", () => {
    ol_members = dqs("#ol_members");
    // 画面描画時
    if (DEFAULT_MEMBERS.length > 0) {
        // 初期メンバー設定
        let txt_names = dqs("#txt_names");
        for (let i = 0; i < DEFAULT_MEMBERS.length; i++) {
            txt_names.value += DEFAULT_MEMBERS[i] + "\n";
        }

    }
    dqs("#btn_start").addEventListener("click", (e) => {
        // スタートボタン押下時
        let member_list = getMemberList();
        if (member_list.length <= 1) {
            alert("メンバーは2人以上設定してください")
            return;
        }
        if (!intervalId) {
            // タイマー未起動時
            startRanking();
        } else {
            // タイマー起動時
            stopRanking();
        }
    });

    dqs("#btn_clear").addEventListener("click", () => {
        // クリアボタン
        if (!intervalId) {
            // タイマー起動中は表示されないが
            // 仮に押せたとしても動かないように
            txt_names.value = "";
            ol_members.innerHTML = "";
        }
    });
});

function startRanking() {
    console.log("Interval Start");
    change_start_btn(true);
    change_clear_btn_visibility(false);
    // タイマー起動
    intervalId = setInterval(create_ol, INTERVAL);
}

function stopRanking() {
    console.log("Interval Stopped");
    change_start_btn(false);
    change_clear_btn_visibility(true);
    // タイマー停止
    clearInterval(intervalId);
    intervalId = null;
    let li_members = dqa(".list-group-item");
    console.log(empire_index);
    let empireNode = li_members[empire_index]

    if (dqs("#chk_empire_top").checked && empire_index != 0) {
        // 一人はEmpireのために、みんなはEmpireのために
        // One for Empire, all for Empire
        let topNode = li_members[0];
        topNode = ol_members.replaceChild(empireNode, topNode);
        ol_members.appendChild(topNode);
    }
    if (dqs("#chk_empire_all").checked) {
        // EmpireのEmpireによるEmpireのための政治
        // government of the Empire, by the Empire, for the Empire
        ol_members.innerHTML = ""
        for (let i = 0; i < li_members.length; i++) {
            ol_members.appendChild(create_li("Empire", COLORS[i]));
        }
    }
}

/**
 * 配列番号をランダムシャッフルする
 * @param {Array} index_list ArrayIndexのリスト
 * @returns ランダムシャッフルしたArrayIndexのリスト
 */
const list_random = index_list => {
    let len = index_list.length;
    while (len) {
        let j = Math.floor(Math.random() * len);
        let t = index_list[--len];
        index_list[len] = index_list[j];
        index_list[j] = t;

    }
    return index_list;
}

/**
 * olの内容を作成する
 */
function create_ol() {
    let member_list = getMemberList();
    let range = Array.from(Array(member_list.length)).map((v, i) => i);
    ol_members.innerHTML = "";
    let i = 0;
    let index_list = list_random(range);
    for (i; i < index_list.length; i++) {
        let index = index_list[i];
        let member = member_list[index];
        if (member == "Empire") {
            empire_index = i;
        }
        let color = COLORS[index];

        let li_member = create_li(member, color);
        ol_members.appendChild(li_member)
    }
}

/**
 * liのエレメントを作成する
 * @param {string} member メンバー名
 * @param {string} color 色クラス
 * @returns li Element
 */
function create_li(member, color) {
    let li_member = document.createElement("li");
    li_member.classList.add("list-group-item")
    li_member.classList.add(color);
    li_member.innerText = member;
    return li_member;
}

/**
 * textareaからメンバーを取得しリストで返す
 * @returns List of members
 */
function getMemberList() {
    let member = dqs("#txt_names").value.trim();
    let member_list = member.split(/\n/);
    return member_list;
}

function change_clear_btn_visibility(visibility) {

    let btn_clear = dqs("#btn_clear");
    if (visibility) {
        btn_clear.classList.remove("invisible");
        btn_clear.classList.add("visible");
    } else {
        btn_clear.classList.remove("visible");
        btn_clear.classList.add("invisible");
    }
}


function change_start_btn(isStart) {
    let btn_start = dqs("#btn_start");
    if (isStart) {
        btn_start.classList.remove(BTN_START_CLASS);
        btn_start.classList.add(BTN_STOP_CLASS);
        btn_start.innerText = "Stop";
    } else {
        btn_start.classList.remove(BTN_STOP_CLASS);
        btn_start.classList.add(BTN_START_CLASS);
        btn_start.innerText = "Start";
    }
}

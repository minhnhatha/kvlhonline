let StartTime = 0, current_player = 1, current_question = 1, player_list = [], audio = null, durability = 60000;
let link_media = "./media/60_cnt.mp3", type_over = 'time_up', Tm, root_media = "./media/";

socket.emit("get_options");

socket.on('options', data => {
    // Handle the received options
    console.log("?" + data.olympia_soundtrack);
    if (data.olympia_soundtrack) root_media = "./olympia_media/";
    //socket.emit("get_options");
});
//-----------------------------Khởi động & chung------------------------------

function SetPlayer(number){
    if (player_list.length === 0){
        current_player = number;
        socket.emit('get_player_list');
    }
    else{
        current_player = number;
        let k = "play-" + number;
        // document.getElementById("play-1").classList.remove("playing");
        // document.getElementById("play-2").classList.remove("playing");
        // document.getElementById("play-3").classList.remove("playing");
        // document.getElementById("play-4").classList.remove("playing");
        for (let i = 0; i < player_list.length; i++){
            document.getElementById("play-" + (i + 1)).classList.remove("playing");
        }
        document.getElementById(k).classList.add("playing");
        // document.getElementById("gs-field").style.display = 'none';
        // document.getElementById("run_vedich").classList.add("disabled");
        // document.getElementById("run_vedich").classList.add("disabled");
    }
}
socket.on('game_start', data => { //Lấy list player từ host
    player_list = data.player_list;
    let k = "play-" + current_player;
    for (let i = 0; i < player_list.length; i++){
        document.getElementById("play-" + (i + 1)).classList.remove("playing");
    }
    document.getElementById(k).classList.add("playing");
    // document.getElementById("gs-field").style.display = 'none';
    // document.getElementById("run_vedich").classList.add("disabled")
});
function Start(){
    if (player_list.length === 0) alert("Cần chọn người tham gia!");
    else socket.emit('playing_khoidong', {
        player_playing: current_player,
        // player_playing_id: player_list[current_player - 1][1],
        // number_of_players: player_list.length
    });
}

socket.on("full_khoidong_question", data =>{
    alert("Đã hết câu hỏi Khởi động!")
});

socket.on("full_vedich_question", data =>{
    alert("Đã hết câu hỏi của gói Về đích này!")
});

socket.on('khoidong', data => {
    durability = 60000;
    link_media = root_media + "60_cnt.mp3";
    current_question = 1;
    type_over = 'time_up';
    document.getElementById("run_khoidong").classList.add("disabled");
    document.getElementById("question-box").innerText = data.first_question["noiDungA"];
    document.getElementById("answer-box").innerText = data.first_question["noiDungB"];
    document.getElementsByClassName("gs-score")[0].innerText = data.player_score;
    document.getElementById("tick").classList.remove("disabled");
    document.getElementById("cross").classList.remove("disabled");
    document.getElementById("blank").classList.remove("disabled");
    Countdown();
});
function Countdown(){
    StartTime = Date.now()
    audio = new Audio(link_media);
    audio.play().catch(err => console.error(err));
    audio.addEventListener('playing', () => {Play();});
}
function Play(){
    Tm = durability - Date.now() + StartTime;
    document.getElementById("showtime").innerText = parseInt(Tm / 1000) + 1;
    if (Tm > 0) requestAnimationFrame(Play);
    else {
        document.getElementById("showtime").innerText = "0";
        socket.emit(type_over);
    }
}

socket.on('answer_correct', data => {
    document.getElementById("score-" + data.player_playing).innerText = "(" + data.play_score + ")";
    document.getElementsByClassName("gs-score")[0].innerText = data.play_score;
});

function Correct(){
    let play_circle = "qu-" + current_question;
    document.getElementById(play_circle).style.background = "lime";
    current_question += 1;
    socket.emit('correct_answer');
    // {
    //     player_playing: player_list[current_player - 1][1],
    //     question_number: current_question - 2
    // }
}
function Wrong(){
    let play_circle = "qu-" + current_question;
    document.getElementById(play_circle).style.background = "red";
    current_question += 1;
    socket.emit('wrong_answer');
    //  {
    //     player_playing: player_list[current_player - 1][1],
    //     question_number: current_question - 2
    // }
}

function Skip(){
    current_question += 1;
    socket.emit('skip_answer');
}
socket.on('next_question', data => {
    document.getElementById("question-box").innerText = data.next_question["noiDungA"];
    document.getElementById("answer-box").innerText = data.next_question["noiDungB"];
});
socket.on('game_over', () => {
    type_over = 'blank';
    document.getElementById("tick").classList.add("disabled");
    document.getElementById("cross").classList.add("disabled");
    document.getElementById("blank").classList.add("disabled");
    document.getElementById("run_khoidong").classList.remove("disabled");
    if (Tm > 5000){
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio = null;
    }
    current_question = 1;
    for (let i = 1; i<=10; i++){
        document.getElementById("qu-" + i).style.background = "white";
    }
    document.getElementById("question-box").innerText = "";
    document.getElementById("answer-box").innerText = "";
    document.getElementsByClassName("gs-score")[0].innerText = "0";
    if (current_player < player_list.length && current_player > 0) SetPlayer(current_player + 1);
    else SetPlayer(1);
});

socket.on('bonus', () => {
    let audio2 = new Audio("./media/bonus.mp3");
    audio2.play().catch(err => console.error(err));
});


//-----------------------------Thử thách------------------------------


function ChangeModeThuThach(){
    if (audio){
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio = null;
    }
    document.getElementsByClassName("gs-circles")[0].style.display = "none";
    document.getElementById("question-box").innerText = "";
    document.getElementById("answer-box").style.display = "none";
    document.getElementById("answer-box").innerText = "";
    document.getElementsByClassName("gs-score")[0].innerText = "";
    document.getElementById("showtime").innerText = "";
    document.getElementsByClassName("gs-mode")[0].innerText = "Thử thách";

    document.getElementById("combine_buttons").innerHTML=`
        <div id="thuthach_buttons" style="display: flex; gap: 10px;">
            <button id="cross_thuthach" class="btn btn-danger disabled" onclick="ThuThachWrong()" style="display: flex;">Sai chủ đề</button>
            <button id="tick_thuthach" class="btn btn-success disabled" onclick="ThuThachCorrect()" style="display: flex;">Đúng chủ đề</button>
            <button id="run_thuthach" class="btn btn-secondary disabled" onclick="RunThuThach()" style="display: flex; margin-left: 12vw;">Bấm giờ</button>
            <button id="show_thuthach" class="btn btn-primary disabled" onclick="ShowPlayerAnswerThuThach()" style="display: flex;">Hiện đáp án</button>
            <button id="change_md" class="btn btn-warning" onclick="ChangeModeDongHanh()" style="display: flex;">Phần thi Đồng hành</button>
        </div>
    `;

    type_over = 'blank';

    SetPlayer(1);
    socket.emit('change_mode_thuthach');
}

socket.on('thuthach_standby', data =>{
    for (let i = 0; i < player_list.length; i++){
        document.getElementById("play-" + (i + 1)).classList.add("playing");
    }
    let k = `
        <div class="row" id="rcw-0">
            <div class="col-1"><button onclick="ShowAnswerThuThach(0)">Show</button></div>
            <div class="col-1"><button>${data.crossword[0]} ${data.x}</button></div>
            <div class="col-8">
                <div class="gs-circles">
    `;
    for (let i = 0; i < data.crossword[0]; i++){
        k += `<div class="circle" id="cw-0${i}" style="background: #BF0001;"></div>`;
    }
    k += `</div></div></div>`
    for (let i = 1; i < 5; i++){
        k += `
            <div class="row" id="rcw-${i}">
                <div class="col-1"><button onclick="ShowAnswerThuThach(${i})">Show</button></div>
                <div class="col-1"><button onclick="ShowQuestionThuThach(${i})">${i}</button></div>
                <div class="col-8">
                    <div class="gs-circles">
        `;
        for (let j = 0; j < data.crossword[i]; j++){
            k += `<div class="circle" id="cw-${i}${j}" style="background: white;"></div>`;
        }
        k += `</div></div></div>`;
    }
    document.getElementById("gs-crossword").innerHTML = k;
});
function ShowQuestionThuThach(i){
    socket.emit('get_question_thuthach', {question_number: i});
}

socket.on('question_thuthach_getted', data =>{
    document.getElementById("run_thuthach").classList.remove("disabled");
    document.getElementById("question-box").innerText = `(${data.cross} ${data.x}) ${data.question}`;
    // document.getElementById("question-box").innerText = i["noiDungA"];
    // document.getElementById("answer-box").innerText = i["noiDungB"];
    if (data.play_media !== ''){
        if (data.play_media[data.play_media.length - 1] === '3'){
            let audio3 = new Audio(data.play_media);
            audio3.play().catch(err => console.error(err));
        }
        else if (data.play_media[data.play_media.length - 1] === '4'){
            document.getElementsByClassName('gs-container')[0].style.display = 'none';
            document.getElementById("gs-crossword").style.display = 'none';
            // let k = Math.min(window.innerWidth, window.innerHeight) * 0.8;
            document.getElementById("gs-video").innerHTML = `
                <video id="video_player" width="70%" autoplay>
                    <source src="${data.play_media}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
            document.getElementById("video_player").addEventListener("ended", ()=>{
                document.getElementById("gs-crossword").style.display = '';
                document.getElementsByClassName('gs-container')[0].style.display = '';
                document.getElementById("gs-video").innerText ='';
            });
        }
    }
    for (let i = 0; i<data.cross; i++){
        document.getElementById("cw-" + data.question_number + i).style.background = "#F16201";
    }
});

function RunThuThach(){
    // document.getElementById("show_thuthach").classList.add("disabled");
    document.getElementById("run_thuthach").classList.add("disabled");
    durability = 15000;
    link_media = (root_media == "./media/" ? root_media + "15_cnt.mp3" : root_media + "15_thuthach_cnt.mp3");
    type_over = 'time_up_thuthach';
    socket.emit('run_thuthach');
    Countdown();
}

socket.on('answer_submitted_thuthach', data =>{
    socket.emit('answer_timed_thuthach', {id: data.id, time: Date.now() - StartTime - 2});
});

socket.on('time_up_thuthach_host', data =>{
    document.getElementById("show_thuthach").classList.remove("disabled");
});

function ShowPlayerAnswerThuThach(){
    socket.emit('show_player_answer_thuthach');
}

function UnshowPlayerAnswerThuThach(){
    document.getElementById("gs-crossword").style.display = "";
    document.getElementById("gs-answers").style.display = "none";
    document.getElementById("gs-answers").innerHTML = "";
    document.getElementById("run_thuthach").innerText = "Bấm giờ";
    document.getElementById("run_thuthach").onclick = RunThuThach;
    document.getElementById("run_thuthach").classList.remove("disabled");
    document.getElementById("show_thuthach").innerText = "Hiện đáp án";
    document.getElementById("show_thuthach").onclick = ShowPlayerAnswerThuThach;
    document.getElementById("show_thuthach").classList.add("disabled");
    document.getElementById("answer-box").style.display = "none";
    socket.emit('unshow_player_answer_thuthach');
}

socket.on('unshow_player_answer_thuthach_host', data =>{
    document.getElementById("question-box").innerHTML = `<span style="color:yellow;">Đáp án chủ đề:${data.ans}</span>`;
});


function CheckAnswerThuThach(){
    document.getElementById("run_thuthach").classList.add("disabled");
    socket.emit('check_answer_thuthach');
}

socket.on('show_player_answer_thuthach_host', data =>{
    document.getElementById("gs-crossword").style.display = "none";
    let k = `
        <div class="name-badge">${data.answer_list[0][0]}</div>
        
        <div class="status-bar">
            <div class="status-segment-1">${data.answer_list[0][2]}</div>
            <div class="status-segment-2">${data.answer_list[0][1]}</div>
        </div>
    `;
    for (let i = 1; i < data.answer_list.length; i++){
        k += `
            <br>
            <div class="name-badge">${data.answer_list[i][0]}</div>
            <div class="status-bar">
                <div class="status-segment-1">${data.answer_list[i][2]}</div>
                <div class="status-segment-2">${data.answer_list[i][1]}</div>
            </div>
        `;
    }
    document.getElementById("gs-answers").innerHTML = k;
    document.getElementById("gs-answers").style.display = "";
    document.getElementById("run_thuthach").innerText = "Kiểm tra";
    document.getElementById("run_thuthach").onclick = CheckAnswerThuThach;
    document.getElementById("run_thuthach").classList.remove("disabled");
    document.getElementById("show_thuthach").innerText = "Ẩn đáp án";
    document.getElementById("show_thuthach").onclick = UnshowPlayerAnswerThuThach;
    document.getElementById("question-box").innerHTML += `<br><span style="color:yellow;">Đáp án hàng ngang:${data.ans}</span>`;
    // document.getElementById("answer-box").style.display = "";
    // document.getElementById("answer-box").innerHTML = data.ans;
});

socket.on('check_answer_thuthach_host', data =>{
    let name_arr = document.getElementsByClassName("name-badge");
    let status_arr = document.getElementsByClassName("status-bar");
    for (let i = 0; i<name_arr.length; ++i){
        if (!data.answer_state[i]){
            name_arr[i].style.color = "#81A0A9";
            status_arr[i].style.color = "#697C9E";
        }
        else{
            status_arr[i].innerHTML += `<div class="status-segment-3">${data.answer_state[i]}</div>`;
        }
        document.getElementById("score-" + (i + 1)).innerText = "(" + data.new_score[i] + ")";
    }
    if (data.answer === ""){
        for (let i = 0; i<data.cross_length; i++){
            document.getElementById("cw-" + data.question_number + i).style.background = "#595959";
        }
    }
    else{
        for (let i = 0; i<data.cross_length; i++){
            let ch = document.getElementById("cw-" + data.question_number + i);
            ch.style.background = "#026FC4";
            ch.innerText = data.answer[i];
        }
    }
});

socket.on('player_clicked_bell_thuthach', data=>{
    document.getElementById("play-" + data.player_playing).classList.add("activated");
    document.getElementById("play-" + data.player_playing).classList.remove("playing");
    document.getElementById("name-" + data.player_playing).innerText = "" + data.turn_number + " - " + data.player_name;
    document.getElementById("tick_thuthach").classList.remove("disabled");
    document.getElementById("cross_thuthach").classList.remove("disabled");
    let audio_bell = new Audio(root_media + (root_media != "./media/" ? "thuthach_" : "") + "bell" + ".mp3");
    audio_bell.play().catch(err => console.error(err));
});

function ThuThachCorrect(){
    socket.emit('thuthach_correct_answer');
}
function ThuThachWrong(){
    socket.emit('thuthach_wrong_answer');
}

socket.on('no_bell_thuthach', data =>{
    document.getElementById("tick_thuthach").classList.add("disabled");
    document.getElementById("cross_thuthach").classList.add("disabled");
});

socket.on('thuthach_correct_answer_host', data =>{
    for (let i = 0; i<data.cross_length; ++i){
        let ch = document.getElementById("cw-0" + i);
        ch.style.background = "#026FC4";
        ch.innerText = data.answer[i];
    }
    document.getElementById("score-" + data.player_playing).innerText = "(" + data.player_score + ")";
    for (let i = 1 ; i<=data.number_of_players; ++i){
        document.getElementById("name-" + i).innerText = data.list_of_player_names[i - 1];
        document.getElementById("play-" + i).classList.remove("activated");
        document.getElementById("play-" + i).classList.remove("playing");
    }
});

socket.on('thuthach_wrong_answer_host', data =>{
    document.getElementById("name-" + data.player_playing).innerText = data.player_name;
    document.getElementById("play-" + data.player_playing).classList.remove("activated");
});

//-----------------------------Đồng hành------------------------------


function ChangeModeDongHanh(){
    if (audio){
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio = null;
    }
    document.getElementsByClassName("gs-circles")[0].style.display = "none";
    document.getElementById("question-box").innerText = "";
    document.getElementById("answer-box").innerText = "";
    document.getElementById("answer-box").style.display = "";
    document.getElementsByClassName("gs-score")[0].innerText = "";
    document.getElementById("showtime").innerText = "";
    document.getElementsByClassName("gs-mode")[0].innerText = "Đồng hành";
    document.getElementById("gs-crossword").innerHTML = "";
    document.getElementById("gs-answers").innerHTML = "";
    document.getElementById("combine_buttons").innerHTML=`
        <div id="donghanh_buttons" style="display: flex; gap: 10px;">
            <div id = "nut_dungsai_donghanh" style="display: flex;">
                <button id="cross_donghanh" class="btn btn-danger disabled" onclick="DongHanhWrong()" style="display: flex;">Sai</button>
                <button id="tick_donghanh" class="btn btn-success disabled" onclick="DongHanhCorrect()" style="display: flex;">Đúng</button>
            </div>
            <button id="run_donghanh" class="btn btn-secondary disabled" onclick="RunDongHanh()" style="display: flex; margin-left: 12vw;">Bấm giờ</button>
            <button id="start_donghanh" class="btn btn-info" onclick="DongHanhStart()" style="display: flex;">Bắt đầu phần thi</button>
            <button id="change_md" class="btn btn-warning" onclick="ChangeModeVeDich()" style="display: flex;">Phần thi Về đích</button>

        </div>
    `;
    socket.emit('change_mode_donghanh');
}
socket.on("change_mode_donghanh_host", data=>{
    for (let i = 0; i < data.number_of_players; i++){
        document.getElementById("play-" + (i + 1)).classList.remove("playing");
        document.getElementById("play-" + (i + 1)).classList.remove("activated");
    }
    SetPlayer(1);
});

function DongHanhStart(){
    // console.log(current_player);
    if (player_list.length === 0) alert("Cần chọn người tham gia!");
    else socket.emit('get_question_donghanh', {
        player_playing: current_player,
        // player_playing_id: player_list[current_player - 1][1],
        // number_of_players: player_list.length
    });
}

socket.on('get_question_donghanh_host', data =>{
    document.getElementById("question-box").innerText = data.first_question;
    document.getElementsByClassName("gs-score")[0].innerText = data.player_score;
    // document.getElementById("tick_donghanh").classList.remove("disabled");
    // document.getElementById("cross_donghanh").classList.remove("disabled");
    document.getElementById("run_donghanh").classList.remove("disabled");
});

function RunDongHanh(){
    document.getElementById("run_donghanh").classList.add("disabled");
    durability = 10000;
    link_media = root_media + "10_cnt.mp3";
    type_over = 'time_up_donghanh';
    socket.emit('run_donghanh');
    Countdown();
}

socket.on('answer_submitted_donghanh', data =>{
    socket.emit('answer_timed_donghanh', {time: Date.now() - StartTime - 2});
});


socket.on("time_up_donghanh_host", data => {
    document.getElementById("question-box").style.textAlign = "center";
    document.getElementById("question-box").innerHTML = `
        <p>TRẢ LỜI:</p><span>${data.player_answer}</span>
    `;
    document.getElementById("answer-box").innerText = data.actual_answer;
    document.getElementById("cross_donghanh").classList.remove("disabled");
    document.getElementById("tick_donghanh").classList.remove("disabled");
})

function DongHanhCorrect(){
    socket.emit("correct_answer_donghanh");
}

function DongHanhWrong(){
    socket.emit("wrong_answer_donghanh");
}

socket.on("correct_answer_donghanh_host", data => {
    document.getElementById("score-" + data.player_playing).innerText = "(" + data.player_score + ")";
    document.getElementsByClassName("gs-score")[0].innerText = data.player_score;
    document.getElementById("question-box").innerText = "";
    document.getElementById("answer-box").innerText = "";
    document.getElementById("nut_dungsai_donghanh").innerHTML = `
        <button id="next_donghanh" class="btn btn-success" onclick="NextQuestionDongHanh()" style="display: flex;">
        Câu hỏi tiếp theo</button>
    `;
});

socket.on("wrong_answer_donghanh_host", data => {
    document.getElementById("question-box").innerText = "";
    document.getElementById("answer-box").innerText = "";
    document.getElementById("nut_dungsai_donghanh").innerHTML = `
        <button id="next_donghanh" class="btn btn-success" onclick="NextQuestionDongHanh()" style="display: flex;">
        Câu hỏi tiếp theo</button>
    `;
});

function NextQuestionDongHanh(){
    socket.emit("next_question_donghanh");
}

socket.on('next_question_donghanh_host', data =>{
    document.getElementById("question-box").style.textAlign = "left";
    document.getElementById("run_donghanh").classList.remove("disabled");
    document.getElementById("question-box").innerText = data.next_question;
    document.getElementById("nut_dungsai_donghanh").innerHTML = `
        <button id="cross_donghanh" class="btn btn-danger disabled" onclick="DongHanhWrong()" style="display: flex;">Sai</button>
        <button id="tick_donghanh" class="btn btn-success disabled" onclick="DongHanhCorrect()" style="display: flex;">Đúng</button>
    `;
});

//-----------------------------Về đích------------------------------


function ChangeModeVeDich(){
    if (audio){
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio = null;
    }
    document.getElementsByClassName("gs-circles")[0].style.display = "none";
    document.getElementById("question-box").innerText = "";
    document.getElementById("answer-box").innerText = "";
    document.getElementsByClassName("gs-score")[0].innerText = "";
    document.getElementById("showtime").innerText = "";
    document.getElementsByClassName("gs-mode")[0].innerText = "Về đích";
    document.getElementById("question-box").style.textAlign = "left";

    document.getElementById("combine_buttons").innerHTML=`
        <div id="vedich_buttons" style="display: flex; gap: 10px;">
            <div id="nut_dung_sai" style="display: flex;">
                <button id="cross_vedich" class="btn btn-danger disabled" onclick="VeDichWrong()" style="display: flex;">Sai</button>
                <button id="tick_vedich" class="btn btn-success disabled" onclick="VeDichCorrect()" style="display: flex;">Đúng</button>
            </div>
            <button id="run_vedich" class="btn btn-secondary disabled" onclick="RunVeDich()" style="display: flex; margin-left: 12vw;">Bấm giờ</button>
            <button id="start_vedich" class="btn btn-info" onclick="VeDichStart()" style="display: flex;">Bắt đầu phần thi</button>
        </div>
    `;
    // document.getElementById("tick_vedich").classList.remove("disabled");
    // document.getElementById("change_md").classList.add("disabled");
    // document.getElementById("change_md").style.display = 'none';

    // document.getElementById("gs-field").style.display = "flex";

    type_over = 'blank';
    
    for (let i = 0; i < player_list.length; i++){
        document.getElementById("play-" + (i + 1)).classList.remove("playing");
    }
    SetPlayer(1);
    socket.emit('change_mode_vedich');
}

function VeDichStart(){
    if (player_list.length === 0) alert("Cần chọn người tham gia!");
    else{
        document.getElementById('gs-field').style.display = 'flex';
        socket.emit('playing_vedich', {
            player_playing: current_player,
            // player_playing_id: player_list[current_player - 1][1],
            // number_of_players: player_list.length
        });
    }
}

socket.on('vedich', data =>{
    document.getElementById("nut_dung_sai").innerHTML = `
        <button id="cross_vedich" class="btn btn-danger disabled" onclick="VeDichWrong()" style="display: flex;">Sai</button>
        <button id="tick_vedich" class="btn btn-success disabled" onclick="VeDichCorrect()" style="display: flex;">Đúng</button>
    `;
    document.getElementById("gs-field").innerHTML=`
        <div>
            <div class="category">KHOA HỌC TỰ NHIÊN</div>
            <div class="items">
                <div class="hex" id="khtn-10" style="cursor: pointer;" onclick="GetQuestionVeDich('khtn-10')">10</div>
                <div class="hex" id="khtn-20" style="cursor: pointer;" onclick="GetQuestionVeDich('khtn-20')">20</div>
                <div class="hex" id="khtn-30" style="cursor: pointer;" onclick="GetQuestionVeDich('khtn-30')">30</div>
            </div>
        </div>

        <div>
            <div class="category">KHOA HỌC XÃ HỘI</div>
            <div class="items">
                <div class="hex" id="khxh-10" style="cursor: pointer;" onclick="GetQuestionVeDich('khxh-10')">10</div>
                <div class="hex" id="khxh-20" style="cursor: pointer;" onclick="GetQuestionVeDich('khxh-20')">20</div>
                <div class="hex" id="khxh-30" style="cursor: pointer;" onclick="GetQuestionVeDich('khxh-30')">30</div>
            </div>
        </div>

        <div>
            <div class="category">NGHỆ THUẬT-THỂ THAO-TIẾNG ANH</div>
            <div class="items">
                <div class="hex" id="ntta-10" style="cursor: pointer;" onclick="GetQuestionVeDich('ntta-10')">10</div>
                <div class="hex" id="ntta-20" style="cursor: pointer;" onclick="GetQuestionVeDich('ntta-20')">20</div>
                <div class="hex" id="ntta-30" style="cursor: pointer;" onclick="GetQuestionVeDich('ntta-30')">30</div>
            </div>
        </div>
    `;
    for (let i = 0; i < data.number_of_players; i++){
        document.getElementById("play-" + (i + 1)).classList.remove("activated");
    }
    document.getElementById("question-box").innerText = "";
    document.getElementById("answer-box").innerText = "";
    for (let i of data.played_questions) document.getElementById(i).style.cssText += `
        background:#777;
        text-decoration:line-through red;
    `;
    if (data.star_question !== null){
        let sc = data.star_question[data.star_question.length - 1] + data.star_question[data.star_question.length - 2];
        console.log(data.star_question)
        document.getElementById(data.star_question).style.cssText += `
            background:#777;
            text-decoration:line-through red;
        `;
        document.getElementById(data.star_question).innerHTML = `
            <div style="clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
            background-color: orange;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            ">${sc}</div>
        `;
    }
    document.getElementsByClassName("gs-score")[0].innerText = data.player_score;
});
let q_n;
function GetQuestionVeDich(question_name){
    q_n = question_name;
    socket.emit('get_question_vedich', {
        question_name: question_name,
        // player_playing: player_list[current_player - 1][1]
    });
}
socket.on("reject_question", () =>{
    alert("Câu hỏi này đã được chọn!");
});

socket.on("need_star", data=>{
    document.getElementById("question-box").innerText = 'Chọn ngôi sao hi vọng không?';
    document.getElementById("answer-box").innerHTML = `
        <button type="button" class="btn btn-primary" onclick="CoNgoiSao('${data.question_name}')">Có</button>
        <button type="button" class="btn btn-secondary" onclick="KhongCoNgoiSao('${data.question_name}')">Không</button>
    `;
});

function CoNgoiSao(i){
    socket.emit("co_ngoi_sao");
    // , {
    //     question_name: i,
    //     // player_playing: player_list[current_player - 1][1]
    // }
}

function KhongCoNgoiSao(i){
    socket.emit("khong_co_ngoi_sao");
    //, {question_name: i, player_playing: player_list[current_player - 1][1]}
}

socket.on("next_question_vedich", data => {
    ShowQuestion(data);
});

socket.on("next_question_vedich_ngoisao", data => {
    document.getElementById("gs-star").innerHTML = `
        <img src="./image/star.gif" alt="Ngôi sao hi vọng" style="height: 120px; width: 120px;">
    `;
    ShowQuestion(data);
});
function ShowQuestion(i){
    document.getElementById("tick_vedich").classList.remove("disabled");
    document.getElementById("cross_vedich").classList.remove("disabled");
    document.getElementById("run_vedich").classList.remove("disabled");
    document.getElementById("gs-field").style.display = 'none';
    document.getElementById("question-box").innerText = i.next_question;
    document.getElementById("answer-box").innerText = i.next_answer;
    // console.log(i.next_media);
    if (i.next_media !== ''){
        if (i.next_extension === "mp3"){
            let audio3 = new Audio(i.next_media);
            audio3.play().catch(err => console.log(err));
        }
        else if (i.next_extension === "mp4"){
            document.getElementsByClassName('gs-container')[0].style.display = 'none';
            // let k = Math.min(window.innerWidth, window.innerHeight) * 0.8;
            document.getElementById("gs-video").innerHTML = `
                <video id="video_player" width="70%" autoplay>
                    <source src="${i.next_media}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
            document.getElementById("video_player").addEventListener("ended", ()=>{
                document.getElementsByClassName('gs-container')[0].style.display = '';
                document.getElementById("gs-video").innerText ='';
            });
        }
    }
}

function RunVeDich(){
    durability = 15000;
    link_media = root_media + "15_cnt.mp3";
    type_over = 'time_up_vedich';
    socket.emit('run_vedich');
    Countdown();
}

function VeDichCorrect(){
    socket.emit('correct_answer_vedich');
    //, {question_name: q_n, player_playing: player_list[current_player - 1][1]}
}
function VeDichWrong(){
    socket.emit('wrong_answer_vedich');
    //, {question_name: q_n, player_playing: player_list[current_player - 1][1]}
}
//
socket.on('next_player_vedich', data =>{
    document.getElementById("tick_vedich").classList.add("disabled");
    document.getElementById("cross_vedich").classList.add("disabled");
    document.getElementById("run_vedich").classList.add("disabled");
    // document.getElementById("question-box").innerText = "";
    // document.getElementById("answer-box").innerText = "";
    document.getElementById("gs-star").innerText = "";
    if (data.play_score){
        // console.log(data.player_playing, data.play_score);
        document.getElementById("score-" + data.player_playing).innerText = "(" + data.play_score + ")";
        document.getElementsByClassName("gs-score")[0].innerText = data.play_score;
    }
    if (data.take_score){
        // console.log(data.take_score[0], data.take_score[1]);
        document.getElementById("score-" + data.take_score[0]).innerText = "(" + data.take_score[1] + ")";
    }
    if (data.player_playing >= data.number_of_players) current_player = 1;
    else current_player += 1;
    // console.log(current_player, data.player_playing, data.number_of_players);
    SetPlayer(current_player);
});

socket.on('bell_enabled', data =>{
    durability = 5000;
    link_media = root_media + "5_cnt.mp3";
    type_over = 'time_up_cuopdiem';
    Countdown();
});

socket.on('player_clicked', data=>{
    type_over = 'blank';
    let audio_bell = new Audio("./media/bell.mp3");
    audio_bell.play().catch(err => console.error(err));
    document.getElementById("play-" + data.player_playing).classList.add("activated");
    document.getElementById("nut_dung_sai").innerHTML = `
        <button id="cross_vedich" class="btn btn-danger" onclick="CuopDiemVeDichWrong()" style="display: flex;">Bấm chuông sai</button>
        <button id="tick_vedich" class="btn btn-success" onclick="CuopDiemVeDichCorrect()" style="display: flex;">Bấm chuông đúng</button>
    `;
});
function CuopDiemVeDichCorrect(){
    document.getElementById("nut_dung_sai").innerHTML = `
        <button id="cross_vedich" class="btn btn-danger disabled" onclick="VeDichWrong()" style="display: flex;">Sai</button>
        <button id="tick_vedich" class="btn btn-success disabled" onclick="VeDichCorrect()" style="display: flex;">Đúng</button>
    `;
    socket.emit('cuop_diem_vedich_correct');
}

function CuopDiemVeDichWrong(){
    document.getElementById("nut_dung_sai").innerHTML = `
        <button id="cross_vedich" class="btn btn-danger disabled" onclick="VeDichWrong()" style="display: flex;">Sai</button>
        <button id="tick_vedich" class="btn btn-success disabled" onclick="VeDichCorrect()" style="display: flex;">Đúng</button>
    `;
    socket.emit('cuop_diem_vedich_wrong');
}
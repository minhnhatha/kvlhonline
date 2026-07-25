let StartTime = 0, player_playing = 1, audio = null, durability = 60000, root_media = "./media/";
let link_media = "./media/60_cnt.mp3", Tm, play_soundtrack = true, show_video = true;

//socket.onAny(
socket.emit("get_options");

socket.on('options', data => {
    // Handle the received options
    if (data.olympia_soundtrack) root_media = "./olympia_media/";
    //socket.emit("get_options");
});

function Countdown(){
    StartTime = Date.now();
    if (play_soundtrack){
        audio = new Audio(link_media);
        audio.play().catch(err => console.error(err));
        audio.addEventListener('playing', () => {Play();});
    }
    else Play();
}
function Play(){
    Tm = durability - Date.now() + StartTime;
    document.getElementById("showtime").innerText = parseInt(Tm / 1000) + 1;
    if (Tm > 0) requestAnimationFrame(Play);
    else document.getElementById("showtime").innerText = "0";
}

socket.on('khoidong', data => {
    durability = 60000;
    link_media = root_media + "60_cnt.mp3";
    player_playing = data.player_playing;
    let k = "play-" + player_playing;
    for (let i = 0; i < data.number_of_players; i++){
        document.getElementById("play-" + (i + 1)).classList.remove("playing");
    }
    document.getElementById(k).classList.add("playing");
    document.getElementById("question-box").innerText = data.first_question;
    document.getElementsByClassName("gs-score")[0].innerText = data.player_score;
    Countdown();
});

socket.on('next_question', data => {
    document.getElementById("question-box").innerText = data.next_question;
});
socket.on('correct_answer', data => {
    document.getElementById("score-" + data.player_playing).innerText = "(" + data.play_score + ")";
    document.getElementsByClassName("gs-score")[0].innerText = data.play_score;
    document.getElementById("qu-" + data.question_number).style.background = "lime";
});
socket.on('wrong_answer', data => {
    document.getElementById("qu-" + data.question_number).style.background = "red";
});

socket.on('game_over', () => {
    if (Tm > 3 && audio){
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio = null;
    }
    for (let i = 1; i<=10; i++){
        document.getElementById("qu-" + i).style.background = "white";
    }
    document.getElementById("question-box").innerText = "";
    document.getElementById("showtime").innerText = "0";
    document.getElementsByClassName("gs-score")[0].innerText = "0";
    let k = "play-" + player_playing;
    document.getElementById(k).classList.remove("playing");
});

socket.on('bonus', () => {
    if (play_soundtrack){
        let audio2 = new Audio("./media/bonus.mp3");
        audio2.play().catch(err => console.error(err));
    }
});





//--------------------------------- player script ---------------------------------




socket.on('change_mode_thuthach', data => {
    if (audio){
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio = null;
    }
    document.getElementsByClassName("gs-circles")[0].style.display = "none";
    document.getElementById("question-box").innerText = "";
    document.getElementsByClassName("gs-score")[0].innerText = "";
    document.getElementById("showtime").innerText = "";
    document.getElementsByClassName("gs-mode")[0].innerText = "Thử thách";
    document.getElementById("gs-bell").innerHTML = `
        <div id="bell_thuthach" class="btn btn-success" style="padding: 15px; width: 95%; border-radius: 14px;" onclick="BellClickThuThach()">
            Trả lời chủ đề
        </div>
    `;
    document.getElementById("gs-text").innerHTML = `
        <input id="answer_text" disabled type="text" style="width: 95%; padding: 15px; border-radius: 20px; text-align: center;"
        maxlength="30" placeholder="Nhập câu trả lời cho các hàng ngang">
    `;
    for (let i = 0; i < data.number_of_players; i++){
        document.getElementById("play-" + (i + 1)).classList.add("playing");
    }
    let k = `
        <div class="row" id="rcw-0">
            <div class="col-1"></div>
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
                <div class="col-1"></div>
                <div class="col-1"><button>${i}</button></div>
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

socket.on('question_thuthach_getted', data =>{
    document.getElementById("question-box").innerText = `(${data.cross} ${data.x}) ${data.question}`;
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

socket.on('run_thuthach', data =>{
    document.getElementById('answer_text').addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            let ans = document.getElementById('answer_text').value;
            if (ans.trim()){
                socket.emit('answer_submitted_thuthach', {answer: ans});
                document.getElementById("answer_show").innerText = ans;
                document.getElementById("player_answer").style.display = "flex";
                document.getElementById("player_list").style.display = "none";
                document.getElementById('answer_text').value = "";
            }
        }
    });
    document.getElementById('answer_text').value = "";
    document.getElementById('answer_text').focus();
    // document.getElementById('answer_text').classList
    document.getElementById('answer_text').disabled = false;
    durability = 15000;
    link_media = root_media + "15_cnt.mp3";
    Countdown();
});

socket.on('time_up_thuthach', data =>{
    document.getElementById('answer_text').value = "";
    document.getElementById('answer_text').disabled = true;
});

socket.on('show_player_answer_thuthach', data =>{
    document.getElementById("gs-crossword").style.display = "none";
    document.getElementById("gs-text").style.display = "none";
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
});

socket.on('check_answer_thuthach', data =>{
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

socket.on('unshow_player_answer_thuthach', () => {
    document.getElementById("gs-answers").style.display = "none";
    document.getElementById("gs-crossword").style.display = "";
    document.getElementById("gs-text").style.display = "";
    document.getElementById("player_answer").style.display = "none";
    document.getElementById("player_list").style.display = "";
});

function BellClickThuThach(){
    socket.emit('bell_clicked_thuthach');
    document.getElementById('bell_thuthach').disabled = true;
}

socket.on('player_clicked_bell_thuthach', data=>{
    document.getElementById("play-" + data.player_playing).classList.add("activated");
    document.getElementById("play-" + data.player_playing).classList.remove("playing");
    document.getElementById("name-" + data.player_playing).innerText = "" + data.turn_number + " - " + data.player_name;
    if (play_soundtrack){
        let audio_bell = new Audio("./media/bell.mp3");
        audio_bell.play().catch(err => console.error(err));
    }
});

socket.on('thuthach_wrong_answer', data =>{
    if (!data.each_player_state){
        document.getElementById("gs-bell").innerHTML = `
            <button id = "bell_thuthach"></button>
        `;
        document.getElementById("gs-text").innerHTML = `
            <input id="answer_text">
        `;
        document.getElementById("gs-bell").style.display = "none";
        document.getElementById("gs-text").style.display = "none";
    }
    document.getElementById("name-" + data.player_playing).innerText = data.player_name;
    document.getElementById("play-" + data.player_playing).classList.remove("activated");
});

socket.on('thuthach_correct_answer', data =>{
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
    document.getElementById("gs-bell").innerHTML = `
        <button id="bell_thuthach"></button>
    `;
    document.getElementById("gs-text").innerHTML = `
        <input id="answer_text">
    `;
    document.getElementById("gs-bell").style.display = "none";
    document.getElementById("gs-text").style.display = "none";
});


//---------------------------------player script ---------------------------------


socket.on('change_mode_donghanh', data => {
    if (audio){
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio = null;
    }
    document.getElementsByClassName("gs-circles")[0].style.display = "none";
    document.getElementById("question-box").innerText = "";
    document.getElementsByClassName("gs-score")[0].innerText = "";
    document.getElementById("showtime").innerText = "";
    document.getElementsByClassName("gs-mode")[0].innerText = "Đồng hành";
    document.getElementById("gs-crossword").innerHTML = "";
    document.getElementById("gs-answers").innerHTML = "";
    document.getElementById("gs-bell").innerText = "";
    document.getElementById("gs-text").style.display = "";
    document.getElementById("gs-text").innerHTML = `
        <input id="answer_text" disabled type="text" style="width: 95%; padding: 15px; border-radius: 20px; text-align: center;"
        maxlength="30" placeholder="Nhập câu trả lời">
    `;
    for (let i = 0; i < data.number_of_players; i++){
        document.getElementById("play-" + (i + 1)).classList.remove("playing");
        document.getElementById("play-" + (i + 1)).classList.remove("activated");
    }
});

socket.on('get_question_donghanh', data =>{
    for (let i = 0; i < data.number_of_players; i++){
        document.getElementById("play-" + (i + 1)).classList.remove("playing");
    }
    document.getElementById("play-" + data.player_playing).classList.add("playing");
    document.getElementById("question-box").innerText = data.first_question;
    document.getElementsByClassName("gs-score")[0].innerText = data.player_score;
});

socket.on('run_donghanh', data =>{
    if (data.is_playing){
        document.getElementById('answer_text').addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                let ans = document.getElementById('answer_text').value;
                if (ans.trim()){
                    // console.log(ans);
                    socket.emit('answer_submitted_donghanh', {answer: ans});
                    document.getElementById("answer_show").innerText = ans;
                    document.getElementById("player_answer").style.display = "flex";
                    document.getElementById('answer_text').value = "";
                }
            }
        });
        document.getElementById('answer_text').value = "";
        document.getElementById('answer_text').focus();
        // document.getElementById('answer_text').classList
        document.getElementById('answer_text').disabled = false;
    }
    durability = 10000;
    link_media = root_media + "10_cnt.mp3";
    Countdown();
});


socket.on("time_up_donghanh", data =>{
    document.getElementById('answer_text').value = "";
    document.getElementById('answer_text').disabled = true;
    document.getElementById("answer_show").innerText = "";
    document.getElementById("player_answer").style.display = "none";
    document.getElementById("question-box").style.textAlign = "center";
    document.getElementById("question-box").innerHTML = `
        <p>TRẢ LỜI:</p><span>${data.player_answer}</span>
    `;
});

socket.on("correct_answer_donghanh", data => {
    document.getElementById("question-box").innerText = "";
    document.getElementById("score-" + data.player_playing).innerText = "(" + data.player_score + ")";
    document.getElementsByClassName("gs-score")[0].innerText = data.player_score;
});

socket.on("wrong_answer_donghanh", data => {
    document.getElementById("question-box").innerText = "";
});

socket.on('next_question_donghanh', data =>{
    document.getElementById("question-box").style.textAlign = "left";
    document.getElementById("question-box").innerText = data.next_question;
});

//--------------------------------- Về đích player script ---------------------------------


socket.on('change_mode_vedich', data => {
    if (audio){
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio = null;
    }
    document.getElementsByClassName("gs-circles")[0].style.display = "none";
    document.getElementById("question-box").innerText = "";
    document.getElementsByClassName("gs-score")[0].innerText = "";
    document.getElementById("showtime").innerText = "";
    document.getElementsByClassName("gs-mode")[0].innerText = "Về đích";
    document.getElementById("gs-text").innerText = "";
    document.getElementById("question-box").style.textAlign = "left";
    document.getElementById("gs-bell").innerHTML = `
        <div id="bell_vedich" class="btn btn-success" style="padding: 15px; width: 95%; border-radius: 14px;" onclick="BellClickVeDich()">
            Giành quyền trả lời
        </div>
    `;
    for (let i = 0; i < data.number_of_players; i++){
        document.getElementById("play-" + (i + 1)).classList.remove("playing");
    }
});


socket.on('vedich', data => {
    document.getElementById("question-box").innerText = "";
    document.getElementById("gs-star").innerText = "";
    document.getElementById("gs-field").innerHTML=`
        <div>
            <div class="category">KHOA HỌC TỰ NHIÊN</div>
            <div class="items">
                <div class="hex" id="khtn-10">10</div>
                <div class="hex" id="khtn-20">20</div>
                <div class="hex" id="khtn-30">30</div>
            </div>
        </div>

        <div>
            <div class="category">KHOA HỌC XÃ HỘI</div>
            <div class="items">
                <div class="hex" id="khxh-10">10</div>
                <div class="hex" id="khxh-20">20</div>
                <div class="hex" id="khxh-30"> 30</div>
            </div>
        </div>

        <div>
            <div class="category">NGHỆ THUẬT-THỂ THAO-TIẾNG ANH</div>
            <div class="items">
                <div class="hex" id="ntta-10">10</div>
                <div class="hex" id="ntta-20">20</div>
                <div class="hex" id="ntta-30">30</div>
            </div>
        </div>
    `;
    for (let i of data.played_questions) document.getElementById(i).style.cssText += `
        background:#777;
        text-decoration:line-through red;
    `;
    if (data.star_question !== null){
        let sc = data.star_question[data.star_question.length - 1] + data.star_question[data.star_question.length - 2];
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
    document.getElementById("gs-field").style.display = 'flex';
    player_playing = data.player_playing;
    let k = "play-" + player_playing;
    document.getElementsByClassName("gs-score")[0].innerText = data.player_score;
    for (let i = 0; i < data.number_of_players; i++){
        document.getElementById("play-" + (i + 1)).classList.remove("playing");
        document.getElementById("play-" + (i + 1)).classList.remove("activated");
    }
    document.getElementById(k).classList.add("playing");
});
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
    document.getElementById("gs-field").style.display = 'none';
    document.getElementById("question-box").innerText = i.next_question;
    // console.log(i.next_media);
    if (i.next_media !== ''){
        if (i.next_extension === "mp3"){
            let audio3 = new Audio(i.next_media);
            audio3.play().catch(err => console.error(err));
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

socket.on('run_vedich', data =>{
    durability = 15000;
    link_media = root_media + "15_cnt.mp3";
    Countdown();
});

socket.on('next_player_vedich', data =>{
    if (data.play_score){
        document.getElementById("score-" + player_playing).innerText = "(" + data.play_score + ")";
        document.getElementsByClassName("gs-score")[0].innerText = data.play_score;
    }
    if (data.take_score){
        document.getElementById("score-" + data.take_score[0]).innerText = "(" + data.take_score[1] + ")";
    }
});

socket.on('bell_enabled', data=>{
    durability = 5000;
    link_media = root_media + "5_cnt.mp3";
    Countdown();
});

function BellClickVeDich(){
    socket.emit('bell_clicked_vedich');
}

socket.on('player_clicked', data=>{
    document.getElementById("play-" + data.player_playing).classList.add("activated");
    if (play_soundtrack){
        let audio_bell = new Audio("./media/bell.mp3");
        audio_bell.play().catch(err => console.error(err));
    }
});
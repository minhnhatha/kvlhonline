const socket = io({query : {role: 'host'}});
const room_players = {};
socket.on('host-registered', data => {
    document.getElementById('show_code').innerText = `Mã phòng: ${data.room_code}`;
    document.getElementById("play_soundtrack_input").checked = data.options.play_soundtrack_on_player;
    document.getElementById("show_video_input").checked = data.options.show_video_on_player;
    document.getElementById("olympia_soundtrack_input").checked = data.options.olympia_soundtrack;
});
socket.on('new_player', data => {
    let { play_id, play_name } = data;
    room_players[play_id] = play_name;
    Waiting();
});

socket.on("test_cannot_up", data => {
    alert("Thư mục chưa có đề thi!");
});

socket.on("test_error", data => {
    alert("Lỗi tải đề!");
})

socket.on("test_up", data =>{
    document.getElementById("up_file").innerText = "Đã nạp đề"
    alert("Đã nạp đề!");
});
// socket.on('player_left', ({ play_id }) => {
//     delete room_players[play_id];
//     const player_li = document.getElementById(`player_${play_id}`);
//     if (player_li) player_li.remove();
// });

//for sidebar
const btn_1 = document.getElementById("toggleBtn");
const btn_2 = document.getElementById("toggleBtn2");

btn_1.addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle('collapsed');
  btn_2.style.display = "";
});
btn_2.addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle('collapsed');
//   btn_2.style.display = "none";
});



document.getElementById("up_file").onclick = () =>{
    document.getElementById("folderInput").click();
}

document.getElementById("folderInput").addEventListener("change", async () => {
    const files = document.getElementById("folderInput").files;
    if (files.length === 0) {
        alert("Chưa chọn thư mục");
        return;
    }
    const formData = new FormData();
    for (const file of files) {
        formData.append("files", file);
    }
    await fetch("/read-folder", {
        method: "POST",
        headers: {
            "x-socket-id": socket.id
        },
        body: formData
    });
});

document.getElementById("submit_game_setting").onclick = () =>{
    let play_soundtrack_input_value = document.getElementById("play_soundtrack_input"),
    show_video_input_value = document.getElementById("show_video_input"),
    olympia_soundtrack_input_value = document.getElementById("olympia_soundtrack_input");
    console.log(play_soundtrack_input_value.checked, show_video_input_value.checked, olympia_soundtrack_input_value.checked);
    socket.emit('setting_change', {
        play_soundtrack_input_value: play_soundtrack_input_value.checked,
        show_video_input_value: show_video_input_value.checked,
        olympia_soundtrack_input_value: olympia_soundtrack_input_value.checked,
    });
}

function Waiting(){
    let text_html = "";
    for (const id in room_players) {
        text_html +=`
        <div class="row text-center">
            <div class="col-1"></div>
            <div class="col-9 line_board">${room_players[id]}</div>
            <div class="col-1 line_board">
                <button type="button" id="del_button" onclick="Delete_play('${id}')"
                style="width: 5vw; border-radius: 1vw; border: none; color: white; background: red;">
                    Xóa
                </button>
            </div>
        </div>
        `;

    }
    document.getElementById("player_list").innerHTML = text_html;
}
function Delete_play(play_id){
    if (play_id in room_players) delete room_players[play_id];
    socket.emit('remove_player', { play_id });
    Waiting();
}
socket.on('player_left', ({ play_id }) => {
    if (play_id in room_players) delete room_players[play_id];
    Waiting();
});

function GameStart(){
    if (Object.keys(room_players).length === 0) alert("Cần có người chơi để bắt đầu!");
    else{
        fetch('host_player.html')
        .then(response => response.text())
        .then(html => {
            const oldScript = document.getElementById('scriptjs');
            const newScript = document.createElement('script');
            newScript.id = 'my-scriptjs';
            newScript.src = "host_player_script.js" + '?t=' + Date.now();
            oldScript.parentNode.replaceChild(newScript, oldScript);
            document.getElementById("StyleGame").innerHTML = `
                body{
                    background-repeat: no-repeat;
                    background-image: url(./image/play_bg.jpg);
                    background-size: 100%;
                    background-color: rgb(3, 12, 27);
                }
            `;
            document.getElementById('main-style').href = './player_style.css' + '?t=' + Date.now();
            document.getElementById("TheContainer").innerHTML = html;
            let k = "", cnt = 1;
            for (let i in room_players){
                k += `<div class="gs-player" onclick="SetPlayer(${cnt})" id="play-${cnt}"><span id="name-${cnt}">${room_players[i]}</span><br><span id="score-${cnt}">(0)</span></div>`;
                cnt += 1;
            }
            document.getElementById("player_list").innerHTML = k;
            socket.emit('start_game');
        })
        .catch(err => {
            document.getElementById("TheContainer").innerHTML = err;
        });
    }
}
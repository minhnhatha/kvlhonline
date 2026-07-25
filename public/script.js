const socket = io();
function JoinTeam(){
    let k = document.getElementById("name_inp").value;
    let x = document.getElementById("code_inp").value;
    if (!x.length) alert("Bạn chưa điền mã phòng!");
    else if (x.length !== 6) alert("Mã phòng phải có 6 chữ số!");
    // else if (!hosts[x]) alert("Mã phòng không hợp lệ!");
    else if (k.replace(/\s+/g, '') === "") alert("Bạn chưa điền tên!");
    else socket.emit('player_joining', {code: x, play_name: k});

}
socket.on('player_joined', data => {
    let { success, code, play_name } = data;
    if (!success) alert("Mã phòng không hợp lệ!");
    else {
        document.getElementById("sub_join").style.display = "none";
        document.getElementById("body_1").style.display = "";
        document.getElementById("body_2").style.display = "none";
        document.getElementById("show_room_code").innerText = " " + code;
        document.getElementById("show_player_name").innerText = " " + play_name;
    }
});
socket.on('game_start', data =>{
    fetch('player.html')
    .then(response => response.text())
    .then(html => {
        const oldScript = document.getElementById('scriptjs');
        const newScript = document.createElement('script');
        newScript.id = 'my-scriptjs';
        newScript.src = "player_script.js" + '?t=' + Date.now();
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
        let k = "", cnt = 1;;
        for (let i of data.player_list){
            k += `<div class="gs-player" id="play-${cnt}"><span id="name-${cnt}">${i}</span><br><span id="score-${cnt}">(0)</span></div>`;
            cnt += 1;
        }
        document.getElementById("player_list").innerHTML = k;
        
    })
    .catch(err => {
        document.getElementById("TheContainer").innerHTML = "Lỗi tải tab.";
    });
    
});
socket.on('removed_by_host', () => {
    window.location.reload();
});
        // socket.emit('joining', {
        //     code: x,
        //     play_name: k,
        //     play_team: player_team,
        // })
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const crypto = require("crypto");
const fs = require('fs').promises;
const path = require('path');
const { get } = require('https');
//=======đống này để nạp đề
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // mỗi file 15 MB
    files: 20               // tối đa 20 file
  }
});
const XLSX = require("xlsx");
const { time } = require('console');
// Khai báo thư mục chứa các file .txt
const type_question = ['khtn-10', 'khtn-20', 'khtn-30', 'khxh-10', 'khxh-20', 'khxh-30', 'ntta-10', 'ntta-20', 'ntta-30'];
const score_question = [10, 20, 30, 10, 20, 30, 10, 20, 30];
let question_index = 0;

const players = {}; //Lưu socket id của người chơi và mã phòng họ tham gia
const hosts = {}; //Lưu socket id của host và mã phòng họ tạo
const room = {
    "current_maximum_number": 999999,
}; //add sth


//=-==-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-
const RED = 0, BLACK = 1;
class RedBlackNode{
    /**
    * Node for Tree Map
    */
  constructor(key, val, color = RED) {
    this.key = key;
    this.val = val;
    this.color = color;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}
class RedBlackTree{
    /**
    * A complete Tree for Tree Map
    */
  constructor() {
    this.root = null;
  }
  colorOf(n) {
    return n ? n.color : BLACK;
  }

  minimum(node) {
    while (node.left) node = node.left;
    return node;
  }

  
}
/**
* Definitely Red-Black Tree cuz Hashmap just suck for array traversal. It's O(n^2) in worse case *LOL.
*/
function treeMap(){
    let tm = new RedBlackTree();
}
//let mp = treeMap();
//merge sort in JS===============================================================================
function mergeSort(arr) {
    const temp = new Array(arr.length);
    sort_process(arr, temp, 0, arr.length - 1);
    return arr;
}
function sort_process(arr, temp, l, r) {
    if (l >= r) return;
    const mid = Math.floor(r + (l - r) / 2);
    sort_process(arr, temp, l, mid);
    sort_process(arr, temp, mid + 1, r);
    merge_process(arr, temp, l, mid, r);
}
function merge_process(arr, temp, l, mid, r) {
    let i = l;
    let j = mid + 1;
    let k = l;
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]){
            temp[k] = arr[i];
            i += 1;
        }
        else{
            temp[k] = arr[j];
            j += 1;
        }
        k += 1
    }
    while (i <= mid){
        temp[k] = arr[i];
        k += 1;
        i += 1;
    }
    while (j <= r){
        temp[k] = arr[j];
        k += 1;
        j += 1;
    }
    for (let idx = l; idx <= r; idx++) arr[idx] = temp[idx];
}

//==================================-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-
class Deque{
    constructor(){
        this.items = [];
        this.head = 0;
        this.head_items = [];
    }
    push_back(i){
        this.items.push(i);
    }
    pop_back(){
        if (!this.items.length) return undefined;
        this.items.pop();
        if (!this.items.length){
            let n = this.head_items.length - 1;
            while(n >= 0){
                this.items.push(this.head_items[n]);
                n -= 1;
                this.head_items.pop();
            }
        } 
    }
    push_front(i){
        this.head_items.push(i);
    }
    pop_front(){
        if (!this.head_items.length){
            this.head += 1;
            if (this.head > 1000) {
                this.items = this.items.slice(this.head);
                this.head = 0;
            }
        }
        else{
            this.head_items.pop();
        }
    }
    front(){
        if (this.head_items.length) return this.head_items[this.head_items.length - 1];
        else return this.head;
    }
    back(){
        return this.items[this.items.length - 1];
    }
    deque_size(){
        return this.items.length - this.head + this.head_items.length;
    }
    empty(){
        return this.items.length < this.head;
    }

}
class Queue{
    constructor(){
        this.items = [];
        this.head = 0;
    }
    push_back(i){
        this.items.push(i);
    }
    pop_front(){
        if (this.head >= this.items.length) return undefined;
        //let value = this.items[this.head];
        this.head += 1;
        if (this.head > 1000) {
            this.items = this.items.slice(this.head);
            this.head = 0;
        }
        //return value;
    }
    front(){
        return this.items[this.head];
    }
    back(){
        return this.items[this.head + this.items.length - 1];
    }
    queue_size(){
        return this.items.length - this.head;
    }
    empty(){
        return this.items.length < this.head;
    }
    index_value(i){
        if (i < this.head || i >= this.head + this.items.length) return undefined;
        return this.items[i + this.head];
    }
}
function getFileExtension(filename) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return ''; // không có phần mở rộng
  return filename.slice(lastDotIndex + 1).toLowerCase();
}

function removeVietnameseTones(s) {
  return s
    .normalize("NFD")                  // tách chữ + dấu
    .replace(/[\u0300-\u036f]/g, "")   // xóa dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/**
 * Hàm tách nội dung A và B từ một dòng đã chọn.
 * Format: Nội dung A * Nội dung B
 * @param {string} line - Dòng text cần xử lý
 * @returns {{noiDungA: string, noiDungB: string, mediaURL: string} | null}
 */
function processLine(line) {
  // Bỏ qua nếu dòng rỗng sau khi trim
    if (line.trim() === '') {
        return null; 
    }

    const separatorIndex = line.indexOf('*'), mediaIndex = line.indexOf('&'); 

    if (separatorIndex === -1) {
        // Trường hợp dòng không có dấu *
        return {
            noiDungA: line.trim(),
            noiDungB: 'N/A (Không có dấu *)',
            mediaURL: ''
        };
    }
    if (mediaIndex === -1){
        return{
            noiDungA: line.substring(0, separatorIndex).trim(),
            noiDungB: line.substring(separatorIndex + 1).trim(),
            mediaURL: ''         
        };
    }

    // Đã loại bỏ 'originalLine'
    return {
        noiDungA: line.substring(0, separatorIndex).trim(),
        noiDungB: line.substring(separatorIndex + 1, mediaIndex).trim(),
        mediaURL: line.substring(mediaIndex + 1).trim()
    };
}

async function getOneFiveLines(){ //for thuthach
    //s.replace(/\s+/g, "").toUpperCase();
    const challengelines = await fs.readFile(path.join(__dirname, './backend_file/thuthach/thuthach.txt'), 'utf8');
    const challengequestion = challengelines.split(/\r?\n/).filter(line => line.trim() !== '');
    // console.log(challengequestion);
    if (question_index === 1000000) question_index = 0;
    let question_pack = [], k = (question_index * 5) % challengequestion.length;
    question_pack.push(challengequestion[k]);
    for (let i = k + 1; i < k + 5; i++){
        question_pack.push(processLine(challengequestion[i]));
    }
    question_index += 1;
    return question_pack;
}

async function getFileDongHanh() { //for donghanh
    //lấy 2 dòng từ file tunhien.txt, 2 dòng từ file xahoi,txt, 1 dòng từ file tienganh.txt theo question.index
    // const dataDirectory = path.join(__dirname, './backend_file/donghanh');
    // return await getOneRandomLinePerFile(dataDirectory);
    let tunhienlines = await fs.readFile(path.join(__dirname, './backend_file/donghanh/tunhien.txt'), 'utf8');
    let xahoilines = await fs.readFile(path.join(__dirname, './backend_file/donghanh/xahoi.txt'), 'utf8');
    let tienganhlines = await fs.readFile(path.join(__dirname, './backend_file/donghanh/tienganh.txt'), 'utf8');
    tunhienlines = tunhienlines.split(/\r?\n/).filter(line => line.trim() !== '');
    xahoilines = xahoilines.split(/\r?\n/).filter(line => line.trim() !== '');
    tienganhlines = tienganhlines.split(/\r?\n/).filter(line => line.trim() !== '');
    if (question_index === 1000000) question_index = 0;
    let question_pack = [];
    question_pack.push(processLine(tienganhlines[question_index % tienganhlines.length]));
    let k = (question_index * 2) % tunhienlines.length;
    question_pack.push(processLine(tunhienlines[k]));
    question_pack.push(processLine(tunhienlines[k + 1]));
    question_pack.push(processLine(xahoilines[k]));
    question_pack.push(processLine(xahoilines[k + 1]));
    
    for (let i = question_pack.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // 0 → i
        [question_pack[i], question_pack[j]] = [question_pack[j], question_pack[i]]; // swap
    }
    question_index += 1;
    return question_pack;
}

/**
 * Hàm chính để đọc từng file, chọn ngẫu nhiên 1 dòng và xử lý.
 */
async function getOneRandomLinePerFile(dataDirectory) {
    try {
        // 1. Đọc danh sách file và lọc lấy file .txt
        const files = await fs.readdir(dataDirectory);
        const txtFiles = files.filter(file => file.endsWith('.txt'));

        if (txtFiles.length === 0) {
            console.log('Không tìm thấy file .txt nào trong thư mục "data".');
            return [];
        }
        
        // Tạo một mảng các "lời hứa" để xử lý từng file
        const resultsPromises = txtFiles.map(async (fileName) => {
        const filePath = path.join(dataDirectory, fileName);
        
        // 2. Đọc nội dung file
        const content = await fs.readFile(filePath, 'utf8');
        
        // 3. Tách nội dung thành các dòng và lọc bỏ dòng trống
        const allLines = content.split(/\r?\n/).filter(line => line.trim() !== '');

        if (allLines.length === 0) {
            return { 
                fileName, 
                data: null, 
                status: 'EMPTY' 
            };
        }
        
        // 4. Chọn 1 dòng ngẫu nhiên
        if (question_index === 1000000) question_index = 0;
        const randomLine = allLines[question_index % allLines.length];

        // 5. Tách nội dung A và B
        const processedData = processLine(randomLine);

        return {
            fileName,
            data: processedData,
            status: 'OK'
        };
        });

        // Chờ tất cả các file được xử lý xong
        const finalResults = await Promise.all(resultsPromises);
        
        // Lọc các kết quả bị lỗi hoặc trống
        const successfulResults = finalResults.filter(r => r.data !== null);

        // 6. Hiển thị kết quả
        // console.log(`Đã cố gắng xử lý ${txtFiles.length} file.`);
        // console.log(`Tổng cộng có ${successfulResults.length} dòng hợp lệ được chọn.`);
        // console.log('================================================================');

        // successfulResults.forEach((result, index) => {
        //     // Đã bỏ 'originalLine' ra khỏi đây
        //     const { noiDungA, noiDungB } = result.data;
        //     console.log(`[${index + 1}/${successfulResults.length}] File: ${result.fileName}`);
        //     // Đã xóa dòng log 'Dòng gốc'
        //     console.log(`     A: ${noiDungA}`);
        //     console.log(`     B: ${noiDungB}`);
        //     console.log('---');
        // });
        
        // Trả về mảng dữ liệu đã xử lý để dùng tiếp
        // Kết quả sẽ là một mảng các object, kèm theo tên file
        return successfulResults.map(r => ({
            // fileName: r.fileName,
            noiDungA: r.data.noiDungA,
            noiDungB: r.data.noiDungB,
            mediaURL: r.data.mediaURL
        }));

    } catch (err) {
        console.error('Đã xảy ra lỗi trong quá trình xử lý file:', err.message);
        return [];
    }
}

// ================== UPLOAD QUEUE ==================

//==Đây là phiên bản up đơn giản, tuy nhiên dễ nổ RAM nếu nhiều host up
// app.post("/read-folder", upload.array("files"), (req, res) => {
//     const socketId = req.headers["x-socket-id"];
//     if (!socketId || !hosts[socketId]) {
//         return res.status(403).json({
//             error: "Chỉ host mới được upload"
//         });
//     }
//     let having_test = false;
//     for (const file of req.files) {
//         const path = file.originalname; // đường dẫn tương đối
//         const buffer = file.buffer;     // dữ liệu file
//         console.log("File:", path);
//         console.log("Size:" + buffer.length / 1024 / 1024 + " MB");
//         if (path === "kvlh_test.xlsx"){
//             having_test = true;
//             let workbook = XLSX.read(buffer, { type: "buffer" });
//             let sheetName = workbook.SheetNames;
//             let sheetKhoiDong = workbook.Sheets[sheetName[0]];
//             let sheetThuThach = workbook.Sheets[sheetName[1]];
//             let sheetDongHanh = workbook.Sheets[sheetName[2]];
//             let sheetVeDich = workbook.Sheets[sheetName[3]];
//             // console.log(room[hosts[socketId].room_code]["own_test"]);
//             room[hosts[socketId].room_code]["own_test"] = 1;
//             room[hosts[socketId].room_code]["own_test"] = [sheetKhoiDong, sheetThuThach, sheetDongHanh, sheetVeDich];
//         }
//     }
//     if (having_test){
//         io.to(socketId).emit("test_up");
//     }
//     else io.to(socketId).emit("test_cannot_up");

//     res.json({ ok: true });
// });
// // ================== FILE HANDLER (TÙY BẠN SỬA) ==================
// async function handleFile(file) {
//     // giả lập xử lý nặng
//     await new Promise(r => setTimeout(r, 200));
// }

// ================== UPLOAD ROUTE ==================
app.use(express.static('public'));
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    // console.log("checkOK");
  } catch (e) {
    console.error("mkdir failed:", dirPath, e);
  }
}
const uploadQueue = [];
let isProcessing = false;
function isSocketAlive(socketId) {
    return io.sockets.sockets.has(socketId);
}
async function processQueue() {
    if (isProcessing || uploadQueue.length === 0) return;
    isProcessing = true;
    const task = uploadQueue.shift();
    try {
        await task();
    }
    catch (err) {
        console.error("Queue error:", err.message);
    }
    isProcessing = false;
    processQueue();
}
app.post("/read-folder", upload.array("files"),(req, res) => {
    const socketId = req.headers["x-socket-id"];
    console.log("Upfile:", socketId);
    if (!socketId || !hosts[socketId]) {
        return res.status(403).json({
            error: "Chỉ host mới được upload"
        });
    }
    uploadQueue.push(async () => {
        try {
            // host disconnect khi đang chờ
            if (!isSocketAlive(socketId)) {throw new Error("Host disconnected before start");}
            // io.to(socketId).emit("upload_start");
            let having_test = false;
            for (let i = 0; i < req.files.length; i++) {
                // host disconnect giữa chừng
                if (!isSocketAlive(socketId)) {
                    throw new Error("Host disconnected");
                }
                // await handleFile(req.files[i]);
                let file = req.files[i];

                let file_path = file.originalname; // đường dẫn tương đối
                let buffer = file.buffer;     // dữ liệu file
                console.log("File:", file_path);
                console.log("Size:" + buffer.length / 1024 / 1024 + " MB");
                if (file_path === "kvlh_test.xlsx"){
                    having_test = true;
                    let workbook = XLSX.read(buffer, { type: "buffer" });
                    let sheetName = workbook.SheetNames;
                    let sheetKhoiDong = workbook.Sheets[sheetName[0]];
                    let sheetThuThach = workbook.Sheets[sheetName[1]];
                    let sheetDongHanh = workbook.Sheets[sheetName[2]];
                    let sheetVeDich = workbook.Sheets[sheetName[3]];
                    // console.log(room[hosts[socketId].room_code]["own_test"]);
                    room[hosts[socketId].room_code]["own_test"] = 1;
                    room[hosts[socketId].room_code]["own_test"] = [sheetKhoiDong, sheetThuThach, sheetDongHanh, sheetVeDich];
                    file.buffer = null;
                    break;
                }
                else if (getFileExtension(file_path) !== "mp3" && getFileExtension(file_path) !== "mp4") file.buffer = null;
                // io.to(socketId).emit("upload_progress", {
                //     current: i + 1,
                //     total: req.files.length
                // });
            }
            if (having_test){
                for (let i = 0; i < req.files.length; i++) {
                    if (!isSocketAlive(socketId)) {
                        throw new Error("Host disconnected");
                    }
                    let file = req.files[i];
                    let file_path = file.originalname;
                    let buffer = file.buffer;

                    if (getFileExtension(file_path) === "mp3" || getFileExtension(file_path) === "mp4"){
                        console.log("Media file:", file_path);
                        console.log("Media size:" + buffer.length / 1024 / 1024 + " MB");
                        let baseDir = path.join(__dirname, "media_from_hosts");
                        // console.log(baseDir);
                        // let relativePath = file.originalname;
                        // console.log(relativePath);
                        let savePath = path.join(
                            baseDir,
                            String(hosts[socketId].room_code),
                            file_path
                        );
                        await ensureDir(path.dirname(savePath));
                        await fs.writeFile(savePath, file.buffer);
                        file.buffer = null;
                    }
                }
                io.to(socketId).emit("test_up");
            }
            else io.to(socketId).emit("test_cannot_up");
            res.json({ ok: true });
        }
        catch (err) {
            if (isSocketAlive(socketId)) io.to(socketId).emit("test_error");
            res.status(500).json({ error: err.message });
        }
    });
    // io.to(socketId).emit("upload_queued", {
    //     position: uploadQueue.length
    // });
    processQueue();
});
//======================================================================================
function generateRandomRoomCode(){ //chỉ cho vui, ko khuyến thích thực hành
    let k = (Math.floor(Math.random() * 900000) + 100000).toString();
    for (let times = 0; times < Math.max(Math.floor(Math.random() * 6), 2); ++times){
        let x = Math.floor(Math.random() * 6);
        k[x] = "" + Math.floor(Math.random() * 10);
    }
    return k;
}
//Nếu host có mã phòng trùng với cái có sẵn, lấy mã phòng có số LỚN NHẤT mà available
io.on('connection', socket => {
    if (socket.handshake.query.role === 'host') {
        // && room["current_maximum_number"] >= 100000
        socket.token = crypto.randomUUID();
        console.log('Host connected:', socket.id);
        let rm = generateRandomRoomCode(); //generate room code

        if (room[rm]) {
            // if (room["current_maximum_number"] <= 100000 && rm === "100000") rm = "unable_to_join";
            rm = room["current_maximum_number"].toString();
        }
        else{
            if (rm === room["current_maximum_number"].toString()){
                let able_to_join = false;
                for (let i = room["current_maximum_number"]; i >= 100000; --i){
                    if (!room[i.toString()]){
                        room["current_maximum_number"] = i;
                        able_to_join = true;
                        break;
                    }
                }
                if (!able_to_join) rm = "Đã hết";
            }
            room[rm] = {};
        }

        hosts[socket.id] = {
            id: socket.id,
            room_code: rm,
        }//create host
        room[rm]["options"] = {
            play_soundtrack_on_player: false,
            show_video_on_player: false,
            olympia_soundtrack: false,
        }
        room[rm]["own_test"] = null;
        room[rm]["host"] = socket.id;
        room[rm]["enable_bell"] = null;
        room[rm]["playable_media"] = "";
        // room[players[socket.id]]["enable_bell"]
        room[rm]["playing"] = null;
        room[rm]['questions'] = null;
        room[rm]['answers'] = null;
        room[rm]['state_of_questions_played'] = null; //list when thuthach, other is number
        room[rm]['list_of_players'] = []; //danh sách id người chơi trong phòng, theo thứ tự playing

        // console.log('- Number of hosts:', Object.keys(hosts).length);
        io.to(socket.id).emit('host-registered', {
            room_code: rm,
            options: room[rm]["options"],
        });//send room code to host, actually why did not i use socket.emit?
        socket.on('remove_player', data => {//delete player by host
            if (room[rm][data.play_id]) {
                delete room[rm][data.play_id];
                io.to(data.play_id).emit('removed_by_host');
            }
        });
        socket.on('setting_change', data=>{
            room[rm]["options"].play_soundtrack_on_player = data.play_soundtrack_input_value;
            room[rm]["options"].show_video_on_player = data.show_video_input_value;
            room[rm]["options"].olympia_soundtrack = data.olympia_soundtrack_input_value;
        });
        socket.on('start_game', data => { //Đề tự up sẽ đc rã đông ở đây
            console.log('Game started in room:', rm);
            if (room[rm]["own_test"]){
                let dataKhoiDong = XLSX.utils.sheet_to_json(room[rm]["own_test"][0]);
                let dataThuThach = XLSX.utils.sheet_to_json(room[rm]["own_test"][1]);
                let dataDongHanh = XLSX.utils.sheet_to_json(room[rm]["own_test"][2]);
                let dataVeDich = XLSX.utils.sheet_to_json(room[rm]["own_test"][3]);
                // "own test sẽ có dạng [], [], [], [] ứng với 4 phần thi"
                // với phần khởi động và đồng hành, mỗi phần thi gồm nhiều {} là câu hỏi
                // với phần thử thách, phần tử đầu là xâu chủ đề, 4 phần tử còn lại là {}
                // phần về đích là map gồm các key là type_question, mỗi key có value là 1 queue, gồm 4 câu hỏi theo lĩnh vực và điểm như key
                // mỗi câu hỏi vẫn có noiDungA, noiDungB và mediaURL
                room[rm]["own_test"] = [[], [], [], {}];
                for (let i = 1; i<dataKhoiDong.length; ++i){
                    room[rm]["own_test"][0].push({
                        noiDungA: (dataKhoiDong[i].__EMPTY !== undefined)? dataKhoiDong[i].__EMPTY : "",
                        noiDungB: (dataKhoiDong[i].__EMPTY_1 !== undefined)? dataKhoiDong[i].__EMPTY_1 : "",
                        mediaURL: "",
                    });
                }
                room[rm]["own_test"][1].push(dataThuThach[0].__EMPTY);
                for (let i = 2; i<6; ++i){
                    room[rm]["own_test"][1].push({
                        noiDungA: (dataThuThach[i].__EMPTY !== undefined)? dataThuThach[i].__EMPTY : "",
                        noiDungB: (dataThuThach[i].__EMPTY_3 !== undefined)? dataThuThach[i].__EMPTY_3 : "",
                        mediaURL: (dataThuThach[i].__EMPTY_2 !== undefined)? "/host_media/" + dataThuThach[i].__EMPTY_2 : "", //Lần đầu viết if else kiểu này
                    });
                }
            
                for (let i = 1; i<dataDongHanh.length; ++i){
                    room[rm]["own_test"][2].push({
                        noiDungA: (dataDongHanh[i].__EMPTY !== undefined) ? dataDongHanh[i].__EMPTY : "",
                        noiDungB: (dataDongHanh[i].__EMPTY_1 !== undefined) ? dataDongHanh[i].__EMPTY_1 : "",
                        mediaURL: "",
                    });
                }
                for (let i of type_question){
                    room[rm]["own_test"][3][i] = new Queue();
                }
                let k = -1;
                for (let i = 1; i<dataVeDich.length; ++i){
                    if (dataVeDich[i].__EMPTY) k += 1;
                    room[rm]["own_test"][3][type_question[k]].push_back({
                        noiDungA: (dataVeDich[i].__EMPTY_1 !== undefined) ? dataVeDich[i].__EMPTY_1 : "",
                        noiDungB: (dataVeDich[i].__EMPTY_3 !== undefined) ? dataVeDich[i].__EMPTY_3 : "",
                        mediaURL: (dataVeDich[i].__EMPTY_2 !== undefined) ? "/host_media/" + dataVeDich[i].__EMPTY_2 : "",
                    });
                }

                // console.log(dataThuThach);
                // console.log(room[rm]["own_test"][3]);
                // console.log(dataKhoiDong[0].__EMPTY);
                // console.log(dataKhoiDong[0].__EMPTY_1);
                // console.log(dataKhoiDong);
                // console.log(dataDongHanh);
                // console.log(dataVeDich);x
            }
            let ls = [];
            for (let i in room[rm]){ //the veryfirst, never delete/replace
                if (players[i]){
                    room[rm]["list_of_players"].push(i);
                    ls.push(room[rm][i].name);
                }
            }
            console.log(ls);
            for (let i of room[rm]["list_of_players"]) {
                // console.log(i);
                io.to(i).emit('game_start', {player_list: ls});//notify players
            }
        });
        socket.on("get_options", data => {
            io.to(socket.id).emit('options', room[rm]["options"]);
        });
        socket.on('get_player_list', () => {
            let ls = [];//lấy danh sách người chơi
            for (let i of room[rm]["list_of_players"]){
                ls.push(room[rm][i].name);
            }
            socket.emit('game_start', {player_list: ls});//send player list to host
        });
        socket.on('playing_khoidong', data => {
            if (data.player_playing > 0 && data.player_playing <= room[rm]['list_of_players'].length){
                if (room[rm]["own_test"]){
                    room[rm]['questions'] = [];
                    // console.log(room[rm]["own_test"]);
                    room[rm]['state_of_questions_played'] = 0; //this is current-question in khoidong
                    question_index += 1;
                    let idx = (data.player_playing - 1) * 10;
                    for (let i = idx; i<Math.min(room[rm]["own_test"][0].length, 10 + idx); ++i){
                        room[rm]['questions'].push(room[rm]["own_test"][0][i]);
                    }
                    // room[rm]['questions'] = room[rm]["own_test"][0];
                    if (room[rm]['questions'].length){
                        room[rm]["playing"] = data.player_playing;
                        for (let i of room[rm]["list_of_players"]) {
                            io.to(i).emit('khoidong', {
                                first_question: room[rm]['questions'][0]["noiDungA"],
                                player_playing: data.player_playing,
                                number_of_players: room[rm]['list_of_players'].length,
                                player_score: room[rm][room[rm]['list_of_players'][data.player_playing - 1]].score
                            });//notify players  
                        }
                        socket.emit('khoidong', {
                            first_question: room[rm]['questions'][0],
                            player_score: room[rm][room[rm]['list_of_players'][data.player_playing - 1]].score
                        });//notify host
                    }
                    else {
                        socket.emit("full_khoidong_question");
                    }
                }
                else{
                    getOneRandomLinePerFile(path.join(__dirname, './backend_file/khoidong')).then(finalDataArray => {
                        // console.log(finalDataArray);
                        room[rm]['state_of_questions_played'] = 0; //this is current-question in khoidong
                        question_index += 1;
                        room[rm]['questions'] = finalDataArray;
                        room[rm]["playing"] = data.player_playing;
                        for (let i of room[rm]["list_of_players"]) {
                            io.to(i).emit('khoidong', {
                                first_question: room[rm]['questions'][0]["noiDungA"],
                                player_playing: data.player_playing,
                                number_of_players: room[rm]['list_of_players'].length,
                                player_score: room[rm][room[rm]['list_of_players'][data.player_playing - 1]].score
                            });//notify players  
                        }
                        socket.emit('khoidong', {
                            first_question: room[rm]['questions'][0],
                            player_score: room[rm][room[rm]['list_of_players'][data.player_playing - 1]].score
                        });//notify host
                    });
                }
            }
        });
        socket.on('correct_answer', data => {//player answered correctly, need to next question
            // let { player_playing, question_number } = data;
            // console.log(player_playing, question_number);
            let player_playing_id = room[rm]["list_of_players"][room[rm]["playing"] - 1];
            room[rm][player_playing_id].score += 10;
            room[rm][player_playing_id].combo += 1;
            if (room[rm][player_playing_id].combo === 5) {
                room[rm][player_playing_id].score += 20; //bonus for 5 correct answers in a row
                room[rm][player_playing_id].combo = 0;
                for (let i of room[rm]["list_of_players"]){
                    io.to(i).emit('bonus');
                }
                socket.emit('bonus');
            }
            room[rm]["state_of_questions_played"] += 1;
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit('correct_answer', {
                    player_playing: room[rm]["playing"],
                    play_score: room[rm][player_playing_id].score,
                    question_number: room[rm]["state_of_questions_played"]
                });//players
            }
            socket.emit('answer_correct', {
                player_playing: room[rm]["playing"],
                play_score: room[rm][player_playing_id].score
            });//host
            if (room[rm]["state_of_questions_played"] < 10){
                for (let i of room[rm]["list_of_players"]){
                    io.to(i).emit('next_question', {
                        next_question: room[rm]['questions'][room[rm]["state_of_questions_played"]]["noiDungA"]
                    });//more questions if not 10 questions
                }
                socket.emit('next_question', {
                    next_question: room[rm]['questions'][room[rm]["state_of_questions_played"]]
                });//host
            }
            else{
                for (let i of room[rm]["list_of_players"]){
                    io.to(i).emit('game_over');
                    room[rm][i].combo = 0;
                }
                socket.emit('game_over');
            }
        });
        socket.on('wrong_answer', data => {//player answered wrongly, need to next question
            // let { player_playing, question_number } = data;
            room[rm][room[rm]["list_of_players"][room[rm]["playing"] - 1]].combo = 0;
            room[rm]["state_of_questions_played"] += 1;
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit('wrong_answer', {
                    question_number: room[rm]["state_of_questions_played"]
                });//players
            }
            if (room[rm]["state_of_questions_played"] < 10){
                for (let i of room[rm]["list_of_players"]){
                    io.to(i).emit('next_question', {
                        next_question: room[rm]['questions'][room[rm]["state_of_questions_played"]]["noiDungA"]
                    });//more questions if not 10 questions
                }
                socket.emit('next_question', {
                    next_question: room[rm]['questions'][room[rm]["state_of_questions_played"]]
                });//host
            }
            else{
                for (let i of room[rm]["list_of_players"]){
                    io.to(i).emit('game_over');
                    room[rm][i].combo = 0;
                }
                socket.emit('game_over');
            }
        });

        socket.on('skip_answer', data => {//player answered wrongly, need to next question
            // let { player_playing, question_number } = data;
            room[rm][room[rm]["list_of_players"][room[rm]["playing"] - 1]].combo = 0;
            room[rm]["state_of_questions_played"] += 1;

            if (room[rm]["state_of_questions_played"] < 10) {
                for (let i of room[rm]["list_of_players"]){
                    io.to(i).emit('next_question', {
                        next_question: room[rm]['questions'][room[rm]["state_of_questions_played"]]["noiDungA"]
                    });
                }
                socket.emit('next_question', {next_question: room[rm]['questions'][room[rm]["state_of_questions_played"]]});
            }
            else{
                for (let i of room[rm]["list_of_players"]){
                    io.to(i).emit('game_over');
                    room[rm][i].combo = 0;
                }
                socket.emit('game_over');
            }
        });
        socket.on('time_up', data => {
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit('game_over');
                room[rm][i].combo = 0;
            }
            socket.emit('game_over');
        });




        //thuthach need phân quyền
        socket.on('change_mode_thuthach', data => {
            room[rm]["enable_bell"] = {};
            room[rm]['enable_bell']["turn"] = 1;
            room[rm]['enable_bell']["status"] = new Queue(); //push clicked socket id
            room[rm]['state_of_questions_played'] = [0, 0, 0, 0]; //only thuthach
            room[rm]['playing'] = null;
            room[rm]['answers'] = {};
            if (room[rm]["own_test"]){
                room[rm]['questions'] = room[rm]["own_test"][1];
                let crossword = [], k = room[rm]['questions'][0].replace(/\s+/g, ""), x="";
                if (/[a-zA-Z]/.test(k) && !/[0-9]/.test(k)) x = 'chữ cái';
                else if (!/[a-zA-Z]/.test(k) && /[0-9]/.test(k)) x = 'chữ số';
                else x = 'ký tự';
                crossword.push(k.length);
                for (let i = 1; i < 5; i++){
                    crossword.push(room[rm]['questions'][i]["noiDungB"].replace(/\s+/g, "").length);
                }
                socket.emit('thuthach_standby', {crossword: crossword, x: x});
                let idx = 0;
                for (let i of room[rm]["list_of_players"]) {
                    idx += 1;
                    room[rm]['enable_bell'][i] = [idx, 0];
                    room[rm][i].playable = true;
                    //initialize bell status for each player, idx is player_playing
                    // console.log(room[rm]['enable_bell'][i]);
                    io.to(i).emit('change_mode_thuthach', {
                        number_of_players: room[rm]["list_of_players"].length,
                        crossword: crossword, 
                        x: x
                    });//players
                }
            }
            else{
                getOneFiveLines().then(finalDataArray => {
                    room[rm]['questions'] = finalDataArray;
                    let crossword = [], k = room[rm]['questions'][0].replace(/\s+/g, ""), x="";
                    if (/[a-zA-Z]/.test(k) && !/[0-9]/.test(k)) x = 'chữ cái';
                    else if (!/[a-zA-Z]/.test(k) && /[0-9]/.test(k)) x = 'chữ số';
                    else x = 'ký tự';
                    crossword.push(k.length);
                    for (let i = 1; i < 5; i++){
                        crossword.push(room[rm]['questions'][i]["noiDungB"].replace(/\s+/g, "").length);
                    }
                    socket.emit('thuthach_standby', {crossword: crossword, x: x});
                    let idx = 0;
                    for (let i of room[rm]["list_of_players"]) {
                        idx += 1;
                        room[rm]['enable_bell'][i] = [idx, 0];
                        room[rm][i].playable = true;
                        //initialize bell status for each player, idx is player_playing
                        // console.log(room[rm]['enable_bell'][i]);
                        io.to(i).emit('change_mode_thuthach', {
                            number_of_players: room[rm]["list_of_players"].length,
                            crossword: crossword, 
                            x: x
                        });//players
                    }
                });
            }
            // for (let i of room[rm]["list_of_players"]){
            //     {
            //         getOneFiveLines().then(finalDataArray => {
            //             question_index += 1;
            //             room[rm][i]['question'] = finalDataArray;
            //             io.to(i).emit('change_mode_thuthach', {number_of_players: data.number_of_players});//players
            //         });
            //     }
            // }
        });
        socket.on('get_question_thuthach', data =>{
            //khi này room[rm]['playing'] là STT của câu hỏi thử thách, còn về đích là id người chơi
            if (data.question_number == 1 || data.question_number == 2 || data.question_number == 3 || data.question_number == 4){
                room[rm]['playing'] = data.question_number;
                room[rm]['state_of_questions_played'][data.question_number - 1] = 1;
                let media_link = room[rm]['questions'][data.question_number]["mediaURL"];
                if (media_link){
                    room[rm]["playable_media"] = media_link;
                    // media_link += "";
                }
                let k = room[rm]['questions'][data.question_number]["noiDungB"].replace(/\s+/g, "");
                let x = "";
                if (/[a-zA-Z]/.test(k) && !/[0-9]/.test(k)) x = 'chữ cái';
                else if (!/[a-zA-Z]/.test(k) && /[0-9]/.test(k)) x = 'chữ số';
                else x = 'ký tự';
                socket.emit('question_thuthach_getted', {
                    question_number: data.question_number,
                    question: room[rm]['questions'][data.question_number]["noiDungA"],
                    play_media: media_link ? media_link + "?token=" + socket.token: "",
                    play_extension: media_link? getFileExtension(media_link) : "",
                    cross: k.length,
                    x: x
                });
                for (let i of room[rm]["list_of_players"]) {
                    room[rm]['answers'][i] = ["", "", false];
                    io.to(i).emit('question_thuthach_getted', {
                        question_number: data.question_number,
                        question: room[rm]['questions'][data.question_number]["noiDungA"],
                        play_media: (media_link && room[rm]["options"].show_video_on_player)? media_link + "?token=" + io.sockets.sockets.get(i).token: "",
                        play_extension: media_link? getFileExtension(media_link) : "",
                        cross: k.length,
                        x: x
                    });//players
                }
            }
        });

        socket.on('run_thuthach', data =>{
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit('run_thuthach');
            }
        })
        socket.on('answer_timed_thuthach', data =>{
            if (players[data.id]){
                if (data.time < 15000 && data.time > 0){
                    room[rm]['answers'][data.id][0] = room[rm]['answers'][data.id][0].replace(/\s+/g, "").toUpperCase();
                    room[rm]['answers'][data.id][1] =  "" + (parseInt(data.time / 1000) + 1);
                }
                else room[rm]['answers'][data.id][0] = "";
            }
            // else delete(room[rm]['answers'][data.id]);
        });
        socket.on('time_up_thuthach', data =>{
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit('time_up_thuthach');
            }
            socket.emit('time_up_thuthach_host');
        });

        socket.on('show_player_answer_thuthach', data =>{ //Vừa show vừa check đáp án
            let answer_list = [], s = room[rm]['questions'][room[rm]['playing']]["noiDungB"];
            let k = s.replace(/\s+/g, "").toUpperCase();
            // console.log(k);
            k = removeVietnameseTones("" + k);
            for (let i in room[rm]['answers']){
                if (room[rm]['answers'][i][0] === k){
                    room[rm]['answers'][i][2] = true;
                }
                answer_list.push([room[rm][i].name, room[rm]['answers'][i][0], room[rm]['answers'][i][1]]);
            }
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit('show_player_answer_thuthach', {answer_list: answer_list});
            }
            socket.emit('show_player_answer_thuthach_host', {answer_list: answer_list, ans: s});
        });

        socket.on('check_answer_thuthach', data =>{
            let answer_state = [],
            new_score = [], answer = "",
            x = room[rm]['questions'][room[rm]['playing']]["noiDungB"].replace(/\s+/g, "").toUpperCase().length;//x is number of ans, not string

            for (let i in room[rm]['answers']){
                if (room[rm]['answers'][i][2]){
                    answer = room[rm]['answers'][i][0];
                    let k = 0;
                    if (room[rm]['answers'][i][1] <= 5) k = 30;
                    else if(room[rm]['answers'][i][1] <= 10) k = 20;
                    else k = 10;
                    room[rm][i].score += k;
                    answer_state.push(k);
                }
                else answer_state.push(0);
                new_score.push(room[rm][i].score);
            }
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit('check_answer_thuthach', {
                    answer_state: answer_state,
                    answer: answer,
                    cross_length: x,
                    new_score: new_score,
                    question_number: room[rm]['playing'],
                });
            }
            socket.emit('check_answer_thuthach_host', {
                answer_state: answer_state,
                answer: answer,
                cross_length: x,
                new_score: new_score,
                question_number: room[rm]['playing'],
            });
        });

        socket.on('unshow_player_answer_thuthach', data => {
            for(let i of room[rm]["list_of_players"]){
                io.to(i).emit('unshow_player_answer_thuthach');
            }
            if (room[rm]['enable_bell']['status'].queue_size())
                socket.emit('unshow_player_answer_thuthach_host', {ans: room[rm]['questions'][0]}); //Nếu có người bấm chuông chủ đề thì mới gửi về host
        });

        socket.on('thuthach_correct_answer', data =>{ //showchude, congdiem, endgame, disable bamgio, 
            if (room[rm]['enable_bell']['status'].queue_size()){
                let k = 0,
                ans = room[rm]['questions'][0].replace(/\s+/g, "").toUpperCase(),
                player = room[rm]['enable_bell']['status'].front();
                ans = removeVietnameseTones("" + ans);
                for (let i in room[rm]['state_of_questions_played']) k += room[rm]['state_of_questions_played'][i];
                if (k === 1){
                    room[rm][room[rm]['enable_bell']['status'].front()]['score'] += 60;
                }
                else if (k === 2){
                    room[rm][room[rm]['enable_bell']['status'].front()]['score'] += 50;
                }
                else if (k === 3){
                    room[rm][room[rm]['enable_bell']['status'].front()]['score'] += 40;
                }
                else{
                    room[rm][room[rm]['enable_bell']['status'].front()]['score'] += 20;
                }
                room[rm]['enable_bell']['status'] = new Queue();
                // socket.emit('no_bell_thuthach');
                let ls = [];//lấy danh sách người chơi
                for (let i of room[rm]["list_of_players"]){
                    ls.push(room[rm][i].name);
                }
                for (let i of room[rm]["list_of_players"]){
                    room[rm][i].playable = false;
                    io.to(i).emit('thuthach_correct_answer', {
                        cross_length: ans.length,
                        answer: ans,
                        player_playing: room[rm]['enable_bell'][player][0],
                        player_score: room[rm][player].score,
                        list_of_player_names: ls,
                        number_of_players: room[rm]["list_of_players"].length,
                    });
                }
                socket.emit('thuthach_correct_answer_host', {
                    cross_length: ans.length,
                    answer: ans,
                    player_playing: room[rm]['enable_bell'][player][0],
                    player_score: room[rm][player].score,
                    list_of_player_names: ls,
                    number_of_players: room[rm]["list_of_players"].length,
                });
            }
            else{
                socket.emit('no_bell_thuthach');
            }
        });

        socket.on('thuthach_wrong_answer', data =>{
            if (room[rm]['enable_bell']['status'].queue_size()){
                let k = room[rm]['enable_bell']['status'].front();
                room[rm][k].playable = false;
                room[rm]['enable_bell']['status'].pop_front();
                for (let i of room[rm]["list_of_players"]){
                    // console.log(room[rm][i].playable);
                    io.to(i).emit('thuthach_wrong_answer', {
                        player_name: room[rm][k].name,
                        player_playing: room[rm]['enable_bell'][k][0],
                        each_player_state: room[rm][i].playable,
                    });
                }
                socket.emit('thuthach_wrong_answer_host', {
                    player_name: room[rm][k].name,
                    player_playing: room[rm]['enable_bell'][k][0],
                });
                if (!room[rm]['enable_bell']['status'].queue_size()) socket.emit('no_bell_thuthach');
            }
            else{
                socket.emit('no_bell_thuthach');
            }
        });


        //-----------------------------------------------------------------------


        socket.on("change_mode_donghanh", data =>{
            // let k = 0;
            // for (let i of room[rm]["list_of_players"]) k += 1;
            room[rm]['answers'] = "(Không có câu trả lời)";
            for (let i of room[rm]["list_of_players"]){
                room[rm][i].combo = 0;
                io.to(i).emit('change_mode_donghanh', {number_of_players: room[rm]["list_of_players"].length});//players
            }
            socket.emit("change_mode_donghanh_host", {number_of_players: room[rm]["list_of_players"].length});//host
        });

        socket.on('get_question_donghanh', data => {
            if (data.player_playing > 0 && data.player_playing <= room[rm]['list_of_players'].length){
                if (room[rm]["own_test"]){
                    question_index += 1;
                    room[rm]['questions'] = [];
                    let idx = (data.player_playing - 1) * 5;
                    //for (let i = idx; i<Math.min(room[rm]["own_test"][0].length - idx, 10 + idx); ++i){
                    for (let i = idx; i<Math.min(room[rm]["own_test"][2].length, 5 + idx); ++i){
                        room[rm]['questions'].push(room[rm]["own_test"][2][i]);
                    }
                    room[rm]["playing"] = data.player_playing;
                    room[rm]['state_of_questions_played'] = 0;
                    let player_playing_id = room[rm]["list_of_players"][data.player_playing - 1];
                    for (let i of room[rm]["list_of_players"]) {
                        io.to(i).emit('get_question_donghanh', {
                            player_playing: data.player_playing,
                            number_of_players: room[rm]['list_of_players'].length,
                            first_question: room[rm]['questions'][0]["noiDungA"],
                            player_score: room[rm][player_playing_id].score,
                        });
                    }
                    socket.emit('get_question_donghanh_host', {
                        first_question: room[rm]['questions'][0]["noiDungA"],
                        player_score: room[rm][player_playing_id].score
                    });                    
                }
                else{
                    getFileDongHanh().then(finalDataArray => {
                        question_index += 1;
                        room[rm]['questions'] = finalDataArray;
                        room[rm]["playing"] = data.player_playing;
                        room[rm]['state_of_questions_played'] = 0;
                        let player_playing_id = room[rm]["list_of_players"][data.player_playing - 1];
                        for (let i of room[rm]["list_of_players"]) {
                            io.to(i).emit('get_question_donghanh', {
                                player_playing: data.player_playing,
                                first_question: room[rm]['questions'][0]["noiDungA"],
                                player_score: room[rm][player_playing_id].score,
                            });
                        }
                        socket.emit('get_question_donghanh_host', {
                            first_question: room[rm]['questions'][0]["noiDungA"],
                            player_score: room[rm][player_playing_id].score
                        });
                    });
                }
            }
        });

        socket.on("run_donghanh", data => {
            // let player_playing_id = room[rm]["list_of_players"][room[rm]["playing"] - 1];
            for (let i of room[rm]["list_of_players"]) {
                let s = false;
                if (room[rm]["list_of_players"][room[rm]["playing"] - 1] === i) s = true;
                // console.log(s);
                io.to(i).emit('run_donghanh', {
                    is_playing: s,
                    // player_playing: room[rm]["playing"],
                    // first_question: room[rm]['questions'][0],
                    // player_score: room[rm][player_playing_id].score,
                });
            }
        });


        socket.on('answer_timed_donghanh', data => {
            if (data.time >= 10000 || data.time <= 0) room[rm]['answers'] = "(Không có câu trả lời)";
            // console.log(room[rm]['answers']);
            // console.log(room[rm]["answers"]);
        });

        socket.on('time_up_donghanh', data => {
            // console.log(room[rm]["answers"]);
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit("time_up_donghanh", {
                    player_answer: room[rm]["answers"]
                });
            }
            socket.emit("time_up_donghanh_host", {
                player_answer: room[rm]["answers"],
                actual_answer: room[rm]["questions"][room[rm]['state_of_questions_played']]["noiDungB"]
                    //                 room[rm]['questions'] = finalDataArray;
                    // room[rm]["playing"] = data.player_playing;
                    // room[rm]['state_of_questions_played'] = 0;
            });
        });

        socket.on("correct_answer_donghanh", data => {
            let player_playing_id = room[rm]['list_of_players'][room[rm]["playing"] - 1];
            room[rm][player_playing_id].score += 20;
            room[rm][player_playing_id].combo += 1;
            if (room[rm][player_playing_id].combo === 5){
                room[rm][player_playing_id].score += 30;
            }
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit("correct_answer_donghanh", {
                    player_score: room[rm][player_playing_id].score,
                    player_playing: room[rm]["playing"],
                });
            }
            socket.emit("correct_answer_donghanh_host", {
                player_score: room[rm][player_playing_id].score,
                player_playing: room[rm]["playing"],
            });
        });

        socket.on("wrong_answer_donghanh", data => {
            let player_playing_id = room[rm]['list_of_players'][room[rm]["playing"] - 1];
            room[rm][player_playing_id].combo = 0;
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit("wrong_answer_donghanh");
            }
            socket.emit("wrong_answer_donghanh_host");
        });

        socket.on("next_question_donghanh", data =>{
            if (room[rm]['state_of_questions_played'] < 4){
                room[rm]['state_of_questions_played'] += 1;
                room[rm]['answers'] = "(Chưa có câu trả lời)";
                for (let i of room[rm]["list_of_players"]) {
                    io.to(i).emit('next_question_donghanh', {
                        // player_playing: data.player_playing,
                        next_question: room[rm]['questions'][room[rm]['state_of_questions_played']]["noiDungA"],
                    });
                }
                socket.emit('next_question_donghanh_host', {
                    next_question: room[rm]['questions'][room[rm]['state_of_questions_played']]["noiDungA"],
                });
            }
        });

        //--------------------------------------------------------------------------------------
        socket.on('change_mode_vedich', data => {
            room[rm]['questions'] = {};
            for (let i of type_question){
                room[rm]['questions'][i] = new Queue();
            }
            room[rm]["enable_bell"] = false;
            if (room[rm]["own_test"]){
                room[rm]['questions'] = room[rm]["own_test"][3];
                for (let i of room[rm]["list_of_players"]){
                    room[rm][i].star = 0;
                    io.to(i).emit('change_mode_vedich', {
                        number_of_players: room[rm]["list_of_players"].length
                    });//players
                }
            }
            else{
                for (let i of room[rm]["list_of_players"]){
                    room[rm][i].star = 0;
                    getOneRandomLinePerFile(path.join(__dirname, './backend_file/vedich')).then(finalDataArray => {
                        question_index += 1;
                        // room[rm][i]['question'] = finalDataArray;
                        for (let i in finalDataArray){
                            // console.log(i);
                            // console.log(finalDataArray[i]);
                            room[rm]['questions'][type_question[i]].push_back(finalDataArray[i]);
                        }
                        // console.log(room[rm]['questions']);
                        io.to(i).emit('change_mode_vedich', {
                            number_of_players: room[rm]["list_of_players"].length
                        });//players
                    });
                }
            }
        });
        socket.on('playing_vedich', data => {
            if (data.player_playing > 0 && data.player_playing <= room[rm]['list_of_players'].length) {
                let played_questions = [], star_question = null;
                room[rm]["playing"] = data.player_playing;
                room[rm]['answers'] = []; //room[rm]['answers']
                for (let i of type_question){
                    if (i in room[rm][room[rm]["list_of_players"][data.player_playing - 1]]){
                        if (room[rm][room[rm]["list_of_players"][data.player_playing - 1]][i] === 1) played_questions.push(i);
                        else if (room[rm][room[rm]["list_of_players"][data.player_playing - 1]][i] === 2) star_question = i;
                    }
                    
                }
                // console.log(room[rm][data.player_playing_id]);
                // console.log(played_questions);
                // console.log(star_question);
                for (let i of room[rm]["list_of_players"]) {
                    io.to(i).emit('vedich', {
                        player_playing: data.player_playing,
                        number_of_players: room[rm]['list_of_players'].length,
                        player_score: room[rm][room[rm]["list_of_players"][data.player_playing - 1]].score,
                        played_questions: played_questions,
                        star_question: star_question,
                    });//notify players
                }
                socket.emit('vedich', {
                    player_playing: data.player_playing,
                    number_of_players: room[rm]['list_of_players'].length,
                    player_score: room[rm][room[rm]["list_of_players"][data.player_playing - 1]].score,
                    played_questions: played_questions,
                    star_question: star_question,                
                });
            }
        });
        socket.on('get_question_vedich', data =>{
            for (let i in type_question){
                if (type_question[i] === data.question_name){
                    if (!room[rm]['questions'][type_question[i]].queue_size()){
                        socket.emit("full_vedich_question");
                    }
                    else{
                        room[rm]['state_of_questions_played'] = type_question[i];
                        let player_playing_id = room[rm]["list_of_players"][room[rm]["playing"] - 1];
                        // for (let j in room[rm]) {
                        //     if (players[j]) io.to(j).emit({
                        //     });//notify players
                        // }
                        // break;
                        // console.log(room[rm][data.player_playing]['question'][i]);
                        if (type_question[i] in room[rm][player_playing_id]) socket.emit('reject_question');
                        else if (room[rm][player_playing_id].star){ //nếu có sao r thì thôi
                            room[rm][player_playing_id][type_question[i]] = 1;
                            let task = room[rm]['questions'][type_question[i]].front();
                            if (task["mediaURL"]){
                                room[rm]["playable_media"] = task["mediaURL"];
                            }
                            room[rm]['questions'][type_question[i]].pop_front();
                            for (let j of room[rm]["list_of_players"]){
                                io.to(j).emit('next_question_vedich', {
                                    next_question: task["noiDungA"],
                                    next_media: (task["mediaURL"] && room[rm]["options"].show_video_on_player)? task["mediaURL"] + "?token=" + io.sockets.sockets.get(j).token : "",
                                    next_extension: task["mediaURL"]? getFileExtension(task["mediaURL"]) : "",
                                });
                            }
                            socket.emit('next_question_vedich', {
                                next_question: task["noiDungA"],
                                next_answer: task["noiDungB"],
                                next_media: task["mediaURL"]? task["mediaURL"] + "?token=" + socket.token : "",
                                next_extension: task["mediaURL"]? getFileExtension(task["mediaURL"]) : "",
                            });
                        }    
                        else socket.emit('need_star', {question_name: type_question[i]});
                    }
                    break;
                }
            }
        });
        socket.on('co_ngoi_sao', data=>{
            for (let i in type_question){
                if (type_question[i] === room[rm]['state_of_questions_played']){
                    let player_playing_id = room[rm]["list_of_players"][room[rm]["playing"] - 1];
                    room[rm][player_playing_id].star = 1;
                    room[rm][player_playing_id][type_question[i]] = 2;
                    //console.log(room[rm]['questions'][type_question[i]]);
                    let task = room[rm]['questions'][type_question[i]].front();
                    if (task["mediaURL"]){
                        room[rm]["playable_media"] = task["mediaURL"];
                    }
                    room[rm]['questions'][type_question[i]].pop_front();
                    for (let j of room[rm]["list_of_players"]){
                        io.to(j).emit('next_question_vedich', {
                            next_question: task["noiDungA"],
                            next_media: (task["mediaURL"] && room[rm]["options"].show_video_on_player)? task["mediaURL"] + "?token=" + io.sockets.sockets.get(j).token : "",
                            next_extension: task["mediaURL"]? getFileExtension(task["mediaURL"]) : "",
                        });
                    }
                    socket.emit('next_question_vedich', {
                        next_question: task["noiDungA"],
                        next_answer: task["noiDungB"],
                        next_media: task["mediaURL"]? task["mediaURL"] + "?token=" + socket.token : "",
                        next_extension: task["mediaURL"]? getFileExtension(task["mediaURL"]) : "",
                    });
                    break;
                }
            }
        });
        socket.on('khong_co_ngoi_sao', data=>{
            for (let i in type_question){
                if (type_question[i] === room[rm]['state_of_questions_played']){
                    let player_playing_id = room[rm]["list_of_players"][room[rm]["playing"] - 1];
                    room[rm][player_playing_id][type_question[i]] = 1;
                    // console.log(room[rm][data.player_playing]);
                    //console.log(room[rm]['questions'][type_question[i]])
                    let task = room[rm]['questions'][type_question[i]].front();
                    if (task["mediaURL"]){
                        room[rm]["playable_media"] = task["mediaURL"];
                    }
                    room[rm]['questions'][type_question[i]].pop_front();
                    for (let j of room[rm]["list_of_players"]){
                        io.to(j).emit('next_question_vedich', {
                            next_question: task["noiDungA"],
                            next_media: (task["mediaURL"] && room[rm]["options"].show_video_on_player)? task["mediaURL"] + "?token=" + io.sockets.sockets.get(j).token : "",
                            next_extension: task["mediaURL"]? getFileExtension(task["mediaURL"]) : "",
                        });
                    }
                    socket.emit('next_question_vedich', {
                        next_question: task["noiDungA"],
                        next_answer: task["noiDungB"],
                        next_media: task["mediaURL"]? task["mediaURL"] + "?token=" + socket.token : "", 
                        next_extension: task["mediaURL"]? getFileExtension(task["mediaURL"]) : "",
                    });
                    break;
                }
            }
        });
        socket.on('run_vedich', data =>{
            for (let i of room[rm]["list_of_players"]){
                io.to(i).emit('run_vedich');
            }
        })
        socket.on('correct_answer_vedich', data =>{
            let player_playing_id = room[rm]["list_of_players"][room[rm]["playing"] - 1];
            for (let i in type_question){
                if (type_question[i] === room[rm]['state_of_questions_played']){
                    // console.log(room[rm][player_playing_id].star);
                    if (room[rm][player_playing_id].star === 1){
                        room[rm][player_playing_id].score += score_question[i] * 2;
                        room[rm][player_playing_id].star = 2;
                    }
                    else room[rm][player_playing_id].score += score_question[i];
                    break;
                }
            }
            for (let i of room[rm]["list_of_players"]) {
                io.to(i).emit('next_player_vedich', {
                    player_playing: room[rm]["playing"],
                    play_score: room[rm][player_playing_id].score,
                    take_score: null,
                });//notify players
            }
            socket.emit('next_player_vedich', {
                player_playing: room[rm]["playing"],
                number_of_players: room[rm]['list_of_players'].length,
                play_score: room[rm][player_playing_id].score,
                take_score: null,
            });
        });
        socket.on('wrong_answer_vedich', data =>{
            let player_playing_id = room[rm]["list_of_players"][room[rm]["playing"] - 1];
            for (let i in type_question){
                if (type_question[i] === room[rm]['state_of_questions_played']){
                    if (room[rm][player_playing_id].star === 1){
                        // console.log(room[rm][room[rm]["playing"]].score);
                        room[rm][player_playing_id].score = Math.max(room[rm][player_playing_id].score - score_question[i], 0);
                        // console.log(room[rm][player_playing_id].score);
                        // console.log(room[rm][player_playing_id].star);
                        // room[rm][data.player_playing].star = 2;
                        // console.log(room[rm][room[rm]["playing"]].score);
                    }
                }
            }
            room[rm]["enable_bell"] = true;
            for (let i of room[rm]["list_of_players"]) {
                io.to(i).emit('bell_enabled');
                    //io.to(i).emit('next_player_vedich', {play_score: room[rm][data.player_playing].score});//notify players
            }
            socket.emit('bell_enabled');
            // socket.emit('next_player_vedich', {play_score: room[rm][data.player_playing].score});
        });
        socket.on('cuop_diem_vedich_correct', data => {
            let player_playing_id = room[rm]["list_of_players"][room[rm]["playing"] - 1];
            for (let i in type_question){
                if (type_question[i] === room[rm]['state_of_questions_played']){
                    room[rm][room[rm]['answers'][0]].score += score_question[i]/2;
                    if (room[rm][player_playing_id].star !== 1){
                        // console.log(room[rm][player_playing_id].star);
                        room[rm][player_playing_id].score = Math.max(room[rm][player_playing_id].score - score_question[i] / 2, 0);
                    }
                    else room[rm][player_playing_id].star = 2;
                }
            }
            let k = 0;
            for (let i of room[rm]["list_of_players"]){
                k += 1;
                if (i === room[rm]['answers'][0]) break;
            }
            // console.log(room[rm]['answers']);
            // console.log(room[rm][room[rm]['answers'][0]]);
            for (let i of room[rm]["list_of_players"]) {
                io.to(i).emit('next_player_vedich', {
                    player_playing: room[rm]["playing"],
                    number_of_players: room[rm]['list_of_players'].length,
                    play_score: room[rm][player_playing_id].score,
                    take_score: [k, room[rm][room[rm]['answers'][0]].score]
                });//notify players
            }
            socket.emit('next_player_vedich', {
                player_playing: room[rm]["playing"],
                number_of_players: room[rm]['list_of_players'].length,
                play_score: room[rm][player_playing_id].score,
                take_score: [k, room[rm][room[rm]['answers'][0]].score]
            });    
        });
        socket.on('cuop_diem_vedich_wrong', data => {
            let player_playing_id = room[rm]["list_of_players"][room[rm]["playing"] - 1];
            for (let i in type_question){
                if (type_question[i] === room[rm]['state_of_questions_played']){
                    room[rm][room[rm]['answers'][0]].score = Math.max(room[rm][room[rm]['answers'][0]].score - score_question[i]/2, 0);
                    if (room[rm][player_playing_id].star === 1) room[rm][player_playing_id].star = 2;
                }
            }
            let k = 0;
            for (let i of room[rm]["list_of_players"]){
                k += 1;
                if (i === room[rm]['answers'][0]) break;
            }
            for (let i of room[rm]["list_of_players"]) {
                io.to(i).emit('next_player_vedich', {
                    player_playing: room[rm]["playing"],
                    number_of_players: room[rm]['list_of_players'].length,
                    play_score: room[rm][player_playing_id].score,
                    take_score: [k, room[rm][room[rm]['answers'][0]].score]
                });//notify players
            }
            socket.emit('next_player_vedich', {
                player_playing: room[rm]["playing"],
                number_of_players: room[rm]['list_of_players'].length,
                play_score: room[rm][player_playing_id].score,
                take_score: [k, room[rm][room[rm]['answers'][0]].score]
            });    
        });
        socket.on('time_up_cuopdiem', data =>{//làm sao đó để bấm chuông r ko kích hoạt hàm này nx
            if (room[rm]['answers'].length === 0 && room[rm]["enable_bell"]){
                room[rm]["enable_bell"] = false;
                let player_playing_id = room[rm]["list_of_players"][room[rm]["playing"] - 1];
                if (room[rm][player_playing_id].star === 1) room[rm][player_playing_id].star = 2;
                for (let i of room[rm]["list_of_players"]) {
                    io.to(i).emit('next_player_vedich', {
                        player_playing: room[rm]["playing"],
                        number_of_players: room[rm]['list_of_players'].length,
                        play_score: room[rm][player_playing_id].score,
                        take_score: null
                    });//notify players
                }
                socket.emit('next_player_vedich', {
                    player_playing: room[rm]["playing"],
                    number_of_players: room[rm]['list_of_players'].length,
                    play_score: room[rm][player_playing_id].score,
                    take_score: null
                });
            }
        })
        //host disconnect
        socket.on('disconnect', async data => {
            try{
                socket.token = null;    
                for (let i in room[hosts[socket.id].room_code]) {
                    if (players[i]) socket.to(i).emit('removed_by_host');
                }
                delete room[hosts[socket.id].room_code];
                await fs.rm(path.join(__dirname, "media_from_hosts", hosts[socket.id].room_code), {
                    recursive: true,
                    force: true
                });
            }
            catch (err) {
                console.error("Lỗi khi xóa thư mục:", err);
            }
            finally {
                delete hosts[socket.id];
                console.log('Host disconnected:', socket.id);
                console.log('- Number of hosts:', Object.keys(hosts).length);
            }
            
        });
        return;
    }
    console.log('User connected:', socket.id);
    // console.log('- Number of players:', Object.keys(players).length);
    socket.token = crypto.randomUUID(); //token là hàng tự đặt ra
    socket.on('player_joining', data => {
        if (data.code.length === 6 && room[data.code] && room[data.code]["list_of_players"].length === 0) {
            room[data.code][socket.id] = {
                id: socket.id,
                name: data.play_name,
                score: 0,
                combo: 0, //for khoidong, donghanh
                star: 0, //for vedich
                playable: true, //for thuthach
            };
            players[socket.id] = data.code;
            io.to(socket.id).emit('player_joined', { success: true, code: data.code , play_name: data.play_name });//confirm joining
            io.to(room[data.code]["host"]).emit('new_player', { play_id: socket.id, play_name: data.play_name });//send to host
        }
        else{
            io.to(socket.id).emit('player_joined', { success: false });//reject joining
        }
    });

    socket.on("get_options", data => {
        io.to(socket.id).emit('options', room[players[socket.id]]["options"]);
    });

    socket.on('answer_submitted_thuthach', data =>{
        if (data.answer.trim() && room[players[socket.id]][socket.id].playable){
            room[players[socket.id]]['answers'][socket.id] = [data.answer, ""]
            io.to(room[players[socket.id]]["host"]).emit('answer_submitted_thuthach', {
                id: socket.id,
            });
        }
    });

    socket.on('bell_clicked_thuthach', data =>{
        if (room[players[socket.id]]["enable_bell"][socket.id][1] === 0
            && room[players[socket.id]][socket.id].playable
            && room[players[socket.id]]["playing"]){
            // room[players[socket.id]][socket.id].playable = false;
            room[players[socket.id]]["enable_bell"][socket.id][1] = room[players[socket.id]]["enable_bell"]["turn"];
            room[players[socket.id]]["enable_bell"]["turn"] += 1;
            room[players[socket.id]]["enable_bell"]["status"].push_back(socket.id);
            // console.log(room[players[socket.id]]["enable_bell"]);
            io.to(room[players[socket.id]]["host"]).emit('player_clicked_bell_thuthach', {
                turn_number: room[players[socket.id]]["enable_bell"][socket.id][1],
                player_name: room[players[socket.id]][socket.id].name,
                player_playing: room[players[socket.id]]["enable_bell"][socket.id][0],
            });
            for (let i of room[players[socket.id]]["list_of_players"]){
                io.to(i).emit('player_clicked_bell_thuthach', {
                    turn_number: room[players[socket.id]]["enable_bell"][socket.id][1],
                    player_name: room[players[socket.id]][socket.id].name,
                    player_playing: room[players[socket.id]]["enable_bell"][socket.id][0],
                });
            }
        }
    });


    socket.on('answer_submitted_donghanh', data => {
        if (data.answer.trim() &&
        room[players[socket.id]]['list_of_players'][room[players[socket.id]]['playing'] - 1] === socket.id){
            room[players[socket.id]]['answers'] = data.answer;
            io.to(room[players[socket.id]]["host"]).emit('answer_submitted_donghanh');
        }
    })


    socket.on('bell_clicked_vedich', data =>{
        if (room[players[socket.id]]["enable_bell"]
            && socket.id !== room[players[socket.id]]["list_of_players"][room[players[socket.id]]["playing"] - 1]){
            room[players[socket.id]]["enable_bell"] = false;
            room[players[socket.id]]['answers'].push(socket.id); //question push player id in vedich
            // console.log(socket.id);
            // console.log(room[players[socket.id]]["questions"]);
            let k = 0;
            for (let i of room[players[socket.id]]["list_of_players"]){
                k += 1;
                if (i === room[players[socket.id]]['answers'][0]) break;
            }
            io.to(room[players[socket.id]]["host"]).emit('player_clicked', {player_playing: k});
            for (let i of room[players[socket.id]]["list_of_players"]){
                io.to(i).emit('player_clicked', {player_playing: k});
            }
        }
        //cần if cái socker id của thg đang chơi
        // room[players[data.player_playing_id]]["questions"].push(player_playing_id);
    });
    //player disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (players[socket.id] in room && room[players[socket.id]]["list_of_players"].length === 0){
            delete room[players[socket.id]][socket.id];
            //delete player from play room if exists
            io.to(room[players[socket.id]]["host"]).emit('player_left', { play_id: socket.id });//send to host
        }
        socket.token = null;
        delete players[socket.id];
    });    
});

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Se vơ đang chạy trên pốt ${PORT}. Hế lô xin chào các vị huynh đài`);
// });
server.listen(3000, "0.0.0.0", () => {
    console.log("Se vơ đang chạy trên pốt ba nghìn. Hế lô xin chào các vị huynh đài");
});
app.get('/host', (req, res) => {
    res.sendFile(__dirname + '/public/host.html');
});
app.get('/out_media/:name', (req, res) => {
    let { token } = req.query;

    let use_socket = [...io.sockets.sockets.values()]
        .find(s => s.token === token);

    if (!use_socket) {
        return res.status(403).send("Invalid token");
    }
    console.log("Use media:", use_socket.id);
    if (hosts[use_socket.id]){
        // console.log(room[hosts[use_socket.id].room_code]["playable_media"]);
        if (room[hosts[use_socket.id].room_code]["own_test"]){
            return res.status(403).send("Invalid token");
        }
        if ("/out_media/" + req.params.name !== room[hosts[use_socket.id].room_code]["playable_media"])
            return res.status(403).send("Invalid token");
    }
    else if (players[use_socket.id]){
        // console.log(room[players[use_socket.id]]["playable_media"]);
        if (room[players[use_socket.id]]["own_test"]){
            return res.status(403).send("Invalid token");
        }
        if ("/out_media/" + req.params.name !== room[players[use_socket.id]]["playable_media"])
            return res.status(403).send("Invalid token");
    }
    else{
        return res.status(403).send("Invalid token");
    }
        // console.log()
        // console.log(req.params.name);
    res.sendFile(path.join(__dirname, 'backend_file', 'file_ngoai_cauhoi', req.params.name));
});

app.get('/host_media/:name', (req, res) => {
    let { token } = req.query;

    let use_socket = [...io.sockets.sockets.values()]
        .find(s => s.token === token);

    if (!use_socket) {
        return res.status(403).send("Invalid token");
    }
    console.log("Use media:", use_socket.id);
    let send_rm = 0;
    if (hosts[use_socket.id]){
        send_rm = hosts[use_socket.id].room_code;
        // console.log(room[send_rm]["playable_media"]);
        // console.log(room[send_rm]["own_test"]);
        if (!room[send_rm]["own_test"]){
            // console.log("?");
            return res.status(403).send("Invalid token");
        }
        if ("/host_media/" + req.params.name !== room[send_rm]["playable_media"]){
            // console.log("??");
            return res.status(403).send("Invalid token");
        }
    }
    else if (players[use_socket.id]){
        send_rm = players[use_socket.id];
        // console.log(room[send_rm]["playable_media"]);
        // console.log(room[send_rm]["own_test"]);
        if (!room[send_rm]["own_test"]){
            return res.status(403).send("Invalid token");
        }
        if ("/host_media/" + req.params.name !== room[send_rm]["playable_media"]){
            return res.status(403).send("Invalid token");
        }
    }
    else{
        return res.status(403).send("Invalid token");
    }
        // console.log()
        // console.log(req.params.name);
    res.sendFile(path.join(__dirname, 'media_from_hosts', send_rm , req.params.name));
});

//Chạy thử thì chỉ đc chạy mỗi http://127.0.0.1:3000 thôi, miễn 1 ngày 1 IP đi!!!!!!
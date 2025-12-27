import * as CryptoJS from 'crypto-js'
// import * as Fetch from 'fetch'
import axios from 'axios'
// import lamejs from 'lamejs'
// import ffmpeg from "ffmpeg.js";
// import * as ffmpeg from '@ffmpeg/ffmpeg';


let iatWS;
let resultText = "";
let resultTextTemp = "";
let lastWsData = []
let resultHandle = null

// 系统配置 
const config = {
    // 请求地址
    hostUrl: "wss://ise-api.xfyun.cn/v2/open-ise",
    hostUrlSoundToText: "wss://iat-api.xfyun.cn/v2/iat",
    host: "iat-api.xfyun.cn",
    //在控制台-我的应用-语音评测（流式版）获取
    appid: "145d2560",
    //在控制台-我的应用-语音评测（流式版）获取
    apiSecret: "MTM3ZWQ2Y2Y4ZmEyMTEwYWVmMDg3NmRk",
    //在控制台-我的应用-语音评测（流式版）获取
    apiKey: "4c75d2411acf143f4145ba8b72a03bdc",
    uri: "/v2/open-ise",
    uriSoundToText: "/v2/iat",
    highWaterMark: 1280,
}




 /**
   * 获取websocket url
   * 该接口需要后端提供，这里为了方便前端处理
   */
  function getWebSocketUrl() {
    // 请求地址根据语种不同变化
    var url = "wss://iat-api.xfyun.cn/v2/iat";
    var host = "iat-api.xfyun.cn";
    var apiKey = config.apiKey;
    var apiSecret = config.apiSecret;
    var date = new Date().toGMTString();
    var algorithm = "hmac-sha256";
    var headers = "host date request-line";
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    var signature = CryptoJS.enc.Base64.stringify(signatureSha);
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    var authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    return url;
}





function toString(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return binary;
  }

function renderResult(resultData) {
    // 识别结束
    let jsonData = JSON.parse(resultData);
    if (jsonData.data && jsonData.data.result) {
      let data = jsonData.data.result;
      let str = "";
      let ws = data.ws;
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w;
      }
      // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
      // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
      if (data.pgs) {
        if (data.pgs === "apd") {
          // 将resultTextTemp同步给resultText
          resultText = resultTextTemp;
        }else{
            if(data.rst == 'rlt'){
                console.log('有时间点的识别结果', data)
                lastWsData = lastWsData.concat(data.ws)
            }
        }
        // 将结果存储在resultTextTemp中
        resultTextTemp = resultText + str;
      } else {
        resultText = resultText + str;
      }
    //   console.log('识别结果', resultTextTemp)
    //   document.getElementById("result").innerText =
    //     resultTextTemp || resultText || "";
    }
    if (jsonData.code === 0 && jsonData.data.status === 2) {
      iatWS.close();
      //返回结果
      if(resultHandle != null){
        resultHandle(lastWsData)
      }
    }
    if (jsonData.code !== 0) {
      iatWS.close();
      console.error(jsonData);
      if(resultHandle != null){
        resultHandle(lastWsData)
      }
    }
}

function connectWebSocket(callback) {
    const websocketUrl = getWebSocketUrl();
    if ("WebSocket" in window) {
      iatWS = new WebSocket(websocketUrl);
    } else if ("MozWebSocket" in window) {
      iatWS = new MozWebSocket(websocketUrl);
    } else {
      alert("浏览器不支持WebSocket");
      return;
    }
    iatWS.onopen = (e) => {
      var params = {
        common: {
          app_id: config.appid,
        },
        business: {
          language: "zh_cn",
          domain: "iat",
          accent: "mandarin",
          vad_eos: 5000,
          dwa: "wpgs",
        },
        data: {
          status: 0,
          format: "audio/L16;rate=16000",
          encoding: "raw",
        },
      };
      iatWS.send(JSON.stringify(params));
      callback();
    };
    iatWS.onmessage = (e) => {
        // console.log('收到了结果', JSON.parse(e.data))
        renderResult(e.data);
    };
    iatWS.onerror = (e) => {
      console.error(e);
    };
}

async function convertAudio(inputAudioBlob, cb) {
// let stdout = "";
// let stderr = "";
// Print FFmpeg's version.
// console.log('ffmpeg', ffmpeg)
// ffmpeg({
//     arguments: ["-version"],
//     print: function(data) { stdout += data + "\n"; },
//     printErr: function(data) { stderr += data + "\n"; },
//     onExit: function(code) {
//         console.log("Process exited with code " + code);
//         console.log(stdout);
//         console.log(stderr);
//     },
// });
// await ffmpeg.load()
// console.log('是否有run兑现',ffmpeg)
// const { run, fs } = ffmpeg;
// const ffmpeg = createFFmpeg({ log: true });
// await ffmpeg.load();

    var workerPath = 'https://cdn.goowee.cn/src/otplib/ffmpeg_asm.js';
    // if(document.domain == 'localhost') {
    //     workerPath = location.href.replace(location.href.split('/').pop(), '') + 'src/otplib/ffmpeg_asm.js';
    // }
    // console.log('workPath', workerPath)

    function processInWebWorker() {
        var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
            type: 'application/javascript'
        }));

        var worker = new Worker(blob);
        URL.revokeObjectURL(blob);
        return worker;
    }

    var worker;

    function log(message) {
    //    console.log('ffmpegLog：',message)
    }

    function convertStreams(audioBlob) {
        var aab;
        // var buffersReady;
        // var workerReady;
        var posted;
        // console.log('开始转换的blob', audioBlob)
        var fileReader = new FileReader();
        fileReader.onload = function() {
            aab = this.result;
            postMessage();
        };
        fileReader.readAsArrayBuffer(audioBlob);

        if (!worker) {
            worker = processInWebWorker();
        }

        worker.onmessage = function(event) {
            var message = event.data;
            if (message.type == "ready") {
                log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
                // workerReady = true;
                // postMessage();
            } else if (message.type == "stdout") {
                log(message.data);
            } else if (message.type == "start") {
                log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
            } else if (message.type == "done") {
                log(message);

                var result = message.data[0];
                // log(JSON.stringify(result));

                var blob = new File([result.data], 'test.pcm', {
                    type: 'audio/pcm'
                });

                // log(JSON.stringify(blob));
                if(cb != null){
                    cb(blob)
                }
                // PostBlob(blob);
            }
        };

        var postMessage = function() {
            posted = true;

            worker.postMessage({
                type: 'command',
                arguments: '-i audio.mp3 -acodec pcm_s16le -f s16le -ac 1 -ar 16000 test.pcm'.split(' '),
                files: [
                    {
                        data: new Uint8Array(aab),
                        name: "audio.mp3"
                    }
                ]
            });
        };
    }

    function PostBlob(blob) {
        // console.log('导出结束的blob', blob)

        var url = window.URL.createObjectURL(blob);
        // console.log('MP3 URl: ', url);

        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_16khz_${new Date().getTime()}.pcm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // var audio = document.createElement('audio');
        // audio.controls = true;

        // var source = document.createElement('source');
        // source.src = URL.createObjectURL(blob);
        // source.type = 'audio/pcm; codecs=pcm';
        // audio.appendChild(source);

        // // audio.download = 'Converted Audio.mp3';

        // audio.tabIndex = 0;
        // audio.focus();
        // audio.play();
    }
    
    convertStreams(inputAudioBlob)
}

export default class VoiceCheck {

    //设置config
    public static setConfig(appid, apiSecret, apiKey){
        if(appid != null){
            config.appid = appid
        }
        if(apiSecret != null){
            config.apiSecret = apiSecret
        }
        if(apiKey != null){
            config.apiKey = apiKey
        }
    }

    //直接检测url音频的事件
    public static async startTestByUrl(url, cb){
        // this.startTest(checkStr, checkType)
        //读取url的音频数据
        // let fetchStream = new fetch.FetchStream(url)
        // fetchStream.on("data", function(chunk){
        //     console.log('我收到了数据',chunk);
        // });
        // fetchStream.on("end", function(chunk){
        //     console.log('数据获取结束了',chunk);
        // });
        // fetchStream.on("error", function(err){
        //     console.log('数据获取出错了', err);
        // });
        // console.log('lamejs', lamejs.Mp3Encoder)
        resultText = ''
        resultTextTemp = ''
        lastWsData = []
        resultHandle = cb
        connectWebSocket(()=>{
            // console.log('url', url)
            // url = 'https://cdn.goowee.cn/bookEdit/iat_mp3_16k.mp3'
            axios({url: url, method: 'GET', responseType: 'arraybuffer'}).then(response=>{
                let arrayBuffer = response.data

                // encodeMono(1, 16000, samples);
                var blob = new Blob([arrayBuffer], {type: 'audio/mp3'});
                convertAudio(blob, async (convertBlob)=>{
                    let newArrayBuffer = await convertBlob.arrayBuffer()

                    // 音频数据的ArrayBuffer
                    const audioString = toString(newArrayBuffer);
                    // console.log('audioString', audioString)
                    let offset = 0
                    while(offset < audioString.length){
                        const subString = audioString.substring(offset, offset + 1280)
                        offset += 1280
                        // console.log(subString.length, subString)
                        const isEnd = offset >= audioString.length
                        iatWS.send(
                            JSON.stringify({
                                data: {
                                    status: isEnd ? 2 : 1,
                                    format: "audio/L16;rate=16000",
                                    encoding: "raw",
                                    audio: window.btoa(subString)
                                },
                            })
                        );
                    }

                })

                
            })
        })
        // console.log('fetch', fetch)
    }
}
import * as CryptoJS from 'crypto-js'


const TEXT_1 = "欢迎来到讯飞开放平台体验超拟人合成小助手。";
const TEXT_2 = "而我们所在的这个房间的高度呢，大约是3米";
// const VCN = "x5_lingfeiyi_flow";

const Constants = {
    APP_ID: '145d2560',
    API_KEY: '4c75d2411acf143f4145ba8b72a03bdc',
    API_SECRET: 'MTM3ZWQ2Y2Y4ZmEyMTEwYWVmMDg3NmRk',
}

const config = {
    // 请求地址
    hostUrl: "wss://cbm01.cn-huabei-1.xf-yun.com/v1/private/mcd9m97e6",
    host: "cbm01.cn-huabei-1.xf-yun.com",
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

function base64ToBlob(base64, contentType) {
    contentType = contentType || ''; // 如果没有指定内容类型，默认为空字符串
    const binaryString = base64//window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: contentType });
}

// 获取鉴权URL
function getAuthUrl() {
    var url = config.hostUrl;
    var host = config.host;
    var apiKey = config.apiKey;
    var apiSecret = config.apiSecret;
    var date = new Date().toGMTString();
    var algorithm = "hmac-sha256";
    var headers = "host date request-line";
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1/private/mcd9m97e6 HTTP/1.1`;
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    var signature = CryptoJS.enc.Base64.stringify(signatureSha);
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    var authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    return url;
}

export default class VoiceGen {

    public static async genSound(config) {
        return new Promise<Blob>((resolve, reject) => {
            try {
                const ttsAuthUrl = getAuthUrl();
                const ttsWs = new WebSocket(ttsAuthUrl);
                // 构建要发送的JSON数据
                const sendData = {
                    "header": {
                        "app_id": Constants.APP_ID,
                        "status": 2
                    },
                    "parameter": {
                        "oral": {
                            "spark_assist": 1,
                            "oral_level": "mid"
                        },
                        "tts": {
                            "vcn": config.vcn,
                            "speed": config.speed,
                            "volume": config.volume,
                            "pitch": config.pitch,
                            "bgs": config.bgs,
                            "reg": 0,
                            "rdn": 0,
                            "rhy": 0,
                            "audio": {
                                "encoding": "lame",
                                "sample_rate": 24000,
                                "channels": 1,
                                "bit_depth": 16,
                                "frame_size": 0
                            }
                        },
                    },
                    "payload": {
                        "text": {
                            "encoding": "utf8",
                            "compress": "raw",
                            "format": "json",
                            "status": 2,
                            "seq": 0,
                            "text": window.btoa(unescape(encodeURIComponent(config.text)))
                        }
                    }
                };
                console.log(sendData);
                let textBase64Decode = ''
                ttsWs.onopen = (e)=>{
                    ttsWs.send(JSON.stringify(sendData));
                }
                ttsWs.onclose = (e)=>{

                }
                ttsWs.onmessage = (e) => {
                    // console.log('收到了结果', JSON.parse(e.data))
                    let res = JSON.parse(e.data)
                    if(res.payload != null && res.payload.audio.audio != null){
                        //返回的结果是base64格式的音频格式，保存文件到oss去
                        textBase64Decode += window.atob(res.payload.audio.audio)
                        if(res.payload.audio.status == 2){
                            //已经是最后一个片段了
                            // console.log('获取到音频',textBase64Decode)
                            let blob = base64ToBlob( textBase64Decode, 'audio/mp3')
                            // console.log('转为blob',blob)
                            resolve(blob)
                            ttsWs.close()
                        }
                    }
                };
                ttsWs.onerror = (e) => {
                    console.error(e);
                    resolve(null)
                };
            } catch (error) {
                console.error(error);
                resolve(null)
                // reject()
            }
        })
        
    }
}

// 运行主函数
// main();

import axios from 'axios';
import { host } from './util';

export async function wxConfig(url,title,desc,link,imgUrl){
    const q = await axios.post(`${host}api/WebApi/get_weixin_sign`,{url:url});
    const res = q.data.data;
    if(wx && res && res['appId'] !== ''){
        const config = {
            debug:false,
            appId: res.appId, // 必填，公众号的唯一标识
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.nonceStr, // 必填，生成签名的随机串
            signature: res.signature,// 必填，签名
            jsApiList: ['updateAppMessageShareData','updateTimelineShareData'] // 必填，需要使用的JS接口列表
        }
        wx.config(config);
        wx.error(function(res){
            console.log(res);
        })
        wx.ready(function(){
            wx.updateAppMessageShareData({
                title,
                desc,
                link,
                imgUrl
            });
            wx.updateTimelineShareData({
                title,
                link,
                imgUrl
            })
        })
    }
}
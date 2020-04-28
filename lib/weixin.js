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

        wx.ready(function(){
            wx.checkJsApi({
                jsApiList: ['updateAppMessageShareData','updateTimelineShareData'], 
                success: function(res) {
                    if(res.checkResult.updateAppMessageShareData || res.checkResult.onMenuShareAppMessage){
                        wx.updateAppMessageShareData({
                            title,
                            desc,
                            link,
                            imgUrl
                        });
                    }
                    if (res.checkResult.updateTimelineShareData || res.checkResult.onMenuShareTimeline){
                        wx.updateTimelineShareData({
                            title,
                            link,
                            imgUrl
                        })
                    }
                }
            });
        })
    }
}
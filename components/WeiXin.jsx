import {Component} from 'react';
const appID = 'wx667e022c37907740';
class Weixin extends Component {
    // weixing
    componentDidMount(){
        if(wx){
            const config = {};

            wx.config(config)
        }
    }
}

export default Weixin;
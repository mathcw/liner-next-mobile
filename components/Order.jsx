import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { Toast} from 'antd-mobile';
import axios from 'axios';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import Debounce from 'lodash.debounce';
import {host} from '../lib/util';

const Order = ({fees,group_id}) => {
    const feelist = fees || [];
    const [visible, setvisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [feeId,setFeeId] = useState(null);

    const Click = () => {
        setvisible(true);
    }
    const handleOk = Debounce(() => {
        if(!feeId){
            Toast.fail('请您选择一个价格');
            return;
        }
        if(name == ''){
            Toast.fail('请您输入您的姓名');
            return;
        }
        if(phone == ''){
            Toast.fail('请您属兔您的手机号');
            return ;
        }
        axios.post(`${host}api/WebApi/mobile_order`, {
            name, phone, fee_id:feeId,group_id
        }).then(r => {
            setName('');
            setPhone('');
            setvisible(false);
            setFeeId(null);
            Toast.success('预订成功');
        }, e => {
            setName('');
            setPhone('');
            setFeeId(null);
            setvisible(false);
            Toast.success('预订成功');
            
        });
    },500);
    const handleCancel = () => {
        setvisible(false);
    }
    return (
        <div className='main' >
            <div className="content" onClick={Click}>
                <div className="people">
                    <span>立刻预订</span>
                </div>
            </div>
            <Modal
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                title="立刻预订"
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        预订
                    </Button>
                ]}
            >
                <div className="modalContent">
                <span className="TitleLabel">请选择您中意的价格</span>
                {
                    feelist.map(fee=>{
                        return (
                            <div className="feelist" key={fee['id']} style={feeId==fee['id']? {borderColor:'red'}:{}}
                                onClick={()=>{setFeeId(fee['id'])}}>
                                <div className="feeRow">
                                    <span className="feeLabel">房型:</span>
                                    <span>{fee['room_type']}</span>
                                </div>
                                <div className="feeRow">
                                    <span className="feeLabel">位置:</span>
                                    <span>{fee['location']}</span>
                                </div>
                                <div className="feeRow">
                                    <span className="feeLabel">1/2人价格:</span>
                                    <span>{fee['price']}</span>
                                </div>
                                <div className="feeRow">
                                    <span className="feeLabel">3/4人价格:</span>
                                    <span>{fee['duoren_price']}</span>
                                </div>
                                {feeId==fee['id'] && <div className="feeRow">
                                    <span className="feeLabel" style={{color:'red'}}>您已经选择本价格</span>
                                </div>}
                            </div>
                        )
                    })
                }
                <span className="TitleLabel">请完善您的信息</span>
                    <Input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} placeholder="您的姓名" prefix={<UserOutlined />} />
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} placeholder="您的电话" prefix={<PhoneOutlined />} />
                </div>
            </Modal>
            <style jsx>{`
        .main {
            cursor:pointer;
            position: fixed;
            z-index: 999;
            right: 12%;
            bottom: 5%;
            font-size: 14px;
            border:1px solid;
            width:90px;
            background-color:white;
        }
        .content{
            display:flex;
            flex-direction:column;
        }
        .img{
            height:60px;
            width:90px;
        }
        .people{
            border:1px solid;
            border-radius:10px;
            margin:5px 5px 5px 5px;
            color: rgb(0, 0, 0);
            text-align:center
        }
        .modalContent{
            display:flex;
            flex-direction:column;
        }
        .feelist{
            display:flex;
            flex-direction:column;
            border: 1px solid #ddd;
            border-radius: 10px;
            margin-bottom:5px;
        }
        .feeRow{
            margin-left:5px;
        }
        .feeLabel{
            margin: 0;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 14px;
            line-height: 22px;
            word-wrap: break-word;
        }
        .TitleLabel{
            margin: 0;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 14px;
            line-height: 22px;
            word-wrap: break-word;
        }
        `}</style>
        </div>
    );
}


export default Order;


import Link from '../components/NextLink'
import Order from '../components/Order';
import Head from 'next/head'
import '../css/index.css'
import axios from 'axios';
import { host, getStaticFile } from '../lib/util';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { get, cache } from '../lib/lruCache';
import { Input } from 'antd';


const Detail = ({ data, dict }) => {

    const dictDepCity = dict['depCity'] ? dict['depCity'] : {};
    const dictDesCity = dict['desCity'] ? dict['desCity'] : {};
    const related = data['其他航线'] ? (data['其他航线'].length > 0 ? data['其他航线'][0] : null) : null;

    const fees = data['fees'].map(fee => {
        fee['dep_date'] = data['dep_date'];
        return fee;
    })
    return (
        <div style={{ background: '#fff' }}>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="route_top">
                <Link href="/index">
                    <a>
                        <div className="back"></div>
                    </a>
                </Link>
                产品详情
            </div>
            {/* 顶部图片 */}
            <div className="route_img">
                <img src={data['pic'] == '' ? getStaticFile('/route_back.png') : data['pic']} />
                <div className="top_vague"></div>
                <div className="text">
                    <span className="head">{data['name']}</span>
                </div>
            </div>
            {/* 图片下面文字 */}
            {data['kind'] != 4 &&
                <Input.TextArea autoSize value={data['ship_dep']}
                    style={{
                        width: '100%'
                        , fontSize: '0.875rem'
                        , fontFamily: 'PingFang-SC-Medium,PingFang-SC'
                        , fontWeight: '500'
                        , color: 'rgba(0,0,0,0.45)'
                        , lineHeight: '24px'
                        , marginTop: '.5rem'
                        , border: 'none'
                    }}
                    readOnly />
            }
            {/* 航线简介 */}
            <div className="course_introduction">
                <div className="headline">产品简介</div>
                <div className="content" style={{paddingLeft:'11px'}}>
                    <div className="row">
                        <span className="lable">出发日期：</span>
                        <span className="matter">{data['dep_date']}</span>
                    </div>
                    <div className="row">
                        <span className="lable">持续时间：</span>
                        <span className="matter">{data['day']}天{data['night']}晚</span>
                    </div>
                    <div className="row">
                        <span className="lable">出&nbsp;&nbsp;发&nbsp;&nbsp;地：</span>
                        <span className="matter">{dictDepCity[data['dep_city_id']]}</span>
                    </div>
                    <div className="row">
                        <span className="lable">目&nbsp;&nbsp;的&nbsp;&nbsp;地：</span>
                        <span className="matter">{dictDesCity[data['destination']]}</span>
                    </div>
                </div>
            </div>
            {/* 产品特色 */}
            {
                data['kind'] != 1 && <div className="pro_feature">
                    <div className="headline">产品特色</div>
                    <Input.TextArea autoSize value={data['bright_spot']}
                        style={{
                            width: '100%'
                            , fontSize: '0.875rem'
                            , fontFamily: 'PingFang-SC-Medium,PingFang-SC'
                            , fontWeight: '500'
                            , color: 'rgba(0,0,0,0.45)'
                            , lineHeight: '24px'
                            , marginTop: '.5rem'
                            , border: 'none'
                        }}
                        readOnly />
                </div>
            }

            {/* 每日行程 */}
            <div className="daily_schedule">
                <div className="headline">每日行程</div>
                {
                    data['itins'] && data['itins'].map(itin => {
                        return (
                            <div key={itin['id']}>
                                <div className="top">
                                    <span className="num">D{itin['order']}</span>
                                    <span className="headcont">
                                        {itin['dep_city'] == '' ? '' : itin['dep_city']}
                                        {(itin['dep_city'] != '' && itin['destination'] != '') ? '-' : ''}
                                        {itin['destination'] != '' ? itin['destination'] : ''}
                                    </span>
                                </div>
                                <div className="content">
                                    {
                                        (itin['arr_time'] != '' || itin['level_time'] != '') && <div className="time">
                                            <span className="text">{itin['arr_time'] == '' ? '' : itin['arr_time']}
                                                {(itin['arr_time'] != '' && itin['level_time'] != '') ? '-' : ''}
                                                {itin['level_time'] != '' ? itin['level_time'] : ''}</span>
                                        </div>
                                    }
                                    <div>
                                        <img src="/catering.png" />
                                        {
                                            itin['breakfast'] != '' && <div className="text">早餐:{itin['breakfast']}</div>
                                        }
                                        {
                                            itin['lunch'] != '' && <div className="text">中餐:{itin['lunch']}</div>
                                        }
                                        {
                                            itin['dinner'] != '' && <div className="text">晚餐:{itin['dinner']}</div>
                                        }
                                    </div>
                                    {
                                        itin['pic_arr'].length > 0 && <div className="img">
                                            <img src={itin['pic_arr'].length > 0 ? itin['pic_arr'][0] : getStaticFile('/pic.png')} />
                                        </div>
                                    }
                                    <Input.TextArea autoSize value={itin['des']}
                                        style={{
                                            width: '100%'
                                            , fontSize: '0.875rem'
                                            , fontFamily: 'PingFang-SC-Medium,PingFang-SC'
                                            , fontWeight: '500'
                                            , color: 'rgba(0,0,0,0.45)'
                                            , lineHeight: '24px'
                                            , marginTop: '.5rem'
                                            , border: 'none'
                                        }}
                                        readOnly />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {/* 费用须知 */}
            <div className="cost_information">
                <div className="headline">预订须知</div>
                <Input.TextArea autoSize value={data['book_info']}
                    style={{
                        width: '100%'
                        , fontSize: '0.875rem'
                        , fontFamily: 'PingFang-SC-Medium,PingFang-SC'
                        , fontWeight: '500'
                        , color: 'rgba(0,0,0,0.45)'
                        , lineHeight: '24px'
                        , marginTop: '.5rem'
                        , border: 'none'
                    }}
                    readOnly />
            </div>
            {/* {
                data['fee_info'] != '' && <div className="cost_information">
                <div className="headline">旅游费用</div>
                <Input.TextArea autoSize value={data['fee_info']}
                    style={{
                        width: '100%'
                        , fontSize: '0.875rem'
                        , fontFamily: 'PingFang-SC-Medium,PingFang-SC'
                        , fontWeight: '500'
                        , color: 'rgba(0,0,0,0.45)'
                        , lineHeight: '24px'
                        , marginTop: '.5rem'
                        , border: 'none'
                    }}
                    readOnly />
            </div>
            } */}
            <div className="cost_information">
                <div className="headline">费用包含</div>
                <Input.TextArea autoSize value={data['fee_include']}
                    style={{
                        width: '100%'
                        , fontSize: '0.875rem'
                        , fontFamily: 'PingFang-SC-Medium,PingFang-SC'
                        , fontWeight: '500'
                        , color: 'rgba(0,0,0,0.45)'
                        , lineHeight: '24px'
                        , marginTop: '.5rem'
                        , border: 'none'
                    }}
                    readOnly />
            </div>
            <div className="cost_information">
                <div className="headline">费用不含</div>
                <Input.TextArea autoSize value={data['fee_exclude']}
                    style={{
                        width: '100%'
                        , fontSize: '0.875rem'
                        , fontFamily: 'PingFang-SC-Medium,PingFang-SC'
                        , fontWeight: '500'
                        , color: 'rgba(0,0,0,0.45)'
                        , lineHeight: '24px'
                        , marginTop: '.5rem'
                        , border: 'none'
                    }}
                    readOnly />
            </div>
            <div className="cost_information">
                <div className="headline">取消条款</div>
                <Input.TextArea autoSize value={data['cancel_info']}
                    style={{
                        width: '100%'
                        , fontSize: '0.875rem'
                        , fontFamily: 'PingFang-SC-Medium,PingFang-SC'
                        , fontWeight: '500'
                        , color: 'rgba(0,0,0,0.45)'
                        , lineHeight: '24px'
                        , marginTop: '.5rem'
                        , border: 'none'
                    }}
                    readOnly />
            </div>
            {/* 其他航线 */}
            {
                related && <div className="other_routes">
                    <div className="headline">其他产品</div>
                    <div className="home_content">
                        <Link href="/route_detail">
                            <a style={{ display: 'flex' }}>
                                <div className="left">
                                    <img src={related['pic'] == '' ? getStaticFile('/pic.png') : related['pic']} />
                                </div>
                                <div className="right">
                                    <div className="top">
                                        {related['name']}
                                    </div>
                                    <div className="bottom">
                                        <div className="price">
                                            <span className="c">￥</span>
                                            <span className="m">{related['min_price']}</span>
                                            <span className="c">起/人</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    </div>
                </div>

            }
            <Order fees={fees} group_id={data['id']} />
        </div>
    );
}

Detail.getInitialProps = async (appContext) => {
    const { ctx } = appContext;
    const { query } = ctx;

    if (!query['id'] || (typeof query['id'] !== 'string' && typeof query['id'] !== 'number')) {
        return {
            data: null
        }
    }
    const res = await axios.get(`${host}api/WebApi/detail?id=${query['id']}`);

    if (res.status == 200 && res.data) {
        if (!res.data['data'] && res.data['message'] == '重复操作') {
            const cache = get(`${host}api/WebApi/detail?id=${query['id']}`);
            if (!cache) {
                return {
                    data: null
                }
            }
            return cache;
        }
        if (res.data['data']) {
            cache(`${host}api/WebApi/detail?id=${query['id']}`, {
                data: res.data['data']
            })
            return {
                data: res.data['data']
            }
        }

    }
    return {
        data: null
    }
}
export default connect(function mapProps(state) {
    return {
        dict: state.enum
    }
})(withRouter(Detail))


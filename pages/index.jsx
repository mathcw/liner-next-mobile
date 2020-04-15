import axios from 'axios';
import { ListView, Icon, Picker, DatePicker } from 'antd-mobile';
import { host, getStaticFile } from '../lib/util';
import { connect } from 'react-redux';
import Link from '../components/NextLink';
import { get,cache } from '../lib/lruCache';
import '../css/index.css'


const CustomChildren = props => (
    <div
        onClick={props.onClick}
    >
        <div>
            <div>
                <span className="ChildrenText">{props.extra}</span>
                <Icon type="down" size='xs' style={{ float: 'right' }} />
            </div>
            <style jsx>
                {`
                .ChildrenText{
                    font-size: .875rem;
                    font-weight: 400;
                    color: rgba(0,0,0,0.85);
                    line-height: 20px;
                    background: #fff;
                    height: 2.75rem;
                }
            `}
            </style>
        </div>
    </div>
);

const CustomDate = ({ extra, onClick, children }) => (
    <div
        onClick={onClick}
        style={{ padding: '0 15px' }}
    >
        {children}
        <span className="ChildrenText">{extra}</span>
        <style jsx>
            {`
                .ChildrenText{
                    font-size: .875rem;
                    font-weight: 400;
                    color: rgba(0,0,0,0.85);
                    line-height: 20px;
                    background: #fff;
                    height: 2.75rem;
                }
            `}
        </style>
    </div>
);

const Row = (props) => {
    const {rowData, sectionID, rowID,dictKind} = props;
    const renderTheme = (theme) =>{
        if(theme == ''){
            return ''
        };
        const theme_arr = theme.split(',').map(item=>{
            return dictKind[item];
        })
        return theme_arr.join(',');
    }
    return (
        <div key={rowID} style={{ padding: '0 15px' }}>
            <Link href={`/route_detail?id=${rowData['id']}`} >
                <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                    <img style={{ height: '80px', width: '100px' }} src={rowData['pic'] == '' ? getStaticFile('/img.png') : rowData['pic']} />
                    <div className="content">
                        <div className="contentTop">
                            <span>{rowData['name']}</span>
                        </div>
                        <div className="contentDate">
                            <span className="cFont">{rowData['dep_date']}</span>
                        </div>
                        <div className="contentTheme">
                            <span className="cFont">{renderTheme(rowData['theme'])}</span>
                        </div>
                        <div className="contentBottom">
                            <div className="contentPrice">
                                <span className="cFont">￥</span>
                                <span className="mFont">{rowData['min_price']}</span>
                                <span className="cFont">起/人</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <style jsx>
                {`
                .content{
                    line-height:1,
                    display: flex;
                    flex-direction: column;
                    margin-left: 16px;
                    width:100%;
                }
                .contentTop{
                    font-size:14px;
                    font-weight:400;
                    color:rgba(0,0,0,0.65);
                    line-height:20px;
                    height: 36px;
                    overflow:hidden; 
                    text-overflow:ellipsis;
                    display:-webkit-box; 
                    /* autoprefixer: off */
                    -webkit-box-orient: vertical;
                    /* autoprefixer: on */
                    -webkit-line-clamp:2;
                }
                .contentBottom{
                    display: flex;
                    position: relative;
                    margin-top: 20px;
                    align-items: center;
                }
                .contentDate{
                    font-size:14px;
                    font-weight:400;
                    color:rgba(0,0,0,0.65);
                    display:-webkit-box; 
                    /* autoprefixer: off */
                    -webkit-box-orient: vertical;
                    /* autoprefixer: on */
                    -webkit-line-clamp:2;
                }
                contentTheme{
                    font-size:14px;
                    font-weight:400;
                    color:rgba(0,0,0,0.65);
                    display:-webkit-box; 
                    /* autoprefixer: off */
                    -webkit-box-orient: vertical;
                    /* autoprefixer: on */
                    -webkit-line-clamp:2;
                }
                .contentPrice{
                    display: flex;
                    position: absolute;
                    align-items: center;
                    right: 7%;
                }
                .cFont{
                    font-size:10px;
                    font-family:PingFang-SC-Regular,PingFang-SC;
                    font-weight:400;
                    color:rgba(245,105,97,1);
                    line-height:14px;
                }
                .mFont{
                    font-size:14px;
                    font-family:PingFang-SC-Regular,PingFang-SC;
                    font-weight:500;
                    color:rgba(245,105,97,1);
                    line-height:14px;
                }
            `}</style>
        </div>
    );
};

const separator = (sectionID, rowID) => (
    <div
        key={`${sectionID}-${rowID}`}
        style={{
            backgroundColor: '#F5F5F9',
            height: 8,
            borderTop: '1px solid #ECECED',
            borderBottom: '1px solid #ECECED',
        }}
    />
);

async function load(search, start, pageSize) {
    search['start'] = start;
    search['limit'] = pageSize;

    const query = {};
    Object.keys(search).filter(k => {
        if (Array.isArray(search[k])) {
            return search[k].length != 0;
        }
        return search[k] !== undefined && search[k] !== '';
    }).forEach(k => {
        if (['dep_city_id', 'destination', 'cruise_company_id', 'theme'].includes(k)) {
            if (Array.isArray(search[k])) {
                query[k] = search[k];
            } else {
                query[k] = [search[k]];
            }
        } else {
            query[k] = search[k];
        }
    })
    const res = await axios.post(`${host}api/WebApi/ticket`, {
        ...query
    });

    if (res.status == 200 && res.data) {
        if(!res.data['data'] && res.data['message'] =='重复操作' ){
            const cache = get(`${host}api/WebApi/ticket`);
            if(!cache){
                return {
                    data: [],
                    total: 0,
                }
            }
            return cache;
        }
        if(res.data['data']){
            cache(`${host}api/WebApi/ticket`,{
                data: res.data['data']['data'],
                total: res.data['data']['total'],
            })
            return {
                data: res.data['data']['data'],
                total: res.data['data']['total'],
            }
        }

    }
    return {
        data: [],
        total: 0,
    }
}

const pageSize = 6;

class Page extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const { initData } = props;
        this.state = {
            dataSource: ds,
            data: [...initData],
            loading: false,
            hasMore: true,
            orderDir: 'desc',
            orderBy: 'create_at',
            total: 0,
            dep_date_from: undefined,
            dep_date_to: undefined,
            search: {}
        };
    }

    onEndReached = (event) => {
        const { loading, hasMore, data, orderDir, orderBy, search } = this.state;
        if (loading || !hasMore) {
            return;
        }
        this.setState({ loading: true });
        load({
            ...search,
            order_field: orderBy,
            order_dir: orderDir
        }, data.length, pageSize).then(r => {
            if (r.data.length == 0) {
                this.setState({
                    hasMore: false
                })
            }
            this.setState(
                {
                    data: [...data, ...r.data],
                    loading: false,
                    total: r.total
                }
                , () => {
                    const { data, total } = this.state;
                    if (data.length == total) {
                        this.setState({
                            hasMore: false
                        })
                    }
                })

        }, e => {
            this.setState(
                {
                    loading: false,
                }
            )
        })
    }

    justSearch = (start) => {
        const { loading, hasMore, orderDir, orderBy, search } = this.state;
        if (loading && !hasMore) {
            return;
        }
        this.setState({ loading: true });
        load({
            ...search,
            order_field: orderBy,
            order_dir: orderDir
        }, start, pageSize).then(r => {
            this.setState(
                {
                    data: [...r.data],
                    loading: false,
                    total: r.total
                }
            )
            if (r.data.length == 0 || r.data.length == r.total) {
                this.setState({
                    hasMore: false
                })
            } else {
                this.setState({
                    hasMore: true
                })
            }
        }, e => {
            this.setState(
                {
                    loading: false,
                }
            )
        })
    }

    clickOrderBY = (field) => {
        const { orderBy } = this.state;
        if (field == orderBy) {
            return;
        }
        this.setState(
            {
                orderBy: field,
                orderDir: 'desc'
            }
            , () => {
                this.justSearch(0);
            })
    }

    clickOrderDir = (dir) => {
        this.setState({
            orderDir: dir
        }, () => {
            this.justSearch(0);
        })
    }


    renderHeader = () => {
        const { orderDir, orderBy, search, dep_date_from, dep_date_to } = this.state;
        const { dict } = this.props;
        let dictKind = []
        if (dict['PdTheme']) {
            Object.keys(dict['PdTheme']).forEach((v) => {
                dictKind.push({
                    value: v,
                    label: dict['PdTheme'][v]
                })
            })
        }
        let dictDepCity = []
        if (dict['depCity']) {
            Object.keys(dict['depCity']).forEach((v) => {
                dictDepCity.push({
                    value: v,
                    label: dict['depCity'][v]
                })
            })
        }
        let dictDesCity = []
        if (dict['desCity']) {
            Object.keys(dict['desCity']).forEach((v) => {
                dictDesCity.push({
                    value: v,
                    label: dict['desCity'][v]
                })
            })
        }
        let dictCompany = []
        if (dict['CruiseCompany']) {
            Object.keys(dict['CruiseCompany']).forEach((v) => {
                dictCompany.push({
                    value: v,
                    label: dict['CruiseCompany'][v]
                })
            })
        }
        return (
            <div style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div className="home_top">
                    全部产品
                </div>
                <div className="home_menu">
                    <div className="menu" onClick={() => this.clickOrderBY('create_at')}>最新
                        {orderBy === 'create_at' && orderDir === 'desc' && <Icon type="down" size='xs' onClick={() => this.clickOrderDir('asc')} />}
                        {orderBy === 'create_at' && orderDir === 'asc' && <Icon type="up" size='xs' onClick={() => this.clickOrderDir('desc')} />}
                    </div>
                    <div className="menu" onClick={() => this.clickOrderBY('order_nums')}>销量
                        {orderBy === 'order_nums' && orderDir === 'desc' && <Icon type="down" size='xs' onClick={() => this.clickOrderDir('asc')} />}
                        {orderBy === 'order_nums' && orderDir === 'asc' && <Icon type="up" size='xs' onClick={() => this.clickOrderDir('desc')} />}
                    </div>
                    <div className="menu" onClick={() => this.clickOrderBY('min_price')}>价格
                        {orderBy === 'min_price' && orderDir === 'desc' && <Icon type="down" size='xs' onClick={() => this.clickOrderDir('asc')} />}
                        {orderBy === 'min_price' && orderDir === 'asc' && <Icon type="up" size='xs' onClick={() => this.clickOrderDir('desc')} />}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{position:'relative'}}>
                        <span>
                            筛选条件
                        </span>
                        <span style={{position:'absolute',right: '7%'}} onClick={()=>{
                            this.setState({
                                search:{}
                            },()=>{
                                this.justSearch(0);
                            })
                        }}>                    
                            清空
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around',marginBottom: '8px' }}>
                        <Picker data={dictDepCity}
                            cols={1}
                            title="出发地"
                            extra={'出发地'}
                            onOk={(v) => {
                                this.setState({
                                    search: { ...search, dep_city_id: v }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            onDismiss={() => {
                                this.setState({
                                    search: { ...search, dep_city_id: '' }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            value={search['dep_city_id']}
                        >
                            <CustomChildren />
                        </Picker>
                        <Picker data={dictDesCity}
                            cols={1}
                            title="目的地"
                            extra={'目的地'}
                            onOk={(v) => {
                                this.setState({
                                    search: { ...search, destination: v }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            onDismiss={() => {
                                this.setState({
                                    search: { ...search, destination: '' }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            value={search['destination']}
                        >
                            <CustomChildren />
                        </Picker>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around',marginBottom: '8px' }}>
                        <Picker data={dictKind}
                            cols={1}
                            title="产品分类"
                            extra={'产品分类'}
                            onOk={(v) => {
                                this.setState({
                                    search: { ...search, theme: v }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            onDismiss={() => {
                                this.setState({
                                    search: { ...search, kind: '' }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            value={search['theme']}
                        >
                            <CustomChildren />
                        </Picker>
                        <Picker data={dictCompany}
                            cols={1}
                            title="邮轮公司"
                            extra={'邮轮公司'}
                            onOk={(v) => {
                                this.setState({
                                    search: { ...search, cruise_company_id: v }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            onDismiss={() => {
                                this.setState({
                                    search: { ...search, cruise_company_id: '' }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            value={search['cruise_company_id']}
                        >
                            <CustomChildren />
                        </Picker>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around',marginBottom: '8px' }}>
                        <DatePicker
                            mode="date"
                            value={dep_date_from}
                            onOk={date => {
                                const pad = n => n < 10 ? `0${n}` : n;
                                const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
                                this.setState({
                                    dep_date_from: date,
                                    search: { ...search, dep_date_from: dateStr }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            onDismiss={() => {
                                this.setState({
                                    dep_date_from: undefined,
                                    search: { ...search, dep_date_from: '' }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            extra="出发日期起"
                        >
                            <CustomDate />
                        </DatePicker>
                        <DatePicker
                            mode="date"
                            value={dep_date_to}
                            onOk={date => {
                                const pad = n => n < 10 ? `0${n}` : n;
                                const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
                                this.setState({
                                    dep_date_to: date,
                                    search: { ...search, dep_date_to: dateStr }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            onDismiss={() => {
                                this.setState({
                                    dep_date_to: undefined,
                                    search: { ...search, dep_date_to: '' }
                                }, () => {
                                    this.justSearch(0);
                                })
                            }}
                            extra="出发日期止"
                        >
                            <CustomDate />
                        </DatePicker>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { dict } = this.props;
        const { loading, data, dataSource } = this.state;
        return (
            <ListView
                dataSource={dataSource.cloneWithRows(data)}
                renderHeader={() => this.renderHeader()}
                renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                    {loading ? '加载中...' : '没有更多数据了'}
                </div>)}
                renderRow={(rowData,sectionID,rowID)=><Row rowData={rowData} sectionID={sectionID} rowID={rowID} dictKind={dict['PdTheme']}/>}
                renderSeparator={separator}
                className="am-list"
                pageSize={pageSize}
                useBodyScroll
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
                style={{ overflow: 'hidden' }}
            />
        )
    }
}
Page.getInitialProps = async () => {
    const res = await load({
        order_dir:"desc",
        order_field:"create_at"
    }, 0, pageSize);
    return {
        initData: res.data
    }
}

export default connect(function mapProps(state) {
    return {
        dict: state.enum
    }
})(Page)
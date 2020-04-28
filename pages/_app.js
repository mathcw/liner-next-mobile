import App from 'next/app';
import { Provider } from 'react-redux';
import Router from 'next/router'
import PageLoading from '../components/Loading';
import withRedux from '../lib/withRedux';
import { createCache } from '../lib/lruCache';

class WebApp extends App {

    static async getInitialProps(appContext) {
        let pageProps;
        const { Component } = appContext;
        if (Component && Component.getInitialProps) {
            pageProps = await Component.getInitialProps(appContext);
        }
        let pathName = '/'
        if (appContext && appContext.ctx) {
            pathName = appContext.ctx.pathname;
        }
        return {
            pageProps,
            pathName
        }
    }

    state = {
        loading: false,
    }

    startLoading = () => {
        this.setState({
            loading: true,
        })
    }

    stopLoading = () => {
        this.setState({
            loading: false,
        })
    }

    componentDidMount() {
        Router.events.on('routeChangeStart', this.startLoading)
        Router.events.on('routeChangeComplete', this.stopLoading)
        Router.events.on('routeChangeError', this.stopLoading)
        createCache();
    }

    componentWillUnmount() {
        Router.events.off('routeChangeStart', this.startLoading)
        Router.events.off('routeChangeComplete', this.stopLoading)
        Router.events.off('routeChangeError', this.stopLoading)
    }

    render() {
        const { Component, pageProps, reduxStore } = this.props;
        const {loading} = this.state;
        return (
            <>
                <PageLoading loading={loading} />
                <Provider store={reduxStore}>
                    <Component {...pageProps} />
                </Provider>
                <div style={{display:'flex',flexDirection:'column',textAlign:'center'}}>
                    <span>
                        <a href="http://www.beian.miit.gov.cn/">
                            京ICP备20014193号
                        </a>
                    </span>
                    <span>
                        乐邮环球
                    </span>
                    <span>
                        Copyright 2020 北京亚美运通国际旅行社有限责任公司 All Rights Reserved
                    </span>
                </div>
            </>
        )
    }
}

export default withRedux(WebApp);
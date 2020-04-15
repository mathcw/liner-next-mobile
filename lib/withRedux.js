import React from 'react';
import axios from 'axios';
import createStore from '../store/store';
import {host} from '../lib/util';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function createOrGetStore(initialState){
    if(isServer){
        return createStore(initialState);
    }
    if(!window[__NEXT_REDUX_STORE__]){
        window[__NEXT_REDUX_STORE__] = createStore(initialState);
    }
    return window[__NEXT_REDUX_STORE__];
} 

export default (Comp)=>{
    class withReduxApp extends React.Component{
        constructor(props){
            super(props);
            this.reduxStore = createOrGetStore(props.initialReduxState);
        }
        render(){
            const {Component,pageProps,...rest} = this.props;
            return <Comp Component={Component} pageProps={pageProps} {...rest} reduxStore={this.reduxStore}/>
        }
    }

    withReduxApp.getInitialProps = async (appContext) =>{
        let appProps = {};
        if(typeof Comp.getInitialProps === 'function'){
            appProps = await Comp.getInitialProps(appContext);
        }
        const remoteState = {enum:{}};
        let resp = await axios.get(`${host}files/TY_LINER/cache/Enum.js`);
        if(resp.status == 200 && resp.data){
            remoteState['enum'] = resp.data
        }
        resp =await axios.get(`${host}api/WebApi/init`);
        if(resp.status == 200 && resp.data && resp.data['data']){
            remoteState['enum'] = {
                ...remoteState['enum'],
                depCity:resp.data['data']['dep_city'],
                desCity:resp.data['data']['des_city']
            }
        }
        const reduxStore = createOrGetStore({enum:remoteState.enum});
        return  {
            ...appProps,
            initialReduxState:reduxStore.getState()
        }
    }
    return withReduxApp;
}
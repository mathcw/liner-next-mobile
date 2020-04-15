import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export function getQuery(query,fieldMap){
    if(typeof query !='object'){
        return '';
    }
    if(Object.keys(query).length === 0){
        return '';
    }
    if(fieldMap){
        return Object.keys(query).filter(k => query[k] !== undefined && query[k] !== '')
        .map(k => `${encodeURIComponent(fieldMap[k] ?fieldMap[k]: k)}=${encodeURIComponent(query[k])}`)
        .join('&');
    }
    return Object.keys(query).filter(k => query[k] !== undefined && query[k] !== '')
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
    .join('&');

}

export const host = 'http://192.168.0.132:8080/liner-back/';

export function getStaticFile(url){
    return `${publicRuntimeConfig.basePath||''}${url}`
}
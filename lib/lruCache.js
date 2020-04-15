import LRU from 'lru-cache'

const isServer = typeof window === 'undefined';

export function createCache() {
    if (!isServer && !window['cache']) {
        window['cache'] = new LRU({
            maxAge: 1000 * 60 * 60,
        })
    }
}

export function cache(url, data) {
    if (!isServer && window['cache']) {
        window['cache'].set(url, data)
    }
}

export function get(url) {
    if (!isServer && window['cache']) {
        return window['cache'].get(url);
    }
    return undefined;
}

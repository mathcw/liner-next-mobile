import {createStore,applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import {host} from '../lib/util';

const initialGlobalState ={
    enum:{
        PdKind:{
            1:'单船票',
            2:'邮轮套餐',
            3:'河轮套餐',
            4:'跟团游'
        },
        ShipKind:{
            1:'河轮',
            2:'豪华邮轮'
        },
    }
};

const SET_ENUM = 'SET_ENUM';

const reducer = (state = initialGlobalState,action) => {
    switch (action.type) {
        case SET_ENUM:
            return {
                ...state,
                enum:{
                    ...state.enum,
                    ...action['enum'],
                }
            }
        default:
            return state;
    }
}

//ACTIONS
export function updateEnum(){
    return async (dispatch) =>{
        const r = await fetch(`${host}files/TY_LINER/cache/Enum.js`);
        const rst = await r.json();    
        dispatch({type:SET_ENUM,enum:rst});
    }
}

export default (state) =>{
    const store = createStore(reducer,Object.assign({},{
        enum : {
            ...initialGlobalState.enum,
            ...state.enum
        }
    }),applyMiddleware(ReduxThunk));
    return store;
};
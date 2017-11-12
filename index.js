import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put, call, fork, join } from 'redux-yield-effect/lib/effects';

const rootReducer = (state, action) => {
    console.log('in rootreducer', action);
    return state;
};

//Curry is necessary for react-redux later. connect shorthand
const demoAction = word => function* demoAction() {
    const time = yield call(logAfterX, 1000);
    console.log('time we waited: ', time);
};

const logAfterX = x => new Promise(resolve => setTimeout(() => {
    console.log('LOGGING after: ', x);
    resolve(x);
}, x));

document.addEventListener('DOMContentLoaded', () => {
    const store = createStore(
        rootReducer,
        applyMiddleware(createYieldEffectMiddleware())
    );

    store.dispatch({ type: 'yoyo' });
    store.dispatch(demoAction('myword')());
    store.dispatch({ type: 'zaza' });
});

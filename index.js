import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put, fork, join } from 'redux-yield-effect/lib/effects';
import { TYPE__CALL, processor__call, call } from './call.js';

const rootReducer = (state, action) => {
    console.log('in rootreducer', action);
    return state;
};

//Curry is necessary for react-redux later. connect shorthand
const demoAction = word => function* demoAction() {
    yield call(console.log, 'mmmmmy call');
};

document.addEventListener('DOMContentLoaded', () => {
    const store = createStore(
        rootReducer,
        applyMiddleware(createYieldEffectMiddleware({
            [TYPE__CALL]: processor__call
        }))
    );

    store.dispatch({ type: 'yoyo' });
    store.dispatch(demoAction('myword')());
    store.dispatch({ type: 'zaza' });
});

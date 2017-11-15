import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put, fork, join } from 'redux-yield-effect/lib/effects';
import { TYPE__CALL, processor__call, call } from './call.js';
import { TYPE__TICK, processor__tick, tick, tickMiddleware } from './tick.js';

const rootReducer = (state, action) => {
    console.log('in rootreducer', action);
    return state;
};

//Curry is necessary for react-redux later. connect shorthand
const demoAction = word => function* demoAction() {
    yield call(console.log, 'mmmmmy call');
    yield tick(function* mytickgen(dt) {
        yield put({ type: 'inside my tick gen, dt: ', dt });
        //yield call(console.log, 'again inside my tick gen', dt);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const store = createStore(
        rootReducer,
        applyMiddleware(
            createYieldEffectMiddleware({
                [TYPE__CALL]: processor__call,
                [TYPE__TICK]: processor__tick
            }),
            tickMiddleware
        ),
    );

    store.dispatch({ type: 'yoyo' });
    store.dispatch(demoAction('myword')());
    store.dispatch({ type: 'zaza' });
});

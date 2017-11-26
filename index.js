import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put, fork, join } from 'redux-yield-effect/lib/effects';
import { TYPE__CALL, processor__call, call } from './call.js';
import { TYPE__TICK, processor__tick, tick, tickMiddleware } from './tick.js';
import { createEntity } from './attacks/actions.js';
import fireball from './attacks/fireball.js';
import reducer from './reducer.js';
import metaSelector from './metaSelector.js';
import actionLogger from './actionLogger.js';
import './endPolyFills.js'

document.addEventListener('DOMContentLoaded', () => {
    const store = createStore(
        reducer,
        applyMiddleware(
            createYieldEffectMiddleware({
                [TYPE__CALL]: processor__call,
                [TYPE__TICK]: processor__tick
            }),
            tickMiddleware(1000),
            actionLogger('#logger'),
            metaSelector
        ),
    );

    const me = store.dispatch(createEntity({
        id: 0,
        name: 'Jason',
        hp: 20,
        x: 0
    }));

    const enemy = store.dispatch(createEntity({
        id: 1,
        name: 'Bad Guy',
        hp: 10,
        x: 5
    }));
    console.log('me: ', store.getState(), me());

    store.dispatch(fireball(me, enemy)());
});

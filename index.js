import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put, fork, join } from 'redux-yield-effect/lib/effects';
import { TYPE__CALL, processor__call, call } from './call.js';
import { TYPE__TICK, processor__tick, tick, tickMiddleware } from './tick.js';
import fireball from './attacks/fireball.js';
import reducer from './reducer.js';
import metaSelector from './metaSelector.js';
import './endPolyFills.js'

document.addEventListener('DOMContentLoaded', () => {
    const store = createStore(
        reducer,
        applyMiddleware(
            createYieldEffectMiddleware({
                [TYPE__CALL]: processor__call,
                [TYPE__TICK]: processor__tick
            }),
            tickMiddleware,
            metaSelector
        ),
    );

    const me =  {
        id: 0,
        name: 'Jason',
        pos: {
            x: 0
        }
    };

    const enemy = {
        id: 1,
        name: 'Bad Guy',
        pos: {
            x: 5
        }
    };

    store.dispatch(fireball(me, enemy));
});

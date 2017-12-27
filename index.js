import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put, fork, join } from 'redux-yield-effect/lib/effects';
import { TYPE__TICK, generateTickFunctions } from 'effect-tick';
import { createEntity } from './attacks/actions.js';
import fireball from './attacks/fireball.js';
import reducer from './reducer.js';
import metaSelector from 'redux-meta-selector';
import actionLogger from './actionLogger.js';
import graphics from './graphics.js';
import 'end-polyFills';

document.addEventListener('DOMContentLoaded', () => {
    const tickFncs = generateTickFunctions();

    const store = createStore(
        reducer,
        applyMiddleware(
            createYieldEffectMiddleware({
                [TYPE__TICK]: tickFncs.processor
            }),
            tickFncs.middleware(10),
            actionLogger('#logger'),
            metaSelector
        ),
    );

    let ctx = document.querySelector('canvas').getContext('2d');
    const step = dt => {
        graphics(ctx, store.getState(), dt);
        window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);

    const me = store.dispatch(createEntity({
        id: 0,
        name: 'jason',
        maxhp: 30,
        hp: 30,
        x: 1,
        y: 0
    }));

    const enemy = store.dispatch(createEntity({
        id: 1,
        name: 'badGuy',
        maxhp: 20,
        hp: 20,
        x: 10,
        y: 0
    }));

    document.addEventListener('keyup', ({ keyCode }) => {
        if(keyCode === 13) {
            console.log('fireball launched');
            store.dispatch(fireball(me, enemy)());
        }
    });

    const timeoutFireballEnemy = () => {
        if(me().hp < 0 || enemy().hp < 0) return;

        store.dispatch(fireball(enemy, me)());
        setTimeout(timeoutFireballEnemy, 1000 + Math.random() * 5000);
    };
    timeoutFireballEnemy()
});

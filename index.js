import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put, fork, join } from 'redux-yield-effect/lib/effects';
import { tickMiddleware, resumeTicks, pauseTicks } from 'effect-tick';
import { createEntity } from './attacks/actions.js';
import fireball from './attacks/fireball.js';
import reducer from './reducer.js';
import metaSelector from 'redux-meta-selector';
import actionLogger from './actionLogger.js';
import graphics from './graphics.js';
import jump from './attacks/jump.js';
import 'end-polyFills';

document.addEventListener('DOMContentLoaded', () => {
    const store = createStore(
        reducer,
        applyMiddleware(
            createYieldEffectMiddleware(),
            tickMiddleware,
            actionLogger('#logger'),
            metaSelector
        ),
    );
    store.dispatch(resumeTicks());

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
        x: 50,
        y: 0
    }));
    console.log('me: ', createEntity);

    const enemy = store.dispatch(createEntity({
        id: 1,
        name: 'badGuy',
        maxhp: 20,
        hp: 20,
        x: 500,
        y: 0
    }));

    document.addEventListener('keyup', e => {
        e.preventDefault();
        if(e.keyCode === 13) {
            console.log('fireball launched');
            store.dispatch(fireball(me, enemy)());
        } else if(e.keyCode === 32) {
            store.dispatch(jump(me)());
        }
    });

    document.addEventListener('keydown', e => { if(e.keyCode === 32) e.preventDefault() });

    const timeoutFireballEnemy = () => {
        if(me().hp < 0 || enemy().hp < 0) return;

        console.log('enemy started fireball');
        store.dispatch(fireball(enemy, me)());
        setTimeout(timeoutFireballEnemy, 1000 + Math.random() * 5000);
    };
    timeoutFireballEnemy()
});

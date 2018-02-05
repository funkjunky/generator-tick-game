import { put } from 'redux-yield-effect/lib/effects';
import { addTick } from 'effect-tick';
import { createEntity, removeEntity } from '../index.js';
import { incrementConjure } from './conjure.js';

//TODO: conjureTime? Really?
const conjureTime = 2000; //ms
const explosion_duration = 1500; //ms
// uses fireballRadius
export default (x, y) => function* _fireballExplosion() {
    //Create conjure object to keep track of amount of fireball conjured
    const explosion = yield put(createExplosion(x, y));

    yield put(addTick(function* _tick(dt) {
        const getPercent = yield put(incrementConjure(explosion, dt / conjureTime));
        return 1 <= getPercent();
    }));

    yield put(removeEntity(explosion));
};

export const createExplosion = (x, y) => createEntity({
    kind: 'spell',
    name: 'explosion',
    percent: 0,
    x,
    y
});

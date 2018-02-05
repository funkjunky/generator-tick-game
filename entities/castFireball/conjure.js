import { put } from 'redux-yield-effect/lib/effects';
import { addTick } from 'effect-tick';
import { createEntity, removeEntity } from '../index.js';
import { createFireball } from './index.js';

const conjureTime = 2000; //ms
export default owner => function* _conjureFireball() {
    //Create conjure object to keep track of amount of fireball conjured
    const conjureFireball = yield put(createConjureFireball(owner));

    //when this yields, we've finished conjuring!
    //TODO: do all tick functions like this.
    yield put(addTick(function* _tick(dt) {
        //increment the percent conjured
        const getPercent = yield put(incrementConjure(conjureFireball, dt / conjureTime));
        return 1 <= getPercent();
    }));
    yield put(removeEntity(conjureFireball));

    const fireball = yield put(createFireball(owner));
    return fireball;
};

export const createConjureFireball = owner => createEntity({
    name: 'conjuringFireball',
    owner: owner(),
    percent: 0
});

export const incrementConjure = (entity, percent) => ({
    type: 'INCREMENT_CONJURE',
    entity: entity(),
    percent,
    meta: {
        selector: state => state.entities[entity().id].percent
    }
});

export const draw = (conjure, ctx) => {
    ctx.lineWidth = width;
    ctx.strokeStyle = c.blue;
    ctx.globalAlpha = 1 - conjure.percent;
    ctx.beginPath();
    ctx.arc(conjure.owner.x, reverseY(conjure.owner.y + 50), 50 - conjure.percent * 50, 0, Math.PI * 2);
    ctx.stroke();
};

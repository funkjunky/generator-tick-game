import { put, fork, call } from 'redux-yield-effect/lib/effects';
import { tick } from 'effect-tick';

import conjureFireball from './conjure.js';
import fireballExplosion from './explosion.js';
import { takeDamage } from '../takeDamage.js';
import { seek } from '../seek.js';
import { createEntity, removeEntity } from '../index.js';

//TODO: owner should own conjureFireball, so we do owner.conjureFireball. We could add or remove it as necessary.
//      You could also do things like owner.learned.conjureFireball or owner.amulet.conjureFireball or owner.familiar.conjureFireball

//Curry is necessary for react-redux later. connect shorthand
export default function* _fireball(owner, target) {
    const fireball = yield call(conjureFireball, owner)
    yield call(seek, fireball, target);

    yield put(takeDamage(target, fireball));
    yield put(removeEntity(fireball));

    yield fork(fireballExplosion, target().x, target().y);
};

export const createFireball = owner => createEntity({
    kind: 'spell',
    name: 'fireball',
    dmg: 2,
    x: owner().x,
    y: owner().y + 50,
    owner: owner()
});

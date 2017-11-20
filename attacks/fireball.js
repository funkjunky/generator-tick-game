import { put } from 'redux-yield-effect/lib/effects';
import { call } from '../call.js';
import { tick } from '../tick.js';

import { conjureFireball, seek, fireballExplosion, takeDamage } from './actions.js';

//TODO: owner should own conjureFireball, so we do owner.conjureFireball. We could add or remove it as necessary.
//      You could also do things like owner.learned.conjureFireball or owner.amulet.conjureFireball or owner.familiar.conjureFireball
//TODO: target and owner should be functions to get the LATEST... OR their pos would be properties gotten from the store?? hmmm

//Curry is necessary for react-redux later. connect shorthand
export default (owner, target) => function* _fireball() {
    const fireball = yield put(conjureFireball(owner))
    console.log('FIREBALL CONJURED');
    yield put(seek(fireball, target));
    console.log('FIREBALL SEEKED');
    yield fork(fireballExplosion(target.x));
    console.log('FIREBALL EXPLOSION\'D');
    yield put(takeDamage(target, fireball));
    console.log('TARGET DMGED');
};

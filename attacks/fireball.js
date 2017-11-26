import { put, fork, call as gcall } from 'redux-yield-effect/lib/effects';
import { call } from '../call.js';
import { tick } from '../tick.js';

import { conjureFireball, seek, fireballExplosion, takeDamage } from './actions.js';

//TODO: owner should own conjureFireball, so we do owner.conjureFireball. We could add or remove it as necessary.
//      You could also do things like owner.learned.conjureFireball or owner.amulet.conjureFireball or owner.familiar.conjureFireball

//Curry is necessary for react-redux later. connect shorthand
export default (owner, target) => function* _fireball() {
    console.log('START: ', target().hp);
    const fireball = yield gcall(conjureFireball(owner))
    console.log('FIREBALL CONJURED', fireball());
    yield gcall(seek(fireball, target));
    console.log('FIREBALL FOUND TARGET (fireball.x, target.x)', fireball().x, target().x);
    yield fork(fireballExplosion(target().x));
    yield put(takeDamage(target, fireball));
    console.log('TARGET DMGED', target().hp);
};

import { put, fork, call } from 'redux-yield-effect/lib/effects';
import { tick } from 'effect-tick';

import { conjureFireball, seek, fireballExplosion, takeDamage, removeEntity } from './actions.js';

//TODO: owner should own conjureFireball, so we do owner.conjureFireball. We could add or remove it as necessary.
//      You could also do things like owner.learned.conjureFireball or owner.amulet.conjureFireball or owner.familiar.conjureFireball

//Curry is necessary for react-redux later. connect shorthand
export default (owner, target) => function* _fireball() {
    console.log('START: ', target().hp);
    const fireball = yield call(conjureFireball(owner))
    console.log('FIREBALL CONJURED', fireball());
    yield call(seek(fireball, target));
    console.log('FIREBALL FOUND TARGET (fireball.x, target.x)', fireball().x, target().x);

    yield put(takeDamage(target, fireball));
    yield put(removeEntity(fireball));
    console.log('TARGET DMGED', target().hp);

    yield fork(fireballExplosion(target().x, target().y));
};

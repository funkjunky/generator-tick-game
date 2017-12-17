import { put } from 'redux-yield-effect/lib/effects';
import { tick } from 'effect-tick';

const conjureTime = 2000; //ms
export const conjureFireball = owner => function* _conjureFireball() {
    //Create conjure object to keep track of amount of fireball conjured
    const conjureFireball = yield put(createConjureFireball(owner));
    console.log('conjurefireball: ', conjureFireball);

    //when this yields, we've finished conjuring!
    yield tick(function* _tick(dt) {
        //increment the percent conjured
        const getPercent = yield put(incrementConjure(conjureFireball, dt / conjureTime));
        return 1 <= getPercent();
    });
    yield put(removeEntity(conjureFireball));

    const fireball = yield put(createFireball(owner));
    return fireball;
};

const speed = 0.01; //x per ms
const fireballRadius = 0.1;
export const seek = (owner, target) => function* _seek() {
    yield tick(function* _tick(dt) {
        const distance = yield put(seekStep(owner, target, dt * speed));
        return fireballRadius > distance();
    });
};

const explosion_duration = 1500; //ms
// uses fireballRadius
export const fireballExplosion = x => function* _fireballExplosion() {
    //Create conjure object to keep track of amount of fireball conjured
    const explosion = yield put(createExplosion(x));

    yield tick(function* _tick(dt) {
        const getPercent = yield put(incrementConjure(explosion, dt / conjureTime));
        return 1 <= getPercent();
    });

    yield put(removeEntity(explosion));
};

let _id = 0;
export const createEntity = props => ({
    type: 'CREATE_ENTITY',
    entity: {
        id: ++_id,
        ...props
    },
    meta: metaEntitiesSelector
});

export const removeEntity = entity => ({
    type: 'REMOVE_ENTITY',
    entity: entity()
});

export const metaEntitiesSelector = {
    selector: (state, creationState) => {
        const { id } = creationState.entities.end();
        return state.entities[id];
    }
};

export const createFireball = owner => createEntity({
    kind: 'spell',
    name: 'fireball',
    dmg: 2,
    x: owner().x,
    owner: owner()
});

export const createConjureFireball = owner => createEntity({
    name: 'conjuringFireball',
    owner: owner(),
    percent: 0
});

export const createExplosion = x => createEntity({
    kind: 'spell',
    name: 'explosion',
    percent: 0,
    x
});

export const incrementConjure = (entity, percent) => ({
    type: 'INCREMENT_CONJURE',
    entity: entity(),
    percent,
    meta: {
        selector: state => state.entities[entity().id].percent
    }
});

export const seekStep = (entity, target, distance) => ({
    type: 'SEEK_STEP',
    entity: entity(),
    target: target(),
    distance,
    meta: {
        selector: state => Math.abs(entity().x - target().x)
    }
});

export const takeDamage = (entity, attack) => ({
    type: 'TAKE_DAMAGE',
    entity: entity(),
    attack: attack()
});

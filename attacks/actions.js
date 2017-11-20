const conjureTime = 3000; //ms
export const conjureFireball = owner => function* _conjureFireball() {
    //Create conjure object to keep track of amount of fireball conjured
    const conjureFireball = yield put(createConjureFireball(owner));
    console.log('result from conjure: ', conjureFireball);

    //when this yields, we've finished conjuring!
    yield tick(function* _tick(dt) {
        //increment the percent conjured
        const getPercent = yield put(incrementConjure(conjureFireball, dt / conjureTime));
        return 1 <= getPercent();
    });
    console.log('done conjuring.');

    return yield put(createFireball(owner));
};

const speed = 0.001; //x per ms
const fireballRadius = 0.1;
export const seek = (owner, target) => function* _seek() {
    yield tick(function* _tick(dt) {
        const distance = yield put(seekStep(owner, target, dt * speed));
        return fireballRadius > distance();
    });
};

const explosion_duration = 2000; //ms
// uses fireballRadius
export const fireballExplosion = x => function* _fireballExplosion() {
    //Create conjure object to keep track of amount of fireball conjured
    const explosion = yield put(createExplosion(x));

    yield tick(function* _tick(dt) {
        const getPercent = yield put(incrementConjure(explosion, dt / conjureTime));
        return 1 <= getPercent();
    });
};

let _id = 0;
export const createEntity = props => ({
    type: 'CREATE_ENTITY',
    id: ++_id,
    ...props
});

export const metaEntitiesSelector = {
    selector: state => state.entities.end()
};

export const createFireball = owner => createEntity({
    kind: 'spell',
    name: 'fireball',
    owner: owner(),
    meta: metaEntitiesSelector
});

export const createConjureFireball = owner => createEntity({
    name: 'conjuring fireball',
    elapsedTime: 0,
    meta: metaEntitiesSelector
});

export const incrementConjure = (entity, percent) => ({
    type: 'INCREMENT_CONJURE',
    entity: entity(),
    percent,
    meta: {
        selector: state => state.entities[entity.id].percent
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

export const createExplosion = x => createEntity({
    kind: 'spell',
    name: 'explosion',
    x,
    meta: metaEntitiesSelector
});

export const takeDamage = (target, attack) => ({
    type: 'TAKE_DAMAGE',
    target: target(),
    attack: attack()
});

import { put } from 'redux-yield-effect/lib/effects';
import { addTick } from 'effect-tick';

const speed = 0.1; //x per ms
const fireballRadius = 0.1;
export const seek = function* _seek(owner, target) {
    yield put(addTick(function* _tick(dt) {
        const distance = yield put(seekStep(owner, target, dt * speed));
        return fireballRadius > distance();
    }));
};

export const seekStep = (entity, target, distance) => ({
    type: 'SEEK_STEP',
    entity: entity(),
    target: target(),
    distance,
    meta: {
        selector: state => Math.sqrt(Math.pow(Math.abs(entity().x - target().x), 2) + Math.pow(Math.abs(entity().y - target().y), 2))
    }
});

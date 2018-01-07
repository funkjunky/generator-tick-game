import { put, fork, call } from 'redux-yield-effect/lib/effects';
import { tick } from 'effect-tick';

export const addJump = entity => ({
    type: 'ADD_JUMP',
    entity: entity(),
    meta: {
        selector: state => state.entities[entity().id].jumps
    }
});

export const removeJump = entity => ({
    type: 'REMOVE_JUMP',
    entity: entity()
});

export const jump_step = (entity, dt) => ({
    type: 'JUMP_STEP',
    entity: entity(),
    dt,
    meta: {
        selector: state => state.entities[entity().id].y
    }
});

//infinite jumps!
export default entity => function* _jump() {
    const jumpsUsed = yield put(addJump(entity));
    console.log('jumps used: ', jumpsUsed());
    if (jumpsUsed() <= 1) {
        yield tick(function* jump_tick(dt) {
            //Note: jump_step is responsible for ensuring entity doesn't fall below the stage.
            const y = yield put(jump_step(entity, dt));
            return y() === 0;
        });
    } else {
        yield tick(function* jump_tick(dt) {
            //TODO: leaky...
            return entity().y === 0;
        });
    }
    yield put(removeJump(entity));
};

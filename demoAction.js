import { put } from 'redux-yield-effect/lib/effects';
import { call } from './call.js';
import { tick } from './tick.js';

//Curry is necessary for react-redux later. connect shorthand
export default word => function* demoAction() {
    yield call(console.log, 'mmmmmy call');
    yield tick(function* mytickgen(dt) {
        yield put({ type: 'inside my tick gen, dt: ', dt });
        //yield call(console.log, 'again inside my tick gen', dt);
    });
};

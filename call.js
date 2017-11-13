export const TYPE__CALL = '__SIMPLE_CALL__'

//Description, The thing you yield
export const call = (fnc, ...args) => ({
    type: TYPE__CALL,
    payload: {
        fnc,
        args
    }
});

export const processor__call = (effect, { dispatch, effectGeneratorProcessor }) => {
    if(typeof effect.payload.fnc === 'function') {
        const res = effect.payload.fnc(...effect.payload.args);
        return res.then ? res : Promise.resolve(res);
    } else {
        return Promise.reject('call takes either a promise or a function');
    }
};

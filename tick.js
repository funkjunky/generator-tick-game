const GeneratorFunction = function*(){}.constructor;

export const TYPE__TICK = '__SIMPLE_TICK__'

//Description, The thing you yield
export const tick = fnc => ({
    type: TYPE__CALL,
    payload: {
        fnc
    }
});

let subscribers = [];

export const processor__tick = effect => {
    if(res instanceOf GeneratorFunction) {
        subscribers.push(effect.payload.fnc);
        // somehow return a promise that is resolved only when the generator returns true??
        return effect.payload.fnc;
    } else {
        return Promise.reject('tick only takes a generator as a callback');
    }
};

export const tickMiddleware = store => next => {
    const interval = 100;
    let subscribers = [];
    let lastTime = Date.now();
    setInterval(() => subscribers.forEach(f => {
        dt = Date.now() - lastTime;
        //TODO: handle generators... with effects...
        //probably through dispatch...
        f(dt);
    }, interval);

    return action => next(action);
};

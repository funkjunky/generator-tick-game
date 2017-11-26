const GeneratorFunction = function*(){}.constructor;

export const TYPE__TICK = '__SIMPLE_TICK__';

//Description, The thing you yield
export const tick = fnc => ({
    type: TYPE__TICK,
    payload: {
        fnc
    }
});

let subscribers = [];
let effectProcessor;
let _dispatch;

export const processor__tick = (effect, { effectGeneratorProcessor, dispatch }) => {
    //TODO: leaky... but I need the effect processor
    effectProcessor = effectGeneratorProcessor;
    _dispatch = dispatch;

    if(effect.payload.fnc instanceof GeneratorFunction) {
        return new Promise(resolve => subscribers.push([effect.payload.fnc, resolve]));
    } else {
        return Promise.reject('tick only takes a generator as a callback');
    }
};

export const tickMiddleware = (interval = 1000) => store => {
    let lastTime = Date.now();
    setInterval(() => {
        subscribers.forEach(([fnc, resolver]) => {
            const dt = Date.now() - lastTime;
            lastTime = Date.now();
            if(fnc instanceof GeneratorFunction) {
                const res = effectProcessor(fnc(dt), { dispatch: _dispatch });
                res.then(isComplete => {
                    if(isComplete) {
                        subscribers = subscribers.filter(([fnc, rr]) => rr !== resolver);
                        resolver();
                    }
                });
            } else {
                const isComplete = fnc(dt);
                if(isComplete) {
                    subscribers = subscribers.filter(([fnc, rr]) => rr !== resolver);
                    resolver();
                }
            }
        });
    }, interval);

    return next => action => next(action);
};

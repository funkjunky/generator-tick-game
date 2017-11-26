//Middleware, if meta.selector, then return the selector as a function.
//Similar to connect's mapStateToProps;

export default store => next => action => {
    if(action.meta && action.meta.selector) {
        next(action);
        const creationState = store.getState();
        return () => action.meta.selector(store.getState(), creationState);
    }
    return next(action);
};

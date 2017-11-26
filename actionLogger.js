export default selector => store => next => action => {
    document.querySelector(selector).insertAdjacentHTML('beforeend', '<div>' + getOutput(action) + '</div>');
    return next(action);
};

const getOutput = action => {
    if(typeof action === 'function') {
        return `Generator <${ action.name }>`;
    } else {
        return JSON.stringify(action, undefined, '\t');
    }
};

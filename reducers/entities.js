const magnitude = (x, y) => Math.sqrt(x*x + y*y);

export default (state={}, { type, entity, percent, attack, distance, target }) => {
    switch(type) {
        case 'CREATE_ENTITY':
            return {
                ...state,
                [entity.id]: entity
            };

        case 'REMOVE_ENTITY':
            const newState = { ...state };
            delete newState[entity.id];
            return newState;

        case 'INCREMENT_CONJURE':
            return {
                ...state,
                [entity.id]: {
                    ...state[entity.id],
                    percent: state[entity.id].percent + percent
                }
            };

        case 'SEEK_STEP':
            const distanceFromTarget = magnitude(target.x - entity.x, target.y - entity.y);
            const normalX = (target.x - entity.x) / distanceFromTarget;
            const normalY = (target.y - entity.y) / distanceFromTarget;

            return {
                ...state,
                [entity.id]: {
                    ...state[entity.id],
                    x: state[entity.id].x + normalX * distance,
                    y: state[entity.id].y + normalY * distance
                }
            };

        case 'TAKE_DAMAGE':
            return {
                ...state,
                [entity.id]: {
                    ...state[entity.id],
                    hp: state[entity.id].hp - attack.dmg
                }
            };

        default:
            return state;
    }
};

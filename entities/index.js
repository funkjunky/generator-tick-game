import { metaEntitiesSelector } from './metaEntitySelector';

const magnitude = (x, y) => Math.sqrt(x*x + y*y);

const JUMP_ACC = 0;
const JUMP_VEL = 80;
const GRAVITY = -200;
const TERMINAL = -200;

let _id = 0;
export const createEntity = props => ({
    type: 'CREATE_ENTITY',
    entity: {
        id: ++_id,
        ...props
    },
    meta: metaEntitiesSelector
});

export const removeEntity = entity => ({
    type: 'REMOVE_ENTITY',
    entity: entity()
});

export default (state={}, { type, entity, percent, attack, distance, target, dt }) => {
    switch(type) {
        case 'CREATE_ENTITY':
            return {
                ...state,
                [entity.id]: {
                    x: 0,
                    y: 0,
                    accY: 0,
                    velY: 0,
                    jumps: 0,
                    ...entity
                }
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

        case 'ADD_JUMP':
            console.log('entity: ', entity, state[entity.id]);
            return {
                ...state,
                [entity.id]: {
                    ...state[entity.id],
                    jumps: state[entity.id].jumps + 1,
                    accY: state[entity.id].accY + JUMP_ACC,
                    velY: state[entity.id].velY + JUMP_VEL
                }
            };

        case 'REMOVE_JUMP':
            return {
                ...state,
                [entity.id]: {
                    ...state[entity.id],
                    jumps: state[entity.id].jumps - 1
                }
            };

        case 'JUMP_STEP':
            const accY = state[entity.id].accY + GRAVITY * (dt / 1000);
            let velY = state[entity.id].velY + accY * (dt / 1000);
            if(velY < TERMINAL) velY = TERMINAL;
            const y = state[entity.id].y + velY * (dt / 1000);
            //console.log('acc, vel, y: ', accY, velY, y);
            if(y < 0)
                return {
                    ...state,
                    [entity.id]: {
                        ...state[entity.id],
                        accY: 0,
                        velY: 0,
                        y: 0
                    }
                };
            else
                return {
                    ...state,
                    [entity.id]: {
                        ...state[entity.id],
                        accY,
                        velY,
                        //If it's less than 0, then level it at 0
                        y
                    }
                };

        case 'SEEK_STEP':
            const vx = target.x - entity.x;
            const vy = target.y - entity.y;
            const distanceFromTarget = magnitude(vx, vy);
            const normalX = vx / distanceFromTarget;
            const normalY = vy / distanceFromTarget;
            //console.log('distance, normals: ', distance, normalX, normalY);

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

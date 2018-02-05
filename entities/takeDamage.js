export const takeDamage = (entity, attack) => ({
    type: 'TAKE_DAMAGE',
    entity: entity(),
    attack: attack()
});

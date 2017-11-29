export default (ctx, state, dt) => {
    const c = {
        purple:     '#b35ce5',
        darkGreen:  '#2dab9a',
        blue:       '#65ecda',
        green:      '#17ff70',
        red:        '#ff3f3f',
        orange:     '#ffaf3f'
    };

    const y = 100;
    const width = 5;

    const drawPerson = (person, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(person.x * 50, y + 50);
        ctx.lineTo(person.x * 50 + 25, y);
        ctx.lineTo(person.x * 50 - 25, y);
        ctx.closePath();
        ctx.stroke();

        //health bars
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';

        //full
        ctx.strokeRect(person.x * 50 - 25, y + 55, 50, 10);
        //remaining
        ctx.fillRect(person.x * 50 - 25, y + 55, 50 * (person.hp / person.maxhp), 10);
    };
    const draw = {
        jason: jason => drawPerson(jason, c.green),
        badGuy: badGuy => drawPerson(badGuy, c.purple),
        conjuringFireball: conjure => {
            ctx.lineWidth = width;
            ctx.strokeStyle = c.blue;
            ctx.globalAlpha = 1 - conjure.percent;
            ctx.beginPath();
            ctx.arc(conjure.owner.x * 50, y + 50, 50 - conjure.percent * 50, 0, Math.PI * 2);
            ctx.stroke();
        },
        fireball: fireball => {
            ctx.fillStyle = c.orange;
            ctx.lineWidth = width;
            ctx.strokeStyle = c.red;
            ctx.beginPath();
            ctx.arc(fireball.x * 50, y, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        },
        explosion: explosion => {
            ctx.fillStyle = c.orange;
            ctx.globalAlpha = 1 - explosion.percent;
            ctx.globalAlpha = 0.1 + (0.5 - ((Math.round(explosion.percent * 100) % 26) / 50))
            ctx.beginPath();
            ctx.arc(explosion.x * 50, y, 75, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    //BEGIN ACTUAL GRAPHICS
    ctx.clearRect(0, 0, 640, 480);
    //default colour
    ctx.fillStyle = c.darkGreen;

    ctx.fillRect(5, y + 100, 630, 10);

    Object.values(state.entities).reverse().forEach(entity => {
        ctx.save();
        draw[entity.name](entity)
        ctx.restore();
    });
};

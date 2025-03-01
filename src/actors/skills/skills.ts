import * as ex from "excalibur";
import { Images } from "../../resources";
import { damage } from "../damage";

/*const snowSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Snow,
  grid: {
    rows: 3,
    columns: 4,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});*/

const fireSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Fire,
  grid: {
    rows: 2,
    columns: 2,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const lightningSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Lightning,
  grid: {
    rows: 2,
    columns: 4,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const tornadoSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Tornado,
  grid: {
    rows: 1,
    columns: 2,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const animsp = 150;

const snowflake = new ex.Sprite({
  image: Images.Snowflake,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 376,
  },
});

const fireAnim = ex.Animation.fromSpriteSheet(
  fireSpriteSheet,
  ex.range(0, 4),
  animsp,
  ex.AnimationStrategy.Loop
);

const lightningAnim = ex.Animation.fromSpriteSheet(
  lightningSpriteSheet,
  ex.range(0, 8),
  animsp,
  ex.AnimationStrategy.End
);

const tornadoAnim = ex.Animation.fromSpriteSheet(
  tornadoSpriteSheet,
  ex.range(0, 1),
  animsp,
  ex.AnimationStrategy.Loop
);

export class Skill extends ex.Actor {
  public dmg: damage = new damage();

  public dealDamage(
    power: number,
    magic: boolean,
    el: string,
    target: number,
    inpA: number, //input attack/magic
    inpB: { [key: string]: number } //input buffs
  ) {
    if (magic) {
      this.dmg.amount = power * (inpA + (inpA * inpB["magic"]) / 100);
      this.dmg.magic = true;
    } else {
      this.dmg.amount = power * (inpA + (inpA * inpB["attack"]) / 100);
      this.dmg.magic = false;
    }
    this.dmg.element = el;
    this.dmg.target = target;
  }

  //possible skills:
  public snowFlake(
    inpA: number,
    inpB: { [key: string]: number },
    target: number,
    pos: ex.Vector,
    dmg: damage
  ) {
    this.dmg = dmg;
    let snowclound = new ex.Actor();
    this.addChild(snowclound);
    snowclound.pos = pos;
    snowclound.graphics.use(snowflake);
    snowclound.z=3;
    /*this.actions.callMethod(() => {
      snowclound.graphics.use(SnowAnim).reset();
    });*/
    const rotation = Math.PI; //the angle to rotate the snowflake arrow
    const rotationTime = rotation / ((animsp * 10) / 1000); //the time rotation is supposed to take
    //
    snowclound.actions.rotateBy(rotation/3*2, rotationTime, ex.RotationType.Clockwise);
    this.actions.delay(10 * 150);
    
    this.dealDamage(50, true, "ice", target, inpA, inpB);
    snowclound.actions.rotateBy(rotation/3,  rotationTime, ex.RotationType.Clockwise);
    this.actions.delay(5 * 150);
    this.actions.die();
    return 15 * 150; //animation total time
  }

  public fire(
    inpA: number,
    inpB: { [key: string]: number },
    target: number,
    pos: ex.Vector,
    dmg: damage
  ) {
    this.dmg = dmg;
    let fire = new ex.Actor();
    this.addChild(fire);
    fire.pos = pos;
    fire.z=3;
    this.actions.callMethod(() => {
      fire.graphics.use(fireAnim).reset();
    });
    this.actions.delay(10 * 150);
    this.dealDamage(50, true, "fire", target, inpA, inpB);
    this.actions.delay(5 * 150);
    this.actions.die();
    return 15 * 150; //animation total time
  }

  public lightning(
    inpA: number,
    inpB: { [key: string]: number },
    target: number,
    pos: ex.Vector,
    dmg: damage
  ) {
    this.dmg = dmg;
    let lightning = new ex.Actor();
    this.addChild(lightning);
    lightning.pos = pos;
    lightning.z=3;
    this.actions.callMethod(() => {
      lightning.graphics.use(lightningAnim).reset();
    });
    this.actions.delay(10 * 150);
    this.dealDamage(50, true, "lightning", target, inpA, inpB);
    this.actions.delay(5 * 150);
    this.actions.die();
    return 15 * 150; //animation total time
  }

  public tornado(
    inpA: number,
    inpB: { [key: string]: number },
    target: number,
    pos: ex.Vector,
    dmg: damage
  ) {
    this.dmg = dmg;
    let tornado = new ex.Actor();
    this.addChild(tornado);
    tornado.pos = pos;
    tornado.z=3;
    this.actions.callMethod(() => {
      tornado.graphics.use(tornadoAnim).reset();
    });
    this.actions.delay(10 * 150);
    this.dealDamage(50, true, "wind", target, inpA, inpB);
    this.actions.delay(5 * 150);
    this.actions.die();
    return 15 * 150; //animation total time
  }
}

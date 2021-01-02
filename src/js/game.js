
const TIMEMOVEUP = 0.15;
const TIMEMOVERIGHT = 0.15;
const TIMEMOVEDOWN = 0.175;
import 'pixi.js'
import { Spine } from 'pixi-spine';
import { sound } from '@pixi/sound';
import { gsap } from "gsap";
var numBottleAdd = 0
export default class Game {
    constructor(params) {
        this.main = params
        this.app = params.app;
        this.loader = params.loader;
        this.player = null
        this.map = null

        this.complete = true
        this.bottleW = 0;
        this.ballW = 0;
        this.listBottleA = [];
        this.listBottleB = [];
        this.diaphragm = null;
        this.confettiContainer = new PIXI.Container();
        this.levelContainer = new PIXI.Container();
        this.settingContainer = new PIXI.Container();

        this.containerMain = new PIXI.Container();

        this.containerWin = new PIXI.Container();
        this.createContainer()
        this.listcheckl2 = [];
        this.hack = false;
    }


    setPlayer(param) {
        var player = JSON.parse(JSON.stringify(param))
        var temp = this.converLevel(player.map)
        return Object.assign(player, temp);
    }
    converLevel(maplevel) {
        var quantityBottle = maplevel.length / 4
        var listColor = []
        while (maplevel.length) {
            listColor.push(maplevel.splice(0, 4));
        }
        return {
            "bottle": quantityBottle,
            "map": listColor
        }
    }
    init(map) {
        if (map) this.map = map
        else {
            this.player = this.setPlayer(this.main.player)
            this.map = this.player.map.slice()
        }
        this.setZindex()

        this.drawTextLevel()
        this.setLCBottle(this.player.bottle);
        this.setMap(this.bottleBase.indexRow);
        this.drawSetting()
        if (this.player.level == 1) this.addHand()
        else if (this.player.level == 2) this.checkLevel2()

        console.log(this.app.stage.children);

    }
    createContainer() {
        this.diaphragm = new PIXI.Graphics();
        this.diaphragm.name = 'diaphragm'
        this.diaphragm.beginFill(0x000000);
        this.diaphragm.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        this.diaphragm.alpha = 0


        this.containerMain.name = 'main container'
        this.app.stage.addChild(this.containerMain);

        this.confettiContainer.name = 'confetti Container'
        this.app.stage.addChild(this.confettiContainer)

        this.levelContainer.name = 'level container'
        this.app.stage.addChild(this.levelContainer)

        this.app.stage.addChild(this.diaphragm)

        this.settingContainer.name = 'setting container'
        this.app.stage.addChild(this.settingContainer)

        this.containerWin.name = 'win container'
        this.app.stage.addChild(this.containerWin);
    }
    setZindex() {
        this.containerMain.zIndex = 1
        this.confettiContainer.zIndex = 3
        this.diaphragm.zIndex = 2
        this.settingContainer.zIndex = 4
        this.containerWin.zIndex = 5
    }
    setLCBottle(quantity) {
        var WIDTH = this.app.screen.width
        var HEIGHT = this.app.screen.height
        this.bottleW = WIDTH / 8.5
        this.ballW = WIDTH / 12.1
        var indexRow = this.divideRow(quantity);
        var startY = [];
        if (indexRow.numR1 <= 6) {
            this.bottleW = WIDTH / 7;
            this.ballW = WIDTH / 9.5;
            if (indexRow.row == 1) startY.push(HEIGHT / 3)
            else startY = [HEIGHT / 6.2, HEIGHT / 2]
        }
        else if (indexRow.numR1 <= 7) {
            this.bottleW = WIDTH / 7.5;
            this.ballW = WIDTH / 10;

            if (indexRow.row == 1) startY.push(HEIGHT / 3)
            else startY = [HEIGHT / 6.2, HEIGHT / 2]
        }
        else if (indexRow.numR1 <= 8) {
            this.bottleW = WIDTH / 9;
            this.ballW = WIDTH / 11.5;

            if (indexRow.row == 1) startY.push(HEIGHT / 3)
            else startY = [HEIGHT / 5, HEIGHT / 2]
        } else {
            this.bottleW = WIDTH / 10;
            this.ballW = WIDTH / 12.5;
            if (indexRow.row == 1) startY.push(HEIGHT / 3)
            else startY = [HEIGHT / 4.5, HEIGHT / 2]
        }
        const bottle = PIXI.Sprite.from(this.loader.resources.bottle.texture);
        const scale_bottle = this.bottleW / bottle.getBounds().width
        bottle.scale.set(scale_bottle, scale_bottle);


        var startX, defaultX, distanceBottle;
        if (indexRow.row == 1) {
            var indexXBottle0 = this.renderStartXBottle(indexRow.numR1);
            startX = indexXBottle0.startX;
            defaultX = [indexXBottle0.defaultX];
            distanceBottle = [indexXBottle0.distanceBottle];
        } else {
            var indexXBottle0 = this.renderStartXBottle(indexRow.numR1);
            var indexXBottle1 = this.renderStartXBottle(indexRow.numR2, true);
            startX = indexXBottle0.startX.concat(indexXBottle1.startX);
            defaultX = [indexXBottle0.defaultX, indexXBottle1.defaultX];
            distanceBottle = [indexXBottle0.distanceBottle, indexXBottle1.distanceBottle];
        }
        this.bottleBase = {
            indexRow: indexRow,
            width: bottle.width,
            height: bottle.height,
            scale: scale_bottle,
            defaultX: defaultX,
            distanceBottle: distanceBottle,
            startX: startX,
            startY: startY
        };


        const ball = PIXI.Sprite.from(this.loader.resources.balls.textures["ball_1.png"]);
        const scale_ball = this.ballW / ball.getBounds().width
        ball.scale.set(scale_ball, scale_ball);


        var heightBall = ball.getBounds().height * 0.95;
        var distanceBall = (this.bottleBase.width - ball.getBounds().width) / 2;
        var dy1 = this.bottleBase.startY[0] + this.bottleBase.height * 0.98;
        var dy2 = this.bottleBase.startY[1] + this.bottleBase.height * 0.98;
        this.ballBase = {
            width: ball.width,
            height: ball.height,
            scale: scale_ball,
            startX: this.bottleBase.startX.map(x => x + distanceBall),
            startY1: [dy1 - heightBall * 4, dy1 - heightBall * 3, dy1 - heightBall * 2, dy1 - heightBall],
            startY2: [dy2 - heightBall * 4, dy2 - heightBall * 3, dy2 - heightBall * 2, dy2 - heightBall],
        };
        var x0 = this.ballBase.startX[0],
            y0 = this.bottleBase.startY[0] - this.ballBase.height * 1,
            x1 = this.ballBase.startX[1],
            y1 = this.bottleBase.startY[0] - this.ballBase.height * 1;
        var distance = this.getDistance({ x: x0, y: y0 }, { x: x1, y: y1 });
        this.speed = distance / 50;

    }

    divideRow(quantity) {
        if (quantity >= 2 && quantity <= 5) {
            return {
                row: 1,
                numR1: quantity
            }
        }
        else if (quantity >= 6) {
            return {
                row: 2,
                numR1: Math.floor(quantity / 2) + 1,
                numR2: quantity - (Math.floor(quantity / 2) + 1)
            }
        } else return null
    }

    renderStartXBottle(quantity, row2) {
        var unusedArea = this.app.screen.width - (this.bottleW * quantity)
        var defaultX, distanceBottle;
        if (quantity == 2) {
            if (row2 == true) {
                defaultX = (unusedArea * 2.5 / 3) / 2;
                distanceBottle = (unusedArea * 0.5 / 3) / (quantity - 1);
            } else {
                defaultX = (unusedArea * 2.25 / 3) / 2;
                distanceBottle = (unusedArea * 0.75 / 3) / (quantity - 1);
            }
        } else if (quantity == 3) {
            if (row2 == true) {
                defaultX = (unusedArea * 2 / 3) / 2;
                distanceBottle = (unusedArea / 3) / (quantity - 1);
            } else {
                defaultX = (unusedArea * 1.75 / 3) / 2;
                distanceBottle = (unusedArea * 1.25 / 3) / (quantity - 1);
            }
        }
        else if (quantity <= 5) {
            if (row2 == true) {
                defaultX = (unusedArea * 1.8 / 3) / 2;
                distanceBottle = (unusedArea * 1.2 / 3) / (quantity - 1);
            } else {
                defaultX = (unusedArea / 3) / 2;
                distanceBottle = (unusedArea * 2 / 3) / (quantity - 1);
            }
        }
        else {
            defaultX = (unusedArea * 2 / 3) / 2;
            distanceBottle = (unusedArea / 3) / (quantity - 1);
        }
        var plus = this.bottleW + distanceBottle;
        var startX = []
        for (let i = 0; i < quantity; i++) {
            startX.push(defaultX + plus * i)
        }
        return { startX: startX, defaultX: defaultX, distanceBottle: distanceBottle }
    }

    setMap(indexRow) {
        this.listBottle = [];
        for (let i = 0; i < this.map.length; i++) {
            const listColor = this.map[i];

            const bottle = PIXI.Sprite.from(this.loader.resources.bottle.texture);
            bottle.scale.set(this.bottleBase.scale, this.bottleBase.scale);
            bottle.name = 'bottle_' + i

            bottle.position.set(this.bottleBase.startX[i], i >= indexRow.numR1 ? this.bottleBase.startY[1] : this.bottleBase.startY[0]);
            bottle.interactive = true;
            bottle.on('pointerdown', () => {
                if (this.player.level == 1) this.eventLevel_1(i)
                else if (this.player.level == 2) this.eventLevel_2(i)
                else this.click_Bottle(i)
            })
            var listBall = [];
            for (let j = 0; j < listColor.length; j++) {
                const color = listColor[j];
                if (color > 0) {
                    const ball = PIXI.Sprite.from(this.loader.resources.balls.textures["ball_" + color + ".png"]);
                    ball.scale.set(this.ballBase.scale, this.ballBase.scale);
                    ball.position.set(this.ballBase.startX[i], i >= indexRow.numR1 ? this.ballBase.startY2[j] : this.ballBase.startY1[j]);

                    listBall.push(ball);
                    this.containerMain.addChild(ball);
                }
            }
            this.listBottle.push({ listBall: listBall, status: true });
            this.containerMain.addChild(bottle);
        }
    }
    click_Bottle(param) {
        const indexChoose = param
        if (indexChoose != null) {
            if (this.listBottleA.length == this.listBottleB.length) {
                if (this.map[indexChoose].lastIndexOf(0) != 3) {
                    if (this.listBottle[indexChoose].status == true) {
                        var choose = this.getBallChoose(indexChoose);
                        this.listBottleA.push(choose);
                        this.upBallChoose();
                    };
                };
            } else {
                var oldChoose = this.listBottleA[this.listBottleA.length - 1].index
                var newColor = this.getBallEmpty(indexChoose);
                if (indexChoose != oldChoose && newColor.num > 0) {
                    if (this.listBottle[indexChoose].status == true) {
                        var oldColor = this.listBottleA[this.listBottleA.length - 1]
                        if (newColor.color == oldColor.color || newColor.num == 4) {
                            this.listBottleB.push(newColor);
                            this.moveBallChoose();
                        } else if (this.hack == true) {
                            this.listBottleB.push(newColor);
                            this.moveBallChoose(true);
                        } else {
                            this.downBallChoose();
                        }
                    }
                } else {
                    this.downBallChoose();
                }
            }
        }
    }

    getBallChoose(index) {
        var arrcolor = this.map[index]
        var indexEmpty = arrcolor.lastIndexOf(0)
        var color = arrcolor[indexEmpty + 1]
        var num = 1;
        for (let i = indexEmpty + 2; i < arrcolor.length; i++) {
            const newColor = arrcolor[i]

            if (newColor == color) {
                num += 1
            } else break;
        }
        return { index: index, color: color, num: num }
    }

    getBallEmpty(index) {
        var arrcolor = this.map[index]
        var color = null;
        var indexEmpty = arrcolor.lastIndexOf(0)
        if (indexEmpty == 3) return { index: index, color: color, num: indexEmpty + 1 }
        else {
            color = arrcolor[indexEmpty + 1]
            return { index: index, color: color, num: indexEmpty + 1 }
        }

    }
    upBallChoose() {
        var indexChoose = this.listBottleA[this.listBottleA.length - 1].index;
        this.listBottle[indexChoose].status = false;
        var ball = this.listBottle[indexChoose].listBall[0];
        var temp = this.bottleBase.indexRow.numR1
        var y = indexChoose < temp ? this.bottleBase.startY[0] - this.ballBase.height * 1 : this.bottleBase.startY[1] - this.ballBase.height * 1;
        gsap.to(ball, { y: y, duration: TIMEMOVEUP, ease: "none" })
            .eventCallback("onComplete", () => {
                this.listBottle[indexChoose].status = true;
            });;
    }
    downBallChoose() {
        var indexChoose = this.listBottleA[this.listBottleA.length - 1].index;
        this.listBottle[indexChoose].status = false;
        this.listBottleA.pop();
        var ball = this.listBottle[indexChoose].listBall[0];
        var indexBall = 4 - this.listBottle[indexChoose].listBall.length;

        var temp = this.bottleBase.indexRow.numR1
        var y = indexChoose < temp ? this.ballBase.startY1[indexBall] : this.ballBase.startY2[indexBall];

        gsap.to(ball, { y: y, duration: TIMEMOVEDOWN, ease: "none" })
            .eventCallback("onComplete", () => {
                this.leapBall(ball)
                this.PlaySound('ball_fall_1')
                setTimeout(() => { this.listBottle[indexChoose].status = true; }, 250);

            });
    }
    leapBall(ball) {
        var y = ball.y
        gsap.timeline()
            .to(ball, { y: y - this.bottleBase.height / 20, duration: 0.1, ease: "none" })
            .to(ball, { y: y, duration: 0.1, ease: "none" })
    }

    moveBallChoose(useHack) {
        if (this.hack && useHack == true) {
            this.hack = false
            this.main.closeAlert();
        } else if (this.hack && useHack == null) {
            this.hack = true;
            this.main.closeAlertDontUse()
        }

        var complete = 0;
        let oldChoose = this.listBottleA[this.listBottleA.length - 1];
        let newChoose = this.listBottleB[this.listBottleB.length - 1];

        this.listBottle[newChoose.index].status = false;

        var num = oldChoose.num >= newChoose.num ? newChoose.num : oldChoose.num

        var maxIndexNew = this.map[newChoose.index].lastIndexOf(0);
        var temp = this.bottleBase.indexRow.numR1

        var x0 = this.listBottle[oldChoose.index].listBall[0].x
        var y0 = oldChoose.index < temp ? this.bottleBase.startY[0] - this.ballBase.height : this.bottleBase.startY[1] - this.ballBase.height;

        var x1 = this.ballBase.startX[newChoose.index]
        var y1 = newChoose.index < temp ? this.bottleBase.startY[0] - this.ballBase.height : this.bottleBase.startY[1] - this.ballBase.height;


        var distance = this.getDistance({ x: x0, y: y0 }, { x: x1, y: y1 });
        var timeRight = (distance / this.speed) / 1000;
        var i = 0

        var y2 = newChoose.index < temp ? this.ballBase.startY1[maxIndexNew - i] : this.ballBase.startY2[maxIndexNew - i];

        var ball = this.listBottle[oldChoose.index].listBall[0];
        var target = this.listBottle[oldChoose.index].listBall.shift();
        this.listBottle[newChoose.index].listBall.unshift(target);

        if (y1 > y0) { y0 -= this.ballBase.height * 0.3 }
        else if (y1 < y0) { y1 -= this.ballBase.height * 0.3 }
        gsap.timeline()
        
            .to(ball, { x: x1, y: y1, duration: timeRight, ease: "none" })
            .to(ball, { y: y2, duration: TIMEMOVEDOWN, ease: "none" })
            .eventCallback("onComplete", () => {
                if (num == 1) {
                    this.leapBall(ball)
                    this.moveEnd(newChoose.index, x1, y1)
                }
            });
        setTimeout(() => { this.PlaySound("ball_fall_" + num) }, TIMEMOVEUP + timeRight + TIMEMOVEDOWN / 2);

        complete++
        i++
        if (i < num) {
            var myInterval = setInterval(() => { test() }, 50);
            const test = () => {
                y2 = newChoose.index < temp ? this.ballBase.startY1[maxIndexNew - i] : this.ballBase.startY2[maxIndexNew - i];
                ball = this.listBottle[oldChoose.index].listBall[0];
                target = this.listBottle[oldChoose.index].listBall.shift();
                this.listBottle[newChoose.index].listBall.unshift(target);

                gsap.timeline()
                    .to(ball, { y: y0, duration: TIMEMOVEUP, ease: "none" })
                    .to(ball, { x: x1, y: y1, duration: timeRight, ease: "none" })
                    .to(ball, { y: y2, duration: TIMEMOVEDOWN, ease: "none" })
                    .eventCallback("onComplete", () => {
                        complete++
                        if (complete == num) {
                            this.leapBall(ball)
                            setTimeout(() => { this.moveEnd(newChoose.index, x1, y1) }, 125);
                        }
                    });
                i++
                if (i == num) clearInterval(myInterval);
            }
            test()
        }
        this.convertMap();
    }

    convertMap() {
        let oldChoose = this.listBottleA[this.listBottleA.length - 1];
        let newChoose = this.listBottleB[this.listBottleB.length - 1];
        let oldColorArr = this.map[oldChoose.index]
        let newColorArr = this.map[newChoose.index]
        var num = oldChoose.num >= newChoose.num ? newChoose.num : oldChoose.num
        while (num > 0) {
            num -= 1
            oldColorArr.splice(oldColorArr.lastIndexOf(0) + 1, 1, 0);
            newColorArr.splice(newColorArr.lastIndexOf(0), 1, oldChoose.color);
        }
        this.map.splice(oldChoose.index, 1, oldColorArr);
        this.map.splice(newChoose.index, 1, newColorArr);

        this.listBottle[oldChoose.index].status = true;
        this.listBottle[newChoose.index].status = true;
    }
    moveEnd(index, x, y) {
        var bottleComplete = checkCompleteItem(this.map[index])
        if (bottleComplete) {
            if (this.main.vibration) navigator.vibrate(100);
            this.PlaySound("bottleComplete")
            this.setConfetti(x + this.bottleBase.width / 3, y + this.bottleBase.height, this.app.screen.width * 0.2)
            if (this.checkWin() && this.complete) {
                this.containerMain.interactiveChildren = false
                this.complete = false;
                setTimeout(() => { this.drawWin(); console.log('win'); }, 1100);
            }
        }
    }
    getDistance(p1, p2) {
        var a = p1.x - p2.x;
        var b = p1.y - p2.y;
        return Math.sqrt(a * a + b * b);
    }
    PlaySound(name) {
        switch (name) {
            case 'ball_fall_1':
                var sound_game = this.loader.resources.ball_fall_1.sound
                sound_game.play()
                break;
            case 'ball_fall_2':
                var sound_game = this.loader.resources.ball_fall_2.sound
                sound_game.play()
                break;
            case 'ball_fall_3':
                var sound_game = this.loader.resources.ball_fall_3.sound
                sound_game.play()
                break;
            case 'ball_fall_4':
                var sound_game = this.loader.resources.ball_fall_4.sound
                sound_game.play()
                break;
            case 'firework':
                var sound_game = this.loader.resources.firework.sound
                sound_game.play()
                break;
            case 'bottleComplete':
                var sound_game = this.loader.resources.bottleComplete.sound
                sound_game.volume = 0.8;
                sound_game.play()
                break;
            case 'Button_Click':
                var sound_game = this.loader.resources.Button_Click.sound
                sound_game.play()
                break;
            case 'win':
                var sound_game = this.loader.resources.win.sound
                sound_game.volume = 0.5;
                sound_game.play()
                break;
        }
        // sound.volumeAll = 0

    }
    setConfetti(x, y, width) {
        var confetti = new Spine(this.loader.resources.confetti.spineData);
        confetti.skeleton.setToSetupPose();
        confetti.update(0);
        const win = new PIXI.Container();
        win.addChild(confetti);
        const localRect = confetti.getLocalBounds();

        confetti.position.set(-localRect.x, -localRect.y);


        win.scale.set(width / win.width, width / win.width);
        win.position.set(x - win.width * 0.45, y - win.height * 0.8);
        this.confettiContainer.addChild(win);

        confetti.state.setAnimation(0, 'animation', false);
        confetti.state.timeScale = 1.45
    }
    drawWin() {
        this.PlaySound('win')

        this.diaphragm.alpha = 0.7


        this.setCheerBelow()
        this.setFireworkBelow()
        this.setConfettiWin('left', true)
        this.setConfettiWin('right', false)
        setTimeout(() => { this.setConfettiWin('right', true) }, 600);

        const btn_next = PIXI.Sprite.from(this.loader.resources.buttons.textures["btn_next.png"]);
        btn_next.scale.set((this.app.screen.width * 0.36) / btn_next.width, (this.app.screen.width * 0.35) / btn_next.width);
        btn_next.position.set(-btn_next.width, this.app.screen.height * 0.55);
        this.containerWin.addChild(btn_next)
        btn_next.interactive = true;

        var tl = gsap.timeline();
        tl.delay(1)
        tl.to(btn_next, { duration: 0.4, x: (this.app.screen.width - btn_next.width) / 2, ease: "back.out(2)" })

        btn_next.on('pointerdown', () => {
            if (this.player.level == 2) {
                for (let i = 0; i < this.listcheckl2.length; i++) {
                    const tick = this.listcheckl2[i];
                    this.app.stage.removeChild(tick)
                }
                this.listcheckl2 = null
                var text = document.getElementById("text_level")
                text.remove()
            }
            this.pixiRemoveAllChildren(this.containerWin)
            this.diaphragm.alpha = 0
            this.complete = true;
            this.main.nextLevelAds()
        });
    }
    setCheerBelow() {
        var highscore = new Spine(this.loader.resources.Highscore.spineData);
        highscore.skeleton.setToSetupPose();
        highscore.update(0);
        // highscore.autoUpdate = false;
        const win = new PIXI.Container();
        win.addChild(highscore);
        const localRect = highscore.getLocalBounds();

        highscore.position.set(-localRect.x, -localRect.y);

        const scale = Math.min((this.app.screen.width * 1.23) / win.width, (this.app.screen.height) / win.height);
        win.scale.set(scale, scale);
        win.position.set((this.app.screen.width - win.width * 1.08) * 0.5, this.app.screen.height);

        this.containerWin.addChild(win);
        highscore.state.setAnimation(0, 'animation', true);
    }
    setFireworkBelow() {
        var fireworkBelow = new Spine(this.loader.resources.winscr.spineData);
        fireworkBelow.skeleton.setToSetupPose();
        fireworkBelow.update(0);
        // highscore.autoUpdate = false;
        const win = new PIXI.Container();
        win.addChild(fireworkBelow);
        const localRect = fireworkBelow.getLocalBounds();

        fireworkBelow.position.set(-localRect.x, -localRect.y);

        const scale = Math.min((this.app.screen.width * 1.2) / win.width, (this.app.screen.height) / win.height,);
        win.scale.set(scale, scale);
        win.position.set((this.app.screen.width - win.width) / 2, -win.height * 0.2);

        this.containerWin.addChild(win);

        fireworkBelow.state.setAnimation(0, 'Appear', false);
        fireworkBelow.state.addAnimation(0, 'Idle', true, 0);
    }

    setConfettiWin(position, status) {
        var confetti = new Spine(this.loader.resources.confetti.spineData);
        confetti.skeleton.setToSetupPose();
        const win = new PIXI.Container();
        win.addChild(confetti);
        const localRect = confetti.getLocalBounds();
        confetti.position.set(-localRect.x, -localRect.y);
        confetti.update(0);
        if (position == 'left') {
            win.scale.set((this.app.screen.width * 0.3) / win.width, (this.app.screen.width * 0.3) / win.width);
            win.position.set(-win.width / 2.5, win.height);
        } else {
            confetti.skeleton.scaleX = -1;
            win.scale.set((this.app.screen.width * 0.3) / win.width, (this.app.screen.width * 0.3) / win.width);
            win.position.set(this.app.screen.width - win.width / 2.5, win.height * 1.1);
        }
        this.containerWin.addChild(win);
        confetti.state.setAnimation(0, 'animation2', status);
    }

    checkWin() {
        var win = 0;
        var complete = this.listBottle.every(function (item) {
            return item.status == true;
        });
        for (let i = 0; i < this.map.length; i++) {
            const listColor = this.map[i];
            const color0 = listColor[0];
            let isWin = listColor.every(function (item) {
                return item == color0;
            });
            if (isWin) win++;
        }
        if (win == this.player.bottle && complete == true) return true;
        else return false;
    }

    addBottle() {
        if (this.player.bottle <= 15) {
            this.map.push([0, 0, 0, 0]);
            numBottleAdd++
            this.player.bottle += 1
            this.listBottle = [];
            this.removeAllChildMainContainer()
            var preMap = this.map.slice()
            this.init(preMap);
        }
    }
    restartLevel() {
        this.removeAllChildMainContainer()
        this.player.bottle -= numBottleAdd
        numBottleAdd = 0
        this.clearDataLevel();
        this.init();
    }
    previousStep() {
        let oldChoose = this.listBottleA[this.listBottleA.length - 1];
        let newChoose = this.listBottleB[this.listBottleB.length - 1];

        let oldColorArr = this.map[oldChoose.index].slice()
        let newColorArr = this.map[newChoose.index].slice()

        var num = oldChoose.num >= newChoose.num ? newChoose.num : oldChoose.num
        while (num > 0) {
            num -= 1
            newColorArr.splice(newColorArr.lastIndexOf(0) + 1, 1, 0);
            oldColorArr.splice(oldColorArr.lastIndexOf(0), 1, oldChoose.color);
        }

        this.map.splice(oldChoose.index, 1, oldColorArr);
        this.map.splice(newChoose.index, 1, newColorArr);
        this.listBottleA.pop()
        this.listBottleB.pop()
        this.listBottle = [];
        this.removeAllChildMainContainer()
        var preMap = this.map.slice()
        this.init(preMap);
    }
    nextLevel() {
        this.containerMain.interactiveChildren = true;
        this.removeAllChildMainContainer()
    }
    clearDataLevel() {
        this.pixiRemoveAllChildren(this.confettiContainer)
        this.listBottle = [];
        this.listBottleA = [];
        this.listBottleB = [];
        this.complete = true;
    }

    drawTextLevel() {
        while (this.levelContainer.children[0]) {
            this.levelContainer.removeChild(this.levelContainer.children[0]);
        }
        this.app.stage.removeChild(this.levelContainer)

        this.levelContainer = new PIXI.Container();
        this.levelContainer.name = 'level container'
        this.app.stage.addChild(this.levelContainer)

        var levelCr = this.player.level + ''
        var percent = levelCr.length == 1 ? 1.5 : levelCr.length == 2 ? 1.7 : 2
        var btn_ads = this.main.buttonContainer.getChildByName('btn_ads')
        var btn_setting = this.main.buttonContainer.getChildByName('btn_setting')

        var widthLevel = (btn_ads.x - btn_setting.x - btn_setting.width) * percent / 3
        var level = new PIXI.Sprite(this.loader.resources.number.textures["Level.png"]);

        this.levelContainer.addChild(level)
        for (let i = 0; i < levelCr.length; i++) {
            var num = 'LV_' + levelCr.charAt(i) + '.png'
            var txtNum = new PIXI.Sprite(this.loader.resources.number.textures[num]);
            txtNum.x = i == 0 ? this.levelContainer.width * 1.1 : this.levelContainer.width
            this.levelContainer.addChild(txtNum)
        }

        var scaleContainer = widthLevel / this.levelContainer.getBounds().width
        this.levelContainer.scale.set(scaleContainer, scaleContainer);

        this.levelContainer.position.set((this.app.screen.width - this.levelContainer.width) / 2,
            btn_setting.y + btn_setting.height - this.levelContainer.height * 1.3);
    }

    drawSetting() {

        var WIDTH = this.app.screen.width
        var HEIGHT = this.app.screen.height

        var bg_setting = new PIXI.Sprite(this.loader.resources.setting.textures["Bar_setting.png"]);
        var scale_bg_setting = (WIDTH * 0.8) / bg_setting.width
        bg_setting.scale.set(scale_bg_setting, scale_bg_setting);
        bg_setting.position.set((WIDTH - bg_setting.width) / 2, bg_setting.height / 3);


        var logo = new PIXI.Sprite(this.loader.resources.setting.textures["dino_flip.png"]);
        var scale_logo = (WIDTH / 3) / logo.width
        logo.scale.set(scale_logo, scale_logo);
        logo.position.set((WIDTH - logo.width) / 1.8, bg_setting.y + bg_setting.height / 4.5);

        var btn_close = new PIXI.Sprite(this.loader.resources.setting.textures["btn_close.png"]);
        btn_close.scale.set(scale_bg_setting * 1.05, scale_bg_setting * 1.05);
        btn_close.position.set(bg_setting.x + bg_setting.width - btn_close.width * 1.03, bg_setting.y + btn_close.height / 4);

        var btn_setting = new PIXI.Sprite(this.loader.resources.setting.textures["setting.png"]);
        btn_setting.scale.set(scale_bg_setting, scale_bg_setting);
        btn_setting.position.set((WIDTH - btn_setting.width) / 2, bg_setting.y + bg_setting.height / 25);

        var police = new PIXI.Sprite(this.loader.resources.setting.textures["police.png"]);
        police.scale.set(scale_bg_setting, scale_bg_setting);
        police.position.set((WIDTH - police.width) / 2, bg_setting.y + bg_setting.height * 0.875);

        var btn_device_vibrate = new PIXI.Sprite(this.loader.resources.setting.textures["btn_device.png"]);
        btn_device_vibrate.scale.set(scale_bg_setting * 0.95, scale_bg_setting * 0.95);
        btn_device_vibrate.position.set(WIDTH / 2 - btn_device_vibrate.width * 1.1, logo.y + logo.height * 1.15);

        var vibration_on = new PIXI.Sprite(this.loader.resources.setting.textures["vibration_on.png"]);
        vibration_on.name = 'vibration_on.png'
        vibration_on.scale.set(scale_bg_setting, scale_bg_setting);
        vibration_on.position.set(btn_device_vibrate.x + (btn_device_vibrate.width - vibration_on.width) / 2,
            btn_device_vibrate.y + (btn_device_vibrate.height - vibration_on.height) / 2);

        var vibration_off = new PIXI.Sprite(this.loader.resources.setting.textures["vibration_off.png"]);
        vibration_off.name = 'vibration_off.png'
        vibration_off.scale.set(scale_bg_setting, scale_bg_setting);
        vibration_off.position.set(btn_device_vibrate.x + (btn_device_vibrate.width - vibration_off.width) / 2,
            btn_device_vibrate.y + (btn_device_vibrate.height - vibration_off.height) / 2);


        var btn_device_sound = new PIXI.Sprite(this.loader.resources.setting.textures["btn_device.png"]);
        btn_device_sound.scale.set(scale_bg_setting * 0.95, scale_bg_setting * 0.95);
        btn_device_sound.position.set(WIDTH / 2 + btn_device_sound.width * 0.1, logo.y + logo.height * 1.15);


        var sound_on = new PIXI.Sprite(this.loader.resources.setting.textures["sound_on.png"]);
        sound_on.name = 'sound_on.png'
        sound_on.scale.set(scale_bg_setting, scale_bg_setting);
        sound_on.position.set(btn_device_sound.x + (btn_device_sound.width - sound_on.width) / 2,
            btn_device_sound.y + (btn_device_sound.height - sound_on.height) / 2);

        var sound_off = new PIXI.Sprite(this.loader.resources.setting.textures["sound_off.png"]);
        sound_off.name = 'sound_off.png'
        sound_off.scale.set(scale_bg_setting, scale_bg_setting);
        sound_off.position.set(btn_device_sound.x + (btn_device_sound.width - sound_off.width) / 2,
            btn_device_sound.y + (btn_device_sound.height - sound_off.height) / 2);

        if (this.main.sound) sound_off.alpha = 0
        else sound_on.alpha = 0
        if (this.main.vibration) vibration_off.alpha = 0
        else vibration_on.alpha = 0

        this.settingContainer.addChild(bg_setting, logo, btn_close, btn_setting, police, btn_device_vibrate, btn_device_sound, vibration_on, vibration_off, sound_on, sound_off)

        btn_close.interactive = true;
        btn_device_vibrate.interactive = true;
        btn_device_sound.interactive = true;


        this.settingContainer.position.set(0, - this.settingContainer.height * 2);
        // this.settingContainer.position.set(0, 0);

        btn_close.on('pointerdown', () => {
            this.closeSetting()
            console.log('click btn_close');
        });

        btn_device_vibrate.on('pointerdown', () => {
            if (this.main.vibration) {
                this.main.vibration = false
                vibration_off.alpha = 1
                vibration_on.alpha = 0
            } else {
                this.main.vibration = true
                vibration_off.alpha = 0
                vibration_on.alpha = 1
            }
            console.log('click btn_device_vibrate');
        });
        btn_device_sound.on('pointerdown', () => {
            if (this.main.sound) {
                sound.toggleMuteAll(false);
                this.main.sound = false
                sound_off.alpha = 1
                sound_on.alpha = 0
            } else {
                sound.toggleMuteAll(true);
                this.main.sound = true
                sound_off.alpha = 0
                sound_on.alpha = 1
            }
            console.log('click btn_device_sound');
        });
    }

    openSetting() {
        console.log('click open');
        this.diaphragm.alpha = 0.7
        gsap.timeline()
            .to(this.settingContainer, { y: 0, duration: 0.55, ease: "back.out(2)" })
    }

    closeSetting() {
        console.log('đã click');
        this.diaphragm.alpha = 0
        gsap.timeline()
            .to(this.settingContainer, { y: - this.settingContainer.height * 2, duration: 0.5, ease: "back.in(2)" })

        this.main.buttonContainer.interactiveChildren = true;
        this.containerMain.interactiveChildren = true;

    }
    pixiRemoveAllChildren(container) {
        while (container.children[0]) {
            container.removeChild(container.children[0]);
        }
        // this.app.stage.removeChild(container)
    }
    removeAllChildMainContainer() {
        while (this.containerMain.children[0]) {
            this.containerMain.removeChild(this.containerMain.children[0]);
        }
    }

    addHand() {
        var hand_tut = PIXI.Sprite.from(this.loader.resources.buttons.textures["hand_tut.png"]);
        hand_tut.name = 'hand_tut'
        const scale_hand_tut = (this.app.screen.width / 8.5) / hand_tut.width
        hand_tut.scale.set(scale_hand_tut, scale_hand_tut);
        hand_tut.position.set(this.bottleBase.startX[0] + this.bottleBase.width / 10, this.bottleBase.startY[0] + this.bottleBase.height * 1.1);

        this.app.stage.addChild(hand_tut)
        var y = hand_tut.y
        this.tutorialL1 = gsap.to(hand_tut, { y: y + this.bottleBase.height * 0.25, duration: 0.35, ease: "none", repeat: -1, yoyo: true })


        var div_text = document.getElementById('text_level')
        div_text.style.width = this.app.screen.width * 2 / 3 + 'px';
        div_text.style.top = this.app.screen.height * 0.75 + 'px';

        var text = document.createElement("p");
        text.setAttribute("id", "text_p");
        const node = document.createTextNode("Click left tube to pick up");
        text.appendChild(node);
        div_text.appendChild(text);

        var fontSize = (this.app.screen.width * 2 / 3) / 13 + 'px';
        text.style.fontSize = fontSize;
        text.style.color = "#BAA1AB";
    }

    eventLevel_1(param) {
        var hand_tut = this.app.stage.getChildByName("hand_tut");
        var y = hand_tut.y
        const indexChoose = param
        console.log(indexChoose);
        var bottle_0 = this.containerMain.getChildByName("bottle_0");
        var bottle_1 = this.containerMain.getChildByName("bottle_1");
        if (indexChoose == 0 && bottle_0.interactive == true) {
            bottle_0.interactive = false;
            var choose = this.getBallChoose(indexChoose);
            this.listBottleA.push(choose);
            this.upBallChoose();
            this.tutorialL1.kill();
            this.tutorialL1 = null;
            this.tutorialL1 = gsap.timeline()
                .to(hand_tut, { x: this.bottleBase.startX[1] + this.bottleBase.width / 10, duration: 0.25, ease: "none", id: "move" })
                .to(hand_tut, { y: y + this.bottleBase.height * 0.25, duration: 0.35, ease: "none", repeat: -1, yoyo: true, id: "turn2" })
        } else if (indexChoose == 1 && bottle_0.interactive == false) {
            var newColor = this.getBallEmpty(indexChoose);
            this.listBottleB.push(newColor);
            this.moveBallChoose();

            this.tutorialL1.kill();
            this.tutorialL1 = null;
            this.app.stage.removeChild(hand_tut)
            var text = document.getElementById("text_p")
            text.remove()

        }
    }
    checkLevel2() {
        for (let i = 0; i < 3; i++) {
            const incorrect = new PIXI.Sprite(this.loader.resources.setting.textures["cross_x.png"]);
            incorrect.name = 'incorrect_' + i
            const scale_incorrect = (this.app.screen.width / 15) / incorrect.width
            incorrect.scale.set(scale_incorrect, scale_incorrect);
            incorrect.position.set(this.bottleBase.startX[i] + (this.bottleBase.width - incorrect.width) / 2, this.bottleBase.startY[0] - this.bottleBase.height * 0.25);
            incorrect.alpha = 0
            this.listcheckl2.push(incorrect)
            const correct = new PIXI.Sprite(this.loader.resources.setting.textures["tick.png"]);
            correct.name = 'correct_' + i
            const scale_correct = (this.app.screen.width / 12) / correct.width
            correct.scale.set(scale_correct, scale_correct);
            correct.position.set(this.bottleBase.startX[i] + (this.bottleBase.width - correct.width) / 2, incorrect.y + incorrect.height - correct.height);
            correct.alpha = 0
            this.listcheckl2.push(correct)
            this.app.stage.addChild(incorrect, correct)
        }
        var div_text = document.getElementById('text_level')
        div_text.style.width = this.app.screen.width * 2 / 3 + 'px';
        div_text.style.top = this.app.screen.height * 0.65 + 'px';

        var text = document.createElement("p");
        text.setAttribute("id", "text_p");
        const node = document.createTextNode("Only put the ball on the other same color ball");
        text.appendChild(node);
        div_text.appendChild(text);

        var fontSize = (this.app.screen.width * 2 / 3) / 15 + 'px';
        text.style.fontSize = fontSize;
        text.style.color = "#BAA1AB";

    }

    eventLevel_2(param) {
        const indexChoose = param
        if (indexChoose == 0) {
            if (this.listBottle[0].listBall.length == 2) {
                this.listcheckl2[2].alpha = 1
                this.listcheckl2[5].alpha = 1
            } else {
                this.listcheckl2[3].alpha = 1
                this.listcheckl2[4].alpha = 1
            }
        } else if (indexChoose == 1) {
            this.listcheckl2[1].alpha = 1
            this.listcheckl2[4].alpha = 1
        } else if (indexChoose == 2) {
            if (this.listBottle[0].listBall.length == 2) {
                this.listcheckl2[1].alpha = 1
                this.listcheckl2[2].alpha = 1
            } else {
                this.listcheckl2[0].alpha = 1
                this.listcheckl2[2].alpha = 1
            }

        }
        if (indexChoose != null) {
            if (this.listBottleA.length == this.listBottleB.length) {
                if (this.map[indexChoose].lastIndexOf(0) != 3) {
                    if (this.listBottle[indexChoose].status == true) {
                        var choose = this.getBallChoose(indexChoose);
                        this.listBottleA.push(choose);
                        this.upBallChoose();
                    };
                };
            } else {
                var oldChoose = this.listBottleA[this.listBottleA.length - 1].index
                var newColor = this.getBallEmpty(indexChoose);
                if (indexChoose != oldChoose && newColor.num > 0) {
                    if (this.listBottle[indexChoose].status == true) {
                        var oldColor = this.listBottleA[this.listBottleA.length - 1]
                        if (newColor.color == oldColor.color || newColor.num == 4) {
                            this.listBottleB.push(newColor);
                            this.moveBallChoose();
                            notClick(this)
                        } else {
                            this.downBallChoose();
                            notClick(this)
                        }
                    }
                } else {
                    this.downBallChoose();
                    notClick(this)
                }
            }
        }
        function notClick(_this) {
            _this.listcheckl2[0].alpha = 0
            _this.listcheckl2[1].alpha = 0
            _this.listcheckl2[2].alpha = 0
            _this.listcheckl2[3].alpha = 0
            _this.listcheckl2[4].alpha = 0
            _this.listcheckl2[5].alpha = 0
        }
    }
    checkExist(parent, name_children) {
        const child = parent.getChildByName(name_children)
        if (child) parent.removeChild(child)
    }







}

function checkCompleteItem(arr) {
    const color0 = arr[0];
    let isWin = arr.every(function (item) {
        return item == color0;
    });
    return isWin;
}
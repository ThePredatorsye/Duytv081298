
import 'pixi.js'
import { sound } from '@pixi/sound';
import Game from './game'
// PIXI.utils.skipHello();
var loaderNextData = new PIXI.Loader();
var loaderBackData = new PIXI.Loader();

// var process = 0, temPro = 0;
class Main {
  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      autoResize: true,
      backgroundColor: 0x1099bb,
      view: document.querySelector('#myCanvas'),
      resolution: window.devicePixelRatio,
      scale_mode: PIXI.SCALE_MODES.NEAREST,
      antialiasing: true,
      autoDensity: true,
    });
    this.loader = new PIXI.Loader();
    this.back = 5;
    this.player = { level: 1 };
    this.dataLevelNextLoad = false;
    this.sound = true;
    this.vibration = true;
  }

  // connectWithFacebook() {
  //   FBInstant.initializeAsync()
  //     .then(() => {
  //       FBInstant.player
  //         .getDataAsync(['level'])
  //         .then((stats) => {
  //           if (JSON.stringify(stats) === '{}') this.player = { level: 1 }
  //           else if (stats) {
  //             this.player = stats
  //           }
  //           else console.log(stats);
  //           this.init()
  //         })
  //     }
  //     );
  // }
  init() {
    var txtLevel = 'Lv_' + this.player.level + '.json'
    this.loader
      .reset()
      .add('bg', 'assets/images/background/bg.png')
      .add('ground', 'assets/images/background/ground.png')
      .add('separator_line', 'assets/images/background/separator_line.png')

      .add('btn_ads', 'assets/images/button/btn_ads.png')
      .add('btn_back', 'assets/images/button/btn_back.png')
      .add('btn_idea', 'assets/images/button/btn_idea.png')
      .add('btn_next', 'assets/images/button/btn_next.png')
      .add('btn_retry', 'assets/images/button/btn_retry.png')
      .add('btn_setting', 'assets/images/button/btn_setting.png')
      .add('hand_tut', 'assets/images/button/hand_tut.png')

      //bottle
      .add('bottle', 'assets/images/bottles/bottle.png')

      .add('ball_1', 'assets/images/balls/ball_1.png')
      .add('ball_2', 'assets/images/balls/ball_2.png')
      .add('ball_3', 'assets/images/balls/ball_3.png')
      .add('ball_4', 'assets/images/balls/ball_4.png')
      .add('ball_5', 'assets/images/balls/ball_5.png')
      .add('ball_6', 'assets/images/balls/ball_6.png')
      .add('ball_7', 'assets/images/balls/ball_7.png')
      .add('ball_8', 'assets/images/balls/ball_8.png')
      .add('ball_9', 'assets/images/balls/ball_9.png')
      .add('ball_10', 'assets/images/balls/ball_10.png')
      .add('ball_11', 'assets/images/balls/ball_11.png')
      .add('ball_12', 'assets/images/balls/ball_12.png')

      .add('winscr', 'assets/spine/Winscr.json')
      .add('Highscore', 'assets/spine/Highscore.json')
      .add('confetti', 'assets/spine/confetti.json')

      //spritesheet

      .add('number', 'assets/images/number/number.json')
      .add('setting', 'assets/images/setting/setting.json')
      //sound
      .add('ball_fall_1', 'assets/audio/ball_fall_1.mp3')
      .add('ball_fall_2', 'assets/audio/ball_fall_2.mp3')
      .add('ball_fall_3', 'assets/audio/ball_fall_3.mp3')
      .add('ball_fall_4', 'assets/audio/ball_fall_4.mp3')
      .add('firework', 'assets/audio/firework.mp3')
      .add('bottleComplete', 'assets/audio/bottleComplete.wav')
      .add('Button_Click', 'assets/audio/Button_Click.wav')
      .add('win', 'assets/audio/win.wav')

      //font
      
      .add('GROBOLD', 'assets/fonts/GROBOLD.ttf')

      //map
      .add('map', 'assets/levels/' + txtLevel)

      .load(() => { this.onAssetsLoaded() });
    // .load();
    // this.loader.onProgress.add(() => {
    //   process = this.loader.progress.toFixed()
    // });


    this.app.stage.interactive = true;
    this.app.stage.buttonMode = true;

    window.addEventListener('resize', () => { this.resize() });

    // var updateProgress = setInterval(
    //   () => {
    //     if (process == 100) {
    //       var plus = 0
    //       if (process - temPro >= 10) plus = Math.floor(Math.random() * 6);
    //       else plus = Math.floor(Math.random() * (process - temPro)) + 1;
    //       temPro += plus
    //       FBInstant.setLoadingProgress(temPro);

    //       if (temPro == 100) {
    //         clearInterval(updateProgress);

    //         this.startGame()
    //       }
    //     } else {
    //       if (temPro + 1 <= process) {
    //         temPro++
    //         FBInstant.setLoadingProgress(temPro);
    //       }
    //     }
    //   }, 100);


  }

  // startGame() {
  //   FBInstant.startGameAsync()
  //     .then(() => {
  //       this.player.map = this.loader.resources.map.data.ids
  //       this.resize()
  //       this.app.start();
  //       this.app.ticker.add(() => {
  //       });
  //       this.getNextLevelData()
  //     })
  // }

  onAssetsLoaded() {
    this.player.map = this.loader.resources.map.data.ids
    this.resize()
    this.app.start();
    this.app.ticker.add(() => {
    });
    this.getNextLevelData()
  }

  setBackGround() {
    const bg = PIXI.Sprite.from(this.loader.resources.bg.texture);
    const scaleBg = (this.app.screen.height * 9.1 / 10) / bg.height
    bg.scale.set(scaleBg, scaleBg);
    bg.position.set((this.app.screen.width - bg.width) * 0.5, 0);


    const ground = PIXI.Sprite.from(this.loader.resources.ground.texture);
    const scaleGround = (this.app.screen.width * 1.1) / ground.width
    ground.scale.set(scaleGround, scaleGround);
    ground.position.set((this.app.screen.width - ground.width) * 0.5, bg.y + bg.height);
    this.app.stage.addChild(bg, ground)

  }
  setButton() {

    console.log(this.player.level);
    this.buttonContainer = new PIXI.Container();
    this.buttonContainer.name = 'button container'
    this.app.stage.addChild(this.buttonContainer);

    const btn_setting = PIXI.Sprite.from(this.loader.resources.btn_setting.texture);
    btn_setting.name = 'btn_setting'
    const scale_btn_setting = (this.app.screen.width / 8) / btn_setting.getBounds().width
    btn_setting.scale.set(scale_btn_setting, scale_btn_setting);
    btn_setting.position.set(this.app.screen.width / 8, btn_setting.height / 2.5);

    const btn_ads = PIXI.Sprite.from(this.loader.resources.btn_ads.texture);
    btn_ads.name = 'btn_ads'
    btn_ads.scale.set(scale_btn_setting, scale_btn_setting);
    btn_ads.position.set(this.app.screen.width - this.app.screen.width / 8 - btn_ads.width, btn_ads.height / 2.5);
    if (this.player.level == 2) {
      btn_ads.interactive = false;
      btn_ads.alpha = 0.5
    } else btn_ads.interactive = true;

    const separator_line = PIXI.Sprite.from(this.loader.resources.separator_line.texture);
    const scale_separator_line = this.app.screen.width / separator_line.width
    separator_line.scale.set(scale_separator_line, scale_separator_line);
    separator_line.position.set(0, btn_setting.height * 1.5);


    const btn_retry = PIXI.Sprite.from(this.loader.resources.btn_retry.texture);
    btn_retry.name = 'btn_retry'
    btn_retry.scale.set(scale_btn_setting, scale_btn_setting);
    btn_retry.position.set(this.app.screen.width / 8, (this.app.screen.height * 9 / 10) - btn_retry.height * 1.5);

    const btn_back = PIXI.Sprite.from(this.loader.resources.btn_back.texture);
    btn_back.name = 'btn_back'
    btn_back.scale.set(scale_btn_setting, scale_btn_setting);
    btn_back.position.set(this.app.screen.width - this.app.screen.width / 8 - btn_back.width, btn_retry.y);

    const btn_idea = PIXI.Sprite.from(this.loader.resources.btn_idea.texture);
    btn_idea.name = 'btn_idea'
    btn_idea.scale.set(scale_btn_setting, scale_btn_setting);
    btn_idea.position.set((this.app.screen.width - btn_idea.width) / 2, btn_retry.y);


    const btn_next = PIXI.Sprite.from(this.loader.resources.btn_next.texture);
    btn_next.name = 'btn_next'
    const scale_btn_next = (this.app.screen.width / 6) / btn_next.width
    btn_next.scale.set(scale_btn_next, scale_btn_next);
    btn_next.position.set(this.app.screen.width / 2 + btn_next.getBounds().width, this.app.screen.height - btn_next.getBounds().height * 1.5);

    const btn_Back_temp = PIXI.Sprite.from(this.loader.resources.btn_next.texture);
    btn_Back_temp.name = 'btn_Back_temp'
    btn_Back_temp.scale.set(scale_btn_next, scale_btn_next);
    btn_Back_temp.scale.x *= -1;
    btn_Back_temp.position.set(this.app.screen.width / 2 - btn_Back_temp.width, this.app.screen.height - btn_next.getBounds().height * 1.5);

    if (this.player.level == 1) this.buttonContainer.addChild(btn_setting, btn_ads, separator_line, btn_next, btn_Back_temp);
    else {
      this.buttonContainer.addChild(btn_setting, btn_ads, separator_line, btn_retry, btn_back, btn_idea, btn_next, btn_Back_temp);
      this.drawTextBack()
    }


    btn_setting.interactive = true;
    btn_retry.interactive = true;
    btn_back.interactive = true;
    btn_idea.interactive = true;
    btn_next.interactive = true;
    btn_Back_temp.interactive = true;


    btn_setting.on('pointerdown', () => {
      this.playSoundClickButton()
      console.log('click btn_setting');
      this.game.openSetting()
      this.game.containerMain.interactiveChildren = false;
      this.buttonContainer.interactiveChildren = false
    });
    btn_ads.on('pointerdown', () => {
      this.playSoundClickButton()
      this.game.addBottle()
    });
    btn_retry.on('pointerdown', () => {
      this.playSoundClickButton()
      this.back = 5
      this.drawTextBack()
      this.game.restartLevel()
    });
    btn_idea.on('pointerdown', () => {
      this.playSoundClickButton()
      console.log('click btn_idea');
    });
    btn_back.on('pointerdown', () => {
      this.playSoundClickButton()
      if (this.game.listBottleB.length != 0 && this.back > 0) {
        this.game.previousStep()
        this.back--
        this.drawTextBack()
      }

    });
    btn_next.on('pointerdown', () => {
      this.playSoundClickButton()
      this.back = 5
      this.drawTextBack()
      this.nextLevel()
    });
    btn_Back_temp.on('pointerdown', () => {
      this.playSoundClickButton()
      this.back = 5
      this.drawTextBack()
      this.backLevel()
    });
  }
  drawTextBack() {
    var temp = this.app.stage.getChildByName('textBack')
    if (temp) this.app.stage.removeChild(temp);
    var btn_back = this.buttonContainer.getChildByName('btn_back')

    var num = 'number_' + this.back + '.png'
    var text_back = new PIXI.Sprite(this.loader.resources.number.textures[num]);
    text_back.name = 'textBack'

    var scale_text_back = (btn_back.width / 8) / text_back.width;

    text_back.scale.set(scale_text_back, scale_text_back);
    text_back.position.set(
      btn_back.x + (btn_back.width - text_back.width) / 1.8,
      btn_back.y + btn_back.height - text_back.height * 1.5)

    this.app.stage.addChild(text_back)
  }

  nextLevel() {
    while (!this.dataLevelNextLoad) {
      if (this.dataLevelNextLoad == null) {
        console.log('load again');
        this.getNextLevelData()
      } else console.log('no data level next');

    }
    if (this.dataLevelNextLoad) {
      this.player.level += 1
      this.game.nextLevel()
      this.player.map = loaderNextData.resources.map.data.ids

      if (this.player.level == 2) {
        while (this.buttonContainer.children[0]) {
          this.buttonContainer.removeChild(this.buttonContainer.children[0]);
        }
        this.app.stage.removeChild(this.buttonContainer)
        this.setButton()
      } else if (this.player.level == 3) {
        const btn_ads = this.buttonContainer.getChildByName("btn_ads")
        btn_ads.alpha = 1;
        btn_ads.interactive = true;
      }

      this.game.init()
      this.getNextLevelData()
      // this.sendDataFacebook()
    }
  }

  backLevel() {
    loaderBackData.resources = {}
    let backLevel = this.player.level - 1
    this.getBackData(backLevel)


    loaderBackData.onError.add(() => { this.getBackData(backLevel) });
  }

  getBackData(backLevel) {
    loaderBackData
      .reset()
      .add('map', "assets/levels/Lv_" + backLevel + ".json")
      .load(() => {
        this.player.level -= 1
        this.game.nextLevel()
        this.player.map = loaderBackData.resources.map.data.ids
        this.game.init()
        this.getNextLevelData()
        // this.sendDataFacebook()
      });
  }

  getNextLevelData() {
    loaderNextData.resources = {}
    this.dataLevelNextLoad = false;
    let nextLevel = this.player.level + 1
    loaderNextData
      .reset()
      .add('map', "assets/levels/Lv_" + nextLevel + ".json")
      .load(() => {
        this.dataLevelNextLoad = true;
      });
    loaderNextData.onError.add(() => { this.dataLevelNextLoad = null });
  }
  resize() {

    this.app.renderer.resize(window.innerWidth, window.innerHeight);


    this.setBackGround()
    this.setButton()

    this.game = new Game(this)
    this.game.init()
  }

  sendDataFacebook() {
    var player = { level: this.player.level }
    FBInstant.player
      .setDataAsync(player)
      .then(function () {
        console.log('data is set: ', player);
      });
  }
  playSoundClickButton() {
    var sound_game = this.loader.resources.Button_Click.sound
    sound_game.play()
  }
}

const main = new Main()
// main.connectWithFacebook()

main.init()


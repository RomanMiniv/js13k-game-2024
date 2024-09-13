import { setTimer } from "../../utils";
import { Scene } from "../scene";

export class Lore extends Scene {
  gameObjects = [];
  gameObjectIndexesForSave = [];

  positiveEmojis = ["(* ^ ω ^)", "(*￣▽￣)b", "ヽ(・∀・)ﾉ", "╰(▔∀▔)╯", "(─‿‿─)", "<(￣︶￣)>", "☆*:.｡.o(≧▽≦)o.｡.:*☆", "٩(◕‿◕｡)۶", "(￣ω￣)", "( • ⩊ • )", "(≧◡≦)", "\\(★ω★)/", "°˖✧◝(⁰▿⁰)◜✧˖°", "٩(｡•́‿•̀｡)۶", "⸜( *ˊᵕˋ* )⸝", "(￣▽￣*)ゞ", "(ง ื▿ ื)ว"];
  negativeEmojis = ["┌∩┐(◣_◢)┌∩┐", "Σ(▼□▼メ", "٩(╬ʘ益ʘ╬)۶", "(ﾉಥ益ಥ)ﾉ", "(｡•́︿•̀｡)", "(っ˘̩╭╮˘̩)っ", "(︶︹︺)", "←~(Ψ▼ｰ▼)∈", "ヾ(`ヘ´)ﾉﾞ", "(・`ω´・)", "(҂ `з´ )", "↑_(ΦwΦ)Ψ", "୧((#Φ益Φ#))୨", "ψ( ` ∇ ´ )ψ", "(ಥ﹏ಥ)", "＼(º □ º l|l)/", "(っ•﹏•)っ ✴==≡눈٩(`皿´҂)ง"];

  init(): void {
    super.init();
    this.steps[this.currentStep]();
  }

  setEvents(): void {
    this.keydownHandler = this.keydownHandler.bind(this);
    document.addEventListener("keydown", this.keydownHandler);
  }

  deleteEvents(): void {
    document.removeEventListener("keydown", this.keydownHandler);
  }

  isAllowSkipAll: boolean;
  keydownHandler(e: KeyboardEvent): void {
    if (e.code === "Escape" && this.isAllowSkipAll) {
      this.finish();
    }
    if (e.code === "Enter" || e.code === "Space") {
      if (!this.isSkip) {
        return;
      }
      this.isSkip = false;

      if (this.isLastStep()) {
        this.finish();
        return;
      }

      const gameObjects = [];
      this.gameObjectIndexesForSave.forEach(gameObjectIndex => {
        gameObjects.push(this.gameObjects[gameObjectIndex]);
      })
      this.gameObjects = [...gameObjects];

      this.gameObjectIndexesForSave = [];
      for (let i = 0; i < gameObjects.length; i++) {
        this.gameObjectIndexesForSave.push(i);
      }

      this.currentStep++;
      this.steps[this.currentStep]();
    }
  }

  finish(): void {
    this.deleteEvents();
    this.finishCallback();
  }

  isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  setMask(): void {
    this.ctx.clip(new Path2D(`M0,50 h${this.canvas.width} v${this.canvas.height - 100} h-${this.canvas.width} z`));
  }

  currentStep: number = 0;

  async waitSkip(time: number) {
    await setTimer(time);
    this.isSkip = true;
  }

  getCenterPos() {
    return {
      cX: this.canvas.width / 2,
      cY: this.canvas.height / 2.5,
    }
  }

  steps = [];

  setStoryText(text: string): void {
    this.ctx.font = "bold 24px Courier New";
    this.ctx.fillStyle = "#36454F";
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height - this.canvas.height / 4);

    this.setSkipText();
  }

  isSkip: boolean = false;
  setSkipText(): void {
    if (this.isSkip) {
      this.ctx.font = "bold 24px Courier New";
      this.ctx.fillStyle = "#e6b800";
      this.ctx.fillText("[Press Space or Enter to skip]", this.canvas.width / 2, this.canvas.height - this.canvas.height / 4 + 48);
    }
    this.setSkipAllText();
  }

  setSkipAllText(): void {
    this.isAllowSkipAll = true;
    this.ctx.font = "bold 24px Courier New";
    this.ctx.fillStyle = "#008080";
    this.ctx.fillText("[Press ESC to skip all]", this.canvas.width / 2, this.canvas.height - this.canvas.height / 4 + 96);
  }

  update(tFrame: number): void {
    super.update(tFrame);

    this.gameObjects.forEach(gameObject => gameObject());
  }
}

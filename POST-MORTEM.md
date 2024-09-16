# js13k-game-2024

## How it started

## Post mortem

The game's theme is triskaidekaphobia.

Well, my first steps started with googling the meaning of the topic :). After reading several articles and the history of the origin of this term, I began to think about what could be done.

This is my 2nd time participating in this [tournament](https://js13kgames.com/). Therefore, this time I did not start from a clean sheet, but with a small starter, which included the process of build and development using **webpack**, as well as **typescript**, on which the game was actually developed.

I knew I didn't want to be limited to one scene, so I needed some Scene Manager. Before that, I got to know Phaser a bit, so I was inspired by him.

So I had a main Game class that was a scene manager where I stored scenes in an array. It also included a **requestAnimationFrame** render loop and minimal resize handling. Each scene takes a callback as a parameter when created, which it should call when it's done. In this callback, you can pass the index of the scene to which you should go, or pass nothing, and then the next scene is the next scene in the scene array after the current one.

The Scene base class included a reference to the canvas and its context, as well as the callback mentioned earlier. Methods for working with events: setEvents(), deleteEvents(). Methods for rendering: staticUpdate() - which contains the static part of the scene, that is, the one that does not need dynamic changes, it is called only when resizing and update() - which is called for each frame of the rendering cycle, so the final rendering cycle looks like this:
```
render(tFrame: number): void {
 requestAnimationFrame(this.render.bind(this));

 this.scenes.forEach(scene => scene.update(tFrame));
}
```

Also, the Scene class contains methods init() - for additional specific initialization, setBG() - for the background and setMask() - for the mask (later I used the mask feature as an effect to mark the story scenes, which contains black bars above and below, so I'm trying to make the player understand that there is a story line going on now, and not a direct game).

From the previous time, I realized that how I see my game and what comes out can be different, there is a lot of context in my head, but the output is just a game, without any context. So this time I wanted to share my vision directly with the players. That's why I introduced the plot directly into my game. In this way, I tried to give the player a certain context, to tell a small story around which the development of events through the game takes place.

That's how I got plot and game scenes, which I visually separate with the help of a mask (black stripes above and below), creating a kind of storytelling effect.

I also like to have fun, that's why I tried to add a little laugh to such a seemingly not funny and even scary topic :).

Regarding the idea of the game itself, I understood that the key aspect of the theme is the number. Therefore, through numbers, I tried to reveal this topic, from the very beginning of the world to the current state of affairs.

With the story scenes, I wanted the players to still get familiar with them, but not watch them every time, so after the first watch, I give the option to skip the current scene entirely. To do this, I save the progress of the game in **localstorage**. I also automatically save game progress in game scenes, so the player can not go from the very beginning after losing, but from the last autosave.

The storyboard base scene class consists of an array of steps, where each step is an async function. Each step is a plot step, after showing which, the player can move to the next step.

If I want to show something only during the current step, I add it as static, if I want to add something in the current step that should persist in subsequent steps (i.e. be part of further steps), I add to the gameObjects array, which is dynamically rendered. gameObjects is an array of functions that are called for each frame, consisting of bricks from which the story scene is built.

If I want to delete an object that has been saved until now, I delete it from gameObjects at the end of the current step, then it will no longer be there in the next step.

Since each step is an async function, in it I can work with Promises to add objects to the stage at a certain time, thereby doing a certain animation.

The game does not contain any graphics assets such as pictures, sprites, etc. Instead, all the necessary objects are drawn on the canvas. I've had some experience with hand-drawn SVG graphics, so the Path2D canvas worked well for me, allowing me to draw the way SVG is drawn. Also, its syntax is shorter in contrast to the classical one due to the construction of the path, which makes it possible to save a little size. In addition, using Path2D, you can further go from it to classic path construction functions, such as arc() or lineTo(), etc thereby combining it.

Unfortunately, I did not have time to add music.

There were also many ideas that I wanted to implement, but time makes its adjustments :). However, I am glad that I was able to implement the main idea of ​​the game.

In summary, the output contains 2 files - index.html and bundle.js, without any third-party assets and more than 3KB in reserve, which, in my opinion, is quite a good result!

I hope you had fun playing my game!

Thanks for reading, all the best!

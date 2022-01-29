## Auto Video Player Automation 🤖

##### Disclaimer: this project is meant for educational porposes only

### A little background and the goal

In a certain course platform, to go through the video lessons you have to choose, click and play the videos one after the other: a very sensible default, actually. Auto-playing can be quite annoying, specially if you're doing a course. In that case, you're probably even pausing the video from time to time to take notes or test, practice, explore, etc.

But imagine you were requested to take a course on a topic you already master. It is good to review, but you won't be doing it as slowly as you would if that content was new to you. In that case, auto-playing could be quite handy.

Sadly, said platform didn't offer the auto-play feature.

Hence this project!

This automation uses pupuppeteer to auto-play the course videos sequentially a thoroughly (what a hard word to spell).

### Very interesting, now show me!

It is almost pointless to make a project public without showcasing its use. In this case, though, I won't be able do it because I might be beaking terms of use of the platform.

The project had some interesting patterns, like a proxy and a recursive function, so I didn't resist putting it out, even if for the sake of future reference. See for yourself:

#### Recursive function

```typescript
async function playVideo() {
  await playTheVideoAndWaitForItToFinish();
  if (await isThereUnwatchedVideoOnCurrentLesson()) {
    await goToNextUnwatchedVideo();
    await playVideo();
  }
}
```

It calls itself until there are no more unwatched videos left.

#### Proxy pattern

```typescript
const proxyPage = new Proxy(page, {
  get: function (target, property, reciever) {
    if (property === "$") {
      return async function (selector: string) {
        const elementHandle = await target.$(selector);
        if (!elementHandle) throw new SelectorNotFoundError(selector);
        return elementHandle;
      };
    }

    return Reflect.get(target, property, reciever);
  },
});
```

We intercept the `$` function (runs `document.querySelector` on the current page) and make sure to throw if you don't find the selector passed as argument. The rest of the methods and props are delegated to the target.

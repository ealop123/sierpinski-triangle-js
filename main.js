window.addEventListener("load", function main () {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const $ = (str, dom = document) => [...dom.querySelectorAll(str)];

  async function showMessage(msg, time = 5000) {
    const box = $(".message-prompt")[0];
    const txt = $(".message-prompt__text", box)[0];
    const transitionTime = (time / 1000 / 2).toFixed(2) + "s";
    box.style.setProperty("--transition-time", transitionTime);
    txt.innerText = msg;
    box.classList.remove("hidden");
    await wait(time / 2);
    await wait(time);
    box.classList.add("hidden");
    await wait(time / 2);
  }

  (async function welcomeMessage() {
    await wait(1000);
    await showMessage("Welcome!", 1000);
    await showMessage(`
Please enjoy this web art demonstrating the Sierpinski triangle!
      `.trim(), 2000);
  })();

  (async function equipCanvas() {
    const canvas = $("canvas")[0];
    function resizeCanvas() {
      const cStyles = window.getComputedStyle(canvas, null);
      const width = cStyles.getPropertyValue("width");
      const height = cStyles.getPropertyValue("height");
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
    }
    resizeCanvas();
    // window.addEventListener("resize", resizeCanvas); //clears canvas?
    const ctx = canvas.getContext("2d");
    const dots = [];
    async function addDot(e) {
      const {x, y} = e;
      dots.push([x, y]);
      const dotSize = 1;
      ctx.fillRect(x, y, dotSize, dotSize);
      if (dots.length != 3) return;
      canvas.removeEventListener("click", addDot);
      const allDots = [...dots];
      let cntr = 0;
      while (++cntr < 1e6) {
        if (cntr % 500 == 0) showMessage(`${allDots.length} dots shown! ${cntr} attempted!`, 1000);
        const {floor, random, max, min} = Math;
        const randomDot = allDots[floor(random() * allDots.length)];
        const originalDot = dots[floor(random() * dots.length)];
        const [rx, ry] = randomDot;
        const [ox, oy] = originalDot;
        const nx = (max(ox, rx) - min(ox, rx)) / 2 + min(ox, rx);
        const ny = (max(oy, ry) - min(oy, ry)) / 2 + min(oy, ry);
        const conflict = allDots.some(dot => {
          const [dx, dy] = dot;
          const xIntercept = nx < dx + dotSize && nx > dx - dotSize;
          const yIntercept = ny < dy + dotSize && ny > dy - dotSize;
          return xIntercept && yIntercept;
        });
        if (conflict) {
          await wait(1);
          continue;
        }
        await wait(50);
        allDots.push([nx, ny]);
        ctx.fillRect(nx, ny, dotSize, dotSize)
      }
      await showMessage("1 million attempts exceeded! Stopping 😁");
    }
    canvas.addEventListener("click", addDot);
  })();

});

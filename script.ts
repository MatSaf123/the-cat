enum StateFlagEnum {
  CatEnabled,
  CursorCoordX,
  CursorCoordY,
}

const STATE = {
  [StateFlagEnum.CatEnabled]: false, // Cat sleeps by default - a very cat thing to do
  [StateFlagEnum.CursorCoordX]: 0,
  [StateFlagEnum.CursorCoordY]: 0,
} satisfies Record<StateFlagEnum, unknown>;

/** Handle 'toggle' button click */
function handleToggleButton(): void {
  // Toggle cat's behavior
  const oldCatState = STATE[StateFlagEnum.CatEnabled];
  STATE[StateFlagEnum.CatEnabled] = !oldCatState;

  // Update elements and animation
  const catStateText = document.getElementById("cat-state-text");
  const cat = document.getElementById("cat");
  if (STATE[StateFlagEnum.CatEnabled]) {
    catStateText.innerHTML = "Cat is running!";

    // Set animation to running
    cat.style.background = "url('sprites/cat_run.png')";
    cat.style.animationName = "cat-run";
    cat.style.animationDuration = "1.5s";
    cat.style.animationTimingFunction = "steps(8)";
    cat.style.animationIterationCount = "infinite";
  } else {
    catStateText.innerHTML = "Cat is sleeping...";

    // Set animation to sleeping
    cat.style.background = "url('sprites/cat_sleep.png')";
    cat.style.animationName = "cat-sleep";
    cat.style.animationDuration = "3s";
    cat.style.animationTimingFunction = "steps(4)";
    cat.style.animationIterationCount = "infinite";
  }
}

/** Put new cursor coords into the state so cat could pick them up */
addEventListener("pointermove", (event) => {
  const cursorCoords = { x: event.clientX, y: event.clientY };
  STATE[StateFlagEnum.CursorCoordX] = cursorCoords.x;
  STATE[StateFlagEnum.CursorCoordY] = cursorCoords.y;
});

/** If cat is not sleeping, make it run towards the cursor*/
function makeCatAction(): void {
  const cat = document.getElementById("cat");
  if (STATE[StateFlagEnum.CatEnabled]) {
    // Bring cat closer to the cursor

    const cursorCoords = {
      x: STATE[StateFlagEnum.CursorCoordX],
      y: STATE[StateFlagEnum.CursorCoordY],
    };

    // Turn them from `<number>px` strings into numbers
    const catCurrentCoords = {
      x: Number(cat.style.left.split("px")[0]),
      y: Number(cat.style.top.split("px")[0]),
    };

    const vector = {
      x: cursorCoords.x - catCurrentCoords.x,
      y: cursorCoords.y - catCurrentCoords.y,
    };
    const vectorLength = Math.sqrt(vector.x ** 2 + vector.y ** 2);

    const CAT_SPEED = 2.0;

    const catNewCoords = {
      x: catCurrentCoords.x + (vector.x / vectorLength) * CAT_SPEED,
      y: catCurrentCoords.y + (vector.y / vectorLength) * CAT_SPEED,
    };

    cat.style.top = `${catNewCoords.y}px`;
    cat.style.left = `${catNewCoords.x}px`;

    // Depending on the position of the cat and the cursor, we might want to flip the sprite -
    // if cat is running left, we flip it
    if (vector.x < 0) {
      if (cat.style.transform !== "scaleX(-1)") {
        cat.style.transform = "scaleX(-1)";
      }
    } else {
      if (cat.style.transform !== "scaleX(1)") {
        cat.style.transform = "scaleX(1)";
      }
    }
  } else {
    // Cat sleeps, no action. Zzz
  }
}

/** Cat makes action every 24ms */
window.setInterval(makeCatAction, 24);

window.onload = () => {
  // We need to take cat's coords from `#cat` style definition and put them into `element.style`,
  // otherwise after waking up cat will teleport to the 0,0 coords
  const cat = document.getElementById("cat");
  cat.style.top = window.getComputedStyle(cat).top;
  cat.style.left = window.getComputedStyle(cat).left;
};

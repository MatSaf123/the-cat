enum StateFlagEnum {
  CatState,
  CursorCoordX,
  CursorCoordY,
}

enum CatStateEnum {
  Sleeping,
  Running,
  Idle,
}

const STATE = {
  [StateFlagEnum.CatState]: CatStateEnum.Sleeping, // Cat sleeps by default - a very cat thing to do
  [StateFlagEnum.CursorCoordX]: 0,
  [StateFlagEnum.CursorCoordY]: 0,
} satisfies Record<StateFlagEnum, unknown>;

/**
 * Changes and renders cats animation and the displayed info text
 */
function renderCatState(state: CatStateEnum) {
  const catStateText = document.getElementById("cat-state-text");
  const cat = document.getElementById("cat");

  switch (state) {
    case CatStateEnum.Sleeping: {
      catStateText.innerHTML = "Cat is sleeping...";

      // Set animation to sleeping
      cat.style.background = "url('sprites/cat_sleep.png')";
      cat.style.animationName = "cat-sleep";
      cat.style.animationDuration = "3s";
      cat.style.animationTimingFunction = "steps(4)";
      cat.style.animationIterationCount = "infinite";
      return;
    }
    case CatStateEnum.Running: {
      catStateText.innerHTML = "Cat is running!";

      // Set animation to running
      cat.style.background = "url('sprites/cat_run.png')";
      cat.style.animationName = "cat-run";
      cat.style.animationDuration = "1.5s";
      cat.style.animationTimingFunction = "steps(8)";
      cat.style.animationIterationCount = "infinite";
      return;
    }
    case CatStateEnum.Idle: {
      catStateText.innerHTML = "Cat is waiting. Move your cursor!";

      // Pick one of the idle animations
      const items = ["cat_idle_1.png", "cat_idle_2.png", "cat_idle_3.png"];
      const animationName = items[Math.floor(Math.random() * items.length)];

      cat.style.background = `url('sprites/${animationName}')`;
      cat.style.animationName = "cat-idle";
      cat.style.animationDuration = "3s";
      cat.style.animationTimingFunction = "steps(4)";
      cat.style.animationIterationCount = "infinite";
      return;
    }
    default: {
      throw new Error(`State "${state}" not recognized`);
    }
  }
}

/** Handle 'toggle' button click */
function handleToggleButton(): void {
  // Toggle cat's behavior
  const currentState = STATE[StateFlagEnum.CatState];

  if (
    currentState === CatStateEnum.Running ||
    currentState === CatStateEnum.Idle
  ) {
    STATE[StateFlagEnum.CatState] = CatStateEnum.Sleeping;
    renderCatState(CatStateEnum.Sleeping);
  } else {
    STATE[StateFlagEnum.CatState] = CatStateEnum.Running;
    renderCatState(CatStateEnum.Running);
  }
}

/** Put new cursor coords into the state so cat could pick them up */
addEventListener("pointermove", (event) => {
  const cursorCoords = { x: event.clientX, y: event.clientY };
  STATE[StateFlagEnum.CursorCoordX] = cursorCoords.x;
  STATE[StateFlagEnum.CursorCoordY] = cursorCoords.y;
});

/** If cat is not asleep or idle, make it run towards the cursor*/
function makeCatAction(): void {
  const cat = document.getElementById("cat");

  if (STATE[StateFlagEnum.CatState] === CatStateEnum.Sleeping) {
    // No action, cat sleeps
    return;
  }

  // Check if cat should move or if it's idle
  const cursorCoords = {
    x: STATE[StateFlagEnum.CursorCoordX],
    y: STATE[StateFlagEnum.CursorCoordY],
  };

  // Turn them from `<number>px` strings into numbers
  const catCurrentCoords = {
    x: Number(cat.style.left.split("px")[0]),
    y: Number(cat.style.top.split("px")[0]),
  };

  const distanceToCursor = Math.sqrt(
    (catCurrentCoords.x - cursorCoords.x) ** 2 +
      (catCurrentCoords.y - cursorCoords.y) ** 2
  );

  // Radius from cursor within which cat goes to idle state instead of running
  const IDLE_RADIUS = 20.0;

  if (distanceToCursor <= IDLE_RADIUS) {
    // Cat goes idle and chills for a bit
    if (STATE[StateFlagEnum.CatState] !== CatStateEnum.Idle) {
      STATE[StateFlagEnum.CatState] = CatStateEnum.Idle;
      renderCatState(CatStateEnum.Idle);
    }
    return;
  } else {
    // Bring cat closer to the cursor
    if (STATE[StateFlagEnum.CatState] !== CatStateEnum.Running) {
      STATE[StateFlagEnum.CatState] = CatStateEnum.Running;
      renderCatState(CatStateEnum.Running);
    }

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

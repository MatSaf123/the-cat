var _a;
var StateFlagEnum;
(function (StateFlagEnum) {
    StateFlagEnum[StateFlagEnum["CatState"] = 0] = "CatState";
    StateFlagEnum[StateFlagEnum["CursorCoordX"] = 1] = "CursorCoordX";
    StateFlagEnum[StateFlagEnum["CursorCoordY"] = 2] = "CursorCoordY";
})(StateFlagEnum || (StateFlagEnum = {}));
var CatStateEnum;
(function (CatStateEnum) {
    CatStateEnum[CatStateEnum["Sleeping"] = 0] = "Sleeping";
    CatStateEnum[CatStateEnum["Running"] = 1] = "Running";
    CatStateEnum[CatStateEnum["Idle"] = 2] = "Idle";
})(CatStateEnum || (CatStateEnum = {}));
var STATE = (_a = {},
    _a[StateFlagEnum.CatState] = CatStateEnum.Sleeping,
    _a[StateFlagEnum.CursorCoordX] = 0,
    _a[StateFlagEnum.CursorCoordY] = 0,
    _a);
/**
 * Changes and renders cats animation and the displayed info text
 */
function renderCatState(state) {
    var catStateText = document.getElementById("cat-state-text");
    var cat = document.getElementById("cat");
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
            var items = ["cat_idle_1.png", "cat_idle_2.png", "cat_idle_3.png"];
            var animationName = items[Math.floor(Math.random() * items.length)];
            cat.style.background = "url('sprites/".concat(animationName, "')");
            cat.style.animationName = "cat-idle";
            cat.style.animationDuration = "3s";
            cat.style.animationTimingFunction = "steps(4)";
            cat.style.animationIterationCount = "infinite";
            return;
        }
        default: {
            throw new Error("State \"".concat(state, "\" not recognized"));
        }
    }
}
/** Handle 'toggle' button click */
function handleToggleButton() {
    // Toggle cat's behavior
    var currentState = STATE[StateFlagEnum.CatState];
    if (currentState === CatStateEnum.Running ||
        currentState === CatStateEnum.Idle) {
        STATE[StateFlagEnum.CatState] = CatStateEnum.Sleeping;
        renderCatState(CatStateEnum.Sleeping);
    }
    else {
        STATE[StateFlagEnum.CatState] = CatStateEnum.Running;
        renderCatState(CatStateEnum.Running);
    }
}
/** Put new cursor coords into the state so cat could pick them up */
addEventListener("pointermove", function (event) {
    var cursorCoords = { x: event.clientX, y: event.clientY };
    STATE[StateFlagEnum.CursorCoordX] = cursorCoords.x;
    STATE[StateFlagEnum.CursorCoordY] = cursorCoords.y;
});
/** If cat is not asleep or idle, make it run towards the cursor*/
function makeCatAction() {
    var cat = document.getElementById("cat");
    if (STATE[StateFlagEnum.CatState] === CatStateEnum.Sleeping) {
        // No action, cat sleeps
        return;
    }
    // Check if cat should move or if it's idle
    var cursorCoords = {
        x: STATE[StateFlagEnum.CursorCoordX],
        y: STATE[StateFlagEnum.CursorCoordY],
    };
    // Turn them from `<number>px` strings into numbers
    var catCurrentCoords = {
        x: Number(cat.style.left.split("px")[0]),
        y: Number(cat.style.top.split("px")[0]),
    };
    var distanceToCursor = Math.sqrt(Math.pow((catCurrentCoords.x - cursorCoords.x), 2) +
        Math.pow((catCurrentCoords.y - cursorCoords.y), 2));
    // Radius from cursor within which cat goes to idle state instead of running
    var IDLE_RADIUS = 20.0;
    if (distanceToCursor <= IDLE_RADIUS) {
        // Cat goes idle and chills for a bit
        if (STATE[StateFlagEnum.CatState] !== CatStateEnum.Idle) {
            STATE[StateFlagEnum.CatState] = CatStateEnum.Idle;
            renderCatState(CatStateEnum.Idle);
        }
        return;
    }
    else {
        // Bring cat closer to the cursor
        if (STATE[StateFlagEnum.CatState] !== CatStateEnum.Running) {
            STATE[StateFlagEnum.CatState] = CatStateEnum.Running;
            renderCatState(CatStateEnum.Running);
        }
        var vector = {
            x: cursorCoords.x - catCurrentCoords.x,
            y: cursorCoords.y - catCurrentCoords.y,
        };
        var vectorLength = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
        var CAT_SPEED = 2.0;
        var catNewCoords = {
            x: catCurrentCoords.x + (vector.x / vectorLength) * CAT_SPEED,
            y: catCurrentCoords.y + (vector.y / vectorLength) * CAT_SPEED,
        };
        cat.style.top = "".concat(catNewCoords.y, "px");
        cat.style.left = "".concat(catNewCoords.x, "px");
        // Depending on the position of the cat and the cursor, we might want to flip the sprite -
        // if cat is running left, we flip it
        if (vector.x < 0) {
            if (cat.style.transform !== "scaleX(-1)") {
                cat.style.transform = "scaleX(-1)";
            }
        }
        else {
            if (cat.style.transform !== "scaleX(1)") {
                cat.style.transform = "scaleX(1)";
            }
        }
    }
}
/** Cat makes action every 24ms */
window.setInterval(makeCatAction, 24);
window.onload = function () {
    // We need to take cat's coords from `#cat` style definition and put them into `element.style`,
    // otherwise after waking up cat will teleport to the 0,0 coords
    var cat = document.getElementById("cat");
    cat.style.top = window.getComputedStyle(cat).top;
    cat.style.left = window.getComputedStyle(cat).left;
};
//# sourceMappingURL=script.js.map
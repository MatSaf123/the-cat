var _a;
var StatePartEnum;
(function (StatePartEnum) {
    StatePartEnum[StatePartEnum["CatState"] = 0] = "CatState";
    StatePartEnum[StatePartEnum["IsShiftDown"] = 1] = "IsShiftDown";
    StatePartEnum[StatePartEnum["CursorCoordX"] = 2] = "CursorCoordX";
    StatePartEnum[StatePartEnum["CursorCoordY"] = 3] = "CursorCoordY";
})(StatePartEnum || (StatePartEnum = {}));
var CatStateEnum;
(function (CatStateEnum) {
    CatStateEnum[CatStateEnum["Sleeping"] = 0] = "Sleeping";
    CatStateEnum[CatStateEnum["Running"] = 1] = "Running";
    CatStateEnum[CatStateEnum["Sprinting"] = 2] = "Sprinting";
    CatStateEnum[CatStateEnum["Idle"] = 3] = "Idle";
})(CatStateEnum || (CatStateEnum = {}));
var STATE = (_a = {},
    _a[StatePartEnum.CatState] = CatStateEnum.Sleeping,
    _a[StatePartEnum.CursorCoordX] = 0,
    _a[StatePartEnum.CursorCoordY] = 0,
    _a[StatePartEnum.IsShiftDown] = false,
    _a);
/**
 * Changes and renders cats animation and the displayed info text
 */
function changeCatRenderState() {
    var catStateText = document.getElementById("cat-state-text");
    var cat = document.getElementById("cat");
    var catState = STATE[StatePartEnum.CatState];
    switch (catState) {
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
            if (STATE[StatePartEnum.IsShiftDown]) {
                catStateText.innerHTML = "Cat is running FAST!";
                // Set animation to sprinting
                cat.style.background = "url('sprites/cat_sprint.png')";
                cat.style.animationName = "cat-sprint";
                cat.style.animationDuration = "1.0s";
                cat.style.animationTimingFunction = "steps(8)";
                cat.style.animationIterationCount = "infinite";
            }
            else {
                catStateText.innerHTML = "Cat is running!";
                // Set animation to running
                cat.style.background = "url('sprites/cat_run.png')";
                cat.style.animationName = "cat-run";
                cat.style.animationDuration = "1.5s";
                cat.style.animationTimingFunction = "steps(8)";
                cat.style.animationIterationCount = "infinite";
            }
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
            throw new Error("State \"".concat(catState, "\" not recognized"));
        }
    }
}
/** Handle 'Toggle the cat' button click - either make it go to sleep or wake it up */
function handleToggleButton() {
    var catState = STATE[StatePartEnum.CatState];
    if (catState !== CatStateEnum.Sleeping) {
        STATE[StatePartEnum.CatState] = CatStateEnum.Sleeping;
    }
    else {
        STATE[StatePartEnum.CatState] = CatStateEnum.Running;
    }
    changeCatRenderState();
}
/** If cat is not asleep or idle, make it run towards the cursor */
function makeCatAction() {
    if (STATE[StatePartEnum.CatState] === CatStateEnum.Sleeping) {
        // No action, cat sleeps
        return;
    }
    // Check if cat should move or if it's idle
    var cursorCoords = {
        x: STATE[StatePartEnum.CursorCoordX],
        y: STATE[StatePartEnum.CursorCoordY],
    };
    var cat = document.getElementById("cat");
    // Turn coords from `<number>px` strings into numbers
    var catCurrentCoords = {
        x: Number(cat.style.left.split("px")[0]),
        y: Number(cat.style.top.split("px")[0]),
    };
    var distanceToCursor = Math.sqrt(Math.pow((catCurrentCoords.x - cursorCoords.x), 2) +
        Math.pow((catCurrentCoords.y - cursorCoords.y), 2));
    // Radius from cursor within which cat goes to idle state instead of running.
    // We want to increase the radius if cat is already idle - this results in a nice
    // looking effect where cat waits for cursor to get a little further away before getting up
    var idleModifier = STATE[StatePartEnum.CatState] === CatStateEnum.Idle ? 3.0 : 1.0;
    var IDLE_RADIUS = 20.0 * idleModifier;
    if (distanceToCursor <= IDLE_RADIUS) {
        // Cat goes idle and chills for a bit
        if (STATE[StatePartEnum.CatState] !== CatStateEnum.Idle) {
            STATE[StatePartEnum.CatState] = CatStateEnum.Idle;
            changeCatRenderState();
        }
        return;
    }
    else {
        // Bring cat closer to the cursor
        if (STATE[StatePartEnum.CatState] !== CatStateEnum.Running) {
            STATE[StatePartEnum.CatState] = CatStateEnum.Running;
            changeCatRenderState();
        }
        var vector = {
            x: cursorCoords.x - catCurrentCoords.x,
            y: cursorCoords.y - catCurrentCoords.y,
        };
        var vectorLength = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
        // If SHIFT is down, cat runs faster
        var catSpeedModifier = STATE[StatePartEnum.IsShiftDown] ? 3.0 : 1.0;
        var CAT_SPEED = 2.0 * catSpeedModifier;
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
/** Put new cursor coords into the state so cat could pick them up */
onpointermove = function (event) {
    var cursorCoords = { x: event.clientX, y: event.clientY };
    STATE[StatePartEnum.CursorCoordX] = cursorCoords.x;
    STATE[StatePartEnum.CursorCoordY] = cursorCoords.y;
};
/** Make cat run faster when SHIFT key is down */
onkeydown = function (event) {
    if (event.key === "Shift") {
        STATE[StatePartEnum.IsShiftDown] = true;
        changeCatRenderState();
    }
};
/** Make cat run in a normal speed when SHIFT key is lifted */
onkeyup = function (event) {
    if (event.key === "Shift") {
        STATE[StatePartEnum.IsShiftDown] = false;
        changeCatRenderState();
    }
};
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
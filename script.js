var _a;
var StateFlagEnum;
(function (StateFlagEnum) {
    StateFlagEnum[StateFlagEnum["CatEnabled"] = 0] = "CatEnabled";
    StateFlagEnum[StateFlagEnum["CursorCoordX"] = 1] = "CursorCoordX";
    StateFlagEnum[StateFlagEnum["CursorCoordY"] = 2] = "CursorCoordY";
})(StateFlagEnum || (StateFlagEnum = {}));
var STATE = (_a = {},
    _a[StateFlagEnum.CatEnabled] = false,
    _a[StateFlagEnum.CursorCoordX] = 0,
    _a[StateFlagEnum.CursorCoordY] = 0,
    _a);
/** Handle 'toggle' button click */
function handleToggleButton() {
    // Toggle cat's behavior
    var oldCatState = STATE[StateFlagEnum.CatEnabled];
    STATE[StateFlagEnum.CatEnabled] = !oldCatState;
    // Update elements and animation
    var catStateText = document.getElementById("cat-state-text");
    var cat = document.getElementById("cat");
    if (STATE[StateFlagEnum.CatEnabled]) {
        catStateText.innerHTML = "Cat is running!";
        // Set animation to running
        cat.style.background = "url('sprites/cat_run.png')";
        cat.style.animationName = "cat-run";
        cat.style.animationDuration = "1.5s";
        cat.style.animationTimingFunction = "steps(8)";
        cat.style.animationIterationCount = "infinite";
    }
    else {
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
addEventListener("pointermove", function (event) {
    var cursorCoords = { x: event.clientX, y: event.clientY };
    STATE[StateFlagEnum.CursorCoordX] = cursorCoords.x;
    STATE[StateFlagEnum.CursorCoordY] = cursorCoords.y;
});
/** If cat is not sleeping, make it run towards the cursor*/
function makeCatAction() {
    var cat = document.getElementById("cat");
    if (STATE[StateFlagEnum.CatEnabled]) {
        // Bring cat closer to the cursor
        var cursorCoords = {
            x: STATE[StateFlagEnum.CursorCoordX],
            y: STATE[StateFlagEnum.CursorCoordY],
        };
        // Turn them from `<number>px` strings into numbers
        var catCurrentCoords = {
            x: Number(cat.style.left.split("px")[0]),
            y: Number(cat.style.top.split("px")[0]),
        };
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
    else {
        // Cat sleeps, no action. Zzz
    }
}
/** Cat makes action every 50ms */
window.setInterval(makeCatAction, 24);
window.onload = function () {
    // We need to take cat's coords from `#cat` style definition and put them into `element.style`,
    // otherwise after waking up cat will teleport to the 0,0 coords
    var cat = document.getElementById("cat");
    cat.style.top = window.getComputedStyle(cat).top;
    cat.style.left = window.getComputedStyle(cat).left;
};
//# sourceMappingURL=script.js.map
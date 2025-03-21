/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/panel/dom.ts":
/*!**************************!*\
  !*** ./src/panel/dom.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DOM = void 0;
class DOM {
    constructor({ movementContainerSelector, petImageSelector, transitionContainerSelector, transitionSelector, }) {
        this.getHTMLElement = (elementName) => {
            const htmlElement = document.getElementById(elementName);
            if (!htmlElement) {
                throw new Error(`Unable to locate element in DOM: ${elementName}`);
            }
            return htmlElement;
        };
        this._petImageSelector = petImageSelector;
        this._movementContainerSelector = movementContainerSelector;
        this._transitionContainerSelector = transitionContainerSelector;
        this._transitionSelector = transitionSelector;
    }
    getMovementSelector() {
        if (!this._movementContainerElement) {
            this._movementContainerElement = this.getHTMLElement(this._movementContainerSelector);
        }
        return this._movementContainerElement;
    }
    getPetImageSelector() {
        if (!this._petImageElement) {
            this._petImageElement = this.getHTMLElement(this._petImageSelector);
        }
        return this._petImageElement;
    }
    getTransitionSelector() {
        if (!this._transitionContainerElement) {
            this._transitionContainerElement = this.getHTMLElement(this._transitionContainerSelector);
        }
        return this._transitionContainerElement;
    }
    getTransitionImageSelector() {
        if (!this._transitionImageElement) {
            this._transitionImageElement = this.getHTMLElement(this._transitionSelector);
        }
        return this._transitionImageElement;
    }
}
exports.DOM = DOM;


/***/ }),

/***/ "./src/panel/index.ts":
/*!****************************!*\
  !*** ./src/panel/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transforms = exports.state = exports.setState = exports.randomPetType = exports.randomPetName = exports.petTypes = exports.mutateLevel = exports.initializeState = exports.gifs = exports.getPetAnimations = exports.generatePet = exports.DOM = exports.Direction = exports.adjustSpeedForScale = void 0;
const dom_1 = __webpack_require__(/*! ./dom */ "./src/panel/dom.ts");
Object.defineProperty(exports, "DOM", ({ enumerable: true, get: function () { return dom_1.DOM; } }));
const pets_1 = __webpack_require__(/*! ./pets */ "./src/panel/pets.ts");
Object.defineProperty(exports, "generatePet", ({ enumerable: true, get: function () { return pets_1.generatePet; } }));
Object.defineProperty(exports, "getPetAnimations", ({ enumerable: true, get: function () { return pets_1.getPetAnimations; } }));
Object.defineProperty(exports, "gifs", ({ enumerable: true, get: function () { return pets_1.gifs; } }));
Object.defineProperty(exports, "mutateLevel", ({ enumerable: true, get: function () { return pets_1.mutateLevel; } }));
Object.defineProperty(exports, "petTypes", ({ enumerable: true, get: function () { return pets_1.petTypes; } }));
Object.defineProperty(exports, "randomPetName", ({ enumerable: true, get: function () { return pets_1.randomPetName; } }));
Object.defineProperty(exports, "randomPetType", ({ enumerable: true, get: function () { return pets_1.randomPetType; } }));
const state_1 = __webpack_require__(/*! ./state */ "./src/panel/state.ts");
Object.defineProperty(exports, "initializeState", ({ enumerable: true, get: function () { return state_1.initializeState; } }));
Object.defineProperty(exports, "setState", ({ enumerable: true, get: function () { return state_1.setState; } }));
Object.defineProperty(exports, "state", ({ enumerable: true, get: function () { return state_1.state; } }));
const transforms_1 = __webpack_require__(/*! ./transforms */ "./src/panel/transforms.ts");
Object.defineProperty(exports, "transforms", ({ enumerable: true, get: function () { return transforms_1.transforms; } }));
const types_1 = __webpack_require__(/*! ./types */ "./src/panel/types.ts");
Object.defineProperty(exports, "Direction", ({ enumerable: true, get: function () { return types_1.Direction; } }));
// Function to adjust speed based on scale
const adjustSpeedForScale = (originalSpeed, scale) => originalSpeed * (0.7 + 0.6 * scale);
exports.adjustSpeedForScale = adjustSpeedForScale;


/***/ }),

/***/ "./src/panel/main.ts":
/*!***************************!*\
  !*** ./src/panel/main.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.app = exports.addPetToPanel = void 0;
const _1 = __webpack_require__(/*! ./ */ "./src/panel/index.ts");
const state_1 = __webpack_require__(/*! ./state */ "./src/panel/state.ts");
const defaultState = {
    userPet: (0, _1.generatePet)({ name: 'unknown', type: 'unknown' }),
    basePetUri: '',
};
(0, state_1.initializeState)(defaultState);
const dom = new _1.DOM({
    movementContainerSelector: 'movement-container',
    petImageSelector: 'pet',
    transitionContainerSelector: 'transition-container',
    transitionSelector: 'transition',
});
const TICK_INTERVAL_MS = 100;
// Store played transitions in a local variable outside the tick function
const playedTransitions = {};
const tick = ({ userPet }) => {
    const { leftPosition, direction } = _1.transforms[userPet.state].nextFrame({
        containerWidth: window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth,
        leftPosition: userPet.leftPosition,
        direction: userPet.direction,
        speed: (0, _1.adjustSpeedForScale)(userPet.speed, userPet.scale),
        offset: (0, _1.getPetAnimations)({ userPet }).animation.offset || 0,
        scale: userPet.scale,
    });
    userPet.leftPosition = leftPosition;
    userPet.direction = direction;
    // Apply transformation
    const movementContainer = dom.getMovementSelector();
    movementContainer.style.marginLeft = `${userPet.leftPosition}px`;
    const petImageElement = dom.getPetImageSelector();
    petImageElement.style.transform = `scaleX(${userPet.direction}) scale(${userPet.scale})`;
    // Get the pet container and adjust its position to keep pet on the ground
    const petContainer = document.getElementById('pet-container');
    if (petContainer) {
        const { animation } = (0, _1.getPetAnimations)({ userPet });
        const verticalAdjustment = (animation.height * (userPet.scale - 1)) / 2;
        petContainer.style.bottom = `${verticalAdjustment}px`;
    }
    // Handle transition animations with tracking to prevent repeating
    if (userPet.isTransitionIn) {
        const transitionKey = `${userPet.level}-${userPet.state}`;
        // Skip if we've already played this specific transition
        if (playedTransitions[transitionKey]) {
            // For eggs (level 0, idle), preserve isTransitionIn but don't show animation again
            if (userPet.level === 0 && userPet.state === 'idle') {
                // Preserve the flag but skip animation
                return;
            }
            else {
                // For non-eggs, clear the flag
                _1.state.userPet.isTransitionIn = false;
                return;
            }
        }
        const { transition: animation } = (0, _1.getPetAnimations)({
            userPet,
        });
        if (animation) {
            const transitionContainer = dom.getTransitionSelector();
            transitionContainer.style.marginLeft = `${userPet.leftPosition}px`;
            // Also adjust transition container height
            const transitionContainerElement = document.getElementById('transition-container');
            if (transitionContainerElement) {
                const verticalAdjustment = (animation.height * (userPet.scale - 1)) / 2;
                transitionContainerElement.style.bottom = `${verticalAdjustment}px`;
            }
            setImage({
                container: dom.getTransitionSelector(),
                selector: dom.getTransitionImageSelector(),
                animation,
            });
            // Mark this transition as played
            playedTransitions[transitionKey] = true;
            // For non-eggs, clear the transition flag
            if (!(userPet.level === 0 && userPet.state === 'idle')) {
                _1.state.userPet.isTransitionIn = false;
            }
        }
    }
};
const setImage = ({ container, selector, animation, }) => {
    var _a;
    const { basePetUri, userPet } = _1.state;
    selector.src = `${basePetUri}/${_1.gifs[animation.gif]}`;
    selector.width = animation.width;
    selector.style.minWidth = `${animation.width}px`;
    selector.height = animation.height;
    // For pet image, we need to maintain scaleX for direction
    if (selector === dom.getPetImageSelector()) {
        selector.style.transform = `scaleX(${userPet.direction}) scale(${userPet.scale})`;
    }
    else {
        // For transition images, just apply the scale
        selector.style.transform = `scale(${userPet.scale})`;
    }
    container.style.left = `${(_a = animation.offset) !== null && _a !== void 0 ? _a : 0}px`;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const startAnimation = () => {
    const { userPet } = _1.state;
    if (_1.state.intervalId) {
        clearInterval(_1.state.intervalId);
    }
    const intervalId = setInterval(() => {
        tick({ userPet });
    }, TICK_INTERVAL_MS);
    (0, _1.setState)('intervalId', intervalId);
};
const addPetToPanel = ({ userPet }) => __awaiter(void 0, void 0, void 0, function* () {
    const { animation } = (0, _1.getPetAnimations)({
        userPet,
    });
    // Store the original speed if it's not already set
    if (!userPet.originalSpeed && animation.speed) {
        userPet.originalSpeed = animation.speed;
    }
    if (userPet.originalSpeed) {
        userPet.speed = (0, _1.adjustSpeedForScale)(userPet.originalSpeed, userPet.scale);
    }
    // If this is a new egg (level 0), reset transition tracking
    if (userPet.level === 0 &&
        userPet.state === 'idle' &&
        userPet.isTransitionIn) {
        // Clear history for new eggs to ensure transition plays
        const eggKey = `0-idle`;
        delete playedTransitions[eggKey];
    }
    // NEVER modify isTransitionIn - respect whatever value was passed in
    // This is critical for preserving egg state correctly
    // Set the state with the pet as-is
    (0, _1.setState)('userPet', userPet);
    startAnimation();
    // Give the transition a chance to play
    yield sleep(TICK_INTERVAL_MS * 2);
    setImage({
        selector: dom.getPetImageSelector(),
        animation,
        container: dom.getMovementSelector(),
    });
    // Apply vertical position adjustment for the pet container
    const petContainer = document.getElementById('pet-container');
    if (petContainer) {
        const verticalAdjustment = (animation.height * (userPet.scale - 1)) / 2;
        petContainer.style.bottom = `${verticalAdjustment}px`;
    }
});
exports.addPetToPanel = addPetToPanel;
const app = ({ userPet, basePetUri, }) => {
    (0, _1.setState)('basePetUri', basePetUri);
    if (userPet) {
        // Pass the pet object exactly as received
        (0, exports.addPetToPanel)({ userPet });
    }
    // Track document visibility changes to reset transitions when tab becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Reset transitions when the tab becomes visible again
            // This helps with the case where the user switches away and back
            Object.keys(playedTransitions).forEach((key) => delete playedTransitions[key]);
        }
    });
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', (event) => {
        var _a, _b;
        const { command, data } = event.data; // The data that the extension sent
        switch (command) {
            case 'spawn-pet':
                // Clear played transitions when spawning a new pet
                Object.keys(playedTransitions).forEach((key) => delete playedTransitions[key]);
                // For spawn-pet, always start fresh
                (0, exports.addPetToPanel)({ userPet: data.userPet });
                break;
            case 'update-pet':
                // Check if this is a significant state change (like level or pet type)
                const isNewPet = !_1.state.userPet ||
                    _1.state.userPet.type !== data.userPet.type ||
                    _1.state.userPet.name !== data.userPet.name;
                const isLevelChange = _1.state.userPet && _1.state.userPet.level !== data.userPet.level;
                // Reset transition tracking for significant changes
                if (isNewPet || isLevelChange || data.userPet.isTransitionIn) {
                    Object.keys(playedTransitions).forEach((key) => delete playedTransitions[key]);
                }
                // Preserve position and direction but use all other properties from the update
                // This is critical for preserving the egg/hatched state when switching views
                const updatedPet = Object.assign(Object.assign({}, data.userPet), { leftPosition: ((_a = _1.state.userPet) === null || _a === void 0 ? void 0 : _a.leftPosition) || data.userPet.leftPosition, direction: ((_b = _1.state.userPet) === null || _b === void 0 ? void 0 : _b.direction) || data.userPet.direction });
                (0, exports.addPetToPanel)({ userPet: updatedPet });
                break;
        }
    });
};
exports.app = app;


/***/ }),

/***/ "./src/panel/pets.ts":
/*!***************************!*\
  !*** ./src/panel/pets.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mutateLevel = exports.getLevel = exports.generatePet = exports.getPetAnimations = exports.randomPetName = exports.randomPetType = exports.petTypes = exports.petNames = exports.gifs = void 0;
const _1 = __webpack_require__(/*! ./ */ "./src/panel/index.ts");
exports.gifs = {
    egg1: 'egg1.gif',
    dust1: 'dust1.gif',
    dust2: 'dust2.gif',
    monster1phase1: 'm1d1.gif',
    monster1phase2: 'm1d2.gif',
    monster1phase3: 'm1d3.gif',
    monster2phase1: 'm2d1.gif',
    monster2phase2: 'm2d2.gif',
    monster2phase3: 'm2d3.gif',
    monster3phase1: 'm3d1.gif',
    monster3phase2: 'm3d2.gif',
    monster3phase3: 'm3d3.gif',
    monster4phase1: 'm4d1.gif',
    monster4phase2: 'm4d2.gif',
    monster4phase3: 'm4d3.gif',
    monster5phase1: 'm5d1.gif',
    monster5phase2: 'm5d2.gif',
    monster5phase3: 'm5d3.gif',
};
exports.petNames = [
    'boo',
    'nacho',
    'gary',
    'fudge',
    'neko',
    'pip',
    'bibo',
    'fifi',
    'jax',
    'bobba',
    'gidget',
    'mina',
    'crumb',
    'zimbo',
    'dusty',
    'brock',
    'otis',
    'marvin',
    'smokey',
    'barry',
    'tony',
    'dusty',
    'mochi',
];
const animationDefaults = {
    width: 75,
    height: 64,
    speed: 0,
    offset: 0,
};
const egg = {
    xp: 0,
    defaultState: 'idle',
    animations: {
        idle: Object.assign(Object.assign({}, animationDefaults), { gif: 'egg1' }),
        transition: Object.assign(Object.assign({}, animationDefaults), { gif: 'dust1', offset: -13, width: 100, height: 100 }),
    },
};
// Generic evolution transition
const transition = Object.assign(Object.assign({}, animationDefaults), { gif: 'dust2', offset: -92, width: 280, height: 100 });
exports.petTypes = new Map([
    [
        'monster1',
        {
            levels: new Map([
                [0, egg],
                [
                    1,
                    {
                        xp: 35,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster1phase1', speed: 2 }),
                        },
                    },
                ],
                [
                    2,
                    {
                        xp: 150000,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster1phase2', speed: 2 }),
                        },
                    },
                ],
                [
                    3,
                    {
                        xp: 240000,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster1phase3', speed: 2 }),
                        },
                    },
                ],
            ]),
        },
    ],
    [
        'monster2',
        {
            levels: new Map([
                [0, egg],
                [
                    1,
                    {
                        xp: 35,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster2phase1', width: 64, speed: 2 }),
                        },
                    },
                ],
                [
                    2,
                    {
                        xp: 100000,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster2phase2', width: 64, speed: 2 }),
                        },
                    },
                ],
                [
                    3,
                    {
                        xp: 600000,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster2phase3', width: 64, speed: 2 }),
                        },
                    },
                ],
            ]),
        },
    ],
    [
        'monster3',
        {
            levels: new Map([
                [0, egg],
                [
                    1,
                    {
                        xp: 35,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster3phase1', width: 64, speed: 1 }),
                        },
                    },
                ],
                [
                    2,
                    {
                        xp: 599900,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster3phase2', width: 64, speed: 0 }),
                        },
                    },
                ],
                [
                    3,
                    {
                        xp: 600000,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster3phase3', width: 64, speed: 2 }),
                        },
                    },
                ],
            ]),
        },
    ],
    [
        'monster4',
        {
            levels: new Map([
                [0, egg],
                [
                    1,
                    {
                        xp: 35,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster4phase1', width: 64, speed: 2 }),
                        },
                    },
                ],
                [
                    2,
                    {
                        xp: 150000,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster4phase2', width: 64, speed: 2 }),
                        },
                    },
                ],
                [
                    3,
                    {
                        xp: 240000,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster4phase3', width: 64, speed: 3 }),
                        },
                    },
                ],
            ]),
        },
    ],
    [
        'monster5',
        {
            levels: new Map([
                [0, egg],
                [
                    1,
                    {
                        xp: 35,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster5phase1', width: 64, height: 66, speed: 2 }),
                        },
                    },
                ],
                [
                    2,
                    {
                        xp: 150000,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster5phase2', speed: 2, height: 100, width: 100 }),
                        },
                    },
                ],
                [
                    3,
                    {
                        xp: 240000,
                        defaultState: 'walking',
                        animations: {
                            transition,
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster5phase3', speed: 2, height: 135, width: 125 }),
                        },
                    },
                ],
            ]),
        },
    ],
]);
const randomPetType = () => Array.from(exports.petTypes.keys())[Math.floor(Math.random() * exports.petTypes.size)];
exports.randomPetType = randomPetType;
const randomPetName = () => {
    const name = exports.petNames[Math.floor(Math.random() * exports.petNames.length)];
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
exports.randomPetName = randomPetName;
const getPetAnimations = ({ userPet, }) => {
    const petTypeFound = exports.petTypes.get(userPet.type);
    if (!petTypeFound) {
        throw new Error(`Pet type not found: ${userPet.type}`);
    }
    const levelFound = petTypeFound.levels.get(userPet.level);
    if (!levelFound) {
        throw new Error(`Pet level not found for pet type ${userPet.type}: ${userPet.level}`);
    }
    if (!(userPet.state in levelFound.animations)) {
        throw new Error(`Animation not found for pet type ${userPet.type}, level ${userPet.level}: ${userPet.state}`);
    }
    const transition = 'transition' in levelFound.animations
        ? levelFound.animations.transition
        : undefined;
    return {
        animation: levelFound.animations[userPet.state],
        transition,
    };
};
exports.getPetAnimations = getPetAnimations;
const generatePet = ({ name, type }) => ({
    leftPosition: 0,
    speed: 0,
    direction: _1.Direction.right,
    level: 0,
    xp: 0,
    // All level 0 characters require this state
    state: 'idle',
    isTransitionIn: true,
    name,
    type,
    scale: 1,
});
exports.generatePet = generatePet;
const getLevel = ({ petType, level, }) => {
    const petTypeFound = exports.petTypes.get(petType);
    if (!petTypeFound) {
        return undefined;
    }
    const levelFound = petTypeFound.levels.get(level);
    if (!levelFound) {
        return undefined;
    }
    return levelFound;
};
exports.getLevel = getLevel;
const mutateLevel = ({ userPet }) => {
    const nextLevelFound = (0, exports.getLevel)({
        petType: userPet.type,
        level: userPet.level + 1,
    });
    if (!nextLevelFound) {
        return;
    }
    if (userPet.xp >= nextLevelFound.xp) {
        // Record the previous level to detect actual level up
        const previousLevel = userPet.level;
        userPet.level += 1;
        userPet.xp = 0;
        userPet.state = nextLevelFound.defaultState;
        userPet.speed = nextLevelFound.animations[userPet.state].speed || 0;
        // Only set transition flag when there's an actual level change
        if (userPet.level !== previousLevel) {
            userPet.isTransitionIn = true;
        }
    }
};
exports.mutateLevel = mutateLevel;


/***/ }),

/***/ "./src/panel/state.ts":
/*!****************************!*\
  !*** ./src/panel/state.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setState = exports.initializeState = exports.state = void 0;
const initializeState = (initialState) => (exports.state = initialState);
exports.initializeState = initializeState;
const setState = (key, value) => (exports.state = Object.assign(Object.assign({}, exports.state), { [key]: value }));
exports.setState = setState;


/***/ }),

/***/ "./src/panel/transforms.ts":
/*!*********************************!*\
  !*** ./src/panel/transforms.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transforms = void 0;
const _1 = __webpack_require__(/*! ./ */ "./src/panel/index.ts");
exports.transforms = {
    idle: {
        nextFrame: ({ direction, offset, scale }) => ({
            direction,
            leftPosition: offset,
            scale,
        }),
    },
    walking: {
        nextFrame: ({ containerWidth, leftPosition: oldLeftPosition, direction: oldDirection, speed, scale, }) => {
            const direction = oldLeftPosition >= containerWidth - speed - 150
                ? _1.Direction.left
                : oldLeftPosition <= 0 + speed
                    ? _1.Direction.right
                    : oldDirection;
            const leftPosition = direction === _1.Direction.right
                ? oldLeftPosition + speed
                : oldLeftPosition - speed;
            return {
                direction,
                leftPosition,
                scale,
            };
        },
    },
};


/***/ }),

/***/ "./src/panel/types.ts":
/*!****************************!*\
  !*** ./src/panel/types.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction[Direction["right"] = 1] = "right";
    Direction[Direction["left"] = -1] = "left";
})(Direction = exports.Direction || (exports.Direction = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/panel/main.ts");
/******/ 	self.codachiApp = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TjtRQUNILENBQUM7S0FDRjtDQUNGOzs7Ozs7Ozs7Ozs7OztBQ2NELElBQVksU0FHWDtBQUhELFdBQVksU0FBUztJQUNuQiwyQ0FBUztJQUNULDBDQUFTO0FBQ1gsQ0FBQyxFQUhXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBR3BCOzs7Ozs7O1VDdkREO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL2RvbS50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL2luZGV4LnRzIiwid2VicGFjazovL2NvZGFjaGlBcHAvLi9zcmMvcGFuZWwvbWFpbi50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL3BldHMudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9zdGF0ZS50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL3RyYW5zZm9ybXMudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC90eXBlcy50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NvZGFjaGlBcHAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgRE9NIHtcbiAgcHJpdmF0ZSBfcGV0SW1hZ2VTZWxlY3Rvcjogc3RyaW5nXG4gIHByaXZhdGUgX21vdmVtZW50Q29udGFpbmVyU2VsZWN0b3I6IHN0cmluZ1xuICBwcml2YXRlIF90cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3I6IHN0cmluZ1xuICBwcml2YXRlIF90cmFuc2l0aW9uU2VsZWN0b3I6IHN0cmluZ1xuXG4gIHByaXZhdGUgX21vdmVtZW50Q29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWRcbiAgcHJpdmF0ZSBfcGV0SW1hZ2VFbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50IHwgdW5kZWZpbmVkXG4gIHByaXZhdGUgX3RyYW5zaXRpb25Db250YWluZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZFxuICBwcml2YXRlIF90cmFuc2l0aW9uSW1hZ2VFbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50IHwgdW5kZWZpbmVkXG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3IsXG4gICAgcGV0SW1hZ2VTZWxlY3RvcixcbiAgICB0cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3IsXG4gICAgdHJhbnNpdGlvblNlbGVjdG9yLFxuICB9OiB7XG4gICAgcGV0SW1hZ2VTZWxlY3Rvcjogc3RyaW5nXG4gICAgbW92ZW1lbnRDb250YWluZXJTZWxlY3Rvcjogc3RyaW5nXG4gICAgdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yOiBzdHJpbmdcbiAgICB0cmFuc2l0aW9uU2VsZWN0b3I6IHN0cmluZ1xuICB9KSB7XG4gICAgdGhpcy5fcGV0SW1hZ2VTZWxlY3RvciA9IHBldEltYWdlU2VsZWN0b3JcbiAgICB0aGlzLl9tb3ZlbWVudENvbnRhaW5lclNlbGVjdG9yID0gbW92ZW1lbnRDb250YWluZXJTZWxlY3RvclxuICAgIHRoaXMuX3RyYW5zaXRpb25Db250YWluZXJTZWxlY3RvciA9IHRyYW5zaXRpb25Db250YWluZXJTZWxlY3RvclxuICAgIHRoaXMuX3RyYW5zaXRpb25TZWxlY3RvciA9IHRyYW5zaXRpb25TZWxlY3RvclxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEhUTUxFbGVtZW50ID0gPFQ+KGVsZW1lbnROYW1lOiBzdHJpbmcpOiBUID0+IHtcbiAgICBjb25zdCBodG1sRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnROYW1lKSBhcyB1bmtub3duXG4gICAgaWYgKCFodG1sRWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gbG9jYXRlIGVsZW1lbnQgaW4gRE9NOiAke2VsZW1lbnROYW1lfWApXG4gICAgfVxuXG4gICAgcmV0dXJuIGh0bWxFbGVtZW50IGFzIFRcbiAgfVxuXG4gIGdldE1vdmVtZW50U2VsZWN0b3IoKTogSFRNTEVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fbW92ZW1lbnRDb250YWluZXJFbGVtZW50KSB7XG4gICAgICB0aGlzLl9tb3ZlbWVudENvbnRhaW5lckVsZW1lbnQgPSB0aGlzLmdldEhUTUxFbGVtZW50PEhUTUxFbGVtZW50PihcbiAgICAgICAgdGhpcy5fbW92ZW1lbnRDb250YWluZXJTZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbW92ZW1lbnRDb250YWluZXJFbGVtZW50XG4gIH1cblxuICBnZXRQZXRJbWFnZVNlbGVjdG9yKCk6IEhUTUxJbWFnZUVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fcGV0SW1hZ2VFbGVtZW50KSB7XG4gICAgICB0aGlzLl9wZXRJbWFnZUVsZW1lbnQgPSB0aGlzLmdldEhUTUxFbGVtZW50PEhUTUxJbWFnZUVsZW1lbnQ+KFxuICAgICAgICB0aGlzLl9wZXRJbWFnZVNlbGVjdG9yXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9wZXRJbWFnZUVsZW1lbnRcbiAgfVxuXG4gIGdldFRyYW5zaXRpb25TZWxlY3RvcigpOiBIVE1MRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLl90cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudCkge1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQgPSB0aGlzLmdldEhUTUxFbGVtZW50PEhUTUxFbGVtZW50PihcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudFxuICB9XG5cbiAgZ2V0VHJhbnNpdGlvbkltYWdlU2VsZWN0b3IoKTogSFRNTEltYWdlRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLl90cmFuc2l0aW9uSW1hZ2VFbGVtZW50KSB7XG4gICAgICB0aGlzLl90cmFuc2l0aW9uSW1hZ2VFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MSW1hZ2VFbGVtZW50PihcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvblNlbGVjdG9yXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uSW1hZ2VFbGVtZW50XG4gIH1cbn1cbiIsImltcG9ydCB7IERPTSB9IGZyb20gJy4vZG9tJ1xuaW1wb3J0IHtcbiAgZ2VuZXJhdGVQZXQsXG4gIGdldFBldEFuaW1hdGlvbnMsXG4gIGdpZnMsXG4gIG11dGF0ZUxldmVsLFxuICBwZXRUeXBlcyxcbiAgcmFuZG9tUGV0TmFtZSxcbiAgcmFuZG9tUGV0VHlwZSxcbn0gZnJvbSAnLi9wZXRzJ1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN0YXRlLCBzZXRTdGF0ZSwgc3RhdGUgfSBmcm9tICcuL3N0YXRlJ1xuaW1wb3J0IHsgdHJhbnNmb3JtcyB9IGZyb20gJy4vdHJhbnNmb3JtcydcbmltcG9ydCB7XG4gIERpcmVjdGlvbixcbiAgR2lmcyxcbiAgTmV4dEZyYW1lRm4sXG4gIE5leHRGcmFtZUZuUmV0dXJuLFxuICBOZXh0RnJhbWVPcHRzLFxuICBQZXQsXG4gIFBldEFuaW1hdGlvbixcbiAgUGV0TGV2ZWwsXG4gIFBldFN0YXRlLFxuICBQZXRUeXBlLFxuICBTdGF0ZSxcbiAgVHJhbnNmb3JtcyxcbiAgVXNlclBldCxcbiAgVXNlclBldEFyZ3MsXG4gIFVzZXJQZXRCYXNlUHJvcHMsXG59IGZyb20gJy4vdHlwZXMnXG5cbi8vIEZ1bmN0aW9uIHRvIGFkanVzdCBzcGVlZCBiYXNlZCBvbiBzY2FsZVxuZXhwb3J0IGNvbnN0IGFkanVzdFNwZWVkRm9yU2NhbGUgPSAoXG4gIG9yaWdpbmFsU3BlZWQ6IG51bWJlcixcbiAgc2NhbGU6IG51bWJlclxuKTogbnVtYmVyID0+IG9yaWdpbmFsU3BlZWQgKiAoMC43ICsgMC42ICogc2NhbGUpXG5cbmV4cG9ydCB7XG4gIERpcmVjdGlvbixcbiAgRE9NLFxuICBnZW5lcmF0ZVBldCxcbiAgZ2V0UGV0QW5pbWF0aW9ucyxcbiAgZ2lmcyxcbiAgR2lmcyxcbiAgaW5pdGlhbGl6ZVN0YXRlLFxuICBtdXRhdGVMZXZlbCxcbiAgTmV4dEZyYW1lRm4sXG4gIE5leHRGcmFtZUZuUmV0dXJuLFxuICBOZXh0RnJhbWVPcHRzLFxuICBQZXQsXG4gIFBldEFuaW1hdGlvbixcbiAgUGV0TGV2ZWwsXG4gIFBldFN0YXRlLFxuICBQZXRUeXBlLFxuICBwZXRUeXBlcyxcbiAgcmFuZG9tUGV0TmFtZSxcbiAgcmFuZG9tUGV0VHlwZSxcbiAgc2V0U3RhdGUsXG4gIFN0YXRlLFxuICBzdGF0ZSxcbiAgVHJhbnNmb3JtcyxcbiAgdHJhbnNmb3JtcyxcbiAgVXNlclBldCxcbiAgVXNlclBldEFyZ3MsXG4gIFVzZXJQZXRCYXNlUHJvcHMsXG59XG4iLCJpbXBvcnQge1xuICBET00sXG4gIFBldEFuaW1hdGlvbixcbiAgVXNlclBldCxcbiAgYWRqdXN0U3BlZWRGb3JTY2FsZSxcbiAgZ2VuZXJhdGVQZXQsXG4gIGdldFBldEFuaW1hdGlvbnMsXG4gIGdpZnMsXG4gIHNldFN0YXRlLFxuICBzdGF0ZSxcbiAgdHJhbnNmb3Jtcyxcbn0gZnJvbSAnLi8nXG5pbXBvcnQgeyBpbml0aWFsaXplU3RhdGUgfSBmcm9tICcuL3N0YXRlJ1xuXG5jb25zdCBkZWZhdWx0U3RhdGUgPSB7XG4gIHVzZXJQZXQ6IGdlbmVyYXRlUGV0KHsgbmFtZTogJ3Vua25vd24nLCB0eXBlOiAndW5rbm93bicgfSksXG4gIGJhc2VQZXRVcmk6ICcnLFxufVxuXG5pbml0aWFsaXplU3RhdGUoZGVmYXVsdFN0YXRlKVxuXG5jb25zdCBkb20gPSBuZXcgRE9NKHtcbiAgbW92ZW1lbnRDb250YWluZXJTZWxlY3RvcjogJ21vdmVtZW50LWNvbnRhaW5lcicsXG4gIHBldEltYWdlU2VsZWN0b3I6ICdwZXQnLFxuICB0cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3I6ICd0cmFuc2l0aW9uLWNvbnRhaW5lcicsXG4gIHRyYW5zaXRpb25TZWxlY3RvcjogJ3RyYW5zaXRpb24nLFxufSlcblxuY29uc3QgVElDS19JTlRFUlZBTF9NUyA9IDEwMFxuXG4vLyBTdG9yZSBwbGF5ZWQgdHJhbnNpdGlvbnMgaW4gYSBsb2NhbCB2YXJpYWJsZSBvdXRzaWRlIHRoZSB0aWNrIGZ1bmN0aW9uXG5jb25zdCBwbGF5ZWRUcmFuc2l0aW9uczogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7fVxuXG5jb25zdCB0aWNrID0gKHsgdXNlclBldCB9OiB7IHVzZXJQZXQ6IFVzZXJQZXQgfSkgPT4ge1xuICBjb25zdCB7IGxlZnRQb3NpdGlvbiwgZGlyZWN0aW9uIH0gPSB0cmFuc2Zvcm1zW3VzZXJQZXQuc3RhdGVdLm5leHRGcmFtZSh7XG4gICAgY29udGFpbmVyV2lkdGg6XG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fFxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxuICAgIGxlZnRQb3NpdGlvbjogdXNlclBldC5sZWZ0UG9zaXRpb24sXG4gICAgZGlyZWN0aW9uOiB1c2VyUGV0LmRpcmVjdGlvbixcbiAgICBzcGVlZDogYWRqdXN0U3BlZWRGb3JTY2FsZSh1c2VyUGV0LnNwZWVkLCB1c2VyUGV0LnNjYWxlKSxcbiAgICBvZmZzZXQ6IGdldFBldEFuaW1hdGlvbnMoeyB1c2VyUGV0IH0pLmFuaW1hdGlvbi5vZmZzZXQgfHwgMCxcbiAgICBzY2FsZTogdXNlclBldC5zY2FsZSxcbiAgfSlcblxuICB1c2VyUGV0LmxlZnRQb3NpdGlvbiA9IGxlZnRQb3NpdGlvblxuICB1c2VyUGV0LmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuXG4gIC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9uXG4gIGNvbnN0IG1vdmVtZW50Q29udGFpbmVyID0gZG9tLmdldE1vdmVtZW50U2VsZWN0b3IoKVxuICBtb3ZlbWVudENvbnRhaW5lci5zdHlsZS5tYXJnaW5MZWZ0ID0gYCR7dXNlclBldC5sZWZ0UG9zaXRpb259cHhgXG5cbiAgY29uc3QgcGV0SW1hZ2VFbGVtZW50ID0gZG9tLmdldFBldEltYWdlU2VsZWN0b3IoKVxuICBwZXRJbWFnZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlWCgke3VzZXJQZXQuZGlyZWN0aW9ufSkgc2NhbGUoJHt1c2VyUGV0LnNjYWxlfSlgXG5cbiAgLy8gR2V0IHRoZSBwZXQgY29udGFpbmVyIGFuZCBhZGp1c3QgaXRzIHBvc2l0aW9uIHRvIGtlZXAgcGV0IG9uIHRoZSBncm91bmRcbiAgY29uc3QgcGV0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BldC1jb250YWluZXInKVxuICBpZiAocGV0Q29udGFpbmVyKSB7XG4gICAgY29uc3QgeyBhbmltYXRpb24gfSA9IGdldFBldEFuaW1hdGlvbnMoeyB1c2VyUGV0IH0pXG4gICAgY29uc3QgdmVydGljYWxBZGp1c3RtZW50ID0gKGFuaW1hdGlvbi5oZWlnaHQgKiAodXNlclBldC5zY2FsZSAtIDEpKSAvIDJcbiAgICBwZXRDb250YWluZXIuc3R5bGUuYm90dG9tID0gYCR7dmVydGljYWxBZGp1c3RtZW50fXB4YFxuICB9XG5cbiAgLy8gSGFuZGxlIHRyYW5zaXRpb24gYW5pbWF0aW9ucyB3aXRoIHRyYWNraW5nIHRvIHByZXZlbnQgcmVwZWF0aW5nXG4gIGlmICh1c2VyUGV0LmlzVHJhbnNpdGlvbkluKSB7XG4gICAgY29uc3QgdHJhbnNpdGlvbktleSA9IGAke3VzZXJQZXQubGV2ZWx9LSR7dXNlclBldC5zdGF0ZX1gXG5cbiAgICAvLyBTa2lwIGlmIHdlJ3ZlIGFscmVhZHkgcGxheWVkIHRoaXMgc3BlY2lmaWMgdHJhbnNpdGlvblxuICAgIGlmIChwbGF5ZWRUcmFuc2l0aW9uc1t0cmFuc2l0aW9uS2V5XSkge1xuICAgICAgLy8gRm9yIGVnZ3MgKGxldmVsIDAsIGlkbGUpLCBwcmVzZXJ2ZSBpc1RyYW5zaXRpb25JbiBidXQgZG9uJ3Qgc2hvdyBhbmltYXRpb24gYWdhaW5cbiAgICAgIGlmICh1c2VyUGV0LmxldmVsID09PSAwICYmIHVzZXJQZXQuc3RhdGUgPT09ICdpZGxlJykge1xuICAgICAgICAvLyBQcmVzZXJ2ZSB0aGUgZmxhZyBidXQgc2tpcCBhbmltYXRpb25cbiAgICAgICAgcmV0dXJuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igbm9uLWVnZ3MsIGNsZWFyIHRoZSBmbGFnXG4gICAgICAgIHN0YXRlLnVzZXJQZXQuaXNUcmFuc2l0aW9uSW4gPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IHRyYW5zaXRpb246IGFuaW1hdGlvbiB9ID0gZ2V0UGV0QW5pbWF0aW9ucyh7XG4gICAgICB1c2VyUGV0LFxuICAgIH0pXG5cbiAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICBjb25zdCB0cmFuc2l0aW9uQ29udGFpbmVyID0gZG9tLmdldFRyYW5zaXRpb25TZWxlY3RvcigpXG4gICAgICB0cmFuc2l0aW9uQ29udGFpbmVyLnN0eWxlLm1hcmdpbkxlZnQgPSBgJHt1c2VyUGV0LmxlZnRQb3NpdGlvbn1weGBcblxuICAgICAgLy8gQWxzbyBhZGp1c3QgdHJhbnNpdGlvbiBjb250YWluZXIgaGVpZ2h0XG4gICAgICBjb25zdCB0cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAndHJhbnNpdGlvbi1jb250YWluZXInXG4gICAgICApXG4gICAgICBpZiAodHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgdmVydGljYWxBZGp1c3RtZW50ID0gKGFuaW1hdGlvbi5oZWlnaHQgKiAodXNlclBldC5zY2FsZSAtIDEpKSAvIDJcbiAgICAgICAgdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQuc3R5bGUuYm90dG9tID0gYCR7dmVydGljYWxBZGp1c3RtZW50fXB4YFxuICAgICAgfVxuXG4gICAgICBzZXRJbWFnZSh7XG4gICAgICAgIGNvbnRhaW5lcjogZG9tLmdldFRyYW5zaXRpb25TZWxlY3RvcigpLFxuICAgICAgICBzZWxlY3RvcjogZG9tLmdldFRyYW5zaXRpb25JbWFnZVNlbGVjdG9yKCksXG4gICAgICAgIGFuaW1hdGlvbixcbiAgICAgIH0pXG5cbiAgICAgIC8vIE1hcmsgdGhpcyB0cmFuc2l0aW9uIGFzIHBsYXllZFxuICAgICAgcGxheWVkVHJhbnNpdGlvbnNbdHJhbnNpdGlvbktleV0gPSB0cnVlXG5cbiAgICAgIC8vIEZvciBub24tZWdncywgY2xlYXIgdGhlIHRyYW5zaXRpb24gZmxhZ1xuICAgICAgaWYgKCEodXNlclBldC5sZXZlbCA9PT0gMCAmJiB1c2VyUGV0LnN0YXRlID09PSAnaWRsZScpKSB7XG4gICAgICAgIHN0YXRlLnVzZXJQZXQuaXNUcmFuc2l0aW9uSW4gPSBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBzZXRJbWFnZSA9ICh7XG4gIGNvbnRhaW5lcixcbiAgc2VsZWN0b3IsXG4gIGFuaW1hdGlvbixcbn06IHtcbiAgY29udGFpbmVyOiBIVE1MRWxlbWVudFxuICBzZWxlY3RvcjogSFRNTEltYWdlRWxlbWVudFxuICBhbmltYXRpb246IFBldEFuaW1hdGlvblxufSkgPT4ge1xuICBjb25zdCB7IGJhc2VQZXRVcmksIHVzZXJQZXQgfSA9IHN0YXRlXG5cbiAgc2VsZWN0b3Iuc3JjID0gYCR7YmFzZVBldFVyaX0vJHtnaWZzW2FuaW1hdGlvbi5naWZdfWBcbiAgc2VsZWN0b3Iud2lkdGggPSBhbmltYXRpb24ud2lkdGhcbiAgc2VsZWN0b3Iuc3R5bGUubWluV2lkdGggPSBgJHthbmltYXRpb24ud2lkdGh9cHhgXG4gIHNlbGVjdG9yLmhlaWdodCA9IGFuaW1hdGlvbi5oZWlnaHRcblxuICAvLyBGb3IgcGV0IGltYWdlLCB3ZSBuZWVkIHRvIG1haW50YWluIHNjYWxlWCBmb3IgZGlyZWN0aW9uXG4gIGlmIChzZWxlY3RvciA9PT0gZG9tLmdldFBldEltYWdlU2VsZWN0b3IoKSkge1xuICAgIHNlbGVjdG9yLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZVgoJHt1c2VyUGV0LmRpcmVjdGlvbn0pIHNjYWxlKCR7dXNlclBldC5zY2FsZX0pYFxuICB9IGVsc2Uge1xuICAgIC8vIEZvciB0cmFuc2l0aW9uIGltYWdlcywganVzdCBhcHBseSB0aGUgc2NhbGVcbiAgICBzZWxlY3Rvci5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHt1c2VyUGV0LnNjYWxlfSlgXG4gIH1cblxuICBjb250YWluZXIuc3R5bGUubGVmdCA9IGAke2FuaW1hdGlvbi5vZmZzZXQgPz8gMH1weGBcbn1cblxuY29uc3Qgc2xlZXAgPSAobXM6IG51bWJlcikgPT4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgbXMpKVxuXG5jb25zdCBzdGFydEFuaW1hdGlvbiA9ICgpID0+IHtcbiAgY29uc3QgeyB1c2VyUGV0IH0gPSBzdGF0ZVxuICBpZiAoc3RhdGUuaW50ZXJ2YWxJZCkge1xuICAgIGNsZWFySW50ZXJ2YWwoc3RhdGUuaW50ZXJ2YWxJZClcbiAgfVxuICBjb25zdCBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIHRpY2soeyB1c2VyUGV0IH0pXG4gIH0sIFRJQ0tfSU5URVJWQUxfTVMpXG4gIHNldFN0YXRlKCdpbnRlcnZhbElkJywgaW50ZXJ2YWxJZClcbn1cblxuZXhwb3J0IGNvbnN0IGFkZFBldFRvUGFuZWwgPSBhc3luYyAoeyB1c2VyUGV0IH06IHsgdXNlclBldDogVXNlclBldCB9KSA9PiB7XG4gIGNvbnN0IHsgYW5pbWF0aW9uIH0gPSBnZXRQZXRBbmltYXRpb25zKHtcbiAgICB1c2VyUGV0LFxuICB9KVxuXG4gIC8vIFN0b3JlIHRoZSBvcmlnaW5hbCBzcGVlZCBpZiBpdCdzIG5vdCBhbHJlYWR5IHNldFxuICBpZiAoIXVzZXJQZXQub3JpZ2luYWxTcGVlZCAmJiBhbmltYXRpb24uc3BlZWQpIHtcbiAgICB1c2VyUGV0Lm9yaWdpbmFsU3BlZWQgPSBhbmltYXRpb24uc3BlZWRcbiAgfVxuXG4gIGlmICh1c2VyUGV0Lm9yaWdpbmFsU3BlZWQpIHtcbiAgICB1c2VyUGV0LnNwZWVkID0gYWRqdXN0U3BlZWRGb3JTY2FsZSh1c2VyUGV0Lm9yaWdpbmFsU3BlZWQsIHVzZXJQZXQuc2NhbGUpXG4gIH1cblxuICAvLyBJZiB0aGlzIGlzIGEgbmV3IGVnZyAobGV2ZWwgMCksIHJlc2V0IHRyYW5zaXRpb24gdHJhY2tpbmdcbiAgaWYgKFxuICAgIHVzZXJQZXQubGV2ZWwgPT09IDAgJiZcbiAgICB1c2VyUGV0LnN0YXRlID09PSAnaWRsZScgJiZcbiAgICB1c2VyUGV0LmlzVHJhbnNpdGlvbkluXG4gICkge1xuICAgIC8vIENsZWFyIGhpc3RvcnkgZm9yIG5ldyBlZ2dzIHRvIGVuc3VyZSB0cmFuc2l0aW9uIHBsYXlzXG4gICAgY29uc3QgZWdnS2V5ID0gYDAtaWRsZWBcbiAgICBkZWxldGUgcGxheWVkVHJhbnNpdGlvbnNbZWdnS2V5XVxuICB9XG5cbiAgLy8gTkVWRVIgbW9kaWZ5IGlzVHJhbnNpdGlvbkluIC0gcmVzcGVjdCB3aGF0ZXZlciB2YWx1ZSB3YXMgcGFzc2VkIGluXG4gIC8vIFRoaXMgaXMgY3JpdGljYWwgZm9yIHByZXNlcnZpbmcgZWdnIHN0YXRlIGNvcnJlY3RseVxuXG4gIC8vIFNldCB0aGUgc3RhdGUgd2l0aCB0aGUgcGV0IGFzLWlzXG4gIHNldFN0YXRlKCd1c2VyUGV0JywgdXNlclBldClcblxuICBzdGFydEFuaW1hdGlvbigpXG5cbiAgLy8gR2l2ZSB0aGUgdHJhbnNpdGlvbiBhIGNoYW5jZSB0byBwbGF5XG4gIGF3YWl0IHNsZWVwKFRJQ0tfSU5URVJWQUxfTVMgKiAyKVxuXG4gIHNldEltYWdlKHtcbiAgICBzZWxlY3RvcjogZG9tLmdldFBldEltYWdlU2VsZWN0b3IoKSxcbiAgICBhbmltYXRpb24sXG4gICAgY29udGFpbmVyOiBkb20uZ2V0TW92ZW1lbnRTZWxlY3RvcigpLFxuICB9KVxuXG4gIC8vIEFwcGx5IHZlcnRpY2FsIHBvc2l0aW9uIGFkanVzdG1lbnQgZm9yIHRoZSBwZXQgY29udGFpbmVyXG4gIGNvbnN0IHBldENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZXQtY29udGFpbmVyJylcbiAgaWYgKHBldENvbnRhaW5lcikge1xuICAgIGNvbnN0IHZlcnRpY2FsQWRqdXN0bWVudCA9IChhbmltYXRpb24uaGVpZ2h0ICogKHVzZXJQZXQuc2NhbGUgLSAxKSkgLyAyXG4gICAgcGV0Q29udGFpbmVyLnN0eWxlLmJvdHRvbSA9IGAke3ZlcnRpY2FsQWRqdXN0bWVudH1weGBcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgYXBwID0gKHtcbiAgdXNlclBldCxcbiAgYmFzZVBldFVyaSxcbn06IHtcbiAgdXNlclBldDogVXNlclBldFxuICBiYXNlUGV0VXJpOiBzdHJpbmdcbn0pID0+IHtcbiAgc2V0U3RhdGUoJ2Jhc2VQZXRVcmknLCBiYXNlUGV0VXJpKVxuXG4gIGlmICh1c2VyUGV0KSB7XG4gICAgLy8gUGFzcyB0aGUgcGV0IG9iamVjdCBleGFjdGx5IGFzIHJlY2VpdmVkXG4gICAgYWRkUGV0VG9QYW5lbCh7IHVzZXJQZXQgfSlcbiAgfVxuXG4gIC8vIFRyYWNrIGRvY3VtZW50IHZpc2liaWxpdHkgY2hhbmdlcyB0byByZXNldCB0cmFuc2l0aW9ucyB3aGVuIHRhYiBiZWNvbWVzIHZpc2libGVcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsICgpID0+IHtcbiAgICBpZiAoIWRvY3VtZW50LmhpZGRlbikge1xuICAgICAgLy8gUmVzZXQgdHJhbnNpdGlvbnMgd2hlbiB0aGUgdGFiIGJlY29tZXMgdmlzaWJsZSBhZ2FpblxuICAgICAgLy8gVGhpcyBoZWxwcyB3aXRoIHRoZSBjYXNlIHdoZXJlIHRoZSB1c2VyIHN3aXRjaGVzIGF3YXkgYW5kIGJhY2tcbiAgICAgIE9iamVjdC5rZXlzKHBsYXllZFRyYW5zaXRpb25zKS5mb3JFYWNoKFxuICAgICAgICAoa2V5KSA9PiBkZWxldGUgcGxheWVkVHJhbnNpdGlvbnNba2V5XVxuICAgICAgKVxuICAgIH1cbiAgfSlcblxuICAvLyBIYW5kbGUgbWVzc2FnZXMgc2VudCBmcm9tIHRoZSBleHRlbnNpb24gdG8gdGhlIHdlYnZpZXdcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IGNvbW1hbmQsIGRhdGEgfSA9IGV2ZW50LmRhdGEgLy8gVGhlIGRhdGEgdGhhdCB0aGUgZXh0ZW5zaW9uIHNlbnRcbiAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICAgIGNhc2UgJ3NwYXduLXBldCc6XG4gICAgICAgIC8vIENsZWFyIHBsYXllZCB0cmFuc2l0aW9ucyB3aGVuIHNwYXduaW5nIGEgbmV3IHBldFxuICAgICAgICBPYmplY3Qua2V5cyhwbGF5ZWRUcmFuc2l0aW9ucykuZm9yRWFjaChcbiAgICAgICAgICAoa2V5KSA9PiBkZWxldGUgcGxheWVkVHJhbnNpdGlvbnNba2V5XVxuICAgICAgICApXG5cbiAgICAgICAgLy8gRm9yIHNwYXduLXBldCwgYWx3YXlzIHN0YXJ0IGZyZXNoXG4gICAgICAgIGFkZFBldFRvUGFuZWwoeyB1c2VyUGV0OiBkYXRhLnVzZXJQZXQgfSlcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAndXBkYXRlLXBldCc6XG4gICAgICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBzaWduaWZpY2FudCBzdGF0ZSBjaGFuZ2UgKGxpa2UgbGV2ZWwgb3IgcGV0IHR5cGUpXG4gICAgICAgIGNvbnN0IGlzTmV3UGV0ID1cbiAgICAgICAgICAhc3RhdGUudXNlclBldCB8fFxuICAgICAgICAgIHN0YXRlLnVzZXJQZXQudHlwZSAhPT0gZGF0YS51c2VyUGV0LnR5cGUgfHxcbiAgICAgICAgICBzdGF0ZS51c2VyUGV0Lm5hbWUgIT09IGRhdGEudXNlclBldC5uYW1lXG5cbiAgICAgICAgY29uc3QgaXNMZXZlbENoYW5nZSA9XG4gICAgICAgICAgc3RhdGUudXNlclBldCAmJiBzdGF0ZS51c2VyUGV0LmxldmVsICE9PSBkYXRhLnVzZXJQZXQubGV2ZWxcblxuICAgICAgICAvLyBSZXNldCB0cmFuc2l0aW9uIHRyYWNraW5nIGZvciBzaWduaWZpY2FudCBjaGFuZ2VzXG4gICAgICAgIGlmIChpc05ld1BldCB8fCBpc0xldmVsQ2hhbmdlIHx8IGRhdGEudXNlclBldC5pc1RyYW5zaXRpb25Jbikge1xuICAgICAgICAgIE9iamVjdC5rZXlzKHBsYXllZFRyYW5zaXRpb25zKS5mb3JFYWNoKFxuICAgICAgICAgICAgKGtleSkgPT4gZGVsZXRlIHBsYXllZFRyYW5zaXRpb25zW2tleV1cbiAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcmVzZXJ2ZSBwb3NpdGlvbiBhbmQgZGlyZWN0aW9uIGJ1dCB1c2UgYWxsIG90aGVyIHByb3BlcnRpZXMgZnJvbSB0aGUgdXBkYXRlXG4gICAgICAgIC8vIFRoaXMgaXMgY3JpdGljYWwgZm9yIHByZXNlcnZpbmcgdGhlIGVnZy9oYXRjaGVkIHN0YXRlIHdoZW4gc3dpdGNoaW5nIHZpZXdzXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRQZXQgPSB7XG4gICAgICAgICAgLi4uZGF0YS51c2VyUGV0LFxuICAgICAgICAgIGxlZnRQb3NpdGlvbjpcbiAgICAgICAgICAgIHN0YXRlLnVzZXJQZXQ/LmxlZnRQb3NpdGlvbiB8fCBkYXRhLnVzZXJQZXQubGVmdFBvc2l0aW9uLFxuICAgICAgICAgIGRpcmVjdGlvbjogc3RhdGUudXNlclBldD8uZGlyZWN0aW9uIHx8IGRhdGEudXNlclBldC5kaXJlY3Rpb24sXG4gICAgICAgIH1cbiAgICAgICAgYWRkUGV0VG9QYW5lbCh7IHVzZXJQZXQ6IHVwZGF0ZWRQZXQgfSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH0pXG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3Rpb24sXG4gIEdpZnMsXG4gIFBldCxcbiAgUGV0QW5pbWF0aW9uLFxuICBQZXRMZXZlbCxcbiAgUGV0VHlwZSxcbiAgVXNlclBldCxcbiAgVXNlclBldEFyZ3MsXG59IGZyb20gJy4vJ1xuXG5leHBvcnQgY29uc3QgZ2lmczogR2lmcyA9IHtcbiAgZWdnMTogJ2VnZzEuZ2lmJyxcbiAgZHVzdDE6ICdkdXN0MS5naWYnLFxuICBkdXN0MjogJ2R1c3QyLmdpZicsXG4gIG1vbnN0ZXIxcGhhc2UxOiAnbTFkMS5naWYnLFxuICBtb25zdGVyMXBoYXNlMjogJ20xZDIuZ2lmJyxcbiAgbW9uc3RlcjFwaGFzZTM6ICdtMWQzLmdpZicsXG4gIG1vbnN0ZXIycGhhc2UxOiAnbTJkMS5naWYnLFxuICBtb25zdGVyMnBoYXNlMjogJ20yZDIuZ2lmJyxcbiAgbW9uc3RlcjJwaGFzZTM6ICdtMmQzLmdpZicsXG4gIG1vbnN0ZXIzcGhhc2UxOiAnbTNkMS5naWYnLFxuICBtb25zdGVyM3BoYXNlMjogJ20zZDIuZ2lmJyxcbiAgbW9uc3RlcjNwaGFzZTM6ICdtM2QzLmdpZicsXG4gIG1vbnN0ZXI0cGhhc2UxOiAnbTRkMS5naWYnLFxuICBtb25zdGVyNHBoYXNlMjogJ200ZDIuZ2lmJyxcbiAgbW9uc3RlcjRwaGFzZTM6ICdtNGQzLmdpZicsXG4gIG1vbnN0ZXI1cGhhc2UxOiAnbTVkMS5naWYnLFxuICBtb25zdGVyNXBoYXNlMjogJ201ZDIuZ2lmJyxcbiAgbW9uc3RlcjVwaGFzZTM6ICdtNWQzLmdpZicsXG59XG5cbmV4cG9ydCBjb25zdCBwZXROYW1lcyA9IFtcbiAgJ2JvbycsXG4gICduYWNobycsXG4gICdnYXJ5JyxcbiAgJ2Z1ZGdlJyxcbiAgJ25la28nLFxuICAncGlwJyxcbiAgJ2JpYm8nLFxuICAnZmlmaScsXG4gICdqYXgnLFxuICAnYm9iYmEnLFxuICAnZ2lkZ2V0JyxcbiAgJ21pbmEnLFxuICAnY3J1bWInLFxuICAnemltYm8nLFxuICAnZHVzdHknLFxuICAnYnJvY2snLFxuICAnb3RpcycsXG4gICdtYXJ2aW4nLFxuICAnc21va2V5JyxcbiAgJ2JhcnJ5JyxcbiAgJ3RvbnknLFxuICAnZHVzdHknLFxuICAnbW9jaGknLFxuXVxuXG5jb25zdCBhbmltYXRpb25EZWZhdWx0cyA9IHtcbiAgd2lkdGg6IDc1LFxuICBoZWlnaHQ6IDY0LFxuICBzcGVlZDogMCxcbiAgb2Zmc2V0OiAwLFxufVxuXG5jb25zdCBlZ2c6IFBldExldmVsID0ge1xuICB4cDogMCxcbiAgZGVmYXVsdFN0YXRlOiAnaWRsZScsXG4gIGFuaW1hdGlvbnM6IHtcbiAgICBpZGxlOiB7XG4gICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgIGdpZjogJ2VnZzEnLFxuICAgIH0sXG4gICAgdHJhbnNpdGlvbjoge1xuICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICBnaWY6ICdkdXN0MScsXG4gICAgICBvZmZzZXQ6IC0xMyxcbiAgICAgIHdpZHRoOiAxMDAsXG4gICAgICBoZWlnaHQ6IDEwMCxcbiAgICB9LFxuICB9LFxufVxuXG4vLyBHZW5lcmljIGV2b2x1dGlvbiB0cmFuc2l0aW9uXG5jb25zdCB0cmFuc2l0aW9uOiBQZXRBbmltYXRpb24gPSB7XG4gIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICBnaWY6ICdkdXN0MicsXG4gIG9mZnNldDogLTkyLFxuICB3aWR0aDogMjgwLFxuICBoZWlnaHQ6IDEwMCxcbn1cblxuZXhwb3J0IGNvbnN0IHBldFR5cGVzID0gbmV3IE1hcDxzdHJpbmcsIFBldD4oW1xuICBbXG4gICAgJ21vbnN0ZXIxJyxcbiAgICB7XG4gICAgICBsZXZlbHM6IG5ldyBNYXAoW1xuICAgICAgICBbMCwgZWdnXSxcbiAgICAgICAgW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDM1LFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMXBoYXNlMScsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAxNTAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIxcGhhc2UyJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDI0MDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjFwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyMicsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjJwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDEwMDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjJwaGFzZTInLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDYwMDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjJwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF0pLFxuICAgIH0sXG4gIF0sXG4gIFtcbiAgICAnbW9uc3RlcjMnLFxuICAgIHtcbiAgICAgIGxldmVsczogbmV3IE1hcChbXG4gICAgICAgIFswLCBlZ2ddLFxuICAgICAgICBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMzUsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIzcGhhc2UxJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDEsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA1OTk5MDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIzcGhhc2UyJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA2MDAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIzcGhhc2UzJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuICBbXG4gICAgJ21vbnN0ZXI0JyxcbiAgICB7XG4gICAgICBsZXZlbHM6IG5ldyBNYXAoW1xuICAgICAgICBbMCwgZWdnXSxcbiAgICAgICAgW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDM1LFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNHBoYXNlMScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMTUwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNHBoYXNlMicsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMjQwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNHBoYXNlMycsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAzLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyNScsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjVwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDY2LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMTUwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNXBoYXNlMicsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDI0MDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjVwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTM1LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMjUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuXSlcblxuZXhwb3J0IGNvbnN0IHJhbmRvbVBldFR5cGUgPSAoKTogUGV0VHlwZSA9PlxuICBBcnJheS5mcm9tKHBldFR5cGVzLmtleXMoKSlbXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGV0VHlwZXMuc2l6ZSlcbiAgXSBhcyBQZXRUeXBlXG5cbmV4cG9ydCBjb25zdCByYW5kb21QZXROYW1lID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IG5hbWUgPSBwZXROYW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwZXROYW1lcy5sZW5ndGgpXVxuICByZXR1cm4gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0UGV0QW5pbWF0aW9ucyA9ICh7XG4gIHVzZXJQZXQsXG59OiB7XG4gIHVzZXJQZXQ6IFVzZXJQZXRcbn0pOiB7XG4gIGFuaW1hdGlvbjogUGV0QW5pbWF0aW9uXG4gIHRyYW5zaXRpb246IFBldEFuaW1hdGlvbiB8IHVuZGVmaW5lZFxufSA9PiB7XG4gIGNvbnN0IHBldFR5cGVGb3VuZCA9IHBldFR5cGVzLmdldCh1c2VyUGV0LnR5cGUpXG4gIGlmICghcGV0VHlwZUZvdW5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBQZXQgdHlwZSBub3QgZm91bmQ6ICR7dXNlclBldC50eXBlfWApXG4gIH1cblxuICBjb25zdCBsZXZlbEZvdW5kID0gcGV0VHlwZUZvdW5kLmxldmVscy5nZXQodXNlclBldC5sZXZlbClcbiAgaWYgKCFsZXZlbEZvdW5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYFBldCBsZXZlbCBub3QgZm91bmQgZm9yIHBldCB0eXBlICR7dXNlclBldC50eXBlfTogJHt1c2VyUGV0LmxldmVsfWBcbiAgICApXG4gIH1cblxuICBpZiAoISh1c2VyUGV0LnN0YXRlIGluIGxldmVsRm91bmQuYW5pbWF0aW9ucykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgQW5pbWF0aW9uIG5vdCBmb3VuZCBmb3IgcGV0IHR5cGUgJHt1c2VyUGV0LnR5cGV9LCBsZXZlbCAke3VzZXJQZXQubGV2ZWx9OiAke3VzZXJQZXQuc3RhdGV9YFxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHRyYW5zaXRpb24gPVxuICAgICd0cmFuc2l0aW9uJyBpbiBsZXZlbEZvdW5kLmFuaW1hdGlvbnNcbiAgICAgID8gbGV2ZWxGb3VuZC5hbmltYXRpb25zLnRyYW5zaXRpb25cbiAgICAgIDogdW5kZWZpbmVkXG5cbiAgcmV0dXJuIHtcbiAgICBhbmltYXRpb246IGxldmVsRm91bmQuYW5pbWF0aW9uc1t1c2VyUGV0LnN0YXRlXSxcbiAgICB0cmFuc2l0aW9uLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVBldCA9ICh7IG5hbWUsIHR5cGUgfTogVXNlclBldEFyZ3MpOiBVc2VyUGV0ID0+ICh7XG4gIGxlZnRQb3NpdGlvbjogMCxcbiAgc3BlZWQ6IDAsXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uLnJpZ2h0LFxuICBsZXZlbDogMCxcbiAgeHA6IDAsXG4gIC8vIEFsbCBsZXZlbCAwIGNoYXJhY3RlcnMgcmVxdWlyZSB0aGlzIHN0YXRlXG4gIHN0YXRlOiAnaWRsZScsXG4gIGlzVHJhbnNpdGlvbkluOiB0cnVlLFxuICBuYW1lLFxuICB0eXBlLFxuICBzY2FsZTogMSxcbn0pXG5cbmV4cG9ydCBjb25zdCBnZXRMZXZlbCA9ICh7XG4gIHBldFR5cGUsXG4gIGxldmVsLFxufToge1xuICBwZXRUeXBlOiBQZXRUeXBlXG4gIGxldmVsOiBudW1iZXJcbn0pID0+IHtcbiAgY29uc3QgcGV0VHlwZUZvdW5kID0gcGV0VHlwZXMuZ2V0KHBldFR5cGUpXG4gIGlmICghcGV0VHlwZUZvdW5kKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cbiAgY29uc3QgbGV2ZWxGb3VuZCA9IHBldFR5cGVGb3VuZC5sZXZlbHMuZ2V0KGxldmVsKVxuICBpZiAoIWxldmVsRm91bmQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICByZXR1cm4gbGV2ZWxGb3VuZFxufVxuXG5leHBvcnQgY29uc3QgbXV0YXRlTGV2ZWwgPSAoeyB1c2VyUGV0IH06IHsgdXNlclBldDogVXNlclBldCB9KSA9PiB7XG4gIGNvbnN0IG5leHRMZXZlbEZvdW5kID0gZ2V0TGV2ZWwoe1xuICAgIHBldFR5cGU6IHVzZXJQZXQudHlwZSxcbiAgICBsZXZlbDogdXNlclBldC5sZXZlbCArIDEsXG4gIH0pXG5cbiAgaWYgKCFuZXh0TGV2ZWxGb3VuZCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHVzZXJQZXQueHAgPj0gbmV4dExldmVsRm91bmQueHApIHtcbiAgICAvLyBSZWNvcmQgdGhlIHByZXZpb3VzIGxldmVsIHRvIGRldGVjdCBhY3R1YWwgbGV2ZWwgdXBcbiAgICBjb25zdCBwcmV2aW91c0xldmVsID0gdXNlclBldC5sZXZlbFxuXG4gICAgdXNlclBldC5sZXZlbCArPSAxXG4gICAgdXNlclBldC54cCA9IDBcbiAgICB1c2VyUGV0LnN0YXRlID0gbmV4dExldmVsRm91bmQuZGVmYXVsdFN0YXRlXG4gICAgdXNlclBldC5zcGVlZCA9IG5leHRMZXZlbEZvdW5kLmFuaW1hdGlvbnNbdXNlclBldC5zdGF0ZV0uc3BlZWQgfHwgMFxuXG4gICAgLy8gT25seSBzZXQgdHJhbnNpdGlvbiBmbGFnIHdoZW4gdGhlcmUncyBhbiBhY3R1YWwgbGV2ZWwgY2hhbmdlXG4gICAgaWYgKHVzZXJQZXQubGV2ZWwgIT09IHByZXZpb3VzTGV2ZWwpIHtcbiAgICAgIHVzZXJQZXQuaXNUcmFuc2l0aW9uSW4gPSB0cnVlXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTdGF0ZSB9IGZyb20gJy4vJ1xuXG5leHBvcnQgbGV0IHN0YXRlOiBTdGF0ZVxuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZVN0YXRlID0gKGluaXRpYWxTdGF0ZTogU3RhdGUpID0+IChzdGF0ZSA9IGluaXRpYWxTdGF0ZSlcblxuZXhwb3J0IGNvbnN0IHNldFN0YXRlID0gPEsgZXh0ZW5kcyBrZXlvZiBTdGF0ZT4oa2V5OiBLLCB2YWx1ZTogU3RhdGVbS10pID0+XG4gIChzdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBba2V5XTogdmFsdWUsXG4gIH0pXG4iLCJpbXBvcnQgeyBUcmFuc2Zvcm1zLCBOZXh0RnJhbWVPcHRzLCBEaXJlY3Rpb24gfSBmcm9tICcuLydcblxuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybXM6IFRyYW5zZm9ybXMgPSB7XG4gIGlkbGU6IHtcbiAgICBuZXh0RnJhbWU6ICh7IGRpcmVjdGlvbiwgb2Zmc2V0LCBzY2FsZSB9OiBOZXh0RnJhbWVPcHRzKSA9PiAoe1xuICAgICAgZGlyZWN0aW9uLFxuICAgICAgbGVmdFBvc2l0aW9uOiBvZmZzZXQsXG4gICAgICBzY2FsZSxcbiAgICB9KSxcbiAgfSxcbiAgd2Fsa2luZzoge1xuICAgIG5leHRGcmFtZTogKHtcbiAgICAgIGNvbnRhaW5lcldpZHRoLFxuICAgICAgbGVmdFBvc2l0aW9uOiBvbGRMZWZ0UG9zaXRpb24sXG4gICAgICBkaXJlY3Rpb246IG9sZERpcmVjdGlvbixcbiAgICAgIHNwZWVkLFxuICAgICAgc2NhbGUsXG4gICAgfTogLy8gb2Zmc2V0LFxuICAgIE5leHRGcmFtZU9wdHMpID0+IHtcbiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9XG4gICAgICAgIG9sZExlZnRQb3NpdGlvbiA+PSBjb250YWluZXJXaWR0aCAtIHNwZWVkIC0gMTUwXG4gICAgICAgICAgPyBEaXJlY3Rpb24ubGVmdFxuICAgICAgICAgIDogb2xkTGVmdFBvc2l0aW9uIDw9IDAgKyBzcGVlZFxuICAgICAgICAgID8gRGlyZWN0aW9uLnJpZ2h0XG4gICAgICAgICAgOiBvbGREaXJlY3Rpb25cblxuICAgICAgY29uc3QgbGVmdFBvc2l0aW9uID1cbiAgICAgICAgZGlyZWN0aW9uID09PSBEaXJlY3Rpb24ucmlnaHRcbiAgICAgICAgICA/IG9sZExlZnRQb3NpdGlvbiArIHNwZWVkXG4gICAgICAgICAgOiBvbGRMZWZ0UG9zaXRpb24gLSBzcGVlZFxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgIGxlZnRQb3NpdGlvbixcbiAgICAgICAgc2NhbGUsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn1cbiIsImV4cG9ydCB0eXBlIFN0YXRlID0ge1xuICB1c2VyUGV0OiBVc2VyUGV0XG4gIGJhc2VQZXRVcmk6IHN0cmluZ1xuICBpbnRlcnZhbElkPzogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWRcbn1cblxuZXhwb3J0IHR5cGUgR2lmcyA9IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9XG5cbmV4cG9ydCB0eXBlIFBldFN0YXRlID0gJ3dhbGtpbmcnIHwgJ2lkbGUnIHwgJ3RyYW5zaXRpb24nXG5cbmV4cG9ydCB0eXBlIFBldEFuaW1hdGlvbiA9IHtcbiAgZ2lmOiBzdHJpbmdcbiAgd2lkdGg6IG51bWJlclxuICBoZWlnaHQ6IG51bWJlclxuICBvZmZzZXQ/OiBudW1iZXJcbiAgc3BlZWQ/OiBudW1iZXJcbiAgZHVyYXRpb24/OiBudW1iZXJcbn1cblxuZXhwb3J0IHR5cGUgUGV0TGV2ZWwgPSB7XG4gIHhwOiBudW1iZXJcbiAgZGVmYXVsdFN0YXRlOiBQZXRTdGF0ZVxuICBhbmltYXRpb25zOiB7XG4gICAgW25hbWU6IHN0cmluZ106IFBldEFuaW1hdGlvblxuICB9XG59XG5cbmV4cG9ydCB0eXBlIFBldCA9IHtcbiAgbGV2ZWxzOiBNYXA8bnVtYmVyLCBQZXRMZXZlbD5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBVc2VyUGV0QmFzZVByb3BzIHtcbiAgbGVmdFBvc2l0aW9uOiBudW1iZXJcbiAgc3BlZWQ6IG51bWJlclxuICBvcmlnaW5hbFNwZWVkPzogbnVtYmVyXG4gIGRpcmVjdGlvbjogbnVtYmVyXG4gIGxldmVsOiBudW1iZXJcbiAgeHA6IG51bWJlclxuICBzdGF0ZTogUGV0U3RhdGVcbiAgaXNUcmFuc2l0aW9uSW46IGJvb2xlYW5cbiAgc2NhbGU6IG51bWJlclxufVxuXG5leHBvcnQgdHlwZSBQZXRUeXBlID0gJ21vbnN0ZXIxJyB8ICdtb25zdGVyMicgfCAndW5rbm93bidcblxuZXhwb3J0IGludGVyZmFjZSBVc2VyUGV0QXJncyB7XG4gIG5hbWU6IHN0cmluZ1xuICB0eXBlOiBQZXRUeXBlXG59XG5cbmV4cG9ydCB0eXBlIFVzZXJQZXQgPSBVc2VyUGV0QmFzZVByb3BzICYgVXNlclBldEFyZ3NcblxuZXhwb3J0IGVudW0gRGlyZWN0aW9uIHtcbiAgcmlnaHQgPSAxLFxuICBsZWZ0ID0gLTEsXG59XG5cbmV4cG9ydCB0eXBlIE5leHRGcmFtZU9wdHMgPSB7XG4gIGNvbnRhaW5lcldpZHRoOiBudW1iZXJcbiAgbGVmdFBvc2l0aW9uOiBudW1iZXJcbiAgZGlyZWN0aW9uOiBudW1iZXJcbiAgc3BlZWQ6IG51bWJlclxuICBvZmZzZXQ6IG51bWJlclxuICBzY2FsZTogbnVtYmVyXG59XG5cbmV4cG9ydCB0eXBlIE5leHRGcmFtZUZuUmV0dXJuID0ge1xuICBsZWZ0UG9zaXRpb246IG51bWJlclxuICBkaXJlY3Rpb246IG51bWJlclxuICBuZXdQZXRTdGF0ZT86IFBldFN0YXRlXG59XG5cbmV4cG9ydCB0eXBlIE5leHRGcmFtZUZuID0gKG9wdHM6IE5leHRGcmFtZU9wdHMpID0+IE5leHRGcmFtZUZuUmV0dXJuXG5cbmV4cG9ydCB0eXBlIFRyYW5zZm9ybXMgPSB7XG4gIFt0cmFuc2Zvcm06IHN0cmluZ106IHtcbiAgICBuZXh0RnJhbWU6IE5leHRGcmFtZUZuXG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wYW5lbC9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
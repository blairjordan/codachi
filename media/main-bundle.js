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
const _2 = __webpack_require__(/*! ./ */ "./src/panel/index.ts");
const state_1 = __webpack_require__(/*! ./state */ "./src/panel/state.ts");
const defaultState = {
    userPet: (0, _2.generatePet)({ name: 'unknown', type: 'unknown' }),
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
const tick = ({ userPet }) => {
    const { leftPosition, direction } = _2.transforms[userPet.state].nextFrame({
        containerWidth: window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth,
        leftPosition: userPet.leftPosition,
        direction: userPet.direction,
        speed: (0, _2.adjustSpeedForScale)(userPet.speed, userPet.scale),
        offset: (0, _2.getPetAnimations)({ userPet }).animation.offset || 0,
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
        const { animation } = (0, _2.getPetAnimations)({ userPet });
        const verticalAdjustment = (animation.height * (userPet.scale - 1)) / 2;
        petContainer.style.bottom = `${verticalAdjustment}px`;
    }
    // We're not going to touch isTransitionIn here - we'll only handle it in specific events
};
// Explicitly handle transitions for specific events
const handleTransition = (userPet) => {
    if (!userPet.isTransitionIn)
        return;
    const { transition: animation } = (0, _2.getPetAnimations)({
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
        // Clear the transition flag after handling it
        _2.state.userPet.isTransitionIn = false;
    }
};
const setImage = ({ container, selector, animation, }) => {
    var _a;
    const { basePetUri, userPet } = _2.state;
    selector.src = `${basePetUri}/${_2.gifs[animation.gif]}`;
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
    const { userPet } = _2.state;
    if (_2.state.intervalId) {
        clearInterval(_2.state.intervalId);
    }
    const intervalId = setInterval(() => {
        tick({ userPet });
    }, TICK_INTERVAL_MS);
    (0, _2.setState)('intervalId', intervalId);
};
const addPetToPanel = ({ userPet, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { animation } = (0, _2.getPetAnimations)({
        userPet,
    });
    // Store the original speed if it's not already set
    if (!userPet.originalSpeed && animation.speed) {
        userPet.originalSpeed = animation.speed;
    }
    if (userPet.originalSpeed) {
        userPet.speed = (0, _2.adjustSpeedForScale)(userPet.originalSpeed, userPet.scale);
    }
    // Update the state
    (0, _2.setState)('userPet', userPet);
    // Handle transition if needed (but only once)
    if (userPet.isTransitionIn) {
        handleTransition(userPet);
    }
    // Start the animation loop
    startAnimation();
    // Give everything a chance to render
    yield sleep(TICK_INTERVAL_MS * 2);
    // Set the main pet image
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
    (0, _2.setState)('basePetUri', basePetUri);
    // Expose petTypes to the window for XP bar calculations
    window.codachiApp = window.codachiApp || {};
    window.codachiApp.petTypes = _2.petTypes;
    if (userPet) {
        // Handle initial state
        (0, exports.addPetToPanel)({ userPet });
    }
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', (event) => {
        const { command, data } = event.data; // The data that the extension sent
        switch (command) {
            case 'spawn-pet':
                // New pet creation - always show transition
                (0, exports.addPetToPanel)({ userPet: data.userPet });
                break;
            case 'update-pet': {
                // If this is just an XP update, only update the XP value
                if (data.isXPUpdate && _2.state.userPet) {
                    _2.state.userPet.xp = data.userPet.xp;
                    return;
                }
                // For level changes or state changes, do a full refresh
                const updatedPet = Object.assign(Object.assign({}, data.userPet), { leftPosition: _2.state.userPet.leftPosition, direction: _2.state.userPet.direction });
                // We want transitions to work for level changes
                (0, exports.addPetToPanel)({ userPet: updatedPet });
                break;
            }
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
    monster6phase1: 'm6d1.gif',
    monster6phase2: 'm6d2.gif',
    monster6phase3: 'm6d3.gif',
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
const transition = Object.assign(Object.assign({}, animationDefaults), { gif: 'dust2', offset: -95, width: 280, height: 100 });
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
    [
        'monster6',
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster6phase1', width: 64, height: 64, speed: 2 }),
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster6phase2', speed: 3, height: 64, width: 64 }),
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster6phase3', speed: 2, height: 64, width: 64 }),
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
        userPet.level += 1;
        userPet.xp = 0;
        userPet.state = nextLevelFound.defaultState;
        userPet.speed = nextLevelFound.animations[userPet.state].speed || 0;
        userPet.isTransitionIn = true;
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
const initializeState = (initialState) => {
    exports.state = initialState;
};
exports.initializeState = initializeState;
const setState = (key, value) => {
    exports.state = Object.assign(Object.assign({}, exports.state), { [key]: value });
    return exports.state;
};
exports.setState = setState;


/***/ }),

/***/ "./src/panel/transforms.ts":
/*!*********************************!*\
  !*** ./src/panel/transforms.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.walking = exports.transforms = void 0;
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
            // Detect if we're in explorer view mode (set in extension.ts)
            const isExplorerView = typeof window !== 'undefined' &&
                window.isExplorerView ===
                    true;
            // Use different boundaries based on view type
            const rightMargin = isExplorerView ? 60 : 80;
            const leftMargin = isExplorerView ? -15 : speed;
            // Determine direction based on position
            const direction = oldLeftPosition >= containerWidth - speed - rightMargin
                ? _1.Direction.left
                : oldLeftPosition <= leftMargin
                    ? _1.Direction.right
                    : oldDirection;
            // Update position based on direction
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
const walking = (containerWidth, speed, leftPosition, direction) => {
    // Check if we're in explorer view mode
    const isExplorerView = typeof window !== 'undefined' &&
        window.isExplorerView === true;
    // Use different margins for explorer view
    const leftMargin = isExplorerView ? -15 : speed;
    const rightMargin = isExplorerView ? 85 : 150;
    // Calculate effective width
    const effectiveWidth = containerWidth - rightMargin;
    // Determine direction based on position and boundaries
    let newDirection = direction;
    if (leftPosition >= effectiveWidth) {
        newDirection = _1.Direction.left;
    }
    else if (leftPosition <= leftMargin) {
        newDirection = _1.Direction.right;
    }
    // Update position based on direction
    let newLeftPosition;
    if (newDirection === _1.Direction.right) {
        newLeftPosition = leftPosition + speed;
    }
    else {
        newLeftPosition = leftPosition - speed;
    }
    return {
        leftPosition: newLeftPosition,
        direction: newDirection,
    };
};
exports.walking = walking;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9kb20udHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9pbmRleC50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL21haW4udHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9wZXRzLnRzIiwid2VicGFjazovL2NvZGFjaGlBcHAvLi9zcmMvcGFuZWwvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC90cmFuc2Zvcm1zLnRzIiwid2VicGFjazovL2NvZGFjaGlBcHAvLi9zcmMvcGFuZWwvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIERPTSB7XG4gIHByaXZhdGUgX3BldEltYWdlU2VsZWN0b3I6IHN0cmluZ1xuICBwcml2YXRlIF9tb3ZlbWVudENvbnRhaW5lclNlbGVjdG9yOiBzdHJpbmdcbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yOiBzdHJpbmdcbiAgcHJpdmF0ZSBfdHJhbnNpdGlvblNlbGVjdG9yOiBzdHJpbmdcblxuICBwcml2YXRlIF9tb3ZlbWVudENvbnRhaW5lckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkXG4gIHByaXZhdGUgX3BldEltYWdlRWxlbWVudDogSFRNTEltYWdlRWxlbWVudCB8IHVuZGVmaW5lZFxuICBwcml2YXRlIF90cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWRcbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbkltYWdlRWxlbWVudDogSFRNTEltYWdlRWxlbWVudCB8IHVuZGVmaW5lZFxuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBtb3ZlbWVudENvbnRhaW5lclNlbGVjdG9yLFxuICAgIHBldEltYWdlU2VsZWN0b3IsXG4gICAgdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yLFxuICAgIHRyYW5zaXRpb25TZWxlY3RvcixcbiAgfToge1xuICAgIHBldEltYWdlU2VsZWN0b3I6IHN0cmluZ1xuICAgIG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3I6IHN0cmluZ1xuICAgIHRyYW5zaXRpb25Db250YWluZXJTZWxlY3Rvcjogc3RyaW5nXG4gICAgdHJhbnNpdGlvblNlbGVjdG9yOiBzdHJpbmdcbiAgfSkge1xuICAgIHRoaXMuX3BldEltYWdlU2VsZWN0b3IgPSBwZXRJbWFnZVNlbGVjdG9yXG4gICAgdGhpcy5fbW92ZW1lbnRDb250YWluZXJTZWxlY3RvciA9IG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3JcbiAgICB0aGlzLl90cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3IgPSB0cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3JcbiAgICB0aGlzLl90cmFuc2l0aW9uU2VsZWN0b3IgPSB0cmFuc2l0aW9uU2VsZWN0b3JcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRIVE1MRWxlbWVudCA9IDxUPihlbGVtZW50TmFtZTogc3RyaW5nKTogVCA9PiB7XG4gICAgY29uc3QgaHRtbEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50TmFtZSkgYXMgdW5rbm93blxuICAgIGlmICghaHRtbEVsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGxvY2F0ZSBlbGVtZW50IGluIERPTTogJHtlbGVtZW50TmFtZX1gKVxuICAgIH1cblxuICAgIHJldHVybiBodG1sRWxlbWVudCBhcyBUXG4gIH1cblxuICBnZXRNb3ZlbWVudFNlbGVjdG9yKCk6IEhUTUxFbGVtZW50IHtcbiAgICBpZiAoIXRoaXMuX21vdmVtZW50Q29udGFpbmVyRWxlbWVudCkge1xuICAgICAgdGhpcy5fbW92ZW1lbnRDb250YWluZXJFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MRWxlbWVudD4oXG4gICAgICAgIHRoaXMuX21vdmVtZW50Q29udGFpbmVyU2VsZWN0b3JcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX21vdmVtZW50Q29udGFpbmVyRWxlbWVudFxuICB9XG5cbiAgZ2V0UGV0SW1hZ2VTZWxlY3RvcigpOiBIVE1MSW1hZ2VFbGVtZW50IHtcbiAgICBpZiAoIXRoaXMuX3BldEltYWdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fcGV0SW1hZ2VFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MSW1hZ2VFbGVtZW50PihcbiAgICAgICAgdGhpcy5fcGV0SW1hZ2VTZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcGV0SW1hZ2VFbGVtZW50XG4gIH1cblxuICBnZXRUcmFuc2l0aW9uU2VsZWN0b3IoKTogSFRNTEVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX3RyYW5zaXRpb25Db250YWluZXJFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MRWxlbWVudD4oXG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25Db250YWluZXJTZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnRcbiAgfVxuXG4gIGdldFRyYW5zaXRpb25JbWFnZVNlbGVjdG9yKCk6IEhUTUxJbWFnZUVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fdHJhbnNpdGlvbkltYWdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbkltYWdlRWxlbWVudCA9IHRoaXMuZ2V0SFRNTEVsZW1lbnQ8SFRNTEltYWdlRWxlbWVudD4oXG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25TZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHJhbnNpdGlvbkltYWdlRWxlbWVudFxuICB9XG59XG4iLCJpbXBvcnQgeyBET00gfSBmcm9tICcuL2RvbSdcbmltcG9ydCB7XG4gIGdlbmVyYXRlUGV0LFxuICBnZXRQZXRBbmltYXRpb25zLFxuICBnaWZzLFxuICBtdXRhdGVMZXZlbCxcbiAgcGV0VHlwZXMsXG4gIHJhbmRvbVBldE5hbWUsXG4gIHJhbmRvbVBldFR5cGUsXG59IGZyb20gJy4vcGV0cydcbmltcG9ydCB7IGluaXRpYWxpemVTdGF0ZSwgc2V0U3RhdGUsIHN0YXRlIH0gZnJvbSAnLi9zdGF0ZSdcbmltcG9ydCB7IHRyYW5zZm9ybXMgfSBmcm9tICcuL3RyYW5zZm9ybXMnXG5pbXBvcnQge1xuICBEaXJlY3Rpb24sXG4gIEdpZnMsXG4gIE5leHRGcmFtZUZuLFxuICBOZXh0RnJhbWVGblJldHVybixcbiAgTmV4dEZyYW1lT3B0cyxcbiAgUGV0LFxuICBQZXRBbmltYXRpb24sXG4gIFBldExldmVsLFxuICBQZXRTdGF0ZSxcbiAgUGV0VHlwZSxcbiAgU3RhdGUsXG4gIFRyYW5zZm9ybXMsXG4gIFVzZXJQZXQsXG4gIFVzZXJQZXRBcmdzLFxuICBVc2VyUGV0QmFzZVByb3BzLFxufSBmcm9tICcuL3R5cGVzJ1xuXG4vLyBGdW5jdGlvbiB0byBhZGp1c3Qgc3BlZWQgYmFzZWQgb24gc2NhbGVcbmV4cG9ydCBjb25zdCBhZGp1c3RTcGVlZEZvclNjYWxlID0gKFxuICBvcmlnaW5hbFNwZWVkOiBudW1iZXIsXG4gIHNjYWxlOiBudW1iZXJcbik6IG51bWJlciA9PiBvcmlnaW5hbFNwZWVkICogKDAuNyArIDAuNiAqIHNjYWxlKVxuXG5leHBvcnQge1xuICBEaXJlY3Rpb24sXG4gIERPTSxcbiAgZ2VuZXJhdGVQZXQsXG4gIGdldFBldEFuaW1hdGlvbnMsXG4gIGdpZnMsXG4gIEdpZnMsXG4gIGluaXRpYWxpemVTdGF0ZSxcbiAgbXV0YXRlTGV2ZWwsXG4gIE5leHRGcmFtZUZuLFxuICBOZXh0RnJhbWVGblJldHVybixcbiAgTmV4dEZyYW1lT3B0cyxcbiAgUGV0LFxuICBQZXRBbmltYXRpb24sXG4gIFBldExldmVsLFxuICBQZXRTdGF0ZSxcbiAgUGV0VHlwZSxcbiAgcGV0VHlwZXMsXG4gIHJhbmRvbVBldE5hbWUsXG4gIHJhbmRvbVBldFR5cGUsXG4gIHNldFN0YXRlLFxuICBTdGF0ZSxcbiAgc3RhdGUsXG4gIFRyYW5zZm9ybXMsXG4gIHRyYW5zZm9ybXMsXG4gIFVzZXJQZXQsXG4gIFVzZXJQZXRBcmdzLFxuICBVc2VyUGV0QmFzZVByb3BzLFxufVxuIiwiaW1wb3J0IHsgRE9NIH0gZnJvbSAnLi8nXG5pbXBvcnQgdHlwZSB7IFBldEFuaW1hdGlvbiwgVXNlclBldCB9IGZyb20gJy4vJ1xuaW1wb3J0IHtcbiAgZ2VuZXJhdGVQZXQsXG4gIGdpZnMsXG4gIHN0YXRlLFxuICBzZXRTdGF0ZSxcbiAgYWRqdXN0U3BlZWRGb3JTY2FsZSxcbiAgZ2V0UGV0QW5pbWF0aW9ucyxcbiAgdHJhbnNmb3JtcyxcbiAgcGV0VHlwZXMsXG59IGZyb20gJy4vJ1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN0YXRlIH0gZnJvbSAnLi9zdGF0ZSdcblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBjb2RhY2hpQXBwOiB7IFtrZXk6IHN0cmluZ106IHVua25vd24gfTtcbiAgICBpc0V4cGxvcmVyVmlldz86IGJvb2xlYW47XG4gIH1cbn1cblxuY29uc3QgZGVmYXVsdFN0YXRlID0ge1xuICB1c2VyUGV0OiBnZW5lcmF0ZVBldCh7IG5hbWU6ICd1bmtub3duJywgdHlwZTogJ3Vua25vd24nIH0pLFxuICBiYXNlUGV0VXJpOiAnJyxcbn1cblxuaW5pdGlhbGl6ZVN0YXRlKGRlZmF1bHRTdGF0ZSlcblxuY29uc3QgZG9tID0gbmV3IERPTSh7XG4gIG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3I6ICdtb3ZlbWVudC1jb250YWluZXInLFxuICBwZXRJbWFnZVNlbGVjdG9yOiAncGV0JyxcbiAgdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yOiAndHJhbnNpdGlvbi1jb250YWluZXInLFxuICB0cmFuc2l0aW9uU2VsZWN0b3I6ICd0cmFuc2l0aW9uJyxcbn0pXG5cbmNvbnN0IFRJQ0tfSU5URVJWQUxfTVMgPSAxMDBcblxuY29uc3QgdGljayA9ICh7IHVzZXJQZXQgfTogeyB1c2VyUGV0OiBVc2VyUGV0IH0pOiB2b2lkID0+IHtcbiAgY29uc3QgeyBsZWZ0UG9zaXRpb24sIGRpcmVjdGlvbiB9ID0gdHJhbnNmb3Jtc1t1c2VyUGV0LnN0YXRlXS5uZXh0RnJhbWUoe1xuICAgIGNvbnRhaW5lcldpZHRoOlxuICAgICAgd2luZG93LmlubmVyV2lkdGggfHxcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fFxuICAgICAgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCxcbiAgICBsZWZ0UG9zaXRpb246IHVzZXJQZXQubGVmdFBvc2l0aW9uLFxuICAgIGRpcmVjdGlvbjogdXNlclBldC5kaXJlY3Rpb24sXG4gICAgc3BlZWQ6IGFkanVzdFNwZWVkRm9yU2NhbGUodXNlclBldC5zcGVlZCwgdXNlclBldC5zY2FsZSksXG4gICAgb2Zmc2V0OiBnZXRQZXRBbmltYXRpb25zKHsgdXNlclBldCB9KS5hbmltYXRpb24ub2Zmc2V0IHx8IDAsXG4gICAgc2NhbGU6IHVzZXJQZXQuc2NhbGUsXG4gIH0pXG5cbiAgdXNlclBldC5sZWZ0UG9zaXRpb24gPSBsZWZ0UG9zaXRpb25cbiAgdXNlclBldC5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cblxuICAvLyBBcHBseSB0cmFuc2Zvcm1hdGlvblxuICBjb25zdCBtb3ZlbWVudENvbnRhaW5lciA9IGRvbS5nZXRNb3ZlbWVudFNlbGVjdG9yKClcbiAgbW92ZW1lbnRDb250YWluZXIuc3R5bGUubWFyZ2luTGVmdCA9IGAke3VzZXJQZXQubGVmdFBvc2l0aW9ufXB4YFxuXG4gIGNvbnN0IHBldEltYWdlRWxlbWVudCA9IGRvbS5nZXRQZXRJbWFnZVNlbGVjdG9yKClcbiAgcGV0SW1hZ2VFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZVgoJHt1c2VyUGV0LmRpcmVjdGlvbn0pIHNjYWxlKCR7dXNlclBldC5zY2FsZX0pYFxuXG4gIC8vIEdldCB0aGUgcGV0IGNvbnRhaW5lciBhbmQgYWRqdXN0IGl0cyBwb3NpdGlvbiB0byBrZWVwIHBldCBvbiB0aGUgZ3JvdW5kXG4gIGNvbnN0IHBldENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZXQtY29udGFpbmVyJylcbiAgaWYgKHBldENvbnRhaW5lcikge1xuICAgIGNvbnN0IHsgYW5pbWF0aW9uIH0gPSBnZXRQZXRBbmltYXRpb25zKHsgdXNlclBldCB9KVxuICAgIGNvbnN0IHZlcnRpY2FsQWRqdXN0bWVudCA9IChhbmltYXRpb24uaGVpZ2h0ICogKHVzZXJQZXQuc2NhbGUgLSAxKSkgLyAyXG4gICAgcGV0Q29udGFpbmVyLnN0eWxlLmJvdHRvbSA9IGAke3ZlcnRpY2FsQWRqdXN0bWVudH1weGBcbiAgfVxuXG4gIC8vIFdlJ3JlIG5vdCBnb2luZyB0byB0b3VjaCBpc1RyYW5zaXRpb25JbiBoZXJlIC0gd2UnbGwgb25seSBoYW5kbGUgaXQgaW4gc3BlY2lmaWMgZXZlbnRzXG59XG5cbi8vIEV4cGxpY2l0bHkgaGFuZGxlIHRyYW5zaXRpb25zIGZvciBzcGVjaWZpYyBldmVudHNcbmNvbnN0IGhhbmRsZVRyYW5zaXRpb24gPSAodXNlclBldDogVXNlclBldCk6IHZvaWQgPT4ge1xuICBpZiAoIXVzZXJQZXQuaXNUcmFuc2l0aW9uSW4pIHJldHVybjtcbiAgXG4gIGNvbnN0IHsgdHJhbnNpdGlvbjogYW5pbWF0aW9uIH0gPSBnZXRQZXRBbmltYXRpb25zKHtcbiAgICB1c2VyUGV0LFxuICB9KVxuXG4gIGlmIChhbmltYXRpb24pIHtcbiAgICBjb25zdCB0cmFuc2l0aW9uQ29udGFpbmVyID0gZG9tLmdldFRyYW5zaXRpb25TZWxlY3RvcigpXG4gICAgdHJhbnNpdGlvbkNvbnRhaW5lci5zdHlsZS5tYXJnaW5MZWZ0ID0gYCR7dXNlclBldC5sZWZ0UG9zaXRpb259cHhgXG5cbiAgICAvLyBBbHNvIGFkanVzdCB0cmFuc2l0aW9uIGNvbnRhaW5lciBoZWlnaHRcbiAgICBjb25zdCB0cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgJ3RyYW5zaXRpb24tY29udGFpbmVyJ1xuICAgIClcbiAgICBpZiAodHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHZlcnRpY2FsQWRqdXN0bWVudCA9IChhbmltYXRpb24uaGVpZ2h0ICogKHVzZXJQZXQuc2NhbGUgLSAxKSkgLyAyXG4gICAgICB0cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudC5zdHlsZS5ib3R0b20gPSBgJHt2ZXJ0aWNhbEFkanVzdG1lbnR9cHhgXG4gICAgfVxuXG4gICAgc2V0SW1hZ2Uoe1xuICAgICAgY29udGFpbmVyOiBkb20uZ2V0VHJhbnNpdGlvblNlbGVjdG9yKCksXG4gICAgICBzZWxlY3RvcjogZG9tLmdldFRyYW5zaXRpb25JbWFnZVNlbGVjdG9yKCksXG4gICAgICBhbmltYXRpb24sXG4gICAgfSlcbiAgICBcbiAgICAvLyBDbGVhciB0aGUgdHJhbnNpdGlvbiBmbGFnIGFmdGVyIGhhbmRsaW5nIGl0XG4gICAgc3RhdGUudXNlclBldC5pc1RyYW5zaXRpb25JbiA9IGZhbHNlXG4gIH1cbn1cblxuY29uc3Qgc2V0SW1hZ2UgPSAoe1xuICBjb250YWluZXIsXG4gIHNlbGVjdG9yLFxuICBhbmltYXRpb24sXG59OiB7XG4gIGNvbnRhaW5lcjogSFRNTEVsZW1lbnRcbiAgc2VsZWN0b3I6IEhUTUxJbWFnZUVsZW1lbnRcbiAgYW5pbWF0aW9uOiBQZXRBbmltYXRpb25cbn0pOiB2b2lkID0+IHtcbiAgY29uc3QgeyBiYXNlUGV0VXJpLCB1c2VyUGV0IH0gPSBzdGF0ZVxuXG4gIHNlbGVjdG9yLnNyYyA9IGAke2Jhc2VQZXRVcml9LyR7Z2lmc1thbmltYXRpb24uZ2lmXX1gXG4gIHNlbGVjdG9yLndpZHRoID0gYW5pbWF0aW9uLndpZHRoXG4gIHNlbGVjdG9yLnN0eWxlLm1pbldpZHRoID0gYCR7YW5pbWF0aW9uLndpZHRofXB4YFxuICBzZWxlY3Rvci5oZWlnaHQgPSBhbmltYXRpb24uaGVpZ2h0XG5cbiAgLy8gRm9yIHBldCBpbWFnZSwgd2UgbmVlZCB0byBtYWludGFpbiBzY2FsZVggZm9yIGRpcmVjdGlvblxuICBpZiAoc2VsZWN0b3IgPT09IGRvbS5nZXRQZXRJbWFnZVNlbGVjdG9yKCkpIHtcbiAgICBzZWxlY3Rvci5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGVYKCR7dXNlclBldC5kaXJlY3Rpb259KSBzY2FsZSgke3VzZXJQZXQuc2NhbGV9KWBcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgdHJhbnNpdGlvbiBpbWFnZXMsIGp1c3QgYXBwbHkgdGhlIHNjYWxlXG4gICAgc2VsZWN0b3Iuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7dXNlclBldC5zY2FsZX0pYFxuICB9XG5cbiAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSBgJHthbmltYXRpb24ub2Zmc2V0ID8/IDB9cHhgXG59XG5cbmNvbnN0IHNsZWVwID0gKG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+XG4gIG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIG1zKSlcblxuY29uc3Qgc3RhcnRBbmltYXRpb24gPSAoKTogdm9pZCA9PiB7XG4gIGNvbnN0IHsgdXNlclBldCB9ID0gc3RhdGVcbiAgaWYgKHN0YXRlLmludGVydmFsSWQpIHtcbiAgICBjbGVhckludGVydmFsKHN0YXRlLmludGVydmFsSWQpXG4gIH1cbiAgY29uc3QgaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICB0aWNrKHsgdXNlclBldCB9KVxuICB9LCBUSUNLX0lOVEVSVkFMX01TKVxuICBzZXRTdGF0ZSgnaW50ZXJ2YWxJZCcsIGludGVydmFsSWQpXG59XG5cbmV4cG9ydCBjb25zdCBhZGRQZXRUb1BhbmVsID0gYXN5bmMgKHtcbiAgdXNlclBldCxcbn06IHtcbiAgdXNlclBldDogVXNlclBldFxufSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICBjb25zdCB7IGFuaW1hdGlvbiB9ID0gZ2V0UGV0QW5pbWF0aW9ucyh7XG4gICAgdXNlclBldCxcbiAgfSlcblxuICAvLyBTdG9yZSB0aGUgb3JpZ2luYWwgc3BlZWQgaWYgaXQncyBub3QgYWxyZWFkeSBzZXRcbiAgaWYgKCF1c2VyUGV0Lm9yaWdpbmFsU3BlZWQgJiYgYW5pbWF0aW9uLnNwZWVkKSB7XG4gICAgdXNlclBldC5vcmlnaW5hbFNwZWVkID0gYW5pbWF0aW9uLnNwZWVkXG4gIH1cblxuICBpZiAodXNlclBldC5vcmlnaW5hbFNwZWVkKSB7XG4gICAgdXNlclBldC5zcGVlZCA9IGFkanVzdFNwZWVkRm9yU2NhbGUodXNlclBldC5vcmlnaW5hbFNwZWVkLCB1c2VyUGV0LnNjYWxlKVxuICB9XG5cbiAgLy8gVXBkYXRlIHRoZSBzdGF0ZVxuICBzZXRTdGF0ZSgndXNlclBldCcsIHVzZXJQZXQpXG4gIFxuICAvLyBIYW5kbGUgdHJhbnNpdGlvbiBpZiBuZWVkZWQgKGJ1dCBvbmx5IG9uY2UpXG4gIGlmICh1c2VyUGV0LmlzVHJhbnNpdGlvbkluKSB7XG4gICAgaGFuZGxlVHJhbnNpdGlvbih1c2VyUGV0KVxuICB9XG4gIFxuICAvLyBTdGFydCB0aGUgYW5pbWF0aW9uIGxvb3BcbiAgc3RhcnRBbmltYXRpb24oKVxuXG4gIC8vIEdpdmUgZXZlcnl0aGluZyBhIGNoYW5jZSB0byByZW5kZXJcbiAgYXdhaXQgc2xlZXAoVElDS19JTlRFUlZBTF9NUyAqIDIpXG5cbiAgLy8gU2V0IHRoZSBtYWluIHBldCBpbWFnZVxuICBzZXRJbWFnZSh7XG4gICAgc2VsZWN0b3I6IGRvbS5nZXRQZXRJbWFnZVNlbGVjdG9yKCksXG4gICAgYW5pbWF0aW9uLFxuICAgIGNvbnRhaW5lcjogZG9tLmdldE1vdmVtZW50U2VsZWN0b3IoKSxcbiAgfSlcblxuICAvLyBBcHBseSB2ZXJ0aWNhbCBwb3NpdGlvbiBhZGp1c3RtZW50IGZvciB0aGUgcGV0IGNvbnRhaW5lclxuICBjb25zdCBwZXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGV0LWNvbnRhaW5lcicpXG4gIGlmIChwZXRDb250YWluZXIpIHtcbiAgICBjb25zdCB2ZXJ0aWNhbEFkanVzdG1lbnQgPSAoYW5pbWF0aW9uLmhlaWdodCAqICh1c2VyUGV0LnNjYWxlIC0gMSkpIC8gMlxuICAgIHBldENvbnRhaW5lci5zdHlsZS5ib3R0b20gPSBgJHt2ZXJ0aWNhbEFkanVzdG1lbnR9cHhgXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFwcCA9ICh7XG4gIHVzZXJQZXQsXG4gIGJhc2VQZXRVcmksXG59OiB7XG4gIHVzZXJQZXQ6IFVzZXJQZXRcbiAgYmFzZVBldFVyaTogc3RyaW5nXG59KTogdm9pZCA9PiB7XG4gIHNldFN0YXRlKCdiYXNlUGV0VXJpJywgYmFzZVBldFVyaSlcbiAgXG4gIC8vIEV4cG9zZSBwZXRUeXBlcyB0byB0aGUgd2luZG93IGZvciBYUCBiYXIgY2FsY3VsYXRpb25zXG4gIHdpbmRvdy5jb2RhY2hpQXBwID0gd2luZG93LmNvZGFjaGlBcHAgfHwge307XG4gIHdpbmRvdy5jb2RhY2hpQXBwLnBldFR5cGVzID0gcGV0VHlwZXM7XG5cbiAgaWYgKHVzZXJQZXQpIHtcbiAgICAvLyBIYW5kbGUgaW5pdGlhbCBzdGF0ZVxuICAgIGFkZFBldFRvUGFuZWwoeyB1c2VyUGV0IH0pXG4gIH1cbiAgXG4gIC8vIEhhbmRsZSBtZXNzYWdlcyBzZW50IGZyb20gdGhlIGV4dGVuc2lvbiB0byB0aGUgd2Vidmlld1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHsgY29tbWFuZCwgZGF0YSB9ID0gZXZlbnQuZGF0YSAvLyBUaGUgZGF0YSB0aGF0IHRoZSBleHRlbnNpb24gc2VudFxuICAgIHN3aXRjaCAoY29tbWFuZCkge1xuICAgICAgY2FzZSAnc3Bhd24tcGV0JzpcbiAgICAgICAgLy8gTmV3IHBldCBjcmVhdGlvbiAtIGFsd2F5cyBzaG93IHRyYW5zaXRpb25cbiAgICAgICAgYWRkUGV0VG9QYW5lbCh7IHVzZXJQZXQ6IGRhdGEudXNlclBldCB9KVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlICd1cGRhdGUtcGV0Jzoge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIGp1c3QgYW4gWFAgdXBkYXRlLCBvbmx5IHVwZGF0ZSB0aGUgWFAgdmFsdWVcbiAgICAgICAgaWYgKGRhdGEuaXNYUFVwZGF0ZSAmJiBzdGF0ZS51c2VyUGV0KSB7XG4gICAgICAgICAgc3RhdGUudXNlclBldC54cCA9IGRhdGEudXNlclBldC54cDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIEZvciBsZXZlbCBjaGFuZ2VzIG9yIHN0YXRlIGNoYW5nZXMsIGRvIGEgZnVsbCByZWZyZXNoXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRQZXQgPSB7XG4gICAgICAgICAgLi4uZGF0YS51c2VyUGV0LFxuICAgICAgICAgIGxlZnRQb3NpdGlvbjogc3RhdGUudXNlclBldC5sZWZ0UG9zaXRpb24sXG4gICAgICAgICAgZGlyZWN0aW9uOiBzdGF0ZS51c2VyUGV0LmRpcmVjdGlvbixcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gV2Ugd2FudCB0cmFuc2l0aW9ucyB0byB3b3JrIGZvciBsZXZlbCBjaGFuZ2VzXG4gICAgICAgIGFkZFBldFRvUGFuZWwoeyB1c2VyUGV0OiB1cGRhdGVkUGV0IH0pXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cbiIsImltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4vJ1xuXG5pbXBvcnQgdHlwZSB7XG4gIEdpZnMsXG4gIFBldCxcbiAgUGV0QW5pbWF0aW9uLFxuICBQZXRMZXZlbCxcbiAgUGV0VHlwZSxcbiAgVXNlclBldCxcbiAgVXNlclBldEFyZ3MsXG59IGZyb20gJy4vJ1xuXG5leHBvcnQgY29uc3QgZ2lmczogR2lmcyA9IHtcbiAgZWdnMTogJ2VnZzEuZ2lmJyxcbiAgZHVzdDE6ICdkdXN0MS5naWYnLFxuICBkdXN0MjogJ2R1c3QyLmdpZicsXG4gIG1vbnN0ZXIxcGhhc2UxOiAnbTFkMS5naWYnLFxuICBtb25zdGVyMXBoYXNlMjogJ20xZDIuZ2lmJyxcbiAgbW9uc3RlcjFwaGFzZTM6ICdtMWQzLmdpZicsXG4gIG1vbnN0ZXIycGhhc2UxOiAnbTJkMS5naWYnLFxuICBtb25zdGVyMnBoYXNlMjogJ20yZDIuZ2lmJyxcbiAgbW9uc3RlcjJwaGFzZTM6ICdtMmQzLmdpZicsXG4gIG1vbnN0ZXIzcGhhc2UxOiAnbTNkMS5naWYnLFxuICBtb25zdGVyM3BoYXNlMjogJ20zZDIuZ2lmJyxcbiAgbW9uc3RlcjNwaGFzZTM6ICdtM2QzLmdpZicsXG4gIG1vbnN0ZXI0cGhhc2UxOiAnbTRkMS5naWYnLFxuICBtb25zdGVyNHBoYXNlMjogJ200ZDIuZ2lmJyxcbiAgbW9uc3RlcjRwaGFzZTM6ICdtNGQzLmdpZicsXG4gIG1vbnN0ZXI1cGhhc2UxOiAnbTVkMS5naWYnLFxuICBtb25zdGVyNXBoYXNlMjogJ201ZDIuZ2lmJyxcbiAgbW9uc3RlcjVwaGFzZTM6ICdtNWQzLmdpZicsXG4gIG1vbnN0ZXI2cGhhc2UxOiAnbTZkMS5naWYnLFxuICBtb25zdGVyNnBoYXNlMjogJ202ZDIuZ2lmJyxcbiAgbW9uc3RlcjZwaGFzZTM6ICdtNmQzLmdpZicsXG59XG5cbmV4cG9ydCBjb25zdCBwZXROYW1lcyA9IFtcbiAgJ2JvbycsXG4gICduYWNobycsXG4gICdnYXJ5JyxcbiAgJ2Z1ZGdlJyxcbiAgJ25la28nLFxuICAncGlwJyxcbiAgJ2JpYm8nLFxuICAnZmlmaScsXG4gICdqYXgnLFxuICAnYm9iYmEnLFxuICAnZ2lkZ2V0JyxcbiAgJ21pbmEnLFxuICAnY3J1bWInLFxuICAnemltYm8nLFxuICAnZHVzdHknLFxuICAnYnJvY2snLFxuICAnb3RpcycsXG4gICdtYXJ2aW4nLFxuICAnc21va2V5JyxcbiAgJ2JhcnJ5JyxcbiAgJ3RvbnknLFxuICAnZHVzdHknLFxuICAnbW9jaGknLFxuXVxuXG5jb25zdCBhbmltYXRpb25EZWZhdWx0cyA9IHtcbiAgd2lkdGg6IDc1LFxuICBoZWlnaHQ6IDY0LFxuICBzcGVlZDogMCxcbiAgb2Zmc2V0OiAwLFxufVxuXG5jb25zdCBlZ2c6IFBldExldmVsID0ge1xuICB4cDogMCxcbiAgZGVmYXVsdFN0YXRlOiAnaWRsZScsXG4gIGFuaW1hdGlvbnM6IHtcbiAgICBpZGxlOiB7XG4gICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgIGdpZjogJ2VnZzEnLFxuICAgIH0sXG4gICAgdHJhbnNpdGlvbjoge1xuICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICBnaWY6ICdkdXN0MScsXG4gICAgICBvZmZzZXQ6IC0xMyxcbiAgICAgIHdpZHRoOiAxMDAsXG4gICAgICBoZWlnaHQ6IDEwMCxcbiAgICB9LFxuICB9LFxufVxuXG4vLyBHZW5lcmljIGV2b2x1dGlvbiB0cmFuc2l0aW9uXG5jb25zdCB0cmFuc2l0aW9uOiBQZXRBbmltYXRpb24gPSB7XG4gIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICBnaWY6ICdkdXN0MicsXG4gIG9mZnNldDogLTk1LFxuICB3aWR0aDogMjgwLFxuICBoZWlnaHQ6IDEwMCxcbn1cblxuZXhwb3J0IGNvbnN0IHBldFR5cGVzID0gbmV3IE1hcDxzdHJpbmcsIFBldD4oW1xuICBbXG4gICAgJ21vbnN0ZXIxJyxcbiAgICB7XG4gICAgICBsZXZlbHM6IG5ldyBNYXAoW1xuICAgICAgICBbMCwgZWdnXSxcbiAgICAgICAgW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDM1LFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMXBoYXNlMScsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAxNTAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIxcGhhc2UyJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDI0MDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjFwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyMicsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjJwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDEwMDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjJwaGFzZTInLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDYwMDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjJwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF0pLFxuICAgIH0sXG4gIF0sXG4gIFtcbiAgICAnbW9uc3RlcjMnLFxuICAgIHtcbiAgICAgIGxldmVsczogbmV3IE1hcChbXG4gICAgICAgIFswLCBlZ2ddLFxuICAgICAgICBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMzUsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIzcGhhc2UxJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDEsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA1OTk5MDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIzcGhhc2UyJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA2MDAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIzcGhhc2UzJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuICBbXG4gICAgJ21vbnN0ZXI0JyxcbiAgICB7XG4gICAgICBsZXZlbHM6IG5ldyBNYXAoW1xuICAgICAgICBbMCwgZWdnXSxcbiAgICAgICAgW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDM1LFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNHBoYXNlMScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMTUwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNHBoYXNlMicsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMjQwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNHBoYXNlMycsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAzLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyNScsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjVwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDY2LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMTUwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNXBoYXNlMicsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDI0MDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjVwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTM1LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMjUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuICBbXG4gICAgJ21vbnN0ZXI2JyxcbiAgICB7XG4gICAgICBsZXZlbHM6IG5ldyBNYXAoW1xuICAgICAgICBbMCwgZWdnXSxcbiAgICAgICAgW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDM1LFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNnBoYXNlMScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIGhlaWdodDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAxNTAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI2cGhhc2UyJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDY0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDI0MDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjZwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNjQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbl0pXG5cbmV4cG9ydCBjb25zdCByYW5kb21QZXRUeXBlID0gKCk6IFBldFR5cGUgPT5cbiAgQXJyYXkuZnJvbShwZXRUeXBlcy5rZXlzKCkpW1xuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBldFR5cGVzLnNpemUpXG4gIF0gYXMgUGV0VHlwZVxuXG5leHBvcnQgY29uc3QgcmFuZG9tUGV0TmFtZSA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBuYW1lID0gcGV0TmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGV0TmFtZXMubGVuZ3RoKV1cbiAgcmV0dXJuIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpLnRvTG93ZXJDYXNlKClcbn1cblxuZXhwb3J0IGNvbnN0IGdldFBldEFuaW1hdGlvbnMgPSAoe1xuICB1c2VyUGV0LFxufToge1xuICB1c2VyUGV0OiBVc2VyUGV0XG59KToge1xuICBhbmltYXRpb246IFBldEFuaW1hdGlvblxuICB0cmFuc2l0aW9uOiBQZXRBbmltYXRpb24gfCB1bmRlZmluZWRcbn0gPT4ge1xuICBjb25zdCBwZXRUeXBlRm91bmQgPSBwZXRUeXBlcy5nZXQodXNlclBldC50eXBlKVxuICBpZiAoIXBldFR5cGVGb3VuZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUGV0IHR5cGUgbm90IGZvdW5kOiAke3VzZXJQZXQudHlwZX1gKVxuICB9XG5cbiAgY29uc3QgbGV2ZWxGb3VuZCA9IHBldFR5cGVGb3VuZC5sZXZlbHMuZ2V0KHVzZXJQZXQubGV2ZWwpXG4gIGlmICghbGV2ZWxGb3VuZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBQZXQgbGV2ZWwgbm90IGZvdW5kIGZvciBwZXQgdHlwZSAke3VzZXJQZXQudHlwZX06ICR7dXNlclBldC5sZXZlbH1gXG4gICAgKVxuICB9XG5cbiAgaWYgKCEodXNlclBldC5zdGF0ZSBpbiBsZXZlbEZvdW5kLmFuaW1hdGlvbnMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEFuaW1hdGlvbiBub3QgZm91bmQgZm9yIHBldCB0eXBlICR7dXNlclBldC50eXBlfSwgbGV2ZWwgJHt1c2VyUGV0LmxldmVsfTogJHt1c2VyUGV0LnN0YXRlfWBcbiAgICApXG4gIH1cblxuICBjb25zdCB0cmFuc2l0aW9uID1cbiAgICAndHJhbnNpdGlvbicgaW4gbGV2ZWxGb3VuZC5hbmltYXRpb25zXG4gICAgICA/IGxldmVsRm91bmQuYW5pbWF0aW9ucy50cmFuc2l0aW9uXG4gICAgICA6IHVuZGVmaW5lZFxuXG4gIHJldHVybiB7XG4gICAgYW5pbWF0aW9uOiBsZXZlbEZvdW5kLmFuaW1hdGlvbnNbdXNlclBldC5zdGF0ZV0sXG4gICAgdHJhbnNpdGlvbixcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVQZXQgPSAoeyBuYW1lLCB0eXBlIH06IFVzZXJQZXRBcmdzKTogVXNlclBldCA9PiAoe1xuICBsZWZ0UG9zaXRpb246IDAsXG4gIHNwZWVkOiAwLFxuICBkaXJlY3Rpb246IERpcmVjdGlvbi5yaWdodCxcbiAgbGV2ZWw6IDAsXG4gIHhwOiAwLFxuICAvLyBBbGwgbGV2ZWwgMCBjaGFyYWN0ZXJzIHJlcXVpcmUgdGhpcyBzdGF0ZVxuICBzdGF0ZTogJ2lkbGUnLFxuICBpc1RyYW5zaXRpb25JbjogdHJ1ZSxcbiAgbmFtZSxcbiAgdHlwZSxcbiAgc2NhbGU6IDEsXG59KVxuXG5leHBvcnQgY29uc3QgZ2V0TGV2ZWwgPSAoe1xuICBwZXRUeXBlLFxuICBsZXZlbCxcbn06IHtcbiAgcGV0VHlwZTogUGV0VHlwZVxuICBsZXZlbDogbnVtYmVyXG59KSA9PiB7XG4gIGNvbnN0IHBldFR5cGVGb3VuZCA9IHBldFR5cGVzLmdldChwZXRUeXBlKVxuICBpZiAoIXBldFR5cGVGb3VuZCkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIGNvbnN0IGxldmVsRm91bmQgPSBwZXRUeXBlRm91bmQubGV2ZWxzLmdldChsZXZlbClcbiAgaWYgKCFsZXZlbEZvdW5kKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cbiAgcmV0dXJuIGxldmVsRm91bmRcbn1cblxuZXhwb3J0IGNvbnN0IG11dGF0ZUxldmVsID0gKHsgdXNlclBldCB9OiB7IHVzZXJQZXQ6IFVzZXJQZXQgfSkgPT4ge1xuICBjb25zdCBuZXh0TGV2ZWxGb3VuZCA9IGdldExldmVsKHtcbiAgICBwZXRUeXBlOiB1c2VyUGV0LnR5cGUsXG4gICAgbGV2ZWw6IHVzZXJQZXQubGV2ZWwgKyAxLFxuICB9KVxuXG4gIGlmICghbmV4dExldmVsRm91bmQpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh1c2VyUGV0LnhwID49IG5leHRMZXZlbEZvdW5kLnhwKSB7XG4gICAgdXNlclBldC5sZXZlbCArPSAxXG4gICAgdXNlclBldC54cCA9IDBcbiAgICB1c2VyUGV0LnN0YXRlID0gbmV4dExldmVsRm91bmQuZGVmYXVsdFN0YXRlXG4gICAgdXNlclBldC5zcGVlZCA9IG5leHRMZXZlbEZvdW5kLmFuaW1hdGlvbnNbdXNlclBldC5zdGF0ZV0uc3BlZWQgfHwgMFxuICAgIHVzZXJQZXQuaXNUcmFuc2l0aW9uSW4gPSB0cnVlXG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgU3RhdGUgfSBmcm9tICcuLydcblxuZXhwb3J0IGxldCBzdGF0ZTogU3RhdGVcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVTdGF0ZSA9IChpbml0aWFsU3RhdGU6IFN0YXRlKTogdm9pZCA9PiB7XG4gIHN0YXRlID0gaW5pdGlhbFN0YXRlXG59XG5cbmV4cG9ydCBjb25zdCBzZXRTdGF0ZSA9IDxLIGV4dGVuZHMga2V5b2YgU3RhdGU+KFxuICBrZXk6IEssXG4gIHZhbHVlOiBTdGF0ZVtLXVxuKTogU3RhdGUgPT4ge1xuICBzdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBba2V5XTogdmFsdWUsXG4gIH1cbiAgcmV0dXJuIHN0YXRlXG59XG4iLCJpbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLydcbmltcG9ydCB0eXBlIHsgTmV4dEZyYW1lT3B0cywgVHJhbnNmb3JtcyB9IGZyb20gJy4vJ1xuXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtczogVHJhbnNmb3JtcyA9IHtcbiAgaWRsZToge1xuICAgIG5leHRGcmFtZTogKHsgZGlyZWN0aW9uLCBvZmZzZXQsIHNjYWxlIH06IE5leHRGcmFtZU9wdHMpID0+ICh7XG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBsZWZ0UG9zaXRpb246IG9mZnNldCxcbiAgICAgIHNjYWxlLFxuICAgIH0pLFxuICB9LFxuICB3YWxraW5nOiB7XG4gICAgbmV4dEZyYW1lOiAoe1xuICAgICAgY29udGFpbmVyV2lkdGgsXG4gICAgICBsZWZ0UG9zaXRpb246IG9sZExlZnRQb3NpdGlvbixcbiAgICAgIGRpcmVjdGlvbjogb2xkRGlyZWN0aW9uLFxuICAgICAgc3BlZWQsXG4gICAgICBzY2FsZSxcbiAgICB9OiBOZXh0RnJhbWVPcHRzKSA9PiB7XG4gICAgICAvLyBEZXRlY3QgaWYgd2UncmUgaW4gZXhwbG9yZXIgdmlldyBtb2RlIChzZXQgaW4gZXh0ZW5zaW9uLnRzKVxuICAgICAgY29uc3QgaXNFeHBsb3JlclZpZXcgPVxuICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAod2luZG93IGFzIFdpbmRvdyAmIHsgaXNFeHBsb3JlclZpZXc/OiBib29sZWFuIH0pLmlzRXhwbG9yZXJWaWV3ID09PVxuICAgICAgICAgIHRydWVcblxuICAgICAgLy8gVXNlIGRpZmZlcmVudCBib3VuZGFyaWVzIGJhc2VkIG9uIHZpZXcgdHlwZVxuICAgICAgY29uc3QgcmlnaHRNYXJnaW4gPSBpc0V4cGxvcmVyVmlldyA/IDYwIDogODBcbiAgICAgIGNvbnN0IGxlZnRNYXJnaW4gPSBpc0V4cGxvcmVyVmlldyA/IC0xNSA6IHNwZWVkXG5cbiAgICAgIC8vIERldGVybWluZSBkaXJlY3Rpb24gYmFzZWQgb24gcG9zaXRpb25cbiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9XG4gICAgICAgIG9sZExlZnRQb3NpdGlvbiA+PSBjb250YWluZXJXaWR0aCAtIHNwZWVkIC0gcmlnaHRNYXJnaW5cbiAgICAgICAgICA/IERpcmVjdGlvbi5sZWZ0XG4gICAgICAgICAgOiBvbGRMZWZ0UG9zaXRpb24gPD0gbGVmdE1hcmdpblxuICAgICAgICAgID8gRGlyZWN0aW9uLnJpZ2h0XG4gICAgICAgICAgOiBvbGREaXJlY3Rpb25cblxuICAgICAgLy8gVXBkYXRlIHBvc2l0aW9uIGJhc2VkIG9uIGRpcmVjdGlvblxuICAgICAgY29uc3QgbGVmdFBvc2l0aW9uID1cbiAgICAgICAgZGlyZWN0aW9uID09PSBEaXJlY3Rpb24ucmlnaHRcbiAgICAgICAgICA/IG9sZExlZnRQb3NpdGlvbiArIHNwZWVkXG4gICAgICAgICAgOiBvbGRMZWZ0UG9zaXRpb24gLSBzcGVlZFxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgIGxlZnRQb3NpdGlvbixcbiAgICAgICAgc2NhbGUsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IHdhbGtpbmcgPSAoXG4gIGNvbnRhaW5lcldpZHRoOiBudW1iZXIsXG4gIHNwZWVkOiBudW1iZXIsXG4gIGxlZnRQb3NpdGlvbjogbnVtYmVyLFxuICBkaXJlY3Rpb246IERpcmVjdGlvblxuKTogeyBsZWZ0UG9zaXRpb246IG51bWJlcjsgZGlyZWN0aW9uOiBEaXJlY3Rpb24gfSA9PiB7XG4gIC8vIENoZWNrIGlmIHdlJ3JlIGluIGV4cGxvcmVyIHZpZXcgbW9kZVxuICBjb25zdCBpc0V4cGxvcmVyVmlldyA9XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAod2luZG93IGFzIFdpbmRvdyAmIHsgaXNFeHBsb3JlclZpZXc/OiBib29sZWFuIH0pLmlzRXhwbG9yZXJWaWV3ID09PSB0cnVlXG5cbiAgLy8gVXNlIGRpZmZlcmVudCBtYXJnaW5zIGZvciBleHBsb3JlciB2aWV3XG4gIGNvbnN0IGxlZnRNYXJnaW4gPSBpc0V4cGxvcmVyVmlldyA/IC0xNSA6IHNwZWVkXG4gIGNvbnN0IHJpZ2h0TWFyZ2luID0gaXNFeHBsb3JlclZpZXcgPyA4NSA6IDE1MFxuXG4gIC8vIENhbGN1bGF0ZSBlZmZlY3RpdmUgd2lkdGhcbiAgY29uc3QgZWZmZWN0aXZlV2lkdGggPSBjb250YWluZXJXaWR0aCAtIHJpZ2h0TWFyZ2luXG5cbiAgLy8gRGV0ZXJtaW5lIGRpcmVjdGlvbiBiYXNlZCBvbiBwb3NpdGlvbiBhbmQgYm91bmRhcmllc1xuICBsZXQgbmV3RGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gIGlmIChsZWZ0UG9zaXRpb24gPj0gZWZmZWN0aXZlV2lkdGgpIHtcbiAgICBuZXdEaXJlY3Rpb24gPSBEaXJlY3Rpb24ubGVmdFxuICB9IGVsc2UgaWYgKGxlZnRQb3NpdGlvbiA8PSBsZWZ0TWFyZ2luKSB7XG4gICAgbmV3RGlyZWN0aW9uID0gRGlyZWN0aW9uLnJpZ2h0XG4gIH1cblxuICAvLyBVcGRhdGUgcG9zaXRpb24gYmFzZWQgb24gZGlyZWN0aW9uXG4gIGxldCBuZXdMZWZ0UG9zaXRpb246IG51bWJlclxuICBpZiAobmV3RGlyZWN0aW9uID09PSBEaXJlY3Rpb24ucmlnaHQpIHtcbiAgICBuZXdMZWZ0UG9zaXRpb24gPSBsZWZ0UG9zaXRpb24gKyBzcGVlZFxuICB9IGVsc2Uge1xuICAgIG5ld0xlZnRQb3NpdGlvbiA9IGxlZnRQb3NpdGlvbiAtIHNwZWVkXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxlZnRQb3NpdGlvbjogbmV3TGVmdFBvc2l0aW9uLFxuICAgIGRpcmVjdGlvbjogbmV3RGlyZWN0aW9uLFxuICB9XG59XG4iLCJleHBvcnQgdHlwZSBTdGF0ZSA9IHtcbiAgdXNlclBldDogVXNlclBldFxuICBiYXNlUGV0VXJpOiBzdHJpbmdcbiAgaW50ZXJ2YWxJZD86IE5vZGVKUy5UaW1lb3V0IHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCB0eXBlIEdpZnMgPSB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfVxuXG5leHBvcnQgdHlwZSBQZXRTdGF0ZSA9ICd3YWxraW5nJyB8ICdpZGxlJyB8ICd0cmFuc2l0aW9uJ1xuXG5leHBvcnQgdHlwZSBQZXRBbmltYXRpb24gPSB7XG4gIGdpZjogc3RyaW5nXG4gIHdpZHRoOiBudW1iZXJcbiAgaGVpZ2h0OiBudW1iZXJcbiAgb2Zmc2V0PzogbnVtYmVyXG4gIHNwZWVkPzogbnVtYmVyXG4gIGR1cmF0aW9uPzogbnVtYmVyXG59XG5cbmV4cG9ydCB0eXBlIFBldExldmVsID0ge1xuICB4cDogbnVtYmVyXG4gIGRlZmF1bHRTdGF0ZTogUGV0U3RhdGVcbiAgYW5pbWF0aW9uczoge1xuICAgIFtuYW1lOiBzdHJpbmddOiBQZXRBbmltYXRpb25cbiAgfVxufVxuXG5leHBvcnQgdHlwZSBQZXQgPSB7XG4gIGxldmVsczogTWFwPG51bWJlciwgUGV0TGV2ZWw+XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlclBldEJhc2VQcm9wcyB7XG4gIGxlZnRQb3NpdGlvbjogbnVtYmVyXG4gIHNwZWVkOiBudW1iZXJcbiAgb3JpZ2luYWxTcGVlZD86IG51bWJlclxuICBkaXJlY3Rpb246IG51bWJlclxuICBsZXZlbDogbnVtYmVyXG4gIHhwOiBudW1iZXJcbiAgc3RhdGU6IFBldFN0YXRlXG4gIGlzVHJhbnNpdGlvbkluOiBib29sZWFuXG4gIHNjYWxlOiBudW1iZXJcbn1cblxuZXhwb3J0IHR5cGUgUGV0VHlwZSA9ICdtb25zdGVyMScgfCAnbW9uc3RlcjInIHwgJ3Vua25vd24nXG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlclBldEFyZ3Mge1xuICBuYW1lOiBzdHJpbmdcbiAgdHlwZTogUGV0VHlwZVxufVxuXG5leHBvcnQgdHlwZSBVc2VyUGV0ID0gVXNlclBldEJhc2VQcm9wcyAmIFVzZXJQZXRBcmdzXG5cbmV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XG4gIHJpZ2h0ID0gMSxcbiAgbGVmdCA9IC0xLFxufVxuXG5leHBvcnQgdHlwZSBOZXh0RnJhbWVPcHRzID0ge1xuICBjb250YWluZXJXaWR0aDogbnVtYmVyXG4gIGxlZnRQb3NpdGlvbjogbnVtYmVyXG4gIGRpcmVjdGlvbjogbnVtYmVyXG4gIHNwZWVkOiBudW1iZXJcbiAgb2Zmc2V0OiBudW1iZXJcbiAgc2NhbGU6IG51bWJlclxufVxuXG5leHBvcnQgdHlwZSBOZXh0RnJhbWVGblJldHVybiA9IHtcbiAgbGVmdFBvc2l0aW9uOiBudW1iZXJcbiAgZGlyZWN0aW9uOiBudW1iZXJcbiAgbmV3UGV0U3RhdGU/OiBQZXRTdGF0ZVxufVxuXG5leHBvcnQgdHlwZSBOZXh0RnJhbWVGbiA9IChvcHRzOiBOZXh0RnJhbWVPcHRzKSA9PiBOZXh0RnJhbWVGblJldHVyblxuXG5leHBvcnQgdHlwZSBUcmFuc2Zvcm1zID0ge1xuICBbdHJhbnNmb3JtOiBzdHJpbmddOiB7XG4gICAgbmV4dEZyYW1lOiBOZXh0RnJhbWVGblxuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcGFuZWwvbWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
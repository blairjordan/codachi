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
    if (userPet.isTransitionIn) {
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
            _2.state.userPet.isTransitionIn = false;
        }
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
    (0, _2.setState)('userPet', userPet);
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
    (0, _2.setState)('basePetUri', basePetUri);
    // Expose petTypes to the window for XP bar calculations
    window.codachiApp = window.codachiApp || {};
    window.codachiApp.petTypes = _2.petTypes;
    if (userPet) {
        // Only play the transition animation for eggs or if explicitly requested
        if (userPet.level > 0) {
            userPet.isTransitionIn = false;
        }
        // Add the pet to the panel
        (0, exports.addPetToPanel)({ userPet });
    }
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', (event) => {
        const { command, data } = event.data; // The data that the extension sent
        switch (command) {
            case 'spawn-pet':
                (0, exports.addPetToPanel)({ userPet: data.userPet });
                break;
            case 'update-pet': {
                // Check if this is just an XP update
                if (data.isXPUpdate && _2.state.userPet) {
                    // Just update the XP value without resetting animation state
                    _2.state.userPet.xp = data.userPet.xp;
                    return;
                }
                // For other updates (level changes, etc.), do a full refresh
                // Preserve the current position and direction
                const updatedPet = Object.assign(Object.assign({}, data.userPet), { leftPosition: _2.state.userPet.leftPosition, direction: _2.state.userPet.direction });
                // Add the pet to the panel for a full refresh
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxLQUFLO0lBQy9DLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHO0lBRTdDLDRCQUE0QjtJQUM1QixNQUFNLGNBQWMsR0FBRyxjQUFjLEdBQUcsV0FBVztJQUVuRCx1REFBdUQ7SUFDdkQsSUFBSSxZQUFZLEdBQUcsU0FBUztJQUM1QixJQUFJLFlBQVksSUFBSSxjQUFjLEVBQUU7UUFDbEMsWUFBWSxHQUFHLFlBQVMsQ0FBQyxJQUFJO0tBQzlCO1NBQU0sSUFBSSxZQUFZLElBQUksVUFBVSxFQUFFO1FBQ3JDLFlBQVksR0FBRyxZQUFTLENBQUMsS0FBSztLQUMvQjtJQUVELHFDQUFxQztJQUNyQyxJQUFJLGVBQXVCO0lBQzNCLElBQUksWUFBWSxLQUFLLFlBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDcEMsZUFBZSxHQUFHLFlBQVksR0FBRyxLQUFLO0tBQ3ZDO1NBQU07UUFDTCxlQUFlLEdBQUcsWUFBWSxHQUFHLEtBQUs7S0FDdkM7SUFFRCxPQUFPO1FBQ0wsWUFBWSxFQUFFLGVBQWU7UUFDN0IsU0FBUyxFQUFFLFlBQVk7S0FDeEI7QUFDSCxDQUFDO0FBdENZLGVBQU8sV0FzQ25COzs7Ozs7Ozs7Ozs7OztBQ3RDRCxJQUFZLFNBR1g7QUFIRCxXQUFZLFNBQVM7SUFDbkIsMkNBQVM7SUFDVCwwQ0FBUztBQUNYLENBQUMsRUFIVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQUdwQjs7Ozs7OztVQ3ZERDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9kb20udHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9pbmRleC50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL21haW4udHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9wZXRzLnRzIiwid2VicGFjazovL2NvZGFjaGlBcHAvLi9zcmMvcGFuZWwvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC90cmFuc2Zvcm1zLnRzIiwid2VicGFjazovL2NvZGFjaGlBcHAvLi9zcmMvcGFuZWwvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIERPTSB7XG4gIHByaXZhdGUgX3BldEltYWdlU2VsZWN0b3I6IHN0cmluZ1xuICBwcml2YXRlIF9tb3ZlbWVudENvbnRhaW5lclNlbGVjdG9yOiBzdHJpbmdcbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yOiBzdHJpbmdcbiAgcHJpdmF0ZSBfdHJhbnNpdGlvblNlbGVjdG9yOiBzdHJpbmdcblxuICBwcml2YXRlIF9tb3ZlbWVudENvbnRhaW5lckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkXG4gIHByaXZhdGUgX3BldEltYWdlRWxlbWVudDogSFRNTEltYWdlRWxlbWVudCB8IHVuZGVmaW5lZFxuICBwcml2YXRlIF90cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWRcbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbkltYWdlRWxlbWVudDogSFRNTEltYWdlRWxlbWVudCB8IHVuZGVmaW5lZFxuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBtb3ZlbWVudENvbnRhaW5lclNlbGVjdG9yLFxuICAgIHBldEltYWdlU2VsZWN0b3IsXG4gICAgdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yLFxuICAgIHRyYW5zaXRpb25TZWxlY3RvcixcbiAgfToge1xuICAgIHBldEltYWdlU2VsZWN0b3I6IHN0cmluZ1xuICAgIG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3I6IHN0cmluZ1xuICAgIHRyYW5zaXRpb25Db250YWluZXJTZWxlY3Rvcjogc3RyaW5nXG4gICAgdHJhbnNpdGlvblNlbGVjdG9yOiBzdHJpbmdcbiAgfSkge1xuICAgIHRoaXMuX3BldEltYWdlU2VsZWN0b3IgPSBwZXRJbWFnZVNlbGVjdG9yXG4gICAgdGhpcy5fbW92ZW1lbnRDb250YWluZXJTZWxlY3RvciA9IG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3JcbiAgICB0aGlzLl90cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3IgPSB0cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3JcbiAgICB0aGlzLl90cmFuc2l0aW9uU2VsZWN0b3IgPSB0cmFuc2l0aW9uU2VsZWN0b3JcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRIVE1MRWxlbWVudCA9IDxUPihlbGVtZW50TmFtZTogc3RyaW5nKTogVCA9PiB7XG4gICAgY29uc3QgaHRtbEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50TmFtZSkgYXMgdW5rbm93blxuICAgIGlmICghaHRtbEVsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGxvY2F0ZSBlbGVtZW50IGluIERPTTogJHtlbGVtZW50TmFtZX1gKVxuICAgIH1cblxuICAgIHJldHVybiBodG1sRWxlbWVudCBhcyBUXG4gIH1cblxuICBnZXRNb3ZlbWVudFNlbGVjdG9yKCk6IEhUTUxFbGVtZW50IHtcbiAgICBpZiAoIXRoaXMuX21vdmVtZW50Q29udGFpbmVyRWxlbWVudCkge1xuICAgICAgdGhpcy5fbW92ZW1lbnRDb250YWluZXJFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MRWxlbWVudD4oXG4gICAgICAgIHRoaXMuX21vdmVtZW50Q29udGFpbmVyU2VsZWN0b3JcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX21vdmVtZW50Q29udGFpbmVyRWxlbWVudFxuICB9XG5cbiAgZ2V0UGV0SW1hZ2VTZWxlY3RvcigpOiBIVE1MSW1hZ2VFbGVtZW50IHtcbiAgICBpZiAoIXRoaXMuX3BldEltYWdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fcGV0SW1hZ2VFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MSW1hZ2VFbGVtZW50PihcbiAgICAgICAgdGhpcy5fcGV0SW1hZ2VTZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcGV0SW1hZ2VFbGVtZW50XG4gIH1cblxuICBnZXRUcmFuc2l0aW9uU2VsZWN0b3IoKTogSFRNTEVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX3RyYW5zaXRpb25Db250YWluZXJFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MRWxlbWVudD4oXG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25Db250YWluZXJTZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnRcbiAgfVxuXG4gIGdldFRyYW5zaXRpb25JbWFnZVNlbGVjdG9yKCk6IEhUTUxJbWFnZUVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fdHJhbnNpdGlvbkltYWdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbkltYWdlRWxlbWVudCA9IHRoaXMuZ2V0SFRNTEVsZW1lbnQ8SFRNTEltYWdlRWxlbWVudD4oXG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25TZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHJhbnNpdGlvbkltYWdlRWxlbWVudFxuICB9XG59XG4iLCJpbXBvcnQgeyBET00gfSBmcm9tICcuL2RvbSdcbmltcG9ydCB7XG4gIGdlbmVyYXRlUGV0LFxuICBnZXRQZXRBbmltYXRpb25zLFxuICBnaWZzLFxuICBtdXRhdGVMZXZlbCxcbiAgcGV0VHlwZXMsXG4gIHJhbmRvbVBldE5hbWUsXG4gIHJhbmRvbVBldFR5cGUsXG59IGZyb20gJy4vcGV0cydcbmltcG9ydCB7IGluaXRpYWxpemVTdGF0ZSwgc2V0U3RhdGUsIHN0YXRlIH0gZnJvbSAnLi9zdGF0ZSdcbmltcG9ydCB7IHRyYW5zZm9ybXMgfSBmcm9tICcuL3RyYW5zZm9ybXMnXG5pbXBvcnQge1xuICBEaXJlY3Rpb24sXG4gIEdpZnMsXG4gIE5leHRGcmFtZUZuLFxuICBOZXh0RnJhbWVGblJldHVybixcbiAgTmV4dEZyYW1lT3B0cyxcbiAgUGV0LFxuICBQZXRBbmltYXRpb24sXG4gIFBldExldmVsLFxuICBQZXRTdGF0ZSxcbiAgUGV0VHlwZSxcbiAgU3RhdGUsXG4gIFRyYW5zZm9ybXMsXG4gIFVzZXJQZXQsXG4gIFVzZXJQZXRBcmdzLFxuICBVc2VyUGV0QmFzZVByb3BzLFxufSBmcm9tICcuL3R5cGVzJ1xuXG4vLyBGdW5jdGlvbiB0byBhZGp1c3Qgc3BlZWQgYmFzZWQgb24gc2NhbGVcbmV4cG9ydCBjb25zdCBhZGp1c3RTcGVlZEZvclNjYWxlID0gKFxuICBvcmlnaW5hbFNwZWVkOiBudW1iZXIsXG4gIHNjYWxlOiBudW1iZXJcbik6IG51bWJlciA9PiBvcmlnaW5hbFNwZWVkICogKDAuNyArIDAuNiAqIHNjYWxlKVxuXG5leHBvcnQge1xuICBEaXJlY3Rpb24sXG4gIERPTSxcbiAgZ2VuZXJhdGVQZXQsXG4gIGdldFBldEFuaW1hdGlvbnMsXG4gIGdpZnMsXG4gIEdpZnMsXG4gIGluaXRpYWxpemVTdGF0ZSxcbiAgbXV0YXRlTGV2ZWwsXG4gIE5leHRGcmFtZUZuLFxuICBOZXh0RnJhbWVGblJldHVybixcbiAgTmV4dEZyYW1lT3B0cyxcbiAgUGV0LFxuICBQZXRBbmltYXRpb24sXG4gIFBldExldmVsLFxuICBQZXRTdGF0ZSxcbiAgUGV0VHlwZSxcbiAgcGV0VHlwZXMsXG4gIHJhbmRvbVBldE5hbWUsXG4gIHJhbmRvbVBldFR5cGUsXG4gIHNldFN0YXRlLFxuICBTdGF0ZSxcbiAgc3RhdGUsXG4gIFRyYW5zZm9ybXMsXG4gIHRyYW5zZm9ybXMsXG4gIFVzZXJQZXQsXG4gIFVzZXJQZXRBcmdzLFxuICBVc2VyUGV0QmFzZVByb3BzLFxufVxuIiwiaW1wb3J0IHsgRE9NIH0gZnJvbSAnLi8nXG5pbXBvcnQgdHlwZSB7IFBldEFuaW1hdGlvbiwgVXNlclBldCB9IGZyb20gJy4vJ1xuaW1wb3J0IHtcbiAgZ2VuZXJhdGVQZXQsXG4gIGdpZnMsXG4gIHN0YXRlLFxuICBzZXRTdGF0ZSxcbiAgYWRqdXN0U3BlZWRGb3JTY2FsZSxcbiAgZ2V0UGV0QW5pbWF0aW9ucyxcbiAgdHJhbnNmb3JtcyxcbiAgcGV0VHlwZXMsXG59IGZyb20gJy4vJ1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN0YXRlIH0gZnJvbSAnLi9zdGF0ZSdcblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBjb2RhY2hpQXBwOiB7IFtrZXk6IHN0cmluZ106IHVua25vd24gfTtcbiAgICBpc0V4cGxvcmVyVmlldz86IGJvb2xlYW47XG4gIH1cbn1cblxuY29uc3QgZGVmYXVsdFN0YXRlID0ge1xuICB1c2VyUGV0OiBnZW5lcmF0ZVBldCh7IG5hbWU6ICd1bmtub3duJywgdHlwZTogJ3Vua25vd24nIH0pLFxuICBiYXNlUGV0VXJpOiAnJyxcbn1cblxuaW5pdGlhbGl6ZVN0YXRlKGRlZmF1bHRTdGF0ZSlcblxuY29uc3QgZG9tID0gbmV3IERPTSh7XG4gIG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3I6ICdtb3ZlbWVudC1jb250YWluZXInLFxuICBwZXRJbWFnZVNlbGVjdG9yOiAncGV0JyxcbiAgdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yOiAndHJhbnNpdGlvbi1jb250YWluZXInLFxuICB0cmFuc2l0aW9uU2VsZWN0b3I6ICd0cmFuc2l0aW9uJyxcbn0pXG5cbmNvbnN0IFRJQ0tfSU5URVJWQUxfTVMgPSAxMDBcblxuY29uc3QgdGljayA9ICh7IHVzZXJQZXQgfTogeyB1c2VyUGV0OiBVc2VyUGV0IH0pOiB2b2lkID0+IHtcbiAgY29uc3QgeyBsZWZ0UG9zaXRpb24sIGRpcmVjdGlvbiB9ID0gdHJhbnNmb3Jtc1t1c2VyUGV0LnN0YXRlXS5uZXh0RnJhbWUoe1xuICAgIGNvbnRhaW5lcldpZHRoOlxuICAgICAgd2luZG93LmlubmVyV2lkdGggfHxcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fFxuICAgICAgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCxcbiAgICBsZWZ0UG9zaXRpb246IHVzZXJQZXQubGVmdFBvc2l0aW9uLFxuICAgIGRpcmVjdGlvbjogdXNlclBldC5kaXJlY3Rpb24sXG4gICAgc3BlZWQ6IGFkanVzdFNwZWVkRm9yU2NhbGUodXNlclBldC5zcGVlZCwgdXNlclBldC5zY2FsZSksXG4gICAgb2Zmc2V0OiBnZXRQZXRBbmltYXRpb25zKHsgdXNlclBldCB9KS5hbmltYXRpb24ub2Zmc2V0IHx8IDAsXG4gICAgc2NhbGU6IHVzZXJQZXQuc2NhbGUsXG4gIH0pXG5cbiAgdXNlclBldC5sZWZ0UG9zaXRpb24gPSBsZWZ0UG9zaXRpb25cbiAgdXNlclBldC5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cblxuICAvLyBBcHBseSB0cmFuc2Zvcm1hdGlvblxuICBjb25zdCBtb3ZlbWVudENvbnRhaW5lciA9IGRvbS5nZXRNb3ZlbWVudFNlbGVjdG9yKClcbiAgbW92ZW1lbnRDb250YWluZXIuc3R5bGUubWFyZ2luTGVmdCA9IGAke3VzZXJQZXQubGVmdFBvc2l0aW9ufXB4YFxuXG4gIGNvbnN0IHBldEltYWdlRWxlbWVudCA9IGRvbS5nZXRQZXRJbWFnZVNlbGVjdG9yKClcbiAgcGV0SW1hZ2VFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZVgoJHt1c2VyUGV0LmRpcmVjdGlvbn0pIHNjYWxlKCR7dXNlclBldC5zY2FsZX0pYFxuXG4gIC8vIEdldCB0aGUgcGV0IGNvbnRhaW5lciBhbmQgYWRqdXN0IGl0cyBwb3NpdGlvbiB0byBrZWVwIHBldCBvbiB0aGUgZ3JvdW5kXG4gIGNvbnN0IHBldENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZXQtY29udGFpbmVyJylcbiAgaWYgKHBldENvbnRhaW5lcikge1xuICAgIGNvbnN0IHsgYW5pbWF0aW9uIH0gPSBnZXRQZXRBbmltYXRpb25zKHsgdXNlclBldCB9KVxuICAgIGNvbnN0IHZlcnRpY2FsQWRqdXN0bWVudCA9IChhbmltYXRpb24uaGVpZ2h0ICogKHVzZXJQZXQuc2NhbGUgLSAxKSkgLyAyXG4gICAgcGV0Q29udGFpbmVyLnN0eWxlLmJvdHRvbSA9IGAke3ZlcnRpY2FsQWRqdXN0bWVudH1weGBcbiAgfVxuXG4gIGlmICh1c2VyUGV0LmlzVHJhbnNpdGlvbkluKSB7XG4gICAgY29uc3QgeyB0cmFuc2l0aW9uOiBhbmltYXRpb24gfSA9IGdldFBldEFuaW1hdGlvbnMoe1xuICAgICAgdXNlclBldCxcbiAgICB9KVxuXG4gICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgY29uc3QgdHJhbnNpdGlvbkNvbnRhaW5lciA9IGRvbS5nZXRUcmFuc2l0aW9uU2VsZWN0b3IoKVxuICAgICAgdHJhbnNpdGlvbkNvbnRhaW5lci5zdHlsZS5tYXJnaW5MZWZ0ID0gYCR7dXNlclBldC5sZWZ0UG9zaXRpb259cHhgXG5cbiAgICAgIC8vIEFsc28gYWRqdXN0IHRyYW5zaXRpb24gY29udGFpbmVyIGhlaWdodFxuICAgICAgY29uc3QgdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgJ3RyYW5zaXRpb24tY29udGFpbmVyJ1xuICAgICAgKVxuICAgICAgaWYgKHRyYW5zaXRpb25Db250YWluZXJFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHZlcnRpY2FsQWRqdXN0bWVudCA9IChhbmltYXRpb24uaGVpZ2h0ICogKHVzZXJQZXQuc2NhbGUgLSAxKSkgLyAyXG4gICAgICAgIHRyYW5zaXRpb25Db250YWluZXJFbGVtZW50LnN0eWxlLmJvdHRvbSA9IGAke3ZlcnRpY2FsQWRqdXN0bWVudH1weGBcbiAgICAgIH1cblxuICAgICAgc2V0SW1hZ2Uoe1xuICAgICAgICBjb250YWluZXI6IGRvbS5nZXRUcmFuc2l0aW9uU2VsZWN0b3IoKSxcbiAgICAgICAgc2VsZWN0b3I6IGRvbS5nZXRUcmFuc2l0aW9uSW1hZ2VTZWxlY3RvcigpLFxuICAgICAgICBhbmltYXRpb24sXG4gICAgICB9KVxuICAgICAgc3RhdGUudXNlclBldC5pc1RyYW5zaXRpb25JbiA9IGZhbHNlXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHNldEltYWdlID0gKHtcbiAgY29udGFpbmVyLFxuICBzZWxlY3RvcixcbiAgYW5pbWF0aW9uLFxufToge1xuICBjb250YWluZXI6IEhUTUxFbGVtZW50XG4gIHNlbGVjdG9yOiBIVE1MSW1hZ2VFbGVtZW50XG4gIGFuaW1hdGlvbjogUGV0QW5pbWF0aW9uXG59KTogdm9pZCA9PiB7XG4gIGNvbnN0IHsgYmFzZVBldFVyaSwgdXNlclBldCB9ID0gc3RhdGVcblxuICBzZWxlY3Rvci5zcmMgPSBgJHtiYXNlUGV0VXJpfS8ke2dpZnNbYW5pbWF0aW9uLmdpZl19YFxuICBzZWxlY3Rvci53aWR0aCA9IGFuaW1hdGlvbi53aWR0aFxuICBzZWxlY3Rvci5zdHlsZS5taW5XaWR0aCA9IGAke2FuaW1hdGlvbi53aWR0aH1weGBcbiAgc2VsZWN0b3IuaGVpZ2h0ID0gYW5pbWF0aW9uLmhlaWdodFxuXG4gIC8vIEZvciBwZXQgaW1hZ2UsIHdlIG5lZWQgdG8gbWFpbnRhaW4gc2NhbGVYIGZvciBkaXJlY3Rpb25cbiAgaWYgKHNlbGVjdG9yID09PSBkb20uZ2V0UGV0SW1hZ2VTZWxlY3RvcigpKSB7XG4gICAgc2VsZWN0b3Iuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlWCgke3VzZXJQZXQuZGlyZWN0aW9ufSkgc2NhbGUoJHt1c2VyUGV0LnNjYWxlfSlgXG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIHRyYW5zaXRpb24gaW1hZ2VzLCBqdXN0IGFwcGx5IHRoZSBzY2FsZVxuICAgIHNlbGVjdG9yLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3VzZXJQZXQuc2NhbGV9KWBcbiAgfVxuXG4gIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gYCR7YW5pbWF0aW9uLm9mZnNldCA/PyAwfXB4YFxufVxuXG5jb25zdCBzbGVlcCA9IChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PlxuICBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBtcykpXG5cbmNvbnN0IHN0YXJ0QW5pbWF0aW9uID0gKCk6IHZvaWQgPT4ge1xuICBjb25zdCB7IHVzZXJQZXQgfSA9IHN0YXRlXG4gIGlmIChzdGF0ZS5pbnRlcnZhbElkKSB7XG4gICAgY2xlYXJJbnRlcnZhbChzdGF0ZS5pbnRlcnZhbElkKVxuICB9XG4gIGNvbnN0IGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgdGljayh7IHVzZXJQZXQgfSlcbiAgfSwgVElDS19JTlRFUlZBTF9NUylcbiAgc2V0U3RhdGUoJ2ludGVydmFsSWQnLCBpbnRlcnZhbElkKVxufVxuXG5leHBvcnQgY29uc3QgYWRkUGV0VG9QYW5lbCA9IGFzeW5jICh7XG4gIHVzZXJQZXQsXG59OiB7XG4gIHVzZXJQZXQ6IFVzZXJQZXRcbn0pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3QgeyBhbmltYXRpb24gfSA9IGdldFBldEFuaW1hdGlvbnMoe1xuICAgIHVzZXJQZXQsXG4gIH0pXG5cbiAgLy8gU3RvcmUgdGhlIG9yaWdpbmFsIHNwZWVkIGlmIGl0J3Mgbm90IGFscmVhZHkgc2V0XG4gIGlmICghdXNlclBldC5vcmlnaW5hbFNwZWVkICYmIGFuaW1hdGlvbi5zcGVlZCkge1xuICAgIHVzZXJQZXQub3JpZ2luYWxTcGVlZCA9IGFuaW1hdGlvbi5zcGVlZFxuICB9XG5cbiAgaWYgKHVzZXJQZXQub3JpZ2luYWxTcGVlZCkge1xuICAgIHVzZXJQZXQuc3BlZWQgPSBhZGp1c3RTcGVlZEZvclNjYWxlKHVzZXJQZXQub3JpZ2luYWxTcGVlZCwgdXNlclBldC5zY2FsZSlcbiAgfVxuXG4gIHNldFN0YXRlKCd1c2VyUGV0JywgdXNlclBldClcbiAgc3RhcnRBbmltYXRpb24oKVxuXG4gIC8vIEdpdmUgdGhlIHRyYW5zaXRpb24gYSBjaGFuY2UgdG8gcGxheVxuICBhd2FpdCBzbGVlcChUSUNLX0lOVEVSVkFMX01TICogMilcblxuICBzZXRJbWFnZSh7XG4gICAgc2VsZWN0b3I6IGRvbS5nZXRQZXRJbWFnZVNlbGVjdG9yKCksXG4gICAgYW5pbWF0aW9uLFxuICAgIGNvbnRhaW5lcjogZG9tLmdldE1vdmVtZW50U2VsZWN0b3IoKSxcbiAgfSlcblxuICAvLyBBcHBseSB2ZXJ0aWNhbCBwb3NpdGlvbiBhZGp1c3RtZW50IGZvciB0aGUgcGV0IGNvbnRhaW5lclxuICBjb25zdCBwZXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGV0LWNvbnRhaW5lcicpXG4gIGlmIChwZXRDb250YWluZXIpIHtcbiAgICBjb25zdCB2ZXJ0aWNhbEFkanVzdG1lbnQgPSAoYW5pbWF0aW9uLmhlaWdodCAqICh1c2VyUGV0LnNjYWxlIC0gMSkpIC8gMlxuICAgIHBldENvbnRhaW5lci5zdHlsZS5ib3R0b20gPSBgJHt2ZXJ0aWNhbEFkanVzdG1lbnR9cHhgXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFwcCA9ICh7XG4gIHVzZXJQZXQsXG4gIGJhc2VQZXRVcmksXG59OiB7XG4gIHVzZXJQZXQ6IFVzZXJQZXRcbiAgYmFzZVBldFVyaTogc3RyaW5nXG59KTogdm9pZCA9PiB7XG4gIHNldFN0YXRlKCdiYXNlUGV0VXJpJywgYmFzZVBldFVyaSlcbiAgXG4gIC8vIEV4cG9zZSBwZXRUeXBlcyB0byB0aGUgd2luZG93IGZvciBYUCBiYXIgY2FsY3VsYXRpb25zXG4gIHdpbmRvdy5jb2RhY2hpQXBwID0gd2luZG93LmNvZGFjaGlBcHAgfHwge307XG4gIHdpbmRvdy5jb2RhY2hpQXBwLnBldFR5cGVzID0gcGV0VHlwZXM7XG5cbiAgaWYgKHVzZXJQZXQpIHtcbiAgICAvLyBPbmx5IHBsYXkgdGhlIHRyYW5zaXRpb24gYW5pbWF0aW9uIGZvciBlZ2dzIG9yIGlmIGV4cGxpY2l0bHkgcmVxdWVzdGVkXG4gICAgaWYgKHVzZXJQZXQubGV2ZWwgPiAwKSB7XG4gICAgICB1c2VyUGV0LmlzVHJhbnNpdGlvbkluID0gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIHBldCB0byB0aGUgcGFuZWxcbiAgICBhZGRQZXRUb1BhbmVsKHsgdXNlclBldCB9KVxuICB9XG4gIFxuICAvLyBIYW5kbGUgbWVzc2FnZXMgc2VudCBmcm9tIHRoZSBleHRlbnNpb24gdG8gdGhlIHdlYnZpZXdcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IGNvbW1hbmQsIGRhdGEgfSA9IGV2ZW50LmRhdGEgLy8gVGhlIGRhdGEgdGhhdCB0aGUgZXh0ZW5zaW9uIHNlbnRcbiAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICAgIGNhc2UgJ3NwYXduLXBldCc6XG4gICAgICAgIGFkZFBldFRvUGFuZWwoeyB1c2VyUGV0OiBkYXRhLnVzZXJQZXQgfSlcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAndXBkYXRlLXBldCc6IHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyBqdXN0IGFuIFhQIHVwZGF0ZVxuICAgICAgICBpZiAoZGF0YS5pc1hQVXBkYXRlICYmIHN0YXRlLnVzZXJQZXQpIHtcbiAgICAgICAgICAvLyBKdXN0IHVwZGF0ZSB0aGUgWFAgdmFsdWUgd2l0aG91dCByZXNldHRpbmcgYW5pbWF0aW9uIHN0YXRlXG4gICAgICAgICAgc3RhdGUudXNlclBldC54cCA9IGRhdGEudXNlclBldC54cDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIEZvciBvdGhlciB1cGRhdGVzIChsZXZlbCBjaGFuZ2VzLCBldGMuKSwgZG8gYSBmdWxsIHJlZnJlc2hcbiAgICAgICAgLy8gUHJlc2VydmUgdGhlIGN1cnJlbnQgcG9zaXRpb24gYW5kIGRpcmVjdGlvblxuICAgICAgICBjb25zdCB1cGRhdGVkUGV0ID0ge1xuICAgICAgICAgIC4uLmRhdGEudXNlclBldCxcbiAgICAgICAgICBsZWZ0UG9zaXRpb246IHN0YXRlLnVzZXJQZXQubGVmdFBvc2l0aW9uLFxuICAgICAgICAgIGRpcmVjdGlvbjogc3RhdGUudXNlclBldC5kaXJlY3Rpb24sXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgdGhlIHBldCB0byB0aGUgcGFuZWwgZm9yIGEgZnVsbCByZWZyZXNoXG4gICAgICAgIGFkZFBldFRvUGFuZWwoeyB1c2VyUGV0OiB1cGRhdGVkUGV0IH0pXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuIiwiaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnLi8nXG5cbmltcG9ydCB0eXBlIHtcbiAgR2lmcyxcbiAgUGV0LFxuICBQZXRBbmltYXRpb24sXG4gIFBldExldmVsLFxuICBQZXRUeXBlLFxuICBVc2VyUGV0LFxuICBVc2VyUGV0QXJncyxcbn0gZnJvbSAnLi8nXG5cbmV4cG9ydCBjb25zdCBnaWZzOiBHaWZzID0ge1xuICBlZ2cxOiAnZWdnMS5naWYnLFxuICBkdXN0MTogJ2R1c3QxLmdpZicsXG4gIGR1c3QyOiAnZHVzdDIuZ2lmJyxcbiAgbW9uc3RlcjFwaGFzZTE6ICdtMWQxLmdpZicsXG4gIG1vbnN0ZXIxcGhhc2UyOiAnbTFkMi5naWYnLFxuICBtb25zdGVyMXBoYXNlMzogJ20xZDMuZ2lmJyxcbiAgbW9uc3RlcjJwaGFzZTE6ICdtMmQxLmdpZicsXG4gIG1vbnN0ZXIycGhhc2UyOiAnbTJkMi5naWYnLFxuICBtb25zdGVyMnBoYXNlMzogJ20yZDMuZ2lmJyxcbiAgbW9uc3RlcjNwaGFzZTE6ICdtM2QxLmdpZicsXG4gIG1vbnN0ZXIzcGhhc2UyOiAnbTNkMi5naWYnLFxuICBtb25zdGVyM3BoYXNlMzogJ20zZDMuZ2lmJyxcbiAgbW9uc3RlcjRwaGFzZTE6ICdtNGQxLmdpZicsXG4gIG1vbnN0ZXI0cGhhc2UyOiAnbTRkMi5naWYnLFxuICBtb25zdGVyNHBoYXNlMzogJ200ZDMuZ2lmJyxcbiAgbW9uc3RlcjVwaGFzZTE6ICdtNWQxLmdpZicsXG4gIG1vbnN0ZXI1cGhhc2UyOiAnbTVkMi5naWYnLFxuICBtb25zdGVyNXBoYXNlMzogJ201ZDMuZ2lmJyxcbiAgbW9uc3RlcjZwaGFzZTE6ICdtNmQxLmdpZicsXG4gIG1vbnN0ZXI2cGhhc2UyOiAnbTZkMi5naWYnLFxuICBtb25zdGVyNnBoYXNlMzogJ202ZDMuZ2lmJyxcbn1cblxuZXhwb3J0IGNvbnN0IHBldE5hbWVzID0gW1xuICAnYm9vJyxcbiAgJ25hY2hvJyxcbiAgJ2dhcnknLFxuICAnZnVkZ2UnLFxuICAnbmVrbycsXG4gICdwaXAnLFxuICAnYmlibycsXG4gICdmaWZpJyxcbiAgJ2pheCcsXG4gICdib2JiYScsXG4gICdnaWRnZXQnLFxuICAnbWluYScsXG4gICdjcnVtYicsXG4gICd6aW1ibycsXG4gICdkdXN0eScsXG4gICdicm9jaycsXG4gICdvdGlzJyxcbiAgJ21hcnZpbicsXG4gICdzbW9rZXknLFxuICAnYmFycnknLFxuICAndG9ueScsXG4gICdkdXN0eScsXG4gICdtb2NoaScsXG5dXG5cbmNvbnN0IGFuaW1hdGlvbkRlZmF1bHRzID0ge1xuICB3aWR0aDogNzUsXG4gIGhlaWdodDogNjQsXG4gIHNwZWVkOiAwLFxuICBvZmZzZXQ6IDAsXG59XG5cbmNvbnN0IGVnZzogUGV0TGV2ZWwgPSB7XG4gIHhwOiAwLFxuICBkZWZhdWx0U3RhdGU6ICdpZGxlJyxcbiAgYW5pbWF0aW9uczoge1xuICAgIGlkbGU6IHtcbiAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgZ2lmOiAnZWdnMScsXG4gICAgfSxcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgIGdpZjogJ2R1c3QxJyxcbiAgICAgIG9mZnNldDogLTEzLFxuICAgICAgd2lkdGg6IDEwMCxcbiAgICAgIGhlaWdodDogMTAwLFxuICAgIH0sXG4gIH0sXG59XG5cbi8vIEdlbmVyaWMgZXZvbHV0aW9uIHRyYW5zaXRpb25cbmNvbnN0IHRyYW5zaXRpb246IFBldEFuaW1hdGlvbiA9IHtcbiAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gIGdpZjogJ2R1c3QyJyxcbiAgb2Zmc2V0OiAtOTUsXG4gIHdpZHRoOiAyODAsXG4gIGhlaWdodDogMTAwLFxufVxuXG5leHBvcnQgY29uc3QgcGV0VHlwZXMgPSBuZXcgTWFwPHN0cmluZywgUGV0PihbXG4gIFtcbiAgICAnbW9uc3RlcjEnLFxuICAgIHtcbiAgICAgIGxldmVsczogbmV3IE1hcChbXG4gICAgICAgIFswLCBlZ2ddLFxuICAgICAgICBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMzUsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIxcGhhc2UxJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDE1MDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjFwaGFzZTInLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMjQwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMXBoYXNlMycsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuICBbXG4gICAgJ21vbnN0ZXIyJyxcbiAgICB7XG4gICAgICBsZXZlbHM6IG5ldyBNYXAoW1xuICAgICAgICBbMCwgZWdnXSxcbiAgICAgICAgW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDM1LFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMnBoYXNlMScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMTAwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMnBoYXNlMicsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNjAwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMnBoYXNlMycsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyMycsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjNwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDU5OTkwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjNwaGFzZTInLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDYwMDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjNwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF0pLFxuICAgIH0sXG4gIF0sXG4gIFtcbiAgICAnbW9uc3RlcjQnLFxuICAgIHtcbiAgICAgIGxldmVsczogbmV3IE1hcChbXG4gICAgICAgIFswLCBlZ2ddLFxuICAgICAgICBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMzUsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI0cGhhc2UxJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAxNTAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI0cGhhc2UyJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAyNDAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI0cGhhc2UzJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuICBbXG4gICAgJ21vbnN0ZXI1JyxcbiAgICB7XG4gICAgICBsZXZlbHM6IG5ldyBNYXAoW1xuICAgICAgICBbMCwgZWdnXSxcbiAgICAgICAgW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDM1LFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNXBoYXNlMScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIGhlaWdodDogNjYsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAxNTAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI1cGhhc2UyJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMjQwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNXBoYXNlMycsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxMzUsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEyNSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF0pLFxuICAgIH0sXG4gIF0sXG4gIFtcbiAgICAnbW9uc3RlcjYnLFxuICAgIHtcbiAgICAgIGxldmVsczogbmV3IE1hcChbXG4gICAgICAgIFswLCBlZ2ddLFxuICAgICAgICBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMzUsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI2cGhhc2UxJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDE1MDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjZwaGFzZTInLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAzLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNjQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMjQwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNnBoYXNlMycsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2NCxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuXSlcblxuZXhwb3J0IGNvbnN0IHJhbmRvbVBldFR5cGUgPSAoKTogUGV0VHlwZSA9PlxuICBBcnJheS5mcm9tKHBldFR5cGVzLmtleXMoKSlbXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGV0VHlwZXMuc2l6ZSlcbiAgXSBhcyBQZXRUeXBlXG5cbmV4cG9ydCBjb25zdCByYW5kb21QZXROYW1lID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IG5hbWUgPSBwZXROYW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwZXROYW1lcy5sZW5ndGgpXVxuICByZXR1cm4gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0UGV0QW5pbWF0aW9ucyA9ICh7XG4gIHVzZXJQZXQsXG59OiB7XG4gIHVzZXJQZXQ6IFVzZXJQZXRcbn0pOiB7XG4gIGFuaW1hdGlvbjogUGV0QW5pbWF0aW9uXG4gIHRyYW5zaXRpb246IFBldEFuaW1hdGlvbiB8IHVuZGVmaW5lZFxufSA9PiB7XG4gIGNvbnN0IHBldFR5cGVGb3VuZCA9IHBldFR5cGVzLmdldCh1c2VyUGV0LnR5cGUpXG4gIGlmICghcGV0VHlwZUZvdW5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBQZXQgdHlwZSBub3QgZm91bmQ6ICR7dXNlclBldC50eXBlfWApXG4gIH1cblxuICBjb25zdCBsZXZlbEZvdW5kID0gcGV0VHlwZUZvdW5kLmxldmVscy5nZXQodXNlclBldC5sZXZlbClcbiAgaWYgKCFsZXZlbEZvdW5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYFBldCBsZXZlbCBub3QgZm91bmQgZm9yIHBldCB0eXBlICR7dXNlclBldC50eXBlfTogJHt1c2VyUGV0LmxldmVsfWBcbiAgICApXG4gIH1cblxuICBpZiAoISh1c2VyUGV0LnN0YXRlIGluIGxldmVsRm91bmQuYW5pbWF0aW9ucykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgQW5pbWF0aW9uIG5vdCBmb3VuZCBmb3IgcGV0IHR5cGUgJHt1c2VyUGV0LnR5cGV9LCBsZXZlbCAke3VzZXJQZXQubGV2ZWx9OiAke3VzZXJQZXQuc3RhdGV9YFxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHRyYW5zaXRpb24gPVxuICAgICd0cmFuc2l0aW9uJyBpbiBsZXZlbEZvdW5kLmFuaW1hdGlvbnNcbiAgICAgID8gbGV2ZWxGb3VuZC5hbmltYXRpb25zLnRyYW5zaXRpb25cbiAgICAgIDogdW5kZWZpbmVkXG5cbiAgcmV0dXJuIHtcbiAgICBhbmltYXRpb246IGxldmVsRm91bmQuYW5pbWF0aW9uc1t1c2VyUGV0LnN0YXRlXSxcbiAgICB0cmFuc2l0aW9uLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVBldCA9ICh7IG5hbWUsIHR5cGUgfTogVXNlclBldEFyZ3MpOiBVc2VyUGV0ID0+ICh7XG4gIGxlZnRQb3NpdGlvbjogMCxcbiAgc3BlZWQ6IDAsXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uLnJpZ2h0LFxuICBsZXZlbDogMCxcbiAgeHA6IDAsXG4gIC8vIEFsbCBsZXZlbCAwIGNoYXJhY3RlcnMgcmVxdWlyZSB0aGlzIHN0YXRlXG4gIHN0YXRlOiAnaWRsZScsXG4gIGlzVHJhbnNpdGlvbkluOiB0cnVlLFxuICBuYW1lLFxuICB0eXBlLFxuICBzY2FsZTogMSxcbn0pXG5cbmV4cG9ydCBjb25zdCBnZXRMZXZlbCA9ICh7XG4gIHBldFR5cGUsXG4gIGxldmVsLFxufToge1xuICBwZXRUeXBlOiBQZXRUeXBlXG4gIGxldmVsOiBudW1iZXJcbn0pID0+IHtcbiAgY29uc3QgcGV0VHlwZUZvdW5kID0gcGV0VHlwZXMuZ2V0KHBldFR5cGUpXG4gIGlmICghcGV0VHlwZUZvdW5kKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cbiAgY29uc3QgbGV2ZWxGb3VuZCA9IHBldFR5cGVGb3VuZC5sZXZlbHMuZ2V0KGxldmVsKVxuICBpZiAoIWxldmVsRm91bmQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICByZXR1cm4gbGV2ZWxGb3VuZFxufVxuXG5leHBvcnQgY29uc3QgbXV0YXRlTGV2ZWwgPSAoeyB1c2VyUGV0IH06IHsgdXNlclBldDogVXNlclBldCB9KSA9PiB7XG4gIGNvbnN0IG5leHRMZXZlbEZvdW5kID0gZ2V0TGV2ZWwoe1xuICAgIHBldFR5cGU6IHVzZXJQZXQudHlwZSxcbiAgICBsZXZlbDogdXNlclBldC5sZXZlbCArIDEsXG4gIH0pXG5cbiAgaWYgKCFuZXh0TGV2ZWxGb3VuZCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHVzZXJQZXQueHAgPj0gbmV4dExldmVsRm91bmQueHApIHtcbiAgICB1c2VyUGV0LmxldmVsICs9IDFcbiAgICB1c2VyUGV0LnhwID0gMFxuICAgIHVzZXJQZXQuc3RhdGUgPSBuZXh0TGV2ZWxGb3VuZC5kZWZhdWx0U3RhdGVcbiAgICB1c2VyUGV0LnNwZWVkID0gbmV4dExldmVsRm91bmQuYW5pbWF0aW9uc1t1c2VyUGV0LnN0YXRlXS5zcGVlZCB8fCAwXG4gICAgdXNlclBldC5pc1RyYW5zaXRpb25JbiA9IHRydWVcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBTdGF0ZSB9IGZyb20gJy4vJ1xuXG5leHBvcnQgbGV0IHN0YXRlOiBTdGF0ZVxuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZVN0YXRlID0gKGluaXRpYWxTdGF0ZTogU3RhdGUpOiB2b2lkID0+IHtcbiAgc3RhdGUgPSBpbml0aWFsU3RhdGVcbn1cblxuZXhwb3J0IGNvbnN0IHNldFN0YXRlID0gPEsgZXh0ZW5kcyBrZXlvZiBTdGF0ZT4oXG4gIGtleTogSyxcbiAgdmFsdWU6IFN0YXRlW0tdXG4pOiBTdGF0ZSA9PiB7XG4gIHN0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIFtrZXldOiB2YWx1ZSxcbiAgfVxuICByZXR1cm4gc3RhdGVcbn1cbiIsImltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4vJ1xuaW1wb3J0IHR5cGUgeyBOZXh0RnJhbWVPcHRzLCBUcmFuc2Zvcm1zIH0gZnJvbSAnLi8nXG5cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1zOiBUcmFuc2Zvcm1zID0ge1xuICBpZGxlOiB7XG4gICAgbmV4dEZyYW1lOiAoeyBkaXJlY3Rpb24sIG9mZnNldCwgc2NhbGUgfTogTmV4dEZyYW1lT3B0cykgPT4gKHtcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIGxlZnRQb3NpdGlvbjogb2Zmc2V0LFxuICAgICAgc2NhbGUsXG4gICAgfSksXG4gIH0sXG4gIHdhbGtpbmc6IHtcbiAgICBuZXh0RnJhbWU6ICh7XG4gICAgICBjb250YWluZXJXaWR0aCxcbiAgICAgIGxlZnRQb3NpdGlvbjogb2xkTGVmdFBvc2l0aW9uLFxuICAgICAgZGlyZWN0aW9uOiBvbGREaXJlY3Rpb24sXG4gICAgICBzcGVlZCxcbiAgICAgIHNjYWxlLFxuICAgIH06IE5leHRGcmFtZU9wdHMpID0+IHtcbiAgICAgIC8vIERldGVjdCBpZiB3ZSdyZSBpbiBleHBsb3JlciB2aWV3IG1vZGUgKHNldCBpbiBleHRlbnNpb24udHMpXG4gICAgICBjb25zdCBpc0V4cGxvcmVyVmlldyA9XG4gICAgICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICh3aW5kb3cgYXMgV2luZG93ICYgeyBpc0V4cGxvcmVyVmlldz86IGJvb2xlYW4gfSkuaXNFeHBsb3JlclZpZXcgPT09XG4gICAgICAgICAgdHJ1ZVxuXG4gICAgICAvLyBVc2UgZGlmZmVyZW50IGJvdW5kYXJpZXMgYmFzZWQgb24gdmlldyB0eXBlXG4gICAgICBjb25zdCByaWdodE1hcmdpbiA9IGlzRXhwbG9yZXJWaWV3ID8gNjAgOiA4MFxuICAgICAgY29uc3QgbGVmdE1hcmdpbiA9IGlzRXhwbG9yZXJWaWV3ID8gLTE1IDogc3BlZWRcblxuICAgICAgLy8gRGV0ZXJtaW5lIGRpcmVjdGlvbiBiYXNlZCBvbiBwb3NpdGlvblxuICAgICAgY29uc3QgZGlyZWN0aW9uID1cbiAgICAgICAgb2xkTGVmdFBvc2l0aW9uID49IGNvbnRhaW5lcldpZHRoIC0gc3BlZWQgLSByaWdodE1hcmdpblxuICAgICAgICAgID8gRGlyZWN0aW9uLmxlZnRcbiAgICAgICAgICA6IG9sZExlZnRQb3NpdGlvbiA8PSBsZWZ0TWFyZ2luXG4gICAgICAgICAgPyBEaXJlY3Rpb24ucmlnaHRcbiAgICAgICAgICA6IG9sZERpcmVjdGlvblxuXG4gICAgICAvLyBVcGRhdGUgcG9zaXRpb24gYmFzZWQgb24gZGlyZWN0aW9uXG4gICAgICBjb25zdCBsZWZ0UG9zaXRpb24gPVxuICAgICAgICBkaXJlY3Rpb24gPT09IERpcmVjdGlvbi5yaWdodFxuICAgICAgICAgID8gb2xkTGVmdFBvc2l0aW9uICsgc3BlZWRcbiAgICAgICAgICA6IG9sZExlZnRQb3NpdGlvbiAtIHNwZWVkXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgbGVmdFBvc2l0aW9uLFxuICAgICAgICBzY2FsZSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxufVxuXG5leHBvcnQgY29uc3Qgd2Fsa2luZyA9IChcbiAgY29udGFpbmVyV2lkdGg6IG51bWJlcixcbiAgc3BlZWQ6IG51bWJlcixcbiAgbGVmdFBvc2l0aW9uOiBudW1iZXIsXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uXG4pOiB7IGxlZnRQb3NpdGlvbjogbnVtYmVyOyBkaXJlY3Rpb246IERpcmVjdGlvbiB9ID0+IHtcbiAgLy8gQ2hlY2sgaWYgd2UncmUgaW4gZXhwbG9yZXIgdmlldyBtb2RlXG4gIGNvbnN0IGlzRXhwbG9yZXJWaWV3ID1cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICh3aW5kb3cgYXMgV2luZG93ICYgeyBpc0V4cGxvcmVyVmlldz86IGJvb2xlYW4gfSkuaXNFeHBsb3JlclZpZXcgPT09IHRydWVcblxuICAvLyBVc2UgZGlmZmVyZW50IG1hcmdpbnMgZm9yIGV4cGxvcmVyIHZpZXdcbiAgY29uc3QgbGVmdE1hcmdpbiA9IGlzRXhwbG9yZXJWaWV3ID8gLTE1IDogc3BlZWRcbiAgY29uc3QgcmlnaHRNYXJnaW4gPSBpc0V4cGxvcmVyVmlldyA/IDg1IDogMTUwXG5cbiAgLy8gQ2FsY3VsYXRlIGVmZmVjdGl2ZSB3aWR0aFxuICBjb25zdCBlZmZlY3RpdmVXaWR0aCA9IGNvbnRhaW5lcldpZHRoIC0gcmlnaHRNYXJnaW5cblxuICAvLyBEZXRlcm1pbmUgZGlyZWN0aW9uIGJhc2VkIG9uIHBvc2l0aW9uIGFuZCBib3VuZGFyaWVzXG4gIGxldCBuZXdEaXJlY3Rpb24gPSBkaXJlY3Rpb25cbiAgaWYgKGxlZnRQb3NpdGlvbiA+PSBlZmZlY3RpdmVXaWR0aCkge1xuICAgIG5ld0RpcmVjdGlvbiA9IERpcmVjdGlvbi5sZWZ0XG4gIH0gZWxzZSBpZiAobGVmdFBvc2l0aW9uIDw9IGxlZnRNYXJnaW4pIHtcbiAgICBuZXdEaXJlY3Rpb24gPSBEaXJlY3Rpb24ucmlnaHRcbiAgfVxuXG4gIC8vIFVwZGF0ZSBwb3NpdGlvbiBiYXNlZCBvbiBkaXJlY3Rpb25cbiAgbGV0IG5ld0xlZnRQb3NpdGlvbjogbnVtYmVyXG4gIGlmIChuZXdEaXJlY3Rpb24gPT09IERpcmVjdGlvbi5yaWdodCkge1xuICAgIG5ld0xlZnRQb3NpdGlvbiA9IGxlZnRQb3NpdGlvbiArIHNwZWVkXG4gIH0gZWxzZSB7XG4gICAgbmV3TGVmdFBvc2l0aW9uID0gbGVmdFBvc2l0aW9uIC0gc3BlZWRcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGVmdFBvc2l0aW9uOiBuZXdMZWZ0UG9zaXRpb24sXG4gICAgZGlyZWN0aW9uOiBuZXdEaXJlY3Rpb24sXG4gIH1cbn1cbiIsImV4cG9ydCB0eXBlIFN0YXRlID0ge1xuICB1c2VyUGV0OiBVc2VyUGV0XG4gIGJhc2VQZXRVcmk6IHN0cmluZ1xuICBpbnRlcnZhbElkPzogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWRcbn1cblxuZXhwb3J0IHR5cGUgR2lmcyA9IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9XG5cbmV4cG9ydCB0eXBlIFBldFN0YXRlID0gJ3dhbGtpbmcnIHwgJ2lkbGUnIHwgJ3RyYW5zaXRpb24nXG5cbmV4cG9ydCB0eXBlIFBldEFuaW1hdGlvbiA9IHtcbiAgZ2lmOiBzdHJpbmdcbiAgd2lkdGg6IG51bWJlclxuICBoZWlnaHQ6IG51bWJlclxuICBvZmZzZXQ/OiBudW1iZXJcbiAgc3BlZWQ/OiBudW1iZXJcbiAgZHVyYXRpb24/OiBudW1iZXJcbn1cblxuZXhwb3J0IHR5cGUgUGV0TGV2ZWwgPSB7XG4gIHhwOiBudW1iZXJcbiAgZGVmYXVsdFN0YXRlOiBQZXRTdGF0ZVxuICBhbmltYXRpb25zOiB7XG4gICAgW25hbWU6IHN0cmluZ106IFBldEFuaW1hdGlvblxuICB9XG59XG5cbmV4cG9ydCB0eXBlIFBldCA9IHtcbiAgbGV2ZWxzOiBNYXA8bnVtYmVyLCBQZXRMZXZlbD5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBVc2VyUGV0QmFzZVByb3BzIHtcbiAgbGVmdFBvc2l0aW9uOiBudW1iZXJcbiAgc3BlZWQ6IG51bWJlclxuICBvcmlnaW5hbFNwZWVkPzogbnVtYmVyXG4gIGRpcmVjdGlvbjogbnVtYmVyXG4gIGxldmVsOiBudW1iZXJcbiAgeHA6IG51bWJlclxuICBzdGF0ZTogUGV0U3RhdGVcbiAgaXNUcmFuc2l0aW9uSW46IGJvb2xlYW5cbiAgc2NhbGU6IG51bWJlclxufVxuXG5leHBvcnQgdHlwZSBQZXRUeXBlID0gJ21vbnN0ZXIxJyB8ICdtb25zdGVyMicgfCAndW5rbm93bidcblxuZXhwb3J0IGludGVyZmFjZSBVc2VyUGV0QXJncyB7XG4gIG5hbWU6IHN0cmluZ1xuICB0eXBlOiBQZXRUeXBlXG59XG5cbmV4cG9ydCB0eXBlIFVzZXJQZXQgPSBVc2VyUGV0QmFzZVByb3BzICYgVXNlclBldEFyZ3NcblxuZXhwb3J0IGVudW0gRGlyZWN0aW9uIHtcbiAgcmlnaHQgPSAxLFxuICBsZWZ0ID0gLTEsXG59XG5cbmV4cG9ydCB0eXBlIE5leHRGcmFtZU9wdHMgPSB7XG4gIGNvbnRhaW5lcldpZHRoOiBudW1iZXJcbiAgbGVmdFBvc2l0aW9uOiBudW1iZXJcbiAgZGlyZWN0aW9uOiBudW1iZXJcbiAgc3BlZWQ6IG51bWJlclxuICBvZmZzZXQ6IG51bWJlclxuICBzY2FsZTogbnVtYmVyXG59XG5cbmV4cG9ydCB0eXBlIE5leHRGcmFtZUZuUmV0dXJuID0ge1xuICBsZWZ0UG9zaXRpb246IG51bWJlclxuICBkaXJlY3Rpb246IG51bWJlclxuICBuZXdQZXRTdGF0ZT86IFBldFN0YXRlXG59XG5cbmV4cG9ydCB0eXBlIE5leHRGcmFtZUZuID0gKG9wdHM6IE5leHRGcmFtZU9wdHMpID0+IE5leHRGcmFtZUZuUmV0dXJuXG5cbmV4cG9ydCB0eXBlIFRyYW5zZm9ybXMgPSB7XG4gIFt0cmFuc2Zvcm06IHN0cmluZ106IHtcbiAgICBuZXh0RnJhbWU6IE5leHRGcmFtZUZuXG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wYW5lbC9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
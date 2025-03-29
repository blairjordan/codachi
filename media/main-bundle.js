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
    if (userPet.isTransitionIn) {
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
            _1.state.userPet.isTransitionIn = false;
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
            case 'update-pet':
                // Preserve the current position and direction
                const updatedPet = Object.assign(Object.assign({}, data.userPet), { leftPosition: _1.state.userPet.leftPosition, direction: _1.state.userPet.direction });
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
                        xp: 50,
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
                        xp: 60,
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
                        xp: 50,
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
                        xp: 60,
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
                        xp: 50,
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
                        xp: 60,
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
                        xp: 50,
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
                        xp: 60,
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
                        xp: 50,
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
                        xp: 60,
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
                        xp: 50,
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
                        xp: 60,
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
            const isExplorerView = typeof window !== 'undefined' && window.isExplorerView === true;
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
    const isExplorerView = typeof window !== 'undefined' && window.isExplorerView === true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBRTtRQUNwQyxlQUFlLEdBQUcsWUFBWSxHQUFHLEtBQUs7S0FDdkM7U0FBTTtRQUNMLGVBQWUsR0FBRyxZQUFZLEdBQUcsS0FBSztLQUN2QztJQUVELE9BQU87UUFDTCxZQUFZLEVBQUUsZUFBZTtRQUM3QixTQUFTLEVBQUUsWUFBWTtLQUN4QjtBQUNILENBQUM7QUFyQ1ksZUFBTyxXQXFDbkI7Ozs7Ozs7Ozs7Ozs7O0FDbkNELElBQVksU0FHWDtBQUhELFdBQVksU0FBUztJQUNuQiwyQ0FBUztJQUNULDBDQUFTO0FBQ1gsQ0FBQyxFQUhXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBR3BCOzs7Ozs7O1VDdkREO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL2RvbS50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL2luZGV4LnRzIiwid2VicGFjazovL2NvZGFjaGlBcHAvLi9zcmMvcGFuZWwvbWFpbi50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL3BldHMudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9zdGF0ZS50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL3RyYW5zZm9ybXMudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC90eXBlcy50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NvZGFjaGlBcHAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgRE9NIHtcbiAgcHJpdmF0ZSBfcGV0SW1hZ2VTZWxlY3Rvcjogc3RyaW5nXG4gIHByaXZhdGUgX21vdmVtZW50Q29udGFpbmVyU2VsZWN0b3I6IHN0cmluZ1xuICBwcml2YXRlIF90cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3I6IHN0cmluZ1xuICBwcml2YXRlIF90cmFuc2l0aW9uU2VsZWN0b3I6IHN0cmluZ1xuXG4gIHByaXZhdGUgX21vdmVtZW50Q29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWRcbiAgcHJpdmF0ZSBfcGV0SW1hZ2VFbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50IHwgdW5kZWZpbmVkXG4gIHByaXZhdGUgX3RyYW5zaXRpb25Db250YWluZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZFxuICBwcml2YXRlIF90cmFuc2l0aW9uSW1hZ2VFbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50IHwgdW5kZWZpbmVkXG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3IsXG4gICAgcGV0SW1hZ2VTZWxlY3RvcixcbiAgICB0cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3IsXG4gICAgdHJhbnNpdGlvblNlbGVjdG9yLFxuICB9OiB7XG4gICAgcGV0SW1hZ2VTZWxlY3Rvcjogc3RyaW5nXG4gICAgbW92ZW1lbnRDb250YWluZXJTZWxlY3Rvcjogc3RyaW5nXG4gICAgdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yOiBzdHJpbmdcbiAgICB0cmFuc2l0aW9uU2VsZWN0b3I6IHN0cmluZ1xuICB9KSB7XG4gICAgdGhpcy5fcGV0SW1hZ2VTZWxlY3RvciA9IHBldEltYWdlU2VsZWN0b3JcbiAgICB0aGlzLl9tb3ZlbWVudENvbnRhaW5lclNlbGVjdG9yID0gbW92ZW1lbnRDb250YWluZXJTZWxlY3RvclxuICAgIHRoaXMuX3RyYW5zaXRpb25Db250YWluZXJTZWxlY3RvciA9IHRyYW5zaXRpb25Db250YWluZXJTZWxlY3RvclxuICAgIHRoaXMuX3RyYW5zaXRpb25TZWxlY3RvciA9IHRyYW5zaXRpb25TZWxlY3RvclxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEhUTUxFbGVtZW50ID0gPFQ+KGVsZW1lbnROYW1lOiBzdHJpbmcpOiBUID0+IHtcbiAgICBjb25zdCBodG1sRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnROYW1lKSBhcyB1bmtub3duXG4gICAgaWYgKCFodG1sRWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gbG9jYXRlIGVsZW1lbnQgaW4gRE9NOiAke2VsZW1lbnROYW1lfWApXG4gICAgfVxuXG4gICAgcmV0dXJuIGh0bWxFbGVtZW50IGFzIFRcbiAgfVxuXG4gIGdldE1vdmVtZW50U2VsZWN0b3IoKTogSFRNTEVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fbW92ZW1lbnRDb250YWluZXJFbGVtZW50KSB7XG4gICAgICB0aGlzLl9tb3ZlbWVudENvbnRhaW5lckVsZW1lbnQgPSB0aGlzLmdldEhUTUxFbGVtZW50PEhUTUxFbGVtZW50PihcbiAgICAgICAgdGhpcy5fbW92ZW1lbnRDb250YWluZXJTZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbW92ZW1lbnRDb250YWluZXJFbGVtZW50XG4gIH1cblxuICBnZXRQZXRJbWFnZVNlbGVjdG9yKCk6IEhUTUxJbWFnZUVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fcGV0SW1hZ2VFbGVtZW50KSB7XG4gICAgICB0aGlzLl9wZXRJbWFnZUVsZW1lbnQgPSB0aGlzLmdldEhUTUxFbGVtZW50PEhUTUxJbWFnZUVsZW1lbnQ+KFxuICAgICAgICB0aGlzLl9wZXRJbWFnZVNlbGVjdG9yXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9wZXRJbWFnZUVsZW1lbnRcbiAgfVxuXG4gIGdldFRyYW5zaXRpb25TZWxlY3RvcigpOiBIVE1MRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLl90cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudCkge1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQgPSB0aGlzLmdldEhUTUxFbGVtZW50PEhUTUxFbGVtZW50PihcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudFxuICB9XG5cbiAgZ2V0VHJhbnNpdGlvbkltYWdlU2VsZWN0b3IoKTogSFRNTEltYWdlRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLl90cmFuc2l0aW9uSW1hZ2VFbGVtZW50KSB7XG4gICAgICB0aGlzLl90cmFuc2l0aW9uSW1hZ2VFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MSW1hZ2VFbGVtZW50PihcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvblNlbGVjdG9yXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uSW1hZ2VFbGVtZW50XG4gIH1cbn1cbiIsImltcG9ydCB7IERPTSB9IGZyb20gJy4vZG9tJ1xuaW1wb3J0IHtcbiAgZ2VuZXJhdGVQZXQsXG4gIGdldFBldEFuaW1hdGlvbnMsXG4gIGdpZnMsXG4gIG11dGF0ZUxldmVsLFxuICBwZXRUeXBlcyxcbiAgcmFuZG9tUGV0TmFtZSxcbiAgcmFuZG9tUGV0VHlwZSxcbn0gZnJvbSAnLi9wZXRzJ1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN0YXRlLCBzZXRTdGF0ZSwgc3RhdGUgfSBmcm9tICcuL3N0YXRlJ1xuaW1wb3J0IHsgdHJhbnNmb3JtcyB9IGZyb20gJy4vdHJhbnNmb3JtcydcbmltcG9ydCB7XG4gIERpcmVjdGlvbixcbiAgR2lmcyxcbiAgTmV4dEZyYW1lRm4sXG4gIE5leHRGcmFtZUZuUmV0dXJuLFxuICBOZXh0RnJhbWVPcHRzLFxuICBQZXQsXG4gIFBldEFuaW1hdGlvbixcbiAgUGV0TGV2ZWwsXG4gIFBldFN0YXRlLFxuICBQZXRUeXBlLFxuICBTdGF0ZSxcbiAgVHJhbnNmb3JtcyxcbiAgVXNlclBldCxcbiAgVXNlclBldEFyZ3MsXG4gIFVzZXJQZXRCYXNlUHJvcHMsXG59IGZyb20gJy4vdHlwZXMnXG5cbi8vIEZ1bmN0aW9uIHRvIGFkanVzdCBzcGVlZCBiYXNlZCBvbiBzY2FsZVxuZXhwb3J0IGNvbnN0IGFkanVzdFNwZWVkRm9yU2NhbGUgPSAoXG4gIG9yaWdpbmFsU3BlZWQ6IG51bWJlcixcbiAgc2NhbGU6IG51bWJlclxuKTogbnVtYmVyID0+IG9yaWdpbmFsU3BlZWQgKiAoMC43ICsgMC42ICogc2NhbGUpXG5cbmV4cG9ydCB7XG4gIERpcmVjdGlvbixcbiAgRE9NLFxuICBnZW5lcmF0ZVBldCxcbiAgZ2V0UGV0QW5pbWF0aW9ucyxcbiAgZ2lmcyxcbiAgR2lmcyxcbiAgaW5pdGlhbGl6ZVN0YXRlLFxuICBtdXRhdGVMZXZlbCxcbiAgTmV4dEZyYW1lRm4sXG4gIE5leHRGcmFtZUZuUmV0dXJuLFxuICBOZXh0RnJhbWVPcHRzLFxuICBQZXQsXG4gIFBldEFuaW1hdGlvbixcbiAgUGV0TGV2ZWwsXG4gIFBldFN0YXRlLFxuICBQZXRUeXBlLFxuICBwZXRUeXBlcyxcbiAgcmFuZG9tUGV0TmFtZSxcbiAgcmFuZG9tUGV0VHlwZSxcbiAgc2V0U3RhdGUsXG4gIFN0YXRlLFxuICBzdGF0ZSxcbiAgVHJhbnNmb3JtcyxcbiAgdHJhbnNmb3JtcyxcbiAgVXNlclBldCxcbiAgVXNlclBldEFyZ3MsXG4gIFVzZXJQZXRCYXNlUHJvcHMsXG59XG4iLCJpbXBvcnQge1xuICBET00sXG4gIFBldEFuaW1hdGlvbixcbiAgVXNlclBldCxcbiAgYWRqdXN0U3BlZWRGb3JTY2FsZSxcbiAgZ2VuZXJhdGVQZXQsXG4gIGdldFBldEFuaW1hdGlvbnMsXG4gIGdpZnMsXG4gIHNldFN0YXRlLFxuICBzdGF0ZSxcbiAgdHJhbnNmb3Jtcyxcbn0gZnJvbSAnLi8nXG5pbXBvcnQgeyBpbml0aWFsaXplU3RhdGUgfSBmcm9tICcuL3N0YXRlJ1xuXG5jb25zdCBkZWZhdWx0U3RhdGUgPSB7XG4gIHVzZXJQZXQ6IGdlbmVyYXRlUGV0KHsgbmFtZTogJ3Vua25vd24nLCB0eXBlOiAndW5rbm93bicgfSksXG4gIGJhc2VQZXRVcmk6ICcnLFxufVxuXG5pbml0aWFsaXplU3RhdGUoZGVmYXVsdFN0YXRlKVxuXG5jb25zdCBkb20gPSBuZXcgRE9NKHtcbiAgbW92ZW1lbnRDb250YWluZXJTZWxlY3RvcjogJ21vdmVtZW50LWNvbnRhaW5lcicsXG4gIHBldEltYWdlU2VsZWN0b3I6ICdwZXQnLFxuICB0cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3I6ICd0cmFuc2l0aW9uLWNvbnRhaW5lcicsXG4gIHRyYW5zaXRpb25TZWxlY3RvcjogJ3RyYW5zaXRpb24nLFxufSlcblxuY29uc3QgVElDS19JTlRFUlZBTF9NUyA9IDEwMFxuXG5jb25zdCB0aWNrID0gKHsgdXNlclBldCB9OiB7IHVzZXJQZXQ6IFVzZXJQZXQgfSkgPT4ge1xuICBjb25zdCB7IGxlZnRQb3NpdGlvbiwgZGlyZWN0aW9uIH0gPSB0cmFuc2Zvcm1zW3VzZXJQZXQuc3RhdGVdLm5leHRGcmFtZSh7XG4gICAgY29udGFpbmVyV2lkdGg6XG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fFxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxuICAgIGxlZnRQb3NpdGlvbjogdXNlclBldC5sZWZ0UG9zaXRpb24sXG4gICAgZGlyZWN0aW9uOiB1c2VyUGV0LmRpcmVjdGlvbixcbiAgICBzcGVlZDogYWRqdXN0U3BlZWRGb3JTY2FsZSh1c2VyUGV0LnNwZWVkLCB1c2VyUGV0LnNjYWxlKSxcbiAgICBvZmZzZXQ6IGdldFBldEFuaW1hdGlvbnMoeyB1c2VyUGV0IH0pLmFuaW1hdGlvbi5vZmZzZXQgfHwgMCxcbiAgICBzY2FsZTogdXNlclBldC5zY2FsZSxcbiAgfSlcblxuICB1c2VyUGV0LmxlZnRQb3NpdGlvbiA9IGxlZnRQb3NpdGlvblxuICB1c2VyUGV0LmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuXG4gIC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9uXG4gIGNvbnN0IG1vdmVtZW50Q29udGFpbmVyID0gZG9tLmdldE1vdmVtZW50U2VsZWN0b3IoKVxuICBtb3ZlbWVudENvbnRhaW5lci5zdHlsZS5tYXJnaW5MZWZ0ID0gYCR7dXNlclBldC5sZWZ0UG9zaXRpb259cHhgXG5cbiAgY29uc3QgcGV0SW1hZ2VFbGVtZW50ID0gZG9tLmdldFBldEltYWdlU2VsZWN0b3IoKVxuICBwZXRJbWFnZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlWCgke3VzZXJQZXQuZGlyZWN0aW9ufSkgc2NhbGUoJHt1c2VyUGV0LnNjYWxlfSlgXG5cbiAgLy8gR2V0IHRoZSBwZXQgY29udGFpbmVyIGFuZCBhZGp1c3QgaXRzIHBvc2l0aW9uIHRvIGtlZXAgcGV0IG9uIHRoZSBncm91bmRcbiAgY29uc3QgcGV0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BldC1jb250YWluZXInKVxuICBpZiAocGV0Q29udGFpbmVyKSB7XG4gICAgY29uc3QgeyBhbmltYXRpb24gfSA9IGdldFBldEFuaW1hdGlvbnMoeyB1c2VyUGV0IH0pXG4gICAgY29uc3QgdmVydGljYWxBZGp1c3RtZW50ID0gKGFuaW1hdGlvbi5oZWlnaHQgKiAodXNlclBldC5zY2FsZSAtIDEpKSAvIDJcbiAgICBwZXRDb250YWluZXIuc3R5bGUuYm90dG9tID0gYCR7dmVydGljYWxBZGp1c3RtZW50fXB4YFxuICB9XG5cbiAgaWYgKHVzZXJQZXQuaXNUcmFuc2l0aW9uSW4pIHtcbiAgICBjb25zdCB7IHRyYW5zaXRpb246IGFuaW1hdGlvbiB9ID0gZ2V0UGV0QW5pbWF0aW9ucyh7XG4gICAgICB1c2VyUGV0LFxuICAgIH0pXG5cbiAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICBjb25zdCB0cmFuc2l0aW9uQ29udGFpbmVyID0gZG9tLmdldFRyYW5zaXRpb25TZWxlY3RvcigpXG4gICAgICB0cmFuc2l0aW9uQ29udGFpbmVyLnN0eWxlLm1hcmdpbkxlZnQgPSBgJHt1c2VyUGV0LmxlZnRQb3NpdGlvbn1weGBcblxuICAgICAgLy8gQWxzbyBhZGp1c3QgdHJhbnNpdGlvbiBjb250YWluZXIgaGVpZ2h0XG4gICAgICBjb25zdCB0cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAndHJhbnNpdGlvbi1jb250YWluZXInXG4gICAgICApXG4gICAgICBpZiAodHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgdmVydGljYWxBZGp1c3RtZW50ID0gKGFuaW1hdGlvbi5oZWlnaHQgKiAodXNlclBldC5zY2FsZSAtIDEpKSAvIDJcbiAgICAgICAgdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQuc3R5bGUuYm90dG9tID0gYCR7dmVydGljYWxBZGp1c3RtZW50fXB4YFxuICAgICAgfVxuXG4gICAgICBzZXRJbWFnZSh7XG4gICAgICAgIGNvbnRhaW5lcjogZG9tLmdldFRyYW5zaXRpb25TZWxlY3RvcigpLFxuICAgICAgICBzZWxlY3RvcjogZG9tLmdldFRyYW5zaXRpb25JbWFnZVNlbGVjdG9yKCksXG4gICAgICAgIGFuaW1hdGlvbixcbiAgICAgIH0pXG4gICAgICBzdGF0ZS51c2VyUGV0LmlzVHJhbnNpdGlvbkluID0gZmFsc2VcbiAgICB9XG4gIH1cbn1cblxuY29uc3Qgc2V0SW1hZ2UgPSAoe1xuICBjb250YWluZXIsXG4gIHNlbGVjdG9yLFxuICBhbmltYXRpb24sXG59OiB7XG4gIGNvbnRhaW5lcjogSFRNTEVsZW1lbnRcbiAgc2VsZWN0b3I6IEhUTUxJbWFnZUVsZW1lbnRcbiAgYW5pbWF0aW9uOiBQZXRBbmltYXRpb25cbn0pID0+IHtcbiAgY29uc3QgeyBiYXNlUGV0VXJpLCB1c2VyUGV0IH0gPSBzdGF0ZVxuXG4gIHNlbGVjdG9yLnNyYyA9IGAke2Jhc2VQZXRVcml9LyR7Z2lmc1thbmltYXRpb24uZ2lmXX1gXG4gIHNlbGVjdG9yLndpZHRoID0gYW5pbWF0aW9uLndpZHRoXG4gIHNlbGVjdG9yLnN0eWxlLm1pbldpZHRoID0gYCR7YW5pbWF0aW9uLndpZHRofXB4YFxuICBzZWxlY3Rvci5oZWlnaHQgPSBhbmltYXRpb24uaGVpZ2h0XG5cbiAgLy8gRm9yIHBldCBpbWFnZSwgd2UgbmVlZCB0byBtYWludGFpbiBzY2FsZVggZm9yIGRpcmVjdGlvblxuICBpZiAoc2VsZWN0b3IgPT09IGRvbS5nZXRQZXRJbWFnZVNlbGVjdG9yKCkpIHtcbiAgICBzZWxlY3Rvci5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGVYKCR7dXNlclBldC5kaXJlY3Rpb259KSBzY2FsZSgke3VzZXJQZXQuc2NhbGV9KWBcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgdHJhbnNpdGlvbiBpbWFnZXMsIGp1c3QgYXBwbHkgdGhlIHNjYWxlXG4gICAgc2VsZWN0b3Iuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7dXNlclBldC5zY2FsZX0pYFxuICB9XG5cbiAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSBgJHthbmltYXRpb24ub2Zmc2V0ID8/IDB9cHhgXG59XG5cbmNvbnN0IHNsZWVwID0gKG1zOiBudW1iZXIpID0+IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIG1zKSlcblxuY29uc3Qgc3RhcnRBbmltYXRpb24gPSAoKSA9PiB7XG4gIGNvbnN0IHsgdXNlclBldCB9ID0gc3RhdGVcbiAgaWYgKHN0YXRlLmludGVydmFsSWQpIHtcbiAgICBjbGVhckludGVydmFsKHN0YXRlLmludGVydmFsSWQpXG4gIH1cbiAgY29uc3QgaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICB0aWNrKHsgdXNlclBldCB9KVxuICB9LCBUSUNLX0lOVEVSVkFMX01TKVxuICBzZXRTdGF0ZSgnaW50ZXJ2YWxJZCcsIGludGVydmFsSWQpXG59XG5cbmV4cG9ydCBjb25zdCBhZGRQZXRUb1BhbmVsID0gYXN5bmMgKHsgdXNlclBldCB9OiB7IHVzZXJQZXQ6IFVzZXJQZXQgfSkgPT4ge1xuICBjb25zdCB7IGFuaW1hdGlvbiB9ID0gZ2V0UGV0QW5pbWF0aW9ucyh7XG4gICAgdXNlclBldCxcbiAgfSlcblxuICAvLyBTdG9yZSB0aGUgb3JpZ2luYWwgc3BlZWQgaWYgaXQncyBub3QgYWxyZWFkeSBzZXRcbiAgaWYgKCF1c2VyUGV0Lm9yaWdpbmFsU3BlZWQgJiYgYW5pbWF0aW9uLnNwZWVkKSB7XG4gICAgdXNlclBldC5vcmlnaW5hbFNwZWVkID0gYW5pbWF0aW9uLnNwZWVkXG4gIH1cblxuICBpZiAodXNlclBldC5vcmlnaW5hbFNwZWVkKSB7XG4gICAgdXNlclBldC5zcGVlZCA9IGFkanVzdFNwZWVkRm9yU2NhbGUodXNlclBldC5vcmlnaW5hbFNwZWVkLCB1c2VyUGV0LnNjYWxlKVxuICB9XG5cbiAgc2V0U3RhdGUoJ3VzZXJQZXQnLCB1c2VyUGV0KVxuICBzdGFydEFuaW1hdGlvbigpXG5cbiAgLy8gR2l2ZSB0aGUgdHJhbnNpdGlvbiBhIGNoYW5jZSB0byBwbGF5XG4gIGF3YWl0IHNsZWVwKFRJQ0tfSU5URVJWQUxfTVMgKiAyKVxuXG4gIHNldEltYWdlKHtcbiAgICBzZWxlY3RvcjogZG9tLmdldFBldEltYWdlU2VsZWN0b3IoKSxcbiAgICBhbmltYXRpb24sXG4gICAgY29udGFpbmVyOiBkb20uZ2V0TW92ZW1lbnRTZWxlY3RvcigpLFxuICB9KVxuXG4gIC8vIEFwcGx5IHZlcnRpY2FsIHBvc2l0aW9uIGFkanVzdG1lbnQgZm9yIHRoZSBwZXQgY29udGFpbmVyXG4gIGNvbnN0IHBldENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZXQtY29udGFpbmVyJylcbiAgaWYgKHBldENvbnRhaW5lcikge1xuICAgIGNvbnN0IHZlcnRpY2FsQWRqdXN0bWVudCA9IChhbmltYXRpb24uaGVpZ2h0ICogKHVzZXJQZXQuc2NhbGUgLSAxKSkgLyAyXG4gICAgcGV0Q29udGFpbmVyLnN0eWxlLmJvdHRvbSA9IGAke3ZlcnRpY2FsQWRqdXN0bWVudH1weGBcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgYXBwID0gKHtcbiAgdXNlclBldCxcbiAgYmFzZVBldFVyaSxcbn06IHtcbiAgdXNlclBldDogVXNlclBldFxuICBiYXNlUGV0VXJpOiBzdHJpbmdcbn0pID0+IHtcbiAgc2V0U3RhdGUoJ2Jhc2VQZXRVcmknLCBiYXNlUGV0VXJpKVxuXG4gIGlmICh1c2VyUGV0KSB7XG4gICAgLy8gT25seSBwbGF5IHRoZSB0cmFuc2l0aW9uIGFuaW1hdGlvbiBmb3IgZWdncyBvciBpZiBleHBsaWNpdGx5IHJlcXVlc3RlZFxuICAgIGlmICh1c2VyUGV0LmxldmVsID4gMCkge1xuICAgICAgdXNlclBldC5pc1RyYW5zaXRpb25JbiA9IGZhbHNlXG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBwZXQgdG8gdGhlIHBhbmVsXG4gICAgYWRkUGV0VG9QYW5lbCh7IHVzZXJQZXQgfSlcbiAgfVxuXG4gIC8vIEhhbmRsZSBtZXNzYWdlcyBzZW50IGZyb20gdGhlIGV4dGVuc2lvbiB0byB0aGUgd2Vidmlld1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHsgY29tbWFuZCwgZGF0YSB9ID0gZXZlbnQuZGF0YSAvLyBUaGUgZGF0YSB0aGF0IHRoZSBleHRlbnNpb24gc2VudFxuICAgIHN3aXRjaCAoY29tbWFuZCkge1xuICAgICAgY2FzZSAnc3Bhd24tcGV0JzpcbiAgICAgICAgYWRkUGV0VG9QYW5lbCh7IHVzZXJQZXQ6IGRhdGEudXNlclBldCB9KVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlICd1cGRhdGUtcGV0JzpcbiAgICAgICAgLy8gUHJlc2VydmUgdGhlIGN1cnJlbnQgcG9zaXRpb24gYW5kIGRpcmVjdGlvblxuICAgICAgICBjb25zdCB1cGRhdGVkUGV0ID0ge1xuICAgICAgICAgIC4uLmRhdGEudXNlclBldCxcbiAgICAgICAgICBsZWZ0UG9zaXRpb246IHN0YXRlLnVzZXJQZXQubGVmdFBvc2l0aW9uLFxuICAgICAgICAgIGRpcmVjdGlvbjogc3RhdGUudXNlclBldC5kaXJlY3Rpb24sXG4gICAgICAgIH1cblxuICAgICAgICBhZGRQZXRUb1BhbmVsKHsgdXNlclBldDogdXBkYXRlZFBldCB9KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfSlcbn1cbiIsImltcG9ydCB7XG4gIERpcmVjdGlvbixcbiAgR2lmcyxcbiAgUGV0LFxuICBQZXRBbmltYXRpb24sXG4gIFBldExldmVsLFxuICBQZXRUeXBlLFxuICBVc2VyUGV0LFxuICBVc2VyUGV0QXJncyxcbn0gZnJvbSAnLi8nXG5cbmV4cG9ydCBjb25zdCBnaWZzOiBHaWZzID0ge1xuICBlZ2cxOiAnZWdnMS5naWYnLFxuICBkdXN0MTogJ2R1c3QxLmdpZicsXG4gIGR1c3QyOiAnZHVzdDIuZ2lmJyxcbiAgbW9uc3RlcjFwaGFzZTE6ICdtMWQxLmdpZicsXG4gIG1vbnN0ZXIxcGhhc2UyOiAnbTFkMi5naWYnLFxuICBtb25zdGVyMXBoYXNlMzogJ20xZDMuZ2lmJyxcbiAgbW9uc3RlcjJwaGFzZTE6ICdtMmQxLmdpZicsXG4gIG1vbnN0ZXIycGhhc2UyOiAnbTJkMi5naWYnLFxuICBtb25zdGVyMnBoYXNlMzogJ20yZDMuZ2lmJyxcbiAgbW9uc3RlcjNwaGFzZTE6ICdtM2QxLmdpZicsXG4gIG1vbnN0ZXIzcGhhc2UyOiAnbTNkMi5naWYnLFxuICBtb25zdGVyM3BoYXNlMzogJ20zZDMuZ2lmJyxcbiAgbW9uc3RlcjRwaGFzZTE6ICdtNGQxLmdpZicsXG4gIG1vbnN0ZXI0cGhhc2UyOiAnbTRkMi5naWYnLFxuICBtb25zdGVyNHBoYXNlMzogJ200ZDMuZ2lmJyxcbiAgbW9uc3RlcjVwaGFzZTE6ICdtNWQxLmdpZicsXG4gIG1vbnN0ZXI1cGhhc2UyOiAnbTVkMi5naWYnLFxuICBtb25zdGVyNXBoYXNlMzogJ201ZDMuZ2lmJyxcbiAgbW9uc3RlcjZwaGFzZTE6ICdtNmQxLmdpZicsXG4gIG1vbnN0ZXI2cGhhc2UyOiAnbTZkMi5naWYnLFxuICBtb25zdGVyNnBoYXNlMzogJ202ZDMuZ2lmJyxcbn1cblxuZXhwb3J0IGNvbnN0IHBldE5hbWVzID0gW1xuICAnYm9vJyxcbiAgJ25hY2hvJyxcbiAgJ2dhcnknLFxuICAnZnVkZ2UnLFxuICAnbmVrbycsXG4gICdwaXAnLFxuICAnYmlibycsXG4gICdmaWZpJyxcbiAgJ2pheCcsXG4gICdib2JiYScsXG4gICdnaWRnZXQnLFxuICAnbWluYScsXG4gICdjcnVtYicsXG4gICd6aW1ibycsXG4gICdkdXN0eScsXG4gICdicm9jaycsXG4gICdvdGlzJyxcbiAgJ21hcnZpbicsXG4gICdzbW9rZXknLFxuICAnYmFycnknLFxuICAndG9ueScsXG4gICdkdXN0eScsXG4gICdtb2NoaScsXG5dXG5cbmNvbnN0IGFuaW1hdGlvbkRlZmF1bHRzID0ge1xuICB3aWR0aDogNzUsXG4gIGhlaWdodDogNjQsXG4gIHNwZWVkOiAwLFxuICBvZmZzZXQ6IDAsXG59XG5cbmNvbnN0IGVnZzogUGV0TGV2ZWwgPSB7XG4gIHhwOiAwLFxuICBkZWZhdWx0U3RhdGU6ICdpZGxlJyxcbiAgYW5pbWF0aW9uczoge1xuICAgIGlkbGU6IHtcbiAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgZ2lmOiAnZWdnMScsXG4gICAgfSxcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgIGdpZjogJ2R1c3QxJyxcbiAgICAgIG9mZnNldDogLTEzLFxuICAgICAgd2lkdGg6IDEwMCxcbiAgICAgIGhlaWdodDogMTAwLFxuICAgIH0sXG4gIH0sXG59XG5cbi8vIEdlbmVyaWMgZXZvbHV0aW9uIHRyYW5zaXRpb25cbmNvbnN0IHRyYW5zaXRpb246IFBldEFuaW1hdGlvbiA9IHtcbiAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gIGdpZjogJ2R1c3QyJyxcbiAgb2Zmc2V0OiAtOTUsXG4gIHdpZHRoOiAyODAsXG4gIGhlaWdodDogMTAwLFxufVxuXG5leHBvcnQgY29uc3QgcGV0VHlwZXMgPSBuZXcgTWFwPHN0cmluZywgUGV0PihbXG4gIFtcbiAgICAnbW9uc3RlcjEnLFxuICAgIHtcbiAgICAgIGxldmVsczogbmV3IE1hcChbXG4gICAgICAgIFswLCBlZ2ddLFxuICAgICAgICBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMzUsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIxcGhhc2UxJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDUwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMXBoYXNlMicsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA2MCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjFwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyMicsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjJwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDUwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMnBoYXNlMicsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNjAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIycGhhc2UzJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuICBbXG4gICAgJ21vbnN0ZXIzJyxcbiAgICB7XG4gICAgICBsZXZlbHM6IG5ldyBNYXAoW1xuICAgICAgICBbMCwgZWdnXSxcbiAgICAgICAgW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDM1LFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyM3BoYXNlMScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAxLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNTAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIzcGhhc2UyJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA2MCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjNwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF0pLFxuICAgIH0sXG4gIF0sXG4gIFtcbiAgICAnbW9uc3RlcjQnLFxuICAgIHtcbiAgICAgIGxldmVsczogbmV3IE1hcChbXG4gICAgICAgIFswLCBlZ2ddLFxuICAgICAgICBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMzUsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI0cGhhc2UxJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA1MCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjRwaGFzZTInLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDYwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNHBoYXNlMycsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAzLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyNScsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjVwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDY2LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNTAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI1cGhhc2UyJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNjAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI1cGhhc2UzJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEzNSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTI1LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyNicsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjZwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNTAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI2cGhhc2UyJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDY0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDYwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNnBoYXNlMycsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2NCxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuXSlcblxuZXhwb3J0IGNvbnN0IHJhbmRvbVBldFR5cGUgPSAoKTogUGV0VHlwZSA9PlxuICBBcnJheS5mcm9tKHBldFR5cGVzLmtleXMoKSlbXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGV0VHlwZXMuc2l6ZSlcbiAgXSBhcyBQZXRUeXBlXG5cbmV4cG9ydCBjb25zdCByYW5kb21QZXROYW1lID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IG5hbWUgPSBwZXROYW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwZXROYW1lcy5sZW5ndGgpXVxuICByZXR1cm4gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0UGV0QW5pbWF0aW9ucyA9ICh7XG4gIHVzZXJQZXQsXG59OiB7XG4gIHVzZXJQZXQ6IFVzZXJQZXRcbn0pOiB7XG4gIGFuaW1hdGlvbjogUGV0QW5pbWF0aW9uXG4gIHRyYW5zaXRpb246IFBldEFuaW1hdGlvbiB8IHVuZGVmaW5lZFxufSA9PiB7XG4gIGNvbnN0IHBldFR5cGVGb3VuZCA9IHBldFR5cGVzLmdldCh1c2VyUGV0LnR5cGUpXG4gIGlmICghcGV0VHlwZUZvdW5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBQZXQgdHlwZSBub3QgZm91bmQ6ICR7dXNlclBldC50eXBlfWApXG4gIH1cblxuICBjb25zdCBsZXZlbEZvdW5kID0gcGV0VHlwZUZvdW5kLmxldmVscy5nZXQodXNlclBldC5sZXZlbClcbiAgaWYgKCFsZXZlbEZvdW5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYFBldCBsZXZlbCBub3QgZm91bmQgZm9yIHBldCB0eXBlICR7dXNlclBldC50eXBlfTogJHt1c2VyUGV0LmxldmVsfWBcbiAgICApXG4gIH1cblxuICBpZiAoISh1c2VyUGV0LnN0YXRlIGluIGxldmVsRm91bmQuYW5pbWF0aW9ucykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgQW5pbWF0aW9uIG5vdCBmb3VuZCBmb3IgcGV0IHR5cGUgJHt1c2VyUGV0LnR5cGV9LCBsZXZlbCAke3VzZXJQZXQubGV2ZWx9OiAke3VzZXJQZXQuc3RhdGV9YFxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHRyYW5zaXRpb24gPVxuICAgICd0cmFuc2l0aW9uJyBpbiBsZXZlbEZvdW5kLmFuaW1hdGlvbnNcbiAgICAgID8gbGV2ZWxGb3VuZC5hbmltYXRpb25zLnRyYW5zaXRpb25cbiAgICAgIDogdW5kZWZpbmVkXG5cbiAgcmV0dXJuIHtcbiAgICBhbmltYXRpb246IGxldmVsRm91bmQuYW5pbWF0aW9uc1t1c2VyUGV0LnN0YXRlXSxcbiAgICB0cmFuc2l0aW9uLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVBldCA9ICh7IG5hbWUsIHR5cGUgfTogVXNlclBldEFyZ3MpOiBVc2VyUGV0ID0+ICh7XG4gIGxlZnRQb3NpdGlvbjogMCxcbiAgc3BlZWQ6IDAsXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uLnJpZ2h0LFxuICBsZXZlbDogMCxcbiAgeHA6IDAsXG4gIC8vIEFsbCBsZXZlbCAwIGNoYXJhY3RlcnMgcmVxdWlyZSB0aGlzIHN0YXRlXG4gIHN0YXRlOiAnaWRsZScsXG4gIGlzVHJhbnNpdGlvbkluOiB0cnVlLFxuICBuYW1lLFxuICB0eXBlLFxuICBzY2FsZTogMSxcbn0pXG5cbmV4cG9ydCBjb25zdCBnZXRMZXZlbCA9ICh7XG4gIHBldFR5cGUsXG4gIGxldmVsLFxufToge1xuICBwZXRUeXBlOiBQZXRUeXBlXG4gIGxldmVsOiBudW1iZXJcbn0pID0+IHtcbiAgY29uc3QgcGV0VHlwZUZvdW5kID0gcGV0VHlwZXMuZ2V0KHBldFR5cGUpXG4gIGlmICghcGV0VHlwZUZvdW5kKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cbiAgY29uc3QgbGV2ZWxGb3VuZCA9IHBldFR5cGVGb3VuZC5sZXZlbHMuZ2V0KGxldmVsKVxuICBpZiAoIWxldmVsRm91bmQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICByZXR1cm4gbGV2ZWxGb3VuZFxufVxuXG5leHBvcnQgY29uc3QgbXV0YXRlTGV2ZWwgPSAoeyB1c2VyUGV0IH06IHsgdXNlclBldDogVXNlclBldCB9KSA9PiB7XG4gIGNvbnN0IG5leHRMZXZlbEZvdW5kID0gZ2V0TGV2ZWwoe1xuICAgIHBldFR5cGU6IHVzZXJQZXQudHlwZSxcbiAgICBsZXZlbDogdXNlclBldC5sZXZlbCArIDEsXG4gIH0pXG5cbiAgaWYgKCFuZXh0TGV2ZWxGb3VuZCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHVzZXJQZXQueHAgPj0gbmV4dExldmVsRm91bmQueHApIHtcbiAgICB1c2VyUGV0LmxldmVsICs9IDFcbiAgICB1c2VyUGV0LnhwID0gMFxuICAgIHVzZXJQZXQuc3RhdGUgPSBuZXh0TGV2ZWxGb3VuZC5kZWZhdWx0U3RhdGVcbiAgICB1c2VyUGV0LnNwZWVkID0gbmV4dExldmVsRm91bmQuYW5pbWF0aW9uc1t1c2VyUGV0LnN0YXRlXS5zcGVlZCB8fCAwXG4gICAgdXNlclBldC5pc1RyYW5zaXRpb25JbiA9IHRydWVcbiAgfVxufVxuIiwiaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuLydcblxuZXhwb3J0IGxldCBzdGF0ZTogU3RhdGVcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVTdGF0ZSA9IChpbml0aWFsU3RhdGU6IFN0YXRlKSA9PiAoc3RhdGUgPSBpbml0aWFsU3RhdGUpXG5cbmV4cG9ydCBjb25zdCBzZXRTdGF0ZSA9IDxLIGV4dGVuZHMga2V5b2YgU3RhdGU+KGtleTogSywgdmFsdWU6IFN0YXRlW0tdKSA9PlxuICAoc3RhdGUgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgW2tleV06IHZhbHVlLFxuICB9KVxuIiwiaW1wb3J0IHsgRGlyZWN0aW9uLCBOZXh0RnJhbWVPcHRzLCBUcmFuc2Zvcm1zIH0gZnJvbSAnLi8nXG5cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1zOiBUcmFuc2Zvcm1zID0ge1xuICBpZGxlOiB7XG4gICAgbmV4dEZyYW1lOiAoeyBkaXJlY3Rpb24sIG9mZnNldCwgc2NhbGUgfTogTmV4dEZyYW1lT3B0cykgPT4gKHtcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIGxlZnRQb3NpdGlvbjogb2Zmc2V0LFxuICAgICAgc2NhbGUsXG4gICAgfSksXG4gIH0sXG4gIHdhbGtpbmc6IHtcbiAgICBuZXh0RnJhbWU6ICh7XG4gICAgICBjb250YWluZXJXaWR0aCxcbiAgICAgIGxlZnRQb3NpdGlvbjogb2xkTGVmdFBvc2l0aW9uLFxuICAgICAgZGlyZWN0aW9uOiBvbGREaXJlY3Rpb24sXG4gICAgICBzcGVlZCxcbiAgICAgIHNjYWxlLFxuICAgIH06IC8vIG9mZnNldCxcbiAgICBOZXh0RnJhbWVPcHRzKSA9PiB7XG4gICAgICAvLyBEZXRlY3QgaWYgd2UncmUgaW4gZXhwbG9yZXIgdmlldyBtb2RlIChzZXQgaW4gZXh0ZW5zaW9uLnRzKVxuICAgICAgY29uc3QgaXNFeHBsb3JlclZpZXcgPVxuICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiAod2luZG93IGFzIGFueSkuaXNFeHBsb3JlclZpZXcgPT09IHRydWVcblxuICAgICAgLy8gVXNlIGRpZmZlcmVudCBib3VuZGFyaWVzIGJhc2VkIG9uIHZpZXcgdHlwZVxuICAgICAgY29uc3QgcmlnaHRNYXJnaW4gPSBpc0V4cGxvcmVyVmlldyA/IDYwIDogODBcbiAgICAgIGNvbnN0IGxlZnRNYXJnaW4gPSBpc0V4cGxvcmVyVmlldyA/IC0xNSA6IHNwZWVkXG5cbiAgICAgIC8vIERldGVybWluZSBkaXJlY3Rpb24gYmFzZWQgb24gcG9zaXRpb25cbiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9XG4gICAgICAgIG9sZExlZnRQb3NpdGlvbiA+PSBjb250YWluZXJXaWR0aCAtIHNwZWVkIC0gcmlnaHRNYXJnaW5cbiAgICAgICAgICA/IERpcmVjdGlvbi5sZWZ0XG4gICAgICAgICAgOiBvbGRMZWZ0UG9zaXRpb24gPD0gbGVmdE1hcmdpblxuICAgICAgICAgID8gRGlyZWN0aW9uLnJpZ2h0XG4gICAgICAgICAgOiBvbGREaXJlY3Rpb25cblxuICAgICAgLy8gVXBkYXRlIHBvc2l0aW9uIGJhc2VkIG9uIGRpcmVjdGlvblxuICAgICAgY29uc3QgbGVmdFBvc2l0aW9uID1cbiAgICAgICAgZGlyZWN0aW9uID09PSBEaXJlY3Rpb24ucmlnaHRcbiAgICAgICAgICA/IG9sZExlZnRQb3NpdGlvbiArIHNwZWVkXG4gICAgICAgICAgOiBvbGRMZWZ0UG9zaXRpb24gLSBzcGVlZFxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgIGxlZnRQb3NpdGlvbixcbiAgICAgICAgc2NhbGUsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IHdhbGtpbmcgPSAoXG4gIGNvbnRhaW5lcldpZHRoOiBudW1iZXIsXG4gIHNwZWVkOiBudW1iZXIsXG4gIGxlZnRQb3NpdGlvbjogbnVtYmVyLFxuICBkaXJlY3Rpb246IERpcmVjdGlvblxuKTogeyBsZWZ0UG9zaXRpb246IG51bWJlcjsgZGlyZWN0aW9uOiBEaXJlY3Rpb24gfSA9PiB7XG4gIC8vIENoZWNrIGlmIHdlJ3JlIGluIGV4cGxvcmVyIHZpZXcgbW9kZVxuICBjb25zdCBpc0V4cGxvcmVyVmlldyA9XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgKHdpbmRvdyBhcyBhbnkpLmlzRXhwbG9yZXJWaWV3ID09PSB0cnVlXG5cbiAgLy8gVXNlIGRpZmZlcmVudCBtYXJnaW5zIGZvciBleHBsb3JlciB2aWV3XG4gIGNvbnN0IGxlZnRNYXJnaW4gPSBpc0V4cGxvcmVyVmlldyA/IC0xNSA6IHNwZWVkXG4gIGNvbnN0IHJpZ2h0TWFyZ2luID0gaXNFeHBsb3JlclZpZXcgPyA4NSA6IDE1MFxuXG4gIC8vIENhbGN1bGF0ZSBlZmZlY3RpdmUgd2lkdGhcbiAgY29uc3QgZWZmZWN0aXZlV2lkdGggPSBjb250YWluZXJXaWR0aCAtIHJpZ2h0TWFyZ2luXG5cbiAgLy8gRGV0ZXJtaW5lIGRpcmVjdGlvbiBiYXNlZCBvbiBwb3NpdGlvbiBhbmQgYm91bmRhcmllc1xuICBsZXQgbmV3RGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gIGlmIChsZWZ0UG9zaXRpb24gPj0gZWZmZWN0aXZlV2lkdGgpIHtcbiAgICBuZXdEaXJlY3Rpb24gPSBEaXJlY3Rpb24ubGVmdFxuICB9IGVsc2UgaWYgKGxlZnRQb3NpdGlvbiA8PSBsZWZ0TWFyZ2luKSB7XG4gICAgbmV3RGlyZWN0aW9uID0gRGlyZWN0aW9uLnJpZ2h0XG4gIH1cblxuICAvLyBVcGRhdGUgcG9zaXRpb24gYmFzZWQgb24gZGlyZWN0aW9uXG4gIGxldCBuZXdMZWZ0UG9zaXRpb25cbiAgaWYgKG5ld0RpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLnJpZ2h0KSB7XG4gICAgbmV3TGVmdFBvc2l0aW9uID0gbGVmdFBvc2l0aW9uICsgc3BlZWRcbiAgfSBlbHNlIHtcbiAgICBuZXdMZWZ0UG9zaXRpb24gPSBsZWZ0UG9zaXRpb24gLSBzcGVlZFxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsZWZ0UG9zaXRpb246IG5ld0xlZnRQb3NpdGlvbixcbiAgICBkaXJlY3Rpb246IG5ld0RpcmVjdGlvbixcbiAgfVxufVxuIiwiZXhwb3J0IHR5cGUgU3RhdGUgPSB7XG4gIHVzZXJQZXQ6IFVzZXJQZXRcbiAgYmFzZVBldFVyaTogc3RyaW5nXG4gIGludGVydmFsSWQ/OiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgdHlwZSBHaWZzID0geyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH1cblxuZXhwb3J0IHR5cGUgUGV0U3RhdGUgPSAnd2Fsa2luZycgfCAnaWRsZScgfCAndHJhbnNpdGlvbidcblxuZXhwb3J0IHR5cGUgUGV0QW5pbWF0aW9uID0ge1xuICBnaWY6IHN0cmluZ1xuICB3aWR0aDogbnVtYmVyXG4gIGhlaWdodDogbnVtYmVyXG4gIG9mZnNldD86IG51bWJlclxuICBzcGVlZD86IG51bWJlclxuICBkdXJhdGlvbj86IG51bWJlclxufVxuXG5leHBvcnQgdHlwZSBQZXRMZXZlbCA9IHtcbiAgeHA6IG51bWJlclxuICBkZWZhdWx0U3RhdGU6IFBldFN0YXRlXG4gIGFuaW1hdGlvbnM6IHtcbiAgICBbbmFtZTogc3RyaW5nXTogUGV0QW5pbWF0aW9uXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgUGV0ID0ge1xuICBsZXZlbHM6IE1hcDxudW1iZXIsIFBldExldmVsPlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJQZXRCYXNlUHJvcHMge1xuICBsZWZ0UG9zaXRpb246IG51bWJlclxuICBzcGVlZDogbnVtYmVyXG4gIG9yaWdpbmFsU3BlZWQ/OiBudW1iZXJcbiAgZGlyZWN0aW9uOiBudW1iZXJcbiAgbGV2ZWw6IG51bWJlclxuICB4cDogbnVtYmVyXG4gIHN0YXRlOiBQZXRTdGF0ZVxuICBpc1RyYW5zaXRpb25JbjogYm9vbGVhblxuICBzY2FsZTogbnVtYmVyXG59XG5cbmV4cG9ydCB0eXBlIFBldFR5cGUgPSAnbW9uc3RlcjEnIHwgJ21vbnN0ZXIyJyB8ICd1bmtub3duJ1xuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJQZXRBcmdzIHtcbiAgbmFtZTogc3RyaW5nXG4gIHR5cGU6IFBldFR5cGVcbn1cblxuZXhwb3J0IHR5cGUgVXNlclBldCA9IFVzZXJQZXRCYXNlUHJvcHMgJiBVc2VyUGV0QXJnc1xuXG5leHBvcnQgZW51bSBEaXJlY3Rpb24ge1xuICByaWdodCA9IDEsXG4gIGxlZnQgPSAtMSxcbn1cblxuZXhwb3J0IHR5cGUgTmV4dEZyYW1lT3B0cyA9IHtcbiAgY29udGFpbmVyV2lkdGg6IG51bWJlclxuICBsZWZ0UG9zaXRpb246IG51bWJlclxuICBkaXJlY3Rpb246IG51bWJlclxuICBzcGVlZDogbnVtYmVyXG4gIG9mZnNldDogbnVtYmVyXG4gIHNjYWxlOiBudW1iZXJcbn1cblxuZXhwb3J0IHR5cGUgTmV4dEZyYW1lRm5SZXR1cm4gPSB7XG4gIGxlZnRQb3NpdGlvbjogbnVtYmVyXG4gIGRpcmVjdGlvbjogbnVtYmVyXG4gIG5ld1BldFN0YXRlPzogUGV0U3RhdGVcbn1cblxuZXhwb3J0IHR5cGUgTmV4dEZyYW1lRm4gPSAob3B0czogTmV4dEZyYW1lT3B0cykgPT4gTmV4dEZyYW1lRm5SZXR1cm5cblxuZXhwb3J0IHR5cGUgVHJhbnNmb3JtcyA9IHtcbiAgW3RyYW5zZm9ybTogc3RyaW5nXToge1xuICAgIG5leHRGcmFtZTogTmV4dEZyYW1lRm5cbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3BhbmVsL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
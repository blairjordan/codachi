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
                (0, exports.addPetToPanel)({
                    userPet: Object.assign(Object.assign({}, data.userPet), { leftPosition: _1.state.userPet.leftPosition, direction: _1.state.userPet.direction }),
                });
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
        transition: Object.assign(Object.assign({}, animationDefaults), { gif: 'dust1', offset: 6, width: 100, height: 100 }),
    },
};
// Generic evolution transition
const transition = Object.assign(Object.assign({}, animationDefaults), { gif: 'dust2', offset: -85, width: 280, height: 100 });
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
                        xp: 40,
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
                        xp: 50,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFZLFNBQVM7SUFDbkIsMkNBQVM7SUFDVCwwQ0FBUztBQUNYLENBQUMsRUFIVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQUdwQjs7Ozs7OztVQ3ZERDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9kb20udHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9pbmRleC50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL21haW4udHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9wZXRzLnRzIiwid2VicGFjazovL2NvZGFjaGlBcHAvLi9zcmMvcGFuZWwvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC90cmFuc2Zvcm1zLnRzIiwid2VicGFjazovL2NvZGFjaGlBcHAvLi9zcmMvcGFuZWwvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIERPTSB7XG4gIHByaXZhdGUgX3BldEltYWdlU2VsZWN0b3I6IHN0cmluZ1xuICBwcml2YXRlIF9tb3ZlbWVudENvbnRhaW5lclNlbGVjdG9yOiBzdHJpbmdcbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yOiBzdHJpbmdcbiAgcHJpdmF0ZSBfdHJhbnNpdGlvblNlbGVjdG9yOiBzdHJpbmdcblxuICBwcml2YXRlIF9tb3ZlbWVudENvbnRhaW5lckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkXG4gIHByaXZhdGUgX3BldEltYWdlRWxlbWVudDogSFRNTEltYWdlRWxlbWVudCB8IHVuZGVmaW5lZFxuICBwcml2YXRlIF90cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWRcbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbkltYWdlRWxlbWVudDogSFRNTEltYWdlRWxlbWVudCB8IHVuZGVmaW5lZFxuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBtb3ZlbWVudENvbnRhaW5lclNlbGVjdG9yLFxuICAgIHBldEltYWdlU2VsZWN0b3IsXG4gICAgdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yLFxuICAgIHRyYW5zaXRpb25TZWxlY3RvcixcbiAgfToge1xuICAgIHBldEltYWdlU2VsZWN0b3I6IHN0cmluZ1xuICAgIG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3I6IHN0cmluZ1xuICAgIHRyYW5zaXRpb25Db250YWluZXJTZWxlY3Rvcjogc3RyaW5nXG4gICAgdHJhbnNpdGlvblNlbGVjdG9yOiBzdHJpbmdcbiAgfSkge1xuICAgIHRoaXMuX3BldEltYWdlU2VsZWN0b3IgPSBwZXRJbWFnZVNlbGVjdG9yXG4gICAgdGhpcy5fbW92ZW1lbnRDb250YWluZXJTZWxlY3RvciA9IG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3JcbiAgICB0aGlzLl90cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3IgPSB0cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3JcbiAgICB0aGlzLl90cmFuc2l0aW9uU2VsZWN0b3IgPSB0cmFuc2l0aW9uU2VsZWN0b3JcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRIVE1MRWxlbWVudCA9IDxUPihlbGVtZW50TmFtZTogc3RyaW5nKTogVCA9PiB7XG4gICAgY29uc3QgaHRtbEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50TmFtZSkgYXMgdW5rbm93blxuICAgIGlmICghaHRtbEVsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGxvY2F0ZSBlbGVtZW50IGluIERPTTogJHtlbGVtZW50TmFtZX1gKVxuICAgIH1cblxuICAgIHJldHVybiBodG1sRWxlbWVudCBhcyBUXG4gIH1cblxuICBnZXRNb3ZlbWVudFNlbGVjdG9yKCk6IEhUTUxFbGVtZW50IHtcbiAgICBpZiAoIXRoaXMuX21vdmVtZW50Q29udGFpbmVyRWxlbWVudCkge1xuICAgICAgdGhpcy5fbW92ZW1lbnRDb250YWluZXJFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MRWxlbWVudD4oXG4gICAgICAgIHRoaXMuX21vdmVtZW50Q29udGFpbmVyU2VsZWN0b3JcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX21vdmVtZW50Q29udGFpbmVyRWxlbWVudFxuICB9XG5cbiAgZ2V0UGV0SW1hZ2VTZWxlY3RvcigpOiBIVE1MSW1hZ2VFbGVtZW50IHtcbiAgICBpZiAoIXRoaXMuX3BldEltYWdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fcGV0SW1hZ2VFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MSW1hZ2VFbGVtZW50PihcbiAgICAgICAgdGhpcy5fcGV0SW1hZ2VTZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcGV0SW1hZ2VFbGVtZW50XG4gIH1cblxuICBnZXRUcmFuc2l0aW9uU2VsZWN0b3IoKTogSFRNTEVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX3RyYW5zaXRpb25Db250YWluZXJFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MRWxlbWVudD4oXG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25Db250YWluZXJTZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnRcbiAgfVxuXG4gIGdldFRyYW5zaXRpb25JbWFnZVNlbGVjdG9yKCk6IEhUTUxJbWFnZUVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fdHJhbnNpdGlvbkltYWdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbkltYWdlRWxlbWVudCA9IHRoaXMuZ2V0SFRNTEVsZW1lbnQ8SFRNTEltYWdlRWxlbWVudD4oXG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25TZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHJhbnNpdGlvbkltYWdlRWxlbWVudFxuICB9XG59XG4iLCJpbXBvcnQgeyBET00gfSBmcm9tICcuL2RvbSdcbmltcG9ydCB7XG4gIGdlbmVyYXRlUGV0LFxuICBnZXRQZXRBbmltYXRpb25zLFxuICBnaWZzLFxuICBtdXRhdGVMZXZlbCxcbiAgcGV0VHlwZXMsXG4gIHJhbmRvbVBldE5hbWUsXG4gIHJhbmRvbVBldFR5cGUsXG59IGZyb20gJy4vcGV0cydcbmltcG9ydCB7IGluaXRpYWxpemVTdGF0ZSwgc2V0U3RhdGUsIHN0YXRlIH0gZnJvbSAnLi9zdGF0ZSdcbmltcG9ydCB7IHRyYW5zZm9ybXMgfSBmcm9tICcuL3RyYW5zZm9ybXMnXG5pbXBvcnQge1xuICBEaXJlY3Rpb24sXG4gIEdpZnMsXG4gIE5leHRGcmFtZUZuLFxuICBOZXh0RnJhbWVGblJldHVybixcbiAgTmV4dEZyYW1lT3B0cyxcbiAgUGV0LFxuICBQZXRBbmltYXRpb24sXG4gIFBldExldmVsLFxuICBQZXRTdGF0ZSxcbiAgUGV0VHlwZSxcbiAgU3RhdGUsXG4gIFRyYW5zZm9ybXMsXG4gIFVzZXJQZXQsXG4gIFVzZXJQZXRBcmdzLFxuICBVc2VyUGV0QmFzZVByb3BzLFxufSBmcm9tICcuL3R5cGVzJ1xuXG4vLyBGdW5jdGlvbiB0byBhZGp1c3Qgc3BlZWQgYmFzZWQgb24gc2NhbGVcbmV4cG9ydCBjb25zdCBhZGp1c3RTcGVlZEZvclNjYWxlID0gKFxuICBvcmlnaW5hbFNwZWVkOiBudW1iZXIsXG4gIHNjYWxlOiBudW1iZXJcbik6IG51bWJlciA9PiBvcmlnaW5hbFNwZWVkICogKDAuNyArIDAuNiAqIHNjYWxlKVxuXG5leHBvcnQge1xuICBEaXJlY3Rpb24sXG4gIERPTSxcbiAgZ2VuZXJhdGVQZXQsXG4gIGdldFBldEFuaW1hdGlvbnMsXG4gIGdpZnMsXG4gIEdpZnMsXG4gIGluaXRpYWxpemVTdGF0ZSxcbiAgbXV0YXRlTGV2ZWwsXG4gIE5leHRGcmFtZUZuLFxuICBOZXh0RnJhbWVGblJldHVybixcbiAgTmV4dEZyYW1lT3B0cyxcbiAgUGV0LFxuICBQZXRBbmltYXRpb24sXG4gIFBldExldmVsLFxuICBQZXRTdGF0ZSxcbiAgUGV0VHlwZSxcbiAgcGV0VHlwZXMsXG4gIHJhbmRvbVBldE5hbWUsXG4gIHJhbmRvbVBldFR5cGUsXG4gIHNldFN0YXRlLFxuICBTdGF0ZSxcbiAgc3RhdGUsXG4gIFRyYW5zZm9ybXMsXG4gIHRyYW5zZm9ybXMsXG4gIFVzZXJQZXQsXG4gIFVzZXJQZXRBcmdzLFxuICBVc2VyUGV0QmFzZVByb3BzLFxufVxuIiwiaW1wb3J0IHtcbiAgRE9NLFxuICBQZXRBbmltYXRpb24sXG4gIFVzZXJQZXQsXG4gIGFkanVzdFNwZWVkRm9yU2NhbGUsXG4gIGdlbmVyYXRlUGV0LFxuICBnZXRQZXRBbmltYXRpb25zLFxuICBnaWZzLFxuICBzZXRTdGF0ZSxcbiAgc3RhdGUsXG4gIHRyYW5zZm9ybXMsXG59IGZyb20gJy4vJ1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN0YXRlIH0gZnJvbSAnLi9zdGF0ZSdcblxuY29uc3QgZGVmYXVsdFN0YXRlID0ge1xuICB1c2VyUGV0OiBnZW5lcmF0ZVBldCh7IG5hbWU6ICd1bmtub3duJywgdHlwZTogJ3Vua25vd24nIH0pLFxuICBiYXNlUGV0VXJpOiAnJyxcbn1cblxuaW5pdGlhbGl6ZVN0YXRlKGRlZmF1bHRTdGF0ZSlcblxuY29uc3QgZG9tID0gbmV3IERPTSh7XG4gIG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3I6ICdtb3ZlbWVudC1jb250YWluZXInLFxuICBwZXRJbWFnZVNlbGVjdG9yOiAncGV0JyxcbiAgdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yOiAndHJhbnNpdGlvbi1jb250YWluZXInLFxuICB0cmFuc2l0aW9uU2VsZWN0b3I6ICd0cmFuc2l0aW9uJyxcbn0pXG5cbmNvbnN0IFRJQ0tfSU5URVJWQUxfTVMgPSAxMDBcblxuY29uc3QgdGljayA9ICh7IHVzZXJQZXQgfTogeyB1c2VyUGV0OiBVc2VyUGV0IH0pID0+IHtcbiAgY29uc3QgeyBsZWZ0UG9zaXRpb24sIGRpcmVjdGlvbiB9ID0gdHJhbnNmb3Jtc1t1c2VyUGV0LnN0YXRlXS5uZXh0RnJhbWUoe1xuICAgIGNvbnRhaW5lcldpZHRoOlxuICAgICAgd2luZG93LmlubmVyV2lkdGggfHxcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fFxuICAgICAgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCxcbiAgICBsZWZ0UG9zaXRpb246IHVzZXJQZXQubGVmdFBvc2l0aW9uLFxuICAgIGRpcmVjdGlvbjogdXNlclBldC5kaXJlY3Rpb24sXG4gICAgc3BlZWQ6IGFkanVzdFNwZWVkRm9yU2NhbGUodXNlclBldC5zcGVlZCwgdXNlclBldC5zY2FsZSksXG4gICAgb2Zmc2V0OiBnZXRQZXRBbmltYXRpb25zKHsgdXNlclBldCB9KS5hbmltYXRpb24ub2Zmc2V0IHx8IDAsXG4gICAgc2NhbGU6IHVzZXJQZXQuc2NhbGUsXG4gIH0pXG5cbiAgdXNlclBldC5sZWZ0UG9zaXRpb24gPSBsZWZ0UG9zaXRpb25cbiAgdXNlclBldC5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cblxuICAvLyBBcHBseSB0cmFuc2Zvcm1hdGlvblxuICBjb25zdCBtb3ZlbWVudENvbnRhaW5lciA9IGRvbS5nZXRNb3ZlbWVudFNlbGVjdG9yKClcbiAgbW92ZW1lbnRDb250YWluZXIuc3R5bGUubWFyZ2luTGVmdCA9IGAke3VzZXJQZXQubGVmdFBvc2l0aW9ufXB4YFxuXG4gIGNvbnN0IHBldEltYWdlRWxlbWVudCA9IGRvbS5nZXRQZXRJbWFnZVNlbGVjdG9yKClcbiAgcGV0SW1hZ2VFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZVgoJHt1c2VyUGV0LmRpcmVjdGlvbn0pIHNjYWxlKCR7dXNlclBldC5zY2FsZX0pYFxuXG4gIC8vIEdldCB0aGUgcGV0IGNvbnRhaW5lciBhbmQgYWRqdXN0IGl0cyBwb3NpdGlvbiB0byBrZWVwIHBldCBvbiB0aGUgZ3JvdW5kXG4gIGNvbnN0IHBldENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZXQtY29udGFpbmVyJylcbiAgaWYgKHBldENvbnRhaW5lcikge1xuICAgIGNvbnN0IHsgYW5pbWF0aW9uIH0gPSBnZXRQZXRBbmltYXRpb25zKHsgdXNlclBldCB9KVxuICAgIGNvbnN0IHZlcnRpY2FsQWRqdXN0bWVudCA9IChhbmltYXRpb24uaGVpZ2h0ICogKHVzZXJQZXQuc2NhbGUgLSAxKSkgLyAyXG4gICAgcGV0Q29udGFpbmVyLnN0eWxlLmJvdHRvbSA9IGAke3ZlcnRpY2FsQWRqdXN0bWVudH1weGBcbiAgfVxuXG4gIGlmICh1c2VyUGV0LmlzVHJhbnNpdGlvbkluKSB7XG4gICAgY29uc3QgeyB0cmFuc2l0aW9uOiBhbmltYXRpb24gfSA9IGdldFBldEFuaW1hdGlvbnMoe1xuICAgICAgdXNlclBldCxcbiAgICB9KVxuXG4gICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgY29uc3QgdHJhbnNpdGlvbkNvbnRhaW5lciA9IGRvbS5nZXRUcmFuc2l0aW9uU2VsZWN0b3IoKVxuICAgICAgdHJhbnNpdGlvbkNvbnRhaW5lci5zdHlsZS5tYXJnaW5MZWZ0ID0gYCR7dXNlclBldC5sZWZ0UG9zaXRpb259cHhgXG5cbiAgICAgIC8vIEFsc28gYWRqdXN0IHRyYW5zaXRpb24gY29udGFpbmVyIGhlaWdodFxuICAgICAgY29uc3QgdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgJ3RyYW5zaXRpb24tY29udGFpbmVyJ1xuICAgICAgKVxuICAgICAgaWYgKHRyYW5zaXRpb25Db250YWluZXJFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHZlcnRpY2FsQWRqdXN0bWVudCA9IChhbmltYXRpb24uaGVpZ2h0ICogKHVzZXJQZXQuc2NhbGUgLSAxKSkgLyAyXG4gICAgICAgIHRyYW5zaXRpb25Db250YWluZXJFbGVtZW50LnN0eWxlLmJvdHRvbSA9IGAke3ZlcnRpY2FsQWRqdXN0bWVudH1weGBcbiAgICAgIH1cblxuICAgICAgc2V0SW1hZ2Uoe1xuICAgICAgICBjb250YWluZXI6IGRvbS5nZXRUcmFuc2l0aW9uU2VsZWN0b3IoKSxcbiAgICAgICAgc2VsZWN0b3I6IGRvbS5nZXRUcmFuc2l0aW9uSW1hZ2VTZWxlY3RvcigpLFxuICAgICAgICBhbmltYXRpb24sXG4gICAgICB9KVxuICAgICAgc3RhdGUudXNlclBldC5pc1RyYW5zaXRpb25JbiA9IGZhbHNlXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHNldEltYWdlID0gKHtcbiAgY29udGFpbmVyLFxuICBzZWxlY3RvcixcbiAgYW5pbWF0aW9uLFxufToge1xuICBjb250YWluZXI6IEhUTUxFbGVtZW50XG4gIHNlbGVjdG9yOiBIVE1MSW1hZ2VFbGVtZW50XG4gIGFuaW1hdGlvbjogUGV0QW5pbWF0aW9uXG59KSA9PiB7XG4gIGNvbnN0IHsgYmFzZVBldFVyaSwgdXNlclBldCB9ID0gc3RhdGVcblxuICBzZWxlY3Rvci5zcmMgPSBgJHtiYXNlUGV0VXJpfS8ke2dpZnNbYW5pbWF0aW9uLmdpZl19YFxuICBzZWxlY3Rvci53aWR0aCA9IGFuaW1hdGlvbi53aWR0aFxuICBzZWxlY3Rvci5zdHlsZS5taW5XaWR0aCA9IGAke2FuaW1hdGlvbi53aWR0aH1weGBcbiAgc2VsZWN0b3IuaGVpZ2h0ID0gYW5pbWF0aW9uLmhlaWdodFxuXG4gIC8vIEZvciBwZXQgaW1hZ2UsIHdlIG5lZWQgdG8gbWFpbnRhaW4gc2NhbGVYIGZvciBkaXJlY3Rpb25cbiAgaWYgKHNlbGVjdG9yID09PSBkb20uZ2V0UGV0SW1hZ2VTZWxlY3RvcigpKSB7XG4gICAgc2VsZWN0b3Iuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlWCgke3VzZXJQZXQuZGlyZWN0aW9ufSkgc2NhbGUoJHt1c2VyUGV0LnNjYWxlfSlgXG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIHRyYW5zaXRpb24gaW1hZ2VzLCBqdXN0IGFwcGx5IHRoZSBzY2FsZVxuICAgIHNlbGVjdG9yLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3VzZXJQZXQuc2NhbGV9KWBcbiAgfVxuXG4gIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gYCR7YW5pbWF0aW9uLm9mZnNldCA/PyAwfXB4YFxufVxuXG5jb25zdCBzbGVlcCA9IChtczogbnVtYmVyKSA9PiBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBtcykpXG5cbmNvbnN0IHN0YXJ0QW5pbWF0aW9uID0gKCkgPT4ge1xuICBjb25zdCB7IHVzZXJQZXQgfSA9IHN0YXRlXG4gIGlmIChzdGF0ZS5pbnRlcnZhbElkKSB7XG4gICAgY2xlYXJJbnRlcnZhbChzdGF0ZS5pbnRlcnZhbElkKVxuICB9XG4gIGNvbnN0IGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgdGljayh7IHVzZXJQZXQgfSlcbiAgfSwgVElDS19JTlRFUlZBTF9NUylcbiAgc2V0U3RhdGUoJ2ludGVydmFsSWQnLCBpbnRlcnZhbElkKVxufVxuXG5leHBvcnQgY29uc3QgYWRkUGV0VG9QYW5lbCA9IGFzeW5jICh7IHVzZXJQZXQgfTogeyB1c2VyUGV0OiBVc2VyUGV0IH0pID0+IHtcbiAgY29uc3QgeyBhbmltYXRpb24gfSA9IGdldFBldEFuaW1hdGlvbnMoe1xuICAgIHVzZXJQZXQsXG4gIH0pXG5cbiAgLy8gU3RvcmUgdGhlIG9yaWdpbmFsIHNwZWVkIGlmIGl0J3Mgbm90IGFscmVhZHkgc2V0XG4gIGlmICghdXNlclBldC5vcmlnaW5hbFNwZWVkICYmIGFuaW1hdGlvbi5zcGVlZCkge1xuICAgIHVzZXJQZXQub3JpZ2luYWxTcGVlZCA9IGFuaW1hdGlvbi5zcGVlZFxuICB9XG5cbiAgaWYgKHVzZXJQZXQub3JpZ2luYWxTcGVlZCkge1xuICAgIHVzZXJQZXQuc3BlZWQgPSBhZGp1c3RTcGVlZEZvclNjYWxlKHVzZXJQZXQub3JpZ2luYWxTcGVlZCwgdXNlclBldC5zY2FsZSlcbiAgfVxuXG4gIHNldFN0YXRlKCd1c2VyUGV0JywgdXNlclBldClcbiAgc3RhcnRBbmltYXRpb24oKVxuXG4gIC8vIEdpdmUgdGhlIHRyYW5zaXRpb24gYSBjaGFuY2UgdG8gcGxheVxuICBhd2FpdCBzbGVlcChUSUNLX0lOVEVSVkFMX01TICogMilcblxuICBzZXRJbWFnZSh7XG4gICAgc2VsZWN0b3I6IGRvbS5nZXRQZXRJbWFnZVNlbGVjdG9yKCksXG4gICAgYW5pbWF0aW9uLFxuICAgIGNvbnRhaW5lcjogZG9tLmdldE1vdmVtZW50U2VsZWN0b3IoKSxcbiAgfSlcblxuICAvLyBBcHBseSB2ZXJ0aWNhbCBwb3NpdGlvbiBhZGp1c3RtZW50IGZvciB0aGUgcGV0IGNvbnRhaW5lclxuICBjb25zdCBwZXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGV0LWNvbnRhaW5lcicpXG4gIGlmIChwZXRDb250YWluZXIpIHtcbiAgICBjb25zdCB2ZXJ0aWNhbEFkanVzdG1lbnQgPSAoYW5pbWF0aW9uLmhlaWdodCAqICh1c2VyUGV0LnNjYWxlIC0gMSkpIC8gMlxuICAgIHBldENvbnRhaW5lci5zdHlsZS5ib3R0b20gPSBgJHt2ZXJ0aWNhbEFkanVzdG1lbnR9cHhgXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFwcCA9ICh7XG4gIHVzZXJQZXQsXG4gIGJhc2VQZXRVcmksXG59OiB7XG4gIHVzZXJQZXQ6IFVzZXJQZXRcbiAgYmFzZVBldFVyaTogc3RyaW5nXG59KSA9PiB7XG4gIHNldFN0YXRlKCdiYXNlUGV0VXJpJywgYmFzZVBldFVyaSlcblxuICBpZiAodXNlclBldCkge1xuICAgIGFkZFBldFRvUGFuZWwoeyB1c2VyUGV0IH0pXG4gIH1cblxuICAvLyBIYW5kbGUgbWVzc2FnZXMgc2VudCBmcm9tIHRoZSBleHRlbnNpb24gdG8gdGhlIHdlYnZpZXdcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IGNvbW1hbmQsIGRhdGEgfSA9IGV2ZW50LmRhdGEgLy8gVGhlIGRhdGEgdGhhdCB0aGUgZXh0ZW5zaW9uIHNlbnRcbiAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICAgIGNhc2UgJ3NwYXduLXBldCc6XG4gICAgICAgIGFkZFBldFRvUGFuZWwoeyB1c2VyUGV0OiBkYXRhLnVzZXJQZXQgfSlcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAndXBkYXRlLXBldCc6XG4gICAgICAgIGFkZFBldFRvUGFuZWwoe1xuICAgICAgICAgIHVzZXJQZXQ6IHtcbiAgICAgICAgICAgIC4uLmRhdGEudXNlclBldCxcbiAgICAgICAgICAgIGxlZnRQb3NpdGlvbjogc3RhdGUudXNlclBldC5sZWZ0UG9zaXRpb24sXG4gICAgICAgICAgICBkaXJlY3Rpb246IHN0YXRlLnVzZXJQZXQuZGlyZWN0aW9uLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9KVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aW9uLFxuICBHaWZzLFxuICBQZXQsXG4gIFBldEFuaW1hdGlvbixcbiAgUGV0TGV2ZWwsXG4gIFBldFR5cGUsXG4gIFVzZXJQZXQsXG4gIFVzZXJQZXRBcmdzLFxufSBmcm9tICcuLydcblxuZXhwb3J0IGNvbnN0IGdpZnM6IEdpZnMgPSB7XG4gIGVnZzE6ICdlZ2cxLmdpZicsXG4gIGR1c3QxOiAnZHVzdDEuZ2lmJyxcbiAgZHVzdDI6ICdkdXN0Mi5naWYnLFxuICBtb25zdGVyMXBoYXNlMTogJ20xZDEuZ2lmJyxcbiAgbW9uc3RlcjFwaGFzZTI6ICdtMWQyLmdpZicsXG4gIG1vbnN0ZXIxcGhhc2UzOiAnbTFkMy5naWYnLFxuICBtb25zdGVyMnBoYXNlMTogJ20yZDEuZ2lmJyxcbiAgbW9uc3RlcjJwaGFzZTI6ICdtMmQyLmdpZicsXG4gIG1vbnN0ZXIycGhhc2UzOiAnbTJkMy5naWYnLFxuICBtb25zdGVyM3BoYXNlMTogJ20zZDEuZ2lmJyxcbiAgbW9uc3RlcjNwaGFzZTI6ICdtM2QyLmdpZicsXG4gIG1vbnN0ZXIzcGhhc2UzOiAnbTNkMy5naWYnLFxuICBtb25zdGVyNHBoYXNlMTogJ200ZDEuZ2lmJyxcbiAgbW9uc3RlcjRwaGFzZTI6ICdtNGQyLmdpZicsXG4gIG1vbnN0ZXI0cGhhc2UzOiAnbTRkMy5naWYnLFxuICBtb25zdGVyNXBoYXNlMTogJ201ZDEuZ2lmJyxcbiAgbW9uc3RlcjVwaGFzZTI6ICdtNWQyLmdpZicsXG4gIG1vbnN0ZXI1cGhhc2UzOiAnbTVkMy5naWYnLFxufVxuXG5leHBvcnQgY29uc3QgcGV0TmFtZXMgPSBbXG4gICdib28nLFxuICAnbmFjaG8nLFxuICAnZ2FyeScsXG4gICdmdWRnZScsXG4gICduZWtvJyxcbiAgJ3BpcCcsXG4gICdiaWJvJyxcbiAgJ2ZpZmknLFxuICAnamF4JyxcbiAgJ2JvYmJhJyxcbiAgJ2dpZGdldCcsXG4gICdtaW5hJyxcbiAgJ2NydW1iJyxcbiAgJ3ppbWJvJyxcbiAgJ2R1c3R5JyxcbiAgJ2Jyb2NrJyxcbiAgJ290aXMnLFxuICAnbWFydmluJyxcbiAgJ3Ntb2tleScsXG4gICdiYXJyeScsXG4gICd0b255JyxcbiAgJ2R1c3R5JyxcbiAgJ21vY2hpJyxcbl1cblxuY29uc3QgYW5pbWF0aW9uRGVmYXVsdHMgPSB7XG4gIHdpZHRoOiA3NSxcbiAgaGVpZ2h0OiA2NCxcbiAgc3BlZWQ6IDAsXG4gIG9mZnNldDogMCxcbn1cblxuY29uc3QgZWdnOiBQZXRMZXZlbCA9IHtcbiAgeHA6IDAsXG4gIGRlZmF1bHRTdGF0ZTogJ2lkbGUnLFxuICBhbmltYXRpb25zOiB7XG4gICAgaWRsZToge1xuICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICBnaWY6ICdlZ2cxJyxcbiAgICB9LFxuICAgIHRyYW5zaXRpb246IHtcbiAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgZ2lmOiAnZHVzdDEnLFxuICAgICAgb2Zmc2V0OiA2LFxuICAgICAgd2lkdGg6IDEwMCxcbiAgICAgIGhlaWdodDogMTAwLFxuICAgIH0sXG4gIH0sXG59XG5cbi8vIEdlbmVyaWMgZXZvbHV0aW9uIHRyYW5zaXRpb25cbmNvbnN0IHRyYW5zaXRpb246IFBldEFuaW1hdGlvbiA9IHtcbiAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gIGdpZjogJ2R1c3QyJyxcbiAgb2Zmc2V0OiAtODUsXG4gIHdpZHRoOiAyODAsXG4gIGhlaWdodDogMTAwLFxufVxuXG5leHBvcnQgY29uc3QgcGV0VHlwZXMgPSBuZXcgTWFwPHN0cmluZywgUGV0PihbXG4gIFtcbiAgICAnbW9uc3RlcjEnLFxuICAgIHtcbiAgICAgIGxldmVsczogbmV3IE1hcChbXG4gICAgICAgIFswLCBlZ2ddLFxuICAgICAgICBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMzUsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIxcGhhc2UxJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDUwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMXBoYXNlMicsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA2MCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjFwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyMicsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjJwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDQwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMnBoYXNlMicsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNTAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIycGhhc2UzJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuICBbXG4gICAgJ21vbnN0ZXIzJyxcbiAgICB7XG4gICAgICBsZXZlbHM6IG5ldyBNYXAoW1xuICAgICAgICBbMCwgZWdnXSxcbiAgICAgICAgW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDM1LFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyM3BoYXNlMScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAxLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNTAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIzcGhhc2UyJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA2MCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjNwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF0pLFxuICAgIH0sXG4gIF0sXG4gIFtcbiAgICAnbW9uc3RlcjQnLFxuICAgIHtcbiAgICAgIGxldmVsczogbmV3IE1hcChbXG4gICAgICAgIFswLCBlZ2ddLFxuICAgICAgICBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMzUsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI0cGhhc2UxJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA1MCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjRwaGFzZTInLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDYwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyNHBoYXNlMycsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAzLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyNScsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjVwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDY2LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNTAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI1cGhhc2UyJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNjAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXI1cGhhc2UzJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEzNSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTI1LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbl0pXG5cbmV4cG9ydCBjb25zdCByYW5kb21QZXRUeXBlID0gKCk6IFBldFR5cGUgPT5cbiAgQXJyYXkuZnJvbShwZXRUeXBlcy5rZXlzKCkpW1xuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBldFR5cGVzLnNpemUpXG4gIF0gYXMgUGV0VHlwZVxuXG5leHBvcnQgY29uc3QgcmFuZG9tUGV0TmFtZSA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBuYW1lID0gcGV0TmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGV0TmFtZXMubGVuZ3RoKV1cbiAgcmV0dXJuIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpLnRvTG93ZXJDYXNlKClcbn1cblxuZXhwb3J0IGNvbnN0IGdldFBldEFuaW1hdGlvbnMgPSAoe1xuICB1c2VyUGV0LFxufToge1xuICB1c2VyUGV0OiBVc2VyUGV0XG59KToge1xuICBhbmltYXRpb246IFBldEFuaW1hdGlvblxuICB0cmFuc2l0aW9uOiBQZXRBbmltYXRpb24gfCB1bmRlZmluZWRcbn0gPT4ge1xuICBjb25zdCBwZXRUeXBlRm91bmQgPSBwZXRUeXBlcy5nZXQodXNlclBldC50eXBlKVxuICBpZiAoIXBldFR5cGVGb3VuZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUGV0IHR5cGUgbm90IGZvdW5kOiAke3VzZXJQZXQudHlwZX1gKVxuICB9XG5cbiAgY29uc3QgbGV2ZWxGb3VuZCA9IHBldFR5cGVGb3VuZC5sZXZlbHMuZ2V0KHVzZXJQZXQubGV2ZWwpXG4gIGlmICghbGV2ZWxGb3VuZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBQZXQgbGV2ZWwgbm90IGZvdW5kIGZvciBwZXQgdHlwZSAke3VzZXJQZXQudHlwZX06ICR7dXNlclBldC5sZXZlbH1gXG4gICAgKVxuICB9XG5cbiAgaWYgKCEodXNlclBldC5zdGF0ZSBpbiBsZXZlbEZvdW5kLmFuaW1hdGlvbnMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEFuaW1hdGlvbiBub3QgZm91bmQgZm9yIHBldCB0eXBlICR7dXNlclBldC50eXBlfSwgbGV2ZWwgJHt1c2VyUGV0LmxldmVsfTogJHt1c2VyUGV0LnN0YXRlfWBcbiAgICApXG4gIH1cblxuICBjb25zdCB0cmFuc2l0aW9uID1cbiAgICAndHJhbnNpdGlvbicgaW4gbGV2ZWxGb3VuZC5hbmltYXRpb25zXG4gICAgICA/IGxldmVsRm91bmQuYW5pbWF0aW9ucy50cmFuc2l0aW9uXG4gICAgICA6IHVuZGVmaW5lZFxuXG4gIHJldHVybiB7XG4gICAgYW5pbWF0aW9uOiBsZXZlbEZvdW5kLmFuaW1hdGlvbnNbdXNlclBldC5zdGF0ZV0sXG4gICAgdHJhbnNpdGlvbixcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVQZXQgPSAoeyBuYW1lLCB0eXBlIH06IFVzZXJQZXRBcmdzKTogVXNlclBldCA9PiAoe1xuICBsZWZ0UG9zaXRpb246IDAsXG4gIHNwZWVkOiAwLFxuICBkaXJlY3Rpb246IERpcmVjdGlvbi5yaWdodCxcbiAgbGV2ZWw6IDAsXG4gIHhwOiAwLFxuICAvLyBBbGwgbGV2ZWwgMCBjaGFyYWN0ZXJzIHJlcXVpcmUgdGhpcyBzdGF0ZVxuICBzdGF0ZTogJ2lkbGUnLFxuICBpc1RyYW5zaXRpb25JbjogdHJ1ZSxcbiAgbmFtZSxcbiAgdHlwZSxcbiAgc2NhbGU6IDEsXG59KVxuXG5leHBvcnQgY29uc3QgZ2V0TGV2ZWwgPSAoe1xuICBwZXRUeXBlLFxuICBsZXZlbCxcbn06IHtcbiAgcGV0VHlwZTogUGV0VHlwZVxuICBsZXZlbDogbnVtYmVyXG59KSA9PiB7XG4gIGNvbnN0IHBldFR5cGVGb3VuZCA9IHBldFR5cGVzLmdldChwZXRUeXBlKVxuICBpZiAoIXBldFR5cGVGb3VuZCkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIGNvbnN0IGxldmVsRm91bmQgPSBwZXRUeXBlRm91bmQubGV2ZWxzLmdldChsZXZlbClcbiAgaWYgKCFsZXZlbEZvdW5kKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cbiAgcmV0dXJuIGxldmVsRm91bmRcbn1cblxuZXhwb3J0IGNvbnN0IG11dGF0ZUxldmVsID0gKHsgdXNlclBldCB9OiB7IHVzZXJQZXQ6IFVzZXJQZXQgfSkgPT4ge1xuICBjb25zdCBuZXh0TGV2ZWxGb3VuZCA9IGdldExldmVsKHtcbiAgICBwZXRUeXBlOiB1c2VyUGV0LnR5cGUsXG4gICAgbGV2ZWw6IHVzZXJQZXQubGV2ZWwgKyAxLFxuICB9KVxuXG4gIGlmICghbmV4dExldmVsRm91bmQpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh1c2VyUGV0LnhwID49IG5leHRMZXZlbEZvdW5kLnhwKSB7XG4gICAgdXNlclBldC5sZXZlbCArPSAxXG4gICAgdXNlclBldC54cCA9IDBcbiAgICB1c2VyUGV0LnN0YXRlID0gbmV4dExldmVsRm91bmQuZGVmYXVsdFN0YXRlXG4gICAgdXNlclBldC5zcGVlZCA9IG5leHRMZXZlbEZvdW5kLmFuaW1hdGlvbnNbdXNlclBldC5zdGF0ZV0uc3BlZWQgfHwgMFxuICAgIHVzZXJQZXQuaXNUcmFuc2l0aW9uSW4gPSB0cnVlXG4gIH1cbn1cbiIsImltcG9ydCB7IFN0YXRlIH0gZnJvbSAnLi8nXG5cbmV4cG9ydCBsZXQgc3RhdGU6IFN0YXRlXG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplU3RhdGUgPSAoaW5pdGlhbFN0YXRlOiBTdGF0ZSkgPT4gKHN0YXRlID0gaW5pdGlhbFN0YXRlKVxuXG5leHBvcnQgY29uc3Qgc2V0U3RhdGUgPSA8SyBleHRlbmRzIGtleW9mIFN0YXRlPihrZXk6IEssIHZhbHVlOiBTdGF0ZVtLXSkgPT5cbiAgKHN0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIFtrZXldOiB2YWx1ZSxcbiAgfSlcbiIsImltcG9ydCB7IFRyYW5zZm9ybXMsIE5leHRGcmFtZU9wdHMsIERpcmVjdGlvbiB9IGZyb20gJy4vJ1xuXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtczogVHJhbnNmb3JtcyA9IHtcbiAgaWRsZToge1xuICAgIG5leHRGcmFtZTogKHsgZGlyZWN0aW9uLCBvZmZzZXQsIHNjYWxlIH06IE5leHRGcmFtZU9wdHMpID0+ICh7XG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBsZWZ0UG9zaXRpb246IG9mZnNldCxcbiAgICAgIHNjYWxlLFxuICAgIH0pLFxuICB9LFxuICB3YWxraW5nOiB7XG4gICAgbmV4dEZyYW1lOiAoe1xuICAgICAgY29udGFpbmVyV2lkdGgsXG4gICAgICBsZWZ0UG9zaXRpb246IG9sZExlZnRQb3NpdGlvbixcbiAgICAgIGRpcmVjdGlvbjogb2xkRGlyZWN0aW9uLFxuICAgICAgc3BlZWQsXG4gICAgICBzY2FsZSxcbiAgICB9OiAvLyBvZmZzZXQsXG4gICAgTmV4dEZyYW1lT3B0cykgPT4ge1xuICAgICAgY29uc3QgZGlyZWN0aW9uID1cbiAgICAgICAgb2xkTGVmdFBvc2l0aW9uID49IGNvbnRhaW5lcldpZHRoIC0gc3BlZWQgLSAxNTBcbiAgICAgICAgICA/IERpcmVjdGlvbi5sZWZ0XG4gICAgICAgICAgOiBvbGRMZWZ0UG9zaXRpb24gPD0gMCArIHNwZWVkXG4gICAgICAgICAgPyBEaXJlY3Rpb24ucmlnaHRcbiAgICAgICAgICA6IG9sZERpcmVjdGlvblxuXG4gICAgICBjb25zdCBsZWZ0UG9zaXRpb24gPVxuICAgICAgICBkaXJlY3Rpb24gPT09IERpcmVjdGlvbi5yaWdodFxuICAgICAgICAgID8gb2xkTGVmdFBvc2l0aW9uICsgc3BlZWRcbiAgICAgICAgICA6IG9sZExlZnRQb3NpdGlvbiAtIHNwZWVkXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgbGVmdFBvc2l0aW9uLFxuICAgICAgICBzY2FsZSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxufVxuIiwiZXhwb3J0IHR5cGUgU3RhdGUgPSB7XG4gIHVzZXJQZXQ6IFVzZXJQZXRcbiAgYmFzZVBldFVyaTogc3RyaW5nXG4gIGludGVydmFsSWQ/OiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgdHlwZSBHaWZzID0geyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH1cblxuZXhwb3J0IHR5cGUgUGV0U3RhdGUgPSAnd2Fsa2luZycgfCAnaWRsZScgfCAndHJhbnNpdGlvbidcblxuZXhwb3J0IHR5cGUgUGV0QW5pbWF0aW9uID0ge1xuICBnaWY6IHN0cmluZ1xuICB3aWR0aDogbnVtYmVyXG4gIGhlaWdodDogbnVtYmVyXG4gIG9mZnNldD86IG51bWJlclxuICBzcGVlZD86IG51bWJlclxuICBkdXJhdGlvbj86IG51bWJlclxufVxuXG5leHBvcnQgdHlwZSBQZXRMZXZlbCA9IHtcbiAgeHA6IG51bWJlclxuICBkZWZhdWx0U3RhdGU6IFBldFN0YXRlXG4gIGFuaW1hdGlvbnM6IHtcbiAgICBbbmFtZTogc3RyaW5nXTogUGV0QW5pbWF0aW9uXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgUGV0ID0ge1xuICBsZXZlbHM6IE1hcDxudW1iZXIsIFBldExldmVsPlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJQZXRCYXNlUHJvcHMge1xuICBsZWZ0UG9zaXRpb246IG51bWJlclxuICBzcGVlZDogbnVtYmVyXG4gIG9yaWdpbmFsU3BlZWQ/OiBudW1iZXJcbiAgZGlyZWN0aW9uOiBudW1iZXJcbiAgbGV2ZWw6IG51bWJlclxuICB4cDogbnVtYmVyXG4gIHN0YXRlOiBQZXRTdGF0ZVxuICBpc1RyYW5zaXRpb25JbjogYm9vbGVhblxuICBzY2FsZTogbnVtYmVyXG59XG5cbmV4cG9ydCB0eXBlIFBldFR5cGUgPSAnbW9uc3RlcjEnIHwgJ21vbnN0ZXIyJyB8ICd1bmtub3duJ1xuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJQZXRBcmdzIHtcbiAgbmFtZTogc3RyaW5nXG4gIHR5cGU6IFBldFR5cGVcbn1cblxuZXhwb3J0IHR5cGUgVXNlclBldCA9IFVzZXJQZXRCYXNlUHJvcHMgJiBVc2VyUGV0QXJnc1xuXG5leHBvcnQgZW51bSBEaXJlY3Rpb24ge1xuICByaWdodCA9IDEsXG4gIGxlZnQgPSAtMSxcbn1cblxuZXhwb3J0IHR5cGUgTmV4dEZyYW1lT3B0cyA9IHtcbiAgY29udGFpbmVyV2lkdGg6IG51bWJlclxuICBsZWZ0UG9zaXRpb246IG51bWJlclxuICBkaXJlY3Rpb246IG51bWJlclxuICBzcGVlZDogbnVtYmVyXG4gIG9mZnNldDogbnVtYmVyXG4gIHNjYWxlOiBudW1iZXJcbn1cblxuZXhwb3J0IHR5cGUgTmV4dEZyYW1lRm5SZXR1cm4gPSB7XG4gIGxlZnRQb3NpdGlvbjogbnVtYmVyXG4gIGRpcmVjdGlvbjogbnVtYmVyXG4gIG5ld1BldFN0YXRlPzogUGV0U3RhdGVcbn1cblxuZXhwb3J0IHR5cGUgTmV4dEZyYW1lRm4gPSAob3B0czogTmV4dEZyYW1lT3B0cykgPT4gTmV4dEZyYW1lRm5SZXR1cm5cblxuZXhwb3J0IHR5cGUgVHJhbnNmb3JtcyA9IHtcbiAgW3RyYW5zZm9ybTogc3RyaW5nXToge1xuICAgIG5leHRGcmFtZTogTmV4dEZyYW1lRm5cbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3BhbmVsL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
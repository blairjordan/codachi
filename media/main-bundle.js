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
exports.DOM = exports.transforms = exports.setState = exports.state = exports.initializeState = exports.Direction = exports.randomPetName = exports.randomPetType = exports.gifs = exports.mutateLevel = exports.generatePet = exports.getPetAnimations = exports.petTypes = void 0;
const pets_1 = __webpack_require__(/*! ./pets */ "./src/panel/pets.ts");
Object.defineProperty(exports, "petTypes", ({ enumerable: true, get: function () { return pets_1.petTypes; } }));
Object.defineProperty(exports, "getPetAnimations", ({ enumerable: true, get: function () { return pets_1.getPetAnimations; } }));
Object.defineProperty(exports, "generatePet", ({ enumerable: true, get: function () { return pets_1.generatePet; } }));
Object.defineProperty(exports, "mutateLevel", ({ enumerable: true, get: function () { return pets_1.mutateLevel; } }));
Object.defineProperty(exports, "gifs", ({ enumerable: true, get: function () { return pets_1.gifs; } }));
Object.defineProperty(exports, "randomPetType", ({ enumerable: true, get: function () { return pets_1.randomPetType; } }));
Object.defineProperty(exports, "randomPetName", ({ enumerable: true, get: function () { return pets_1.randomPetName; } }));
const transforms_1 = __webpack_require__(/*! ./transforms */ "./src/panel/transforms.ts");
Object.defineProperty(exports, "transforms", ({ enumerable: true, get: function () { return transforms_1.transforms; } }));
const types_1 = __webpack_require__(/*! ./types */ "./src/panel/types.ts");
Object.defineProperty(exports, "Direction", ({ enumerable: true, get: function () { return types_1.Direction; } }));
const dom_1 = __webpack_require__(/*! ./dom */ "./src/panel/dom.ts");
Object.defineProperty(exports, "DOM", ({ enumerable: true, get: function () { return dom_1.DOM; } }));
const state_1 = __webpack_require__(/*! ./state */ "./src/panel/state.ts");
Object.defineProperty(exports, "state", ({ enumerable: true, get: function () { return state_1.state; } }));
Object.defineProperty(exports, "initializeState", ({ enumerable: true, get: function () { return state_1.initializeState; } }));
Object.defineProperty(exports, "setState", ({ enumerable: true, get: function () { return state_1.setState; } }));


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
        speed: userPet.speed,
        offset: (0, _1.getPetAnimations)({ userPet }).animation.offset || 0,
    });
    userPet.leftPosition = leftPosition;
    userPet.direction = direction;
    // Apply transformation
    const movementContainer = dom.getMovementSelector();
    movementContainer.style.marginLeft = `${userPet.leftPosition}px`;
    const petImageElement = dom.getPetImageSelector();
    petImageElement.style.transform = `scaleX(${userPet.direction})`;
    if (userPet.isTransitionIn) {
        const { transition: animation } = (0, _1.getPetAnimations)({
            userPet,
        });
        if (animation) {
            const transitionContainer = dom.getTransitionSelector();
            transitionContainer.style.marginLeft = `${userPet.leftPosition}px`;
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
    const { basePetUri } = _1.state;
    selector.src = `${basePetUri}/${_1.gifs[animation.gif]}`;
    selector.width = animation.width;
    selector.style.minWidth = `${animation.width}px`;
    selector.height = animation.height;
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
    (0, _1.setState)('userPet', userPet);
    startAnimation();
    // Give the transition a chance to play
    yield sleep(TICK_INTERVAL_MS * 2);
    const { animation } = (0, _1.getPetAnimations)({
        userPet,
    });
    setImage({
        selector: dom.getPetImageSelector(),
        animation,
        container: dom.getMovementSelector(),
    });
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
const transition = Object.assign(Object.assign({}, animationDefaults), { gif: 'dust2', offset: -80, width: 280, height: 100 });
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster1phase1', speed: 4 }),
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster1phase2', speed: 3 }),
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster1phase3', speed: 3 }),
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster2phase1', width: 64, speed: 3 }),
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster2phase2', width: 64, speed: 3 }),
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster2phase3', width: 64, speed: 3 }),
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster4phase1', width: 64, speed: 3 }),
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster4phase2', width: 64, speed: 3 }),
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
                            walking: Object.assign(Object.assign({}, animationDefaults), { gif: 'monster4phase3', width: 64, speed: 4 }),
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
        nextFrame: ({ direction, offset }) => ({
            direction,
            leftPosition: offset,
        }),
    },
    walking: {
        nextFrame: ({ containerWidth, leftPosition: oldLeftPosition, direction: oldDirection, speed, }) => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLElBQUk7Z0JBQ2hCLENBQUMsQ0FBQyxlQUFlLElBQUksQ0FBQyxHQUFHLEtBQUs7b0JBQzlCLENBQUMsQ0FBQyxZQUFTLENBQUMsS0FBSztvQkFDakIsQ0FBQyxDQUFDLFlBQVk7WUFFbEIsTUFBTSxZQUFZLEdBQ2hCLFNBQVMsS0FBSyxZQUFTLENBQUMsS0FBSztnQkFDM0IsQ0FBQyxDQUFDLGVBQWUsR0FBRyxLQUFLO2dCQUN6QixDQUFDLENBQUMsZUFBZSxHQUFHLEtBQUs7WUFFN0IsT0FBTztnQkFDTCxTQUFTO2dCQUNULFlBQVk7YUFDYjtRQUNILENBQUM7S0FDRjtDQUNGOzs7Ozs7Ozs7Ozs7OztBQ2VELElBQVksU0FHWDtBQUhELFdBQVksU0FBUztJQUNuQiwyQ0FBUztJQUNULDBDQUFTO0FBQ1gsQ0FBQyxFQUhXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBR3BCOzs7Ozs7O1VDckREO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL2RvbS50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL2luZGV4LnRzIiwid2VicGFjazovL2NvZGFjaGlBcHAvLi9zcmMvcGFuZWwvbWFpbi50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL3BldHMudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC9zdGF0ZS50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwLy4vc3JjL3BhbmVsL3RyYW5zZm9ybXMudHMiLCJ3ZWJwYWNrOi8vY29kYWNoaUFwcC8uL3NyYy9wYW5lbC90eXBlcy50cyIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NvZGFjaGlBcHAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jb2RhY2hpQXBwL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgRE9NIHtcbiAgcHJpdmF0ZSBfcGV0SW1hZ2VTZWxlY3Rvcjogc3RyaW5nXG4gIHByaXZhdGUgX21vdmVtZW50Q29udGFpbmVyU2VsZWN0b3I6IHN0cmluZ1xuICBwcml2YXRlIF90cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3I6IHN0cmluZ1xuICBwcml2YXRlIF90cmFuc2l0aW9uU2VsZWN0b3I6IHN0cmluZ1xuXG4gIHByaXZhdGUgX21vdmVtZW50Q29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWRcbiAgcHJpdmF0ZSBfcGV0SW1hZ2VFbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50IHwgdW5kZWZpbmVkXG4gIHByaXZhdGUgX3RyYW5zaXRpb25Db250YWluZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZFxuICBwcml2YXRlIF90cmFuc2l0aW9uSW1hZ2VFbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50IHwgdW5kZWZpbmVkXG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIG1vdmVtZW50Q29udGFpbmVyU2VsZWN0b3IsXG4gICAgcGV0SW1hZ2VTZWxlY3RvcixcbiAgICB0cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3IsXG4gICAgdHJhbnNpdGlvblNlbGVjdG9yLFxuICB9OiB7XG4gICAgcGV0SW1hZ2VTZWxlY3Rvcjogc3RyaW5nXG4gICAgbW92ZW1lbnRDb250YWluZXJTZWxlY3Rvcjogc3RyaW5nXG4gICAgdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yOiBzdHJpbmdcbiAgICB0cmFuc2l0aW9uU2VsZWN0b3I6IHN0cmluZ1xuICB9KSB7XG4gICAgdGhpcy5fcGV0SW1hZ2VTZWxlY3RvciA9IHBldEltYWdlU2VsZWN0b3JcbiAgICB0aGlzLl9tb3ZlbWVudENvbnRhaW5lclNlbGVjdG9yID0gbW92ZW1lbnRDb250YWluZXJTZWxlY3RvclxuICAgIHRoaXMuX3RyYW5zaXRpb25Db250YWluZXJTZWxlY3RvciA9IHRyYW5zaXRpb25Db250YWluZXJTZWxlY3RvclxuICAgIHRoaXMuX3RyYW5zaXRpb25TZWxlY3RvciA9IHRyYW5zaXRpb25TZWxlY3RvclxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEhUTUxFbGVtZW50ID0gPFQ+KGVsZW1lbnROYW1lOiBzdHJpbmcpOiBUID0+IHtcbiAgICBjb25zdCBodG1sRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnROYW1lKSBhcyB1bmtub3duXG4gICAgaWYgKCFodG1sRWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gbG9jYXRlIGVsZW1lbnQgaW4gRE9NOiAke2VsZW1lbnROYW1lfWApXG4gICAgfVxuXG4gICAgcmV0dXJuIGh0bWxFbGVtZW50IGFzIFRcbiAgfVxuXG4gIGdldE1vdmVtZW50U2VsZWN0b3IoKTogSFRNTEVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fbW92ZW1lbnRDb250YWluZXJFbGVtZW50KSB7XG4gICAgICB0aGlzLl9tb3ZlbWVudENvbnRhaW5lckVsZW1lbnQgPSB0aGlzLmdldEhUTUxFbGVtZW50PEhUTUxFbGVtZW50PihcbiAgICAgICAgdGhpcy5fbW92ZW1lbnRDb250YWluZXJTZWxlY3RvclxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbW92ZW1lbnRDb250YWluZXJFbGVtZW50XG4gIH1cblxuICBnZXRQZXRJbWFnZVNlbGVjdG9yKCk6IEhUTUxJbWFnZUVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fcGV0SW1hZ2VFbGVtZW50KSB7XG4gICAgICB0aGlzLl9wZXRJbWFnZUVsZW1lbnQgPSB0aGlzLmdldEhUTUxFbGVtZW50PEhUTUxJbWFnZUVsZW1lbnQ+KFxuICAgICAgICB0aGlzLl9wZXRJbWFnZVNlbGVjdG9yXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9wZXRJbWFnZUVsZW1lbnRcbiAgfVxuXG4gIGdldFRyYW5zaXRpb25TZWxlY3RvcigpOiBIVE1MRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLl90cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudCkge1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lckVsZW1lbnQgPSB0aGlzLmdldEhUTUxFbGVtZW50PEhUTUxFbGVtZW50PihcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkNvbnRhaW5lclNlbGVjdG9yXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uQ29udGFpbmVyRWxlbWVudFxuICB9XG5cbiAgZ2V0VHJhbnNpdGlvbkltYWdlU2VsZWN0b3IoKTogSFRNTEltYWdlRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLl90cmFuc2l0aW9uSW1hZ2VFbGVtZW50KSB7XG4gICAgICB0aGlzLl90cmFuc2l0aW9uSW1hZ2VFbGVtZW50ID0gdGhpcy5nZXRIVE1MRWxlbWVudDxIVE1MSW1hZ2VFbGVtZW50PihcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvblNlbGVjdG9yXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uSW1hZ2VFbGVtZW50XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIHBldFR5cGVzLFxuICBnZXRQZXRBbmltYXRpb25zLFxuICBnZW5lcmF0ZVBldCxcbiAgbXV0YXRlTGV2ZWwsXG4gIGdpZnMsXG4gIHJhbmRvbVBldFR5cGUsXG4gIHJhbmRvbVBldE5hbWUsXG59IGZyb20gJy4vcGV0cydcbmltcG9ydCB7IHRyYW5zZm9ybXMgfSBmcm9tICcuL3RyYW5zZm9ybXMnXG5pbXBvcnQge1xuICBQZXQsXG4gIFBldFN0YXRlLFxuICBVc2VyUGV0QmFzZVByb3BzLFxuICBQZXRUeXBlLFxuICBVc2VyUGV0QXJncyxcbiAgVXNlclBldCxcbiAgR2lmcyxcbiAgRGlyZWN0aW9uLFxuICBOZXh0RnJhbWVPcHRzLFxuICBOZXh0RnJhbWVGbixcbiAgTmV4dEZyYW1lRm5SZXR1cm4sXG4gIFRyYW5zZm9ybXMsXG4gIFBldEFuaW1hdGlvbixcbiAgUGV0TGV2ZWwsXG4gIFN0YXRlLFxufSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgRE9NIH0gZnJvbSAnLi9kb20nXG5pbXBvcnQgeyBzdGF0ZSwgaW5pdGlhbGl6ZVN0YXRlLCBzZXRTdGF0ZSB9IGZyb20gJy4vc3RhdGUnXG5cbmV4cG9ydCB7XG4gIHBldFR5cGVzLFxuICBnZXRQZXRBbmltYXRpb25zLFxuICBnZW5lcmF0ZVBldCxcbiAgbXV0YXRlTGV2ZWwsXG4gIGdpZnMsXG4gIHJhbmRvbVBldFR5cGUsXG4gIHJhbmRvbVBldE5hbWUsXG4gIFBldCxcbiAgUGV0U3RhdGUsXG4gIFVzZXJQZXRCYXNlUHJvcHMsXG4gIFBldFR5cGUsXG4gIFVzZXJQZXRBcmdzLFxuICBVc2VyUGV0LFxuICBHaWZzLFxuICBEaXJlY3Rpb24sXG4gIE5leHRGcmFtZU9wdHMsXG4gIE5leHRGcmFtZUZuLFxuICBOZXh0RnJhbWVGblJldHVybixcbiAgVHJhbnNmb3JtcyxcbiAgUGV0QW5pbWF0aW9uLFxuICBQZXRMZXZlbCxcbiAgU3RhdGUsXG4gIGluaXRpYWxpemVTdGF0ZSxcbiAgc3RhdGUsXG4gIHNldFN0YXRlLFxuICB0cmFuc2Zvcm1zLFxuICBET00sXG59XG4iLCJpbXBvcnQge1xuICBVc2VyUGV0LFxuICBzZXRTdGF0ZSxcbiAgZ2V0UGV0QW5pbWF0aW9ucyxcbiAgZ2lmcyxcbiAgZ2VuZXJhdGVQZXQsXG4gIHRyYW5zZm9ybXMsXG4gIERPTSxcbiAgc3RhdGUsXG4gIFBldEFuaW1hdGlvbixcbn0gZnJvbSAnLi8nXG5pbXBvcnQgeyBpbml0aWFsaXplU3RhdGUgfSBmcm9tICcuL3N0YXRlJ1xuXG5jb25zdCBkZWZhdWx0U3RhdGUgPSB7XG4gIHVzZXJQZXQ6IGdlbmVyYXRlUGV0KHsgbmFtZTogJ3Vua25vd24nLCB0eXBlOiAndW5rbm93bicgfSksXG4gIGJhc2VQZXRVcmk6ICcnLFxufVxuXG5pbml0aWFsaXplU3RhdGUoZGVmYXVsdFN0YXRlKVxuXG5jb25zdCBkb20gPSBuZXcgRE9NKHtcbiAgbW92ZW1lbnRDb250YWluZXJTZWxlY3RvcjogJ21vdmVtZW50LWNvbnRhaW5lcicsXG4gIHBldEltYWdlU2VsZWN0b3I6ICdwZXQnLFxuICB0cmFuc2l0aW9uQ29udGFpbmVyU2VsZWN0b3I6ICd0cmFuc2l0aW9uLWNvbnRhaW5lcicsXG4gIHRyYW5zaXRpb25TZWxlY3RvcjogJ3RyYW5zaXRpb24nLFxufSlcblxuY29uc3QgVElDS19JTlRFUlZBTF9NUyA9IDEwMFxuXG5jb25zdCB0aWNrID0gKHsgdXNlclBldCB9OiB7IHVzZXJQZXQ6IFVzZXJQZXQgfSkgPT4ge1xuICBjb25zdCB7IGxlZnRQb3NpdGlvbiwgZGlyZWN0aW9uIH0gPSB0cmFuc2Zvcm1zW3VzZXJQZXQuc3RhdGVdLm5leHRGcmFtZSh7XG4gICAgY29udGFpbmVyV2lkdGg6XG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fFxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxuICAgIGxlZnRQb3NpdGlvbjogdXNlclBldC5sZWZ0UG9zaXRpb24sXG4gICAgZGlyZWN0aW9uOiB1c2VyUGV0LmRpcmVjdGlvbixcbiAgICBzcGVlZDogdXNlclBldC5zcGVlZCxcbiAgICBvZmZzZXQ6IGdldFBldEFuaW1hdGlvbnMoeyB1c2VyUGV0IH0pLmFuaW1hdGlvbi5vZmZzZXQgfHwgMCxcbiAgfSlcblxuICB1c2VyUGV0LmxlZnRQb3NpdGlvbiA9IGxlZnRQb3NpdGlvblxuICB1c2VyUGV0LmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuXG4gIC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9uXG4gIGNvbnN0IG1vdmVtZW50Q29udGFpbmVyID0gZG9tLmdldE1vdmVtZW50U2VsZWN0b3IoKVxuICBtb3ZlbWVudENvbnRhaW5lci5zdHlsZS5tYXJnaW5MZWZ0ID0gYCR7dXNlclBldC5sZWZ0UG9zaXRpb259cHhgXG5cbiAgY29uc3QgcGV0SW1hZ2VFbGVtZW50ID0gZG9tLmdldFBldEltYWdlU2VsZWN0b3IoKVxuICBwZXRJbWFnZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlWCgke3VzZXJQZXQuZGlyZWN0aW9ufSlgXG5cbiAgaWYgKHVzZXJQZXQuaXNUcmFuc2l0aW9uSW4pIHtcbiAgICBjb25zdCB7IHRyYW5zaXRpb246IGFuaW1hdGlvbiB9ID0gZ2V0UGV0QW5pbWF0aW9ucyh7XG4gICAgICB1c2VyUGV0LFxuICAgIH0pXG5cbiAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICBjb25zdCB0cmFuc2l0aW9uQ29udGFpbmVyID0gZG9tLmdldFRyYW5zaXRpb25TZWxlY3RvcigpXG4gICAgICB0cmFuc2l0aW9uQ29udGFpbmVyLnN0eWxlLm1hcmdpbkxlZnQgPSBgJHt1c2VyUGV0LmxlZnRQb3NpdGlvbn1weGBcblxuICAgICAgc2V0SW1hZ2Uoe1xuICAgICAgICBjb250YWluZXI6IGRvbS5nZXRUcmFuc2l0aW9uU2VsZWN0b3IoKSxcbiAgICAgICAgc2VsZWN0b3I6IGRvbS5nZXRUcmFuc2l0aW9uSW1hZ2VTZWxlY3RvcigpLFxuICAgICAgICBhbmltYXRpb24sXG4gICAgICB9KVxuICAgICAgc3RhdGUudXNlclBldC5pc1RyYW5zaXRpb25JbiA9IGZhbHNlXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHNldEltYWdlID0gKHtcbiAgY29udGFpbmVyLFxuICBzZWxlY3RvcixcbiAgYW5pbWF0aW9uLFxufToge1xuICBjb250YWluZXI6IEhUTUxFbGVtZW50XG4gIHNlbGVjdG9yOiBIVE1MSW1hZ2VFbGVtZW50XG4gIGFuaW1hdGlvbjogUGV0QW5pbWF0aW9uXG59KSA9PiB7XG4gIGNvbnN0IHsgYmFzZVBldFVyaSB9ID0gc3RhdGVcblxuICBzZWxlY3Rvci5zcmMgPSBgJHtiYXNlUGV0VXJpfS8ke2dpZnNbYW5pbWF0aW9uLmdpZl19YFxuICBzZWxlY3Rvci53aWR0aCA9IGFuaW1hdGlvbi53aWR0aFxuICBzZWxlY3Rvci5zdHlsZS5taW5XaWR0aCA9IGAke2FuaW1hdGlvbi53aWR0aH1weGBcbiAgc2VsZWN0b3IuaGVpZ2h0ID0gYW5pbWF0aW9uLmhlaWdodFxuXG4gIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gYCR7YW5pbWF0aW9uLm9mZnNldCA/PyAwfXB4YFxufVxuXG5jb25zdCBzbGVlcCA9IChtczogbnVtYmVyKSA9PiBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBtcykpXG5cbmNvbnN0IHN0YXJ0QW5pbWF0aW9uID0gKCkgPT4ge1xuICBjb25zdCB7IHVzZXJQZXQgfSA9IHN0YXRlXG4gIGlmIChzdGF0ZS5pbnRlcnZhbElkKSB7XG4gICAgY2xlYXJJbnRlcnZhbChzdGF0ZS5pbnRlcnZhbElkKVxuICB9XG4gIGNvbnN0IGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgdGljayh7IHVzZXJQZXQgfSlcbiAgfSwgVElDS19JTlRFUlZBTF9NUylcbiAgc2V0U3RhdGUoJ2ludGVydmFsSWQnLCBpbnRlcnZhbElkKVxufVxuXG5leHBvcnQgY29uc3QgYWRkUGV0VG9QYW5lbCA9IGFzeW5jICh7IHVzZXJQZXQgfTogeyB1c2VyUGV0OiBVc2VyUGV0IH0pID0+IHtcbiAgc2V0U3RhdGUoJ3VzZXJQZXQnLCB1c2VyUGV0KVxuICBzdGFydEFuaW1hdGlvbigpXG5cbiAgLy8gR2l2ZSB0aGUgdHJhbnNpdGlvbiBhIGNoYW5jZSB0byBwbGF5XG4gIGF3YWl0IHNsZWVwKFRJQ0tfSU5URVJWQUxfTVMgKiAyKVxuXG4gIGNvbnN0IHsgYW5pbWF0aW9uIH0gPSBnZXRQZXRBbmltYXRpb25zKHtcbiAgICB1c2VyUGV0LFxuICB9KVxuXG4gIHNldEltYWdlKHtcbiAgICBzZWxlY3RvcjogZG9tLmdldFBldEltYWdlU2VsZWN0b3IoKSxcbiAgICBhbmltYXRpb24sXG4gICAgY29udGFpbmVyOiBkb20uZ2V0TW92ZW1lbnRTZWxlY3RvcigpLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgYXBwID0gKHtcbiAgdXNlclBldCxcbiAgYmFzZVBldFVyaSxcbn06IHtcbiAgdXNlclBldDogVXNlclBldFxuICBiYXNlUGV0VXJpOiBzdHJpbmdcbn0pID0+IHtcbiAgc2V0U3RhdGUoJ2Jhc2VQZXRVcmknLCBiYXNlUGV0VXJpKVxuXG4gIGlmICh1c2VyUGV0KSB7XG4gICAgYWRkUGV0VG9QYW5lbCh7IHVzZXJQZXQgfSlcbiAgfVxuXG4gIC8vIEhhbmRsZSBtZXNzYWdlcyBzZW50IGZyb20gdGhlIGV4dGVuc2lvbiB0byB0aGUgd2Vidmlld1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHsgY29tbWFuZCwgZGF0YSB9ID0gZXZlbnQuZGF0YSAvLyBUaGUgZGF0YSB0aGF0IHRoZSBleHRlbnNpb24gc2VudFxuICAgIHN3aXRjaCAoY29tbWFuZCkge1xuICAgICAgY2FzZSAnc3Bhd24tcGV0JzpcbiAgICAgICAgYWRkUGV0VG9QYW5lbCh7IHVzZXJQZXQ6IGRhdGEudXNlclBldCB9KVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlICd1cGRhdGUtcGV0JzpcbiAgICAgICAgYWRkUGV0VG9QYW5lbCh7XG4gICAgICAgICAgdXNlclBldDoge1xuICAgICAgICAgICAgLi4uZGF0YS51c2VyUGV0LFxuICAgICAgICAgICAgbGVmdFBvc2l0aW9uOiBzdGF0ZS51c2VyUGV0LmxlZnRQb3NpdGlvbixcbiAgICAgICAgICAgIGRpcmVjdGlvbjogc3RhdGUudXNlclBldC5kaXJlY3Rpb24sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH0pXG59XG4iLCJpbXBvcnQge1xuICBQZXRUeXBlLFxuICBQZXQsXG4gIFVzZXJQZXRBcmdzLFxuICBEaXJlY3Rpb24sXG4gIFBldEFuaW1hdGlvbixcbiAgVXNlclBldCxcbiAgUGV0TGV2ZWwsXG4gIEdpZnMsXG59IGZyb20gJy4vJ1xuXG5leHBvcnQgY29uc3QgZ2lmczogR2lmcyA9IHtcbiAgZWdnMTogJ2VnZzEuZ2lmJyxcbiAgZHVzdDE6ICdkdXN0MS5naWYnLFxuICBkdXN0MjogJ2R1c3QyLmdpZicsXG4gIG1vbnN0ZXIxcGhhc2UxOiAnbTFkMS5naWYnLFxuICBtb25zdGVyMXBoYXNlMjogJ20xZDIuZ2lmJyxcbiAgbW9uc3RlcjFwaGFzZTM6ICdtMWQzLmdpZicsXG4gIG1vbnN0ZXIycGhhc2UxOiAnbTJkMS5naWYnLFxuICBtb25zdGVyMnBoYXNlMjogJ20yZDIuZ2lmJyxcbiAgbW9uc3RlcjJwaGFzZTM6ICdtMmQzLmdpZicsXG4gIG1vbnN0ZXIzcGhhc2UxOiAnbTNkMS5naWYnLFxuICBtb25zdGVyM3BoYXNlMjogJ20zZDIuZ2lmJyxcbiAgbW9uc3RlcjNwaGFzZTM6ICdtM2QzLmdpZicsXG4gIG1vbnN0ZXI0cGhhc2UxOiAnbTRkMS5naWYnLFxuICBtb25zdGVyNHBoYXNlMjogJ200ZDIuZ2lmJyxcbiAgbW9uc3RlcjRwaGFzZTM6ICdtNGQzLmdpZicsXG59XG5cbmV4cG9ydCBjb25zdCBwZXROYW1lcyA9IFtcbiAgJ2JvbycsXG4gICduYWNobycsXG4gICdnYXJ5JyxcbiAgJ2Z1ZGdlJyxcbiAgJ25la28nLFxuICAncGlwJyxcbiAgJ2JpYm8nLFxuICAnZmlmaScsXG4gICdqYXgnLFxuICAnYm9iYmEnLFxuICAnZ2lkZ2V0JyxcbiAgJ21pbmEnLFxuICAnY3J1bWInLFxuICAnemltYm8nLFxuICAnZHVzdHknLFxuICAnYnJvY2snLFxuICAnb3RpcycsXG4gICdtYXJ2aW4nLFxuICAnc21va2V5JyxcbiAgJ2JhcnJ5JyxcbiAgJ3RvbnknLFxuICAnZHVzdHknLFxuICAnbW9jaGknLFxuXVxuXG5jb25zdCBhbmltYXRpb25EZWZhdWx0cyA9IHtcbiAgd2lkdGg6IDc1LFxuICBoZWlnaHQ6IDY0LFxuICBzcGVlZDogMCxcbiAgb2Zmc2V0OiAwLFxufVxuXG5jb25zdCBlZ2c6IFBldExldmVsID0ge1xuICB4cDogMCxcbiAgZGVmYXVsdFN0YXRlOiAnaWRsZScsXG4gIGFuaW1hdGlvbnM6IHtcbiAgICBpZGxlOiB7XG4gICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgIGdpZjogJ2VnZzEnLFxuICAgIH0sXG4gICAgdHJhbnNpdGlvbjoge1xuICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICBnaWY6ICdkdXN0MScsXG4gICAgICBvZmZzZXQ6IDYsXG4gICAgICB3aWR0aDogMTAwLFxuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgfSxcbiAgfSxcbn1cblxuLy8gR2VuZXJpYyBldm9sdXRpb24gdHJhbnNpdGlvblxuY29uc3QgdHJhbnNpdGlvbjogUGV0QW5pbWF0aW9uID0ge1xuICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgZ2lmOiAnZHVzdDInLFxuICBvZmZzZXQ6IC04MCxcbiAgd2lkdGg6IDI4MCxcbiAgaGVpZ2h0OiAxMDAsXG59XG5cbmV4cG9ydCBjb25zdCBwZXRUeXBlcyA9IG5ldyBNYXA8c3RyaW5nLCBQZXQ+KFtcbiAgW1xuICAgICdtb25zdGVyMScsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjFwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHNwZWVkOiA0LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMTUwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyMXBoYXNlMicsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAyNDAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIxcGhhc2UzJyxcbiAgICAgICAgICAgICAgICBzcGVlZDogMyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF0pLFxuICAgIH0sXG4gIF0sXG4gIFtcbiAgICAnbW9uc3RlcjInLFxuICAgIHtcbiAgICAgIGxldmVsczogbmV3IE1hcChbXG4gICAgICAgIFswLCBlZ2ddLFxuICAgICAgICBbXG4gICAgICAgICAgMSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogMzUsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIycGhhc2UxJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAxMDAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIycGhhc2UyJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiA2MDAwMDAsXG4gICAgICAgICAgICBkZWZhdWx0U3RhdGU6ICd3YWxraW5nJyxcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbixcbiAgICAgICAgICAgICAgd2Fsa2luZzoge1xuICAgICAgICAgICAgICAgIC4uLmFuaW1hdGlvbkRlZmF1bHRzLFxuICAgICAgICAgICAgICAgIGdpZjogJ21vbnN0ZXIycGhhc2UzJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNjQsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDMsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdKSxcbiAgICB9LFxuICBdLFxuICBbXG4gICAgJ21vbnN0ZXIzJyxcbiAgICB7XG4gICAgICBsZXZlbHM6IG5ldyBNYXAoW1xuICAgICAgICBbMCwgZWdnXSxcbiAgICAgICAgW1xuICAgICAgICAgIDEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDM1LFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyM3BoYXNlMScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAxLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNTk5OTAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyM3BoYXNlMicsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgMyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4cDogNjAwMDAwLFxuICAgICAgICAgICAgZGVmYXVsdFN0YXRlOiAnd2Fsa2luZycsXG4gICAgICAgICAgICBhbmltYXRpb25zOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgIHdhbGtpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi5hbmltYXRpb25EZWZhdWx0cyxcbiAgICAgICAgICAgICAgICBnaWY6ICdtb25zdGVyM3BoYXNlMycsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0LFxuICAgICAgICAgICAgICAgIHNwZWVkOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSksXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgICdtb25zdGVyNCcsXG4gICAge1xuICAgICAgbGV2ZWxzOiBuZXcgTWFwKFtcbiAgICAgICAgWzAsIGVnZ10sXG4gICAgICAgIFtcbiAgICAgICAgICAxLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwOiAzNSxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjRwaGFzZTEnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDE1MDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjRwaGFzZTInLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIDMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgeHA6IDI0MDAwMCxcbiAgICAgICAgICAgIGRlZmF1bHRTdGF0ZTogJ3dhbGtpbmcnLFxuICAgICAgICAgICAgYW5pbWF0aW9uczoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgICB3YWxraW5nOiB7XG4gICAgICAgICAgICAgICAgLi4uYW5pbWF0aW9uRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgZ2lmOiAnbW9uc3RlcjRwaGFzZTMnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2NCxcbiAgICAgICAgICAgICAgICBzcGVlZDogNCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF0pLFxuICAgIH0sXG4gIF0sXG5dKVxuXG5leHBvcnQgY29uc3QgcmFuZG9tUGV0VHlwZSA9ICgpOiBQZXRUeXBlID0+XG4gIEFycmF5LmZyb20ocGV0VHlwZXMua2V5cygpKVtcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwZXRUeXBlcy5zaXplKVxuICBdIGFzIFBldFR5cGVcblxuZXhwb3J0IGNvbnN0IHJhbmRvbVBldE5hbWUgPSAoKTogc3RyaW5nID0+IHtcbiAgY29uc3QgbmFtZSA9IHBldE5hbWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBldE5hbWVzLmxlbmd0aCldXG4gIHJldHVybiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpXG59XG5cbmV4cG9ydCBjb25zdCBnZXRQZXRBbmltYXRpb25zID0gKHtcbiAgdXNlclBldCxcbn06IHtcbiAgdXNlclBldDogVXNlclBldFxufSk6IHtcbiAgYW5pbWF0aW9uOiBQZXRBbmltYXRpb25cbiAgdHJhbnNpdGlvbjogUGV0QW5pbWF0aW9uIHwgdW5kZWZpbmVkXG59ID0+IHtcbiAgY29uc3QgcGV0VHlwZUZvdW5kID0gcGV0VHlwZXMuZ2V0KHVzZXJQZXQudHlwZSlcbiAgaWYgKCFwZXRUeXBlRm91bmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFBldCB0eXBlIG5vdCBmb3VuZDogJHt1c2VyUGV0LnR5cGV9YClcbiAgfVxuXG4gIGNvbnN0IGxldmVsRm91bmQgPSBwZXRUeXBlRm91bmQubGV2ZWxzLmdldCh1c2VyUGV0LmxldmVsKVxuICBpZiAoIWxldmVsRm91bmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgUGV0IGxldmVsIG5vdCBmb3VuZCBmb3IgcGV0IHR5cGUgJHt1c2VyUGV0LnR5cGV9OiAke3VzZXJQZXQubGV2ZWx9YFxuICAgIClcbiAgfVxuXG4gIGlmICghKHVzZXJQZXQuc3RhdGUgaW4gbGV2ZWxGb3VuZC5hbmltYXRpb25zKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBBbmltYXRpb24gbm90IGZvdW5kIGZvciBwZXQgdHlwZSAke3VzZXJQZXQudHlwZX0sIGxldmVsICR7dXNlclBldC5sZXZlbH06ICR7dXNlclBldC5zdGF0ZX1gXG4gICAgKVxuICB9XG5cbiAgY29uc3QgdHJhbnNpdGlvbiA9XG4gICAgJ3RyYW5zaXRpb24nIGluIGxldmVsRm91bmQuYW5pbWF0aW9uc1xuICAgICAgPyBsZXZlbEZvdW5kLmFuaW1hdGlvbnMudHJhbnNpdGlvblxuICAgICAgOiB1bmRlZmluZWRcblxuICByZXR1cm4ge1xuICAgIGFuaW1hdGlvbjogbGV2ZWxGb3VuZC5hbmltYXRpb25zW3VzZXJQZXQuc3RhdGVdLFxuICAgIHRyYW5zaXRpb24sXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlUGV0ID0gKHsgbmFtZSwgdHlwZSB9OiBVc2VyUGV0QXJncyk6IFVzZXJQZXQgPT4gKHtcbiAgbGVmdFBvc2l0aW9uOiAwLFxuICBzcGVlZDogMCxcbiAgZGlyZWN0aW9uOiBEaXJlY3Rpb24ucmlnaHQsXG4gIGxldmVsOiAwLFxuICB4cDogMCxcbiAgLy8gQWxsIGxldmVsIDAgY2hhcmFjdGVycyByZXF1aXJlIHRoaXMgc3RhdGVcbiAgc3RhdGU6ICdpZGxlJyxcbiAgaXNUcmFuc2l0aW9uSW46IHRydWUsXG4gIG5hbWUsXG4gIHR5cGUsXG59KVxuXG5leHBvcnQgY29uc3QgZ2V0TGV2ZWwgPSAoe1xuICBwZXRUeXBlLFxuICBsZXZlbCxcbn06IHtcbiAgcGV0VHlwZTogUGV0VHlwZVxuICBsZXZlbDogbnVtYmVyXG59KSA9PiB7XG4gIGNvbnN0IHBldFR5cGVGb3VuZCA9IHBldFR5cGVzLmdldChwZXRUeXBlKVxuICBpZiAoIXBldFR5cGVGb3VuZCkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIGNvbnN0IGxldmVsRm91bmQgPSBwZXRUeXBlRm91bmQubGV2ZWxzLmdldChsZXZlbClcbiAgaWYgKCFsZXZlbEZvdW5kKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cbiAgcmV0dXJuIGxldmVsRm91bmRcbn1cblxuZXhwb3J0IGNvbnN0IG11dGF0ZUxldmVsID0gKHsgdXNlclBldCB9OiB7IHVzZXJQZXQ6IFVzZXJQZXQgfSkgPT4ge1xuICBjb25zdCBuZXh0TGV2ZWxGb3VuZCA9IGdldExldmVsKHtcbiAgICBwZXRUeXBlOiB1c2VyUGV0LnR5cGUsXG4gICAgbGV2ZWw6IHVzZXJQZXQubGV2ZWwgKyAxLFxuICB9KVxuXG4gIGlmICghbmV4dExldmVsRm91bmQpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh1c2VyUGV0LnhwID49IG5leHRMZXZlbEZvdW5kLnhwKSB7XG4gICAgdXNlclBldC5sZXZlbCArPSAxXG4gICAgdXNlclBldC54cCA9IDBcbiAgICB1c2VyUGV0LnN0YXRlID0gbmV4dExldmVsRm91bmQuZGVmYXVsdFN0YXRlXG4gICAgdXNlclBldC5zcGVlZCA9IG5leHRMZXZlbEZvdW5kLmFuaW1hdGlvbnNbdXNlclBldC5zdGF0ZV0uc3BlZWQgfHwgMFxuICAgIHVzZXJQZXQuaXNUcmFuc2l0aW9uSW4gPSB0cnVlXG4gIH1cbn1cbiIsImltcG9ydCB7IFN0YXRlIH0gZnJvbSAnLi8nXG5cbmV4cG9ydCBsZXQgc3RhdGU6IFN0YXRlXG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplU3RhdGUgPSAoaW5pdGlhbFN0YXRlOiBTdGF0ZSkgPT4gKHN0YXRlID0gaW5pdGlhbFN0YXRlKVxuXG5leHBvcnQgY29uc3Qgc2V0U3RhdGUgPSA8SyBleHRlbmRzIGtleW9mIFN0YXRlPihrZXk6IEssIHZhbHVlOiBTdGF0ZVtLXSkgPT5cbiAgKHN0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIFtrZXldOiB2YWx1ZSxcbiAgfSlcbiIsImltcG9ydCB7IFRyYW5zZm9ybXMsIE5leHRGcmFtZU9wdHMsIERpcmVjdGlvbiB9IGZyb20gJy4vJ1xuXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtczogVHJhbnNmb3JtcyA9IHtcbiAgaWRsZToge1xuICAgIG5leHRGcmFtZTogKHsgZGlyZWN0aW9uLCBvZmZzZXQgfTogTmV4dEZyYW1lT3B0cykgPT4gKHtcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIGxlZnRQb3NpdGlvbjogb2Zmc2V0LFxuICAgIH0pLFxuICB9LFxuICB3YWxraW5nOiB7XG4gICAgbmV4dEZyYW1lOiAoe1xuICAgICAgY29udGFpbmVyV2lkdGgsXG4gICAgICBsZWZ0UG9zaXRpb246IG9sZExlZnRQb3NpdGlvbixcbiAgICAgIGRpcmVjdGlvbjogb2xkRGlyZWN0aW9uLFxuICAgICAgc3BlZWQsXG4gICAgfTogLy8gb2Zmc2V0LFxuICAgIE5leHRGcmFtZU9wdHMpID0+IHtcbiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9XG4gICAgICAgIG9sZExlZnRQb3NpdGlvbiA+PSBjb250YWluZXJXaWR0aCAtIHNwZWVkIC0gMTUwXG4gICAgICAgICAgPyBEaXJlY3Rpb24ubGVmdFxuICAgICAgICAgIDogb2xkTGVmdFBvc2l0aW9uIDw9IDAgKyBzcGVlZFxuICAgICAgICAgID8gRGlyZWN0aW9uLnJpZ2h0XG4gICAgICAgICAgOiBvbGREaXJlY3Rpb25cblxuICAgICAgY29uc3QgbGVmdFBvc2l0aW9uID1cbiAgICAgICAgZGlyZWN0aW9uID09PSBEaXJlY3Rpb24ucmlnaHRcbiAgICAgICAgICA/IG9sZExlZnRQb3NpdGlvbiArIHNwZWVkXG4gICAgICAgICAgOiBvbGRMZWZ0UG9zaXRpb24gLSBzcGVlZFxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgIGxlZnRQb3NpdGlvbixcbiAgICAgIH1cbiAgICB9LFxuICB9LFxufVxuIiwiZXhwb3J0IHR5cGUgU3RhdGUgPSB7XG4gIHVzZXJQZXQ6IFVzZXJQZXRcbiAgYmFzZVBldFVyaTogc3RyaW5nXG4gIGludGVydmFsSWQ/OiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgdHlwZSBHaWZzID0geyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH1cblxuZXhwb3J0IHR5cGUgUGV0U3RhdGUgPSAnd2Fsa2luZycgfCAnaWRsZScgfCAndHJhbnNpdGlvbidcblxuZXhwb3J0IHR5cGUgUGV0QW5pbWF0aW9uID0ge1xuICBnaWY6IHN0cmluZ1xuICB3aWR0aDogbnVtYmVyXG4gIGhlaWdodDogbnVtYmVyXG4gIG9mZnNldD86IG51bWJlclxuICBzcGVlZD86IG51bWJlclxuICBkdXJhdGlvbj86IG51bWJlclxufVxuXG5leHBvcnQgdHlwZSBQZXRMZXZlbCA9IHtcbiAgeHA6IG51bWJlclxuICBkZWZhdWx0U3RhdGU6IFBldFN0YXRlXG4gIGFuaW1hdGlvbnM6IHtcbiAgICBbbmFtZTogc3RyaW5nXTogUGV0QW5pbWF0aW9uXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgUGV0ID0ge1xuICBsZXZlbHM6IE1hcDxudW1iZXIsIFBldExldmVsPlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJQZXRCYXNlUHJvcHMge1xuICBsZWZ0UG9zaXRpb246IG51bWJlclxuICBzcGVlZDogbnVtYmVyXG4gIGRpcmVjdGlvbjogbnVtYmVyXG4gIGxldmVsOiBudW1iZXJcbiAgeHA6IG51bWJlclxuICBzdGF0ZTogUGV0U3RhdGVcbiAgaXNUcmFuc2l0aW9uSW46IGJvb2xlYW5cbn1cblxuZXhwb3J0IHR5cGUgUGV0VHlwZSA9ICdtb25zdGVyMScgfCAnbW9uc3RlcjInIHwgJ3Vua25vd24nXG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlclBldEFyZ3Mge1xuICBuYW1lOiBzdHJpbmdcbiAgdHlwZTogUGV0VHlwZVxufVxuXG5leHBvcnQgdHlwZSBVc2VyUGV0ID0gVXNlclBldEJhc2VQcm9wcyAmIFVzZXJQZXRBcmdzXG5cbmV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XG4gIHJpZ2h0ID0gMSxcbiAgbGVmdCA9IC0xLFxufVxuXG5leHBvcnQgdHlwZSBOZXh0RnJhbWVPcHRzID0ge1xuICBjb250YWluZXJXaWR0aDogbnVtYmVyXG4gIGxlZnRQb3NpdGlvbjogbnVtYmVyXG4gIGRpcmVjdGlvbjogbnVtYmVyXG4gIHNwZWVkOiBudW1iZXJcbiAgb2Zmc2V0OiBudW1iZXJcbn1cblxuZXhwb3J0IHR5cGUgTmV4dEZyYW1lRm5SZXR1cm4gPSB7XG4gIGxlZnRQb3NpdGlvbjogbnVtYmVyXG4gIGRpcmVjdGlvbjogbnVtYmVyXG4gIG5ld1BldFN0YXRlPzogUGV0U3RhdGVcbn1cblxuZXhwb3J0IHR5cGUgTmV4dEZyYW1lRm4gPSAob3B0czogTmV4dEZyYW1lT3B0cykgPT4gTmV4dEZyYW1lRm5SZXR1cm5cblxuZXhwb3J0IHR5cGUgVHJhbnNmb3JtcyA9IHtcbiAgW3RyYW5zZm9ybTogc3RyaW5nXToge1xuICAgIG5leHRGcmFtZTogTmV4dEZyYW1lRm5cbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3BhbmVsL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
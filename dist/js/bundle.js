/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	//
	// window.onload = function () {
	//     // TODO:: Do your initialization job
	//
	//     // add eventListener for tizenhwkey
	//     document.addEventListener('tizenhwkey', function(e) {
	//         if(e.keyName == "back")
	// 	try {
	// 	    tizen.application.getCurrentApplication().exit();
	// 	} catch (ignore) {
	// 	}
	//     });
	//
	//     // Sample code
	//     var textbox = document.querySelector('.contents');
	//     textbox.addEventListener("click", function(){
	//     	box = document.querySelector('#textbox');
	//     	box.innerHTML = box.innerHTML == "Basic" ? "Sample" : "Basic";
	//     });
	//
	// };
	
	alert('aaaa');

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
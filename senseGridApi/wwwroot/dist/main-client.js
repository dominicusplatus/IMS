/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "1174dfe608cb5445327f"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(211)(__webpack_require__.s = 211);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(3);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(8);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(6);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = vendor_b7199ba5a0e681456630;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridRenderOrganizer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var DatagridRenderOrganizer = (function () {
    function DatagridRenderOrganizer() {
        this.widths = [];
        this._clearWidths = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._tableMode = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._computeWidths = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._alignColumns = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this.scrollbar = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this.scrollbarWidth = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._done = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    Object.defineProperty(DatagridRenderOrganizer.prototype, "clearWidths", {
        get: function () {
            return this._clearWidths.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridRenderOrganizer.prototype, "tableMode", {
        get: function () {
            return this._tableMode.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridRenderOrganizer.prototype, "computeWidths", {
        get: function () {
            return this._computeWidths.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridRenderOrganizer.prototype, "alignColumns", {
        get: function () {
            return this._alignColumns.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridRenderOrganizer.prototype, "done", {
        get: function () {
            return this._done.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    DatagridRenderOrganizer.prototype.resize = function () {
        this.widths.length = 0;
        this._clearWidths.next();
        this._tableMode.next(true);
        this._computeWidths.next();
        this._tableMode.next(false);
        this._alignColumns.next();
        this.scrollbar.next();
        this._done.next();
    };
    return DatagridRenderOrganizer;
}());

DatagridRenderOrganizer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
DatagridRenderOrganizer.ctorParameters = function () { return []; };
//# sourceMappingURL=render-organizer.js.map

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrIconModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__(106);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var ClrIconModule = (function () {
    function ClrIconModule() {
    }
    return ClrIconModule;
}());

ClrIconModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"]],
                declarations: [__WEBPACK_IMPORTED_MODULE_2__index__["a" /* ICON_DIRECTIVES */]],
                exports: [__WEBPACK_IMPORTED_MODULE_2__index__["a" /* ICON_DIRECTIVES */]]
            },] },
];
/** @nocollapse */
ClrIconModule.ctorParameters = function () { return []; };
//# sourceMappingURL=icon.module.js.map

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FiltersProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return RegisteredFilter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var FiltersProvider = (function () {
    function FiltersProvider() {
        /**
         * This subject is the list of filters that changed last, not the whole list.
         * We emit a list rather than just one filter to allow batch changes to several at once.
         */
        this._change = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        /**
         * List of all filters, whether they're active or not
         */
        this._all = [];
    }
    Object.defineProperty(FiltersProvider.prototype, "change", {
        // We do not want to expose the Subject itself, but the Observable which is read-only
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * Tests if at least one filter is currently active
     */
    FiltersProvider.prototype.hasActiveFilters = function () {
        // We do not use getActiveFilters() because this function will be called much more often
        // and stopping the loop early might be relevant.
        for (var _i = 0, _a = this._all; _i < _a.length; _i++) {
            var filter = _a[_i].filter;
            if (filter && filter.isActive()) {
                return true;
            }
        }
        return false;
    };
    /**
     * Returns a list of all currently active filters
     */
    FiltersProvider.prototype.getActiveFilters = function () {
        var ret = [];
        for (var _i = 0, _a = this._all; _i < _a.length; _i++) {
            var filter = _a[_i].filter;
            if (filter && filter.isActive()) {
                ret.push(filter);
            }
        }
        return ret;
    };
    /**
     * Registers a filter, and returns a deregistration function
     */
    FiltersProvider.prototype.add = function (filter) {
        var _this = this;
        var index = this._all.length;
        var subscription = filter.changes.subscribe(function () { return _this._change.next([filter]); });
        var hasUnregistered = false;
        var registered = new RegisteredFilter(filter, function () {
            if (hasUnregistered) {
                return;
            }
            subscription.unsubscribe();
            _this._all.splice(index, 1);
            if (filter.isActive()) {
                _this._change.next([]);
            }
            hasUnregistered = true;
        });
        this._all.push(registered);
        if (filter.isActive()) {
            this._change.next([filter]);
        }
        return registered;
    };
    /**
     * Accepts an item if it is accepted by all currently active filters
     */
    FiltersProvider.prototype.accepts = function (item) {
        for (var _i = 0, _a = this._all; _i < _a.length; _i++) {
            var filter = _a[_i].filter;
            if (filter && filter.isActive() && !filter.accepts(item)) {
                return false;
            }
        }
        return true;
    };
    return FiltersProvider;
}());

FiltersProvider.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
FiltersProvider.ctorParameters = function () { return []; };
var RegisteredFilter = (function () {
    function RegisteredFilter(filter, unregister) {
        this.filter = filter;
        this.unregister = unregister;
    }
    return RegisteredFilter;
}());

//# sourceMappingURL=filters.js.map

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Point; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Popover; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__);
/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var Point;
(function (Point) {
    Point[Point["RIGHT_CENTER"] = 0] = "RIGHT_CENTER";
    Point[Point["RIGHT_TOP"] = 1] = "RIGHT_TOP";
    Point[Point["RIGHT_BOTTOM"] = 2] = "RIGHT_BOTTOM";
    Point[Point["TOP_CENTER"] = 3] = "TOP_CENTER";
    Point[Point["TOP_RIGHT"] = 4] = "TOP_RIGHT";
    Point[Point["TOP_LEFT"] = 5] = "TOP_LEFT";
    Point[Point["BOTTOM_CENTER"] = 6] = "BOTTOM_CENTER";
    Point[Point["BOTTOM_RIGHT"] = 7] = "BOTTOM_RIGHT";
    Point[Point["BOTTOM_LEFT"] = 8] = "BOTTOM_LEFT";
    Point[Point["LEFT_CENTER"] = 9] = "LEFT_CENTER";
    Point[Point["LEFT_TOP"] = 10] = "LEFT_TOP";
    Point[Point["LEFT_BOTTOM"] = 11] = "LEFT_BOTTOM";
})(Point || (Point = {}));
var POSITION_RELATIVE = "relative";
var POSITION_ABSOLUTE = "absolute";
var POSITION_FIXED = "fixed";
var OVERFLOW_SCROLL = "scroll";
var OVERFLOW_AUTO = "auto";
var Popover = (function () {
    function Popover(element) {
        this.element = element;
        this._scroll = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__["Subject"]();
        /*
         * Containers up to the first positioned one will have an event on scroll
         */
        this.scrollableElements = [];
        this.boundOnScrollListener = this.emitScrollEvent.bind(this);
        // Browsers don't agree with what to do if some of these are not specified, so we set them all to be safe.
        element.style.position = POSITION_ABSOLUTE;
        element.style.top = 0;
        element.style.bottom = "auto";
        element.style.left = 0;
        element.style.right = "auto";
    }
    // TODO: need a way to account for parameters that change dynamically (positioning).
    Popover.prototype.anchor = function (anchor, anchorAlign, popoverAlign, _a) {
        // TODO: we are assuming here that the popover is inside or next to the anchor.
        // We'd need to go up the popover tree too otherwise
        var _b = _a === void 0 ? {} : _a, _c = _b.offsetX, offsetX = _c === void 0 ? 0 : _c, _d = _b.offsetY, offsetY = _d === void 0 ? 0 : _d, _e = _b.useAnchorParent, useAnchorParent = _e === void 0 ? false : _e;
        this.addScrollEventListeners(anchor);
        if (useAnchorParent) {
            anchor = anchor.parentNode;
        }
        // explicitly override anchor's style to static
        anchor.style.position = "static";
        var anchorRect = anchor.getBoundingClientRect();
        var popoverRect = this.element.getBoundingClientRect();
        // position of left top corner of anchor + the offset
        var leftDiff = anchorRect.left - popoverRect.left + offsetX;
        var topDiff = anchorRect.top - popoverRect.top + offsetY;
        // first, adjust positioning based on anchor's align point
        switch (anchorAlign) {
            case Point.LEFT_TOP:
            case Point.TOP_LEFT:
                break;
            case Point.TOP_CENTER:
                leftDiff += anchorRect.width / 2;
                break;
            case Point.TOP_RIGHT:
                leftDiff += anchorRect.width;
                break;
            case Point.RIGHT_TOP:
                leftDiff += anchorRect.width;
                break;
            case Point.LEFT_BOTTOM:
                topDiff += anchorRect.height;
                break;
            case Point.BOTTOM_LEFT:
                topDiff += anchorRect.height;
                break;
            case Point.BOTTOM_CENTER:
                topDiff += anchorRect.height;
                leftDiff += anchorRect.width / 2;
                break;
            case Point.BOTTOM_RIGHT:
                topDiff += anchorRect.height;
                leftDiff += anchorRect.width;
                break;
            case Point.RIGHT_BOTTOM:
                topDiff += anchorRect.height;
                leftDiff += anchorRect.width;
                break;
            case Point.LEFT_CENTER:
                topDiff += anchorRect.height / 2;
                break;
            case Point.RIGHT_CENTER:
                topDiff += anchorRect.height / 2;
                leftDiff += anchorRect.width;
                break;
            default:
        }
        // second, adjust positioning based on popover's align point
        switch (popoverAlign) {
            case Point.LEFT_TOP:
            case Point.TOP_LEFT:
                break;
            case Point.TOP_CENTER:
                leftDiff -= popoverRect.width / 2;
                break;
            case Point.TOP_RIGHT:
                leftDiff -= popoverRect.width;
                break;
            case Point.RIGHT_TOP:
                leftDiff -= popoverRect.width;
                break;
            case Point.LEFT_BOTTOM:
                topDiff -= popoverRect.height;
                break;
            case Point.BOTTOM_LEFT:
                topDiff -= popoverRect.height;
                break;
            case Point.BOTTOM_CENTER:
                topDiff -= popoverRect.height;
                leftDiff -= popoverRect.width / 2;
                break;
            case Point.BOTTOM_RIGHT:
                topDiff -= popoverRect.height;
                leftDiff -= popoverRect.width;
                break;
            case Point.RIGHT_BOTTOM:
                topDiff -= popoverRect.height;
                leftDiff -= popoverRect.width;
                break;
            case Point.LEFT_CENTER:
                topDiff -= popoverRect.height / 2;
                break;
            case Point.RIGHT_CENTER:
                topDiff -= popoverRect.height / 2;
                leftDiff -= popoverRect.width;
                break;
            default:
        }
        // Third, adjust with popover's margins based on the two align points.
        // Here, we make an assumption that popover is primarily positioned outside the
        // anchor with minor offset. Without this assumption, it's impossible to apply
        // the popover's margins in a predictable way. For example, assume that a popover
        // and its anchor are exactly the same size. if a popover is positioned inside the
        // anchor (which is technically possible), then it becomes impossible to know what to do
        // if the popover has a non-zero margin value all around (because applying the margin in
        // all four directions will result in no margin visually, which isn't what we want).
        // Therefore, our logic makes assumptions about margins of interest given the points,
        // and only covers the cases where popover is outside the anchor.
        var popoverComputedStyle = getComputedStyle(this.element);
        var marginLeft = parseInt(popoverComputedStyle.marginLeft, 10);
        var marginRight = parseInt(popoverComputedStyle.marginRight, 10);
        var marginTop = parseInt(popoverComputedStyle.marginTop, 10);
        var marginBottom = parseInt(popoverComputedStyle.marginBottom, 10);
        switch (anchorAlign) {
            case Point.LEFT_TOP:
            case Point.TOP_LEFT:
            case Point.TOP_RIGHT:
            case Point.RIGHT_TOP:
                if (popoverAlign === Point.BOTTOM_RIGHT || popoverAlign === Point.RIGHT_BOTTOM) {
                    topDiff -= marginBottom;
                    leftDiff -= marginRight;
                }
                if (popoverAlign === Point.BOTTOM_LEFT || popoverAlign === Point.LEFT_BOTTOM) {
                    topDiff -= marginTop;
                    leftDiff += marginLeft;
                }
                if (popoverAlign === Point.TOP_LEFT || popoverAlign === Point.LEFT_TOP) {
                    topDiff += marginTop;
                    leftDiff += marginLeft;
                }
                if (popoverAlign === Point.TOP_RIGHT || popoverAlign === Point.RIGHT_TOP) {
                    topDiff += marginTop;
                    leftDiff -= marginRight;
                }
                break;
            case Point.LEFT_BOTTOM:
            case Point.BOTTOM_LEFT:
            case Point.BOTTOM_RIGHT:
            case Point.RIGHT_BOTTOM:
                if (popoverAlign === Point.BOTTOM_LEFT || popoverAlign === Point.LEFT_BOTTOM) {
                    topDiff -= marginBottom;
                    leftDiff += marginLeft;
                }
                if (popoverAlign === Point.BOTTOM_RIGHT || popoverAlign === Point.RIGHT_BOTTOM) {
                    topDiff -= marginBottom;
                    leftDiff -= marginRight;
                }
                if (popoverAlign === Point.TOP_LEFT || popoverAlign === Point.LEFT_TOP) {
                    topDiff += marginTop;
                    leftDiff += marginLeft;
                }
                if (popoverAlign === Point.TOP_RIGHT || popoverAlign === Point.RIGHT_TOP) {
                    topDiff += marginTop;
                    leftDiff -= marginRight;
                }
                break;
            case Point.TOP_CENTER:
                topDiff -= marginBottom;
                leftDiff += marginLeft;
                leftDiff -= marginRight;
                break;
            case Point.BOTTOM_CENTER:
                topDiff += marginTop;
                leftDiff += marginLeft;
                leftDiff -= marginRight;
                break;
            case Point.LEFT_CENTER:
                topDiff += marginTop;
                topDiff -= marginBottom;
                leftDiff -= marginRight;
                break;
            case Point.RIGHT_CENTER:
                topDiff += marginTop;
                topDiff -= marginBottom;
                leftDiff += marginLeft;
                break;
            default:
        }
        this.element.style.transform = "translateX(" + leftDiff + "px) translateY(" + topDiff + "px)";
        return this._scroll.asObservable();
    };
    Popover.prototype.destroy = function () {
        this.element.style.transform = "none";
        this.removeScrollEventListeners();
    };
    Popover.prototype.isPositioned = function (container) {
        var position = getComputedStyle(container).position;
        return position === POSITION_RELATIVE || position === POSITION_ABSOLUTE || position === POSITION_FIXED;
    };
    Popover.prototype.emitScrollEvent = function () {
        this._scroll.next(this);
    };
    Popover.prototype.addScrollEventListeners = function (e) {
        var anchor = e;
        var current = e;
        while (current && current !== document) {
            if (this.scrolls(current)) {
                current.addEventListener("scroll", this.boundOnScrollListener);
                this.scrollableElements.push(current);
            }
            if (current !== anchor && this.isPositioned(current)) {
                break;
            }
            current = current.parentNode;
        }
    };
    Popover.prototype.removeScrollEventListeners = function () {
        for (var _i = 0, _a = this.scrollableElements; _i < _a.length; _i++) {
            var elem = _a[_i];
            elem.removeEventListener("scroll", this.boundOnScrollListener);
        }
        this.scrollableElements.length = 0;
    };
    Popover.prototype.scrolls = function (container) {
        var computedStyles = getComputedStyle(container);
        return computedStyles.overflowX === OVERFLOW_SCROLL || computedStyles.overflowX === OVERFLOW_AUTO
            || computedStyles.overflowY === OVERFLOW_SCROLL || computedStyles.overflowY === OVERFLOW_AUTO;
    };
    return Popover;
}());

//# sourceMappingURL=popover.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(36);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(37);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HideableColumnService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__);
/*
 * Copyright (c) 2016 - 2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


/**
 * @class HideableColumnService
 *
 * @description
 * An @Injectable provider class that enables
 *
 * 1. Managing, track hideability of DatagridColumns
 *
 */
var HideableColumnService = (function () {
    function HideableColumnService() {
        /**********
         * @property dgHiddenColumnMap
         *
         * @description
         * An array of DatagridHideableColumn.
         * NOTE: because we can have columns w/o the *clrDgHideableColumn directive
         * this array will have empty spaces a.k.a nulls. This is needed to be able to map
         * DatagridCells to DatagridColumns in the RowRenderer.
         *
         *
         * @type { DatagridHideableColumn[] }
         */
        this._columnList = [];
        /**********
         *
         * @property dgHiddenColumnMapChange
         *
         * @description
         * A behavior subject that can broadcast updates to the column list.
         * NOTE: I am using BehaviorSubject because <clr-dg-column-toggle> is not getting the latest _columnListChange
         * on page load.
         *
         * @type {BehaviorSubject<DatagridColumn[]>}
         */
        this._columnListChange = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["BehaviorSubject"](this._columnList);
    }
    Object.defineProperty(HideableColumnService.prototype, "canHideNextColumn", {
        /**********
         *
         * @property canHideNextColumn
         *
         * @description
         * Service function that is called by clr-dg-column-toggle component. Use this if you need to ask if you can hide
         * a column. It acts as a guard against hiding all the columns making sure there is at least one column displayed.
         *
         * @returns {boolean}
         */
        get: function () {
            var hiddenColumns = this._columnList.filter(function (column) { return column !== undefined; }).filter(function (column) { return column.hidden; });
            return (this._columnList.length - hiddenColumns.length > 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HideableColumnService.prototype, "checkForAllColumnsVisible", {
        /**********
         *
         * @property checkForAllColumnsVisible
         *
         * @description
         * For when you need to know if the datagrid's columns are all showing.
         *
         * @return {boolean}
         */
        get: function () {
            return !this._columnList.some(function (column) { return column && column.hidden; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HideableColumnService.prototype, "columnListChange", {
        /***********
         * @property columnListChange
         *
         * @description
         * A public property that enables subscribers to hear updates to the column map.
         * Use this if you need to do something whenever the Datagrid's column list is changed (i.e *ngIf on a column).
         *
         * @returns {Observable<DatagridHideableColumn[]>}
         */
        get: function () {
            return this._columnListChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**********
     *
     * @function getColumns
     *
     * @description
     * Public function that returns the current list of columns. I needed an array of to iterate on in the RowRenderer
     * but subscribing to the _columnListChange changes did not seem like the correct way to get it.
     *
     * @returns {DatagridColumn[]}
     */
    HideableColumnService.prototype.getColumns = function () {
        return this._columnList;
    };
    /**********
     * @function showHiddenColumns
     *
     * @description
     * Iterate through the current _columnList:
     * - if it has a DatagridHideableColumn and is hidden then show it.
     * - if it's DatagridHideableColumn was previously the last column visible, turn that flag off.
     *
     */
    HideableColumnService.prototype.showHiddenColumns = function () {
        this._columnList.forEach(function (column) {
            if (column && column.hidden === true) {
                column.hidden = false;
            }
            if (column && column.lastVisibleColumn) {
                column.lastVisibleColumn = false;
            }
        });
    };
    /**
     * @function updateColumnList
     *
     * @param columns: DatagridColumn[]
     *
     * @description
     * Creates an array of DatagridHideableColumn's || null based column array passed as param.
     * Is dependent on the order in @ContentChildren in Datagrid.
     *
     * @param columns
     *
     */
    HideableColumnService.prototype.updateColumnList = function (columns) {
        this._columnList = columns; // clear the list
        this.updateForLastVisibleColumn(); // Update our visibility state for UI
        this._columnListChange.next(this._columnList); // Broadcast it
    };
    /**********
     *
     * @function updateForLastVisibleColumn
     *
     * @description
     * Gets the current visible count for all columns.
     * When it is greater than 1 it marks everything as false for the lastVisibleColumn.
     * When visible count is not > 1 (i.e) 1. , it finds the only column that is not hidden and marks it as the
     * lastVisibleColumn.
     *
     * @return void
     *
     */
    HideableColumnService.prototype.updateForLastVisibleColumn = function () {
        // There is more than one column showing, make sure nothing is marked lastVisibleColumn
        if (this.canHideNextColumn) {
            this._columnList.map(function (column) {
                if (column && column.lastVisibleColumn) {
                    column.lastVisibleColumn = false;
                }
            });
        }
        else {
            // The visibleCount is down to only one column showing. Find it and flag it as the lastVisibleColumn
            this._columnList.map(function (column) {
                if (column && !column.hidden) {
                    column.lastVisibleColumn = true;
                }
            });
        }
    };
    /**********
     *
     * @function getColumnById
     *
     * @description
     * Return a HideableColumn in this._columnList for the given id.
     *
     * @param id
     *
     * @type string
     *
     * @returns HideableColumn
     *
     */
    HideableColumnService.prototype.getColumnById = function (id) {
        if (id) {
            return this._columnList.find(function (column) { return column.id === id; });
        }
        return;
    };
    return HideableColumnService;
}());

HideableColumnService.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
HideableColumnService.ctorParameters = function () { return []; };
//# sourceMappingURL=hideable-column.service.js.map

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Items; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__filters__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__page__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sort__ = __webpack_require__(46);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





var Items = (function () {
    function Items(_filters, _sort, _page) {
        this._filters = _filters;
        this._sort = _sort;
        this._page = _page;
        /**
         * Indicates if the data is currently loading
         */
        this.loading = false;
        //TODO: Verify that trackBy is registered for the *ngFor case too
        /**
         * Tracking function to identify objects. Default is reference equality.
         */
        this.trackBy = function (index, item) { return item; };
        /**
         * Whether we should use smart items for this datagrid or let the user handle
         * everything.
         */
        this._smart = false;
        /**
         * List of items currently displayed
         */
        this._displayed = [];
        /**
         * The Observable that lets other classes subscribe to items changes
         */
        this._change = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._allChanges = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    /**
     * Cleans up our subscriptions to other providers
     */
    Items.prototype.destroy = function () {
        if (this._filtersSub) {
            this._filtersSub.unsubscribe();
        }
        if (this._sortSub) {
            this._sortSub.unsubscribe();
        }
        if (this._pageSub) {
            this._pageSub.unsubscribe();
        }
    };
    Object.defineProperty(Items.prototype, "smart", {
        get: function () {
            return this._smart;
        },
        enumerable: true,
        configurable: true
    });
    Items.prototype.smartenUp = function () {
        var _this = this;
        this._smart = true;
        /*
         * These observers trigger a chain of function: filter -> sort -> paginate
         * An observer up the chain re-triggers all the operations that follow it.
         */
        this._filtersSub = this._filters.change.subscribe(function () { return _this._filterItems(); });
        this._sortSub = this._sort.change.subscribe(function () {
            // Special case, if the datagrid went from sorted to unsorted, we have to re-filter
            // to get the original order back
            if (!_this._sort.comparator) {
                _this._filterItems();
            }
            else {
                _this._sortItems();
            }
        });
        this._pageSub = this._page.change.subscribe(function () { return _this._changePage(); });
    };
    Object.defineProperty(Items.prototype, "all", {
        set: function (items) {
            if (this.smart) {
                this._all = items;
                this.emitAllChanges();
                this._filterItems();
            }
            else {
                this._displayed = items;
                this.emitChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Manually recompute the list of displayed items
     */
    Items.prototype.refresh = function () {
        if (this.smart) {
            this._filterItems();
        }
    };
    Object.defineProperty(Items.prototype, "displayed", {
        get: function () {
            // Ideally we could return an immutable array, but we don't have it in Clarity yet.
            return this._displayed;
        },
        enumerable: true,
        configurable: true
    });
    Items.prototype.emitChange = function () {
        this._change.next(this.displayed);
    };
    Object.defineProperty(Items.prototype, "change", {
        // We do not want to expose the Subject itself, but the Observable which is read-only
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Items.prototype.emitAllChanges = function () {
        if (this.smart) {
            this._allChanges.next(this._all);
        }
    };
    Object.defineProperty(Items.prototype, "allChanges", {
        get: function () {
            return this._allChanges.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Items.prototype, "uninitialized", {
        /**
         * Checks if we don't have data to process yet, to abort early operations
         */
        get: function () {
            return !this._all;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * FiltersProvider items from the raw list
     */
    Items.prototype._filterItems = function () {
        var _this = this;
        if (this.uninitialized) {
            return;
        }
        if (this._filters.hasActiveFilters()) {
            this._filtered = this._all.filter(function (item) { return _this._filters.accepts(item); });
        }
        else {
            // Work on a shallow copy of the array, to not modify the user's model
            this._filtered = this._all.slice();
        }
        this._page.totalItems = this._filtered.length;
        this._sortItems();
    };
    /**
     * Sorts items in the filtered list
     */
    Items.prototype._sortItems = function () {
        var _this = this;
        if (this.uninitialized) {
            return;
        }
        if (this._sort.comparator) {
            this._filtered.sort(function (a, b) { return _this._sort.compare(a, b); });
        }
        this._changePage();
    };
    /**
     * Extracts the current page from the sorted list
     */
    Items.prototype._changePage = function () {
        if (this.uninitialized) {
            return;
        }
        if (this._page.size > 0) {
            this._displayed = this._filtered.slice(this._page.firstItem, this._page.lastItem + 1);
        }
        else {
            this._displayed = this._filtered;
        }
        this.emitChange();
    };
    return Items;
}());

Items.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
Items.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__filters__["a" /* FiltersProvider */], },
    { type: __WEBPACK_IMPORTED_MODULE_4__sort__["a" /* Sort */], },
    { type: __WEBPACK_IMPORTED_MODULE_3__page__["a" /* Page */], },
]; };
//# sourceMappingURL=items.js.map

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var Page = (function () {
    function Page() {
        /**
         * Page size, a value of 0 means no pagination
         */
        this._size = 0;
        /**
         * Total items (needed to guess the last page)
         */
        this._totalItems = 0;
        /**
         * The Observable that lets other classes subscribe to page changes
         */
        this._change = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._sizeChange = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        /**
         * Current page
         */
        this._current = 1;
    }
    Object.defineProperty(Page.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (size) {
            var oldSize = this._size;
            if (size !== oldSize) {
                this._size = size;
                // Yeap. That's the formula to keep the first item from the old page still
                // displayed in the new one.
                this._current = Math.floor(oldSize / size * (this._current - 1)) + 1;
                // We always emit an event even if the current page index didn't change, because
                // the size changing means the items inside the page are different
                this._change.next(this._current);
                this._sizeChange.next(this._size);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "totalItems", {
        get: function () {
            return this._totalItems;
        },
        set: function (total) {
            this._totalItems = total;
            // If we have less items than before, we might need to change the current page
            if (this.current > this.last) {
                this.current = this.last;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "last", {
        get: function () {
            if (this._last) {
                return this._last;
            }
            // If the last page isn't known, we compute it from the last item's index
            if (this.size > 0 && this.totalItems) {
                return Math.ceil(this.totalItems / this.size);
            }
            return 1;
        },
        set: function (page) {
            this._last = page;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "change", {
        // We do not want to expose the Subject itself, but the Observable which is read-only
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Page.prototype, "sizeChange", {
        get: function () {
            return this._sizeChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "current", {
        get: function () {
            return this._current;
        },
        set: function (page) {
            if (page !== this._current) {
                this._current = page;
                this._change.next(page);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Moves to the previous page if it exists
     */
    Page.prototype.previous = function () {
        if (this.current > 1) {
            this.current--;
        }
    };
    /**
     * Moves to the next page if it exists
     */
    Page.prototype.next = function () {
        if (this.current < this.last) {
            this.current++;
        }
    };
    Object.defineProperty(Page.prototype, "firstItem", {
        /**
         * Index of the first item displayed on the current page, starting at 0
         */
        get: function () {
            if (this.size === 0) {
                return 0;
            }
            return (this.current - 1) * this.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "lastItem", {
        /**
         * Index of the last item displayed on the current page, starting at 0
         */
        get: function () {
            if (this.size === 0) {
                return this.totalItems - 1;
            }
            var lastInPage = (this.current) * this.size - 1;
            if (this.totalItems) {
                lastInPage = Math.min(lastInPage, this.totalItems - 1);
            }
            return lastInPage;
        },
        enumerable: true,
        configurable: true
    });
    return Page;
}());

Page.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
Page.ctorParameters = function () { return []; };
//# sourceMappingURL=page.js.map

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DomAdapter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * If we someday want to be able to render the datagrid in a webworker,
 * this is where we would test if we're in headless mode. Right now it's not testing anything, but any access
 * to native DOM elements' methods and properties in the Datagrid happens here.
 */

var DomAdapter = (function () {
    function DomAdapter() {
    }
    DomAdapter.prototype.userDefinedWidth = function (element) {
        element.classList.add("datagrid-cell-width-zero");
        var userDefinedWidth = parseInt(getComputedStyle(element).getPropertyValue("width"), 10);
        element.classList.remove("datagrid-cell-width-zero");
        return userDefinedWidth;
    };
    DomAdapter.prototype.scrollBarWidth = function (element) {
        return element.offsetWidth - element.clientWidth;
    };
    DomAdapter.prototype.scrollWidth = function (element) {
        return element.scrollWidth || 0;
    };
    DomAdapter.prototype.computedHeight = function (element) {
        return parseInt(getComputedStyle(element).getPropertyValue("height"), 10);
    };
    DomAdapter.prototype.clientRectRight = function (element) {
        return parseInt(element.getBoundingClientRect().right, 10);
    };
    DomAdapter.prototype.clientRectWidth = function (element) {
        return parseInt(element.getBoundingClientRect().width, 10);
    };
    DomAdapter.prototype.minWidth = function (element) {
        return parseInt(getComputedStyle(element).getPropertyValue("min-width"), 10);
    };
    return DomAdapter;
}());

DomAdapter.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
DomAdapter.ctorParameters = function () { return []; };
//# sourceMappingURL=dom-adapter.js.map

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StackView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return StackViewCustomTags; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var StackView = (function () {
    function StackView() {
        /**
         * Undocumented experimental feature: inline editing.
         */
        this.editable = false;
        this.save = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this._editMode = false;
        this.editingChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
    }
    Object.defineProperty(StackView.prototype, "editing", {
        get: function () {
            return this.editable && this._editMode;
        },
        set: function (value) {
            if (this.editable) {
                this._editMode = value;
                this.editingChange.emit(value);
                if (!value) {
                    this.save.emit(null);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return StackView;
}());

/**
 * End of undocumented experimental feature.
 */
StackView.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-stack-view",
                template: "\n        <ng-content select=\"clr-stack-header\"></ng-content>\n        <dl class=\"stack-view\"><ng-content></ng-content></dl>\n    ",
                // Custom elements are inline by default.
                styles: ["\n        :host { display: block; }\n    "]
            },] },
];
/** @nocollapse */
StackView.ctorParameters = function () { return []; };
StackView.propDecorators = {
    'save': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrStackSave",] },],
};
var StackViewCustomTags = (function () {
    function StackViewCustomTags() {
    }
    return StackViewCustomTags;
}());

// No behavior
// The only purpose is to "declare" the tag in Angular
StackViewCustomTags.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: "clr-stack-label, clr-stack-content" },] },
];
/** @nocollapse */
StackViewCustomTags.ctorParameters = function () { return []; };
//# sourceMappingURL=stack-view.js.map

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrResponsiveNavigationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__clrResponsiveNavCodes__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavControlMessage__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var ClrResponsiveNavigationService = (function () {
    function ClrResponsiveNavigationService() {
        this.responsiveNavList = [];
        this.registerNavSubject = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["Subject"]();
        this.controlNavSubject = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["Subject"]();
        this.closeAllNavs(); //We start with all navs closed
    }
    Object.defineProperty(ClrResponsiveNavigationService.prototype, "registeredNavs", {
        get: function () {
            return this.registerNavSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClrResponsiveNavigationService.prototype, "navControl", {
        get: function () {
            return this.controlNavSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ClrResponsiveNavigationService.prototype.registerNav = function (navLevel) {
        if (!navLevel || this.isNavRegistered(navLevel)) {
            return;
        }
        this.responsiveNavList.push(navLevel);
        this.registerNavSubject.next(this.responsiveNavList);
    };
    ClrResponsiveNavigationService.prototype.isNavRegistered = function (navLevel) {
        if (this.responsiveNavList.indexOf(navLevel) > -1) {
            console.error("Multiple clr-nav-level " + navLevel
                + " attributes found. Please make sure that only one exists");
            return true;
        }
        return false;
    };
    ClrResponsiveNavigationService.prototype.unregisterNav = function (navLevel) {
        var index = this.responsiveNavList.indexOf(navLevel);
        if (index > -1) {
            this.responsiveNavList.splice(index, 1);
            this.registerNavSubject.next(this.responsiveNavList);
        }
    };
    ClrResponsiveNavigationService.prototype.sendControlMessage = function (controlCode, navLevel) {
        var message = new __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavControlMessage__["a" /* ClrResponsiveNavControlMessage */](controlCode, navLevel);
        this.controlNavSubject.next(message);
    };
    ClrResponsiveNavigationService.prototype.closeAllNavs = function () {
        var message = new __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavControlMessage__["a" /* ClrResponsiveNavControlMessage */](__WEBPACK_IMPORTED_MODULE_1__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_CLOSE_ALL, -999);
        this.controlNavSubject.next(message);
    };
    return ClrResponsiveNavigationService;
}());

ClrResponsiveNavigationService.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
ClrResponsiveNavigationService.ctorParameters = function () { return []; };
//# sourceMappingURL=clrResponsiveNavigationService.js.map

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PageCollectionService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


/**
 * PageCollectionService manages the collection of pages assigned to the wizard and offers
 * a number of functions useful across the wizards providers and subcomponents -- all related
 * to essentially lookups on the collection of pages.
 *
 * The easiest way to access PageCollectionService is via the wizard. The
 * following example would allow you to access your instance of the wizard from your host
 * component and thereby access the page collection via YourHostComponent.wizard.pageCollection.
 *
 * @example
 * <clr-wizard #wizard ...>
 *
 * @example
 * export class YourHostComponent {
 *   @ViewChild("wizard") wizard: Wizard;
 *   ...
 * }
 *
 * The heart of the page collection is the query list of pages, which it is assigned as a
 * reference to the Wizard.pages QueryList when the wizard is created.
 *
 * @export
 * @class PageCollectionService
 */
var PageCollectionService = (function () {
    function PageCollectionService() {
        // used by the navService to navigate back to first possible step after
        // pages are reset
        /**
         *
         * @private
         *
         * @memberof PageCollectionService
         */
        this._pagesReset = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    Object.defineProperty(PageCollectionService.prototype, "pagesAsArray", {
        /**
         * Converts the PageCollectionService.pages QueryList to an array and returns it.
         *
         * Useful for many instances when you would prefer a QueryList to act like an array.
         *
         * @readonly
         * @type {WizardPage[]}
         * @memberof PageCollectionService
         */
        get: function () {
            return this.pages ? this.pages.toArray() : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageCollectionService.prototype, "pagesCount", {
        /**
         * Returns the length of the pages query list.
         *
         * @readonly
         * @type {number}
         * @memberof PageCollectionService
         */
        get: function () {
            return this.pages ? this.pages.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageCollectionService.prototype, "penultimatePage", {
        /**
         * Returns the next-to-last page in the query list of pages. Operates as a getter
         * so that it isn't working with stale data.
         *
         * @readonly
         * @type {WizardPage}
         * @memberof PageCollectionService
         */
        get: function () {
            var pageCount = this.pagesCount;
            if (pageCount < 2) {
                return;
            }
            return this.pagesAsArray[pageCount - 2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageCollectionService.prototype, "lastPage", {
        /**
         * Returns the last page in the query list of pages. Operates as a getter
         * so that it isn't working with stale data.
         *
         * @readonly
         * @type {WizardPage}
         * @memberof PageCollectionService
         */
        get: function () {
            var pageCount = this.pagesCount;
            if (pageCount < 1) {
                return;
            }
            return this.pagesAsArray[pageCount - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageCollectionService.prototype, "firstPage", {
        /**
         * Returns the first page in the query list of pages. Operates as a getter
         * so that it isn't working with stale data.
         *
         * @readonly
         * @type {WizardPage}
         * @memberof PageCollectionService
         */
        get: function () {
            if (!this.pagesCount) {
                return;
            }
            return this.pagesAsArray[0];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Used mostly internally, but accepts a string ID and returns a WizardPage
     * object that matches the ID passed. Note that IDs here should include the prefix
     * "clr-wizard-page-".
     *
     * Returns the next-to-last page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @readonly
     * @type {WizardPage}
     * @param {string} id  ID of the page you're looking for
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.getPageById = function (id) {
        var foundPages = this.pages.filter(function (page) { return id === page.id; });
        return this.checkResults(foundPages, id);
    };
    /**
     * Accepts s number as a parameter and treats that number as the index of the page
     * you're looking for in the collection of pages. Returns a  wizard page object.
     *
     * @param {number} index
     * @returns {WizardPage}
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.getPageByIndex = function (index) {
        var pageCount = this.pagesCount;
        var pagesLastIndex = (pageCount > 1) ? pageCount - 1 : 0;
        if (index < 0) {
            throw new Error("Cannot retrieve page with index of " + index);
        }
        if (index > pagesLastIndex) {
            throw new Error("Page index is greater than length of pages array.");
        }
        return this.pagesAsArray[index];
    };
    /**
     * Takes a wizard page object as a parameter and returns its index in the
     * collection of pages.
     *
     * @param {WizardPage} page
     * @returns {number}
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.getPageIndex = function (page) {
        var index = this.pagesAsArray.indexOf(page);
        if (index < 0) {
            throw new Error("Requested page cannot be found in collection of pages.");
        }
        return index;
    };
    /**
     * Consolidates guard logic that prevents a couple of unfortunate edge cases with
     * look ups on the collection of pages.
     *
     * @private
     * @param {WizardPage[]} results
     * @param {string} requestedPageId
     * @returns
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.checkResults = function (results, requestedPageId) {
        var foundPagesCount = results.length || 0;
        if (foundPagesCount > 1) {
            throw new Error("More than one page has the requested id " + requestedPageId + ".");
        }
        else if (foundPagesCount < 1) {
            throw new Error("No page can be found with the id " + requestedPageId + ".");
        }
        else {
            return results[0];
        }
    };
    /**
     * Accepts two numeric indexes and returns an array of wizard page objects that include
     * all wizard pages in the page collection from the first index to the second.
     *
     * @param {number} start
     * @param {number} end
     * @returns {WizardPage[]}
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.pageRange = function (start, end) {
        var pages = [];
        if (start < 0 || end < 0) {
            return [];
        }
        if (start === null || typeof start === undefined || isNaN(start)) {
            return [];
        }
        if (end === null || typeof end === undefined || isNaN(end)) {
            return [];
        }
        if (end > this.pagesCount) {
            end = this.pagesCount;
        }
        pages = this.pagesAsArray;
        if ((end - start) === 0) {
            // just return the one page they want
            return [this.getPageByIndex(start)];
        }
        // slice end does not include item referenced by end index, which is weird for users
        // incrementing end index here to correct that so users and other methods
        // don't have to think about it
        end = end + 1;
        // slice does not return the last one in the range but it does include the first one
        // does not modify original array
        return pages.slice(start, end);
    };
    /**
     * Accepts two wizard page objects and returns those page objects with all other page
     * objects between them in the page collection. It doesn't care which page is ahead of the
     * other in the parameters. It will be smart enough to figure that out  on its own.
     *
     * @param {WizardPage} page
     * @param {WizardPage} otherPage
     * @returns {WizardPage[]}
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.getPageRangeFromPages = function (page, otherPage) {
        var pageIndex = this.getPageIndex(page);
        var otherPageIndex = this.getPageIndex(otherPage);
        var startIndex;
        var endIndex;
        if (pageIndex <= otherPageIndex) {
            startIndex = pageIndex;
            endIndex = otherPageIndex;
        }
        else {
            startIndex = otherPageIndex;
            endIndex = pageIndex;
        }
        return this.pageRange(startIndex, endIndex);
    };
    /**
     * Takes a wizard page object as a parameter and returns the wizard page object of
     * the page immediately before it in the page collection. Returns null if there is
     * no page before the page it is passed.
     *
     * @param {WizardPage} page
     * @returns {WizardPage}
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.getPreviousPage = function (page) {
        var myPageIndex = this.getPageIndex(page);
        var previousPageIndex = myPageIndex - 1;
        if (previousPageIndex < 0) {
            return null;
        }
        return this.getPageByIndex(previousPageIndex);
    };
    /**
     * Accepts a wizard page object as a parameter and returns a Boolean that says if
     * the page you sent it is complete.
     *
     * @param {WizardPage} page
     * @returns {boolean}
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.previousPageIsCompleted = function (page) {
        var previousPage;
        if (!page) {
            return false;
        }
        previousPage = this.getPreviousPage(page);
        if (null === previousPage) {
            // page is the first page. no previous page.
            return true;
        }
        return previousPage.completed;
    };
    /**
     * Takes a wizard page object as a parameter and returns the wizard page object of
     * the page immediately after it in the page collection. Returns null if there is
     * no page after the page it is passed.
     *
     * @param {WizardPage} page
     * @returns {WizardPage} next page
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.getNextPage = function (page) {
        var myPageIndex = this.getPageIndex(page);
        var nextPageIndex = myPageIndex + 1;
        if (nextPageIndex >= this.pagesAsArray.length) {
            return null;
        }
        return this.getPageByIndex(nextPageIndex);
    };
    /**
     * Takes a wizard page object as a parameter and generates a step item id from the
     * page ID. Returns the generated step item ID as a string.
     *
     * @param {WizardPage} page
     * @returns {string}
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.getStepItemIdForPage = function (page) {
        var pageId = page.id;
        var pageIdParts = pageId.split("-").reverse();
        pageIdParts[1] = "step";
        return pageIdParts.reverse().join("-");
    };
    /**
     * Generally only used internally to mark that a specific page has been "committed".
     * This involves marking the page complete and firing the WizardPage.onCommit
     * (clrWizardPageOnCommit) output. Takes the wizard page object that you intend to
     * mark completed as a parameter.
     *
     * @param {WizardPage} page
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.commitPage = function (page) {
        var pageHasOverrides = page.stopNext || page.preventDefault;
        page.completed = true;
        if (!pageHasOverrides) {
            // prevent loop of event emission; alternate flows work off
            // of event emitters this is how they break that cycle.
            page.onCommit.emit(page.id);
        }
    };
    Object.defineProperty(PageCollectionService.prototype, "pagesReset", {
        /**
         * An observable that the navigation service listens to in order to know when
         * the page collection completed states have been reset to false so that way it
         * can also reset the navigation to make the first page in the page collection
         * current/active.
         *
         * @readonly
         * @type {Observable<boolean>}
         * @memberof PageCollectionService
         */
        get: function () {
            return this._pagesReset.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets all completed states of the pages in the page collection to false and
     * notifies the navigation service to likewise reset the navigation.
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.reset = function () {
        this.pagesAsArray.forEach(function (page) {
            page.completed = false;
        });
        this._pagesReset.next(true);
    };
    /**
     * Rolls through all the pages in the page collection to make sure there are no
     * incomplete pages sandwiched between completed pages in the workflow. Identifies
     * the first incomplete page index and sets all pages behind it to a completed
     * state of false.
     *
     * @returns {void}
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.updateCompletedStates = function () {
        var firstIncompleteIndex = this.findFirstIncompletePageIndex();
        if (firstIncompleteIndex === this.pagesAsArray.length - 1) {
            // all complete no need to do anything
            return;
        }
        this.pagesAsArray.forEach(function (page, index) {
            if (index > firstIncompleteIndex) {
                page.completed = false;
            }
        });
    };
    /**
     * Retrieves the index of the first incomplete page in the page collection.
     *
     * @returns {number}
     *
     * @memberof PageCollectionService
     */
    PageCollectionService.prototype.findFirstIncompletePageIndex = function () {
        var returnIndex = null;
        this.pagesAsArray.forEach(function (page, index) {
            if (null === returnIndex && false === page.completed) {
                returnIndex = index;
            }
        });
        // fallthrough, all completed, return last page
        if (null === returnIndex) {
            returnIndex = this.pagesCount - 1;
        }
        return returnIndex;
    };
    PageCollectionService.prototype.findFirstIncompletePage = function () {
        var myIncompleteIndex = this.findFirstIncompletePageIndex();
        return this.pagesAsArray[myIncompleteIndex];
    };
    return PageCollectionService;
}());

PageCollectionService.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
PageCollectionService.ctorParameters = function () { return []; };
//# sourceMappingURL=page-collection.js.map

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardNavigationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__page_collection__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__button_hub__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modal_utils_ghost_page_animations__ = __webpack_require__(50);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





/**
 * Performs navigation functions for a wizard and manages the current page. Presented as a
 * separate service to encapsulate the behavior of navigating and completing the wizard so
 * that it can be shared across the wizard and its sub-components.
 *
 * The easiest way to access the navigation service is there a reference on your wizard. The
 * Following example would allow you to access your instance of the wizard from your host
 * component and thereby access the navigation service via YourHostComponent.wizard.navService.
 *
 * @example
 * <clr-wizard #wizard ...>
 *
 * @example
 * export class YourHostComponent {
 *   @ViewChild("wizard") wizard: Wizard;
 *   ...
 * }
 *
 * @export
 * @class WizardNavigationService
 * @implements {OnDestroy}
 */
var WizardNavigationService = (function () {
    /**
     * Creates an instance of WizardNavigationService. Also sets up subscriptions
     * that listen to the button service to determine when a button has been clicked
     * in the wizard. Is also responsible for taking action when the page collection
     * requests that navigation be reset to its pristine state.
     *
     * @param {PageCollectionService} pageCollection
     * @param {ButtonHubService} buttonService
     *
     * @memberof WizardNavigationService
     */
    function WizardNavigationService(pageCollection, buttonService) {
        var _this = this;
        this.pageCollection = pageCollection;
        this.buttonService = buttonService;
        /**
         *
         * @ignore
         * @private
         *
         * @memberof WizardNavigationService
         */
        this._currentChanged = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        /**
         * A Boolean flag used by the WizardPage to avoid a race condition when pages are
         * loading and there is no current page defined.
         *
         * @type {boolean}
         * @memberof WizardNavigationService
         */
        this.navServiceLoaded = false;
        /**
         * A boolean flag shared across the Wizard subcomponents that follows the value
         * of the Wizard.forceForward (clrWizardForceForwardNavigation) input. When true,
         * navigating backwards in the stepnav menu will reset any skipped pages' completed
         * state to false.
         *
         * This is useful when a wizard executes validation on a page-by-page basis when
         * the next button is clicked.
         *
         * @type {boolean}
         * @memberof WizardNavigationService
         */
        this.forceForwardNavigation = false;
        /**
         *
         * @ignore
         * @private
         *
         * @memberof WizardNavigationService
         */
        this._movedToNextPage = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        /**
         *
         * @ignore
         * @private
         *
         * @memberof WizardNavigationService
         */
        this._wizardFinished = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        /**
         *
         * @ignore
         * @private
         *
         * @memberof WizardNavigationService
         */
        this._movedToPreviousPage = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        /**
         *
         * @ignore
         * @private
         *
         * @memberof WizardNavigationService
         */
        this._cancelWizard = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        /**
         * A boolean flag shared across the Wizard subcomponents that follows the value
         * of the Wizard.stopCancel (clrWizardPreventDefaultCancel) input. When true, the cancel
         * routine is subverted and must be reinstated in the host component calling Wizard.close()
         * at some point.
         *
         * @type {boolean}
         * @memberof WizardNavigationService
         */
        this.wizardHasAltCancel = false;
        /**
         * A boolean flag shared across the Wizard subcomponents that follows the value
         * of the Wizard.stopNext (clrWizardPreventDefaultNext) input. When true, the next and finish
         * routines are subverted and must be reinstated in the host component calling Wizard.next(),
         * Wizard.forceNext(), Wizard.finish(), or Wizard.forceFinish().
         *
         * @type {boolean}
         * @memberof WizardNavigationService
         */
        this.wizardHasAltNext = false;
        /**
         *
         * @ignore
         * @private
         * @type {string}
         * @memberof WizardNavigationService
         */
        this._wizardGhostPageState = __WEBPACK_IMPORTED_MODULE_4__modal_utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.NO_PAGES;
        /**
         *
         * @ignore
         * @private
         * @type {boolean}
         * @memberof WizardNavigationService
         */
        this._hideWizardGhostPages = true;
        this.previousButtonSubscription = this.buttonService.previousBtnClicked.subscribe(function () {
            var currentPage = _this.currentPage;
            if (_this.currentPageIsFirst || currentPage.previousStepDisabled) {
                return;
            }
            currentPage.previousButtonClicked.emit(currentPage);
            if (!currentPage.preventDefault) {
                _this.previous();
            }
        });
        this.nextButtonSubscription = this.buttonService.nextBtnClicked.subscribe(function () {
            _this.checkAndCommitCurrentPage("next");
        });
        this.dangerButtonSubscription = this.buttonService.dangerBtnClicked.subscribe(function () {
            _this.checkAndCommitCurrentPage("danger");
        });
        this.finishButtonSubscription = this.buttonService.finishBtnClicked.subscribe(function () {
            _this.checkAndCommitCurrentPage("finish");
        });
        this.customButtonSubscription = this.buttonService.customBtnClicked.subscribe(function (type) {
            _this.currentPage.customButtonClicked.emit(type);
        });
        this.cancelButtonSubscription = this.buttonService.cancelBtnClicked.subscribe(function () {
            if (_this.currentPage.preventDefault) {
                _this.currentPage.pageOnCancel.emit(_this.currentPage);
            }
            else {
                _this.cancel();
            }
        });
        this.pagesResetSubscription = this.pageCollection.pagesReset.subscribe(function () {
            _this.setFirstPageCurrent();
        });
    }
    /**
     *
     * @ignore
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.ngOnDestroy = function () {
        this.previousButtonSubscription.unsubscribe();
        this.nextButtonSubscription.unsubscribe();
        this.dangerButtonSubscription.unsubscribe();
        this.finishButtonSubscription.unsubscribe();
        this.customButtonSubscription.unsubscribe();
        this.cancelButtonSubscription.unsubscribe();
        this.pagesResetSubscription.unsubscribe();
    };
    Object.defineProperty(WizardNavigationService.prototype, "currentPageChanged", {
        /**
         * An Observable that is predominantly used amongst the subcomponents and services
         * of the wizard. It is recommended that users listen to the WizardPage.onLoad
         * (clrWizardPageOnLoad) output instead of this Observable.
         *
         * @private
         *
         * @memberof WizardNavigationService
         */
        get: function () {
            // TODO: MAKE SURE EXTERNAL OUTPUTS SAY 'CHANGE' NOT 'CHANGED'
            // A BREAKING CHANGE SO AWAITING MINOR RELEASE
            return this._currentChanged.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(WizardNavigationService.prototype, "currentPageTitle", {
        /**
         *
         * @ignore
         * @readonly
         * @type {TemplateRef<any>}
         * @memberof WizardNavigationService
         */
        get: function () {
            // when the querylist of pages is empty. this is the first place it fails...
            if (!this.currentPage) {
                return null;
            }
            return this.currentPage.title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardNavigationService.prototype, "currentPageIsFirst", {
        /**
         * Returns a Boolean that tells you whether or not the current page is the first
         * page in the Wizard.
         *
         * This is helpful for determining whether a page is navigable.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardNavigationService
         */
        get: function () {
            return this.pageCollection.firstPage === this.currentPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardNavigationService.prototype, "currentPageIsNextToLast", {
        /**
         * Returns a Boolean that tells you whether or not the current page is the
         * next to last page in the Wizard.
         *
         * This is used to determine the animation state of ghost pages.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardNavigationService
         */
        get: function () {
            return this.pageCollection.penultimatePage === this.currentPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardNavigationService.prototype, "currentPageIsLast", {
        /**
         * Returns a Boolean that tells you whether or not the current page is the
         * last page in the Wizard.
         *
         * This is used to determine the animation state of ghost pages as well as
         * which buttons should display in the wizard footer.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardNavigationService
         */
        get: function () {
            return this.pageCollection.lastPage === this.currentPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardNavigationService.prototype, "currentPage", {
        /**
         * Returns the WizardPage object of the current page or null.
         *
         * @type {WizardPage}
         * @memberof WizardNavigationService
         */
        get: function () {
            if (!this._currentPage) {
                return null;
            }
            return this._currentPage;
        },
        /**
         * Accepts a WizardPage object, since that object to be the current/active
         * page in the wizard, and emits the WizardPage.onLoad (clrWizardPageOnLoad)
         * event for that page.
         *
         * Note that all of this work is bypassed if the WizardPage object is already
         * the current page.
         *
         * @memberof WizardNavigationService
         */
        set: function (page) {
            if (this._currentPage !== page) {
                this._currentPage = page;
                page.onLoad.emit(page.id);
                this._currentChanged.next(page);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * (DEPRECATED) A legacy means of setting the current page in the wizard.
     * Deprecated in 0.9.4. Accepts a WizardPage object as a parameter and then
     * tries to set that page to be the current page in the wizard.
     *
     * @param {WizardPage} page
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.setCurrentPage = function (page) {
        this.currentPage = page;
    };
    Object.defineProperty(WizardNavigationService.prototype, "movedToNextPage", {
        /**
         * An observable used internally to alert the wizard that forward navigation
         * has occurred. It is recommended that you use the Wizard.onMoveNext
         * (clrWizardOnNext) output instead of this one.
         *
         * @readonly
         * @type {Observable<boolean>}
         * @memberof WizardNavigationService
         */
        get: function () {
            return this._movedToNextPage.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardNavigationService.prototype, "wizardFinished", {
        /**
         * An observable used internally to alert the wizard that the nav service
         * has approved completion of the wizard.
         *
         * It is recommended that you use the Wizard.wizardFinished (clrWizardOnFinish)
         * output instead of this one.
         *
         * @readonly
         * @type {Observable<boolean>}
         * @memberof WizardNavigationService
         */
        get: function () {
            return this._wizardFinished.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This is a public function that can be used to programmatically advance
     * the user to the next page.
     *
     * When invoked, this method will move the wizard to the next page after
     * successful validation. Note that this method goes through all checks
     * and event emissions as if Wizard.next(false) had been called.
     *
     * In most cases, it makes more sense to use Wizard.next(false).
     *
     * @returns {void}
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.next = function () {
        if (this.currentPageIsLast) {
            this.checkAndCommitCurrentPage("finish");
            return;
        }
        this.checkAndCommitCurrentPage("next");
        if (!this.wizardHasAltNext) {
            this._movedToNextPage.next(true);
        }
    };
    /**
     * Bypasses checks and most event emissions to force hey page to navigate forward.
     *
     * Comparable to calling Wizard.next() or Wizard.forceNext().
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.forceNext = function () {
        var currentPage = this.currentPage;
        var nextPage = this.pageCollection.getNextPage(currentPage);
        // catch errant null or undefineds that creep in
        if (!nextPage) {
            throw new Error("The wizard has no next page to go to.");
        }
        if (!currentPage.completed) {
            // this is a state that alt next flows can get themselves in...
            this.pageCollection.commitPage(currentPage);
        }
        this.currentPage = nextPage;
    };
    /**
     * Accepts a button/action type as a parameter. Encapsulates all logic for
     * event emissions, state of the current page, and wizard and page level overrides.
     *
     * Avoid calling this function directly unless you really know what you're doing.
     *
     * @param {string} buttonType
     * @returns {void}
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.checkAndCommitCurrentPage = function (buttonType) {
        var currentPage = this.currentPage;
        var iAmTheLastPage;
        var isNext;
        var isDanger;
        var isDangerNext;
        var isDangerFinish;
        var isFinish;
        if (!currentPage.readyToComplete) {
            return;
        }
        iAmTheLastPage = this.currentPageIsLast;
        isNext = buttonType === "next";
        isDanger = buttonType === "danger";
        isDangerNext = isDanger && !iAmTheLastPage;
        isDangerFinish = isDanger && iAmTheLastPage;
        isFinish = buttonType === "finish" || isDangerFinish;
        if (isFinish && !iAmTheLastPage) {
            return;
        }
        currentPage.primaryButtonClicked.emit(buttonType);
        if (isFinish) {
            currentPage.finishButtonClicked.emit(currentPage);
        }
        else if (isDanger) {
            currentPage.dangerButtonClicked.emit();
        }
        else if (isNext) {
            currentPage.nextButtonClicked.emit();
        }
        if (currentPage.stopNext || currentPage.preventDefault) {
            currentPage.onCommit.emit(currentPage.id);
            return;
        }
        // order is very important with these emitters!
        if (isFinish || isDangerFinish) {
            // mark page as complete
            this.pageCollection.commitPage(currentPage);
            this._wizardFinished.next();
        }
        if (this.wizardHasAltNext) {
            this.pageCollection.commitPage(currentPage);
            if (isNext || isDangerNext) {
                this._movedToNextPage.next(true);
            }
            // jump out here, no matter what type we're looking at
            return;
        }
        if (isNext || isDangerNext) {
            this.forceNext();
        }
    };
    /**
     * This is a public function that can be used to programmatically conclude
     * the wizard.
     *
     * When invoked, this method will  initiate the work involved with finalizing
     * and finishing the wizard workflow. Note that this method goes through all
     * checks and event emissions as if Wizard.finish(false) had been called.
     *
     * In most cases, it makes more sense to use Wizard.finish(false).
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.finish = function () {
        this.checkAndCommitCurrentPage("finish");
    };
    Object.defineProperty(WizardNavigationService.prototype, "movedToPreviousPage", {
        /**
         * Notifies the wizard when backwards navigation has occurred via the
         * previous button.
         *
         * @readonly
         * @type {Observable<boolean>}
         * @memberof WizardNavigationService
         */
        get: function () {
            return this._movedToPreviousPage.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Programmatically moves the wizard to the page before the current page.
     *
     * In most instances, it makes more sense to call Wizard.previous()
     * which does the same thing.
     *
     * @returns {void}
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.previous = function () {
        var previousPage;
        if (this.currentPageIsFirst) {
            return;
        }
        previousPage = this.pageCollection.getPreviousPage(this.currentPage);
        if (!previousPage) {
            return;
        }
        this._movedToPreviousPage.next(true);
        if (this.forceForwardNavigation) {
            this.currentPage.completed = false;
        }
        this.currentPage = previousPage;
    };
    Object.defineProperty(WizardNavigationService.prototype, "notifyWizardCancel", {
        /**
         * Notifies the wizard that a user is trying to cancel it.
         *
         * @readonly
         * @type {Observable<any>}
         * @memberof WizardNavigationService
         */
        get: function () {
            return this._cancelWizard.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Allows a hook into the cancel workflow of the wizard from the nav service. Note that
     * this route goes through all checks and event emissions as if a cancel button had
     * been clicked.
     *
     * In most cases, users looking for a hook into the cancel routine are actually looking
     * for a way to close the wizard from their host component because they have prevented
     * the default cancel action.
     *
     * In this instance, it is recommended that you use Wizard.close() to avoid any event
     * emission loop resulting from an event handler calling back into routine that will
     * again evoke the events it handles.
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.cancel = function () {
        this._cancelWizard.next();
    };
    /**
     * Performs all required checks to determine if a user can navigate to a page. Checking at each
     * point if a page is navigable -- completed where the page immediately after the last completed
     * page.
     *
     * Takes two parameters. The first one must be either the WizardPage object or the ID of the
     * WizardPage object that you want to make the current page.
     *
     * The second parameter is optional and is a Boolean flag for "lazy completion". What this means
     * is the Wizard will mark all pages between the current page and the page you want to navigate
     * to as completed. This is useful for informational wizards that do not require user action,
     * allowing an easy means for users to jump ahead.
     *
     * To avoid checks on navigation, use WizardPage.makeCurrent() instead.
     *
     * @param {*} pageToGoToOrId
     * @param {boolean} [lazyComplete=false]
     * @returns
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.goTo = function (pageToGoToOrId, lazyComplete) {
        if (lazyComplete === void 0) { lazyComplete = false; }
        var pageToGoTo;
        var currentPage;
        var myPages;
        var pagesToCheck;
        var okayToMove = true;
        var goingForward;
        var currentPageIndex;
        var goToPageIndex;
        myPages = this.pageCollection;
        pageToGoTo = (typeof pageToGoToOrId === "string") ? myPages.getPageById(pageToGoToOrId) : pageToGoToOrId;
        currentPage = this.currentPage;
        // no point in going to the current page. you're there already!
        if (pageToGoTo === currentPage) {
            return;
        }
        currentPageIndex = myPages.getPageIndex(currentPage);
        goToPageIndex = myPages.getPageIndex(pageToGoTo);
        goingForward = (goToPageIndex > currentPageIndex);
        pagesToCheck = myPages.getPageRangeFromPages(this.currentPage, pageToGoTo);
        okayToMove = lazyComplete || this.canGoTo(pagesToCheck);
        if (!okayToMove) {
            return;
        }
        if (goingForward && lazyComplete) {
            pagesToCheck.forEach(function (page) {
                if (page !== pageToGoTo) {
                    page.completed = true;
                }
            });
        }
        else if (!goingForward && this.forceForwardNavigation) {
            pagesToCheck.forEach(function (page) {
                page.completed = false;
            });
        }
        this.currentPage = pageToGoTo;
    };
    /**
     * Accepts a range of WizardPage objects as a parameter. Performs the work of checking
     * those objects to determine if navigation can be accomplished.
     *
     * @param {WizardPage[]} pagesToCheck
     * @returns {boolean}
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.canGoTo = function (pagesToCheck) {
        var okayToMove = true;
        var myPages = this.pageCollection;
        // previous page can be important when moving because if it's completed it
        // allows us to move to the page even if it's incomplete...
        var previousPagePasses;
        if (!pagesToCheck || pagesToCheck.length < 1) {
            return false;
        }
        pagesToCheck.forEach(function (page) {
            var previousPage;
            if (!okayToMove) {
                return;
            }
            if (page.completed) {
                // default is true. just jump out instead of complicating it.
                return;
            }
            // so we know our page is not completed...
            previousPage = myPages.getPageIndex(page) > 0 ? myPages.getPreviousPage(page) : null;
            previousPagePasses = (previousPage === null) || (previousPage.completed === true);
            // we are false if not the current page AND previous page is not completed
            // (but must have a previous page)
            if (!page.current && !previousPagePasses) {
                okayToMove = false;
            }
            // falls through to true as default
        });
        return okayToMove;
    };
    /**
     * Looks through the collection of pages to find the first one that is incomplete
     * and makes that page the current/active page.
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.setLastEnabledPageCurrent = function () {
        var allPages = this.pageCollection.pagesAsArray;
        var lastCompletedPageIndex = null;
        allPages.forEach(function (page, index) {
            if (page.completed) {
                lastCompletedPageIndex = index;
            }
        });
        if (lastCompletedPageIndex === null) {
            // always is at least the first item...
            lastCompletedPageIndex = 0;
        }
        else if ((lastCompletedPageIndex + 1) < allPages.length) {
            lastCompletedPageIndex = lastCompletedPageIndex + 1;
        }
        this.currentPage = allPages[lastCompletedPageIndex];
    };
    /**
     * Finds the first page in the collection of pages and makes that page the
     * current/active page.
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.setFirstPageCurrent = function () {
        this.currentPage = this.pageCollection.pagesAsArray[0];
    };
    Object.defineProperty(WizardNavigationService.prototype, "wizardGhostPageState", {
        /**
         *
         * @ignore
         * @type {string}
         * @memberof WizardNavigationService
         */
        get: function () {
            return this._wizardGhostPageState;
        },
        /**
         *
         * @ignore
         *
         * @memberof WizardNavigationService
         */
        set: function (value) {
            if (this.hideWizardGhostPages) {
                this._wizardGhostPageState = __WEBPACK_IMPORTED_MODULE_4__modal_utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.NO_PAGES;
            }
            else {
                this._wizardGhostPageState = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardNavigationService.prototype, "hideWizardGhostPages", {
        /**
         *
         * @ignore
         * @type {boolean}
         * @memberof WizardNavigationService
         */
        get: function () {
            return this._hideWizardGhostPages;
        },
        /**
         *
         * @ignore
         *
         * @memberof WizardNavigationService
         */
        set: function (value) {
            this._hideWizardGhostPages = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the stepnav on the left side of the wizard when pages are dynamically
     * added or removed from the collection of pages.
     *
     * @memberof WizardNavigationService
     */
    WizardNavigationService.prototype.updateNavigation = function () {
        var toSetCurrent;
        var currentPageRemoved;
        this.pageCollection.updateCompletedStates();
        currentPageRemoved = this.pageCollection.pagesAsArray.indexOf(this.currentPage) < 0;
        toSetCurrent = this.pageCollection.findFirstIncompletePage();
        this.currentPage = toSetCurrent;
    };
    return WizardNavigationService;
}());

WizardNavigationService.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
WizardNavigationService.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__page_collection__["a" /* PageCollectionService */], },
    { type: __WEBPACK_IMPORTED_MODULE_3__button_hub__["a" /* ButtonHubService */], },
]; };
//# sourceMappingURL=wizard-navigation.js.map

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridCell; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_hideable_column_service__ = __webpack_require__(10);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var DatagridCell = (function () {
    function DatagridCell(hideableColumnService) {
        this.hideableColumnService = hideableColumnService;
    }
    Object.defineProperty(DatagridCell.prototype, "hidden", {
        /**
         * @property hidden
         *
         * @description
         * Property used to apply a css class to this cell that hides it when hidden = true.
         *
         * @type {boolean}
         */
        get: function () {
            var column = this.hideableColumnService.getColumnById(this.id);
            return (column) ? column.hidden : false;
        },
        enumerable: true,
        configurable: true
    });
    return DatagridCell;
}());

DatagridCell.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-cell",
                template: "\n        <ng-content></ng-content>\n    ",
                host: {
                    "[class.datagrid-cell]": "true",
                    "[class.datagrid-cell--hidden]": "hidden"
                }
            },] },
];
/** @nocollapse */
DatagridCell.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_hideable_column_service__["a" /* HideableColumnService */], },
]; };
//# sourceMappingURL=datagrid-cell.js.map

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridColumn; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__built_in_comparators_datagrid_property_comparator__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__built_in_filters_datagrid_property_string_filter__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_custom_filter__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sort__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_datagrid_filter_registrar__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_filters__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__built_in_filters_datagrid_string_filter_impl__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_drag_dispatcher__ = __webpack_require__(85);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */










var nbCount = 0;
var DatagridColumn = (function (_super) {
    __extends(DatagridColumn, _super);
    function DatagridColumn(_sort, filters, _dragDispatcher) {
        var _this = _super.call(this, filters) || this;
        _this._sort = _sort;
        _this._dragDispatcher = _dragDispatcher;
        // deprecated: to be removed - START
        /**
         * Indicates if the column is currently sorted
         *
         * @deprecated This will be removed soon, in favor of the sortOrder mechanism
         */
        _this._sorted = false;
        /**
         * @deprecated This will be removed soon, in favor of the sortOrder mechanism
         */
        _this.sortedChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        // deprecated: to be removed - END
        /**
         * Indicates how the column is currently sorted
         */
        _this._sortOrder = __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__["a" /* SortOrder */].Unsorted;
        _this.sortOrderChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * A custom filter for this column that can be provided in the projected content
         */
        _this.customFilter = false;
        _this.filterValueChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        _this._sortSubscription = _sort.change.subscribe(function (sort) {
            // We're only listening to make sure we emit an event when the column goes from sorted to unsorted
            if (_this.sortOrder !== __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__["a" /* SortOrder */].Unsorted && sort.comparator !== _this.sortBy) {
                _this._sortOrder = __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__["a" /* SortOrder */].Unsorted;
                _this.sortOrderChange.emit(_this._sortOrder);
            }
            // deprecated: to be removed - START
            if (_this.sorted && sort.comparator !== _this.sortBy) {
                _this._sorted = false;
                _this.sortedChange.emit(false);
            }
            // deprecated: to be removed - END
        });
        _this.columnId = "dg-col-" + nbCount.toString(); // Approximate a GUID
        nbCount++;
        return _this;
        // put index here
    }
    Object.defineProperty(DatagridColumn.prototype, "hidden", {
        /**
         * @property hidden
         *
         * @description
         * A property that allows the column to be hidden / shown with css
         * Note the default allows the DatagridColumn to have an *ngIf on it. (EHCAIWC - will occur if its not initialized)
         *
         * @default false
         *
         * @type boolean
         */
        get: function () {
            return !!this.hideable && this.hideable.hidden;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridColumn.prototype, "handleElRef", {
        set: function (value) {
            this._dragDispatcher.handleRef = value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(DatagridColumn.prototype, "handleTrackerElRef", {
        set: function (value) {
            this._dragDispatcher.handleTrackerRef = value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    DatagridColumn.prototype.ngOnDestroy = function () {
        this._sortSubscription.unsubscribe();
    };
    Object.defineProperty(DatagridColumn.prototype, "field", {
        get: function () {
            return this._field;
        },
        set: function (field) {
            if (typeof field === "string") {
                this._field = field;
                if (!this.customFilter) {
                    this.setFilter(new __WEBPACK_IMPORTED_MODULE_7__built_in_filters_datagrid_string_filter_impl__["a" /* DatagridStringFilterImpl */](new __WEBPACK_IMPORTED_MODULE_2__built_in_filters_datagrid_property_string_filter__["a" /* DatagridPropertyStringFilter */](field)));
                }
                if (!this.sortBy) {
                    this.sortBy = new __WEBPACK_IMPORTED_MODULE_1__built_in_comparators_datagrid_property_comparator__["a" /* DatagridPropertyComparator */](field);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridColumn.prototype, "sortable", {
        /**
         * Indicates if the column is sortable
         */
        get: function () {
            return !!this.sortBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridColumn.prototype, "sorted", {
        get: function () {
            return this._sorted;
        },
        /**
         * @deprecated This will be removed soon, in favor of the sortOrder mechanism
         */
        set: function (value) {
            if (!value && this.sorted) {
                this._sorted = false;
                this._sort.clear();
            }
            else if (value && !this.sorted) {
                this.sort();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridColumn.prototype, "sortOrder", {
        get: function () {
            return this._sortOrder;
        },
        set: function (value) {
            if (typeof value === "undefined") {
                return;
            }
            // only if the incoming order is different from the current one
            if (this._sortOrder === value) {
                return;
            }
            switch (value) {
                // the Unsorted case happens when the current state is either Asc or Desc
                default:
                case __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__["a" /* SortOrder */].Unsorted:
                    this._sort.clear();
                    break;
                case __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__["a" /* SortOrder */].Asc:
                    this.sort(false);
                    break;
                case __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__["a" /* SortOrder */].Desc:
                    this.sort(true);
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * Sorts the datagrid based on this column
     */
    DatagridColumn.prototype.sort = function (reverse) {
        if (!this.sortable) {
            return;
        }
        this._sort.toggle(this.sortBy, reverse);
        // setting the private variable to not retrigger the setter logic
        this._sortOrder = this._sort.reverse ? __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__["a" /* SortOrder */].Desc : __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__["a" /* SortOrder */].Asc;
        this.sortOrderChange.emit(this._sortOrder);
        // deprecated: to be removed - START
        this._sorted = true;
        this.sortedChange.emit(true);
        // deprecated: to be removed - END
    };
    Object.defineProperty(DatagridColumn.prototype, "asc", {
        /**
         * Indicates if the column is currently sorted in ascending order
         */
        get: function () {
            // deprecated: if condition to be removed - START
            if (typeof this.sortOrder === "undefined") {
                return this.sorted && !this._sort.reverse;
            }
            else {
                return this.sortOrder === __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__["a" /* SortOrder */].Asc;
            }
            // deprecated: if condition to be removed - END
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridColumn.prototype, "desc", {
        /**
         * Indicates if the column is currently sorted in descending order
         */
        get: function () {
            // deprecated: if condition to be removed - START
            if (typeof this.sortOrder === "undefined") {
                return this.sorted && this._sort.reverse;
            }
            else {
                return this.sortOrder === __WEBPACK_IMPORTED_MODULE_8__interfaces_sort_order__["a" /* SortOrder */].Desc;
            }
            // deprecated: if condition to be removed - END
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridColumn.prototype, "projectedFilter", {
        set: function (custom) {
            if (custom) {
                this.deleteFilter();
                this.customFilter = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridColumn.prototype, "filterValue", {
        get: function () {
            return this.filter.value;
        },
        set: function (newValue) {
            if (!this.filter) {
                return;
            }
            if (!newValue) {
                newValue = "";
            }
            if (newValue !== this.filter.value) {
                this.filter.value = newValue;
                this.filterValueChange.emit(newValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    return DatagridColumn;
}(__WEBPACK_IMPORTED_MODULE_5__utils_datagrid_filter_registrar__["a" /* DatagridFilterRegistrar */]));

DatagridColumn.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-column",
                template: "\n        <div class=\"datagrid-column-flex\">\n            <!-- I'm really not happy with that select since it's not very scalable -->\n            <ng-content select=\"clr-dg-filter, clr-dg-string-filter\"></ng-content>\n\n            <clr-dg-string-filter\n                    *ngIf=\"field && !customFilter\"\n                    [clrDgStringFilter]=\"registered\"\n                    [(clrFilterValue)]=\"filterValue\"></clr-dg-string-filter>\n\n            <ng-template #columnTitle><ng-content></ng-content></ng-template>\n            \n            <button class=\"datagrid-column-title\" *ngIf=\"sortable\" (click)=\"sort()\">\n               <ng-container *ngTemplateOutlet=\"columnTitle\"></ng-container>\n            </button>\n            \n            <span class=\"datagrid-column-title\" *ngIf=\"!sortable\">\n               <ng-container *ngTemplateOutlet=\"columnTitle\"></ng-container>\n            </span>\n            \n            <div class=\"datagrid-column-separator\">\n                <button #columnHandle class=\"datagrid-column-handle\" tabindex=\"-1\"></button>\n                <div #columnHandleTracker class=\"datagrid-column-handle-tracker\"></div>\n            </div>        \n        </div>\n    ",
                host: {
                    "[class.datagrid-column]": "true",
                    "[class.datagrid-column--hidden]": "hidden"
                }
            },] },
];
/** @nocollapse */
DatagridColumn.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_4__providers_sort__["a" /* Sort */], },
    { type: __WEBPACK_IMPORTED_MODULE_6__providers_filters__["a" /* FiltersProvider */], },
    { type: __WEBPACK_IMPORTED_MODULE_9__providers_drag_dispatcher__["a" /* DragDispatcher */], },
]; };
DatagridColumn.propDecorators = {
    'handleElRef': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"], args: ["columnHandle",] },],
    'handleTrackerElRef': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"], args: ["columnHandleTracker",] },],
    'field': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgField",] },],
    'sortBy': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgSortBy",] },],
    'sorted': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgSorted",] },],
    'sortedChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgSortedChange",] },],
    'sortOrder': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgSortOrder",] },],
    'sortOrderChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgSortOrderChange",] },],
    'asc': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"], args: ["class.asc",] },],
    'desc': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"], args: ["class.desc",] },],
    'projectedFilter': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChild"], args: [__WEBPACK_IMPORTED_MODULE_3__providers_custom_filter__["a" /* CustomFilter */],] },],
    'filterValue': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrFilterValue",] },],
    'filterValueChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrFilterValueChange",] },],
};
//# sourceMappingURL=datagrid-column.js.map

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RowExpand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var RowExpand = (function () {
    function RowExpand() {
        this.expandable = false;
        this.replace = false;
        this._loading = false;
        this._expanded = false;
        this._animate = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._expandChange = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    Object.defineProperty(RowExpand.prototype, "loading", {
        get: function () {
            return this._loading;
        },
        set: function (value) {
            value = !!value;
            if (value !== this._loading) {
                this._loading = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowExpand.prototype, "expanded", {
        get: function () {
            return this._expanded;
        },
        set: function (value) {
            value = !!value;
            if (value !== this._expanded) {
                this._expanded = value;
                this._animate.next();
                this._expandChange.next(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowExpand.prototype, "animate", {
        get: function () {
            return this._animate.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowExpand.prototype, "expandChange", {
        get: function () {
            return this._expandChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    RowExpand.prototype.startLoading = function () {
        this.loading = true;
    };
    RowExpand.prototype.doneLoading = function () {
        this.loading = false;
        this._animate.next();
    };
    return RowExpand;
}());

RowExpand.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
RowExpand.ctorParameters = function () { return []; };
//# sourceMappingURL=row-expand.js.map

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectionType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Selection; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__items__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__filters__ = __webpack_require__(6);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var nbSelection = 0;
var SelectionType;
(function (SelectionType) {
    SelectionType[SelectionType["None"] = 0] = "None";
    SelectionType[SelectionType["Single"] = 1] = "Single";
    SelectionType[SelectionType["Multi"] = 2] = "Multi";
})(SelectionType || (SelectionType = {}));
var Selection = (function () {
    function Selection(_items, _filters) {
        var _this = this;
        this._items = _items;
        this._filters = _filters;
        this._selectionType = SelectionType.None;
        /**
         * Ignore items changes in the same change detection cycle.
         */
        this.debounce = false;
        /**
         * The Observable that lets other classes subscribe to selection changes
         */
        this._change = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this.id = "clr-dg-selection" + (nbSelection++);
        this._filtersSub = this._filters.change.subscribe(function () {
            if (!_this._selectable) {
                return;
            }
            _this.clearSelection();
        });
        this._itemsSub = this._items.allChanges.subscribe(function (updatedItems) {
            if (!_this._selectable) {
                return;
            }
            var leftOver;
            if (_this._items.trackBy) {
                var trackBy_1 = _this._items.trackBy;
                var updatedTracked_1 = updatedItems.map(function (item, index) { return trackBy_1(index, item); });
                leftOver = _this.current.filter(function (selected, index) {
                    return updatedTracked_1.indexOf(trackBy_1(index, selected)) > -1;
                });
            }
            else {
                leftOver = _this.current.filter(function (selected) { return updatedItems.indexOf(selected) > -1; });
            }
            if (_this.current.length !== leftOver.length) {
                //TODO: Discussed this with Eudes and this is fine for now.
                //But we need to figure out a different pattern for the
                //child triggering the parent change detection problem.
                //Using setTimeout for now to fix this.
                setTimeout(function () {
                    _this.current = leftOver;
                }, 0);
            }
        });
    }
    Selection.prototype.clearSelection = function () {
        this.current.length = 0;
        this.emitChange();
    };
    Object.defineProperty(Selection.prototype, "selectionType", {
        get: function () {
            return this._selectionType;
        },
        set: function (value) {
            if (value === this.selectionType) {
                return;
            }
            this._selectionType = value;
            if (value === SelectionType.None) {
                delete this.current;
            }
            else {
                this.current = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "_selectable", {
        get: function () {
            return (this._selectionType === SelectionType.Multi) || (this._selectionType === SelectionType.Single);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Cleans up our subscriptions to other providers
     */
    Selection.prototype.destroy = function () {
        this._itemsSub.unsubscribe();
        this._filtersSub.unsubscribe();
    };
    Object.defineProperty(Selection.prototype, "currentSingle", {
        get: function () {
            return this._currentSingle;
        },
        set: function (value) {
            var _this = this;
            if (value === this._currentSingle) {
                return;
            }
            this._currentSingle = value;
            this.emitChange();
            // Ignore items changes in the same change detection cycle.
            this.debounce = true;
            setTimeout(function () { return _this.debounce = false; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "current", {
        get: function () {
            return this._current;
        },
        set: function (value) {
            var _this = this;
            this._current = value;
            this.emitChange();
            // Ignore items changes in the same change detection cycle.
            this.debounce = true;
            setTimeout(function () { return _this.debounce = false; });
        },
        enumerable: true,
        configurable: true
    });
    Selection.prototype.emitChange = function () {
        if (this._selectionType === SelectionType.Single) {
            this._change.next(this.currentSingle);
        }
        else if (this._selectionType === SelectionType.Multi) {
            this._change.next(this.current);
        }
    };
    Object.defineProperty(Selection.prototype, "change", {
        // We do not want to expose the Subject itself, but the Observable which is read-only
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * Checks if an item is currently selected
     */
    Selection.prototype.isSelected = function (item) {
        if (this._selectionType === SelectionType.Single) {
            return this.currentSingle === item;
        }
        else if (this._selectionType === SelectionType.Multi) {
            return this.current.indexOf(item) >= 0;
        }
        return false;
    };
    /**
     * Selects or deselects an item
     */
    Selection.prototype.setSelected = function (item, selected) {
        switch (this._selectionType) {
            case SelectionType.None:
                break;
            case SelectionType.Single:
                // in single selection, set currentSingle method should be used
                break;
            case SelectionType.Multi:
                var index = this.current.indexOf(item);
                if (index >= 0 && !selected) {
                    this.current.splice(index, 1);
                    this.emitChange();
                }
                else if (index < 0 && selected) {
                    this.current.push(item);
                    this.emitChange();
                }
                break;
            default:
                break;
        }
    };
    /**
     * Checks if all currently displayed items are selected
     */
    Selection.prototype.isAllSelected = function () {
        var _this = this;
        if ((this._selectionType !== SelectionType.Multi) || !this._items.displayed) {
            return false;
        }
        var displayedItems = this._items.displayed;
        var nbDisplayed = this._items.displayed.length;
        if (nbDisplayed < 1) {
            return false;
        }
        var temp = displayedItems.filter(function (item) { return _this.current.indexOf(item) > -1; });
        return temp.length === displayedItems.length;
    };
    /**
     * Selects or deselects all currently displayed items
     */
    Selection.prototype.toggleAll = function () {
        var _this = this;
        if (this._selectionType === SelectionType.None || this._selectionType === SelectionType.Single) {
            return;
        }
        /*
         * If everything is already selected, we clear.
         * If at least one row isn't selected, we select everything.
         */
        if (this.isAllSelected()) {
            this.current.length = 0;
        }
        else {
            this._items.displayed.forEach(function (item) {
                if (_this.current.indexOf(item) < 0) {
                    _this.current.push(item);
                }
            });
        }
        this.emitChange();
    };
    return Selection;
}());

Selection.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
Selection.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__items__["a" /* Items */], },
    { type: __WEBPACK_IMPORTED_MODULE_3__filters__["a" /* FiltersProvider */], },
]; };
//# sourceMappingURL=selection.js.map

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrAlertModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__popover_dropdown_dropdown_module__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__index__ = __webpack_require__(102);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





var ClrAlertModule = (function () {
    function ClrAlertModule() {
    }
    return ClrAlertModule;
}());

ClrAlertModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__["a" /* ClrIconModule */],
                    __WEBPACK_IMPORTED_MODULE_3__popover_dropdown_dropdown_module__["a" /* ClrDropdownModule */]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_4__index__["a" /* ALERT_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_4__index__["a" /* ALERT_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrAlertModule.ctorParameters = function () { return []; };
//# sourceMappingURL=alert.module.js.map

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrFormsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__checkbox_index__ = __webpack_require__(105);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var ClrFormsModule = (function () {
    function ClrFormsModule() {
    }
    return ClrFormsModule;
}());

ClrFormsModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"]],
                declarations: [__WEBPACK_IMPORTED_MODULE_2__checkbox_index__["a" /* CHECKBOX_DIRECTIVES */]],
                exports: [__WEBPACK_IMPORTED_MODULE_2__checkbox_index__["a" /* CHECKBOX_DIRECTIVES */]]
            },] },
];
/** @nocollapse */
ClrFormsModule.ctorParameters = function () { return []; };
//# sourceMappingURL=forms.module.js.map

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrResponsiveNavCodes; });
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrResponsiveNavCodes = (function () {
    function ClrResponsiveNavCodes() {
    }
    return ClrResponsiveNavCodes;
}());

ClrResponsiveNavCodes.NAV_LEVEL_1 = 1;
ClrResponsiveNavCodes.NAV_LEVEL_2 = 2;
ClrResponsiveNavCodes.NAV_CLOSE_ALL = "NAV_CLOSE_ALL";
ClrResponsiveNavCodes.NAV_OPEN = "NAV_OPEN";
ClrResponsiveNavCodes.NAV_CLOSE = "NAV_CLOSE";
ClrResponsiveNavCodes.NAV_TOGGLE = "NAV_TOGGLE";
ClrResponsiveNavCodes.NAV_CLASS_HAMBURGER_MENU = "open-hamburger-menu";
ClrResponsiveNavCodes.NAV_CLASS_OVERFLOW_MENU = "open-overflow-menu";
ClrResponsiveNavCodes.NAV_CLASS_TRIGGER_1 = "header-hamburger-trigger";
ClrResponsiveNavCodes.NAV_CLASS_TRIGGER_2 = "header-overflow-trigger";
ClrResponsiveNavCodes.NAV_CLASS_LEVEL_1 = "clr-nav-level-1";
ClrResponsiveNavCodes.NAV_CLASS_LEVEL_2 = "clr-nav-level-2";
//# sourceMappingURL=clrResponsiveNavCodes.js.map

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabContent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var TabContent = (function () {
    function TabContent() {
        this.active = false;
    }
    return TabContent;
}());

TabContent.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-tab-content",
                template: "\n      <!--\n        ~ Copyright (c) 2016 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n\n      <section>\n          <ng-content></ng-content>\n      </section>\n    ",
                host: {
                    "[id]": "id",
                    "role": "tabpanel",
                    "[attr.aria-hidden]": "!active",
                    "[attr.aria-labelledby]": "ariaLabelledBy",
                    "[attr.data-hidden]": "!active",
                    "[class.active]": "active"
                }
            },] },
];
/** @nocollapse */
TabContent.ctorParameters = function () { return []; };
TabContent.propDecorators = {
    'active': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTabContentActive",] },],
    'id': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTabContentId",] },],
};
//# sourceMappingURL=tab-content.js.map

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabLink; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tabs__ = __webpack_require__(27);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var TabLink = (function () {
    function TabLink(tabs) {
        this.tabs = tabs;
        this.active = false;
    }
    TabLink.prototype.onClick = function () {
        this.tabs.selectTab(this);
        return false; // so that browser doesn't navigate to the href of the anchor tag
    };
    return TabLink;
}());

TabLink.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-tab-link",
                template: "\n      <!--\n        ~ Copyright (c) 2016 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n\n      <button class=\"btn btn-link nav-link\" (click)=\"onClick()\" type=\"button\">\n          <ng-content></ng-content>\n      </button>\n    ",
                host: {
                    "[id]": "id",
                    "[attr.aria-selected]": "active",
                    "[attr.aria-controls]": "ariaControls",
                    "role": "presentation",
                    "[class.nav-item]": "true",
                    "[class.active]": "active"
                }
            },] },
];
/** @nocollapse */
TabLink.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__tabs__["a" /* Tabs */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_1__tabs__["a" /* Tabs */]; }),] },] },
]; };
TabLink.propDecorators = {
    'active': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTabLinkActive",] },],
    'id': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTabLinkId",] },],
};
//# sourceMappingURL=tab-link.js.map

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Tabs; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tab_link__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tab_content__ = __webpack_require__(25);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var nbTabsComponents = 0;
var Tabs = (function () {
    function Tabs() {
        this._currentTabIndex = -1;
        this.currentTabIndexChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.currentTabLinkChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.currentTabContentChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.id = "clr-tabs-" + (nbTabsComponents++);
    }
    Tabs.prototype.setUpLinksAndContents = function () {
        var _this = this;
        // first, iterate over tab links and contents and assign id's if it doesn't exist
        // also set the active tab index; future active tab index will override the earlier one if there are multiple
        this.tabLinks.forEach(function (tabLink, index) {
            if (!tabLink.id) {
                tabLink.id = _this.id + "-tab-" + index;
            }
            if (tabLink.active) {
                _this.currentTabLink = tabLink;
                _this.currentTabIndex = index;
            }
        });
        this.tabContents.forEach(function (tabContent, index) {
            if (!tabContent.id) {
                tabContent.id = _this.id + "-content-" + index;
            }
            if (tabContent.active) {
                _this.currentTabContent = tabContent;
            }
        });
        // second, iterate over tab links and contents to set the aria attributes
        this.tabLinks.forEach(function (tabLink, index) {
            if (index < _this.tabContents.length) {
                tabLink.ariaControls = _this.tabContents[index].id;
            }
        });
        this.tabContents.forEach(function (tabContent, index) {
            if (index < _this.tabLinks.length) {
                tabContent.ariaLabelledBy = _this.tabLinks[index].id;
            }
        });
        // third, set first one as active if there's no active tab link or tab content
        if (!this.currentTabLink && this.tabLinks.length > 0) {
            this.selectTab(this.tabLinks[0]);
        }
    };
    Tabs.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.setUpLinksAndContents();
        this.tabLinkChildren.changes.subscribe(function (children) {
            _this.setUpLinksAndContents();
        });
        this.tabContentChildren.changes.subscribe(function (children) {
            _this.setUpLinksAndContents();
        });
    };
    Tabs.prototype.overrideTabContentChildren = function (tabContentChildren) {
        this.tabContentChildren = tabContentChildren;
        this.setUpLinksAndContents();
    };
    Tabs.prototype.overrideTabLinkChildren = function (tabLinks) {
        this.tabLinkChildren = tabLinks;
        this.setUpLinksAndContents();
    };
    Object.defineProperty(Tabs.prototype, "tabLinks", {
        get: function () {
            return this.tabLinkChildren.toArray();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tabs.prototype, "tabContents", {
        get: function () {
            return this.tabContentChildren.toArray();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tabs.prototype, "currentTabContent", {
        get: function () {
            return this._currentTabContent;
        },
        set: function (tabContent) {
            this._currentTabContent = tabContent;
            this.currentTabContentChanged.emit(tabContent);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tabs.prototype, "currentTabIndex", {
        get: function () {
            return this._currentTabIndex;
        },
        set: function (index) {
            this._currentTabIndex = index;
            this.currentTabIndexChanged.emit(index);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tabs.prototype, "currentTabLink", {
        get: function () {
            return this._currentTabLink;
        },
        set: function (tabLink) {
            this._currentTabLink = tabLink;
            this.currentTabLinkChanged.emit(tabLink);
        },
        enumerable: true,
        configurable: true
    });
    Tabs.prototype.selectTab = function (tabLink) {
        // deactivate all tabs and contents
        this.tabLinks.forEach(function (tab) { return tab.active = false; });
        this.tabContents.forEach(function (tabContent) { return tabContent.active = false; });
        // activate the selected Tab
        var index = this.tabLinks.indexOf(tabLink);
        tabLink.active = true;
        this.currentTabLink = tabLink;
        this.currentTabIndex = index;
        // activate the matching content if it exists; if we have a tabLink with no associated content, it'll show blank
        var selectedTabContent = null;
        if (index < this.tabContents.length) {
            selectedTabContent = this.tabContents[index];
            this.currentTabContent = selectedTabContent;
            selectedTabContent.active = true;
        }
    };
    return Tabs;
}());

Tabs.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-tabs",
                template: "\n      <!--\n        ~ Copyright (c) 2016 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n\n      <ul class=\"nav\" role=\"tablist\">\n          <ng-content select=\"clr-tab-link\"></ng-content>\n      </ul>\n      <ng-content select=\"clr-tab-content\"></ng-content>\n    "
            },] },
];
/** @nocollapse */
Tabs.ctorParameters = function () { return []; };
Tabs.propDecorators = {
    'tabLinkChildren': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_1__tab_link__["a" /* TabLink */]; }),] },],
    'tabContentChildren': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_2__tab_content__["a" /* TabContent */]; }),] },],
    '_currentTabIndex': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTabsCurrentTabIndex",] },],
    '_currentTabLink': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTabsCurrentTabLink",] },],
    '_currentTabContent': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTabsCurrentTabContent",] },],
    'currentTabIndexChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrTabsCurrentTabIndexChanged",] },],
    'currentTabLinkChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrTabsCurrentTabLinkChanged",] },],
    'currentTabContentChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrTabsCurrentTabContentChanged",] },],
};
//# sourceMappingURL=tabs.js.map

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrModalModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__index__ = __webpack_require__(117);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var ClrModalModule = (function () {
    function ClrModalModule() {
    }
    return ClrModalModule;
}());

ClrModalModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__["a" /* ClrIconModule */]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_3__index__["a" /* MODAL_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_3__index__["a" /* MODAL_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrModalModule.ctorParameters = function () { return []; };
//# sourceMappingURL=modal.module.js.map

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrCommonPopoverModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__(175);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var ClrCommonPopoverModule = (function () {
    function ClrCommonPopoverModule() {
    }
    return ClrCommonPopoverModule;
}());

ClrCommonPopoverModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"]],
                declarations: [__WEBPACK_IMPORTED_MODULE_2__index__["a" /* POPOVER_DIRECTIVES */]],
                exports: [__WEBPACK_IMPORTED_MODULE_2__index__["a" /* POPOVER_DIRECTIVES */]]
            },] },
];
/** @nocollapse */
ClrCommonPopoverModule.ctorParameters = function () { return []; };
//# sourceMappingURL=popover.module.js.map

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Dropdown; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_popover__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__menu_positions__ = __webpack_require__(51);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



// TODO: the ng-content inside the ng-template should ideally just be
// <ng-content select="clr-dropdown-menu"></ng-content>. Remove .dropdown-menu in 1.0?
var Dropdown = (function () {
    function Dropdown(elementRef, parent) {
        this.elementRef = elementRef;
        this.parent = parent;
        this._open = false;
        this._openChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.isMenuClosable = true;
        this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].BOTTOM_LEFT; // default if menuPosition isn't set
        this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_TOP; // default if menuPosition isn't set
        this.popoverOptions = { allowMultipleOpen: true };
        this.anchor = elementRef.nativeElement;
    }
    Object.defineProperty(Dropdown.prototype, "isRootLevelDropdown", {
        get: function () {
            return this.parent === null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dropdown.prototype, "menuPosition", {
        get: function () {
            return this._menuPosition;
        },
        set: function (pos) {
            if (pos && (__WEBPACK_IMPORTED_MODULE_2__menu_positions__["a" /* menuPositions */].indexOf(pos) > -1)) {
                this._menuPosition = pos;
            }
            else {
                this._menuPosition = "bottom-left";
            }
            // set the popover values based on menu position
            switch (this._menuPosition) {
                case ("top-right"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].TOP_RIGHT;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_BOTTOM;
                    break;
                case ("top-left"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].TOP_LEFT;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_BOTTOM;
                    break;
                case ("bottom-right"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].BOTTOM_RIGHT;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_TOP;
                    break;
                case ("bottom-left"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].BOTTOM_LEFT;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_TOP;
                    break;
                case ("right-top"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_TOP;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_TOP;
                    break;
                case ("right-bottom"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_BOTTOM;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_BOTTOM;
                    break;
                case ("left-top"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_TOP;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_TOP;
                    break;
                case ("left-bottom"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_BOTTOM;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_BOTTOM;
                    break;
                default:
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].BOTTOM_LEFT;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_TOP;
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Dropdown.prototype.toggleDropdown = function () {
        this.open = !this.open;
    };
    Object.defineProperty(Dropdown.prototype, "open", {
        get: function () {
            return this._open;
        },
        set: function (val) {
            this._open = val;
            this._openChanged.emit(val);
        },
        enumerable: true,
        configurable: true
    });
    //called on mouse clicks anywhere in the DOM.
    //Checks to see if the mouseclick happened on the host or outside
    Dropdown.prototype.onMouseClick = function (target) {
        if (this._open) {
            var current = target; //Get the element in the DOM on which the mouse was clicked
            var dropdownHost = this.elementRef.nativeElement; //Get the current dropdown native HTML element
            //Start checking if current and dropdownHost are equal. If not traverse to the parentNode and check again.
            while (current) {
                if (current === dropdownHost) {
                    return;
                }
                current = current.parentNode;
            }
            this._open = false; //Remove .open from the dropdown
        }
    };
    return Dropdown;
}());

Dropdown.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dropdown",
                template: "\n        <ng-content select=\"[clrDropdownToggle]\"></ng-content>\n        <ng-template [(clrPopover)]=\"open\" [clrPopoverAnchor]=\"anchor\" [clrPopoverAnchorPoint]=\"anchorPoint\"\n                     [clrPopoverPopoverPoint]=\"popoverPoint\" [clrPopoverOptions]=\"popoverOptions\">\n            <ng-content select=\"[clr-dropdown-menu, .dropdown-menu]\"></ng-content>\n        </ng-template>\n    ",
                host: {
                    "[class.dropdown]": "true",
                    "[class.right-top]": "menuPosition == 'right-top'",
                    "[class.left-top]": "menuPosition == 'left-top'",
                    "[class.right-bottom]": "menuPosition == 'right-bottom'",
                    "[class.left-bottom]": "menuPosition == 'left-bottom'",
                    "[class.open]": "true" // always set to true; clrPopover will remove it from DOM when not open
                }
            },] },
];
/** @nocollapse */
Dropdown.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: Dropdown, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] },] },
]; };
Dropdown.propDecorators = {
    '_open': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDropdownMenuOpen",] },],
    '_openChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDropdownMenuOpenChange",] },],
    'isMenuClosable': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrCloseMenuOnItemClick",] },],
    'menuPosition': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrMenuPosition",] },],
    'onMouseClick': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"], args: ["document:click", ["$event.target"],] },],
};
//# sourceMappingURL=dropdown.js.map

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrDropdownModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_popover_module__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__icon_icon_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__index__ = __webpack_require__(123);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





var ClrDropdownModule = (function () {
    function ClrDropdownModule() {
    }
    return ClrDropdownModule;
}());

ClrDropdownModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__common_popover_module__["a" /* ClrCommonPopoverModule */],
                    __WEBPACK_IMPORTED_MODULE_3__icon_icon_module__["a" /* ClrIconModule */]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_4__index__["a" /* DROPDOWN_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_4__index__["a" /* DROPDOWN_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrDropdownModule.ctorParameters = function () { return []; };
//# sourceMappingURL=dropdown.module.js.map

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoadingListener; });
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This is an abstract class because we need it to still be a valid token for dependency injection after transpiling.
 * This does not mean you should extend it, simply implementing it is fine.
 */
var LoadingListener = (function () {
    function LoadingListener() {
    }
    return LoadingListener;
}());

//# sourceMappingURL=loading-listener.js.map

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrLoadingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__(129);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var ClrLoadingModule = (function () {
    function ClrLoadingModule() {
    }
    return ClrLoadingModule;
}());

ClrLoadingModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"]],
                declarations: [__WEBPACK_IMPORTED_MODULE_2__index__["a" /* LOADING_DIRECTIVES */]],
                exports: [__WEBPACK_IMPORTED_MODULE_2__index__["a" /* LOADING_DIRECTIVES */]]
            },] },
];
/** @nocollapse */
ClrLoadingModule.ctorParameters = function () { return []; };
//# sourceMappingURL=loading.module.js.map

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ButtonHubService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var ButtonHubService = (function () {
    function ButtonHubService() {
        this._previousBtnClicked = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._nextBtnClicked = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._dangerBtnClicked = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._cancelBtnClicked = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._finishBtnClicked = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._customBtnClicked = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    Object.defineProperty(ButtonHubService.prototype, "previousBtnClicked", {
        get: function () {
            return this._previousBtnClicked.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonHubService.prototype, "nextBtnClicked", {
        get: function () {
            return this._nextBtnClicked.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonHubService.prototype, "dangerBtnClicked", {
        get: function () {
            return this._dangerBtnClicked.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonHubService.prototype, "cancelBtnClicked", {
        get: function () {
            return this._cancelBtnClicked.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonHubService.prototype, "finishBtnClicked", {
        get: function () {
            return this._finishBtnClicked.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonHubService.prototype, "customBtnClicked", {
        get: function () {
            return this._customBtnClicked.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ButtonHubService.prototype.buttonClicked = function (buttonType) {
        if ("previous" === buttonType) {
            this._previousBtnClicked.next();
        }
        else if ("next" === buttonType) {
            this._nextBtnClicked.next();
        }
        else if ("finish" === buttonType) {
            this._finishBtnClicked.next();
        }
        else if ("danger" === buttonType) {
            this._dangerBtnClicked.next();
        }
        else if ("cancel" === buttonType) {
            this._cancelBtnClicked.next();
        }
        else {
            this._customBtnClicked.next(buttonType);
        }
    };
    return ButtonHubService;
}());

ButtonHubService.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
ButtonHubService.ctorParameters = function () { return []; };
//# sourceMappingURL=button-hub.js.map

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridPropertyComparator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__nested_property__ = __webpack_require__(74);

var DatagridPropertyComparator = (function () {
    function DatagridPropertyComparator(prop) {
        this.prop = prop;
        this.nestedProp = new __WEBPACK_IMPORTED_MODULE_0__nested_property__["a" /* NestedProperty */](prop);
    }
    DatagridPropertyComparator.prototype.compare = function (a, b) {
        var propA = this.nestedProp.getPropValue(a);
        var propB = this.nestedProp.getPropValue(b);
        if (typeof propA === "string") {
            propA = propA.toLowerCase();
        }
        if (typeof propB === "string") {
            propB = propB.toLowerCase();
        }
        if (typeof propA === "undefined" || propA === null) {
            if (typeof propB === "undefined" || propB === null) {
                return 0;
            }
            else {
                return 1;
            }
        }
        else {
            if (typeof propB === "undefined" || propB === null) {
                return -1;
            }
            else if (propA < propB) {
                return -1;
            }
            else if (propA > propB) {
                return 1;
            }
            else {
                return 0;
            }
        }
    };
    return DatagridPropertyComparator;
}());

//# sourceMappingURL=datagrid-property-comparator.js.map

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridPropertyStringFilter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__nested_property__ = __webpack_require__(74);

var DatagridPropertyStringFilter = (function () {
    function DatagridPropertyStringFilter(prop, exact) {
        if (exact === void 0) { exact = false; }
        this.prop = prop;
        this.exact = exact;
        this.nestedProp = new __WEBPACK_IMPORTED_MODULE_0__nested_property__["a" /* NestedProperty */](prop);
    }
    DatagridPropertyStringFilter.prototype.accepts = function (item, search) {
        var propValue = this.nestedProp.getPropValue(item);
        if (typeof propValue === "undefined") {
            return false;
        }
        else if (this.exact) {
            return ("" + propValue).toLowerCase() === search;
        }
        else {
            return ("" + propValue).toLowerCase().indexOf(search) >= 0;
        }
    };
    return DatagridPropertyStringFilter;
}());

//# sourceMappingURL=datagrid-property-string-filter.js.map

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridStringFilterImpl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__);

var DatagridStringFilterImpl = (function () {
    function DatagridStringFilterImpl(filterFn) {
        this.filterFn = filterFn;
        /**
         * The Observable required as part of the Filter interface
         */
        this._changes = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__["Subject"]();
        /**
         * Raw input value
         */
        this._rawValue = "";
        /**
         * Input value converted to lowercase
         */
        this._lowerCaseValue = "";
    }
    Object.defineProperty(DatagridStringFilterImpl.prototype, "changes", {
        // We do not want to expose the Subject itself, but the Observable which is read-only
        get: function () {
            return this._changes.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(DatagridStringFilterImpl.prototype, "value", {
        get: function () {
            return this._rawValue;
        },
        /**
         * Common setter for the input value
         */
        set: function (value) {
            if (!value) {
                value = "";
            }
            if (value !== this._rawValue) {
                this._rawValue = value;
                this._lowerCaseValue = value.toLowerCase().trim();
                this._changes.next(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridStringFilterImpl.prototype, "lowerCaseValue", {
        get: function () {
            return this._lowerCaseValue;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Indicates if the filter is currently active, meaning the input is not empty
     */
    DatagridStringFilterImpl.prototype.isActive = function () {
        return !!this.value;
    };
    /**
     * Tests if an item matches a search text
     */
    DatagridStringFilterImpl.prototype.accepts = function (item) {
        // We always test with the lowercase value of the input, to stay case insensitive
        return this.filterFn.accepts(item, this.lowerCaseValue);
    };
    ;
    return DatagridStringFilterImpl;
}());

//# sourceMappingURL=datagrid-string-filter-impl.js.map

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridActionOverflow; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__popover_common_popover__ = __webpack_require__(7);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var DatagridActionOverflow = (function () {
    function DatagridActionOverflow(elementRef) {
        this.elementRef = elementRef;
        this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__popover_common_popover__["a" /* Point */].RIGHT_CENTER;
        this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__popover_common_popover__["a" /* Point */].LEFT_CENTER;
        /**
         * Tracks whether the action overflow menu is open or not
         */
        this._open = false;
        this.openChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
    }
    Object.defineProperty(DatagridActionOverflow.prototype, "open", {
        get: function () {
            return this._open;
        },
        set: function (open) {
            var boolOpen = !!open;
            if (boolOpen !== this._open) {
                this._open = boolOpen;
                this.openChanged.emit(boolOpen);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Shows/hides the action overflow menu
     */
    DatagridActionOverflow.prototype.toggle = function () {
        this.open = !this.open;
    };
    //called on mouse clicks anywhere in the DOM.
    //Checks to see if the mouseclick happened on the host or outside
    DatagridActionOverflow.prototype.onMouseClick = function (target) {
        if (this._open) {
            var current = target; //Get the element in the DOM on which the mouse was clicked
            var actionMenuHost = this.elementRef.nativeElement; //Get the current actionMenu native HTML element
            if (target.className === "datagrid-action-overflow") {
                return; // if clicking on the action overflow container but not the content, return without closing
            }
            //Start checking if current and actionMenuHost are equal. If not traverse to the parentNode and check again.
            while (current) {
                if (current.className === "datagrid-action-overflow") {
                    break; // if user clicked on the overflow menu, hide it
                }
                if (current === actionMenuHost) {
                    return;
                }
                current = current.parentNode;
            }
            this._open = false; // Hide the overflow menu
        }
    };
    return DatagridActionOverflow;
}());

DatagridActionOverflow.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-action-overflow",
                template: "\n        <clr-icon #anchor shape=\"ellipsis-vertical\" class=\"datagrid-action-toggle\" (click)=\"toggle()\"></clr-icon>\n        <ng-template [(clrPopover)]=\"open\" [clrPopoverAnchor]=\"anchor\" [clrPopoverAnchorPoint]=\"anchorPoint\"\n             [clrPopoverPopoverPoint]=\"popoverPoint\">\n            <div #menu class=\"datagrid-action-overflow\">\n                <ng-content></ng-content>\n            </div>\n        </ng-template>\n    "
            },] },
];
/** @nocollapse */
DatagridActionOverflow.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
]; };
DatagridActionOverflow.propDecorators = {
    'open': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgActionOverflowOpen",] },],
    'openChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgActionOverflowOpenChange",] },],
    'onMouseClick': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"], args: ["document:click", ["$event.target"],] },],
};
//# sourceMappingURL=datagrid-action-overflow.js.map

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridFilter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_custom_filter__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_filters__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_datagrid_filter_registrar__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__ = __webpack_require__(7);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





/**
 * Custom filter that can be added in any column to override the default object property string filter.
 * The reason this is not just an input on DatagridColumn is because we need the filter's template to be projected,
 * since it can be anything (not just a text input).
 */
var DatagridFilter = (function (_super) {
    __extends(DatagridFilter, _super);
    function DatagridFilter(_filters) {
        var _this = _super.call(this, _filters) || this;
        _this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].RIGHT_BOTTOM;
        _this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].RIGHT_TOP;
        _this.popoverOptions = { allowMultipleOpen: true };
        /**
         * Tracks whether the filter dropdown is open or not
         */
        _this._open = false;
        _this.openChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        return _this;
    }
    Object.defineProperty(DatagridFilter.prototype, "open", {
        get: function () {
            return this._open;
        },
        set: function (open) {
            var boolOpen = !!open;
            if (boolOpen !== this._open) {
                this._open = boolOpen;
                this.openChanged.emit(boolOpen);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridFilter.prototype, "customFilter", {
        set: function (filter) {
            this.setFilter(filter);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(DatagridFilter.prototype, "active", {
        /**
         * Indicates if the filter is currently active
         */
        get: function () {
            return !!this.filter && this.filter.isActive();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Shows/hides the filter dropdown
     */
    DatagridFilter.prototype.toggle = function () {
        this.open = !this.open;
    };
    return DatagridFilter;
}(__WEBPACK_IMPORTED_MODULE_3__utils_datagrid_filter_registrar__["a" /* DatagridFilterRegistrar */]));

DatagridFilter.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-filter",
                // We register this component as a CustomFilter, for the parent column to detect it.
                providers: [{ provide: __WEBPACK_IMPORTED_MODULE_1__providers_custom_filter__["a" /* CustomFilter */], useExisting: DatagridFilter }],
                template: "\n        <button #anchor class=\"datagrid-filter-toggle\" (click)=\"toggle()\"\n           [class.datagrid-filter-open]=\"open\" [class.datagrid-filtered]=\"active\"></button>\n\n        <ng-template [(clrPopover)]=\"open\" [clrPopoverAnchor]=\"anchor\" [clrPopoverAnchorPoint]=\"anchorPoint\"\n             [clrPopoverPopoverPoint]=\"popoverPoint\" [clrPopoverOptions]=\"popoverOptions\">\n            <div class=\"datagrid-filter\">\n                <!-- FIXME: this whole filter part needs a final design before we can try to have a cleaner DOM -->\n                <div class=\"datagrid-filter-close-wrapper\">\n                    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"open = false\">\n                        <clr-icon aria-hidden=\"true\" shape=\"close\"></clr-icon>\n                    </button>\n                </div>\n    \n                <ng-content></ng-content>\n            </div>\n        </ng-template>\n    "
            },] },
];
/** @nocollapse */
DatagridFilter.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__providers_filters__["a" /* FiltersProvider */], },
]; };
DatagridFilter.propDecorators = {
    'open': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgFilterOpen",] },],
    'openChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgFilterOpenChange",] },],
    'customFilter': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgFilter",] },],
};
//# sourceMappingURL=datagrid-filter.js.map

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridIfExpanded; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_row_expand__ = __webpack_require__(20);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


/**
 * TODO: make this a reusable directive outside of Datagrid, like [clrLoading].
 */
var DatagridIfExpanded = (function () {
    function DatagridIfExpanded(template, container, expand) {
        var _this = this;
        this.template = template;
        this.container = container;
        this.expand = expand;
        expand.expandable = true;
        expand.expandChange.subscribe(function () { return _this.updateView(); });
    }
    DatagridIfExpanded.prototype.updateView = function () {
        if (this.expand.expanded) {
            // Should we pass a context? I don't see anything useful to pass right now,
            // but we can come back to it in the future as a solution for additional features.
            this.container.createEmbeddedView(this.template);
        }
        else {
            // We clear before the animation is over. Not ideal, but doing better would involve a much heavier
            // process for very little gain. Once Angular animations are dynamic enough, we should be able to
            // get the optimal behavior.
            this.container.clear();
        }
    };
    DatagridIfExpanded.prototype.ngOnInit = function () {
        this.updateView();
    };
    DatagridIfExpanded.prototype.ngOnDestroy = function () {
        this.expand.expandable = false;
    };
    return DatagridIfExpanded;
}());

DatagridIfExpanded.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrIfExpanded]"
            },] },
];
/** @nocollapse */
DatagridIfExpanded.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_row_expand__["a" /* RowExpand */], },
]; };
//# sourceMappingURL=datagrid-if-expanded.js.map

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridItems; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_items__ = __webpack_require__(11);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var DatagridItems = (function () {
    function DatagridItems(template, _differs, _items) {
        this.template = template;
        this._differs = _differs;
        this._items = _items;
        _items.smartenUp();
    }
    Object.defineProperty(DatagridItems.prototype, "rawItems", {
        set: function (items) {
            this._rawItems = items ? items : [];
        },
        enumerable: true,
        configurable: true
    });
    DatagridItems.prototype.ngOnChanges = function (changes) {
        if ("rawItems" in changes) {
            var currentItems = changes["rawItems"].currentValue;
            if (!this._differ && currentItems) {
                this._differ = this._differs.find(currentItems).create(this._items.trackBy);
            }
        }
    };
    Object.defineProperty(DatagridItems.prototype, "trackBy", {
        set: function (value) {
            this._items.trackBy = value;
        },
        enumerable: true,
        configurable: true
    });
    DatagridItems.prototype.ngDoCheck = function () {
        if (this._differ) {
            var changes = this._differ.diff(this._rawItems);
            if (changes) {
                // TODO: not very efficient right now,
                // but premature optimization is the root of all evil.
                this._items.all = this._rawItems;
            }
        }
    };
    return DatagridItems;
}());

DatagridItems.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrDgItems][clrDgItemsOf]",
            },] },
];
/** @nocollapse */
DatagridItems.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["IterableDiffers"], },
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_items__["a" /* Items */], },
]; };
DatagridItems.propDecorators = {
    'rawItems': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgItemsOf",] },],
    'trackBy': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgItemsTrackBy",] },],
};
//# sourceMappingURL=datagrid-items.js.map

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridPlaceholder; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_items__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_page__ = __webpack_require__(12);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var DatagridPlaceholder = (function () {
    function DatagridPlaceholder(items, page) {
        this.items = items;
        this.page = page;
    }
    Object.defineProperty(DatagridPlaceholder.prototype, "emptyDatagrid", {
        /**
         * Tests if the datagrid is empty, meaning it doesn't contain any items
         */
        get: function () {
            return !this.items.loading && (!this.items.displayed || this.items.displayed.length === 0);
        },
        enumerable: true,
        configurable: true
    });
    return DatagridPlaceholder;
}());

DatagridPlaceholder.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-placeholder",
                template: "\n        <div\n            class=\"datagrid-placeholder\"\n            [class.datagrid-empty]=\"emptyDatagrid\">\n                <div class=\"datagrid-placeholder-image\" *ngIf=\"emptyDatagrid\"></div>\n                <ng-content *ngIf=\"emptyDatagrid\"></ng-content>\n        </div>\n    ",
                host: {
                    "[class.datagrid-placeholder-container]": "true"
                }
            },] },
];
/** @nocollapse */
DatagridPlaceholder.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_items__["a" /* Items */], },
    { type: __WEBPACK_IMPORTED_MODULE_2__providers_page__["a" /* Page */], },
]; };
//# sourceMappingURL=datagrid-placeholder.js.map

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridRow; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_selection__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_row_action_service__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global_expandable_rows__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_row_expand__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_loading_loading_listener__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_hideable_column_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__datagrid_cell__ = __webpack_require__(18);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */








var nbRow = 0;
var DatagridRow = (function () {
    function DatagridRow(selection, rowActionService, globalExpandable, expand, hideableColumnService) {
        this.selection = selection;
        this.rowActionService = rowActionService;
        this.globalExpandable = globalExpandable;
        this.expand = expand;
        this.hideableColumnService = hideableColumnService;
        /* reference to the enum so that template can access */
        this.SELECTION_TYPE = __WEBPACK_IMPORTED_MODULE_1__providers_selection__["a" /* SelectionType */];
        this._selected = false;
        this.selectedChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.expandedChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.id = "clr-dg-row" + (nbRow++);
    }
    Object.defineProperty(DatagridRow.prototype, "selected", {
        /**
         * Indicates if the row is selected
         */
        get: function () {
            if (this.selection.selectionType === __WEBPACK_IMPORTED_MODULE_1__providers_selection__["a" /* SelectionType */].None) {
                return this._selected;
            }
            else {
                return this.selection.isSelected(this.item);
            }
        },
        set: function (value) {
            if (this.selection.selectionType === __WEBPACK_IMPORTED_MODULE_1__providers_selection__["a" /* SelectionType */].None) {
                this._selected = value;
            }
            else {
                this.selection.setSelected(this.item, value);
            }
        },
        enumerable: true,
        configurable: true
    });
    DatagridRow.prototype.toggle = function (selected) {
        if (selected === void 0) { selected = !this.selected; }
        if (selected !== this.selected) {
            this.selected = selected;
            this.selectedChanged.emit(selected);
        }
    };
    Object.defineProperty(DatagridRow.prototype, "expanded", {
        get: function () {
            return this.expand.expanded;
        },
        set: function (value) {
            this.expand.expanded = value;
        },
        enumerable: true,
        configurable: true
    });
    DatagridRow.prototype.toggleExpand = function () {
        if (this.expand.expandable) {
            this.expanded = !this.expanded;
            this.expandedChange.emit(this.expanded);
        }
    };
    DatagridRow.prototype.ngAfterViewInit = function () {
        var _this = this;
        // Make sure things get started
        var columnsList = this.hideableColumnService.getColumns();
        this.updateCellsForColumns(columnsList);
        // Triggered when the Cells list changes per row-renderer
        this.dgCells.changes.subscribe(function (cellList) {
            var columnList = _this.hideableColumnService.getColumns();
            if (cellList.length === columnList.length) {
                _this.updateCellsForColumns(columnList);
            }
        });
        // Used to set things up the first time but only after all the columns are ready.
        this.subscription = this.hideableColumnService.columnListChange.subscribe(function (columnList) {
            // Prevents cell updates when cols and cells array are not aligned - only seems to run on init / first time.
            if (columnList.length === _this.dgCells.length) {
                _this.updateCellsForColumns(columnList);
            }
        });
    };
    /**********
     * @function updateCellsForColumns
     *
     * @description
     * 1. Maps the new columnListChange to the dgCells list by index
     * 2. Sets the hidden state on the cell
     * Take a Column list and use index to access the columns for hideable properties.
     *
     * @param columnList<DatagridColumn[]>
     */
    DatagridRow.prototype.updateCellsForColumns = function (columnList) {
        // Map cells to columns with Array.index
        this.dgCells
            .forEach(function (cell, index) {
            var currentColumn = columnList[index]; // Accounts for null space.
            if (currentColumn) {
                cell.id = currentColumn.id;
            }
        });
    };
    DatagridRow.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    return DatagridRow;
}());

DatagridRow.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-row",
                template: "\n        <clr-dg-row-master class=\"datagrid-row-flex\">\n            <clr-dg-cell *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n                         class=\"datagrid-select datagrid-fixed-column\">\n                <clr-checkbox [ngModel]=\"selected\" (ngModelChange)=\"toggle($event)\"></clr-checkbox>\n            </clr-dg-cell>\n            <clr-dg-cell *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n                         class=\"datagrid-select datagrid-fixed-column\">\n                <div class=\"radio\">\n                    <input type=\"radio\" [id]=\"id\" [name]=\"selection.id + '-radio'\" [value]=\"item\"\n                           [(ngModel)]=\"selection.currentSingle\">\n                    <label for=\"{{id}}\"></label>\n                </div>\n            </clr-dg-cell>\n            <clr-dg-cell *ngIf=\"rowActionService.hasActionableRow\"\n                         class=\"datagrid-row-actions datagrid-fixed-column\">\n                <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n            </clr-dg-cell>\n            <clr-dg-cell *ngIf=\"globalExpandable.hasExpandableRow\"\n                         class=\"datagrid-expandable-caret datagrid-fixed-column\">\n                <ng-container *ngIf=\"expand.expandable\">\n                    <button (click)=\"toggleExpand()\" *ngIf=\"!expand.loading\">\n                        <clr-icon shape=\"caret\" [attr.dir]=\"expand.expanded?'down':'right'\"></clr-icon>\n                    </button>\n                    <div class=\"spinner spinner-sm\" *ngIf=\"expand.loading\"></div>\n                </ng-container>\n            </clr-dg-cell>\n            <ng-content *ngIf=\"!expand.replace || !expand.expanded || expand.loading\"></ng-content>\n\n            <ng-template *ngIf=\"expand.replace && expand.expanded && !expand.loading\"\n                         [ngTemplateOutlet]=\"detail\"></ng-template>\n        </clr-dg-row-master>\n\n        <ng-template *ngIf=\"!expand.replace && expand.expanded && !expand.loading\"\n                     [ngTemplateOutlet]=\"detail\"></ng-template>\n\n        <!-- \n            We need the \"project into template\" hack because we need this in 2 different places\n            depending on whether the details replace the row or not.\n        -->\n        <ng-template #detail>\n            <ng-content select=\"clr-dg-row-detail\"></ng-content>\n        </ng-template>\n    ",
                host: {
                    "[class.datagrid-row]": "true",
                    "[class.datagrid-selected]": "selected"
                },
                providers: [__WEBPACK_IMPORTED_MODULE_4__providers_row_expand__["a" /* RowExpand */], { provide: __WEBPACK_IMPORTED_MODULE_5__utils_loading_loading_listener__["a" /* LoadingListener */], useExisting: __WEBPACK_IMPORTED_MODULE_4__providers_row_expand__["a" /* RowExpand */] }]
            },] },
];
/** @nocollapse */
DatagridRow.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_selection__["b" /* Selection */], },
    { type: __WEBPACK_IMPORTED_MODULE_2__providers_row_action_service__["a" /* RowActionService */], },
    { type: __WEBPACK_IMPORTED_MODULE_3__providers_global_expandable_rows__["a" /* GlobalExpandableRows */], },
    { type: __WEBPACK_IMPORTED_MODULE_4__providers_row_expand__["a" /* RowExpand */], },
    { type: __WEBPACK_IMPORTED_MODULE_6__providers_hideable_column_service__["a" /* HideableColumnService */], },
]; };
DatagridRow.propDecorators = {
    'item': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgItem",] },],
    'selected': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgSelected",] },],
    'selectedChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgSelectedChange",] },],
    'expanded': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgExpanded",] },],
    'expandedChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgExpandedChange",] },],
    'dgCells': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_7__datagrid_cell__["a" /* DatagridCell */],] },],
};
//# sourceMappingURL=datagrid-row.js.map

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomFilter; });
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var CustomFilter = (function () {
    function CustomFilter() {
    }
    return CustomFilter;
}());

//# sourceMappingURL=custom-filter.js.map

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RowActionService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var RowActionService = (function () {
    function RowActionService() {
        /**
         * false means no rows with action
         */
        this.hasActionableRow = false;
    }
    return RowActionService;
}());

RowActionService.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
RowActionService.ctorParameters = function () { return []; };
//# sourceMappingURL=row-action-service.js.map

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Sort; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var Sort = (function () {
    function Sort() {
        /**
         * Ascending order if false, descending if true
         */
        this._reverse = false;
        /**
         * The Observable that lets other classes subscribe to sort changes
         */
        this._change = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    Object.defineProperty(Sort.prototype, "comparator", {
        get: function () {
            return this._comparator;
        },
        set: function (value) {
            this._comparator = value;
            this.emitChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sort.prototype, "reverse", {
        get: function () {
            return this._reverse;
        },
        set: function (value) {
            this._reverse = value;
            this.emitChange();
        },
        enumerable: true,
        configurable: true
    });
    Sort.prototype.emitChange = function () {
        this._change.next(this);
    };
    Object.defineProperty(Sort.prototype, "change", {
        // We do not want to expose the Subject itself, but the Observable which is read-only
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * Sets a comparator as the current one, or toggles reverse if the comparator is already used. The
     * optional forceReverse input parameter allows to override that toggling behavior by sorting in
     * reverse order if `true`.
     *
     * @param {Comparator<any>} sortBy the comparator to use for sorting
     * @param {boolean} [forceReverse] `true` to force sorting descendingly
     *
     * @memberof Sort
     */
    Sort.prototype.toggle = function (sortBy, forceReverse) {
        // We modify private properties directly, to batch the change event
        if (this.comparator === sortBy) {
            this._reverse = typeof forceReverse !== "undefined"
                ? forceReverse || !this._reverse
                : !this._reverse;
        }
        else {
            this._comparator = sortBy;
            this._reverse = typeof forceReverse !== "undefined" ? forceReverse : false;
        }
        this.emitChange();
    };
    /**
     * Clears the current sorting order
     */
    Sort.prototype.clear = function () {
        this.comparator = null;
    };
    /**
     * Compares two objects according to the current comparator
     */
    Sort.prototype.compare = function (a, b) {
        return (this.reverse ? -1 : 1) * this.comparator.compare(a, b);
    };
    return Sort;
}());

Sort.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
Sort.ctorParameters = function () { return []; };
//# sourceMappingURL=sort.js.map

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return COMPUTE_WIDTH_CLASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return STRICT_WIDTH_CLASS; });
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */ var COMPUTE_WIDTH_CLASS = "datagrid-computing-columns-width";
var STRICT_WIDTH_CLASS = "datagrid-fixed-width";
//# sourceMappingURL=constants.js.map

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridFilterRegistrar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_filters__ = __webpack_require__(6);

var DatagridFilterRegistrar = (function () {
    function DatagridFilterRegistrar(filters) {
        this.filters = filters;
    }
    Object.defineProperty(DatagridFilterRegistrar.prototype, "filter", {
        get: function () {
            return this.registered && this.registered.filter;
        },
        enumerable: true,
        configurable: true
    });
    DatagridFilterRegistrar.prototype.setFilter = function (filter) {
        // If we previously had another filter, we unregister it
        this.deleteFilter();
        if (filter instanceof __WEBPACK_IMPORTED_MODULE_0__providers_filters__["b" /* RegisteredFilter */]) {
            this.registered = filter;
        }
        else if (filter) {
            this.registered = this.filters.add(filter);
        }
    };
    ;
    DatagridFilterRegistrar.prototype.deleteFilter = function () {
        if (this.registered) {
            this.registered.unregister();
            delete this.registered;
        }
    };
    DatagridFilterRegistrar.prototype.ngOnDestroy = function () {
        this.deleteFilter();
    };
    return DatagridFilterRegistrar;
}());

//# sourceMappingURL=datagrid-filter-registrar.js.map

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TreeNode; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__abstract_tree_selection__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_treeSelection_service__ = __webpack_require__(98);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var TreeNode = (function (_super) {
    __extends(TreeNode, _super);
    function TreeNode(parent, treeSelectionService) {
        var _this = _super.call(this, parent, treeSelectionService) || this;
        _this.treeSelectionService = treeSelectionService;
        _this.nodeSelectedChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](true);
        _this.expanded = false;
        _this.expandedChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](true);
        _this.isExpandable = false;
        _this.loading = false;
        /*Note: Experimental Feature. Might be removed*/
        _this.isCompact = false;
        return _this;
    }
    Object.defineProperty(TreeNode.prototype, "children", {
        /**
         * Generates the child TreeNodes array from the ContentChildren QueryList
         * @returns {TreeNode[]|Array}
         */
        get: function () {
            var _this = this;
            return this._children ? this._children.toArray().filter(function (child) { return _this !== child; }) : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "nodeSelected", {
        get: function () {
            return this.selected;
        },
        set: function (value) {
            if (this.selected !== value) {
                this.selected = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    TreeNode.prototype.selectedChanged = function () {
        this.nodeSelectedChange.emit(this.selected);
    };
    Object.defineProperty(TreeNode.prototype, "hasChildren", {
        /**
         * Returns true if a TreeNode contains child TreeNodes and false otherwise.
         * @returns {boolean}
         */
        get: function () {
            if (this.children && this.children.length > 0) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "caretDirection", {
        /**
         * Determines the caret direction based on the expanded/collapsed
         * state of the TreeNode.
         *
         * Returns "down" when collapsed and "right" when expanded
         * @returns {string|string}
         */
        get: function () {
            return (this.expanded) ? "down" : "right";
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clicking on the caret sign calls this method.
     * Toggles the expanded/collapsed state of the TreeNode
     */
    TreeNode.prototype.toggleExpand = function () {
        this.expanded = !this.expanded;
        this.expandedChange.emit(this.expanded);
    };
    Object.defineProperty(TreeNode.prototype, "selectable", {
        /**
         * Returns if the TreeNode is selectable or not
         * @returns {boolean}
         */
        get: function () {
            if (this.treeSelectionService) {
                return this.treeSelectionService.selectable;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return TreeNode;
}(__WEBPACK_IMPORTED_MODULE_2__abstract_tree_selection__["a" /* AbstractTreeSelection */]));

TreeNode.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-tree-node",
                template: "\n      <!--\n        ~ Copyright (c) 2016 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n      <button\n          class=\"clr-treenode-caret\"\n          (click)=\"toggleExpand()\"\n          *ngIf=\"(isExpandable || hasChildren) && (!loading)\">\n          <clr-icon\n              shape=\"caret\"\n              [attr.dir]=\"caretDirection\"></clr-icon>\n      </button>\n      <span class=\"clr-treenode-spinner spinner\" *ngIf=\"isExpandable && loading\">\n          Loading...\n      </span>\n      <clr-checkbox\n          *ngIf=\"selectable\"\n          [(ngModel)]=\"selected\"\n          [clrIndeterminate]=\"indeterminate\"></clr-checkbox>\n      <div class=\"clr-treenode-content\">\n          <ng-content></ng-content>\n      </div>\n      <!-- FIXME: remove this string concatenation when boolean states are supported -->\n      <div\n          class=\"clr-treenode-children\"\n          [@collapse]=\"''+!expanded\">\n          <ng-content select=\"clr-tree-node\"></ng-content>\n      </div>\n    ",
                animations: [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])("collapse", [
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])("true", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            "height": 0,
                            "overflow-y": "hidden"
                        })),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])("true => false", [
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])("0.2s ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                                "height": "*",
                                "overflow-y": "hidden"
                            }))
                        ]),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])("false => true", [
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                                "height": "*",
                                "overflow-y": "hidden"
                            }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])("0.2s ease-in-out")
                        ])
                    ])],
                host: { "[class.clr-tree--compact]": "isCompact" }
            },] },
];
/** @nocollapse */
TreeNode.ctorParameters = function () { return [
    { type: TreeNode, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"] },] },
    { type: __WEBPACK_IMPORTED_MODULE_3__providers_treeSelection_service__["a" /* TreeSelectionService */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"] },] },
]; };
TreeNode.propDecorators = {
    'model': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTreeModel",] },],
    '_children': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [TreeNode,] },],
    'nodeSelected': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTreeNodeSelected",] },],
    'nodeSelectedChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrTreeNodeSelectedChange",] },],
    'expanded': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTreeNodeExpanded",] },],
    'expandedChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrTreeNodeExpandedChange",] },],
    'isExpandable': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTreeNodeExpandable",] },],
    'loading': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTreeNodeLoading",] },],
    'isCompact': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTreeCompact",] },],
};
//# sourceMappingURL=tree-node.js.map

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GHOST_PAGE_ANIMATION; });
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */ var GHOST_PAGE_ANIMATION = {
    STATES: {
        NO_PAGES: "inactive",
        ALL_PAGES: "ready",
        NEXT_TO_LAST_PAGE: "penultimateGhost",
        LAST_PAGE: "lastGhost"
    },
    TRANSITIONS: {
        IN: "100ms ease-out",
        OUT: "100ms ease-in"
    }
};
//# sourceMappingURL=ghost-page-animations.js.map

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return menuPositions; });
var menuPositions = [
    "bottom-left",
    "bottom-right",
    "top-left",
    "top-right",
    "left-bottom",
    "left-top",
    "right-bottom",
    "right-top"
];
//# sourceMappingURL=menu-positions.js.map

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardPageDeprecated; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layout_tabs_tab_content__ = __webpack_require__(25);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var WizardPageDeprecated = (function (_super) {
    __extends(WizardPageDeprecated, _super);
    function WizardPageDeprecated() {
        var _this = _super.call(this) || this;
        _this.hasProjectedTitleContent = false;
        // User can bind his event handler for onCommit of the main content
        _this.onCommit = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        // User can bind his/her event handler for onLoad of the main content
        _this.onLoad = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        // input variable, optional, to set if this tab is skipped
        _this.isSkipped = false;
        // input variable, optional, to set if this tab is skipped
        _this.preventDefault = false;
        // Emitter for Next button state changes
        _this.nextDisabledChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        return _this;
    }
    WizardPageDeprecated.prototype.ngOnInit = function () {
        var projectedTitleHTML = this.titleContainer.nativeElement.innerHTML.trim();
        this.hasProjectedTitleContent = projectedTitleHTML.length > 0;
    };
    return WizardPageDeprecated;
}(__WEBPACK_IMPORTED_MODULE_1__layout_tabs_tab_content__["a" /* TabContent */]));

WizardPageDeprecated.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-wizard-page-deprecated",
                template: "\n      <!--\n        ~ Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n\n      <section>\n          <label #titleContainer class=\"text-light\">\n              {{title}}\n              <ng-content select=\".wizard-page-title\"></ng-content>\n          </label>\n\n          <div class=\"content-wrapper\">\n              <ng-content></ng-content>\n          </div>\n      </section>\n    ",
                host: {
                    "[id]": "id",
                    "[class.clr-nav-content]": "true",
                    "role": "tabpanel",
                    "[attr.aria-hidden]": "!active",
                    "[attr.aria-labelledby]": "ariaLabelledBy",
                    "[attr.data-hidden]": "!active",
                    "[class.active]": "active"
                }
            },] },
];
/** @nocollapse */
WizardPageDeprecated.ctorParameters = function () { return []; };
WizardPageDeprecated.propDecorators = {
    'titleContainer': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"], args: ["titleContainer",] },],
    'onCommit': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageOnCommit",] },],
    'onLoad': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageOnLoad",] },],
    'isSkipped': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPageIsSkipped",] },],
    'preventDefault': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPagePreventDefault",] },],
    'nextDisabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPageNextDisabled",] },],
    'errorFlag': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPageErrorFlag",] },],
    'nextDisabledChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageNextDisabledChanged",] },],
};
//# sourceMappingURL=wizard-page.js.map

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardStep; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layout_tabs_tab_link__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wizard__ = __webpack_require__(54);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var WizardStep = (function (_super) {
    __extends(WizardStep, _super);
    function WizardStep(wizard, elementRef) {
        var _this = _super.call(this, wizard) || this;
        _this.wizard = wizard;
        _this.elementRef = elementRef;
        // is the section completed
        _this.isCompleted = false;
        // input variable, optional, to set if this tab is skipped
        _this.isSkipped = false;
        return _this;
    }
    WizardStep.prototype.onClick = function () {
        // IE 10 fix to prevent click of disabled tab
        if (!this.active && this.isCompleted) {
            _super.prototype.onClick.call(this);
        }
        return false;
    };
    WizardStep.prototype.ngOnInit = function () {
        // The nav text will be the title of the main section.
        this.title = this.elementRef.nativeElement.innerText.trim();
    };
    return WizardStep;
}(__WEBPACK_IMPORTED_MODULE_1__layout_tabs_tab_link__["a" /* TabLink */]));

WizardStep.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-wizard-step",
                template: "\n      <!--\n        ~ Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n\n      <button class=\"btn btn-link nav-link\" (click)=\"onClick()\" type=\"button\">\n          <ng-content></ng-content>\n      </button>\n    ",
                host: {
                    "[id]": "id",
                    "[attr.aria-selected]": "active",
                    "[attr.aria-controls]": "ariaControls",
                    "role": "presentation",
                    "[class.clr-nav-link]": "true",
                    "[class.active]": "active",
                    "[class.disabled]": "!active && !isCompleted",
                    "[class.complete]": "isCompleted",
                    "[class.skipped]": "isSkipped"
                }
            },] },
];
/** @nocollapse */
WizardStep.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__wizard__["a" /* WizardDeprecated */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_2__wizard__["a" /* WizardDeprecated */]; }),] },] },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
]; };
WizardStep.propDecorators = {
    'isSkipped': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardStepIsSkipped",] },],
    'id': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardStepId",] },],
};
//# sourceMappingURL=wizard-step.js.map

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardDeprecated; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layout_tabs_tabs__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wizard_step__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__wizard_page__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_scrolling_scrolling_service__ = __webpack_require__(131);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var nbWizardComponents = 0;
var WizardDeprecated = (function (_super) {
    __extends(WizardDeprecated, _super);
    function WizardDeprecated(_scrollingService) {
        var _this = _super.call(this) || this;
        _this._scrollingService = _scrollingService;
        _this.size = "xl"; // xl is the default size
        // Variable that toggles open/close of the wizard component.
        _this._open = false;
        // Variable that toggles open/close of the wizard component.
        _this.closable = true;
        // EventEmitter which is emitted on open/close of the wizard.
        _this._openChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        // User can bind his event handler for onCancel of the main content
        _this.onCancel = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        // Flag to toggle between Next and Finish button
        _this.isLast = false;
        // Flag to hide/show back button
        _this.isFirst = true;
        // The current page
        _this.currentPage = null;
        _this.id = "clr-wizard-" + (nbWizardComponents++);
        return _this;
    }
    //Detect when _open is set to true and set no-scrolling to true
    WizardDeprecated.prototype.ngOnChanges = function (changes) {
        if (changes && changes.hasOwnProperty("_open")) {
            if (changes["_open"].currentValue) {
                this._scrollingService.stopScrolling();
            }
            else {
                this._scrollingService.resumeScrolling();
            }
        }
    };
    WizardDeprecated.prototype.ngAfterContentInit = function () {
        var _this = this;
        // set the tab content's title to match the tab link's title
        this.wizardPageChildren.forEach(function (wizardPage, index) {
            var children = _this.wizardStepChildren.toArray();
            if (children[index] && !wizardPage.hasProjectedTitleContent) {
                wizardPage.title = children[index].title;
            }
        });
        // override superclass' children to setup the proper linked relationship between
        // tabs and contents
        _super.prototype.overrideTabLinkChildren.call(this, this.wizardStepChildren);
        _super.prototype.overrideTabContentChildren.call(this, this.wizardPageChildren);
        // set first step of the wizard as active/current one
        if (this.tabLinks.length > 0) {
            this.selectTab(this.tabLinks[0]);
        }
    };
    Object.defineProperty(WizardDeprecated.prototype, "tabLinks", {
        // returns only tabLinks that are not skipped
        get: function () {
            return this.wizardStepChildren.filter(function (wizardStep) {
                return !wizardStep.isSkipped;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardDeprecated.prototype, "tabContents", {
        // returns only tabContents that are not skipped
        get: function () {
            return this.wizardPageChildren.filter(function (wizardPage) {
                return !wizardPage.isSkipped;
            });
        },
        enumerable: true,
        configurable: true
    });
    // open --
    //
    // This is a public function that can be used to programmatically open the
    // wizard.
    WizardDeprecated.prototype.open = function () {
        this._open = true;
        this._openChanged.emit(true);
    };
    // close --
    //
    // This is a public function that can be used to programmatically close the
    // wizard.
    WizardDeprecated.prototype.close = function () {
        this._open = false;
        this.onCancel.emit(null);
        this._openChanged.emit(false);
    };
    // _close --
    //
    // This is a private function that is called on the click of the close / cancel
    // button and emits the onCancel event of the active tab.
    WizardDeprecated.prototype._close = function (event) {
        this.close();
    };
    // _next --
    //
    // This is a private function that is called on the click of the next
    // button and emits the onCommit event of the active tab.
    WizardDeprecated.prototype._next = function (event) {
        var totalSteps = this.tabLinks.length - 1;
        var i = this.currentTabIndex;
        var page = this.tabContents[i];
        if (!page.nextDisabled) {
            page.onCommit.emit(null);
            if (!page.preventDefault) {
                // If no handler for finish button, then close wizard on click
                // of finish by default
                if (totalSteps === i) {
                    this.close();
                }
                else {
                    this.next();
                }
            }
        }
    };
    // next --
    //
    // When called, after successful validation, the wizard will move to the
    // next page.
    // This is a public function that can be used to programmatically advance
    // the user to the next page.
    WizardDeprecated.prototype.next = function () {
        var i = this.currentTabIndex;
        var totalSteps = this.tabLinks.length - 1;
        var page = this.tabContents[i];
        // Call the onCommit or the Validation function of that step, and if it
        // returns true, continue to the next step.
        if (i < totalSteps && !page.nextDisabled) {
            var wizardStep = this.tabLinks[i];
            var nextStep = this.tabLinks[i + 1];
            wizardStep.isCompleted = true;
            this.selectTab(nextStep);
        }
    };
    // prev --
    //
    // When called, the wizard will move to the prev page.
    // This is a public function that can be used to programmatically go back
    // to the previous step.
    WizardDeprecated.prototype.prev = function () {
        var i = this.currentTabIndex;
        if (i > 0) {
            var wizardStep = this.tabLinks[i];
            var prevStep = this.tabLinks[i - 1];
            wizardStep.isCompleted = false;
            prevStep.isCompleted = false;
            this.selectTab(prevStep);
        }
    };
    // selectTab --
    //
    // Base class function overridden to call the onLoad event emitter
    WizardDeprecated.prototype.selectTab = function (wizardNav) {
        _super.prototype.selectTab.call(this, wizardNav);
        var page = this.currentTabContent;
        this.currentPage = page;
        page.onLoad.emit(false);
        // Toggles next and finish button
        var totalSteps = this.tabLinks.length - 1;
        this.isLast = this.currentTabIndex === totalSteps;
        this.isFirst = this.currentTabIndex === 0;
    };
    // skipTab --
    //
    // Public function to skip a Tab given its uniqueId
    WizardDeprecated.prototype.skipTab = function (tabId) {
        this._setTabIsSkipped(tabId, true);
    };
    // unSkipTab --
    //
    // Public function to unSkip a tab given its uniqueId
    WizardDeprecated.prototype.unSkipTab = function (tabId) {
        this._setTabIsSkipped(tabId, false);
    };
    WizardDeprecated.prototype._setTabIsSkipped = function (tabId, isSkipped) {
        var _this = this;
        this.wizardStepChildren.forEach(function (wizardStep, index) {
            if (wizardStep.id === tabId) {
                wizardStep.isSkipped = isSkipped;
                // set the isSkipped property of the matching content if it exists
                if (index < _this.wizardPageChildren.length) {
                    var children = _this.wizardPageChildren.toArray();
                    children[index].isSkipped = isSkipped;
                }
            }
        });
    };
    return WizardDeprecated;
}(__WEBPACK_IMPORTED_MODULE_1__layout_tabs_tabs__["a" /* Tabs */]));

WizardDeprecated.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-wizard-deprecated",
                viewProviders: [__WEBPACK_IMPORTED_MODULE_4__utils_scrolling_scrolling_service__["a" /* ScrollingService */]],
                template: "\n      <!--\n        ~ Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n\n      <clr-modal\n            [clrModalOpen]=\"_open\"\n            [clrModalSize]=\"size\"\n            [clrModalClosable]=\"closable\"\n            [clrModalStaticBackdrop]=\"true\"\n            (clrModalOpenChange)=\"close()\">\n\n         <div class=\"modal-body\">\n            <div class=\"content-container\">\n               <main class=\"content-area\">\n                  <ng-content></ng-content>\n               </main>\n\n               <nav class=\"nav-panel sidenav\">\n                  <div class=\"text-light\">\n                     <ng-content select=\".wizard-title\"></ng-content>\n                  </div>\n\n                  <ol class=\"nav navList\" role=\"tablist\">\n                     <ng-content select=\"clr-wizard-step\"></ng-content>\n                  </ol>\n               </nav>\n            </div>\n         </div>\n\n         <div class=\"modal-footer\">\n            <button class=\"btn btn-link\" (click)=\"_close($event)\">Cancel</button>\n            <button class=\"btn btn-outline\"\n                  *ngIf=\"!isFirst\" (click)=\"prev($event)\">Back</button>\n            <button class=\"btn btn-primary\"\n                  [class.disabled]=\"currentPage?.nextDisabled\"\n                  (click)=\"_next($event)\">{{isLast? 'Finish' : 'Next'}}</button>\n         </div>\n\n      </clr-modal>\n    ",
                host: {
                    "[class.clr-wizard-old]": "true",
                    "[class.main-container]": "true",
                    "[class.wizard-md]": "size == 'md'",
                    "[class.wizard-lg]": "size == 'lg'",
                    "[class.wizard-lx]": "size == 'lx'"
                }
            },] },
];
/** @nocollapse */
WizardDeprecated.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_4__utils_scrolling_scrolling_service__["a" /* ScrollingService */], },
]; };
WizardDeprecated.propDecorators = {
    'wizardStepChildren': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_2__wizard_step__["a" /* WizardStep */],] },],
    'wizardPageChildren': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_3__wizard_page__["a" /* WizardPageDeprecated */],] },],
    'size': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardSize",] },],
    '_open': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardOpen",] },],
    'closable': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardClosable",] },],
    '_openChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardOpenChanged",] },],
    'onCancel': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardOnCancel",] },],
    '_close': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"], args: ["body:keyup.escape",] },],
};
//# sourceMappingURL=wizard.js.map

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardPageButtonsDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var WizardPageButtonsDirective = (function () {
    function WizardPageButtonsDirective(pageButtonsTemplateRef) {
        this.pageButtonsTemplateRef = pageButtonsTemplateRef;
    }
    return WizardPageButtonsDirective;
}());

WizardPageButtonsDirective.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrPageButtons]"
            },] },
];
/** @nocollapse */
WizardPageButtonsDirective.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], },
]; };
//# sourceMappingURL=page-buttons.js.map

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardPageHeaderActionsDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var WizardPageHeaderActionsDirective = (function () {
    function WizardPageHeaderActionsDirective(pageHeaderActionsTemplateRef) {
        this.pageHeaderActionsTemplateRef = pageHeaderActionsTemplateRef;
    }
    return WizardPageHeaderActionsDirective;
}());

WizardPageHeaderActionsDirective.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrPageHeaderActions]"
            },] },
];
/** @nocollapse */
WizardPageHeaderActionsDirective.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], },
]; };
//# sourceMappingURL=page-header-actions.js.map

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardPageNavTitleDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var WizardPageNavTitleDirective = (function () {
    function WizardPageNavTitleDirective(pageNavTitleTemplateRef) {
        this.pageNavTitleTemplateRef = pageNavTitleTemplateRef;
    }
    return WizardPageNavTitleDirective;
}());

WizardPageNavTitleDirective.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrPageNavTitle]"
            },] },
];
/** @nocollapse */
WizardPageNavTitleDirective.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], },
]; };
//# sourceMappingURL=page-navtitle.js.map

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardPageTitleDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var WizardPageTitleDirective = (function () {
    function WizardPageTitleDirective(pageTitleTemplateRef) {
        this.pageTitleTemplateRef = pageTitleTemplateRef;
    }
    return WizardPageTitleDirective;
}());

WizardPageTitleDirective.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrPageTitle]"
            },] },
];
/** @nocollapse */
WizardPageTitleDirective.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], },
]; };
//# sourceMappingURL=page-title.js.map

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardHeaderAction; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var wizardHeaderActionIndex = 0;
var WizardHeaderAction = (function () {
    function WizardHeaderAction() {
        // title is explanatory text added to the header action
        this.title = "";
        // If our host has an ID attribute, we use this instead of our index.
        this._id = (wizardHeaderActionIndex++).toString();
        this.disabled = false;
        this.headerActionClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
    }
    Object.defineProperty(WizardHeaderAction.prototype, "id", {
        get: function () {
            return "clr-wizard-header-action-" + this._id;
        },
        enumerable: true,
        configurable: true
    });
    WizardHeaderAction.prototype.click = function () {
        if (this.disabled) {
            return;
        }
        // passing the header action id allows users to have one method that
        // routes to many different actions based on the type of header action
        // clicked. this is further aided by users being able to specify ids
        // for their header actions.
        this.headerActionClicked.emit(this._id);
    };
    return WizardHeaderAction;
}());

WizardHeaderAction.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-wizard-header-action",
                template: "\n        <button class=\"btn clr-wizard-header-action btn-link\"\n            [id]=\"id\"\n            [class.disabled]=\"disabled\"\n            (click)=\"click()\"\n            [title]=\"title\">\n            <ng-content></ng-content>\n        </button>\n    ",
                host: {
                    "class": "clr-wizard-header-action-wrapper"
                }
            },] },
];
/** @nocollapse */
WizardHeaderAction.ctorParameters = function () { return []; };
WizardHeaderAction.propDecorators = {
    'title': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["title",] },],
    '_id': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["id",] },],
    'disabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardHeaderActionDisabled",] },],
    'headerActionClicked': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["actionClicked",] },],
};
//# sourceMappingURL=wizard-header-action.js.map

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_wizard_navigation__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_page_collection__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_button_hub__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__directives_page_title__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__directives_page_navtitle__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__directives_page_buttons__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__directives_page_header_actions__ = __webpack_require__(56);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */








var wizardPageIndex = 0;
/**
 * The WizardPage component is responsible for displaying the content of each step
 * in the wizard workflow.
 *
 * WizardPage component has hooks into the navigation service (WizardPage.navService),
 * page collection (WizardPage.pageCollection), and button service
 * (WizardPage.buttonService). These three providers are shared across the components
 * within each instance of a Wizard.
 *
 * @export
 * @class WizardPage
 * @implements {OnInit}
 */
var WizardPage = (function () {
    /**
     * Creates an instance of WizardPage.
     *
     * @param {WizardNavigationService} navService
     * @param {PageCollectionService} pageCollection
     * @param {ButtonHubService} buttonService
     *
     * @memberof WizardPage
     */
    function WizardPage(navService, pageCollection, buttonService) {
        this.navService = navService;
        this.pageCollection = pageCollection;
        this.buttonService = buttonService;
        /**
         * @private
         * @ignore
         * @memberof WizardPage
         */
        this._nextStepDisabled = false;
        /**
         * Emits when the value of WizardPage.nextStepDisabled changes.
         * Should emit the new value of nextStepDisabled.
         *
         * @type {EventEmitter <boolean>}
         * @memberof WizardPage
         */
        this.nextStepDisabledChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * @private
         * @ignore
         * @memberof WizardPage
         */
        this._previousStepDisabled = false;
        /**
         * Emits when the value of WizardPage.previousStepDisabled changes.
         * Should emit the new value of previousStepDisabled.
         *
         * @type {EventEmitter <boolean>}
         * @memberof WizardPage
         */
        this.previousStepDisabledChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * Overrides all actions from the page level, so you can use an alternate function for
         * validation or data-munging with a WizardPage.onCommit (clrWizardPageOnCommit output),
         * WizardPage.onCancel (clrWizardPageOnCancel output), or one
         * of the granular page-level button click event emitters.
         *
         * @type {boolean}
         * @memberof WizardPage
         */
        this.preventDefault = false;
        /**
         *
         * @ignore
         * @private
         *
         * @memberof WizardPage
         */
        this._stopCancel = false;
        /**
         *
         * @ignore
         * @type {EventEmitter <boolean>}
         * @memberof WizardPage
         */
        this.stopCancelChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         *
         *
         * @private
         * @ignore
         * @memberof WizardPage
         */
        this._stopNext = false;
        /**
         * An event emitter carried over from a legacy version of WizardPage.
         * Fires an event on WizardPage whenever the next or finish buttons
         * are clicked and the page is the current page of the Wizard.
         *
         * Note that this does not automatically emit an event when a custom
         * button is used in place of a next or finish button.
         *
         * @type {EventEmitter <string>}
         * @memberof WizardPage
         */
        this.onCommit = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        /**
         * Emits an event when WizardPage becomes the current page of the
         * Wizard.
         *
         * @type {EventEmitter <string>}
         * @memberof WizardPage
         */
        this.onLoad = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * Emits an event when the WizardPage invokes the cancel routine for the wizard.
         *
         * Can be used in conjunction with the WizardPage.stopCancel
         * (clrWizardPagePreventDefaultCancel) or WizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) inputs to implement custom cancel
         * functionality at the page level. This is useful if you would like to do
         * validation, save data, or warn users before cancelling the wizard.
         *
         * Note that this requires you to call Wizard.close() from the host component.
         * This constitues a full replacement of the cancel functionality.
         *
         * @type {EventEmitter <WizardPage>}
         * @memberof WizardPage
         */
        this.pageOnCancel = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * Emits an event when the finish button is clicked and the WizardPage is
         * the wizard's current page.
         *
         * Can be used in conjunction with the WizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) input to implement custom finish
         * functionality at the page level. This is useful if you would like to do
         * validation, save data, or warn users before allowing them to complete
         * the wizard.
         *
         * Note that this requires you to call Wizard.finish() or Wizard.forceFinish()
         * from the host component. This combination creates a full replacement of
         * the finish functionality.
         *
         * @type {EventEmitter <WizardPage>}
         * @memberof WizardPage
         */
        this.finishButtonClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * Emits an event when the previous button is clicked and the WizardPage is
         * the wizard's current page.
         *
         * Can be used in conjunction with the WizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) input to implement custom backwards
         * navigation at the page level. This is useful if you would like to do
         * validation, save data, or warn users before allowing them to go
         * backwards in the wizard.
         *
         * Note that this requires you to call Wizard.previous()
         * from the host component. This combination creates a full replacement of
         * the backwards navigation functionality.
         *
         * @type {EventEmitter <WizardPage>}
         * @memberof WizardPage
         */
        this.previousButtonClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * Emits an event when the next button is clicked and the WizardPage is
         * the wizard's current page.
         *
         * Can be used in conjunction with the WizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) input to implement custom forwards
         * navigation at the page level. This is useful if you would like to do
         * validation, save data, or warn users before allowing them to go
         * to the next page in the wizard.
         *
         * Note that this requires you to call Wizard.forceNext() or Wizard.next()
         * from the host component. This combination creates a full replacement of
         * the forward navigation functionality.
         *
         * @type {EventEmitter <WizardPage>}
         * @memberof WizardPage
         */
        this.nextButtonClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * Emits an event when a danger button is clicked and the WizardPage is
         * the wizard's current page. By default, a danger button will act as
         * either a "next" or "finish" button depending on if the WizardPage is the
         * last page or not.
         *
         * Can be used in conjunction with the WizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) input to implement custom forwards
         * or finish navigation at the page level when the danger button is clicked.
         * This is useful if you would like to do validation, save data, or warn
         * users before allowing them to go to the next page in the wizard or
         * finish the wizard.
         *
         * Note that this requires you to call Wizard.finish(), Wizard.forceFinish(),
         * Wizard.forceNext() or Wizard.next() from the host component. This
         * combination creates a full replacement of the forward navigation and
         * finish functionality.
         *
         * @type {EventEmitter <WizardPage>}
         * @memberof WizardPage
         */
        this.dangerButtonClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * Emits an event when a next, finish, or danger button is clicked and the
         * WizardPage is the wizard's current page.
         *
         * Can be used in conjunction with the WizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) input to implement custom forwards
         * or finish navigation at the page level, regardless of the type of
         * primary button.
         *
         * This is useful if you would like to do validation, save data, or warn
         * users before allowing them to go to the next page in the wizard or
         * finish the wizard.
         *
         * Note that this requires you to call Wizard.finish(), Wizard.forceFinish(),
         * Wizard.forceNext() or Wizard.next() from the host component. This
         * combination creates a full replacement of the forward navigation and
         * finish functionality.
         *
         * @type {EventEmitter <WizardPage>}
         * @memberof WizardPage
         */
        this.primaryButtonClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.customButtonClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * An input value that is used internally to generate the WizardPage ID as
         * well as the step nav item ID.
         *
         * Typed as any because it should be able to accept numbers as well as
         * strings. Passing an index for wizard whose pages are created with an
         * ngFor loop is a common use case.
         *
         * @type {*}
         * @memberof WizardPage
         */
        this._id = (wizardPageIndex++).toString();
        /**
         *
         * @ignore
         * @private
         * @type {boolean}
         * @memberof WizardPage
         */
        this._complete = false;
    }
    Object.defineProperty(WizardPage.prototype, "nextStepDisabled", {
        /**
         * A getter that tells whether or not the wizard should be allowed
         * to move to the next page.
         *
         * Useful for in-page validation because it prevents forward navigation
         * and visibly disables the next button.
         *
         * Does not require that you re-implement navigation routines like you
         * would if you were using WizardPage.preventDefault or
         * Wizard.preventDefault.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardPage
         */
        get: function () {
            return this._nextStepDisabled;
        },
        /**
         * Sets whether the page should allow forward navigation.
         *
         * @memberof WizardPage
         */
        set: function (val) {
            var valBool = !!val;
            if (valBool !== this._nextStepDisabled) {
                this._nextStepDisabled = valBool;
                this.nextStepDisabledChange.emit(valBool);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "previousStepDisabled", {
        /**
         * A getter that tells whether or not the wizard should be allowed
         * to move to the previous page.
         *
         * Useful for in-page validation because it prevents backward navigation
         * and visibly disables the previous button.
         *
         * Does not require that you re-implement navigation routines like you
         * would if you were using WizardPage.preventDefault or
         * Wizard.preventDefault.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardPage
         */
        get: function () {
            return this._previousStepDisabled;
        },
        /**
         * Sets whether the page should allow backward navigation.
         *
         * @memberof WizardPage
         */
        set: function (val) {
            var valBool = !!val;
            if (valBool !== this._previousStepDisabled) {
                this._previousStepDisabled = valBool;
                this.previousStepDisabledChange.emit(valBool);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "stopCancel", {
        /**
         * A getter that retrieves whether the page is preventing the cancel action.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardPage
         */
        get: function () {
            return this._stopCancel;
        },
        /**
         * Overrides the cancel action from the page level. Allows you to use an
         * alternate function for validation or data-munging before cancelling the
         * wizard when combined with the WizardPage.onCancel
         * (the clrWizardPageOnCancel output).
         *
         * Requires that you manually close the wizard from your host component,
         * usually with a call to Wizard.forceNext() or wizard.next();
         *
         * @memberof WizardPage
         */
        set: function (val) {
            var valBool = !!val;
            if (valBool !== this._stopCancel) {
                this._stopCancel = valBool;
                this.stopCancelChange.emit(valBool);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "stopNext", {
        /**
         * A getter that tells you whether the page is preventing the next action.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardPage
         */
        get: function () {
            return this._stopNext;
        },
        /**
         * Overrides forward navigation from the page level. Allows you to use an
         * alternate function for validation or data-munging before moving the
         * wizard to the next pagewhen combined with the WizardPage.onCommit
         * (clrWizardPageOnCommit) or WizardPage.nextButtonClicked
         * (clrWizardPageNext) outputs.
         *
         * Requires that you manually tell the wizard to navigate forward from
         * the hostComponent, usually with a call to Wizard.forceNext() or
         * wizard.next();
         *
         * @memberof WizardPage
         */
        set: function (val) {
            var valBool = !!val;
            if (valBool !== this._stopNext) {
                this._stopNext = valBool;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "id", {
        /**
         * A read-only getter that generates an ID string for the wizard page from
         * either the value passed to the WizardPage "id" input or a wizard page
         * counter shared across all wizard pages in the application.
         *
         * Note that the value passed into the ID input Will be prefixed with
         * "clr-wizard-page-".
         *
         * @readonly
         *
         * @memberof WizardPage
         */
        get: function () {
            // covers things like null, undefined, false, and empty string
            // while allowing zero to pass
            var idIsNonZeroFalsy = (!this._id && this._id !== 0);
            // in addition to non-zero falsy we also want to make sure _id is not a negative
            // number.
            if (idIsNonZeroFalsy || this._id < 0) {
                // guard here in the event that input becomes undefined or null by accident
                this._id = (wizardPageIndex++).toString();
            }
            return "clr-wizard-page-" + this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "readyToComplete", {
        /**
         * A read-only getter that serves as a convenience for those who would rather
         * not think in the terms of !WizardPage.nextStepDisabled. For some use cases,
         * WizardPage.readyToComplete is more logical and declarative.
         *
         * @readonly
         *
         * @memberof WizardPage
         */
        get: function () {
            return !this.nextStepDisabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "completed", {
        /**
         * A page is marked as completed if it is both readyToComplete and completed,
         * as in the next or finish action has been executed while this page was current.
         *
         * Note there is and open question about how to handle pages that are marked
         * complete but who are no longer readyToComplete. This might indicate an error
         * state for the WizardPage. Currently, the wizard does not acknowledge this state
         * and only returns that the page is incomplete.
         *
         * @type {boolean}
         * @memberof WizardPage
         */
        get: function () {
            return this._complete && this.readyToComplete;
            // FOR V2: UNWIND COMPLETED, READYTOCOMPLETE, AND ERRORS
            // SUCH THAT ERRORS IS ITS OWN INPUT. IF A STEP IS
            // INCOMPLETE AND ERRORED, ERRORED WILL NOT SHOW.
            // FIRST QUESTION: AM I GREY OR COLORED?
            // SECOND QUESTION: AM I GREEN OR RED?
        },
        /**
         * A WizardPage can be manually set to completed using this boolean setter.
         * It is recommended that users rely on the convenience functions in the wizard
         * and navigation service instead of manually setting pages’ completion state.
         *
         * @memberof WizardPage
         */
        set: function (value) {
            this._complete = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "current", {
        /**
         * Checks with the navigation service to see if it is the current page.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardPage
         */
        get: function () {
            return this.navService.currentPage === this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "disabled", {
        get: function () {
            return !this.enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "enabled", {
        /**
         * A read-only getter that returns whether or not the page is navigable
         * in the wizard. A wizard page can be navigated to if it is completed
         * or the page before it is completed.
         *
         * This getter handles the logic for enabling or disabling the links in
         * the step nav on the left Side of the wizard.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardPage
         */
        get: function () {
            return this.current || this.completed || this.previousCompleted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "previousCompleted", {
        /**
         * A read-only getter that returns whether or not the page before this
         * WizardPage is completed. This is useful for determining whether or not
         * a page is navigable if it is not current or already completed.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardPage
         */
        get: function () {
            var previousPage = this.pageCollection.getPreviousPage(this);
            if (!previousPage) {
                return true;
            }
            return previousPage.completed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "title", {
        /**
         *
         * @ignore
         * @readonly
         * @type {TemplateRef < any >}
         * @memberof WizardPage
         */
        get: function () {
            return this.pageTitle.pageTitleTemplateRef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "navTitle", {
        /**
         *
         * @ignore
         * @readonly
         * @type {TemplateRef < any >}
         * @memberof WizardPage
         */
        get: function () {
            if (this.pageNavTitle) {
                return this.pageNavTitle.pageNavTitleTemplateRef;
            }
            return this.pageTitle.pageTitleTemplateRef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "headerActions", {
        /**
         *
         * @ignore
         * @readonly
         * @type {TemplateRef < any >}
         * @memberof WizardPage
         */
        get: function () {
            if (!this._headerActions) {
                return;
            }
            return this._headerActions.pageHeaderActionsTemplateRef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "hasHeaderActions", {
        /**
         *
         * @ignore
         * @readonly
         * @type {TemplateRef < any >}
         * @memberof WizardPage
         */
        get: function () {
            return !!this._headerActions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "buttons", {
        /**
         *
         * @ignore
         * @readonly
         * @type {TemplateRef < any >}
         * @memberof WizardPage
         */
        get: function () {
            if (!this._buttons) {
                return;
            }
            return this._buttons.pageButtonsTemplateRef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardPage.prototype, "hasButtons", {
        /**
         * A read-only getter that returns a boolean that says whether or
         * not the WizardPage includes buttons. Used to determine if the
         * Wizard should override the default button set defined as
         * its direct children.
         *
         * @readonly
         * @type {boolean}
         * @memberof WizardPage
         */
        get: function () {
            return !!this._buttons;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Uses the nav service to make the WizardPage the current page in the
     * wizard. Bypasses all checks but still emits the WizardPage.onLoad
     * (clrWizardPageOnLoad) output.
     *
     * In most cases, it is better to use the default navigation functions
     * in Wizard.
     *
     * @memberof WizardPage
     */
    WizardPage.prototype.makeCurrent = function () {
        this.navService.currentPage = this;
    };
    /**
     * Links the nav service and establishes the current page if one is not defined.
     *
     * @memberof WizardPage
     */
    WizardPage.prototype.ngOnInit = function () {
        var navService = this.navService;
        if (!navService.currentPage && !navService.navServiceLoaded) {
            this.makeCurrent();
            this.navService.navServiceLoaded = true;
        }
    };
    Object.defineProperty(WizardPage.prototype, "stepItemId", {
        /**
         * A read-only getter that returns the id used by the step nav item associated with the page.
         *
         * WizardPage needs this ID string for aria information.
         *
         * @readonly
         * @type {string}
         * @memberof WizardPage
         */
        get: function () {
            return this.pageCollection.getStepItemIdForPage(this);
        },
        enumerable: true,
        configurable: true
    });
    return WizardPage;
}());

WizardPage.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-wizard-page",
                template: "<ng-content></ng-content>",
                host: {
                    "[id]": "id",
                    "role": "tabpanel",
                    "[attr.aria-hidden]": "!current",
                    "[attr.aria-labelledby]": "stepItemId",
                    "[class.active]": "current",
                    "[class.clr-wizard-page]": "true"
                }
            },] },
];
/** @nocollapse */
WizardPage.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_wizard_navigation__["a" /* WizardNavigationService */], },
    { type: __WEBPACK_IMPORTED_MODULE_2__providers_page_collection__["a" /* PageCollectionService */], },
    { type: __WEBPACK_IMPORTED_MODULE_3__providers_button_hub__["a" /* ButtonHubService */], },
]; };
WizardPage.propDecorators = {
    'pageTitle': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChild"], args: [__WEBPACK_IMPORTED_MODULE_4__directives_page_title__["a" /* WizardPageTitleDirective */],] },],
    'pageNavTitle': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChild"], args: [__WEBPACK_IMPORTED_MODULE_5__directives_page_navtitle__["a" /* WizardPageNavTitleDirective */],] },],
    '_buttons': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChild"], args: [__WEBPACK_IMPORTED_MODULE_6__directives_page_buttons__["a" /* WizardPageButtonsDirective */],] },],
    '_headerActions': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChild"], args: [__WEBPACK_IMPORTED_MODULE_7__directives_page_header_actions__["a" /* WizardPageHeaderActionsDirective */],] },],
    'nextStepDisabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPageNextDisabled",] },],
    'nextStepDisabledChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageNextDisabledChange",] },],
    'previousStepDisabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPagePreviousDisabled",] },],
    'previousStepDisabledChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPagePreviousDisabledChange",] },],
    'preventDefault': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPagePreventDefault",] },],
    'stopCancel': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPagePreventDefaultCancel",] },],
    'stopCancelChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPagePreventDefaultCancelChange",] },],
    'stopNext': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPagePreventDefaultNext",] },],
    'onCommit': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageOnCommit",] },],
    'onLoad': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageOnLoad",] },],
    'pageOnCancel': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageOnCancel",] },],
    'finishButtonClicked': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageFinish",] },],
    'previousButtonClicked': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPagePrevious",] },],
    'nextButtonClicked': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageNext",] },],
    'dangerButtonClicked': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageDanger",] },],
    'primaryButtonClicked': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPagePrimary",] },],
    'customButtonClicked': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardPageCustomButton",] },],
    '_id': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["id",] },],
};
//# sourceMappingURL=wizard-page.js.map

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(38);

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrButtonGroupModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__popover_common_popover_module__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__index__ = __webpack_require__(64);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





var ClrButtonGroupModule = (function () {
    function ClrButtonGroupModule() {
    }
    return ClrButtonGroupModule;
}());

ClrButtonGroupModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__["a" /* ClrIconModule */],
                    __WEBPACK_IMPORTED_MODULE_3__popover_common_popover_module__["a" /* ClrCommonPopoverModule */]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_4__index__["a" /* BUTTON_GROUP_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_4__index__["a" /* BUTTON_GROUP_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrButtonGroupModule.ctorParameters = function () { return []; };
//# sourceMappingURL=button-group.module.js.map

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Button; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_buttonInGroup_service__ = __webpack_require__(68);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var Button = (function () {
    function Button(buttonInGroupService) {
        this.buttonInGroupService = buttonInGroupService;
        this._enableService = false;
        this._inMenu = false;
        this._classNames = "btn";
        this._click = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
    }
    Object.defineProperty(Button.prototype, "inMenu", {
        get: function () {
            return this._inMenu;
        },
        set: function (value) {
            value = !!value;
            if (this._inMenu !== value) {
                this._inMenu = value;
                //We check if the service flag is enabled
                //and if the service exists because the service is optional
                if (this._enableService && this.buttonInGroupService) {
                    this.buttonInGroupService.updateButtonGroup(this);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "classNames", {
        get: function () {
            return this._classNames;
        },
        set: function (value) {
            if (value) {
                this._classNames = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Button.prototype.emitClick = function () {
        this._click.emit(true);
    };
    Button.prototype.ngAfterViewInit = function () {
        this._enableService = true;
    };
    return Button;
}());

Button.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-button",
                template: "\n        <ng-template #buttonProjectedRef>\n            <button [class]=\"classNames\" (click)=\"emitClick()\">\n                <ng-content></ng-content>\n            </button>\n        </ng-template>\n    "
            },] },
];
/** @nocollapse */
Button.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_buttonInGroup_service__["a" /* ButtonInGroupService */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] },] },
]; };
Button.propDecorators = {
    'templateRef': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"], args: ["buttonProjectedRef",] },],
    'inMenu': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrInMenu",] },],
    'classNames': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["class",] },],
    '_click': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["click",] },],
};
//# sourceMappingURL=button.js.map

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BUTTON_GROUP_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__button__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__button_group__ = __webpack_require__(158);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var BUTTON_GROUP_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__button__["a" /* Button */], __WEBPACK_IMPORTED_MODULE_1__button_group__["a" /* ButtonGroup */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LOADING_BUTTON_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loading_button__ = __webpack_require__(159);

var LOADING_BUTTON_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__loading_button__["a" /* LoadingButton */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrLoadingButtonModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_loading_loading_module__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__index__ = __webpack_require__(65);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var ClrLoadingButtonModule = (function () {
    function ClrLoadingButtonModule() {
    }
    return ClrLoadingButtonModule;
}());

ClrLoadingButtonModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__utils_loading_loading_module__["a" /* ClrLoadingModule */]
                ],
                declarations: [__WEBPACK_IMPORTED_MODULE_3__index__["a" /* LOADING_BUTTON_DIRECTIVES */]],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_3__index__["a" /* LOADING_BUTTON_DIRECTIVES */],
                    __WEBPACK_IMPORTED_MODULE_2__utils_loading_loading_module__["a" /* ClrLoadingModule */]
                ]
            },] },
];
/** @nocollapse */
ClrLoadingButtonModule.ctorParameters = function () { return []; };
//# sourceMappingURL=loading-button.module.js.map

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrButtonModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__button_loading_loading_button_module__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__button_group_button_group_module__ = __webpack_require__(62);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var ClrButtonModule = (function () {
    function ClrButtonModule() {
    }
    return ClrButtonModule;
}());

ClrButtonModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                exports: [
                    __WEBPACK_IMPORTED_MODULE_1__button_loading_loading_button_module__["a" /* ClrLoadingButtonModule */],
                    __WEBPACK_IMPORTED_MODULE_2__button_group_button_group_module__["a" /* ClrButtonGroupModule */],
                ]
            },] },
];
/** @nocollapse */
ClrButtonModule.ctorParameters = function () { return []; };
//# sourceMappingURL=button.module.js.map

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ButtonInGroupService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var ButtonInGroupService = (function () {
    function ButtonInGroupService() {
        this._changes = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__["Subject"]();
    }
    Object.defineProperty(ButtonInGroupService.prototype, "changes", {
        get: function () {
            return this._changes.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ButtonInGroupService.prototype.updateButtonGroup = function (button) {
        this._changes.next(button);
    };
    return ButtonInGroupService;
}());

ButtonInGroupService.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"] },
];
/** @nocollapse */
ButtonInGroupService.ctorParameters = function () { return []; };
//# sourceMappingURL=buttonInGroup.service.js.map

/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CODE_HIGHLIGHT_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__syntax_highlight_syntax_highlight__ = __webpack_require__(70);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__syntax_highlight_syntax_highlight__["a"]; });


var CODE_HIGHLIGHT_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__syntax_highlight_syntax_highlight__["a" /* CodeHighlight */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CodeHighlight; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var CodeHighlight = (function () {
    //Had to use renderer because I wanted to add to existing classes on the code block
    //Didn't want to override them completely
    function CodeHighlight(_el, renderer) {
        this._el = _el;
        this.renderer = renderer;
        this._highlight = "";
    }
    CodeHighlight.prototype.ngAfterContentInit = function () {
        this.redraw();
    };
    CodeHighlight.prototype.redraw = function () {
        if (this._el && this._el.nativeElement) {
            Prism.highlightElement(this._el.nativeElement);
        }
    };
    Object.defineProperty(CodeHighlight.prototype, "highlight", {
        get: function () {
            return this._highlight;
        },
        set: function (val) {
            if (val && val.trim() !== "") {
                this._highlight = val;
                this.renderer.setElementClass(this._el.nativeElement, this._highlight, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    return CodeHighlight;
}());

CodeHighlight.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "code[clr-code-highlight]"
            },] },
];
/** @nocollapse */
CodeHighlight.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
]; };
CodeHighlight.propDecorators = {
    'highlight': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clr-code-highlight",] },],
};
//# sourceMappingURL=syntax-highlight.js.map

/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrSyntaxHighlightModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__(69);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var ClrSyntaxHighlightModule = (function () {
    function ClrSyntaxHighlightModule() {
    }
    return ClrSyntaxHighlightModule;
}());

ClrSyntaxHighlightModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"]],
                declarations: [__WEBPACK_IMPORTED_MODULE_2__index__["a" /* CODE_HIGHLIGHT_DIRECTIVES */]],
                exports: [__WEBPACK_IMPORTED_MODULE_2__index__["a" /* CODE_HIGHLIGHT_DIRECTIVES */]]
            },] },
];
/** @nocollapse */
ClrSyntaxHighlightModule.ctorParameters = function () { return []; };
//# sourceMappingURL=syntax-highlight.module.js.map

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrDataModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__datagrid_datagrid_module__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stack_view_stack_view_module__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tree_view_tree_view_module__ = __webpack_require__(100);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var ClrDataModule = (function () {
    function ClrDataModule() {
    }
    return ClrDataModule;
}());

ClrDataModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                exports: [
                    __WEBPACK_IMPORTED_MODULE_1__datagrid_datagrid_module__["a" /* ClrDatagridModule */],
                    __WEBPACK_IMPORTED_MODULE_2__stack_view_stack_view_module__["a" /* ClrStackViewModule */],
                    __WEBPACK_IMPORTED_MODULE_3__tree_view_tree_view_module__["a" /* ClrTreeViewModule */]
                ]
            },] },
];
/** @nocollapse */
ClrDataModule.ctorParameters = function () { return []; };
//# sourceMappingURL=data.module.js.map

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridStringFilter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_custom_filter__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__datagrid_filter__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__datagrid_string_filter_impl__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_datagrid_filter_registrar__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_filters__ = __webpack_require__(6);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */






var DatagridStringFilter = (function (_super) {
    __extends(DatagridStringFilter, _super);
    function DatagridStringFilter(renderer, filters) {
        var _this = _super.call(this, filters) || this;
        _this.renderer = renderer;
        /**
         * Indicates if the filter dropdown is open
         */
        _this.open = false;
        _this.filterValueChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        return _this;
    }
    Object.defineProperty(DatagridStringFilter.prototype, "customStringFilter", {
        /**
         * Customizable filter logic based on a search text
         */
        set: function (value) {
            if (value instanceof __WEBPACK_IMPORTED_MODULE_5__providers_filters__["b" /* RegisteredFilter */]) {
                this.setFilter(value);
            }
            else {
                this.setFilter(new __WEBPACK_IMPORTED_MODULE_3__datagrid_string_filter_impl__["a" /* DatagridStringFilterImpl */](value));
            }
        },
        enumerable: true,
        configurable: true
    });
    DatagridStringFilter.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.filterContainer.openChanged.subscribe(function (open) {
            if (open) {
                // We need the timeout because at the time this executes, the input isn't
                // displayed yet.
                setTimeout(function () {
                    _this.renderer.invokeElementMethod(_this.input.nativeElement, "focus");
                });
            }
        });
    };
    Object.defineProperty(DatagridStringFilter.prototype, "value", {
        /**
         * Common setter for the input value
         */
        get: function () {
            return this.filter.value;
        },
        set: function (value) {
            if (!this.filter) {
                return;
            }
            if (!value) {
                value = "";
            }
            if (value !== this.filter.value) {
                this.filter.value = value;
                this.filterValueChange.emit(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    DatagridStringFilter.prototype.close = function () {
        this.open = false;
    };
    return DatagridStringFilter;
}(__WEBPACK_IMPORTED_MODULE_4__utils_datagrid_filter_registrar__["a" /* DatagridFilterRegistrar */]));

DatagridStringFilter.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-string-filter",
                providers: [{ provide: __WEBPACK_IMPORTED_MODULE_1__providers_custom_filter__["a" /* CustomFilter */], useExisting: DatagridStringFilter }],
                template: "\n        <clr-dg-filter [clrDgFilter]=\"registered\" [(clrDgFilterOpen)]=\"open\">\n            <!--\n                Even though this *ngIf looks useless because the filter container already has one,\n                it prevents NgControlStatus and other directives automatically added by Angular\n                on inputs with NgModel from freaking out because of their host binding changing\n                mid-change detection when the input is destroyed.\n            -->\n            <input #input type=\"text\" name=\"search\" [(ngModel)]=\"value\" *ngIf=\"open\"\n                (keyup.enter)=\"close()\" (keyup.escape)=\"close()\"/>\n        </clr-dg-filter>\n    "
            },] },
];
/** @nocollapse */
DatagridStringFilter.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
    { type: __WEBPACK_IMPORTED_MODULE_5__providers_filters__["a" /* FiltersProvider */], },
]; };
DatagridStringFilter.propDecorators = {
    'customStringFilter': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgStringFilter",] },],
    'input': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"], args: ["input",] },],
    'filterContainer': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"], args: [__WEBPACK_IMPORTED_MODULE_2__datagrid_filter__["a" /* DatagridFilter */],] },],
    'value': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrFilterValue",] },],
    'filterValueChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrFilterValueChange",] },],
};
//# sourceMappingURL=datagrid-string-filter.js.map

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NestedProperty; });
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Generic accessor for deep object properties
 * that can be specified as simple dot-separated strings.
 */
var NestedProperty = (function () {
    function NestedProperty(prop) {
        this.prop = prop;
        if (prop.indexOf(".") >= 0) {
            this.splitProp = prop.split(".");
        }
    }
    // Safe getter for a deep object property, will not throw an error but return
    // undefined if one of the intermediate properties is null or undefined.
    NestedProperty.prototype.getPropValue = function (item) {
        if (this.splitProp) {
            var value = item;
            for (var _i = 0, _a = this.splitProp; _i < _a.length; _i++) {
                var nestedProp = _a[_i];
                if (value == null || typeof value === "undefined" || typeof value[nestedProp] === "undefined") {
                    return undefined;
                }
                value = value[nestedProp];
            }
            return value;
        }
        else {
            return item[this.prop];
        }
    };
    return NestedProperty;
}());

//# sourceMappingURL=nested-property.js.map

/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridActionBar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var DatagridActionBar = (function () {
    function DatagridActionBar() {
    }
    return DatagridActionBar;
}());

DatagridActionBar.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-action-bar",
                template: "\n        <ng-content></ng-content>\n    ",
                host: {
                    "[class.datagrid-action-bar]": "true"
                }
            },] },
];
/** @nocollapse */
DatagridActionBar.ctorParameters = function () { return []; };
//# sourceMappingURL=datagrid-action-bar.js.map

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridColumnToggle; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_hideable_column_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__popover_common_popover__ = __webpack_require__(7);



var DatagridColumnToggle = (function () {
    function DatagridColumnToggle(hideableColumnService) {
        this.hideableColumnService = hideableColumnService;
        /***
         * Popover init
         * @type {Point}
         */
        this.anchorPoint = __WEBPACK_IMPORTED_MODULE_2__popover_common_popover__["a" /* Point */].TOP_LEFT;
        this.popoverPoint = __WEBPACK_IMPORTED_MODULE_2__popover_common_popover__["a" /* Point */].LEFT_BOTTOM;
        this.open = false;
        /****
         * DatagridHideableColumn init
         * @type {Array}
         */
        this.columns = [];
    }
    Object.defineProperty(DatagridColumnToggle.prototype, "allColumnsVisible", {
        // public lastColumnshowing: boolean = false;
        get: function () {
            return this._allColumnsVisible;
        },
        set: function (value) {
            this._allColumnsVisible = value;
        },
        enumerable: true,
        configurable: true
    });
    DatagridColumnToggle.prototype.ngOnInit = function () {
        var _this = this;
        this._hideableColumnChangeSubscription =
            this.hideableColumnService.columnListChange.subscribe(function (columnList) {
                // Reset the list of columns
                _this.columns.length = 0;
                _this.hideableColumnService.updateForLastVisibleColumn();
                _this.allColumnsVisible = _this.hideableColumnService.checkForAllColumnsVisible;
                // Add only the hidden columns to the toggler.
                columnList.forEach(function (col) {
                    if (col) {
                        _this.columns.push(col);
                    }
                });
            });
    };
    DatagridColumnToggle.prototype.ngOnDestroy = function () {
        // this._hideableColumnChangeSubscription.unsubscribe();
    };
    DatagridColumnToggle.prototype.selectAll = function () {
        this.hideableColumnService.showHiddenColumns();
        this.allColumnsVisible = this.hideableColumnService.checkForAllColumnsVisible;
    };
    DatagridColumnToggle.prototype.toggleColumn = function (event, column) {
        column.hidden = !event;
        this.allColumnsVisible = this.hideableColumnService.checkForAllColumnsVisible;
        this.hideableColumnService.updateForLastVisibleColumn();
    };
    DatagridColumnToggle.prototype.toggleUI = function () {
        this.open = !this.open;
    };
    return DatagridColumnToggle;
}());

DatagridColumnToggle.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-column-toggle",
                template: "\n        <button\n                #anchor\n                (click)=\"toggleUI()\"\n                class=\"btn btn-sm btn-link column-toggle--action\">\n            <clr-icon shape=\"view-columns\"></clr-icon>\n        </button>\n        <div class=\"column-switch\"\n             *clrPopover=\"open; anchor: anchor; anchorPoint: anchorPoint; popoverPoint: popoverPoint\">\n            <div class=\"switch-header\">\n                Show Columns\n                <button\n                        class=\"btn btn-sm btn-link\"\n                        (click)=\"toggleUI()\">\n                    <clr-icon\n                            shape=\"close\"></clr-icon>\n                </button>\n            </div>\n            <ul class=\"switch-content list-unstyled\">\n                <li *ngFor=\"let column of columns\">\n                    <clr-checkbox [clrChecked]=\"!column.hidden\"\n                                  [clrDisabled]=\"column.lastVisibleColumn\"\n                                  (clrCheckedChange)=\"toggleColumn($event, column)\">\n                        <ng-template [ngTemplateOutlet]=\"column.template\"></ng-template>\n                    </clr-checkbox>\n                </li>\n            </ul>\n            <div class=\"switch-footer\">\n                <div>\n                    <button\n                            class=\"btn btn-sm btn-link p6 text-uppercase\"\n                            [disabled]=\"allColumnsVisible\"\n                            (click)=\"selectAll()\">Select All\n                    </button>\n                </div>\n                <div class=\"action-right\">\n                    <button\n                            (click)=\"toggleUI()\"\n                            class=\"btn btn-primary\">\n                        Ok\n                    </button>\n                </div>\n            </div>\n        </div>\n    ",
                host: {
                    "[class.column-switch-wrapper]": "true",
                    "[class.column-switch-wrapper--active]": "open"
                }
            },] },
];
/** @nocollapse */
DatagridColumnToggle.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_hideable_column_service__["a" /* HideableColumnService */], },
]; };
//# sourceMappingURL=datagrid-column-toggle.js.map

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridFooter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_selection__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_hideable_column_service__ = __webpack_require__(10);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var DatagridFooter = (function () {
    function DatagridFooter(selection, hideableColumnService) {
        this.selection = selection;
        this.hideableColumnService = hideableColumnService;
        this.activeToggler = false; // When undefined/false we don't get views in the UI toggler component.
        // Causing a bunch of failing tests
        this.listChangeSubscription = [];
        /* reference to the enum so that template can access */
        this.SELECTION_TYPE = __WEBPACK_IMPORTED_MODULE_1__providers_selection__["a" /* SelectionType */];
    }
    DatagridFooter.prototype.ngOnInit = function () {
        var _this = this;
        this.listChangeSubscription.push(this.hideableColumnService.columnListChange.subscribe(function (change) {
            var hiddenColumns = change.filter(function (col) { return col; });
            if (hiddenColumns.length > 0) {
                _this.activeToggler = true;
            }
            else {
                _this.activeToggler = false;
            }
        }));
    };
    DatagridFooter.prototype.ngOnDestroy = function () {
        this.listChangeSubscription.forEach(function (sub) {
            sub.unsubscribe();
        });
    };
    return DatagridFooter;
}());

DatagridFooter.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-footer",
                template: "\n        <ng-container\n                *ngIf=\"(selection.selectionType === SELECTION_TYPE.Multi) && (selection.current.length > 0)\">\n            <clr-checkbox [clrDisabled]=\"true\" [clrChecked]=\"true\" class=\"datagrid-foot-select\">\n                {{selection.current.length}}\n            </clr-checkbox>\n        </ng-container>\n        <clr-dg-column-toggle *ngIf=\"activeToggler\"></clr-dg-column-toggle>\n        <div class=\"datagrid-foot-description\">\n            <ng-content></ng-content>\n        </div>\n        <ng-content select=\"clr-dg-pagination\"></ng-content>\n    ",
                host: {
                    "[class.datagrid-foot]": "true",
                }
            },] },
];
/** @nocollapse */
DatagridFooter.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_selection__["b" /* Selection */], },
    { type: __WEBPACK_IMPORTED_MODULE_2__providers_hideable_column_service__["a" /* HideableColumnService */], },
]; };
//# sourceMappingURL=datagrid-footer.js.map

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridHideableColumnDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__datagrid_hideable_column__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__datagrid_column__ = __webpack_require__(19);



/**
 * @class DatagridHideableColumnDirective
 *
 * @description
 * A structural directive meant to be used inside a clr-dg-column component.
 *
 * <clr-dg-column>
 *       <ng-container *clrDgHideableColumn="{ hidden: true }">
 *           User ID
 *       </ng-container>
 *   </clr-dg-column>
 *
 * It sets up state and properties so that columns can be manges for hide/show by a service and an internal
 * datagrid toggle component.
 *
 */
var DatagridHideableColumnDirective = (function () {
    /**
     * @description
     * Used the DatagridColumn to get and set an id for this HiddenColumn
     *
     * @param templateRef
     * @param viewContainerRef
     * @param hideableColumnService
     * @param dgColumn
     */
    function DatagridHideableColumnDirective(templateRef, viewContainerRef, dgColumn) {
        this.templateRef = templateRef;
        this.viewContainerRef = viewContainerRef;
        this.dgColumn = dgColumn;
        this.columnId = dgColumn.columnId;
    }
    Object.defineProperty(DatagridHideableColumnDirective.prototype, "clrDgHideableColumn", {
        /**
         * @function clrDgHideableColumn
         *
         * @description
         * Setter fn for the @Input with the same name as this structural directive.
         * It allows the user to pre-configure the column's hide/show state. { hidden: true }
         * It's more verbose but has more Clarity.
         *
         * @default false
         *
         * @type object
         *
         * @example
         * *clrDgHideableColumn
         * *clrDgHideableColumn={hidden: false}
         * *clrDgHideableColumn={hidden: true}
         *
         * @param value
         *
         */
        set: function (value) {
            this._hidden = (value && value.hidden) ? value.hidden : false;
            if (this.dgColumn.hideable) {
                this.dgColumn.hideable.hidden = (value && value.hidden) ? value.hidden : false;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @function ngAfterViewInit
     *
     * @description
     * Responsible for setting up the items needed for a HideableColum.
     *
     * Use the templateRef to create this view and store it in the column service.
     * Create instance of the utility class DatagridHideableColumn.
     */
    DatagridHideableColumnDirective.prototype.ngAfterViewInit = function () {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
        // Note this is on the parent instance of DatagridColumn.
        this.dgColumn.hideable = new __WEBPACK_IMPORTED_MODULE_1__datagrid_hideable_column__["a" /* DatagridHideableColumn */](this.templateRef, this.columnId, this._hidden);
    };
    return DatagridHideableColumnDirective;
}());

DatagridHideableColumnDirective.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrDgHideableColumn]"
            },] },
];
/** @nocollapse */
DatagridHideableColumnDirective.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_2__datagrid_column__["a" /* DatagridColumn */], },
]; };
DatagridHideableColumnDirective.propDecorators = {
    'clrDgHideableColumn': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgHideableColumn",] },],
};
//# sourceMappingURL=datagrid-hidable-column.directive.js.map

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridPagination; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_page__ = __webpack_require__(12);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var DatagridPagination = (function () {
    function DatagridPagination(page) {
        var _this = this;
        this.page = page;
        this.currentChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        /*
         * Default page size is 10.
         * The reason we set it in this constructor and not in the provider itself is because
         * we don't want pagination (page size 0) if this component isn't present in the datagrid.
         */
        page.size = 10;
        this._pageSubscription = page.change.subscribe(function (current) { return _this.currentChanged.emit(current); });
    }
    DatagridPagination.prototype.ngOnDestroy = function () {
        this._pageSubscription.unsubscribe();
    };
    Object.defineProperty(DatagridPagination.prototype, "pageSize", {
        /**
         * Page size
         */
        get: function () {
            return this.page.size;
        },
        set: function (size) {
            if (typeof size === "number") {
                this.page.size = size;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridPagination.prototype, "totalItems", {
        /**
         * Total items (needed to guess the last page)
         */
        get: function () {
            return this.page.totalItems;
        },
        set: function (total) {
            if (typeof total === "number") {
                this.page.totalItems = total;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridPagination.prototype, "lastPage", {
        /**
         * Last page
         */
        get: function () {
            return this.page.last;
        },
        set: function (last) {
            if (typeof last === "number") {
                this.page.last = last;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridPagination.prototype, "currentPage", {
        /**
         * Current page
         */
        get: function () {
            return this.page.current;
        },
        set: function (page) {
            if (typeof page === "number") {
                this.page.current = page;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Moves to the previous page if it exists
     */
    DatagridPagination.prototype.previous = function () {
        this.page.previous();
    };
    /**
     * Moves to the next page if it exists
     */
    DatagridPagination.prototype.next = function () {
        this.page.next();
    };
    Object.defineProperty(DatagridPagination.prototype, "firstItem", {
        /**
         * Index of the first item displayed on the current page, starting at 0
         */
        get: function () {
            return this.page.firstItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridPagination.prototype, "lastItem", {
        /**
         * Index of the last item displayed on the current page, starting at 0
         */
        get: function () {
            return this.page.lastItem;
        },
        enumerable: true,
        configurable: true
    });
    return DatagridPagination;
}());

DatagridPagination.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-pagination",
                template: "\n        <ul class=\"pagination\" *ngIf=\"page.last > 1\">\n            <li *ngIf=\"page.current > 1\">\n                <button class=\"pagination-previous\" (click)=\"page.previous()\"></button>\n            </li>\n            <li *ngIf=\"page.current > 2\">\n                <button (click)=\"page.current = 1\">1</button>\n            </li>\n            <li *ngIf=\"page.current > 3\">...</li>\n            <li *ngIf=\"page.current > 1\">\n                <button (click)=\"page.previous()\">{{page.current - 1}}</button>\n            </li>\n            <li class=\"pagination-current\">{{page.current}}</li>\n            <li *ngIf=\"page.current < page.last\">\n                <button (click)=\"page.next()\">{{page.current + 1}}</button>\n            </li>\n            <li *ngIf=\"page.current < page.last - 2\">...</li>\n            <li *ngIf=\"page.current < page.last - 1\">\n                <button (click)=\"page.current = page.last\">{{page.last}}</button>\n            </li>\n            <li *ngIf=\"page.current < page.last\">\n                <button class=\"pagination-next\" (click)=\"page.next()\"></button>\n            </li>\n        </ul>\n    ",
                // IE10 comes to pollute even our components declaration
                styles: [":host { display: block; }"]
            },] },
];
/** @nocollapse */
DatagridPagination.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_page__["a" /* Page */], },
]; };
DatagridPagination.propDecorators = {
    'pageSize': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgPageSize",] },],
    'totalItems': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgTotalItems",] },],
    'lastPage': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgLastPage",] },],
    'currentPage': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgPage",] },],
    'currentChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgPageChange",] },],
};
//# sourceMappingURL=datagrid-pagination.js.map

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridRowDetail; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_row_expand__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_selection__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_row_action_service__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__datagrid_cell__ = __webpack_require__(18);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





/**
 * Generic bland container serving various purposes for Datagrid.
 * For instance, it can help span a text over multiple rows in detail view.
 */
var DatagridRowDetail = (function () {
    function DatagridRowDetail(selection, rowActionService, expand) {
        this.selection = selection;
        this.rowActionService = rowActionService;
        this.expand = expand;
        /* reference to the enum so that template can access it */
        this.SELECTION_TYPE = __WEBPACK_IMPORTED_MODULE_2__providers_selection__["a" /* SelectionType */];
    }
    Object.defineProperty(DatagridRowDetail.prototype, "replace", {
        get: function () {
            return this.expand.replace;
        },
        set: function (value) {
            this.expand.replace = !!value;
        },
        enumerable: true,
        configurable: true
    });
    return DatagridRowDetail;
}());

DatagridRowDetail.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-row-detail",
                template: "\n        <ng-container *ngIf=\"!replace\">\n            <clr-dg-cell class=\"datagrid-fixed-column\"\n                *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi \n                    || selection.selectionType === SELECTION_TYPE.Single\"></clr-dg-cell>\n            <clr-dg-cell *ngIf=\"rowActionService.hasActionableRow\" class=\"datagrid-fixed-column\"></clr-dg-cell>\n            <clr-dg-cell class=\"datagrid-fixed-column\"></clr-dg-cell>\n        </ng-container>\n        <ng-content></ng-content>\n    ",
                host: {
                    "[class.datagrid-row-flex]": "true",
                    "[class.datagrid-row-detail]": "!replace",
                    "[class.datagrid-container]": "cells.length === 0",
                }
            },] },
];
/** @nocollapse */
DatagridRowDetail.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__providers_selection__["b" /* Selection */], },
    { type: __WEBPACK_IMPORTED_MODULE_3__providers_row_action_service__["a" /* RowActionService */], },
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_row_expand__["a" /* RowExpand */], },
]; };
DatagridRowDetail.propDecorators = {
    'cells': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_4__datagrid_cell__["a" /* DatagridCell */],] },],
    'replace': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgReplace",] },],
};
//# sourceMappingURL=datagrid-row-detail.js.map

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Datagrid; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__built_in_comparators_datagrid_property_comparator__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__built_in_filters_datagrid_property_string_filter__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__datagrid_items__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__datagrid_row__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__datagrid_placeholder__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__datagrid_if_expanded__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_filters__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_items__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_page__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_selection__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_sort__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__providers_row_action_service__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__providers_global_expandable_rows__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__render_render_organizer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__datagrid_action_overflow__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__built_in_filters_datagrid_string_filter_impl__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__providers_hideable_column_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__datagrid_column__ = __webpack_require__(19);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



















var Datagrid = (function () {
    function Datagrid(columnService, filters, organizer, page, sort, items, expandableRows, selection, rowActionService) {
        this.columnService = columnService;
        this.filters = filters;
        this.organizer = organizer;
        this.page = page;
        this.sort = sort;
        this.items = items;
        this.expandableRows = expandableRows;
        this.selection = selection;
        this.rowActionService = rowActionService;
        /* reference to the enum so that template can access */
        this.SELECTION_TYPE = __WEBPACK_IMPORTED_MODULE_10__providers_selection__["a" /* SelectionType */];
        /**
         * Output emitted whenever the data needs to be refreshed, based on user action or external ones
         */
        this.refresh = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.selectedChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.singleSelectedChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        /**
         * Subscriptions to all the services and queries changes
         */
        this._subscriptions = [];
    }
    Object.defineProperty(Datagrid.prototype, "loading", {
        /**
         * Freezes the datagrid while data is loading
         */
        get: function () {
            return this.items.loading;
        },
        set: function (value) {
            this.items.loading = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Emits a State output to ask for the data to be refreshed
     */
    Datagrid.prototype.triggerRefresh = function () {
        var state = {};
        if (this.page.size > 0) {
            state.page = {
                from: this.page.firstItem,
                to: this.page.lastItem,
                size: this.page.size
            };
        }
        if (this.sort.comparator) {
            if (this.sort.comparator instanceof __WEBPACK_IMPORTED_MODULE_1__built_in_comparators_datagrid_property_comparator__["a" /* DatagridPropertyComparator */]) {
                /*
                 * Special case for the default object property comparator,
                 * we give the property name instead of the actual comparator.
                 */
                state.sort = {
                    by: this.sort.comparator.prop,
                    reverse: this.sort.reverse
                };
            }
            else {
                state.sort = {
                    by: this.sort.comparator,
                    reverse: this.sort.reverse
                };
            }
        }
        var activeFilters = this.filters.getActiveFilters();
        if (activeFilters.length > 0) {
            state.filters = [];
            for (var _i = 0, activeFilters_1 = activeFilters; _i < activeFilters_1.length; _i++) {
                var filter = activeFilters_1[_i];
                if (filter instanceof __WEBPACK_IMPORTED_MODULE_16__built_in_filters_datagrid_string_filter_impl__["a" /* DatagridStringFilterImpl */]) {
                    var stringFilter = filter.filterFn;
                    if (stringFilter instanceof __WEBPACK_IMPORTED_MODULE_2__built_in_filters_datagrid_property_string_filter__["a" /* DatagridPropertyStringFilter */]) {
                        /*
                         * Special case again for the default object property filter,
                         * we give the property name instead of the full filter object.
                         */
                        state.filters.push({
                            property: stringFilter.prop,
                            value: filter.value
                        });
                        continue;
                    }
                }
                state.filters.push(filter);
            }
        }
        this.refresh.emit(state);
    };
    /**
     * Public method to re-trigger the computation of displayed items manually
     */
    Datagrid.prototype.dataChanged = function () {
        this.items.refresh();
    };
    Object.defineProperty(Datagrid.prototype, "selected", {
        /**
         * Array of all selected items
         */
        set: function (value) {
            if (value) {
                this.selection.selectionType = __WEBPACK_IMPORTED_MODULE_10__providers_selection__["a" /* SelectionType */].Multi;
            }
            else {
                this.selection.selectionType = __WEBPACK_IMPORTED_MODULE_10__providers_selection__["a" /* SelectionType */].None;
            }
            this.selection.current = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Datagrid.prototype, "singleSelected", {
        /**
         * Selected item in single-select mode
         */
        set: function (value) {
            this.selection.selectionType = __WEBPACK_IMPORTED_MODULE_10__providers_selection__["a" /* SelectionType */].Single;
            if (value) {
                this.selection.currentSingle = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Datagrid.prototype, "allSelected", {
        /**
         * Indicates if all currently displayed items are selected
         */
        get: function () {
            return this.selection.isAllSelected();
        },
        /**
         * Selects/deselects all currently displayed items
         * @param value
         */
        set: function (value) {
            /*
             * This is a setter but we ignore the value.
             * It's strange, but it lets us have an indeterminate state where only
             * some of the items are selected.
             */
            this.selection.toggleAll();
        },
        enumerable: true,
        configurable: true
    });
    Datagrid.prototype.ngAfterContentInit = function () {
        var _this = this;
        // TODO: Move all this to ngOnInit() once https://github.com/angular/angular/issues/12818 goes in.
        // And when we do that, remove the manual step for each one.
        this._subscriptions.push(this.actionableRows.changes.subscribe(function () {
            /*if at least one row has actionable overflow, show a placeholder cell in every other row.*/
            _this.rowActionService.hasActionableRow = _this.actionableRows.length > 0;
        }));
        this.rowActionService.hasActionableRow = this.actionableRows.length > 0;
        this._subscriptions.push(this.details.changes.subscribe(function () {
            /* if at least one row is expandable, show a placeholder cell in every other row.*/
            _this.expandableRows.hasExpandableRow = _this.details.length > 0;
        }));
        this.expandableRows.hasExpandableRow = this.details.length > 0;
        this._subscriptions.push(this.rows.changes.subscribe(function () {
            if (!_this.items.smart) {
                _this.items.all = _this.rows.map(function (row) { return row.item; });
            }
        }));
        if (!this.items.smart) {
            this.items.all = this.rows.map(function (row) { return row.item; });
        }
    };
    /**
     * Our setup happens in the view of some of our components, so we wait for it to be done before starting
     */
    Datagrid.prototype.ngAfterViewInit = function () {
        var _this = this;
        // TODO: determine if we can get rid of provider wiring in view init so that subscriptions can be done earlier
        this.triggerRefresh();
        this._subscriptions.push(this.sort.change.subscribe(function () { return _this.triggerRefresh(); }));
        this._subscriptions.push(this.filters.change.subscribe(function () { return _this.triggerRefresh(); }));
        this._subscriptions.push(this.page.change.subscribe(function () { return _this.triggerRefresh(); }));
        this._subscriptions.push(this.selection.change.subscribe(function (s) {
            if (_this.selection.selectionType === __WEBPACK_IMPORTED_MODULE_10__providers_selection__["a" /* SelectionType */].Single) {
                _this.singleSelectedChanged.emit(s);
            }
            else if (_this.selection.selectionType === __WEBPACK_IMPORTED_MODULE_10__providers_selection__["a" /* SelectionType */].Multi) {
                _this.selectedChanged.emit(s);
            }
        }));
        this._subscriptions.push(this.columns.changes.subscribe(function (columns) {
            _this.columnService.updateColumnList(_this.columns.map(function (col) { return col.hideable; }));
        }));
        // Get ColumnService ready for HideableColumns.
        this.columnService.updateColumnList(this.columns.map(function (col) { return col.hideable; }));
    };
    Datagrid.prototype.ngOnDestroy = function () {
        this._subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    Datagrid.prototype.resize = function () {
        this.organizer.resize();
    };
    return Datagrid;
}());

Datagrid.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-datagrid",
                template: "\n      <!--\n        ~ Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n\n      <ng-content select=\"clr-dg-action-bar\"></ng-content>\n      <div class=\"datagrid-overlay-wrapper\">\n          <div class=\"datagrid-scroll-wrapper\">\n              <div class=\"datagrid\" #datagrid>\n                  <div clrDgTableWrapper class=\"datagrid-table-wrapper\">\n                      <div clrDgHead class=\"datagrid-head\">\n                          <div class=\"datagrid-row datagrid-row-flex\">\n                              <!-- header for datagrid where you can select multiple rows -->\n                              <div class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                                   *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\">\n                              <span class=\"datagrid-column-title\">\n                                  <clr-checkbox [(ngModel)]=\"allSelected\"></clr-checkbox>\n                              </span>\n                                  <div class=\"datagrid-column-separator\"></div>\n                              </div>\n                              <!-- header for datagrid where you can select one row only -->\n                              <div class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                                   *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\">\n                                  <div class=\"datagrid-column-separator\"></div>\n                              </div>\n                              <!-- header for single row action; only display if we have at least one actionable row in datagrid -->\n                              <div class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                                   *ngIf=\"rowActionService.hasActionableRow\">\n                                  <div class=\"datagrid-column-separator\"></div>\n                              </div>\n                              <!-- header for carets; only display if we have at least one expandable row in datagrid -->\n                              <div class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                                   *ngIf=\"expandableRows.hasExpandableRow\">\n                                  <div class=\"datagrid-column-separator\"></div>\n                              </div>\n                              <ng-content select=\"clr-dg-column\"></ng-content>\n                          </div>\n                      </div>\n\n                      <div clrDgBody class=\"datagrid-body\">\n                          <ng-template *ngIf=\"iterator\"\n                                       ngFor [ngForOf]=\"items.displayed\" [ngForTrackBy]=\"items.trackBy\"\n                                       [ngForTemplate]=\"iterator.template\"></ng-template>\n                          <ng-content *ngIf=\"!iterator\"></ng-content>\n\n                          <!-- Custom placeholder overrides the default empty one -->\n                          <ng-content select=\"clr-dg-placeholder\"></ng-content>\n                          <clr-dg-placeholder *ngIf=\"!placeholder\"></clr-dg-placeholder>\n                      </div>\n                  </div>\n\n                  <!--\n                      This is not inside the table because there is no good way of having a single column span\n                      everything when using custom elements with display:table-cell.\n                  -->\n                  <ng-content select=\"clr-dg-footer\"></ng-content>\n              </div>\n          </div>\n          <div class=\"datagrid-spinner\" *ngIf=\"loading\">\n              <div class=\"spinner\">Loading...</div>\n          </div>\n      </div>\n    ",
                providers: [__WEBPACK_IMPORTED_MODULE_10__providers_selection__["b" /* Selection */], __WEBPACK_IMPORTED_MODULE_11__providers_sort__["a" /* Sort */], __WEBPACK_IMPORTED_MODULE_7__providers_filters__["a" /* FiltersProvider */], __WEBPACK_IMPORTED_MODULE_9__providers_page__["a" /* Page */], __WEBPACK_IMPORTED_MODULE_8__providers_items__["a" /* Items */], __WEBPACK_IMPORTED_MODULE_14__render_render_organizer__["a" /* DatagridRenderOrganizer */],
                    __WEBPACK_IMPORTED_MODULE_12__providers_row_action_service__["a" /* RowActionService */], __WEBPACK_IMPORTED_MODULE_13__providers_global_expandable_rows__["a" /* GlobalExpandableRows */], __WEBPACK_IMPORTED_MODULE_17__providers_hideable_column_service__["a" /* HideableColumnService */]],
                host: {
                    "[class.datagrid-host]": "true"
                }
            },] },
];
/** @nocollapse */
Datagrid.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_17__providers_hideable_column_service__["a" /* HideableColumnService */], },
    { type: __WEBPACK_IMPORTED_MODULE_7__providers_filters__["a" /* FiltersProvider */], },
    { type: __WEBPACK_IMPORTED_MODULE_14__render_render_organizer__["a" /* DatagridRenderOrganizer */], },
    { type: __WEBPACK_IMPORTED_MODULE_9__providers_page__["a" /* Page */], },
    { type: __WEBPACK_IMPORTED_MODULE_11__providers_sort__["a" /* Sort */], },
    { type: __WEBPACK_IMPORTED_MODULE_8__providers_items__["a" /* Items */], },
    { type: __WEBPACK_IMPORTED_MODULE_13__providers_global_expandable_rows__["a" /* GlobalExpandableRows */], },
    { type: __WEBPACK_IMPORTED_MODULE_10__providers_selection__["b" /* Selection */], },
    { type: __WEBPACK_IMPORTED_MODULE_12__providers_row_action_service__["a" /* RowActionService */], },
]; };
Datagrid.propDecorators = {
    'loading': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgLoading",] },],
    'refresh': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgRefresh",] },],
    'iterator': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChild"], args: [__WEBPACK_IMPORTED_MODULE_3__datagrid_items__["a" /* DatagridItems */],] },],
    'selected': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgSelected",] },],
    'selectedChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgSelectedChange",] },],
    'singleSelected': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDgSingleSelected",] },],
    'singleSelectedChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgSingleSelectedChange",] },],
    'placeholder': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChild"], args: [__WEBPACK_IMPORTED_MODULE_5__datagrid_placeholder__["a" /* DatagridPlaceholder */],] },],
    'columns': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_18__datagrid_column__["a" /* DatagridColumn */],] },],
    'rows': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_4__datagrid_row__["a" /* DatagridRow */],] },],
    'actionableRows': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_15__datagrid_action_overflow__["a" /* DatagridActionOverflow */], { descendants: true },] },],
    'details': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_6__datagrid_if_expanded__["a" /* DatagridIfExpanded */], { descendants: true },] },],
};
//# sourceMappingURL=datagrid.js.map

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrDatagridModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__forms_forms_module__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__popover_common_popover_module__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_loading_loading_module__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__index__ = __webpack_require__(83);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */








var ClrDatagridModule = (function () {
    function ClrDatagridModule() {
    }
    return ClrDatagridModule;
}());

ClrDatagridModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__["a" /* ClrIconModule */],
                    __WEBPACK_IMPORTED_MODULE_3__forms_forms_module__["a" /* ClrFormsModule */],
                    __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormsModule"],
                    __WEBPACK_IMPORTED_MODULE_5__popover_common_popover_module__["a" /* ClrCommonPopoverModule */],
                    __WEBPACK_IMPORTED_MODULE_6__utils_loading_loading_module__["a" /* ClrLoadingModule */]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_7__index__["a" /* DATAGRID_DIRECTIVES */],
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_7__index__["a" /* DATAGRID_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrDatagridModule.ctorParameters = function () { return []; };
//# sourceMappingURL=datagrid.module.js.map

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DATAGRID_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__built_in_filters_datagrid_string_filter__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__datagrid__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__datagrid_action_bar__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__datagrid_action_overflow__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__datagrid_cell__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__datagrid_column__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__datagrid_column_toggle__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__datagrid_filter__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__datagrid_footer__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__datagrid_items__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__datagrid_pagination__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__datagrid_row__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__datagrid_if_expanded__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__datagrid_row_detail__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__datagrid_placeholder__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__render_main_renderer__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__render_table_renderer__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__render_header_renderer__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__render_head_renderer__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__render_body_renderer__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__render_column_resizer__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__render_row_renderer__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__render_row_master_renderer__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__render_cell_renderer__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__animation_hack_row_expand_animation__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__datagrid_hidable_column_directive__ = __webpack_require__(78);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__datagrid__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__datagrid_action_bar__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_3__datagrid_action_overflow__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_5__datagrid_column__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_6__datagrid_column_toggle__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_25__datagrid_hidable_column_directive__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "h", function() { return __WEBPACK_IMPORTED_MODULE_7__datagrid_filter__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "i", function() { return __WEBPACK_IMPORTED_MODULE_9__datagrid_items__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "j", function() { return __WEBPACK_IMPORTED_MODULE_11__datagrid_row__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "k", function() { return __WEBPACK_IMPORTED_MODULE_12__datagrid_if_expanded__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "l", function() { return __WEBPACK_IMPORTED_MODULE_13__datagrid_row_detail__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "m", function() { return __WEBPACK_IMPORTED_MODULE_4__datagrid_cell__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "n", function() { return __WEBPACK_IMPORTED_MODULE_8__datagrid_footer__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "o", function() { return __WEBPACK_IMPORTED_MODULE_10__datagrid_pagination__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "p", function() { return __WEBPACK_IMPORTED_MODULE_14__datagrid_placeholder__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__interfaces_sort_order__ = __webpack_require__(84);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "q", function() { return __WEBPACK_IMPORTED_MODULE_26__interfaces_sort_order__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "r", function() { return __WEBPACK_IMPORTED_MODULE_0__built_in_filters_datagrid_string_filter__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__built_in_filters_datagrid_property_string_filter__ = __webpack_require__(36);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "s", function() { return __WEBPACK_IMPORTED_MODULE_27__built_in_filters_datagrid_property_string_filter__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__built_in_comparators_datagrid_property_comparator__ = __webpack_require__(35);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "t", function() { return __WEBPACK_IMPORTED_MODULE_28__built_in_comparators_datagrid_property_comparator__["a"]; });













































var DATAGRID_DIRECTIVES = [
    // Core
    __WEBPACK_IMPORTED_MODULE_1__datagrid__["a" /* Datagrid */],
    __WEBPACK_IMPORTED_MODULE_2__datagrid_action_bar__["a" /* DatagridActionBar */],
    __WEBPACK_IMPORTED_MODULE_3__datagrid_action_overflow__["a" /* DatagridActionOverflow */],
    __WEBPACK_IMPORTED_MODULE_5__datagrid_column__["a" /* DatagridColumn */],
    __WEBPACK_IMPORTED_MODULE_6__datagrid_column_toggle__["a" /* DatagridColumnToggle */],
    __WEBPACK_IMPORTED_MODULE_25__datagrid_hidable_column_directive__["a" /* DatagridHideableColumnDirective */],
    __WEBPACK_IMPORTED_MODULE_7__datagrid_filter__["a" /* DatagridFilter */],
    __WEBPACK_IMPORTED_MODULE_9__datagrid_items__["a" /* DatagridItems */],
    __WEBPACK_IMPORTED_MODULE_11__datagrid_row__["a" /* DatagridRow */],
    __WEBPACK_IMPORTED_MODULE_12__datagrid_if_expanded__["a" /* DatagridIfExpanded */],
    __WEBPACK_IMPORTED_MODULE_13__datagrid_row_detail__["a" /* DatagridRowDetail */],
    __WEBPACK_IMPORTED_MODULE_4__datagrid_cell__["a" /* DatagridCell */],
    __WEBPACK_IMPORTED_MODULE_8__datagrid_footer__["a" /* DatagridFooter */],
    __WEBPACK_IMPORTED_MODULE_10__datagrid_pagination__["a" /* DatagridPagination */],
    __WEBPACK_IMPORTED_MODULE_14__datagrid_placeholder__["a" /* DatagridPlaceholder */],
    // Renderers
    __WEBPACK_IMPORTED_MODULE_15__render_main_renderer__["a" /* DatagridMainRenderer */],
    __WEBPACK_IMPORTED_MODULE_16__render_table_renderer__["a" /* DatagridTableRenderer */],
    __WEBPACK_IMPORTED_MODULE_18__render_head_renderer__["a" /* DatagridHeadRenderer */],
    __WEBPACK_IMPORTED_MODULE_17__render_header_renderer__["a" /* DatagridHeaderRenderer */],
    __WEBPACK_IMPORTED_MODULE_19__render_body_renderer__["a" /* DatagridBodyRenderer */],
    __WEBPACK_IMPORTED_MODULE_20__render_column_resizer__["a" /* DatagridColumnResizer */],
    __WEBPACK_IMPORTED_MODULE_21__render_row_renderer__["a" /* DatagridRowRenderer */],
    __WEBPACK_IMPORTED_MODULE_22__render_row_master_renderer__["a" /* DatagridRowMasterRenderer */],
    __WEBPACK_IMPORTED_MODULE_23__render_cell_renderer__["a" /* DatagridCellRenderer */],
    // Animation hack
    __WEBPACK_IMPORTED_MODULE_24__animation_hack_row_expand_animation__["a" /* DatagridRowExpandAnimation */],
    // Built-in shortcuts
    __WEBPACK_IMPORTED_MODULE_0__built_in_filters_datagrid_string_filter__["a" /* DatagridStringFilter */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SortOrder; });
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Enumeration representing the sorting order of a datagrid column. It is a constant Enum,
 * i.e. each value needs to be treated as a `number`, starting at index 0.
 *
 * @export
 * @enum {number}
 */
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */ var SortOrder;
(function (SortOrder) {
    SortOrder[SortOrder["Unsorted"] = 0] = "Unsorted";
    SortOrder[SortOrder["Asc"] = 1] = "Asc";
    SortOrder[SortOrder["Desc"] = -1] = "Desc";
})(SortOrder || (SortOrder = {}));
//# sourceMappingURL=sort-order.js.map

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DragDispatcher; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var DragDispatcher = (function () {
    function DragDispatcher(_ngZone, _renderer) {
        this._ngZone = _ngZone;
        this._renderer = _renderer;
        this._onDragStart = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._onDragMove = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._onDragEnd = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    Object.defineProperty(DragDispatcher.prototype, "onDragStart", {
        get: function () {
            return this._onDragStart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragDispatcher.prototype, "onDragMove", {
        get: function () {
            return this._onDragMove;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragDispatcher.prototype, "onDragEnd", {
        get: function () {
            return this._onDragEnd;
        },
        enumerable: true,
        configurable: true
    });
    DragDispatcher.prototype.addDragListener = function () {
        var handleEl = this.handleRef.nativeElement;
        this._listeners = [
            this.customDragEvent(handleEl, "mousedown", "mousemove", "mouseup"),
            this.customDragEvent(handleEl, "touchstart", "touchmove", "touchend")
        ];
    };
    DragDispatcher.prototype.customDragEvent = function (element, startOnEvent, moveOnEvent, endOnEvent) {
        var _this = this;
        var dragMoveListener;
        var dragEndListener;
        return this._renderer.listen(element, startOnEvent, function (startEvent) {
            _this.notifyDragStart(startEvent);
            dragMoveListener = _this._ngZone.runOutsideAngular(function () {
                return _this._renderer.listen("document", moveOnEvent, function (moveEvent) {
                    _this.notifyDragMove(moveEvent);
                });
            });
            dragEndListener = _this._renderer.listen("document", endOnEvent, function (endEvent) {
                //Unsubscribing from mouseMoveListener
                dragMoveListener();
                _this.notifyDragEnd(endEvent);
                //Unsubscribing from itself
                dragEndListener();
            });
        });
    };
    DragDispatcher.prototype.notifyDragStart = function (event) {
        return this._onDragStart.next(event);
    };
    DragDispatcher.prototype.notifyDragMove = function (event) {
        return this._onDragMove.next(event);
    };
    DragDispatcher.prototype.notifyDragEnd = function (event) {
        return this._onDragEnd.next(event);
    };
    DragDispatcher.prototype.destroy = function () {
        this._listeners.map(function (event) { return event(); });
    };
    return DragDispatcher;
}());

DragDispatcher.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
DragDispatcher.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer2"], },
]; };
//# sourceMappingURL=drag-dispatcher.js.map

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlobalExpandableRows; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var GlobalExpandableRows = (function () {
    function GlobalExpandableRows() {
        this.hasExpandableRow = false;
    }
    return GlobalExpandableRows;
}());

GlobalExpandableRows.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
GlobalExpandableRows.ctorParameters = function () { return []; };
//# sourceMappingURL=global-expandable-rows.js.map

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridCellRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__render_organizer__ = __webpack_require__(4);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var DatagridCellRenderer = (function () {
    function DatagridCellRenderer(el, renderer, organizer) {
        var _this = this;
        this.el = el;
        this.renderer = renderer;
        this.subscription = organizer.clearWidths.subscribe(function () { return _this.clearWidth(); });
    }
    DatagridCellRenderer.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    DatagridCellRenderer.prototype.clearWidth = function () {
        this.renderer.setElementClass(this.el.nativeElement, __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* STRICT_WIDTH_CLASS */], false);
        this.renderer.setElementStyle(this.el.nativeElement, "width", null);
    };
    DatagridCellRenderer.prototype.setWidth = function (strict, value) {
        this.renderer.setElementClass(this.el.nativeElement, __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* STRICT_WIDTH_CLASS */], strict);
        this.renderer.setElementStyle(this.el.nativeElement, "width", value + "px");
    };
    return DatagridCellRenderer;
}());

DatagridCellRenderer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "clr-dg-cell"
            },] },
];
/** @nocollapse */
DatagridCellRenderer.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
    { type: __WEBPACK_IMPORTED_MODULE_2__render_organizer__["a" /* DatagridRenderOrganizer */], },
]; };
//# sourceMappingURL=cell-renderer.js.map

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridColumnResizer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dom_adapter__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__render_organizer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_drag_dispatcher__ = __webpack_require__(85);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var DatagridColumnResizer = (function () {
    function DatagridColumnResizer(el, renderer, organizer, domAdapter, dragDispatcher) {
        this.el = el;
        this.renderer = renderer;
        this.organizer = organizer;
        this.domAdapter = domAdapter;
        this.dragDispatcher = dragDispatcher;
        this.columnResizeBy = 0;
        this.dragWithinMinWidth = false;
        this.resizeEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.subscriptions = [];
        this.columnEl = el.nativeElement;
    }
    DatagridColumnResizer.prototype.ngOnDestroy = function () {
        this.dragDispatcher.destroy();
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    DatagridColumnResizer.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.columnMinWidth = this.domAdapter.minWidth(this.columnEl);
        this.handleTrackerEl = this.dragDispatcher.handleTrackerRef.nativeElement;
        this.dragDispatcher.addDragListener();
        this.subscriptions.push(this.dragDispatcher.onDragStart.subscribe(function () { return _this.dragStartHandler(); }));
        this.subscriptions.push(this.dragDispatcher.onDragMove.subscribe(function ($event) { return _this.dragMoveHandler($event); }));
        this.subscriptions.push(this.dragDispatcher.onDragEnd.subscribe(function () { return _this.dragEndHandler(); }));
    };
    DatagridColumnResizer.prototype.dragStartHandler = function () {
        this.renderer.setStyle(this.handleTrackerEl, "display", "block");
        this.renderer.setStyle(document.body, "cursor", "col-resize");
        this.dragDistancePositionX = 0;
        this.columnRectWidth = this.domAdapter.clientRectWidth(this.columnEl);
        this.pageStartPositionX = this.domAdapter.clientRectRight(this.columnEl);
    };
    DatagridColumnResizer.prototype.dragMoveHandler = function (moveEvent) {
        var pageMovePosition = moveEvent.pageX || moveEvent.changedTouches[0].pageX;
        this.dragDistancePositionX = this.getPositionWithinMax(pageMovePosition - this.pageStartPositionX);
        this.renderer.setStyle(this.handleTrackerEl, "right", -1 * this.dragDistancePositionX + "px");
    };
    DatagridColumnResizer.prototype.dragEndHandler = function () {
        this.renderer.setStyle(this.handleTrackerEl, "right", "0px");
        this.renderer.setStyle(this.handleTrackerEl, "display", "none");
        this.renderer.setStyle(document.body, "cursor", "auto");
        if (this.dragDistancePositionX) {
            this.columnResizeBy = this.dragDistancePositionX;
            this.resizeEmitter.emit(this.columnRectWidth + this.columnResizeBy);
            this.organizer.resize();
        }
    };
    DatagridColumnResizer.prototype.getPositionWithinMax = function (draggedDistance) {
        if (draggedDistance < 0) {
            if (Math.abs(draggedDistance) < this.columnRectWidth - this.columnMinWidth) {
                if (this.dragWithinMinWidth) {
                    this.dragWithinMinWidth = false;
                    this.renderer.removeClass(this.handleTrackerEl, "exceeded-max");
                }
                return draggedDistance;
            }
            else {
                if (!this.dragWithinMinWidth) {
                    this.dragWithinMinWidth = true;
                    this.renderer.addClass(this.handleTrackerEl, "exceeded-max");
                }
                return this.columnMinWidth - this.columnRectWidth;
            }
        }
        else {
            if (this.dragWithinMinWidth) {
                this.dragWithinMinWidth = false;
                this.renderer.removeClass(this.handleTrackerEl, "exceeded-max");
            }
            return draggedDistance;
        }
    };
    return DatagridColumnResizer;
}());

DatagridColumnResizer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "clr-dg-column",
                providers: [__WEBPACK_IMPORTED_MODULE_3__providers_drag_dispatcher__["a" /* DragDispatcher */]]
            },] },
];
/** @nocollapse */
DatagridColumnResizer.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer2"], },
    { type: __WEBPACK_IMPORTED_MODULE_2__render_organizer__["a" /* DatagridRenderOrganizer */], },
    { type: __WEBPACK_IMPORTED_MODULE_1__dom_adapter__["a" /* DomAdapter */], },
    { type: __WEBPACK_IMPORTED_MODULE_3__providers_drag_dispatcher__["a" /* DragDispatcher */], },
]; };
DatagridColumnResizer.propDecorators = {
    'resizeEmitter': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrDgColumnResize",] },],
};
//# sourceMappingURL=column-resizer.js.map

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridHeaderRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dom_adapter__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__render_organizer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__column_resizer__ = __webpack_require__(88);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





var DatagridHeaderRenderer = (function () {
    function DatagridHeaderRenderer(el, renderer, organizer, domAdapter, columnResizer) {
        var _this = this;
        this.el = el;
        this.renderer = renderer;
        this.organizer = organizer;
        this.domAdapter = domAdapter;
        this.columnResizer = columnResizer;
        this.widthSet = false;
        this.subscription = organizer.clearWidths.subscribe(function () { return _this.clearWidth(); });
    }
    DatagridHeaderRenderer.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    DatagridHeaderRenderer.prototype.clearWidth = function () {
        // remove the width only if we set it, and it is not changed by dragging.
        if (this.widthSet && !this.columnResizer.columnResizeBy) {
            this.renderer.setElementStyle(this.el.nativeElement, "width", null);
        }
        var strictWidth = this.domAdapter.userDefinedWidth(this.el.nativeElement);
        if (this.columnResizer.columnResizeBy) {
            strictWidth = this.columnResizer.columnRectWidth + this.columnResizer.columnResizeBy;
        }
        if (strictWidth) {
            this.strictWidth = strictWidth;
        }
        else {
            delete this.strictWidth;
        }
    };
    DatagridHeaderRenderer.prototype.computeWidth = function () {
        var width = this.strictWidth;
        this.renderer.setElementClass(this.el.nativeElement, __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* STRICT_WIDTH_CLASS */], !!width);
        if (this.columnResizer.columnResizeBy) {
            this.renderer.setElementStyle(this.el.nativeElement, "width", width + "px");
            this.columnResizer.columnResizeBy = 0;
            this.widthSet = false;
        }
        if (!width) {
            width = this.domAdapter.scrollWidth(this.el.nativeElement);
            this.renderer.setElementStyle(this.el.nativeElement, "width", width + "px");
            this.widthSet = true;
        }
        return width;
    };
    return DatagridHeaderRenderer;
}());

DatagridHeaderRenderer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "clr-dg-column"
            },] },
];
/** @nocollapse */
DatagridHeaderRenderer.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
    { type: __WEBPACK_IMPORTED_MODULE_3__render_organizer__["a" /* DatagridRenderOrganizer */], },
    { type: __WEBPACK_IMPORTED_MODULE_1__dom_adapter__["a" /* DomAdapter */], },
    { type: __WEBPACK_IMPORTED_MODULE_4__column_resizer__["a" /* DatagridColumnResizer */], },
]; };
//# sourceMappingURL=header-renderer.js.map

/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return STACK_VIEW_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stack_view__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stack_header__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stack_block__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__stack_input__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__stack_select__ = __webpack_require__(95);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__stack_view__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_0__stack_view__["b"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_1__stack_header__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_2__stack_block__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_3__stack_input__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_4__stack_select__["a"]; });










var STACK_VIEW_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__stack_view__["a" /* StackView */],
    __WEBPACK_IMPORTED_MODULE_1__stack_header__["a" /* StackHeader */],
    __WEBPACK_IMPORTED_MODULE_2__stack_block__["a" /* StackBlock */],
    __WEBPACK_IMPORTED_MODULE_0__stack_view__["b" /* StackViewCustomTags */],
    /**
     * Undocumented experimental feature: inline editing.
     */
    __WEBPACK_IMPORTED_MODULE_3__stack_input__["a" /* StackInput */],
    __WEBPACK_IMPORTED_MODULE_4__stack_select__["a" /* StackSelect */]
    /**
     * End of undocumented experimental feature.
     */
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StackBlock; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(8);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var StackBlock = (function () {
    /*
     * This would be more efficient with @ContentChildren, with the parent StackBlock
     * querying for children StackBlocks, but this feature is not available when downgrading
     * the component for Angular 1.
     */
    function StackBlock(parent) {
        this.parent = parent;
        this.expanded = false;
        this.expandedChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.expandable = false;
        this._changedChildren = 0;
        this._fullyInitialized = false;
        this._changed = false;
        if (parent) {
            parent.addChild();
        }
    }
    Object.defineProperty(StackBlock.prototype, "getChangedValue", {
        get: function () {
            return this._changed || (this._changedChildren > 0 && !this.expanded);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackBlock.prototype, "setChangedValue", {
        set: function (value) {
            this._changed = value;
            if (this.parent && this._fullyInitialized) {
                if (value) {
                    this.parent._changedChildren++;
                }
                else {
                    this.parent._changedChildren--;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    StackBlock.prototype.ngOnInit = function () {
        //in order to access the parent StackBlock's properties,
        //the child StackBlock  has to be fully initialized at first.
        this._fullyInitialized = true;
    };
    StackBlock.prototype.addChild = function () {
        this.expandable = true;
    };
    StackBlock.prototype.toggleExpand = function () {
        if (this.expandable) {
            this.expanded = !this.expanded;
            this.expandedChange.emit(this.expanded);
        }
    };
    return StackBlock;
}());

StackBlock.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-stack-block",
                template: "\n        <dt class=\"stack-block-label\" (click)=\"toggleExpand()\">\n            <ng-content select=\"clr-stack-label\"></ng-content>\n        </dt>\n        <dd class=\"stack-block-content\">\n            <ng-content></ng-content>\n        </dd>\n        <!-- FIXME: remove this string concatenation when boolean states are supported -->\n        <div [@collapse]=\"''+!expanded\" class=\"stack-children\">\n            <ng-content select=\"clr-stack-block\"></ng-content>\n        </div>\n    ",
                // Custom elements are inline by default
                styles: ["\n        :host { display: block; }\n    "],
                // Make sure the host has the proper class for styling purposes
                host: {
                    "[class.stack-block]": "true"
                },
                animations: [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])("collapse", [
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])("true", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            "height": 0,
                            "overflow-y": "hidden"
                        })),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])("true => false", [
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])("0.2s ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                                "height": "*",
                                "overflow-y": "hidden"
                            }))
                        ]),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])("false => true", [
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                                "height": "*",
                                "overflow-y": "hidden"
                            }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])("0.2s ease-in-out")
                        ])
                    ])]
            },] },
];
/** @nocollapse */
StackBlock.ctorParameters = function () { return [
    { type: StackBlock, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] },] },
]; };
StackBlock.propDecorators = {
    'expanded': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"], args: ["class.stack-block-expanded",] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrSbExpanded",] },],
    'expandedChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrSbExpandedChange",] },],
    'expandable': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"], args: ["class.stack-block-expandable",] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrSbExpandable",] },],
    'getChangedValue': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"], args: ["class.stack-block-changed",] },],
    'setChangedValue': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrSbNotifyChange",] },],
};
//# sourceMappingURL=stack-block.js.map

/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StackControl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Undocumented experimental feature: inline editing.
 */

var StackControl = (function () {
    function StackControl(stackView) {
        var _this = this;
        this.stackView = stackView;
        this.modelChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        // Make the StackView editable, since it contains a StackControl
        this.stackView.editable = true;
        this.stackView.editingChange.subscribe(function (editing) {
            // Edit mode was closed
            if (!editing) {
                _this.modelChange.emit(_this.model);
            }
        });
    }
    return StackControl;
}());

//# sourceMappingURL=stack-control.js.map

/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StackHeader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stack_view__ = __webpack_require__(14);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var StackHeader = (function () {
    function StackHeader(stackView) {
        this.stackView = stackView;
    }
    return StackHeader;
}());

StackHeader.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-stack-header",
                template: "\n        <h4 class=\"stack-header\">\n            <span class=\"stack-title\"><ng-content></ng-content></span>\n            \n            <span class=\"stack-actions\">\n                <ng-content select=\".stack-action\"></ng-content>\n                <!-- Undocumented experimental feature: inline editing. -->\n                <button *ngIf=\"stackView.editable\" class=\"stack-action btn btn-sm btn-link\" \n                        (click)=\"stackView.editing = !stackView.editing\" type=\"button\">\n                        Edit\n                </button>\n                <!-- End of undocumented experimental feature. -->\n            </span>\n        </h4>\n    ",
                // Custom elements are inline by default
                styles: ["\n        :host { display: block; }\n    "]
            },] },
];
/** @nocollapse */
StackHeader.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__stack_view__["a" /* StackView */], },
]; };
//# sourceMappingURL=stack-header.js.map

/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StackInput; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stack_control__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stack_view__ = __webpack_require__(14);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Undocumented experimental feature: inline editing.
 *
 * TODO: support more types of inputs: checkbox, radio, ...
 * TODO: Mirror input attributes from the host to the actual input: size, min, max, placeholder, ...
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var StackInput = (function (_super) {
    __extends(StackInput, _super);
    function StackInput(stackView) {
        var _this = _super.call(this, stackView) || this;
        _this.stackView = stackView;
        _this.type = "text";
        return _this;
    }
    return StackInput;
}(__WEBPACK_IMPORTED_MODULE_1__stack_control__["a" /* StackControl */]));

StackInput.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-stack-input",
                inputs: ["model: clrModel", "type"],
                outputs: ["modelChange: clrModelChange"],
                template: "\n        <span *ngIf=\"!stackView.editing\">{{model}}</span>\n        <input [type]=\"type\" *ngIf=\"stackView.editing\" [(ngModel)]=\"model\"/>\n    "
            },] },
];
/** @nocollapse */
StackInput.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__stack_view__["a" /* StackView */], },
]; };
//# sourceMappingURL=stack-input.js.map

/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StackSelect; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stack_control__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stack_view__ = __webpack_require__(14);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Undocumented experimental feature: inline editing.
 *
 * TODO: Offer a a way to customize the value displayed, plain value may be unreadable.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var StackSelect = (function (_super) {
    __extends(StackSelect, _super);
    function StackSelect(stackView) {
        var _this = _super.call(this, stackView) || this;
        _this.stackView = stackView;
        return _this;
    }
    return StackSelect;
}(__WEBPACK_IMPORTED_MODULE_1__stack_control__["a" /* StackControl */]));

StackSelect.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-stack-select",
                inputs: ["model: clrModel"],
                outputs: ["modelChange: clrModelChange"],
                template: "\n        <span *ngIf=\"!stackView.editing\">{{model}}</span>\n        <div class=\"select\" *ngIf=\"stackView.editing\" >\n            <select [(ngModel)]=\"model\">\n                <ng-content></ng-content>\n            </select>\n        </div>\n    "
            },] },
];
/** @nocollapse */
StackSelect.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__stack_view__["a" /* StackView */], },
]; };
//# sourceMappingURL=stack-select.js.map

/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrStackViewModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__index__ = __webpack_require__(90);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var ClrStackViewModule = (function () {
    function ClrStackViewModule() {
    }
    return ClrStackViewModule;
}());

ClrStackViewModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_3__index__["a" /* STACK_VIEW_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_3__index__["a" /* STACK_VIEW_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrStackViewModule.ctorParameters = function () { return []; };
//# sourceMappingURL=stack-view.module.js.map

/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TREE_VIEW_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tree_view__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tree_node__ = __webpack_require__(49);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__tree_view__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__tree_node__["a"]; });




var TREE_VIEW_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_1__tree_node__["a" /* TreeNode */],
    __WEBPACK_IMPORTED_MODULE_0__tree_view__["a" /* TreeView */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TreeSelectionService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);


var TreeSelectionService = (function () {
    function TreeSelectionService() {
        this.selectable = false;
        //Boolean not necessary. Just emitting any value will indicate that a change has occurred
        this._change = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    Object.defineProperty(TreeSelectionService.prototype, "change", {
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    TreeSelectionService.prototype.notify = function () {
        this._change.next(true);
    };
    TreeSelectionService.prototype.verifyTreeSelection = function (selection) {
        var _this = this;
        if (!selection.hasOwnProperty("selected")) {
            throw "clrTreeSelection should have the selected property";
        }
        //Check if the "children" property exists and is of type array
        if (selection.hasOwnProperty("children")) {
            if (Object.prototype.toString.call(selection.children) !== "[object Array]") {
                throw "clrTreeSelection should be of type array. Received type " +
                    typeof selection.children;
            }
            selection.children.forEach(function (child) { return _this.verifyTreeSelection(child); });
        }
    };
    return TreeSelectionService;
}());

TreeSelectionService.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
TreeSelectionService.ctorParameters = function () { return []; };
//# sourceMappingURL=treeSelection.service.js.map

/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TreeView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_treeSelection_service__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tree_node__ = __webpack_require__(49);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var TreeView = (function () {
    function TreeView(treeSelectionService) {
        this.treeSelectionService = treeSelectionService;
        /*Note: Experimental Feature. Might be removed*/
        this.isCompact = false;
        this.selectedChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](true);
    }
    TreeView.prototype.generateTreeSelection = function () {
        var treeSelection = [];
        this.children.forEach(function (child) { return treeSelection.push(child.toTreeSelection()); });
        return treeSelection.filter(function (selection) { return !!selection; });
    };
    /**
     * Verifies whether the input received is valid or not.
     * Throws an error if invalid.
     * @param selectionArray
     */
    TreeView.prototype.verifyInput = function (selectionArray) {
        var _this = this;
        //Check if selection is of type array
        //http://stackoverflow.com/a/4775737/3538394
        if (Object.prototype.toString.call(selectionArray) !== "[object Array]") {
            throw "clrTreeSelection should be of type array. Received " + typeof selectionArray;
        }
        selectionArray.forEach(function (selection) { return _this.treeSelectionService.verifyTreeSelection(selection); });
    };
    TreeView.prototype.populateTree = function (selectionArray) {
        if (this.children && selectionArray && selectionArray.length > 0) {
            this.children.toArray().forEach(function (child) { return child.matchTreeSelection(selectionArray); });
        }
    };
    Object.defineProperty(TreeView.prototype, "selected", {
        set: function (value) {
            this.verifyInput(value);
            this.treeSelectionService.selectable = true;
            this.initialInput = value;
        },
        enumerable: true,
        configurable: true
    });
    TreeView.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.treeSelectionService.change.subscribe(function () {
            if (_this.children) {
                _this.selectedChange.emit(_this.generateTreeSelection());
            }
        });
        this.populateTree(this.initialInput);
    };
    return TreeView;
}());

TreeView.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-tree",
                template: "\n      <!--\n        ~ Copyright (c) 2016 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n\n      <ng-content></ng-content>\n      <ng-content select=\"clr-tree-node\"></ng-content>\n    ",
                host: { "[class.clr-tree--compact]": "isCompact" },
                providers: [__WEBPACK_IMPORTED_MODULE_1__providers_treeSelection_service__["a" /* TreeSelectionService */]]
            },] },
];
/** @nocollapse */
TreeView.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_treeSelection_service__["a" /* TreeSelectionService */], },
]; };
TreeView.propDecorators = {
    'children': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_2__tree_node__["a" /* TreeNode */],] },],
    'isCompact': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTreeCompact",] },],
    'selected': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTreeSelected",] },],
    'selectedChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrTreeSelectedChange",] },],
};
//# sourceMappingURL=tree-view.js.map

/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrTreeViewModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__forms_forms_module__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__index__ = __webpack_require__(97);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */






var ClrTreeViewModule = (function () {
    function ClrTreeViewModule() {
    }
    return ClrTreeViewModule;
}());

ClrTreeViewModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormsModule"],
                    __WEBPACK_IMPORTED_MODULE_3__forms_forms_module__["a" /* ClrFormsModule */],
                    __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__["a" /* ClrIconModule */],
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_5__index__["a" /* TREE_VIEW_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_5__index__["a" /* TREE_VIEW_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrTreeViewModule.ctorParameters = function () { return []; };
//# sourceMappingURL=tree-view.module.js.map

/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Alert; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var Alert = (function () {
    function Alert() {
        this.isSmall = false;
        this.type = "alert-info";
        this.closable = true;
        this.isAppLevel = false;
        this._closed = false;
        this._closedChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.alertTypes = ["alert-info", "alert-warning", "alert-danger", "alert-success"];
    }
    Alert.prototype.close = function () {
        if (!this.closable) {
            return;
        }
        this._closed = true;
        this._closedChanged.emit(true);
    };
    Alert.prototype.open = function () {
        this._closed = false;
        this._closedChanged.emit(false);
    };
    Object.defineProperty(Alert.prototype, "alertType", {
        get: function () {
            if (this.alertTypes.indexOf(this.type) > -1) {
                return this.type;
            }
            return "alert-info";
        },
        enumerable: true,
        configurable: true
    });
    return Alert;
}());

Alert.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-alert",
                template: "\n      <!--\n        ~ Copyright (c) 2016 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n\n      <div\n          *ngIf=\"!_closed\"\n          class=\"alert\"\n          [ngClass]=\"alertType\"\n          [class.alert-sm]=\"isSmall\"\n          [class.alert-app-level]=\"isAppLevel\">\n          <button type=\"button\" class=\"close\" aria-label=\"Close\" *ngIf=\"closable\" (click)=\"close()\">\n              <clr-icon aria-hidden=\"true\" shape=\"close\"></clr-icon>\n          </button>\n          <ng-content select=\".alert-item\"></ng-content>\n      </div>\n    "
            },] },
];
/** @nocollapse */
Alert.ctorParameters = function () { return []; };
Alert.propDecorators = {
    'isSmall': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrAlertSizeSmall",] },],
    'type': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrAlertType",] },],
    'closable': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrAlertClosable",] },],
    'isAppLevel': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrAlertAppLevel",] },],
    '_closed': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrAlertClosed",] },],
    '_closedChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrAlertClosedChange",] },],
};
//# sourceMappingURL=alert.js.map

/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ALERT_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__alert__ = __webpack_require__(101);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__alert__["a"]; });


var ALERT_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__alert__["a" /* Alert */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrEmphasisModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__alert_alert_module__ = __webpack_require__(22);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var ClrEmphasisModule = (function () {
    function ClrEmphasisModule() {
    }
    return ClrEmphasisModule;
}());

ClrEmphasisModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                exports: [
                    __WEBPACK_IMPORTED_MODULE_1__alert_alert_module__["a" /* ClrAlertModule */]
                ]
            },] },
];
/** @nocollapse */
ClrEmphasisModule.ctorParameters = function () { return []; };
//# sourceMappingURL=emphasis.module.js.map

/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Checkbox; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(9);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


/**
 * Private counter to generate unique IDs for the checkboxes, to bind the labels to them.
 */
var latestId = 0;
var Checkbox = (function () {
    function Checkbox() {
        // If our host has an ID attribute, we use this instead of our index.
        this._id = (latestId++).toString();
        // If our host has a name attribute, we apply it to the checkbox.
        this.name = null;
        // If the host is disabled we apply it to the checkbox
        this.disabled = false;
        // Support for inline checkboxes, adds the necessary class to the host
        this.inline = false;
        this._checked = false;
        this._indeterminate = false;
        this.indeterminateChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.change = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        /*
         * These callbacks will be given to us through the ControlValueAccessor interface,
         * and we need to call them when the user interacts with the checkbox.
         */
        this.onChangeCallback = function (_) { };
        this.onTouchedCallback = function () { };
    }
    Object.defineProperty(Checkbox.prototype, "id", {
        get: function () {
            return "clr-checkbox-" + this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (value) {
            if (value !== this._checked) {
                this.indeterminate = false;
                this._checked = value;
                this.change.emit(this.checked);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "indeterminate", {
        get: function () {
            return this._indeterminate;
        },
        set: function (value) {
            if (this._indeterminate !== value) {
                this.checked = false;
                this._indeterminate = value;
                this.indeterminateChange.emit(this._indeterminate);
            }
        },
        enumerable: true,
        configurable: true
    });
    Checkbox.prototype.toggle = function () {
        this.checked = !this.checked;
        this.onChangeCallback(this.checked);
    };
    Checkbox.prototype.writeValue = function (value) {
        if (value === null) {
            value = false;
        }
        if (value !== this.checked) {
            this.checked = value;
        }
    };
    Checkbox.prototype.registerOnChange = function (onChange) {
        this.onChangeCallback = onChange;
    };
    Checkbox.prototype.registerOnTouched = function (onTouched) {
        this.onTouchedCallback = onTouched;
    };
    Checkbox.prototype.touch = function () {
        this.onTouchedCallback();
    };
    return Checkbox;
}());

Checkbox.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-checkbox",
                template: "\n        <input type=\"checkbox\" [id]=\"id\" [name]=\"name\" [checked]=\"checked\" \n               [indeterminate]=\"indeterminate\" [disabled]=\"disabled\"\n               (change)=\"toggle()\" (blur)=\"touch()\">\n        <label [attr.for]=\"id\"><ng-content></ng-content></label>\n    ",
                host: {
                    "[class.checkbox]": "!inline",
                    "[class.checkbox-inline]": "inline",
                    "[class.disabled]": "disabled"
                },
                /*
                 * This provider lets us declare our checkbox as a ControlValueAccessor,
                 * which allows us to use [(ngModel)] directly on our component,
                 * with all the automatic features wiring that come with it.
                 */
                providers: [{
                        provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["NG_VALUE_ACCESSOR"],
                        useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return Checkbox; }),
                        multi: true
                    }]
            },] },
];
/** @nocollapse */
Checkbox.ctorParameters = function () { return []; };
Checkbox.propDecorators = {
    '_id': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["id",] },],
    'name': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["name",] },],
    'disabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrDisabled",] },],
    'inline': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrInline",] },],
    '_checked': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrChecked",] },],
    'indeterminate': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrIndeterminate",] },],
    'indeterminateChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrIndeterminateChange",] },],
    'change': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrCheckedChange",] },],
};
//# sourceMappingURL=checkbox.js.map

/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CHECKBOX_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__checkbox__ = __webpack_require__(104);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__checkbox__["a"]; });


var CHECKBOX_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__checkbox__["a" /* Checkbox */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ICON_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__icon__ = __webpack_require__(171);

var ICON_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__icon__["a" /* IconCustomTag */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrLayoutModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_container_main_container_module__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__nav_navigation_module__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs_module__ = __webpack_require__(116);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var ClrLayoutModule = (function () {
    function ClrLayoutModule() {
    }
    return ClrLayoutModule;
}());

ClrLayoutModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                exports: [
                    __WEBPACK_IMPORTED_MODULE_1__main_container_main_container_module__["a" /* ClrMainContainerModule */],
                    __WEBPACK_IMPORTED_MODULE_2__nav_navigation_module__["a" /* ClrNavigationModule */],
                    __WEBPACK_IMPORTED_MODULE_3__tabs_tabs_module__["a" /* ClrTabsModule */]
                ]
            },] },
];
/** @nocollapse */
ClrLayoutModule.ctorParameters = function () { return []; };
//# sourceMappingURL=layout.module.js.map

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LAYOUT_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_container__ = __webpack_require__(109);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__main_container__["a"]; });


var LAYOUT_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__main_container__["a" /* MainContainer */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MainContainer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__nav_clrResponsiveNavigationService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__ = __webpack_require__(24);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var MainContainer = (function () {
    function MainContainer(elRef, responsiveNavService) {
        this.elRef = elRef;
        this.responsiveNavService = responsiveNavService;
    }
    MainContainer.prototype.ngOnInit = function () {
        var _this = this;
        this._classList = this.elRef.nativeElement.classList;
        this._subscription = this.responsiveNavService.navControl.subscribe({
            next: function (message) {
                _this.processMessage(message);
            }
        });
    };
    MainContainer.prototype.processMessage = function (message) {
        var navClass = __WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_CLASS_HAMBURGER_MENU;
        if (message.controlCode === __WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_CLOSE_ALL) {
            this._classList.remove(__WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_CLASS_HAMBURGER_MENU);
            this._classList.remove(__WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_CLASS_OVERFLOW_MENU);
        }
        else if (message.navLevel === __WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_LEVEL_1) {
            this.controlNav(message.controlCode, navClass);
        }
        else if (message.navLevel === __WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_LEVEL_2) {
            navClass = __WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_CLASS_OVERFLOW_MENU;
            this.controlNav(message.controlCode, navClass);
        }
    };
    MainContainer.prototype.controlNav = function (controlCode, navClass) {
        if (controlCode === __WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_OPEN) {
            this._classList.add(navClass);
        }
        else if (controlCode === __WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_CLOSE) {
            this._classList.remove(navClass);
        }
        else if (controlCode === __WEBPACK_IMPORTED_MODULE_2__nav_clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_TOGGLE) {
            this._classList.toggle(navClass);
        }
    };
    MainContainer.prototype.ngOnDestroy = function () {
        this._subscription.unsubscribe();
    };
    return MainContainer;
}());

MainContainer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "clr-main-container",
                host: {
                    "[class.main-container]": "true"
                }
            },] },
];
/** @nocollapse */
MainContainer.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_1__nav_clrResponsiveNavigationService__["a" /* ClrResponsiveNavigationService */], },
]; };
//# sourceMappingURL=main-container.js.map

/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrMainContainerModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__index__ = __webpack_require__(108);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var ClrMainContainerModule = (function () {
    function ClrMainContainerModule() {
    }
    return ClrMainContainerModule;
}());

ClrMainContainerModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__["a" /* ClrIconModule */]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_3__index__["a" /* LAYOUT_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_3__index__["a" /* LAYOUT_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrMainContainerModule.ctorParameters = function () { return []; };
//# sourceMappingURL=main-container.module.js.map

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Header; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__clrResponsiveNavigationService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__ = __webpack_require__(24);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var Header = (function () {
    function Header(responsiveNavService) {
        this.responsiveNavService = responsiveNavService;
        this.isNavLevel1OnPage = false;
        this.isNavLevel2OnPage = false;
    }
    Header.prototype.ngOnInit = function () {
        var _this = this;
        this._subscription = this.responsiveNavService.registeredNavs.subscribe({
            next: function (navLevelList) {
                _this.initializeNavTriggers(navLevelList);
            }
        });
    };
    Object.defineProperty(Header.prototype, "responsiveNavCodes", {
        //getter to access the responsive navigation codes from the template
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */];
        },
        enumerable: true,
        configurable: true
    });
    //reset triggers. handles cases when an application has different nav levels on different pages.
    Header.prototype.resetNavTriggers = function () {
        this.isNavLevel1OnPage = false;
        this.isNavLevel2OnPage = false;
    };
    //decides which triggers to show on the header
    Header.prototype.initializeNavTriggers = function (navList) {
        var _this = this;
        this.resetNavTriggers();
        if (navList.length > 2) {
            console.error("More than 2 Nav Levels detected.");
            return;
        }
        navList.forEach(function (navLevel) {
            if (navLevel === __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_LEVEL_1) {
                _this.isNavLevel1OnPage = true;
            }
            else if (navLevel === __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_LEVEL_2) {
                _this.isNavLevel2OnPage = true;
            }
        });
    };
    //closes the nav that is open
    Header.prototype.closeOpenNav = function () {
        this.responsiveNavService.closeAllNavs();
    };
    //toggles the nav that is open
    Header.prototype.toggleNav = function (navLevel) {
        this.responsiveNavService.sendControlMessage(__WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_TOGGLE, navLevel);
    };
    Header.prototype.ngOnDestroy = function () {
        this._subscription.unsubscribe();
    };
    return Header;
}());

Header.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-header",
                template: "\n        <button\n            *ngIf=\"isNavLevel1OnPage\"\n            class=\"header-hamburger-trigger\"\n            (click)=\"toggleNav(responsiveNavCodes.NAV_LEVEL_1)\">\n            <span></span>\n        </button>\n        <ng-content></ng-content>\n        <button\n            *ngIf=\"isNavLevel2OnPage\"\n            class=\"header-overflow-trigger\"\n            (click)=\"toggleNav(responsiveNavCodes.NAV_LEVEL_2)\">\n            <span></span>\n        </button>\n        <div class=\"header-backdrop\" (click)=\"closeOpenNav()\"></div>\n    ",
                host: { "[class.header]": "true" }
            },] },
];
/** @nocollapse */
Header.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__clrResponsiveNavigationService__["a" /* ClrResponsiveNavigationService */], },
]; };
//# sourceMappingURL=header.js.map

/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NAVIGATION_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navLevelDirective__ = __webpack_require__(113);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__header__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__navLevelDirective__["a"]; });




var NAVIGATION_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__header__["a" /* Header */],
    __WEBPACK_IMPORTED_MODULE_1__navLevelDirective__["a" /* NavLevelDirective */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavLevelDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__clrResponsiveNavigationService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__ = __webpack_require__(24);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var NavLevelDirective = (function () {
    function NavLevelDirective(responsiveNavService, elementRef) {
        this.responsiveNavService = responsiveNavService;
        this.elementRef = elementRef;
    }
    NavLevelDirective.prototype.ngAfterContentInit = function () {
        if (this.level !== __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_LEVEL_1 &&
            this.level !== __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_LEVEL_2) {
            console.error("Nav Level can only be 1 or 2");
            return;
        }
        this.responsiveNavService.registerNav(this.level);
        this.addNavClass(this.level);
    };
    NavLevelDirective.prototype.addNavClass = function (level) {
        var navHostClassList = this.elementRef.nativeElement.classList;
        if (level === __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_LEVEL_1) {
            navHostClassList.add(__WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_CLASS_LEVEL_1);
        }
        else if (level === __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_LEVEL_2) {
            navHostClassList.add(__WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_CLASS_LEVEL_2);
        }
    };
    Object.defineProperty(NavLevelDirective.prototype, "level", {
        get: function () {
            return this._level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavLevelDirective.prototype, "responsiveNavCodes", {
        //getter to access the responsive navigation codes from the template
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */];
        },
        enumerable: true,
        configurable: true
    });
    NavLevelDirective.prototype.open = function () {
        this.responsiveNavService.sendControlMessage(__WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_OPEN, this.level);
    };
    NavLevelDirective.prototype.close = function () {
        this.responsiveNavService.sendControlMessage(__WEBPACK_IMPORTED_MODULE_2__clrResponsiveNavCodes__["a" /* ClrResponsiveNavCodes */].NAV_CLOSE, this.level);
    };
    //TODO: Figure out whats the best way to do this. Possible methods
    //1. HostListener (current solution)
    //2. Directives on the .nav-link class. We discussed on moving away from class selectors but I forget the reason why
    NavLevelDirective.prototype.onMouseClick = function (target) {
        var current = target; //Get the element in the DOM on which the mouse was clicked
        var navHost = this.elementRef.nativeElement; //Get the current nav native HTML element
        //Start checking if current and navHost are equal.
        //If not traverse to the parentNode and check again.
        while (current) {
            if (current === navHost) {
                return;
            }
            else if (current.classList.contains("nav-link")) {
                this.close();
                return;
            }
            current = current.parentNode;
        }
    };
    NavLevelDirective.prototype.ngOnDestroy = function () {
        this.responsiveNavService.unregisterNav(this.level);
    };
    return NavLevelDirective;
}());

NavLevelDirective.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clr-nav-level]"
            },] },
];
/** @nocollapse */
NavLevelDirective.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__clrResponsiveNavigationService__["a" /* ClrResponsiveNavigationService */], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
]; };
NavLevelDirective.propDecorators = {
    '_level': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clr-nav-level",] },],
    'onMouseClick': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"], args: ["click", ["$event.target"],] },],
};
//# sourceMappingURL=navLevelDirective.js.map

/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrNavigationModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__popover_dropdown_dropdown_module__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__clrResponsiveNavigationService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__index__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__clrResponsiveNavigationProvider__ = __webpack_require__(174);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */







var ClrNavigationModule = (function () {
    function ClrNavigationModule() {
    }
    return ClrNavigationModule;
}());

ClrNavigationModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__icon_icon_module__["a" /* ClrIconModule */],
                    __WEBPACK_IMPORTED_MODULE_3__popover_dropdown_dropdown_module__["a" /* ClrDropdownModule */]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_5__index__["a" /* NAVIGATION_DIRECTIVES */]
                ],
                providers: [
                    {
                        provide: __WEBPACK_IMPORTED_MODULE_4__clrResponsiveNavigationService__["a" /* ClrResponsiveNavigationService */],
                        useFactory: __WEBPACK_IMPORTED_MODULE_6__clrResponsiveNavigationProvider__["a" /* clrResponsiveNavigationProvider */],
                        deps: [
                            [
                                new __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"](),
                                new __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"](),
                                __WEBPACK_IMPORTED_MODULE_4__clrResponsiveNavigationService__["a" /* ClrResponsiveNavigationService */]
                            ]
                        ]
                    }
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_5__index__["a" /* NAVIGATION_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrNavigationModule.ctorParameters = function () { return []; };
//# sourceMappingURL=navigation.module.js.map

/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TABS_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tab_content__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tab_link__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tabs__ = __webpack_require__(27);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__tabs__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_0__tab_content__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_1__tab_link__["a"]; });






var TABS_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__tab_content__["a" /* TabContent */],
    __WEBPACK_IMPORTED_MODULE_1__tab_link__["a" /* TabLink */],
    __WEBPACK_IMPORTED_MODULE_2__tabs__["a" /* Tabs */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrTabsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__(115);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var ClrTabsModule = (function () {
    function ClrTabsModule() {
    }
    return ClrTabsModule;
}());

ClrTabsModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_2__index__["a" /* TABS_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_2__index__["a" /* TABS_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrTabsModule.ctorParameters = function () { return []; };
//# sourceMappingURL=tabs.module.js.map

/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MODAL_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modal__ = __webpack_require__(118);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__modal__["a"]; });


var MODAL_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__modal__["a" /* Modal */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Modal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_scrolling_scrolling_service__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__ = __webpack_require__(50);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var Modal = (function () {
    function Modal(_scrollingService) {
        this._scrollingService = _scrollingService;
        this._open = false;
        this._openChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this.closable = true;
        this.staticBackdrop = false;
        this.skipAnimation = "false";
        // presently this is only used by wizards
        this.ghostPageState = "hidden";
        this.bypassScrollService = false;
        this.stopClose = false;
        this.altClose = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
    }
    Object.defineProperty(Modal.prototype, "sizeClass", {
        get: function () {
            if (this.size) {
                return "modal-" + this.size;
            }
            else {
                return "";
            }
        },
        enumerable: true,
        configurable: true
    });
    //Detect when _open is set to true and set no-scrolling to true
    Modal.prototype.ngOnChanges = function (changes) {
        if (!this.bypassScrollService && changes && changes.hasOwnProperty("_open")) {
            if (changes["_open"].currentValue) {
                this._scrollingService.stopScrolling();
            }
            else {
                this._scrollingService.resumeScrolling();
            }
        }
    };
    Modal.prototype.ngOnDestroy = function () {
        this._scrollingService.resumeScrolling();
    };
    Modal.prototype.open = function () {
        if (this._open === true) {
            return;
        }
        this._open = true;
        this._openChanged.emit(true);
    };
    Modal.prototype.close = function () {
        if (this.stopClose) {
            this.altClose.emit(false);
            return;
        }
        if (!this.closable || this._open === false) {
            return;
        }
        this._open = false;
        // todo: remove this after animation bug is fixed https://github.com/angular/angular/issues/15798
        // this was handled by the fadeDone event below, but that AnimationEvent is not firing in Angular 4.0.
        this._openChanged.emit(false);
        // SPECME
    };
    Modal.prototype.fadeDone = function (e) {
        if (e.toState === "void") {
            this._openChanged.emit(false);
        }
    };
    return Modal;
}());

Modal.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-modal",
                viewProviders: [__WEBPACK_IMPORTED_MODULE_2__utils_scrolling_scrolling_service__["a" /* ScrollingService */]],
                template: "\n\n      <!--\n        ~ Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.\n        ~ This software is released under MIT license.\n        ~ The full license information can be found in LICENSE in the root directory of this project.\n        -->\n\n      <div class=\"modal\" *ngIf=\"_open\">\n          <!--fixme: revisit when ngClass works with exit animation-->\n          <div [@fadeDown]=\"skipAnimation\" (@fadeDown.done)=\"fadeDone($event)\"\n               class=\"modal-dialog\"\n               [class.modal-sm]=\"size == 'sm'\"\n               [class.modal-lg]=\"size == 'lg'\"\n               [class.modal-xl]=\"size == 'xl'\"\n               role=\"dialog\" aria-hidden=\"true\">\n\n              <div class=\"modal-outer-wrapper\">\n                  <div class=\"modal-content-wrapper\">\n                      <!-- only used in wizards -->\n                      <ng-content select=\".modal-nav\"></ng-content>\n\n                      <div class=\"modal-content\">\n                          <div class=\"modal-header\">\n                              <button type=\"button\" class=\"close\" aria-label=\"Close\"\n                                      *ngIf=\"closable\" (click)=\"close()\">\n                                  <clr-icon aria-hidden=\"true\" shape=\"close\"></clr-icon>\n                              </button>\n                              <ng-content select=\".modal-title\"></ng-content>\n                          </div>\n                          <ng-content select=\".modal-body\"></ng-content>\n                          <ng-content select=\".modal-footer\"></ng-content>\n                      </div>\n                  </div>\n                  <div class=\"modal-ghost-wrapper\">\n                      <div [@ghostPageOneState]=\"ghostPageState\" class=\"modal-ghost modal-ghost-1\"></div>\n                      <div [@ghostPageTwoState]=\"ghostPageState\" class=\"modal-ghost modal-ghost-2\"></div>\n                  </div>\n              </div>\n          </div>\n\n          <div [@fade] class=\"modal-backdrop\"\n               aria-hidden=\"true\"\n               (click)=\"staticBackdrop || close()\"></div>\n      </div>\n    ",
                styles: ["\n        :host { display: inline-block; }\n    "],
                animations: [
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])("fadeDown", [
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])("* => false", [
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                                opacity: 0,
                                transform: "translate(0, -25%)"
                            }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])("0.2s ease-in-out")
                        ]),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])("false => *", [
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])("0.2s ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                                opacity: 0,
                                transform: "translate(0, -25%)"
                            }))
                        ])
                    ]),
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])("fade", [
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])("void => *", [
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                                opacity: 0
                            }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])("0.2s ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                                opacity: 0.85
                            }))
                        ]),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])("* => void", [
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])("0.2s ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                                opacity: 0
                            }))
                        ])
                    ]),
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])("ghostPageOneState", [
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.NO_PAGES, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            left: "-24px"
                        })),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.ALL_PAGES, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            left: "0"
                        })),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.NEXT_TO_LAST_PAGE, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            left: "-24px"
                        })),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.LAST_PAGE, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            left: "-24px"
                        })),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.NO_PAGES + " => *", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].TRANSITIONS.IN)),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.ALL_PAGES + " => *", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].TRANSITIONS.OUT)),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.LAST_PAGE + " => *", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].TRANSITIONS.IN)),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.NEXT_TO_LAST_PAGE + " => *", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].TRANSITIONS.OUT))
                    ]),
                    // TODO: USE TRANSFORM, NOT LEFT...
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])("ghostPageTwoState", [
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.NO_PAGES, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            left: "-24px",
                            top: "24px",
                            bottom: "24px"
                        })),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.ALL_PAGES, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            left: "24px"
                        })),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.NEXT_TO_LAST_PAGE, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            left: "0px",
                            top: "24px",
                            bottom: "24px",
                            background: "#bbb"
                        })),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.LAST_PAGE, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            left: "-24px",
                            top: "24px",
                            bottom: "24px"
                        })),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.NO_PAGES + " => *", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].TRANSITIONS.IN)),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.ALL_PAGES + " => *", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].TRANSITIONS.OUT)),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.LAST_PAGE + " => *", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].TRANSITIONS.IN)),
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES.NEXT_TO_LAST_PAGE + " => *", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(__WEBPACK_IMPORTED_MODULE_3__utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].TRANSITIONS.OUT))
                    ])
                ]
            },] },
];
/** @nocollapse */
Modal.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__utils_scrolling_scrolling_service__["a" /* ScrollingService */], },
]; };
Modal.propDecorators = {
    '_open': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrModalOpen",] },],
    '_openChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrModalOpenChange",] },],
    'closable': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrModalClosable",] },],
    'size': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrModalSize",] },],
    'staticBackdrop': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrModalStaticBackdrop",] },],
    'skipAnimation': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrModalSkipAnimation",] },],
    'ghostPageState': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrModalGhostPageState",] },],
    'bypassScrollService': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrModalOverrideScrollService",] },],
    'stopClose': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrModalPreventClose",] },],
    'altClose': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrModalAlternateClose",] },],
    'close': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"], args: ["body:keyup.escape",] },],
};
//# sourceMappingURL=modal.js.map

/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PopoverDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__popover__ = __webpack_require__(7);


var openCount = 0;
var waiting = []; // pending create functions
var PopoverDirective = (function () {
    function PopoverDirective(templateRef, viewContainer) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.popoverOptions = {};
        this.clrPopoverChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
    }
    Object.defineProperty(PopoverDirective.prototype, "clrPopover", {
        set: function (open) {
            var _this = this;
            if (open) {
                if (this.popoverOptions.allowMultipleOpen) {
                    this.createPopover();
                }
                else {
                    if (openCount === 0) {
                        this.createPopover();
                    }
                    else {
                        waiting.push(function () {
                            _this.createPopover();
                        });
                    }
                }
            }
            else {
                this.viewContainer.clear();
                this.destroyPopover();
                if (!this.popoverOptions.allowMultipleOpen) {
                    if (waiting.length > 0) {
                        var createPopoverFn = waiting.shift();
                        createPopoverFn();
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    PopoverDirective.prototype.createPopover = function () {
        var _this = this;
        var embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        //TODO: Not sure of the risks associated with using this. Find an alternative.
        //Needed for find the correct height and width of dynamically created views
        //inside of the popover. For Eg: Button Groups
        embeddedViewRef.detectChanges();
        // filter out other nodes in the view ref so we are only left with element nodes
        var elementNodes = embeddedViewRef.rootNodes.filter(function (node) {
            return node.nodeType === 1;
        });
        // we take the first element node in the embedded view; usually there should only be one anyways
        this._popoverInstance = new __WEBPACK_IMPORTED_MODULE_1__popover__["b" /* Popover */](elementNodes[0]);
        this._subscription = this._popoverInstance.anchor(this.anchorElem, this.anchorPoint, this.popoverPoint, this.popoverOptions).subscribe(function () {
            _this.clrPopoverChange.emit(false);
        });
        openCount++;
    };
    PopoverDirective.prototype.destroyPopover = function () {
        if (this._popoverInstance) {
            this._subscription.unsubscribe();
            this._popoverInstance.destroy();
            delete this._popoverInstance;
            openCount--;
        }
    };
    PopoverDirective.prototype.ngOnDestroy = function () {
        this.destroyPopover();
    };
    return PopoverDirective;
}());

PopoverDirective.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: "[clrPopover]" },] },
];
/** @nocollapse */
PopoverDirective.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"], },
]; };
PopoverDirective.propDecorators = {
    'anchorElem': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrPopoverAnchor",] },],
    'anchorPoint': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrPopoverAnchorPoint",] },],
    'popoverPoint': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrPopoverPopoverPoint",] },],
    'popoverOptions': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrPopoverOptions",] },],
    'clrPopoverChange': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrPopoverChange",] },],
    'clrPopover': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
};
//# sourceMappingURL=popover.directive.js.map

/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DropdownItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dropdown__ = __webpack_require__(30);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var DropdownItem = (function () {
    function DropdownItem(_dropdown, el) {
        this._dropdown = _dropdown;
        this.el = el;
    }
    DropdownItem.prototype.onDropdownItemClick = function () {
        if (this._dropdown.isMenuClosable && !this.el.nativeElement.classList.contains("disabled")) {
            this._dropdown.toggleDropdown();
        }
    };
    return DropdownItem;
}());

DropdownItem.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrDropdownItem]",
                host: {
                    "[class.dropdown-item]": "true"
                }
            },] },
];
/** @nocollapse */
DropdownItem.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__dropdown__["a" /* Dropdown */], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
]; };
DropdownItem.propDecorators = {
    'onDropdownItemClick': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"], args: ["click",] },],
};
//# sourceMappingURL=dropdown-item.js.map

/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DropdownMenu; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);

var DropdownMenu = (function () {
    function DropdownMenu() {
    }
    return DropdownMenu;
}());

DropdownMenu.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dropdown-menu",
                template: "\n        <ng-content></ng-content>\n    ",
                host: {
                    "[class.dropdown-menu]": "true"
                }
            },] },
];
/** @nocollapse */
DropdownMenu.ctorParameters = function () { return []; };
//# sourceMappingURL=dropdown-menu.js.map

/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DropdownToggle; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dropdown__ = __webpack_require__(30);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var DropdownToggle = (function () {
    function DropdownToggle(_dropdown) {
        this._dropdown = _dropdown;
        this.isRootLevelToggle = true;
        // if the containing dropdown has a parent, then this is not the root level one
        if (_dropdown.parent) {
            this.isRootLevelToggle = false;
        }
    }
    Object.defineProperty(DropdownToggle.prototype, "active", {
        get: function () {
            return this._dropdown.open;
        },
        enumerable: true,
        configurable: true
    });
    DropdownToggle.prototype.onDropdownToggleClick = function () {
        this._dropdown.toggleDropdown();
    };
    return DropdownToggle;
}());

DropdownToggle.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrDropdownToggle]",
                host: {
                    "[class.dropdown-toggle]": "isRootLevelToggle",
                    "[class.dropdown-item]": "!isRootLevelToggle",
                    "[class.expandable]": "!isRootLevelToggle",
                    "[class.active]": "active"
                }
            },] },
];
/** @nocollapse */
DropdownToggle.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__dropdown__["a" /* Dropdown */], },
]; };
DropdownToggle.propDecorators = {
    'onDropdownToggleClick': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"], args: ["click",] },],
};
//# sourceMappingURL=dropdown-toggle.js.map

/***/ }),
/* 123 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DROPDOWN_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dropdown__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dropdown_menu__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dropdown_toggle__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dropdown_item__ = __webpack_require__(120);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__dropdown__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__dropdown_menu__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_2__dropdown_toggle__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_3__dropdown_item__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__menu_positions__ = __webpack_require__(51);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_4__menu_positions__["a"]; });









var DROPDOWN_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__dropdown__["a" /* Dropdown */],
    __WEBPACK_IMPORTED_MODULE_1__dropdown_menu__["a" /* DropdownMenu */],
    __WEBPACK_IMPORTED_MODULE_2__dropdown_toggle__["a" /* DropdownToggle */],
    __WEBPACK_IMPORTED_MODULE_3__dropdown_item__["a" /* DropdownItem */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 124 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrPopoverModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dropdown_dropdown_module__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tooltip_tooltip_module__ = __webpack_require__(128);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var ClrPopoverModule = (function () {
    function ClrPopoverModule() {
    }
    return ClrPopoverModule;
}());

ClrPopoverModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                exports: [
                    __WEBPACK_IMPORTED_MODULE_1__dropdown_dropdown_module__["a" /* ClrDropdownModule */],
                    __WEBPACK_IMPORTED_MODULE_2__tooltip_tooltip_module__["a" /* ClrTooltipModule */]
                ]
            },] },
];
/** @nocollapse */
ClrPopoverModule.ctorParameters = function () { return []; };
//# sourceMappingURL=popover.module.js.map

/***/ }),
/* 125 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TOOLTIP_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tooltip__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tooltip_content__ = __webpack_require__(126);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__tooltip__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__tooltip_content__["a"]; });




var TOOLTIP_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__tooltip__["a" /* Tooltip */],
    __WEBPACK_IMPORTED_MODULE_1__tooltip_content__["a" /* TooltipContent */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 126 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TooltipContent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);

var TooltipContent = (function () {
    function TooltipContent() {
    }
    return TooltipContent;
}());

TooltipContent.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-tooltip-content",
                template: "\n        <ng-content></ng-content>\n    "
            },] },
];
/** @nocollapse */
TooltipContent.ctorParameters = function () { return []; };
//# sourceMappingURL=tooltip-content.js.map

/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Tooltip; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_popover__ = __webpack_require__(7);
/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var tooltipDirections = [
    "bottom-left",
    "bottom-right",
    "top-left",
    "top-right",
    "right",
    "left"
];
var tooltipSizes = [
    "xs",
    "sm",
    "md",
    "lg"
];
var Tooltip = (function () {
    function Tooltip() {
        this.visible = false;
        this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_CENTER;
        this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_TOP;
        this._tooltipDirection = "right";
        this._tooltipSize = "sm";
    }
    Object.defineProperty(Tooltip.prototype, "direction", {
        get: function () {
            return this._tooltipDirection;
        },
        set: function (direction) {
            if (direction && (tooltipDirections.indexOf(direction) > -1)) {
                this._tooltipDirection = direction;
            }
            else {
                this._tooltipDirection = "right";
            }
            // set the popover values based on direction
            switch (this._tooltipDirection) {
                case ("top-right"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].TOP_CENTER;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_BOTTOM;
                    break;
                case ("top-left"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].TOP_CENTER;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_BOTTOM;
                    break;
                case ("bottom-right"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].BOTTOM_CENTER;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_TOP;
                    break;
                case ("bottom-left"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].BOTTOM_CENTER;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_TOP;
                    break;
                case ("right"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_CENTER;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_TOP;
                    break;
                case ("left"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_CENTER;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_TOP;
                    break;
                default:
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].RIGHT_CENTER;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_1__common_popover__["a" /* Point */].LEFT_TOP;
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "size", {
        get: function () {
            return this._tooltipSize;
        },
        set: function (size) {
            if (size && (tooltipSizes.indexOf(size) > -1)) {
                this._tooltipSize = size;
            }
            else {
                this._tooltipSize = "md";
            }
        },
        enumerable: true,
        configurable: true
    });
    Tooltip.prototype.onMouseEnter = function () {
        this.visible = true;
    };
    Tooltip.prototype.onMouseLeave = function () {
        this.visible = false;
    };
    return Tooltip;
}());

Tooltip.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-tooltip",
                template: "\n       <a #anchor href=\"javascript://\" role=\"tooltip\" aria-haspopup=\"true\" class=\"tooltip\" \n                [ngClass]=\"'tooltip-' + direction + ' tooltip-' + size\">\n           <ng-content></ng-content>\n           <ng-template [(clrPopover)]=\"visible\" [clrPopoverAnchor]=\"anchor\" [clrPopoverAnchorPoint]=\"anchorPoint\"\n                        [clrPopoverPopoverPoint]=\"popoverPoint\">\n                <span class=\"tooltip-content\">\n                    <ng-content select=\"clr-tooltip-content\"></ng-content>\n                </span>\n           </ng-template>\n        </a>\n    ",
                host: {
                    "(mouseenter)": "onMouseEnter()",
                    "(mouseleave)": "onMouseLeave()"
                }
            },] },
];
/** @nocollapse */
Tooltip.ctorParameters = function () { return []; };
Tooltip.propDecorators = {
    'direction': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTooltipDirection",] },],
    'size': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrTooltipSize",] },],
};
//# sourceMappingURL=tooltip.js.map

/***/ }),
/* 128 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrTooltipModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_popover_module__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__index__ = __webpack_require__(125);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




var ClrTooltipModule = (function () {
    function ClrTooltipModule() {
    }
    return ClrTooltipModule;
}());

ClrTooltipModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__common_popover_module__["a" /* ClrCommonPopoverModule */]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_3__index__["a" /* TOOLTIP_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_3__index__["a" /* TOOLTIP_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrTooltipModule.ctorParameters = function () { return []; };
//# sourceMappingURL=tooltip.module.js.map

/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LOADING_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loading__ = __webpack_require__(130);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__loading__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__loading_listener__ = __webpack_require__(32);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__loading_listener__["a"]; });



var LOADING_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__loading__["a" /* Loading */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Loading; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__loading_listener__ = __webpack_require__(32);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var Loading = (function () {
    // We find the first parent that handles something loading
    function Loading(listener) {
        this.listener = listener;
        this._loading = false;
    }
    Object.defineProperty(Loading.prototype, "loading", {
        get: function () {
            return this._loading;
        },
        set: function (value) {
            value = !!value;
            if (value === this._loading) {
                return;
            }
            this._loading = value;
            if (this.listener) {
                if (value) {
                    this.listener.startLoading();
                }
                else {
                    this.listener.doneLoading();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Loading.prototype.ngOnDestroy = function () {
        this.loading = false;
    };
    return Loading;
}());

Loading.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrLoading]"
            },] },
];
/** @nocollapse */
Loading.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__loading_listener__["a" /* LoadingListener */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] },] },
]; };
Loading.propDecorators = {
    'loading': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrLoading",] },],
};
//# sourceMappingURL=loading.js.map

/***/ }),
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScrollingService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(143);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var ScrollingService = (function () {
    function ScrollingService(_document) {
        this._document = _document;
    }
    ScrollingService.prototype.stopScrolling = function () {
        this._document.body.classList.add("no-scrolling");
    };
    ScrollingService.prototype.resumeScrolling = function () {
        if (this._document.body.classList.contains("no-scrolling")) {
            this._document.body.classList.remove("no-scrolling");
        }
    };
    return ScrollingService;
}());

ScrollingService.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
ScrollingService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["DOCUMENT"],] },] },
]; };
//# sourceMappingURL=scrolling-service.js.map

/***/ }),
/* 132 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OLD_WIZARD_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wizard__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wizard_step__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wizard_page__ = __webpack_require__(52);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__wizard__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__wizard_step__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_2__wizard_page__["a"]; });
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */






var OLD_WIZARD_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__wizard__["a" /* WizardDeprecated */],
    __WEBPACK_IMPORTED_MODULE_1__wizard_step__["a" /* WizardStep */],
    __WEBPACK_IMPORTED_MODULE_2__wizard_page__["a" /* WizardPageDeprecated */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrWizardDeprecatedModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modal_modal_module__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__emphasis_alert_alert_module__ = __webpack_require__(22);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





var ClrWizardDeprecatedModule = (function () {
    function ClrWizardDeprecatedModule() {
    }
    return ClrWizardDeprecatedModule;
}());

ClrWizardDeprecatedModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_3__modal_modal_module__["a" /* ClrModalModule */],
                    __WEBPACK_IMPORTED_MODULE_4__emphasis_alert_alert_module__["a" /* ClrAlertModule */]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_2__index__["a" /* OLD_WIZARD_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_2__index__["a" /* OLD_WIZARD_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrWizardDeprecatedModule.ctorParameters = function () { return []; };
//# sourceMappingURL=wizard-deprecated.module.js.map

/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WIZARD_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wizard__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wizard_page__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wizard_stepnav__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__wizard_stepnav_item__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__wizard_button__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__wizard_header_action__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__wizard_custom_tags__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__directives_page_title__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__directives_page_navtitle__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__directives_page_buttons__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__directives_page_header_actions__ = __webpack_require__(56);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__wizard__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__wizard_page__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_2__wizard_stepnav__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_3__wizard_stepnav_item__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_4__wizard_button__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_4__wizard_button__["b"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "h", function() { return __WEBPACK_IMPORTED_MODULE_4__wizard_button__["c"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "i", function() { return __WEBPACK_IMPORTED_MODULE_5__wizard_header_action__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "j", function() { return __WEBPACK_IMPORTED_MODULE_6__wizard_custom_tags__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "k", function() { return __WEBPACK_IMPORTED_MODULE_7__directives_page_title__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "l", function() { return __WEBPACK_IMPORTED_MODULE_8__directives_page_navtitle__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "m", function() { return __WEBPACK_IMPORTED_MODULE_9__directives_page_buttons__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "n", function() { return __WEBPACK_IMPORTED_MODULE_10__directives_page_header_actions__["a"]; });
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */






//directives











// directives





var WIZARD_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__wizard__["a" /* Wizard */],
    __WEBPACK_IMPORTED_MODULE_1__wizard_page__["a" /* WizardPage */],
    __WEBPACK_IMPORTED_MODULE_2__wizard_stepnav__["a" /* WizardStepnav */],
    __WEBPACK_IMPORTED_MODULE_3__wizard_stepnav_item__["a" /* WizardStepnavItem */],
    __WEBPACK_IMPORTED_MODULE_4__wizard_button__["c" /* WizardButton */],
    __WEBPACK_IMPORTED_MODULE_5__wizard_header_action__["a" /* WizardHeaderAction */],
    __WEBPACK_IMPORTED_MODULE_6__wizard_custom_tags__["a" /* WizardCustomTags */],
    __WEBPACK_IMPORTED_MODULE_7__directives_page_title__["a" /* WizardPageTitleDirective */],
    __WEBPACK_IMPORTED_MODULE_8__directives_page_navtitle__["a" /* WizardPageNavTitleDirective */],
    __WEBPACK_IMPORTED_MODULE_9__directives_page_buttons__["a" /* WizardPageButtonsDirective */],
    __WEBPACK_IMPORTED_MODULE_10__directives_page_header_actions__["a" /* WizardPageHeaderActionsDirective */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 135 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DEFAULT_BUTTON_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CUSTOM_BUTTON_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return WizardButton; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_wizard_navigation__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_button_hub__ = __webpack_require__(34);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var DEFAULT_BUTTON_TYPES = {
    cancel: "cancel",
    previous: "previous",
    next: "next",
    finish: "finish",
    danger: "danger"
};
var CUSTOM_BUTTON_TYPES = {
    cancel: "custom-cancel",
    previous: "custom-previous",
    next: "custom-next",
    finish: "custom-finish",
    danger: "custom-danger"
};
var WizardButton = (function () {
    function WizardButton(navService, buttonService) {
        this.navService = navService;
        this.buttonService = buttonService;
        this.type = "";
        this.disabled = false;
        this.hidden = false;
        // EventEmitter which is emitted when a button is clicked.
        this.wasClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
    }
    WizardButton.prototype.checkDefaultAndCustomType = function (valueToCheck, typeToLookUp) {
        if (valueToCheck === void 0) { valueToCheck = ""; }
        if (DEFAULT_BUTTON_TYPES[typeToLookUp] === valueToCheck) {
            return true;
        }
        if (CUSTOM_BUTTON_TYPES[typeToLookUp] === valueToCheck) {
            return true;
        }
        return false;
    };
    Object.defineProperty(WizardButton.prototype, "isCancel", {
        get: function () {
            return this.checkDefaultAndCustomType(this.type, "cancel");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardButton.prototype, "isNext", {
        get: function () {
            return this.checkDefaultAndCustomType(this.type, "next");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardButton.prototype, "isPrevious", {
        get: function () {
            return this.checkDefaultAndCustomType(this.type, "previous");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardButton.prototype, "isFinish", {
        get: function () {
            return this.checkDefaultAndCustomType(this.type, "finish");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardButton.prototype, "isDanger", {
        get: function () {
            return this.checkDefaultAndCustomType(this.type, "danger");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardButton.prototype, "isPrimaryAction", {
        get: function () {
            return this.isNext || this.isDanger || this.isFinish;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardButton.prototype, "isDisabled", {
        get: function () {
            // dealing with negatives here. cognitively easier to think of it like this...
            var disabled = true;
            var nav = this.navService;
            var page = this.navService.currentPage;
            if (this.disabled || !page) {
                return true;
            }
            if (this.isCancel) {
                return !disabled;
            }
            if (this.isPrevious && (nav.currentPageIsFirst || page.previousStepDisabled)) {
                return disabled;
            }
            if (this.isDanger && !page.readyToComplete) {
                return disabled;
            }
            if (this.isNext && (nav.currentPageIsLast || !page.readyToComplete)) {
                return disabled;
            }
            if (this.isFinish && (!nav.currentPageIsLast || !page.readyToComplete)) {
                return disabled;
            }
            return !disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardButton.prototype, "isHidden", {
        get: function () {
            // dealing with negatives here. cognitively easier to think of it like this...
            var hidden = true;
            var nav = this.navService;
            if (this.hidden) {
                return true;
            }
            if (this.isCancel) {
                return !hidden;
            }
            if (this.isPrevious && nav.currentPageIsFirst) {
                return hidden;
            }
            if (this.isNext && nav.currentPageIsLast) {
                return hidden;
            }
            if (this.isFinish && !nav.currentPageIsLast) {
                return hidden;
            }
            return !hidden;
        },
        enumerable: true,
        configurable: true
    });
    WizardButton.prototype.click = function () {
        if (this.isDisabled) {
            return;
        }
        this.wasClicked.emit(this.type);
        this.buttonService.buttonClicked(this.type);
    };
    return WizardButton;
}());

WizardButton.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-wizard-button",
                template: "\n        <button class=\"btn clr-wizard-btn\"\n            [class.btn-link]=\"isCancel\"\n            [class.clr-wizard-btn--tertiary]=\"isCancel\"\n            [class.btn-outline]=\"isPrevious\"\n            [class.clr-wizard-btn--secondary]=\"isPrevious\"\n            [class.btn-primary]=\"isPrimaryAction\"\n            [class.clr-wizard-btn--primary]=\"isPrimaryAction\"\n            [class.btn-success]=\"isFinish\"\n            [class.btn-danger]=\"isDanger\"\n            [class.disabled]=\"isDisabled\"\n            (click)=\"click()\">\n            <ng-content></ng-content>\n        </button>\n    ",
                host: {
                    "class": "clr-wizard-btn-wrapper",
                    "[attr.aria-hidden]": "isHidden"
                },
                styles: ['[aria-hidden="true"] { display: none; }']
            },] },
];
/** @nocollapse */
WizardButton.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_wizard_navigation__["a" /* WizardNavigationService */], },
    { type: __WEBPACK_IMPORTED_MODULE_2__providers_button_hub__["a" /* ButtonHubService */], },
]; };
WizardButton.propDecorators = {
    'type': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["type",] },],
    'disabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardButtonDisabled",] },],
    'hidden': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardButtonHidden",] },],
    'wasClicked': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardButtonClicked",] },],
};
//# sourceMappingURL=wizard-button.js.map

/***/ }),
/* 136 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardCustomTags; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var WizardCustomTags = (function () {
    function WizardCustomTags() {
    }
    return WizardCustomTags;
}());

// No behavior
// The only purpose is to "declare" the tag in Angular
WizardCustomTags.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: "clr-wizard-title, clr-wizard-pagetitle" },] },
];
/** @nocollapse */
WizardCustomTags.ctorParameters = function () { return []; };
//# sourceMappingURL=wizard-custom-tags.js.map

/***/ }),
/* 137 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardStepnavItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_wizard_navigation__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_page_collection__ = __webpack_require__(16);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var WizardStepnavItem = (function () {
    function WizardStepnavItem(navService, pageCollection) {
        this.navService = navService;
        this.pageCollection = pageCollection;
    }
    WizardStepnavItem.prototype.pageGuard = function () {
        if (!this.page) {
            throw new Error("Wizard stepnav item is not associated with a wizard page.");
        }
    };
    Object.defineProperty(WizardStepnavItem.prototype, "id", {
        get: function () {
            this.pageGuard();
            return this.pageCollection.getStepItemIdForPage(this.page);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardStepnavItem.prototype, "isDisabled", {
        get: function () {
            this.pageGuard();
            return this.page.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardStepnavItem.prototype, "isCurrent", {
        get: function () {
            this.pageGuard();
            return this.page.current;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardStepnavItem.prototype, "isComplete", {
        get: function () {
            this.pageGuard();
            return this.page.completed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WizardStepnavItem.prototype, "canNavigate", {
        get: function () {
            this.pageGuard();
            return this.pageCollection.previousPageIsCompleted(this.page);
        },
        enumerable: true,
        configurable: true
    });
    WizardStepnavItem.prototype.click = function () {
        this.pageGuard();
        // if we click on our own stepnav or a disabled stepnav, we don't want to do anything
        if (this.isDisabled || this.isCurrent) {
            return;
        }
        this.navService.goTo(this.page);
    };
    return WizardStepnavItem;
}());

WizardStepnavItem.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "[clr-wizard-stepnav-item]",
                template: "\n        <button type=\"button\" class=\"btn btn-link clr-wizard-stepnav-link\" (click)=\"click()\">\n            <ng-template [ngTemplateOutlet]=\"page.navTitle\"></ng-template>\n        </button>\n    ",
                host: {
                    "[id]": "id",
                    "[attr.aria-selected]": "isCurrent",
                    "[attr.aria-controls]": "id",
                    "role": "presentation",
                    "[class.clr-nav-link]": "true",
                    "[class.nav-item]": "true",
                    "[class.active]": "isCurrent",
                    "[class.disabled]": "isDisabled",
                    "[class.no-click]": "!canNavigate",
                    "[class.complete]": "isComplete"
                }
            },] },
];
/** @nocollapse */
WizardStepnavItem.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_wizard_navigation__["a" /* WizardNavigationService */], },
    { type: __WEBPACK_IMPORTED_MODULE_2__providers_page_collection__["a" /* PageCollectionService */], },
]; };
WizardStepnavItem.propDecorators = {
    'page': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["page",] },],
};
//# sourceMappingURL=wizard-stepnav-item.js.map

/***/ }),
/* 138 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardStepnav; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_page_collection__ = __webpack_require__(16);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var WizardStepnav = (function () {
    function WizardStepnav(pageService) {
        this.pageService = pageService;
    }
    return WizardStepnav;
}());

WizardStepnav.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-wizard-stepnav",
                template: "\n        <ol class=\"clr-wizard-stepnav-list\" role=\"tablist\">\n            <li *ngFor=\"let page of pageService.pages\" clr-wizard-stepnav-item \n            [page]=\"page\" class=\"clr-wizard-stepnav-item\"></li>\n        </ol>\n    ",
                host: {
                    "class": "clr-wizard-stepnav"
                }
            },] },
];
/** @nocollapse */
WizardStepnav.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__providers_page_collection__["a" /* PageCollectionService */], },
]; };
//# sourceMappingURL=wizard-stepnav.js.map

/***/ }),
/* 139 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Wizard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wizard_page__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wizard_header_action__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modal_utils_ghost_page_animations__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_wizard_navigation__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_page_collection__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_button_hub__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_header_actions__ = __webpack_require__(184);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */




// providers




/**
 * The Wizard component
 *
 * @export
 * @class Wizard
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @implements {AfterContentInit}
 * @implements {DoCheck}
 */
var Wizard = (function () {
    /**
     * Creates an instance of Wizard.
     * @param {WizardNavigationService} navService
     * @param {PageCollectionService} pageCollection
     * @param {ButtonHubService} buttonService
     * @param {HeaderActionService} headerActionService
     * @param {ElementRef} elementRef
     * @param {IterableDiffers} differs
     *
     * @memberof Wizard
     */
    function Wizard(navService, pageCollection, buttonService, headerActionService, elementRef, differs) {
        var _this = this;
        this.navService = navService;
        this.pageCollection = pageCollection;
        this.buttonService = buttonService;
        this.headerActionService = headerActionService;
        this.elementRef = elementRef;
        this.differs = differs;
        /**
         * Contains the size defined by the clrWizardSize input
         * @name size
         * @type {string}
         * @default "xl"
         * @memberof Wizard
         */
        this.size = "xl";
        /**
         * The property that reveals the ghost pages in the wizard. Set through the
         * clrWizardShowGhostPages input.
         *
         * @name showGhostPages
         * @default false
         * @type {boolean}
         * @memberof Wizard
         */
        this.showGhostPages = false;
        this._forceForward = false;
        /**
         * Tells the modal part of the wizard whether it should have a close "X"
         * in the top right corner. Set with the clrWizardClosable input.
         *
         * @name closable
         * @type {boolean}
         * @memberof Wizard
         */
        this.closable = true;
        /**
         * Toggles open/close of the wizard component. Set using the clrWizardOpen
         * input.
         *
         * @name _open
         * @type {boolean}
         * @memberof Wizard
         */
        this._open = false;
        /**
         * Emits when the wizard is opened or closed. Emits through the
         * clrWizardOpenChange output. Works in conjunction with the
         * clrWizardOpen binding so you can use...
         *
         * <clr-wizard [(clrWizardOpen)]="blah"
         * ...or...
         * <clr-wizard [clrWizardOpen]="something" (clrWizardOpenChange)="doSomethign($event)">
         *
         * ...for two-way binding.
         *
         * @name _openChanged
         * @type {EventEmitter<boolean>}
         * @memberof Wizard
         */
        this._openChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        /**
         * Emits when the wizard is canceled. Can be observed through the clrWizardOnCancel
         * output.
         *
         * Can be combined with the clrWizardPreventDefaultCancel input to create
         * wizard-level custom cancel routines.
         *
         * @name onCancel
         * @type {EventEmitter<any>}
         * @memberof Wizard
         */
        this.onCancel = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        /**
         * Emits when the wizard is completed. Can be observed through the clrWizardOnFinish
         * output.
         *
         * Can be combined with the clrWizardPreventDefaultNext input to create
         * wizard-level custom completion routines.
         *
         * @name onFinish
         * @type {EventEmitter<any>}
         * @memberof Wizard
         */
        this.wizardFinished = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        /**
         * Emits when the wizard is reset. See .reset(). Can be observed through
         * the clrWizardOnReset output.
         *
         * @name onReset
         * @type {EventEmitter<any>}
         * @memberof Wizard
         */
        this.onReset = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        /**
         * Emits when the current page has changed. Can be observed through the clrWizardCurrentPageChanged
         * output. This can happen on .next() or .previous().
         * Useful for non-blocking validation.
         *
         * @name currentPageChanged
         * @type {EventEmitter<any>}
         * @memberof Wizard
         */
        this.currentPageChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        /**
         * Emits when the wizard moves to the next page. Can be observed through the clrWizardOnNext
         * output.
         *
         * Can be combined with the clrWizardPreventDefaultNext input to create
         * wizard-level custom navigation routines, which are useful for validation.
         *
         * @name onMoveNext
         * @type {EventEmitter<any>}
         * @memberof Wizard
         */
        this.onMoveNext = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        /**
         * Emits when the wizard moves to the previous page. Can be observed through the
         * clrWizardOnPrevious output.
         *
         * Can be useful for validation.
         *
         * @name onMovePrevious
         * @type {EventEmitter<any>}
         * @memberof Wizard
         */
        this.onMovePrevious = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"](false);
        this._stopNext = false;
        this._stopCancel = false;
        /**
         * Used only to communicate to the underlying modal that animations are not
         * wanted. Primary use is for the display of static/inline wizards.
         *
         * Set using clrWizardPreventModalAnimation input. But you should never set it.
         *
         * @name _stopModalAnimations
         * @type {boolean}
         * @memberof Wizard
         */
        this._stopModalAnimations = false;
        this.goNextSubscription = this.navService.movedToNextPage.subscribe(function () {
            _this.onMoveNext.emit();
        });
        this.goPreviousSubscription = this.navService.movedToPreviousPage.subscribe(function () {
            _this.onMovePrevious.emit();
        });
        this.cancelSubscription = this.navService.notifyWizardCancel.subscribe(function () {
            _this.checkAndCancel();
        });
        this.wizardFinishedSubscription = this.navService.wizardFinished.subscribe(function () {
            if (!_this.stopNext) {
                _this.forceFinish();
            }
            _this.wizardFinished.emit();
        });
        this.differ = differs.find([]).create(null);
    }
    Object.defineProperty(Wizard.prototype, "forceForward", {
        get: function () {
            return this._forceForward;
        },
        /**
         * Resets page completed states when navigating backwards. Can be set using
         * the clrWizardForceForwardNavigation input.
         *
         * @name forceForward
         * @type {boolean}
         * @default false
         * @memberof Wizard
         */
        set: function (value) {
            this._forceForward = !!value;
            this.navService.forceForwardNavigation = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wizard.prototype, "stopNext", {
        get: function () {
            return this._stopNext;
        },
        /**
         * Prevents Wizard from moving to the next page or closing itself on finishing.
         * Set using the clrWizardPreventDefaultNext input.
         *
         * Note that using stopNext will require you to create your own calls to
         * .next() and .finish() in your host component to make the Wizard work as
         * expected.
         *
         * Primarily used for validation.
         *
         * @name stopNext
         * @type {boolean}
         * @memberof Wizard
         */
        set: function (value) {
            this._stopNext = !!value;
            this.navService.wizardHasAltNext = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wizard.prototype, "stopCancel", {
        get: function () {
            return this._stopCancel;
        },
        /**
         * Prevents Wizard from closing when the cancel button or close "X" is clicked.
         * Set using the clrWizardPreventDefaultCancel input.
         *
         * Note that using stopCancel will require you to create your own calls to
         * .close() in your host component to make the Wizard work as expected.
         *
         * Useful for doing checks or prompts before closing a Wizard.
         *
         * @name stopCancel
         * @type {boolean}
         * @memberof Wizard
         */
        set: function (value) {
            this._stopCancel = !!value;
            this.navService.wizardHasAltCancel = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wizard.prototype, "stopModalAnimations", {
        get: function () {
            if (this._stopModalAnimations) {
                return "true";
            }
            return "false";
        },
        enumerable: true,
        configurable: true
    });
    Wizard.prototype.ngOnInit = function () {
        var _this = this;
        this.currentPageSubscription = this.navService.currentPageChanged.subscribe(function (page) {
            _this.setGhostPages();
            _this.currentPageChanged.emit();
        });
    };
    Wizard.prototype.ngOnDestroy = function () {
        this.goNextSubscription.unsubscribe();
        this.goPreviousSubscription.unsubscribe();
        this.cancelSubscription.unsubscribe();
        this.currentPageSubscription.unsubscribe();
        this.wizardFinishedSubscription.unsubscribe();
    };
    /**
     * Sets up references that are needed by the providers.
     *
     * @name ngAfterContentInit
     * @memberof Wizard
     */
    Wizard.prototype.ngAfterContentInit = function () {
        var navService = this.navService;
        this.pageCollection.pages = this.pages;
        this.headerActionService.wizardHeaderActions = this.headerActions;
        if (this.showGhostPages) {
            navService.hideWizardGhostPages = false;
            this.deactivateGhostPages();
        }
    };
    /**
     * Used for keeping track of when pages are added or removed from this.pages
     *
     * @name ngDoCheck
     * @memberof Wizard
     */
    Wizard.prototype.ngDoCheck = function () {
        var _this = this;
        var changes = this.differ.diff(this.pages);
        if (changes) {
            changes.forEachAddedItem(function (r) {
                _this.navService.updateNavigation();
            });
            changes.forEachRemovedItem(function (r) {
                _this.navService.updateNavigation();
            });
        }
    };
    Object.defineProperty(Wizard.prototype, "isStatic", {
        /**
         * Convenient property for determining whether a wizard is static/in-line or not.
         *
         * @name isStatic
         * @readonly
         * @type {boolean}
         * @memberof Wizard
         */
        get: function () {
            return this.elementRef.nativeElement.classList.contains("clr-wizard--inline");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wizard.prototype, "currentPage", {
        /**
         * As a getter, current page is a convenient way to retrieve the current page from
         * the WizardNavigationService.
         *
         * As a setter, current page accepts a WizardPage and passes it to WizardNavigationService
         * to be made the current page. currentPage performs checks to make sure it can navigate
         * to the designated page.
         *
         * @name currentPage
         * @type {WizardPage}
         * @memberof Wizard
         */
        get: function () {
            return this.navService.currentPage;
        },
        set: function (page) {
            this.navService.goTo(page, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wizard.prototype, "isLast", {
        /**
         * Convenient property for determining if the current page is the last page of
         * the wizard.
         *
         * @name isLast
         * @readonly
         * @type {boolean}
         * @memberof Wizard
         */
        get: function () {
            return this.navService.currentPageIsLast;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wizard.prototype, "isFirst", {
        /**
         * Convenient property for determining if the current page is the first page of
         * the wizard.
         *
         * @name isFirst
         * @readonly
         * @type {boolean}
         * @memberof Wizard
         */
        get: function () {
            return this.navService.currentPageIsFirst;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Performs the actions needed to open the wizard. If there is no current
     * page defined, sets the first page in the wizard to be current.
     *
     * @name open
     * @memberof Wizard
     */
    Wizard.prototype.open = function () {
        this._open = true;
        if (!this.currentPage) {
            this.navService.setFirstPageCurrent();
        }
        this.setGhostPages();
        this._openChanged.emit(true);
    };
    /**
     * Does the work involved with closing the wizard. Call this directly instead
     * of cancel() to implement alternative cancel functionality.
     *
     * @name close
     * @memberof Wizard
     */
    Wizard.prototype.close = function () {
        this._open = false;
        this.deactivateGhostPages();
        this._openChanged.emit(false);
    };
    /**
     * Convenient function that can be used to open and close the wizard. It operates
     * by checking a Boolean parameter. If true, the wizard is opened. If false,
     * it is closed.
     *
     * There is no default value for this parameter, so by default the wizard will
     * close if invoked with no parameter.
     *
     * @name toggle
     * @param {boolean} value
     *
     * @memberof Wizard
     */
    Wizard.prototype.toggle = function (value) {
        if (value) {
            this.open();
        }
        else {
            this.close();
        }
    };
    /**
     * DEPRECATED. Moves the wizard to the previous page. Carried over from legacy.
     *
     * It is recommended that you use previous() instead.
     *
     * @name prev
     * @memberof Wizard
     */
    Wizard.prototype.prev = function () {
        this.previous();
    };
    /**
     * Moves the wizard to the previous page.
     *
     * @name previous
     * @memberof Wizard
     */
    Wizard.prototype.previous = function () {
        this.navService.previous();
    };
    /**
     * Includes a Boolean parameter that will skip checks and event emissions.
     * If true, the wizard will move to the next page regardless of the state of
     * its current page. This is useful for alternative navigation where event
     * emissions have already been done and firing them again may cause an event loop.
     *
     * Generally, with alternative navigation, users are supplying their own checks
     * and validation. So there is no point in superseding their business logic
     * with our default behavior.
     *
     * If false, the wizard will execute default checks and emit events as normal.
     * This is useful for custom buttons or programmatic workflows that are not
     * executing the wizards default checks and emissions. It is another way to
     * navigate without having to rewrite the wizard’s default functionality
     * from scratch.
     *
     * By default, next() does not execute event emissions or checks because the
     * 80% case is that this method will be called as part of an alternative
     * navigation with clrWizardPreventDefaultNext.
     *
     * @name next
     * @memberof Wizard
     */
    Wizard.prototype.next = function (skipChecksAndEmits) {
        if (skipChecksAndEmits === void 0) { skipChecksAndEmits = true; }
        if (skipChecksAndEmits) {
            this.forceNext();
        }
        else {
            this.navService.next();
        }
    };
    /**
     * Includes a Boolean parameter that will skip checks and event emissions.
     * If true, the wizard will  complete and close regardless of the state of
     * its current page. This is useful for alternative navigation where event
     * emissions have already been done and firing them again may cause an event loop.
     *
     * If false, the wizard will execute default checks and emit events before
     * completing and closing.
     *
     * By default, finish() does not execute event emissions or checks because the
     * 80% case is that this method will be called as part of an alternative
     * navigation with clrWizardPreventDefaultNext.
     *
     * @name finish
     * @memberof Wizard
     */
    Wizard.prototype.finish = function (skipChecksAndEmits) {
        if (skipChecksAndEmits === void 0) { skipChecksAndEmits = true; }
        if (skipChecksAndEmits) {
            this.forceFinish();
        }
        else {
            this.navService.finish();
        }
    };
    /**
     * Does the work of finishing up the wizard and closing it but doesn't do the
     * checks and emissions that other paths do. Good for a last step in an
     * alternate workflow.
     *
     * Does the same thing as calling Wizard.finish(true) or Wizard.finish()
     * without a parameter.
     *
     * @name forceFinish
     * @memberof Wizard
     */
    Wizard.prototype.forceFinish = function () {
        this.deactivateGhostPages();
        this.close();
    };
    /**
     * Does the work of moving the wizard to the next page without the
     * checks and emissions that other paths do. Good for a last step in an
     * alternate workflow.
     *
     * Does the same thing as calling Wizard.next(true) or Wizard.next()
     * without a parameter.
     *
     * @name forceNext
     * @memberof Wizard
     */
    Wizard.prototype.forceNext = function () {
        this.navService.forceNext();
    };
    /**
     * Initiates the functionality that cancels and closes the wizard.
     *
     * Do not use this for an override of the cancel the functionality
     * with clrWizardPreventDefaultCancel, clrWizardPreventPageDefaultCancel,
     * or clrWizardPagePreventDefault because it will initiate the same checks
     * and event emissions that invoked your event handler.
     *
     * Use Wizard.close() instead.
     *
     * @name cancel
     * @memberof Wizard
     */
    Wizard.prototype.cancel = function () {
        this.navService.cancel();
    };
    /**
     * Overrides behavior of the underlying modal to avoid collisions with
     * alternative cancel functionality.
     *
     * In most cases, use Wizard.cancel() instead.
     *
     * @name modalCancel
     * @memberof Wizard
     */
    Wizard.prototype.modalCancel = function () {
        this.checkAndCancel();
    };
    /**
     * Checks for alternative cancel flows defined at the current page or
     * wizard level. Performs a canceled if not. Emits events that initiate
     * the alternative cancel outputs (clrWizardPageOnCancel and
     * clrWizardOnCancel) if so.
     *
     * @name checkAndCancel
     * @memberof Wizard
     */
    Wizard.prototype.checkAndCancel = function () {
        var currentPage = this.currentPage;
        var currentPageHasOverrides = currentPage.stopCancel || currentPage.preventDefault;
        currentPage.pageOnCancel.emit();
        if (!currentPageHasOverrides) {
            this.onCancel.emit();
        }
        if (!this.stopCancel && !currentPageHasOverrides) {
            this.close();
        }
    };
    /**
     * Accepts the wizard ID as a string parameter and calls to WizardNavigationService
     * to navigate to the page with that ID. Navigation will invoke the wizard’s default
     * checks and event emissions.
     *
     * Probably less useful than calling directly to Wizard.navService.goTo() because the
     * nav service method can accept either a string ID or a page object.
     *
     * The format of the expected ID parameter can be found in the return of the
     * WizardPage.id getter, usually prefixed with “clr-wizard-page-“ and then either a
     * numeric ID or the ID specified for the WizardPage component’s “id” input.
     *
     * @name goTo
     * @param {string} pageId
     * @returns {void}
     *
     * @memberof Wizard
     */
    Wizard.prototype.goTo = function (pageId) {
        if (!pageId) {
            return;
        }
        this.navService.goTo(pageId);
    };
    /**
     * A convenience function that calls to PageCollectionService.reset() and emits the
     * Wizard.onReset event.
     *
     * Reset sets all WizardPages to incomplete and sets the first page in the Wizard to
     * be the current page, essentially resetting the wizard navigation.
     *
     * Users would then use the onReset event to reset the data or model in their
     * host component.
     *
     * It could be useful to call a reset without firing the onReset event. To do this,
     * just call Wizard.pageCollection.reset() directly.
     *
     * @name reset
     * @memberof Wizard
     */
    Wizard.prototype.reset = function () {
        this.pageCollection.reset();
        this.onReset.next();
    };
    Object.defineProperty(Wizard.prototype, "ghostPageState", {
        /**
         * A convenience getter to retrieve the ghost Page animation state from
         * WizardNavigationService.
         *
         * @name ghostPageState
         * @readonly
         * @type {string}
         * @memberof Wizard
         */
        get: function () {
            return this.navService.wizardGhostPageState;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Convenience method that resets the ghost page animation.
     *
     * @name deactivateGhostPages
     * @memberof Wizard
     */
    Wizard.prototype.deactivateGhostPages = function () {
        this.setGhostPages("deactivate");
    };
    /**
     * Manages the state of the ghost page animation based on the location
     * of the current page in the workflow.
     *
     * Accepts an optional string parameter that can reset the ghost page
     * animation to its closed state.
     *
     * @name setGhostPages
     * @param {string} [deactivateOrNot=""]
     * @requires module:../modal/utils/ghost-page-animations
     * @requires ghost-page-animations#GHOST_PAGE_ANIMATION
     *
     * @memberof Wizard
     */
    Wizard.prototype.setGhostPages = function (deactivateOrNot) {
        if (deactivateOrNot === void 0) { deactivateOrNot = ""; }
        var navService = this.navService;
        var ghostpageStates = __WEBPACK_IMPORTED_MODULE_3__modal_utils_ghost_page_animations__["a" /* GHOST_PAGE_ANIMATION */].STATES;
        if (this.showGhostPages) {
            if (deactivateOrNot === "deactivate") {
                navService.wizardGhostPageState = ghostpageStates.NO_PAGES;
            }
            else if (navService.currentPageIsLast) {
                navService.wizardGhostPageState = ghostpageStates.LAST_PAGE;
            }
            else if (navService.currentPageIsNextToLast) {
                navService.wizardGhostPageState = ghostpageStates.NEXT_TO_LAST_PAGE;
            }
            else {
                navService.wizardGhostPageState = ghostpageStates.ALL_PAGES;
            }
        }
    };
    return Wizard;
}());

Wizard.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-wizard",
                providers: [__WEBPACK_IMPORTED_MODULE_4__providers_wizard_navigation__["a" /* WizardNavigationService */], __WEBPACK_IMPORTED_MODULE_5__providers_page_collection__["a" /* PageCollectionService */], __WEBPACK_IMPORTED_MODULE_6__providers_button_hub__["a" /* ButtonHubService */], __WEBPACK_IMPORTED_MODULE_7__providers_header_actions__["a" /* HeaderActionService */]],
                template: "\n      <!--\n      ~ Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.\n      ~ This software is released under MIT license.\n      ~ The full license information can be found in LICENSE in the root directory of this project.\n      -->\n\n      <clr-modal \n          [clrModalOpen]=\"_open\"\n          [clrModalSize]=\"size\"\n          [clrModalClosable]=\"closable\"\n          [clrModalStaticBackdrop]=\"true\"\n          [clrModalSkipAnimation]=\"stopModalAnimations\"\n          [clrModalGhostPageState]=\"ghostPageState\"\n          [clrModalOverrideScrollService]=\"isStatic\"\n          [clrModalPreventClose]=\"true\"\n          (clrModalAlternateClose)=\"modalCancel()\">\n\n          <nav class=\"modal-nav clr-wizard-stepnav-wrapper\">\n              <h3 class=\"clr-wizard-title\"><ng-content select=\"clr-wizard-title\"></ng-content></h3>\n              <clr-wizard-stepnav></clr-wizard-stepnav>\n          </nav>\n\n          <h3 class=\"modal-title\">\n              <span class=\"modal-title-text\">\n                  <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n              </span>\n\n              <div class=\"modal-header-actions-wrapper\" *ngIf=\"headerActionService.displayHeaderActionsWrapper\">\n                  <div *ngIf=\"headerActionService.showWizardHeaderActions\">\n                      <ng-content select=\"clr-wizard-header-action\"></ng-content>\n                  </div>\n                  <div *ngIf=\"headerActionService.currentPageHasHeaderActions\">\n                      <ng-template [ngTemplateOutlet]=\"navService.currentPage.headerActions\"></ng-template>\n                  </div>\n              </div>\n          </h3>\n\n          <div class=\"modal-body\">\n              <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n                  <ng-content></ng-content>\n              </main>\n          </div>\n          <div class=\"modal-footer clr-wizard-footer\">\n              <div class=\"clr-wizard-footer-buttons\">\n                  <div *ngIf=\"navService.currentPage && !navService.currentPage.hasButtons\"\n                      class=\"clr-wizard-footer-buttons-wrapper\">\n                      <ng-content select=\"clr-wizard-button\"></ng-content>\n                  </div>\n                  <div *ngIf=\"navService.currentPage && navService.currentPage.hasButtons\"\n                      class=\"clr-wizard-footer-buttons-wrapper\">\n                      <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n                  </div>\n              </div>\n          </div>\n      </clr-modal>\n    ",
                host: {
                    "[class.clr-wizard]": "true",
                    "[class.wizard-md]": "size == 'md'",
                    "[class.wizard-lg]": "size == 'lg'",
                    "[class.wizard-xl]": "size == 'xl'",
                    "[class.lastPage]": "navService.currentPageIsLast",
                    "[class.clr-wizard--ghosted]": "showGhostPages"
                }
            },] },
];
/** @nocollapse */
Wizard.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_4__providers_wizard_navigation__["a" /* WizardNavigationService */], },
    { type: __WEBPACK_IMPORTED_MODULE_5__providers_page_collection__["a" /* PageCollectionService */], },
    { type: __WEBPACK_IMPORTED_MODULE_6__providers_button_hub__["a" /* ButtonHubService */], },
    { type: __WEBPACK_IMPORTED_MODULE_7__providers_header_actions__["a" /* HeaderActionService */], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["IterableDiffers"], },
]; };
Wizard.propDecorators = {
    'size': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardSize",] },],
    'showGhostPages': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardShowGhostPages",] },],
    'forceForward': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardForceForwardNavigation",] },],
    'closable': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardClosable",] },],
    '_open': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardOpen",] },],
    '_openChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardOpenChange",] },],
    'onCancel': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardOnCancel",] },],
    'wizardFinished': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardOnFinish",] },],
    'onReset': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardOnReset",] },],
    'pages': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_1__wizard_page__["a" /* WizardPage */],] },],
    'headerActions': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_2__wizard_header_action__["a" /* WizardHeaderAction */],] },],
    'currentPageChanged': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardCurrentPageChanged",] },],
    'onMoveNext': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardOnNext",] },],
    'onMovePrevious': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ["clrWizardOnPrevious",] },],
    'stopNext': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPreventDefaultNext",] },],
    'stopCancel': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPreventDefaultCancel",] },],
    '_stopModalAnimations': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrWizardPreventModalAnimation",] },],
};
//# sourceMappingURL=wizard.js.map

/***/ }),
/* 140 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrWizardModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modal_modal_module__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__emphasis_alert_alert_module__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__index__ = __webpack_require__(134);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





var ClrWizardModule = (function () {
    function ClrWizardModule() {
    }
    return ClrWizardModule;
}());

ClrWizardModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [
                    __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                    __WEBPACK_IMPORTED_MODULE_2__modal_modal_module__["a" /* ClrModalModule */],
                    __WEBPACK_IMPORTED_MODULE_3__emphasis_alert_alert_module__["a" /* ClrAlertModule */]
                ],
                declarations: [
                    __WEBPACK_IMPORTED_MODULE_4__index__["a" /* WIZARD_DIRECTIVES */]
                ],
                exports: [
                    __WEBPACK_IMPORTED_MODULE_4__index__["a" /* WIZARD_DIRECTIVES */]
                ]
            },] },
];
/** @nocollapse */
ClrWizardModule.ctorParameters = function () { return []; };
//# sourceMappingURL=wizard.module.js.map

/***/ }),
/* 141 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 142 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(5);

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(198);
__webpack_require__(208);
var core_1 = __webpack_require__(0);
var platform_browser_dynamic_1 = __webpack_require__(206);
var app_module_client_1 = __webpack_require__(151);
if (true) {
    module['hot'].accept();
    module['hot'].dispose(function () {
        // Before restarting the app, we create a new root element and dispose the old one
        var oldRootElem = document.querySelector('app');
        var newRootElem = document.createElement('app');
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        modulePromise.then(function (appModule) { return appModule.destroy(); });
    });
}
else {
    core_1.enableProdMode();
}
// Note: @ng-tools/webpack looks for the following expression when performing production
// builds. Don't change how this line looks, otherwise you may break tree-shaking.
var modulePromise = platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_client_1.AppModule);


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: ''
};
if (true) {
  var querystring = __webpack_require__(197);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }
  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(199);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(202);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(203);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=%2F__webpack_hmr", __webpack_require__(204)(module)))

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(44);

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var ui_switch_component_1 = __webpack_require__(148);
var UiSwitchModule = (function () {
    function UiSwitchModule() {
    }
    UiSwitchModule = __decorate([
        core_1.NgModule({
            declarations: [ui_switch_component_1.UiSwitchComponent],
            exports: [ui_switch_component_1.UiSwitchComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], UiSwitchModule);
    return UiSwitchModule;
}());
exports.UiSwitchModule = UiSwitchModule;
//# sourceMappingURL=index.js.map

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var forms_1 = __webpack_require__(9);
var UI_SWITCH_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return UiSwitchComponent; }),
    multi: true
};
var UiSwitchComponent = (function () {
    function UiSwitchComponent() {
        this.onTouchedCallback = function (v) {
        };
        this.onChangeCallback = function (v) {
        };
        this.size = 'medium';
        this.change = new core_1.EventEmitter();
        this.color = 'rgb(100, 189, 99)';
        this.switchOffColor = '';
        this.switchColor = '#fff';
        this.defaultBgColor = '#fff';
        this.defaultBoColor = '#dfdfdf';
    }
    Object.defineProperty(UiSwitchComponent.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (v) {
            this._checked = v !== false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiSwitchComponent.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (v) {
            this._disabled = v !== false;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(UiSwitchComponent.prototype, "reverse", {
        get: function () {
            return this._reverse;
        },
        set: function (v) {
            this._reverse = v !== false;
        },
        enumerable: true,
        configurable: true
    });
    ;
    UiSwitchComponent.prototype.getColor = function (flag) {
        if (flag === 'borderColor')
            return this.defaultBoColor;
        if (flag === 'switchColor') {
            if (this.reverse)
                return !this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
            return this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
        }
        if (this.reverse)
            return !this.checked ? this.color : this.defaultBgColor;
        return this.checked ? this.color : this.defaultBgColor;
    };
    UiSwitchComponent.prototype.onToggle = function () {
        if (this.disabled)
            return;
        this.checked = !this.checked;
        this.change.emit(this.checked);
        this.onChangeCallback(this.checked);
        this.onTouchedCallback(this.checked);
    };
    UiSwitchComponent.prototype.writeValue = function (obj) {
        if (obj !== this.checked) {
            this.checked = !!obj;
        }
    };
    UiSwitchComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    UiSwitchComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], UiSwitchComponent.prototype, "checked", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], UiSwitchComponent.prototype, "disabled", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], UiSwitchComponent.prototype, "reverse", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], UiSwitchComponent.prototype, "size", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], UiSwitchComponent.prototype, "change", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], UiSwitchComponent.prototype, "color", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], UiSwitchComponent.prototype, "switchOffColor", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], UiSwitchComponent.prototype, "switchColor", void 0);
    __decorate([
        core_1.HostListener('click'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], UiSwitchComponent.prototype, "onToggle", null);
    UiSwitchComponent = __decorate([
        core_1.Component({
            selector: 'ui-switch',
            template: "\n  <span class=\"switch\" \n  [class.checked]=\"checked\" \n  [class.disabled]=\"disabled\"\n  [class.switch-large]=\"size === 'large'\"\n  [class.switch-medium]=\"size === 'medium'\"\n  [class.switch-small]=\"size === 'small'\"\n  [style.background-color]=\"getColor()\"\n  [style.border-color]=\"getColor('borderColor')\"\n  >\n  <small [style.background]=\"getColor('switchColor')\">\n  </small>\n  </span>\n  ",
            styles: ["\n    .switch {\n    background: #f00;\n    border: 1px solid #dfdfdf;\n    position: relative;\n    display: inline-block;\n    box-sizing: content-box;\n    overflow: visible;\n    padding: 0;\n    margin: 0;            \n    cursor: pointer;\n    box-shadow: rgb(223, 223, 223) 0 0 0 0 inset;\n    transition: 0.3s ease-out all;\n    -webkit-transition: 0.3s ease-out all;\n    }        \n\n    small {\n    border-radius: 100%;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);          \n    position: absolute;\n    top: 0;\n    left: 0;\n    transition: 0.3s ease-out all;\n    -webkit-transition: 0.3s ease-out all;\n    }\n\n    .switch-large {\n    width: 66px;\n    height: 40px;\n    border-radius: 40px;\n    }\n\n    .switch-large small {\n    width: 40px;\n    height: 40px;\n    }\n\n    .switch-medium {\n    width: 50px;\n    height: 30px;\n    border-radius: 30px;\n    }\n\n    .switch-medium small {\n    width: 30px;\n    height: 30px;\n    }\n\n    .switch-small {\n    width: 33px;\n    height: 20px;\n    border-radius: 20px;\n    }\n\n    .switch-small small {\n    width: 20px;\n    height: 20px;\n    }\n\n    .checked {\n    background: rgb(100, 189, 99);\n    border-color: rgb(100, 189, 99);\n    }\n\n    .switch-large.checked small {\n    left: 26px;\n    }\n\n    .switch-medium.checked small {\n    left: 20px;\n    }\n\n    .switch-small.checked small {\n    left: 13px;\n    }\n\n    .disabled {\n    opacity: .50;\n    cursor: not-allowed;\n    }\n    "],
            providers: [UI_SWITCH_CONTROL_VALUE_ACCESSOR]
        }), 
        __metadata('design:paramtypes', [])
    ], UiSwitchComponent);
    return UiSwitchComponent;
}());
exports.UiSwitchComponent = UiSwitchComponent;
//# sourceMappingURL=ui-switch.component.js.map

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var platform_browser_1 = __webpack_require__(143);
var forms_1 = __webpack_require__(9);
var http_1 = __webpack_require__(61);
var app_module_shared_1 = __webpack_require__(152);
var clarity_angular_1 = __webpack_require__(172);
var angular2_ui_switch_1 = __webpack_require__(147);
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        bootstrap: app_module_shared_1.sharedConfig.bootstrap,
        declarations: app_module_shared_1.sharedConfig.declarations,
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            clarity_angular_1.ClarityModule.forRoot(),
            angular2_ui_switch_1.UiSwitchModule
        ].concat(app_module_shared_1.sharedConfig.imports),
        providers: [
            { provide: 'ORIGIN_URL', useValue: location.origin }
        ]
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = __webpack_require__(207);
var app_component_1 = __webpack_require__(153);
var navmenu_component_1 = __webpack_require__(157);
var home_component_1 = __webpack_require__(156);
var fetchdata_component_1 = __webpack_require__(155);
var counter_component_1 = __webpack_require__(154);
exports.sharedConfig = {
    bootstrap: [app_component_1.AppComponent],
    declarations: [
        app_component_1.AppComponent,
        navmenu_component_1.NavMenuComponent,
        counter_component_1.CounterComponent,
        fetchdata_component_1.FetchDataComponent,
        home_component_1.HomeComponent
    ],
    imports: [
        router_1.RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: home_component_1.HomeComponent },
            { path: 'counter', component: counter_component_1.CounterComponent },
            { path: 'fetch-data', component: fetchdata_component_1.FetchDataComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
};


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'app',
        template: __webpack_require__(190),
        styles: [__webpack_require__(200)]
    })
], AppComponent);
exports.AppComponent = AppComponent;


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var CounterComponent = (function () {
    function CounterComponent() {
        this.currentCount = 0;
    }
    CounterComponent.prototype.incrementCounter = function () {
        this.currentCount++;
    };
    return CounterComponent;
}());
CounterComponent = __decorate([
    core_1.Component({
        selector: 'counter',
        template: __webpack_require__(191)
    })
], CounterComponent);
exports.CounterComponent = CounterComponent;


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var http_1 = __webpack_require__(61);
var FetchDataComponent = (function () {
    function FetchDataComponent(http, originUrl) {
        var _this = this;
        http.get(originUrl + '/api/SampleData/WeatherForecasts').subscribe(function (result) {
            _this.forecasts = result.json();
        });
    }
    return FetchDataComponent;
}());
FetchDataComponent = __decorate([
    core_1.Component({
        selector: 'fetchdata',
        template: __webpack_require__(192)
    }),
    __param(1, core_1.Inject('ORIGIN_URL')),
    __metadata("design:paramtypes", [http_1.Http, String])
], FetchDataComponent);
exports.FetchDataComponent = FetchDataComponent;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var http_1 = __webpack_require__(61);
var HomeComponent = (function () {
    function HomeComponent(http, originUrl) {
        var _this = this;
        this.httpContext = http;
        this.devices = new Array();
        this.httpContext.get(originUrl + '/api/device').subscribe(function (result) {
            var imported = result.json();
            _this.devices = new Array();
            imported.forEach(function (element) {
                _this.devices.push(element);
            });
        });
    }
    HomeComponent.prototype.fetch = function () {
    };
    HomeComponent.prototype.clicked = function (event) {
        this.fetch();
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        selector: 'home',
        template: __webpack_require__(193)
    }),
    __param(1, core_1.Inject('ORIGIN_URL')),
    __metadata("design:paramtypes", [http_1.Http, String])
], HomeComponent);
exports.HomeComponent = HomeComponent;


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var NavMenuComponent = (function () {
    function NavMenuComponent() {
    }
    return NavMenuComponent;
}());
NavMenuComponent = __decorate([
    core_1.Component({
        selector: 'nav-menu',
        template: __webpack_require__(194),
        styles: [__webpack_require__(201)]
    })
], NavMenuComponent);
exports.NavMenuComponent = NavMenuComponent;


/***/ }),
/* 158 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ButtonGroup; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__button__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_buttonInGroup_service__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__popover_dropdown_menu_positions__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__ = __webpack_require__(7);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */





var ButtonGroup = (function () {
    function ButtonGroup(buttonGroupNewService, elementRef) {
        this.buttonGroupNewService = buttonGroupNewService;
        this.elementRef = elementRef;
        this.inlineButtons = [];
        this.menuButtons = [];
        this._openMenu = false;
        this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].BOTTOM_LEFT; // default if menuPosition isn't set
        this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].LEFT_TOP; // default if menuPosition isn't set
        /**
         * Flag with indicates if the overflow menu toggle was clicked.
         * If true, this can save us traversing the DOM to find
         * whether the click was withing the button group toggle
         * or menu in the onMouseClick method
         * @type {boolean}
         * @private
         */
        this._overflowMenuToggleClicked = false;
    }
    /**
     * 1. Initializes the initial Button Group View
     * 2. Subscribes to changes on the ContentChildren
     *    in case the user content projection changes
     */
    ButtonGroup.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.initializeButtons();
        this.buttonGroupNewService.changes.subscribe(function (button) { return _this.rearrangeButton(button); });
        this.buttons.changes.subscribe(function () {
            _this.initializeButtons();
        });
    };
    /**
     * Moves the button into the other ViewContainer
     * when an update is received.
     *
     * @param button
     */
    ButtonGroup.prototype.rearrangeButton = function (button) {
        var fromView;
        var toView;
        if (button.inMenu) {
            fromView = this.inlineButtons;
            toView = this.menuButtons;
        }
        else {
            fromView = this.menuButtons;
            toView = this.inlineButtons;
        }
        var index = fromView.indexOf(button);
        if (index > -1) {
            fromView.splice(index, 1);
            var moveIndex = this.getMoveIndex(button);
            if (moveIndex <= toView.length) {
                toView.splice(moveIndex, 0, button);
            }
        }
    };
    /**
     * Author: Eudes
     *
     * Finds the order of a button w.r.t other buttons
     *
     * @param buttonToMove
     * @returns {number}
     */
    ButtonGroup.prototype.getMoveIndex = function (buttonToMove) {
        var tempArr = this.buttons.filter(function (button) { return (button.inMenu === buttonToMove.inMenu); });
        return tempArr.indexOf(buttonToMove);
    };
    /**
     * Finds where each button belongs based on
     * the ContentChildren
     */
    ButtonGroup.prototype.initializeButtons = function () {
        var tempInlineButtons = [];
        var tempInMenuButtons = [];
        this.buttons.forEach(function (button) {
            if (button.inMenu) {
                tempInMenuButtons.push(button);
            }
            else {
                tempInlineButtons.push(button);
            }
        });
        this.inlineButtons = tempInlineButtons;
        this.menuButtons = tempInMenuButtons;
    };
    Object.defineProperty(ButtonGroup.prototype, "menuPosition", {
        get: function () {
            return this._menuPosition;
        },
        set: function (pos) {
            if (pos && (__WEBPACK_IMPORTED_MODULE_3__popover_dropdown_menu_positions__["a" /* menuPositions */].indexOf(pos) > -1)) {
                this._menuPosition = pos;
            }
            else {
                this._menuPosition = "bottom-left";
            }
            // set the popover values based on menu position
            switch (this._menuPosition) {
                case ("top-right"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].TOP_RIGHT;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].RIGHT_BOTTOM;
                    break;
                case ("top-left"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].TOP_LEFT;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].LEFT_BOTTOM;
                    break;
                case ("bottom-right"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].BOTTOM_RIGHT;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].RIGHT_TOP;
                    break;
                case ("bottom-left"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].BOTTOM_LEFT;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].LEFT_TOP;
                    break;
                case ("right-top"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].RIGHT_TOP;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].LEFT_TOP;
                    break;
                case ("right-bottom"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].RIGHT_BOTTOM;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].LEFT_BOTTOM;
                    break;
                case ("left-top"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].LEFT_TOP;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].RIGHT_TOP;
                    break;
                case ("left-bottom"):
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].LEFT_BOTTOM;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].RIGHT_BOTTOM;
                    break;
                default:
                    this.anchorPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].BOTTOM_LEFT;
                    this.popoverPoint = __WEBPACK_IMPORTED_MODULE_4__popover_common_popover__["a" /* Point */].LEFT_TOP;
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonGroup.prototype, "openMenu", {
        get: function () {
            return this._openMenu;
        },
        set: function (value) {
            this._openMenu = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Toggle the Dropdown Menu when the Dropdown Toggle is
     * clicked. Also set a flag that indicates that the toggle
     * was clicked so that we don't traverse the DOM to find the
     * location of the click.
     */
    ButtonGroup.prototype.toggleMenu = function () {
        this.openMenu = !this.openMenu;
        this._overflowMenuToggleClicked = true;
    };
    //TODO: Generic Directive to handle this
    /**
     * Called on mouse clicks anywhere in the DOM.
     * Checks to see if the mouseclick happened on the host or outside
     * @param target
     */
    ButtonGroup.prototype.onMouseClick = function (target) {
        if (this.openMenu && !this._overflowMenuToggleClicked) {
            //Reset the overflow menu toggle clicked flag
            this._overflowMenuToggleClicked = false;
            var current = target; //Get the element in the DOM on which the mouse was clicked
            var host = this.elementRef.nativeElement; //Current Button Group
            if (current.classList.contains("dropdown-menu")) {
                current = current.parentNode;
                while (current) {
                    if (current === document) {
                        this.openMenu = false;
                        return;
                    }
                    //If clicked on dropdown menu and menu is in host
                    //do nothing
                    if (current === host) {
                        return;
                    }
                    current = current.parentNode;
                }
            }
            this.openMenu = false;
        }
        this._overflowMenuToggleClicked = false; //Reset the overflow menu toggle clicked flag
    };
    return ButtonGroup;
}());

ButtonGroup.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-button-group",
                template: "\n      <ng-container *ngFor=\"let inlineButton of inlineButtons\">\n          <ng-template [ngTemplateOutlet]=\"inlineButton.templateRef\"></ng-template>\n      </ng-container>\n      <ng-container *ngIf=\"menuButtons.length > 0\">\n          <div\n              class=\"btn-group-overflow open\"\n              [ngClass]=\"menuPosition\"\n              #anchor>\n              <button\n                  class=\"btn dropdown-toggle\"\n                  (click)=\"toggleMenu()\">\n                  <clr-icon shape=\"ellipsis-horizontal\"></clr-icon>\n              </button>\n              <div\n                  class=\"dropdown-menu\"\n                  *clrPopover=\"openMenu; anchor: anchor; anchorPoint: anchorPoint; popoverPoint: popoverPoint;\">\n                  <ng-template [ngTemplateOutlet]=\"ref\"></ng-template>\n              </div>\n          </div>\n      </ng-container>\n      <ng-template #ref>\n          <ng-container *ngFor=\"let menuButton of menuButtons\">\n              <ng-template [ngTemplateOutlet]=\"menuButton.templateRef\"></ng-template>\n          </ng-container>\n      </ng-template>\n    ",
                providers: [__WEBPACK_IMPORTED_MODULE_2__providers_buttonInGroup_service__["a" /* ButtonInGroupService */]],
                host: {
                    "[class.btn-group]": "true"
                }
            },] },
];
/** @nocollapse */
ButtonGroup.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__providers_buttonInGroup_service__["a" /* ButtonInGroupService */], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
]; };
ButtonGroup.propDecorators = {
    'buttons': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_1__button__["a" /* Button */],] },],
    'menuPosition': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ["clrMenuPosition",] },],
    'onMouseClick': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"], args: ["document:click", ["$event.target"],] },],
};
//# sourceMappingURL=button-group.js.map

/***/ }),
/* 159 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoadingButton; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_loading_loading_listener__ = __webpack_require__(32);
/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var LoadingButton = (function () {
    function LoadingButton() {
    }
    LoadingButton.prototype.startLoading = function () {
        this.loading = true;
    };
    LoadingButton.prototype.doneLoading = function () {
        this.loading = false;
    };
    return LoadingButton;
}());

LoadingButton.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "button[clrLoading]",
                template: "\n        <span class=\"spinner spinner-inline\" *ngIf=\"loading\"></span>\n        <ng-content></ng-content>\n    ",
                providers: [{ provide: __WEBPACK_IMPORTED_MODULE_1__utils_loading_loading_listener__["a" /* LoadingListener */], useExisting: LoadingButton }]
            },] },
];
/** @nocollapse */
LoadingButton.ctorParameters = function () { return []; };
//# sourceMappingURL=loading-button.js.map

/***/ }),
/* 160 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClarityModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__button_button_module__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_data_module__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__emphasis_emphasis_module__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__icon_icon_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modal_modal_module__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_loading_loading_module__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__code_code_module__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__forms_forms_module__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__layout_layout_module__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__popover_popover_module__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__wizard_wizard_module__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__wizard_deprecated_wizard_deprecated_module__ = __webpack_require__(133);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */













var ClarityModule = (function () {
    function ClarityModule() {
    }
    /** @deprecated */
    ClarityModule.forRoot = function () {
        return {
            ngModule: ClarityModule,
            providers: []
        };
    };
    /** @deprecated */
    ClarityModule.forChild = function () {
        return {
            ngModule: ClarityModule,
            providers: []
        };
    };
    return ClarityModule;
}());

ClarityModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                exports: [
                    __WEBPACK_IMPORTED_MODULE_3__emphasis_emphasis_module__["a" /* ClrEmphasisModule */],
                    __WEBPACK_IMPORTED_MODULE_2__data_data_module__["a" /* ClrDataModule */],
                    __WEBPACK_IMPORTED_MODULE_4__icon_icon_module__["a" /* ClrIconModule */],
                    __WEBPACK_IMPORTED_MODULE_5__modal_modal_module__["a" /* ClrModalModule */],
                    __WEBPACK_IMPORTED_MODULE_6__utils_loading_loading_module__["a" /* ClrLoadingModule */],
                    __WEBPACK_IMPORTED_MODULE_1__button_button_module__["a" /* ClrButtonModule */],
                    __WEBPACK_IMPORTED_MODULE_7__code_code_module__["a" /* ClrCodeModule */],
                    __WEBPACK_IMPORTED_MODULE_8__forms_forms_module__["a" /* ClrFormsModule */],
                    __WEBPACK_IMPORTED_MODULE_9__layout_layout_module__["a" /* ClrLayoutModule */],
                    __WEBPACK_IMPORTED_MODULE_10__popover_popover_module__["a" /* ClrPopoverModule */],
                    __WEBPACK_IMPORTED_MODULE_11__wizard_wizard_module__["a" /* ClrWizardModule */],
                    __WEBPACK_IMPORTED_MODULE_12__wizard_deprecated_wizard_deprecated_module__["a" /* ClrWizardDeprecatedModule */]
                ]
            },] },
];
/** @nocollapse */
ClarityModule.ctorParameters = function () { return []; };
//# sourceMappingURL=clarity.module.js.map

/***/ }),
/* 161 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrCodeModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__syntax_highlight_syntax_highlight_module__ = __webpack_require__(71);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var ClrCodeModule = (function () {
    function ClrCodeModule() {
    }
    return ClrCodeModule;
}());

ClrCodeModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                exports: [__WEBPACK_IMPORTED_MODULE_1__syntax_highlight_syntax_highlight_module__["a" /* ClrSyntaxHighlightModule */]]
            },] },
];
/** @nocollapse */
ClrCodeModule.ctorParameters = function () { return []; };
//# sourceMappingURL=code.module.js.map

/***/ }),
/* 162 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridRowExpandAnimation; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__render_dom_adapter__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_row_expand__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__render_render_organizer__ = __webpack_require__(4);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * This is a hack that we have to write for now because of bugs and limitations in Angular,
 * please do not use this as an example.
 */




var DatagridRowExpandAnimation = (function () {
    function DatagridRowExpandAnimation(el, domAdapter, renderer, expand, renderOrganizer) {
        var _this = this;
        this.el = el;
        this.domAdapter = domAdapter;
        this.renderer = renderer;
        this.expand = expand;
        this.renderOrganizer = renderOrganizer;
        expand.animate.subscribe(function () {
            // We already had an animation waiting, so we just have to run in, not prepare again
            if (_this.oldHeight) {
                setTimeout(function () { return _this.run(); });
            }
            else {
                _this.animate();
            }
        });
    }
    /*
     * Dirty manual animation handling, but we have no way to use dynamic heights in Angular's current API.
     * They're working on it, but have no ETA.
     */
    DatagridRowExpandAnimation.prototype.animate = function () {
        var _this = this;
        // Check if we do have web-animations available. If not, just skip the animation.
        if (!this.el.nativeElement.animate) {
            return;
        }
        // We had an animation running, we skip to the end
        if (this.running) {
            this.running.finish();
        }
        this.oldHeight = this.domAdapter.computedHeight(this.el.nativeElement);
        // We set the height of the element immediately to avoid a flicker before the animation starts.
        this.renderer.setElementStyle(this.el.nativeElement, "height", this.oldHeight + "px");
        this.renderer.setElementStyle(this.el.nativeElement, "overflow-y", "hidden");
        setTimeout(function () {
            if (_this.expand.loading) {
                return;
            }
            _this.run();
        });
    };
    DatagridRowExpandAnimation.prototype.run = function () {
        var _this = this;
        this.renderer.setElementStyle(this.el.nativeElement, "height", null);
        // I don't like realigning the columns before the animation, since the scrollbar could appear or disappear
        // halfway, but that's a compromise we have to make for now. We can look into a smarter fix later.
        this.renderOrganizer.scrollbar.next();
        var newHeight = this.domAdapter.computedHeight(this.el.nativeElement);
        this.running = this.el.nativeElement.animate({
            height: [this.oldHeight + "px", newHeight + "px"],
            overflowY: ["hidden", "hidden"],
            easing: "ease-in-out"
        }, {
            duration: 200
        });
        this.running.onfinish = function () {
            _this.renderer.setElementStyle(_this.el.nativeElement, "overflow-y", null);
            delete _this.running;
        };
        delete this.oldHeight;
    };
    return DatagridRowExpandAnimation;
}());

DatagridRowExpandAnimation.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "clr-dg-row"
            },] },
];
/** @nocollapse */
DatagridRowExpandAnimation.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_1__render_dom_adapter__["a" /* DomAdapter */], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
    { type: __WEBPACK_IMPORTED_MODULE_2__providers_row_expand__["a" /* RowExpand */], },
    { type: __WEBPACK_IMPORTED_MODULE_3__render_render_organizer__["a" /* DatagridRenderOrganizer */], },
]; };
//# sourceMappingURL=row-expand-animation.js.map

/***/ }),
/* 163 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridHideableColumn; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__);
/*
 * Copyright (c) 2016 -2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * @class DatagridHideableColumn
 *
 * @description
 * A utility class for that adds hide/show functionality to a column, its cells and enables a toggler in the
 * DatagridColumnToggle Component.
 *
 */
var DatagridHideableColumn = (function () {
    /**
     * @constructor
     *
     * @description
     * The init function for DatagridHideableColumn instances that does the following:
     *
     * 1. Set values for the private variables that enable a hideable column
     * 2. Broadcast the next hidden change for anyone (already) subscribed to this DatagridHideableColumn
     * TODO: Debug and verify that #2 is really necessary.
     *
     * @param _template
     * @param _id
     * @param _hidden
     */
    function DatagridHideableColumn(_template, _id, _hidden) {
        if (_hidden === void 0) { _hidden = true; }
        this._template = _template;
        this._id = _id;
        this._hidden = _hidden;
        /**
         * @property hiddenChanges
         *
         * @description
         * A stream of state changes an instance of DatagridHideableColumn will broadcast to subscribers.
         *
         * @type {Subject<boolean>}
         */
        this.hiddenChangesState = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__["Subject"]();
        // Flag this true when the service only has one visible column open.
        this.lastVisibleColumn = false;
        this.hiddenChangesState.next(_hidden);
    }
    Object.defineProperty(DatagridHideableColumn.prototype, "template", {
        /**
         * @function template
         *
         * @description
         * A getter function that returns an TemplateRef of the DatagridColumn that is hideable. This is currently used to
         * populate the DatagridColumnToggle UI with the correct Column name.
         *
         * @returns {TemplateRef<any>}
         */
        get: function () {
            return this._template;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridHideableColumn.prototype, "id", {
        /**
         * @function id
         *
         * @description
         * public function that returns the id of a HideableCOlumn instance. Used by the HideableCOlumnService for passing
         * state and actions between DateGridColumns, DataGridCells & the DatagridColumnToggle Components.
         *
         * @returns {string}
         */
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridHideableColumn.prototype, "hidden", {
        /**
         * @function hidden
         *
         * @description
         * A getter that returns the hidden value of a DatagridHideableColumn instance.
         * TODO: debug and make sure you really need this since we have the hiddenCHanges observable.
         *
         * @returns {boolean}
         */
        get: function () {
            return this._hidden;
        },
        /**
         * @function hidden
         *
         * @description
         * The setter for setting the hidden state of a DatagridHideableColumn instance.
         * It also broadcasts the change after its set.
         *
         * @param value
         */
        set: function (value) {
            if (this._hidden === value) {
                return;
            }
            this._hidden = value;
            this.hiddenChangesState.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatagridHideableColumn.prototype, "hiddenChangeState", {
        /**
         * @function hiddenChangeState
         *
         * @description
         * An Observable for the HideableColumns hidden changes.
         *
         * @returns {Observable<boolean>}
         */
        get: function () {
            return this.hiddenChangesState.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    return DatagridHideableColumn;
}());

//# sourceMappingURL=datagrid-hideable-column.js.map

/***/ }),
/* 164 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridBodyRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__render_organizer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dom_adapter__ = __webpack_require__(13);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var DatagridBodyRenderer = (function () {
    function DatagridBodyRenderer(el, organizer, domAdapter) {
        var _this = this;
        this.el = el;
        this.organizer = organizer;
        this.domAdapter = domAdapter;
        this.subscription = organizer.scrollbar.subscribe(function () { return _this.computeScrollbarWidth(); });
    }
    DatagridBodyRenderer.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    DatagridBodyRenderer.prototype.computeScrollbarWidth = function () {
        this.organizer.scrollbarWidth.next(this.domAdapter.scrollBarWidth(this.el.nativeElement));
    };
    return DatagridBodyRenderer;
}());

DatagridBodyRenderer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrDgBody]"
            },] },
];
/** @nocollapse */
DatagridBodyRenderer.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_1__render_organizer__["a" /* DatagridRenderOrganizer */], },
    { type: __WEBPACK_IMPORTED_MODULE_2__dom_adapter__["a" /* DomAdapter */], },
]; };
//# sourceMappingURL=body-renderer.js.map

/***/ }),
/* 165 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridHeadRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__render_organizer__ = __webpack_require__(4);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var DatagridHeadRenderer = (function () {
    function DatagridHeadRenderer(el, renderer, organizer) {
        var _this = this;
        this.el = el;
        this.renderer = renderer;
        this.subscription = organizer.scrollbarWidth.subscribe(function (width) { return _this.accountForScrollbar(width); });
    }
    DatagridHeadRenderer.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    DatagridHeadRenderer.prototype.accountForScrollbar = function (width) {
        this.renderer.setElementStyle(this.el.nativeElement, "padding-right", width + "px");
    };
    return DatagridHeadRenderer;
}());

DatagridHeadRenderer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrDgHead]"
            },] },
];
/** @nocollapse */
DatagridHeadRenderer.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
    { type: __WEBPACK_IMPORTED_MODULE_1__render_organizer__["a" /* DatagridRenderOrganizer */], },
]; };
//# sourceMappingURL=head-renderer.js.map

/***/ }),
/* 166 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridMainRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dom_adapter__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__render_organizer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__header_renderer__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_items__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_page__ = __webpack_require__(12);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */






var DatagridMainRenderer = (function () {
    function DatagridMainRenderer(organizer, items, page, domAdapter, el, renderer) {
        var _this = this;
        this.organizer = organizer;
        this.items = items;
        this.page = page;
        this.domAdapter = domAdapter;
        this.el = el;
        this.renderer = renderer;
        this._heightSet = false;
        this._subscriptions = [];
        /**
         * Indicates if we want to re-compute columns width. This should only happen:
         * 1) When headers change, with columns being added or removed
         * 2) When rows are lazily loaded for the first time
         */
        this.columnsSizesStable = false;
        this._subscriptions.push(organizer.computeWidths.subscribe(function () { return _this.computeHeadersWidth(); }));
        this._subscriptions.push(this.page.sizeChange.subscribe(function () {
            if (_this._heightSet) {
                _this.resetDatagridHeight();
            }
        }));
    }
    DatagridMainRenderer.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._subscriptions.push(this.headers.changes.subscribe(function () {
            // TODO: only re-stabilize if a column was added or removed. Reordering is fine.
            _this.columnsSizesStable = false;
            _this.stabilizeColumns();
        }));
    };
    DatagridMainRenderer.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.stabilizeColumns();
        this._subscriptions.push(this.items.change.subscribe(function () {
            _this.stabilizeColumns();
        }));
    };
    DatagridMainRenderer.prototype.ngAfterViewChecked = function () {
        if (this.shouldComputeHeight()) {
            this.computeDatagridHeight();
        }
    };
    DatagridMainRenderer.prototype.shouldComputeHeight = function () {
        if (!this._heightSet && this.page.size > 0) {
            if (this.items.displayed.length === this.page.size) {
                return true;
            }
        }
        return false;
    };
    /**
     * Computes the height of the datagrid.
     *
     * NOTE: We had to choose to set the height instead of the min-height because
     * IE 11 requires the height on the parent for the children flex grow/shrink properties to work.
     * When we used min-height, 1 1 auto doesn't used to work in IE11 :-(
     * But this doesn't affect the fix. It works in both fixed & variable height datagrids.
     *
     * Refer: http://stackoverflow.com/questions/24396205/flex-grow-not-working-in-internet-explorer-11-0
     */
    DatagridMainRenderer.prototype.computeDatagridHeight = function () {
        var value = this.domAdapter.computedHeight(this.el.nativeElement);
        this.renderer.setElementStyle(this.el.nativeElement, "height", value + "px");
        this._heightSet = true;
    };
    DatagridMainRenderer.prototype.resetDatagridHeight = function () {
        this.renderer.setElementStyle(this.el.nativeElement, "height", "");
        this._heightSet = false;
    };
    DatagridMainRenderer.prototype.ngOnDestroy = function () {
        this._subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    /**
     * Makes each header compute its width.
     */
    DatagridMainRenderer.prototype.computeHeadersWidth = function () {
        var _this = this;
        var nbColumns = this.headers.length;
        var allStrict = true;
        this.headers.forEach(function (header, index) {
            // On the last header column check whether all columns have strict widths.
            // If all columns have strict widths, remove the strict width from the last column and make it the column's
            // minimum width so that when all previous columns shrink, it will get a flexible width and cover the empty
            // gap in the Datagrid.
            if (!header.strictWidth) {
                allStrict = false;
            }
            if (nbColumns === index + 1 && allStrict) {
                header.strictWidth = 0;
            }
            var width = header.computeWidth();
            _this.organizer.widths[index] = { px: width, strict: !!header.strictWidth };
        });
    };
    /**
     * Triggers a whole re-rendring cycle to set column sizes, if needed.
     */
    DatagridMainRenderer.prototype.stabilizeColumns = function () {
        if (this.columnsSizesStable) {
            return;
        }
        // No point resizing if there are no rows, we wait until they are actually loaded.
        if (this.items.displayed.length > 0) {
            this.organizer.resize();
            this.columnsSizesStable = true;
        }
    };
    return DatagridMainRenderer;
}());

DatagridMainRenderer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "clr-datagrid",
                providers: [__WEBPACK_IMPORTED_MODULE_1__dom_adapter__["a" /* DomAdapter */]]
            },] },
];
/** @nocollapse */
DatagridMainRenderer.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__render_organizer__["a" /* DatagridRenderOrganizer */], },
    { type: __WEBPACK_IMPORTED_MODULE_4__providers_items__["a" /* Items */], },
    { type: __WEBPACK_IMPORTED_MODULE_5__providers_page__["a" /* Page */], },
    { type: __WEBPACK_IMPORTED_MODULE_1__dom_adapter__["a" /* DomAdapter */], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
]; };
DatagridMainRenderer.propDecorators = {
    'headers': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_3__header_renderer__["a" /* DatagridHeaderRenderer */],] },],
};
//# sourceMappingURL=main-renderer.js.map

/***/ }),
/* 167 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridRowMasterRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__render_organizer__ = __webpack_require__(4);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


/**
 * This component serves as a conditional wrapper.
 * When in table mode, it puts its content next to itself rather than inside.
 */
var DatagridRowMasterRenderer = (function () {
    function DatagridRowMasterRenderer(outsideContainer, organizer) {
        this.outsideContainer = outsideContainer;
        this.organizer = organizer;
        this.outside = false;
    }
    DatagridRowMasterRenderer.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    DatagridRowMasterRenderer.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.insideContainer.createEmbeddedView(this.projected);
        this.subscription = this.organizer.tableMode.subscribe(function (on) { return _this.projectOutside(on); });
    };
    DatagridRowMasterRenderer.prototype.projectOutside = function (outside) {
        // We know the datagrid row's master container is always the first element in it,
        // so hard-coding a zero index here is fine.
        if (outside && !this.outside) {
            this.outsideContainer.insert(this.insideContainer.detach(0), 0);
        }
        else if (!outside && this.outside) {
            this.insideContainer.insert(this.outsideContainer.detach(0), 0);
        }
        this.outside = outside;
    };
    return DatagridRowMasterRenderer;
}());

DatagridRowMasterRenderer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                selector: "clr-dg-row-master",
                template: "\n        <ng-template #projected><ng-content></ng-content></ng-template>\n        <ng-container #inside></ng-container>\n    ",
                host: {
                    "[class.datagrid-row-master]": "true"
                }
            },] },
];
/** @nocollapse */
DatagridRowMasterRenderer.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_1__render_organizer__["a" /* DatagridRenderOrganizer */], },
]; };
DatagridRowMasterRenderer.propDecorators = {
    'insideContainer': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"], args: ["inside", { read: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"] },] },],
    'projected': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"], args: ["projected",] },],
};
//# sourceMappingURL=row-master-renderer.js.map

/***/ }),
/* 168 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridRowRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__render_organizer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__cell_renderer__ = __webpack_require__(87);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var DatagridRowRenderer = (function () {
    function DatagridRowRenderer(organizer) {
        var _this = this;
        this.organizer = organizer;
        this.subscription = organizer.alignColumns.subscribe(function () { return _this.setWidths(); });
    }
    DatagridRowRenderer.prototype.setWidths = function () {
        var _this = this;
        if (this.organizer.widths.length !== this.cells.length) {
            return;
        }
        this.cells.forEach(function (cell, index) {
            var width = _this.organizer.widths[index];
            cell.setWidth(width.strict, width.px);
        });
    };
    DatagridRowRenderer.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.cells.changes.subscribe(function () {
            _this.setWidths();
        });
    };
    DatagridRowRenderer.prototype.ngAfterViewInit = function () {
        this.setWidths();
    };
    return DatagridRowRenderer;
}());

DatagridRowRenderer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "clr-dg-row, clr-dg-row-detail"
            },] },
];
/** @nocollapse */
DatagridRowRenderer.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__render_organizer__["a" /* DatagridRenderOrganizer */], },
]; };
DatagridRowRenderer.propDecorators = {
    'cells': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_2__cell_renderer__["a" /* DatagridCellRenderer */],] },],
};
//# sourceMappingURL=row-renderer.js.map

/***/ }),
/* 169 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatagridTableRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__render_organizer__ = __webpack_require__(4);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */



var DatagridTableRenderer = (function () {
    function DatagridTableRenderer(el, renderer, organizer) {
        var _this = this;
        this.el = el;
        this.renderer = renderer;
        this.subscription = organizer.tableMode.subscribe(function (on) { return _this.tableMode(on); });
    }
    DatagridTableRenderer.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    DatagridTableRenderer.prototype.tableMode = function (on) {
        this.renderer.setElementClass(this.el.nativeElement, __WEBPACK_IMPORTED_MODULE_1__constants__["b" /* COMPUTE_WIDTH_CLASS */], on);
    };
    return DatagridTableRenderer;
}());

DatagridTableRenderer.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                selector: "[clrDgTableWrapper]"
            },] },
];
/** @nocollapse */
DatagridTableRenderer.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
    { type: __WEBPACK_IMPORTED_MODULE_2__render_organizer__["a" /* DatagridRenderOrganizer */], },
]; };
//# sourceMappingURL=table-renderer.js.map

/***/ }),
/* 170 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AbstractTreeSelection; });
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var AbstractTreeSelection = (function () {
    function AbstractTreeSelection(parent, treeSelectionService) {
        this.parent = parent;
        this.treeSelectionService = treeSelectionService;
        this._selected = false;
        this._indeterminate = false;
    }
    Object.defineProperty(AbstractTreeSelection.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            this._selected = value;
            this._indeterminate = false;
            this.children.forEach(function (child) { return child.parentChanged(value); });
            if (this.parent) {
                this.parent.childChanged();
            }
            this.treeSelectionService.notify();
            this.selectedChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractTreeSelection.prototype, "indeterminate", {
        get: function () {
            return this._indeterminate;
        },
        enumerable: true,
        configurable: true
    });
    AbstractTreeSelection.prototype.childChanged = function () {
        var oneSelectedChild = false;
        var previousSelectedValue = this._selected;
        var previousIndeterminateValue = this._indeterminate;
        this._selected = true;
        this._indeterminate = false;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.indeterminate) {
                this._selected = false;
                this._indeterminate = true;
                break;
            }
            if (child.selected) {
                oneSelectedChild = true;
                if (this._selected === false) {
                    this._indeterminate = true;
                    break;
                }
            }
            else {
                this._selected = false;
                if (oneSelectedChild) {
                    this._indeterminate = true;
                    break;
                }
            }
        }
        if (this.parent
            && (this._selected !== previousSelectedValue
                || this._indeterminate !== previousIndeterminateValue)) {
            this.parent.childChanged();
        }
        if (this.selected !== previousSelectedValue) {
            this.selectedChanged();
        }
    };
    AbstractTreeSelection.prototype.parentChanged = function (selected) {
        if (selected && !this.selected) {
            this._selected = true;
            this._indeterminate = false;
            this.children.forEach(function (child) { return child.parentChanged(true); });
            this.selectedChanged();
        }
        if (!selected && (this.selected || this.indeterminate)) {
            this._selected = false;
            this._indeterminate = false;
            this.children.forEach(function (child) { return child.parentChanged(false); });
            this.selectedChanged();
        }
    };
    AbstractTreeSelection.prototype.toTreeSelection = function () {
        if (this.selected || this.indeterminate) {
            return {
                model: this.model,
                selected: this.selected,
                children: this.children.map(function (child) { return child.toTreeSelection(); })
                    .filter(function (child) { return !!child; })
            };
        }
        return null;
    };
    AbstractTreeSelection.prototype.matchTreeSelection = function (selectionArray) {
        var _loop_1 = function (selection) {
            if (this_1.model === selection.model) {
                if (this_1.selected !== selection.selected) {
                    this_1.selected = selection.selected;
                }
                if (selection.children) {
                    this_1.children.forEach(function (child) { return child.matchTreeSelection(selection.children); });
                }
                return "break";
            }
        };
        var this_1 = this;
        for (var _i = 0, selectionArray_1 = selectionArray; _i < selectionArray_1.length; _i++) {
            var selection = selectionArray_1[_i];
            var state_1 = _loop_1(selection);
            if (state_1 === "break")
                break;
        }
    };
    return AbstractTreeSelection;
}());

//# sourceMappingURL=abstract-tree-selection.js.map

/***/ }),
/* 171 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IconCustomTag; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var IconCustomTag = (function () {
    function IconCustomTag() {
    }
    return IconCustomTag;
}());

// No behavior
// The only purpose is to "declare" the tag in Angular
IconCustomTag.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: "clr-icon" },] },
];
/** @nocollapse */
IconCustomTag.ctorParameters = function () { return []; };
//# sourceMappingURL=icon.js.map

/***/ }),
/* 172 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__clarity_module__ = __webpack_require__(160);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClarityModule", function() { return __WEBPACK_IMPORTED_MODULE_0__clarity_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__button_button_module__ = __webpack_require__(67);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrButtonModule", function() { return __WEBPACK_IMPORTED_MODULE_1__button_button_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__button_button_group_button_group_module__ = __webpack_require__(62);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrButtonGroupModule", function() { return __WEBPACK_IMPORTED_MODULE_2__button_button_group_button_group_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__button_button_loading_loading_button_module__ = __webpack_require__(66);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrLoadingButtonModule", function() { return __WEBPACK_IMPORTED_MODULE_3__button_button_loading_loading_button_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__code_syntax_highlight_syntax_highlight_module__ = __webpack_require__(71);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrSyntaxHighlightModule", function() { return __WEBPACK_IMPORTED_MODULE_4__code_syntax_highlight_syntax_highlight_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__data_data_module__ = __webpack_require__(72);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrDataModule", function() { return __WEBPACK_IMPORTED_MODULE_5__data_data_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__data_datagrid_datagrid_module__ = __webpack_require__(82);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrDatagridModule", function() { return __WEBPACK_IMPORTED_MODULE_6__data_datagrid_datagrid_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__data_stack_view_stack_view_module__ = __webpack_require__(96);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrStackViewModule", function() { return __WEBPACK_IMPORTED_MODULE_7__data_stack_view_stack_view_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__data_tree_view_tree_view_module__ = __webpack_require__(100);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrTreeViewModule", function() { return __WEBPACK_IMPORTED_MODULE_8__data_tree_view_tree_view_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__emphasis_emphasis_module__ = __webpack_require__(103);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrEmphasisModule", function() { return __WEBPACK_IMPORTED_MODULE_9__emphasis_emphasis_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__emphasis_alert_alert_module__ = __webpack_require__(22);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrAlertModule", function() { return __WEBPACK_IMPORTED_MODULE_10__emphasis_alert_alert_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__forms_forms_module__ = __webpack_require__(23);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrFormsModule", function() { return __WEBPACK_IMPORTED_MODULE_11__forms_forms_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__icon_icon_module__ = __webpack_require__(5);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrIconModule", function() { return __WEBPACK_IMPORTED_MODULE_12__icon_icon_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__layout_layout_module__ = __webpack_require__(107);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrLayoutModule", function() { return __WEBPACK_IMPORTED_MODULE_13__layout_layout_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__layout_main_container_main_container_module__ = __webpack_require__(110);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrMainContainerModule", function() { return __WEBPACK_IMPORTED_MODULE_14__layout_main_container_main_container_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__layout_nav_navigation_module__ = __webpack_require__(114);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrNavigationModule", function() { return __WEBPACK_IMPORTED_MODULE_15__layout_nav_navigation_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__layout_tabs_tabs_module__ = __webpack_require__(116);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrTabsModule", function() { return __WEBPACK_IMPORTED_MODULE_16__layout_tabs_tabs_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__modal_modal_module__ = __webpack_require__(28);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrModalModule", function() { return __WEBPACK_IMPORTED_MODULE_17__modal_modal_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__popover_popover_module__ = __webpack_require__(124);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrPopoverModule", function() { return __WEBPACK_IMPORTED_MODULE_18__popover_popover_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__popover_dropdown_dropdown_module__ = __webpack_require__(31);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrDropdownModule", function() { return __WEBPACK_IMPORTED_MODULE_19__popover_dropdown_dropdown_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__popover_tooltip_tooltip_module__ = __webpack_require__(128);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrTooltipModule", function() { return __WEBPACK_IMPORTED_MODULE_20__popover_tooltip_tooltip_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__wizard_deprecated_wizard_deprecated_module__ = __webpack_require__(133);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrWizardDeprecatedModule", function() { return __WEBPACK_IMPORTED_MODULE_21__wizard_deprecated_wizard_deprecated_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__wizard_wizard_module__ = __webpack_require__(140);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrWizardModule", function() { return __WEBPACK_IMPORTED_MODULE_22__wizard_wizard_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__utils_loading_loading_module__ = __webpack_require__(33);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ClrLoadingModule", function() { return __WEBPACK_IMPORTED_MODULE_23__utils_loading_loading_module__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__emphasis_alert_index__ = __webpack_require__(102);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ALERT_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_24__emphasis_alert_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Alert", function() { return __WEBPACK_IMPORTED_MODULE_24__emphasis_alert_index__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__button_button_group_index__ = __webpack_require__(64);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "BUTTON_GROUP_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_25__button_button_group_index__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__button_button_loading_index__ = __webpack_require__(65);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "LOADING_BUTTON_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_26__button_button_loading_index__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__forms_checkbox_index__ = __webpack_require__(105);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "CHECKBOX_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_27__forms_checkbox_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Checkbox", function() { return __WEBPACK_IMPORTED_MODULE_27__forms_checkbox_index__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__code_index__ = __webpack_require__(69);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "CODE_HIGHLIGHT_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_28__code_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "CodeHighlight", function() { return __WEBPACK_IMPORTED_MODULE_28__code_index__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__popover_dropdown_index__ = __webpack_require__(123);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DROPDOWN_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_29__popover_dropdown_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Dropdown", function() { return __WEBPACK_IMPORTED_MODULE_29__popover_dropdown_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DropdownMenu", function() { return __WEBPACK_IMPORTED_MODULE_29__popover_dropdown_index__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DropdownToggle", function() { return __WEBPACK_IMPORTED_MODULE_29__popover_dropdown_index__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DropdownItem", function() { return __WEBPACK_IMPORTED_MODULE_29__popover_dropdown_index__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "menuPositions", function() { return __WEBPACK_IMPORTED_MODULE_29__popover_dropdown_index__["f"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__ = __webpack_require__(83);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DATAGRID_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Datagrid", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridActionBar", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridActionOverflow", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridColumn", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridColumnToggle", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridHideableColumnDirective", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["g"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridFilter", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["h"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridItems", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["i"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridRow", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["j"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridIfExpanded", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["k"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridRowDetail", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["l"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridCell", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["m"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridFooter", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["n"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridPagination", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["o"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridPlaceholder", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["p"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "SortOrder", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["q"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridStringFilter", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["r"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridPropertyStringFilter", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["s"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DatagridPropertyComparator", function() { return __WEBPACK_IMPORTED_MODULE_30__data_datagrid_index__["t"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__data_tree_view_index__ = __webpack_require__(97);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TREE_VIEW_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_31__data_tree_view_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TreeView", function() { return __WEBPACK_IMPORTED_MODULE_31__data_tree_view_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TreeNode", function() { return __WEBPACK_IMPORTED_MODULE_31__data_tree_view_index__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__data_stack_view_index__ = __webpack_require__(90);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "STACK_VIEW_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_32__data_stack_view_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "StackView", function() { return __WEBPACK_IMPORTED_MODULE_32__data_stack_view_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "StackViewCustomTags", function() { return __WEBPACK_IMPORTED_MODULE_32__data_stack_view_index__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "StackHeader", function() { return __WEBPACK_IMPORTED_MODULE_32__data_stack_view_index__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "StackBlock", function() { return __WEBPACK_IMPORTED_MODULE_32__data_stack_view_index__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "StackInput", function() { return __WEBPACK_IMPORTED_MODULE_32__data_stack_view_index__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "StackSelect", function() { return __WEBPACK_IMPORTED_MODULE_32__data_stack_view_index__["g"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__icon_index__ = __webpack_require__(106);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ICON_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_33__icon_index__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__layout_main_container_index__ = __webpack_require__(108);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "LAYOUT_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_34__layout_main_container_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MainContainer", function() { return __WEBPACK_IMPORTED_MODULE_34__layout_main_container_index__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__modal_index__ = __webpack_require__(117);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MODAL_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_35__modal_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Modal", function() { return __WEBPACK_IMPORTED_MODULE_35__modal_index__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__layout_nav_index__ = __webpack_require__(112);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "NAVIGATION_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_36__layout_nav_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Header", function() { return __WEBPACK_IMPORTED_MODULE_36__layout_nav_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "NavLevelDirective", function() { return __WEBPACK_IMPORTED_MODULE_36__layout_nav_index__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__layout_tabs_index__ = __webpack_require__(115);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TABS_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_37__layout_tabs_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Tabs", function() { return __WEBPACK_IMPORTED_MODULE_37__layout_tabs_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TabContent", function() { return __WEBPACK_IMPORTED_MODULE_37__layout_tabs_index__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TabLink", function() { return __WEBPACK_IMPORTED_MODULE_37__layout_tabs_index__["d"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__popover_tooltip_index__ = __webpack_require__(125);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TOOLTIP_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_38__popover_tooltip_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Tooltip", function() { return __WEBPACK_IMPORTED_MODULE_38__popover_tooltip_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TooltipContent", function() { return __WEBPACK_IMPORTED_MODULE_38__popover_tooltip_index__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__wizard_deprecated_index__ = __webpack_require__(132);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "OLD_WIZARD_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_39__wizard_deprecated_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardDeprecated", function() { return __WEBPACK_IMPORTED_MODULE_39__wizard_deprecated_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardStep", function() { return __WEBPACK_IMPORTED_MODULE_39__wizard_deprecated_index__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardPageDeprecated", function() { return __WEBPACK_IMPORTED_MODULE_39__wizard_deprecated_index__["d"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__wizard_index__ = __webpack_require__(134);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WIZARD_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Wizard", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardPage", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardStepnav", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardStepnavItem", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_BUTTON_TYPES", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "CUSTOM_BUTTON_TYPES", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["g"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardButton", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["h"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardHeaderAction", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["i"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardCustomTags", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["j"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardPageTitleDirective", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["k"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardPageNavTitleDirective", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["l"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardPageButtonsDirective", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["m"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WizardPageHeaderActionsDirective", function() { return __WEBPACK_IMPORTED_MODULE_40__wizard_index__["n"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__utils_animations_collapse_index__ = __webpack_require__(177);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "collapse", function() { return __WEBPACK_IMPORTED_MODULE_41__utils_animations_collapse_index__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__utils_animations_fade_index__ = __webpack_require__(181);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "fade", function() { return __WEBPACK_IMPORTED_MODULE_42__utils_animations_fade_index__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__utils_animations_fade_slide_index__ = __webpack_require__(179);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "fadeSlide", function() { return __WEBPACK_IMPORTED_MODULE_43__utils_animations_fade_slide_index__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__utils_animations_slide_index__ = __webpack_require__(182);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "slide", function() { return __WEBPACK_IMPORTED_MODULE_44__utils_animations_slide_index__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__utils_loading_index__ = __webpack_require__(129);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "LOADING_DIRECTIVES", function() { return __WEBPACK_IMPORTED_MODULE_45__utils_loading_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Loading", function() { return __WEBPACK_IMPORTED_MODULE_45__utils_loading_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "LoadingListener", function() { return __WEBPACK_IMPORTED_MODULE_45__utils_loading_index__["c"]; });
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */














































//# sourceMappingURL=index.js.map

/***/ }),
/* 173 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClrResponsiveNavControlMessage; });
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrResponsiveNavControlMessage = (function () {
    function ClrResponsiveNavControlMessage(_controlCode, _navLevel) {
        this._controlCode = _controlCode;
        this._navLevel = _navLevel;
    }
    Object.defineProperty(ClrResponsiveNavControlMessage.prototype, "controlCode", {
        get: function () {
            return this._controlCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClrResponsiveNavControlMessage.prototype, "navLevel", {
        get: function () {
            return this._navLevel;
        },
        enumerable: true,
        configurable: true
    });
    return ClrResponsiveNavControlMessage;
}());

//# sourceMappingURL=clrResponsiveNavControlMessage.js.map

/***/ }),
/* 174 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = clrResponsiveNavigationProvider;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__clrResponsiveNavigationService__ = __webpack_require__(15);
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

function clrResponsiveNavigationProvider(existing) {
    return existing || new __WEBPACK_IMPORTED_MODULE_0__clrResponsiveNavigationService__["a" /* ClrResponsiveNavigationService */]();
}
//# sourceMappingURL=clrResponsiveNavigationProvider.js.map

/***/ }),
/* 175 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return POPOVER_DIRECTIVES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__popover_directive__ = __webpack_require__(119);
/* unused harmony namespace reexport */


var POPOVER_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_0__popover_directive__["a" /* PopoverDirective */]
];
//# sourceMappingURL=index.js.map

/***/ }),
/* 176 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = collapse;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_animations__ = __webpack_require__(8);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

function collapse() {
    "use strict";
    return [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["state"])("true", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])({
            "height": 0,
            "overflow-y": "hidden"
        })),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["transition"])("true => false", [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["animate"])("0.2s ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])({
                "height": "*",
                "overflow-y": "hidden"
            }))
        ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["transition"])("false => true", [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])({
                "height": "*",
                "overflow-y": "hidden"
            }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["animate"])("0.2s ease-in-out")
        ])
    ];
}
;
//# sourceMappingURL=collapse.js.map

/***/ }),
/* 177 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__collapse__ = __webpack_require__(176);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__collapse__["a"]; });
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

//# sourceMappingURL=index.js.map

/***/ }),
/* 178 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fadeSlide;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_animations__ = __webpack_require__(8);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

function fadeSlide(direction) {
    "use strict";
    var transform = null;
    if (direction === "up") {
        transform = "translate(0, 25%)";
    }
    else if (direction === "down") {
        transform = "translate(0, -25%)";
    }
    else if (direction === "left") {
        transform = "translate(25%, 0)";
    }
    else if (direction === "right") {
        transform = "translate(-25%, 0)";
    }
    else {
        throw new Error("Unknown direction " + direction + " for slide animation.");
    }
    return [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["transition"])("void => *", [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])({
                opacity: 0,
                transform: transform
            }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["animate"])("0.2s ease-in-out")
        ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["transition"])("* => void", [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["animate"])("0.2s ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])({
                opacity: 0,
                transform: transform
            }))
        ])
    ];
}
;
//# sourceMappingURL=fade-slide.js.map

/***/ }),
/* 179 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fade_slide__ = __webpack_require__(178);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__fade_slide__["a"]; });
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

//# sourceMappingURL=index.js.map

/***/ }),
/* 180 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fade;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_animations__ = __webpack_require__(8);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

function fade(opacity) {
    "use strict";
    if (opacity === void 0) { opacity = 1; }
    return [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["transition"])("void => *", [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])({
                opacity: 0
            }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["animate"])("0.2s ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])({
                opacity: opacity
            }))
        ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["transition"])("* => void", [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["animate"])("0.2s ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])({
                opacity: 0
            }))
        ])
    ];
}
//# sourceMappingURL=fade.js.map

/***/ }),
/* 181 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fade__ = __webpack_require__(180);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__fade__["a"]; });
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

//# sourceMappingURL=index.js.map

/***/ }),
/* 182 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__slide__ = __webpack_require__(183);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__slide__["a"]; });
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

//# sourceMappingURL=index.js.map

/***/ }),
/* 183 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = slide;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_animations__ = __webpack_require__(8);
/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

function slide(direction) {
    "use strict";
    var transform = null;
    if (direction === "up") {
        transform = "translate(0, 25%)";
    }
    else if (direction === "down") {
        transform = "translate(0, -25%)";
    }
    else if (direction === "left") {
        transform = "translate(25%, 0)";
    }
    else if (direction === "right") {
        transform = "translate(-25%, 0)";
    }
    else {
        throw new Error("Unknown direction " + direction + " for slide animation.");
    }
    return [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["transition"])("void => *", [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])({
                transform: transform
            }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["animate"])("0.2s ease-in-out")
        ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["transition"])("* => void", [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["animate"])("0.2s ease-in-out", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])({
                transform: transform
            }))
        ])
    ];
}
;
//# sourceMappingURL=slide.js.map

/***/ }),
/* 184 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderActionService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wizard_navigation__ = __webpack_require__(17);
/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


var HeaderActionService = (function () {
    // this service communicates information about the presence/display of header actions
    // across the wizard
    function HeaderActionService(navService) {
        this.navService = navService;
    }
    Object.defineProperty(HeaderActionService.prototype, "wizardHasHeaderActions", {
        get: function () {
            var wizardHdrActions = this.wizardHeaderActions;
            if (!wizardHdrActions) {
                return false;
            }
            return wizardHdrActions.toArray().length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeaderActionService.prototype, "currentPageHasHeaderActions", {
        get: function () {
            return this.navService.currentPage ? this.navService.currentPage.hasHeaderActions : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeaderActionService.prototype, "showWizardHeaderActions", {
        get: function () {
            return !this.currentPageHasHeaderActions && this.wizardHasHeaderActions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeaderActionService.prototype, "displayHeaderActionsWrapper", {
        get: function () {
            return this.currentPageHasHeaderActions || this.wizardHasHeaderActions;
        },
        enumerable: true,
        configurable: true
    });
    return HeaderActionService;
}());

HeaderActionService.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/** @nocollapse */
HeaderActionService.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_1__wizard_navigation__["a" /* WizardNavigationService */], },
]; };
//# sourceMappingURL=header-actions.js.map

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(141)(undefined);
// imports


// module
exports.push([module.i, "@media (max-width: 767px) {\r\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\r\n    .body-content {\r\n        padding-top: 50px;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(141)(undefined);
// imports


// module
exports.push([module.i, "li .glyphicon {\r\n    margin-right: 10px;\r\n}\r\n\r\n/* Highlighting rules for nav menu items */\r\nli.link-active a,\r\nli.link-active a:hover,\r\nli.link-active a:focus {\r\n    background-color: #4189C7;\r\n    color: white;\r\n}\r\n\r\n/* Keep the nav menu independent of scrolling and on top of other items */\r\n.main-nav {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 1;\r\n}\r\n\r\n@media (min-width: 768px) {\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n    .main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\r\n    }\r\n    .navbar {\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .navbar-header {\r\n        float: none;\r\n    }\r\n    .navbar-collapse {\r\n        border-top: 1px solid #444;\r\n        padding: 0px;\r\n    }\r\n    .navbar ul {\r\n        float: none;\r\n    }\r\n    .navbar li {\r\n        float: none;\r\n        font-size: 15px;\r\n        margin: 6px;\r\n    }\r\n    .navbar li a {\r\n        padding: 10px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .navbar a {\r\n        /* If a menu item's text is too long, truncate it */\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(189),
  Html4Entities: __webpack_require__(188),
  Html5Entities: __webpack_require__(142),
  AllHtmlEntities: __webpack_require__(142)
};


/***/ }),
/* 188 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 189 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 190 */
/***/ (function(module, exports) {

module.exports = "<div class='container-fluid'>\r\n    <div class='row'>\r\n        <div class='col-sm-3'>\r\n            <nav-menu></nav-menu>\r\n        </div>\r\n        <div class='col-sm-9 body-content'>\r\n            <router-outlet></router-outlet>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 191 */
/***/ (function(module, exports) {

module.exports = "<h1>Counter</h1>\r\n\r\n<p>This is a simple example of an Angular component.</p>\r\n\r\n<p>Current count: <strong>{{ currentCount }}</strong></p>\r\n\r\n<button (click)=\"incrementCounter()\">Increment</button>\r\n";

/***/ }),
/* 192 */
/***/ (function(module, exports) {

module.exports = "<h1>Weather forecast</h1>\r\n\r\n<p>This component demonstrates fetching data from the server.</p>\r\n\r\n<p *ngIf=\"!forecasts\"><em>Loading...</em></p>\r\n\r\n<table class='table' *ngIf=\"forecasts\">\r\n    <thead>\r\n        <tr>\r\n            <th>Date</th>\r\n            <th>Temp. (C)</th>\r\n            <th>Temp. (F)</th>\r\n            <th>Summary</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr *ngFor=\"let forecast of forecasts\">\r\n            <td>{{ forecast.dateFormatted }}</td>\r\n            <td>{{ forecast.temperatureC }}</td>\r\n            <td>{{ forecast.temperatureF }}</td>\r\n            <td>{{ forecast.summary }}</td>\r\n        </tr>\r\n    </tbody>\r\n</table>\r\n";

/***/ }),
/* 193 */
/***/ (function(module, exports) {

module.exports = "\r\n<div class=\"content-container\">\r\n    <div class=\"content-area\">\r\n\r\n        <h1>Devices</h1>\r\n\r\n        <p *ngIf=\"!devices\"><em>Loading...</em></p>\r\n\r\n        <table class='table' *ngIf=\"devices\">\r\n            <thead>\r\n                <tr>\r\n                    <th>Id</th>\r\n                    <th>Name</th>\r\n                    <th>Value</th>\r\n                    <th>Last edit</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr *ngFor=\"let device of devices\">\r\n                    <td>{{ device.id }}</td>\r\n                    <td>{{ device.name }}</td>\r\n                    <td>{{ device.value }}</td>\r\n                    <td>{{ device.lastedit }}</td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n\r\n\r\n        <button class=\"btn btn-success\">Success</button>\r\n\r\n      \r\n\r\n\r\n    </div>\r\n    <nav class=\"sidenav\">\r\n       \r\n    </nav>\r\n</div>\r\n\r\n\r\n";

/***/ }),
/* 194 */
/***/ (function(module, exports) {

module.exports = "<div class='main-nav'>\r\n    <div class='navbar navbar-inverse'>\r\n        <div class='navbar-header'>\r\n            <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>\r\n                <span class='sr-only'>Toggle navigation</span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n            </button>\r\n            <a class='navbar-brand' [routerLink]=\"['/home']\">senseGrid</a>\r\n        </div>\r\n        <div class='clearfix'></div>\r\n        <div class='navbar-collapse collapse'>\r\n            <ul class='nav navbar-nav'>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/home']\">\r\n                        <span class='glyphicon glyphicon-wrench'></span> Control\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/counter']\">\r\n                        <span class='glyphicon glyphicon-cog'></span> Settings\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/fetch-data']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Statistics\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(195);
exports.encode = exports.stringify = __webpack_require__(196);


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(205), __webpack_require__(210)))

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(150)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(185);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(186);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(149);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(187).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 204 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(12);

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(39);

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(40);

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(46);

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(59);

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(7);

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(146);
__webpack_require__(145);
module.exports = __webpack_require__(144);


/***/ })
/******/ ]);
//# sourceMappingURL=main-client.js.map
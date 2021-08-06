/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
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
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
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
/******/ 	var hotCurrentHash = "00e3c5661083ad6b8722"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
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
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
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
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
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
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
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
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
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
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
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
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
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
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // CSS and SASS files


__webpack_require__(1);

var _rqrauhvmra__tobi = __webpack_require__(2);

var _rqrauhvmra__tobi2 = _interopRequireDefault(_rqrauhvmra__tobi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tobi = new _rqrauhvmra__tobi2.default();

/*
// Remove the two following lines to remove the product hunt floating prompt
import FloatingPrompt from 'producthunt-floating-prompt'
FloatingPrompt({ name: 'Mobile App Landing Page', url: 'https://www.producthunt.com/posts/mobile-app-landing-page', bottom: '96px', width: '450px' })

// Remove the following lines to remove the darkmode js
import Darkmode from 'darkmode-js'
function addDarkmodeWidget() {
  new Darkmode().showWidget()
}
window.addEventListener('load', addDarkmodeWidget)
*/

var current_lang = localStorage.getItem('current_lang');
if (typeof current_lang !== 'string') {
  var getBestSuitableSupportedLang = function getBestSuitableSupportedLang(lang, locale, supported) {
    // Exclude first element, default language
    var supported_lang = supported.shift();

    if (supported.includes(lang + "-" + locale)) {
      supported_lang = lang + "-" + locale;
    } else if (supported.includes(lang)) {
      supported_lang = lang;
    }

    return supported_lang;
  };

  var _replace$toLowerCase$ = (navigator.userLanguage || navigator.language).replace('-', '_').toLowerCase().split('_'),
      _replace$toLowerCase$2 = _slicedToArray(_replace$toLowerCase$, 2),
      lang = _replace$toLowerCase$2[0],
      locale = _replace$toLowerCase$2[1];

  var supported_languages = ['en', 'vi'];
  var suitable_lang = getBestSuitableSupportedLang(lang, locale, supported_languages);
  localStorage.setItem('current_lang', suitable_lang);
  window.location = '/' + suitable_lang + '/';
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Tobi
 *
 * @author rqrauhvmra
 * @version 1.8.1
 * @url https://github.com/rqrauhvmra/Tobi
 *
 * MIT License
 */
(function (root, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    root.Tobi = factory()
  }
}(this, function () {
  'use strict'

  var Tobi = function Tobi (userOptions) {
    /**
     * Global variables
     *
     */
    var config = {},
      browserWindow = window,
      transformProperty = null,
      gallery = [],
      figcaptionId = 0,
      elementsLength = 0,
      lightbox = null,
      slider = null,
      sliderElements = [],
      prevButton = null,
      nextButton = null,
      closeButton = null,
      counter = null,
      currentIndex = 0,
      drag = {},
      isDraggingX = false,
      isDraggingY = false,
      pointerDown = false,
      lastFocus = null,
      firstFocusableEl = null,
      lastFocusableEl = null,
      offset = null,
      offsetTmp = null,
      resizeTicking = false,
      isYouTubeDependencieLoaded = false,
      waitingEls = [],
      player = [],
      playerId = 0,
      x = 0

    /**
     * Merge default options with user options
     *
     * @param {Object} userOptions - Optional user options
     * @returns {Object} - Custom options
     */
    var mergeOptions = function mergeOptions (userOptions) {
      // Default options
      var options = {
        selector: '.lightbox',
        captions: true,
        captionsSelector: 'img',
        captionAttribute: 'alt',
        nav: 'auto',
        navText: ['<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><polyline points="14 18 8 12 14 6 14 6"></polyline></svg>', '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><polyline points="10 6 16 12 10 18 10 18"></polyline></svg>'],
        navLabel: ['Previous', 'Next'],
        close: true,
        closeText: '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path></svg>',
        closeLabel: 'Close',
        loadingIndicatorLabel: 'Image loading',
        counter: true,
        download: false, // TODO
        downloadText: '', // TODO
        downloadLabel: 'Download', // TODO
        keyboard: true,
        zoom: true,
        zoomText: '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polyline points="21 16 21 21 16 21"/><polyline points="8 21 3 21 3 16"/><polyline points="16 3 21 3 21 8"/><polyline points="3 8 3 3 8 3"/></svg>',
        docClose: true,
        swipeClose: true,
        hideScrollbar: true,
        draggable: true,
        threshold: 100,
        rtl: false, // TODO
        loop: false, // TODO
        autoplayVideo: false,
        theme: 'dark'
      }

      if (userOptions) {
        Object.keys(userOptions).forEach(function (key) {
          options[key] = userOptions[key]
        })
      }

      return options
    }

    /**
     * Determine if browser supports unprefixed transform property
     *
     * @returns {string} - Transform property supported by client
     */
    var transformSupport = function transformSupport () {
      return typeof document.documentElement.style.transform === 'string' ? 'transform' : 'WebkitTransform'
    }

    /**
     * Types - you can add new type to support something new
     *
     */
    var supportedElements = {
      image: {
        checkSupport: function (el) {
          return !el.hasAttribute('data-type') && el.href.match(/\.(png|jpe?g|tiff|tif|gif|bmp|webp|svg|ico)$/)
        },

        init: function (el, container) {
          var figure = document.createElement('figure'),
            figcaption = document.createElement('figcaption'),
            image = document.createElement('img'),
            thumbnail = el.querySelector('img'),
            loadingIndicator = document.createElement('div')

          image.style.opacity = '0'

          if (thumbnail) {
            image.alt = thumbnail.alt || ''
          }

          image.setAttribute('src', '')
          image.setAttribute('data-src', el.href)

          // Add image to figure
          figure.appendChild(image)

          // Create figcaption
          if (config.captions) {
            figcaption.style.opacity = '0'

            if (config.captionsSelector === 'self' && el.getAttribute(config.captionAttribute)) {
              figcaption.textContent = el.getAttribute(config.captionAttribute)
            } else if (config.captionsSelector === 'img' && thumbnail && thumbnail.getAttribute(config.captionAttribute)) {
              figcaption.textContent = thumbnail.getAttribute(config.captionAttribute)
            }

            if (figcaption.textContent) {
              figcaption.id = 'tobi-figcaption-' + figcaptionId
              figure.appendChild(figcaption)

              image.setAttribute('aria-labelledby', figcaption.id)

              ++figcaptionId
            }
          }

          // Add figure to container
          container.appendChild(figure)

          // Create loading indicator
          loadingIndicator.className = 'tobi-loader'
          loadingIndicator.setAttribute('role', 'progressbar')
          loadingIndicator.setAttribute('aria-label', config.loadingIndicatorLabel)

          // Add loading indicator to container
          container.appendChild(loadingIndicator)

          // Register type
          container.setAttribute('data-type', 'image')
        },

        onPreload: function (container) {
          // Same as preload
          supportedElements.image.onLoad(container)
        },

        onLoad: function (container) {
          var image = container.querySelector('img')

          if (!image.hasAttribute('data-src')) {
            return
          }

          var figcaption = container.querySelector('figcaption'),
            loadingIndicator = container.querySelector('.tobi-loader')

          image.onload = function () {
            container.removeChild(loadingIndicator)
            image.style.opacity = '1'

            if (figcaption) {
              figcaption.style.opacity = '1'
            }
          }

          image.setAttribute('src', image.getAttribute('data-src'))
          image.removeAttribute('data-src')
        },

        onLeave: function (container) {
          // Nothing
        },

        onCleanup: function (container) {
          // Nothing
        }
      },

      html: {
        checkSupport: function (el) {
          return checkType(el, 'html')
        },

        init: function (el, container) {
          var targetSelector = el.hasAttribute('href') ? el.getAttribute('href') : el.getAttribute('data-target'),
            target = document.querySelector(targetSelector)

          if (!target) {
            throw new Error('Ups, I can\'t find the target ' + targetSelector + '.')
          }

          // Add content to container
          container.appendChild(target)

          // Register type
          container.setAttribute('data-type', 'html')
        },

        onPreload: function (container) {
          // Nothing
        },

        onLoad: function (container) {
          var video = container.querySelector('video')

          if (video) {
            if (video.hasAttribute('data-time') && video.readyState > 0) {
              // Continue where video was stopped
              video.currentTime = video.getAttribute('data-time')
            }

            if (config.autoplayVideo) {
              // Start playback (and loading if necessary)
              video.play()
            }
          }
        },

        onLeave: function (container) {
          var video = container.querySelector('video')

          if (video) {
            if (!video.paused) {
              // Stop if video is playing
              video.pause()
            }

            // Backup currentTime (needed for revisit)
            if (video.readyState > 0) {
              video.setAttribute('data-time', video.currentTime)
            }
          }
        },

        onCleanup: function (container) {
          var video = container.querySelector('video')

          if (video) {
            if (video.readyState > 0 && video.readyState < 3 && video.duration !== video.currentTime) {
              // Some data has been loaded but not the whole package.
              // In order to save bandwidth, stop downloading as soon as possible.
              var clone = video.cloneNode(true)

              removeSources(video)
              video.load()

              video.parentNode.removeChild(video)

              container.appendChild(clone)
            }
          }
        }
      },

      iframe: {
        checkSupport: function (el) {
          return checkType(el, 'iframe')
        },

        init: function (el, container) {
          var iframe = document.createElement('iframe'),
            href = el.hasAttribute('href') ? el.getAttribute('href') : el.getAttribute('data-target')

          iframe.setAttribute('frameborder', '0')
          iframe.setAttribute('src', '')
          iframe.setAttribute('data-src', href)

          // Add iframe to container
          container.appendChild(iframe)

          // Register type
          container.setAttribute('data-type', 'iframe')
        },

        onPreload: function (container) {
          // Nothing
        },

        onLoad: function (container) {
          var iframe = container.querySelector('iframe')

          iframe.setAttribute('src', iframe.getAttribute('data-src'))
        },

        onLeave: function (container) {
          // Nothing
        },

        onCleanup: function (container) {
          // Nothing
        }
      },

      youtube: {
        checkSupport: function (el) {
          return checkType(el, 'youtube')
        },

        init: function (el, container) {
          var iframePlaceholder = document.createElement('div')

          // Add iframePlaceholder to container
          container.appendChild(iframePlaceholder)

          player[playerId] = new window.YT.Player(iframePlaceholder, {
            host: 'https://www.youtube-nocookie.com',
            height: el.getAttribute('data-height') || '360',
            width: el.getAttribute('data-width') || '640',
            videoId: el.getAttribute('data-id'),
            playerVars: {
              'controls': el.getAttribute('data-controls') || 1,
              'rel': 0,
              'playsinline': 1
            }
          })

          // Set player ID
          container.setAttribute('data-player', playerId)

          // Register type
          container.setAttribute('data-type', 'youtube')

          playerId++
        },

        onPreload: function (container) {
          // Nothing
        },

        onLoad: function (container) {
          if (config.autoplayVideo) {
            player[container.getAttribute('data-player')].playVideo()
          }
        },

        onLeave: function (container) {
          if (player[container.getAttribute('data-player')].getPlayerState() === 1) {
            player[container.getAttribute('data-player')].pauseVideo()
          }
        },

        onCleanup: function (container) {
          if (player[container.getAttribute('data-player')].getPlayerState() === 1) {
            player[container.getAttribute('data-player')].pauseVideo()
          }
        }
      }
    }

    /**
     * Init
     *
     */
    var init = function init (userOptions) {
      // Merge user options into defaults
      config = mergeOptions(userOptions)

      // Transform property supported by client
      transformProperty = transformSupport()

      // Check if the lightbox already exists
      if (!lightbox) {
        // Create the lightbox
        createLightbox()
      }

      // Get a list of all elements within the document
      var els = document.querySelectorAll(config.selector)

      if (!els) {
        throw new Error('Ups, I can\'t find the selector ' + config.selector + '.')
      }

      // Execute a few things once per element
      Array.prototype.forEach.call(els, function (el) {
        checkDependencies(el)
      })
    }

    /**
     * Check dependencies
     *
     * @param {HTMLElement} el - Element to add
     */
    var checkDependencies = function checkDependencies (el) {
      // Check if there is a YouTube video and if the YouTube iframe-API is ready
      if (document.querySelector('[data-type="youtube"]') !== null && !isYouTubeDependencieLoaded) {
        if (document.getElementById('iframe_api') === null) {
          var tag = document.createElement('script'),
            firstScriptTag = document.getElementsByTagName('script')[0]

          tag.id = 'iframe_api'
          tag.src = 'https://www.youtube.com/iframe_api'

          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        }

        if (waitingEls.indexOf(el) === -1) {
          waitingEls.push(el)
        }

        window.onYouTubePlayerAPIReady = function () {
          Array.prototype.forEach.call(waitingEls, function (waitingEl) {
            add(waitingEl)
          })

          isYouTubeDependencieLoaded = true
        }
      } else {
        add(el)
      }
    }

    /**
     * Add element
     *
     * @param {HTMLElement} el - Element to add
     * @param {function} callback - Optional callback to call after add
     */
    var add = function add (el, callback) {
      // Check if element already exists
      if (gallery.indexOf(el) === -1) {
        gallery.push(el)
        elementsLength++

        // Set zoom icon if necessary
        if (config.zoom && el.querySelector('img')) {
          var tobiZoom = document.createElement('div')

          tobiZoom.className = 'tobi-zoom__icon'
          tobiZoom.innerHTML = config.zoomText

          el.classList.add('tobi-zoom')
          el.appendChild(tobiZoom)
        }

        // Bind click event handler
        el.addEventListener('click', function (event) {
          event.preventDefault()

          open(gallery.indexOf(this))
        })

        // Create the slide
        createLightboxSlide(el)

        if (isOpen()) {
          recheckConfig()
          updateLightbox()
        }

        if (callback) {
          callback.call(this)
        }
      } else {
        throw new Error('Ups, element already added to the lightbox.')
      }
    }

    /**
     * Create the lightbox
     *
     */
    var createLightbox = function createLightbox () {
      // Create lightbox container
      lightbox = document.createElement('div')
      lightbox.setAttribute('role', 'dialog')
      lightbox.setAttribute('aria-hidden', 'true')
      lightbox.className = 'tobi tobi--theme-' + config.theme

      // Create slider container
      slider = document.createElement('div')
      slider.className = 'tobi__slider'
      lightbox.appendChild(slider)

      // Create previous button
      prevButton = document.createElement('button')
      prevButton.className = 'tobi__prev'
      prevButton.setAttribute('type', 'button')
      prevButton.setAttribute('aria-label', config.navLabel[0])
      prevButton.innerHTML = config.navText[0]
      lightbox.appendChild(prevButton)

      // Create next button
      nextButton = document.createElement('button')
      nextButton.className = 'tobi__next'
      nextButton.setAttribute('type', 'button')
      nextButton.setAttribute('aria-label', config.navLabel[1])
      nextButton.innerHTML = config.navText[1]
      lightbox.appendChild(nextButton)

      // Create close button
      closeButton = document.createElement('button')
      closeButton.className = 'tobi__close'
      closeButton.setAttribute('type', 'button')
      closeButton.setAttribute('aria-label', config.closeLabel)
      closeButton.innerHTML = config.closeText
      lightbox.appendChild(closeButton)

      // Create counter
      counter = document.createElement('div')
      counter.className = 'tobi__counter'
      lightbox.appendChild(counter)

      // Resize event using requestAnimationFrame
      browserWindow.addEventListener('resize', function () {
        if (!resizeTicking) {
          resizeTicking = true

          browserWindow.requestAnimationFrame(function () {
            updateOffset()

            resizeTicking = false
          })
        }
      })

      document.body.appendChild(lightbox)
    }

    /**
     * Create a lightbox slide
     *
     */
    var createLightboxSlide = function createLightboxSlide (el) {
      // Detect type
      for (var index in supportedElements) {
        if (supportedElements.hasOwnProperty(index)) {
          if (supportedElements[index].checkSupport(el)) {
            // Create slide elements
            var sliderElement = document.createElement('div'),
              sliderElementContent = document.createElement('div')

            sliderElement.className = 'tobi__slider__slide'
            sliderElement.style.position = 'absolute'
            sliderElement.style.left = x * 100 + '%'
            sliderElementContent.className = 'tobi__slider__slide__content'

            // Create type elements
            supportedElements[index].init(el, sliderElementContent)

            // Add slide content container to slider element
            sliderElement.appendChild(sliderElementContent)

            // Add slider element to slider
            slider.appendChild(sliderElement)
            sliderElements.push(sliderElement)

            ++x

            break
          }
        }
      }
    }

    /**
     * Open the lightbox
     *
     * @param {number} index - Index to load
     * @param {function} callback - Optional callback to call after open
     */
    var open = function open (index, callback) {
      if (!isOpen() && !index) {
        index = 0
      }

      if (isOpen()) {
        if (!index) {
          throw new Error('Ups, Tobi is aleady open.')
        }

        if (index === currentIndex) {
          throw new Error('Ups, slide ' + index + ' is already selected.')
        }
      }

      if (index === -1 || index >= elementsLength) {
        throw new Error('Ups, I can\'t find slide ' + index + '.')
      }

      if (config.hideScrollbar) {
        document.documentElement.classList.add('tobi-is-open')
        document.body.classList.add('tobi-is-open')
      }

      recheckConfig()

      // Hide close if necessary
      if (!config.close) {
        closeButton.disabled = false
        closeButton.setAttribute('aria-hidden', 'true')
      }

      // Save the user’s focus
      lastFocus = document.activeElement

      // Set current index
      currentIndex = index

      // Clear drag
      clearDrag()

      // Bind events
      bindEvents()

      // Load slide
      load(currentIndex)

      // Makes lightbox appear, too
      lightbox.setAttribute('aria-hidden', 'false')

      // Update lightbox
      updateLightbox()

      // Preload late
      preload(currentIndex + 1)
      preload(currentIndex - 1)

      if (callback) {
        callback.call(this)
      }
    }

    /**
     * Close the lightbox
     *
     * @param {function} callback - Optional callback to call after close
     */
    var close = function close (callback) {
      if (!isOpen()) {
        throw new Error('Tobi is already closed.')
      }

      if (config.hideScrollbar) {
        document.documentElement.classList.remove('tobi-is-open')
        document.body.classList.remove('tobi-is-open')
      }

      // Unbind events
      unbindEvents()

      // Reenable the user’s focus
      lastFocus.focus()

      // Don't forget to cleanup our current element
      var container = sliderElements[currentIndex].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')
      supportedElements[type].onLeave(container)
      supportedElements[type].onCleanup(container)

      lightbox.setAttribute('aria-hidden', 'true')

      // Reset current index
      currentIndex = 0

      if (callback) {
        callback.call(this)
      }
    }

    /**
     * Preload slide
     *
     * @param {number} index - Index to preload
     */
    var preload = function preload (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onPreload(container)
    }

    /**
     * Load slide
     * Will be called when opening the lightbox or moving index
     *
     * @param {number} index - Index to load
     */
    var load = function load (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onLoad(container)
    }

    /**
     * Navigate to the previous slide
     *
     * @param {function} callback - Optional callback function
     */
    var prev = function prev (callback) {
      if (currentIndex > 0) {
        leave(currentIndex)
        load(--currentIndex)
        updateLightbox('left')
        cleanup(currentIndex + 1)
        preload(currentIndex - 1)

        if (callback) {
          callback.call(this)
        }
      }
    }

    /**
     * Navigate to the next slide
     *
     * @param {function} callback - Optional callback function
     */
    var next = function next (callback) {
      if (currentIndex < elementsLength - 1) {
        leave(currentIndex)
        load(++currentIndex)
        updateLightbox('right')
        cleanup(currentIndex - 1)
        preload(currentIndex + 1)

        if (callback) {
          callback.call(this)
        }
      }
    }

    /**
     * Leave slide
     * Will be called before moving index
     *
     * @param {number} index - Index to leave
     */
    var leave = function leave (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onLeave(container)
    }

    /**
     * Cleanup slide
     * Will be called after moving index
     *
     * @param {number} index - Index to cleanup
     */
    var cleanup = function cleanup (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onCleanup(container)
    }

    /**
     * Update the offset
     *
     */
    var updateOffset = function updateOffset () {
      offset = -currentIndex * window.innerWidth

      slider.style[transformProperty] = 'translate3d(' + offset + 'px, 0, 0)'
      offsetTmp = offset
    }

    /**
     * Update the counter
     *
     */
    var updateCounter = function updateCounter () {
      counter.textContent = (currentIndex + 1) + '/' + elementsLength
    }

    /**
     * Set the focus to the next element
     *
     * @param {string} dir - Current slide direction
     */
    var updateFocus = function updateFocus (dir) {
      var focusableEls = null

      if (config.nav) {
        // Display the next and previous buttons
        prevButton.disabled = false
        nextButton.disabled = false

        if (elementsLength === 1) {
          // Hide the next and previous buttons if there is only one slide
          prevButton.disabled = true
          nextButton.disabled = true

          if (config.close) {
            closeButton.focus()
          }
        } else if (currentIndex === 0) {
          // Hide the previous button when the first slide is displayed
          prevButton.disabled = true
        } else if (currentIndex === elementsLength - 1) {
          // Hide the next button when the last slide is displayed
          nextButton.disabled = true
        }

        if (!dir && !nextButton.disabled) {
          nextButton.focus()
        } else if (!dir && nextButton.disabled && !prevButton.disabled) {
          prevButton.focus()
        } else if (!nextButton.disabled && dir === 'right') {
          nextButton.focus()
        } else if (nextButton.disabled && dir === 'right' && !prevButton.disabled) {
          prevButton.focus()
        } else if (!prevButton.disabled && dir === 'left') {
          prevButton.focus()
        } else if (prevButton.disabled && dir === 'left' && !nextButton.disabled) {
          nextButton.focus()
        }
      } else if (config.close) {
        closeButton.focus()
      }

      focusableEls = lightbox.querySelectorAll('button:not(:disabled)')
      firstFocusableEl = focusableEls[0]
      lastFocusableEl = focusableEls.length === 1 ? focusableEls[0] : focusableEls[focusableEls.length - 1]
    }

    /**
     * Clear drag after touchend and mousup event
     *
     */
    var clearDrag = function clearDrag () {
      drag = {
        startX: 0,
        endX: 0,
        startY: 0,
        endY: 0
      }
    }

    /**
     * Recalculate drag / swipe event
     *
     */
    var updateAfterDrag = function updateAfterDrag () {
      var movementX = drag.endX - drag.startX,
        movementY = drag.endY - drag.startY,
        movementXDistance = Math.abs(movementX),
        movementYDistance = Math.abs(movementY)

      if (movementX > 0 && movementXDistance > config.threshold && currentIndex > 0) {
        prev()
      } else if (movementX < 0 && movementXDistance > config.threshold && currentIndex !== elementsLength - 1) {
        next()
      } else if (movementY < 0 && movementYDistance > config.threshold && config.swipeClose) {
        close()
      } else {
        updateOffset()
      }
    }

    /**
     * Click event handler
     *
     */
    var clickHandler = function clickHandler (event) {
      if (event.target === prevButton) {
        prev()
      } else if (event.target === nextButton) {
        next()
      } else if (event.target === closeButton || (event.target.className === 'tobi__slider__slide' && config.docClose)) {
        close()
      }

      event.stopPropagation()
    }

    /**
     * Keydown event handler
     *
     */
    var keydownHandler = function keydownHandler (event) {
      if (event.keyCode === 9) {
        // `TAB` Key: Navigate to the next/previous focusable element
        if (event.shiftKey) {
          // Step backwards in the tab-order
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus()
            event.preventDefault()
          }
        } else {
          // Step forward in the tab-order
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus()
            event.preventDefault()
          }
        }
      } else if (event.keyCode === 27) {
        // `ESC` Key: Close the lightbox
        event.preventDefault()
        close()
      } else if (event.keyCode === 37) {
        // `PREV` Key: Navigate to the previous slide
        event.preventDefault()
        prev()
      } else if (event.keyCode === 39) {
        // `NEXT` Key: Navigate to the next slide
        event.preventDefault()
        next()
      }
    }

    /**
     * Touchstart event handler
     *
     */
    var touchstartHandler = function touchstartHandler (event) {
      // Prevent dragging / swiping on textareas inputs and selects
      if (isIgnoreElement(event.target)) {
        return
      }

      event.stopPropagation()

      pointerDown = true

      drag.startX = event.touches[0].pageX
      drag.startY = event.touches[0].pageY

      slider.classList.add('tobi__slider--is-dragging')
    }

    /**
     * Touchmove event handler
     *
     */
    var touchmoveHandler = function touchmoveHandler (event) {
      event.stopPropagation()

      if (pointerDown) {
        event.preventDefault()

        drag.endX = event.touches[0].pageX
        drag.endY = event.touches[0].pageY

        doSwipe()
      }
    }

    /**
     * Touchend event handler
     *
     */
    var touchendHandler = function touchendHandler (event) {
      event.stopPropagation()

      pointerDown = false

      slider.classList.remove('tobi__slider--is-dragging')

      if (drag.endX) {
        isDraggingX = false
        isDraggingY = false

        updateAfterDrag()
      }

      clearDrag()
    }

    /**
     * Mousedown event handler
     *
     */
    var mousedownHandler = function mousedownHandler (event) {
      // Prevent dragging / swiping on textareas inputs and selects
      if (isIgnoreElement(event.target)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      pointerDown = true

      drag.startX = event.pageX
      drag.startY = event.pageY

      slider.classList.add('tobi__slider--is-dragging')
    }

    /**
     * Mousemove event handler
     *
     */
    var mousemoveHandler = function mousemoveHandler (event) {
      event.preventDefault()

      if (pointerDown) {
        drag.endX = event.pageX
        drag.endY = event.pageY

        doSwipe()
      }
    }

    /**
     * Mouseup event handler
     *
     */
    var mouseupHandler = function mouseupHandler (event) {
      event.stopPropagation()

      pointerDown = false

      slider.classList.remove('tobi__slider--is-dragging')

      if (drag.endX) {
        isDraggingX = false
        isDraggingY = false

        updateAfterDrag()
      }

      clearDrag()
    }

    /**
     * Decide whether to do horizontal of vertical swipe
     *
     */
    var doSwipe = function doSwipe () {
      if (Math.abs(drag.startX - drag.endX) > 0 && !isDraggingY && config.swipeClose) {
        // Horizontal swipe
        slider.style[transformProperty] = 'translate3d(' + (offsetTmp - Math.round(drag.startX - drag.endX)) + 'px, 0, 0)'

        isDraggingX = true
        isDraggingY = false
      } else if (Math.abs(drag.startY - drag.endY) > 0 && !isDraggingX) {
        // Vertical swipe
        slider.style[transformProperty] = 'translate3d(' + (offsetTmp + 'px, -' + Math.round(drag.startY - drag.endY)) + 'px, 0)'

        isDraggingX = false
        isDraggingY = true
      }
    }

    /**
     * Bind events
     *
     */
    var bindEvents = function bindEvents () {
      if (config.keyboard) {
        document.addEventListener('keydown', keydownHandler)
      }

      // Click event
      lightbox.addEventListener('click', clickHandler)

      if (config.draggable) {
        if (isTouchDevice()) {
          // Touch events
          lightbox.addEventListener('touchstart', touchstartHandler)
          lightbox.addEventListener('touchmove', touchmoveHandler)
          lightbox.addEventListener('touchend', touchendHandler)
        }

        // Mouse events
        lightbox.addEventListener('mousedown', mousedownHandler)
        lightbox.addEventListener('mouseup', mouseupHandler)
        lightbox.addEventListener('mousemove', mousemoveHandler)
      }
    }

    /**
     * Unbind events
     *
     */
    var unbindEvents = function unbindEvents () {
      if (config.keyboard) {
        document.removeEventListener('keydown', keydownHandler)
      }

      // Click event
      lightbox.removeEventListener('click', clickHandler)

      if (config.draggable) {
        if (isTouchDevice()) {
          // Touch events
          lightbox.removeEventListener('touchstart', touchstartHandler)
          lightbox.removeEventListener('touchmove', touchmoveHandler)
          lightbox.removeEventListener('touchend', touchendHandler)
        }

        // Mouse events
        lightbox.removeEventListener('mousedown', mousedownHandler)
        lightbox.removeEventListener('mouseup', mouseupHandler)
        lightbox.removeEventListener('mousemove', mousemoveHandler)
      }
    }

    /**
     * Checks whether element has requested data-type value
     *
     */
    var checkType = function checkType (el, type) {
      return el.getAttribute('data-type') === type
    }

    /**
     * Remove all `src` attributes
     *
     * @param {HTMLElement} el - Element to remove all `src` attributes
     */
    var removeSources = function setVideoSources (el) {
      var sources = el.querySelectorAll('src')

      if (sources) {
        Array.prototype.forEach.call(sources, function (source) {
          source.setAttribute('src', '')
        })
      }
    }

    /**
     * Update Config
     *
     */
    var recheckConfig = function recheckConfig () {
      if (config.draggable && elementsLength > 1 && !slider.classList.contains('tobi__slider--is-draggable')) {
        slider.classList.add('tobi__slider--is-draggable')
      }

      // Hide buttons if necessary
      if (!config.nav || elementsLength === 1 || (config.nav === 'auto' && isTouchDevice())) {
        prevButton.setAttribute('aria-hidden', 'true')
        nextButton.setAttribute('aria-hidden', 'true')
      } else {
        prevButton.setAttribute('aria-hidden', 'false')
        nextButton.setAttribute('aria-hidden', 'false')
      }

      // Hide counter if necessary
      if (!config.counter || elementsLength === 1) {
        counter.setAttribute('aria-hidden', 'true')
      } else {
        counter.setAttribute('aria-hidden', 'false')
      }
    }

    /**
     * Update lightbox
     *
     * @param {string} dir - Current slide direction
     */
    var updateLightbox = function updateLightbox (dir) {
      updateOffset()
      updateCounter()
      updateFocus(dir)
    }

    /**
     * Reset the lightbox
     *
     * @param {function} callback - Optional callback to call after reset
     */
    var reset = function reset (callback) {
      if (slider) {
        while (slider.firstChild) {
          slider.removeChild(slider.firstChild)
        }
      }

      gallery.length = sliderElements.length = elementsLength = figcaptionId = x = 0

      if (callback) {
        callback.call(this)
      }
    }

    /**
     * Check if the lightbox is open
     *
     */
    var isOpen = function isOpen () {
      return lightbox.getAttribute('aria-hidden') === 'false'
    }

    /**
     * Detect whether device is touch capable
     *
     */
    var isTouchDevice = function isTouchDevice () {
      return 'ontouchstart' in window
    }

    /**
     * Checks whether element's nodeName is part of array
     *
     */
    var isIgnoreElement = function isIgnoreElement (el) {
      return ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(el.nodeName) !== -1 || el === prevButton || el === nextButton || el === closeButton || elementsLength === 1
    }

    /**
     * Return current index
     *
     */
    var currentSlide = function currentSlide () {
      return currentIndex
    }

    init(userOptions)

    return {
      open: open,
      prev: prev,
      next: next,
      close: close,
      add: checkDependencies,
      reset: reset,
      isOpen: isOpen,
      currentSlide: currentSlide
    }
  }

  return Tobi
}))


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDBlM2M1NjYxMDgzYWQ2Yjg3MjIiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JxcmF1aHZtcmFfX3RvYmkvanMvdG9iaS5qcyJdLCJuYW1lcyI6WyJ0b2JpIiwiVG9iaSIsImN1cnJlbnRfbGFuZyIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnZXRCZXN0U3VpdGFibGVTdXBwb3J0ZWRMYW5nIiwibGFuZyIsImxvY2FsZSIsInN1cHBvcnRlZCIsInN1cHBvcnRlZF9sYW5nIiwic2hpZnQiLCJpbmNsdWRlcyIsIm5hdmlnYXRvciIsInVzZXJMYW5ndWFnZSIsImxhbmd1YWdlIiwicmVwbGFjZSIsInRvTG93ZXJDYXNlIiwic3BsaXQiLCJzdXBwb3J0ZWRfbGFuZ3VhZ2VzIiwic3VpdGFibGVfbGFuZyIsInNldEl0ZW0iLCJ3aW5kb3ciLCJsb2NhdGlvbiJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSwyREFBMkQ7UUFDM0Q7UUFDQTtRQUNBLEdBQUc7O1FBRUgsNENBQTRDO1FBQzVDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUEsZ0RBQWdEO1FBQ2hEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQSxPQUFPO1FBQ1A7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKOzs7O1FBSUE7UUFDQSw4Q0FBOEM7UUFDOUM7UUFDQTtRQUNBLDRCQUE0QjtRQUM1Qiw2QkFBNkI7UUFDN0IsaUNBQWlDOztRQUVqQyx1Q0FBdUM7UUFDdkM7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLOztRQUVMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUEsc0NBQXNDO1FBQ3RDO1FBQ0E7UUFDQSw2QkFBNkI7UUFDN0IsNkJBQTZCO1FBQzdCO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxvQkFBb0IsZ0JBQWdCO1FBQ3BDO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBLG9CQUFvQixnQkFBZ0I7UUFDcEM7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQSxLQUFLOztRQUVMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBLGlCQUFpQiw4QkFBOEI7UUFDL0M7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKOztRQUVBLG9EQUFvRDtRQUNwRDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxtQkFBbUIsMkJBQTJCO1FBQzlDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxPQUFPO1FBQ1A7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLGtCQUFrQixjQUFjO1FBQ2hDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBLGFBQWEsNEJBQTRCO1FBQ3pDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTs7UUFFSjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7O1FBRUE7UUFDQTtRQUNBLGNBQWMsNEJBQTRCO1FBQzFDO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0EsY0FBYyw0QkFBNEI7UUFDMUM7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsZ0JBQWdCLHVDQUF1QztRQUN2RDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsZ0JBQWdCLHVDQUF1QztRQUN2RDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLGdCQUFnQixzQkFBc0I7UUFDdEM7UUFDQTtRQUNBO1FBQ0EsUUFBUTtRQUNSO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLFVBQVU7UUFDVjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLGFBQWEsd0NBQXdDO1FBQ3JEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0EsT0FBTztRQUNQO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsU0FBUztRQUNUO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLFFBQVE7UUFDUjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsZUFBZTtRQUNmO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOztRQUVBO1FBQ0Esc0NBQXNDLHVCQUF1Qjs7UUFFN0Q7UUFDQTs7Ozs7Ozs7Ozt5cEJDbnRCQTs7O0FBQ0E7O0FBRUE7Ozs7OztBQUNBLElBQU1BLE9BQU8sSUFBSUMsMEJBQUosRUFBYjs7QUFFQTs7Ozs7Ozs7Ozs7OztBQWFBLElBQUlDLGVBQWVDLGFBQWFDLE9BQWIsQ0FBcUIsY0FBckIsQ0FBbkI7QUFDQSxJQUFJLE9BQU9GLFlBQVAsS0FBeUIsUUFBN0IsRUFBdUM7QUFBQSxNQUM1QkcsNEJBRDRCLEdBQ3JDLFNBQVNBLDRCQUFULENBQXNDQyxJQUF0QyxFQUE0Q0MsTUFBNUMsRUFBb0RDLFNBQXBELEVBQStEO0FBQzdEO0FBQ0EsUUFBSUMsaUJBQWlCRCxVQUFVRSxLQUFWLEVBQXJCOztBQUVBLFFBQUlGLFVBQVVHLFFBQVYsQ0FBbUJMLE9BQU8sR0FBUCxHQUFhQyxNQUFoQyxDQUFKLEVBQTZDO0FBQzNDRSx1QkFBaUJILE9BQU8sR0FBUCxHQUFhQyxNQUE5QjtBQUNELEtBRkQsTUFFTyxJQUFJQyxVQUFVRyxRQUFWLENBQW1CTCxJQUFuQixDQUFKLEVBQThCO0FBQ25DRyx1QkFBaUJILElBQWpCO0FBQ0Q7O0FBRUQsV0FBT0csY0FBUDtBQUNELEdBWm9DOztBQUFBLDhCQWFkLENBQUNHLFVBQVVDLFlBQVYsSUFBMEJELFVBQVVFLFFBQXJDLEVBQStDQyxPQUEvQyxDQUF1RCxHQUF2RCxFQUE0RCxHQUE1RCxDQUFELENBQW1FQyxXQUFuRSxFQUFELENBQW1GQyxLQUFuRixDQUF5RixHQUF6RixDQWJnQjtBQUFBO0FBQUEsTUFhaENYLElBYmdDO0FBQUEsTUFhMUJDLE1BYjBCOztBQWNyQyxNQUFJVyxzQkFBc0IsQ0FBQyxJQUFELEVBQU8sSUFBUCxDQUExQjtBQUNBLE1BQUlDLGdCQUFnQmQsNkJBQTZCQyxJQUE3QixFQUFtQ0MsTUFBbkMsRUFBMkNXLG1CQUEzQyxDQUFwQjtBQUNBZixlQUFhaUIsT0FBYixDQUFxQixjQUFyQixFQUFxQ0QsYUFBckM7QUFDQUUsU0FBT0MsUUFBUCxHQUFrQixNQUFNSCxhQUFOLEdBQXNCLEdBQXhDO0FBQ0QsQzs7Ozs7O0FDdENELHlDOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBMEM7QUFDaEQ7QUFDQSxJQUFJLG9DQUFPLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQSxvR0FBQztBQUNuQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXOztBQUVYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsWUFBWTtBQUMzQixlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsWUFBWTtBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQyIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gXHJcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHRcdGlmKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdH0gO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHQ7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXF1ZXN0VGltZW91dCA9IHJlcXVlc3RUaW1lb3V0IHx8IDEwMDAwO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IHJlcXVlc3RUaW1lb3V0O1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCIwMGUzYzU2NjEwODNhZDZiODcyMlwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xyXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXHJcbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XHJcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XHJcbiBcdFx0XHR9KS50aGVuKFxyXG4gXHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHQpO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgY2I7XHJcbiBcdFx0dmFyIGk7XHJcbiBcdFx0dmFyIGo7XHJcbiBcdFx0dmFyIG1vZHVsZTtcclxuIFx0XHR2YXIgbW9kdWxlSWQ7XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XHJcbiBcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXHJcbiBcdFx0XHRcdFx0aWQ6IGlkXHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XHJcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX21haW4pIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZighcGFyZW50KSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxyXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcclxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xyXG4gXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiKTtcclxuIFx0XHR9O1xyXG4gXHRcclxuIFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQ7XHJcbiBcdFx0XHRcdGlmKGhvdFVwZGF0ZVtpZF0pIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XHJcbiBcdFx0XHRcdGlmKHJlc3VsdC5jaGFpbikge1xyXG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRzd2l0Y2gocmVzdWx0LnR5cGUpIHtcclxuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vblVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25BY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRpc3Bvc2VkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRkZWZhdWx0OlxyXG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihhYm9ydEVycm9yKSB7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvQXBwbHkpIHtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHRcdFx0XHRmb3IobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9EaXNwb3NlKSB7XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XHJcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcclxuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcclxuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcclxuIFx0XHR2YXIgaWR4O1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdGlmKCFtb2R1bGUpIGNvbnRpbnVlO1xyXG4gXHRcclxuIFx0XHRcdHZhciBkYXRhID0ge307XHJcbiBcdFxyXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXHJcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdFx0aWYoY2IpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyLCAvLyBUT0RPIHJlbW92ZSBpbiB3ZWJwYWNrIDRcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXHJcbiBcdFx0aWYoZXJyb3IpIHtcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xyXG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9hc3NldHMvXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMDBlM2M1NjYxMDgzYWQ2Yjg3MjIiLCIvLyBDU1MgYW5kIFNBU1MgZmlsZXNcbmltcG9ydCAnLi9pbmRleC5zY3NzJztcblxuaW1wb3J0IFRvYmkgZnJvbSAncnFyYXVodm1yYV9fdG9iaSdcbmNvbnN0IHRvYmkgPSBuZXcgVG9iaSgpXG5cbi8qXG4vLyBSZW1vdmUgdGhlIHR3byBmb2xsb3dpbmcgbGluZXMgdG8gcmVtb3ZlIHRoZSBwcm9kdWN0IGh1bnQgZmxvYXRpbmcgcHJvbXB0XG5pbXBvcnQgRmxvYXRpbmdQcm9tcHQgZnJvbSAncHJvZHVjdGh1bnQtZmxvYXRpbmctcHJvbXB0J1xuRmxvYXRpbmdQcm9tcHQoeyBuYW1lOiAnTW9iaWxlIEFwcCBMYW5kaW5nIFBhZ2UnLCB1cmw6ICdodHRwczovL3d3dy5wcm9kdWN0aHVudC5jb20vcG9zdHMvbW9iaWxlLWFwcC1sYW5kaW5nLXBhZ2UnLCBib3R0b206ICc5NnB4Jywgd2lkdGg6ICc0NTBweCcgfSlcblxuLy8gUmVtb3ZlIHRoZSBmb2xsb3dpbmcgbGluZXMgdG8gcmVtb3ZlIHRoZSBkYXJrbW9kZSBqc1xuaW1wb3J0IERhcmttb2RlIGZyb20gJ2Rhcmttb2RlLWpzJ1xuZnVuY3Rpb24gYWRkRGFya21vZGVXaWRnZXQoKSB7XG4gIG5ldyBEYXJrbW9kZSgpLnNob3dXaWRnZXQoKVxufVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBhZGREYXJrbW9kZVdpZGdldClcbiovXG5cbnZhciBjdXJyZW50X2xhbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9sYW5nJyk7XG5pZiAodHlwZW9mKGN1cnJlbnRfbGFuZykgIT09ICdzdHJpbmcnKSB7XG4gIGZ1bmN0aW9uIGdldEJlc3RTdWl0YWJsZVN1cHBvcnRlZExhbmcobGFuZywgbG9jYWxlLCBzdXBwb3J0ZWQpIHtcbiAgICAvLyBFeGNsdWRlIGZpcnN0IGVsZW1lbnQsIGRlZmF1bHQgbGFuZ3VhZ2VcbiAgICB2YXIgc3VwcG9ydGVkX2xhbmcgPSBzdXBwb3J0ZWQuc2hpZnQoKTtcbiAgICBcbiAgICBpZiAoc3VwcG9ydGVkLmluY2x1ZGVzKGxhbmcgKyBcIi1cIiArIGxvY2FsZSkpIHtcbiAgICAgIHN1cHBvcnRlZF9sYW5nID0gbGFuZyArIFwiLVwiICsgbG9jYWxlO1xuICAgIH0gZWxzZSBpZiAoc3VwcG9ydGVkLmluY2x1ZGVzKGxhbmcpKSB7XG4gICAgICBzdXBwb3J0ZWRfbGFuZyA9IGxhbmc7XG4gICAgfVxuICBcbiAgICByZXR1cm4gc3VwcG9ydGVkX2xhbmc7XG4gIH1cbiAgdmFyIFtsYW5nLCBsb2NhbGVdID0gKCgobmF2aWdhdG9yLnVzZXJMYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UpLnJlcGxhY2UoJy0nLCAnXycpKS50b0xvd2VyQ2FzZSgpKS5zcGxpdCgnXycpO1xuICB2YXIgc3VwcG9ydGVkX2xhbmd1YWdlcyA9IFsnZW4nLCAndmknXTtcbiAgdmFyIHN1aXRhYmxlX2xhbmcgPSBnZXRCZXN0U3VpdGFibGVTdXBwb3J0ZWRMYW5nKGxhbmcsIGxvY2FsZSwgc3VwcG9ydGVkX2xhbmd1YWdlcyk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2xhbmcnLCBzdWl0YWJsZV9sYW5nKTtcbiAgd2luZG93LmxvY2F0aW9uID0gJy8nICsgc3VpdGFibGVfbGFuZyArICcvJztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvaW5kZXguanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vX3NyYy9pbmRleC5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxyXG4gKiBUb2JpXHJcbiAqXHJcbiAqIEBhdXRob3IgcnFyYXVodm1yYVxyXG4gKiBAdmVyc2lvbiAxLjguMVxyXG4gKiBAdXJsIGh0dHBzOi8vZ2l0aHViLmNvbS9ycXJhdWh2bXJhL1RvYmlcclxuICpcclxuICogTUlUIExpY2Vuc2VcclxuICovXHJcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xyXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgIGRlZmluZShmYWN0b3J5KVxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxyXG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXHJcbiAgICAvLyBsaWtlIE5vZGUuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxyXG4gICAgcm9vdC5Ub2JpID0gZmFjdG9yeSgpXHJcbiAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCdcclxuXHJcbiAgdmFyIFRvYmkgPSBmdW5jdGlvbiBUb2JpICh1c2VyT3B0aW9ucykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBHbG9iYWwgdmFyaWFibGVzXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgY29uZmlnID0ge30sXHJcbiAgICAgIGJyb3dzZXJXaW5kb3cgPSB3aW5kb3csXHJcbiAgICAgIHRyYW5zZm9ybVByb3BlcnR5ID0gbnVsbCxcclxuICAgICAgZ2FsbGVyeSA9IFtdLFxyXG4gICAgICBmaWdjYXB0aW9uSWQgPSAwLFxyXG4gICAgICBlbGVtZW50c0xlbmd0aCA9IDAsXHJcbiAgICAgIGxpZ2h0Ym94ID0gbnVsbCxcclxuICAgICAgc2xpZGVyID0gbnVsbCxcclxuICAgICAgc2xpZGVyRWxlbWVudHMgPSBbXSxcclxuICAgICAgcHJldkJ1dHRvbiA9IG51bGwsXHJcbiAgICAgIG5leHRCdXR0b24gPSBudWxsLFxyXG4gICAgICBjbG9zZUJ1dHRvbiA9IG51bGwsXHJcbiAgICAgIGNvdW50ZXIgPSBudWxsLFxyXG4gICAgICBjdXJyZW50SW5kZXggPSAwLFxyXG4gICAgICBkcmFnID0ge30sXHJcbiAgICAgIGlzRHJhZ2dpbmdYID0gZmFsc2UsXHJcbiAgICAgIGlzRHJhZ2dpbmdZID0gZmFsc2UsXHJcbiAgICAgIHBvaW50ZXJEb3duID0gZmFsc2UsXHJcbiAgICAgIGxhc3RGb2N1cyA9IG51bGwsXHJcbiAgICAgIGZpcnN0Rm9jdXNhYmxlRWwgPSBudWxsLFxyXG4gICAgICBsYXN0Rm9jdXNhYmxlRWwgPSBudWxsLFxyXG4gICAgICBvZmZzZXQgPSBudWxsLFxyXG4gICAgICBvZmZzZXRUbXAgPSBudWxsLFxyXG4gICAgICByZXNpemVUaWNraW5nID0gZmFsc2UsXHJcbiAgICAgIGlzWW91VHViZURlcGVuZGVuY2llTG9hZGVkID0gZmFsc2UsXHJcbiAgICAgIHdhaXRpbmdFbHMgPSBbXSxcclxuICAgICAgcGxheWVyID0gW10sXHJcbiAgICAgIHBsYXllcklkID0gMCxcclxuICAgICAgeCA9IDBcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHVzZXIgb3B0aW9uc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyT3B0aW9ucyAtIE9wdGlvbmFsIHVzZXIgb3B0aW9uc1xyXG4gICAgICogQHJldHVybnMge09iamVjdH0gLSBDdXN0b20gb3B0aW9uc1xyXG4gICAgICovXHJcbiAgICB2YXIgbWVyZ2VPcHRpb25zID0gZnVuY3Rpb24gbWVyZ2VPcHRpb25zICh1c2VyT3B0aW9ucykge1xyXG4gICAgICAvLyBEZWZhdWx0IG9wdGlvbnNcclxuICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgc2VsZWN0b3I6ICcubGlnaHRib3gnLFxyXG4gICAgICAgIGNhcHRpb25zOiB0cnVlLFxyXG4gICAgICAgIGNhcHRpb25zU2VsZWN0b3I6ICdpbWcnLFxyXG4gICAgICAgIGNhcHRpb25BdHRyaWJ1dGU6ICdhbHQnLFxyXG4gICAgICAgIG5hdjogJ2F1dG8nLFxyXG4gICAgICAgIG5hdlRleHQ6IFsnPHN2ZyByb2xlPVwiaW1nXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdib3g9XCIwIDAgMjQgMjRcIj48cG9seWxpbmUgcG9pbnRzPVwiMTQgMTggOCAxMiAxNCA2IDE0IDZcIj48L3BvbHlsaW5lPjwvc3ZnPicsICc8c3ZnIHJvbGU9XCJpbWdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld2JveD1cIjAgMCAyNCAyNFwiPjxwb2x5bGluZSBwb2ludHM9XCIxMCA2IDE2IDEyIDEwIDE4IDEwIDE4XCI+PC9wb2x5bGluZT48L3N2Zz4nXSxcclxuICAgICAgICBuYXZMYWJlbDogWydQcmV2aW91cycsICdOZXh0J10sXHJcbiAgICAgICAgY2xvc2U6IHRydWUsXHJcbiAgICAgICAgY2xvc2VUZXh0OiAnPHN2ZyByb2xlPVwiaW1nXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdib3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTYuMzQzMTQ1NzUgNi4zNDMxNDU3NUwxNy42NTY4NTQyIDE3LjY1Njg1NDJNNi4zNDMxNDU3NSAxNy42NTY4NTQyTDE3LjY1Njg1NDIgNi4zNDMxNDU3NVwiPjwvcGF0aD48L3N2Zz4nLFxyXG4gICAgICAgIGNsb3NlTGFiZWw6ICdDbG9zZScsXHJcbiAgICAgICAgbG9hZGluZ0luZGljYXRvckxhYmVsOiAnSW1hZ2UgbG9hZGluZycsXHJcbiAgICAgICAgY291bnRlcjogdHJ1ZSxcclxuICAgICAgICBkb3dubG9hZDogZmFsc2UsIC8vIFRPRE9cclxuICAgICAgICBkb3dubG9hZFRleHQ6ICcnLCAvLyBUT0RPXHJcbiAgICAgICAgZG93bmxvYWRMYWJlbDogJ0Rvd25sb2FkJywgLy8gVE9ET1xyXG4gICAgICAgIGtleWJvYXJkOiB0cnVlLFxyXG4gICAgICAgIHpvb206IHRydWUsXHJcbiAgICAgICAgem9vbVRleHQ6ICc8c3ZnIHJvbGU9XCJpbWdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwb2x5bGluZSBwb2ludHM9XCIyMSAxNiAyMSAyMSAxNiAyMVwiLz48cG9seWxpbmUgcG9pbnRzPVwiOCAyMSAzIDIxIDMgMTZcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE2IDMgMjEgMyAyMSA4XCIvPjxwb2x5bGluZSBwb2ludHM9XCIzIDggMyAzIDggM1wiLz48L3N2Zz4nLFxyXG4gICAgICAgIGRvY0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgIHN3aXBlQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgaGlkZVNjcm9sbGJhcjogdHJ1ZSxcclxuICAgICAgICBkcmFnZ2FibGU6IHRydWUsXHJcbiAgICAgICAgdGhyZXNob2xkOiAxMDAsXHJcbiAgICAgICAgcnRsOiBmYWxzZSwgLy8gVE9ET1xyXG4gICAgICAgIGxvb3A6IGZhbHNlLCAvLyBUT0RPXHJcbiAgICAgICAgYXV0b3BsYXlWaWRlbzogZmFsc2UsXHJcbiAgICAgICAgdGhlbWU6ICdkYXJrJ1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodXNlck9wdGlvbnMpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyh1c2VyT3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICBvcHRpb25zW2tleV0gPSB1c2VyT3B0aW9uc1trZXldXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG9wdGlvbnNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZSBpZiBicm93c2VyIHN1cHBvcnRzIHVucHJlZml4ZWQgdHJhbnNmb3JtIHByb3BlcnR5XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBUcmFuc2Zvcm0gcHJvcGVydHkgc3VwcG9ydGVkIGJ5IGNsaWVudFxyXG4gICAgICovXHJcbiAgICB2YXIgdHJhbnNmb3JtU3VwcG9ydCA9IGZ1bmN0aW9uIHRyYW5zZm9ybVN1cHBvcnQgKCkge1xyXG4gICAgICByZXR1cm4gdHlwZW9mIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPT09ICdzdHJpbmcnID8gJ3RyYW5zZm9ybScgOiAnV2Via2l0VHJhbnNmb3JtJ1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHlwZXMgLSB5b3UgY2FuIGFkZCBuZXcgdHlwZSB0byBzdXBwb3J0IHNvbWV0aGluZyBuZXdcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBzdXBwb3J0ZWRFbGVtZW50cyA9IHtcclxuICAgICAgaW1hZ2U6IHtcclxuICAgICAgICBjaGVja1N1cHBvcnQ6IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgcmV0dXJuICFlbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpICYmIGVsLmhyZWYubWF0Y2goL1xcLihwbmd8anBlP2d8dGlmZnx0aWZ8Z2lmfGJtcHx3ZWJwfHN2Z3xpY28pJC8pXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsLCBjb250YWluZXIpIHtcclxuICAgICAgICAgIHZhciBmaWd1cmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmaWd1cmUnKSxcclxuICAgICAgICAgICAgZmlnY2FwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ZpZ2NhcHRpb24nKSxcclxuICAgICAgICAgICAgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSxcclxuICAgICAgICAgICAgdGh1bWJuYWlsID0gZWwucXVlcnlTZWxlY3RvcignaW1nJyksXHJcbiAgICAgICAgICAgIGxvYWRpbmdJbmRpY2F0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG5cclxuICAgICAgICAgIGltYWdlLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuXHJcbiAgICAgICAgICBpZiAodGh1bWJuYWlsKSB7XHJcbiAgICAgICAgICAgIGltYWdlLmFsdCA9IHRodW1ibmFpbC5hbHQgfHwgJydcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcnKVxyXG4gICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdkYXRhLXNyYycsIGVsLmhyZWYpXHJcblxyXG4gICAgICAgICAgLy8gQWRkIGltYWdlIHRvIGZpZ3VyZVxyXG4gICAgICAgICAgZmlndXJlLmFwcGVuZENoaWxkKGltYWdlKVxyXG5cclxuICAgICAgICAgIC8vIENyZWF0ZSBmaWdjYXB0aW9uXHJcbiAgICAgICAgICBpZiAoY29uZmlnLmNhcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGZpZ2NhcHRpb24uc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbmZpZy5jYXB0aW9uc1NlbGVjdG9yID09PSAnc2VsZicgJiYgZWwuZ2V0QXR0cmlidXRlKGNvbmZpZy5jYXB0aW9uQXR0cmlidXRlKSkge1xyXG4gICAgICAgICAgICAgIGZpZ2NhcHRpb24udGV4dENvbnRlbnQgPSBlbC5nZXRBdHRyaWJ1dGUoY29uZmlnLmNhcHRpb25BdHRyaWJ1dGUpXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLmNhcHRpb25zU2VsZWN0b3IgPT09ICdpbWcnICYmIHRodW1ibmFpbCAmJiB0aHVtYm5haWwuZ2V0QXR0cmlidXRlKGNvbmZpZy5jYXB0aW9uQXR0cmlidXRlKSkge1xyXG4gICAgICAgICAgICAgIGZpZ2NhcHRpb24udGV4dENvbnRlbnQgPSB0aHVtYm5haWwuZ2V0QXR0cmlidXRlKGNvbmZpZy5jYXB0aW9uQXR0cmlidXRlKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlnY2FwdGlvbi50ZXh0Q29udGVudCkge1xyXG4gICAgICAgICAgICAgIGZpZ2NhcHRpb24uaWQgPSAndG9iaS1maWdjYXB0aW9uLScgKyBmaWdjYXB0aW9uSWRcclxuICAgICAgICAgICAgICBmaWd1cmUuYXBwZW5kQ2hpbGQoZmlnY2FwdGlvbilcclxuXHJcbiAgICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCBmaWdjYXB0aW9uLmlkKVxyXG5cclxuICAgICAgICAgICAgICArK2ZpZ2NhcHRpb25JZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gQWRkIGZpZ3VyZSB0byBjb250YWluZXJcclxuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmaWd1cmUpXHJcblxyXG4gICAgICAgICAgLy8gQ3JlYXRlIGxvYWRpbmcgaW5kaWNhdG9yXHJcbiAgICAgICAgICBsb2FkaW5nSW5kaWNhdG9yLmNsYXNzTmFtZSA9ICd0b2JpLWxvYWRlcidcclxuICAgICAgICAgIGxvYWRpbmdJbmRpY2F0b3Iuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Byb2dyZXNzYmFyJylcclxuICAgICAgICAgIGxvYWRpbmdJbmRpY2F0b3Iuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgY29uZmlnLmxvYWRpbmdJbmRpY2F0b3JMYWJlbClcclxuXHJcbiAgICAgICAgICAvLyBBZGQgbG9hZGluZyBpbmRpY2F0b3IgdG8gY29udGFpbmVyXHJcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobG9hZGluZ0luZGljYXRvcilcclxuXHJcbiAgICAgICAgICAvLyBSZWdpc3RlciB0eXBlXHJcbiAgICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnLCAnaW1hZ2UnKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uUHJlbG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gU2FtZSBhcyBwcmVsb2FkXHJcbiAgICAgICAgICBzdXBwb3J0ZWRFbGVtZW50cy5pbWFnZS5vbkxvYWQoY29udGFpbmVyKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIGltYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpXHJcblxyXG4gICAgICAgICAgaWYgKCFpbWFnZS5oYXNBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdmFyIGZpZ2NhcHRpb24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZmlnY2FwdGlvbicpLFxyXG4gICAgICAgICAgICBsb2FkaW5nSW5kaWNhdG9yID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50b2JpLWxvYWRlcicpXHJcblxyXG4gICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQobG9hZGluZ0luZGljYXRvcilcclxuICAgICAgICAgICAgaW1hZ2Uuc3R5bGUub3BhY2l0eSA9ICcxJ1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpZ2NhcHRpb24pIHtcclxuICAgICAgICAgICAgICBmaWdjYXB0aW9uLnN0eWxlLm9wYWNpdHkgPSAnMSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgaW1hZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpKVxyXG4gICAgICAgICAgaW1hZ2UucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyYycpXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25MZWF2ZTogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gTm90aGluZ1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uQ2xlYW51cDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gTm90aGluZ1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGh0bWw6IHtcclxuICAgICAgICBjaGVja1N1cHBvcnQ6IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgcmV0dXJuIGNoZWNrVHlwZShlbCwgJ2h0bWwnKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChlbCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgICB2YXIgdGFyZ2V0U2VsZWN0b3IgPSBlbC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKSA/IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpIDogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpLFxyXG4gICAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldFNlbGVjdG9yKVxyXG5cclxuICAgICAgICAgIGlmICghdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVXBzLCBJIGNhblxcJ3QgZmluZCB0aGUgdGFyZ2V0ICcgKyB0YXJnZXRTZWxlY3RvciArICcuJylcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBBZGQgY29udGVudCB0byBjb250YWluZXJcclxuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0YXJnZXQpXHJcblxyXG4gICAgICAgICAgLy8gUmVnaXN0ZXIgdHlwZVxyXG4gICAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS10eXBlJywgJ2h0bWwnKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uUHJlbG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gTm90aGluZ1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIHZpZGVvID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJylcclxuXHJcbiAgICAgICAgICBpZiAodmlkZW8pIHtcclxuICAgICAgICAgICAgaWYgKHZpZGVvLmhhc0F0dHJpYnV0ZSgnZGF0YS10aW1lJykgJiYgdmlkZW8ucmVhZHlTdGF0ZSA+IDApIHtcclxuICAgICAgICAgICAgICAvLyBDb250aW51ZSB3aGVyZSB2aWRlbyB3YXMgc3RvcHBlZFxyXG4gICAgICAgICAgICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gdmlkZW8uZ2V0QXR0cmlidXRlKCdkYXRhLXRpbWUnKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZmlnLmF1dG9wbGF5VmlkZW8pIHtcclxuICAgICAgICAgICAgICAvLyBTdGFydCBwbGF5YmFjayAoYW5kIGxvYWRpbmcgaWYgbmVjZXNzYXJ5KVxyXG4gICAgICAgICAgICAgIHZpZGVvLnBsYXkoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25MZWF2ZTogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIHZpZGVvID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJylcclxuXHJcbiAgICAgICAgICBpZiAodmlkZW8pIHtcclxuICAgICAgICAgICAgaWYgKCF2aWRlby5wYXVzZWQpIHtcclxuICAgICAgICAgICAgICAvLyBTdG9wIGlmIHZpZGVvIGlzIHBsYXlpbmdcclxuICAgICAgICAgICAgICB2aWRlby5wYXVzZSgpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEJhY2t1cCBjdXJyZW50VGltZSAobmVlZGVkIGZvciByZXZpc2l0KVxyXG4gICAgICAgICAgICBpZiAodmlkZW8ucmVhZHlTdGF0ZSA+IDApIHtcclxuICAgICAgICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGltZScsIHZpZGVvLmN1cnJlbnRUaW1lKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25DbGVhbnVwOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICB2YXIgdmlkZW8gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcigndmlkZW8nKVxyXG5cclxuICAgICAgICAgIGlmICh2aWRlbykge1xyXG4gICAgICAgICAgICBpZiAodmlkZW8ucmVhZHlTdGF0ZSA+IDAgJiYgdmlkZW8ucmVhZHlTdGF0ZSA8IDMgJiYgdmlkZW8uZHVyYXRpb24gIT09IHZpZGVvLmN1cnJlbnRUaW1lKSB7XHJcbiAgICAgICAgICAgICAgLy8gU29tZSBkYXRhIGhhcyBiZWVuIGxvYWRlZCBidXQgbm90IHRoZSB3aG9sZSBwYWNrYWdlLlxyXG4gICAgICAgICAgICAgIC8vIEluIG9yZGVyIHRvIHNhdmUgYmFuZHdpZHRoLCBzdG9wIGRvd25sb2FkaW5nIGFzIHNvb24gYXMgcG9zc2libGUuXHJcbiAgICAgICAgICAgICAgdmFyIGNsb25lID0gdmlkZW8uY2xvbmVOb2RlKHRydWUpXHJcblxyXG4gICAgICAgICAgICAgIHJlbW92ZVNvdXJjZXModmlkZW8pXHJcbiAgICAgICAgICAgICAgdmlkZW8ubG9hZCgpXHJcblxyXG4gICAgICAgICAgICAgIHZpZGVvLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodmlkZW8pXHJcblxyXG4gICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9uZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGlmcmFtZToge1xyXG4gICAgICAgIGNoZWNrU3VwcG9ydDogZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICByZXR1cm4gY2hlY2tUeXBlKGVsLCAnaWZyYW1lJylcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoZWwsIGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpLFxyXG4gICAgICAgICAgICBocmVmID0gZWwuaGFzQXR0cmlidXRlKCdocmVmJykgPyBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSA6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKVxyXG5cclxuICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2ZyYW1lYm9yZGVyJywgJzAnKVxyXG4gICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3JjJywgJycpXHJcbiAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdkYXRhLXNyYycsIGhyZWYpXHJcblxyXG4gICAgICAgICAgLy8gQWRkIGlmcmFtZSB0byBjb250YWluZXJcclxuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpZnJhbWUpXHJcblxyXG4gICAgICAgICAgLy8gUmVnaXN0ZXIgdHlwZVxyXG4gICAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS10eXBlJywgJ2lmcmFtZScpXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25QcmVsb2FkOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAvLyBOb3RoaW5nXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25Mb2FkOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICB2YXIgaWZyYW1lID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2lmcmFtZScpXHJcblxyXG4gICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3JjJywgaWZyYW1lLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSlcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkxlYXZlOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAvLyBOb3RoaW5nXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25DbGVhbnVwOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAvLyBOb3RoaW5nXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgeW91dHViZToge1xyXG4gICAgICAgIGNoZWNrU3VwcG9ydDogZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICByZXR1cm4gY2hlY2tUeXBlKGVsLCAneW91dHViZScpXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsLCBjb250YWluZXIpIHtcclxuICAgICAgICAgIHZhciBpZnJhbWVQbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcblxyXG4gICAgICAgICAgLy8gQWRkIGlmcmFtZVBsYWNlaG9sZGVyIHRvIGNvbnRhaW5lclxyXG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGlmcmFtZVBsYWNlaG9sZGVyKVxyXG5cclxuICAgICAgICAgIHBsYXllcltwbGF5ZXJJZF0gPSBuZXcgd2luZG93LllULlBsYXllcihpZnJhbWVQbGFjZWhvbGRlciwge1xyXG4gICAgICAgICAgICBob3N0OiAnaHR0cHM6Ly93d3cueW91dHViZS1ub2Nvb2tpZS5jb20nLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1oZWlnaHQnKSB8fCAnMzYwJyxcclxuICAgICAgICAgICAgd2lkdGg6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS13aWR0aCcpIHx8ICc2NDAnLFxyXG4gICAgICAgICAgICB2aWRlb0lkOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKSxcclxuICAgICAgICAgICAgcGxheWVyVmFyczoge1xyXG4gICAgICAgICAgICAgICdjb250cm9scyc6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1jb250cm9scycpIHx8IDEsXHJcbiAgICAgICAgICAgICAgJ3JlbCc6IDAsXHJcbiAgICAgICAgICAgICAgJ3BsYXlzaW5saW5lJzogMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIC8vIFNldCBwbGF5ZXIgSURcclxuICAgICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGxheWVyJywgcGxheWVySWQpXHJcblxyXG4gICAgICAgICAgLy8gUmVnaXN0ZXIgdHlwZVxyXG4gICAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS10eXBlJywgJ3lvdXR1YmUnKVxyXG5cclxuICAgICAgICAgIHBsYXllcklkKytcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvblByZWxvYWQ6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIE5vdGhpbmdcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIGlmIChjb25maWcuYXV0b3BsYXlWaWRlbykge1xyXG4gICAgICAgICAgICBwbGF5ZXJbY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS1wbGF5ZXInKV0ucGxheVZpZGVvKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkxlYXZlOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICBpZiAocGxheWVyW2NvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxheWVyJyldLmdldFBsYXllclN0YXRlKCkgPT09IDEpIHtcclxuICAgICAgICAgICAgcGxheWVyW2NvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxheWVyJyldLnBhdXNlVmlkZW8oKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uQ2xlYW51cDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgaWYgKHBsYXllcltjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYXllcicpXS5nZXRQbGF5ZXJTdGF0ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgIHBsYXllcltjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYXllcicpXS5wYXVzZVZpZGVvKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gaW5pdCAodXNlck9wdGlvbnMpIHtcclxuICAgICAgLy8gTWVyZ2UgdXNlciBvcHRpb25zIGludG8gZGVmYXVsdHNcclxuICAgICAgY29uZmlnID0gbWVyZ2VPcHRpb25zKHVzZXJPcHRpb25zKVxyXG5cclxuICAgICAgLy8gVHJhbnNmb3JtIHByb3BlcnR5IHN1cHBvcnRlZCBieSBjbGllbnRcclxuICAgICAgdHJhbnNmb3JtUHJvcGVydHkgPSB0cmFuc2Zvcm1TdXBwb3J0KClcclxuXHJcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBsaWdodGJveCBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICBpZiAoIWxpZ2h0Ym94KSB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBsaWdodGJveFxyXG4gICAgICAgIGNyZWF0ZUxpZ2h0Ym94KClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gR2V0IGEgbGlzdCBvZiBhbGwgZWxlbWVudHMgd2l0aGluIHRoZSBkb2N1bWVudFxyXG4gICAgICB2YXIgZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjb25maWcuc2VsZWN0b3IpXHJcblxyXG4gICAgICBpZiAoIWVscykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVXBzLCBJIGNhblxcJ3QgZmluZCB0aGUgc2VsZWN0b3IgJyArIGNvbmZpZy5zZWxlY3RvciArICcuJylcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRXhlY3V0ZSBhIGZldyB0aGluZ3Mgb25jZSBwZXIgZWxlbWVudFxyXG4gICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGVscywgZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgY2hlY2tEZXBlbmRlbmNpZXMoZWwpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBkZXBlbmRlbmNpZXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIEVsZW1lbnQgdG8gYWRkXHJcbiAgICAgKi9cclxuICAgIHZhciBjaGVja0RlcGVuZGVuY2llcyA9IGZ1bmN0aW9uIGNoZWNrRGVwZW5kZW5jaWVzIChlbCkge1xyXG4gICAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIFlvdVR1YmUgdmlkZW8gYW5kIGlmIHRoZSBZb3VUdWJlIGlmcmFtZS1BUEkgaXMgcmVhZHlcclxuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXR5cGU9XCJ5b3V0dWJlXCJdJykgIT09IG51bGwgJiYgIWlzWW91VHViZURlcGVuZGVuY2llTG9hZGVkKSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZnJhbWVfYXBpJykgPT09IG51bGwpIHtcclxuICAgICAgICAgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKSxcclxuICAgICAgICAgICAgZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF1cclxuXHJcbiAgICAgICAgICB0YWcuaWQgPSAnaWZyYW1lX2FwaSdcclxuICAgICAgICAgIHRhZy5zcmMgPSAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vaWZyYW1lX2FwaSdcclxuXHJcbiAgICAgICAgICBmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YWcsIGZpcnN0U2NyaXB0VGFnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdhaXRpbmdFbHMuaW5kZXhPZihlbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICB3YWl0aW5nRWxzLnB1c2goZWwpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aW5kb3cub25Zb3VUdWJlUGxheWVyQVBJUmVhZHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHdhaXRpbmdFbHMsIGZ1bmN0aW9uICh3YWl0aW5nRWwpIHtcclxuICAgICAgICAgICAgYWRkKHdhaXRpbmdFbClcclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgaXNZb3VUdWJlRGVwZW5kZW5jaWVMb2FkZWQgPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFkZChlbClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGVsZW1lbnRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIEVsZW1lbnQgdG8gYWRkXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIHRvIGNhbGwgYWZ0ZXIgYWRkXHJcbiAgICAgKi9cclxuICAgIHZhciBhZGQgPSBmdW5jdGlvbiBhZGQgKGVsLCBjYWxsYmFjaykge1xyXG4gICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGFscmVhZHkgZXhpc3RzXHJcbiAgICAgIGlmIChnYWxsZXJ5LmluZGV4T2YoZWwpID09PSAtMSkge1xyXG4gICAgICAgIGdhbGxlcnkucHVzaChlbClcclxuICAgICAgICBlbGVtZW50c0xlbmd0aCsrXHJcblxyXG4gICAgICAgIC8vIFNldCB6b29tIGljb24gaWYgbmVjZXNzYXJ5XHJcbiAgICAgICAgaWYgKGNvbmZpZy56b29tICYmIGVsLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpKSB7XHJcbiAgICAgICAgICB2YXIgdG9iaVpvb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG5cclxuICAgICAgICAgIHRvYmlab29tLmNsYXNzTmFtZSA9ICd0b2JpLXpvb21fX2ljb24nXHJcbiAgICAgICAgICB0b2JpWm9vbS5pbm5lckhUTUwgPSBjb25maWcuem9vbVRleHRcclxuXHJcbiAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCd0b2JpLXpvb20nKVxyXG4gICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodG9iaVpvb20pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBCaW5kIGNsaWNrIGV2ZW50IGhhbmRsZXJcclxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgICAgICAgIG9wZW4oZ2FsbGVyeS5pbmRleE9mKHRoaXMpKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgc2xpZGVcclxuICAgICAgICBjcmVhdGVMaWdodGJveFNsaWRlKGVsKVxyXG5cclxuICAgICAgICBpZiAoaXNPcGVuKCkpIHtcclxuICAgICAgICAgIHJlY2hlY2tDb25maWcoKVxyXG4gICAgICAgICAgdXBkYXRlTGlnaHRib3goKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVXBzLCBlbGVtZW50IGFscmVhZHkgYWRkZWQgdG8gdGhlIGxpZ2h0Ym94LicpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgbGlnaHRib3hcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBjcmVhdGVMaWdodGJveCA9IGZ1bmN0aW9uIGNyZWF0ZUxpZ2h0Ym94ICgpIHtcclxuICAgICAgLy8gQ3JlYXRlIGxpZ2h0Ym94IGNvbnRhaW5lclxyXG4gICAgICBsaWdodGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgIGxpZ2h0Ym94LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKVxyXG4gICAgICBsaWdodGJveC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxyXG4gICAgICBsaWdodGJveC5jbGFzc05hbWUgPSAndG9iaSB0b2JpLS10aGVtZS0nICsgY29uZmlnLnRoZW1lXHJcblxyXG4gICAgICAvLyBDcmVhdGUgc2xpZGVyIGNvbnRhaW5lclxyXG4gICAgICBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICBzbGlkZXIuY2xhc3NOYW1lID0gJ3RvYmlfX3NsaWRlcidcclxuICAgICAgbGlnaHRib3guYXBwZW5kQ2hpbGQoc2xpZGVyKVxyXG5cclxuICAgICAgLy8gQ3JlYXRlIHByZXZpb3VzIGJ1dHRvblxyXG4gICAgICBwcmV2QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcclxuICAgICAgcHJldkJ1dHRvbi5jbGFzc05hbWUgPSAndG9iaV9fcHJldidcclxuICAgICAgcHJldkJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJylcclxuICAgICAgcHJldkJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBjb25maWcubmF2TGFiZWxbMF0pXHJcbiAgICAgIHByZXZCdXR0b24uaW5uZXJIVE1MID0gY29uZmlnLm5hdlRleHRbMF1cclxuICAgICAgbGlnaHRib3guYXBwZW5kQ2hpbGQocHJldkJ1dHRvbilcclxuXHJcbiAgICAgIC8vIENyZWF0ZSBuZXh0IGJ1dHRvblxyXG4gICAgICBuZXh0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcclxuICAgICAgbmV4dEJ1dHRvbi5jbGFzc05hbWUgPSAndG9iaV9fbmV4dCdcclxuICAgICAgbmV4dEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJylcclxuICAgICAgbmV4dEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBjb25maWcubmF2TGFiZWxbMV0pXHJcbiAgICAgIG5leHRCdXR0b24uaW5uZXJIVE1MID0gY29uZmlnLm5hdlRleHRbMV1cclxuICAgICAgbGlnaHRib3guYXBwZW5kQ2hpbGQobmV4dEJ1dHRvbilcclxuXHJcbiAgICAgIC8vIENyZWF0ZSBjbG9zZSBidXR0b25cclxuICAgICAgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxyXG4gICAgICBjbG9zZUJ1dHRvbi5jbGFzc05hbWUgPSAndG9iaV9fY2xvc2UnXHJcbiAgICAgIGNsb3NlQnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKVxyXG4gICAgICBjbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBjb25maWcuY2xvc2VMYWJlbClcclxuICAgICAgY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gY29uZmlnLmNsb3NlVGV4dFxyXG4gICAgICBsaWdodGJveC5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbilcclxuXHJcbiAgICAgIC8vIENyZWF0ZSBjb3VudGVyXHJcbiAgICAgIGNvdW50ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICBjb3VudGVyLmNsYXNzTmFtZSA9ICd0b2JpX19jb3VudGVyJ1xyXG4gICAgICBsaWdodGJveC5hcHBlbmRDaGlsZChjb3VudGVyKVxyXG5cclxuICAgICAgLy8gUmVzaXplIGV2ZW50IHVzaW5nIHJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgICBicm93c2VyV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXJlc2l6ZVRpY2tpbmcpIHtcclxuICAgICAgICAgIHJlc2l6ZVRpY2tpbmcgPSB0cnVlXHJcblxyXG4gICAgICAgICAgYnJvd3NlcldpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB1cGRhdGVPZmZzZXQoKVxyXG5cclxuICAgICAgICAgICAgcmVzaXplVGlja2luZyA9IGZhbHNlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGlnaHRib3gpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBsaWdodGJveCBzbGlkZVxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGNyZWF0ZUxpZ2h0Ym94U2xpZGUgPSBmdW5jdGlvbiBjcmVhdGVMaWdodGJveFNsaWRlIChlbCkge1xyXG4gICAgICAvLyBEZXRlY3QgdHlwZVxyXG4gICAgICBmb3IgKHZhciBpbmRleCBpbiBzdXBwb3J0ZWRFbGVtZW50cykge1xyXG4gICAgICAgIGlmIChzdXBwb3J0ZWRFbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcclxuICAgICAgICAgIGlmIChzdXBwb3J0ZWRFbGVtZW50c1tpbmRleF0uY2hlY2tTdXBwb3J0KGVsKSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgc2xpZGUgZWxlbWVudHNcclxuICAgICAgICAgICAgdmFyIHNsaWRlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICAgICAgICBzbGlkZXJFbGVtZW50Q29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcblxyXG4gICAgICAgICAgICBzbGlkZXJFbGVtZW50LmNsYXNzTmFtZSA9ICd0b2JpX19zbGlkZXJfX3NsaWRlJ1xyXG4gICAgICAgICAgICBzbGlkZXJFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xyXG4gICAgICAgICAgICBzbGlkZXJFbGVtZW50LnN0eWxlLmxlZnQgPSB4ICogMTAwICsgJyUnXHJcbiAgICAgICAgICAgIHNsaWRlckVsZW1lbnRDb250ZW50LmNsYXNzTmFtZSA9ICd0b2JpX19zbGlkZXJfX3NsaWRlX19jb250ZW50J1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIHR5cGUgZWxlbWVudHNcclxuICAgICAgICAgICAgc3VwcG9ydGVkRWxlbWVudHNbaW5kZXhdLmluaXQoZWwsIHNsaWRlckVsZW1lbnRDb250ZW50KVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHNsaWRlIGNvbnRlbnQgY29udGFpbmVyIHRvIHNsaWRlciBlbGVtZW50XHJcbiAgICAgICAgICAgIHNsaWRlckVsZW1lbnQuYXBwZW5kQ2hpbGQoc2xpZGVyRWxlbWVudENvbnRlbnQpXHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgc2xpZGVyIGVsZW1lbnQgdG8gc2xpZGVyXHJcbiAgICAgICAgICAgIHNsaWRlci5hcHBlbmRDaGlsZChzbGlkZXJFbGVtZW50KVxyXG4gICAgICAgICAgICBzbGlkZXJFbGVtZW50cy5wdXNoKHNsaWRlckVsZW1lbnQpXHJcblxyXG4gICAgICAgICAgICArK3hcclxuXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPcGVuIHRoZSBsaWdodGJveFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IHRvIGxvYWRcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gT3B0aW9uYWwgY2FsbGJhY2sgdG8gY2FsbCBhZnRlciBvcGVuXHJcbiAgICAgKi9cclxuICAgIHZhciBvcGVuID0gZnVuY3Rpb24gb3BlbiAoaW5kZXgsIGNhbGxiYWNrKSB7XHJcbiAgICAgIGlmICghaXNPcGVuKCkgJiYgIWluZGV4KSB7XHJcbiAgICAgICAgaW5kZXggPSAwXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc09wZW4oKSkge1xyXG4gICAgICAgIGlmICghaW5kZXgpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVXBzLCBUb2JpIGlzIGFsZWFkeSBvcGVuLicpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5kZXggPT09IGN1cnJlbnRJbmRleCkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVcHMsIHNsaWRlICcgKyBpbmRleCArICcgaXMgYWxyZWFkeSBzZWxlY3RlZC4nKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGluZGV4ID09PSAtMSB8fCBpbmRleCA+PSBlbGVtZW50c0xlbmd0aCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVXBzLCBJIGNhblxcJ3QgZmluZCBzbGlkZSAnICsgaW5kZXggKyAnLicpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjb25maWcuaGlkZVNjcm9sbGJhcikge1xyXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0b2JpLWlzLW9wZW4nKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndG9iaS1pcy1vcGVuJylcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVjaGVja0NvbmZpZygpXHJcblxyXG4gICAgICAvLyBIaWRlIGNsb3NlIGlmIG5lY2Vzc2FyeVxyXG4gICAgICBpZiAoIWNvbmZpZy5jbG9zZSkge1xyXG4gICAgICAgIGNsb3NlQnV0dG9uLmRpc2FibGVkID0gZmFsc2VcclxuICAgICAgICBjbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTYXZlIHRoZSB1c2Vy4oCZcyBmb2N1c1xyXG4gICAgICBsYXN0Rm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XHJcblxyXG4gICAgICAvLyBTZXQgY3VycmVudCBpbmRleFxyXG4gICAgICBjdXJyZW50SW5kZXggPSBpbmRleFxyXG5cclxuICAgICAgLy8gQ2xlYXIgZHJhZ1xyXG4gICAgICBjbGVhckRyYWcoKVxyXG5cclxuICAgICAgLy8gQmluZCBldmVudHNcclxuICAgICAgYmluZEV2ZW50cygpXHJcblxyXG4gICAgICAvLyBMb2FkIHNsaWRlXHJcbiAgICAgIGxvYWQoY3VycmVudEluZGV4KVxyXG5cclxuICAgICAgLy8gTWFrZXMgbGlnaHRib3ggYXBwZWFyLCB0b29cclxuICAgICAgbGlnaHRib3guc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpXHJcblxyXG4gICAgICAvLyBVcGRhdGUgbGlnaHRib3hcclxuICAgICAgdXBkYXRlTGlnaHRib3goKVxyXG5cclxuICAgICAgLy8gUHJlbG9hZCBsYXRlXHJcbiAgICAgIHByZWxvYWQoY3VycmVudEluZGV4ICsgMSlcclxuICAgICAgcHJlbG9hZChjdXJyZW50SW5kZXggLSAxKVxyXG5cclxuICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbG9zZSB0aGUgbGlnaHRib3hcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIHRvIGNhbGwgYWZ0ZXIgY2xvc2VcclxuICAgICAqL1xyXG4gICAgdmFyIGNsb3NlID0gZnVuY3Rpb24gY2xvc2UgKGNhbGxiYWNrKSB7XHJcbiAgICAgIGlmICghaXNPcGVuKCkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvYmkgaXMgYWxyZWFkeSBjbG9zZWQuJylcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGNvbmZpZy5oaWRlU2Nyb2xsYmFyKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3RvYmktaXMtb3BlbicpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd0b2JpLWlzLW9wZW4nKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBVbmJpbmQgZXZlbnRzXHJcbiAgICAgIHVuYmluZEV2ZW50cygpXHJcblxyXG4gICAgICAvLyBSZWVuYWJsZSB0aGUgdXNlcuKAmXMgZm9jdXNcclxuICAgICAgbGFzdEZvY3VzLmZvY3VzKClcclxuXHJcbiAgICAgIC8vIERvbid0IGZvcmdldCB0byBjbGVhbnVwIG91ciBjdXJyZW50IGVsZW1lbnRcclxuICAgICAgdmFyIGNvbnRhaW5lciA9IHNsaWRlckVsZW1lbnRzW2N1cnJlbnRJbmRleF0ucXVlcnlTZWxlY3RvcignLnRvYmlfX3NsaWRlcl9fc2xpZGVfX2NvbnRlbnQnKVxyXG4gICAgICB2YXIgdHlwZSA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpXHJcbiAgICAgIHN1cHBvcnRlZEVsZW1lbnRzW3R5cGVdLm9uTGVhdmUoY29udGFpbmVyKVxyXG4gICAgICBzdXBwb3J0ZWRFbGVtZW50c1t0eXBlXS5vbkNsZWFudXAoY29udGFpbmVyKVxyXG5cclxuICAgICAgbGlnaHRib3guc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuXHJcbiAgICAgIC8vIFJlc2V0IGN1cnJlbnQgaW5kZXhcclxuICAgICAgY3VycmVudEluZGV4ID0gMFxyXG5cclxuICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcmVsb2FkIHNsaWRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggdG8gcHJlbG9hZFxyXG4gICAgICovXHJcbiAgICB2YXIgcHJlbG9hZCA9IGZ1bmN0aW9uIHByZWxvYWQgKGluZGV4KSB7XHJcbiAgICAgIGlmIChzbGlkZXJFbGVtZW50c1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY29udGFpbmVyID0gc2xpZGVyRWxlbWVudHNbaW5kZXhdLnF1ZXJ5U2VsZWN0b3IoJy50b2JpX19zbGlkZXJfX3NsaWRlX19jb250ZW50JylcclxuICAgICAgdmFyIHR5cGUgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKVxyXG5cclxuICAgICAgc3VwcG9ydGVkRWxlbWVudHNbdHlwZV0ub25QcmVsb2FkKGNvbnRhaW5lcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWQgc2xpZGVcclxuICAgICAqIFdpbGwgYmUgY2FsbGVkIHdoZW4gb3BlbmluZyB0aGUgbGlnaHRib3ggb3IgbW92aW5nIGluZGV4XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggdG8gbG9hZFxyXG4gICAgICovXHJcbiAgICB2YXIgbG9hZCA9IGZ1bmN0aW9uIGxvYWQgKGluZGV4KSB7XHJcbiAgICAgIGlmIChzbGlkZXJFbGVtZW50c1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY29udGFpbmVyID0gc2xpZGVyRWxlbWVudHNbaW5kZXhdLnF1ZXJ5U2VsZWN0b3IoJy50b2JpX19zbGlkZXJfX3NsaWRlX19jb250ZW50JylcclxuICAgICAgdmFyIHR5cGUgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKVxyXG5cclxuICAgICAgc3VwcG9ydGVkRWxlbWVudHNbdHlwZV0ub25Mb2FkKGNvbnRhaW5lcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE5hdmlnYXRlIHRvIHRoZSBwcmV2aW91cyBzbGlkZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gT3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqL1xyXG4gICAgdmFyIHByZXYgPSBmdW5jdGlvbiBwcmV2IChjYWxsYmFjaykge1xyXG4gICAgICBpZiAoY3VycmVudEluZGV4ID4gMCkge1xyXG4gICAgICAgIGxlYXZlKGN1cnJlbnRJbmRleClcclxuICAgICAgICBsb2FkKC0tY3VycmVudEluZGV4KVxyXG4gICAgICAgIHVwZGF0ZUxpZ2h0Ym94KCdsZWZ0JylcclxuICAgICAgICBjbGVhbnVwKGN1cnJlbnRJbmRleCArIDEpXHJcbiAgICAgICAgcHJlbG9hZChjdXJyZW50SW5kZXggLSAxKVxyXG5cclxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE5hdmlnYXRlIHRvIHRoZSBuZXh0IHNsaWRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICovXHJcbiAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uIG5leHQgKGNhbGxiYWNrKSB7XHJcbiAgICAgIGlmIChjdXJyZW50SW5kZXggPCBlbGVtZW50c0xlbmd0aCAtIDEpIHtcclxuICAgICAgICBsZWF2ZShjdXJyZW50SW5kZXgpXHJcbiAgICAgICAgbG9hZCgrK2N1cnJlbnRJbmRleClcclxuICAgICAgICB1cGRhdGVMaWdodGJveCgncmlnaHQnKVxyXG4gICAgICAgIGNsZWFudXAoY3VycmVudEluZGV4IC0gMSlcclxuICAgICAgICBwcmVsb2FkKGN1cnJlbnRJbmRleCArIDEpXHJcblxyXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGVhdmUgc2xpZGVcclxuICAgICAqIFdpbGwgYmUgY2FsbGVkIGJlZm9yZSBtb3ZpbmcgaW5kZXhcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCB0byBsZWF2ZVxyXG4gICAgICovXHJcbiAgICB2YXIgbGVhdmUgPSBmdW5jdGlvbiBsZWF2ZSAoaW5kZXgpIHtcclxuICAgICAgaWYgKHNsaWRlckVsZW1lbnRzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjb250YWluZXIgPSBzbGlkZXJFbGVtZW50c1tpbmRleF0ucXVlcnlTZWxlY3RvcignLnRvYmlfX3NsaWRlcl9fc2xpZGVfX2NvbnRlbnQnKVxyXG4gICAgICB2YXIgdHlwZSA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpXHJcblxyXG4gICAgICBzdXBwb3J0ZWRFbGVtZW50c1t0eXBlXS5vbkxlYXZlKGNvbnRhaW5lcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFudXAgc2xpZGVcclxuICAgICAqIFdpbGwgYmUgY2FsbGVkIGFmdGVyIG1vdmluZyBpbmRleFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IHRvIGNsZWFudXBcclxuICAgICAqL1xyXG4gICAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbiBjbGVhbnVwIChpbmRleCkge1xyXG4gICAgICBpZiAoc2xpZGVyRWxlbWVudHNbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNvbnRhaW5lciA9IHNsaWRlckVsZW1lbnRzW2luZGV4XS5xdWVyeVNlbGVjdG9yKCcudG9iaV9fc2xpZGVyX19zbGlkZV9fY29udGVudCcpXHJcbiAgICAgIHZhciB0eXBlID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJylcclxuXHJcbiAgICAgIHN1cHBvcnRlZEVsZW1lbnRzW3R5cGVdLm9uQ2xlYW51cChjb250YWluZXIpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIG9mZnNldFxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIHVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uIHVwZGF0ZU9mZnNldCAoKSB7XHJcbiAgICAgIG9mZnNldCA9IC1jdXJyZW50SW5kZXggKiB3aW5kb3cuaW5uZXJXaWR0aFxyXG5cclxuICAgICAgc2xpZGVyLnN0eWxlW3RyYW5zZm9ybVByb3BlcnR5XSA9ICd0cmFuc2xhdGUzZCgnICsgb2Zmc2V0ICsgJ3B4LCAwLCAwKSdcclxuICAgICAgb2Zmc2V0VG1wID0gb2Zmc2V0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIGNvdW50ZXJcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciB1cGRhdGVDb3VudGVyID0gZnVuY3Rpb24gdXBkYXRlQ291bnRlciAoKSB7XHJcbiAgICAgIGNvdW50ZXIudGV4dENvbnRlbnQgPSAoY3VycmVudEluZGV4ICsgMSkgKyAnLycgKyBlbGVtZW50c0xlbmd0aFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBmb2N1cyB0byB0aGUgbmV4dCBlbGVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGRpciAtIEN1cnJlbnQgc2xpZGUgZGlyZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHZhciB1cGRhdGVGb2N1cyA9IGZ1bmN0aW9uIHVwZGF0ZUZvY3VzIChkaXIpIHtcclxuICAgICAgdmFyIGZvY3VzYWJsZUVscyA9IG51bGxcclxuXHJcbiAgICAgIGlmIChjb25maWcubmF2KSB7XHJcbiAgICAgICAgLy8gRGlzcGxheSB0aGUgbmV4dCBhbmQgcHJldmlvdXMgYnV0dG9uc1xyXG4gICAgICAgIHByZXZCdXR0b24uZGlzYWJsZWQgPSBmYWxzZVxyXG4gICAgICAgIG5leHRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZVxyXG5cclxuICAgICAgICBpZiAoZWxlbWVudHNMZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIC8vIEhpZGUgdGhlIG5leHQgYW5kIHByZXZpb3VzIGJ1dHRvbnMgaWYgdGhlcmUgaXMgb25seSBvbmUgc2xpZGVcclxuICAgICAgICAgIHByZXZCdXR0b24uZGlzYWJsZWQgPSB0cnVlXHJcbiAgICAgICAgICBuZXh0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxyXG5cclxuICAgICAgICAgIGlmIChjb25maWcuY2xvc2UpIHtcclxuICAgICAgICAgICAgY2xvc2VCdXR0b24uZm9jdXMoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAvLyBIaWRlIHRoZSBwcmV2aW91cyBidXR0b24gd2hlbiB0aGUgZmlyc3Qgc2xpZGUgaXMgZGlzcGxheWVkXHJcbiAgICAgICAgICBwcmV2QnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEluZGV4ID09PSBlbGVtZW50c0xlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIC8vIEhpZGUgdGhlIG5leHQgYnV0dG9uIHdoZW4gdGhlIGxhc3Qgc2xpZGUgaXMgZGlzcGxheWVkXHJcbiAgICAgICAgICBuZXh0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkaXIgJiYgIW5leHRCdXR0b24uZGlzYWJsZWQpIHtcclxuICAgICAgICAgIG5leHRCdXR0b24uZm9jdXMoKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIWRpciAmJiBuZXh0QnV0dG9uLmRpc2FibGVkICYmICFwcmV2QnV0dG9uLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICBwcmV2QnV0dG9uLmZvY3VzKClcclxuICAgICAgICB9IGVsc2UgaWYgKCFuZXh0QnV0dG9uLmRpc2FibGVkICYmIGRpciA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgbmV4dEJ1dHRvbi5mb2N1cygpXHJcbiAgICAgICAgfSBlbHNlIGlmIChuZXh0QnV0dG9uLmRpc2FibGVkICYmIGRpciA9PT0gJ3JpZ2h0JyAmJiAhcHJldkJ1dHRvbi5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgcHJldkJ1dHRvbi5mb2N1cygpXHJcbiAgICAgICAgfSBlbHNlIGlmICghcHJldkJ1dHRvbi5kaXNhYmxlZCAmJiBkaXIgPT09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgcHJldkJ1dHRvbi5mb2N1cygpXHJcbiAgICAgICAgfSBlbHNlIGlmIChwcmV2QnV0dG9uLmRpc2FibGVkICYmIGRpciA9PT0gJ2xlZnQnICYmICFuZXh0QnV0dG9uLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICBuZXh0QnV0dG9uLmZvY3VzKClcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoY29uZmlnLmNsb3NlKSB7XHJcbiAgICAgICAgY2xvc2VCdXR0b24uZm9jdXMoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmb2N1c2FibGVFbHMgPSBsaWdodGJveC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b246bm90KDpkaXNhYmxlZCknKVxyXG4gICAgICBmaXJzdEZvY3VzYWJsZUVsID0gZm9jdXNhYmxlRWxzWzBdXHJcbiAgICAgIGxhc3RGb2N1c2FibGVFbCA9IGZvY3VzYWJsZUVscy5sZW5ndGggPT09IDEgPyBmb2N1c2FibGVFbHNbMF0gOiBmb2N1c2FibGVFbHNbZm9jdXNhYmxlRWxzLmxlbmd0aCAtIDFdXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciBkcmFnIGFmdGVyIHRvdWNoZW5kIGFuZCBtb3VzdXAgZXZlbnRcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBjbGVhckRyYWcgPSBmdW5jdGlvbiBjbGVhckRyYWcgKCkge1xyXG4gICAgICBkcmFnID0ge1xyXG4gICAgICAgIHN0YXJ0WDogMCxcclxuICAgICAgICBlbmRYOiAwLFxyXG4gICAgICAgIHN0YXJ0WTogMCxcclxuICAgICAgICBlbmRZOiAwXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY2FsY3VsYXRlIGRyYWcgLyBzd2lwZSBldmVudFxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIHVwZGF0ZUFmdGVyRHJhZyA9IGZ1bmN0aW9uIHVwZGF0ZUFmdGVyRHJhZyAoKSB7XHJcbiAgICAgIHZhciBtb3ZlbWVudFggPSBkcmFnLmVuZFggLSBkcmFnLnN0YXJ0WCxcclxuICAgICAgICBtb3ZlbWVudFkgPSBkcmFnLmVuZFkgLSBkcmFnLnN0YXJ0WSxcclxuICAgICAgICBtb3ZlbWVudFhEaXN0YW5jZSA9IE1hdGguYWJzKG1vdmVtZW50WCksXHJcbiAgICAgICAgbW92ZW1lbnRZRGlzdGFuY2UgPSBNYXRoLmFicyhtb3ZlbWVudFkpXHJcblxyXG4gICAgICBpZiAobW92ZW1lbnRYID4gMCAmJiBtb3ZlbWVudFhEaXN0YW5jZSA+IGNvbmZpZy50aHJlc2hvbGQgJiYgY3VycmVudEluZGV4ID4gMCkge1xyXG4gICAgICAgIHByZXYoKVxyXG4gICAgICB9IGVsc2UgaWYgKG1vdmVtZW50WCA8IDAgJiYgbW92ZW1lbnRYRGlzdGFuY2UgPiBjb25maWcudGhyZXNob2xkICYmIGN1cnJlbnRJbmRleCAhPT0gZWxlbWVudHNMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgbmV4dCgpXHJcbiAgICAgIH0gZWxzZSBpZiAobW92ZW1lbnRZIDwgMCAmJiBtb3ZlbWVudFlEaXN0YW5jZSA+IGNvbmZpZy50aHJlc2hvbGQgJiYgY29uZmlnLnN3aXBlQ2xvc2UpIHtcclxuICAgICAgICBjbG9zZSgpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXBkYXRlT2Zmc2V0KClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xpY2sgZXZlbnQgaGFuZGxlclxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIGNsaWNrSGFuZGxlciAoZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gcHJldkJ1dHRvbikge1xyXG4gICAgICAgIHByZXYoKVxyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gbmV4dEJ1dHRvbikge1xyXG4gICAgICAgIG5leHQoKVxyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gY2xvc2VCdXR0b24gfHwgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICd0b2JpX19zbGlkZXJfX3NsaWRlJyAmJiBjb25maWcuZG9jQ2xvc2UpKSB7XHJcbiAgICAgICAgY2xvc2UoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogS2V5ZG93biBldmVudCBoYW5kbGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIga2V5ZG93bkhhbmRsZXIgPSBmdW5jdGlvbiBrZXlkb3duSGFuZGxlciAoZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDkpIHtcclxuICAgICAgICAvLyBgVEFCYCBLZXk6IE5hdmlnYXRlIHRvIHRoZSBuZXh0L3ByZXZpb3VzIGZvY3VzYWJsZSBlbGVtZW50XHJcbiAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAvLyBTdGVwIGJhY2t3YXJkcyBpbiB0aGUgdGFiLW9yZGVyXHJcbiAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RGb2N1c2FibGVFbCkge1xyXG4gICAgICAgICAgICBsYXN0Rm9jdXNhYmxlRWwuZm9jdXMoKVxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIFN0ZXAgZm9yd2FyZCBpbiB0aGUgdGFiLW9yZGVyXHJcbiAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdEZvY3VzYWJsZUVsKSB7XHJcbiAgICAgICAgICAgIGZpcnN0Rm9jdXNhYmxlRWwuZm9jdXMoKVxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSB7XHJcbiAgICAgICAgLy8gYEVTQ2AgS2V5OiBDbG9zZSB0aGUgbGlnaHRib3hcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY2xvc2UoKVxyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM3KSB7XHJcbiAgICAgICAgLy8gYFBSRVZgIEtleTogTmF2aWdhdGUgdG8gdGhlIHByZXZpb3VzIHNsaWRlXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIHByZXYoKVxyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5KSB7XHJcbiAgICAgICAgLy8gYE5FWFRgIEtleTogTmF2aWdhdGUgdG8gdGhlIG5leHQgc2xpZGVcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgbmV4dCgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRvdWNoc3RhcnQgZXZlbnQgaGFuZGxlclxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIHRvdWNoc3RhcnRIYW5kbGVyID0gZnVuY3Rpb24gdG91Y2hzdGFydEhhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgIC8vIFByZXZlbnQgZHJhZ2dpbmcgLyBzd2lwaW5nIG9uIHRleHRhcmVhcyBpbnB1dHMgYW5kIHNlbGVjdHNcclxuICAgICAgaWYgKGlzSWdub3JlRWxlbWVudChldmVudC50YXJnZXQpKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICBwb2ludGVyRG93biA9IHRydWVcclxuXHJcbiAgICAgIGRyYWcuc3RhcnRYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWFxyXG4gICAgICBkcmFnLnN0YXJ0WSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVlcclxuXHJcbiAgICAgIHNsaWRlci5jbGFzc0xpc3QuYWRkKCd0b2JpX19zbGlkZXItLWlzLWRyYWdnaW5nJylcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRvdWNobW92ZSBldmVudCBoYW5kbGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgdG91Y2htb3ZlSGFuZGxlciA9IGZ1bmN0aW9uIHRvdWNobW92ZUhhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICBpZiAocG9pbnRlckRvd24pIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgICAgIGRyYWcuZW5kWCA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVhcclxuICAgICAgICBkcmFnLmVuZFkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZXHJcblxyXG4gICAgICAgIGRvU3dpcGUoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUb3VjaGVuZCBldmVudCBoYW5kbGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgdG91Y2hlbmRIYW5kbGVyID0gZnVuY3Rpb24gdG91Y2hlbmRIYW5kbGVyIChldmVudCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgcG9pbnRlckRvd24gPSBmYWxzZVxyXG5cclxuICAgICAgc2xpZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3RvYmlfX3NsaWRlci0taXMtZHJhZ2dpbmcnKVxyXG5cclxuICAgICAgaWYgKGRyYWcuZW5kWCkge1xyXG4gICAgICAgIGlzRHJhZ2dpbmdYID0gZmFsc2VcclxuICAgICAgICBpc0RyYWdnaW5nWSA9IGZhbHNlXHJcblxyXG4gICAgICAgIHVwZGF0ZUFmdGVyRHJhZygpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNsZWFyRHJhZygpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNb3VzZWRvd24gZXZlbnQgaGFuZGxlclxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIG1vdXNlZG93bkhhbmRsZXIgPSBmdW5jdGlvbiBtb3VzZWRvd25IYW5kbGVyIChldmVudCkge1xyXG4gICAgICAvLyBQcmV2ZW50IGRyYWdnaW5nIC8gc3dpcGluZyBvbiB0ZXh0YXJlYXMgaW5wdXRzIGFuZCBzZWxlY3RzXHJcbiAgICAgIGlmIChpc0lnbm9yZUVsZW1lbnQoZXZlbnQudGFyZ2V0KSkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICBwb2ludGVyRG93biA9IHRydWVcclxuXHJcbiAgICAgIGRyYWcuc3RhcnRYID0gZXZlbnQucGFnZVhcclxuICAgICAgZHJhZy5zdGFydFkgPSBldmVudC5wYWdlWVxyXG5cclxuICAgICAgc2xpZGVyLmNsYXNzTGlzdC5hZGQoJ3RvYmlfX3NsaWRlci0taXMtZHJhZ2dpbmcnKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTW91c2Vtb3ZlIGV2ZW50IGhhbmRsZXJcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBtb3VzZW1vdmVIYW5kbGVyID0gZnVuY3Rpb24gbW91c2Vtb3ZlSGFuZGxlciAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgICAgaWYgKHBvaW50ZXJEb3duKSB7XHJcbiAgICAgICAgZHJhZy5lbmRYID0gZXZlbnQucGFnZVhcclxuICAgICAgICBkcmFnLmVuZFkgPSBldmVudC5wYWdlWVxyXG5cclxuICAgICAgICBkb1N3aXBlKClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTW91c2V1cCBldmVudCBoYW5kbGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgbW91c2V1cEhhbmRsZXIgPSBmdW5jdGlvbiBtb3VzZXVwSGFuZGxlciAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgIHBvaW50ZXJEb3duID0gZmFsc2VcclxuXHJcbiAgICAgIHNsaWRlci5jbGFzc0xpc3QucmVtb3ZlKCd0b2JpX19zbGlkZXItLWlzLWRyYWdnaW5nJylcclxuXHJcbiAgICAgIGlmIChkcmFnLmVuZFgpIHtcclxuICAgICAgICBpc0RyYWdnaW5nWCA9IGZhbHNlXHJcbiAgICAgICAgaXNEcmFnZ2luZ1kgPSBmYWxzZVxyXG5cclxuICAgICAgICB1cGRhdGVBZnRlckRyYWcoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjbGVhckRyYWcoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVjaWRlIHdoZXRoZXIgdG8gZG8gaG9yaXpvbnRhbCBvZiB2ZXJ0aWNhbCBzd2lwZVxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGRvU3dpcGUgPSBmdW5jdGlvbiBkb1N3aXBlICgpIHtcclxuICAgICAgaWYgKE1hdGguYWJzKGRyYWcuc3RhcnRYIC0gZHJhZy5lbmRYKSA+IDAgJiYgIWlzRHJhZ2dpbmdZICYmIGNvbmZpZy5zd2lwZUNsb3NlKSB7XHJcbiAgICAgICAgLy8gSG9yaXpvbnRhbCBzd2lwZVxyXG4gICAgICAgIHNsaWRlci5zdHlsZVt0cmFuc2Zvcm1Qcm9wZXJ0eV0gPSAndHJhbnNsYXRlM2QoJyArIChvZmZzZXRUbXAgLSBNYXRoLnJvdW5kKGRyYWcuc3RhcnRYIC0gZHJhZy5lbmRYKSkgKyAncHgsIDAsIDApJ1xyXG5cclxuICAgICAgICBpc0RyYWdnaW5nWCA9IHRydWVcclxuICAgICAgICBpc0RyYWdnaW5nWSA9IGZhbHNlXHJcbiAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoZHJhZy5zdGFydFkgLSBkcmFnLmVuZFkpID4gMCAmJiAhaXNEcmFnZ2luZ1gpIHtcclxuICAgICAgICAvLyBWZXJ0aWNhbCBzd2lwZVxyXG4gICAgICAgIHNsaWRlci5zdHlsZVt0cmFuc2Zvcm1Qcm9wZXJ0eV0gPSAndHJhbnNsYXRlM2QoJyArIChvZmZzZXRUbXAgKyAncHgsIC0nICsgTWF0aC5yb3VuZChkcmFnLnN0YXJ0WSAtIGRyYWcuZW5kWSkpICsgJ3B4LCAwKSdcclxuXHJcbiAgICAgICAgaXNEcmFnZ2luZ1ggPSBmYWxzZVxyXG4gICAgICAgIGlzRHJhZ2dpbmdZID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kIGV2ZW50c1xyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGJpbmRFdmVudHMgPSBmdW5jdGlvbiBiaW5kRXZlbnRzICgpIHtcclxuICAgICAgaWYgKGNvbmZpZy5rZXlib2FyZCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duSGFuZGxlcilcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ2xpY2sgZXZlbnRcclxuICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXHJcblxyXG4gICAgICBpZiAoY29uZmlnLmRyYWdnYWJsZSkge1xyXG4gICAgICAgIGlmIChpc1RvdWNoRGV2aWNlKCkpIHtcclxuICAgICAgICAgIC8vIFRvdWNoIGV2ZW50c1xyXG4gICAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoc3RhcnRIYW5kbGVyKVxyXG4gICAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdG91Y2htb3ZlSGFuZGxlcilcclxuICAgICAgICAgIGxpZ2h0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdG91Y2hlbmRIYW5kbGVyKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTW91c2UgZXZlbnRzXHJcbiAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2Vkb3duSGFuZGxlcilcclxuICAgICAgICBsaWdodGJveC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cEhhbmRsZXIpXHJcbiAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlSGFuZGxlcilcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kIGV2ZW50c1xyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIHVuYmluZEV2ZW50cyA9IGZ1bmN0aW9uIHVuYmluZEV2ZW50cyAoKSB7XHJcbiAgICAgIGlmIChjb25maWcua2V5Ym9hcmQpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bkhhbmRsZXIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENsaWNrIGV2ZW50XHJcbiAgICAgIGxpZ2h0Ym94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxyXG5cclxuICAgICAgaWYgKGNvbmZpZy5kcmFnZ2FibGUpIHtcclxuICAgICAgICBpZiAoaXNUb3VjaERldmljZSgpKSB7XHJcbiAgICAgICAgICAvLyBUb3VjaCBldmVudHNcclxuICAgICAgICAgIGxpZ2h0Ym94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0b3VjaHN0YXJ0SGFuZGxlcilcclxuICAgICAgICAgIGxpZ2h0Ym94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRvdWNobW92ZUhhbmRsZXIpXHJcbiAgICAgICAgICBsaWdodGJveC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRvdWNoZW5kSGFuZGxlcilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1vdXNlIGV2ZW50c1xyXG4gICAgICAgIGxpZ2h0Ym94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlZG93bkhhbmRsZXIpXHJcbiAgICAgICAgbGlnaHRib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNldXBIYW5kbGVyKVxyXG4gICAgICAgIGxpZ2h0Ym94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZUhhbmRsZXIpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyB3aGV0aGVyIGVsZW1lbnQgaGFzIHJlcXVlc3RlZCBkYXRhLXR5cGUgdmFsdWVcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBjaGVja1R5cGUgPSBmdW5jdGlvbiBjaGVja1R5cGUgKGVsLCB0eXBlKSB7XHJcbiAgICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpID09PSB0eXBlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYWxsIGBzcmNgIGF0dHJpYnV0ZXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIEVsZW1lbnQgdG8gcmVtb3ZlIGFsbCBgc3JjYCBhdHRyaWJ1dGVzXHJcbiAgICAgKi9cclxuICAgIHZhciByZW1vdmVTb3VyY2VzID0gZnVuY3Rpb24gc2V0VmlkZW9Tb3VyY2VzIChlbCkge1xyXG4gICAgICB2YXIgc291cmNlcyA9IGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NyYycpXHJcblxyXG4gICAgICBpZiAoc291cmNlcykge1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoc291cmNlcywgZnVuY3Rpb24gKHNvdXJjZSkge1xyXG4gICAgICAgICAgc291cmNlLnNldEF0dHJpYnV0ZSgnc3JjJywgJycpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIENvbmZpZ1xyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIHJlY2hlY2tDb25maWcgPSBmdW5jdGlvbiByZWNoZWNrQ29uZmlnICgpIHtcclxuICAgICAgaWYgKGNvbmZpZy5kcmFnZ2FibGUgJiYgZWxlbWVudHNMZW5ndGggPiAxICYmICFzbGlkZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2JpX19zbGlkZXItLWlzLWRyYWdnYWJsZScpKSB7XHJcbiAgICAgICAgc2xpZGVyLmNsYXNzTGlzdC5hZGQoJ3RvYmlfX3NsaWRlci0taXMtZHJhZ2dhYmxlJylcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSGlkZSBidXR0b25zIGlmIG5lY2Vzc2FyeVxyXG4gICAgICBpZiAoIWNvbmZpZy5uYXYgfHwgZWxlbWVudHNMZW5ndGggPT09IDEgfHwgKGNvbmZpZy5uYXYgPT09ICdhdXRvJyAmJiBpc1RvdWNoRGV2aWNlKCkpKSB7XHJcbiAgICAgICAgcHJldkJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxyXG4gICAgICAgIG5leHRCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwcmV2QnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKVxyXG4gICAgICAgIG5leHRCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEhpZGUgY291bnRlciBpZiBuZWNlc3NhcnlcclxuICAgICAgaWYgKCFjb25maWcuY291bnRlciB8fCBlbGVtZW50c0xlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIGNvdW50ZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb3VudGVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgbGlnaHRib3hcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGlyIC0gQ3VycmVudCBzbGlkZSBkaXJlY3Rpb25cclxuICAgICAqL1xyXG4gICAgdmFyIHVwZGF0ZUxpZ2h0Ym94ID0gZnVuY3Rpb24gdXBkYXRlTGlnaHRib3ggKGRpcikge1xyXG4gICAgICB1cGRhdGVPZmZzZXQoKVxyXG4gICAgICB1cGRhdGVDb3VudGVyKClcclxuICAgICAgdXBkYXRlRm9jdXMoZGlyKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzZXQgdGhlIGxpZ2h0Ym94XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayB0byBjYWxsIGFmdGVyIHJlc2V0XHJcbiAgICAgKi9cclxuICAgIHZhciByZXNldCA9IGZ1bmN0aW9uIHJlc2V0IChjYWxsYmFjaykge1xyXG4gICAgICBpZiAoc2xpZGVyKSB7XHJcbiAgICAgICAgd2hpbGUgKHNsaWRlci5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICBzbGlkZXIucmVtb3ZlQ2hpbGQoc2xpZGVyLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBnYWxsZXJ5Lmxlbmd0aCA9IHNsaWRlckVsZW1lbnRzLmxlbmd0aCA9IGVsZW1lbnRzTGVuZ3RoID0gZmlnY2FwdGlvbklkID0geCA9IDBcclxuXHJcbiAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcylcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgdGhlIGxpZ2h0Ym94IGlzIG9wZW5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBpc09wZW4gPSBmdW5jdGlvbiBpc09wZW4gKCkge1xyXG4gICAgICByZXR1cm4gbGlnaHRib3guZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAnZmFsc2UnXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRlY3Qgd2hldGhlciBkZXZpY2UgaXMgdG91Y2ggY2FwYWJsZVxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGlzVG91Y2hEZXZpY2UgPSBmdW5jdGlvbiBpc1RvdWNoRGV2aWNlICgpIHtcclxuICAgICAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvd1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgZWxlbWVudCdzIG5vZGVOYW1lIGlzIHBhcnQgb2YgYXJyYXlcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBpc0lnbm9yZUVsZW1lbnQgPSBmdW5jdGlvbiBpc0lnbm9yZUVsZW1lbnQgKGVsKSB7XHJcbiAgICAgIHJldHVybiBbJ1RFWFRBUkVBJywgJ09QVElPTicsICdJTlBVVCcsICdTRUxFQ1QnXS5pbmRleE9mKGVsLm5vZGVOYW1lKSAhPT0gLTEgfHwgZWwgPT09IHByZXZCdXR0b24gfHwgZWwgPT09IG5leHRCdXR0b24gfHwgZWwgPT09IGNsb3NlQnV0dG9uIHx8IGVsZW1lbnRzTGVuZ3RoID09PSAxXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gY3VycmVudCBpbmRleFxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGN1cnJlbnRTbGlkZSA9IGZ1bmN0aW9uIGN1cnJlbnRTbGlkZSAoKSB7XHJcbiAgICAgIHJldHVybiBjdXJyZW50SW5kZXhcclxuICAgIH1cclxuXHJcbiAgICBpbml0KHVzZXJPcHRpb25zKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIG9wZW46IG9wZW4sXHJcbiAgICAgIHByZXY6IHByZXYsXHJcbiAgICAgIG5leHQ6IG5leHQsXHJcbiAgICAgIGNsb3NlOiBjbG9zZSxcclxuICAgICAgYWRkOiBjaGVja0RlcGVuZGVuY2llcyxcclxuICAgICAgcmVzZXQ6IHJlc2V0LFxyXG4gICAgICBpc09wZW46IGlzT3BlbixcclxuICAgICAgY3VycmVudFNsaWRlOiBjdXJyZW50U2xpZGVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBUb2JpXHJcbn0pKVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ycXJhdWh2bXJhX190b2JpL2pzL3RvYmkuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
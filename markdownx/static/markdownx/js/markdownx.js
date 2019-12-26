(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})({
    1: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var utils_1 = require("./utils");
        var UPLOAD_URL_ATTRIBUTE = "data-markdownx-upload-urls-path", PROCESSING_URL_ATTRIBUTE = "data-markdownx-urls-path", RESIZABILITY_ATTRIBUTE = "data-markdownx-editor-resizable", LATENCY_ATTRIBUTE = "data-markdownx-latency", LATENCY_MINIMUM = 500, XHR_RESPONSE_ERROR = "Invalid response", UPLOAD_START_OPACITY = "0.3", NORMAL_OPACITY = "1";
        var EventHandlers = {
            inhibitDefault: function(event) {
                event.preventDefault();
                event.stopPropagation();
                return event;
            },
            onDragEnter: function(event) {
                event.dataTransfer.dropEffect = "copy";
                return EventHandlers.inhibitDefault(event);
            }
        };
        var keyboardEvents = {
            keys: {
                TAB: "Tab",
                DUPLICATE: "d",
                UNINDENT: "[",
                INDENT: "]"
            },
            handlers: {
                applyTab: function(properties) {
                    return properties.value.substring(0, properties.start) + (properties.value.substring(properties.start, properties.end).match(/\n/gm) === null ? "\t" + properties.value.substring(properties.start) : properties.value.substring(properties.start, properties.end).replace(/^/gm, "\t") + properties.value.substring(properties.end));
                },
                removeTab: function(properties) {
                    var substitution = null, lineTotal = (properties.value.substring(properties.start, properties.end).match(/\n/g) || []).length;
                    if (properties.start === properties.end) {
                        properties.start = properties.start > 0 && properties.value[properties.start - 1].match(/\t/) !== null ? properties.start - 1 : properties.start;
                        substitution = properties.value.substring(properties.start).replace("\t", "");
                    } else if (!lineTotal) {
                        substitution = properties.value.substring(properties.start).replace("\t", "");
                    } else {
                        substitution = properties.value.substring(properties.start, properties.end).replace(/^\t/gm, "") + properties.value.substring(properties.end);
                    }
                    return properties.value.substring(0, properties.start) + substitution;
                },
                _multiLineIndentation: function(properties) {
                    var endLine = new RegExp("(?:\n|.){0," + properties.end + "}(^.*$)", "m").exec(properties.value)[1];
                    return properties.value.substring(properties.value.indexOf(new RegExp("(?:\n|.){0," + properties.start + "}(^.*$)", "m").exec(properties.value)[1]), properties.value.indexOf(endLine) ? properties.value.indexOf(endLine) + endLine.length : properties.end);
                },
                applyIndentation: function(properties) {
                    if (properties.start === properties.end) {
                        var line = new RegExp("(?:\n|.){0," + properties.start + "}(^.+$)", "m").exec(properties.value)[1];
                        return properties.value.replace(line, "\t" + line);
                    }
                    var content = this._multiLineIndentation({
                        start: properties.start,
                        end: properties.end,
                        value: properties.value
                    });
                    return properties.value.replace(content, content.replace(/(^.+$)\n*/gim, "\t$&"));
                },
                removeIndentation: function(properties) {
                    if (properties.start === properties.end) {
                        var line = new RegExp("(?:\n|.){0," + properties.start + "}(^\t.+$)", "m").exec(properties.value)[1];
                        return properties.value.replace(line, line.substring(1));
                    }
                    var content = this._multiLineIndentation({
                        start: properties.start,
                        end: properties.end,
                        value: properties.value
                    });
                    return properties.value.replace(content, content.replace(/^\t(.+)\n*$/gim, "$1"));
                },
                applyDuplication: function(properties) {
                    if (properties.start !== properties.end) return properties.value.substring(0, properties.start) + properties.value.substring(properties.start, properties.end) + (~properties.value.charAt(properties.start - 1).indexOf("\n") || ~properties.value.charAt(properties.start).indexOf("\n") ? "\n" : "") + properties.value.substring(properties.start, properties.end) + properties.value.substring(properties.end);
                    var pattern = new RegExp("(?:.|\n){0,160}(^.*$)", "m"), line = "";
                    properties.value.replace(pattern, function(match, p1) {
                        return line += p1;
                    });
                    return properties.value.replace(line, line + "\n" + line);
                }
            },
            hub: function(event) {
                switch (event.key) {
                  case this.keys.TAB:
                    return event.shiftKey ? this.handlers.removeTab : this.handlers.applyTab;

                  case this.keys.DUPLICATE:
                    return event.ctrlKey || event.metaKey ? this.handlers.applyDuplication : false;

                  case this.keys.INDENT:
                    return event.ctrlKey || event.metaKey ? this.handlers.applyIndentation : false;

                  case this.keys.UNINDENT:
                    return event.ctrlKey || event.metaKey ? this.handlers.removeIndentation : false;

                  default:
                    return false;
                }
            }
        };
        function getHeight(element) {
            return Math.max(parseInt(window.getComputedStyle(element).height), parseInt(element.style.height) || 0);
        }
        function updateHeight(editor) {
            if (editor.scrollTop) editor.style.height = editor.scrollTop + getHeight(editor) + "px";
            return editor;
        }
        var MarkdownX = function(parent, editor, preview) {
            var _this = this;
            var properties = {
                editor: editor,
                preview: preview,
                parent: parent,
                _latency: null,
                _editorIsResizable: null
            };
            var _initialize = function() {
                _this.timeout = null;
                var documentListeners = {
                    object: document,
                    listeners: [ {
                        type: "drop",
                        capture: false,
                        listener: EventHandlers.inhibitDefault
                    }, {
                        type: "dragover",
                        capture: false,
                        listener: EventHandlers.inhibitDefault
                    }, {
                        type: "dragenter",
                        capture: false,
                        listener: EventHandlers.inhibitDefault
                    }, {
                        type: "dragleave",
                        capture: false,
                        listener: EventHandlers.inhibitDefault
                    } ]
                }, editorListeners = {
                    object: properties.editor,
                    listeners: [ {
                        type: "drop",
                        capture: false,
                        listener: onDrop
                    }, {
                        type: "input",
                        capture: true,
                        listener: inputChanged
                    }, {
                        type: "keydown",
                        capture: true,
                        listener: onKeyDown
                    }, {
                        type: "dragover",
                        capture: false,
                        listener: EventHandlers.onDragEnter
                    }, {
                        type: "dragenter",
                        capture: false,
                        listener: EventHandlers.onDragEnter
                    }, {
                        type: "dragleave",
                        capture: false,
                        listener: EventHandlers.inhibitDefault
                    }, {
                        type: "compositionstart",
                        capture: true,
                        listener: onKeyDown
                    } ]
                };
                utils_1.mountEvents(editorListeners, documentListeners);
                properties.editor.setAttribute("data-markdownx-init", "");
                properties.editor.style.transition = "opacity 1s ease";
                properties.editor.style.webkitTransition = "opacity 1s ease";
                properties._latency = Math.max(parseInt(properties.editor.getAttribute(LATENCY_ATTRIBUTE)) || 0, LATENCY_MINIMUM);
                properties._editorIsResizable = (properties.editor.getAttribute(RESIZABILITY_ATTRIBUTE).match(/true/i) || []).length > 0 && properties.editor.offsetHeight > 0 && properties.editor.offsetWidth > 0;
                getMarkdown();
                utils_1.triggerCustomEvent("markdownx.init");
            };
            var _markdownify = function() {
                clearTimeout(_this.timeout);
                _this.timeout = setTimeout(getMarkdown, properties._latency);
            };
            var inputChanged = function() {
                properties.editor = properties._editorIsResizable ? updateHeight(properties.editor) : properties.editor;
                return _markdownify();
            };
            var onDrop = function(event) {
                if (event.dataTransfer && event.dataTransfer.files.length) Object.keys(event.dataTransfer.files).map(function(fileKey) {
                    return sendFile(event.dataTransfer.files[fileKey]);
                });
                EventHandlers.inhibitDefault(event);
            };
            var onKeyDown = function(event) {
                var handlerFunc = keyboardEvents.hub(event);
                if (typeof handlerFunc != "function") return false;
                EventHandlers.inhibitDefault(event);
                var SELECTION_START = properties.editor.selectionStart;
                properties.editor.value = handlerFunc({
                    start: properties.editor.selectionStart,
                    end: properties.editor.selectionEnd,
                    value: properties.editor.value
                });
                _markdownify();
                properties.editor.focus();
                properties.editor.selectionEnd = properties.editor.selectionStart = SELECTION_START;
                return false;
            };
            var sendFile = function(file) {
                properties.editor.style.opacity = UPLOAD_START_OPACITY;
                var xhr = new utils_1.Request(properties.editor.getAttribute(UPLOAD_URL_ATTRIBUTE), utils_1.preparePostData({
                    image: file
                }));
                xhr.success = function(resp) {
                    var response = JSON.parse(resp);
                    if (response.image_code) {
                        insertImage(response.image_code);
                        utils_1.triggerCustomEvent("markdownx.fileUploadEnd", properties.parent, [ response ]);
                    } else if (response.image_path) {
                        insertImage('![]("' + response.image_path + '")');
                        utils_1.triggerCustomEvent("markdownx.fileUploadEnd", properties.parent, [ response ]);
                    } else {
                        console.error(XHR_RESPONSE_ERROR, response);
                        utils_1.triggerCustomEvent("markdownx.fileUploadError", properties.parent, [ response ]);
                        insertImage(XHR_RESPONSE_ERROR);
                    }
                    properties.editor.style.opacity = NORMAL_OPACITY;
                };
                xhr.error = function(response) {
                    console.error(response);
                    utils_1.triggerCustomEvent("fileUploadError", properties.parent, [ response ]);
                    insertImage(XHR_RESPONSE_ERROR);
                    properties.editor.style.opacity = NORMAL_OPACITY;
                };
                return xhr.send();
            };
            var getMarkdown = function() {
                var xhr = new utils_1.Request(properties.editor.getAttribute(PROCESSING_URL_ATTRIBUTE), utils_1.preparePostData({
                    content: properties.editor.value
                }));
                xhr.success = function(response) {
                    properties.preview.innerHTML = response;
                    properties.editor = updateHeight(properties.editor);
                    utils_1.triggerCustomEvent("markdownx.update", properties.parent, [ response ]);
                };
                xhr.error = function(response) {
                    console.error(response);
                    utils_1.triggerCustomEvent("markdownx.updateError", properties.parent, [ response ]);
                };
                return xhr.send();
            };
            var insertImage = function(textToInsert) {
                properties.editor.value = "" + properties.editor.value.substring(0, properties.editor.selectionStart) + textToInsert + ("" + properties.editor.value.substring(properties.editor.selectionEnd));
                properties.editor.selectionStart = properties.editor.selectionEnd = properties.editor.selectionStart + textToInsert.length;
                utils_1.triggerEvent(properties.editor, "keyup");
                inputChanged();
            };
            _initialize();
        };
        exports.MarkdownX = MarkdownX;
        (function(funcName, baseObj) {
            funcName = funcName || "docReady";
            baseObj = baseObj || window;
            var readyList = [], readyFired = false, readyEventHandlersInstalled = false;
            var ready = function() {
                if (!readyFired) {
                    readyFired = true;
                    readyList.map(function(ready) {
                        return ready.fn.call(window, ready.ctx);
                    });
                    readyList = [];
                }
            };
            var readyStateChange = function() {
                return document.readyState === "complete" ? ready() : null;
            };
            baseObj[funcName] = function(callback, context) {
                if (readyFired) {
                    setTimeout(function() {
                        return callback(context);
                    }, 1);
                    return;
                } else {
                    readyList.push({
                        fn: callback,
                        ctx: context
                    });
                }
                if (document.readyState === "complete") {
                    setTimeout(ready, 1);
                } else if (!readyEventHandlersInstalled) {
                    document.addEventListener("DOMContentLoaded", ready, false);
                    window.addEventListener("load", ready, false);
                    readyEventHandlersInstalled = true;
                }
            };
        })("docReady", window);
        docReady(function() {
            var ELEMENTS = document.getElementsByClassName("markdownx");
            return Object.keys(ELEMENTS).map(function(key) {
                var element = ELEMENTS[key], editor = element.querySelector(".markdownx-editor"), preview = element.querySelector(".markdownx-preview");
                if (!editor.hasAttribute("data-markdownx-init")) return new MarkdownX(element, editor, preview);
            });
        });
    }, {
        "./utils": 2
    } ],
    2: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function getCookie(name) {
            if (document.cookie && document.cookie.length) {
                var cookies = document.cookie.split(";").filter(function(cookie) {
                    return cookie.indexOf(name + "=") !== -1;
                })[0];
                try {
                    return decodeURIComponent(cookies.trim().substring(name.length + 1));
                } catch (e) {
                    if (e instanceof TypeError) {
                        console.info('No cookie with key "' + name + '". Wrong name?');
                        return null;
                    }
                    throw e;
                }
            }
            return null;
        }
        exports.getCookie = getCookie;
        function zip() {
            var rows = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rows[_i] = arguments[_i];
            }
            if (rows[0].constructor == Array) return rows[0].slice().map(function(_, c) {
                return rows.map(function(row) {
                    return row[c];
                });
            });
            var asArray = rows.map(function(row) {
                return Object.keys(row).map(function(key) {
                    return row[key];
                });
            });
            return asArray[0].slice().map(function(_, c) {
                return asArray.map(function(row) {
                    return row[c];
                });
            });
        }
        exports.zip = zip;
        function mountEvents() {
            var collections = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                collections[_i] = arguments[_i];
            }
            return collections.map(function(events) {
                return events.listeners.map(function(series) {
                    return events.object.addEventListener(series.type, series.listener, series.capture);
                });
            });
        }
        exports.mountEvents = mountEvents;
        function preparePostData(data, csrf) {
            if (csrf === void 0) {
                csrf = true;
            }
            var form = new FormData();
            if (csrf) {
                var csrfToken = getCookie("csrftoken");
                if (!csrfToken) csrfToken = document.querySelector("input[name='csrfmiddlewaretoken']").value;
                form.append("csrfmiddlewaretoken", csrfToken);
            }
            Object.keys(data).map(function(key) {
                return form.append(key, data[key]);
            });
            return form;
        }
        exports.preparePostData = preparePostData;
        function AJAXRequest() {
            if ("XMLHttpRequest" in window) return new XMLHttpRequest();
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            } catch (e) {}
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
            alert("Your browser belongs to history!");
            throw new TypeError("This browser does not support AJAX requests.");
        }
        var Request = function() {
            function Request(url, data) {
                this.xhr = AJAXRequest();
                this.url = url;
                this.data = data;
            }
            Request.prototype.progress = function(event) {
                if (event.lengthComputable) {}
            };
            Request.prototype.error = function(response) {
                console.error(response);
            };
            Request.prototype.success = function(response) {
                console.info(response);
            };
            Request.prototype.send = function() {
                var _this = this;
                var SUCCESS = this.success, ERROR = this.error, PROGRESS = this.progress;
                this.xhr.open("POST", this.url, true);
                this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                this.xhr.upload.onprogress = function(event) {
                    return PROGRESS(event);
                };
                this.xhr.onerror = function(event) {
                    ERROR(_this.xhr.responseText);
                };
                this.xhr.onload = function(event) {
                    var data = null;
                    if (_this.xhr.readyState == XMLHttpRequest.DONE) {
                        if (!_this.xhr.responseType || _this.xhr.responseType === "text") {
                            data = _this.xhr.responseText;
                        } else if (_this.xhr.responseType === "document") {
                            data = _this.xhr.responseXML;
                        } else {
                            data = _this.xhr.response;
                        }
                    }
                    SUCCESS(data);
                };
                this.xhr.send(this.data);
            };
            return Request;
        }();
        exports.Request = Request;
        function triggerEvent(element, type) {
            var event = document.createEvent("HTMLEvents");
            event.initEvent(type, false, true);
            element.dispatchEvent(event);
        }
        exports.triggerEvent = triggerEvent;
        function triggerCustomEvent(type, element, args) {
            if (element === void 0) {
                element = document;
            }
            if (args === void 0) {
                args = null;
            }
            var event = new CustomEvent(type, {
                detail: args
            });
            element.dispatchEvent(event);
        }
        exports.triggerCustomEvent = triggerCustomEvent;
        function addClass(element) {
            var className = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                className[_i - 1] = arguments[_i];
            }
            className.map(function(cname) {
                if (element.classList) element.classList.add(cname); else {
                    var classes = element.className.split(" ");
                    if (classes.indexOf(cname) < 0) classes.push(cname);
                    element.className = classes.join(" ");
                }
            });
        }
        exports.addClass = addClass;
        function removeClass(element) {
            var className = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                className[_i - 1] = arguments[_i];
            }
            className.map(function(cname) {
                if (element.classList) element.classList.remove(cname); else {
                    var classes = element.className.split(" "), idx = classes.indexOf(cname);
                    if (idx > -1) classes.splice(idx, 1);
                    element.className = classes.join(" ");
                }
            });
        }
        exports.removeClass = removeClass;
    }, {} ]
}, {}, [ 1 ]);
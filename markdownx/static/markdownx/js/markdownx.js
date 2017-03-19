(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * **Markdownx**
 *
 * Frontend (JavaScript) management of Django-Markdownx module.
 *
 * Written in JavaScript (ECMA Script 2016), compiled in (ECMA5 - 2011).
 *
 * Requirements:
 * - Modern browser with support for HTML5 and ECMA 2011+ (IE 10+).
 */
// Import, definitions and constant ------------------------------------------------------------------------------------
"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var UPLOAD_URL_ATTRIBUTE = "data-markdownx-upload-urls-path", PROCESSING_URL_ATTRIBUTE = "data-markdownx-urls-path", RESIZABILITY_ATTRIBUTE = "data-markdownx-editor-resizable", LATENCY_ATTRIBUTE = "data-markdownx-latency";
// ---------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param {number} start
 * @param {number} end
 * @param {string} value
 * @returns {string}
 */
function applyIndentation(start, end, value) {
    return value.substring(0, start) + (value.substring(start, end).match(/\n/g) === null ?
        "\t" + value.substring(start) :
        value.substring(start, end).replace(/^/gm, '\t') + value.substring(end));
}
/**
 *
 * @param {number} start
 * @param {number} end
 * @param {string} value
 * @returns {string}
 */
function removeIndentation(start, end, value) {
    var endString = null, lineNumbers = (value.substring(start, end).match(/\n/g) || []).length;
    if (start === end) {
        // Replacing `\t` at a specific location (+/- 1 chars) where there is no selection.
        start = start > 0 && value[start - 1].match(/\t/) !== null ? start - 1 : start;
        endString = value.substring(start).replace(/\t/, '');
    }
    else if (!lineNumbers) {
        // Replacing `\t` within a single line selection.
        endString = value.substring(start).replace(/\t/, '');
    }
    else {
        // Replacing `\t` in the beginning of each line in a multi-line selection.
        endString = value.substring(start, end).replace(/^\t/gm, '') + value.substring(end, value.length);
    }
    return value.substring(0, start) + endString;
}
/**
 *
 * @param start
 * @param end
 * @param value
 * @returns {string}
 */
function applyDuplication(start, end, value) {
    var pattern = new RegExp("(?:.|\n){0," + end + "}\n([^].+)(?:.|\n)*", 'm');
    switch (start) {
        case end:
            var line_1 = '';
            value.replace(pattern, function (match, p1) { return line_1 += p1; });
            return value.replace(line_1, line_1 + "\n" + line_1);
        default:
            return (value.substring(0, start) +
                value.substring(start, end) +
                (~value.charAt(start - 1).indexOf('\n') || ~value.charAt(start).indexOf('\n') ? '\n' : '') +
                value.substring(start, end) +
                value.substring(end));
    }
}
function getHeight(element) {
    return Math.max(// Maximum of computed or set heights.
    parseInt(window.getComputedStyle(element).height), // Height is not set in styles.
    (parseInt(element.style.height) || 0) // Property's own height if set, otherwise 0.
    );
}
/**
 * @example
 *
 *     let editor  = document.getElementById('MyMarkdownEditor'),
 *         preview = document.getElementById('MyMarkdownPreview');
 *
 *     let mdx = new MarkdownX(editor, preview)
 *
 * @param {HTMLTextAreaElement} editor - Markdown editor element.
 * @param {HTMLElement} preview - Markdown preview element.
 */
var MarkdownX = function (editor, preview) {
    var _this = this;
    var properties = {
        editor: editor,
        preview: preview,
        _editorIsResizable: null,
        _latency: null
    };
    var _initialize = function () {
        _this.timeout = null;
        // Events
        // ----------------------------------------------------------------------------------------------
        var documentListeners = {
            // ToDo: Deprecate.
            object: document,
            listeners: [
                { type: "drop", capture: false, listener: onHtmlEvents },
                { type: "dragover", capture: false, listener: onHtmlEvents },
                { type: "dragenter", capture: false, listener: onHtmlEvents },
                { type: "dragleave", capture: false, listener: onHtmlEvents }
            ]
        }, editorListeners = {
            object: properties.editor,
            listeners: [
                { type: "drop", capture: false, listener: onDrop },
                { type: "input", capture: true, listener: inputChanged },
                { type: "keydown", capture: true, listener: onKeyDown },
                { type: "dragover", capture: false, listener: onDragEnter },
                { type: "dragenter", capture: false, listener: onDragEnter },
                { type: "dragleave", capture: false, listener: onDragLeave },
                { type: "compositionstart", capture: true, listener: onKeyDown }
            ]
        };
        // Initialise
        // --------------------------------------------------------
        utils_1.mountEvents(editorListeners);
        utils_1.mountEvents(documentListeners); // ToDo: Deprecate.
        properties.editor.style.transition = "opacity 1s ease";
        properties.editor.style.webkitTransition = "opacity 1s ease";
        // Latency must be a value >= 500 microseconds.
        properties._latency = Math.max(parseInt(properties.editor.getAttribute(LATENCY_ATTRIBUTE)) || 0, 500);
        properties._editorIsResizable =
            (properties.editor.getAttribute(RESIZABILITY_ATTRIBUTE).match(/True/) || []).length > 0;
        getMarkdown();
        inputChanged();
        utils_1.triggerCustomEvent("markdownx.init");
    };
    /**
     * settings for ``timeout``.
     *
     * @private
     */
    var _markdownify = function () {
        clearTimeout(_this.timeout);
        _this.timeout = setTimeout(getMarkdown, properties._latency);
    };
    /**
     * Routine tasks for event handlers (e.g. default preventions).
     *
     * @param {Event} event
     * @private
     */
    var _inhibitDefault = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    var updateHeight = function () {
        // Ensure that the editor is resizable before anything else.
        // Change size if scroll is larger that height, otherwise do nothing.
        if (properties._editorIsResizable && getHeight(properties.editor) < properties.editor.scrollHeight)
            properties.editor.style.height = properties.editor.scrollHeight + "px";
    };
    var inputChanged = function () {
        updateHeight();
        _markdownify();
    };
    // ToDo: Deprecate.
    var onHtmlEvents = function (event) { return _inhibitDefault(event); };
    var onDragEnter = function (event) {
        event.dataTransfer.dropEffect = 'copy';
        _inhibitDefault(event);
    };
    var onDragLeave = function (event) { return _inhibitDefault(event); };
    var onDrop = function (event) {
        if (event.dataTransfer && event.dataTransfer.files.length)
            Object.keys(event.dataTransfer.files).map(function (fileKey) { return sendFile(event.dataTransfer.files[fileKey]); });
        _inhibitDefault(event);
    };
    /**
     *
     * @param event
     * @returns {KeyboardEvent}
     */
    var onKeyDown = function (event) {
        // `Tab` for indentation, `d` for duplication.
        if (event.key !== 'Tab' && event.key !== 'd')
            return null;
        _inhibitDefault(event);
        var handlerFunc = null;
        switch (event.key) {
            case "Tab":
                // Shift pressed: un-indent, otherwise indent.
                handlerFunc = event.shiftKey ? removeIndentation : applyIndentation;
                break;
            case "d":
                if (event.ctrlKey || event.metaKey)
                    handlerFunc = applyDuplication;
                else
                    return false;
                break;
            default:
                return false;
        }
        // Holding the start location before anything changes.
        var SELECTION_START = properties.editor.selectionStart;
        properties.editor.value = handlerFunc(properties.editor.selectionStart, properties.editor.selectionEnd, properties.editor.value);
        _markdownify();
        properties.editor.focus();
        // Set the cursor location to the start location of the selection.
        properties.editor.selectionEnd = properties.editor.selectionStart = SELECTION_START;
        return false;
    };
    /**
     *
     * @param file
     */
    var sendFile = function (file) {
        properties.editor.style.opacity = "0.3";
        var xhr = new utils_1.Request(properties.editor.getAttribute(UPLOAD_URL_ATTRIBUTE), // URL
        utils_1.preparePostData({ image: file }) // Data
        );
        xhr.success = function (resp) {
            var response = JSON.parse(resp);
            if (response.image_code) {
                insertImage(response.image_code);
                utils_1.triggerCustomEvent('markdownx.fileUploadEnd', [response]);
            }
            else if (response.image_path) {
                // ToDo: Deprecate.
                insertImage("![](\"" + response.image_path + "\")");
                utils_1.triggerCustomEvent('markdownx.fileUploadEnd', [response]);
            }
            else {
                console.error('Wrong response', response);
                utils_1.triggerCustomEvent('markdownx.fileUploadError', [response]);
            }
            properties.preview.innerHTML = _this.response;
            properties.editor.style.opacity = "1";
        };
        xhr.error = function (response) {
            properties.editor.style.opacity = "1";
            console.error(response);
            utils_1.triggerCustomEvent('fileUploadError', [response]);
        };
        return xhr.send();
    };
    /**
     *
     */
    var getMarkdown = function () {
        var xhr = new utils_1.Request(properties.editor.getAttribute(PROCESSING_URL_ATTRIBUTE), // URL
        utils_1.preparePostData({ content: properties.editor.value }) // Data
        );
        xhr.success = function (response) {
            properties.preview.innerHTML = response;
            updateHeight();
            utils_1.triggerCustomEvent('markdownx.update', [response]);
        };
        xhr.error = function (response) {
            console.error(response);
            utils_1.triggerCustomEvent('markdownx.updateError', [response]);
        };
        return xhr.send();
    };
    var insertImage = function (textToInsert) {
        var cursorPosition = properties.editor.selectionStart, text = properties.editor.value, textBeforeCursor = text.substring(0, cursorPosition), textAfterCursor = text.substring(cursorPosition, text.length);
        properties.editor.value = "" + textBeforeCursor + textToInsert + textAfterCursor;
        properties.editor.selectionStart = cursorPosition + textToInsert.length;
        properties.editor.selectionEnd = cursorPosition + textToInsert.length;
        utils_1.triggerEvent(properties.editor, 'keyup');
        inputChanged();
    };
    _initialize();
};
(function (funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function
    // name and those will be used.
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [], readyFired = false, readyEventHandlersInstalled = false;
    /**
     * Called when the document is ready. This function protects itself
     * against being called more than once.
     */
    var ready = function () {
        if (!readyFired) {
            // Must be `true` before the callbacks are called.
            readyFired = true;
            // if a callback here happens to add new ready handlers,
            // the docReady() function will see that it already fired
            // and will schedule the callback to run right after
            // this event loop finishes so all handlers will still execute
            // in order and no new ones will be added to the readyList
            // while we are processing the list
            readyList.map(function (ready) { return ready.fn.call(window, ready.ctx); });
            // allow any closures held by these functions to free
            readyList = [];
        }
    };
    var readyStateChange = function () { return document.readyState === "complete" ? ready() : null; };
    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function (callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function () { return callback(context); }, 1);
            return;
        }
        else {
            // add the function and context to the list
            readyList.push({ fn: callback, ctx: context });
        }
        // If the document is already ready, schedule the ready
        // function to run.
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        }
        else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed,
            // install them first choice is DOMContentLoaded event.
            document.addEventListener("DOMContentLoaded", ready, false);
            // backup is window load event
            window.addEventListener("load", ready, false);
            readyEventHandlersInstalled = true;
        }
    };
})("docReady", window);
docReady(function () {
    var EDITORS = document.querySelectorAll('.markdownx > .markdownx-editor'), PREVIEWS = document.querySelectorAll('.markdownx > .markdownx-preview'), EDITOR_INDEX = 0, PREVIEW_INDEX = 1;
    return utils_1.zip(EDITORS, PREVIEWS).map(function (item) { return new MarkdownX(item[EDITOR_INDEX], item[PREVIEW_INDEX]); });
});

},{"./utils":2}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Looks for a cookie, and if found, returns the values.
 *
 * NOTE: Only the first item in the array is returned
 * to eliminate the need for array deconstruction in
 * the target.
 *
 * @param {string} name - The name of the cookie.
 * @returns {string | null}
 */
function getCookie(name) {
    if (document.cookie && document.cookie.length) {
        var cookies = document.cookie
            .split(';')
            .filter(function (cookie) { return cookie.indexOf(name + "=") !== -1; })[0];
        try {
            return decodeURIComponent(cookies.trim().substring(name.length + 1));
        }
        catch (e) {
            if (e instanceof TypeError) {
                console.info("No cookie with key \"" + name + "\". Wrong name?");
                return null;
            }
            throw e;
        }
    }
    return null;
}
exports.getCookie = getCookie;
/**
 * @example
 *
 *
 * @param rows
 * @returns
 */
function zip() {
    var rows = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rows[_i] = arguments[_i];
    }
    if (rows[0].constructor == Array)
        return rows[0].slice().map(function (_, c) { return rows.map(function (row) { return row[c]; }); });
    // ToDo: To be updated to Objects.values in ECMA2017 after the method is fully ratified.
    var asArray = rows.map(function (row) { return Object.keys(row).map(function (key) { return row[key]; }); });
    return asArray[0].slice().map(function (_, c) { return asArray.map(function (row) { return row[c]; }); });
}
exports.zip = zip;
/**
 *
 * @param events
 * @returns
 */
function mountEvents(events) {
    return events.listeners.map(function (series) {
        return events.object.addEventListener(series.type, series.listener, series.capture);
    });
}
exports.mountEvents = mountEvents;
/**
 *
 * @param data
 * @param csrf
 * @returns {FormData}
 */
function preparePostData(data, csrf) {
    if (csrf === void 0) { csrf = true; }
    var form = new FormData();
    if (csrf)
        form.append("csrfmiddlewaretoken", getCookie('csrftoken'));
    Object.keys(data).map(function (key) { return form.append(key, data[key]); });
    return form;
}
exports.preparePostData = preparePostData;
var AJAXRequest = function () {
    // Chrome, Firefox, IE7+, Opera, Safari
    // and everything else that has come post 2010.
    if ("XMLHttpRequest" in window)
        return new XMLHttpRequest();
    // ToDo: Deprecate.
    // Other IE versions (with all their glories).
    // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is
    // redundant - but you never know with Microsoft.
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    }
    catch (e) { }
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    }
    catch (e) { }
    try {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch (e) { }
    // Just throw the computer outta the window!
    alert("Your browser belongs to history!");
    throw new TypeError("This browser does not support AJAX requests.");
};
/**
 * Handles AJAX POST requests.
 */
var Request = (function () {
    /**
     *
     * @param url
     * @param data
     */
    function Request(url, data) {
        this.xhr = AJAXRequest();
        this.url = url;
        this.data = data;
    }
    /**
     *
     * @param event
     */
    Request.prototype.progress = function (event) {
        if (event.lengthComputable)
            console.log((event.loaded / event.total) * 100 + '% uploaded');
    };
    /**
     *
     * @param response
     */
    Request.prototype.error = function (response) {
        console.error(response);
    };
    /**
     *
     * @param response
     */
    Request.prototype.success = function (response) {
        console.info(response);
    };
    /**
     *
     */
    Request.prototype.send = function () {
        var _this = this;
        var SUCCESS = this.success, ERROR = this.error, PROGRESS = this.progress;
        this.xhr.open('POST', this.url, true);
        this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        this.xhr.upload.onprogress = function (event) { return PROGRESS(event); };
        this.xhr.onerror = function (event) {
            ERROR(_this.xhr.responseText);
        };
        this.xhr.onload = function (event) {
            var data = null;
            if (_this.xhr.readyState == XMLHttpRequest.DONE) {
                if (!_this.xhr.responseType || _this.xhr.responseType === "text") {
                    data = _this.xhr.responseText;
                }
                else if (_this.xhr.responseType === "document") {
                    data = _this.xhr.responseXML;
                }
                else {
                    data = _this.xhr.response;
                }
            }
            SUCCESS(data);
        };
        this.xhr.send(this.data);
    };
    return Request;
}());
exports.Request = Request;
/**
 *
 * @param el
 * @param type
 */
function triggerEvent(el, type) {
    // modern browsers, IE9+
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
}
exports.triggerEvent = triggerEvent;
/**
 *
 * @param type
 * @param args
 */
function triggerCustomEvent(type, args) {
    if (args === void 0) { args = null; }
    // modern browsers, IE9+
    var event = new CustomEvent(type, { 'detail': args });
    document.dispatchEvent(event);
}
exports.triggerCustomEvent = triggerCustomEvent;
function addClass(element) {
    var className = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        className[_i - 1] = arguments[_i];
    }
    className.map(function (cname) {
        if (element.classList) {
            element.classList.add(cname);
        }
        else {
            var classes = element.className.split(' ');
            if (classes.indexOf(cname) < 0)
                classes.push(cname);
            element.className = classes.join(' ');
        }
    });
}
exports.addClass = addClass;
function removeClass(element) {
    var className = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        className[_i - 1] = arguments[_i];
    }
    className.map(function (cname) {
        if (element.classList) {
            element.classList.remove(cname);
        }
        else {
            var classes = element.className.split(' ');
            var idx = classes.indexOf(cname);
            if (idx > -1)
                classes.splice(idx, 1);
            element.className = classes.join(' ');
        }
    });
}
exports.removeClass = removeClass;

},{}]},{},[1]);

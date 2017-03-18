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
var UPLOAD_URL_ATTRIBUTE = "data-markdownx-upload-urls-path", PROCESSING_URL_ATTRIBUTE = "data-markdownx-urls-path";
// ---------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param {HTMLTextAreaElement} editor - Markdown editor element.
 * @param {HTMLElement} preview - Markdown preview element.
 */
// const MarkdownX = function (editor: HTMLTextAreaElement, preview: Element) {
//
//     this.editor            = editor;
//     this.preview           = preview;
//     this.editorIsResizable = this.editor.style.resize == 'none';
//     this.timeout           = null;
//
//     this.getEditorHeight = () => `${this.editor.scrollHeight}px`;
//
//     this.markdownify = (): void => {
//
//         clearTimeout(this.timeout);
//         this.timeout = setTimeout(this.getMarkdown, 500)
//
//     };
//
//     this.updateHeight = (): void => {
//
//         this.editorIsResizable ? this.editor.style.height = this.getEditorHeight() : null
//
//     };
//
//     this.inputChanged = (): void => {
//
//         this.updateHeight();
//         this.markdownify()
//
//     };
//
//     // ToDo: Deprecate.
//     this.onHtmlEvents = (event: Event): void => this.routineEventResponse(event);
//
//     this.routineEventResponse = (event: any): void => {
//
//         event.preventDefault();
//         event.stopPropagation()
//
//     };
//
//     this.onDragEnterEvent = (event: any): void => {
//
//         event.dataTransfer.dropEffect = 'copy';
//         this.routineEventResponse(event)
//
//     };
//
//     this.onDragLeaveEvent = (event: Event): void => this.routineEventResponse(event);
//
//     this.onDropEvent = (event: any): void => {
//
//         if (event.dataTransfer && event.dataTransfer.files.length)
//             Object.keys(event.dataTransfer.files).map(fileKey => this.sendFile(event.dataTransfer.files[fileKey]));
//
//         this.routineEventResponse(event);
//
//     };
//
//     this.onKeyDownEvent = (event: any): Boolean | null => {
//
//         const TAB_ASCII_CODE = 9;
//
//         if (event.keyCode !== TAB_ASCII_CODE) return null;
//
//         let start: number   = this.editor.selectionStart,
//               end: number   = this.editor.selectionEnd,
//               value: string = this.editor.value;
//
//         this.editor.value          = `${value.substring(0, start)}\t${value.substring(end)}`;
//         this.editor.selectionStart = this.editor.selectionEnd = start++;
//
//         this.markdownify();
//
//         this.editor.focus();
//
//         return false
//
//     };
//
//     this.sendFile = (file: File): void => {
//
//         this.editor.style.opacity = "0.3";
//
//         const xhr = new Request(
//               this.editor.getAttribute(UPLOAD_URL_ATTRIBUTE),  // URL
//               preparePostData({image: file})  // Data
//         );
//
//         xhr.success = (resp: string): void => {
//
//             const response = JSON.parse(resp);
//
//             if (response.image_code) {
//
//                 this.insertImage(response.image_code);
//                 triggerCustomEvent('markdownx.fileUploadEnd', [response])
//
//             } else if (response.image_path) {
//
//                 // ToDo: Deprecate.
//                 this.insertImage(`![]("${response.image_path}")`);
//                 triggerCustomEvent('markdownx.fileUploadEnd', [response])
//
//             } else {
//
//                 console.error('Wrong response', response);
//                 triggerCustomEvent('markdownx.fileUploadError', [response])
//
//             }
//
//             this.preview.innerHTML    = this.response;
//             this.editor.style.opacity = "1";
//
//         };
//
//         xhr.error = (response: string): void => {
//
//             this.editor.style.opacity = "1";
//             console.error(response);
//             triggerCustomEvent('fileUploadError', [response])
//
//         };
//
//         xhr.send()
//
//     };
//
//     this.getMarkdown = (): void => {
//
//         const xhr = new Request(
//               this.editor.getAttribute(PROCESSING_URL_ATTRIBUTE),  // URL
//               preparePostData({content: this.editor.value})  // Data
//         );
//
//         xhr.success = (response: string): void => {
//             this.preview.innerHTML = response;
//             this.updateHeight();
//             triggerCustomEvent('markdownx.update', [response])
//         };
//
//         xhr.error = (response: string): void => {
//             console.error(response);
//             triggerCustomEvent('markdownx.updateError', [response])
//         };
//
//         xhr.send()
//
//     };
//
//     this.insertImage = (textToInsert): void => {
//
//         let cursorPosition     = this.editor.selectionStart,
//               text             = this.editor.value,
//               textBeforeCursor = text.substring(0, cursorPosition),
//               textAfterCursor  = text.substring(cursorPosition, text.length);
//
//         this.editor.value          = `${textBeforeCursor}${textToInsert}${textAfterCursor}`;
//         this.editor.selectionStart = cursorPosition + textToInsert.length;
//         this.editor.selectionEnd   = cursorPosition + textToInsert.length;
//
//         triggerEvent(this.editor, 'keyup');
//         this.inputChanged();
//
//     };
//
//     // Events
//     // ----------------------------------------------------------------------------------------------
//     let documentListeners = {
//                 // ToDo: Deprecate.
//                 object: document,
//                 listeners: [
//                     { type: 'drop'     , capture: false, listener: this.onHtmlEvents },
//                     { type: 'dragover' , capture: false, listener: this.onHtmlEvents },
//                     { type: 'dragenter', capture: false, listener: this.onHtmlEvents },
//                     { type: 'dragleave', capture: false, listener: this.onHtmlEvents }
//                 ]
//         },
//         editorListeners = {
//             object: this.editor,
//             listeners: [
//                 { type: 'drop',             capture: false, listener: this.onDropEvent      },
//                 { type: 'input',            capture: true , listener: this.inputChanged     },
//                 { type: 'keydown',          capture: true , listener: this.onKeyDownEvent   },
//                 { type: 'dragover',         capture: false, listener: this.onDragEnterEvent },
//                 { type: 'dragenter',        capture: false, listener: this.onDragEnterEvent },
//                 { type: 'dragleave',        capture: false, listener: this.onDragLeaveEvent },
//                 { type: 'compositionstart', capture: true , listener: this.onKeyDownEvent   }
//             ]
//         };
//
//     // Initialise
//     // ----------------------------------------------------------------------------------------------
//
//     mountEvents(editorListeners);
//     mountEvents(documentListeners);  // ToDo: Deprecate.
//     triggerCustomEvent('markdownx.init');
//     this.editor.style.transition       = "opacity 1s ease";
//     this.editor.style.webkitTransition = "opacity 1s ease";
//     this.getMarkdown();
//     this.inputChanged()
//
// };
var MarkdownX = (function () {
    function MarkdownX(editor, preview) {
        this.UPLOAD_URL_ATTRIBUTE = "data-markdownx-upload-urls-path";
        this.PROCESSING_URL_ATTRIBUTE = "data-markdownx-urls-path";
        this.editor = editor;
        this.preview = preview;
        this.editorIsResizable = this.editor.style.resize == 'none';
        this.timeout = null;
        // Events
        // ----------------------------------------------------------------------------------------------
        var documentListeners = {
            // ToDo: Deprecate.
            object: document,
            listeners: [
                { type: 'drop', capture: false, listener: this.onHtmlEvents },
                { type: 'dragover', capture: false, listener: this.onHtmlEvents },
                { type: 'dragenter', capture: false, listener: this.onHtmlEvents },
                { type: 'dragleave', capture: false, listener: this.onHtmlEvents }
            ]
        }, editorListeners = {
            object: this.editor,
            listeners: [
                { type: 'drop', capture: false, listener: this.onDrop },
                { type: 'input', capture: true, listener: this.inputChanged },
                { type: 'keydown', capture: true, listener: this.onKeyDown },
                { type: 'dragover', capture: false, listener: this.onDragEnter },
                { type: 'dragenter', capture: false, listener: this.onDragEnter },
                { type: 'dragleave', capture: false, listener: this.onDragLeave },
                { type: 'compositionstart', capture: true, listener: this.onKeyDown }
            ]
        };
        // Initialise
        // ----------------------------------------------------------------------------------------------
        utils_1.mountEvents(editorListeners);
        utils_1.mountEvents(documentListeners); // ToDo: Deprecate.
        utils_1.triggerCustomEvent('markdownx.init');
        this.editor.style.transition = "opacity 1s ease";
        this.editor.style.webkitTransition = "opacity 1s ease";
        this.getMarkdown();
        this.inputChanged();
    }
    MarkdownX.prototype.getEditorHeight = function () { return this.editor.scrollHeight + "px"; };
    MarkdownX.prototype._markdownify = function () {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.getMarkdown, 500);
    };
    MarkdownX.prototype.updateHeight = function () {
        this.editorIsResizable ? this.editor.style.height = this.getEditorHeight() : null;
    };
    MarkdownX.prototype.inputChanged = function () {
        this.updateHeight();
        this._markdownify();
    };
    // ToDo: Deprecate.
    MarkdownX.prototype.onHtmlEvents = function (event) { this._routineEventResponse(event); };
    MarkdownX.prototype._routineEventResponse = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    MarkdownX.prototype.onDragEnter = function (event) {
        event.dataTransfer.dropEffect = 'copy';
        this._routineEventResponse(event);
    };
    MarkdownX.prototype.onDragLeave = function (event) {
        this._routineEventResponse(event);
    };
    MarkdownX.prototype.onDrop = function (event) {
        var _this = this;
        if (event.dataTransfer && event.dataTransfer.files.length)
            Object.keys(event.dataTransfer.files).map(function (fileKey) { return _this.sendFile(event.dataTransfer.files[fileKey]); });
        this._routineEventResponse(event);
    };
    MarkdownX.prototype.onKeyDown = function (event) {
        var TAB_ASCII_CODE = 9;
        if (event.keyCode !== TAB_ASCII_CODE)
            return null;
        var start = this.editor.selectionStart, end = this.editor.selectionEnd, value = this.editor.value;
        this.editor.value = value.substring(0, start) + "\t" + value.substring(end);
        this.editor.selectionStart = this.editor.selectionEnd = start++;
        this._markdownify();
        this.editor.focus();
        return false;
    };
    MarkdownX.prototype.sendFile = function (file) {
        var preview = this.preview, editor = this.editor, url = this.UPLOAD_URL_ATTRIBUTE, xhr = new utils_1.Request(editor.getAttribute(url), // URL
        utils_1.preparePostData({ image: file }) // Data
        );
        editor.style.opacity = "0.3";
        xhr.success = function (resp) {
            var response = JSON.parse(resp);
            if (response.image_code) {
                this.insertImage(response.image_code);
                utils_1.triggerCustomEvent('markdownx.fileUploadEnd', [response]);
            }
            else if (response.image_path) {
                // ToDo: Deprecate.
                this.insertImage("![](\"" + response.image_path + "\")");
                utils_1.triggerCustomEvent('markdownx.fileUploadEnd', [response]);
            }
            else {
                console.error('Wrong response', response);
                utils_1.triggerCustomEvent('markdownx.fileUploadError', [response]);
            }
            preview.innerHTML = this.response;
            editor.style.opacity = "1";
        };
        xhr.error = function (response) {
            editor.style.opacity = "1";
            console.error(response);
            utils_1.triggerCustomEvent('fileUploadError', [response]);
        };
        xhr.send();
    };
    MarkdownX.prototype.getMarkdown = function () {
        var preview = this.preview, editor = this.editor, url = this.PROCESSING_URL_ATTRIBUTE, xhr = new utils_1.Request(editor.getAttribute(url), // URL
        utils_1.preparePostData({ content: this.editor.value }) // Data
        );
        xhr.success = function (response) {
            preview.innerHTML = response;
            this.updateHeight();
            utils_1.triggerCustomEvent('markdownx.update', [response]);
        };
        xhr.error = function (response) {
            console.error(response);
            utils_1.triggerCustomEvent('markdownx.updateError', [response]);
        };
        xhr.send();
    };
    MarkdownX.prototype.insertImage = function (textToInsert) {
        var cursorPosition = this.editor.selectionStart, text = this.editor.value, textBeforeCursor = text.substring(0, cursorPosition), textAfterCursor = text.substring(cursorPosition, text.length);
        this.editor.value = "" + textBeforeCursor + textToInsert + textAfterCursor;
        this.editor.selectionStart = cursorPosition + textToInsert.length;
        this.editor.selectionEnd = cursorPosition + textToInsert.length;
        utils_1.triggerEvent(this.editor, 'keyup');
        this.inputChanged();
    };
    return MarkdownX;
}());
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

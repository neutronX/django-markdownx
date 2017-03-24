/**
 * **Markdownx**
 *
 * Frontend (JavaScript) management of Django-MarkdownX package.
 *
 * Written in JavaScript ECMA 2016, trans-compiled to ECMA 5 (2011).
 *
 * Requirements:
 * - Modern browser with support for HTML5 and ECMA 2011+ (IE 10+). Older browsers would work but some
 *   features may be missing
 * - TypeScript 2 +
 *
 * JavaScript ECMA 5 files formatted as `.js` are trans-compiled files. Please do not edit such files as all
 * changes will be lost. Please modify `.ts` stored in `django-markdownx/markdownx/.static/markdownx/js` directory.
 * See **Contributions** in the documentations for additional instructions.
 */

// Import, definitions and constant ------------------------------------------------------------------------------------

"use strict";

declare function docReady(args: any): any;

import {
    Request,
    mountEvents,
    triggerEvent,
    preparePostData,
    triggerCustomEvent
} from "./utils";

const UPLOAD_URL_ATTRIBUTE:     string = "data-markdownx-upload-urls-path",
      PROCESSING_URL_ATTRIBUTE: string = "data-markdownx-urls-path",
      RESIZABILITY_ATTRIBUTE:   string = "data-markdownx-editor-resizable",
      LATENCY_ATTRIBUTE:        string = "data-markdownx-latency",
      LATENCY_MINIMUM:          number = 500,  // microseconds.
      XHR_RESPONSE_ERROR:       string = "Invalid response",
      UPLOAD_START_OPACITY:     string = "0.3",
      NORMAL_OPACITY:           string = "1";

// ---------------------------------------------------------------------------------------------------------------------


const EventHandlers = {

    /**
     * Routine tasks for event handlers (e.g. default preventions).
     *
     * @param {Event} event
     * @returns {Event}
     */
    inhibitDefault: function (event: Event | KeyboardEvent): any {

        event.preventDefault();
        event.stopPropagation();

        return event

    },

    /**
     *
     * @param event
     * returns {Event}
     */
    onDragEnter: function (event: DragEvent ): Event {

        event.dataTransfer.dropEffect = 'copy';

        return this.inhibitDefault(event)

    }

};


const keyboardEvents = {

    /**
     *
     */
    keys: {

        TAB: "Tab",
        DUPLICATE: "d",
        UNINDENT: "[",
        INDENT: "]"

    },

    /**
     *
     */
    handlers: {

        /**
         *
         * @param {number} start
         * @param {number} end
         * @param {string} value
         * @returns {string}
         * @private
         */
        applyTab: function (start: number, end: number, value: string): string {

            return value.substring(0, start) + (
                        value.substring(start, end).match(/\n/g) === null ?
                              `\t${value.substring(start)}` :
                              value.substring(start, end).replace(/^/gm, '\t') + value.substring(end)
                  )

        },


        /**
         *
         * @param start
         * @param end
         * @param value
         * @returns {string}
         * @private
         */
        _multiLineIndentation: function (start: number, end: number, value: string): string {

            const endLine: string = new RegExp(`(?:\n|.){0,${end}}(^.*$)`, "m").exec(value)[1];

            return value.substring(
                  value.indexOf(
                        new RegExp(`(?:\n|.){0,${start}}(^.*$)`, "m").exec(value)[1]  // Start line.
                  ),
                  (value.indexOf(endLine) ? value.indexOf(endLine) + endLine.length : end)
            );

        },

        /**
         *
         * @param start
         * @param end
         * @param value
         * @returns {string}
         * @private
         */
        applyIndentation: function (start: number, end: number, value: string): string {

            if (start === end) {
                const line: string = new RegExp(`(?:\n|.){0,${start}}(^.+$)`, "m").exec(value)[1];
                return value.replace(line, `\t${line}`)
            }

            const content: string = this._multiLineIndentation(start, end, value);

            return value.replace(content, content.replace(/(^.+$)\n*/gmi, "\t$&"))

        },

        /**
         *
         * @param start
         * @param end
         * @param value
         * @returns {string}
         * @private
         */
        removeIndentation: function (start: number, end: number, value: string): string {

            if (start === end) {
                const line: string = new RegExp(`(?:\n|.){0,${start}}(^\t.+$)`, "m").exec(value)[1];
                return value.replace(line, line.substring(1))
            }

            const content: string = this._multiLineIndentation(start, end, value);

            return value.replace(content, content.replace(/^\t(.+)\n*$/gmi, "$1"))

        },

        /**
         *
         * @param {number} start
         * @param {number} end
         * @param {string} value
         * @returns {string}
         * @private
         */
        removeTab: function (start: number, end: number, value: string): string {

            let endString: string    = null,
                lineNumbers: number  = (value.substring(start, end).match(/\n/g) || []).length;

            if (start === end) {

                // Replacing `\t` at a specific location (+/- 1 chars) where there is no selection.
                start = start > 0 && value[start - 1].match(/\t/) !== null ? start - 1 : start;
                endString = value.substring(start).replace(/\t/, '');

            } else if (!lineNumbers) {

                // Replacing `\t` within a single line selection.
                endString = value.substring(start).replace(/\t/, '')


            } else {

                // Replacing `\t` in the beginning of each line in a multi-line selection.
                endString = value.substring(start, end).replace(/^\t/gm, '') + value.substring(end, value.length);

            }

            return value.substring(0, start) + endString;

        },

        /**
         *
         * @param {number} start
         * @param {number} end
         * @param {string} value
         * @returns {string}
         * @private
         */
        applyDuplication: function (start: number, end: number, value: string): string {

            // Selected.
            if (start !== end) return (
                value.substring(0, start) +
                value.substring(start, end) +
                (~value.charAt(start - 1).indexOf('\n') || ~value.charAt(start).indexOf('\n') ? '\n' : '') +
                value.substring(start, end) +
                value.substring(end)
            );

            // Not selected.
            let pattern: RegExp = new RegExp(`(?:.|\n){0,${end}}\n([^].+)(?:.|\n)*`, 'm'),
                line: string    = '';

            value.replace(pattern, (match, p1) => line += p1);

            return value.replace(line, `${line}\n${line}`)

        },

    },

    /**
     *
     * @param {KeyboardEvent} event
     * @returns {Function | Boolean}
     */
    hub: function (event: KeyboardEvent): Function | false {

        switch (event.key) {
            case this.keys.TAB:  // Tab.
                // Shift pressed: un-indent, otherwise indent.
                return event.shiftKey ? this.handlers.removeTab : this.handlers.applyTab;

            case this.keys.DUPLICATE:  // Line duplication.
                // Is CTRL or CMD (on Mac) pressed?
                return (event.ctrlKey || event.metaKey) ? this.handlers.applyDuplication : false;

            case this.keys.INDENT:  // Indentation.
                // Is CTRL or CMD (on Mac) pressed?
                return (event.ctrlKey || event.metaKey) ? this.handlers.applyIndentation : false;

            case this.keys.UNINDENT:  // Unindentation.
                // Is CTRL or CMD (on Mac) pressed?
                return (event.ctrlKey || event.metaKey) ? this.handlers.removeIndentation : false;

            default:
                return false
        }

    }

};


/**
 *
 * @param {HTMLElement} element
 * @returns {number}
 */
function getHeight (element: HTMLElement): number {

    return Math.max(  // Maximum of computed or set heights.
          parseInt(window.getComputedStyle(element).height), // Height is not set in styles.
          (parseInt(element.style.height) || 0)  // Property's own height if set, otherwise 0.
    )

}


/**
 *
 * @param {HTMLTextAreaElement} editor
 * @returns {HTMLTextAreaElement}
 */
function updateHeight(editor: HTMLTextAreaElement): HTMLTextAreaElement {

    // Ensure that the editor is resizable before anything else.
    // Change size if scroll is larger that height, otherwise do nothing.

    if (editor.scrollTop)
        editor.style.height = `${editor.scrollTop + getHeight(editor)}px`;

    return editor

}


/**
 * @example
 *
 *     let editor  = document.getElementById('MyMarkdownEditor'),
 *         preview = document.getElementById('MyMarkdownPreview');
 *
 *     let mdx = new MarkdownX(editor, preview)
 *
 * @param {HTMLElement} parent - Markdown editor element.
 * @param {HTMLTextAreaElement} editor - Markdown editor element.
 * @param {HTMLElement} preview - Markdown preview element.
 */
const MarkdownX = function (parent: HTMLElement, editor: HTMLTextAreaElement, preview: HTMLElement): void {

    const properties = {

        editor:             editor,
        preview:            preview,
        parent:             parent,
        _latency:           null,
        _editorIsResizable: null

    };

    const _initialize = () => {

        this.timeout = null;

        // Events
        // ----------------------------------------------------------------------------------------------
        let documentListeners = {
                object: document,
                listeners: [
                    { type: "drop"     , capture: false, listener: EventHandlers.inhibitDefault },
                    { type: "dragover" , capture: false, listener: EventHandlers.inhibitDefault },
                    { type: "dragenter", capture: false, listener: EventHandlers.inhibitDefault },
                    { type: "dragleave", capture: false, listener: EventHandlers.inhibitDefault }
                ]
            },
            editorListeners = {
                object: properties.editor,
                listeners: [
                    { type: "drop",             capture: false, listener: onDrop                       },
                    { type: "input",            capture: true , listener: inputChanged                 },
                    { type: "keydown",          capture: true , listener: onKeyDown                    },
                    { type: "dragover",         capture: false, listener: EventHandlers.onDragEnter    },
                    { type: "dragenter",        capture: false, listener: EventHandlers.onDragEnter    },
                    { type: "dragleave",        capture: false, listener: EventHandlers.inhibitDefault },
                    { type: "compositionstart", capture: true , listener: onKeyDown                    }
                ]
            };

        // If not `max-height` is defined, it will default to 75% of the total height.
        if (!editor.style.maxHeight)
            editor.style.maxHeight = `${window.innerHeight * 75 / 100}px`;

        // Initialise
        // --------------------------------------------------------

        // Mounting the defined events.
        mountEvents(editorListeners, documentListeners);

        // Set animation for image uploads lock down.
        properties.editor.style.transition       = "opacity 1s ease";
        properties.editor.style.webkitTransition = "opacity 1s ease";

        // Upload latency - must be a value >= 500 microseconds.
        properties._latency =
              Math.max(parseInt(properties.editor.getAttribute(LATENCY_ATTRIBUTE)) || 0, LATENCY_MINIMUM);

        // If `true`, the editor will expand to scrollHeight when needed.
        properties._editorIsResizable =
              (properties.editor.getAttribute(RESIZABILITY_ATTRIBUTE).match(/True/i) || []).length > 0;

        getMarkdown();

        triggerCustomEvent("markdownx.init");

    };

    /**
     * settings for ``timeout``.
     *
     * @private
     */
    const _markdownify = (): void => {

        clearTimeout(this.timeout);
        this.timeout = setTimeout(getMarkdown, properties._latency)

    };

    /**
     *
     */
    const inputChanged = (): void => {

        properties.editor = properties._editorIsResizable ?
              updateHeight(properties.editor) : properties.editor;

        return _markdownify()

    };

    /**
     *
     * @param {DragEvent} event
     */
    const onDrop = (event: DragEvent): void => {

        if (event.dataTransfer && event.dataTransfer.files.length)
            Object.keys(event.dataTransfer.files).map(fileKey =>

                  sendFile(event.dataTransfer.files[fileKey])

            );

        EventHandlers.inhibitDefault(event);

    };

    /**
     *
     * @param {KeyboardEvent} event
     * @returns {Boolean | null}
     */
    const onKeyDown = (event: KeyboardEvent): Boolean | null => {

        const handlerFunc: Function | Boolean = keyboardEvents.hub(event);

        if (typeof handlerFunc != 'function') return false;

        EventHandlers.inhibitDefault(event);

        // Holding the start location before anything changes.
        const SELECTION_START: number = properties.editor.selectionStart;

        properties.editor.value = handlerFunc(
              properties.editor.selectionStart,
              properties.editor.selectionEnd,
              properties.editor.value
        );

        _markdownify();

        properties.editor.focus();

        // Set the cursor location to the start location of the selection.
        properties.editor.selectionEnd = properties.editor.selectionStart = SELECTION_START;

        return false

    };

    /**
     *
     * @param file
     */
    const sendFile = (file: File) => {

        properties.editor.style.opacity = UPLOAD_START_OPACITY;

        const xhr = new Request(
              properties.editor.getAttribute(UPLOAD_URL_ATTRIBUTE),  // URL
              preparePostData({image: file})  // Data
        );

        xhr.success = (resp: string): void => {

            const response = JSON.parse(resp);

            if (response.image_code) {

                insertImage(response.image_code);
                triggerCustomEvent('markdownx.fileUploadEnd', properties.parent, [response])

            } else if (response.image_path) {

                // ToDo: Deprecate.
                insertImage(`![]("${response.image_path}")`);
                triggerCustomEvent('markdownx.fileUploadEnd', properties.parent, [response])

            } else {

                console.error(XHR_RESPONSE_ERROR, response);
                triggerCustomEvent('markdownx.fileUploadError', properties.parent, [response])

            }

            properties.preview.innerHTML    = this.response;
            properties.editor.style.opacity = NORMAL_OPACITY;

        };

        xhr.error = (response: string): void => {

            properties.editor.style.opacity = NORMAL_OPACITY;
            console.error(response);
            triggerCustomEvent('fileUploadError', properties.parent, [response])

        };

        return xhr.send()

    };

    /**
     *
     */
    const getMarkdown = () => {

        const xhr = new Request(
              properties.editor.getAttribute(PROCESSING_URL_ATTRIBUTE),  // URL
              preparePostData({content: properties.editor.value})  // Data
        );

        xhr.success = (response: string): void => {

            properties.preview.innerHTML = response;
            properties.editor = updateHeight(properties.editor);

            triggerCustomEvent('markdownx.update', properties.parent, [response])

        };

        xhr.error = (response: string): void => {

            console.error(response);

            triggerCustomEvent('markdownx.updateError', properties.parent, [response])

        };

        return xhr.send()

    };

    /**
     *
     * @param textToInsert
     */
    const insertImage = (textToInsert): void => {

        let cursorPosition     = properties.editor.selectionStart,
              text             = properties.editor.value,
              textBeforeCursor = text.substring(0, cursorPosition),
              textAfterCursor  = text.substring(cursorPosition, text.length);

        properties.editor.value          = `${textBeforeCursor}${textToInsert}${textAfterCursor}`;
        properties.editor.selectionStart = cursorPosition + textToInsert.length;
        properties.editor.selectionEnd   = cursorPosition + textToInsert.length;

        triggerEvent(properties.editor, 'keyup');
        inputChanged();

    };


    _initialize();

};


(function(funcName: any, baseObj: any) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function
    // name and those will be used.
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj  = baseObj  || window;

    let readyList                     = [],
          readyFired                  = false,
          readyEventHandlersInstalled = false;

    /**
     * Called when the document is ready. This function protects itself
     * against being called more than once.
     */
    const ready = () => {
        if (!readyFired) {
            // Must be `true` before the callbacks are called.
            readyFired = true;

            // if a callback here happens to add new ready handlers,
            // the docReady() function will see that it already fired
            // and will schedule the callback to run right after
            // this event loop finishes so all handlers will still execute
            // in order and no new ones will be added to the readyList
            // while we are processing the list
            readyList.map(ready => ready.fn.call(window, ready.ctx));

            // allow any closures held by these functions to free
            readyList = [];
        }
    };

    const readyStateChange = () => document.readyState === "complete" ? ready() : null;

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = (callback, context) => {

        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {

            setTimeout(() => callback(context), 1);
            return;

        } else {

            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});

        }

        // If the document is already ready, schedule the ready
        // function to run.
        if (document.readyState === "complete") {

            setTimeout(ready, 1);

        } else if (!readyEventHandlersInstalled) {

            // otherwise if we don't have event handlers installed,
            // install them first choice is DOMContentLoaded event.
            document.addEventListener("DOMContentLoaded", ready, false);

            // backup is window load event
            window.addEventListener("load", ready, false);

            readyEventHandlersInstalled = true;

        }
    }

})("docReady", window);


docReady(() => {

    const ELEMENTS = document.getElementsByClassName('markdownx');

    return Object.keys(ELEMENTS).map(key => new MarkdownX(
          ELEMENTS[key],
          ELEMENTS[key].querySelector('.markdownx-editor'),
          ELEMENTS[key].querySelector('.markdownx-preview')
    ));

});


export {

    MarkdownX

};

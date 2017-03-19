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

declare function docReady(args: any): any;

import {
    zip,
    Request,
    mountEvents,
    triggerEvent,
    preparePostData,
    triggerCustomEvent
} from "./utils";

const UPLOAD_URL_ATTRIBUTE:     string = "data-markdownx-upload-urls-path",
      PROCESSING_URL_ATTRIBUTE: string = "data-markdownx-urls-path",
      RESIZABILITY_ATTRIBUTE:   string = "data-markdownx-editor-resizable",
      LATENCY_ATTRIBUTE:        string = "data-markdownx-latency";

// ---------------------------------------------------------------------------------------------------------------------


/**
 *
 * @param {number} start
 * @param {number} end
 * @param {string} value
 * @returns {string}
 */
function applyIndentation(start: number, end: number, value: string): string {

    return value.substring(0, start) + (
          value.substring(start, end).match(/\n/g) === null ?
                `\t${value.substring(start)}` :
                value.substring(start, end).replace(/^/gm, '\t') + value.substring(end)
          )

}


/**
 *
 * @param {number} start
 * @param {number} end
 * @param {string} value
 * @returns {string}
 */
function removeIndentation(start: number, end: number, value: string): string {

    let endString: string = null,
          lineNumbers: number     = (value.substring(start, end).match(/\n/g) || []).length;

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

}


/**
 *
 * @param start
 * @param end
 * @param value
 * @returns {string}
 */
function applyDuplication(start, end, value): string {

    const pattern = new RegExp(`(?:.|\n){0,${end}}\n([^].+)(?:.|\n)*`, 'm');

    switch (start) {
        case end:  // not selected.
            let line: string = '';
            value.replace(pattern, (match, p1) => line += p1);
            return value.replace(line, `${line}\n${line}`);

        default:  // selected.
            return (
                value.substring(0, start) +
                value.substring(start, end) +
                (~value.charAt(start - 1).indexOf('\n') || ~value.charAt(start).indexOf('\n') ? '\n' : '') +
                value.substring(start, end) +
                value.substring(end)
            )
    }

}

function getHeight (element: HTMLElement): number {

    return Math.max(  // Maximum of computed or set heights.
          parseInt(window.getComputedStyle(element).height), // Height is not set in styles.
          (parseInt(element.style.height) || 0)  // Property's own height if set, otherwise 0.
    )

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
const MarkdownX = function (editor: HTMLTextAreaElement, preview: Element): void {

    const properties = {

        editor: editor,
        preview: preview,
        _editorIsResizable: null,
        _latency: null

    };

    const _initialize = () => {

        this.timeout = null;

        // Events
        // ----------------------------------------------------------------------------------------------
        let documentListeners = {
                    // ToDo: Deprecate.
                    object: document,
                    listeners: [
                        { type: "drop"     , capture: false, listener: onHtmlEvents },
                        { type: "dragover" , capture: false, listener: onHtmlEvents },
                        { type: "dragenter", capture: false, listener: onHtmlEvents },
                        { type: "dragleave", capture: false, listener: onHtmlEvents }
                    ]
            },
            editorListeners = {
                object: properties.editor,
                listeners: [
                    { type: "drop",             capture: false, listener: onDrop       },
                    { type: "input",            capture: true , listener: inputChanged },
                    { type: "keydown",          capture: true , listener: onKeyDown    },
                    { type: "dragover",         capture: false, listener: onDragEnter  },
                    { type: "dragenter",        capture: false, listener: onDragEnter  },
                    { type: "dragleave",        capture: false, listener: onDragLeave  },
                    { type: "compositionstart", capture: true , listener: onKeyDown    }
                ]
            };

        // Initialise
        // --------------------------------------------------------
        mountEvents(editorListeners);
        mountEvents(documentListeners);  // ToDo: Deprecate.

        properties.editor.style.transition       = "opacity 1s ease";
        properties.editor.style.webkitTransition = "opacity 1s ease";

        // Latency must be a value >= 500 microseconds.
        properties._latency = Math.max(parseInt(properties.editor.getAttribute(LATENCY_ATTRIBUTE)) || 0, 500);

        properties._editorIsResizable =
              (properties.editor.getAttribute(RESIZABILITY_ATTRIBUTE).match(/True/) || []).length > 0;

        getMarkdown();
        inputChanged();

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
     * Routine tasks for event handlers (e.g. default preventions).
     *
     * @param {Event} event
     * @private
     */
    const _inhibitDefault = (event: any): void => {

        event.preventDefault();
        event.stopPropagation()

    };

    const updateHeight = (): void => {
        // Ensure that the editor is resizable before anything else.
        // Change size if scroll is larger that height, otherwise do nothing.
        if (properties._editorIsResizable && getHeight(properties.editor) < properties.editor.scrollHeight)
            properties.editor.style.height = `${properties.editor.scrollHeight}px`;

    };

    const inputChanged = (): void => {

        updateHeight();
        _markdownify()

    };

    // ToDo: Deprecate.
    const onHtmlEvents = (event: Event): void => _inhibitDefault(event);

    const onDragEnter = (event: any): void => {

        event.dataTransfer.dropEffect = 'copy';
        _inhibitDefault(event)

    };

    const onDragLeave = (event: Event): void => _inhibitDefault(event);

    const onDrop = (event: any): void => {

        if (event.dataTransfer && event.dataTransfer.files.length)
            Object.keys(event.dataTransfer.files).map(fileKey => sendFile(event.dataTransfer.files[fileKey]));

        _inhibitDefault(event);

    };

    /**
     *
     * @param event
     * @returns {KeyboardEvent}
     */
    const onKeyDown = (event: KeyboardEvent): Boolean | null => {

        // `Tab` for indentation, `d` for duplication.
        if (event.key !== 'Tab' && event.key !== 'd') return null;

        _inhibitDefault(event);


        let handlerFunc = null;

        switch (event.key) {
            case "Tab":  // For indentation.
                // Shift pressed: un-indent, otherwise indent.
                handlerFunc = event.shiftKey ? removeIndentation : applyIndentation;
                break;

            case "d":  // For duplication.
                if (event.ctrlKey || event.metaKey)  // Is CTRL or CMD (on Mac) pressed?
                    handlerFunc = applyDuplication;
                else
                    return false;

                break;

            default:
                return false
        }

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

        properties.editor.style.opacity = "0.3";

        const xhr = new Request(
              properties.editor.getAttribute(UPLOAD_URL_ATTRIBUTE),  // URL
              preparePostData({image: file})  // Data
        );

        xhr.success = (resp: string): void => {

            const response = JSON.parse(resp);

            if (response.image_code) {

                insertImage(response.image_code);
                triggerCustomEvent('markdownx.fileUploadEnd', [response])

            } else if (response.image_path) {

                // ToDo: Deprecate.
                insertImage(`![]("${response.image_path}")`);
                triggerCustomEvent('markdownx.fileUploadEnd', [response])

            } else {

                console.error('Wrong response', response);
                triggerCustomEvent('markdownx.fileUploadError', [response])

            }

            properties.preview.innerHTML    = this.response;
            properties.editor.style.opacity = "1";

        };

        xhr.error = (response: string): void => {

            properties.editor.style.opacity = "1";
            console.error(response);
            triggerCustomEvent('fileUploadError', [response])

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
            updateHeight();
            triggerCustomEvent('markdownx.update', [response])
        };

        xhr.error = (response: string): void => {
            console.error(response);
            triggerCustomEvent('markdownx.updateError', [response])
        };

        return xhr.send()

    };

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

    const EDITORS               = document.querySelectorAll('.markdownx > .markdownx-editor'),
          PREVIEWS              = document.querySelectorAll('.markdownx > .markdownx-preview'),
          EDITOR_INDEX:  number = 0,
          PREVIEW_INDEX: number = 1;

    return zip(EDITORS, PREVIEWS).map(item => new MarkdownX(item[EDITOR_INDEX], item[PREVIEW_INDEX]));

});

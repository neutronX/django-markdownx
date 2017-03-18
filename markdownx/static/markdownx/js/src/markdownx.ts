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
      PROCESSING_URL_ATTRIBUTE: string = "data-markdownx-urls-path";

// ---------------------------------------------------------------------------------------------------------------------


/**
 *
 * @param {number} start
 * @param {number} end
 * @param {string} value
 * @returns {string}
 */
function tabKeyEvent(start: number, end: number, value: string): string {

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
function shiftTabKeyEvent(start: number, end: number, value: string): string {

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
const MarkdownX = function (editor: HTMLTextAreaElement, preview: Element) {

    this.editor             = editor;
    this.preview            = preview;
    this._editorIsResizable = this.editor.style.resize == 'none';
    this.timeout            = null;

    this.getEditorHeight = (editor: HTMLTextAreaElement) => `${editor.scrollHeight}px`;

    /**
     * settings for ``timeout``.
     *
     * @private
     */
    this._markdownify = (): void => {

        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.getMarkdown, 500)

    };

    this.updateHeight = (): void => {

        this._editorIsResizable ? this.editor.style.height = this.getEditorHeight(this.editor) : null

    };

    this.inputChanged = (): void => {

        this.updateHeight();
        this._markdownify()

    };

    // ToDo: Deprecate.
    this.onHtmlEvents = (event: Event): void => this._routineEventResponse(event);

    /**
     * Routine tasks for event handlers (e.g. default preventions).
     *
     * @param {Event} event
     * @private
     */
    this._routineEventResponse = (event: any): void => {

        event.preventDefault();
        event.stopPropagation()

    };

    this.onDragEnter = (event: any): void => {

        event.dataTransfer.dropEffect = 'copy';
        this._routineEventResponse(event)

    };

    this.onDragLeave = (event: Event): void => this._routineEventResponse(event);

    this.onDrop = (event: any): void => {

        if (event.dataTransfer && event.dataTransfer.files.length)
            Object.keys(event.dataTransfer.files).map(fileKey => this.sendFile(event.dataTransfer.files[fileKey]));

        this._routineEventResponse(event);

    };

    this.onKeyDown = (event: any): Boolean | null => {

        // ASCII code references:
        const TAB_KEY: number         = 9,
              SELECTION_START: number = this.editor.selectionStart;

        if (event.keyCode !== TAB_KEY) return null;

        event.preventDefault();

        let handlerFunc = event.shiftKey && event.keyCode === TAB_KEY ? shiftTabKeyEvent : tabKeyEvent;

        this.editor.value = handlerFunc(
              this.editor.selectionStart,
              this.editor.selectionEnd,
              this.editor.value
        );

        this._markdownify();

        this.editor.focus();

        this.editor.selectionEnd = this.editor.selectionStart = SELECTION_START;

        return false

    };

    /**
     *
     * @param file
     * @returns {Request}
     */
    this.sendFile = (file: File): Request => {

        this.editor.style.opacity = "0.3";

        const xhr = new Request(
              this.editor.getAttribute(UPLOAD_URL_ATTRIBUTE),  // URL
              preparePostData({image: file})  // Data
        );

        xhr.success = (resp: string): void => {

            const response = JSON.parse(resp);

            if (response.image_code) {

                this.insertImage(response.image_code);
                triggerCustomEvent('markdownx.fileUploadEnd', [response])

            } else if (response.image_path) {

                // ToDo: Deprecate.
                this.insertImage(`![]("${response.image_path}")`);
                triggerCustomEvent('markdownx.fileUploadEnd', [response])

            } else {

                console.error('Wrong response', response);
                triggerCustomEvent('markdownx.fileUploadError', [response])

            }

            this.preview.innerHTML    = this.response;
            this.editor.style.opacity = "1";

        };

        xhr.error = (response: string): void => {

            this.editor.style.opacity = "1";
            console.error(response);
            triggerCustomEvent('fileUploadError', [response])

        };

        return xhr.send()

    };

    /**
     *
     * @returns {Request}
     */
    this.getMarkdown = (): Request => {

        const xhr = new Request(
              this.editor.getAttribute(PROCESSING_URL_ATTRIBUTE),  // URL
              preparePostData({content: this.editor.value})  // Data
        );

        xhr.success = (response: string): void => {
            this.preview.innerHTML = response;
            this.updateHeight();
            triggerCustomEvent('markdownx.update', [response])
        };

        xhr.error = (response: string): void => {
            console.error(response);
            triggerCustomEvent('markdownx.updateError', [response])
        };

        return xhr.send()

    };

    this.insertImage = (textToInsert): void => {

        let cursorPosition     = this.editor.selectionStart,
              text             = this.editor.value,
              textBeforeCursor = text.substring(0, cursorPosition),
              textAfterCursor  = text.substring(cursorPosition, text.length);

        this.editor.value          = `${textBeforeCursor}${textToInsert}${textAfterCursor}`;
        this.editor.selectionStart = cursorPosition + textToInsert.length;
        this.editor.selectionEnd   = cursorPosition + textToInsert.length;

        triggerEvent(this.editor, 'keyup');
        this.inputChanged();

    };

    // Events
    // ----------------------------------------------------------------------------------------------
    let documentListeners = {
                // ToDo: Deprecate.
                object: document,
                listeners: [
                    { type: 'drop'     , capture: false, listener: this.onHtmlEvents },
                    { type: 'dragover' , capture: false, listener: this.onHtmlEvents },
                    { type: 'dragenter', capture: false, listener: this.onHtmlEvents },
                    { type: 'dragleave', capture: false, listener: this.onHtmlEvents }
                ]
        },
        editorListeners = {
            object: this.editor,
            listeners: [
                { type: 'drop',             capture: false, listener: this.onDrop       },
                { type: 'input',            capture: true , listener: this.inputChanged },
                { type: 'keydown',          capture: true , listener: this.onKeyDown    },
                { type: 'dragover',         capture: false, listener: this.onDragEnter  },
                { type: 'dragenter',        capture: false, listener: this.onDragEnter  },
                { type: 'dragleave',        capture: false, listener: this.onDragLeave  },
                { type: 'compositionstart', capture: true , listener: this.onKeyDown    }
            ]
        };

    // Initialise
    // ----------------------------------------------------------------------------------------------

    mountEvents(editorListeners);
    mountEvents(documentListeners);  // ToDo: Deprecate.
    triggerCustomEvent('markdownx.init');
    this.editor.style.transition       = "opacity 1s ease";
    this.editor.style.webkitTransition = "opacity 1s ease";
    this.getMarkdown();
    this.inputChanged()

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

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

import {zip, preparePostData, triggerEvent, triggerCustomEvent, mountEvents, Request} from "./utils";

const UPLOAD_URL_ATTRIBUTE:     string = "data-markdownx-upload-urls-path",
      PROCESSING_URL_ATTRIBUTE: string = "data-markdownx-urls-path";

// ---------------------------------------------------------------------------------------------------------------------

/**
 *
 * @param editor
 * @param preview
 */
const MarkdownX = function (editor: HTMLTextAreaElement, preview: Element) {

    this.editor            = editor;
    this.preview           = preview;
    this.editorIsResizable = this.editor.style.resize == 'none';
    this.timeout           = null;

    this.getEditorHeight = () => `${this.editor.scrollHeight}px`;

    this.markdownify = (): void => {

        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.getMarkdown, 500)

    };

    this.updateHeight = (): void => {

        this.editorIsResizable ? this.editor.style.height = this.getEditorHeight() : null

    };

    this.onInputChangeEvent = (): void => {

        this.updateHeight();
        this.markdownify()

    };

    // this.onHtmlEvents = (event: Event): void => {
    //
    //     event.preventDefault();
    //     event.stopPropagation()
    //
    // };

    this.onDragEnterEvent = (event: any): void => {

        event.dataTransfer.dropEffect = 'copy';
        event.preventDefault();
        event.stopPropagation()

    };

    this.onDragLeaveEvent = (event: Event): void => {

        event.preventDefault();
        event.stopPropagation()

    };

    this.onDropEvent = (event: any): void => {

        if (event.dataTransfer && event.dataTransfer.files.length)
            Object.keys(event.dataTransfer.files).map(fileKey => this.sendFile(event.dataTransfer.files[fileKey]));

        event.preventDefault();
        event.stopPropagation()

    };

    this.onKeyDownEvent = (event: any): Boolean | null => {

        const TAB_ASCII_CODE = 9;

        if (event.keyCode !== TAB_ASCII_CODE) return null;

        let start: number   = this.editor.selectionStart,
              end: number   = this.editor.selectionEnd,
              value: string = this.editor.value;

        this.editor.value          = `${value.substring(0, start)}\t${value.substring(end)}`;
        this.editor.selectionStart = this.editor.selectionEnd = start++;

        this.markdownify();

        this.editor.focus();

        return false

    };

    this.sendFile = (file: File): void => {

        this.editor.style.opacity = 0.3;

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

                // For backwards-compatibility
                this.insertImage(`![]("${response.image_path}")`);
                triggerCustomEvent('markdownx.fileUploadEnd', [response])

            } else {

                console.error('Wrong response', response);
                triggerCustomEvent('markdownx.fileUploadError', [response])

            }

            this.preview.innerHTML = this.response;
            this.editor.style.opacity = 1

        };

        xhr.error = (response: string): void => {

            console.error(response);
            this.editor.style.opacity = 1;
            triggerCustomEvent('fileUploadError', [response])

        };

        xhr.send()

    };

    this.getMarkdown = (): void => {

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

        xhr.send()

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
        this.updateHeight();
        this.markdownify();

    };

    // Events
    // ----------------------------------------------------------------------------------------------
    let
          // documentListeners = {
          //       object: document,
          //       listeners: [
          //           { type: 'drop'     , capture: false, listener: this.onHtmlEvents },
          //           { type: 'dragover' , capture: false, listener: this.onHtmlEvents },
          //           { type: 'dragenter', capture: false, listener: this.onHtmlEvents },
          //           { type: 'dragleave', capture: false, listener: this.onHtmlEvents }
          //       ]
          // },
          editorListeners = {
              object: this.editor,
              listeners: [
                  { type: 'drop',             capture: false, listener: this.onDropEvent        },
                  { type: 'input',            capture: true , listener: this.onInputChangeEvent },
                  { type: 'keydown',          capture: true , listener: this.onKeyDownEvent     },
                  { type: 'dragover',         capture: false, listener: this.onDragEnterEvent   },
                  { type: 'dragenter',        capture: false, listener: this.onDragEnterEvent   },
                  { type: 'dragleave',        capture: false, listener: this.onDragLeaveEvent   },
                  { type: 'compositionstart', capture: true , listener: this.onKeyDownEvent     }
              ]
          };

    // Initialise
    // ----------------------------------------------------------------------------------------------

    mountEvents(editorListeners);
    // mountEvents(documentListeners);
    triggerCustomEvent('markdownx.init');

    this.getMarkdown();
    this.updateHeight();
    this.markdownify();

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

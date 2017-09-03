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
 *
 * @Copyright 2017 - Adi, Pouria Hadjibagheri.
 */

// Import, definitions and constant ------------------------------------------------------------------------------------

"use strict";

declare function docReady(args: any): any;

interface ImageUploadResponse {
    image_code?: string,
    image_path?: string,
    [propName: string]: any;
}

interface HandlerFunction {
    (properties: {
        start: number,
        end:   number,
        value: string
    }): string
}

interface KeyboardEvents {
    keys: {
        TAB:       string,
        DUPLICATE: string,
        UNINDENT:  string,
        INDENT:    string
    },
    handlers: {
        _multiLineIndentation: HandlerFunction,
        applyTab:              HandlerFunction,
        applyIndentation:      HandlerFunction,
        removeIndentation:     HandlerFunction,
        removeTab:             HandlerFunction,
        applyDuplication:      HandlerFunction
    },
    hub: Function
}

interface EventHandlers {
    inhibitDefault: Function,
    onDragEnter:    Function
}

interface MarkdownxProperties {
    parent:             HTMLElement,
    editor:             HTMLTextAreaElement,
    preview:            HTMLElement,
    _latency:           number | null,
    _editorIsResizable: Boolean | null
}

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


/**
 *
 */
const EventHandlers: EventHandlers = {

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
     * @param {DragEvent} event
     * returns {Event}
     */
    onDragEnter: function (event: DragEvent): Event {

        event.dataTransfer.dropEffect = 'copy';

        return EventHandlers.inhibitDefault(event)

    }

};


/**
 *
 */
const keyboardEvents: KeyboardEvents = {

    /**
     * Custom hotkeys.
     */
    keys: {
        TAB:       "Tab",
        DUPLICATE: "d",
        UNINDENT:  "[",
        INDENT:    "]"
    },

    /**
     * Hotkey response functions.
     */
    handlers: {

        /**
         * Smart application of tab indentations under various conditions.
         *
         * @param {JSON} properties
         * @returns {string}
         */
        applyTab: function (properties) {

            // Do not replace with variables; this
            // feature is optimised for swift response.
            return properties.value
                        .substring(0, properties.start) +                      // Preceding text.
                        (
                            properties.value
                                .substring(properties.start, properties.end)   // Selected text
                                .match(/\n/gm) === null ?                      // Not multi line?
                                    `\t${properties.value.substring(properties.start)}` : // Add `\t`.
                                    properties.value    // Otherwise:
                                          .substring(properties.start, properties.end)
                                          .replace(/^/gm, '\t') +              // Add `\t` to be beginning of each line.
                                    properties.value.substring(properties.end) // Succeeding text.
                        )

        },

        /**
         * Smart removal of tab indentations.
         *
         * @param {JSON} properties
         * @returns {string}
         */
        removeTab: function (properties) {

            let substitution: string    = null,
                lineTotal:  number    = (
                      properties.value
                            .substring(
                                  properties.start,
                                  properties.end
                            ).match(/\n/g) || []  // Number of lines (\n) or empty array (zero).
                ).length;                         // Length of the array is equal to the number of lines.

            if (properties.start === properties.end) {

                // Replacing `\t` at a specific location
                // (+/- 1 chars) where there is no selection.
                properties.start =
                      properties.start > 0 &&
                      properties.value[properties.start - 1]  // -1 is to account any tabs just before the cursor.
                            .match(/\t/) !== null ?           // if there's no `\t`, check the preceding character.
                                    properties.start - 1 : properties.start;

                substitution = properties.value
                                    .substring(properties.start)
                                    .replace("\t", '');       // Remove only a single `\t`.

            } else if (!lineTotal) {

                // Replacing `\t` within a single line selection.
                substitution =
                      properties.value
                            .substring(properties.start)
                            .replace("\t", '')

            } else {

                // Replacing `\t` in the beginning of each line
                // in a multi-line selection.
                substitution =
                      properties.value.substring(
                            properties.start,
                            properties.end
                      ).replace(/^\t/gm, '') +                    // Selection.
                      properties.value.substring(properties.end); // After the selection

            }

            return properties.value
                        .substring(0, properties.start) +         // Text preceding to selection / cursor.
                        substitution

        },

        /**
         * Handles multi line indentations.
         *
         * @param {JSON} properties
         * @returns {string}
         * @private
         */
        _multiLineIndentation: function (properties) {

            // Last line in the selection; regardless of
            // where of not the entire line is selected.
            const endLine: string =
                  new RegExp(`(?:\n|.){0,${properties.end}}(^.*$)`, "m")
                        .exec(properties.value)[1];

            // Do not replace with variables; this
            // feature is optimised for swift response.
            return properties.value.substring(
                  // First line of the selection, regardless of
                  // whether or not the entire line is selected.
                  properties.value.indexOf(
                        new RegExp(`(?:\n|.){0,${properties.start}}(^.*$)`, "m")
                              .exec(properties.value)[1]  // Start line.
                  ), (
                        // If there is a last line in a multi line selected
                        // value where the last line is not empty or `\n`:
                        properties.value.indexOf(endLine) ?
                              // Location where the last line finishes with
                              // respect to the entire value.
                              properties.value.indexOf(endLine) + endLine.length :
                              // Otherwise, where the selection ends.
                              properties.end
                  )
            );

        },

        /**
         * Smart application of indentation at the beginning of the line.
         *
         * @param {JSON} properties
         * @returns {string}
         */
        applyIndentation: function (properties) {

            // Single line?
            if (properties.start === properties.end) {
                // Current line, from the beginning to the end, regardless of any selections.
                const line: string =
                      new RegExp(`(?:\n|.){0,${properties.start}}(^.+$)`, "m")
                            .exec(properties.value)[1];

                return properties.value.replace(line, `\t${line}`)
            }

            // Multi line
            const content: string = this._multiLineIndentation({
                start: properties.start,
                end:   properties.end,
                value: properties.value
            });

            return properties.value
                        .replace(
                              content,                                 // Existing contents.
                              content.replace(/(^.+$)\n*/gmi, "\t$&")  // Indented contents.
                        )

        },

        /**
         * Smart removal of indentation from the beginning of the line.
         *
         * @param {JSON} properties
         * @returns {string}
         */
        removeIndentation: function (properties) {

            // Single Line
            if (properties.start === properties.end) {
                // Entire line where the line immediately begins
                // with a one or more `\t`, regardless of any
                // selections.
                const line: string =
                      new RegExp(`(?:\n|.){0,${properties.start}}(^\t.+$)`, "m")
                            .exec(properties.value)[1];

                return properties.value
                            .replace(
                                  line,              // Existing content.
                                  line.substring(1)  // First character (necessarily a `\t`) removed.
                            )
            }

            // Multi line
            const content: string = this._multiLineIndentation({
                start: properties.start,
                end:   properties.end,
                value: properties.value
            });

            return properties.value
                        .replace(
                              content,                                  // Existing content.
                              content.replace(/^\t(.+)\n*$/gmi, "$1")   // A single `\t` removed from the beginning.
                        )

        },

        /**
         * Duplication of the current or selected lines.
         *
         * @param {JSON} properties
         * @returns {string}
         */
        applyDuplication: function (properties) {

            // With selection.
            // Do not replace with variables. This
            // feature is optimised for swift response.
            if (properties.start !== properties.end)
                return (
                    properties.value.substring(                 // Text preceding the selected area.
                          0,
                          properties.start
                    ) +
                    properties.value.substring(                 // Selected area
                          properties.start,
                          properties.end
                    ) +
                    (
                          ~properties.value                     // First character before the cursor is linebreak?
                                .charAt(properties.start - 1)
                                .indexOf('\n') ||               // --> or
                          ~properties.value                     // Character on the cursor is linebreak?
                                .charAt(properties.start)
                                .indexOf('\n') ? '\n' : ''      // If either, add linebreak, otherwise add nothing.
                    ) +
                    properties.value.substring(                 // Selected area (again for duplication).
                          properties.start,
                          properties.end
                    ) +
                    properties.value.substring(properties.end)  // Text succeeding the selected area.
                );

            // Without selection.
            let pattern: RegExp = // Separate lines up to the end of the current line.
                        new RegExp(`(?:.|\n){0,160}(^.*$)`, 'm'),
                line: string = '';

            // Add anything found to the `line`. Note that
            // `replace` is used a simple hack; it functions
            // in a similar way to `regex.search` in Python.
            properties.value
                  .replace(pattern, (match, p1) => line += p1);

            return properties.value
                        .replace(
                              line,                 // Existing line.
                              `${line}\n${line}`    // Doubled ... magic!
                        )

        },

    },

    /**
     * Mapping of hotkeys from keyboard events to their corresponding functions.
     *
     * @param {KeyboardEvent} event
     * @returns {Function | Boolean}
     */
    hub: function (event: KeyboardEvent): Function | false {

        switch (event.key) {
            case this.keys.TAB:  // Tab.
                if (event.ctrlKey) {
                    // Skip if ctrl was down
                    return false;
                }

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
                // default would prevent the
                // inhibition of default settings.
                return false
        }

    }

};


/**
 * Get either the height of an element as defined in style/CSS or its browser-computed height.
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
 * Update the height of an element based on its scroll height.
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
 *     let element = document.getElementsByClassName('markdownx');
 *
 *     new MarkdownX(
 *         element,
 *         element.querySelector('.markdownx-editor'),
 *         element.querySelector('.markdownx-preview')
 *     )
 *
 * @param {HTMLElement} parent - Markdown editor element.
 * @param {HTMLTextAreaElement} editor - Markdown editor element.
 * @param {HTMLElement} preview - Markdown preview element.
 */
const MarkdownX = function (parent: HTMLElement, editor: HTMLTextAreaElement, preview: HTMLElement): void {

    /**
     * MarkdownX properties.
     */
    const properties: MarkdownxProperties = {

        editor:             editor,
        preview:            preview,
        parent:             parent,
        _latency:           null,
        _editorIsResizable: null

    };

    /**
     * Initialisation settings (mounting events, retrieval of initial data,
     * setting animation properties, latency, timeout, and resizability).
     *
     * @private
     */
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

        // Initialise
        // --------------------------------------------------------

        // Mounting the defined events.
        mountEvents(editorListeners, documentListeners);

        properties.editor.setAttribute('data-markdownx-init', '');

        // Set animation for image uploads lock down.
        properties.editor.style.transition       = "opacity 1s ease";
        properties.editor.style.webkitTransition = "opacity 1s ease";

        // Upload latency - must be a value >= 500 microseconds.
        properties._latency =
              Math.max(parseInt(properties.editor.getAttribute(LATENCY_ATTRIBUTE)) || 0, LATENCY_MINIMUM);

        // If `true`, the editor will expand to scrollHeight when needed.
        properties._editorIsResizable = (
              (properties.editor.getAttribute(RESIZABILITY_ATTRIBUTE).match(/true/i) || []).length > 0 &&
              properties.editor.offsetHeight > 0 &&
              properties.editor.offsetWidth > 0
        );

        getMarkdown();

        triggerCustomEvent("markdownx.init");

    };

    /**
     * settings for `timeout`.
     *
     * @private
     */
    const _markdownify = (): void => {

        clearTimeout(this.timeout);
        this.timeout = setTimeout(getMarkdown, properties._latency)

    };

    /**
     * Handling changes in the editor.
     */
    const inputChanged = (): void => {

        properties.editor = properties._editorIsResizable ?
              updateHeight(properties.editor) : properties.editor;

        return _markdownify()

    };

    /**
     * Handling of drop events (when a file is dropped into `properties.editor`).
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
     * Handling of keyboard events (i.e. primarily hotkeys).
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

        properties.editor.value = handlerFunc({
              start: properties.editor.selectionStart,
              end:   properties.editor.selectionEnd,
              value: properties.editor.value
        });

        _markdownify();

        properties.editor.focus();

        // Set the cursor location to the start location of the selection.
        properties.editor.selectionEnd = properties.editor.selectionStart = SELECTION_START;

        return false

    };

    /**
     * Uploading the `file` onto the server through an AJAX request.
     *
     * @param {File} file
     */
    const sendFile = (file: File) => {

        properties.editor.style.opacity = UPLOAD_START_OPACITY;

        const xhr = new Request(
              properties.editor.getAttribute(UPLOAD_URL_ATTRIBUTE),  // URL
              preparePostData({image: file})  // Data
        );

        xhr.success = (resp: string): void | null => {

            const response: ImageUploadResponse = JSON.parse(resp);

            if (response.image_code) {

                insertImage(response.image_code);
                triggerCustomEvent('markdownx.fileUploadEnd', properties.parent, [response])

            } else if (response.image_path) {

                // ToDo: Deprecate.
                insertImage(`![]("${response.image_path}")`);
                triggerCustomEvent('markdownx.fileUploadEnd', properties.parent, [response])

            } else {

                console.error(XHR_RESPONSE_ERROR, response);
                triggerCustomEvent('markdownx.fileUploadError', properties.parent, [response]);
                return null;

            }

            properties.editor.style.opacity = NORMAL_OPACITY;

        };

        xhr.error = (response: any): void => {

            properties.editor.style.opacity = NORMAL_OPACITY;
            console.error(response);
            triggerCustomEvent('fileUploadError', properties.parent, [response])

        };

        return xhr.send()

    };

    /**
     * Uploading the markdown text from `properties.editor` onto the server
     * through an AJAX request, and upon receiving the HTML encoded text
     * in response, the response will be display in `properties.preview`.
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

        xhr.error = (response: any): void => {

            console.error(response);

            triggerCustomEvent('markdownx.updateError', properties.parent, [response])

        };

        return xhr.send()

    };

    /**
     * Inserts markdown encoded image URL into `properties.editor` where
     * the cursor is located.
     *
     * @param textToInsert
     */
    const insertImage = (textToInsert: string): void => {

        properties.editor.value =
              `${properties.editor.value.substring(0, properties.editor.selectionStart)}\n\n` + // Preceding text.
              textToInsert +
              `\n\n${properties.editor.value.substring(properties.editor.selectionEnd)}`;  // Succeeding text.

        properties.editor.selectionStart =
              properties.editor.selectionEnd =
                    properties.editor.selectionStart + textToInsert.length;

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

    return Object.keys(ELEMENTS).map(key => {
        
        let element = ELEMENTS[key],
            editor  = element.querySelector('.markdownx-editor'),
            preview = element.querySelector('.markdownx-preview');
        
        // Only add the new MarkdownX instance to fields that have no MarkdownX instance yet.
        if (!editor.hasAttribute('data-markdownx-init')) 
            return new MarkdownX(element, editor, preview)

    });

});


export {

    MarkdownX

};

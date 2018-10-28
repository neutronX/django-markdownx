"use strict";

interface EventListener {

    object: Element | Document,
    listeners: {
        type:     string,
        listener: any,
        capture:  boolean,
    } []

}


export interface RequestBase {

    url:                       string;
    data:                      FormData;
    progress(event:      any): any;
    error(response:   string): any;
    success(response: string): any;
    send():                    void;

}


/**
 * Looks for a cookie, and if found, returns the values.
 *
 * ... note:: Only the first item in the array is returned
 *            to eliminate the need for array deconstruction
 *            in the target.
 *
 * @param {string} name - The name of the cookie.
 * @returns {string | null}
 */
export function getCookie (name: string): string | null {

    if (document.cookie && document.cookie.length) {

        const cookies: string = document.cookie
              .split(';')
              .filter(cookie => cookie.indexOf(`${name}=`) !== -1)[0];

        try{

            return decodeURIComponent(
                  cookies.trim().substring(name.length + 1)
            );

        } catch (e) {

            if (e instanceof TypeError) {
                console.info(`No cookie with key "${name}". Wrong name?`);
                return null
            }

            throw e
        }
    }

    return null;

}


/**
 * @example
 *
 *
 * @param rows
 * @returns
 */
export function zip (...rows: any[]) {

    if (rows[0].constructor == Array)
        return [...rows[0]].map((_, c) => rows.map(row => row[c]));

    // ToDo: To be updated to Objects.values in ECMA2017 after the method is fully ratified.
    const asArray = rows.map(row => Object.keys(row).map(key => row[key]));

    return [...asArray[0]].map((_, c) => asArray.map(row => row[c]));

}



/**
 *
 * @param collections
 * @returns
 */
export function mountEvents (...collections: EventListener[]): any[] {

    return collections.map(events =>
          events.listeners
                .map(series =>
                      events.object
                            .addEventListener(
                                  series.type,
                                  series.listener,
                                  series.capture
                            )
          )
    )

}


/**
 *
 * @param {JSON} data
 * @param {Boolean} csrf
 * @returns {FormData}
 */
export function preparePostData(data: Object, csrf: Boolean=true) {

    let form: FormData = new FormData();

    if (csrf) {
        let csrfToken = getCookie('csrftoken');
        if (!csrfToken) csrfToken = (<HTMLInputElement>document.querySelector("input[name='csrfmiddlewaretoken']")).value;
        form.append("csrfmiddlewaretoken", csrfToken);
    }

    Object.keys(data).map(key => form.append(key, data[key]));

    return form

}


/**
 *
 * @returns {XMLHttpRequest}
 * @throws TypeError - AJAX request is not supported.
 */
function AJAXRequest () : XMLHttpRequest {

    // Chrome, Firefox, IE7+, Opera, Safari
    // and everything else that has come post 2010.
    if ("XMLHttpRequest" in window) return new XMLHttpRequest();


    // ToDo: Deprecate.
    // Other IE versions (with all their glories).
    // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is
    // redundant - but you never know with Microsoft.
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0")
    } catch (e) {}

    try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0")
    } catch (e) {}

    try {
        return new ActiveXObject("Microsoft.XMLHTTP")
    }  catch (e) {}

    // Just throw the computer outta the window!
    alert("Your browser belongs to history!");
    throw new TypeError("This browser does not support AJAX requests.")

}


/**
 * Handles AJAX POST requests.
 */
export class Request implements RequestBase {

    public  url;
    public  data;
    private xhr: any = AJAXRequest();

    /**
     *
     * @param url
     * @param data
     */
    constructor(url: string, data: FormData) {

        this.url  = url;
        this.data = data;

    }

    /**
     *
     * @param event
     */
    progress(event: any): void {

        if (event.lengthComputable)
            console.log((event.loaded / event.total) * 100 + '% uploaded');

    }

    /**
     *
     * @param response
     */
    error(response: any): void {

        console.error(response)

    }

    /**
     *
     * @param response
     */
    success(response: any): void {

        console.info(response)

    }

    /**
     *
     */
    send (): void {

        const SUCCESS:  any  = this.success,
              ERROR:    any  = this.error,
              PROGRESS: any  = this.progress;

        this.xhr.open('POST', this.url, true);
        this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        this.xhr.upload.onprogress = (event: any) => PROGRESS(event);

        this.xhr.onerror = (event: any): void => {

            ERROR(this.xhr.responseText)

        };

        this.xhr.onload = (event: any): void => {

            let data: any = null;

            if (this.xhr.readyState == XMLHttpRequest.DONE) {

                if (!this.xhr.responseType || this.xhr.responseType === "text") {

                    data = this.xhr.responseText

                } else if (this.xhr.responseType === "document") {

                    data = this.xhr.responseXML

                } else {

                    data = this.xhr.response

                }

            }

            SUCCESS(data)

        };

        this.xhr.send(this.data);

    }

}


/**
 *
 * @param {Element} element
 * @param {string} type
 */
export function triggerEvent(element: Element, type: string): void {

    // modern browsers, IE9+
    let event = document.createEvent('HTMLEvents');
    event.initEvent(type, false, true);
    element.dispatchEvent(event);

}


/**
 *
 * @param {string} type
 * @param {Element | Document} element
 * @param {any} args
 */
export function triggerCustomEvent(type:string, element: Element | Document=document, args: any=null){

    // modern browsers, IE9+
    const event = new CustomEvent(type, {'detail': args});
    element.dispatchEvent(event);

}


/**
 *
 * @param {Element} element
 * @param {string[]} className
 */
export function addClass (element: Element, ...className: string[]): void {

    className.map(cname => {

        if (element.classList)
            element.classList.add(cname);

        else {
            let classes: string[] = element.className.split(' ');

            if (classes.indexOf(cname) < 0) classes.push(cname);

            element.className = classes.join(' ')
        }

    })

}


/**
 *
 * @param {Element} element
 * @param {string[]} className
 */
export function removeClass (element: Element, ...className: string[]): void {

    className.map(cname => {

        if (element.classList)
            element.classList.remove(cname);

        else {
            let classes: string[] = element.className.split(' '),
                    idx: number   = classes.indexOf(cname);

            if (idx > -1) classes.splice(idx, 1);

            element.className = classes.join(' ')
        }

    })

}

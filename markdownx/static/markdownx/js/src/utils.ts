"use strict";


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
export function getCookie (name: string): string | null {

    if (document.cookie && document.cookie.length) {

        const cookies = document.cookie
              .split(';')
              .filter(cookie => cookie.indexOf(`${name}=`) !== -1)[0];

        try{

            return decodeURIComponent(cookies.trim().substring(name.length + 1));

        } catch (e){

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
export function zip (...rows) {

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
export function mountEvents (...collections): any {

    return collections.map(events =>
          events.listeners.map(series =>
                events.object.addEventListener(series.type, series.listener, series.capture)
          )
    )

}


/**
 *
 * @param data
 * @param csrf
 * @returns {FormData}
 */
export function preparePostData(data: Object, csrf=true) {

    let form: FormData = new FormData();

    if (csrf) form.append("csrfmiddlewaretoken", getCookie('csrftoken'));

    Object.keys(data).map(key => form.append(key, data[key]));

    return form

}



const AJAXRequest = () => {

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

};


export interface RequestBase {

    url:                       string;
    data:                      FormData;
    progress(event:      any): any;
    error(response:   string): any;
    success(response: string): any;
    send():                    void;

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
    progress(event: any) {

        if (event.lengthComputable)
            console.log((event.loaded / event.total) * 100 + '% uploaded');

    }

    /**
     *
     * @param response
     */
    error(response: any) {

        console.error(response)

    }

    /**
     *
     * @param response
     */
    success(response: any) {

        console.info(response)

    }

    /**
     *
     */
    send () {

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
 * @param el
 * @param type
 */
export function triggerEvent(el: Element, type: string){

    // modern browsers, IE9+
    let e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);

}


/**
 *
 * @param type
 * @param element
 * @param args
 */
export function triggerCustomEvent(type:string, element: Element | Document=document, args=null){

    // modern browsers, IE9+
    const event = new CustomEvent(type, {'detail': args});
    element.dispatchEvent(event);

}


export function addClass (element, ...className) {

    className.map(cname => {

        if (element.classList) {

            element.classList.add(cname)

        } else {

            let classes = element.className.split(' ');
            if (classes.indexOf(cname) < 0) classes.push(cname);
            element.className = classes.join(' ')
        }

    })

}


export function removeClass (element, ...className) {

    className.map(cname => {

        if (element.classList) {

            element.classList.remove(cname)

        } else {

            let classes = element.className.split(' ');
            const idx = classes.indexOf(cname);

            if (idx > -1) classes.splice(idx, 1);
            element.className = classes.join(' ')

        }

    })

}
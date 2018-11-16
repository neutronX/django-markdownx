# JavaScript

## Events

Some MarkdownX processes trigger events that may be utilized for different purposes. To handle such events in JavaScript, you may take advantage of event listeners as exemplified below:

- [`markdownx.init`](#markdownxinit)
- [`markdownx.update`](#markdownxupdate)
- [`markdownx.updateError`](#markdownxupdateerror)
- [`markdownx.markdownx.fileUploadBegin`](#markdownxmarkdownxfileuploadbegin)
- [`markdownx.fileUploadEnd`](#markdownxfileuploadend)
- [`markdownx.fileUploadError`](#markdownxfileuploaderror)


### `markdownx.init`

Triggered after jQuery plugin init. `markdownx.init` is an event that does *not* return a response.

JavaScript ECMA 2015+:

```javascript
let element = document.getElementsByClassName('markdownx');

Object.keys(element).map(key =>

    element[key].addEventListener('markdownx.init', () => console.log("MarkdownX initialized."))

);
```

### `markdownx.update`

Triggered when editor text is markdownified. Returns: **response** (*string*) variable containing markdownified text.

JavaScript ECMA 2015+:

```javascript
let element = document.getElementsByClassName('markdownx');

Object.keys(element).map(key =>

    element[key].addEventListener('markdownx.update', event => console.log(event.detail))

);
```

### `markdownx.updateError`

Triggered when a problem occurred during markdownify.

### `markdownx.markdownx.fileUploadBegin`

Triggered when the file is posted.

### `markdownx.fileUploadEnd`

Triggered when the file has been uploaded.

### `markdownx.fileUploadError`

Triggered if the upload didn’t work.

## Compatibility

We rely on JavaScript to handle front-end events (e.g. trans-compilation of Markdown to HTML, uploading image).

MarkdownX's JavaScript code is written in TypeScript using Pure JavaScript and under ECMA 2016 standard.

Currently, the code is trans-compiled into ECMA 5 (approved in 2011) to provide support for older browsers, specifically IE 10+. See additional detailed on [browser compatibilities](https://kangax.github.io/compat-table/es5/).

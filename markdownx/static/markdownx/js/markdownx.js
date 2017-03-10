(function ($) {
    if (!$) {
        $ = django.jQuery;
    }
    $.fn.markdownx = function() {

        return this.each( function() {

            var getMarkdown = function() {
                var form = new FormData();
                form.append("content", markdownxEditor.val());
                form.append("csrfmiddlewaretoken", getCookie('csrftoken'));

                $.ajax({
                    type: 'POST',
                    url: markdownxEditor.data("markdownxUrlsPath"),
                    data: form,
                    processData: false,
                    contentType: false,

                    success: function(response) {
                        markdownxPreview.html(response);
                        updateHeight();
                        markdownx.trigger('markdownx.update', [response]);
                    },

                    error: function(response) {
                        console.log("error", response);
                        markdownx.trigger('markdownx.update_error', [response]);
                    }
                });
            };

            var updateHeight = function() {
                if (isMarkdownxEditorResizable) {
                    markdownxEditor.innerHeight(markdownxEditor.prop('scrollHeight'));
                }
            };

            var insertImage = function(textToInsert) {
                var cursor_pos = markdownxEditor.prop('selectionStart');
                var text = markdownxEditor.val();
                var textBeforeCursor = text.substring(0, cursor_pos);
                var textAfterCursor  = text.substring(cursor_pos, text.length);

                markdownxEditor.val(textBeforeCursor + textToInsert + textAfterCursor);
                markdownxEditor.prop('selectionStart', cursor_pos + textToInsert.length);
                markdownxEditor.prop('selectionEnd', cursor_pos + textToInsert.length);
                markdownxEditor.keyup();

                updateHeight();
                markdownify();
            };

            var getCookie = function(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = $.trim(cookies[i]);
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            };

            var sendFile = function(file) {
                var form = new FormData();
                form.append("image", file);
                form.append("csrfmiddlewaretoken", getCookie('csrftoken'));

                $.ajax({
                    type: 'POST',
                    url: markdownxEditor.data("markdownxUploadUrlsPath"),
                    data: form,
                    processData: false,
                    contentType: false,

                    beforeSend: function() {
                        markdownxEditor.fadeTo("fast", 0.3);
                        markdownx.trigger('markdownx.file_upload_begin');
                    },

                    success: function(response) {
                        markdownxEditor.fadeTo("fast", 1);
                        if (response.image_code) {
                            insertImage(response.image_code);
                            markdownx.trigger('markdownx.file_upload_end', [response]);
                        } else if (response.image_path) {
                            // For backwards-compatibility
                            insertImage("![](" + image_path + ")");
                            markdownx.trigger('markdownx.file_upload_end', [response]);
                        } else {
                            console.log('error: wrong response', response);
                            markdownx.trigger('markdownx.file_upload_error', [response]);
                        }
                    },

                    error: function(response) {
                        console.log("error", response);
                        markdownxEditor.fadeTo("fast", 1);
                        markdownx.trigger('markdownx.file_upload_error', [response]);
                    }
                });
            };

            var timeout;
            var markdownify = function() {
                clearTimeout(timeout);
                timeout = setTimeout(getMarkdown, 500);
            };

            // Events

            var onKeyDownEvent = function(e) {
                if (e.keyCode === 9) { // Tab
                    var start = this.selectionStart;
                    var end = this.selectionEnd;

                    $(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));
                    this.selectionStart = this.selectionEnd = start + 1;

                    markdownify();

                    return false;
                }
            };

            var onInputChangeEvent = function() {
                updateHeight();
                markdownify();
            };

            var onHtmlEvents = function(e) {
                e.preventDefault();
                e.stopPropagation();
            };

            var onDragEnterEvent = function(e) {
                e.originalEvent.dataTransfer.dropEffect = 'copy';
                e.preventDefault();
                e.stopPropagation();
            };

            var onDragLeaveEvent = function(e) {
                e.preventDefault();
                e.stopPropagation();
            };

            var onDropEvent = function(e) {
                if (e.originalEvent.dataTransfer){
                    if (e.originalEvent.dataTransfer.files.length) {
                        for (var i = 0; i < e.originalEvent.dataTransfer.files.length; i++) {
                            sendFile(e.originalEvent.dataTransfer.files[i]);
                        }
                    }
                }
                e.preventDefault();
                e.stopPropagation();
            };

            // Init

            var markdownx = $(this);
            var markdownxEditor = $(this).find('.markdownx-editor');
            var markdownxPreview = $(this).find('.markdownx-preview');

            var isMarkdownxEditorResizable = markdownxEditor.is("[data-markdownx-editor-resizable]");

            $('html').on('dragenter.markdownx dragover.markdownx drop.markdownx dragleave.markdownx', onHtmlEvents);
            markdownxEditor.on('keydown.markdownx', onKeyDownEvent);
            markdownxEditor.on('input.markdownx propertychange.markdownx', onInputChangeEvent);
            markdownxEditor.on('dragenter.markdownx dragover.markdownx', onDragEnterEvent);
            markdownxEditor.on('dragleave.markdownx', onDragLeaveEvent);
            markdownxEditor.on('drop.markdownx', onDropEvent);

            markdownx.trigger('markdownx.init');

            updateHeight();
            markdownify();
        });
    };

    $(function() {
        $('.markdownx').markdownx();
    });
})(jQuery);

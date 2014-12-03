$.fn.extend({
    markdownx: function(options) {
        var defaults = {};
        var opts = $.extend(defaults, options);

        var $this = $(this);
        var $markdownx_editor = $this.find('#markdownx_editor');
        var $markdownx_preview = $this.find('#markdownx_preview');

        var ms;
        var markdownify = function() {
            clearTimeout(ms);
            ms = setTimeout(getMarkdown, 500);
        };

        var getMarkdown = function() {
            form = new FormData();
            form.append("content", $markdownx_editor.val());
            form.append("csrfmiddlewaretoken", getCookie('csrftoken'))

            $.ajax({
                type: 'POST',
                url: '/markdownx/markdownify/',
                data: form,
                processData: false,
                contentType: false,

                success: function(response) {
                    $markdownx_preview.html(response);
                    updateHeight();
                },

                error: function(response) {
                    console.log("error", response);
                },
            });
        }

        var updateHeight = function() {
            $markdownx_editor.innerHeight($markdownx_editor.prop('scrollHeight'))
        }

        var insertImage = function(image_path) {
            var cursor_pos = $markdownx_editor.prop('selectionStart');
            var text = $markdownx_editor.val();
            var textBeforeCursor = text.substring(0, cursor_pos);
            var textAfterCursor  = text.substring(cursor_pos, text.length);
            var textToInsert = "![](" + image_path + ")";

            $markdownx_editor.val(textBeforeCursor + textToInsert + textAfterCursor);
            $markdownx_editor.prop('selectionStart', cursor_pos + textToInsert.length);
            $markdownx_editor.prop('selectionEnd', cursor_pos + textToInsert.length);
            $markdownx_editor.keyup();

            updateHeight();
            markdownify();
        }

        var getCookie = function(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        var sendFile = function(file) {
            form = new FormData();
            form.append("image", file);
            form.append("csrfmiddlewaretoken", getCookie('csrftoken'))

            $.ajax({
                type: 'POST',
                url: '/markdownx/upload/',
                data: form,
                processData: false,
                contentType: false,

                beforeSend: function() {
                    console.log("uploading...");
                    $markdownx_editor.fadeTo("fast", 0.3);
                },

                success: function(response) {
                    $markdownx_editor.fadeTo("fast", 1);
                    if (response['image_path']) {
                        insertImage(response['image_path']);
                        console.log("success", response);
                    } else
                        console.log('error: wrong response', response);
                },

                error: function(response) {
                    console.log("error", response);
                    $markdownx_editor.fadeTo("fast", 1 );
                },
            });
        }

        updateHeight();
        markdownify();

        $markdownx_editor.on('keydown', function(e) {
            if (e.keyCode === 9) { // Tab
                var start = this.selectionStart;
                var end = this.selectionEnd;

                var $this = $(this);
                var value = $this.val();

                $this.val(value.substring(0, start) + "\t" + value.substring(end));
                this.selectionStart = this.selectionEnd = start + 1;

                markdownify();

                return false;
            }
        });

        // On text change
        $markdownx_editor.on('input propertychange', function() {
            updateHeight();
            markdownify();
        });

        // Upload functionality
        $('html').on('dragenter dragover drop dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        $markdownx_editor.on('dragenter dragover', function(e) {
            e.originalEvent.dataTransfer.dropEffect= 'copy';

            e.preventDefault();
            e.stopPropagation();
        });

        $markdownx_editor.on('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        $markdownx_editor.on('drop', function(e) {
            if (e.originalEvent.dataTransfer){
                if (e.originalEvent.dataTransfer.files.length) {
                    for (var i = 0; i < e.originalEvent.dataTransfer.files.length; i++) {
                        sendFile(e.originalEvent.dataTransfer.files[i]);
                    }
                }
            }

            e.preventDefault();
            e.stopPropagation();
        });
    }
});

$(document).ready(function() {
    $('#markdownx').markdownx();
});

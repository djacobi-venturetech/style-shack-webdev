jQuery(function ($) {
    var $forms = $("form.miwt-form");
    var CSS_CLASS_SELECT_INIT = "select2-offscreen";
    var DEFAULT_SELECT_OPTIONS = {
        placeholder: "Select",
        allowClear: true,
        minimumResultsForSearch: -1
    };

    function initScrollPage(context) {
        var $con = $(context || document);

        if ($con.find(".message").length) {
            $('html,body').scrollTop(100);
        }
    }


    $forms.each(function (idx, form) {
        var $form = $(form);
        var $tags = $form.find(".post.tags");
        var $categories = $form.find(".post.categories");
        var $status = $form.find(".post.status");
        var btnhitId;
        var selectDefaults = {
            width: 360
        };

        function onSubmitHandler() {
            btnhitId = $form.find('input[name=btnhit]').val();
            return true;
        }


        function initSelector(con, opts) {
            var $con = $(con);
            var $select = $con.find("select");
            var serializedPreloadValues = $con.find('input').val();

            $select.find("option.empty").attr("disabled", "true");

            if (serializedPreloadValues && serializedPreloadValues !== "") {
                preloadOpts($select, opts, serializedPreloadValues);
            }

            else if (serializedPreloadValues == null) {
                $select.select2($.extend({}, selectDefaults, opts));
            }

            else {
                $select.select2($.extend({}, selectDefaults, opts, {placeholder: 'Select an option'}));
                $select.find("option.empty").remove();
                $select.next(".select2-container").find('select2-selection__choice__remove[value="x"]').remove();
            }
        }

        function preloadOpts(select, opts, vals) {
            var $select = $(select);
            var serializedPreloadValues = vals;

            var preloadValues = serializedPreloadValues.length ? serializedPreloadValues.split(',') : null;

            $select.select2($.extend({}, selectDefaults, opts));


            if (preloadValues) {
                $select.select2('val', preloadValues);
                $select.trigger('change');
            }
        }

        function createTagField(con) {
            var $select = $(con).find("select");
            var $input = $(con).find("input[type=text]");
            var values = $select.select2("val");

            function updateTagFieldInput() {
                values = $select.select2("val");
                $input.attr("value", $.isArray(values) ? values.join() : values);
            }

            $select.on("select2:select", updateTagFieldInput);
            $select.on("select2:unselect", updateTagFieldInput);
            $select.on("change", updateTagFieldInput);
        }


        function init() {
            initSelector($tags, {tags: true, multiple: true});
            initSelector($categories, {tags: true, multiple: true});
            initSelector($status, {minimumResultsForSearch: -1});
            createTagField($tags);
            createTagField($categories);
        }


        function destroySelectUpdates(context) {
            var $con = $(context || document);

            if (!$con.hasClass(CSS_CLASS_SELECT_INIT)) {
                $con = $con.find('select').filter('.' + CSS_CLASS_SELECT_INIT);
            }

            if ($con.length) {
                $con.removeClass(CSS_CLASS_SELECT_INIT).select2('destroy');
            }
        }


        function initSelectUpdates(context) {
            var $con = $(context || document);

            if (!$con.is('select')) {
                $con = $con.find('select');
            }
            if ($con.length && $con.hasClass("val")) {
                $con.select2($.extend({}, selectDefaults, {minimumResultsForSearch: -1}));
                $con.addClass(CSS_CLASS_SELECT_INIT);
                $con.filter('[data-features~="watch"]');
                $con.on('change', miwt.observerFormSubmit);
            }
        }


        if (!this.submit_options) {
            this.submit_options = {};
        }

        this.submit_options.postUpdate = function () {
            if (btnhitId.length) {
                initScrollPage(this);
            }
        };

        this.submit_options.onSubmit = onSubmitHandler;

        this.submit_options.preProcessNode = function (data) {
            destroySelectUpdates(document.getElementById(data.refid));
            return data.content;
        };

        /*this.submit_options.postProcessNode = function (data) {
            $.each(data, function (idx, node) {
                initSelectUpdates(node);
            });
        };*/

        this.submit_options.postProcessNode = function (data) {
            initSelectUpdates(data.node);

            var $dNode = $(data.node);
            if (($dNode.hasClass('post') && $dNode.hasClass("tags")) || $dNode.find('.post.tags').length) {
                $tags = $form.find('.post.tags');
                initSelector($tags, {tags: true, multiple: true});
                createTagField($tags);
            }
        };

        init();
    });

});
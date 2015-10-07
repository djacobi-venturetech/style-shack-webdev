(function ($, d) {

    function initHeader() {
        var $mainNav = $(".main-nav");
        var blogCats = [".spotlights", ".trends", ".lifeshack"];

        for (var i = 0; i < blogCats.length; i++) {
            var $con = $(blogCats[i] + ".render");
            if ($con.length) {
                appendBlogCatsToMenu($con, blogCats[i]);
            }
        }

        function appendBlogCatsToMenu($con, classname) {
            $mainNav.find(classname).addClass("mi-parent").append($con);
        }
    }

    $(d).on("ss:header-init", initHeader);

})(jQuery, document);




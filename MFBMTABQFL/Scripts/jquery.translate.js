/**
* @file jquery.translate.js
* @brief jQuery plugin to translate text in the client side.
* @author Manuel Fernandes
* @site
* @version 0.9
* @license MIT license <http://www.opensource.org/licenses/MIT>
*
* translate.js is a jQuery plugin to translate text in the client side.
*
*/

(function ($) {
    $.fn.translate = function (options) {

        var that = this; //a reference to ourselves

        var settings = {
            css: "trn",
            lang: "en"/*,
      t: {
        "translate": {
          pt: "tradução",
          br: "tradução"
        }
      }*/
        };
        settings = $.extend(settings, options || {});
        if (settings.css.lastIndexOf(".", 0) !== 0)   //doesn't start with '.'
            settings.css = "." + settings.css;

        var t = settings.t;

        //public methods
        this.lang = function (l) {
            if (l) {
                settings.lang = l;
                this.translate(settings);  //translate everything
            }

            return settings.lang;
        };


        this.get = function (index) {
            var res = index;

            try {
                res = t[index][settings.lang];
            }
            catch (err) {
                //not found, return index
                return index;
            }

            if (res)
                return res;
            else
                return index;
        };

        this.g = this.get;



        //main
        this.find(settings.css).each(function (i) {
            var $this = $(this);

            var trn_key = $this.attr("data-trn-key");

            if (!trn_key) {
                trn_key = $this.html().replace('&amp;', '&');

                $this.attr("data-trn-key", trn_key);   //store key for next time
            }

            $this.html(that.get(trn_key));
            var trn_value = $this.attr("data-trn-value"); // Translate attribute value="" (e.g = submit button)
            if (!trn_value) {
                trn_value = $this.val();
                $this.attr("data-trn-value", trn_value);   //store key for next time
            }

            var trn_holder = $this.attr("data-trn-holder"); // Translate attribute placeholder="" (e.g = input text field)
            
            if (!trn_holder) {
                trn_holder = $(this).data("placeholder");
                $this.attr("data-trn-holder", trn_holder);   //store key for next time
            }

            var trn_title = $this.attr("data-trn-title"); // Translate attribute title=""
           
            if (!trn_title) {
                trn_title = $(this).data("title");
                $this.attr("data-trn-title", trn_title);   //store key for next time
            }

            var trn_label = $this.attr("data-trn-label"); // Translate attribute title=""
            
            if (!trn_label) {
                trn_label = $(this).data("data-minilabel");
                
                $this.attr("data-trn-label", trn_label);   //store key for next time
            }


            $this.html(that.get(trn_key)); // plain text html
            $this.val(that.get(trn_value)); // attribute value
            $(this).attr("placeholder", that.get(trn_holder)); // attribute placeholder
            $(this).attr("title", that.get(trn_title)); // attribute title
            $(this).attr("data-minilabel", that.get(trn_label));
        });

        return this;



    };
})(jQuery);
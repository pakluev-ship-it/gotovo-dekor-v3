// Site :: Slider
var Slider = (function($) {

  Slider = function(options) {
    var that = this;

    // DOM
    that.$wrapper = options["$wrapper"];

    // VARS
    that.params = options['params'];
    that.params.empty = "";

    // DYNAMIC VARS

    // INIT
    that.initSlider();
  };

  Slider.prototype.initSlider = function() {
    var that = this,
      $wrapper = that.$wrapper,
      params = that.params;

    $wrapper.owlCarousel({
      margin: params.margin || 0,
      items: params.items || 1,
      loop: params.loop || false,
      nav: params.navigation || false,
      dots: params.pagination || false,
      autoplay: params.autoplay || false,
      autoplayTimeout: params.playspeed || 5000,
      autoplayHoverPause: params.hoverpause || false,
      mouseDrag: params.drag || false,
      touchDrag: params.drag || false,
      pullDrag: params.drag || false,
      animateIn: params.animIn || 'fadeIn',
      animateOut: params.animOut || 'fadeOut',
      navText: [
        params.left || '<svg class="svg-icon svg-icon--xl"><use xlink:href="#icon-navleft"></use></svg>',
        params.right || '<svg class="svg-icon svg-icon--xl"><use xlink:href="#icon-navright"></use></svg>'
      ],
      responsiveClass: params.responsiveClass || false,
      responsive: params.responsive || params.empty
    });
  }

  return Slider;

})(jQuery);

// Site :: Gallery slider
(function($) {

  var init = function() {

    var $_slider = $('.gallery__items.owl-carousel');

    $_slider.each(function() {

      $_items = $(this).parents('.gallery').hasClass('gallery--single') ? '1' : '3',
      $_items_small = $(this).parents('.gallery').hasClass('gallery--single') ? '1' : '2';

      new Slider({
        $wrapper: $(this),
        params: {
          margin: 15,
          autoplay: false,
          playspeed: 0,
          hoverpause: true,
          loop: true,
          navigation: true,
          pagination: true,
          drag: true,
          responsiveClass: true,
          responsive:{
            0:{
              items: 1
            },
            768:{
              items: $_items_small
            },
            1024:{
              items: $_items
            }
          }
        }
      });

    });

  };

  $(document).ready(function() {
    init();
  });

})(jQuery);

// Site :: General Layout
( function($) {

    var bindEvents = function() {

        $(".auth-type-wrapper a").on("click", function() {
            onProviderClick( $(this) );
            return false;
        });

        $("#show-sidebar-link").on("click", function() {
            toggleSidebar();
        })

    };

    var onProviderClick = function( $link ) {
        var $li = $link.closest("li"),
            provider = $li.data("provider");

        if (provider != 'guest' && provider != 'signup') {
            var left = (screen.width-600)/ 2,
                top = (screen.height-400)/ 2,
                href = $link.attr("href");

            if ( ( typeof require_authorization !== "undefined" ) && !require_authorization) {
                href = href + "&guest=1";
            }

            openWindow(href, "oauth", "width=600,height=400,left="+left+",top="+top+",status=no,toolbar=no,menubar=no");
        }

    };

    var toggleSidebar = function() {
        var $wrapper = $(".site-wrapper"),
            activeClass = "sidebar-is-shown";

        $wrapper.toggleClass(activeClass);
    };

    var openWindow = function( href, win_name, params) {
        window.open(href, win_name, params);
    };

    $(document).ready( function() {
        bindEvents();
    });

})(jQuery);

// Site :: Profile :: Edit
var renderProfilePage = function(options) {

    var storage = {
        hiddenClass: "is-hidden",
        changeLink: false,          // Dynamic var
        deletePhotoLink: false,     // Dynamic var
        getWrapper: function () {
            return $("#wa-my-info-wrapper");
        },
        getForm: function () {
            return $("#wa-my-info-edit-wrapper");
        },
        getInfoBlock: function () {
            return $("#wa-my-info-read-wrapper");
        },
        getPassword: function () {
            return this.getWrapper().find(".wa-field-password");
        },
        getPhoto: function () {
            return this.getWrapper().find(".wa-field-photo");
        }
    };

    var initialize = function () {
        var $password = storage.getPassword(),
            $photo = storage.getPhoto();

        if ($password.length) {
            renderChangePasswordLink();
        }

        if ($photo.length) {
            renderPhoto();
        }

        // initialize bindEvents after Render
        bindEvents();
    };

    var bindEvents = function () {

        // show Edit Form
        $("#wa-my-info-edit").on("click", function () {
            showEditForm();
            return false;
        });

        // hide edit Form
        $("#wa-my-info-cancel").on("click", function () {
            hideEditForm();
            return false;
        });

        var $change_link = storage.changeLink;
        if ($change_link.length) {
            $change_link.on("click", function () {
                onChangePasswordClick( $(this) );
                return false;
            });
        }

        var $delete_photo_link = storage.deletePhotoLink;
        if ($delete_photo_link.length) {
            $delete_photo_link.on("click", function () {
                onDeletePhotoClick($(this));
                return false;
            });
        }
    };

    var renderPhoto = function () {
        var $photo = storage.getPhoto(),
            $delete_photo_link = $("<a class=\"general-button\" href=\"javascript:void(0);\">" + options["deletePhotoText"] + "</a>"),
            $user_photo = $photo.find('img:first'),
            $default_photo = $photo.find('img:last');

        if ($user_photo[0] != $default_photo[0]) {
            //
            $default_photo.hide();

            //
            $default_photo.after($delete_photo_link);

            // Save to storage
            storage.deletePhotoLink = $delete_photo_link;

        } else {
            $default_photo.show();
        }
    };

    var renderChangePasswordLink = function () {
        var $change_link = $("<a class=\"general-button\" href=\"javascript:void(0);\">" + options["changePasswordText"] + "</a>"),
            $password = storage.getPassword();

        // Hide Password Fields
        $password.find("p").addClass(storage.hiddenClass);

        // Render
        $password.find('.wa-value').prepend($change_link);

        // Save to storage
        storage.changeLink = $change_link;
    };

    var showEditForm = function () {
        var $form = storage.getForm(),
            $info = storage.getInfoBlock();

        $form.removeClass(storage.hiddenClass);
        $info.addClass(storage.hiddenClass);
    };

    var hideEditForm = function () {
        var $form = storage.getForm(),
            $info = storage.getInfoBlock();

        $form.addClass(storage.hiddenClass);
        $info.removeClass(storage.hiddenClass);
    };

    var onDeletePhotoClick = function ($delete_photo_link) {
        var $photo = storage.getPhoto(),
            $photo_input = $photo.find('[name="profile[photo]"]'),
            $user_photo = $photo.find('img:first'),
            $default_photo = $photo.find('img:last');

        // Show default photo
        $default_photo.show();

        // Show user photo
        $user_photo.hide();

        // Hide delete link
        $delete_photo_link.hide();

        // Clear input value
        $photo_input.val('');
    };

    var onChangePasswordClick = function($change_link) {
        // hide link
        $change_link.hide();

        // Show fields
        storage.getPassword().find("p").removeClass(storage.hiddenClass);
    };

    $(document).ready(function () {
        initialize();
    });
};

// Site :: Custom inputs
(function($) {

  var init = function() {

    var input = $(".custom-input__input");

    input.focus(function(){
      $(this).parent(".custom-input").addClass("is-focused");
    });

    input.focusout(function(){
      $(this).parent(".custom-input").removeClass("is-focused");
    });

  };

  $(document).ready(function() {
    init();
  });

})(jQuery);

// Site :: Mobile Header
(function($) {

  var init = function() {

    var header = $(".header-mobile"),
        burger = $(".icon-burger");

    burger.on("click", function() {

      $(this).toggleClass("is-active");
      header.toggleClass("is-shown");
      $('body').toggleClass('locked');

    });

  };

  $(document).ready(function() {
    init();
  });

})(jQuery);

// Site :: Fixed header
(function($) {

  var init = function() {

    var header = $(".header");

    $(window).bind('mousewheel DOMMouseScroll onscroll', function(event){
      if ($(this).scrollTop() > 300) {
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            header.addClass("is-fixed");
        } else {
            header.removeClass("is-fixed");
        }
      } else {
        header.removeClass("is-fixed");
      }

    });

  };

  $(document).ready(function() {
    init();
  });

})(jQuery);

// Site :: Callback Open
(function($) {

  var init = function() {

    var link = $('a[href="#callback-modal"]'),
        button = $(".callback-modal");

    link.on("click", function () {
      openModal();
      return false;
    });

    button.on("click", function () {
      openModal();
      return false;
    });

    var openModal = function() {
      $('#callback-modal').modal();
    };

  };

  $(document).ready(function() {
    init();
  });

})(jQuery);

// Site :: Button UP
(function($) {

  var init = function() {

    var button = $(".button-up");

    $(window).scroll(function () {
      if ($(this).scrollTop() > 400) {
        button.addClass("is-visible");
      } else {
        button.removeClass("is-visible");
      }
    });

    button.on("click", function () {
      $("html, body").animate({
         scrollTop: 0
       }, 400);
       return false;
    });

  };

  $(document).ready(function() {
    init();
  });

})(jQuery);

// Site :: PhotoSwipe JS
(function($) {

  $(document).ready(function() {

    var gallery = $('.photoswipe');

    gallery.each(function() {
      $(this).find('.photoswipe__image').jqPhotoSwipe({
        forceSingleGallery: true
      });
    });
  });

})(jQuery);

// Site :: CounterUP JS
(function($) {

  $(document).ready(function() {
    $('.counter-up').counterUp();
  });

})(jQuery);

// Site :: Header top priority nav
(function($) {

  function init() {

    var nav = priorityNav.init({
        mainNavWrapper: '.main-nav', // mainnav wrapper selector (must be direct parent from mainNav)
        mainNav: '.main-nav__list', // mainnav selector. (must be inline-block)
        navDropdownLabel: 'Еще...',
        navDropdownClassName: 'nav-dropdown', // class used for the dropdown.
        navDropdownToggleClassName: 'nav-dropdown__toggle', // class used for the dropdown toggle.
        breakPoint: 0,
        throttleDelay: 50,
        count: true
    });

  }

  $(document).ready(function() {
    init();
  });

})(jQuery);

// Site :: Fixed header
(function($) {

  var init = function() {

    // Hide Header on on scroll down
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('header.header').outerHeight();

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight){
            // Scroll Down
            $('header.header').removeClass('header--is-down').addClass('header--is-up');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $('header.header').removeClass('header--is-up').addClass('header--is-down');
            }
        }

        if (st > navbarHeight) {
          $('header.header').addClass('header--with-bg');
        } else {
          $('header.header').removeClass('header--with-bg');
        }

        lastScrollTop = st;
    }

  };

  $(document).ready(function() {
    init();
  });

})(jQuery);

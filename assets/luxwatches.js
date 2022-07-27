(function ($) {
    var body = $('body'),
        doc = $(document),
        html = $('html'),
        win = $(window),
        wrapperOverlaySlt = '.wrapper-overlay',
        iconNav,
        dropdownCart,
        miniProductList;   

    var wishListsArr = localStorage.getItem('wishListsArr') ? JSON.parse(localStorage.getItem('wishListsArr')) : [];
    var compareArr = localStorage.getItem('compareArr') ? JSON.parse(localStorage.getItem('compareArr')) : [];

    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
    localStorage.setItem('compareArr', JSON.stringify(compareArr));
    
    if (wishListsArr.length) {
        wishListsArr = JSON.parse(localStorage.getItem('wishListsArr'));
    }; 

    if (compareArr.length) {
        compareArr = JSON.parse(localStorage.getItem('compareArr'));
    }; 
    
    doc.ready(function () {
        iconNav = $('[data-menu-mb-toogle]'),
        dropdownCart = $('#dropdown-cart'),
        miniProductList = dropdownCart.find('.mini-products-list');

        doc.ajaxStart(function () {
            luxwatches.isAjaxLoading = true;
        });

        doc.ajaxStop(function () {
            luxwatches.isAjaxLoading = false;
        });

        luxwatches.init();

        doc
            .on('shopify:section:load', luxwatches.initSlideshow)
            .on('shopify:section:unload', luxwatches.initSlideshow)

            .on( 'shopify:section:load', luxwatches.SlicksliderHP )
            .on( 'shopify:section:unload', luxwatches.SlicksliderHP)

            .on('shopify:section:load', luxwatches.initBrandsSlider)
            .on('shopify:section:unload', luxwatches.initBrandsSlider)
    });

    var winWidth = win.innerWidth();   
   
    win.off('resize.initMenuMobile').on('resize.initMenuMobile', function() {
        var resizeTimerId;

        clearTimeout(resizeTimerId);

        resizeTimerId = setTimeout(function() {
            var curWinWidth = win.innerWidth();

            if ((curWinWidth < 1200 && winWidth >= 1200) || (curWinWidth >= 1200 && winWidth < 1200)) {
                luxwatches.showHideMenuMobile();
                luxwatches.initToggleMuiltiLangCurrency();
                luxwatches.addTextMuiltiOptionActive($('.lang-switcher'), $('.lang-switcher [data-value].active'), $('[data-language-label]'));
                luxwatches.addTextMuiltiOptionActive($('.currencies'), $('.currencies [data-currency].active'), $('[data-currency-label]'));
                luxwatches.initDropdownColFooter();
                luxwatches.dropdownCart();
                luxwatches.dropdownCustomer();
                luxwatches.appendMenuMobile();
                luxwatches.stickyFixedTopMenu();
            };
            winWidth = curWinWidth;
        }, 0);
    });

    win.on('resize', function () {
        luxwatches.setActiveViewModeMediaQuery();
    });

    var luxwatches = {
        luxwatchesTimeout: null,
        isSidebarAjaxClick: false,
        isAjaxLoading: false,
        init: function () {
            this.closeHeaderTop();
            this.cookie_popup();
            this.showHideMenuMobile();
            this.closeAllOnMobile();
            this.initToggleMuiltiLangCurrency();
            this.addTextMuiltiOptionActive($('.lang-switcher'), $('.lang-switcher [data-value].active'), $('[data-language-label]'));
            this.addTextMuiltiOptionActive($('.currencies'), $('.currencies [data-currency].active'), $('[data-currency-label]'));
            this.initDropdownColFooter();
            this.initScrollTop();
            this.dropdownCart();
            this.initColorSwatchGrid();
            this.appendMenuMobile();
            this.appendLanguagefooter2();
            this.dropdownCustomer();
            this.initDropdownSearchMobile();
            this.initToggleRightMenu();
            this.initToggleDropdownSearch();
            this.initToggleDropwdownCart();
            this.initCloseRightPopup();
            this.initNewsLetterPopup();
            this.addEventShowOptions();
            this.changeQuantityAddToCart();
            this.initAddToCart();
            this.checkbox_checkout();

            this.addEventLookbookModal();
            this.initCountdown();
            this.initCountdownNormal();

            this.SlicksliderHP();

            this.sliderMegaMenu();
            this.sliderExtraOptions();

            if(body.hasClass('template-index') || body.hasClass('template-page')) {
                this.initSlideshow();
                this.initBrandsSlider();
            };

            if(body.hasClass('template-index')) {
                this.initInfiniteScrollingHomepage();
                this.clickedActiveProductTabs();
            }

            if(body.hasClass('template-list-collections')) {
                this.initCollectionPagging();
            }

            if(body.hasClass('template-collection') || body.hasClass('template-search')) {
                this.initInfiniteScrolling();
                this.initPaginationPage();
                this.initCompareIcons();
                this.doAddOrRemoveCompare();
                this.initCompareSelected();
                this.hide_filter();
            }            

            if(body.hasClass('template-collection')) {               
                this.filterToolbar();
                this.filterSidebar();
            }

            if(body.hasClass('template-')){
                $('html, body').animate({
                    scrollTop: 0
                }, 800);
            }

            this.InitsidebarFilter();
            this.initSidebar();
            this.initProductMoreview($('[data-more-view-product] .product-img-box'));
            this.initSoldOutProductShop();
            this.initCustomerViewProductShop();                       
            this.initChangeQuantityButtonEvent();
            this.initQuantityInputChangeEvent();
            this.changeQuantityDropdownCart();
            
            this.removeCartItem();
            this.initZoom();

            this.initQuickView();
            this.stickyFixedTopMenu();

            if(body.hasClass('template-product') ) {
                this.changeSwatch('#add-to-cart-form .swatch :radio');
                this.productPageInitProductTabs();
                this.productPageInitProductTabs1();
                this.initStickyAddToCart();
                this.clickedActiveProductTabs1();
                this.customEngraving();
                this.initGroupedAddtoCart();
                this.initGroupSlider();
            }

            if($('.template-cart').length) {
                this.initCartQty();
                this.initUpdateCart();
                this.initFreeShippingMessage();
             };

            this.initWishListIcons();
            this.doAddOrRemoveWishlish();

            if(body.hasClass('template-page') && $('.wishlist-page').length) {
                this.initWishLists();           
            };
        },
        cookie_popup: function() {
          $('#accept-cookies').show();
          if ($.cookie('cookieMessage') == 'closed') {
            $('#accept-cookies').remove();
          }

          $('#accept-cookies .btn-accept').bind('click',function(){
            $('#accept-cookies').remove();
            $.cookie('cookieMessage', 'closed', {expires:1, path:'/'});
          });
        },
        showHideMenuMobile: function () {
            if (iconNav.length && iconNav.is(':visible')) {
                iconNav.off('click.showMenuMobile').on('click.showMenuMobile', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.toggleClass('translate-overlay');
                    $('.close-menu-mb').toggleClass('menu-open');

                    $('.main-menu.jas-mb-style').css({
                        "overflow": ""
                    });
                    $('.site-nav').find('[data-toggle-menu-mb]').parent().next('.sub-menu-mobile').removeClass('sub-menu-open');
                })
            };
        },
        closeAllOnMobile: function () {
            body.off('click.close', wrapperOverlaySlt).on('click.close', wrapperOverlaySlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                html.removeClass('translate-overlay cart-show customer-show search-show sidebar-open options-show');
                $('.close-menu-mb').removeClass('menu-open');

                $('.main-menu.jas-mb-style').css({
                    "overflow": ""
                });
                $('.site-nav').find('[data-toggle-menu-mb]').parent().next('.sub-menu-mobile').removeClass('sub-menu-open');
            });
        },
        initToggleMuiltiLangCurrency: function () {
            var langCurrencyGroups = $('.lang-currency-groups'),
                dropdownGroup = langCurrencyGroups.find('.btn-group'),
                dropdownLabel = dropdownGroup.find('.dropdown-label');

            if (dropdownLabel.length) {
                dropdownLabel.off('click.toggleMuiltiOption').on('click.toggleMuiltiOption', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var selfNextDropdown = $(this).next();

                    if (!selfNextDropdown.is(':visible')) {
                        dropdownLabel.next('.dropdown-menu').hide();
                        selfNextDropdown.slideDown(300);
                    } else {
                        selfNextDropdown.slideUp(300);
                    }
                });

                luxwatches.hideMuiltiLangCurrency();
            } else {
                dropdownLabel.next('.dropdown-menu').css({
                    'display': ''
                });
            };
        },

        closeHeaderTop: function () {
            var headerTopEml = $('.header-top'),
                closeHeaderTopElm = headerTopEml.find('[data-close-header-top]');

            if (closeHeaderTopElm.length && closeHeaderTopElm.is(':visible')) {
                if ($.cookie('headerTop') == 'closed') {
                    headerTopEml.remove();

                };

                closeHeaderTopElm.off('click.closeHeaderTop').on('click.closeHeaderTop', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    headerTopEml.remove();
                    $.cookie('headerTop', 'closed', {
                        expires: 1,
                        path: '/'
                    });
                });
            };
        },

        hideMuiltiLangCurrency: function () {
            doc.off('click.hideMuiltiLangCurrency').on('click.hideMuiltiLangCurrency', function (e) {
                var muiltiDropdown = $('.lang-currency-groups .dropdown-menu');

                if (!muiltiDropdown.is(e.target) && !muiltiDropdown.has(e.target).length) {
                    muiltiDropdown.slideUp(300);
                }
            });
        },

        addTextMuiltiOptionActive: function (SltId, dataSlt, label) {
            if (label.length && label.is(':visible')) {
                var item = dataSlt.html();

                SltId.prev(label).html(item);
            };
        },

        initSlideshow: function () {
            var slickSlideshow = $('[data-init-slideshow]');                

            if (slickSlideshow.length) {
                slickSlideshow.each(function () {
                    var self = $(this),
                        auto_playvideo = self.data('auto-video');

                    if(auto_playvideo) {   
                        // POST commands to YouTube or Vimeo API
                        function postMessageToPlayer(player, command) {
                            if (player == null || command == null) return;
                            player.contentWindow.postMessage(JSON.stringify(command), "*");
                        }

                        // When the slide is changing
                        function playPauseVideo(slick, control) {
                            var currentSlide, player, video;

                            currentSlide = slick.find('.slick-current');
                            player = currentSlide.find("iframe").get(0);

                            if (currentSlide.hasClass('slide-youtube')) {                                          
                                switch (control) {
                                    case "play":                                   
                                        postMessageToPlayer(player, {
                                            "event": "command",
                                            "func": "mute"
                                        });
                                        postMessageToPlayer(player, {
                                            "event": "command",
                                            "func": "playVideo"
                                        });
                                        break;

                                    case "pause":
                                        postMessageToPlayer(player, {
                                            "event": "command",
                                            "func": "pauseVideo"
                                        });
                                        break;
                                }

                            } else if (currentSlide.hasClass('slide-video')) {
                                video = currentSlide.children("video").get(0);

                                if (video != null) {
                                    if (control === "play"){
                                        video.play();
                                    } else {
                                        video.pause();
                                    }
                                }
                            };
                        };

                        self.on('init', function(slick) {
                            slick = $(slick.currentTarget);

                            setTimeout(function(){
                                playPauseVideo(slick,"play");
                            }, 1000);
                        });

                        self.on("beforeChange", function(event, slick) {
                            slick = $(slick.$slider);                           
                            playPauseVideo(slick,"pause");
                        });

                        self.on("afterChange", function(event, slick) {
                            slick = $(slick.$slider);                            
                            playPauseVideo(slick,"play");
                        });
                    };

                    if (self.not('.slick-initialized')) {
                        self.slick({
                            dots: self.data('dots'),
                            slidesToScroll: 1,
                            verticalSwiping: false,
                            fade: self.data('fade'),
                            cssEase: "ease",
                            adaptiveHeight: true,
                            autoplay: self.data('autoplay'),
                            autoplaySpeed: self.data('autoplaySpeed'),
                            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
                            responsive: [{
                                breakpoint: 1280,
                                settings: {
                                    arrows: false,
                                    dots: self.data('dots'),
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: false,
                                    autoplay: true,
                                    dots: true
                                }
                            }
                            ]
                        });
                    };
                });
            };
        },

        Slickslider: function(dataslick, infinite, row, rowlt, rowtb, rowtblg, rowbm, arrows, dots, auto, fade, arrowsmb, dotsmb){
            dataslick.not('.slick-initialized').slick({
                infinite: infinite,
                slidesToShow: row,
                slidesToScroll: 1,
                arrows: arrows,
                dots: dots,
                fade: fade,
                autoplay:auto,
                autoplaySpeed: 5000,
                nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                speed : 500,  
                responsive: [
                   {
                    breakpoint: 1450,
                    settings: {
                      slidesToShow: rowlt,
                      slidesToScroll: 1,
                      dots: dots,
                      arrows: arrows,
                      autoplay:auto,
                    }
                  },
                  {
                    breakpoint: 1281,
                    settings: {
                      slidesToShow: rowtb,
                      slidesToScroll: 1,
                      dots: dots,
                      arrows: arrows,
                      autoplay:auto,
                    }
                  },
                  {
                    breakpoint: 1025,
                    settings: {
                      slidesToShow: rowtb,
                      slidesToScroll: rowtb,
                      dots: dotsmb,
                      arrows: arrowsmb,
                      autoplay:auto,
                    }
                  },
                  {
                    breakpoint: 992,
                    settings: {
                      slidesToShow: rowtblg,
                      slidesToScroll: rowtblg,
                      dots: dotsmb,
                      arrows: arrowsmb,
                      autoplay:auto,
                    }
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: rowbm,
                      slidesToScroll: rowbm,
                      dots: dotsmb,
                      arrows: arrowsmb,
                      autoplay:auto,
                    }
                  },
                  {
                    breakpoint: 370,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      dots: dotsmb,
                      arrows:arrowsmb,
                      autoplay:auto,
                    }
                  }
                ]
            });
        },

        SlicksliderHP: function() {
              $('.has-slick').each(function(){
                var slick = $(this),
                    row = $(this).data('row'),
                    rowlt = $(this).data('rowlt'),
                    rowtb = $(this).data('rowtb'),
                    rowtblg = $(this).data('rowtblg'),
                    rowbm = $(this).data('rowbm'),
                    infinite = $(this).data('infinite');

                if($(this).hasClass('has-dots')){
                  var dots = true;
                }
                
                if($(this).hasClass('not-arrows')){
                  var arrows = false,
                      dots = true,
                      auto = false,
                      fade = $(this).data('fade');
                }
                else if ($(this).hasClass('has-dots')) {
                    var arrows = true,
                      dots = true,
                      auto = false,
                      fade = false;
                }
                else {
                  var arrows = true,
                      dots = false,
                      auto = false,
                      fade = false;
                }

                if($(this).hasClass('has-arrows')){

                  var arrowsmb = false,
                      dotsmb= true;

                } else{
                  var arrowsmb= false,
                      dotsmb= true;
                }

                luxwatches.Slickslider(slick, infinite, row, rowlt, rowtb, rowtblg, rowbm, arrows, dots, auto, fade, arrowsmb, dotsmb);
              });
        },

        initInfiniteScrollingHomepage: function () {
            var newArrivalsProduct = $('[data-new-arrivals-product]');

            newArrivalsProduct.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    productsToShow = productGrid.data('products-to-show'),
                    showMorebtn = self.find('.infinite-scrolling-homepage a'),
                    noMoreText = window.inventory_text.no_more_product;

                if (productGrid.find('.grid-item:hidden').length) {
                    showMorebtn.off('click.showMoreProduct').on('click.showMoreProduct', function (e) {
                        e.preventDefault();

                        if (productGrid.find('.grid-item:hidden').length > 0) {
                            productGrid.find('.grid-item:hidden:lt(' + productsToShow + ')').each(function () {
                                $(this).show();
                            });

                            win.scroll();
                        };

                        if (!productGrid.find('.grid-item:hidden').length) {
                            if (window.multi_lang && translator.isLang2())
                                noMoreText = window.lang2.collections.general.no_more_product;
                            showMorebtn.html(noMoreText).addClass('disabled');
                        };

                    });
                } else {
                    if (window.multi_lang && translator.isLang2())
                        noMoreText = window.lang2.collections.general.no_more_product;
                    showMorebtn.html(noMoreText).addClass('disabled');
                }
            });
        },

        initBrandsSlider: function () {
            this.brandsStyle();
        },

        brandsStyle: function() {
            var brandsSlider = $('[data-brands-slider]');

            brandsSlider.each(function () {
                var self = $(this);

                if (self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: self.data('rows'),
                        slidesToScroll: 1,
                        dots: false,
                        infinite: false,
                        autoplay: false,
                        speed: 800,                        
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        responsive: [{
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 4,
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                }
                            }
                        ]
                    });
                }
            });
        },

        initGroupSlider: function (){
            var slick = $(".group_content");

            slick.slick({
                slidesToScroll: 3,
                slidesToShow: 3,
                dots: false,
                infinite: false,
                nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                responsive: [{
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        }
                    }
                ]
            });
        },

        initDropdownColFooter: function () {
            var footerTitle = $('.footer .dropdow-mb');

            if (window.innerWidth < 768) {
                if (footerTitle.length) {
                    footerTitle.off('click.slideToggle').on('click.slideToggle', function () {
                        $(this).next().slideToggle();
                        $(this).toggleClass('open');
                    });
                }
            } else {
                footerTitle.next().css({
                    "display": ""
                });
            }
        },

        initScrollTop: function () {
            var backToTop = $('#back-top');

            win.scroll(function () {
                if ($(this).scrollTop() > 220) {
                    backToTop.fadeIn(400);
                } else {
                    backToTop.fadeOut(400);
                };
            });

            backToTop.off('click.scrollTop').on('click.scrollTop', function (e) {
                e.preventDefault();
                e.stopPropagation();

                $('html, body').animate({
                    scrollTop: 0
                }, 400);
                return false;
            });
        },

        dropdownCustomer: function () {
            this.initDropdownMobileTranslate($('[data-user-mobile-toggle]'), 'customer-show');
            this.closeDropdownCustomerTranslate();
        },

        closeDropdownCustomerTranslate: function () {
            luxwatches.closeTranslate('#dropdown-customer .close-customer', 'customer-show');
        },

        initDropdownSearchMobile: function () {
            this.initDropdownMobileTranslate($('[data-search-toogle-mobile]'), 'search-show');
            this.closeTranslate('.search-form .close-search', 'search-show');
        },

        initDropdownMobileTranslate: function (iconMoblie, sltShowIconMoblie) {
            if (iconMoblie.length && iconMoblie.is(':visible')) {
                iconMoblie.off('click.dropdownMobile').on('click.dropdownMobile', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.addClass(sltShowIconMoblie);
                });
            };
        },

        closeTranslate: function (closeElm, classRemove) {
            if ($(closeElm).length) {
                body.off('click.closedropdownMobile', closeElm).on('click.closedropdownMobile', closeElm, function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.removeClass(classRemove);
                });


            };

            body.off("click.closeSidebar").on("click.closeSidebar", function(e){
                 
                // console.log($(e.target).parents(".sidebar").length);
                if( html.hasClass('sidebar-open') && $(e.target).parents(".sidebar").length ){
                     return true;
                }
                else if (html.hasClass('sidebar-open') && $(e.target).parents(".sidebar-label").length == 0 ) {
                    
                    html.removeClass('sidebar-open');
                    
                }
            });
        },  
          
        initToggleRightMenu: function() {
            luxwatches.OpenRightPopup($('.right-nav .icon-nav'), '#right-nav-dropdown');
        },
        initToggleDropdownSearch: function() {
            luxwatches.OpenRightPopup($('.nav-search > .icon-search'), '.search-form');
        },
        initToggleDropwdownCart: function() {
            luxwatches.OpenRightPopup($('.wrapper-top-cart .cart-icon'), '#dropdown-cart');
        },
        OpenRightPopup: function (icon, parentSlt) {
            icon.off('click.toogleDropdown').on('click.toogleDropdown', function(e) {

                e.preventDefault();
                e.stopPropagation();

                if ($('body').hasClass('has_sticky')) {
                    var heightHeader = $('.header-bottom').outerHeight();
                    if ($(window).innerWidth() >= 1200) {
                        $('.dropdown-border', $(document)).css('top',heightHeader+'px');
                        $('.dropdown-border.menu-open').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                        $('.dropdown-border').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                    }
                } else {
                    var heightHeader = $('.site-header').outerHeight();
                    if ($(window).innerWidth() >= 1200) {
                        $('.dropdown-border', $(document)).css('top',heightHeader+'px');
                        $('.dropdown-border').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                        $('.dropdown-border.menu-open').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                    } 
                }

                if (parentSlt == '#right-nav-dropdown') {
                    $('.nav-search > .icon-search').removeClass('menu-open');
                    $('.wrapper-top-cart .cart-icon').removeClass('menu-open');
                    $('.search-form').removeClass('menu-open');
                    $('#dropdown-cart').removeClass('menu-open');
                }  

                else if (parentSlt == '.search-form') {
                    $('.right-nav .icon-nav').removeClass('menu-open');
                    $('.wrapper-top-cart .cart-icon').removeClass('menu-open');
                    $('#right-nav-dropdown').removeClass('menu-open');
                    $('#dropdown-cart').removeClass('menu-open');
                } 

                else if (parentSlt == '#dropdown-cart') {
                    $('.right-nav .icon-nav').removeClass('menu-open');
                    $('.nav-search > .icon-search').removeClass('menu-open');
                    $('#right-nav-dropdown').removeClass('menu-open');
                    $('.search-form').removeClass('menu-open');
                    luxwatches.initFreeShippingMessage();
                    
                } 

                $(parentSlt).toggleClass('menu-open');
                $(parentSlt).parent().find('[data-dropdown-menu]').toggleClass('menu-open');
                $(parentSlt).css('top',heightHeader);

                body.toggleClass('has-right-popup');

                if ($('#right-nav-dropdown').hasClass('menu-open') || $('.search-form').hasClass('menu-open') || $('#dropdown-cart').hasClass('menu-open')) {
                    body.addClass('has-right-popup');
                } else {
                    body.removeClass('has-right-popup');
                }

                luxwatches.initToggleMuiltiLangCurrency();
                
            });
        },
        initCloseRightPopup: function () {
            var dropdownRightNav = '#right-nav-dropdown';
            var dropdownSearch = '.search-form';
            var dropdownCart = '#dropdown-cart';
            var iconMenu = $('[data-dropdown-menu]');

            doc.off('click.closeRightPopup').on('click.closeRightPopup', function(e) {   

                if ((!$(e.target).closest(dropdownRightNav).length && $('#right-nav-dropdown').hasClass('menu-open')) || (!$(e.target).closest(dropdownCart).length && $('#dropdown-cart').hasClass('menu-open')) || (!$(e.target).closest(dropdownSearch).length && $('.search-form').hasClass('menu-open'))) {
                    $('#right-nav-dropdown').removeClass('menu-open');
                    $('.search-form').removeClass('menu-open');
                    $('#dropdown-cart').removeClass('menu-open');

                    iconMenu.removeClass('menu-open');
                    body.removeClass('has-right-popup');
                }
            });
        },
        dropdownCart: function () {           
            this.closeDropdownCartTranslate();
            this.initDropdownCartMobile();
            this.initDropdownCartDesktop();
            this.checkItemsInDropdownCart();
            this.removeItemDropdownCart();
        },

        appendDropdownCartForMobile: function () {
            var wrapperTopCart = $('.wrapper-top-cart');

            if (window.innerWidth < 1200) {
                dropdownCart.appendTo(body);
            } else {
                dropdownCart.appendTo(wrapperTopCart);
            }
        },

        closeDropdownCartTranslate: function () {
            luxwatches.closeTranslate('#dropdown-cart .close-cart', 'cart-show');
        },

        initDropdownCartMobile: function () {
            var headerMb = $('.header-mb, [data-cart-header-parallax], [data-cart-header-02], [data-cart-header-04], [data-cart-header-supermarket]'),
                cartIcon = headerMb.find('[data-cart-toggle]');

            cartIcon.off('click.initDropdownCartMobile').on('click.initDropdownCartMobile', function (e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('cart-show');
                luxwatches.initFreeShippingMessage();
            });
        },

        initDropdownCartDesktop: function () {
            luxwatches.appendDropdownCartForMobile();
        },

        addEventShowOptions: function() {
            var optionsIconSlt = '[data-show-options]';

            doc.off('click.showOptions', optionsIconSlt).on('click.showOptions', optionsIconSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('options-show');
            });

            luxwatches.closeTranslate('.lang-currency-groups .close-option', 'options-show');
        },

        checkItemsInDropdownCart: function () {
            var cartNoItems = dropdownCart.find('.no-items'),
                cartHasItems = dropdownCart.find('.has-items');

            if (miniProductList.children().length) {
                cartHasItems.show();
                cartNoItems.hide();
            } else {
                cartHasItems.hide();
                cartNoItems.show();
            };
        },

        removeItemDropdownCart: function (cart) {
            var btnRemove = dropdownCart.find('.btn-remove');

            btnRemove.off('click.removeCartItem').on('click.removeCartItem', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var productId = $(this).parents('.item').attr('id');
                productId = productId.match(/\d+/g);

                Shopify.removeItem(productId, function (cart) {
                    luxwatches.doUpdateDropdownCart(cart);
                    luxwatches.initFreeShippingMessage();
                });
            });
        },

        updateDropdownCart: function () {
            Shopify.getCart(function (cart) {
                luxwatches.doUpdateDropdownCart(cart);
            });
        },

        doUpdateDropdownCart: function (cart) {
            var template = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-details"><a href="javascript:void(0)" title="Remove This Item" class="btn-remove"><svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10 fa-2x"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg></a><div class="product-name-wrap"><a class="product-name" href="{URL}">{TITLE}</a><div class="option"><small>- {VARIANT}</small></div></div><div class="cart-collateral"><div class="qty-group"><a href="#" class="minus button" data-minus></a><input class="qtyak" type="text" name="updates[]" id="updates_{ID}" value="{QUANTITY}"><a href="#" class="plus button" data-plus></a></div><span class="price">{PRICE}</span></div></div></li>';

            $('[data-cart-count]').text(cart.item_count);

            dropdownCart.find('.summary .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

            miniProductList.html('');

            if (cart.item_count > 0) {
                for (var i = 0; i < cart.items.length; i++) {
                    var item = template;

                    item = item.replace(/\{ID\}/g, cart.items[i].id);
                    item = item.replace(/\{URL\}/g, cart.items[i].url);
                    item = item.replace(/\{TITLE\}/g, luxwatches.translateText(cart.items[i].product_title));
                    item = item.replace(/\{VARIANT\}/g, cart.items[i].variant_title || '');
                    item = item.replace(/\{QUANTITY\}/g, cart.items[i].quantity);
                    item = item.replace(/\{IMAGE\}/g, Shopify.resizeImage(cart.items[i].image, '160x'));
                    item = item.replace(/\{PRICE\}/g, Shopify.formatMoney(cart.items[i].price, window.money_format));

                    miniProductList.append(item);
                }

                luxwatches.removeItemDropdownCart(cart);

                if (luxwatches.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '#dropdown-cart span.money', 'money_format');
                }
                  
            } else {
              $('.free_shipping_progress').hide();
              $('.free_shipping_massage1').hide();
              $('.no-items').show();
            }

            luxwatches.checkItemsInDropdownCart();
        },

        translateText: function (str) {
            if (!window.multi_lang || str.indexOf("|") < 0)
                return str;

            if (window.multi_lang) {
                var textArr = str.split("|");

                if (translator.isLang2())
                    return textArr[1];
                return textArr[0];
            };
        },

        checkNeedToConvertCurrency: function () {
            return window.show_multiple_currencies && Currency.currentCurrency != shopCurrency;
        },

        initColorSwatchGrid: function () {
            var itemSwatchSlt = '.item-swatch li label';

            body.off('click.toggleClass').on('click.toggleClass', itemSwatchSlt, function () {
                var self = $(this),
                    productItemElm = self.closest('.grid-item'),
                    sidebarWidgetProduct = productItemElm.closest('.sidebar-widget-product');

                $('.item-swatch li label').removeClass('active');
                self.addClass('active');

                var newImage = self.data('img');

                if (sidebarWidgetProduct.length) {
                    newImage = newImage.replace('600x', 'large');
                }

                if (newImage) {
                    productItemElm.find('.product-grid-image .images-one').attr({
                        src: newImage,
                        "data-src": newImage
                    });

                    return false;
                }
            });
        },

        showLoading: function () {
            $('.loading-modal').show();
        },

        hideLoading: function () {
            $('.loading-modal').hide();
        },

        showModal: function (selector) {
            $(selector).fadeIn(500);

            luxwatches.luxwatchesTimeout = setTimeout(function () {
                $(selector).fadeOut(500);
            }, 5000);
        },

        translateBlock: function (blockSelector) {
            // if (window.multi_lang && translator.isLang2()) {
            //     translator.doTranslate(blockSelector);
            // }
        },

        closeLookbookModal: function () {
            $('.ajax-lookbook-modal').fadeOut(500);
        },

        addEventLookbookModal: function () {
            body.off('click.addEvenLookbookModal touchstart.addEvenLookbookModal', '[data-lookbook-icon]').on('click.addEvenLookbookModal touchstart.addEvenLookbookModal', '[data-lookbook-icon]', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var handle = $(this).data('handle'),
                    position = $(this);

                luxwatches.doAjaxAddLookbookModal(handle, position);

                doc.off('click.closeLookbookModal').on('click.closeLookbookModal', '[data-close-lookbook-modal], .ajax-lookbook-modal .overlay', function () {
                    luxwatches.closeLookbookModal();
                    return false;
                });
            });
        },

        doAjaxAddLookbookModal: function (handle, position) {
            var offSet = $(position).offset(),
                top = offSet.top,
                left = offSet.left,
                iconWidth = position.innerWidth(),
                innerLookbookModal = $('.ajax-lookbook-modal').innerWidth(),
                str3 = iconWidth + "px",
                str4 = innerLookbookModal + "px",
                newtop,
                newleft;


            if (window.innerWidth > 767) {
                if (left > (innerLookbookModal + 31)) {
                    newleft = "calc(" + left + "px" + " - " + str4 + " + " + "2px" + ")";
                } else {
                    newleft = "calc(" + left + "px" + " + " + str3 + " - " + "2px" + ")";
                }
                if (top > (innerLookbookModal + 31)) {
                    newtop = top - (innerLookbookModal / 2) + "px";
                } else {
                    newtop = top - 50 + "px";
                }
                
            } else {
                newleft = 0;
                newtop = top - 50 + "px";
            };

            if (luxwatches.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: window.router + '/products/' + handle + '?view=json',

                success: function (data) {
                    $('.ajax-lookbook-modal').css({
                        'left': newleft,
                        'top': newtop
                    });

                    $('.ajax-lookbook-modal .lookbook-content').html(data);

                    luxwatches.translateBlock('.lookbook-content');
                    $('.ajax-lookbook-modal').fadeIn(500);
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);

                    luxwatches.showModal('.ajax-error-modal');
                }
            });
        },

        clickedActiveProductTabs1: function () {
            var productTabsSection = $('[data-product-tabs1]');

            productTabsSection.each(function () {
                var self = $(this),
                    listTabs = self.find('.list-product-tabs'),
                    tabLink = listTabs.find('[data-product-tabTop1]'),
                    tabContent = self.find('[data-product-TabContent1]');

                var linkActive = self.find('.list-product-tabs .tab-links.active'),
                    activeTab = self.find('.product-tabs-content .tab-content.active');

                // tabContent.find('.products-grid').get(0).slick.setPosition();

                tabLink.off('click').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if($(this).hasClass('active')) {
                        return;
                    }

                    if (!$(this).hasClass('active')) {
                        var curTab = $(this),
                            curTabContent = $(curTab.data('target'));                          

                        tabLink.removeClass('active');
                        tabContent.removeClass('active');                

                        curTab.addClass('active');
                        curTabContent.addClass('active');
                        curTabContent.find('.products-grid').get(0).slick.setPosition();
                    };
                    
                });
            });
        },

        clickedActiveProductTabs: function () {
            var productTabsSection = $('[data-product-tabs]');

            productTabsSection.each(function () {
                var self = $(this),
                    listTabs = self.find('.list-product-tabs'),
                    tabLink = listTabs.find('[data-product-tabTop]'),
                    tabContent = self.find('[data-product-TabContent]');

                var linkActive = self.find('.list-product-tabs .tab-links.active'),
                    activeTab = self.find('.product-tabs-content .tab-content.active');

                luxwatches.doAjaxProductTabs(linkActive.data('href'), activeTab.find('.loading'), activeTab.find('.products-grid'));

                tabLink.off('click').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();


                    if($(this).hasClass('active')) {
                        return;
                    }

                    if (!$(this).hasClass('active')) {
                        var curTab = $(this),
                            curTabContent = $(curTab.data('target'));                          

                        tabLink.removeClass('active');
                        tabContent.removeClass('active');    

                        if (!curTabContent.find('.products-grid').hasClass('slick-initialized')) {
                            luxwatches.doAjaxProductTabs(curTab.data('href'), curTabContent.find('.loading'), curTabContent.find('.products-grid'));
                        }            

                        curTab.addClass('active');
                        curTabContent.addClass('active');
                    };
                });
            });
        },

        doAjaxProductTabs: function (handle, loadingElm, curTabContent) {
            $.ajax({
                type: "get",
                url: window.router + handle,

                beforeSend: function () {
                    loadingElm.html('<div class="lds-dual-ring"></div>');
                },

                success: function (data) {
                    loadingElm.hide();

                    if (handle == '/collections/?view=json' || handle == '/collections/?view=new-json') {
                        // loadingElm.text('Please link to collections').hide();
                    } else {
                        curTabContent.html($(data).find('.grid-item').html());

                        if(curTabContent.hasClass('collection-carousel')){
                            if (!curTabContent.hasClass('slick-initialized')) {
                                luxwatches.initProductTabsSlider(curTabContent.parent());
                            };
                        } else {
                            var row = curTabContent.data('row');
                            switch (row) {
                                case 3:
                                    var _class = 'col-lg-4';
                                    break;
                                case 4:
                                    var _class = 'col-lg-3';
                                    break;
                                case 5:
                                    var _class = 'col-lg-5';
                                    break;
                                case 6:
                                    var _class = 'col-lg-2';
                                    break;
                            }
                        };
                        curTabContent.find('.grid-item').addClass(_class);

                        if (luxwatches.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('.currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };

                        luxwatches.translateBlock('[data-product-tabs]');
                        luxwatches.initColorSwatchGrid();
                        luxwatches.initWishListIcons();
                        luxwatches.initCountdown();

                        luxwatches.luxwatchesTimeout = setTimeout(function () {
                            if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                            };
                        }, 1000);
                    };
                },

                error: function (xhr, text) {
                    loadingElm.text('Sorry, there are no products in this collection').show();
                }
            });
        },


        initProductTabsSlider: function (slt) {
            slt.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    gridItemWidth = productGrid.data('row');


                if (productGrid.not('.slick-initialized') && productGrid.find('.grid-item').length) {
                    productGrid.slick({
                        slidesToShow: productGrid.data('row'),
                        slidesToScroll: productGrid.data('row'),
                        dots: false,
                        infinite: false,
                        speed: 1000,
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        responsive: [
                             {
                                breakpoint: 1281,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 4,
                                    dots: true,
                                    arrows: false,
                                }
                            },
                            {
                                breakpoint: 1200,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    get slidesToShow() {
                                        if(self.hasClass('sections-has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToShow = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToShow = 3
                                            }else {
                                                return this.slidesToShow = 2
                                            }
                                        }

                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('sections-has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToScroll = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToScroll = 3
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    get slidesToShow() {
                                        if(self.hasClass('sections-has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if (gridItemWidth >= 3) {
                                                return this.slidesToShow = 3;
                                            } else {
                                                this.slidesToShow = 2
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('sections-has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 3) {
                                                return this.slidesToScroll = 3;
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    arrows: false,
                                    dots: true
                                }
                            }
                        ]
                    });
                }
            });
        },

        initCountdown: function () {
            var countdownElm = $('[data-countdown]');

            countdownElm.each(function () {
                var self = $(this),
                    countdownValue = self.data('countdown-value');

                self.countdown(countdownValue, function (event) {
 
                    $(this).html(event.strftime('' +
                        '<div class="clock-item"><span class="num">%D</span><span class="text">days</span></div>' +
                        '<div class="clock-item"><span class="num">%H</span><span class="text">hours</span></div>' +
                        '<div class="clock-item"><span class="num">%M</span><span class="text">mins</span></div>' +
                        '<div class="clock-item"><span class="num">%S</span><span class="text">secs</span></div>'));

                });
            });
        },

        initCountdownNormal: function () {
            var countdownElm = $('[data-countdown-normal]');

            countdownElm.each(function () {
                var self = $(this),
                    countdownValue = self.data('countdown-value');

                if(self.hasClass('countdown-suppermarket')) {
                    self.countdown(countdownValue, function (event) {
                        $(this).html(event.strftime('' +
                            '<div class="clock-item"><span class="num">%D</span><span>d</span></div>' +
                            '<div class="clock-item"><span class="num">%H</span>&nbsp;:</div>' +
                            '<div class="clock-item"><span class="num">%M</span>&nbsp;:</div>' +
                            '<div class="clock-item"><span class="num">%S</span></div>'));
                    });
                } else {
                    self.countdown(countdownValue, function (event) {
                        $(this).html(event.strftime('' +
                            '<div class="clock-item"><span class="num">%D</span><span>D</span>:</div>' +
                            '<div class="clock-item"><span class="num">%H</span><span>H</span>:</div>' +
                            '<div class="clock-item"><span class="num">%M</span><span>M</span>:</div>' +
                            '<div class="clock-item"><span class="num">%S</span><span>S</span></div>'));
                    });
                }
            });
        },

        sliderMegaMenu: function(){
          if($('.featuredProductCarousel').length){
            $('.featuredProductCarousel').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                arrows: true,
                autoplay: false,
                nextArrow: '<button type="button" class="slick-next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 20 20"><path d="M5 20c-0.128 0-0.256-0.049-0.354-0.146-0.195-0.195-0.195-0.512 0-0.707l8.646-8.646-8.646-8.646c-0.195-0.195-0.195-0.512 0-0.707s0.512-0.195 0.707 0l9 9c0.195 0.195 0.195 0.512 0 0.707l-9 9c-0.098 0.098-0.226 0.146-0.354 0.146z"></path></svg></button>',
                prevArrow: '<button type="button" class="slick-prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 20 20"><path d="M14 20c0.128 0 0.256-0.049 0.354-0.146 0.195-0.195 0.195-0.512 0-0.707l-8.646-8.646 8.646-8.646c0.195-0.195 0.195-0.512 0-0.707s-0.512-0.195-0.707 0l-9 9c-0.195 0.195-0.195 0.512 0 0.707l9 9c0.098 0.098 0.226 0.146 0.354 0.146z"></path></svg></button>',
                speed : 1000
            });      
          }
          $(".site-nav li").mouseover(function() {
              $('.featuredProductCarousel').get(0).slick.setPosition();
          }); 
        },

        sliderExtraOptions: function(){
              var productGrid = $('.extra-options .products-grid');
              if(productGrid.not('.slick-initialized')){
                productGrid.slick({
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    adaptiveHeight: true,
                    dots: false,
                    arrows: true,
                    autoplay: false,
                    nextArrow: '<button type="button" class="slick-next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 20 20"><path d="M5 20c-0.128 0-0.256-0.049-0.354-0.146-0.195-0.195-0.195-0.512 0-0.707l8.646-8.646-8.646-8.646c-0.195-0.195-0.195-0.512 0-0.707s0.512-0.195 0.707 0l9 9c0.195 0.195 0.195 0.512 0 0.707l-9 9c-0.098 0.098-0.226 0.146-0.354 0.146z"></path></svg></button>',
                    prevArrow: '<button type="button" class="slick-prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 20 20"><path d="M14 20c0.128 0 0.256-0.049 0.354-0.146 0.195-0.195 0.195-0.512 0-0.707l-8.646-8.646 8.646-8.646c0.195-0.195 0.195-0.512 0-0.707s-0.512-0.195-0.707 0l-9 9c-0.195 0.195-0.195 0.512 0 0.707l9 9c0.098 0.098 0.226 0.146 0.354 0.146z"></path></svg></button>',
                    speed : 1000
                });      
              }
        },
        appendMenuMobile: function() {
            var menuWrap = $('.header-pc .wrapper-navigation .nav-bar'),
                dropdownMenu = $('.site-nav'),
                menuWrapMobile = $('.jas-mb-style .nav-bar');

            if (window.innerWidth >= 1200) {
                dropdownMenu.appendTo(menuWrap);
            } else {
                dropdownMenu.appendTo(menuWrapMobile);
            }
            luxwatches.initToggleSubMenuMobile();
        },

        appendLanguagefooter2: function() {
            if(!$('.footer-2').length){
                return;
            }

        },

        initToggleSubMenuMobile: function() {
            var mainMenu = $('.main-menu.jas-mb-style'),
                siteNav = $('.site-nav'),
                iconDropdown = siteNav.find('[data-toggle-menu-mb]');

                
            iconDropdown.off('click.dropdownMenu').on('click.dropdownMenu', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var curParent = $(this).parent(),
                    curMenu = curParent.next('.sub-menu-mobile');

                if (curMenu.hasClass('sub-menu-open')) {
                    curMenu.removeClass('sub-menu-open');
                } else {
                    curMenu.addClass('sub-menu-open').css({
                        "overflow": ""
                    });
                    mainMenu.animate({
                        scrollTop: 0
                    }, 0);
                    mainMenu.css({
                        "overflow": "hidden"
                    });
                };
            });

            luxwatches.linkClickToggleSubMenuMobile(mainMenu);
        },

        linkClickToggleSubMenuMobile: function (mainMenu) {
            var menuMobile = $('.site-nav .dropdown'),
                iconDropdown = menuMobile.find('[data-toggle-menu-mb]'),
                menuMobileLabel = $('.sub-menu-mobile .menu-mb-title');

            if (iconDropdown.length && iconDropdown.is(':visible')) {

                menuMobile.off('click.current').on('click.current', function (e) {
                    e.stopPropagation();

                    $(this).children('.sub-menu-mobile').addClass('sub-menu-open').css({
                        "overflow": ""
                    });
                    mainMenu.animate({
                        scrollTop: 0
                    }, 0);
                    mainMenu.css({
                        "overflow": "hidden"
                    });
                });

                menuMobile.find('.menu__moblie').on('click', function (e) {
                    e.stopPropagation();
                });

                menuMobileLabel.off('click.closeMenu').on('click.closeMenu', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $(this).parent().removeClass('sub-menu-open');

                    if (!$(this).closest('.menu-lv-2').length) {
                        mainMenu.css({
                            "overflow": ""
                        });
                    };
                })
            };
        },

        openEmailModalWindow: function (newsletterWrapper) {
            newsletterWrapper.fadeIn(1000);
        },

        closeEmailModalWindow: function (newsletterWrapper,expire) {
            newsletterWrapper.fadeOut(1000);

            var inputChecked = newsletterWrapper.find('input[name="dismiss"]').prop('checked');

            if (inputChecked || !newsletterWrapper.find('input[name="dismiss"]').length)
                $.cookie('emailSubcribeModal', 'closed', {
                    expires: expire,
                    path: '/'
                });
        },

        initNewsLetterPopup: function () {
            if (window.newsletter_popup) {
                var newsletterWrapper = $('[data-newsletter]'),
                    closeWindow = newsletterWrapper.find('.close-window'),
                    delay = newsletterWrapper.data('delay'),
                    expire = newsletterWrapper.data('expire'),
                    modalContent = newsletterWrapper.find('.halo-modal-content');

                if ($.cookie('emailSubcribeModal') != 'closed') {
                    luxwatches.luxwatchesTimeout = setTimeout(function () {
                        luxwatches.openEmailModalWindow(newsletterWrapper);
                    }, delay);
                };

                closeWindow.click(function (e) {
                    e.preventDefault();

                    luxwatches.closeEmailModalWindow(newsletterWrapper,expire);
                });

                newsletterWrapper.on('click', function (e) {
                    if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                        luxwatches.closeEmailModalWindow(newsletterWrapper,expire);
                    };
                });

                $('#email_signup form').submit(function () {
                    if ($('#email_signup .email').val() != '') {
                        luxwatches.closeEmailModalWindow(newsletterWrapper,expire);
                    };
                });
            };
        },

        initSidebarProductSlider: function () {
            var sidebarWidgetProduct = $('[data-sidebar-product]');

            sidebarWidgetProduct.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid');

                if (productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 20 20"><path d="M5 20c-0.128 0-0.256-0.049-0.354-0.146-0.195-0.195-0.195-0.512 0-0.707l8.646-8.646-8.646-8.646c-0.195-0.195-0.195-0.512 0-0.707s0.512-0.195 0.707 0l9 9c0.195 0.195 0.195 0.512 0 0.707l-9 9c-0.098 0.098-0.226 0.146-0.354 0.146z"></path></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 20 20"><path d="M14 20c0.128 0 0.256-0.049 0.354-0.146 0.195-0.195 0.195-0.512 0-0.707l-8.646-8.646 8.646-8.646c0.195-0.195 0.195-0.512 0-0.707s-0.512-0.195-0.707 0l-9 9c-0.195 0.195-0.195 0.512 0 0.707l9 9c0.098 0.098 0.226 0.146 0.354 0.146z"></path></svg></button>',
                    });
                }
            });
        },

        initOpenSidebar: function () {
            var sidebarLabelSlt = '.sidebar-label',
                sidebarLabelElm = $(sidebarLabelSlt);

            if (sidebarLabelElm.length) {
                body.off('click.openSidebar').on('click.openSidebar', sidebarLabelSlt, function () {
                    html.addClass('sidebar-open');
                })
            }
        },

        closeSidebar: function () {
            luxwatches.closeTranslate('.sidebar .close-sidebar', 'sidebar-open');
        },

        initSidebar: function () {
            this.initSidebarProductSlider();
            this.initOpenSidebar();
            this.closeSidebar();
            this.initDropdownSubCategoriesAtSidebar();
            this.initToggleWidgetTitleSidebarFilter();
        },

        initDropdownSubCategoriesAtSidebar: function () {
            var iconDropdownSlt = '.sidebar-links .icon-dropdown';

            body.off('click.toggleSubCategories').on('click.toggleSubCategories', iconDropdownSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    parent = self.parent();

                if (parent.hasClass('open')) {
                    parent.removeClass('open');
                    self.next().slideUp();                   
                } else {
                    parent.addClass('open');
                    self.next().slideDown();
                };
            })
        },

        queryParams: function () {
            Shopify.queryParams = {};

            if (location.search.length) {
                for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                    aKeyValue = aCouples[i].split('=');

                    if (aKeyValue.length > 1) {
                        Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                    }
                }
            };
        },

        filterAjaxClick: function (baseLink) {
            delete Shopify.queryParams.page;

            var newurl = luxwatches.ajaxCreateUrl(baseLink);

            luxwatches.isSidebarAjaxClick = true;

            History.pushState({
                param: Shopify.queryParams
            }, newurl, newurl);
        },

        ajaxCreateUrl: function (baseLink) {
            var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');

            if (baseLink) {
                if (newQuery != "")
                    return baseLink + "?" + newQuery;
                else
                    return baseLink;
            }
            return location.pathname + "?" + newQuery;
        },

        filterToolbar: function () {
            this.queryParams();
            this.setTextForSortbyFilter();
            this.setTextForLimitedFilter();
            this.ajaxFilterSortby();
            this.ajaxFilterLimit();
            this.addEventViewModeLayout();
        },

        setTextForSortbyFilter: function () {
            var filterSortby = $('[data-sortby]'),
                labelTab = filterSortby.find('.label-tab'),
                labelText = labelTab.find('.label-text'),
                sortbyLinkActive = labelTab.next().find('li.active'),
                text = sortbyLinkActive.text();

            labelText.text(text);

            if (Shopify.queryParams.sort_by) {
                var sortBy = Shopify.queryParams.sort_by,
                    sortByLinkActive = filterSortby.find('span[data-href="' + sortBy + '"]'),
                    sortByText = sortByLinkActive.text();

                labelText.text(sortByText);
                labelTab.next().find('li').removeClass('active');
                sortByLinkActive.parent().addClass('active');
            };
        },

        setTextForLimitedFilter: function () {
            var filterLimited = $('[data-limited-view]'),
                labelTab = filterLimited.find('.label-tab'),
                labelText = labelTab.find('.label-text'),
                limitedLinkActive = labelTab.next().find('li.active'),
                text = limitedLinkActive.text();

            labelText.text(text);

            if (filterLimited.length) {
                var limited = filterLimited.find('li.active span').data('value'),
                    limitedActive = filterLimited.find('span[data-value="' + limited + '"]'),
                    limitedText = limitedActive.text();

                labelText.text(limitedText);
                labelTab.next().find('li').removeClass('active');
                limitedActive.parent().addClass('active');
            };
        },

        ajaxFilterSortby: function () {
            var sortbyFilterSlt = '[data-sortby] li span',
                sortbyFilter = $(sortbyFilterSlt);

            body.off('click.sortBy', sortbyFilterSlt).on('click.sortBy', sortbyFilterSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    parent = self.parent();

                if (!parent.hasClass('active')) {
                    Shopify.queryParams.sort_by = $(this).attr('data-href');

                    luxwatches.filterAjaxClick();

                    var newurl = luxwatches.ajaxCreateUrl();

                    luxwatches.doAjaxToolbarGetContent(newurl);
                };

                sortbyFilter.closest('.dropdown-menu').prev().trigger('click');
            });
        },

        ajaxFilterLimit: function () {
            var limitFilterSlt = '[data-limited-view] li',
                limitFilter = $(limitFilterSlt);

            body.off('click.sortBy', limitFilterSlt).on('click.sortBy', limitFilterSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    parent = self.parent();

                if (!self.hasClass('active')) {
                    var dataValue = self.children('.item-per-page-number').data('value'),
                        dataText = self.data('text'),
                        value = "" + dataValue + "";

                    // $('[data-limited-view] .label-tab .label-text').html('<span name="paginateBy" class="label-text">'+ value +' '+ dataText +'</span>');

                    $('[data-limited-view] .label-tab .label-text').text(value);
                    luxwatches.doAjaxLimitGetContent(value);
                };

                limitFilter.closest('.dropdown-menu').prev().trigger('click');
            });
        },

        doAjaxLimitGetContent: function (value) {
            if (luxwatches.isAjaxLoading) return;

            $.ajax({
                type: "Post",
                url: '/cart.js',
                data: {
                    "attributes[pagination]": value
                },

                success: function (data) {
                    window.location.reload();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    luxwatches.showModal('.ajax-error-modal');
                },
                dataType: 'json'
            });
        },

        doAjaxToolbarGetContent: function (newurl) {
            if (luxwatches.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    luxwatches.showLoading();
                },

                success: function (data) {
                    luxwatches.ajaxMapData(data);
                    luxwatches.initColorSwatchGrid();
                    luxwatches.setTextForSortbyFilter();

                    luxwatches.initSidebarProductSlider();                   
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    luxwatches.showModal('.ajax-error-modal');
                },

                complete: function () {
                    luxwatches.hideLoading();
                }
            });
        },

        filterSidebar: function () {
            this.queryParams();
            this.ajaxFilterTags();
            this.ajaxFilterClearTags();
            this.ajaxFilterClearAll();
        },

        ajaxFilterTags: function () {
            body.off('click.filterTags').on('click.filterTags', '.sidebar-tags .list-tags a, .sidebar-tags .list-tags label, .refined .selected-tag', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var newTags = [];

                if (Shopify.queryParams.constraint) {
                    newTags = Shopify.queryParams.constraint.split('+');
                };

                //one selection or multi selection
                if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(':checked')) {
                    //remove other selection first
                    var otherTag = $(this).closest('.sidebar-tags, .refined-widgets').find('input:checked');

                    if (otherTag.length) {
                        var tagName = otherTag.val();

                        if (tagName) {
                            var tagPos = newTags.indexOf(tagName);

                            if (tagPos >= 0) {
                                //remove tag
                                newTags.splice(tagPos, 1);
                            }
                        }
                    };
                };

                var tagName = $(this).prev().val();

                if (tagName) {
                    var tagPos = newTags.indexOf(tagName);

                    if (tagPos >= 0) {
                        newTags.splice(tagPos, 1);
                    } else {
                        newTags.push(tagName);
                    };
                };

                if (newTags.length) {
                    Shopify.queryParams.constraint = newTags.join('+');
                } else {
                    delete Shopify.queryParams.constraint;
                };

                luxwatches.filterAjaxClick();

                var newurl = luxwatches.ajaxCreateUrl();

                luxwatches.doAjaxSidebarGetContent(newurl);
            });
        },

        ajaxFilterClearTags: function () {
            var sidebarTag = $('.sidebar-tags');

            sidebarTag.each(function () {
                var sidebarTag = $(this);

                if (sidebarTag.find('input:checked').length) {
                    //has active tag
                    sidebarTag.find('.clear').show().click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var currentTags = [];

                        if (Shopify.queryParams.constraint) {
                            currentTags = Shopify.queryParams.constraint.split('+');
                        };

                        sidebarTag.find("input:checked").each(function () {
                            var selectedTag = $(this);
                            var tagName = selectedTag.val();

                            if (tagName) {
                                var tagPos = currentTags.indexOf(tagName);
                                if (tagPos >= 0) {
                                    //remove tag
                                    currentTags.splice(tagPos, 1);
                                };
                            };
                        });

                        if (currentTags.length) {
                            Shopify.queryParams.constraint = currentTags.join('+');
                        } else {
                            delete Shopify.queryParams.constraint;
                        };

                        luxwatches.filterAjaxClick();

                        var newurl = luxwatches.ajaxCreateUrl();

                        luxwatches.doAjaxSidebarGetContent(newurl);
                    });
                }
            });
        },

        ajaxFilterClearAll: function () {
            var clearAllSlt = '.refined-widgets a.clear-all';
            var clearAllElm = $(clearAllSlt);

            body.off('click.clearAllTags', clearAllSlt).on('click.clearAllTags', clearAllSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                delete Shopify.queryParams.constraint;

                luxwatches.filterAjaxClick();

                var newurl = luxwatches.ajaxCreateUrl();

                luxwatches.doAjaxSidebarGetContent(newurl);
            });
        },

        doAjaxSidebarGetContent: function (newurl) {
            if (luxwatches.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    luxwatches.showLoading();
                },

                success: function (data) {
                    luxwatches.ajaxMapData(data);
                    luxwatches.initColorSwatchGrid();
                    luxwatches.ajaxFilterClearTags();

                    luxwatches.initSidebarProductSlider();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    luxwatches.showModal('.ajax-error-modal');
                },

                complete: function () {
                    luxwatches.hideLoading();
                }
            });
        },

        ajaxMapData: function (data) {
            var curCollTemplate = $('.collection-template'),
                curBreadcrumb = curCollTemplate.find('.breadcrumb'),
                curSidebar = curCollTemplate.find('.sidebar'),
                curCollHeader = curCollTemplate.find('.collection-header'),
                curProColl = curCollTemplate.find('.product-collection'),
                curPadding = curCollTemplate.find('.padding'),

                newCollTemplate = $(data).find('.collection-template'),
                newBreadcrumb = newCollTemplate.find('.breadcrumb'),
                newSidebar = newCollTemplate.find('.sidebar'),
                newCollHeader = newCollTemplate.find('.collection-header'),
                newProColl = newCollTemplate.find('.product-collection'),
                newPadding = newCollTemplate.find('.padding');

            curBreadcrumb.replaceWith(newBreadcrumb);
            curSidebar.replaceWith(newSidebar);
            curCollHeader.replaceWith(newCollHeader);
            curProColl.replaceWith(newProColl);

            if (curPadding.length > 0) {
                curPadding.replaceWith(newPadding);
            } else {
                if(curCollTemplate.find('.col-main').length) {
                    curCollTemplate.find('.col-main').append(newPadding);
                } else {
                    curCollTemplate.find('.col-no-sidebar').append(newPadding);
                }
                
            };

            luxwatches.translateBlock('.collection-template');

            luxwatches.initWishListIcons();
          
            luxwatches.hide_filter();
           
            if ($('[data-view-as]').length) {
                luxwatches.viewModeLayout();
            };

            if (luxwatches.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            };

            if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
            };
        },

        initToggleWidgetTitleSidebarFilter: function () {
            var widgetTitleSlt = '[data-has-collapse] .widget-title';

            body.off('click.toggleWidgetContent').on('click.toggleWidgetContent', widgetTitleSlt, function () {
                $(this).toggleClass('open');
                $(this).next().slideToggle();
            });

            var widgetTitleSltCollNoSidebar = '[data-has-collapse-no-sidebar] .widget-title';

            if(win.innerWidth() < 1200) {
                body.off('click.toggleWidgetContent2').on('click.toggleWidgetContent2', widgetTitleSltCollNoSidebar, function () {
                    $(this).toggleClass('open');
                    $(this).next().slideToggle();
                });
            }             
        },

        initInfiniteScrolling: function () {
            var infiniteScrolling = $('.infinite-scrolling');
            var infiniteScrollingLinkSlt = '.infinite-scrolling a';

            if (infiniteScrolling.length) {

                body.off('click.initInfiniteScrolling', infiniteScrollingLinkSlt).on('click.initInfiniteScrolling', infiniteScrollingLinkSlt, function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!$(this).hasClass('disabled')) {
                        var url = $(this).attr('href');

                        luxwatches.doAjaxInfiniteScrollingGetContent(url);
                    };
                });

                if (window.infinity_scroll_feature) {
                    $(window).scroll(function () {
                        if (luxwatches.isAjaxLoading) return;

                        var collectionTplElm = $('[data-section-type="collection-template"]');

                        if (!collectionTplElm.length) {
                            collectionTplElm = $('[data-search-page]');
                        };

                        var collectionTop = collectionTplElm.offset().top;
                        var collectionHeight = collectionTplElm.outerHeight();
                        var posTop = collectionTop + collectionHeight - $(window).height();

                        console.log(collectionTop);


                        if ($(this).scrollTop() > posTop && $(this).scrollTop() < (posTop + 200)) {
                            var button = $(infiniteScrollingLinkSlt);

                            if (button.length && !button.hasClass('disabled')) {
                                var url = button.attr('href');

                                luxwatches.doAjaxInfiniteScrollingGetContent(url);
                            };
                        };
                    });
                };
            }
        },

        doAjaxInfiniteScrollingGetContent: function (url) {
            if (luxwatches.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: url,

                beforeSend: function () {
                    luxwatches.showLoading();
                },

                success: function (data) {
                    luxwatches.ajaxInfiniteScrollingMapData(data);
                    luxwatches.initColorSwatchGrid();
                    if ($('[data-view-as]').length) {
                        luxwatches.viewModeLayout();
                    };
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    luxwatches.showModal('.ajax-error-modal');
                },

                complete: function () {
                    luxwatches.hideLoading();
                }
            });
        },

        ajaxInfiniteScrollingMapData: function (data) {
            var collectionTemplate = $('.collection-template'),
                currentProductColl = collectionTemplate.find('.product-collection'),
                newCollectionTemplate = $(data).find('.collection-template'),
                newProductColl = newCollectionTemplate.find('.product-collection'),
                newProductItem = newProductColl.children('.grid-item').not('.banner-img');

            showMoreButton = $('.infinite-scrolling a');

            if (newProductColl.length) {
                currentProductColl.append(newProductItem);

                if ($('.collection-template .product-collection[data-layout]').length) {
                    luxwatches.luxwatchesTimeout = setTimeout(function () {
                        currentProductColl.isotope('appended', newProductItem).isotope('layout');
                    }, 700);
                }

                luxwatches.translateBlock('.product-collection');

                if ($(data).find('.infinite-scrolling').length > 0) {
                    showMoreButton.attr('href', newCollectionTemplate.find('.infinite-scrolling a').attr('href'));
                } else {
                    //no more products
                    var noMoreText = window.inventory_text.no_more_product;

                    if (window.multi_lang && translator.isLang2())
                        noMoreText = window.lang2.collections.general.no_more_product;

                    showMoreButton.html(noMoreText).addClass('disabled');
                };

                if (luxwatches.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };
  
                if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                    return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                };
            };
        },

        addEventViewModeLayout: function () {
            luxwatches.setActiveViewModeMediaQuery();

            body.on('click', '.view-mode .view-as', function (e) {
                e.preventDefault();

                var self = $(this),
                    parents = self.closest('[data-view-as]');

                if (!self.hasClass('active')) {
                    parents.find('.icon-mode').removeClass('active');
                    self.find('.icon-mode').addClass('active');

                    luxwatches.viewModeLayout();
                };

            });
        },

        viewModeLayout: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                viewAs = viewModeActive.data('view'),
                products = $('.collection-template .product-collection'),
                gridItem = products.find('.grid-item'),
                strClass = 'col-6 col-md-4 col-lg-3',
                gridClass = 'col-6 col-md-4 col-lg-3 products-grid';

            switch (viewAs) {
                case 'grid':
                    if(products.hasClass('column-1')){
                        products.removeClass('products-grid').addClass('products-list');
                        gridItem.removeClass(strClass).addClass('col-12');
                    }
                    else if(products.hasClass('column-2')){
                        products.removeClass('products-list').addClass('products-grid');
                        gridItem.removeClass(strClass).addClass('col-6');
                    }
                    else if(products.hasClass('column-3')){
                        products.removeClass('products-list').addClass('products-grid');
                        gridItem.removeClass(strClass).addClass('col-6 col-md-4');
                    } 
                    else if(products.hasClass('column-4')){
                        products.removeClass('products-list').addClass('products-grid');
                        gridItem.removeClass(strClass).addClass('col-6 col-md-4 col-lg-3');
                    }
                    else{
                        products.removeClass('products-list').addClass('products-grid');
                        gridItem.removeClass(strClass).addClass('col-6 col-md-4 col-lg-3 col5');
                    }
                    break;

                case 'list':
                    products.removeClass('products-grid').addClass('products-list');
                    gridItem.removeClass(strClass).addClass('col-12');
                    break;
            };
        },

        setActiveViewModeMediaQuery: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                col = viewModeActive.data('col'),
                windowWidth = window.innerWidth;

            if (windowWidth < 768) {
                if (col === 3 || col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="2"]').addClass('active');
                }
            } else if (windowWidth < 992 && windowWidth >= 768) {
                if (col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="3"]').addClass('active');
                }
            } else if (windowWidth < 1200 && windowWidth >= 992) {
                if (col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="4"]').addClass('active');
                }
            }

            if (viewMode.length) {
                luxwatches.viewModeLayout();
            }
        },

        initPaginationPage: function () {
            var paginationSlt = '.pagination-page a';

            body.off('click', paginationSlt).on('click', paginationSlt, function (e) {
              if (Shopify.queryParams) {
                e.preventDefault();

                var page = $(this).attr('href').match(/page=\d+/g);

                if (page) {
                  Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));

                  if (Shopify.queryParams.page) {
                    var newurl = luxwatches.ajaxCreateUrl();

                    luxwatches.isSidebarAjaxClick = true;

                    History.pushState({
                      param: Shopify.queryParams
                    }, newurl, newurl);

                    luxwatches.doAjaxToolbarGetContent(newurl);

                    var elm = $('[data-section-type="collection-template"] .toolbar');

                    if (!elm.length) {
                      elm = $('[data-search-page]');
                    }

                    var top = elm.offset().top;

                    $('body,html').animate({
                      scrollTop: top
                    }, 600);
                  };
                };
              };
            });
        },

        changeQuantityAddToCart: function () {
            var buttonSlt = '[data-minus-quantity], [data-plus-quantity]',
                buttonElm = $(buttonSlt);

            doc.on('click', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    input = self.siblings('input[name="quantity"]');

                if (input.length < 1) {
                    input = self.siblings('input[name="updates[]"]');
                }

                var val = parseInt(input.val());

                switch (true) {
                    case (self.hasClass('plus')):
                        {
                            val +=1;
                            break;
                        }
                    case (self.hasClass('minus') && val > 0):
                        {
                            val -=1;
                            break;
                        }
                }

                input.val(val);
            });
        },
        
        initAddToCart: function () {

            var btnAddToCartSlt = '[data-btn-addToCart]';
            var windowWidth = window.innerWidth;

            doc.off('click.addToCart', btnAddToCartSlt).on('click.addToCart', btnAddToCartSlt, function (e) {

                e.preventDefault();
                e.stopPropagation();
                var self = $(this);
                var thisForm = $(self.data('form-id'));
                var data = thisForm.serialize();     

                if (self.attr('disabled') !== "disabled") {
                    var productItem = self.closest('.product-item');

                    if (productItem.length < 1) {
                        var sectionsProduct = self.closest('[data-section-type="product"]');

                        if (!sectionsProduct.length) {
                            sectionsProduct = self.closest('.quickview-tpl');
                        }

                        productItem = sectionsProduct.find('.product-shop');
                    };

                    var form = productItem.find('form'),
                        handle = productItem.find('.product-grid-image').data('collections-related') || sectionsProduct.data('collections-related');

                    // var variant_id = form.find('select[name=id]').val();
                    // if (!variant_id) {
                    //     variant_id = form.find('input[name=id]').val();
                    // };

                    // var quantity = form.find('input[name=quantity]').val();
                    // if (!quantity) {
                    //     quantity = 1;
                    // };

                    switch (window.ajax_cart) {
                        case "none":
                            form.submit();
                            break;

                        case "normal":
                            var title = productItem.find('.product-title').html();
                            var image = productItem.find('.product-grid-image img').attr('src');

                            if(!image) {
                                image = productItem.siblings('.product-photos').find('.slick-current img[id|="product-featured-image"]').attr('src') || productItem.siblings('.product-photos').find('.slick-current img[id|="qv-product-featured-image"]').attr('src');
                            }

                            luxwatches.doAjaxAddToCartNormal(data, title, image);
                            luxwatches.initFreeShippingMessage();
                            break;

                    };

                }
                setTimeout(function(){
                    $('[data-quickview-modal]').hide();

                    if ($('body').hasClass('has_sticky')) {
                        var heightHeader = $('.header-bottom').outerHeight();
                        if ($(window).innerWidth() >= 1200) {
                            $('.dropdown-border', $(document)).css('top',heightHeader+'px');
                            $('.dropdown-border.menu-open').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                        } 
                    }else{
                        var heightHeader = $('.site-header').outerHeight();
                        if ($(window).innerWidth() >= 1200) {
                            $('.dropdown-border', $(document)).css('top',heightHeader+'px');
                            $('.dropdown-border.menu-open').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                        } 
                    }

                    html.css({
                        "overflow": ""
                    });
                }, 1000);
                return false;
            });
        },

        changeVariantSelectOption: function() {
            var selectSlt = '[data-select-change-variant]';

            doc.on('change', selectSlt, function() {
                var value = $(this).val(),
                    dataImg = $(this).find('option:selected').data('img'),
                    dataPrice = $(this).find('option:selected').data('price'),
                    parent = $(this).closest('.grouped-product');

                parent.find('input[type=hidden]').val(value);
                parent.find('.product-img img').attr({ src: dataImg });
                parent.find('[data-price-change]').html(Shopify.formatMoney(dataPrice, window.money_format));

                if (luxwatches.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '[data-select-change-variant] span.money', 'money_format');
                }
            });
        },

        closeSuccessModal: function () {
            var ajaxCartModal = $('[data-ajax-cart-success], [data-quickview-modal], [data-compare-modal], [data-compare-message-modal]'),
                closeWindow = ajaxCartModal.find('.close-modal, .continue-shopping'),
                modalContent = ajaxCartModal.find('.halo-modal-content');
  
            closeWindow.click(function (e) {
                e.preventDefault();

                ajaxCartModal.fadeOut(500, function () {
                    html.removeClass('halo-modal-open');
                    html.css({
                        "overflow": ""
                    });

                    if (body.hasClass('template-cart')) {
                        window.location.reload();
                    }
                    if (body.hasClass('popup-quickview')) {
                        body.removeClass('popup-quickview');
                    }
                    if (body.hasClass('modal-open')) {
                        body.removeClass('modal-open');
                    }
                    if ($('.modal-backdrop').hasClass('show')) {
                        $('.modal-backdrop').removeClass('show');
                        $('.modal-backdrop').hide();
                    }
                    
                });
            });

            ajaxCartModal.on('click', function (e) {
                if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                    ajaxCartModal.fadeOut(500, function () {
                        html.removeClass('halo-modal-open');
                        html.css({
                            "overflow": ""
                        });

                        if (body.hasClass('template-cart')) {
                            window.location.reload();
                        }
                        if (body.hasClass('popup-quickview')) {
                            body.removeClass('popup-quickview');
                        }
                        if (body.hasClass('modal-open')) {
                            body.removeClass('modal-open');
                        }
                        if ($('.modal-backdrop').hasClass('show')) {
                            $('.modal-backdrop').removeClass('show');
                            $('.modal-backdrop').hide();
                        }
                    });
                };
            });
        },

        doAjaxAddToCartNormal: function(data, title, image) {
            $.ajax({
                type: "POST",
                url: "/cart/add.js",
                data: data,
                dataType: "json",

                beforeSend: function () {
                    luxwatches.showLoading();
                },

                success: function () {

                    luxwatches.updateDropdownCart();
                    luxwatches.initFreeShippingMessage();

                    if ($('body').hasClass('has_sticky')) {
                        var heightHeader = $('.header-bottom').outerHeight();
                    } else {
                        var heightHeader = $('.site-header').outerHeight();
                    }

                    if ($(window).innerWidth() < 1200) {
                        html.addClass('cart-show');
                    } else {
                        $('#dropdown-cart').toggleClass('menu-open');
                        $('#dropdown-cart').css('top','heightHeader');

                        body.toggleClass('has-right-popup');

                        if ($('#dropdown-cart').hasClass('menu-open')) {
                            $('#dropdown-cart').toggleClass('menu-open');
                            body.addClass('has-right-popup');
                        } else {
                            body.removeClass('has-right-popup');
                        }

                        setTimeout(function(){
                            if ($('body').hasClass('has_sticky')) {
                                var heightHeader = $('.header-bottom').outerHeight();
                                if ($(window).innerWidth() >= 1200) {
                                    $('.dropdown-border', $(document)).css('top',heightHeader+'px');
                                    $('.dropdown-border.menu-open').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                                } 
                            }else{
                                var heightHeader = $('.site-header').outerHeight();
                                if ($(window).innerWidth() >= 1200) {
                                    $('.dropdown-border', $(document)).css('top',heightHeader+'px');
                                    $('.dropdown-border.menu-open').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                                } 
                            }
                            if ($('#dropdown-cart').hasClass('extra-options-open')) {
                                $('#dropdown-cart').toggleClass('menu-open');
                                body.addClass('has-right-popup');
                            }

                        }, 500);
                    }                    
                },

                error: function (xhr) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    luxwatches.showModal('.ajax-error-modal');
                },

                complete: function () {
                    luxwatches.hideLoading();
                }
            });
        },

        initChangeQuantityButtonEvent: function () {
            var buttonSlt = '[data-minus-quantity-cart], [data-plus-quantity-cart]',
                buttonElm = $(buttonSlt);

            doc.off('click.updateCart').on('click.updateCart', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var btn = $(this);
                var id = btn.closest("[data-product-id]").data("product-id");
                var quantity = parseInt(btn.siblings('input[name="quantity"]').val());

                if (btn.hasClass('plus')) {
                    quantity += 1;
                } else {
                    quantity -= 1;
                };

                luxwatches.doAjaxUpdatePopupCart(quantity, id);

            });
        },


        initCartQty: function() {    
          $('.quantity .button').on('click',function(event) {
            event.preventDefault();
            jQuery(this).each(function() {
              var productItem = jQuery(this).parents('.product-item'),
                  parent = jQuery(this).parent();
              var productId = jQuery(productItem).attr('id');
              productId = productId.match(/\d+/g);

              var oldValue = jQuery(parent).find('.number').val(),
                  newVal = 1;

              if (jQuery(this).hasClass('inc')) {
                newVal = parseInt(oldValue) + 1;
              } else if (oldValue > 1) {
                newVal = parseInt(oldValue) - 1;
              }

              jQuery(parent).find('.number').val(newVal);
            });

            return false;
          });

        },

        initUpdateCart: function(){            
          $('.cart-form .update').on('click', function(event) {      
            event.preventDefault();
            var cartButton = $(this);
            var productItem = jQuery(this).parents('.product-item');
            var productId = jQuery(productItem).attr('id');
            productId = productId.match(/\d+/g);

            var Price = $(this).parents('.product-details').find('.price'),
                quantity = jQuery(this).parent().find('.number').val();

            
            luxwatches.doAjaxUpdateCart(productId, quantity, cartButton, Price, productItem);

          }); 

          $('.cart-form .remove ').on('click', function(event) {
            event.preventDefault();
            var productItem = jQuery(this).parents('.product-item'),
                productId = jQuery(productItem).attr('id');

            productId = productId.match(/\d+/g);
            Shopify.removeItem(productId, function(cart) {

              luxwatches.doUpdateDropdownCart(cart);
              luxwatches.initFreeShippingMessage();

              $(productItem).remove();

              $('.total-price .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

              if (luxwatches.checkNeedToConvertCurrency()) {       
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
              }

              if ($('.cart-left ul li').children().length > 0) {

                $('.no-items').hide();
                $('.cart-form').show();
              } 

              else {      
                $('.cart-form').hide();
                $('.no-items').show();
              }

            });
          });

        },

        doAjaxUpdateCart: function(productId, quantity, cartButton, Price, productItem){
          var checkInv = $(cartButton).data('line'),
              price = parseFloat( Price.data('price') )*quantity,
              price2 = parseFloat( Price.data('price') )*checkInv;

          $.ajax({
            type: "post",
            url: "/cart/change.js",
            data: 'quantity=' + quantity + '&id=' + productId,
            dataType: 'json',
            beforeSend: function() {
              cartButton.find('i').removeClass('fa-check').addClass('fa-circle-o-notch fa-spin');
            },
            success: function(cart) {
              if(quantity == 0){

                productItem.remove();
                if ($('.cart-form .cart-left ul li').children().length > 0) {
                  $('.cart-form .no-items').hide();
                  $('.cart-form .cart-form').show();
                } 

                else {
                  $('.cart-form .cart-form').hide();
                  $('.cart-form .no-items').show();
                }
              }

              cartButton.find('i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-check');

              setTimeout(function() {cartButton.find('i').removeClass('fa-check')},2000);

              Price.html(Shopify.formatMoney(price, window.money_format));  

              $('.total-price .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

              if(quantity > checkInv){

                var title = $(productItem).find('.product-name > span').html();

                $(productItem).find('.extra').css('border-color','red');

                $('input#updates_' + productId + '').val(checkInv);

                Price.html(Shopify.formatMoney(price2, window.money_format));

                $('.ajax-error-message').text('You can only add '+ checkInv +' '+ title +' to your cart.');

                luxwatches.showModalError('.ajax-error-modal');
              }
              else{
                $(productItem).find('.extra').css('border-color','#dcdcdc');
              }

              luxwatches.updateDropdownCart();
              luxwatches.initFreeShippingMessage();

            },
            error: function(xhr) {          
              cartButton.find('i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-exclamation-circle');
              setTimeout(function() {cartButton.find('i').removeClass('fa-exclamation-circle')},5000);
              $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
              luxwatches.showModalError('.ajax-error-modal');
            }
          });

        },

        changeQuantityDropdownCart: function () {
            var buttonSlt = '[data-minus], [data-plus]',
                buttonElm = $(buttonSlt);

            doc.on('click', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    input = self.siblings('input[name="quantity"]');

                if (input.length < 1) {
                    input = self.siblings('input[name="updates[]"]');
                }

                var val = parseInt(input.val());

                switch (true) {
                    case (self.hasClass('plus')):
                        {
                            val +=1;
                            break;
                        }
                    case (self.hasClass('minus') && val > 1):
                        {
                            val -=1;
                            break;
                        }
                }

                input.val(val);


                var productId = $(this).parents('.item').attr('id');
                productId = productId.match(/\d+/g);

                var qtynum=parseInt(input.val());

                Shopify.changeItem(productId, qtynum, function (cart) {
                    luxwatches.doUpdateDropdownCart(cart);
                    luxwatches.initFreeShippingMessage();
                });


            });
        },
        initFreeShippingMessage: function () {
            Shopify.getCart(function (cart) {
                luxwatches.FreeShippingMessage(cart);
            })
        },
        FreeShippingMessage: function (cart) {
            var freeshipEligible = 0;

            var freeshipText = window.free_shipping_text.free_shipping_message_1;
            var freeshipText2 = window.free_shipping_text.free_shipping_message_2;
            var freeshipText3 = window.free_shipping_text.free_shipping_message_3;
            var extraPrice = 0;
            var shipVal = window.free_shipping_text.free_shipping_1;
            // 
            var color1 = window.free_shipping_color1;
            var color2 = window.free_shipping_color2;
            var color3 = window.free_shipping_color3;

            var freeshipPrice = parseInt(window.free_shipping_price);

            if (window.multi_lang && translator.isLang2()) {
                freeshipText = window.lang2.cart.general.free_shipping_message_1;
                freeshipText2 = window.lang2.cart.general.free_shipping_message_2;
                freeshipText3 = window.lang2.cart.general.free_shipping_message_3;
                shipVal = window.lang2.cart.general.free_shipping_1;
            }

            var cartTotalPrice =  parseInt(cart.total_price) / 100;
            var freeshipBar = Math.round((cartTotalPrice * 100)/freeshipPrice) ;

            if (cartTotalPrice >= freeshipPrice) {
              freeshipEligible = 1;
            } else {
              extraPrice = parseInt(freeshipPrice - cartTotalPrice);
              freeshipText = freeshipText2 + '<span> ' + Shopify.formatMoney(extraPrice * 100, window.money_format) + ' </span>' + freeshipText3;
              if (window.multi_lang && translator.isLang2()) {
                      shipVal = window.lang2.cart.general.free_shipping_2;
              } else {
                shipVal = window.free_shipping_text.free_shipping_2;
              }
              
            }

            if(freeshipBar >= 100 ){
               freeshipBar = 100;
            }

            if(freeshipBar == 0){
                luxwatches.checkItemsInDropdownCart();
//                 $('.free_shipping_progress').hide();
//                 $('.free_shipping_massage1').hide();
//                 $('.no-items').show();
            }

            var color = color3;
            if(freeshipBar <= 30 ) {
                color = color1;
            }
            else if( freeshipBar <= 60) {
                color = color2;
            }
            else if( freeshipBar == 100 ){
                   
            }

            var progress = '<div class="progress_shipping" role="progressbar" style="height: 15px; margin-top: 10px; margin-bottom: 10px;background-color: #e1dfd6;-webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1);box-shadow: inset 0 1px 2px rgba(0,0,0,.1);">\
            <div class="progress-meter" style="position: relative;display: block;height: 100%;background-color: '+color+';text-align: center; line-height: 15px;color: #ffffff;width: '+freeshipBar+'%; -webkit-animation: 2s linear 0s normal none infinite running progress-bar-stripes;animation: 2s linear 0s normal none infinite running progress-bar-stripes;background-image: -webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,rgba(0,0,0,0) 75%,rgba(0,0,0,0)); background-size: 40px 40px; transition: 0.9s linear; transition-property: width, background-color;">'+freeshipBar+'%</div>\
            </div>';

            $('.free_shipping_progress').html(progress);

            $('.free_shipping_massage1').html(freeshipText);
            $('#dropdown-cart .summary .free_shipping .text').html(shipVal);
          
              if (luxwatches.checkNeedToConvertCurrency()) {
              Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }
            
        },

        initQuantityInputChangeEvent: function () {
            var quantityIptSlt = '[data-quantity-input]';

            doc.on('change', quantityIptSlt, function () {
                var id = $(this).closest("[data-product-id]").data("product-id"),
                    quantity = parseInt($(this).val());

                luxwatches.doAjaxUpdatePopupCart(quantity, id);
            });
        },

        removeCartItem: function () {
            var removeSlt = '.cart-remove';

            doc.on('click', removeSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var id = $(this).closest("[data-product-id]").data("product-id");

                luxwatches.doAjaxUpdatePopupCart(0, id);
            });
        },

        initSoldOutProductShop: function () {
            var soldProduct = $('.product-shop [data-soldOut-product]');

            if (soldProduct.length) {
                soldProduct.each(function () {
                    var self = $(this);

                    var items = self.data('items').split(","),
                        hours = self.data('hours').split(","),
                        i = Math.floor(Math.random() * items.length),
                        j = Math.floor(Math.random() * hours.length);

                    self.find('.items-count').text(items[i]);
                    self.find('.hours-num').text(hours[j]);
                });
            }
        },

        initCustomerViewProductShop: function () {
            var customerView = $('.product-shop [data-customer-view]');

            if (customerView.length) {
                customerView.each(function () {
                    var self = $(this);

                    setInterval(function () {
                        var views = self.data('customer-view').split(","),
                            i = Math.floor(Math.random() * views.length);

                        self.find('label').text(views[i]);
                    }, 5000);
                });
            }
        },

        initProductMoreview: function (productMoreview) {
            var sliderFor = productMoreview.find('.slider-for'),
                sliderNav = productMoreview.find('.slider-nav'),
                vertical = sliderNav.data('vertical');

            if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
                sliderFor.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    asNavFor: sliderNav
                });

                sliderNav.slick({
                    infinite: true,
                    vertical: vertical,
                    get slidesToShow() {
                        return slidesToShow = sliderNav.data('rows');
                    },
                    slidesToScroll: 1,
                    arrows: true,
                    dots: false,
                    asNavFor: sliderFor,
                    focusOnSelect: true,
                    nextArrow: '<button type="button" class="slick-next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 20 20"><path d="M5 20c-0.128 0-0.256-0.049-0.354-0.146-0.195-0.195-0.195-0.512 0-0.707l8.646-8.646-8.646-8.646c-0.195-0.195-0.195-0.512 0-0.707s0.512-0.195 0.707 0l9 9c0.195 0.195 0.195 0.512 0 0.707l-9 9c-0.098 0.098-0.226 0.146-0.354 0.146z"></path></svg></button>',
                    prevArrow: '<button type="button" class="slick-prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 20 20"><path d="M14 20c0.128 0 0.256-0.049 0.354-0.146 0.195-0.195 0.195-0.512 0-0.707l-8.646-8.646 8.646-8.646c0.195-0.195 0.195-0.512 0-0.707s-0.512-0.195-0.707 0l-9 9c-0.195 0.195-0.195 0.512 0 0.707l9 9c0.098 0.098 0.226 0.146 0.354 0.146z"></path></svg></button>',
                    responsive: [{
                            breakpoint: 1281,
                            settings: { 
                                get slidesToShow() {
                                    if (vertical == true) {
                                        return slidesToShow = 4;
                                    } else {
                                        return slidesToShow = 5;
                                    }
                                },
                                slidesToScroll: 1,
                                arrows: true,
                                dots: false
                            }
                        },
                        {
                            breakpoint: 1200,
                            settings: { 
                                vertical: false,
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                arrows: true,
                                dots: false
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                vertical: false,
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                arrows: true,
                                dots: false
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                vertical: false,
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                arrows: true,
                                dots: false
                            }
                        },
                        {
                            breakpoint: 360,
                            settings: {
                                vertical: false,
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                arrows: true,
                                dots: false
                            }
                        }
                    ]
                });
            };

            if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch) {     
                var swatch = productMoreview.closest('[data-more-view-product]').siblings('.product-shop').find('.swatch'),
                    swatchColor = swatch.find('.swatch-element.color'),
                    inputChecked = swatchColor.find(':radio:checked');
                    
                if(inputChecked.length) {
                    var className = inputChecked.data('filter');

                    if(className !== undefined) {
                        sliderNav.slick('slickUnfilter');
                        sliderFor.slick('slickUnfilter');

                        if(sliderNav.find(className).length && sliderFor.find(className).length) {
                            sliderNav.slick('slickFilter', className).slick('refresh');
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    };
                };
            }
        },

        changeSwatch: function (swatchSlt) {         
            doc.on('change', swatchSlt, function () {
                var className = $(this).data('filter');
                var optionIndex = $(this).closest('.swatch').attr('data-option-index');
                var optionValue = $(this).val();

                $(this)
                    .closest('form')
                    .find('.single-option-selector')
                    .eq(optionIndex)
                    .val(optionValue)
                    .trigger('change');
                   
                if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch && className !== undefined) {
                    var productShop = $(swatchSlt).closest('.product-shop');

                    if(productShop.closest('.product-slider').length) {
                        var productImgs = productShop.closest('.product-slider').find('[data-moreview-product-slider]'),
                            sliderFor = productImgs.find('.slider-for'); 

                        sliderFor.slick('slickUnfilter');

                        if(sliderFor.find(className).length) {
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }    
                    }else {
                        var productImgs = productShop.prev('[data-more-view-product]');

                        if(productImgs.length) {
                            var sliderNav = productImgs.find('.slider-nav'),
                                sliderFor = productImgs.find('.slider-for');
                            
                            sliderNav.slick('slickUnfilter');
                            sliderFor.slick('slickUnfilter');

                            if(sliderNav.find(className).length && sliderFor.find(className).length) {
                                sliderNav.slick('slickFilter', className).slick('refresh');
                                sliderFor.slick('slickFilter', className).slick('refresh');
                            }
                        }
                    }

                }
            });
        },

        initQuickView: function () {
            body.off('click.initQuickView', '.quickview-button').on('click.initQuickView', '.quickview-button', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var href = $(this).attr('id');

                luxwatches.doAjaxShowQuickView(href);
                luxwatches.closeSuccessModal();

                body.addClass('popup-quickview'); 
            });
        },

        doAjaxShowQuickView: function (href) {
            if (luxwatches.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: window.router + '/products/' + href + '?view=quickview',

                beforeSend: function () {  
                    luxwatches.showLoading();

                    html.css({
                        "overflow": "hidden"
                    });
                },

                success: function (data) {
                    var quickviewModal = $('[data-quickview-modal]'),
                        modalContent = quickviewModal.find('.halo-modal-body');

                    modalContent.html(data);

                    setTimeout(function () {
                        luxwatches.translateBlock('[data-quickview-modal]');
                        luxwatches.initProductMoreview($('[data-more-view-product-qv] .product-img-box'));
                        luxwatches.initSoldOutProductShop();
                        luxwatches.initCustomerViewProductShop();
                        luxwatches.changeSwatch('.quickview-tpl .swatch :radio');
                        luxwatches.initZoom();
                        luxwatches.setAddedForWishlistIcon(href);

                       $.getScript("https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-595b0ea2fb9c5869")
                            .done(function() {
                                if(typeof addthis !== 'undefined') {
                                    addthis.init();
                                    addthis.layers.refresh();
                                }
                            })                       

                        if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                        };
                    }, 500);

                    luxwatches.hideLoading();

                    quickviewModal.fadeIn(600, function () {
                        // html.addClass('halo-modal-open');

                        if ($('[data-ajax-cart-success]').is(':visible')) {
                            $('[data-ajax-cart-success]').hide();
                        }
                    });
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    luxwatches.hideLoading();
                    luxwatches.showModal('.ajax-error-modal');
                }
            });
        },

        initZoom: function () {
            var zoomElm = $('.product-img-box [data-zoom]');

            if (win.width() >= 1200) {
                zoomElm.zoom();
            } else {
                zoomElm.trigger('zoom.destroy');
            };
        },

        stickyFixedTopMenu: function() {
            if(window.fixtop_menu) {                
                // setTimeout(
                    // function() {
                        $('.site-header').css('height', '');
                        $('[data-sticky]').sticky({
                            zIndex: 3
                        });

                        $('[data-sticky]').on('sticky-start', function() {
                            body.addClass('has_sticky'); 
                            var heightHeader = $('.header-bottom').outerHeight();
                            if ($(window).innerWidth() >= 1200) {
                                $('.dropdown-border', $(document)).css('top',heightHeader+'px');
                                $('.wrapper_header_parallax .dropdown-border').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                                $('.dropdown-border.menu-open').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                            } 

                        });

                        $('[data-sticky]').on('sticky-end', function() {
                            body.removeClass('has_sticky');
                            var heightHeader = $('.site-header').outerHeight();
                            if ($(window).innerWidth() >= 1200) {
                                $('.dropdown-border', $(document)).css('top',heightHeader+'px');
                                $('.wrapper_header_parallax .dropdown-border').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                                $('.dropdown-border.menu-open').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                            } 
                        });
                    // }, 8000
                // ); 
            };
        },

        productPageInitProductTabs: function () {
            var listTabs = $('.custom-product-description .product-tab'),
                tabLink = listTabs.find('[data-tapTop]'),
                tabContent = listTabs.find('[data-TabContent]');

            tabLink.off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var curTab = $(this),
                    curTabContent = $(curTab.data('target'));

                if($(this).hasClass('active')) {
                    return;

                }

                if (!$(this).hasClass('active')) {
                    var curTab = $(this),
                        curTabContent = $(curTab.data('target'));                          

                    tabLink.removeClass('active');
                    tabContent.removeClass('active');                

                    curTab.addClass('active');
                    curTabContent.addClass('active');
                };
            });
        },

        productPageInitProductTabs1: function () {
            var listTabs = $('.tabs__product-page'),
                tabLink = listTabs.find('[data-tapTop]'),
                tabContent = listTabs.find('[data-TabContent]');

            tabLink.off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var curTab = $(this),
                    curTabContent = $(curTab.data('target'));
                if($(this).hasClass('active')) {
                    tabLink.removeClass('active');
                    tabContent.removeClass('active');  
                    return;
                }

                if (!$(this).hasClass('active')) {
                    var curTab = $(this),
                        curTabContent = $(curTab.data('target'));                          

                    tabLink.removeClass('active');
                    tabContent.removeClass('active');                

                    curTab.addClass('active');
                    curTabContent.addClass('active');
                };

            });
        },

        initStickyAddToCart: function() {
            var blockSticky = $('[data-sticky-add-to-cart]'),
                sltVariantActive = blockSticky.find('.pr-active'),
                variantElm = blockSticky.find('.pr-swatch');

            if(blockSticky.length) {
                var showHideVariantsOptions = function() {
                    sltVariantActive.off('click.showListVariant').on('click.showListVariant', function(e) {

                        e.preventDefault();

                        blockSticky.toggleClass('open-sticky');
                    }); 

                    doc.off('click.hideVariantsOption').on('click.hideVariantsOption', function(e) {
                        if (!sltVariantActive.is(e.target) && sltVariantActive.has(e.target).length === 0){
                            blockSticky.removeClass('open-sticky');
                        };
                    })
                };

                var handleActiveVariant = function() {
                    variantElm.off('click.activeVar').on('click.activeVar', function(e) {

                        var self = $(this),
                            text = self.text(),
                            value = self.data('value'),
                            title = self.data('title'),
                            newImage = self.data('img');

                            console.log(title.split('custom-engraving'));

                        variantElm.removeClass('active');
                        self.addClass('active');
                        blockSticky.toggleClass('open-sticky');

                        blockSticky.find('.action input[type=hidden]').val(value);
                        sltVariantActive.attr('data-value', value).text(text);

                        var swatchNameValue = $('#add-to-cart-form [data-value-sticky="'+value+'"]');

                        if ($('#custom-engraving-enable').is(':checked')) {
                            
                        } else {
                      
                          if (title.indexOf('custom-engraving') >= 0) {
                            $('.alert_engraving').addClass('show_alert');
                            $('html, body').animate({
                              scrollTop: $(".total-price").offset().top
                            }, 500);
                            return false;
                          }
                          else {
                              // alert();

                          }
                        }
                      
                          if (window.use_color_swatch) {
                          var swatchNameValue = $('#add-to-cart-form [data-value-sticky="'+value+'"]');
                          swatchNameValue.each(function() {
                            var slt = $(this).data('value');

                            $('[data-value="'+slt+'"]').closest('.swatch').find('#'+slt+'').click();
                        });
                        } else {
                          var value_option = self.text().replace(/^\s+|\s+$/g, '').split('-')[0];
                          var values = value_option.replace(' ','').split('/ ');
                          for ( var i = 0; i < values.length; i++) {
                            var i_value = values[i].trim();
                            $('.selector-wrapper:eq(' + i + ') select').val(i_value).trigger('change');
                          }
                        }

                        if(self.hasClass('sold-out')) {
                            blockSticky.find('.sticky-add-to-cart').val(window.inventory_text.sold_out).addClass('disabled').attr('disabled', 'disabled');
                        }else {
                            blockSticky.find('.sticky-add-to-cart').removeClass('disabled').removeAttr('disabled').val(window.inventory_text.add_to_cart);
                        };
    
                        $('.pr-img img').attr({ src: newImage }); 

                        return false;
                    });
                };

                var stickyAddToCart = function() {

                    doc.on('click', '[data-sticky-btn-addToCart]', function(e) {

                        e.preventDefault();

                        if($('#add-to-cart-form [data-btn-addToCart]').length) {
                            $('#add-to-cart-form [data-btn-addToCart]').click();     
                        } else if($('#add-to-cart-form [data-grouped-addToCart]').length) {
                            $('#add-to-cart-form [data-grouped-addToCart]').click();
                        };

                        var heightHeader = $('.header-bottom').outerHeight();
                        if ($(window).innerWidth() >= 1200) {
                            $('.dropdown-border', $(document)).css('top',heightHeader+'px');
                            $('.dropdown-border.menu-open').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                            $('.dropdown-border').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                        }
                        
                        return false;
                    });
                };

                var activeVariantSelected = function() {

                    var optionSelected = $('#product-selectors option:selected'),
                        value = optionSelected.val(),
                        stickyActive = blockSticky.find('.pr-swatch[data-value="'+value+'"]'),
                        stickyText = stickyActive.html();

                    sltVariantActive.html(stickyText);
                    stickyActive.addClass('active');

                    var str = stickyActive.data('img');

                    $('.pr-img img').attr({ src: str });

                    // $(".swatch .swatch-element").each(function(e) {
                    //     var idVariant = $(this).find('input:radio').attr('id');

                    //     $('.swatch input.text[data-value="'+idVariant+'"]').appendTo($(this));
                    // });

                    $('.selector-wrapper').change(function() {
                        var n = $("#product-selectors").val();

                        $('.sticky_form .pr-selectors li').each(function(e) {
                            var t = $(this).find('a').data('value');

                            if(t == n){
                                $(this).find('a').addClass('active')
                            } else{
                                $(this).find('a').removeClass('active')
                            }
                        });
                        
                        $("#product-selectors").change(function() {
                            var str = "";

                            $("#product-selectors option:selected").each(function() {
                                str += $(this).data('imge');
                            });

                            $('.pr-img img').attr({ src: str }); 
                        }).trigger("change");

                        if(variantElm.hasClass('active')) {
                            var h = $('.sticky_form .pr-swatch.active').html();

                            $('.sticky_form .action input[type=hidden]').val(n);
                            sltVariantActive.html(h);
                            sltVariantActive.attr('data-value', n);
                        };
                    });
                };

                var offSetTop = $('#add-to-cart-form .groups-btn').offset().top;

                $(window).scroll(function () {
                    var scrollTop = $(this).scrollTop();

                    if (scrollTop > offSetTop) {
                        body.addClass('show_sticky');
                    }
                    else {
                        body.removeClass('show_sticky');
                    }
                }); 

                showHideVariantsOptions();
                handleActiveVariant();
                stickyAddToCart();
                activeVariantSelected(); 
            };
        },

        createWishListTplItem: function(ProductHandle) {
            var wishListCotainer = $('[data-wishlist-container]');

            jQuery.getJSON(window.router + '/products/'+ProductHandle+'.js', function(product) {
                var productHTML = '',
                    price_min = Shopify.formatMoney(product.price_min, window.money_format);

                productHTML += '<div class="grid-item" data-wishlist-added="wishlist-'+product.id+'">';
                productHTML += '<div class="inner product-item" data-product-id="product-'+product.handle+'">';
                productHTML += '<div class="column col-img"><div class="product-image">';
                productHTML +='<a href="'+product.url+'" class="product-grid-image" data-collections-related="/collections/all?view=related">';
                productHTML += '<img src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
                productHTML += '</a></div></div>';
                productHTML += '<div class="column col-prod">';
                productHTML += '<div class="product-vendor">';
                productHTML += '<a href="'+window.router+'/collections/vendors?q='+product.vendor+'" title="'+product.vendor+'">'+product.vendor+'</a></div>';
                productHTML += '<a class="product-title" href="'+product.url+'" title="'+product.title+'">'+product.title+'</a></div>';
                productHTML += '<div class="column col-price text-center"><div class="price-box">'+ price_min +'</div></div>';
                productHTML += '<div class="column col-remove text-center"><a class="btn whislist-added" href="#" data-product-handle="'+ product.handle +'" data-icon-wishlist data-id="'+ product.id +'"><svg class="closemnu" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 357 357" xml:space="preserve"><g><g><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5"></polygon></g></g></svg>'+window.inventory_text.remove+'</a></div>';
                productHTML += '<div class="column col-options text-center">';
                productHTML += '<form action="/cart/add" method="post" class="variants" id="-'+product.id+'" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';

                if (product.available) {
                    if (product.variants.length == 1) {
                        productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" type="submit" data-form-id="#-'+product.id+'" >'+window.inventory_text.add_to_cart+'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />'; 
                    } 
                    if (product.variants.length > 1){
                        productHTML += '<a class="btn" title="'+product.title+'" href="'+product.url +'">'+window.inventory_text.select_options+'</a>';
                    }
                } else {
                    productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" type="submit" disabled="disabled">'+window.inventory_text.unavailable+'</button>';
                }

                productHTML += '</form></div>';
                
                productHTML += '</div></div>';

                wishListCotainer.append(productHTML);
            });
        },

        initWishListPagging: function() {
            var data = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [0];

            var wlpaggingContainer = $('#wishlist-paginate');
            var paggingTpl = '<li class="text disabled prev"><a href="#" title="'+window.inventory_text.previous+'"><i class="fa fa-angle-left" aria-hidden="true"></i><span>'+window.inventory_text.previous+'</span></a></li>';
            var wishListCotainer = $('[data-wishlist-container]');
                
            wlpaggingContainer.children().remove();

            var totalPages = Math.ceil(data.length / 3);

            if (totalPages <= 1) {
                wishListCotainer.children().show();
                return;
            }

            for (var i = 0; i < totalPages; i++) {
                var pageNum = i + 1;
                if (i === 0) paggingTpl += '<li class="active"><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'"><span>' + pageNum + '</span></a></li>'                
                else paggingTpl += '<li><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'"><span>' + pageNum + '</span></a></li>'
            }

            paggingTpl += '<li class="text next"><a href="#" title="'+window.inventory_text.next+'"><span>'+window.inventory_text.next+'</span><i class="fa fa-angle-right" aria-hidden="true"></i></a></li>';

            wlpaggingContainer.append(paggingTpl);

            wishListCotainer.children().each(function(idx, elm) {
                if (idx >= 0 && idx < 3) {
                    $(elm).show();
                }
                else {
                    $(elm).hide();
                }
            });

            wlpaggingContainer.off('click.wl-pagging').on('click.wl-pagging', 'li a', function(e) {
                e.preventDefault();

                var isPrev = $(this).parent().hasClass('prev');
                var isNext = $(this).parent().hasClass('next');
                var pageNumber = $(this).data('page');

                if (isPrev) {
                    var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
                    pageNumber = curPage - 1;
                }

                if (isNext) {
                    var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
                    pageNumber = curPage + 1;
                }

                wishListCotainer.children().each(function(idx, elm) {
                    if (idx >= (pageNumber - 1) * 3 && idx < pageNumber * 3) {
                        $(elm).show();
                    }
                    else {
                        $(elm).hide();
                    }
                });

                if (pageNumber === 1) {
                    wlpaggingContainer.find('.prev').addClass('disabled');
                    wlpaggingContainer.find('.next').removeClass('disabled');
                }
                else if (pageNumber === totalPages) {
                    wlpaggingContainer.find('.next').addClass('disabled');
                    wlpaggingContainer.find('.prev').removeClass('disabled');
                }
                else {
                    wlpaggingContainer.find('.prev').removeClass('disabled');
                    wlpaggingContainer.find('.next').removeClass('disabled');
                }

                $(this).parent().siblings('.active').removeClass('active');
                wlpaggingContainer.find('[data-page="' + pageNumber + '"]').parent().addClass('active');

            });
        },

        initWishLists: function() {
            if (typeof(Storage) !== 'undefined') {               
                
                if (wishListsArr.length <= 0) {
                    return;
                }

                wishListsArr.forEach(function(item) {
                    luxwatches.createWishListTplItem(item);             
                });

                this.initWishListPagging();
                this.translateBlock('.wishlist-page');

            } else {
                alert('Sorry! No web storage support..');
            }
        },

        setAddedForWishlistIcon: function(ProductHandle) {    
            var wishlistElm = $('[data-product-handle="'+ ProductHandle +'"]'),
                idxArr = wishListsArr.indexOf(ProductHandle);

            if(idxArr >= 0) {
                wishlistElm.addClass('whislist-added');
                wishlistElm.find('.wishlist-text').text(window.inventory_text.remove_wishlist);
            }
            else {
                wishlistElm.removeClass('whislist-added');
                wishlistElm.find('.wishlist-text').text(window.inventory_text.add_wishlist);
            };
        },

        doAddOrRemoveWishlish: function() {            
            var iconWishListsSlt = '[data-icon-wishlist]';

            doc.off('click.addOrRemoveWishlist', iconWishListsSlt).on('click.addOrRemoveWishlist', iconWishListsSlt, function(e) {
                e.preventDefault();

                var self = $(this),
                    productId = self.data('id'),
                    ProductHandle = self.data('product-handle'),
                    idxArr = wishListsArr.indexOf(ProductHandle);
                
                if(!self.hasClass('whislist-added')) {
                    self.addClass('whislist-added');
                    self.find('.wishlist-text').text(window.inventory_text.remove_wishlist);

                    if($('[data-wishlist-container]').length) {
                        luxwatches.createWishListTplItem(ProductHandle);
                    };

                    wishListsArr.push(ProductHandle);
                    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));

                } else {
                    self.removeClass('whislist-added');
                    self.find('.wishlist-text').text(window.inventory_text.add_wishlist);
                    console.log('abc12335')

                    if($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                        $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
                    }

                    wishListsArr.splice(idxArr, 1);
                    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));

                    if($('[data-wishlist-container]').length) {
                        luxwatches.initWishListPagging();
                    };
                };

                luxwatches.setAddedForWishlistIcon(ProductHandle);
            });
        },

        initWishListIcons: function() {            

            if (!wishListsArr.length) {
                return;
            }
   
            for (var i = 0; i < wishListsArr.length; i++) {
                var icon = $('[data-product-handle="'+ wishListsArr[i] +'"]');
                icon.addClass('whislist-added');
                icon.find('.wishlist-text').text(window.inventory_text.remove_wishlist);
            };

            if (typeof(Storage) !== 'undefined') {        
                    
                if (wishListsArr.length <= 0) {
                    return;
                }

                setTimeout(function() {
                    wishListsArr.forEach(function(item) {
                        luxwatches.setAddedForWishlistIcon(item);     
                    });
                },1500);

            } else {
                alert('Sorry! No web storage support..');
            }

        },
        
        setAddedForCompareIcon: function(ProductHandle) {    
            var compareElm = $('[data-compare-product-handle="'+ ProductHandle +'"]'),
                idxArr = compareArr.indexOf(ProductHandle),
                compareCountNum = $('[data-compare-count]');

                compareItems = localStorage.getItem('compareArr') ? JSON.parse(localStorage.getItem('compareArr')) : [];
                totalProduct = Math.ceil(compareItems.length);

            if(idxArr >= 0) {
                compareElm.addClass('compare-added');
                compareElm.find('.compare-text').text(window.inventory_text.remove_compare);
            }
            else {
                compareElm.removeClass('compare-added');
                compareElm.find('.compare-text').text(window.inventory_text.add_compare);
            };

            compareCountNum.text(totalProduct);
        },

        doAddOrRemoveCompare: function() {            
            var iconCompare = '[data-icon-compare]';

            doc.off('click.doAddOrRemoveCompare', iconCompare).on('click.doAddOrRemoveCompare', iconCompare, function(e) {
                e.preventDefault();

                var self = $(this),
                    productId = self.data('id'),
                    ProductHandle = self.data('compare-product-handle'),
                    idxArr = compareArr.indexOf(ProductHandle);
                
                if(!self.hasClass('compare-added')) {
                    self.addClass('compare-added');
                    self.find('.comapre-text').text(window.inventory_text.remove_wishlist);


                    compareArr.push(ProductHandle);
                    localStorage.setItem('compareArr', JSON.stringify(compareArr));

                    setTimeout(function() {
                        luxwatches.createCompareItem(ProductHandle);
                    }, 1500); 

                } else {
                    self.removeClass('compare-added');
                    self.find('.compare-text').text(window.inventory_text.add_wishlist);

                    if($('[data-compare-added="compare-'+productId+'"]').length) {
                        $('[data-compare-added="compare-'+productId+'"]').remove();
                    }

                    compareArr.splice(idxArr, 1);
                    localStorage.setItem('compareArr', JSON.stringify(compareArr));
                };

                luxwatches.setAddedForCompareIcon(ProductHandle);
            });

        },

        initCompareIcons: function() {       
            
            var compareCountNum = $('[data-compare-count]');
                
                totalProduct = Math.ceil(compareArr.length);
                compareCountNum.text(totalProduct);   

            if (!compareArr.length) {
                return;
            } else {

                for (var i = 0; i < compareArr.length; i++) {
                    var icon = $('[data-compare-product-handle="'+ compareArr[i] +'"]');
                    icon.addClass('compare-added');
                    icon.find('.compare-text').text(window.inventory_text.remove_compare);
                };

                if (typeof(Storage) !== 'undefined') {        
                    
                    if (compareArr.length <= 0) {
                        return;
                    }

                    setTimeout(function() {
                        compareArr.forEach(function(item) {
                            luxwatches.createCompareItem(item);
                            luxwatches.setAddedForCompareIcon(item);      
                        });
                    },1500);
                    

                } else {
                    alert('Sorry! No web storage support..');
                }

            }
        },

        initCompareSelected: function() {
            var iconCompareSelected = '[data-compare-selected]';
                compareModal = $('[data-compare-modal]');
                compareModalProduct = compareModal.find('.product-grid');
                compareModalMessage = $('[data-compare-message-modal]');

            doc.off('click.compareSelected', iconCompareSelected).on('click.compareSelected', iconCompareSelected, function(e) {
                e.preventDefault();
                e.stopPropagation();                

                if (typeof(Storage) !== 'undefined') {        
                    
                    if (compareArr.length <= 1) {
                        compareModalMessage.find('.halo-modal-body').text(window.inventory_text.message_compare);
                        compareModalMessage.fadeIn(500, function () {
                            html.addClass('halo-modal-open');
                        });

                        body.addClass('has-popup');

                    } else {
                        compareArr.forEach(function(item) {
                            luxwatches.removeCompareItem(item);
                        });

                        compareModal.fadeIn(600, function () {
                            html.addClass('halo-modal-open');
                        });

                        luxwatches.removeAllCompareItem();
                    }                    

                } else {
                    alert('Sorry! No web storage support..');
                }

                luxwatches.closeSuccessModal();
                luxwatches.translateBlock('.ajax-compare');
                luxwatches.translateBlock('.compare-message-modal');
            });
        },

        createCompareItem: function(ProductHandle) {
            var compareProduct = $('[data-compare-modal]').find('.halo-modal-body .compare-content .product-grid');
                compareRating = $('[data-compare-modal]').find('.halo-modal-body .compare-content .rating');
                compareDescription = $('[data-compare-modal]').find('.halo-modal-body .compare-content .description');
                compareCollection = $('[data-compare-modal]').find('.halo-modal-body .compare-content .collection');
                compareAvailability = $('[data-compare-modal]').find('.halo-modal-body .compare-content .availability');
                compareProductType = $('[data-compare-modal]').find('.halo-modal-body .compare-content .product-type');

                compareSKU = $('[data-compare-modal]').find('.halo-modal-body .compare-content .product-sku');
                compareOption1 = $('[data-compare-modal]').find('.option1'),
                compareOption2 = $('[data-compare-modal]').find('.option2'),
                compareOption3 = $('[data-compare-modal]').find('.option3');

            jQuery.getJSON('/products/'+ProductHandle+'.js', function(product) {
                var productHTML = '',
                    priceHTML = '',
                    productLabelHTML = '',
                    ratingHTML = '',
                    descriptionHTML = '',
                    collectionHTML = '',
                    availabilityHTML = '',
                    productTypeHTML = '',
                    skuHTML = '',
                    optionValueHTML = '',
                    optionValueHTML2 = '',
                    price_min = Shopify.formatMoney(product.price_min, window.money_format);

                var productIDCompare = product.id;

                $('.product-collection .grid-item').each(function () {
                    var productID = $(this).find('.product-item').data('id');

                    if (productID == productIDCompare) {
                       price = $(this).find('.product-bottom .price-box').html(); 
                       productLabel = $(this).find('.product-top .product-label').html();
                       rating = $(this).find('.product-bottom .spr-badge').html();
                       coll = $(this).find('.compare-info .collection-product').html();
                       desc = $(this).find('.compare-info .short-description').html();
                       sku = $(this).find('.compare-info .sku-product .value').html();

                        // Option
                        var productOptions = product.options;
                      
                        $.each(productOptions, function(index, opt) {
                            var optPosition = opt.position,
                                optName = opt.name.toLowerCase(),
                                optValue = opt.values,
                                optValueText = '';

                            optValue.forEach(function(value, index) {
                                if (value) {
                                    if (index > 0) {
                                        optValueText += ', '
                                    }
                                    optValueText += value;
                                }
                            })

                            optionValueHTML2 += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">-</div>';

                            if (optValueText == '' || optValueText == 'Default Title') {
                                optionValueHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">-</div>';
                            } else {
                                optionValueHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+optValueText+'</div>';
                            }

                            var optionOneValue = window.option_ptoduct1,
                                optionTwoValue = window.option_ptoduct2;
                                optionThreeValue = window.option_ptoduct3;
                            if (optPosition == 1) {
                                if (optName == optionOneValue) {
                                    compareOption1.append(optionValueHTML);
                                    compareOption2.append(optionValueHTML2);
                                    compareOption3.append(optionValueHTML2);
                                } else if (optName == optionTwoValue) {
                                    compareOption1.append(optionValueHTML2);
                                    compareOption2.append(optionValueHTML);
                                    compareOption3.append(optionValueHTML2);
                                } else if (optName == 'title') {
                                    compareOption1.append(optionValueHTML2);
                                    compareOption2.append(optionValueHTML2);
                                    compareOption3.append(optionValueHTML2);
                                } else {
                                    compareOption1.append(optionValueHTML2);
                                    compareOption2.append(optionValueHTML2);
                                    compareOption3.append(optionValueHTML);
                                }
                            }
                            if (optPosition == 2) {
                                if (optName == optionOneValue) {
                                    compareOption1.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                                } else  if (optName == optionTwoValue) {
                                    compareOption2.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                                } else {
                                    compareOption3.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                                }
                            }
                            if (optPosition == 3) {
                                if (optName == optionOneValue) {
                                    compareOption1.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                                } else  if (optName == optionTwoValue) {
                                    compareOption2.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                                } else {
                                    compareOption3.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                                }
                            }
                        });



                       priceHTML += price;
                       if (productLabel != undefined && productLabel != '') {
                          productLabelHTML += productLabel;
                       }
                        
                        if (rating == '' || rating == undefined) {
                            ratingHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'"></div>';
                        } else {
                            ratingHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+rating+'</div>';
                        }                        
                        compareRating.append(ratingHTML);
                       
                       if (coll == '' || desc == undefined ) {
                           collectionHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">-</div>';
                        } else {
                            collectionHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+coll+'</div>';
                        }   
                       compareCollection.append(collectionHTML);

                       if (desc == '' || desc == undefined ) {
                            descriptionHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">-</div>';
                        
                       } else {
                            descriptionHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+desc+'</div>';
                       }
                       compareDescription.append(descriptionHTML);

                       if (sku == '' || desc == undefined) {
                        skuHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">-</div>';
                        
                       } else {
                        skuHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+sku+'</div>';
                       }

                       compareSKU.append(skuHTML);
                       
                    }
                })

                productHTML += '<div class="grid-item col-xl-4" data-compare-added="compare-'+product.id+'">';
                productHTML += '<div class="inner product-item" data-product-id="product-'+product.handle+'"><div class="inner-top"';
                productHTML += '<div class="product-top"><div class="product-image">';
                productHTML +='<a href="'+product.url+'" class="product-grid-image" data-collections-related="/collections/all?view=related">';
                productHTML += '<img src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
                productHTML += '</a></div>';
                productHTML += '<div class="product-label">'+productLabelHTML+'</div></div></div>';
                productHTML += '<div class="product-bottom">';
                productHTML += '<div class="product-vendor">';
                productHTML += '<a href="/collections/vendors?q='+product.vendor+'" title="'+product.vendor+'">'+product.vendor+'</a></div>';
                productHTML += '<a class="product-title" href="'+product.url+'" title="'+product.title+'">'+product.title+'</a>';
                productHTML += '<div class="column col-price text-center"><div class="price-box">'+priceHTML+'</div></div>';
                
                productHTML += '<div class="column col-options text-center">';
                productHTML += '<form action="/cart/add" method="post" class="variants" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';

                if (product.available) {
                    if (product.variants.length == 1) {
                        productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" type="submit">'+window.inventory_text.add_to_cart+'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />'; 
                    } 
                    if (product.variants.length > 1){
                        productHTML += '<a class="btn" title="'+product.title+'" href="'+product.url +'">'+window.inventory_text.select_options+'</a>';
                    }
                    availabilityHTML += '<div class="col-xl-4 in-stock" data-compare-added="compare-'+product.id+'">'+window.inventory_text.in_stock+'</div>';
                } else { 
                    productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" type="submit" disabled="disabled">'+window.inventory_text.unavailable+'</button>';
                    availabilityHTML += '<div class="col-xl-4 unavailable" data-compare-added="compare-'+product.id+'">'+window.inventory_text.unavailable+'</div>';
                }

                productHTML += '</form></div>';
                productHTML += '<div class="column col-remove text-center"><a class="compare-added" href="#" data-icon-compare-added data-compare-product-handle="'+ product.handle +'" data-id="'+ product.id +'">'+window.inventory_text.remove+'</a></div></div>';
                
                productHTML += '</div></div></div>';

                compareProduct.append(productHTML);

                productTypeHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+product.type+'</div>';    

                compareAvailability.append(availabilityHTML);
                compareProductType.append(productTypeHTML);         
            });
        },

        removeCompareItem: function(ProductHandle) {
            var iconCompareRemove = '[data-icon-compare-added]';

            doc.off('click.removeCompareItem', iconCompareRemove).on('click.removeCompareItem', iconCompareRemove, function(e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    productId = self.data('id'),
                    ProductHandle = self.data('compare-product-handle'),
                    idxArr = compareArr.indexOf(ProductHandle);
                
                if($('[data-compare-added="compare-'+productId+'"]').length) {
                    $('[data-compare-added="compare-'+productId+'"]').remove();

                }

                compareArr.splice(idxArr, 1);
                localStorage.setItem('compareArr', JSON.stringify(compareArr));

                luxwatches.setAddedForCompareIcon(ProductHandle);
            });
        },

        removeAllCompareItem: function(ProductHandle) {
            var compareRemoveAll = '[data-compare-remove-all]';
                compareCountNum = $('[data-compare-count]');
                compareElm = $('[data-icon-compare]');

            doc.off('click.removeAllCompareItem', compareRemoveAll).on('click.removeAllCompareItem', compareRemoveAll, function(e) {
                e.preventDefault();
                e.stopPropagation();

                 $('[data-compare-added]').remove();

                 compareArr.splice(0,compareArr.length);
                 localStorage.setItem('compareArr', JSON.stringify(compareArr));

                 if (compareElm.hasClass('compare-added')) {
                    compareElm.removeClass('compare-added');
                    compareElm.find('.compare-text').text(window.inventory_text.add_compare);
                 }

                 totalProduct = Math.ceil(compareArr.length);
                 compareCountNum.text(totalProduct);
            })
        },

        InitsidebarFilter: function(){
          $(document).on('click', '.halo-fillter', function(){
            $('html').toggleClass('filter-open');

            $('.wrap-overlay, .close-filter a').on('click', function(){
              $('html').removeClass('filter-open');
            });

          });
        },

        initCollectionPagging: function() {
            var data = JSON.parse(localStorage.getItem('items'));

            var collectionpaggingContainer = $('#collection-paginate');
            var paggingTpl = '<li class="text disabled prev"><a href="#" title="'+window.inventory_text.previous+'"><i class="fa fa-angle-left" aria-hidden="true"></i><span>'+window.inventory_text.previous+'</span></a></li>';
            var collectionContainer = $('[data-collection-container]');
                
            collectionpaggingContainer.children().remove();

            var totalCollection = $('.list-collection .grid-item').size();
            var totalPages = Math.ceil(totalCollection / 12);

            if (totalPages <= 1) {
                return;
            }

            for (var i = 0; i < totalPages; i++) {
                var pageNum = i + 1;
                if (i === 0) paggingTpl += '<li class="active"><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'"><span>' + pageNum + '</span></a></li>'                
                else paggingTpl += '<li><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'"><span>' + pageNum + '</span></a></li>'
            }

            paggingTpl += '<li class="text next"><a href="#" title="'+window.inventory_text.next+'"><span>'+window.inventory_text.next+'</span><i class="fa fa-angle-right" aria-hidden="true"></i></a></li>';

            collectionpaggingContainer.append(paggingTpl);

            collectionContainer.children().each(function(idx, elm) {
                if (idx >= 0 && idx < 12) {
                    $(elm).show();
                }
                else {
                    $(elm).hide();
                }
            });

            collectionpaggingContainer.off('click.coll-pagging').on('click.coll-pagging', 'li a', function(e) {
                e.preventDefault();

                var isPrev = $(this).parent().hasClass('prev');
                var isNext = $(this).parent().hasClass('next');
                var pageNumber = $(this).data('page');

                if (isPrev) {
                    var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
                    pageNumber = curPage - 1;
                }

                if (isNext) {
                    var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
                    pageNumber = curPage + 1;
                }

                collectionContainer.children().each(function(idx, elm) {
                    if (idx >= (pageNumber - 1) * 12 && idx < pageNumber * 12) {
                        $(elm).show();
                    }
                    else {
                        $(elm).hide();
                    }
                });

                if (pageNumber === 1) {
                    collectionpaggingContainer.find('.prev').addClass('disabled');
                    collectionpaggingContainer.find('.next').removeClass('disabled');
                }
                else if (pageNumber === totalPages) {
                    collectionpaggingContainer.find('.next').addClass('disabled');
                    collectionpaggingContainer.find('.prev').removeClass('disabled');
                }
                else {
                    collectionpaggingContainer.find('.prev').removeClass('disabled');
                    collectionpaggingContainer.find('.next').removeClass('disabled');
                }

                $(this).parent().siblings('.active').removeClass('active');
                collectionpaggingContainer.find('[data-page="' + pageNumber + '"]').parent().addClass('active');

            });
        },

        customEngraving: function() {
            var customEngraving = '[data-custom-engraving]';
            var customEngravingPrice = parseFloat(window.custom_engraving_price);
            if($('.custom-engraving select').length == 0){
                $('#product-custom-engraving').remove();
                return false;
            }
            $('body').on('click','#product-custom-engraving',function(e) {
                e.preventDefault();
                $('.alert_engraving').removeClass('show_alert');
                var variant_first = $('.gift-boxes .grid-item.selected').data('id');
                if($('.custom-engraving select').length == 0){
                    return false;
                }
                if($('#custom-engraving-enable').is(':checked')){
                  $('#custom-engraving-enable').prop("checked", false);
                  $('#custom-engraving').removeClass('added');
                  $('.custom-engraving select').val('non-engraving').change();
                  $('.text-cus').remove();


                  var price_custom = $('.total-price').attr('data-price');

                  var totalPrice = parseInt(price_custom) - customEngravingPrice;
                  $('.produc .total-price').text('$'+parseFloat(totalPrice).toFixed(2));

                  var engraving_variant = '';
                  $('.group-product-1 input[name=id]').val(variant_first);
                  return false;
                }
            });
           
            $("body").on('click', '.add_customize',function(){

                var custom_line_1 = $.trim($(this).parents('.col-row').find('.properties_line1').val());
                var custom_line_2 = $.trim($(this).parents('.col-row').find('.properties_line2').val());
                var price_custom = parseFloat($('.product .prices').attr('data-price'));

                $(this).parents('.col-row').find('.error-valid').remove();

                var error_value = $(this).parent().data('error');
                var noError = true;

                if($('.properties_line1').hasClass('error')){
                  noError = false;
                }
                if($('.properties_line2').hasClass('error')){
                  noError = false;
                }

                if(custom_line_1.length >=1 && custom_line_2.length >=1 && noError){
                  $('#product_custom_engraving .close.close-modal').trigger('click');
                  $('#custom-engraving').addClass('added');
                  $('#custom-engraving-enable').prop("checked", true);
                  
                  var engraving_variant = '';
                  $('.gift-boxes .grid-item.selected').find('.option-custom option').each(function(){
                    engraving_variant = $(this).val();
                    $('.group-product-1 input[name=id]').val(engraving_variant);
                  });
                  var totalPrice = parseInt(price_custom) + customEngravingPrice;

                    if ($('.product .prices .on-sale').length) {
                        $('.product .prices .on-sale').attr('data-price',totalPrice);
                        $('.product .prices .on-sale').html(Shopify.formatMoney(totalPrice, window.money_format));
                    } else {
                        $('.product .prices .money').attr('data-price',totalPrice);
                        $('.product .prices .money').html(Shopify.formatMoney(totalPrice, window.money_format));
                    }
                    $('.product .total-price .total-money').attr('data-price',totalPrice * $('[name="quantity"]').val());
                    $('.product .total-price .total-money').html(Shopify.formatMoney(totalPrice * $('[name="quantity"]').val(), window.money_format));
                    $('.custom-engraving select').val("custom-engraving").change();
                    $('.text-cus').remove();
                    $('.product .price').after('<span class="text-cus">(+Customization)</span>');
                } else {
                  $(this).after('<div class="error-valid">' + error_value + '</div>');
                }
            });
        },

        showModalError: function(selector){
          $(selector).fadeIn(500);

          lynkco.lynkcoTimeout = setTimeout(function() {
            $(selector).fadeOut(500);
          }, 5000);

          $(document).on('click touchstart', function(){
            $(selector).fadeOut(500);
          });
        },
        
        initGroupedAddtoCart: function(){      
          $('.group_option select').change(function(){
            var optionValue1 = $(this).val(),
                optionImg = $(this).find('option:selected').data('img'),
                optionprice = $(this).find('option:selected').data('price');


            $(this).parents('.group_option').find('input[type=hidden]').val(optionValue1);
            $(this).parents('.group_product').find('.group-img img').attr({ src: optionImg });

            $(this).parents('.group_product').find('.group-price').html(Shopify.formatMoney(optionprice, window.money_format));
            console.log(Shopify.formatMoney(optionprice, window.money_format));
            if (luxwatches.checkNeedToConvertCurrency()) {
              Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }
          });

          $(".group_content .button").on('click', function(e) {

            var oldValue = $(this).parents('.group_option').find('.group_number').val(),
                newVal = 0;
            if($(this).hasClass('active')) {
                $(this).removeClass('active');
              newVal = 0;
            } else {
                $(this).addClass('active');
              newVal = 1;
            }

            $(this).parents('.group_option').find('.group_number').val(newVal);
          });

          $('#product-add-to-cart').on('click', function(e) {
            e.preventDefault();
            var handle = $(this).parent('.groups-btn').data('handle');
            
            var self = $(this);
                var thisForm = $(self.data('form-id'));
                var data = thisForm.serialize();  

            Shopify.queue = [];
            jQuery('.group_content .group_number').each(function() {
              var DataId = $(this).parents('.extra').find('input[type=hidden]').attr('value'),
                  DataQty = $(this).val();
              if ( DataQty > 0 && DataId !== '') {
                Shopify.queue.push({
                  variantId: DataId,
                  quantity: parseInt(DataQty, 10) || 0
                });
              }
            });

            Shopify.moveAlong = function() {
              if (Shopify.queue.length) {
                var request = Shopify.queue.shift();
                $.ajax({
                  type: 'POST',
                  url: '/cart/add.js',
                  data: {quantity: request.quantity, id:request.variantId},
                  dataType: 'json',
                  beforeSend: function() {
                    luxwatches.showLoading();
                  },
                  success:function(cart) {
                    luxwatches.hideLoading();
                    Shopify.moveAlong();
                  },
                  error: function(xhr, text) {
                    luxwatches.hideLoading();
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    luxwatches.showModalError('.ajax-error-modal');
                  }
                });
              }

              else {

                if ($(this).attr('disabled') != 'disabled') {

                  if (!window.ajax_cart) {
                    $(this).closest('form').submit();
                  } 

                  else {
                    var variant_id = $('#add-to-cart-form select[name=id]').val();

                    if (!variant_id) {
                      variant_id = $('#add-to-cart-form input[name=id]').val();
                    }

                    var quantity = $('#add-to-cart-form input[name=quantity]').val();

                    if (!quantity) {
                      quantity = 1;
                    }

                    luxwatches.doAjaxAddToCartNormal(data,variant_id, quantity, handle);
                  }
                }
                return false;
              }

            };

            Shopify.moveAlong();

             var heightHeader = $('.header-bottom').outerHeight();
            if ($(window).innerWidth() >= 1200) {
                $('.dropdown-border', $(document)).css('top',heightHeader+'px');
                $('.dropdown-border.menu-open').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
                $('.dropdown-border').css({ 'height': 'calc(100vh - ' + heightHeader+ 'px)' });
            }
            
            return false;
          });

        },

        hide_filter: function(){
          $(".sidebar-tags .widget-content ul").each(function() {   
            if ($(this).children('li').length > 0) {
              $(this).parents('.sidebar-tags').show();
            } else { 
              $(this).parents('.sidebar-tags').hide();
            }
          });
        },

        checkbox_checkout: function(){
            var inputWrapper = $('.checkbox-group label');  

            inputWrapper.off('click').on('click', function (e) {
                var inputTrigger= $(this).parent().find('.conditions'),
                    divAddClassbtn = $(this).parent().parent().find('.btn-checkout');
                if(divAddClassbtn.hasClass('show')){
                    divAddClassbtn.removeClass('show');
                }else{
                  divAddClassbtn.addClass('show');
                }
                inputTrigger.trigger('click');
            });
        }
        
    };

})(jQuery);
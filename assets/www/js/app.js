
/* create our own namespace */
var RocknCoder = {
  Pages: {},
  Container: {width: 200, height: 200},
  hasPhoto: false,
  DeviceReady: false
}

document.addEventListener('deviceready', function () {
  RocknCoder.DeviceReady = true;
  console.log("device ready");
}, false);

RocknCoder.Code = (function (RocknCoder, $) {
	"use strict";

// dispatch jQuery Mobile Events
  RocknCoder.Pages.Kernel = function (event) {
    var that = this,
      eventType = event.type,
      pageName = $(this).attr("data-rockncoder-jspage");
    if (RocknCoder && RocknCoder.Pages && pageName && RocknCoder.Pages[pageName] && RocknCoder.Pages[pageName][eventType]) {
      RocknCoder.Pages[pageName][eventType].call(that);
    }
  };

  RocknCoder.Pages.Events = (function () {
    $("div[data-rockncoder-jspage]").on(
      'pagebeforecreate pagecreate pagebeforeload pagebeforeshow pageshow pagebeforechange pagechange pagebeforehide pagehide pageinit',
      RocknCoder.Pages.Kernel
    );
  }());

  function getDimensions() {
    // the iphone specific code is kind of kludgy, if you have a better way let me know
    var isIPhone = (/iphone/gi).test(navigator.appVersion),
      iPhoneHeight = (isIPhone ? 60 : 0),
      width = $(window).width(),
      height = $(window).height(),
    /* if one of these doesn't exist, assign 0 rather than a null or undefined */
      hHeight = $('header').outerHeight() || 0,
      fHeight = $('footer').outerHeight() || 0;
    return {
      width: width - 4,
      height: height - hHeight - fHeight - 4 + iPhoneHeight
    };
  }

  /* determine the size of the jQuery Mobile content area for dynamic sizing */
  RocknCoder.Dimensions = (function () {
    var width, height, headerHeight, footerHeight, contentHeight,
      getContentDimensions = function () {
        /* the iphone specific code is kind of kludgy, if you have a better way let me know */
        var isIPhone = (/iphone/gi).test(navigator.appVersion),
          iPhoneHeight = (isIPhone ? 60 : 0),
          width = $(window).width(),
          height = $(window).height(),
        /* if one of these doesn't exist, assign 0 rather a null or undefined */
          hHeight = $('header').outerHeight() || 0,
          fHeight = $('footer').outerHeight() || 0;
        return {
          width: width - 4,
          height: height - hHeight - fHeight - 4 + iPhoneHeight
        };
      },
      init = function () {
        width = $(window).width();
        height = $(window).height();
        headerHeight = $("header", $.mobile.activePage).height();
        footerHeight = $("footer", $.mobile.activePage).height();
        contentHeight = height - headerHeight - footerHeight;
      };
    return {
      init: init,
      getContent: getContentDimensions
    };
  }());

  RocknCoder.Pages.page1 = (function () {
    var dims,
    /* cache the selectors to some DOM elements */
      $thePicture = $("#thePicture"),
      thePicture = $thePicture.get(0),
      $snapPicture = $("#snapPicture"),
      $picFrame = $("#picFrame"),
      $theCanvas = $("#theCanvas"),
      #tweakPicture = $("#tweakPicture"),
      theCanvas,
      ctx,

    /* once the image is loaded, get its dimensions */
      picLoaded = function () {
        var width, height;
        width = $thePicture.width();
        height = $thePicture.height();
        /* if you'd like to see the dimensions of the photo, uncomment the line below */
        // alert(" w x h = " + width + ", " + height);
        /* cause the image to scale by setting one of it dimension */
        if (width > height) {
          $thePicture.width(RocknCoder.Container.width);
        } else {
          $thePicture.height(RocknCoder.Container.height);
        }
        /* and copy it to the canvas */
        theCanvas = $theCanvas.get(0);
        ctx = theCanvas.getContext('2d');
        ctx.drawImage(thePicture, 0, 0, width, height, 10, 10, 194, 259);
        //$thePicture.hide();
      },
    /* a picture has been successfully returned */
      picSuccess = function (imageData) {
        $thePicture.attr('src', "data:image/jpeg;base64," + imageData).load(picLoaded);
      },
    /* there was an error, message contains its cause */
      picFail = function (message) {
        alert("Failed because: " + message);
      };
    return {
      pageshow: function () {
        RocknCoder.Dimensions.init();
        dims = RocknCoder.Dimensions.getContent();
        $picFrame.css({
          width: dims.width,
          height: dims.height
        });
        $theCanvas.css({
          width: dims.width,
          height: dims.height
        });
        RocknCoder.Container = {
          width: dims.width,
          height: dims.height
        };
        /* Bind to the snap button */
        $snapPicture.unbind('tap').tap(function (event) {
          event.preventDefault();
          event.stopPropagation();
          navigator.camera.getPicture(
            picSuccess,
            picFail,
            {quality: 35, destinationType: navigator.camera.DestinationType.DATA_URL}
          );
          return false;
        });
      },
      pagehide: function () {
        $snapPicture.unbind('tap');
      }
    };
  }());
}(RocknCoder, $));

"use strict";
var scRippleBehaviors = require("../sc-ripple-behaviors/sc-ripple-behaviors");
Component({
  behaviors: [scRippleBehaviors],
  properties: {
  
  },
  data: {
    tap: !1
  },
  relations: {
    "../scForm/sc-form": {
      type: "parent"
    }
  },
  externalClasses: ["sc-class", "sc-ripple-class"],

  methods: {
    _returnEventData: function (e) {
      
    },
    _tap: function (e) {
      this._addRipple_(e), this.setData({
        tap: !0
      })
    },
    _longPress: function (e) {
      this._longPress_(e), this.setData({
        tap: !0
      })
    },
    _rippleAnimationEnd: function () {
      this._rippleAnimationEnd_()
    },
    
    _touchEnd: function () {
      var e = this;
      this._touchEnd_(), setTimeout(function () {
        e.setData({
          tap: !1
        })
      }, 150)
    }
  }
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.updateRenderType = updateRenderType;
exports.updateGuiDisplay = updateGuiDisplay;
exports.createController = createController;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dat = require('dat.gui');

var _dat2 = _interopRequireDefault(_dat);

require('./Controller.css');

var _ControllerConstants = require('../../core/ControllerConstants');

var _random = require('../../core/utils/random');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONFIG_STORAGE_KEY = 'SVGURT_CONFIG_SAVE';
var DEFAULT_CONFIG_NAME = 'Default Config';

var ControllerConfig = function () {
  function ControllerConfig() {
    var _this = this;

    (0, _classCallCheck3.default)(this, ControllerConfig);

    this.configs = {};
    _lodash2.default.each(_ControllerConstants.controllerConfig, function (configItem, index) {
      _this[index] = configItem.default;
    });

    this.configNames = [];

    this.loadConfigFromStore();

    this.currentConfigName = DEFAULT_CONFIG_NAME;
  }

  (0, _createClass3.default)(ControllerConfig, [{
    key: 'getCurrentConfigName',
    value: function getCurrentConfigName() {
      return this.currentConfigName;
    }
  }, {
    key: 'getConfigNames',
    value: function getConfigNames() {
      return this.configNames;
    }
  }, {
    key: 'loadConfigFromStore',
    value: function loadConfigFromStore() {
      var _this2 = this;

      var configLoad = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY));

      var hasDefaultKeySave = false;

      _lodash2.default.each(configLoad, function (config, key) {
        if (key === DEFAULT_CONFIG_NAME) {
          hasDefaultKeySave = true;
        }
        _this2.configs[key] = config;
        _this2.configNames.push(key);
      });

      if (!hasDefaultKeySave) {
        this.configNames.push(DEFAULT_CONFIG_NAME);
        this.configs[DEFAULT_CONFIG_NAME] = {};

        _lodash2.default.each(_ControllerConstants.controllerConfig, function (configItem, index) {
          _this2.configs[DEFAULT_CONFIG_NAME][index] = configItem.default;
        });
      }
    }
  }, {
    key: 'loadConfig',
    value: function loadConfig(configNameToLoad) {
      var _this3 = this;

      if (configNameToLoad !== this.currentConfigName) {
        this.saveConfigs();

        _lodash2.default.each(_ControllerConstants.controllerConfig, function (configItem, index) {
          _this3[index] = _this3.configs[configNameToLoad][index];
        });
        this.currentConfigName = configNameToLoad;
      }
    }
  }, {
    key: 'loadConfigFromJson',
    value: function loadConfigFromJson() {
      // console.log('loadNewConfig', newConfigName);
      // _.each(controllerConfig, (configItem, index) => {
      //   this[index] = configItem.default;
      // });
      alert('Coming soon.');
    }
  }, {
    key: 'createNewConfig',
    value: function createNewConfig() {
      var _this4 = this;

      var newConfigName = prompt('Please enter the name of the configuration');

      if (!newConfigName || newConfigName === null) {
        return;
      }

      this.configs[newConfigName] = {};

      _lodash2.default.each(_ControllerConstants.controllerConfig, function (configItem, index) {
        _this4.configs[newConfigName][index] = _this4[index];
      });

      this.currentConfigName = newConfigName;
      this.configNames.push(newConfigName);

      this.saveConfigs();
    }
  }, {
    key: 'revertCurrentConfig',
    value: function revertCurrentConfig() {
      var _this5 = this;

      _lodash2.default.each(_ControllerConstants.controllerConfig, function (configItem, index) {
        _this5[index] = _this5.configs[_this5.currentConfigName][index];
      });
    }
  }, {
    key: 'saveConfigs',
    value: function saveConfigs() {
      var _this6 = this;

      _lodash2.default.each(_ControllerConstants.controllerConfig, function (configItem, index) {
        _this6.configs[_this6.currentConfigName][index] = _this6[index];
      });

      localStorage.setItem(CONFIG_STORAGE_KEY, (0, _stringify2.default)(this.configs));
    }
  }, {
    key: 'deleteConfig',
    value: function deleteConfig() {
      var _this7 = this;

      if (this.currentConfigName !== DEFAULT_CONFIG_NAME) {
        if (window.confirm('Are you sure you want delete this config?')) {
          this.configs[this.currentConfigName] = null;
          delete this.configs[this.currentConfigName];
          this.configNames = _lodash2.default.filter(this.configNames, function (name) {
            return name !== _this7.currentConfigName;
          });
          this.currentConfigName = DEFAULT_CONFIG_NAME;
          _lodash2.default.each(_ControllerConstants.controllerConfig, function (configItem, index) {
            _this7[index] = _this7.configs[DEFAULT_CONFIG_NAME][index];
          });
          this.saveConfigs();
        }
      } else {
        alert('You cannot delete the default config. Sorry :)');
      }
    }
  }]);
  return ControllerConfig;
}();

function updateRenderType(controller) {
  var newRenderType = controller.config.svgRenderType;
  var svgFolder = controller.svgFolder;
  var fractalFolder = controller.svgFolder.fractalFolder;

  if (controller.svgFolder.fractalFolder) {
    svgFolder.removeFolder(fractalFolder);
  }
  controller.svgFractalControls = {};
  _lodash2.default.each(controller.svgChangingControls, function (svgRenderSettingController) {
    svgFolder.remove(svgRenderSettingController);
  });
  controller.svgChangingControls = {};
  _lodash2.default.each(controller.svgRenderChangingControls, function (svgRenderChangingController) {
    svgFolder.remove(svgRenderChangingController);
  });
  controller.svgRenderChangingControls = {};

  var mainController = controller.config;

  controller.svgRenderChangingControls.svgRenderType = svgFolder.add(mainController, 'svgRenderType', _lodash2.default.keys(_ControllerConstants.SVG_RENDER_TYPES));

  // eslint-disable-next-line default-case
  switch (newRenderType) {
    case _ControllerConstants.SVG_RENDER_TYPES.TRACE:
      {
        controller.svgChangingControls['noiseSize'] = svgFolder.add(mainController, 'noiseSize', 0, 200);
        controller.svgRenderChangingControls['fill'] = svgFolder.add(mainController, 'fill');
        if (mainController.fill) {
          controller.svgChangingControls['fillColor'] = svgFolder.addColor(mainController, 'fillColor');
        }

        controller.svgRenderChangingControls['stroke'] = svgFolder.add(mainController, 'stroke');
        if (mainController.stroke) {
          controller.svgChangingControls['strokeColor'] = svgFolder.addColor(mainController, 'strokeColor');
          controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 100);
          controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
        }
        break;
      }
    case _ControllerConstants.SVG_RENDER_TYPES.CIRCLE:
      {
        controller.svgChangingControls['minColorRecognized'] = svgFolder.add(mainController, 'minColorRecognized', 0, 255).step(1);
        controller.svgChangingControls['maxColorRecognized'] = svgFolder.add(mainController, 'maxColorRecognized', 0, 255).step(1);
        controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
        controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);
        controller.svgRenderChangingControls['fill'] = svgFolder.add(mainController, 'fill');
        if (mainController.fill) {
          controller.svgChangingControls['fillColor'] = svgFolder.addColor(mainController, 'fillColor');
        }

        controller.svgRenderChangingControls['stroke'] = svgFolder.add(mainController, 'stroke');
        if (mainController.stroke) {
          controller.svgRenderChangingControls['autoColor'] = svgFolder.add(mainController, 'autoColor');
          if (!mainController.autoColor) {
            controller.svgChangingControls['strokeColor'] = svgFolder.addColor(mainController, 'strokeColor');
          }
          controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 100);
          controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
        }

        controller.svgChangingControls['radius'] = svgFolder.add(mainController, 'radius', 0, 50);
        controller.svgChangingControls['radiusOnColor'] = svgFolder.add(mainController, 'radiusOnColor');
        controller.svgChangingControls['radiusRandomness'] = svgFolder.add(mainController, 'radiusRandomness', 0, 1);
        break;
      }
    case _ControllerConstants.SVG_RENDER_TYPES.CURVE:
      {
        controller.svgChangingControls['minColorRecognized'] = svgFolder.add(mainController, 'minColorRecognized', 0, 255).step(1);
        controller.svgChangingControls['maxColorRecognized'] = svgFolder.add(mainController, 'maxColorRecognized', 0, 255).step(1);
        controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
        controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);

        controller.svgRenderChangingControls['autoColor'] = svgFolder.add(mainController, 'autoColor');
        if (!mainController.autoColor) {
          controller.svgChangingControls['strokeColor'] = svgFolder.addColor(mainController, 'strokeColor');
        }
        controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 100);
        controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
        controller.svgChangingControls['waves'] = svgFolder.add(mainController, 'waves', 0, 50);
        controller.svgChangingControls['wavesRandomness'] = svgFolder.add(mainController, 'wavesRandomness', 0, 1);
        controller.svgChangingControls['direction'] = svgFolder.add(mainController, 'direction', 0, 360);
        controller.svgChangingControls['directionRandomness'] = svgFolder.add(mainController, 'directionRandomness', 0, 1);
        controller.svgChangingControls['amplitude'] = svgFolder.add(mainController, 'amplitude', 0, 100);
        controller.svgChangingControls['amplitudeRandomness'] = svgFolder.add(mainController, 'amplitudeRandomness', 0, 1);
        // controller.svgRenderChangingControls['continuous'] = svgFolder.add(mainController, 'continuous');
        // if (!mainController.continuous) {
        controller.svgChangingControls['wavelength'] = svgFolder.add(mainController, 'wavelength', 0, 100);
        controller.svgChangingControls['wavelengthRandomness'] = svgFolder.add(mainController, 'wavelengthRandomness', 0, 1);
        // }
        break;
      }
    case _ControllerConstants.SVG_RENDER_TYPES.LINE:
      {
        controller.svgChangingControls['minColorRecognized'] = svgFolder.add(mainController, 'minColorRecognized', 0, 255).step(1);
        controller.svgChangingControls['maxColorRecognized'] = svgFolder.add(mainController, 'maxColorRecognized', 0, 255).step(1);

        controller.svgRenderChangingControls['stroke'] = svgFolder.add(mainController, 'stroke');
        if (mainController.stroke) {
          controller.svgRenderChangingControls['autoColor'] = svgFolder.add(mainController, 'autoColor');
          if (!mainController.autoColor) {
            controller.svgChangingControls['strokeColor'] = svgFolder.addColor(mainController, 'strokeColor');
          }
          controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 100);
          controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
        }
        controller.svgRenderChangingControls['continuous'] = svgFolder.add(mainController, 'continuous');
        if (!mainController.continuous) {
          controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
          controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);
          controller.svgChangingControls['lineLength'] = svgFolder.add(mainController, 'lineLength', 0, 300);
          controller.svgChangingControls['lengthOnColor'] = svgFolder.add(mainController, 'lengthOnColor');
          controller.svgChangingControls['lengthRandomness'] = svgFolder.add(mainController, 'lengthRandomness', 0, 1);
          controller.svgChangingControls['direction'] = svgFolder.add(mainController, 'direction', 0, 360);
        } else {
          controller.svgChangingControls['minLineLength'] = svgFolder.add(mainController, 'minLineLength', 1, 50).step(1);
          controller.svgChangingControls['crossHatch'] = svgFolder.add(mainController, 'crossHatch');
          controller.svgChangingControls['amountOfLines'] = svgFolder.add(mainController, 'amountOfLines', 1, 5000).step(1);

          // Ensure the direction isn't already out of bounds.
          if (mainController.direction > 180) {
            mainController.direction = 180;
          }

          controller.svgChangingControls['direction'] = svgFolder.add(mainController, 'direction', 0, 180);
        }
        controller.svgChangingControls['directionRandomness'] = svgFolder.add(mainController, 'directionRandomness', 0, 1);
        break;
      }
    case _ControllerConstants.SVG_RENDER_TYPES.RECURSIVE:
      {
        controller.svgChangingControls['minColorRecognized'] = svgFolder.add(mainController, 'minColorRecognized', 0, 255).step(1);
        controller.svgChangingControls['maxColorRecognized'] = svgFolder.add(mainController, 'maxColorRecognized', 0, 255).step(1);
        controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
        controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);
        controller.svgChangingControls['strokeColor'] = svgFolder.addColor(mainController, 'strokeColor');
        controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 100);
        controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
        controller.svgChangingControls['recursiveAlgorithm'] = svgFolder.add(mainController, 'recursiveAlgorithm', _lodash2.default.keys(_ControllerConstants.RECURSIVE_LINE_ALGORITHMS));
        controller.svgChangingControls['maxRecursiveDepth'] = svgFolder.add(mainController, 'maxRecursiveDepth', 1, 1000).step(1);
        break;
      }
    case _ControllerConstants.SVG_RENDER_TYPES.CONCENTRIC:
      {
        controller.svgChangingControls['strokeColor'] = svgFolder.addColor(mainController, 'strokeColor');
        controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 100);
        controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
        controller.svgChangingControls['circleArcs'] = svgFolder.add(mainController, 'circleArcs', 2, 400).step(1);
        controller.svgChangingControls['intensityWeight'] = svgFolder.add(mainController, 'intensityWeight', 500, 1000000);
        controller.svgChangingControls['radiusStep'] = svgFolder.add(mainController, 'radiusStep', 1, 100).step(1);
      }
  }
  // Add Displacement Fractal Field settings to to the end of SVG controls
  var newFractalFolder = svgFolder.addFolder('Displacement Fractal Field');
  controller.svgFolder.fractalFolder = newFractalFolder;
  controller.svgFractalControls['applyFractalDisplacement'] = newFractalFolder.add(mainController, 'applyFractalDisplacement');
  controller.svgFractalControls['displacementAmount'] = newFractalFolder.add(mainController, 'displacementAmount', 0, 200);
  controller.svgFractalControls['displaceOrigin'] = newFractalFolder.add(mainController, 'displaceOrigin');
  controller.svgFractalControls['fractalRatioX'] = newFractalFolder.add(mainController, 'fractalRatioX', 0, 1);
  controller.svgFractalControls['fractalRatioY'] = newFractalFolder.add(mainController, 'fractalRatioY', 0, 1);
  controller.svgFractalControls['fractalRandomSeed'] = newFractalFolder.add(mainController, 'fractalRandomSeed', 0, _random.MAX_SEED).step(1);
}

var datConfig = {
  autoPlace: false
};

// This is a bit of a hack to force an update of dat gui.
function updateGuiDisplay(gui) {
  // eslint-disable-next-line
  for (var i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
  }

  // eslint-disable-next-line
  for (var f in gui.__folders) {
    updateGuiDisplay(gui.__folders[f]);
  }
}

function createController() {
  var gui = new _dat2.default.GUI(datConfig);

  var guiContainer = document.getElementById('js-dat-gui-container');
  guiContainer.appendChild(gui.domElement);

  var controller = {
    imageChangingControls: {},
    svgChangingControls: {},
    svgSettingControls: {}
  };

  var mainController = new ControllerConfig();

  controller['Live Update'] = gui.add(mainController, 'Live Update');
  controller.imageChangingControls['scale'] = gui.add(mainController, 'scale', 0.01, 3);

  var imageFolder = gui.addFolder('Image Controls');

  controller.imageChangingControls['grayscale'] = imageFolder.add(mainController, 'grayscale');
  controller.imageChangingControls['invert'] = imageFolder.add(mainController, 'invert');
  controller.imageChangingControls['blur'] = imageFolder.add(mainController, 'blur', 0, 30).step(1);
  var posterizeFolder = imageFolder.addFolder('Posterize');
  controller.imageChangingControls['posterize'] = posterizeFolder.add(mainController, 'posterize');
  controller.imageChangingControls['posterizeLevels'] = posterizeFolder.add(mainController, 'posterizeLevels', 1, 30).step(1);
  var edgeDetectionFolder = imageFolder.addFolder('Edge Detection');
  controller.imageChangingControls['Edge Detection'] = edgeDetectionFolder.add(mainController, 'Edge Detection');
  controller.imageChangingControls['lowThreshold'] = edgeDetectionFolder.add(mainController, 'lowThreshold', 0, 128).step(1);
  controller.imageChangingControls['highThreshold'] = edgeDetectionFolder.add(mainController, 'highThreshold', 0, 128).step(1);
  var fieldFolder = imageFolder.addFolder('Fractal Field Opacity');
  controller.imageChangingControls['applyFractalField'] = fieldFolder.add(mainController, 'applyFractalField');
  controller.imageChangingControls['fieldOpacity'] = fieldFolder.add(mainController, 'fieldOpacity', 0, 1);
  controller.imageChangingControls['fieldRatioX'] = fieldFolder.add(mainController, 'fieldRatioX', 0, 1);
  controller.imageChangingControls['fieldRatioY'] = fieldFolder.add(mainController, 'fieldRatioY', 0, 1);
  controller.imageChangingControls['fieldRandomSeed'] = fieldFolder.add(mainController, 'fieldRandomSeed', 0, _random.MAX_SEED).step(1);
  controller.imageChangingControls['postBlur'] = imageFolder.add(mainController, 'postBlur', 0, 30).step(1);

  var svgFolder = gui.addFolder('SVG Controls');
  controller.svgFolder = svgFolder;

  controller.gui = gui;
  controller.config = mainController;

  updateRenderType(controller);

  return controller;
}
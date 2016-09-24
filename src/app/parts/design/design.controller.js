(function () {
    'use strict';

    angular
        .module('app.parts.design')
        .controller('BasicApiController', BasicApiController)
        .controller('CustomPageController', CustomPageController)
        .controller('PreviewFrameController', PreviewFrameController);

    /* @ngInject */
    function BasicApiController(articleProduct, $auth, $firebaseStorage, $scope,$state, $stateParams) {
        $scope.$get = $firebaseStorage.get;
        $scope.$getProduct = articleProduct.getProduct;
        $scope.$getArticle = articleProduct.getArticle;
        $scope.$queryList = articleProduct.queryList;
        $scope.$queryProduct = articleProduct.queryProduct;
        $scope.$queryArticle = articleProduct.queryArticle;
        $scope.$getCate = articleProduct.getCate;
        $scope.$getCateCrumbs = articleProduct.getCateCrumbs;
        $scope.$cate = articleProduct.cate;
        $scope.$auth = $auth;
        $scope.$login = function(pageName, state){
            var toParams = {
                pageName: pageName || $stateParams.pageName,
                params: JSON.stringify($stateParams.params)
            };
            if($state.name!=='customPage'){
                toParams.stateName=$state.name;
            }
            $state.go('authentication.login', toParams);
        };
        $scope.params = JSON.parse($stateParams.params || '{}');
        if (!$scope.$go) $scope.$go = function (pageName, params) {
            var _params = {};
            if (angular.isObject(params)) angular.extend(_params, params);
            console.log(params);
            console.log({pageName: pageName, params: JSON.stringify(_params)});
        };
    }

    /* @ngInject */
    function CustomPageController(pageData, $scope, customService, $stateParams, $timeout, $state) {
        var customPage = this;
        // window.parent.setUpPreviewFrame();

        window.previewRefresh = function (data) {
            console.log(data);
        };


        $scope.$go = function (pageName, params) {
            var _params = {};
            if (angular.isObject(params)) angular.extend(_params, params);
            $state.go('customPage', {
                pageName: pageName || $stateParams.pageName,
                params: JSON.stringify(_params)
            });
        };

        angular.extend(customPage, $stateParams);


        setModelData(pageData, pageData.cssKey);

        function setModelData(val, key) {
            $timeout(function () {
                customPage.pageData = val;
                customPage.html = customService.compileAll(val.content);
                customPage.js = val.js;
                customPage.sources = val.sources;
            }, 0);
        }
    }

    /* @ngInject */
    function PreviewFrameController($lazyLoad, $scope, customService, $stateParams, $timeout, $state) {
        var customPage = this;

        angular.extend(customPage, $stateParams);


        window.refreshPreview = function (data, type) {
            switch (type) {
                case 'init':
                    $lazyLoad.load(data, $stateParams.pageName).then(function (pageData) {
                        setModelData(pageData);
                    });
                    break;
                default:
                    setModelData(data);
                    break;
            }
        };
        window.parent.initPreviewFrame();

        function setModelData(val) {
            $timeout(function () {
                customPage.pageData = val;
                customPage.html = customService.compileAll(val.content);
                customPage.js = val.js;
                customPage.sources = val.sources;
            }, 0);
        }
    }
})();

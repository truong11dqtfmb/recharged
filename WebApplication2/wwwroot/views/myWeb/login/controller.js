var ctxfolder = "/views/myWeb/login";

var app = angular.module("App_ESEIM", ["ngRoute"]);

app.factory('dataservice', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose"
    };

    return {
        login: function (data) {
            return $http.post('/Login/Login/', data, { headers: headers });
        },
    };
});

app.controller("Ctrl_ESEIM", function ($scope) {

});

app.config(function ($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: ctxfolder + '/index.html',
            controller: "index"
        })
        .otherwise({
            redirectTo: "/"
        })
        ;
    $locationProvider.html5Mode(true);
});

app.controller("index", function ($scope, dataservice) {
    $scope.model = {
        UserName: "",
        PassWord: "",
        showPass: false
    };

    $scope.submit = function () {
        if (!validate()) {
            $scope.isLoading = true;
            dataservice.login($scope.model)
                .then(function (response) {
                    if (response.data.hasError) {
                        $scope.message = "Thông tin đăng nhập không chính xác!";
                    } else {
                        window.location.reload();
                    }
                    $scope.isLoading = false;
                })
                .catch(function (error) {
                    $scope.isLoading = false;
                    console.log('Error when LOGIN');
                });
        } else {
            $scope.message = "Nhập đầy đủ thông tin để đăng nhập!";
        }
    };

    // VALIDATE
    $scope.Error = {
        UserName: false,
        PassWord: false
    };
    $scope.changeModel = function (type) {
        if (type == "username" && $scope.model.UserName != "") {
            $scope.Error.UserName = false;
        }
        if (type == "password" && $scope.model.PassWord != "") {
            $scope.Error.PassWord = false;
        }
        if ($scope.model.UserName != "" && $scope.model.PassWord != "") {
            $scope.message = "";
        }
    };
    function validate() {
        var hasError = false;
        if ($scope.model.UserName == "" || $scope.model.UserName == undefined) {
            hasError = true;
            $scope.Error.UserName = true;
        }
        if ($scope.model.PassWord == "" || $scope.model.PassWord == undefined) {
            hasError = true;
            $scope.Error.PassWord = true;
        }
        return hasError;
    };
    $scope.register = function () {
        window.location.href = "/Register/Index";
    };
});
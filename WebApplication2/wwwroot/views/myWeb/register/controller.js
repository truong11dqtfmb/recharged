var ctxfolder = "/views/myWeb/register";

var app = angular.module("App_ESEIM", ["ngRoute"]);

app.factory('dataservice', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose"
    };

    return {
        register: function (data) {
            return $http.post('/Register/register/', data, { headers: headers });
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
        AgainPassWord: "",
        Phone: "",
        Email: "",
        Address: "",
        FullName: "",
        showAgainPass: false,
        showPass: false,
    };

    $scope.submit = function () {
        if (!validate()) {
            $scope.isLoading = true;
            dataservice.register($scope.model)
                .then(function (response) {
                    if (!response.data.hasError) {
                        window.location.href = "/Login/Index";
                        alert(response.data.title);
                    } else {
                        alert(response.data.title + "đã tồn  tại!");
                    }
                    $scope.isLoading = false;
                })
                .catch(function (error) {
                    $scope.isLoading = false;
                    console.log('Error when LOGIN');
                });
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
        if (type == "againpassword" && $scope.model.AgainPassWord != "" && $scope.model.AgainPassWord === $scope.model.PassWord) {
            $scope.Error.AgainPassWord = false;
        }
        if (type == "phone" && $scope.model.Phone != "") {
            if (!/^\d+$/.test($scope.model.Phone)) {
                // Nếu không, xóa kí tự cuối cùng
                $scope.model.Phone = $scope.model.Phone.slice(0, -1);
            }
            $scope.Error.Phone = false;
        }
        if (type == "email" && $scope.model.Email != "") {
            $scope.Error.Email = false;
        }
        if (type == "fullname" && $scope.model.FullName != "") {
            $scope.Error.FullName = false;
        }

        if ($scope.model.UserName != "" && $scope.model.PassWord != "" && $scope.model.AgainPassWord != "" && $scope.model.Phone != "" && $scope.model.Email != "" && $scope.model.FullName != "") {
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
        if ($scope.model.FullName == "" || $scope.model.FullName == undefined) {
            hasError = true;
            $scope.Error.FullName = true;
        }
        // Kiểm tra lại mật khẩu
        if (!$scope.model.AgainPassWord || $scope.model.AgainPassWord == undefined) {
            hasError = true;
            $scope.Error.AgainPassWord = true;
        }
        // Kiểm tra số điện thoại
        if (!$scope.model.Phone || $scope.model.Phone == undefined) {
            hasError = true;
            $scope.Error.Phone = true;
        }
        // Kiểm tra email
        if (!$scope.model.Email || $scope.model.Email == undefined) {
            hasError = true;
            $scope.Error.Email = true;
        }
        $scope.message = "Nhập đầy đủ thông tin để đăng nhập!";
        if (hasError) {
            return hasError;
        } else {
            $scope.message = "";
        }
        // Kiểm tra lại mật khẩu
        if ($scope.model.PassWord.length < 6) {
            hasError = true;
            $scope.Error.PassWord = true;
            $scope.message = "Mật khẩu không được ít hơn 6 ký tự!";
            return hasError;
        }
        if (!$scope.model.AgainPassWord || $scope.model.AgainPassWord !== $scope.model.PassWord) {
            hasError = true;
            $scope.Error.AgainPassWord = true;
            $scope.message = "Mật khẩu không trùng khớp!";
            return hasError;
        }
        if (/[\W_]/.test($scope.model.AgainPassWord)) {
            hasError = true;
            $scope.Error.AgainPassWord = true;
            $scope.message = "Mật khẩu không được để các ký tự đặc biệt!";
            return hasError;
        }
        // Kiểm tra số điện thoại
        if (!$scope.model.Phone || !/^(?!0)\d{10}$/.test($scope.model.Phone)) {
            hasError = true;
            $scope.Error.Phone = true;
            $scope.message = "Số điện thoại không hợp lệ!";
            return hasError;
        }
        // Kiểm tra email
        if (!$scope.model.Email || !/^\S+@\S+\.\S+$/.test($scope.model.Email)) {
            hasError = true;
            $scope.Error.Email = true;
            $scope.message = "Email không hợp lệ!";
            return hasError;
        }
    };
    $scope.login = function () {
        window.location.href = "/Login/Index";
    };
});
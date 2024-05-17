var ctxfolder = "/views/myWeb/user";

var app = angular.module("App_ESEIM", ["ngRoute"]);

app.factory('dataservice', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose"
    };

    return {
        getProfile: function (data) {
            return $http.post('/User/GetProfile/', data, { headers: headers });
        },
        editUser: function (data) {
            return $http.post('/User/EditUser/', data, { headers: headers });
        },
        getTransactionOfU: function (data) {
            return $http.post('/User/GetTransactionOfU/', data, { headers: headers });
        },
        changePass: function (data) {
            return $http.post('/User/ChangePass/', data, { headers: headers });
        },
    };
});

app.controller("Ctrl_ESEIM", function ($scope, $rootScope) {

    var checkLogin = document.getElementById('userName');
    $rootScope.username = checkLogin.value;
});

app.config(function ($routeProvider, $httpProvider, $locationProvider) {

    $routeProvider
        .when("/", {
            templateUrl: ctxfolder + '/profile.html',
            controller: "profile"
        })
        .when("/yourOrders", {
            templateUrl: ctxfolder + '/yourOrders.html',
            controller: "yourOrders"
        })
        .otherwise({
            redirectTo: "/"
        });
});

app.controller("profile", function ($scope, $rootScope, dataservice, $http, $location) {
    $scope.modelSetup = {
        editPersonal: false,
        editEmail: false,
        formChangePass: false,
    };
    $scope.modelChangePass = {

    };
    $scope.init = function () {
        var checkLogin = document.getElementById('userName');
        var data = {
            UserName: checkLogin.value
        };
        $scope.isLoading = true;
        dataservice.getProfile(data)
            .then(function (response) {
                if (!response.data.hasError) {
                    $scope.model = response.data[0];
                    $scope.isLoading = false;
                } else {
                    alert('Error when getprofile!')
                }
            })
            .catch(function (error) {
                console.log('')
                console.log("An error occurred:", error);
            });
    };

    $scope.init();
    $scope.yourOrders = function () {
        $location.path("/yourOrders");
    };
    $scope.submit = function () {
        if (!validate()) {
            $scope.isLoading = true;
            dataservice.editUser($scope.model)
                .then(function (rs) {
                    if (!rs.data.hasError) {
                        //$scope.init();
                        $scope.isLoading = false;
                        $scope.modelSetup.editEmail = false;
                        $scope.modelSetup.editPersonal = false;
                        $scope.message = "";
                    }
                    alert(rs.data.title);
                })
                .catch(function (er) {
                    console.log('Hass error when wubmit to edit user!');
                });
        };
    };
    $scope.changePass = function () {
        if (!validataPass()) {
            $scope.isLoading = true;
            var data = {
                UserName: $rootScope.username,
                Password: $scope.modelChangePass.oldpass,
                NewPassword: $scope.modelChangePass.newpass
            };
            dataservice.changePass(data)
                .then(function (rs) {
                    if (!rs.data.hasError) {
                        $scope.modelSetup.formChangePass = false;
                        $scope.isLoading = false;
                    }
                    alert(rs.data.title);
                })
                .catch(function (er) {
                    console.log('Hass error when wubmit to edit user!');
                });
        }
    };
    $scope.changeModel = function (type) {
        if (type == "oldpass" && $scope.modelChangePass.oldpass != "") {
            $scope.Error.oldpass = false;
        }
        if (type == "newpass" && $scope.modelChangePass.newpass != "") {
            $scope.Error.newpass = false;
        }
        if (type == "againpass" && $scope.modelChangePass.againpass != "" && $scope.modelChangePass.newpass === $scope.modelChangePass.againpass) {
            $scope.Error.againpass = false;
        }
        
        if ($scope.modelChangePass.oldpass != "" && $scope.modelChangePass.newpass != "" && $scope.modelChangePass.againpass != "") {
            $scope.message = "";
        }

    };
    $scope.Error = {
        oldpass: false,
        newpass: false,
        againpass: false,
    };
    function validate() {
        var hasError = false;
        if ($scope.modelSetup.editEmail) {
            // Kiểm tra email
            if (!$scope.model.email || $scope.model.email == undefined) {
                hasError = true;
                $scope.Erroremail = true;
                $scope.message = "Enter your Email!";
                return hasError;
            }
            // Kiểm tra email
            if (!$scope.model.email || !/^\S+@\S+\.\S+$/.test($scope.model.email)) {
                hasError = true;
                $scope.Erroremail = true;
                $scope.message = "Email unsuccess!";
                return hasError;
            }
        };
        if ($scope.modelSetup.editPersonal) {
            // Kiểm tra email
            if (!$scope.model.fullname || $scope.model.fullname == undefined) {
                hasError = true;
                $scope.Errorfullname = true;
                $scope.message = "Enter your Infomation!";
            }
            // Kiểm tra email
            if (!$scope.model.address || $scope.model.address == undefined) {
                hasError = true;
                $scope.Erroraddress = true;
                $scope.message = "Enter your Infomation!";
            }
            return hasError;
        }
    };
    function validataPass() {
        var hasError = false;

        if ($scope.modelChangePass.oldpass == "" || $scope.modelChangePass.oldpass == undefined) {
            hasError = true;
            $scope.Error.oldpass = true;
        }
        if ($scope.modelChangePass.newpass == "" || $scope.modelChangePass.newpass == undefined) {
            hasError = true;
            $scope.Error.newpass = true;
        }
        if ($scope.modelChangePass.againpass == "" || $scope.modelChangePass.againpass == undefined) {
            hasError = true;
            $scope.Error.againpass = true;
        }
        $scope.message = "Let enter all information, please!";
        if (hasError) {
            return hasError;
        } else {
            $scope.message = "";
        }
        if ($scope.modelChangePass.oldpass.length < 6 || $scope.modelChangePass.newpass.length < 6 || $scope.modelChangePass.againpass.length < 6) {
            hasError = true;
            $scope.Error.oldpass = true;
            $scope.Error.newpass = true;
            $scope.Error.againpass = true;
            $scope.message = "Password must not be less than 6 characters!";
            return hasError;
        }
        if ($scope.modelChangePass.newpass !== $scope.modelChangePass.againpass) {
            hasError = true;
            $scope.Error.againpass = true;
            $scope.message = "Passwords do not match!";
            return hasError;
        }
        if (/[\W_]/.test($scope.modelChangePass.oldpass) || /[\W_]/.test($scope.modelChangePass.newpass) || /[\W_]/.test($scope.modelChangePass.againpass)) {
            hasError = true;
            $scope.Error.oldpass = true;
            $scope.Error.newpass = true;
            $scope.Error.againpass = true;
            $scope.message = "Password must not contain special characters!";
            return hasError;
        }

        return hasError;
    };
});

app.controller("yourOrders", function ($scope, $rootScope, dataservice, $http, $location) {
    $scope.model = {
        Phone: "",
    };
    $scope.init = function () {
        $scope.isLoading = true;
        var data = {
            UserName: $rootScope.username,
            Phone: $scope.model.Phone
        };
        dataservice.getTransactionOfU(data)
            .then(function (response) {
                if (!response.data.hasError) {
                    $scope.listTransaction = response.data.object;
                    $scope.isLoading = false;
                } else {
                    alert('Error when getprofile!')
                }
            })
            .catch(function (error) {
                console.log('')
                console.log("An error occurred:", error);
            });
    };
    $scope.init();
    $scope.modelIsPhone = function () {
        if (!/^[1-9]+$/.test($scope.model.Phone)) {
            // Nếu không, xóa kí tự cuối cùng
            $scope.model.Phone = $scope.model.Phone.slice(0, -1);
        }
        if ($scope.model.Phone.length > 9) {
            // Nếu không, xóa kí tự cuối cùng
            $scope.model.Phone = $scope.model.Phone.slice(0, -1);
        }
        $scope.Error.Phone = false;
    };
    $scope.profile = function () {
        $location.path("/");
    };
});
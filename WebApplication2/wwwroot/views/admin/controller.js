var ctxfolder = "/views/admin";

var app = angular.module("App_ESEIM", ["ngRoute"]);

app.factory('dataservice', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose"
    };

    return {
        //USER
        insertUser: function (data) {
            return $http.post('/Register/register/', data, { headers: headers });
        },
        editUser: function (data) {
            return $http.post('/Admin/EditUser/', data, { headers: headers });
        },
        removeUser: function (id) {
            return $http.post('/Admin/RemoveUser/' + id, { headers: headers });
        },
        detailUser: function (id) {
            return $http.get('/Admin/DetailUser/' + id, { headers: headers });
        },
        getListUser: function () {
            return $http.get('/Admin/GetListUser/', { headers: headers });
        },
        //ServiceCard
        insertServiceCard: function (data) {
            return $http.post('/Admin/InsertServiceCard/', data, { headers: headers });
        },
        editServiceCard: function (data) {
            return $http.post('/Admin/EditServiceCard/', data, { headers: headers });
        },
        removeServiceCard: function (id) {
            return $http.post('/Admin/RemoveServiceCard/' + id, { headers: headers });
        },
        detailServiceCard: function (id) {
            return $http.get('/Admin/DetailServiceCard/' + id, { headers: headers });
        },
        getListServiceCard: function () {
            return $http.get('/Admin/GetListServiceCard/', { headers: headers });
        },
        //Feedback
        insertFeedback: function (data) {
            return $http.post('/Admin/InsertFeedback/', data, { headers: headers });
        },
        editFeedback: function (data) {
            return $http.post('/Admin/EditFeedback/', data, { headers: headers });
        },
        removeFeedback: function (id) {
            return $http.post('/Admin/RemoveFeedback/' + id, { headers: headers });
        },
        detailFeedback: function (id) {
            return $http.get('/Admin/DetailFeedback/' + id, { headers: headers });
        },
        getListFeedback: function () {
            return $http.get('/Admin/GetListFeedback/', { headers: headers });
        },
        //Transaction
        insertTransaction: function (data) {
            return $http.post('/Admin/InsertTransaction/', data, { headers: headers });
        },
        editTransaction: function (data) {
            return $http.post('/Admin/EditTransaction/', data, { headers: headers });
        },
        removeTransaction: function (id) {
            return $http.post('/Admin/RemoveTransaction/' + id, { headers: headers });
        },
        detailTransaction: function (id) {
            return $http.get('/Admin/DetailTransaction/' + id, { headers: headers });
        },
        getListTransaction: function () {
            return $http.get('/Admin/GetListTransaction/', { headers: headers });
        },
        //Subcription
        insertSubcription: function (data) {
            return $http.post('/Admin/InsertSubcription/', data, { headers: headers });
        },
        editSubcription: function (data) {
            return $http.post('/Admin/EditSubcription/', data, { headers: headers });
        },
        removeSubcription: function (id) {
            return $http.post('/Admin/RemoveSubcription/' + id, { headers: headers });
        },
        detailSubcription: function (id) {
            return $http.get('/Admin/DetailSubcription/' + id, { headers: headers });
        },
        getListSubcription: function () {
            return $http.get('/Admin/GetListSubcription/', { headers: headers });
        },
    };
});

app.controller("Ctrl_ESEIM", function ($scope, $rootScope, $location) {
    $scope.active_navbar = 1;
    $rootScope.locate = "Manage > User";
    $scope.userPage = function () {
        $rootScope.locate = "Manage > User";
        $location.path("/");
    };
    $scope.transactionPage = function () {
        $rootScope.locate = "Manage > Transaction";
        $scope.active_navbar = 2;
        $location.path("/transaction");
    };
    $scope.subcriptionPage = function () {
        $rootScope.locate = "Manage > Subcription";
        $scope.active_navbar = 3;
        $location.path("/subcription");
    };
    $scope.serviceCardPage = function () {
        $rootScope.locate = "Manage > ServiceCard";
        $scope.active_navbar = 4;
        $location.path("/serviceCard");
    };
    $scope.feedbackPage = function () {
        $rootScope.locate = "Manage > Feedback";
        $scope.active_navbar = 5;
        $location.path("/feedback");
    };
});

app.config(function ($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: ctxfolder + '/user.html',
            controller: "user"
        })
        .when("/transaction", {
            templateUrl: ctxfolder + '/transaction.html',
            controller: "transaction"
        })
        .when("/feedback", {
            templateUrl: ctxfolder + '/feedback.html',
            controller: "feedback"
        })
        .when("/serviceCard", {
            templateUrl: ctxfolder + '/serviceCard.html',
            controller: "serviceCard"
        })
        .when("/subcription", {
            templateUrl: ctxfolder + '/subcription.html',
            controller: "subcription"
        })
        .otherwise({
            redirectTo: "/"
        })
        ;
});

app.controller("user", function ($scope, $rootScope, dataservice, $location) {
    $scope.modelSetup = {
        titleTable: "User's records",
        titleButton: "Add",
        titleForm: "User's form",
        insert: false
    };
    $scope.model = {
        UserName: "",
        PassWord: "",
        Phone: "",
        Email: "",
        FullName: "",
        Address: "",
        Role: 1,
        Id: 0,
    };
    $scope.init = function () {
        $scope.isLoading = true;
        dataservice.getListUser()
            .then(function (rs) {
                if (!rs.data.hasError) {
                    $scope.listTitle = rs.data.object.titles;
                    $scope.listData = rs.data.object.datas;
                } else {
                    alert(rs.title);
                }
                $scope.isLoading = false;
            })
            .catch(function (er) {
                console.log("Has error when getList!")
                console.log(er);
            });
    };

    $scope.init();
    $scope.submit = function () {
        $scope.isLoading = true;
        if (!validate()) {
            if ($scope.modelSetup.titleButton == "Add") {
                dataservice.insertUser($scope.model)
                    .then(function (response) {
                        if (!response.data.hasError) {
                            alert(response.data.title);
                            $scope.reload();
                        } else {
                            alert(response.data.title + "đã tồn  tại!");
                        }
                        $scope.isLoading = false;
                    })
                    .catch(function (rs) {
                        console.log("Has error when insertUser!")
                        console.log(er);
                    });
            } else {
                dataservice.editUser($scope.model)
                    .then(function (response) {
                        if (!response.data.hasError) {
                            alert(response.data.title);
                            $scope.reload();
                        } else {
                            alert(response.data.title + "đã tồn  tại!");
                        }
                        $scope.isLoading = false;
                    })
                    .catch(function (rs) {
                        console.log("Has error when insertUser!")
                        console.log(er);
                    });
            };
        }
    };
    $scope.edit = function (id) {
        $scope.insert();
        $scope.modelSetup.titleButton = "Edit";
        $scope.isLoading = true;
        dataservice.detailUser(id)
            .then(function (response) {
                if (!response.data.hasError) {

                    $scope.model.Id = response.data.object.id;
                    $scope.model.UserName = response.data.object.userName;
                    $scope.model.PassWord = response.data.object.passWord;
                    $scope.model.Phone = response.data.object.phone;
                    $scope.model.Email = response.data.object.email;
                    $scope.model.FullName = response.data.object.fullname;
                    $scope.model.Address = response.data.object.address;
                    $scope.model.Role = response.data.object.role;
                } else {
                    alert(response.data.title);
                }
                $scope.isLoading = false;
            })
            .catch(function (rs) {
                console.log("Has error when detailUser!")
                console.log(er);
            });
    };
    $scope.delete = function () {

    };
    $scope.reload = function () {
        $scope.cancle();
        $scope.init();
    };
    $scope.insert = function () {
        $scope.modelSetup.titleButton = "Add";
        $scope.modelSetup.insert = true;
        $scope.layoutPopup = true;
    };
    $scope.cancle = function () {
        $scope.modelSetup.insert = false;
        $scope.layoutPopup = false;
    };
    $scope.changeModel = function (type) {
        if (type == "username" && $scope.model.UserName != "") {
            $scope.ErrorUserName = false;
        }
        if (type == "password" && $scope.model.PassWord != "") {
            $scope.ErrorPassWord = false;
        }
        if (type == "againpassword" && $scope.model.AgainPassWord != "" && $scope.model.AgainPassWord === $scope.model.PassWord) {
            $scope.ErrorAgainPassWord = false;
        }
        if (type == "phone" && $scope.model.Phone != "") {
            if (!/^\d+$/.test($scope.model.Phone)) {
                // Nếu không, xóa kí tự cuối cùng
                $scope.model.Phone = $scope.model.Phone.slice(0, -1);
            }
            $scope.ErrorPhone = false;
        }
        if (type == "email" && $scope.model.Email != "") {
            $scope.ErrorEmail = false;
        }
        if (type == "fullname" && $scope.model.FullName != "") {
            $scope.ErrorFullName = false;
        }

        if ($scope.model.UserName != "" && $scope.model.PassWord != "" && $scope.model.AgainPassWord != "" && $scope.model.Phone != "" && $scope.model.Email != "" && $scope.model.FullName != "") {
            $scope.message = "";
        }

    };
    function validate() {
        var hasError = false;
        if ($scope.model.UserName == "" || $scope.model.UserName == undefined) {
            hasError = true;
            $scope.ErrorUserName = true;
        }
        if ($scope.model.PassWord == "" || $scope.model.PassWord == undefined) {
            hasError = true;
            $scope.ErrorPassWord = true;
        }
        if ($scope.model.FullName == "" || $scope.model.FullName == undefined) {
            hasError = true;
            $scope.ErrorFullName = true;
        }
        // Kiểm tra lại mật khẩu
        if (!$scope.model.AgainPassWord || $scope.model.AgainPassWord == undefined) {
            hasError = true;
            $scope.ErrorAgainPassWord = true;
        }
        // Kiểm tra số điện thoại
        if (!$scope.model.Phone || $scope.model.Phone == undefined) {
            hasError = true;
            $scope.ErrorPhone = true;
        }
        // Kiểm tra email
        if (!$scope.model.Email || $scope.model.Email == undefined) {
            hasError = true;
            $scope.ErrorEmail = true;
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
            $scope.ErrorPassWord = true;
            $scope.message = "Mật khẩu không được ít hơn 6 ký tự!";
            return hasError;
        }
        if (!$scope.model.AgainPassWord || $scope.model.AgainPassWord !== $scope.model.PassWord) {
            hasError = true;
            $scope.ErrorAgainPassWord = true;
            $scope.message = "Mật khẩu không trùng khớp!";
            return hasError;
        }
        if (/[\W_]/.test($scope.model.AgainPassWord)) {
            hasError = true;
            $scope.ErrorAgainPassWord = true;
            $scope.message = "Mật khẩu không được để các ký tự đặc biệt!";
            return hasError;
        }
        // Kiểm tra số điện thoại
        if (!$scope.model.Phone || !/^0\d{9}$/.test($scope.model.Phone)) {
            hasError = true;
            $scope.ErrorPhone = true;
            $scope.message = "Số điện thoại không hợp lệ!";
            return hasError;
        }
        // Kiểm tra email
        if (!$scope.model.Email || !/^\S+@\S+\.\S+$/.test($scope.model.Email)) {
            hasError = true;
            $scope.ErrorEmail = true;
            $scope.message = "Email không hợp lệ!";
            return hasError;
        }
    };
});
app.controller("transaction", function ($scope, $rootScope, dataservice, $location) {
    $scope.modelSetup = {
        titleTable: "Transaction's records",
        titleForm: "Transaction's form",
    }
    $scope.init = function () {
        $scope.isLoading = true;
        dataservice.getListTransaction()
            .then(function (rs) {
                if (!rs.data.hasError) {
                    $scope.listTitle = rs.data.object.titles;
                    $scope.listData = rs.data.object.datas;
                } else {
                    alert(rs.title);
                }
                $scope.isLoading = false;
            })
            .catch(function (er) {
                console.log("Has error when getList!")
                console.log(er);
            });
    };

    $scope.init();
});
app.controller("subcription", function ($scope, $rootScope, dataservice, $location) {
    $scope.modelSetup = {
        titleTable: "Subcription's records",
        titleForm: "Subcription's form",
    }
    $scope.init = function () {
        $scope.isLoading = true;
        dataservice.getListSubcription()
            .then(function (rs) {
                if (!rs.data.hasError) {
                    $scope.listTitle = rs.data.object.titles;
                    $scope.listData = rs.data.object.datas;
                } else {
                    alert(rs.title);
                }
                $scope.isLoading = false;
            })
            .catch(function (er) {
                console.log("Has error when getList!")
                console.log(er);
            });
    };

    $scope.init();
});
app.controller("serviceCard", function ($scope, $rootScope, dataservice, $location) {
    $scope.modelSetup = {
        titleTable: "ServiceCard's records",
        titleForm: "ServiceCard's form",
    }
    $scope.init = function () {
        $scope.isLoading = true;
        dataservice.getListServiceCard()
            .then(function (rs) {
                if (!rs.data.hasError) {
                    $scope.listTitle = rs.data.object.titles;
                    $scope.listData = rs.data.object.datas;
                } else {
                    alert(rs.title);
                }
                $scope.isLoading = false;
            })
            .catch(function (er) {
                console.log("Has error when getList!")
                console.log(er);
            });
    };

    $scope.init();
});
app.controller("feedback", function ($scope, $rootScope, dataservice, $location) {
    $scope.modelSetup = {
        titleTable: "Feedback's records",
        titleForm: "Feedback's form",
    }
    $scope.init = function () {
        $scope.isLoading = true;
        dataservice.getListFeedback()
            .then(function (rs) {
                if (!rs.data.hasError) {
                    $scope.listTitle = rs.data.object.titles;
                    $scope.listData = rs.data.object.datas;
                } else {
                    alert(rs.title);
                }
                $scope.isLoading = false;
            })
            .catch(function (er) {
                console.log("Has error when getList!")
                console.log(er);
            });
    };

    //$scope.init();
});
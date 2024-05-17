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
            return $http.get('/Admin/RemoveUser/' + id, { headers: headers });
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
            return $http.get('/Admin/RemoveServiceCard/' + id, { headers: headers });
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
            return $http.get('/Admin/RemoveTransaction/' + id, { headers: headers });
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
        $scope.active_navbar = 1;
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
        titleForm: "User's form",
        titleButton: "Add",
        insert: false,
        delete: false,
    };
    $scope.model = {
        UserName: "",
        PassWord: "",
        Phone: "",
        Email: "",
        FullName: "",
        Address: "",
        Role: "",
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
            .catch(function (rs) {
                console.log("Has error when getList!")
                console.log(rs);
            });
    };

    $scope.init();
    $scope.submit = function () {
        if (!validate()) {
            $scope.isLoading = true;
            if ($scope.modelSetup.titleButton == "Add") {
                $scope.model.Phone = $scope.model.Phone.substring(1);
                dataservice.insertUser($scope.model)
                    .then(function (response) {
                        if (!response.data.hasError) {
                            //alert(response.data.title);
                            $scope.reload();
                        } else {
                            alert(response.data.title + "đã tồn  tại!");
                        }
                        $scope.isLoading = false;
                    })
                    .catch(function (rs) {
                        console.log("Has error when insertUser!")
                        console.log(rs);
                    });
            } else {
                $scope.model.Phone = $scope.model.Phone.substring(1);
                dataservice.editUser($scope.model)
                    .then(function (response) {
                        if (!response.data.hasError) {
                            //alert(response.data.title);
                            $scope.reload();
                        } else {
                            alert(response.data.title + "đã tồn  tại!");
                        }
                        $scope.isLoading = false;
                    })
                    .catch(function (rs) {
                        console.log("Has error when insertUser!")
                        console.log(rs);
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
                    $scope.model.PassWord = "";
                    $scope.model.Phone = "0" + response.data.object.phone;
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
                console.log(rs);
            });
    };
    $scope.delete = function (id) {
        $scope.modelSetup.delete = true;
        $scope.layoutPopup = true;
        $scope.model.Id = id;
    };
    $scope.submitDelete = function () {
        $scope.isLoading = true;
        dataservice.removeUser($scope.model.Id)
            .then(function (response) {
                if (!response.data.hasError) {
                    $scope.reload();
                }
                $scope.isLoading = false;
            })
            .catch(function (rs) {
                console.log("Has error when detailUser!");
                console.log(rs);
            });
    };
    $scope.reload = function () {
        $scope.model = {
            UserName: "",
            PassWord: "",
            Phone: "",
            Email: "",
            FullName: "",
            Address: "",
            Role: "",
            Id: 0,
        };
        $scope.cancle();
        $scope.init();
    };
    $scope.insert = function () {
        $scope.model = {
            UserName: "",
            PassWord: "",
            Phone: "",
            Email: "",
            FullName: "",
            Address: "",
            Role: "",
            Id: 0,
        };
        $scope.modelSetup.titleButton = "Add";
        $scope.modelSetup.insert = true;
        $scope.layoutPopup = true;
    };
    $scope.cancle = function () {
        $scope.modelSetup.delete = false;
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
        if (type == "againpassword" && $scope.model.AgainPassWord != "") {
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
        if (type == "role" && $scope.model.Role != "" && $scope.model.Role != undefined) {
            if ($scope.model.Role.length > 1 || $scope.model.Role > 1) {
                $scope.model.Role = $scope.model.Role.slice(0, -1);
            }
            if (!/^\d+$/.test($scope.model.Role)) {
                $scope.model.Role = $scope.model.Role.slice(0, -1);
            }
            $scope.ErrorRole = false;
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
        if ($scope.model.FullName == "" || $scope.model.FullName == undefined) {
            hasError = true;
            $scope.ErrorFullName = true;
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
        $scope.message = "Please enter complete information!";
        if (hasError) {
            return hasError;
        } else {
            $scope.message = "";
        }
        // Kiểm tra lại mật khẩu
        if ($scope.model.PassWord != "" && $scope.model.PassWord.length < 6) {
            hasError = true;
            $scope.ErrorPassWord = true;
            $scope.message = "Mật khẩu không được ít hơn 6 ký tự!";
            return hasError;
        }
        if ($scope.model.PassWord != "" && (/[\W_]/.test($scope.model.PassWord))) {
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
        titleButton: "Add",
        insert: false,
        delete: false,
    }
    $scope.model = {
        Id: 0,
        IdService: "",
        IdUser: "",
        Phone: "",
        Value: "",
        ServicePicture: "",
        ServiceTitle: "",
        UserName: "",
    };
    $scope.listService = [];
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
            .catch(function (rs) {
                console.log("Has error when getList!")
                console.log(rs);
            });
        dataservice.getListServiceCard()
            .then(function (rs) {
                if (!rs.data.hasError) {
                    $scope.listService = rs.data.object.datas;
                    if ($scope.listService.length > 1) {
                        $scope.model.IdService = $scope.listService[0].id;
                        $scope.model.ServicePicture = $scope.listService[0].picture;
                        $scope.model.ServiceTitle = $scope.listService[0].name;
                    };
                } else {
                    alert(rs.title);
                }
            })
            .catch(function (rs) {
                console.log("Has error when getList!")
                console.log(rs);
            });
        dataservice.getListUser()
            .then(function (rs) {
                if (!rs.data.hasError) {
                    $scope.listUser = rs.data.object.datas;
                    if ($scope.listUser.length > 1) {
                        $scope.model.IdUser = $scope.listUser[0].id;
                        $scope.model.UserName = $scope.listUser[0].fullname;
                    };
                } else {
                    alert(rs.title);
                }
                $scope.isLoading = false;
            })
            .catch(function (rs) {
                console.log("Has error when getList!")
                console.log(rs);
            });
    };
    $scope.init();
    $scope.chooseService = function (id) {
        $scope.model.IdService = id;
        var check = $scope.listService.find(function (value) {
            return value.id == id;
        });
        $scope.model.ServicePicture = check.picture;
        $scope.model.ServiceTitle = check.name;
    };
    $scope.chooseUser = function (id) {
        $scope.model.IdUser = id;
        var check = $scope.listUser.find(function (value) {
            return value.id == id;
        });
        $scope.model.UserName = check.fullname;
    };
    $scope.submit = function () {
        if (!validate()) {
            $scope.isLoading = true;
            if ($scope.modelSetup.titleButton == "Add") {
                $scope.model.Phone = $scope.model.Phone.substring(1);
                dataservice.insertTransaction($scope.model)
                    .then(function (response) {
                        if (!response.data.hasError) {
                            $scope.reload();
                        } else {
                            alert(response.data.title);
                        }
                        $scope.isLoading = false;
                    })
                    .catch(function (rs) {
                        console.log("Has error when insertUser!")
                        console.log(rs);
                    });
            } else {
                $scope.model.Phone = $scope.model.Phone.substring(1);
                dataservice.editTransaction($scope.model)
                    .then(function (response) {
                        if (!response.data.hasError) {
                            $scope.reload();
                        } else {
                            alert(response.data.title);
                        }
                        $scope.isLoading = false;
                    })
                    .catch(function (rs) {
                        console.log("Has error when insertUser!");
                        console.log(rs);
                    });
            };
        }
    };
    $scope.edit = function (id) {
        $scope.insert();
        $scope.modelSetup.titleButton = "Edit";
        $scope.isLoading = true;
        $scope.model.ServicePicture = "";
        $scope.model.ServiceTitle = "";
        $scope.model.Id = id;
        dataservice.detailTransaction(id)
            .then(function (response) {
                if (!response.data.hasError) {
                    $scope.model.IdService = response.data.object.service_id;
                    $scope.model.ServicePicture = response.data.object.picture;
                    $scope.model.ServiceTitle = response.data.object.name;
                    $scope.model.IdUser = response.data.object.user_id;
                    $scope.model.UserName = response.data.object.fullname;
                    $scope.model.Phone = "0" + response.data.object.phone;
                    $scope.model.Value = response.data.object.value;
                } else {
                    alert(response.data.title);
                }
                $scope.isLoading = false;
            })
            .catch(function (rs) {
                console.log("Has error when detailUser!");
                console.log(rs);
            });
    };
    $scope.delete = function (id) {
        $scope.modelSetup.delete = true;
        $scope.layoutPopup = true;
        $scope.model.Id = id;
    };
    $scope.submitDelete = function () {
        $scope.isLoading = true;
        dataservice.removeTransaction($scope.model.Id)
            .then(function (response) {
                if (!response.data.hasError) {
                    $scope.reload();
                }
                $scope.isLoading = false;
            })
            .catch(function (rs) {
                console.log("Has error when detailUser!");
                console.log(rs);
            });
    };
    $scope.reload = function () {
        $scope.model.Phone = "";
        $scope.model.Value = "";
        if ($scope.listService.length > 1) {
            $scope.model.IdService = $scope.listService[0].id;
            $scope.model.ServicePicture = $scope.listService[0].picture;
            $scope.model.ServiceTitle = $scope.listService[0].name;
        };
        $scope.cancle();
        $scope.init();
    };
    $scope.insert = function () {
        $scope.modelSetup.titleButton = "Add";
        $scope.model.Phone = "";
        $scope.model.Value = "";
        if ($scope.listService.length > 1) {
            $scope.model.IdService = $scope.listService[0].id;
            $scope.model.ServicePicture = $scope.listService[0].picture;
            $scope.model.ServiceTitle = $scope.listService[0].name;
        };
        $scope.modelSetup.insert = true;
        $scope.layoutPopup = true;
    };
    $scope.cancle = function () {
        $scope.modelSetup.delete = false;
        $scope.modelSetup.insert = false;
        $scope.layoutPopup = false;
    };
    $scope.changeModel = function (type) {
        if (type == "Value" && $scope.model.Value != "") {
            if (!/^\d+$/.test($scope.model.Value)) {
                $scope.model.Value = $scope.model.Value.slice(0, -1);
            }
            $scope.ErrorAgainPassWord = false;
        }
        if (type == "Phone" && $scope.model.Phone != "") {
            if (!/^\d+$/.test($scope.model.Phone)) {
                $scope.model.Phone = $scope.model.Phone.slice(0, -1);
            }
            $scope.ErrorPhone = false;
        }

        if ($scope.model.Value != "" && $scope.model.Phone != "") {
            $scope.message = "";
        }

    };
    function validate() {
        var hasError = false;
        // Kiểm tra số điện thoại
        if (!$scope.model.Phone || $scope.model.Phone == undefined) {
            hasError = true;
            $scope.ErrorPhone = true;
        }
        // Kiểm tra email
        if (!$scope.model.Value || $scope.model.Value == undefined) {
            hasError = true;
            $scope.ErrorValue = true;
        }
        // Kiểm tra email
        if (!$scope.model.IdService || $scope.model.IdService == undefined) {
            hasError = true;
        }
        // Kiểm tra email
        if (!$scope.model.IdUser || $scope.model.IdUser == undefined) {
            hasError = true;
            $scope.ErrorValue = true;
        }
        $scope.message = "Please enter complete information!";
        if (hasError) {
            return hasError;
        } else {
            $scope.message = "";
        }
        // Kiểm tra số điện thoại
        if (!$scope.model.Phone || !/^0\d{9}$/.test($scope.model.Phone)) {
            hasError = true;
            $scope.ErrorPhone = true;
            $scope.message = "Số điện thoại không hợp lệ!";
            return hasError;
        }
    };
});
app.controller("subcription", function ($scope, $rootScope, dataservice, $location) {
    $scope.modelSetup = {
        titleTable: "Subcription's records",
        titleForm: "Subcription's form",
        titleButton: "Add",
        insert: false,
        delete: false,
    }
    $scope.model = {
        Id: 0,
        IdService: "",
        ServicePicture: "",
        ServiceTitle: "",
        Value: "",
    };
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
            .catch(function (rs) {
                console.log("Has error when getList!")
                console.log(rs);
            });
        dataservice.getListServiceCard()
            .then(function (rs) {
                if (!rs.data.hasError) {
                    $scope.listService = rs.data.object.datas;
                    if ($scope.listService.length > 1) {
                        $scope.model.IdService = $scope.listService[0].id;
                        $scope.model.ServicePicture = $scope.listService[0].picture;
                        $scope.model.ServiceTitle = $scope.listService[0].name;
                    };
                } else {
                    alert(rs.title);
                }
            })
            .catch(function (rs) {
                console.log("Has error when getList!")
                console.log(rs);
            });
    };

    $scope.init();

    $scope.chooseService = function (id) {
        $scope.model.IdService = id;
        var check = $scope.listService.find(function (value) {
            return value.id == id;
        });
        $scope.model.ServicePicture = check.picture;
        $scope.model.ServiceTitle = check.name;
    };
    $scope.submit = function () {
        if (!validate()) {
            $scope.isLoading = true;
            if ($scope.modelSetup.titleButton == "Add") {
                dataservice.insertSubcription($scope.model)
                    .then(function (response) {
                        if (!response.data.hasError) {
                            $scope.reload();
                        } else {
                            alert(response.data.title);
                        }
                        $scope.isLoading = false;
                    })
                    .catch(function (rs) {
                        console.log("Has error when insertUser!")
                        console.log(rs);
                    });
            } else {
                dataservice.editSubcription($scope.model)
                    .then(function (response) {
                        if (!response.data.hasError) {
                            $scope.reload();
                        } else {
                            alert(response.data.title);
                        }
                        $scope.isLoading = false;
                    })
                    .catch(function (rs) {
                        console.log("Has error when insertUser!");
                        console.log(rs);
                    });
            };
        }
    };
    $scope.edit = function (id) {
        $scope.insert();
        $scope.modelSetup.titleButton = "Edit";
        $scope.isLoading = true;
        $scope.model.ServicePicture = "";
        $scope.model.ServiceTitle = "";
        dataservice.detailSubcription(id)
            .then(function (response) {
                if (!response.data.hasError) {
                    $scope.model.IdService = response.data.object.service_id;
                    $scope.model.Value = response.data.object.value;
                    $scope.model.ServicePicture = response.data.object.picture;
                    $scope.model.ServiceTitle = response.data.object.name;
                } else {
                    alert(response.data.title);
                }
                $scope.isLoading = false;
            })
            .catch(function (rs) {
                console.log("Has error when detailUser!");
                console.log(rs);
            });
    };
    $scope.delete = function (id) {
        $scope.modelSetup.delete = true;
        $scope.layoutPopup = true;
        $scope.model.Id = id;
    };
    $scope.submitDelete = function () {
        $scope.isLoading = true;
        dataservice.removeSubcription($scope.model.Id)
            .then(function (response) {
                if (!response.data.hasError) {
                    $scope.reload();
                }
                $scope.isLoading = false;
            })
            .catch(function (rs) {
                console.log("Has error when detailUser!");
                console.log(rs);
            });
    };
    $scope.reload = function () {
        $scope.model = {
            Id: 0,
            IdService: "",
            Value: "",
        };
        $scope.cancle();
        $scope.init();
    };
    $scope.insert = function () {
        $scope.model.Value = "";
        if ($scope.listService.length > 1) {
            $scope.model.IdService = $scope.listService[0].id;
            $scope.model.ServicePicture = $scope.listService[0].picture;
            $scope.model.ServiceTitle = $scope.listService[0].name;
        };
        $scope.modelSetup.titleButton = "Add";
        $scope.modelSetup.insert = true;
        $scope.layoutPopup = true;
    };
    $scope.cancle = function () {
        $scope.modelSetup.delete = false;
        $scope.modelSetup.insert = false;
        $scope.layoutPopup = false;
    };
    $scope.changeModel = function (type) {
        if (type == "Value" && $scope.model.Value != "") {
            $scope.ErrorAgainPassWord = false;
        }

        if ($scope.model.Value != "") {
            $scope.message = "";
        }

    };
    function validate() {
        var hasError = false;
        if (!$scope.model.Value || $scope.model.Value == undefined) {
            hasError = true;
            $scope.ErrorValue = true;
        }
        if (!$scope.model.IdService || $scope.model.IdService == undefined) {
            hasError = true;
        }
        $scope.message = "Please enter complete information!";
        if (!hasError) {
            $scope.message = "";
        }
        return hasError;
    };
});
app.controller("serviceCard", function ($scope, $rootScope, dataservice, $location) {
    $scope.modelSetup = {
        titleTable: "ServiceCard's records",
        titleForm: "ServiceCard's form",
        titleButton: "Add",
        insert: false,
        delete: false,
    }
    $scope.model = {
        Id: 0,
        Name: "",
        Picture: "",
    };
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
            .catch(function (rs) {
                console.log("Has error when getList!")
                console.log(rs);
            });
    };

    $scope.init();

    $scope.submit = function () {
        if (!validate()) {
            $scope.isLoading = true;
            if ($scope.modelSetup.titleButton == "Add") {
                dataservice.insertServiceCard($scope.model)
                    .then(function (response) {
                        if (!response.data.hasError) {
                            $scope.reload();
                        } else {
                            alert(response.data.title);
                        }
                        $scope.isLoading = false;
                    })
                    .catch(function (rs) {
                        console.log("Has error when insertUser!")
                        console.log(rs);
                    });
            } else {
                dataservice.editServiceCard($scope.model)
                    .then(function (response) {
                        if (!response.data.hasError) {
                            $scope.reload();
                        } else {
                            alert(response.data.title);
                        }
                        $scope.isLoading = false;
                    })
                    .catch(function (rs) {
                        console.log("Has error when insertUser!");
                        console.log(rs);
                    });
            };
        }
    };
    $scope.edit = function (id) {
        $scope.insert();
        $scope.modelSetup.titleButton = "Edit";
        $scope.isLoading = true;
        dataservice.detailServiceCard(id)
            .then(function (response) {
                if (!response.data.hasError) {
                    $scope.model.Id = response.data.object.id;
                    $scope.model.Name = response.data.object.name;
                    $scope.model.Picture = response.data.object.picture;
                } else {
                    alert(response.data.title);
                }
                $scope.isLoading = false;
            })
            .catch(function (rs) {
                console.log("Has error when detailUser!");
                console.log(rs);
            });
    };
    $scope.delete = function (id) {
        $scope.modelSetup.delete = true;
        $scope.layoutPopup = true;
        $scope.model.Id = id;
    };
    $scope.submitDelete = function () {
        $scope.isLoading = true;
        dataservice.removeServiceCard($scope.model.Id)
            .then(function (response) {
                if (!response.data.hasError) {
                    $scope.reload();
                }
                $scope.isLoading = false;
            })
            .catch(function (rs) {
                console.log("Has error when detailUser!");
                console.log(rs);
            });
    };
    $scope.reload = function () {
        $scope.model = {
            Id: 0,
            Name: "",
            Picture: "",
        };
        $scope.cancle();
        $scope.init();
    };
    $scope.insert = function () {
        $scope.model = {
            Id: 0,
            Name: "",
            Picture: "",
        };
        $scope.modelSetup.titleButton = "Add";
        $scope.modelSetup.insert = true;
        $scope.layoutPopup = true;
    };
    $scope.cancle = function () {
        $scope.modelSetup.delete = false;
        $scope.modelSetup.insert = false;
        $scope.layoutPopup = false;
    };
    $scope.changeModel = function (type) {
        if (type == "Name" && $scope.model.Name != "") {
            $scope.ErrorName = false;
        }
        if (type == "Picture" && $scope.model.Picture != "") {
            $scope.ErrorPicture = false;
        }
        if ($scope.model.Name != "" && $scope.model.Picture != "") {
            $scope.message = "";
        }
    };
    function validate() {
        var hasError = false;
        if ($scope.model.Name == "" || $scope.model.Name == undefined) {
            hasError = true;
            $scope.ErrorName = true;
        }
        if ($scope.model.Picture == "" || $scope.model.Picture == undefined) {
            hasError = true;
            $scope.ErrorPicture = true;
        }
        $scope.message = "Please enter complete information!";
        if (!hasError) {
            $scope.message = "";
        };
        return hasError;
    };
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
            .catch(function (rs) {
                console.log("Has error when getList!")
                console.log(rs);
            });
    };

    //$scope.init();
});
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
            return $http.post('/User/InsertUser/',data, { headers: headers });
        },
        editUser: function (data) {
            return $http.post('/User/EditUser/',data, { headers: headers });
        },
        removeUser: function (id) {
            return $http.post('/User/RemoveUser/'+id, { headers: headers });
        },
        detailUser: function (id) {
            return $http.get('/User/DetailUser/'+id, { headers: headers });
        },
        getListUser: function () {
            return $http.get('/User/GetListUser/', { headers: headers });
        },
        //ServiceCard
        insertServiceCard: function (data) {
            return $http.post('/User/InsertServiceCard/',data, { headers: headers });
        },
        editServiceCard: function (data) {
            return $http.post('/User/EditServiceCard/',data, { headers: headers });
        },
        removeServiceCard: function (id) {
            return $http.post('/User/RemoveServiceCard/'+id, { headers: headers });
        },
        detailServiceCard: function (id) {
            return $http.get('/User/DetailServiceCard/'+id, { headers: headers });
        },
        getListServiceCard: function () {
            return $http.get('/User/GetListServiceCard/', { headers: headers });
        },
        //Feedback
        insertFeedback: function (data) {
            return $http.post('/User/InsertFeedback/',data, { headers: headers });
        },
        editFeedback: function (data) {
            return $http.post('/User/EditFeedback/',data, { headers: headers });
        },
        removeFeedback: function (id) {
            return $http.post('/User/RemoveFeedback/'+id, { headers: headers });
        },
        detailFeedback: function (id) {
            return $http.get('/User/DetailFeedback/'+id, { headers: headers });
        },
        getListFeedback: function () {
            return $http.get('/User/GetListFeedback/', { headers: headers });
        },
        //Transaction
        insertTransaction: function (data) {
            return $http.post('/User/InsertTransaction/',data, { headers: headers });
        },
        editTransaction: function (data) {
            return $http.post('/User/EditTransaction/',data, { headers: headers });
        },
        removeTransaction: function (id) {
            return $http.post('/User/RemoveTransaction/'+id, { headers: headers });
        },
        detailTransaction: function (id) {
            return $http.get('/User/DetailTransaction/'+id, { headers: headers });
        },
        getListTransaction: function () {
            return $http.get('/User/GetListTransaction/', { headers: headers });
        },
        //Subcription
        insertSubcription: function (data) {
            return $http.post('/User/InsertSubcription/',data, { headers: headers });
        },
        editSubcription: function (data) {
            return $http.post('/User/EditSubcription/',data, { headers: headers });
        },
        removeSubcription: function (id) {
            return $http.post('/User/RemoveSubcription/'+id, { headers: headers });
        },
        detailSubcription: function (id) {
            return $http.get('/User/DetailSubcription/'+id, { headers: headers });
        },
        getListSubcription: function () {
            return $http.get('/User/GetListSubcription/', { headers: headers });
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
        titleForm: "User's form",
    }
    $scope.init = function () {
        $scope.isLoading = true;
        dataservice.getListUser()
            .then(function (rs) {
                if (!rs.data.hasError) {
                    $scope.listTitle = rs.data.object.titles;
                    $scope.listData = rs.data.object.datas;
                    $scope.isLoading = false;
                }
            })
            .catch(function (er) {
                console.log("Has error when getList!")
                console.log(er);
            });
    };

    $scope.init();

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
                    $scope.isLoading = false;
                }
            })
            .catch(function (er) {
                console.log("Has error when getList!")
                console.log(er);
            });
    };

    $scope.init();
});
app.controller("subcription", function ($scope, $rootScope, dataservice, $location) {

});
app.controller("serviceCard", function ($scope, $rootScope, dataservice, $location) {

});
app.controller("feedback", function ($scope, $rootScope, dataservice, $location) {

});
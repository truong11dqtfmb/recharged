var ctxfolder = "/views/myWeb/serviceProvider";

var app = angular.module("App_ESEIM", ["ngRoute"]);

app.factory('dataservice', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose"
    };

    return {
        getListSercive: function () {
            return $http.get('/ServiceProvider/GetListSercive/', { headers: headers });
        },
        getListSubscription: function (id) {
            return $http.get('/Subscription/GetListSubscription/'+ id, { headers: headers });
        },
        insertTransaction: function (data) {
            return $http.post('/Transaction/Insert/', data, { headers: headers });
        },
        getGmail: function (data) {
            return $http.post('/Transaction/GetGmail/', data, { headers: headers });
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
        .when("/searchProvider", {
            templateUrl: ctxfolder + '/searchProvider.html',
            controller: "searchProvider"
        })
        .when("/buyNow", {
            templateUrl: ctxfolder + '/buyNow.html',
            controller: "buyNow"
        })
        .otherwise({
            redirectTo: "/"
        })
        ;
    //$locationProvider.html5Mode(true);
});

app.controller("index", function ($scope, $rootScope, dataservice, $location) {

    //model searchProvider
    $rootScope.phonenumber = 0;
    $rootScope.id = 0;
    $rootScope.img = "";
    $rootScope.title = "";

    $scope.list = [
        {
            img: "vietnam.jpg",
            title: "Vietnam"
        }
    ];
    $scope.model = {
        country: {
            img: "vietnam.jpg",
            title: "Vietnam"
        },
        selectedService: 0,
        statusData: false
    }
    $scope.init = function () {
        $scope.isLoading = true;
        dataservice.getListSercive()
            .then(function (response) {
                $scope.listService = response.data;
                $rootScope.id = response.data[0].id;
                $rootScope.img = response.data[0].picture;
                $rootScope.title = response.data[0].name;
                $scope.model.statusData = true;
                $scope.isLoading = false;
            })
            .catch(function (error) {
                console.log('')
                console.log("An error occurred:", error);
            });
    };
    $scope.init();

    $scope.submit = function () {
        if (validatePhone()) {
            $rootScope.phonenumber = $scope.checkPhone;
            $location.path("/searchProvider");
        } else {
            $scope.errorPhone = true;
        };
    };

    function validatePhone() {
        // Kiểm tra xem phoneNumber có chứa 9 chữ số không và không bắt đầu bằng số 0
        var phonePattern = /^[1-9]\d{8}$/;
        return phonePattern.test($scope.checkPhone);
    };

    $scope.chooseService = function (id, index, img, title) {
        $scope.model.selectedService = index;

        $rootScope.id = id;
        $rootScope.img = img;
        $rootScope.title = title;
    };

});
app.controller("searchProvider", function ($scope, $rootScope, dataservice, $location) {

    // Kiểm tra xem trang có được reload không
    if (performance.navigation.type === 1) {
        //quay về index nếu trang reload
        $location.path("/");
    }

    $scope.model = {
        selectedService: 0,
        username: "",
        statusData: false
    }
    $scope.init = function () {
        $scope.isLoading = true;
        dataservice.getListSubscription($rootScope.id)
            .then(function (response) {
                $scope.listSubscription = response.data;
                $scope.isLoading = false;
            })
            .catch(function (error) {
                console.log('')
                console.log("An error occurred:", error);
            });
    };
    $scope.init();
    $scope.chooseSubscription = function (index) {
        $scope.model.selectedService = index;
    };
    $scope.buyNow = function (value) {
        var checkLogin = document.getElementById('userName');
        if (checkLogin == null) {
            window.location.href = "/Login/Index";
        } else {
            $rootScope.username = checkLogin.value;
            $rootScope.value = value;
            $location.path("/buyNow");
        }
    };
});
app.controller("buyNow", function ($scope, $rootScope, dataservice, $location) {
    // Kiểm tra xem trang có được reload không
    if (performance.navigation.type === 1) {
        //quay về index nếu trang reload
        $location.path("/");
    }
    $scope.init = function () {
        $scope.isLoading = true;
        var data = {
            UserName: $rootScope.username
        };
        dataservice.getGmail(data)
            .then(function (response) {
                $scope.gmail = response.data.object.gmail;
                $scope.isLoading = false;
            })
            .catch(function (error) {
                console.log('')
                console.log("An error occurred:", error);
            });
    };
    $scope.init();
    $scope.access = function () {
        $scope.isLoading = true;
        var data = {
            UserName: $rootScope.username,
            Phone: $rootScope.phonenumber,
            Value: $rootScope.value,
        };
        dataservice.insertTransaction(data)
            .then(function (response) {
                if (!response.data.hasError) {
                    $location.path("/");
                }
                $scope.isLoading = false;
                alert(response.data.title);
            })
            .catch(function (error) {
                console.log('')
                console.log("An error occurred:", error);
            });
    };
});
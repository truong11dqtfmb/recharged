var ctxfolder = "/views/myWeb/home";

var app = angular.module("App_ESEIM", ["ngRoute"]);

app.factory('dataservice', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose"
    };

    return {
        getListItem: function () {
            return $http.get('/Home/GetListItem/', { headers: headers });
        },
        delete: function (id) {
            return $http.get('/Home/Delete/' + id, { headers: headers });
        },
        edit: function (data) {
            return $http.post('/Home/Edit/', data, { headers: headers });
        },
        getListSercive: function () {
            return $http.get('/ServiceProvider/GetListSercive/', { headers: headers });
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
        .when("/about", {
            templateUrl: ctxfolder + '/index.html',
            controller: "about"
        })
        .otherwise({
            redirectTo: "/"
        })
        ;
    //$locationProvider.html5Mode(true);
});

app.controller("index", function ($scope, dataservice, $http) {
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
        }
    }
    $scope.init = function () {
        dataservice.getListSercive()
            .then(function (response) {
                $scope.listService = response.data;
            })
            .catch(function (error) {
                console.log('')
                console.log("Error getListProduct", error);
            });
    };

    $scope.init();

    $scope.viewProducts = function () {
        window.location.href = "/ServiceProvider/Index";
    };

    //remove
    $scope.edit = function (id) {
        var data = {
            id: id,
            name: "new"
        }
        dataservice.edit(data)
            .then(function (response) {
                $scope.init();
            })
            .catch(function (error) {
                console.log('')
                console.log("An error occurred:", error);
            });
    };
    $scope.delete = function (id) {
        dataservice.delete(id)
            .then(function (response) {
                alert('hi');
                $scope.init();
            })
            .catch(function (error) {
                console.log('')
                console.log("An error occurred:", error);
            });
    };
});

app.controller("about", function ($scope) {
    $scope.message = "This is the About page!";
});
var ctxfolder = "/views/myWeb/feedback";

var app = angular.module("App_ESEIM", ["ngRoute"]);

app.factory('dataservice', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose"
    };

    return {
        feedback: function (data) {
            return $http.post('/Feedback/Feedback/', data, { headers: headers });
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
            templateUrl: ctxfolder + '/index.html',
            controller: "index"
        })
        .otherwise({
            redirectTo: "/"
        })
        ;
});

app.controller("index", function ($scope, $rootScope,  dataservice, $http) {

    $scope.model = {
        Content: "",
        UserName: "",
    }
    $scope.init = function () {

    };

    $scope.init();

    $scope.feedback = function () {
        if ($scope.model.Content == "") {
            $scope.message = "Enter your feedback!";
        } else {
            $scope.isLoading = true;
            $scope.model.UserName = $rootScope.username;
            dataservice.feedback($scope.model)
                .then(function (response) {
                    if (!response.data.hasError) {
                        $scope.isLoading = false;
                        alert("Feedback Success!");
                        $scope.message = "";
                        $scope.model.Content = "";
                    }
                })
                .catch(function (error) {
                    console.log('')
                    console.log("An error occurred:", error);
                });
        }
    };
});
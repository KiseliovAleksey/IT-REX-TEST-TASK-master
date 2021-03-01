import angular from "angular";

/* @ngInject */
class DataLoader {
    constructor($http) {
        "ngInject";
        this.http = $http;
    }

    fetchData(path) {
        let pathPrefix = "assets/json/";
        if (localStorage.getItem(path) === null) {
            console.log("fetch from Assets");
            return this.http.get(pathPrefix + path);
        } else {
            return new Promise((resolve, reject) => {
                console.log("fetch from LocalStorage");
                resolve({ data: angular.fromJson(localStorage.getItem(path)) });
            });
        }
    }
}

export default angular.module("services.data-loader", []).service("dataLoader", DataLoader).name;

/* @ngInject */
export default function routes($stateProvider) {
    $stateProvider.state("grades", {
        url: "/grades",
        template: require("./grades.html"),
        controller: "GradesController",
        controllerAs: "grades",
    });
}

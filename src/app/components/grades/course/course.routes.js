import course from ".";
import grades from "..";

/* @ngInject */
export default function routes($stateProvider) {
    $stateProvider.state("grades.course", {
        url: "/course/:id",
        template: require("./course.html"),
        params: { id: null },
        controller: "CourseController",
        controllerAs: course,
    });
}

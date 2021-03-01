import angular from "angular";

export default angular.module("directives.halfTile", []).directive("halfTile", halfTile).name;
/* @ngInject */
function halfTile() {
    return {
        restrict: "E",
        scope: {
            tileClass: "@",
            clickFn: "&",
        },
        template: require("./view/half-tile.tpl.html"),
        link: function (scope, element, attrs) {},
    };
}

import angular from "angular";

export default angular.module("directives.rotate", []).directive("rotate", rotate).name;
/* @ngInject */
function rotate() {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            scope.$watch(attrs.degrees, function (degrees) {
                console.log(degrees);
                var str = "rotate(" + degrees + "deg) scale(" + scope.domino.dominoScale + ")";
                console.log(str);
                element.css({
                    transform: str,
                });
            });
            scope.$watch(attrs.speed, function (duration) {
                console.log(duration);
                var speed = duration + "s";
                element.css({
                    transition: speed,
                });
            });
            scope.$watch(attrs.scale, function (scale) {
                console.log(scale);
                var str = "rotate(" + scope.domino.degrees + "deg) scale(" + scale + ")";
                element.css({
                    "-moz-transform": str,
                    "-webkit-transform": str,
                    "-o-transform": str,
                    "-ms-transform": str,
                });
            });
        },
    };
}

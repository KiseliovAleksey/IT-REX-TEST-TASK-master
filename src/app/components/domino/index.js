import "./domino.scss";

import angular from "angular";
import uirouter from "@uirouter/angularjs";

import routing from "./domino.routes";
import DominoController from "./domino.controller";
import halfTile from "../../directives/halfTile.directive";
import rotate from "../../directives/rotate.directive";

export default angular.module("app.domino", [uirouter, halfTile, rotate]).config(routing).controller("DominoController", DominoController)
    .name;

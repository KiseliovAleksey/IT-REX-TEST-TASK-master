import "../styles/app.scss";
import angular from "angular";
import ngAnimate from "angular-animate";
import ngTouch from "angular-touch";
import collapse from "ui-bootstrap4/src/collapse";
import uirouter from "@uirouter/angularjs";
import routing from "./app.config";
import * as _ from "lodash";
import AppController from "./app.controller";

import dashboard from "./components/dashboard";
import domino from "./components/domino";
import grades from "./components/grades";
import course from "./components/grades/course";
import confirmAction from "./directives/confirmAction.directive";

angular
    .module("app", [ngAnimate, ngTouch, collapse, uirouter, dashboard, grades, domino, course, confirmAction])
    .config(routing)
    .controller("AppController", AppController);

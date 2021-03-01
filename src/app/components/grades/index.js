import "./grades.scss";

import angular from "angular";
import uirouter from "@uirouter/angularjs";
import "angular-ui-bootstrap";
import "angular-ui-grid";
import routing from "./grades.routes";
import GradesController from "./grades.controller";
import dataLoader from "../../services/dataLoader.service";

export default angular
    .module("app.grades", [uirouter, dataLoader, "ui.bootstrap", "ui.grid"])
    .controller("GradesController", GradesController)
    .config(routing).name;

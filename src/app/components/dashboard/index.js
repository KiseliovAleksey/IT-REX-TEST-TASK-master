import "./dashboard.scss";

import angular from "angular";
import uirouter from "@uirouter/angularjs";

import routing from "./dashboard.routes";
import DashboardController from "./dashboard.controller";
import dataLoader from "../../services/dataLoader.service";
export default angular.module("app.dashboard", [dataLoader]).config(routing).controller("DashboardController", DashboardController).name;

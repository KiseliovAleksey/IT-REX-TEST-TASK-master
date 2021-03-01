import './course.scss'

import angular from 'angular'
import uirouter from '@uirouter/angularjs'
import 'angular-ui-bootstrap'
import 'angular-ui-grid'
import 'angular-ui-grid/ui-grid.css';
import routing from '../course/course.routes'
import CourseController from '../course/course.controller'
import dataLoader from '../../../services/dataLoader.service'
import studentList from '../../../directives/studentList.directive'


export default angular.module('app.course', [uirouter, studentList, dataLoader,'ui.bootstrap', 'ui.grid']).controller('CourseController', CourseController).config(routing).name


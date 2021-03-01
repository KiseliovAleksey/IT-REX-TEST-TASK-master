import angular from "angular";
import "angular-ui-grid";
import dataLoader from "../services/dataLoader.service";
import confirmAction from "../directives/confirmAction.directive";
import { data } from "autoprefixer";

export default angular
    .module("directives.studentList", ["ui.grid", dataLoader, "ui.grid.infiniteScroll", confirmAction, "ui.grid.edit"])
    .directive("studentList", studentList).name;
/* @ngInject */
function studentList($http, dataLoader, $timeout) {
    return {
        restrict: "E",
        scope: {
            item: "=",
            isNew: "=",
        },
        template: require("./view/student-list.tpl.html"),
        link: function (scope, element, attrs) {
            scope.newStudent = {};
            scope.gridData = [];
            scope.allData = [];
            scope.pageSize = 25;
            scope.firstPage = 0;
            scope.lastPage = 0;

            scope.removeRow = function (row) {
                var index = scope.gridData.indexOf(row.entity);
                var removedItem = null;
                if (index !== -1) {
                    removedItem = scope.gridData.splice(index, 1);
                    var indexInAll = scope.allData.indexOf(row.entity);
                    if (index !== -1) {
                        scope.allData.splice(indexInAll, 1);
                    }
                    scope.saveEntity();
                    scope.calculateSummary();
                }
            };
            scope.gridOptions = {
                infiniteScrollRowsFromEnd: 5,
                enableCellEditOnFocus: true,
                infiniteScrollUp: true,
                infiniteScrollDown: true,
                columnDefs: [
                    { name: "name", displayName: "Student Full Name", enableCellEdit: true, width: "76%" },
                    {
                        name: "grade",
                        enableCellEdit: true,
                        width: "13%",
                        editableCellTemplate: '<input type="number" ui-grid-editor step="0.1" min=1 max=5 ng-model="MODEL_COL_FIELD" />',
                    },
                    {
                        name: "delete",
                        displayName: "",
                        enableColumnMenu: false,
                        enableCellEdit: false,
                        enableFiltering: false,
                        width: "11%",
                        cellTemplate: `<button class="btn" 
                                        ng-confirm-click="Are you sure?" 
                                        ng-click="grid.appScope.removeRow(row)">
                                        <i class="fa fa-remove"></i>
                                        </button>`,
                    },
                ],
                data: "gridData",
                onRegisterApi: function (gridApi) {
                    gridApi.infiniteScroll.on.needLoadMoreData(scope, getDataDown);
                    gridApi.infiniteScroll.on.needLoadMoreDataTop(scope, getDataUp);
                    scope.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, function (rowEntity, colDef, newValue, oldValue) {
                        var index = scope.allData.indexOf(rowEntity);
                        switch (colDef.name) {
                            case "grade":
                                if (!(newValue && newValue >= 1 && newValue <= 5)) {
                                    rowEntity.grade = oldValue;
                                } else {
                                    if (index !== -1) {
                                        scope.allData[index].grade = newValue;
                                    }
                                    scope.calculateSummary();
                                    scope.$apply();
                                }
                                break;
                            case "name":
                                if (newValue.length > 0) {
                                    if (index !== -1) {
                                        scope.allData[index].name = newValue;
                                    }
                                    scope.calculateSummary();
                                    scope.$apply();
                                } else {
                                    rowEntity.name = oldValue;
                                }
                                break;
                            default:
                                break;
                        }
                    });
                },
            };
            function getFirstData() {
                if (!scope.item.isNew) {
                    return dataLoader.fetchData("class-" + scope.item.id + ".json").then(function (response) {
                        scope.allData = response.data;
                        var newData = getPage(response.data, scope.lastPage);
                        scope.gridData = scope.gridData.concat(newData);
                        scope.calculateSummary();
                    });
                }
            }
            function getDataDown() {
                return dataLoader
                    .fetchData("class-" + scope.item.id + ".json")
                    .then(function (response) {
                        scope.lastPage++;
                        //bug with hash code when scrolled
                        //var newData = getPage(response.data, scope.lastPage);
                        var newData = getPage(scope.allData, scope.lastPage);
                        scope.gridApi.infiniteScroll.saveScrollPercentage();
                        scope.gridData = scope.gridData.concat(newData);
                        return scope.gridApi.infiniteScroll
                            .dataLoaded(scope.firstPage > 0, scope.lastPage < Math.round(scope.allData.length / scope.pageSize))
                            .then(function () {
                                checkDataLength("up");
                            });
                    })
                    .catch(function (error) {
                        return scope.gridApi.infiniteScroll.dataLoaded();
                    });
            }
            function getDataUp() {
                return dataLoader
                    .fetchData("class-" + scope.item.id + ".json")
                    .then(function (response) {
                        scope.firstPage--;
                        //bug with hash code when scrolled
                        //var newData = getPage(response.data, scope.firstPage);
                        var newData = getPage(scope.allData, scope.firstPage);
                        scope.gridApi.infiniteScroll.saveScrollPercentage();
                        scope.gridData = newData.concat(scope.gridData);
                        return scope.gridApi.infiniteScroll
                            .dataLoaded(scope.firstPage > 0, scope.lastPage < Math.round(scope.allData.length / scope.pageSize))
                            .then(function () {
                                checkDataLength("down");
                            });
                    })
                    .catch(function (error) {
                        return scope.gridApi.infiniteScroll.dataLoaded();
                    });
            }
            function getPage(data, page) {
                var res = [];
                for (var i = page * 25; i < (page + 1) * 25 && i < data.length; ++i) {
                    res.push(data[i]);
                }
                return res;
            }
            function checkDataLength(discardDirection) {
                if (scope.lastPage - scope.firstPage > 2) {
                    scope.gridApi.infiniteScroll.saveScrollPercentage();
                    if (discardDirection === "up") {
                        var slice = scope.gridData.length - scope.pageSize * 3;
                        scope.gridData = scope.gridData.slice(slice);
                        scope.firstPage++;
                        $timeout(function () {
                            scope.gridApi.infiniteScroll.dataRemovedTop(
                                scope.firstPage > 0,
                                scope.lastPage < Math.round(scope.allData.length / scope.pageSize)
                            );
                        });
                    } else {
                        scope.gridData = scope.gridData.slice(0, scope.pageSize * 3);
                        scope.lastPage--;
                        $timeout(function () {
                            scope.gridApi.infiniteScroll.dataRemovedBottom(
                                scope.firstPage > 0,
                                scope.lastPage < Math.round(scope.allData.length / scope.pageSize)
                            );
                        });
                    }
                }
            }
            if (!scope.item.isNew) {
                $timeout(function () {
                    getFirstData().then(function () {
                        $timeout(function () {
                            scope.gridApi.infiniteScroll.resetScroll(
                                scope.firstPage > 0,
                                scope.lastPage < Math.round(scope.allData.length / scope.pageSize)
                            );
                        });
                    });
                });
            }
            scope.calculateSummary = function () {
                const { length } = scope.allData;
                scope.item.summaryGrade = scope.allData
                    .reduce((acc, val) => {
                        return acc + val.grade / length;
                    }, 0)
                    .toFixed(1);
            };
            scope.addStudentNewRow = function () {
                var lastUser = { id: 0 };
                if (scope.allData.length > 1) {
                    lastUser = scope.allData.reduce((prev, current) => (prev.y > current.y ? prev : current));
                }
                let newStudent = {
                    id: lastUser.id + 1,
                    name: scope.newStudent.userName,
                    grade: scope.newStudent.userGrade,
                };
                scope.allData.push(newStudent);
                scope.gridData.push(newStudent);
                scope.saveEntity();
                scope.calculateSummary();
            };
            /*save*/
            scope.updateClassMap = function () {
                dataLoader.fetchData("class-list.json").then((response) => {
                    scope.allClasses = response.data;
                    if (scope.item.isNew) {
                        delete scope.item.isNew;
                        scope.allClasses.push(scope.item);
                    } else {
                        var foundIndex = scope.allClasses.findIndex((x) => x.id == scope.item.id);
                        scope.allClasses[foundIndex] = scope.item;
                    }
                    localStorage.setItem("class-list.json", angular.toJson(scope.allClasses));
                });
            };
            scope.saveEntity = function () {
                scope.updateClassMap();
                localStorage.setItem("class-" + scope.item.id + ".json", angular.toJson(scope.allData));
            };
        },
    };
}

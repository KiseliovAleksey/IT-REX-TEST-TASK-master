import grades from ".";

/* @ngInject */
export default class GradesController {
    constructor(dataLoader, $timeout, $state) {
        "ngInject";
        this.$timeout = $timeout;
        this.dataLoader = dataLoader;
        this.currentItem = null;
        this.state = $state;
    }
    $onInit() {
        var grades = this;
        this.dataLoader.fetchData("class-list.json").then(function (response) {
            grades.data = response.data;
            grades.currentItem = response.data[0];
        });
    }
    addTab() {
        this.newTabId = `f${(~~(Math.random() * 1e8)).toString(16)}`;
        let newClass = {
            id: this.newTabId,
            name: "NoName",
            isNew: true,
        };
        this.data.push(newClass);
        this.currentItem = newClass;
        this.$timeout(function () {
            let links = angular.element(document.getElementsByName("nav-link"));
            links.removeClass("active");
            links[links.length - 1].classList.add("active");
        });
    }
    removeClass(index, event) {
        var spliced = this.data.splice(index, 1);
        this.data.length - 1;
        event.preventDefault();
        localStorage.setItem("class-list.json", angular.toJson(this.data));
        localStorage.removeItem("class-" + spliced[0].id + ".json");
        if (this.data.length > 0) {
            var grades = this;
            this.$timeout(function () {
                let links = angular.element(document.getElementsByName("nav-link"));
                links.removeClass("active");
                links[0].classList.add("active");
                grades.state.go("grades.course", { id: grades.data[0].id }, { reload: true });
            });
        }
    }
    selectedItem(item, element) {
        this.currentItem = item;
        let links = angular.element(document.getElementsByName("nav-link"));
        links.removeClass("active");
        element.currentTarget.firstElementChild.classList.add("active");
    }
}

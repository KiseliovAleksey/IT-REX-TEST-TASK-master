/* @ngInject */
export default class DominoController {
    constructor() {
        this.degrees = 0;
        this.animationSpeed = 1;
        this.dominoScale = 1;
        this.tile = {
            upper: {
                selected: false,
                value: "",
            },
            bottom: {
                selected: false,
                value: "",
            },
        };
        this.addedDomino = [];
    }
    rotate(angle) {
        this.degrees += angle;
    }

    resetDomino() {
        this.degrees = 0;
        this.animationSpeed = 1;
        this.dominoScale = 1;
        this.tile = {
            upper: {
                selected: false,
                value: "",
            },
            bottom: {
                selected: false,
                value: "",
            },
        };
    }
    selectHalfTile(element, place) {
        if (element.currentTarget.classList.contains("selected")) {
            element.currentTarget.classList.remove("selected");
            this.tile[place].selected = false;
        } else {
            element.currentTarget.classList.add("selected");
            this.tile[place].selected = true;
        }
    }
    choiseHalfTile(obj) {
        let newClass = obj.currentTarget.id;
        if (this.tile.upper.selected) this.tile.upper.value = newClass;
        if (this.tile.bottom.selected) this.tile.bottom.value = newClass;
    }
    addToTable() {
        var cBot = this.tile.bottom.value ? this.tile.bottom.value : "";
        var cTop = this.tile.upper.value ? this.tile.upper.value : "";
        var exist = false;
        _.forEach(this.addedDomino, function (tile) {
            if ((tile.bot == cBot && tile.top == cTop) || (tile.bot == cTop && tile.top == cBot)) {
                exist = true;
            }
        });
        if (!exist) {
            let dot = `<div class="dot"></div>`;
            let row = `<div class="row"> ${dot + dot + dot}</div>`;
            let tmpl = `<div class='tile'>
                             <div class='segment ${this.tile.upper.value}'>
                             ${row + row + row}</div>
                            <div class='line'></div>
                            <div class='segment ${this.tile.bottom.value}'>
                            ${row + row + row}</div>
                        </div>`;
            let mainTile = angular.element(document.getElementById("dominoTable"));
            mainTile[0].innerHTML += tmpl;
            var obj = {};
            this.tile.upper.value ? (obj.top = this.tile.upper.value) : (obj.top = "");
            this.tile.bottom.value ? (obj.bot = this.tile.bottom.value) : (obj.bot = "");

            this.addedDomino.push(obj);
        }
    }
}

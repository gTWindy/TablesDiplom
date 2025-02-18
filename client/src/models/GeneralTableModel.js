import { dateOptions, translateForColumns } from '../App';
import { observable, action } from "mobx";
import { BaseTableModel } from './BaseTableModel';

// Модель данных для одной таблицы-редактор курса
class GeneralTableModel extends BaseTableModel {
    // Список отсутствующих людей с полной информацией
    busyList = [];
    // Список групп и людей в них
    manList = [];
    // Список групп и людей в них в виде узлов дерева
    groupsList = []

    constructor() {
        super();

    };

    // Загружаем данные с сервера
    loadData = async () => {
        await this.makeRequest(`http://localhost:5000/busyList`,
            (loadedData) => {
                this.savedDate = loadedData.date;
                this.savedName = loadedData.name;
                this.savedRank = loadedData.rank;
                for (let row = 0; row < 5; ++row) {
                    loadedData.people[row].forEach((man) => {
                        this.manListBusy[row][man.type].push(man.id);
                    })
                }
            }
        );


        // Загружаем список всех курсантов, для возможности показа списка
        await this.makeRequest("http://localhost:5000/manList",
            (data) => {
                let groupsList = [];
                for (let course in data) {
                    groupsList.push(
                        Object.keys(data[course]).map(group => ({
                            title: group,
                            key: group,
                            selectable: false,
                            children: data[course][group].map(man => ({
                                title: man['ФИО'] + ' ' + man['Личный номер'],
                                key: man['Личный номер'],
                                course,
                                group,
                                value: { ...man },
                            }))
                        })));
                }
                this.manList = data;
                this.groupsList = groupsList;
        })
    }

    getDataForView = () => {
        const newDataForView = [];
        // Последняя строчка "Всего"
        let lastRowForView = {
            course: "Всего",
            list: 250,
            have: 250
        }
        for (let i = 0; i < this.manListBusy.length; ++i) {
            let newRowForView = {
                course: i + 1,
                list: 50,
            };
            let summOfAbsent = 0;
            for (const columnName in this.manListBusy[i]) {
                const busyManCountInColumn = this.manListBusy[i][columnName].length;
                summOfAbsent += busyManCountInColumn;
                newRowForView[columnName] = busyManCountInColumn;
                lastRowForView[columnName] ?  lastRowForView[columnName] += busyManCountInColumn : lastRowForView[columnName] = busyManCountInColumn;
            }
            newRowForView.have = 50 - summOfAbsent;
            lastRowForView.have -= summOfAbsent;
            newDataForView.push(newRowForView);
        }
        newDataForView.push(lastRowForView);
        return newDataForView;
    }

    getBusyManListForTable = () => {
        let busyListForView = [];
        let number = 1;
        for (let i = 0; i < this.manListBusy.length; ++i) {
            for (const columnName in this.manListBusy[i]) {
                this.manListBusy[i][columnName].forEach(idOfBusy => {
                    for (let groupName in this.manList[i]) {
                        const info = this.manList[i][groupName].find((man) => man["Личный номер"] == idOfBusy);
                        if(!info) {
                            continue;
                        }
                        busyListForView.push({
                            number,
                            course: i + 1,
                            rank: info["Воинское звание"],
                            name: info["ФИО"],
                            reason: translateForColumns[columnName],
                            remark: "",
                            phone: info["Номер телефона"],
                        });
                        number++;
                        }
                    } 
                );
            }
        }

        return busyListForView;
    }

    // Возвращаем список людей выбранной группы, которые не заняты
    getManListForChoose = (row, columnName) => {
        const busyPeople = this.getBusyManListFromOtherColumns(row, columnName);

        const copy =  this.groupsList[row].map((group) => {
            group.children = group.children.filter((person) => {
                return !busyPeople.includes(person.key);
            });
            return group;
        });

        return copy.filter(group => group.children.length);
    }
}

export {
    GeneralTableModel
}
import { dateOptions, translateForColumns } from '../App';
import { observable, action } from "mobx";
import { BaseTableModel } from './BaseTableModel';

// Модель данных для одной таблицы-редактор курса
class GeneralTableModel extends BaseTableModel {
    // Дата, сохраненных данных
    savedDate = '';
    // Сохраненное имя
    savedName = null;
    // Сохраненное звание
    savedRank = null;
    // Список отсутствующих людей с полной информацией
    busyList = [];
    // Список групп и людей в них
    manList = [];
    // Список групп и людей в них в виде узлов дерева
    groupsList = []
    // Массив id занятых людей
    idOfCheckedMan = []

    constructor() {
        super();

        this.idOfCheckedMan = observable([]);
    };

    // Загружаем данные с сервера
    loadData = async () => {
        await this.makeRequest(`http://localhost:5000/busyList`,
            (loadedData) => {
                this.idOfCheckedMan = loadedData;
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
        const dataByColumns = this.idOfCheckedMan;
        let newDataForView = [];
        // Последняя строчка "Всего"
        let lastRowForView = {
            course: "Всего",
            list: 250,
            have: 250
        }
        for (let i = 0; i < dataByColumns.length; ++i) {
            let newRowForView = {
                course: i + 1,
                list: 50,
            };
            let summOfAbsent = 0;
            for (const columnName in dataByColumns[i]) {
                const busyManCountInColumn = dataByColumns[i][columnName].length;
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

    getBusyListForView = () => {
        const dataByColumns = this.idOfCheckedMan;
        let busyListForView = [];
        let number = 1;
        for (let i = 0; i < dataByColumns.length; ++i) {
            for (const columnName in dataByColumns[i]) {
                dataByColumns[i][columnName].forEach(idOfBusy => {
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

    setCheckedMan = (numberOfCourse, columnName, idesMan) => {
        if (!this.idOfCheckedMan[numberOfCourse]) {
            this.idOfCheckedMan[numberOfCourse] = [];
        }
          
        this.idOfCheckedMan[numberOfCourse][columnName] = idesMan;
    }

    getCheckedMan = (numberOfCourse, columnName) => {
        if (!this.idOfCheckedMan[numberOfCourse]) {
            this.idOfCheckedMan[numberOfCourse] = [];   
        }
        if (!this.idOfCheckedMan[numberOfCourse][columnName]) {
            this.idOfCheckedMan[numberOfCourse][columnName] = [];
        }
        return this.idOfCheckedMan[numberOfCourse][columnName];
    }

    // Возвращаем список людей выбранной группы, которые не заняты
    getManListForChoose = (row, columnName) => {
        if (row === null)
            return [];
        // Список людей этой группы занятые 
        let busyPeople = [];
         // создаем копию объекта columns
        const columnsCopy = { ...this.idOfCheckedMan[row] };
        // удаляем указанное свойство из копии
        delete columnsCopy[columnName];
        // Объединяем все оставшиеся массивы в один
        busyPeople.push(Object.values(columnsCopy).flat());
        busyPeople = busyPeople.flat();

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
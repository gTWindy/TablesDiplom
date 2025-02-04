import { dateOptions, translateForColumns } from '../App';
import { observable, action } from "mobx";

// Модель данных для одной таблицы-редактор курса
class GeneralTableModel {
    // Дата, сохраненных данных
    savedDate = '';
    // Сохраненное имя
    savedName = null;
    // Сохраненное звание
    savedRank = null;
    // Данные для представления в самой таблице
    data = [];
    // Список отсутствующих людей с полной информацией
    busyList = [];
    // Список групп и людей в них
    manList = [];
    // Массив id занятых людей
    idOfCheckedMan = []

    constructor() {
        this.data = observable([]);
    };

    // Делаем запрос
    makeRequest = async (url, func) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            func(await response.json());
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        };
    }

    // Загружаем данные с сервера
    loadData = async () => {
        await this.makeRequest(`http://localhost:5000/busyList`,
            (loadedData) => {
                const dataByColumns = loadedData.byColumns;
                let newData = [];
                for (let i = 0; i < dataByColumns.length; ++i) {
                    newData.push({
                        course: i + 1,
                        list: 50,
                        have: 50 - (dataByColumns[i].service.length + dataByColumns[i].lazaret.length + dataByColumns[i].hospital.length +
                            dataByColumns[i].trip.length + dataByColumns[i].vacation.length + dataByColumns[i].dismissal.length + dataByColumns[i].other.length),
                        service: dataByColumns[i].service.length,
                        lazaret: dataByColumns[i].lazaret.length,
                        hospital: dataByColumns[i].hospital.length,
                        trip: dataByColumns[i].trip.length,
                        vacation: dataByColumns[i].vacation.length,
                        dismissal: dataByColumns[i].dismissal.length,
                        other: dataByColumns[i].other.length
                    })
                }
                this.data = newData;
                this.busyList = loadedData.list;
            }
        );

        // Загружаем список всех курсантов, для возможности выбора нового больного
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
                this.manList = groupsList;
        })
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
}

export {
    GeneralTableModel
}
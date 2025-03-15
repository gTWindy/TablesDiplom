import { action } from "mobx";
import {dateOptions, timeOptions} from '../App';
import { getFromServer, sendToServer } from "../Net";

// Базовая модель данных
class BaseTableModel {
    // Дата, сохраненных данных
    savedDate = "";
    // Сохраненное имя
    savedName = null;
    // Сохраненное звание
    savedRank = null;
    // Список id людей по строкам, которые уже заняты (болеют, в наряде и т.д.)
    manListBusy = [];
    // Примечания для занятых людей
    remarksOfBusyByIndex = new Map();

    constructor() {
        this.setBusyManListAction = action(this.setBusyManIdList.bind(this));
        for (let i = 0; i < 5; ++i) {
            this.manListBusy.push({
                service: [],
                lazaret: [],
                hospital: [],
                trip: [], 
                vacation: [],
                dismissal: [],
                other: []
            })
        }
    };

    // Делаем запрос
    makeRequest = async (url, func) => {
        const result = await getFromServer(url);
        if (result) {
            func(result);
        }
    }
    
    // Устанавливаем новое звание
    setSavedRank = (newRank) => {
        this.savedRank = newRank;
    }

    // Возвращаем сохраненное звание
    getSavedRank = () => {
        return this.savedRank;
    }

    // Устанавливаем новое имя
    setSavedName = (newName) => {
        this.savedName = newName;
    }

    // Возвращаем сохраненное имя
    getSavedName = () => {
        return this.savedName;
    }

    // Устанавливаем новый список занятых
    setBusyManIdList = (row, columnName, ides) => {
        this.manListBusy[row][columnName] = ides;
    }

    // Получаем список id занятых людей
    getBusyManIdList = (row = -1, columnName) => {
        if (row === -1)
        return this.manListBusy;
        return this.manListBusy[row][columnName];
    }

    // Возвращает список людей из данной строки, которые уже заняты в других столбцах
    getBusyManListFromOtherColumns = (row, columnName) => {
        if (row === null)
            return [];
        // Список людей этой группы занятые 
        let busyPeople = [];
         // создаем копию объекта columns
        const columnsCopy = { ...this.manListBusy[row] };
        // удаляем указанное свойство из копии
        delete columnsCopy[columnName];
        // Объединяем все оставшиеся массивы в один
        busyPeople.push(Object.values(columnsCopy).flat());
        return busyPeople.flat();
    }

    setRemarkForBusy = (index, remark) => {
        this.remarksOfBusyByIndex[index] = remark;
    }

    // Отправляем список занятых на сервер
    sendBusyListToServer  = async () => {
        const date = new Date();
        const objectToSend = {
            people: this.manListBusy,
            remarks: this.remarksOfBusyByIndex,
            savedName: this.savedName,
            savedRank: this.savedRank,
            dateAndTime: date.toLocaleDateString("ru-RU", dateOptions) + " " + date.toLocaleTimeString("ru-RU", timeOptions)
        };
        if (this.numberOfCourse) {
            objectToSend.numberOfCourse = this.numberOfCourse;
        }

        await sendToServer("http://localhost:5000/busyList", objectToSend);
    }
}

export {
    BaseTableModel
}
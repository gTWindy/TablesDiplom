import {dateOptions} from '../App';

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

    constructor() {
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

    // Отправляем список занятых на сервер
    sendToServer = async (dataToSend) => {
        try {
            const response = await fetch('http://localhost:5000/busyList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Отправляем список занятых
                body: JSON.stringify({
                    data: dataToSend,
                    savedName: this.savedName,
                    savedRank: this.savedRank,
                    date: new Date().toLocaleDateString('ru-RU', dateOptions)
                })
            });
            if (!response.ok) {
                throw new Error("Ошибка при отправке данных занятых.");
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
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
}

export {
    BaseTableModel
}
import {dateOptions, translateForColumns} from '../App';
import { observable, action } from "mobx";
import { BaseTableModel } from './BaseTableModel';

// Модель данных для одной таблицы-редактор курса
class TableEditorModel extends BaseTableModel{
  // Список групп и людей в них
  manList = [];
  // Список групп
  numbersOfGroups = [];
  // Номер курса
  numberOfCourse = -1;

  constructor(numbersOfGroup) {
    super();

    this.setBusyManListAction = action(this.setBusyManIdList.bind(this));

    this.numbersOfGroups = numbersOfGroup;
    this.numberOfCourse = Math.floor(this.numbersOfGroups[0] / 1000);
    for (let i = 0; i < numbersOfGroup.length; ++i) {
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

  // Загружаем данные с сервера
  loadData = async () => {
    this.makeRequest(`http://localhost:5000/manList?course=${this.numberOfCourse}`,
      (result) => {
        this.manList = result;
      }
    );
    
    await this.makeRequest(`http://localhost:5000/busyList?course=${this.numberOfCourse}`,
      (result) => {
        this.savedDate = result.date;
        this.savedName = result.name;
        this.savedRank = result.rank;
        for (let row = 0; row < 5; ++row) {
          const groupNumber = this.numbersOfGroups[row];
          result[groupNumber].forEach( (man) => {
            this.manListBusy[row][man.type].push(man.id);
          })
        }
      }
    );
  }

  getDataForView = () => {
    const newDataForView = [];
    // Последняя строчка "Всего"
    let lastRowForView = {
      groupNumber: "Всего",
      list: 50,
      have: 50
    }
    for (let i = 0; i < this.manListBusy.length; ++i) {
      let newRowForView = {
        groupNumber: this.numbersOfGroups[i],
        list: 10,
      };
      let summOfAbsent = 0;
      for (const columnName in this.manListBusy[i]) {
        const busyManCountInColumn = this.manListBusy[i][columnName].length;
        summOfAbsent += busyManCountInColumn;
        newRowForView[columnName] = busyManCountInColumn;
        lastRowForView[columnName] ? lastRowForView[columnName] += busyManCountInColumn : lastRowForView[columnName] = busyManCountInColumn;
      }
      newRowForView.have = 10 - summOfAbsent;
      lastRowForView.have -= summOfAbsent;
      newDataForView.push(newRowForView);
    }
    newDataForView.push(lastRowForView);
    return newDataForView;
  }

  // Получаем список занятых людей для представления в таблице отсутствующих
  getBusyManListForTable = () => {
    let listOfAbsent = [];
    // Порядковый номер.
    let i = 1;
    for (let row = 0; row < this.manListBusy.length; row++) {
      const groupNumber = this.numbersOfGroups[row];
      for (const columnName of Object.keys(this.manListBusy[row])) {
        for (const id of this.manListBusy[row][columnName]) {
          const busyMan = this.manList[groupNumber].find((man) => {
            return man['Личный номер'] === id;
          });
          if (!busyMan)
            continue;
          listOfAbsent.push({
            number: i,
            group: groupNumber,
            rank: busyMan['Воинское звание'],
            name: busyMan['ФИО'],
            reason: translateForColumns[columnName],
            remark: '',
          });
          ++i;
        }
      }
    }
    return listOfAbsent;
  }

  // Возвращаем список людей выбранной группы, которые не заняты
  getManListForChoose = (row, columnName) => {
    //Получаем список id занятых по всем столбцам, выбранной строки
    const busyPeople = this.getBusyManListFromOtherColumns(row, columnName);
    // Номер группы
    const groupName = this.numbersOfGroups[row];
    
    let listForChoose = this.manList[groupName].filter(person => !busyPeople.includes(person['Личный номер']));
    listForChoose = listForChoose.map((man) => {
      return {
        title: man["ФИО"],
        key: man["Личный номер"]
      }
    })
    return listForChoose;
  }

  // Отправляем список занятых на сервер
  sendBusyListToServer = async () => {
    try {
      const response = await fetch('http://localhost:5000/busyList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Отправляем список занятых
        body: JSON.stringify({
          people: this.manListBusy,
          numberOfCourse: this.numberOfCourse,
          savedName: this.savedName,
          savedRank: this.savedRank,
          date: new Date().toLocaleDateString('ru-RU', dateOptions)

        }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при отправке данных занятых.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }
}

export {
  TableEditorModel
}
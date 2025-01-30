import {dateOptions, translateForColumns} from '../App';
import { observable, action } from "mobx";

const columns = [
  {
    Header: 'N п/п',
    accessor: 'number',// accessor is the "key" in the data
  },
  {
    Header: 'Подразделение',
    accessor: 'groupNumber',// accessor is the "key" in the data
  },
  {
    Header: 'По списку',
    accessor: 'list',
  },
  {
    Header: 'На лицо',
    accessor: 'have',
  },
  {
    Header: 'Наряд',
    accessor: 'service',
  },
  {
    Header: 'Лазарет',
    accessor: 'lazaret',
  },
  {
    Header: 'Госпиталь',
    accessor: 'hospital',
  },
  {
    Header: 'Командировка',
    accessor: 'trip',
  },
  {
    Header: 'Отпуск',
    accessor: 'vacation',
  },
  {
    Header: 'Увольнение',
    accessor: 'dismissal',
  },
  {
    Header: 'Прочее',
    accessor: 'other',
  }
]

// Модель данных для одной таблицы-редактор курса
class TableEditorModel {
  // Список групп и людей в них
  manList = [];
  // Список людей по группам, которые уже заняты (болеют, в наряде и т.д.)
  manListBusy = [];
  // Список групп
  numbersOfGroups = [];
  // Номер курса
  numberOfCourse = -1;
  // Дата, сохраненных данных
  savedDate = '';
  // Сохраненное имя
  savedName = null;
  // Сохраненное звание
  savedRank = null;
  // Данные самой таблицы
  data = [];

  constructor(numbersOfGroup) {
    // Делаем массив data наблюдаемым
    this.data = observable([]);
    this.setBusyManListAction = action(this.setBusyManList.bind(this));

    this.numbersOfGroups = numbersOfGroup;
    this.numberOfCourse = Math.floor(this.numbersOfGroups[0] / 1000);
    for (let i = 0; i < numbersOfGroup.length; ++i) {
      this.data.push({
        list: 10,
        groupNumber: numbersOfGroup[i],
        have: 10,
        service: 0,
        lazaret: 0,
        hospital: 0,
        trip: 0, 
        vacation: 0,
        dismissal: 0,
        other: 0,
      });
      this.manListBusy.push({
        groupNumber: numbersOfGroup[i],
        columns: {
          service: [],
          lazaret: [],
          hospital: [],
          trip: [], 
          vacation: [],
          dismissal: [],
          other: []
        }
      })
    }
    // Добавляем последнюю строку "всего"
    this.data.push({
      list: 50,
      groupNumber: 'Всего',
      have: 50,
      service: 0,
      lazaret: 0,
      hospital: 0,
      trip: 0, 
      vacation: 0,
      dismissal: 0,
      other: 0,
    });
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
          const groupNumber = this.data[row].groupNumber;
          
          result[groupNumber].forEach( (man) => {
            this.manListBusy[row].columns[man.type].push(man.id);
            this.data[row][man.type] += 1;
            this.data[row].have -= 1;
            // Последняя строка "Всего"
            this.data[5][man.type] += 1;
            this.data[5].have -= 1;
          })
        }
      }
    );
  }
  // Устанавливаем новый список занятых
  setBusyManList = (row, columnName, ides) => {
    this.manListBusy[row].columns[columnName] = ides;
    // Обновление столбца "на лицо" и последней строки
    const diff = ides.length - this.data[row][columnName];
    this.data[row]['have'] -= diff;
    this.data[row][columnName] = ides.length;
    // Обновление последней строки
    this.data[5]['have'] -= diff;
    this.data[5][columnName] += diff;
  }

  // Получаем список занятых людей
  getBusyManList = (row = -1, columnName) => {
    if (row === -1)
      return this.manListBusy;
    return this.manListBusy[row].columns[columnName];
  }

  // Получаем список занятых людей для представления в таблице отсутствующих
  getBusyManListForTable = () => {
    let listOfAbsent = [];
    // Порядковый номер.
    let i = 1;
    for (let group of this.manListBusy) {
      for (let columnName of Object.keys(group.columns)) {
        for (let id of group.columns[columnName]) {
          const busyMan = this.manList[group.groupNumber].find((man) => {
            return man['Личный номер'] === id;
          });
          if (!busyMan)
            continue;
          listOfAbsent.push({
            number: i,
            group: group.groupNumber,
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
    if (row === null)
      return [];
    let busyPeople = [];
    // Список людей этой группы занятые 
    const columnsCopy = { ...this.manListBusy[row].columns }; // создаем копию объекта columns
    delete columnsCopy[columnName]; // удаляем указанное свойство из копии
    // Объединяем все оставшиеся массивы в один
    busyPeople.push(Object.values(columnsCopy).flat());
    busyPeople = busyPeople.flat();
    // Номер группы
    const groupName = this.numbersOfGroups[row];
    
    return this.manList[groupName].filter(person => !busyPeople.includes(person['Личный номер']));
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

}

export {
    columns,
    TableEditorModel
}
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

const urls = [
  'http://localhost:5000/1kurs',
  'http://localhost:5000/2kurs',
  'http://localhost:5000/3kurs',
  'http://localhost:5000/4kurs',
  'http://localhost:5000/5kurs',
]

// Модель данных для одной таблицы-редактор курса
class TableEditorModel {
  // Список групп и людей в них
  manList = [];
  // Список людей по группам, которые выбраны
  manListBusy = [];
  // Список групп
  numbersOfGroups = [];
  // Список больных по группам
  sicks = [];
  // Данные самой таблицы
  data = [];

  constructor(numbersOfGroup) {
    this.numbersOfGroups = numbersOfGroup;
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
  };

  loadData = async () => {
    try {
      // Номер курса
      const numberCourse = Math.floor(this.numbersOfGroups[0] / 1000);
      const response = await fetch(urls[numberCourse - 1]);
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);
      const dataResponse = await response.json(); // Преобразуем ответ в JSON
      this.manList = dataResponse.result;
    } catch(error) {
        console.error('There has been a problem with your fetch operation:', error);
    };

    try {
      const response = await fetch('http://localhost:5000/sick');
      if (!response.ok)
        throw new Error('Network response was not ok');
      const result = await response.json();
      
      console.log(result);
      // Установка полученных данных
      this.sicks = (result.parsedData);
  } catch (error) {
      //setError(error.message); // Установка сообщения об ошибке
  }

  }
  
  setBusyManList = (row, columnName, ides) => {
    this.manListBusy[row].columns[columnName] = ides;
  }

  getBusyManList = (row, columnName) => {
    return this.manListBusy[row].columns[columnName];
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

    const groupName = this.numbersOfGroups[row];
    return this.manList[groupName].filter(person => !busyPeople.includes(person['Порядковый номер']));
  }

}

export {
    columns,
    TableEditorModel
}
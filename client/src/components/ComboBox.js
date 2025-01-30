import React from 'react';
import Select from 'react-select';

const options = [
  { value: 'hospital', label: 'Госпиталь' },
  { value: 'lazaret', label: 'Лазарет' }
];

const ComboBox = ( {selectedItem, onChange} ) => {
  return (
    <Select
      options={options}
      isSearchable={false} // Выключить поиск
      isClearable // Разрешить очистку поля
      placeholder="Выбрать мед. учреждение..."
      value={options.find((value) => value.value === selectedItem)}
      onChange={(newValue) => onChange(newValue)}
    />
  );
};

export default ComboBox;
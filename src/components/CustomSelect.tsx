import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';

import { Dispatch, SetStateAction } from 'react';

interface MenuItem {
  value: string | number;
  text: string;
}

interface CustomSelectProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  labelId: string;
  labelText: string;
  selectId: string;
  menuItems: MenuItem[];
}

export const CustomSelect = ({
  value,
  setValue,
  labelId,
  labelText,
  selectId,
  menuItems,
}: CustomSelectProps) => {
  const handleValueChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };

  return (
    <Grid item xs={12} sm={4}>
      <FormControl fullWidth>
        <InputLabel id={labelId}>{labelText}</InputLabel>
        <Select
          onChange={handleValueChange}
          labelId={labelId}
          id={selectId}
          value={value}
          label={labelText}
        >
          {menuItems.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

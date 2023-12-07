import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

function TableHeader({ columns }) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell key={column.id} align={column.align || 'left'} sx={{ width: column.width, minWidth: column.minWidth }}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;

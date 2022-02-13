import React, { useRef, useImperativeHandle } from 'react';
import { CSS } from '../theme/stitches.config';
import {
  useTableColumnHeader,
  useTableSelectAllCheckbox
} from '@react-aria/table';
import { useToggleState } from '@react-stately/toggle';
import { StyledTableHeaderCell } from './table.styles';
import { GridNode } from '@react-types/grid';
import { TableState } from '@react-stately/table';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { useCheckbox } from '@react-aria/checkbox';
import Checkbox, { CheckboxProps } from '../checkbox';
import { VisuallyHidden } from '@react-aria/visually-hidden';

interface Props<T> {
  column: GridNode<T>;
  state: TableState<T>;
  as?: keyof JSX.IntrinsicElements;
}

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props<any>>;

export type TableSelectAllCheckboxProps<T = unknown> = Props<T> &
  NativeAttrs & { css?: CSS };

const TableSelectAllCheckbox = React.forwardRef<
  HTMLTableCellElement,
  TableSelectAllCheckboxProps
>(
  (
    { column, state, ...props },
    ref: React.Ref<HTMLTableCellElement | null>
  ) => {
    const tableCellRef = useRef<HTMLTableCellElement | null>(null);

    useImperativeHandle(ref, () => tableCellRef?.current);

    const isSingleSelectionMode =
      state.selectionManager.selectionMode === 'single';

    const {
      columnHeaderProps
    }: {
      columnHeaderProps: Omit<
        React.HTMLAttributes<unknown>,
        keyof TableSelectAllCheckboxProps<unknown>
      >;
    } = useTableColumnHeader({ node: column }, state, tableCellRef);

    const { checkboxProps } = useTableSelectAllCheckbox(state);

    const { isFocusVisible, focusProps } = useFocusRing();

    const inputRef = useRef<HTMLInputElement | null>(null);

    const {
      inputProps
    }: {
      inputProps: Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        keyof CheckboxProps
      > & {
        'aria-label'?: CheckboxProps['aria-label'];
      };
    } = useCheckbox(checkboxProps, useToggleState(checkboxProps), inputRef);

    return (
      <StyledTableHeaderCell
        {...mergeProps(columnHeaderProps, focusProps, props)}
        isFocusVisible={isFocusVisible}
        ref={tableCellRef}
      >
        {isSingleSelectionMode ? (
          <VisuallyHidden>{inputProps['aria-label']}</VisuallyHidden>
        ) : (
          <input {...inputProps} ref={inputRef} />
        )}
      </StyledTableHeaderCell>
    );
  }
);

TableSelectAllCheckbox.displayName = 'NextUI - TableSelectAllCheckbox';

TableSelectAllCheckbox.toString = () => '.nextui-table-select-all-checkbox';

export default TableSelectAllCheckbox;
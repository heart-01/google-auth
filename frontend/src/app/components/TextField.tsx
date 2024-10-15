import { Ref, MouseEvent } from 'react';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ErrorIcon from '@mui/icons-material/Error';

export type BaseTextFieldProp = TextFieldProps & {
  hasEndIcon?: boolean;
  endIcon?: JSX.Element | null;
  endIconColor?: string;
  startIcon?: JSX.Element | null;
  startIconColor?: string;
  readOnly?: boolean;
  backgroundColor?: string;
  onClickEndButton?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  innerRef?: Ref<HTMLDivElement>;
};

function BaseTextField({
  hasEndIcon = false,
  endIcon = null,
  startIcon = null,
  readOnly = false,
  backgroundColor = '#ffffff',
  onClickEndButton,
  placeholder,
  error,
  disabled,
  helperText = ' ',
  value = '',
  InputProps,
  sx,
  innerRef,
  ...defaultProps
}: BaseTextFieldProp) {
  const showStartIcon = () => {
    if (!startIcon) {
      return null;
    }
    return <InputAdornment position="start">{startIcon}</InputAdornment>;
  };
  const showEndIcon = () => {
    if (hasEndIcon || endIcon) {
      if (!endIcon && error) {
        return (
          <InputAdornment position="end">
            <ErrorIcon sx={{ color: '#db3636' }} />
          </InputAdornment>
        );
      }
      return (
        <InputAdornment position="end">
          <IconButton onClick={onClickEndButton} disabled={disabled}>
            {endIcon || <CancelOutlinedIcon />}
          </IconButton>
        </InputAdornment>
      );
    }
    return null;
  };
  return (
    <TextField
      {...defaultProps}
      ref={innerRef}
      InputLabelProps={{ shrink: placeholder ? true : undefined }}
      InputProps={{
        ...InputProps,
        sx: { backgroundColor: backgroundColor },
        startAdornment: showStartIcon(),
        endAdornment: InputProps?.endAdornment || showEndIcon(),
        readOnly,
      }}
      error={error}
      disabled={disabled}
      placeholder={placeholder}
      helperText={helperText ?? ' '}
      value={value ?? ''}
      sx={{
        ...sx,
        pr: 0,
      }}
    />
  );
}

export default BaseTextField;
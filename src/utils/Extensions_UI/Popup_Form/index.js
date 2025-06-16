'use client';

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

export default function Popup_Form({ button, title, fields, onSave, isLoading = false }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Khởi tạo formData với defaultValue khi component mount hoặc fields thay đổi
  useEffect(() => {
    const initialData = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.name] = field.defaultValue;
      } else if (field.type === 'checkbox') {
        initialData[field.name] = {};
        field.options.forEach(option => {
          initialData[field.name][option.value] = false;
        });
      } else {
        initialData[field.name] = '';
      }
    });
    setFormData(initialData);
  }, [fields]);

  // Toggle dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => !isLoading && setOpen(false);

  // Xử lý khi lưu
  const handleSave = () => {
    const newErrors = {};

    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name];
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (typeof value === 'object' && Object.keys(value).length === 0)
        ) {
          newErrors[field.name] = `${field.label} là trường bắt buộc`;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Không thực hiện lưu nếu có lỗi
    }

    // Nếu không có lỗi, gọi hàm onSave và đóng popup
    if (onSave) onSave(formData);
    setOpen(false);
  };

  // Xử lý thay đổi input
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Xử lý thay đổi checkbox
  const handleCheckboxChange = (groupName, optionValue, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: {
        ...prev[groupName],
        [optionValue]: isChecked,
      },
    }));

    if (errors[groupName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[groupName];
        return newErrors;
      });
    }
  };

  return (
    <>
      <div onClick={handleOpen} style={{ width: '100%', height: '100%' }} className='flexCenter'>
        {button}
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{ maxHeight: '100vh' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>{title}</Box>
          <Box sx={{ flex: 1, overflow: 'hidden', overflowY: 'auto', p: 2 }} className="Wrap_Scroll">
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              fields.map((field, index) => {
                // Kiểm tra điều kiện hiển thị
                if (field.conditional) {
                  const dependentValue = field.conditional.dependsOn
                    .split('.')
                    .reduce((acc, key) => acc?.[key], formData); // Truy cập giá trị phụ thuộc trong formData
                  if (dependentValue !== field.conditional.value) {
                    return null; // Không hiển thị nếu điều kiện không khớp
                  }
                }

                if (field.type === 'input') {
                  return (
                    <TextField
                      size='small'
                      key={index}
                      label={field.label}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      fullWidth
                      sx={{ m: '8px 0' }}
                      error={Boolean(errors[field.name])}
                      helperText={errors[field.name] || ''}
                      required={field.required}
                    />
                  );
                }

                if (field.type === 'textarea') {
                  return (
                    <TextField
                      key={index}
                      label={field.label}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      fullWidth
                      margin="normal"
                      multiline
                      rows={field.rows || 4}
                      error={Boolean(errors[field.name])}
                      helperText={errors[field.name] || ''}
                      required={field.required}
                    />
                  );
                }

                if (field.type === 'select') {
                  return (
                    <Box key={index} sx={{ padding: '8px 0' }}>
                      <Select
                        size='small'
                        label={field.label}
                        value={formData[field.name] || ''}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        fullWidth
                        displayEmpty
                        error={Boolean(errors[field.name])}
                      >
                        <MenuItem value="" disabled>
                          {field.label}
                        </MenuItem>
                        {field.options.map((option, idx) => (
                          <MenuItem key={idx} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors[field.name] && (
                        <Box sx={{ color: 'error.main', mt: 0.5, fontSize: '0.75rem' }}>
                          {errors[field.name]}
                        </Box>
                      )}
                    </Box>
                  );
                }

                if (field.type === 'checkbox') {
                  return (
                    <Box key={index} sx={{ marginBottom: 2 }}>
                      <Box sx={{ marginBottom: 1 }}>{field.label}</Box>
                      <FormGroup row={field.horizontal}>
                        {field.options.map((option, idx) => (
                          <FormControlLabel
                            key={idx}
                            control={
                              <Checkbox
                                checked={
                                  formData[field.name]?.[option.value] || false
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    field.name,
                                    option.value,
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label={option.label}
                          />
                        ))}
                      </FormGroup>
                      {errors[field.name] && (
                        <Box sx={{ color: 'error.main', mt: 0.5, fontSize: '0.75rem' }}>
                          {errors[field.name]}
                        </Box>
                      )}
                    </Box>
                  );
                }

                if (field.type === 'radio') {
                  return (
                    <Box key={index} sx={{ marginBottom: 2 }}>
                      <Box sx={{ marginBottom: 1 }}>{field.label}</Box>
                      <RadioGroup
                        row={field.horizontal}
                        value={formData[field.name] || ''}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                      >
                        {field.options.map((option, idx) => (
                          <FormControlLabel
                            key={idx}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}
                          />
                        ))}
                      </RadioGroup>
                      {errors[field.name] && (
                        <Box sx={{ color: 'error.main', mt: 0.5, fontSize: '0.75rem' }}>
                          {errors[field.name]}
                        </Box>
                      )}
                    </Box>
                  );
                }

                if (field.type === 'date') {
                  return (
                    <TextField
                      key={index}
                      type="date"
                      size='small'
                      label={field.label}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={Boolean(errors[field.name])}
                      helperText={errors[field.name] || ''}
                      required={field.required}
                    />
                  );
                }
                return null;
              })
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'end', p: 2, py: 1, borderTop: 'thin solid var(--background_1)', gap: 1 }}>
            <Button onClick={handleClose} disabled={isLoading}>Thoát</Button>
            <Button onClick={!isLoading ? handleSave : null} disabled={isLoading}>Lưu</Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

Popup_Form.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf([
        'input',
        'textarea',
        'select',
        'checkbox',
        'radio',
        'date',
      ]).isRequired,
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        })
      ),
      rows: PropTypes.number,
      horizontal: PropTypes.bool,
      conditional: PropTypes.shape({
        dependsOn: PropTypes.string,
        value: PropTypes.any,
      }),
      required: PropTypes.bool, // Thuộc tính mới
      defaultValue: PropTypes.any, // Thuộc tính mới
    })
  ).isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

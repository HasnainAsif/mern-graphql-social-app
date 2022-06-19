import { useState } from 'react';

export const useForm = (callback, initialState = {}) => {
  const [formData, setFormData] = useState(initialState);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  return {
    onChange,
    onSubmit,
    formData,
  };
};

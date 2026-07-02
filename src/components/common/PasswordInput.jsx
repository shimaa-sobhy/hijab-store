import React, { useState } from 'react';

export default function PasswordInput({
  value,
  onChange,
  placeholder = '',
  required = false,
  minLength,
  name,
  className = '',
  autoComplete,
  style,
  ...rest
}) {
  const [visible, setVisible] = useState(false);
  const show = visible;

  return (
    <div className="password-input">
      <input
        type={show ? 'text' : 'password'}
        className={`form-control password-input__field ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        name={name}
        autoComplete={autoComplete}
        style={style}
        {...rest}
      />
      <button
        type="button"
        className="password-input__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
      </button>
    </div>
  );
}

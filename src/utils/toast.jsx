import React from 'react';
import { toast as t } from 'react-toastify';

function CompactToast({ type, title, message }) {
  return (
    <div className="ds-toast__body">
      <div className="ds-toast__content">
        <span className="ds-toast__title">{title}</span>
        <span className="ds-toast__msg">{message}</span>
      </div>
    </div>
  );
}

export const toast = {
  success: (message, title) =>
    t.success(<CompactToast type="success" title={title || 'Success'} message={message} />, { icon: false, autoClose: 2000 }),
  error: (message, title) =>
    t.error(<CompactToast type="error" title={title || 'Error'} message={message} />, { icon: false, autoClose: 2000 }),
  info: (message, title) =>
    t.info(<CompactToast type="info" title={title || 'Notice'} message={message} />, { icon: false, autoClose: 2000 }),
};

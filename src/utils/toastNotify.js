import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifyError = msg =>
  toast.error(`${msg}`, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });

export const notifySuccess = msg =>
  toast.success(`${msg}`, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });

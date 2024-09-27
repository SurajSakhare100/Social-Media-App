import Swal from 'sweetalert2';
import './popupStyles.css'; // Import the styles for the popup

export const showPopup = (type, message) => {
  Swal.fire({
    title: type === 'success' ? 'Success!' : 'Error!',
    text: message,
    icon: type, // Automatically shows success/error icons
    position: 'top-end', // Top-right toaster style
    showConfirmButton: false, // No confirm button, auto close
    timer: 2000, // Auto-close after 3 seconds
    toast: true, // Make it look like a toast notification
    background: '#ffffff', // Light background for each type
    customClass: {
      popup: 'beautiful-popup', // Custom class for styling
    },
  });
};

export const handleSuccessPopup = (message) => {
  showPopup('success', message); // 3 seconds duration
};

export const handleErrorPopup = (message) => {
  showPopup('error', message); // 3 seconds duration
};

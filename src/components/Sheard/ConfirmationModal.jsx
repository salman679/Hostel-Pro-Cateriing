import Swal from "sweetalert2";

/**
 * Reusable Confirmation Modal Component using SweetAlert2
 *
 * @param {Object} props - Component properties
 * @param {string} props.title - Modal title
 * @param {string} props.text - Modal text content
 * @param {string} props.icon - Modal icon type (success, error, warning, info, question)
 * @param {boolean} props.showCancelButton - Whether to show cancel button
 * @param {string} props.confirmButtonText - Text for confirm button
 * @param {string} props.cancelButtonText - Text for cancel button
 * @param {string} props.confirmButtonColor - Color for confirm button
 * @param {string} props.cancelButtonColor - Color for cancel button
 * @param {Function} props.onConfirm - Callback function when user confirms
 * @param {Function} props.onCancel - Callback function when user cancels
 * @param {Object} props.customSwalOptions - Additional custom SweetAlert2 options
 */
const ConfirmationModal = ({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  icon = "warning",
  showCancelButton = true,
  confirmButtonText = "Yes, confirm it!",
  cancelButtonText = "Cancel",
  confirmButtonColor = "#22c55e",
  cancelButtonColor = "#d33",
  onConfirm = null,
  onCancel = null,
  customSwalOptions = {},
}) => {
  const showModal = () => {
    Swal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor,
      cancelButtonColor,
      ...customSwalOptions,
    }).then((result) => {
      if (result.isConfirmed) {
        if (onConfirm) onConfirm(result);
      } else if (result.isDismissed && onCancel) {
        onCancel(result);
      }
    });
  };

  return showModal;
};

export { ConfirmationModal };

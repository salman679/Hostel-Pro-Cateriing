import Swal from "sweetalert2";

/**
 * Show a simple alert using SweetAlert2
 *
 * @param {Object} options - Alert options
 * @param {string} options.title - Alert title
 * @param {string} options.text - Alert text content
 * @param {string} options.icon - Alert icon type (success, error, warning, info, question)
 */
export const showAlert = ({
  title = "Success!",
  text = "Your meal has been deleted.",
  icon = "success",
}) => {
  Swal.fire({
    title,
    text,
    icon,
  });
};

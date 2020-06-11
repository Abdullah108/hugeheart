import Swal from "sweetalert2";
export const ConfirmBox = async obj => {
  if (!obj) {
    obj = {};
  }
  return await Swal.fire({
    title: "Are you sure?",
    text: "You want to be able to revert this!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes!",
    ...obj
  });
};

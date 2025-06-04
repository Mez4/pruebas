import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const SwalLoading = (title: string, msg: string) => {
  const MySwal = withReactContent(Swal);

  return MySwal.fire({
    icon: "info",
    title: title,
    html: `
      <div class="modal-body">
        <div class="row text-center">
          <h4>${msg}</h4>
          <br />
          <h4><strong>Por favor espere...</strong></h4>
        </div>
      </div>
    `,
    timerProgressBar: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: "Ok",
    didOpen: () => {
      MySwal.showLoading();
    },
  });
};

export default SwalLoading;

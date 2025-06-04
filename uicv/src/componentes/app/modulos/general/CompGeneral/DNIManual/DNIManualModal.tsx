import { useState } from "react";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import CForm from "./CForm";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";

type DNIModalType = {
  oidc: IOidc;
  SucursalID: number;
  ProductoID: number;
  CajaID: number;
  CuentaID: number;
  Dif_Pago: number;
  DistribuidorId: number;
  optCuentasBancarias: { value: number; label: string }[];
};

export default function DNIManualModal(props: DNIModalType) {
  const [ShowModal, setShowModal] = useState(false);
  const FNShowModal = () => setShowModal(!ShowModal);

  return (
    <>
      <ModalWin open={ShowModal} center large scrollable>
        <ModalWin.Header>
          <h5 className={MODAL_TITLE_CLASS}>Agregar DNI Manual</h5>
        </ModalWin.Header>
        <ModalWin.Body style={{ overflowY: "unset" }}>
          <CForm
            initialValues={{
              Dif_Pago: props.Dif_Pago,
              DistribuidorId: props.DistribuidorId ?? 0,
              Referencia: "",
            }}
            FNShowModal={FNShowModal}
            CajaID={props.CajaID}
            CuentaID={props.CuentaID}
            SucursalID={props.SucursalID}
            ProductoID={props.ProductoID}
            oidc={props.oidc}
            optCuentasBancarias={props.optCuentasBancarias}
          />
        </ModalWin.Body>
      </ModalWin>
      <button
        type="button"
        className="btn btn-info waves-effect waves-light mr-2"
        onClick={FNShowModal}
      >
        DNI Manual
      </button>
    </>
  );
}

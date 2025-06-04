import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomFieldText, Spinner, CustomSelect } from "../../../../../global";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import * as Funciones from "../MultiSaldos/Funciones";
import { valueContainerCSS } from "react-select/src/components/containers";
import { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import { valueEventAriaMessage } from "react-select/src/accessibility";
import { toast } from "react-toastify";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import DataTable from "react-data-table-component";
import { FaCheckSquare, FaRegSquare, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ListCheckBox } from "../../../../../global/ListCheckBox";
import Swal2 from "sweetalert2";
import withReactContent2 from "sweetalert2-react-content";
type CFormType = {
  Seguridad: IOidc;
  Id?: number;
  periodoId?: number;
  nombreBalance: string;
  optionsPeriodo?: any;
  initialValues: {
    incMovs: number;
    incDetalle: number;
  };

  isMounted: boolean;
  cerrarSwal(): any;
  cerrarSwal2(): any;
  balances: any;
  masBalances: boolean;
  MultiSaldoID: number;
  setCheckbox(masBalances: boolean): any;
};

export const CForm = (props: CFormType) => {
  const MySwal2 = withReactContent2(Swal2);
  const [state, setState] = React.useState({
    opPeriodos2: [
      { value: 0, label: "Periodo 1", disabled: false, checked: false },
    ],
    mostrarMasBalances: false,
  });

  const [loading, setLoading] = React.useState(false);

  const MultiselectCheckbox = ({ options, onChange }) => {
    const [data, setData] = React.useState(options);
    const toggle = (index) => {
      const newData = [...data];
      newData.splice(index, 1, {
        label: data[index].label,
        checked: !data[index].checked,
      });
      setData(newData);
      onChange(newData.filter((x) => x.checked));
      props.setCheckbox(index);
    };

    return (
      <>
        {props.balances.map((item, index) => (
          <div className="column text-center is-half-desktop">
            <div
              className="form-check form-switch form-switch-md mb-3"
              dir="ltr"
            >
              <label key={item.label}>
                <input
                  className="form-check-input"
                  disabled={item.disabled}
                  readOnly
                  type="checkbox"
                  checked={item.checked || false}
                  onClick={() => toggle(index)}
                />
                {item.label}
              </label>
            </div>
          </div>
        ))}
      </>
    );
  };
  const ImprimirMSaldos = (MultiSaldoID: number) => {
    setLoading(true);
    Funciones.FNPrintPDF(props.Seguridad, {
      MultiSaldoID: MultiSaldoID,
    })
      .then((pdf: any) => {
        const file = new Blob([pdf], { type: "application/pdf" });
        // const fileURL = URL.createObjectURL(file);
        // window.open(fileURL);
        const fileURL = URL.createObjectURL(file);
        const enlaceTemporal = document.createElement("a");
        enlaceTemporal.href = fileURL;
        enlaceTemporal.target = "_blank";
        enlaceTemporal.style.display = "none";

        document.body.appendChild(enlaceTemporal);

        enlaceTemporal.click();

        setTimeout(() => {
          // Imprimir el documento
          // window.print();
        }, 1000);
        setLoading(false);
        props.cerrarSwal2();
      })
      .catch((error: any) => {
        console.log(JSON.stringify(error));
        toast.error(
          "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
        );
        // clearFormByLevel(0)
      });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={props.initialValues}
      validationSchema={Yup.object().shape({})}
      onSubmit={(values: any, { resetForm }) => {
        ImprimirMSaldos(props.MultiSaldoID);
      }}
    >
      <Form>
        <div>
          <div></div>
          <div className="columns is-centered is-mobile is-multiline">
            {MultiselectCheckbox({
              options: props.balances,
              onChange: (values) => {
                console.log(values);
              },
            })}
          </div>
          {loading && <Spinner />}
          {!loading && (
            <div className="text-end">
              <button
                type="submit"
                className="ms-2 btn btn-success waves-effect waves-light"
              >
                Ok
              </button>
            </div>
          )}
        </div>
      </Form>
    </Formik>
  );
};

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Spinner,
  DatePickeStart,
  DatePickeEnd,
  ActionSelect,
  CustomFieldText,
} from "../../../../../global";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import * as Funciones from "./Funciones";
import { toast } from "react-toastify";
import {
  Sucursales,
  Distribuidores,
  Clientes,
} from "../../../../../selectores";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import moment from "moment";
import { DescripcionDistribuidor } from "../../../../../../global/variables";

// Icons
import { FiRefreshCcw } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import { iUI } from "../../../../../../interfaces/ui/iUI";

registerLocale("es", es);

type CFormType = {
  oidc: IOidc;
  ui: iUI;
  initialValues: {
    GestorID: number;
  };
  estatusMovimientoOpt: { value: number; label: string }[];
  cbRespuesta(item: any): any;
};

export const AdministrarTicket = (props: CFormType) => {
  const [loading, setLoading] = useState(false);


  return (
    <Formik
      initialValues={props.initialValues}
      validationSchema={Yup.object().shape({
        GestorID:       Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio"),
      })}
      onSubmit={(values: any) => {
        setLoading(true);
        Funciones.FNGetAdministraTickets(props.oidc, {
          ...values
        })
          .then((respuesta: any) => {
            props.cbRespuesta(respuesta);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            toast.error("Error al consultar, vuelva a intentarlo");
          });
      }}
    >
      {({ values }) => (
        <Form>
          <div
            style={{
              backgroundColor: "#F7F7F7",
              padding: "1em",
              borderRadius: "15px",
            }}
          >
            <div>
              <div style={{ float: "left" }}>
                <FaFilter />
              </div>
              <div>
                <label> FILTROS</label>
              </div>
            </div>
            <div style={{ width: "100%", textAlign: "center" }}>
              <div style={{ display: "inline-block", width: "100%" }}>
                <div className="columns is-desktop is-tablet">
                <div className="column is-one-third">
                <CustomFieldText
                    disabled={loading}
                    label="GestorID"
                    name="GestorID"
                    placeholder="Ingrese GestorID"
                />
                </div>
                 
                </div>
              </div>
            </div>
          </div>
          {loading && <Spinner />}
          {!loading && (
            <div className="text-end">
              <br />
              <button
                disabled={loading}
                type="submit"
                className="ms-2 btn btn-primary waves-effect waves-light"
              >
                <span className="is-hidden-touch">Buscar</span>&nbsp;
                <FiRefreshCcw />
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Spinner,
  DatePickeStart,
  DatePickeEnd,
  ActionSelect,
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
    ProductoID: number;
    SucursalID: number;
    DistribuidorID: number;
    Activo: boolean;
    FechaInicio: Date;
    FechaFin: Date;
  };
  estatusMovimientoOpt: { value: number; label: string }[];
  cbRespuesta(item: any): any;
};

export const AplicacionesDNI = (props: CFormType) => {
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(
    moment(props.initialValues.FechaInicio).toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());

  return (
    <Formik
      initialValues={props.initialValues}
      validationSchema={Yup.object().shape({
        FechaInicio: Yup.string().required("Seleccione la fecha inicial"),
        FechaFin: Yup.string().required("Seleccione la fecha final"),
      })}
      onSubmit={(values: any) => {
        setLoading(true);
        Funciones.FNGetAplicacionesDNI(props.oidc, {
          ...values,
          SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
          EstatusMovimiento: isNaN(values.EstatusMovimiento)
            ? 0
            : values.EstatusMovimiento,
          DistribuidorID: isNaN(values.DistribuidorID)
            ? 0
            : values.DistribuidorID,
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
                  <div className="column is-12-mobile is-12-tablet is-3-desktop">
                    <Sucursales
                      disabled={loading}
                      name={"SucursalID"}
                      ProductoID={
                        isNaN(values.ProductoID) ? 0 : values.ProductoID
                      }
                      valor={values.SucursalID}
                    />
                  </div>
                  <div className="column is-12-mobile is-12-tablet is-3-desktop">
                    <Distribuidores
                      disabled={loading}
                      WithProducto
                      SucursalID={
                        isNaN(values.SucursalID) ? 0 : values.SucursalID
                      }
                      name={"DistribuidorID"}
                      label={`${DescripcionDistribuidor(1)}`}
                    />
                  </div>
                  <div className="column is-12-mobile is-12-tablet is-3-desktop">
                    <DatePickeStart
                      name={"FechaInicio"}
                      label={"Fecha Inicial"}
                      disabled={loading}
                      placeholder={"Inicio"}
                      isClearable
                      startDate={startDate}
                      endDate={endDate}
                      setStartDate={setStartDate}
                    />
                  </div>
                  <div className="column is-12-mobile is-12-tablet is-3-desktop">
                    <DatePickeEnd
                      name={"FechaFin"}
                      label={"Fecha Final"}
                      disabled={loading}
                      placeholder={"Final"}
                      isClearable
                      startDate={startDate}
                      endDate={endDate}
                      setEndDate={setEndDate}
                    />
                  </div>
                </div>
                <div className="columns is-desktop is-tablet">
                  <div className="column is-12-mobile is-12-tablet is-3-desktop">
                    <ActionSelect
                      disabled={loading}
                      label="Estatus"
                      name="EstatusMovimiento"
                      placeholder="Todos"
                      options={props.estatusMovimientoOpt}
                      addDefault={true}
                      valor={0}
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

import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Spinner,
  CustomSelect,
  ActionSelect,
  DatePickeStart,
  DatePickeEnd,
} from "../../../../../global";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import * as Funciones from "./Funciones";
import { toast } from "react-toastify";
import {
  Productos,
  Sucursales,
  Zonas,
  EstatusCredito,
  Distribuidores,
  Coordinadores,
  Clientes,
} from "../../../../../selectores";
import DatePicker, { registerLocale } from "react-datepicker";
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
    ClienteID: number;
    SucursalID: number;
    DistribuidorID: number;
    Activo: boolean;
    FechaInicio: Date;
    FechaFin: Date;
  };
  cbRespuesta(item: any): any;
};

export const Aplicaciones = (props: CFormType) => {
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(
    moment(props.initialValues.FechaInicio).toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());

  return (
    <Formik
      initialValues={props.initialValues}
      // enableReinitialize
      validationSchema={Yup.object().shape({
        // SucursalID: Yup.array().min(1, 'Seleccione al menos una Sucursal'),
        // ZonaID: Yup.array().min(1, 'Seleccione al menos una Zona'),
        // EmpresaID: Yup.array().min(1, 'Seleccione al menos una Empresa'),
        // ClienteID: Yup.number().required("Seleccione el cliente").moreThan(0, 'Seleccione el cliente'),
        // DistribuidorID: Yup.number().required("Seleccione el Socia").moreThan(0, 'Seleccione el Socia'),
        // CoordinadorID: Yup.number().required("Seleccione el Coordinador").moreThan(0, 'Seleccione el Coordinador'),
        // DistribuidorNivelID: Yup.number().required("Seleccione el Nivel Socia").moreThan(0, 'Seleccione el Nivel Socia'),
        // ContratoID: Yup.number().required("Seleccione el Contrato").moreThan(0, 'Seleccione el Contrato'),
        // ProductoID: Yup.number().required("Seleccione el Producto").moreThan(0, 'Seleccione el Producto'),
        FechaInicio: Yup.string().required("Seleccione la fecha inicial"),
        FechaFin: Yup.string().required("Seleccione la fecha final"),
      })}
      onSubmit={(values: any) => {
        // console.log('Entra al submit', values)
        setLoading(true);
        Funciones.FNGetAplicaciones(props.oidc, {
          ...values,
          // ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID,
          ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
          SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
          DistribuidorID: isNaN(values.DistribuidorID)
            ? 0
            : values.DistribuidorID,
          // FechaInicio: moment(values.FechaInicio).format('YYYY-MM-DD'),
          // FechaFin: moment(values.FechaFin).format('YYYY-MM-DD'),
        })
          .then((respuesta: any) => {
            console.log("respuesta: ", respuesta);
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
                  {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Productos oidc={props.oidc} isSingle disabled={loading} name={'ProductoID'} valor={values.ProductoID} ui={props.ui} />
                                    </div> */}
                  <div className="column is-12-mobile is-12-tablet is-4-desktop">
                    <Sucursales
                      disabled={loading}
                      name={"SucursalID"}
                      ProductoID={
                        isNaN(values.ProductoID) ? 0 : values.ProductoID
                      }
                      valor={values.SucursalID}
                    />
                  </div>
                  {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Coordinadores disabled={loading} SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} name={'CoordinadorID'} valor={values.CoordinadorID} />
                                    </div> */}
                  <div className="column is-12-mobile is-12-tablet is-4-desktop">
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
                  <div className="column is-12-mobile is-12-tablet is-4-desktop">
                    <Clientes
                      disabled={loading}
                      DistribuidorID={values.DistribuidorID}
                      name={"ClienteID"}
                    />
                  </div>
                </div>
                <div className="columns is-desktop is-tablet">
                  <div className="column is-12-mobile is-12-tablet is-4-desktop">
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
                  <div className="column is-12-mobile is-12-tablet is-4-desktop">
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
                  <div className="column is-12-mobile is-12-tablet is-4-desktop">
                    <br />
                    <CustomFieldCheckbox
                      disabled={loading}
                      label="Activo"
                      name="Activo"
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
                className="ms-2 btn btn-primary waves-effect waves-light" //onClick={() => { }}
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

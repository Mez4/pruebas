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
import * as FnCreditoAplicaciones from "../CreditoAplicaciones/Funciones";
import * as FnAplicacionesCajera from "../AplicacionesCajera/Funciones";
import * as FnAplicaciones from "./Funciones";
import { toast } from "react-toastify";
import {
  Sucursales,
  Distribuidores,
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
type EstadoTipo = {};

export const Aplicaciones = (props: CFormType) => {
  let isMounted = React.useRef(true);
  const [state, setState] = useState({
    optSucursal: [],
    cargando: true,
  });
  const [startDate, setStartDate] = useState(moment().add(-1, "d").toDate());
  const [endDate, setEndDate] = useState(moment().toDate());

  const FNGetSucursales = () => {
    setState((s) => ({ ...s, cargando: true }));

    FnAplicacionesCajera.getSucursales(props.oidc)
      .then((respuesta: any) => {
        var Sucursal = respuesta.map((valor: any) => {
          var obj = { value: valor.SucursalID, label: valor.Nombre };
          return obj;
        });

        setState((s) => ({ ...s, optSucursal: Sucursal, cargando: false }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optSucursal: [], cargando: false }));
      });
  };

  React.useEffect(() => {
    if (isMounted.current === true) {
      FNGetSucursales();
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Formik
      initialValues={props.initialValues}
      // enableReinitialize
      validationSchema={Yup.object().shape({
        SucursalID: Yup.number().required('Seleccione al menos una Sucursal'),
        // ZonaID: Yup.array().min(1, 'Seleccione al menos una Zona'),
        // EmpresaID: Yup.array().min(1, 'Seleccione al menos una Empresa'),
        ClienteID: Yup.number().required("Seleccione el cliente").moreThan(0, 'Seleccione el cliente'),
        // DistribuidorID: Yup.number().required("Seleccione el Socia").moreThan(0, 'Seleccione el Socia'),
        // CoordinadorID: Yup.number().required("Seleccione el Coordinador").moreThan(0, 'Seleccione el Coordinador'),
        // DistribuidorNivelID: Yup.number().required("Seleccione el Nivel Socia").moreThan(0, 'Seleccione el Nivel Socia'),
        // ContratoID: Yup.number().required("Seleccione el Contrato").moreThan(0, 'Seleccione el Contrato'),
        // ProductoID: Yup.number().required("Seleccione el Producto").moreThan(0, 'Seleccione el Producto'),
        // FechaInicio: Yup.string().required("Seleccione la fecha inicial"),
        // FechaFin: Yup.string().required("Seleccione la fecha final"),
      })}
      onSubmit={(values: any) => {
        // console.log('Entra al submit', values)
        setState((s) => ({ ...s, cargando: true }));

        if (values.ClienteID === 0) {
          toast.error('Seleccione un cliente')
          setState((s) => ({ ...s, cargando: false }));
          return;
        }

        FnAplicaciones.getAplicacionesCliente(props.oidc, values.ClienteID)
          .then((respuesta: any) => {
            props.cbRespuesta(respuesta);
            setState((s) => ({ ...s, cargando: false }));
          })
          .catch(() => {
            setState((s) => ({ ...s, cargando: false }));
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
            <div style={{ width: "100%" }}>
              <div style={{ display: 'inline-block' }}>
                <div className="columns">
                  <div className="column is-12-mobile is-12-tablet is-4-desktop">
                    <ActionSelect
                      disabled={state.cargando}
                      label="Caja"
                      name="SucursalID"
                      placeholder="Seleccione un caja"
                      options={state.optSucursal}
                      addDefault={false}
                      valor={values.SucursalID}
                    />
                  </div>
                  <div className="column is-12-mobile is-12-tablet is-4-desktop">
                    <Distribuidores
                      disabled={state.cargando}
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
                      disabled={state.cargando}
                      DistribuidorID={values.DistribuidorID}
                      name={"ClienteID"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {state.cargando && <Spinner />}
          {!state.cargando && (
            <div className="text-end">
              <br />
              <button
                disabled={state.cargando}
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

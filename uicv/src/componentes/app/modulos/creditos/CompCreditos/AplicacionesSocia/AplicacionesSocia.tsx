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
import * as FnAplicacionesSocias from "./Funciones";
import * as FnAplicacionesCajera from "../AplicacionesCajera/Funciones";
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
    SucursalID: number;
    DistribuidorID: number;
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
      validationSchema={Yup.object().shape({
        SucursalID: Yup.number().required("Seleccione al menos una Sucursal"),
      })}
      onSubmit={(values: any) => {
        setState((s) => ({ ...s, cargando: true }));

        if (values.SucursalID === 0) {
          toast.error("Seleccione al menos una Caja");
          setState((s) => ({ ...s, cargando: false }));
          return;
        }

        FnAplicacionesSocias.FNGetAplicacionesSocia(props.oidc, {
          ...values,
          SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
          DistribuidorID: isNaN(values.DistribuidorID) ? 0: values.DistribuidorID,
        })
          .then((respuesta: any) => {
            console.log("respuesta: ", respuesta);
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
              <div style={{ display: "inline-block", width: "100%" }}>
                <div className="columns is-desktop is-tablet">
                  <div className="column is-12-mobile is-12-tablet is-6-desktop">
                    <ActionSelect
                      disabled={state.cargando}
                      label="Caja"
                      name="SucursalID"
                      placeholder=""
                      options={state.optSucursal}
                      addDefault={false}
                      valor={values.SucursalID}
                    />
                  </div>
                  <div className="column is-12-mobile is-12-tablet is-6-desktop">
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

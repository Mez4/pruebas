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
  Cajas,
  Creditos,
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
import { DBConfia_General } from "../../../../../../interfaces_db/DBConfia/General";

registerLocale("es", es);

type CFormType = {
  oidc: IOidc;
  ui: iUI;
  initialValues: {
    CreditoID: number;
    ProductoID: number;
    ClienteID: number;
    SucursalID: number;
    CajaID: number;
    ZonaID: number;
    EmpresaID: number;
    DistribuidorID: number;
    CoordinadorID: number;
    ContratoID: number;
    EstatusID: string;
    DistribuidorNivelID: number;
    FechaInicio: Date;
    FechaFin: Date;
  };
  cbRespuesta(item: any, CreditoID: number): any;
  Sucursal?: DBConfia_General.ISucursales;
};

export const BuscarCreditos = (props: CFormType) => {
  const [loading, setLoading] = useState(false);
  const [isMounted, setisMounted] = useState(false);
  const [startDate, setStartDate] = useState(moment().add(-1, "d").toDate());
  const [endDate, setEndDate] = useState(moment().toDate());

  const fijarFechaInicio = (date: any) => {
    setStartDate(date);
  };

  const fijarFechaFinal = (date: any) => {
    setEndDate(date);
  };

  useEffect(() => {
    // return () => {
    setisMounted(true);
    // }
  }, []);

  return (
    <Formik
      initialValues={props.initialValues}
      // enableReinitialize
    //   validationSchema={Yup.object().shape({
       
    //     FechaInicio: Yup.string().required("Seleccione la fecha inicial"),
    //     FechaFin: Yup.string().required("Seleccione la fecha final"),
    //   })}
      onSubmit={(values: any) => {
        // console.log('values: ', values)

        let CreditoID =
          values.CreditoID == null
            ? 0
            : isNaN(values.CreditoID.value)
            ? 0
            : values.CreditoID.value;

        let filtros =
          CreditoID > 0
            ? {
                CreditoID,
                ClienteID: 0,
              }
            : {
                ...values,
                CreditoID,
                ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID
              };
        
        if(CreditoID > 0 || values.ClienteID > 0)
        {
            setLoading(true);
            Funciones.FNgetbyfiltros(props.oidc, filtros)
            .then((respuesta: any) => {
                props.cbRespuesta(respuesta, CreditoID);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                toast.error("Error al consultar, vuelva a intentarlo");
            });
        }
        else
        {
            toast.warning("Ingrese el crédito o cliente que desea buscar");
        }
        
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
                  <div className="column is-12-mobile is-12-tablet is-6-desktop">
                    <Creditos
                      oidc={props.oidc}
                      disabled={loading}
                      name="CreditoID"
                      valor={values.CreditoID}
                      cargar={isMounted}
                      Datos={{ ...values, CreditoID: 0 }}
                    />
                  </div>
                  <div className="column is-12-mobile is-12-tablet is-6-desktop">
                    <Clientes
                      disabled={loading}
                      DistribuidorID={values.DistribuidorID}
                      name={"ClienteID"}
                    />
                  </div>
                  {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                    <Productos
                      oidc={props.oidc}
                      isSingle
                      disabled={loading}
                      name={"ProductoID"}
                      valor={values.ProductoID}
                      ui={props.ui}
                    />
                  </div> */}
                  {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                    <Sucursales
                      disabled={loading}
                      name={"SucursalID"}
                      ProductoID={
                        isNaN(values.ProductoID) ? 0 : values.ProductoID
                      }
                      valor={values.SucursalID}
                      Permiso
                    />
                  </div> */}
                  {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                    <Cajas
                      oidc={props.oidc}
                      name="CajaID"
                      SucursalId={values.SucursalID}
                      disabled={loading}
                    />
                  </div> */}
                 
                </div>
                {/* <div className="columns is-desktop is-tablet"> */}
                  {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                    <Distribuidores
                      disabled={loading}
                      WithProducto
                      SucursalID={
                        isNaN(values.SucursalID) ? 0 : values.SucursalID
                      }
                      name={"DistribuidorID"}
                      label={`${DescripcionDistribuidor(1)}`}
                    />
                  </div> */}
                  {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                    <Clientes
                      disabled={loading}
                      DistribuidorID={values.DistribuidorID}
                      name={"ClienteID"}
                    />
                  </div> */}
                  {/* <div className="column is-12-mobile is-12-tablet is-2-desktop">
                    <EstatusCredito
                      disabled={loading}
                      name={"EstatusID"}
                      valor={values.EstatusID}
                    />
                  </div> */}
                  {/* <div className="column is-12-mobile is-12-tablet is-2-desktop">
                    <DatePickeStart
                      name={"FechaInicio"}
                      label={"Fecha Inicial"}
                      disabled={loading}
                      placeholder={"Inicio"}
                      isClearable
                      startDate={startDate}
                      endDate={endDate}
                      setStartDate={fijarFechaInicio}
                    />
                  </div> */}
                  {/* <div className="column is-12-mobile is-12-tablet is-2-desktop">
                    <DatePickeEnd
                      name={"FechaFin"}
                      label={"Fecha Final"}
                      disabled={loading}
                      placeholder={"Final"}
                      isClearable
                      startDate={startDate}
                      endDate={endDate}
                      setEndDate={fijarFechaFinal}
                    />
                  </div> */}
                {/* </div> */}
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
                onClick={() => {}}
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

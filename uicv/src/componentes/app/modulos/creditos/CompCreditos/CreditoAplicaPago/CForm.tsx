import React, { useRef, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Card,
  Spinner,
  CustomFieldText,
  CustomFieldText2,
  CustomFieldDatePicker,
  ActionSelect,
  ActionCreatableSelect,
  ActionMultipleSelect,
  ActionFieldText,
  ActionFieldNumberText,
  ImgViewer,
  ActionAsyncSelect,
  CardItem,
} from "../../../../../global";
import {
  BuscarDatosBancarios,
  Clientes,
  Distribuidores,
  Sucursales,
  Cuentas,
  Cajas,
} from "../../../../../selectores";
import { formatDate2, formatDate } from "../../../../../../global/functions";
import * as Funciones from "./Funciones";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import {
  FaWindowClose,
  FaShoppingCart,
  FaCloudDownloadAlt,
  FaAddressCard,
  FaStar,
} from "react-icons/fa";
import CreditoArticulos from "../CreditoArticulos";
import * as FnPersona from "../../../personas/CompAdministracion/CompPersona/Funciones";
import { PerfilPersona } from "../../../../../presentacion";
// import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiRefreshCcw } from "react-icons/fi";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
import Raspadito from "./Raspadito";
import DNIManualModal from "../../../general/CompGeneral/DNIManual/DNIManualModal";

type CFormType = {
  oidc: IOidc;
  ProductoID: number;
  initialValues: {
    DistribuidorId: number;
    SucursalId: number;
    CajaID: number;
    CuentaId: number;
    FechaPago: Date;
    Importe: number;
    GenerarDNI: boolean;
    saldoPlazo: number;
    PorcComision: number;
    PagoTotal: number;
    PagoComision: number;
    Abono: number;
    Dif_Pago: number;
    AbonoAcumulado: number;
    SldCredPersonal: number;
    CargoAdic: number;
    BonDia: number;
    SldDia: number;
    PagoMinComision: number;
    CodigoAut: string;
  };
  optSucursales: { value: number; label: string }[];
  cbActualizaDatos(item: any): any;
};

export const CForm = (props: CFormType) => {
  const [state, setState] = React.useState({
    Socia: true,
  });

  const MySwal = withReactContent(Swal);

  const [loading, setLoading] = useState(false);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formPerc = new Intl.NumberFormat("en-US", {
    style: "percent",
    // currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const [Show, setShow] = useState(true);

  // const [MovimientoID, setMovimientoID] = useState(0);
  // const refSucursal = useRef<Select>(null)
  // const refDistribuidor = useRef<Select>(null)
  // const refCliente = useRef<AsyncSelect<[], false>>(null)
  // const refCapital = useRef<CreatableSelect<{ value: string; label: string; }, false>>(null)
  // const refSerie = useRef<Select>(null)
  // const refFolio = useRef<Select>(null)
  // const refPlazos = useRef<Select>(null)
  // const refTipoDesembolso = useRef<Select>(null)

  const ActualizaSaldos = (Datos: {
    DistribuidorId: number;
    SucursalId: number;
    CuentaId: number;
    FechaPago: Date;
    Importe: number;
    GenerarDNI: boolean;
    CodigoAut: string;
  }) => {
    // console.log('Datos: ', Datos)

    if (Datos.DistribuidorId > 0 && Datos.FechaPago)
      Funciones.FNGetSaldos(props.oidc, {
        ...Datos,
        ProductoId: props.ProductoID,
        FechaPago: new Date(formatDate2(new Date(Datos.FechaPago))),
      })
        .then((respuesta: any) => {
          // console.log('respuesta: ', respuesta)
          setLoading(false);
          props.cbActualizaDatos(respuesta);
          setShow(false);
          if (respuesta.regresa == 0) {
            toast.error(respuesta.msj);
          }
        })
        .catch((error: any) => {
          // console.log(JSON.stringify(error))

          toast.error(
            "Error al recuperar los saldos, intente lo nuevamente o reportarlo a sistemas"
          );

          setLoading(false);
        });
  };

  const [ShowStore, setShowStore] = useState(false);

  return (
    <>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          DistribuidorId: Yup.number()
            .required(`Seleccione la ${DescripcionDistribuidor(1)}`)
            .moreThan(0, `Seleccione la ${DescripcionDistribuidor(1)}`),
          SucursalId: Yup.number()
            .required("Seleccione la sucursal")
            .moreThan(0, "Seleccione la sucursal"),
          CajaID: Yup.number()
            .required("Seleccione la Caja")
            .moreThan(0, "Seleccione la Caja"),
          // CuentaId: Yup.number().required(`Seleccione una cuenta`).moreThan(0, `Seleccione una cuenta`),
          FechaPago: Yup.string().required("Seleccione una fecha"), //Yup.date().required('Seleccione una fecha'),
          Importe: Yup.number()
            .required("Ingrese el Importe")
            .moreThan(0, "Ingrese el Importe"),
        })}
        onReset={(values: any) => {
          // clearFormByLevel(0)
        }}
        onSubmit={(values: any) => {
          MySwal.fire({
            title: "<strong>APLICAR PAGO</strong>",
            icon: "question",
            html: (
              <div className="text-center">
                ¿Desea pagar la cantidad de:{" "}
                {<strong>{formatter.format(values.Importe)}</strong>} al
                DistribuidorID: {<strong>{values.DistribuidorId}</strong>}?
              </div>
            ),
            showCloseButton: false,
            showCancelButton: true,
            showConfirmButton: true,
            focusConfirm: false,
            cancelButtonText: "No",
            confirmButtonText: "Si",
            confirmButtonAriaLabel: "Aceptar",
            cancelButtonAriaLabel: "",
          }).then((result) => {
            if (result.isConfirmed) {
              setLoading(true);
              console.log("DIFPAGO", values);
              Funciones.FNAdd(props.oidc, {
                ...values,
                ProductoID: props.ProductoID,
                Importe:
                  parseFloat(values.Importe),
                FechaPago: new Date(formatDate2(new Date(values.FechaPago))),
              })
                .then((respuesta: any) => {
                  if (respuesta.regresa === 1) {
                    toast.success(
                      `Se creó el movimiento de pago con el N° ${respuesta.MovimientoID}`
                    );
                    toast.info(
                      "Se está generando el comprobante, por favor espere..."
                    );

                    Funciones.FNPdf(props.oidc, {
                      MovimientoID: respuesta.MovimientoID,
                      dni: values.Dif_Pago,
                    })
                      .then((pdf: any) => {
                        const file = new Blob([pdf], {
                          type: "application/pdf",
                        });

                        console.log("pdf: ", pdf);

                        //const fileURL = URL.createObjectURL(file);

                        // window.open(fileURL);

                        var url = window.URL.createObjectURL(file);
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
                        // var anchor = document.createElement("a");
                        // anchor.download = "myfile.pdf";
                        // anchor.href = url;
                        // anchor.click();

                        setLoading(false);

                        ActualizaSaldos({ ...values, Importe: 0 });

                        // clearFormByLevel(0)
                      })
                      .catch((error: any) => {
                        console.log(JSON.stringify(error));

                        toast.error(
                          "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                        );

                        setLoading(false);

                        // clearFormByLevel(0)
                      });
                  } else {
                    setLoading(false);
                    console.log("respuesta add", respuesta.Dif_Pago);
                    toast.error(respuesta.msj);
                  }
                })
                .catch((error: any) => {
                  console.log(JSON.stringify(error));
                  setLoading(false);
                  toast.error("Error al generar el pago");
                });
            } else {
              setLoading(false);
              MySwal.fire({
                icon: "info",
                html: (
                  <div>
                    <br />
                    <h3 className="text-center">
                      <strong>Aviso</strong>
                    </h3>
                    <div className={`modal-body`}>
                      <h5 className="text-center">
                        Operación cancelada por el usuario.
                      </h5>
                    </div>
                  </div>
                ),
                confirmButtonText: `Ok`,
                confirmButtonAriaLabel: `Ok`,
                confirmButtonColor: `#3085d6`,
              });
            }
          });
        }}
      >
        {({ values }) => (
          <Form>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-3-desktop">
                {/* { isMounted &&  */}
                <ActionSelect
                  disabled //={props.isUpdate || loading}
                  label="Sucursal"
                  name="SucursalId"
                  placeholder="Seleccione la sucursal"
                  options={props.optSucursales}
                  addDefault={false}
                  valor={values.SucursalId}
                // accion={cbSucursal}
                // ref={refSucursal}
                />
                {/* } */}
              </div>
              ,{" "}
              <div className="column is-12-mobile is-12-tablet is-3-desktop">
                <Cajas
                  name="CajaID"
                  // unaLinea
                  disabled
                  // ProductoID={props.ProductoID}
                  SucursalId={values.SucursalId}
                  oidc={props.oidc}
                />
              </div>
              {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                <Sucursales disabled={loading} ProductoID={props.ProductoID} name=0{'SucursalId'} valor={values.SucursalId} />
                            </div> */}
              {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                <Cuentas ProductoID={props.ProductoID} SucursalId={values.SucursalId} name={'CuentaId'} disabled={loading} oidc={props.oidc} />
                            </div> */}
              <div className="column is-12-mobile is-12-tablet is-3-desktop">
                <Distribuidores
                  disabled={loading}
                  SucursalID={values.SucursalId}
                  name={"DistribuidorId"}
                  WithProducto
                  RequiereSuc
                  cbAccion={(val) => {
                    ActualizaSaldos({
                      ...values,
                      DistribuidorId: val,
                      Importe: 0,
                    });
                  }}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-3-desktop">
                <CustomFieldDatePicker
                  disabled
                  label={"Fecha"}
                  name={"FechaPago"}
                  placeholder={""}
                  onChange={(val) => {
                    ActualizaSaldos({ ...values, FechaPago: val, Importe: 0 });
                  }}
                />
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                {/* <div className="mb-2"> */}
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"Dif_Pago"}
                  >
                    {"Importe DNI"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(values.Dif_Pago)}
                  </label>
                </div>
                {/* </div> */}
                {/* <CustomFieldText2 disabled label={'Importe DNI'} name={'Dif_Pago'} placeholder={'0'} /> */}
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"PorcComision"}
                  >
                    {"Porc Comisión"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formPerc.format(values.PorcComision / 100)}
                  </label>
                </div>
                {/* <CustomFieldText2 disabled label={'Porcentaje Comisión'} name={'PorcComision'} placeholder={'0'} /> */}
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"AbonoAcumulado"}
                  >
                    {"Acumulado"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(values.AbonoAcumulado)}
                  </label>
                </div>
                {/* <CustomFieldText2 disabled label={'Abono Acumulado'} name={'AbonoAcumulado'} placeholder={'0'} /> */}
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"saldoPlazo"}
                  >
                    {"Saldo de Vales"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(values.saldoPlazo)}
                  </label>
                </div>
                {/* <CustomFieldText2 disabled label={'Saldo de Vales'} name={'saldoPlazo'} placeholder={'0'} /> */}
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "60%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"SldCredPersonal"}
                  >
                    {"Sld Créd Personales"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "40%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(values.SldCredPersonal)}
                  </label>
                </div>
                {/* <CustomFieldText2 disabled label={'Saldo Créditos Personales'} name={'SldCredPersonal'} placeholder={'0'} /> */}
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "60%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"CargoAdic"}
                  >
                    {"Cargos Adicionales"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "40%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(values.CargoAdic)}
                  </label>
                </div>
                {/* <CustomFieldText2 disabled label={'Cargos Adicionales'} name={'CargoAdic'} placeholder={'0'} /> */}
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"PagoTotal"}
                  >
                    {"Cargos Totales"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {formatter.format(values.PagoTotal)}
                  </label>
                </div>
                {/* <CustomFieldText2 disabled label={'Cargos Totales'} name={'PagoTotal'} placeholder={'0'} /> */}
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "60%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"BonDia"}
                  >
                    {"Bonificación al Día"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "40%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(values.PagoComision)}
                  </label>
                </div>
                {/* <CustomFieldText2 disabled label={'Bonificación al Día'} name={'BonDia'} placeholder={'0'} /> */}
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"SldDia"}
                  >
                    {"Saldo al Día"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "50%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(values.SldDia)}
                  </label>
                </div>
                {/* <CustomFieldText2 disabled label={'Saldo al Día'} name={'SldDia'} placeholder={'0'} /> */}
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "60%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"PagoComision"}
                  >
                    {"Bonificación Abono"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "40%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(0)}
                  </label>
                </div>
                {/* <CustomFieldText2 disabled label={'Bonificación Abono'} name={'PagoComision'} placeholder={'0'} /> */}
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "60%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"PagoMinComision"}
                  >
                    {"Pago Min Comisión"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "40%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(values.PagoMinComision)}
                  </label>
                </div>
                {/* <CustomFieldText2 disabled label={'Pago Minimo Comisión'} name={'PagoMinComision'} placeholder={'0'} /> */}
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <ActionFieldNumberText
                  disabled={loading}
                  label={"Abono"}
                  valor={props.initialValues.Importe}
                  name={"Importe"}
                  placeholder={"0"}
                  onBlur={() => {
                    ActualizaSaldos(values);
                  }}
                />
              </div>
            </div>
            {loading && <Spinner />}
            {!loading && (
              <div className="columns is-desktop is-tablet">
                <div className="column is-12-mobile is-12-tablet is-8-desktop">
                  <div className="text-end">
                    <button
                      disabled={Show}
                      type="button"
                      className="button is-warning"
                      onClick={() => {
                        setShowStore(true);
                      }}
                    >
                      Boletos Estelares
                      <FaStar className="ml-1" />
                    </button>
                  </div>
                </div>
                <div className="column is-12-mobile is-12-tablet is-4-desktop">
                  <div className="text-end">
                      <DNIManualModal
                        SucursalID={values.SucursalId}
                        Dif_Pago={values.Dif_Pago}
                        DistribuidorId={values.DistribuidorId}
                        CuentaID={values.CuentaId}
                        CajaID={props.initialValues.CajaID}
                        oidc={props.oidc}
                        ProductoID={props.ProductoID}
                        optCuentasBancarias={[]}
                      />
                    <span></span>
                    <button
                      type="submit"
                      className="ms-2 btn btn-success waves-effect waves-light"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {ShowStore && (
              <ModalWin open={ShowStore} large center scrollable>
                <ModalWin.Header>
                  <h5 className={MODAL_TITLE_CLASS}>Raspadito</h5>
                  <button
                    type="button"
                    className="delete"
                    onClick={() => setShowStore(false)}
                  />
                </ModalWin.Header>
                <ModalWin.Body>
                  {ShowStore && (
                    <Raspadito
                      SucursalId={props.initialValues.SucursalId}
                      cbArticles={function (values: any) {
                        throw new Error("Function not implemented.");
                      }}
                      ArticulosIds={undefined}
                      Articles={[]}
                      cbSucursal={function (values: any) {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  )}
                </ModalWin.Body>
              </ModalWin>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

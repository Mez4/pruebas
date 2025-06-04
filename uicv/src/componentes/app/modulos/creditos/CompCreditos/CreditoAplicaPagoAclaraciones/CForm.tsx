import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Spinner,
  CustomFieldDatePicker,
  ActionSelect,
  ActionFieldText,
  ActionFieldNumberText,
  ActionFieldText2,
} from "../../../../../global";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import { Distribuidores, Cajas } from "../../../../../selectores";
import { formatDate2 } from "../../../../../../global/functions";
import * as Funciones from "./Funciones";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
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
    GenPPI: boolean;
    PagoPPI: number;
    CuentaBancoID: number;
    BonificacionID: number;
    Observacion: string;
    TipoCodigoID: number;
    FechaCorte: any;
  };
  optSucursales: { value: number; label: string }[];
  optCuentasBancarias: { value: number; label: string }[];
  optBonificaciones: { value: number; label: string }[];
  optTiposCodigo: { value: number; label: string }[];
  cbActualizaDatos(item: any): any;
  MaxPPI: number;
};

export const CForm = (props: CFormType) => {
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

  const FNAplicaPago = (Datos: {
    ProductoId: number;
    DistribuidorId: number;
    SucursalId: number;
    CajaID: number;
    CuentaId: number;
    FechaPago: Date;
    Importe: number;
    GenerarDNI: boolean;
    CodigoAut: string;
    CuentaBancoID: number;
    BonificacionID: number;
    Observacion: string;
    GenPPI: boolean;
    TipoCodigoID: number;
    FechaCorte: any;
  }) => {
    setLoading(true);
    Funciones.FNAdd(props.oidc, {
      ...Datos,
      FechaPago: new Date(formatDate2(new Date(Datos.FechaPago))),
    })
      .then((respuesta: any) => {
        if (respuesta.regresa === 1) {
          toast.success(
            `Se creó el movimiento de pago con el N° ${respuesta.MovimientoID}`
          );
          toast.info("Se está generando el comprobante, por favor espere...");

          Funciones.FNPdf(
            props.oidc,
            {
              MovimientoID: respuesta.MovimientoID,
            },
            respuesta.Dif_Pago
          )
            .then((pdf: any) => {
              const file = new Blob([pdf], { type: "application/pdf" });

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

              ActualizaSaldos({ ...Datos, Importe: 0 });

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
          toast.error(respuesta.msj);
        }
      })
      .catch((error: any) => {
        console.log(JSON.stringify(error));
        setLoading(false);
        toast.error("Error al generar el pago");
      });
  };

  const ActualizaSaldos = (Datos: {
    DistribuidorId: number;
    SucursalId: number;
    CuentaId: number;
    FechaPago: Date;
    Importe: number;
    GenerarDNI: boolean;
    CodigoAut: string;
    GenPPI: boolean;
    BonificacionID: number;
  }) => {
    if (Datos.DistribuidorId > 0) {
      Funciones.FNGetSaldosAclaracion(props.oidc, {
        ...Datos,
        ProductoId: props.ProductoID,
        FechaPago: new Date(formatDate2(new Date(Datos.FechaPago))),
      })
        .then((respuesta: any) => {
          setLoading(false);
          props.cbActualizaDatos(respuesta);
          if (respuesta.regresa == 0) {
            toast.error(respuesta.msj, {
              position: "top-center",
            });
          }
        })
        .catch((error: any) => {
          // console.log(JSON.stringify(error))

          toast.error(
            "Error al recuperar los saldos, intente lo nuevamente o reportarlo a sistemas"
          );

          setLoading(false);
        });
    } else {
      toast.error("Selecciona Socia y Bonificación");
    }
  };

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
          CuentaBancoID: Yup.number()
            .required(`Seleccione la Cuenta Bancaria`)
            .moreThan(0, `Seleccione la Cuenta Bancaria`),
          Importe: Yup.number()
            .required("Ingrese el Importe")
            .moreThan(0, "Ingrese el Importe"),
          TipoCodigoID: Yup.number()
            .required(`Seleccione el Tipo`)
            .moreThan(0, `Seleccione el Tipo`),
          Observacion: Yup.string()
            .required("Campo obligatorio")
            .min(3, "Mínimo 10 caracteres")
            .max(150, "Máximo 150 caracteres"),
        })}
        onReset={(values: any) => {
          // clearFormByLevel(0)
        }}
        onSubmit={(values: any) => {
          if (
            values.PagoTotal - values.Importe > 1 &&
            values.PagoTotal - values.Importe < props.MaxPPI &&
            values.GenPPI
          ) {
            MySwal.fire({
              title: "<strong>Aplicar CPT</strong>",
              icon: "question",
              html: (
                <div className="text-center">
                  ¿Desea generar movimiento de CPT?
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
              setLoading(true);
              FNAplicaPago({
                ...values,
                ProductoID: props.ProductoID,
                GenPPI: result.isConfirmed,
              });
            });
          } else {
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
                FNAplicaPago({
                  ...values,
                  ProductoID: props.ProductoID,
                  GenPPI: result.isConfirmed,
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
          }
        }}
      >
        {({ values }) => (
          <Form>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-2-desktop">
                <ActionSelect
                  disabled
                  label="Sucursal"
                  name="SucursalId"
                  placeholder="Seleccione la sucursal"
                  options={props.optSucursales}
                  addDefault={false}
                  valor={values.SucursalId}
                  // accion={props.cbSucursal}
                  // ref={refSucursal}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-2-desktop">
                <Cajas
                  name="CajaID"
                  // unaLinea
                  disabled
                  // ProductoID={props.ProductoID}
                  SucursalId={values.SucursalId}
                  oidc={props.oidc}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-2-desktop">
                <ActionSelect
                  disabled={loading}
                  label="Cuenta Bancaria"
                  name="CuentaBancoID"
                  placeholder="Seleccione la cuenta"
                  options={props.optCuentasBancarias}
                  addDefault={true}
                  valor={values.CuentaBancoID}
                  // accion={props.cbSucursal}
                  // ref={refSucursal}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-2-desktop">
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
              <div className="column is-12-mobile is-12-tablet is-2-desktop">
                <ActionSelect
                  disabled={loading}
                  label="Bonificación"
                  name="BonificacionID"
                  placeholder="Seleccione la Bonificación"
                  options={props.optBonificaciones}
                  addDefault={true}
                  valor={values.BonificacionID}
                  accion={(val) => {
                    ActualizaSaldos({
                      ...values,
                      BonificacionID: val,
                      Importe: 0,
                    });
                  }}
                  // accion={props.cbSucursal}
                  // ref={refSucursal}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-2-desktop">
                <CustomFieldDatePicker
                  disabled={loading}
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
              <div className="column is-12-mobile is-12-tablet is-3-desktop">
                <div className="input-group">
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "60%",
                      display: "block",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    htmlFor={"PagoPPI"}
                  >
                    {"Pago CPT"}
                  </label>
                  <label
                    className="input-group-text"
                    style={{
                      minWidth: "40%",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(values.PagoPPI)}
                  </label>
                </div>
              </div>
              <div className="column is-12-mobile is-12-tablet is-1-desktop">
                <CustomFieldCheckbox
                  disabled={loading}
                  label="Con CPT?"
                  name="GenPPI"
                />
              </div>
              {/* <div className="input-group">
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
                </div> */}
              {/* <CustomFieldText2 disabled label={'Bonificación Abono'} name={'PagoComision'} placeholder={'0'} /> */}

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
            <div className="columns is-desktop is-tablet">
              {/* <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <ActionFieldText
                  disabled={loading}
                  label={"Código Autorización"}
                  name={"CodigoAut"}
                  placeholder={""}
                  valor={props.initialValues.CodigoAut}
                  onBlur={() => {
                    ActualizaSaldos(values);
                  }}
                />
              </div> */}
              <div className="column is-12-mobile is-12-tablet is-8-desktop">
                <ActionFieldText2
                  disabled={loading}
                  label={"Observación"}
                  name={"Observacion"}
                  placeholder={"Ingrese Observaciones(Obligatorio)"}
                  valor={values.Observacion}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <ActionSelect
                  disabled={loading}
                  label="Tipo"
                  name="TipoCodigoID"
                  placeholder="Seleccione el Tipo de Código"
                  options={props.optTiposCodigo}
                  addDefault={true}
                  valor={values.BonificacionID}
                />
              </div>
            </div>
            {/* <div className="columns is-desktop is-tablet"> */}

            {/* </div> */}
            {loading && <Spinner />}
            {!loading && (
              <>
                <div className="columns is-desktop is-tablet">
                  <div className="column">
                    <div className="text-end">
                      <DNIManualModal
                        SucursalID={values.SucursalId}
                        Dif_Pago={values.Dif_Pago}
                        DistribuidorId={values.DistribuidorId}
                        CuentaID={values.CuentaId}
                        CajaID={props.initialValues.CajaID}
                        oidc={props.oidc}
                        ProductoID={props.ProductoID}
                        optCuentasBancarias={props.optCuentasBancarias}
                      />
                      {/* <button
                      type="button"
                      className="btn btn-primary waves-effect waves-light"
                      onClick={() => {
                        ActualizaSaldos(values);
                      }}
                    >
                      Actualizar Saldos&nbsp;
                      <FiRefreshCcw />
                    </button> */}
                      <button
                        type="submit"
                        className="ms-2 btn btn-success waves-effect waves-light"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

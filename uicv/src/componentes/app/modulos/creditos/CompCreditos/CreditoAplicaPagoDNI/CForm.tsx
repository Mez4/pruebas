import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Spinner,
  CustomFieldDatePicker,
  ActionSelect,
  ActionFieldText,
  ActionFieldNumberText,
} from "../../../../../global";
import { Distribuidores, Cajas } from "../../../../../selectores";
import { formatDate2 } from "../../../../../../global/functions";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./Funciones";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import { FiRefreshCcw } from "react-icons/fi";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
import { filterArrayByValues } from "../../../../../../global/functions";

type CFormInitialValues = {
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
  CuentaBancoID: number;
  Observacion: string;
};
type CFormType = {
  oidc: IOidc;
  ProductoID: number;
  initialValues: CFormInitialValues;
  optSucursales: { value: number; label: string }[];
  optCuentasBancarias: { value: number; label: string }[];
  cbActualizaDatos(item: any): any;
  cbDNIs(item: any): any;
};

export const CForm = (props: CFormType) => {
  const [loading, setLoading] = useState(false);

  const [ShowDNI, setShowDNI] = useState(false);

  const [getDni, setGetDni] = useState(false);

  const [DatosMostrar, setDatosMostrar] = useState([]);

  const [DatosSeleccionados, setDatosSeleccionados] = useState([]);

  const [MovimientoIDs, setMovimientoIDs] = useState([] as number[]);

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

  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      { name: "ID", selector: "MovimientoID", sortable: true },
      {
        name: "Observaciones",
        selector: "Observaciones",
        sortable: true,
        cell: (props) => <span> {props.Observaciones} </span>,
      },
      {
        name: "Importe",
        selector: "Importe",
        sortable: true,
        cell: (props) => (
          <span>{props.Importe ? formatter.format(props.Importe) : 0}</span>
        ),
      },
      {
        name: "Importe Restante",
        selector: "Importe Restante",
        sortable: true,
        cell: (props) => (
          <span>{props.restoDNI ? formatter.format(props.restoDNI) : 0}</span>
        ),
      },
      { name: "Fecha Captura", selector: "FechaCaptura", sortable: true },
      { name: "Fecha Afectacion", selector: "FechaAfectacion", sortable: true },
      {
        name: "Estatus Mov",
        selector: "EstDsc",
        // width: '9%',
        sortable: true,
        center: true,
        cell: (props) => (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              color: `${props.ColorEst}`,
            }}
          >
            {props.EstDsc}
          </div>
        ),
      },
      {
        name: "DNI Aplicado",
        selector: "DNI Aplicado",
        sortable: true,
        center: true,
        cell: (props) => (
          <div
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            {props.bitAplicado == 1 ? "SI" : "NO"}
          </div>
        ),
      },
      {
        name: "DNI Aplicado Resto",
        selector: "DNI Aplicado Resto",
        sortable: true,
        center: true,
        cell: (props) => (
          <div
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            {props.bitAplicadoResto == 1 ? "SI" : "NO"}
          </div>
        ),
      },
    ];
    return colRet;
  }, []);

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

  const GetDNIs = (Datos: { DistribuidorId: number }) => {
    // console.log('Datos: ', Datos)
    if (Datos.DistribuidorId > 0) {
      setGetDni(true);
      setMovimientoIDs([]);
      Funciones.FNGetDNIs(props.oidc, {
        DistribuidorId: Datos.DistribuidorId,
      })
        .then((respuesta: any) => {
          // console.log('respuesta: ', respuesta)
          setShowDNI(true);
          // setLoading(false)
          setDatosMostrar(respuesta);
          setGetDni(false);
          if (respuesta.regresa == 0) {
            toast.error(respuesta.msj);
          }
        })
        .catch((error: any) => {
          // console.log(JSON.stringify(error))

          toast.error(
            "Error al recuperar los saldos, intente lo nuevamente o reportarlo a sistemas"
          );
          setGetDni(false);
          // setLoading(false)
        });
    } else toast.error(`Seleccione una ${DescripcionDistribuidor(1)}`);
  };

  useEffect(() => {
    props.cbDNIs(
      filterArrayByValues(DatosMostrar, MovimientoIDs, "MovimientoID")
    );

    setDatosSeleccionados(
      filterArrayByValues(DatosMostrar, MovimientoIDs, "MovimientoID")
    );
  }, [MovimientoIDs]);

  useEffect(() => {
    console.log("Hello world");

    console.log(props.initialValues, "INITIAL VALUES");
  }, []);

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
          FechaPago: Yup.string().required("Seleccione una fecha"),
          Importe: Yup.number()
            .required("Ingrese el Importe")
            .moreThan(0, "Ingrese el Importe"),
          CuentaBancoID: Yup.number()
            .required("Seleccione la cuenta")
            .moreThan(0, "Seleccione la cuenta"),
        })}
        onReset={(values: any) => {
          // clearFormByLevel(0)
        }}
        onSubmit={(values: any) => {
          setLoading(true);
          Funciones.FNAddPagoDNI(props.oidc, {
            ...values,
            ProductoID: props.ProductoID,
            MovimientoIDs,
            FechaPago: new Date(formatDate2(new Date(values.FechaPago))),
            Observacion: values.Observacion ?? null,
          })
            .then((respuesta: any) => {
              if (respuesta.regresa === 1) {
                setMovimientoIDs([]);
                toast.success(
                  `Se creó el movimiento de pago con el N° ${respuesta.MovimientoID}`
                );
                toast.info(
                  "Se está generando el comprobante, por favor espere..."
                );

                Funciones.FNPdf(props.oidc, {
                  MovimientoID: respuesta.MovimientoID,
                })
                  .then((pdf: any) => {
                    const file = new Blob([pdf], { type: "application/pdf" });
                    const fileURL = URL.createObjectURL(file);
                    const enlaceTemporal = document.createElement("a");
                    enlaceTemporal.href = fileURL;
                    enlaceTemporal.target = "_blank";
                    enlaceTemporal.style.display = "none";

                    document.body.appendChild(enlaceTemporal);
                    enlaceTemporal.click();
                    setLoading(false);
                    ActualizaSaldos(values);
                  })
                  .catch((error: any) => {
                    console.log(JSON.stringify(error));

                    toast.error(
                      "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                    );

                    setLoading(false);
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
        }}
      >
        {({ values }) => (
          <Form>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-2-desktop">
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
                    ActualizaSaldos({ ...values, DistribuidorId: val });
                  }}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
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
                    {formatter.format(values.BonDia)}
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
                    {formatter.format(values.PagoComision)}
                  </label>
                </div>
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
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <ActionFieldNumberText
                  disabled
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
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <ActionFieldText
                  disabled={loading}
                  label={"Observación"}
                  name={"Observacion"}
                  placeholder={""}
                  valor={props.initialValues.Observacion}
                />
              </div>
            </div>
            {loading && <Spinner />}
            {!loading && (
              <div className="columns is-desktop is-tablet">
                <div className="column">
                  <div className="text-end">
                    <button
                      type="button"
                      disabled={getDni}
                      className="btn btn-warning waves-effect waves-light"
                      onClick={() => {
                        GetDNIs(values);
                      }}
                    >
                      Buscar DNI
                      <FiRefreshCcw className="ml-1" />
                    </button>
                    <button
                      type="button"
                      className="ms-2 btn btn-primary waves-effect waves-light"
                      onClick={() => {
                        ActualizaSaldos(values);
                      }}
                    >
                      Actualizar Saldos
                      <FiRefreshCcw className="ml-1" />
                    </button>
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
            <DataTable
              subHeader
              subHeaderComponent={<div>DNIs Seleccionados</div>}
              data={DatosSeleccionados}
              striped
              pagination
              dense
              noHeader
              responsive
              keyField={"MovimientoID"}
              defaultSortField={"MovimientoID"}
              columns={Columns}
            />
          </Form>
        )}
      </Formik>

      {ShowDNI && (
        <ModalWin open={ShowDNI} xlarge scrollable>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>Selección de DNI</h5>
            <button
              type="button"
              title="Cerrar"
              className="delete"
              onClick={() => setShowDNI(false)}
            />
          </ModalWin.Header>
          <ModalWin.Body>
            <DataTable
              subHeader
              data={DatosMostrar}
              selectableRows
              onSelectedRowsChange={(row: any) =>
                setMovimientoIDs(
                  row.selectedRows.map((valor: any) => {
                    return valor.MovimientoID;
                  })
                )
              }
              selectableRowDisabled={(row: any) =>
                row.CatEstatusMovID == 1 || row.CatEstatusMovID == 4
                  ? false
                  : true
              }
              striped
              dense
              noHeader
              responsive
              keyField={"MovimientoID"}
              defaultSortField={"MovimientoID"}
              columns={Columns}
            />
            <br />
            <div className="text-end">
              <button
                type="button"
                className="ms-2 btn btn-success waves-effect waves-light"
                onClick={() => setShowDNI(false)}
              >
                Aceptar
              </button>
            </div>
          </ModalWin.Body>
        </ModalWin>
      )}
    </>
  );
};

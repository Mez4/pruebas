import { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Spinner,
  CustomFieldText,
  CustomFieldText2,
  ActionSelect,
  CustomFieldDatePicker,
} from "../../../../../global";
import { Cajas } from "../../../../../selectores";
import * as Funciones from "../CreditoAplicaPagoCliente/Funciones";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import { FiRefreshCcw } from "react-icons/fi";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
import DataTable, { IDataTableColumn } from "react-data-table-component";

type CFormType = {
  oidc: IOidc;
  ProductoID: number;
  TicketsSeleccionados: any[];
  initialValues: {
    SucursalId: number;
    CajaID: number;
    ClienteID: number;
    NombreCompleto: string;
    ImporteTotal: number;
    SaldoActual: number;
    Interes: number;
    Porc_Int: number;
    A_Condonar: number;
    A_Pagar: number;
    Liquida: boolean;
    Comision: boolean;
    DistribuidorID: number;
    Distribuidor: string;
    CreditoID: number;
    CuentaBancoID: number;
    FechaPago: Date;
  };
  optSucursales: { value: number; label: string }[];
  optCuentasBancarias: { value: number; label: string }[];
  fnCancelar(): any;
  fnRefresca(ClienteID: number): any;
  cbActualizaDatos(
    SucursalId: number,
    ClienteID: number,
    CreditoID: number,
    Liquida: boolean
  ): any;
};

export const CForm = (props: CFormType) => {
  const [loading, setLoading] = useState(false);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formPerc = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const ColumnsTicket = useMemo(() => {
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
      { name: "Fecha Captura", selector: "FechaCaptura", sortable: true },
      { name: "Fecha Afectacion", selector: "FechaAfectacion", sortable: true },
      {
        name: "Estatus Mov",
        selector: "EstDsc",
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
        name: "Ticket Aplicado",
        selector: "Ticket Aplicado",
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
    ];
    return colRet;
  }, []);

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape({
        SucursalId: Yup.number()
          .required("Seleccione la sucursal")
          .moreThan(0, "Seleccione la a sucursal"),
        CajaID: Yup.number()
          .required("Seleccione la Caja")
          .moreThan(0, "Seleccione la Caja"),
        ClienteID: Yup.number()
          .required("Seleccione el cliente")
          .moreThan(0, "Seleccione el cliente"),
        A_Pagar: Yup.number()
          .required("Ingrese el Importe a pagar")
          .moreThan(1, "Ingrese el Importe a pagar"),
        CuentaBancoID: Yup.number()
          .required(`Seleccione la Cuenta Bancaria`)
          .moreThan(0, `Seleccione la Cuenta Bancaria`),
        FechaPago: Yup.string().required("Seleccione una fecha"),
      })}
      onSubmit={(values: any) => {
        setLoading(true);
        let fecha = new Date(values.FechaPago);
        fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
        Funciones.FNAdd(props.oidc, {
          ...values,
          ProductoID: props.ProductoID,
          DistribuidorID: props.initialValues.DistribuidorID,
          CreditoID: props.initialValues.CreditoID,
          TicketIDs: props.TicketsSeleccionados.map((x) => x.MovimientoID),
          CuentaBancoID: values.CuentaBancoID,
          FechaPago: fecha,
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

                  props.fnCancelar();
                  props.fnRefresca(values.ClienteID);
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
            <div className="column is-12-mobile is-12-tablet is-4-desktop">
              <CustomFieldText
                disabled
                label={"Distribuidor"}
                name={"Distribuidor"}
                placeholder={""}
              />
            </div>
            <div className="column is-12-mobile is-12-tablet is-2-desktop">
              <div
                className="form-check form-switch form-switch-md"
                dir="rtl"
                style={{
                  paddingTop: "1.3rem",
                }}
              >
                <Field
                  disabled={loading}
                  type="checkbox"
                  className="form-check-input"
                  id={"Comision"}
                  name={"Comision"}
                />
                <label className="form-check-label" htmlFor={"Comision"}>
                  {`Comisión ${DescripcionDistribuidor(1)}`}
                </label>
              </div>
              <ErrorMessage
                component="div"
                name={"Comision"}
                className="text-danger"
              />
            </div>
            <div className="column is-12-mobile is-12-tablet is-3-desktop">
              <ActionSelect
                disabled={loading}
                label="Cuenta Bancaria"
                name="CuentaBancoID"
                placeholder="Seleccione la cuenta"
                options={props.optCuentasBancarias}
                addDefault={true}
                valor={values.CuentaBancoID}
              />
            </div>
            <div className="column is-12-mobile is-12-tablet is-3-desktop">
              <CustomFieldDatePicker
                disabled={loading}
                label={"Fecha"}
                name={"FechaPago"}
                placeholder={""}
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-12-mobile is-12-tablet is-6-desktop">
              <ActionSelect
                disabled
                label="Sucursal"
                name="SucursalId"
                placeholder="Seleccione la sucursal"
                options={props.optSucursales}
                addDefault={false}
                valor={values.SucursalId}
              />
            </div>
            <div className="column is-12-mobile is-12-tablet is-6-desktop">
              <Cajas
                name="CajaID"
                disabled
                SucursalId={values.SucursalId}
                oidc={props.oidc}
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-12-mobile is-12-tablet is-6-desktop">
              <CustomFieldText
                disabled
                label={"N° Cliente"}
                name={"ClienteID"}
                placeholder={"0"}
              />
            </div>
            <div className="column is-12-mobile is-12-tablet is-6-desktop">
              <CustomFieldText
                disabled
                label={"Nombre"}
                name={"NombreCompleto"}
                placeholder={""}
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-12-mobile is-12-tablet is-6-desktop">
              <div className="input-group">
                <label
                  className="input-group-text"
                  style={{
                    width: "50%",
                    display: "block",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                  htmlFor={"ImporteTotal"}
                >
                  {"Importe Total"}
                </label>
                <label
                  className="input-group-text"
                  style={{
                    width: "50%",
                    display: "block",
                    textAlign: "right",
                  }}
                >
                  {formatter.format(values.ImporteTotal)}
                </label>
              </div>
            </div>
            <div className="column is-12-mobile is-12-tablet is-6-desktop">
              <div className="input-group">
                <label
                  className="input-group-text"
                  style={{
                    width: "50%",
                    display: "block",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                  htmlFor={"SaldoActual"}
                >
                  {"Saldo Actual"}
                </label>
                <label
                  className="input-group-text"
                  style={{
                    width: "50%",
                    display: "block",
                    textAlign: "right",
                  }}
                >
                  {formatter.format(values.SaldoActual)}
                </label>
              </div>
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-12-mobile is-12-tablet is-6-desktop">
              <div className="input-group">
                <label
                  className="input-group-text"
                  style={{
                    width: "50%",
                    display: "block",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                  htmlFor={"Interes"}
                >
                  {"Interes"}
                </label>
                <label
                  className="input-group-text"
                  style={{
                    width: "50%",
                    display: "block",
                    textAlign: "right",
                  }}
                >
                  {formatter.format(values.Interes)}
                </label>
              </div>
            </div>
            <div className="column is-12-mobile is-12-tablet is-6-desktop">
              <div className="input-group">
                <label
                  className="input-group-text"
                  style={{
                    width: "50%",
                    display: "block",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                  htmlFor={"Porc_Int"}
                >
                  {"% Interes"}
                </label>
                <label
                  className="input-group-text"
                  style={{
                    width: "50%",
                    display: "block",
                    textAlign: "right",
                  }}
                >
                  {formPerc.format(values.Porc_Int / 100)}
                </label>
              </div>
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-12-mobile is-12-tablet is-6-desktop">
              <div className="input-group">
                <label
                  className="input-group-text"
                  style={{
                    width: "50%",
                    display: "block",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                  htmlFor={"A_Condonar"}
                >
                  {"Importe Condonar"}
                </label>
                <label
                  className="input-group-text"
                  style={{
                    width: "50%",
                    display: "block",
                    textAlign: "right",
                  }}
                >
                  {formatter.format(values.A_Condonar)}
                </label>
              </div>
            </div>
            <div className="column is-12-mobile is-12-tablet is-6-desktop">
              <CustomFieldText2
                disabled={values.Liquida || !!props.TicketsSeleccionados.length}
                label={"Importe Pagar"}
                name={"A_Pagar"}
                placeholder={"0"}
              />
            </div>
          </div>
          {loading && <Spinner />}
          {!loading && (
            <div className="text-end">
              <button
                type="button"
                className="btn btn-danger waves-effect waves-light"
                onClick={props.fnCancelar}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="ms-2 btn btn-primary waves-effect waves-light"
                onClick={() => {
                  props.cbActualizaDatos(
                    values.SucursalId,
                    values.ClienteID,
                    values.CreditoID,
                    values.Liquida
                  );
                }}
              >
                Actualizar Saldos
                <FiRefreshCcw className="ml-1" />
              </button>
              <button
                type="submit"
                className="ms-2 btn btn-success waves-effect waves-light"
              >
                {values.Liquida ? "Liquidar" : "Abonar"}
              </button>
            </div>
          )}
          {!!props.TicketsSeleccionados.length && (
            <DataTable
              subHeader
              subHeaderComponent={<div>Tickets Seleccionados</div>}
              data={props.TicketsSeleccionados}
              striped
              pagination
              dense
              noHeader
              responsive
              keyField={"MovimientoID"}
              defaultSortField={"MovimientoID"}
              columns={ColumnsTicket}
            />
          )}
        </Form>
      )}
    </Formik>
  );
};

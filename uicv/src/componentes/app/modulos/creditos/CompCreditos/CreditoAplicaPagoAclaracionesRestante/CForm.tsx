import React, { useRef, useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
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
    ImgViewer,
    ActionAsyncSelect,
    CardItem,
} from "../../../../../global";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import {
    BuscarDatosBancarios,
    Clientes,
    Distribuidores,
    Sucursales,
    Cuentas,
    Cajas,
} from "../../../../../selectores";
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
} from "react-icons/fa";
import CreditoArticulos from "../CreditoArticulos";
import * as FnPersona from "../../../personas/CompAdministracion/CompPersona/Funciones";
import { PerfilPersona } from "../../../../../presentacion";
// import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiRefreshCcw } from "react-icons/fi";
import { DescripcionDistribuidor } from "../../../../../../global/variables";

type CFormType = {
    oidc: IOidc;
    ProductoID: number;
    initialValues: {
        SucursalId: number;
        CuentaBancoID: number;
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
        Distribuidor: string //naa
    };
    optSucursales: { value: number; label: string }[];
    fnCancelar(): any;
    fnRefresca(ClienteID: number): any;
    cbActualizaDatos(
        SucursalId: number,
        ClienteID: number,
        Liquida: boolean
    ): any;
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

    return (
        <>
            <Formik
                initialValues={props.initialValues}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    CuentaBancoID: Yup.number()
                        .required("Seleccione la cuenta")
                        .moreThan(0, "Seleccione la cuenta"),
                    ClienteID: Yup.number()
                        .required("Seleccione el cliente")
                        .moreThan(0, "Seleccione el cliente"),
                    A_Pagar: Yup.number()
                        .required("Ingrese el Importe a pagar")
                        .moreThan(1, "Ingrese el Importe a pagar"),
                })}
                onReset={(values: any) => {
                    // clearFormByLevel(0)
                }}
                onSubmit={(values: any) => {
                    setLoading(true);
                    Funciones.FNAdd2(props.oidc, {
                        ...values,
                        ProductoID: props.ProductoID,
                        DistribuidorID: props.initialValues.DistribuidorID
                    })
                        .then((respuesta: any) => {
                            if (respuesta.regresa === 1) {
                                toast.success(
                                    `Se creó el movimiento de pago con el N° ${respuesta.MovimientoID}`
                                );
                                toast.info(
                                    "Se está generando el comprobante, por favor espere..."
                                );

                                Funciones.FNPdf(props.oidc, {
                                    MovimientoID: respuesta.MovimientoID,
                                })
                                    .then((pdf: any) => {
                                        const file = new Blob([pdf], { type: "application/pdf" });

                                        // const fileURL = URL.createObjectURL(file);

                                        // window.open(fileURL);

                                        // var url = window.URL.createObjectURL(file);
                                        // var anchor = document.createElement("a");
                                        // anchor.download = "myfile.pdf";
                                        // anchor.href = url;
                                        // anchor.click();
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

                                        setLoading(false);

                                        props.fnCancelar();
                                        props.fnRefresca(values.ClienteID);

                                        // ActualizaSaldos(values)

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
                }}
            >
                {({ values }) => (
                    <Form>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-6-desktop"></div>
                            {/* <div className="column is-12-mobile is-12-tablet is-6-desktop">
                            
                                <CustomFieldCheckbox
                                    disabled={loading}
                                    label={`Comisión ${DescripcionDistribuidor(1)}`}
                                    name="Comision"
                                />
                            </div> */}
                        </div>
                        <div className="column is-two-quarters">
                            <CustomFieldText
                                disabled
                                label={"Distribuidor"}
                                name={"Distribuidor"}
                                placeholder={""}
                            />
                        </div>
                        <div className="columns is-desktop is-tablet">
                            {/* <div className="column is-half">
                                <Sucursales disabled={loading} ProductoID={props.ProductoID} name={'SucursalId'} valor={values.SucursalId} />
                            </div> */}
                            <div className="column is-12-mobile is-12-tablet is-6-desktop">
                                {/* { isMounted &&  */}
                                <ActionSelect
                                    disabled={loading}
                                    label="Cuenta"
                                    name="CuentaBancoID"
                                    placeholder="Seleccione la cuenta"
                                    options={props.optSucursales}
                                    addDefault={false}
                                    valor={values.CuentaBancoID}
                                // accion={cbSucursal}
                                // ref={refSucursal}
                                />
                                {/* } */}
                            </div>
                            {/* <div className="column is-12-mobile is-12-tablet is-6-desktop">
                                <Cajas
                                    name="CajaID"
                                    // unaLinea
                                    disabled
                                    // ProductoID={props.ProductoID}
                                    SucursalId={values.SucursalId}
                                    oidc={props.oidc}
                                />
                            </div> */}
                        </div>
                        <div className="columns is-desktop">
                            <div className="column is-one-quarter">
                                <CustomFieldText
                                    disabled
                                    label={"N° Cliente"}
                                    name={"ClienteID"}
                                    placeholder={"0"}
                                />
                            </div>
                            <div className="column is-three-quarters">
                                <CustomFieldText
                                    disabled
                                    label={"Nombre"}
                                    name={"NombreCompleto"}
                                    placeholder={""}
                                />
                            </div>

                        </div>
                        <div className="columns is-desktop">
                            <div className="column is-half">
                                <div className="mb-2">
                                    <div className="input-group">
                                        <label
                                            className="input-group-text"
                                            style={{
                                                minWidth: "100px",
                                                display: "block",
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            }}
                                            htmlFor={"ImporteTotal"}
                                        >
                                            {"Importe Total"}
                                        </label>
                                        <label
                                            className="input-group-text"
                                            style={{
                                                minWidth: "100px",
                                                display: "block",
                                                textAlign: "right",
                                            }}
                                        >
                                            {formatter.format(values.ImporteTotal)}
                                        </label>
                                    </div>
                                </div>
                                {/* <CustomFieldText2 disabled label={'Importe Total'} name={'ImporteTotal'} placeholder={'0'} /> */}
                            </div>
                            <div className="column is-half">
                                <div className="mb-2">
                                    <div className="input-group">
                                        <label
                                            className="input-group-text"
                                            style={{
                                                minWidth: "100px",
                                                display: "block",
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            }}
                                            htmlFor={"SaldoActual"}
                                        >
                                            {"Saldo Actual"}
                                        </label>
                                        <label
                                            className="input-group-text"
                                            style={{
                                                minWidth: "110px",
                                                display: "block",
                                                textAlign: "right",
                                            }}
                                        >
                                            {formatter.format(values.SaldoActual)}
                                        </label>
                                    </div>
                                </div>
                                {/* <CustomFieldText2 disabled label={'Saldo Actual'} name={'SaldoActual'} placeholder={'0'} /> */}
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-half">
                                <div className="mb-2">
                                    <div className="input-group">
                                        <label
                                            className="input-group-text"
                                            style={{
                                                minWidth: "100px",
                                                display: "block",
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            }}
                                            htmlFor={"Interes"}
                                        >
                                            {"Interes"}
                                        </label>
                                        <label
                                            className="input-group-text"
                                            style={{
                                                minWidth: "115px",
                                                display: "block",
                                                textAlign: "right",
                                            }}
                                        >
                                            {formatter.format(values.Interes)}
                                        </label>
                                    </div>
                                </div>
                                {/* <CustomFieldText2 disabled label={'Interes'} name={'Interes'} placeholder={'0'} /> */}
                            </div>
                            <div className="column is-half">
                                <div className="mb-2">
                                    <div className="input-group">
                                        <label
                                            className="input-group-text"
                                            style={{
                                                minWidth: "100px",
                                                display: "block",
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            }}
                                            htmlFor={"Porc_Int"}
                                        >
                                            {"% Interes"}
                                        </label>
                                        <label
                                            className="input-group-text"
                                            style={{
                                                minWidth: "120px",
                                                display: "block",
                                                textAlign: "right",
                                            }}
                                        >
                                            {formPerc.format(values.Porc_Int / 100)}
                                        </label>
                                    </div>
                                </div>
                                {/* <CustomFieldText2 disabled label={'% Interes'} name={'Porc_Int'} placeholder={'0'} /> */}
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-half">
                                <div className="mb-2">
                                    <div className="input-group">
                                        <label
                                            className="input-group-text"
                                            style={{
                                                minWidth: "100px",
                                                display: "block",
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            }}
                                            htmlFor={"A_Condonar"}
                                        >
                                            {"Importe Condonar"}
                                        </label>
                                        <label
                                            className="input-group-text"
                                            style={{
                                                minWidth: "70px",
                                                display: "block",
                                                textAlign: "right",
                                            }}
                                        >
                                            {formatter.format(values.A_Condonar)}
                                        </label>
                                    </div>
                                </div>
                                {/* <CustomFieldText2 disabled label={'Importe a Condonar'} name={'A_Condonar'} placeholder={'0'} /> */}
                            </div>
                            <div className="column is-half">
                                <CustomFieldText2
                                    disabled={values.Liquida}
                                    label={"Importe Pagar"}
                                    name={"A_Pagar"}
                                    placeholder={"0"}
                                />
                            </div>
                            {/* <div className="column is-one-quarter">
                            <ActionFieldText disabled={loading} label={'Abono'} valor={props.initialValues.Importe} name={'Importe'} placeholder={'0'} onBlur={() => {ActualizaSaldos(values)}}/>
                        </div> */}
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
                                            values.Liquida
                                        );
                                    }}
                                >
                                    Actualizar Saldos&nbsp;
                                    <FiRefreshCcw />
                                </button>
                                <button
                                    type="submit"
                                    className="ms-2 btn btn-success waves-effect waves-light"
                                >
                                    {values.Liquida ? "Liquidar" : "Abonar"}
                                </button>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </>
    );
};

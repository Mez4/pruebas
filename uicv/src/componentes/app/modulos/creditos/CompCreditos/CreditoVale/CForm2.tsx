import React, { useRef, useState, useEffect, memo } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Card, Spinner, CustomFieldText, ActionSelect, ActionCreatableSelect, ActionMultipleSelect, ActionFieldText, ActionFieldText2, ImgViewer, ActionAsyncSelect, CardItem, Carrusel, CustomFieldDatePicker } from '../../../../../global'
import { ControlDatosBancarios, BuscarDatosBancarios, Cajas, Clientes } from '../../../../../selectores'
import * as Funciones from './Funciones'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import CreatableSelect from 'react-select/creatable';
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import { toast } from 'react-toastify'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaWindowClose, FaShoppingCart, FaCloudDownloadAlt, FaAddressCard } from 'react-icons/fa'
import CreditoArticulos from '../CreditoArticulos'
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
import { PerfilPersona } from '../../../../../presentacion'
import { PerfilPersonaParaCapturaDeVales } from '../../../../../presentacion/persona/PerfilPersonaParaCapturaDeVales'
import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import VerDoc from '../../../Prospeccion/CompProspeccion/DocsProspecto/VerDoc'
import { DescripcionDistribuidor } from '../../../../../../global/variables'
import moment from 'moment'

type CFormType = {
    oidc: IOidc,
    ui: iUI,
    ProductoID: number,
    Id?: number,
    initialValues: {
        // ProductoId: number,
        SucursalId: number,
        CajaID: number,
        DistribuidorId: number,
        ClienteId: number,
        Capital: number,
        Folio: number,
        SerieId: number,
        Plazos: number,
        TipoDesembolsoID: number,
        // datoBancario: string,
        personasDatosBancariosID: number,
        RequiereDatosBancarios: boolean,
        FechaExpedicion: Date
        CreditoID: number
        MvCancelacion: string
        TipoCancelacionID: number
        // Cuenta: string,
    },
    cbCerrarMotivo(): any,
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    fnGetTiposDesembolso(SucursalId: number, ProductoID: number): any,
    fnGetDistribuidores(id: any): any,
    fnGetClientes(DistribuidorID: number, Nombre: string, callback: any): any,
    fnGetCondicionesDetalle(ProductoID: number, SucursalId: number, DistribuidorID: number): any,
    fnGetListaPlazos(Capital: number): any,
    fnGetFolios(id: number, SerieId: number, Folio: number): any,
    // fnGetSeries(id: number): any,
    fnGetDatosCliente(id: any): any,
    fnGetDatosFolios(id: any): any,
    fnGetDatosDistribuidor(id: any): any,
    fnGetLineaTiendita(id: any): any,
    // fnGetDatosTipoDesembolso(id: any): any,
    // optProductos: { value: number, label: string }[],
    optDistribuidores: { value: number, label: string }[],
    optSucursales: { value: number, label: string }[],
    optClientes: { value: number, label: string }[],
    optCapital: { value: string, label: string }[],
    optPlazos: { value: number, label: string }[],
    optTiposDesembolso: { value: number, label: string }[],
    optSeries: { value: number, label: string }[],
    optTipoCancelacion: { value: number, label: string }[],
    optFolios: { value: number, label: string }[],
    isUpdate: boolean,
    DatosCliente: any,
    DatosDistribuidor: any,
    DatosFolio: any,
    DatosTipoDesembolso: any,
    ProdTiendita: number,
    Sistema: string,
    TabTiendita: {
        ProductoID: number,
        DistribuidorNivelID: number,
        PorcComisionBase: number,
        CapitalColocadoMinimo: number,
        CapitalColocadoMaximo: number,
        ImporteProteccionSaldo: number,
        importeMaxCanje: number,
        maximoPrestamoPersonal: number,
        maximoImporteCanjeCliente: number,
        maximoImporteCanjeAval: number,
        monto: number
    },
    ShowFechaExpedicion: boolean
    // ShowStore: boolean
}

type EstadoTipo = {
    Datos: {
        Persona?: DBConfia_General.IPersonas_VW,
        Direcciones: DBConfia_General.IDirecciones_VW[],
        Empleos: DBConfia_General.IEmpleos_VW[]
    },
    Cargando: boolean,
    Error: boolean
    FechaMax: Date
}

export const CForm2 = //memo(
    (props: CFormType) => {

        console.log('props: ', props)

        const MySwal = withReactContent(Swal)

        const [Estado, DefinirEstado] = useState<EstadoTipo>({
            Datos: {
                Persona: undefined,
                Empleos: [],
                Direcciones: []
            },
            Cargando: true,
            Error: false,
            FechaMax: moment().add(-30, 'd').toDate()
        })
        /*   const cbCancelar = (item: any) =>
          EstadoTipo({ ...state, Datos: state.Datos.filter((obj) => { return obj.CreditoID !== item.CreditoID }) })
   */
        const FNCancelar = (CreditoID: number, MvCancelacion: string, TipoCancelacionID: number) => {
            Funciones.FNCancelar(props.oidc, CreditoID, MvCancelacion, TipoCancelacionID)
                .then((respuesta: any) => {
                    if (respuesta.regresa === 1) {
                        toast.success(respuesta.msj)
                        props.cbCerrarMotivo()
                        setLoading(false);
                    }
                    else {
                        toast.warning(respuesta.msj)
                    }
                })
                .catch(() => {
                    toast.error("Error al cancelar el crédito, vuelva a intentarlo.")
                })
        }



        const [loading, setLoading] = useState(false)


        const [formValues, setFormValues] = useState({
            optDistribuidores: [{ value: 0, label: '' }],
            optCapital: [{ value: '', label: '' }],
            optPlazos: [{ value: 0, label: '' }],
            optTiposDesembolso: [{ value: 0, label: '' }],
            optFolios: [{ value: 0, label: '' }],
            optSeries: [{ value: 0, label: '' }],
            SucursalId: props.initialValues.SucursalId,
            CajaID: props.initialValues.CajaID,
            DistribuidorId: props.initialValues.DistribuidorId,
            ClienteId: props.initialValues.ClienteId,
            Capital: props.initialValues.Capital,
            SerieId: props.initialValues.SerieId,
            Folio: props.initialValues.Folio,
            Plazos: props.initialValues.Plazos,
            TipoDesembolsoID: props.initialValues.TipoDesembolsoID,
            DatosFolio: props.DatosFolio,
            TabTiendita: props.TabTiendita,
            // datoBancario: '',
            personasDatosBancariosID: props.initialValues.personasDatosBancariosID,
        })


        return (
            <>
                <Formik
                    initialValues={props.initialValues}
                    /* enableReinitialize
                    validationSchema={Yup.object().shape({
                        Descripcion: Yup.string().required("Campo obligatorio").min(3, "Minimo 10 caracteres").max(30, "Maximo 100 caracteres"),
                    })} */
                    onSubmit={(values: any) => {

                        MySwal.fire({
                            title: '<strong>Cancelar Crédito</strong>',
                            icon: 'question',
                            html:
                                <div className="text-center">
                                    Se cancelará el crédito ¿desea continuar?
                                </div>,
                            showCloseButton: false,
                            showCancelButton: true,
                            showConfirmButton: true,
                            focusConfirm: false,
                            cancelButtonText: 'Cancelar',
                            confirmButtonText: 'Aceptar',
                            confirmButtonAriaLabel: 'Aceptar',
                            cancelButtonAriaLabel: ''
                        }).then((result) => {
                            if (result.isConfirmed) {
                                FNCancelar(values.CreditoID, values.MvCancelacion, values.TipoCancelacionID)

                            }
                        })

                    }}>
                    {({ values }) => (
                        <Form>
                            <div className="column is-full-desktop is-full-mobile">
                                <ActionSelect
                                    disabled={false}
                                    label="Tipo Cancelación"
                                    name="TipoCancelacionID"
                                    placeholder="Elige Tipo de Cancelación"
                                    options={props.optTipoCancelacion}
                                    addDefault={true}
                                />
                            </div>
                            <div className="column is-full-desktop is-full-mobile">
                                <CustomFieldText disabled={loading} label="Motivo de Cancelación" name="MvCancelacion" placeholder="Descripción" />
                            </div>

                            {loading && <Spinner />}
                            {!loading &&
                                <div className="text-end">

                                    <button type="submit" className="ms-2 btn btn-success waves-effect waves-light" >
                                        Cancelar Crédito
                                    </button>
                                </div>
                            }
                        </Form>
                    )}
                </Formik>
            </>
        )
    }
// );
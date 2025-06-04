import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import Select from 'react-select'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import ProgressBar from "../../../../../global/progress-bar.component"
import { DescripcionDistribuidor } from '../../../../../../global/variables'
// Icons
import { FaPrint, FaEnvelope, FaCheck } from 'react-icons/fa'
import { Coordinadores, Sucursales } from '../../../../../selectores'
import { Hidden } from 'react-grid-system'
import styled from 'styled-components';
import { iUI } from '../../../../../../interfaces/ui/iUI'

type CFormType = {
    oidc: IOidc
    ui: iUI,
    ProductoID: number,
    // SucursalId?: number,
    initialValues: {
        SucursalID: number,
        CoordinadorID: number,
        tipo: string,
        formato: string,
        fecha: string
        DirectorID?: number,
        ZonaID?: number,
        ProductoID: number,

        // Distribuidores: number[]
    },
    Distribuidores: number[],
    // cbActualizar(item: any): any,
    // cbGuardar(item: any): any,
    // fnCancelar(): any,
    fnGetFechaCortes(SucursalID: number): any,
    fnGetCoordinador(SucursalID: number): any,
    fnGetDistribuidores(SucursalID: number, CoordinadorID: number, fechaCorte: string): any,
    fnPrinting(loading: boolean): any,
    optSucursales: { value: number, label: string }[],
    optCoordinador: { value: number, label: string }[],
    optFechasCortes: { value: number, label: string }[],
    fecha: string
    // isUpdate: boolean
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = useState(false)
    const [action, setAction] = useState('')
    const [disabledCode, setDisabledCode] = useState(false)

    const refSucursal = useRef<Select>(null)
    const refCoordinador = useRef<Select>(null)
    const refFechaCorte = useRef<Select>(null)
    const [tipoUsuario, setTipoUsuario] = useState(0);

    // const [formValues, setFormValues] = useState({
    //     Distribuidores: [] as number[]
    // }) 
    const GetRolUsuario = () => {
        setLoading(true);
        Funciones.FNGetTipoUsuario(props.oidc, { usuarioID: 0 })
            .then((respuesta: any) => {
                setTipoUsuario(respuesta.tipoUsuario)
                switch (respuesta.tipoUsuario) {
                    case 3:
                        props.initialValues.SucursalID = respuesta.SucursalID;
                        // props.fnGetCoordinador(props.initialValues.SucursalID);
                        //props.fnGetFechaCortes(respuesta.SucursalID)
                        cbSucursal(respuesta.SucursalID)
                        break;
                    case 4:
                        props.initialValues.SucursalID = respuesta.SucursalID;
                        props.initialValues.CoordinadorID = respuesta.CoordinadorID;
                        props.initialValues.fecha = respuesta.fechaCorte;
                        cbSucursal(respuesta.SucursalID)
                        cbCoordinador(respuesta.CoordinadorID)
                        //props.fnGetFechaCortes(respuesta.SucursalID)

                        //props.fnGetDistribuidores(props.initialValues.SucursalID, props.initialValues.CoordinadorID, props.initialValues.fecha)

                        break;
                        {/* case 3:
                        props.initialValues.ZonaID = respuesta.ZonaID;
                        props.initialValues.SucursalID = respuesta.SucursalID;
                break;*/}
                    // case 4: props.initialValues. break;
                }
                setLoading(false);
            })
            .catch((error) => console.log("error!", error))
    }


    useEffect(() => {
        GetRolUsuario();
    }, [tipoUsuario])

    const [Distribuidores, setDistribuidores] = useState([] as number[])

    const sumbit = useRef<HTMLButtonElement>(null);
    const permisoBloquearRelacion = props.ui.PermisosProductos?.find(p => p.PermisoID == 2782)

    const clearFormByLevel = (level: number) => {
        // if(level === 0){
        //     setArticles([])
        //     setArticulosIds([])
        //     setShopInfo({
        //         totalItems: 0,
        //         totalPrice: 0,
        //         totalQty: 0
        //     })
        //    refSucursal.current?.select.setValue( { value: '0', label: '' }, "deselect-option")
        // }
        if (level === 0 || level === 1) {
            refCoordinador.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
        }
        if (level === 0 || level === 1 || level === 2) {
            setDistribuidores([])
            //     const cliente: any = refCliente.current?.select
            //     cliente.select.setValue({ value: '0', label: '' }, "deselect-option")
            //     refCapital.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
            //     refFolio.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
            //     refPlazos.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
        }
    }

    const cbSucursal = (value: any) => {
        clearFormByLevel(1)
        props.fnGetFechaCortes(value)
        props.fnGetCoordinador(value)
    }

    const cbCoordinador = (value: any) => {
        clearFormByLevel(2)
        const sucursal: any = refSucursal
        const SucursalId = sucursal.current.props.value.value as number

        const fechaCorte: any = refFechaCorte
        const fecha = fechaCorte.current.props.value.value as string
        props.fnGetDistribuidores(SucursalId, value, tipoUsuario == 4 ? props.initialValues.fecha : fecha)
    }

    {/*if(props.initialValues.SucursalID > 0 )
    {

        props.fnGetCoordinador(props.initialValues.SucursalID)
    }
    else  
    {
        setDisabledCode(false)
    }    

    if(props.initialValues.CoordinadorID > 0)
    {

        props.fnGetDistribuidores(props.initialValues.SucursalID, props.initialValues.CoordinadorID, props.initialValues.fecha)
    }
    else      
    {
        setDisabledCode(false)

    }   
*/}

    useEffect(() => {
        setDistribuidores(props.Distribuidores)
    }, [props.Distribuidores])

    const [completed, setCompleted] = useState(0);

    const move = () => {
        var i = 0;
        var timer = setInterval(frame, 100);
        function frame() {
            if (i == 99 || !loading) {
                if (!loading) {
                    setCompleted(0)
                }
                clearInterval(timer);
            } else {
                i++;
                setCompleted(i)
            }
        }
    }

    useEffect(() => {
        refFechaCorte.current?.select.setValue({ value: props.fecha, label: props.fecha }, "select-option")
    }, [props.fecha])

    useEffect(() => {

        if (loading) {
            move()
        }

    }, [loading])

    useEffect(() => {

        if (action !== '') {
            const btn: any = sumbit;
            btn.current.click();
        }

    }, [action])

    const containerStyles = {
        width: '100%'
    }

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                SucursalID: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),
                CoordinadorID: Yup.number().required("Seleccione el coordinador").moreThan(0, 'Seleccione el coordinador'),
                tipo: Yup.number().required("Seleccione una opción").moreThan(0, 'Seleccione una opción'),
                formato: Yup.number().required("Seleccione un formato").moreThan(0, 'Seleccione un formato'),
                fecha: Yup.string().required("Seleccione la fecha de corte")
                // Distribuidores: Yup.array()
                //         .min(1, 'Seleccione al menos una socia')
            })}
            onSubmit={(values: any) => {
                if (Distribuidores.length >= 0) {
                    setLoading(true)
                    props.fnPrinting(true)
                    // move()

                    // var parts = values.FechaCorte.split('/')
                    // var date = new Date(parts[2], parts[1] - 1, parts[0], 0, 0, 0)
                    // console.log(date); 

                    switch (action) {
                        case 'print': {
                            Funciones.FNPrint(props.oidc,
                                {
                                    ...values,
                                    ProductoID: props.ProductoID,
                                    Distribuidores
                                }
                                // function(percent: any) {
                                //     setCompleted(percent)
                                // }
                            )
                                .then((pdf: any) => {
                                    // props.cbActualizar(respuesta)
                                    console.log(pdf)

                                    const file = new Blob(
                                        [pdf],
                                        { type: 'application/pdf' });

                                    // const fileURL = URL.createObjectURL(file);

                                    // window.open(fileURL);

                                    var url = window.URL.createObjectURL(file);

                                    const fileURL = URL.createObjectURL(file);
                                    const enlaceTemporal = document.createElement('a');
                                    enlaceTemporal.href = fileURL;
                                    enlaceTemporal.target = '_blank';
                                    enlaceTemporal.style.display = 'none';


                                    document.body.appendChild(enlaceTemporal);


                                    enlaceTemporal.click();


                                    setTimeout(() => {

                                        // Imprimir el documento
                                        // window.print();
                                    }, 1000);
                                    //var anchor = document.createElement("a");
                                    //anchor.download = "myfile.pdf";
                                    //anchor.href = url;
                                    //anchor.click();
                                    //
                                    setLoading(false)
                                    //props.fnPrinting(false)
                                    // setCompleted(0)
                                })
                                .catch((error: any) => {
                                    console.log(error) // log error to console
                                    setLoading(false)
                                    props.fnPrinting(false)
                                })
                            break;
                        }
                        case 'send': {
                            Funciones.FNSend(props.oidc,
                                {
                                    ...values,
                                    ProductoID: props.ProductoID,
                                    Distribuidores
                                }
                                // function(percent: any) {
                                //     setCompleted(percent)
                                // }
                            )
                                .then((res: any) => {
                                    if (res === 1) {
                                        toast.success("Se han mandado las relaciones por correo electronico")
                                    }
                                    else {
                                        toast.warning("No hay información la cual procesar")
                                    }
                                    setLoading(false)
                                    props.fnPrinting(false)
                                })
                                .catch((error: any) => {
                                    setLoading(false)
                                    props.fnPrinting(false)
                                    toast.error("Ocurrió un error al imprimir la relación")
                                })
                            break;
                        }
                        case 'bloquearproducto': {
                            Funciones.FNdesbloquearRelacionesXProducto(props.oidc,
                                {
                                    ...values,
                                    ProductoID: props.ProductoID,
                                    Distribuidores
                                }
                                // function(percent: any) {
                                //     setCompleted(percent)
                                // }
                            )
                                .then((res: any) => {
                                    toast.success("Se desbloquearon relaciones correctamente")
                                    setLoading(false)
                                    props.fnPrinting(false)
                                })
                                .catch((error: any) => {
                                    setLoading(false)
                                    props.fnPrinting(false)
                                    toast.error("Ocurrió un error al imprimir la relación")
                                })
                            break;
                        }
                        case 'bloqueartodas': {
                            Funciones.FNbloquearRelaciones(props.oidc,
                                {
                                    ...values,
                                    ProductoID: props.ProductoID,
                                    Distribuidores
                                }
                                // function(percent: any) {
                                //     setCompleted(percent)
                                // }
                            )
                                .then((res: any) => {
                                    toast.success("Se bloquearon/desbloquearon relaciones correctamente")
                                    setLoading(false)
                                    props.fnPrinting(false)
                                })
                                .catch((error: any) => {
                                    setLoading(false)
                                    props.fnPrinting(false)
                                    toast.error("Ocurrió un error al imprimir la relación")
                                })
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                    setAction('')
                }
                else
                    toast.error(`No ha seleccionado ninguna ${DescripcionDistribuidor(1)}`)

            }}>
            {({ values }) => (
                <Form>
                    <div className="columns is-desktop is-tablet">
                        <div className="column is-12-mobile is-12-tablet is-4-desktop">
                            <ActionSelect
                                disabled={loading || tipoUsuario == 3 || tipoUsuario == 4}
                                label="Sucursal"
                                name="SucursalID"
                                placeholder="Seleccione la sucursal"
                                options={props.optSucursales}
                                addDefault={true}
                                valor={values.SucursalID}
                                accion={cbSucursal}
                                ref={refSucursal}
                            //accion2={(value: any) => { cbSucursal(value)}}

                            />
                            {/*                             <Sucursales disabled={loading || tipoUsuario >= 3} ZonaID={isNaN(values.ZonaID!) ? 0 : values.ZonaID} name={'SucursalID'} valor={isNaN(values.SucursalID) ? 0 : values.SucursalID} ProductoID={isNaN(values.ProductoID) ? 0 : values.ProductoID} />
 */}
                            {/*                             <Coordinadores disabled={loading} SucursalID={isNaN(values.SucursalID!) ? 0 : values.SucursalID} name={'CoordinadorID'} valor={values.CoordinadorID} />
 */}
                        </div>
                        <div className="column is-12-mobile is-12-tablet is-3-desktop">
                            <div id="opciones">Opciones</div>
                            <div role="group" aria-labelledby="opciones">
                                <label className="radio">
                                    <Field type="radio" name="tipo" value="1" />
                                    {' Imprimir solo relación'}
                                </label>
                                <br />
                                <label className="radio">
                                    <Field type="radio" name="tipo" value="2" />
                                    {' Imprimir solo recibos'}
                                </label>
                            </div>
                            <ErrorMessage component="div" name="tipo" className="text-danger" />
                        </div>
                        <div className="column is-12-mobile is-12-tablet is-3-desktop" style={{ width: "350px" }}>
                            <div id="opciones">Formato</div>
                            <div role="group" aria-labelledby="opciones">
                                <label className="radio">
                                    <Field type="radio" name="formato" value="1" />
                                    {values.tipo == '1' && ' Relación de Pago Anticipada 15 al 30-31'}
                                    {values.tipo == '2' && ' Imprimir recibo con hoja de 6'}
                                </label>
                                <br />
                                <label className="radio">
                                    <Field type="radio" name="formato" value="2" />
                                    {values.tipo == '1' && ' Relación de Pago Puntual 18 al 03'}
                                    {values.tipo == '2' && ' Imprimir recibo con hoja de 8'}
                                </label>
                                <br />
                                {values.tipo == '1' &&
                                    <label className="radio">

                                        <Field type="radio" name="formato" value="3" />
                                        {values.tipo == '1' && ' Relación de Pago Completa 20-05'}
                                    </label>
                                }
                            </div>
                            <ErrorMessage component="div" name="formato" className="text-danger" />
                        </div>
                    </div>
                    <div className="columns is-desktop is-tablet">
                        <div className="column is-12-mobile is-12-tablet is-4-desktop">
                            {tipoUsuario == 4 ?
                                <Coordinadores
                                    disabled={loading || tipoUsuario == 4}
                                    SucursalID={isNaN(values.SucursalID!) ? 0 : values.SucursalID}
                                    name={'CoordinadorID'}
                                    valor={isNaN(values.CoordinadorID) ? 0 : values.CoordinadorID}
                                />
                                :
                                <ActionSelect
                                    disabled={loading}
                                    label="Coordinador"
                                    name="CoordinadorID"
                                    placeholder="Seleccione el Coordinador"
                                    options={props.optCoordinador}
                                    addDefault={false}
                                    valor={isNaN(values.CoordinadorID) ? 0 : values.CoordinadorID}
                                    accion={cbCoordinador}
                                />
                            }
                        </div>
                        <div className="column is-12-mobile is-12-tablet is-3-desktop">
                            <ActionSelect
                                disabled={tipoUsuario == 3 || tipoUsuario == 4}
                                label="Fecha de Corte"
                                name="fecha"
                                placeholder="Seleccione la Fecha de Corte"
                                options={props.optFechasCortes}
                                addDefault={false}
                                valor={props.fecha}
                                // accion={cbFecha}
                                ref={refFechaCorte}
                            />
                            {/* <CustomSelect
                                disabled={true}
                                label="Fecha de Corte"
                                name="fecha"
                                placeholder="Seleccione la Fecha de Corte"
                                options={props.optFechasCortes}
                                addDefault={false}
                                isMulti={false}
                            /> */}
                        </div>
                        <div className="column is-1">
                        </div>

                        <div className="column is-4">
                            {loading && <Spinner />}
                            {!loading &&
                                <div className="control">
                                    <button type="submit" hidden ref={sumbit} />
                                    <br />
                                    <button className="ms-2 btn btn-success waves-effect waves-light" onClick={() => {
                                        setAction('print')
                                    }}>
                                        <span className="is-hidden-touch">Imprimir</span>&nbsp;<FaPrint />
                                    </button>
                                    <button className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => {
                                        setAction('send')
                                    }}>
                                        <span className="is-hidden-touch">Enviar Correo</span>&nbsp;<FaEnvelope />
                                    </button>
                                    {permisoBloquearRelacion &&
                                        <button className="ms-2 btn btn-warning waves-effect waves-light" onClick={() => {
                                            setAction('bloquearproducto')
                                        }}>
                                            <span className="is-hidden-touch">Bloquear Relaciones Actuales</span>&nbsp;<FaCheck />
                                        </button>}
                                    {permisoBloquearRelacion &&
                                        <button className="ms-2 btn btn-warning waves-effect waves-light" onClick={() => {
                                            setAction('bloqueartodas')
                                        }}>
                                            <span className="is-hidden-touch">Bloquear Todas</span>&nbsp;<FaCheck />
                                        </button>}
                                </div>


                            }
                        </div>
                    </div>
                    <div className="columns is-desktop is-tablet">
                        <div className="column"></div>
                        <div className="column is-three-quarters">
                            {loading &&
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} style={containerStyles}></div>
                                </div>
                            }
                            <br />
                            {/* {loading &&
                        <ProgressBar bgcolor={"#3CEB68"} completed={completed} />
                    } */}
                        </div>
                        <div className="column"></div>
                    </div>
                    {
                        (Distribuidores.length === 0 && values.CoordinadorID > 0) &&
                        <div className="text-danger">
                            Seleccione al menos una {`${DescripcionDistribuidor(1)}`}
                        </div>
                    }
                </Form>
            )}
        </Formik>
    )
}

import React, { useRef, useState, useEffect } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CustomFieldText, ActionFieldText2, ActionAsyncSelect, ActionSelect, CustomSelect, Carrusel } from '../../../../../global'
import { Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { DescripcionDistribuidor } from '../../../../../../global/variables'
import { FoliosDigitales, Distribuidores, Cajas, Clientes } from '../../../../../selectores'
import CreditoArticulos from '../CreditoArticulos'
import { FaWindowClose, FaShoppingCart, FaCloudDownloadAlt, FaAddressCard, FaEye } from 'react-icons/fa'

type ValeDigitalType = {
    oidc: IOidc
    initialValues: {
        Codigo: string,
        SucursalId: number,
        CajaID: number,
        DistribuidorId: number,
        ClienteId: number,
        Capital: number,
        Folio: number,
        SerieId: number,
        Plazos: number,
        TipoDesembolsoID: number,
        personasDatosBancariosID: number,
        RequiereDatosBancarios: boolean
    },
    ActualizarCreditoModalDigital(CreditoIDConfirmadoDigital: any): any,
    AbrirPlanDePagosDigital(): any,
    Sistema: string,
    ProdTiendita: number,
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
    optSucursales: { value: number, label: string }[],
    optCapital: { value: number, label: string }[],
    optPlazos: { value: number, label: string }[],
    fnGetDatos(Codigo: string)
    // fnGetCondicionesDetalle(SucursalId: number, DistribuidorID: number): any,
    // cbActualizar(item: any): any,
    // cbGuardar(item: any): any,
    // fnCancelar(): any,
}

export const ValeDigital = (props: ValeDigitalType) => {

    const MySwal = withReactContent(Swal)

    const [isMounted, setisMounted] = useState(false);

    const [loading, setLoading] = useState(false)

    const [ShowStore, setShowStore] = useState(false)

    const [articles, setArticles] = useState([]);

    const [articulosIds, setArticulosIds] = useState([]);

    const [total, setTotal] = useState(0);

    const [capital, setCapital] = useState(0);

    const [CanjearVale, setCanjearVale] = useState(false)

    const [ComprarTienda, setComprarTienda] = useState(false)

    const [creditoVale, setCreditoVale] = useState(0);

    const [creditoTienda, setCreditoTienda] = useState(0);

    const [MovimientoID, setMovimientoID] = useState(0);

    const [VentaId, setVentaId] = useState(0);

    const [errorVale, setErrorVale] = useState(false)

    const [errorTienda, setErrorTienda] = useState(false)

    const [resCredito, setResCredito] = useState(false)


    // const fnSetCapital = (value: number) => {
    //     // const capital: any = refCapital;
    //     setCapital(value == 0 ? 0 : value);
    // }

    const [shopInfo, setShopInfo] = useState({
        totalItems: 0,
        totalPrice: 0,
        totalQty: 0
    });

    const cbArticles = (values: any) => {
        setShowStore(false)
        if (values.cart !== null) {
            setArticles(values.cart.items)
            setArticulosIds(values.cart.items.map((valor: any) => {
                return valor.id;
            }))
            setShopInfo(values.cart.info)
        }
        else {
            setArticles([])
            setArticulosIds([])
            setShopInfo({
                totalItems: 0,
                totalPrice: 0,
                totalQty: 0
            })
        }
    }

    const DescargarPDF = (respuesta: any) => {
        toast.info("Se está generando el pagaré, por favor espere...")

        Funciones.FNPdf(props.oidc, {
            ProductoID: props.oidc.user.ProductoID,
            CreditoID: respuesta.CreditoId,
            CreditoID_2: 0
        })
            .then((pdf: any) => {

                const file = new Blob(
                    [pdf],
                    { type: 'application/pdf' });

                // const fileURL = URL.createObjectURL(file);

                // window.open(fileURL);

                var url = window.URL.createObjectURL(file);
                var anchor = document.createElement("a");
                anchor.download = "myfile.pdf";
                anchor.href = url;
                anchor.click();

                setLoading(false)

                setCanjearVale(false)

                // clearFormByLevel(0)

            })
            .catch((error: any) => {
                console.log(JSON.stringify(error))

                // toast.error("Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas")

                MySwal.fire({
                    title: '<strong>Error</strong> al descargar el archivo',
                    icon: 'error',
                    html:
                        <div className="text-center">
                            Intente volver a descargar el archivo o reportarlo a sistemas.
                        </div>,
                    showCloseButton: false,
                    showCancelButton: true,
                    showConfirmButton: true,
                    focusConfirm: false,
                    cancelButtonText: 'Cerrar',
                    confirmButtonText: 'Descargar',
                    confirmButtonAriaLabel: '',
                    cancelButtonAriaLabel: ''
                }).then((result) => {
                    if (result.isConfirmed) {
                        DescargarPDF(respuesta)
                    }
                    else {
                        setLoading(false)
                        setCanjearVale(false)
                    }
                })
            })
    }

    useEffect(() => {
        // return () => {
        setisMounted(true)
        // }
    }, [])

    useEffect(() => {
        setCapital(props.initialValues.Capital == 0 ? 0 : props.initialValues.Capital)
    }, [props.initialValues.Capital])

    useEffect(() => {
        setTotal((capital + shopInfo.totalPrice))
    }, [capital, shopInfo.totalPrice])




    return (
        <>
            <Formik
                initialValues={props.initialValues}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    SucursalId: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),
                    CajaID: Yup.number().required('Seleccione la Caja').moreThan(0, 'Seleccione la Caja'),
                    Codigo: Yup.string().required('El código es requerido').min(6, 'El código debe ser de 6 dígitos').max(6, 'El código debe ser de 6 dígitos'),
                    // Folio: Yup.number().required("Ingrese el folio del vale digital").moreThan(0, 'Ingrese el folio del vale digital'),
                })}
                onReset={(values: any) => {
                    // clearFormByLevel(0)
                }}
                onSubmit={(values: any) => {


                    if ((shopInfo.totalPrice <= props.TabTiendita.importeMaxCanje)) {
                        setResCredito(true)
                        setLoading(true)
                        setCanjearVale(true)
                        Funciones.FNAppCanje(props.oidc, {
                            ...values,
                            ProductoID: props.oidc.user.ProductoID,
                            SucursalID: values.SucursalId
                            // Plazos: values.Plazos.value as number,
                            // Capital: values.Capital.value as number,
                            // TipoCanje: 5,
                            // PrestamoNomina: false,
                            // ClienteId: values.DistribuidorID
                            // TipoDesembolsoID: props.TiposDesembolso.TipoDesembolsoID as number,
                        })
                            .then((respuesta: any) => {

                                // console.log(respuesta)
                                if (respuesta.regresa === 1) {
                                    toast.success(`Se creó el crédito con el N° ${respuesta.CreditoId}`)
                                    props.ActualizarCreditoModalDigital(respuesta.CreditoId)
                                    setCreditoVale(respuesta.CreditoId)
                                    setMovimientoID(respuesta.MovimientoID)
                                    setVentaId(respuesta.VentaId)
                                    setErrorVale(false)

                                    if (articles.length > 0) {
                                        setCanjearVale(false)
                                    }
                                    else {
                                        DescargarPDF(respuesta)
                                    }
                                    // setLoading(false)
                                    // clearFormByLevel(0)
                                    // props.fnCancelar()
                                    // window.location.replace('');
                                }
                                else {
                                    // setErrorVale(true)
                                    setLoading(false)
                                    setResCredito(false)
                                    toast.error('Error al canjear, ' + respuesta.msj)
                                }
                            })
                            .catch((error: any) => {
                                console.log(JSON.stringify(error))
                                setErrorVale(true)
                                setLoading(false)
                                setResCredito(false)
                                toast.error("Error al crear el crédito, intente lo nuevamente o reporte el error a sistemas")
                            })

                    }
                    else
                        toast.error(`El límite de compra en la tiendita para las condiciones dadas es de $${props.TabTiendita.importeMaxCanje}`)
                }}>
                {({ values }) => (
                    <Form>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-half-desktop">
                                {/* { isMounted &&  */}
                                <ActionSelect
                                    disabled //={props.isUpdate || loading}
                                    label="Sucursal"
                                    name="SucursalId"
                                    placeholder="Seleccione la sucursal"
                                    options={props.optSucursales}
                                    addDefault={false}
                                    valor={values.SucursalId}
                                />
                                {/* } */}
                            </div>
                            <div className="column is-12-mobile is-12-tablet is-half-desktop">
                                <Cajas
                                    name="CajaID"
                                    // unaLinea
                                    disabled
                                    // ProductoID={props.ProductoID}
                                    SucursalId={values.SucursalId}
                                    oidc={props.oidc}
                                />
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-4-desktop">
                                {isMounted &&
                                    <ActionFieldText2
                                        disabled={loading}
                                        label="Código"
                                        name="Codigo"
                                        placeholder="Ingrese el Código de canje"
                                        valor={values.Codigo}
                                        onChange={
                                            // (val: any)=>{

                                            props.fnGetDatos

                                            // }
                                        }
                                    />
                                }
                            </div>
                            <div className="column is-12-mobile is-12-tablet is-4-desktop">
                                {isMounted &&
                                    <Distribuidores
                                        disabled
                                        /* SucursalID={values.SucursalId} */
                                        name={'DistribuidorId'}
                                        valor={values.DistribuidorId}
                                        /* WithProducto */
                                        SucursalID={0}
                                        GrupoID={0}
                                        RequiereSuc={false}
                                    />
                                }
                            </div>
                            <div className="column is-12-mobile is-12-tablet is-4-desktop">
                                <Clientes
                                    disabled
                                    name="ClienteId"
                                    DistribuidorID={values.DistribuidorId}
                                    ClienteId={values.ClienteId}
                                    noAsync
                                />
                            </div>
                            {/* <div className="column is-12-mobile is-12-tablet is-4-desktop">
                                {isMounted &&
                                    <FoliosDigitales
                                        oidc={props.oidc}
                                        disabled={loading}
                                        name="Folio"
                                        valor={values.Folio}
                                        cargar={isMounted}
                                    // accion={}
                                    // ref={refCapital}
                                    />
                                }
                            </div> */}
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                                {/* { isMounted &&  */}
                                <ActionSelect
                                    disabled
                                    label="Capital"
                                    name="Capital"
                                    placeholder="Seleccione el capital"
                                    options={props.optCapital}
                                    addDefault={false}
                                    valor={values.Capital}
                                // ref={refPlazos}
                                // accion={fnSetCapital}
                                />
                                {/* <CustomSelect
                                    name={'Capital'} 
                                    disabled
                                    addDefault={false} 
                                    placeholder={"Seleccione o ingrese el capital"} 
                                    label={'Capital'} 
                                    options={props.optCapital} 
                                    isMulti={false} 
                                /> */}
                                {/* } */}
                            </div>
                            <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                                {/* { isMounted &&  */}
                                <ActionSelect
                                    disabled
                                    label="Plazos"
                                    name="Plazos"
                                    placeholder="Seleccione el número de plazos"
                                    options={props.optPlazos}
                                    addDefault={false}
                                    valor={values.Plazos}
                                // ref={refPlazos}
                                // accion={cbPlazo}
                                />
                                {/* } */}
                            </div>
                            {/* <div className="column">
                                <div className="box">
                                    <div className="text-end">
                                        <p className="title is-5">Total: {values.Capital.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</p>
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        <div className="columns is-desktop is-tablet">
                            {/* <div className="column is-one-third">
                            <div className="mb-3">
                                Firma Socia
                                <br />
                                <ImgViewer imgSrc={props.DatosDistribuidor.FirmaDistribuidor ? props.DatosDistribuidor.FirmaDistribuidor : ''} noToolbar={false} zIndex={1500}  maxWidth={250} maxHeight={150} />
                            </div>
                        </div> */}
                            <div className="column is-two-thirds">

                                {/* {(props.ProductoID != 33) &&  */}
                                <div>
                                    <button type="button" disabled={loading || (props.TabTiendita.importeMaxCanje == 0 || props.ProdTiendita == 0) ? true : false} className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => {
                                        setShowStore(true)
                                    }}>
                                        <span className="my-1">Incluir Artículos</span> <FaShoppingCart />
                                    </button>
                                    {(shopInfo.totalPrice > props.TabTiendita.importeMaxCanje) &&
                                        <div className="text-danger">{`El límite de compra en la tiendita para este vale es de $${props.TabTiendita.importeMaxCanje}`}</div>
                                    }
                                </div>
                                {/* } */}
                            </div>
                            <div className="column is-one-third">
                                <h1 className="title is-3">{`TOTAL: $${total}`}</h1>
                            </div>
                        </div>
                        {articles.length > 0 &&
                            // <div className="box">
                            <div className="columns is-desktop is-tablet">
                                <div className="column is-10">
                                    <Carrusel articles={articles} />
                                    {/* <Carousel
                                            swipeable={false}
                                            draggable={false}
                                            showDots={false}
                                            responsive={responsive}
                                            ssr={true} // means to render carousel on server-side.
                                            infinite={false}
                                            // autoPlay={props.deviceType !== "mobile" ? true : false}
                                            autoPlaySpeed={1000}
                                            keyBoardControl={true}
                                            customTransition="all .5"
                                            transitionDuration={500}
                                            containerClass="carousel-container"
                                            removeArrowOnDeviceType={["tablet", "mobile"]}
                                            // deviceType={props.deviceType}
                                            dotListClass="custom-dot-list-style"
                                            itemClass="carousel-item-padding-40-px"
                                            partialVisible={true}
                                        // centerMode={true}            
                                        >
                                            {articles.map((item: any) => (
                                                <CardItem {...item} key={item.id} />
                                            ))}
                                        </Carousel> */}
                                </div>
                                <div className="column">
                                    <div className="box">
                                        <p className="title is-5">Total: ${shopInfo.totalPrice}</p>
                                        <p>Artículos: {shopInfo.totalItems}</p>
                                        <p>Cantidad: {shopInfo.totalQty}</p>
                                    </div>
                                </div>
                            </div>
                            //</div> 
                        }


                        {/* <div className="columns is-desktop is-tablet">
                            <div className="column">
                                <div className="box">
                                    <div className="text-end">
                                        <p className="title is-5">Total: {values.Capital.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="box">
                            <div className="columns is-desktop is-tablet">
                                <div className="column">
                                    {loading && <Spinner />}
                                    {!loading &&
                                        <div className="text-end">
                                            <button type="reset" className="btn btn-danger waves-effect waves-light" >
                                                Limpiar
                                            </button>
                                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light" >
                                                Aceptar
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

            {ShowStore &&
                <ModalWin open={ShowStore} large center scrollable>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                            Incluir Artículos
                        </h5>
                        <button title='Cerrar' type="button" className="delete" onClick={() => setShowStore(false)} />
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {ShowStore &&
                            <CreditoArticulos
                                SucursalId={props.initialValues.SucursalId}
                                cbArticles={cbArticles}
                                ArticulosIds={articulosIds}
                                Articles={articles}
                                cbSucursal={() => { }}
                            />
                        }
                    </ModalWin.Body>
                </ModalWin>
            }

            <ModalWin open={resCredito}>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        Generando Crédito
                    </h5>
                </ModalWin.Header>
                <ModalWin.Body>
                    <button className={`btn btn-${errorVale ? 'danger' : CanjearVale ? 'warning' : 'success'}`} type="button" disabled>
                        {CanjearVale && <>
                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            &nbsp;
                            Canjeando Vale...
                        </>
                        }
                        {!CanjearVale && !errorVale &&
                            <>
                                Canje de Vale Completado
                            </>
                        }
                        {errorVale &&
                            <>
                                Error
                            </>
                        }
                    </button>
                    &nbsp;
                    {creditoVale > 0 &&
                        <>
                            N° de Crédito: <strong>{creditoVale}</strong>
                        </>
                    }
                    <br />
                    <br />
                    {articles.length > 0 &&
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button
                                type="button"
                                className="btn btn-danger"

                                disabled={CanjearVale || ComprarTienda || errorVale || (creditoTienda > 0)}
                                onClick={() => {
                                    setCreditoTienda(0)
                                    setErrorTienda(false)
                                    setLoading(false)
                                    setArticles([])
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className={`btn btn-${ComprarTienda ? 'warning' : 'primary'}`}
                                type="button"
                                disabled={CanjearVale || ComprarTienda || errorVale || (creditoTienda > 0)}
                                onClick={() => {
                                    setComprarTienda(true)
                                    // setSumbiting(true)
                                    // const btn: any = sumbit; 
                                    // console.log('sumbit: ', sumbit) 
                                    // btn.current.click()
                                    var detalle = articles.map((valor: any) => {
                                        var obj = { id_sku: valor.id, cantidad: valor.qty };
                                        return obj
                                    });

                                    // console.log('detalle: ', detalle)

                                    let JsonTda = {
                                        id_empresa: 1
                                        , sucursal: props.initialValues.SucursalId
                                        , tipo_usuario1: "4"
                                        , id_usuario: props.initialValues.DistribuidorId
                                        , sistema1: props.Sistema
                                        , id_forma_pago: 10
                                        , referencia_forma_pago: "@Credito"
                                        , detalle
                                    }

                                    Funciones.FNComprarTiendita(props.oidc, {
                                        SucursalId: props.initialValues.SucursalId, //formValues.SucursalId,
                                        CajaID: props.initialValues.CajaID, //</div>formValues.CajaID,
                                        ProductoID: 1, //props.oidc.user.ProductoID,
                                        ProductoTiendita: props.ProdTiendita,
                                        DistribuidorId: props.initialValues.DistribuidorId,
                                        ClienteId: props.initialValues.ClienteId,
                                        Folio: props.initialValues.Folio,
                                        SerieId: props.initialValues.SerieId,
                                        Plazos: props.initialValues.Plazos,
                                        TipoDesembolsoID: 9, //props.initialValues.TipoDesembolsoID,
                                        Capital: shopInfo.totalPrice,
                                        MovimientoID: MovimientoID,
                                        VentaId: VentaId,
                                        JsonTda: JSON.stringify(JsonTda),
                                        TipoCanje: 2,
                                        articles: articles as []
                                    })
                                        .then((respuesta: any) => {

                                            console.log(respuesta)
                                            setComprarTienda(false)
                                            // setSumbiting(false)
                                            if (respuesta.regresa === 1) {
                                                setCreditoTienda(respuesta.CreditoId)
                                                toast.success(`Se creó el crédito con el N° ${respuesta.CreditoId}`)

                                                setErrorTienda(false)

                                                toast.info("Se está generando el pagaré, por favor espere...")

                                                Funciones.FNPdf(props.oidc, {
                                                    ProductoID: props.oidc.user.ProductoID,
                                                    CreditoID: creditoVale,
                                                    CreditoID_2: respuesta.CreditoId
                                                })
                                                    .then((pdf: any) => {

                                                        const file = new Blob(
                                                            [pdf],
                                                            { type: 'application/pdf' });

                                                        // const fileURL = URL.createObjectURL(file);

                                                        // window.open(fileURL);

                                                        var url = window.URL.createObjectURL(file);
                                                        var anchor = document.createElement("a");
                                                        anchor.download = "myfile.pdf";
                                                        anchor.href = url;
                                                        anchor.click();

                                                        setLoading(false)

                                                        // clearFormByLevel(0)

                                                    })
                                                    .catch((error: any) => {
                                                        console.log(JSON.stringify(error))

                                                        toast.error("Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas")

                                                        setLoading(false)

                                                        // clearFormByLevel(0)
                                                    })

                                                // window.location.replace('');
                                            }
                                            else {
                                                setErrorTienda(true)
                                                // setLoading(false)
                                                toast.error(respuesta.msj)
                                            }
                                        })
                                        .catch((error: any) => {
                                            console.log(JSON.stringify(error))
                                            setComprarTienda(false)
                                            setErrorTienda(true)
                                            // setLoading(false)
                                            // setSumbiting(false)
                                            toast.error("Error al comprar en la tiendita")
                                        })
                                }}
                            >
                                {ComprarTienda &&
                                    <>
                                        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                        &nbsp;
                                        Comprando en la Tiendita...
                                    </>
                                }
                                {!ComprarTienda && !errorTienda && //(creditoTienda > 0) && 
                                    <>
                                        Comprar Tiendita
                                    </>
                                }
                                {errorTienda &&
                                    <>
                                        Volver a intentar
                                        <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle" />
                                    </>
                                }
                            </button>
                        </div>
                    }
                    &nbsp;
                    {creditoTienda > 0 &&
                        <>
                            N° de Crédito: <strong>{creditoTienda}</strong>
                        </>
                    }
                    <br />
                    <hr />
                    <br />
                    <div className="text-end">
                        <button type="button" disabled={loading || (creditoVale > 0 && creditoTienda === 0 && articles.length > 0)} className="ms-2 btn btn-danger waves-effect waves-light" onClick={() => {
                            setResCredito(false)
                            // clearFormByLevel(0)
                            setCreditoVale(0)
                            setCreditoTienda(0)
                            setMovimientoID(0)
                            setVentaId(0)
                            setErrorVale(false)
                            setErrorTienda(false)
                        }}>
                            Cerrar
                        </button>
                        <button type="button" disabled={loading || (creditoVale > 0 && creditoTienda === 0 && articles.length > 0)} className="ms-2 btn btn-primary waves-effect waves-light"
                            onClick={() => {
                                setLoading(true)
                                Funciones.FNPdf(props.oidc, {
                                    ProductoID: props.oidc.user.ProductoID,
                                    CreditoID: creditoVale,
                                    CreditoID_2: creditoTienda
                                })
                                    .then((pdf: any) => {

                                        const file = new Blob(
                                            [pdf],
                                            { type: 'application/pdf' });

                                        // const fileURL = URL.createObjectURL(file);

                                        // window.open(fileURL);
                                        var url = window.URL.createObjectURL(file);
                                        var anchor = document.createElement("a");
                                        anchor.download = "myfile.pdf";
                                        anchor.href = url;
                                        anchor.click();

                                        setLoading(false)

                                    })
                                    .catch((error: any) => {
                                        console.log(JSON.stringify(error))
                                        setLoading(false)
                                        toast.error("Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas")

                                    })
                            }}>
                            Descargar Pagare&nbsp;<FaCloudDownloadAlt />
                        </button>
                        <button type="button" disabled={loading || (creditoVale > 0 && creditoTienda === 0 && articles.length > 0)} className="ms-2 btn btn-primary waves-effect waves-light"
                            onClick={() => props.AbrirPlanDePagosDigital()}
                        >
                            Ver Plan de Pagos &nbsp; <FaEye />
                        </button>
                    </div>
                </ModalWin.Body>
            </ModalWin>
        </>
    )
}
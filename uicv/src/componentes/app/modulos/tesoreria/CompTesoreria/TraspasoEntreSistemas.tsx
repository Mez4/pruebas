import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './TraspasoEntreSistemas/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import download from 'downloadjs'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'

// Custom components
import { ActionSelect, Card, CustomFieldText, Spinner } from '../../../../global'
import { CForm } from './TraspasoEntreSistemas/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form, Formik } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import axios from 'axios'
import moment from 'moment'
import { FormateoDinero } from '../../../../../global/variables'
import yup from '../../../../../global/yupLocale'




type CatalogosType = {
    Seguridad: IOidc
}

const TraspasoEntreSistemas = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        SistemaDestinoID: 0,
        SistemaOrigenID: 0,
        Observaciones: '',
        CuentaDestinoID: 0,
        CuentaOrigenID: 0,
        Monto: 0

    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const OptionsSucursal: any[] = []
    const OptionsCuentasOrigen: any[] = []
    const OptionsCuentasDestino: any[] = []
    const optBancos: any[] = []
    const optSistemas: any[] = []
    const optCuentas: any[] = []


    const [state, setState] = React.useState({
        Habilitar: true,
        optSistemas,
        Datos,
        DatosMostrar,
        optCuentas,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },

        OptionsSucursal,
        OptionsCuentasOrigen,
        OptionsCuentasDestino,
        SaldosOrigen: 0,
        SaldosDestino: 0,
        SistemaOrigenID: 0,
        SistemaDestinoID: 0
    })

    const [origen, setOrigen] = React.useState(true)
    const [destino, setDestino] = React.useState(true)

    const [cuentaO, setCuentaO] = React.useState(true)
    const [cuentaD, setCuentaD] = React.useState(true)

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var bancos = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta };
                        return obj
                    });
                    setState(s => ({ ...s, optCuentas: bancos, Cargando: false }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }


    const FNGetSistemas = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNSistemas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var bancos = respuesta.map((valor: any) => {
                        var obj = { value: valor.sistemaID, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, optSistemas: bancos, Cargando: false }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }



    React.useEffect(() => {
        FNGetLocal()
        FNGetSistemas()
        //FNGetTipoCuentaBancarias()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-lined
    }, [])



    const [loading, setLoading] = React.useState(false)
    /** funcion para cancelar la forma */

    const fnGetCuentaOrigen = (SistemaOrigenID: number) => {
        let Datos = {
            SistemaOrigenID
        }
        Funciones.FNCuentasOrigen(props.Seguridad, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    if (SistemaOrigenID === 14) {
                        var cuentasOrigen = respuesta.map((valor: any) => {
                            var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta };
                            return obj
                        });

                        setOrigen(false)
                    }
                    else {
                        var cuentasOrigen = respuesta.map((valor: any) => {
                            var obj = { value: valor.cuenta, label: valor.nombre };
                            return obj
                        });
                        setOrigen(false)
                    }
                    setState(s => ({ ...s, OptionsCuentasOrigen: cuentasOrigen, SistemaOrigenID: SistemaOrigenID }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const fnGetCuentaDestino = (SistemaDestinoID: number) => {
        let Datos = {
            SistemaDestinoID
        }
        Funciones.FNCuentasDestino(props.Seguridad, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    if (SistemaDestinoID === 14) {
                        var cuentasDestino = respuesta.map((valor: any) => {
                            var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta };
                            return obj
                        });

                        setDestino(false)
                    }
                    else {
                        var cuentasDestino = respuesta.map((valor: any) => {
                            var obj = { value: valor.cuenta, label: valor.nombre };
                            return obj
                        });
                        setDestino(false)
                    }
                    setState(s => ({ ...s, OptionsCuentasDestino: cuentasDestino, SistemaDestinoID: SistemaDestinoID }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const fnGetSaldosOrigen = (CuentaOrigenID: any) => {
        let Datos = {
            CuentaOrigenID,
            SistemaOrigenID: state.SistemaOrigenID
        }
        Funciones.FNSaldosOrigen(props.Seguridad, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    if (state.SistemaOrigenID === 14) {
                        setState(s => ({ ...s, SaldosOrigen: respuesta }))
                    }
                    else {
                        setState(s => ({ ...s, SaldosOrigen: respuesta[0].total }))
                    }
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const fnGetSaldosDestino = (CuentaDestinoID: any) => {
        let Datos = {
            CuentaDestinoID,
            SistemaDestinoID: state.SistemaDestinoID
        }
        Funciones.FNSaldosDestino(props.Seguridad, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    if (state.SistemaDestinoID === 14) {
                        setState(s => ({ ...s, SaldosDestino: respuesta }))
                    }
                    else {
                        console.log('resppppp', respuesta[0].total)
                        setState(s => ({ ...s, SaldosDestino: respuesta[0].total }))
                    }
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Traspaso Entre Sistemas">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <Formik
                                        initialValues={state.Form.Datos}
                                        enableReinitialize
                                        validationSchema={yup.object().shape({
                                            SistemaOrigenID: yup.number().required("Campo obligatorio").moreThan(0, "Seleccione una opción"),
                                            SistemaDestinoID: yup.number().required("Campo obligatorio").moreThan(0, "Seleccione una opción"),
                                            CuentaOrigenID: yup.number().required("Campo obligatorio").moreThan(0, "Seleccione una opción"),
                                            CuentaDestinoID: yup.number().required("Campo obligatorio").moreThan(0, "Seleccione una opción"),
                                            Observaciones: yup.string().required("Campo obligatorio").min(5, "Mínimo 5 caracteres").max(65, "Máximo 65 caracteres"),
                                            Monto: yup.number().required("Campo obligatorio"),
                                        })}
                                        onSubmit={(values: any) => {

                                            setLoading(true)
                                            console.log(values, 'Valores')
                                            // let Agregarmovimiento: any = {

                                            //     CatalogoCuentaID: values.CatalogoCuentaID,
                                            //     Monto: values.Monto,
                                            //     CargoAbono: values.CargoAbono,
                                            //     Observaciones: values.Observaciones,

                                            // }
                                            // values = Agregarmovimiento
                                            Funciones.FNAdd(props.Seguridad, values)
                                                .then((respuesta: any) => {
                                                    console.log('respppppp', respuesta)
                                                    if (respuesta.MovimientoOrigen > 0 && respuesta.MovimientoDestino > 0) {
                                                        console.log('respppppp', respuesta)
                                                        setLoading(false);
                                                        toast.success(`TRASPASO EXITOSO, MOVIMIENTO CUENTA ORIGEN: ${respuesta.MovimientoOrigen}, MOVIMIENTO CUENTA DESTINO: ${respuesta.MovimientoDestino}`);
                                                        fnGetSaldosDestino(values.CuentaDestinoID);
                                                        fnGetSaldosOrigen(values.CuentaOrigenID);
                                                    }

                                                })
                                                .catch((error: any) => {
                                                    alert("Error al guardar la cuenta" + JSON.stringify(error))
                                                    setLoading(false)
                                                })
                                        }

                                        }
                                    >
                                        <Form>
                                            <div className="columns is-centered is-mobile is-multiline">
                                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                                    <ActionSelect
                                                        disabled={false}
                                                        name="SistemaOrigenID"
                                                        placeholder="Seleccione el sistema origen..."
                                                        label={"Sistema Origen:"}
                                                        options={state.optSistemas}
                                                        addDefault={false}
                                                        accion={(val) => { fnGetCuentaOrigen(val) }}
                                                    />
                                                </div>
                                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                                    <ActionSelect
                                                        disabled={origen}
                                                        name="CuentaOrigenID"
                                                        placeholder="Seleccione la cuenta origen..."
                                                        label={"Cuenta Origen:"}
                                                        options={state.OptionsCuentasOrigen}
                                                        addDefault={false}
                                                        accion={(val) => { fnGetSaldosOrigen(val) }}
                                                    />
                                                </div>
                                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                                    <div className="group">
                                                        <label
                                                            className="group-text"
                                                            style={{
                                                                minWidth: "50%",
                                                                textAlign: "right",
                                                            }}
                                                            htmlFor={"SaldosO"}
                                                        >
                                                            {"Saldos Cuenta Origen"}
                                                        </label>
                                                        <label
                                                            className="group-text"
                                                            style={{
                                                                minWidth: "50%",
                                                                display: "block",
                                                            }}
                                                        >
                                                            {FormateoDinero.format(state.SaldosOrigen)}
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                                    <ActionSelect
                                                        disabled={false}
                                                        name="SistemaDestinoID"
                                                        placeholder="Seleccione el sistema destino..."
                                                        label={"Sistema Destino:"}
                                                        options={state.optSistemas}
                                                        addDefault={false}
                                                        accion={(val) => { fnGetCuentaDestino(val) }}
                                                    />
                                                </div>
                                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                                    <ActionSelect
                                                        disabled={destino}
                                                        name="CuentaDestinoID"
                                                        placeholder="Seleccione la cuenta destino..."
                                                        label={"Cuenta Destino:"}
                                                        options={state.OptionsCuentasDestino}
                                                        addDefault={false}
                                                        accion={(val) => { fnGetSaldosDestino(val) }}
                                                    />
                                                </div>
                                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                                    <div className="group">
                                                        <label
                                                            className="group-text"
                                                            style={{
                                                                minWidth: "50%",
                                                                textAlign: "right",
                                                            }}
                                                            htmlFor={"SaldosD"}
                                                        >
                                                            {"Saldos Cuenta Destino"}
                                                        </label>
                                                        <label
                                                            className="group-text"
                                                            style={{
                                                                minWidth: "50%",
                                                                display: "block",
                                                            }}
                                                        >
                                                            {FormateoDinero.format(state.SaldosDestino)}
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                                                    <CustomFieldText
                                                        disabled={loading}
                                                        label="Monto:"
                                                        name="Monto"
                                                        placeholder="Monto"
                                                    />
                                                </div>
                                                <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                                                    <CustomFieldText
                                                        disabled={loading}
                                                        label="Observaciones:"
                                                        name="Observaciones"
                                                        placeholder="Observaciones"
                                                    />

                                                </div>
                                                {loading && <Spinner />}
                                                {!loading &&
                                                    <div className="column is-align-items-center is-full-desktop is-full-tablet is-full-mobile">
                                                        <div className="text-center">
                                                            {/* <button type="reset" className="btn btn-primary waves-effect waves-light" onClick={() => { setState((s) => ({
                                    ...s,
                                    optSistemas: [],
                                    OptionsCuentasOrigen: [],
                                    OptionsCuentasDestino: []
                                    }));
                                }}>
                                    Limpiar
                                </button> */}
                                                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                                                Realizar Traspaso
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                            </div>



                                        </Form>

                                        {/* <ModalWin large={true} center={true} open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {"Realizar Traspaso Entre Sistemas"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbGuardar={cbAgregar}
                                                cbActualizar={cbActualizar2}
                                                fnCancelar={fnCancelar}
                                                optCuentas={state.optCuentas}
                                                optSistemas={state.optSistemas}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin> */}
                                    </Formik>
                                </div>

                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(TraspasoEntreSistemas)
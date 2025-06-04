import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'

import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CatalogoCuentasBanco/Funciones'
import { toast } from 'react-toastify'




import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoCuentasBanco/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'



type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoBancoCuentas = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        cuentaBancoID: 0,
        numeroCuenta: '',
        bancoID: 0,
        cuentaID: 0,
        activo: true
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsAcumula: any[] = []
    const OptionsBanco: any[] = []


    const [state, setState] = React.useState({
        Habilitar: true,

        Datos,
        DatosMostrar,

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
        OptionsAcumula,
        OptionsBanco


    })

    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los datos generales y cargar la pantalla
    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Acumula Cuenta
    const FnGetAcumula = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetContable(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var acumula = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsAcumula: acumula }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsAcumula: [] }))
                }
            })
    }



    //Funcion para obtener los datos de Naturaleza
    const FnGetBanco = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetBancos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var banco = respuesta.map((valor: any) => {
                        var obj = { value: valor.bancoID, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsBanco: banco }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsBanco: [] }))
                }
            })
    }




    const Columns = React.useMemo(() => {

        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'cuentaBancoID', sortable: true, },
                { name: 'Numero de Cuenta', selector: 'numeroCuenta', sortable: true, },
                {
                    name: 'Activa',
                    selector: 'activo',
                    sortable: true,
                    cell: (props) => <span>{props.activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                { name: 'Banco', selector: 'bancoID.nombre', sortable: true, },
                { name: 'Nombre Cuenta Contable', selector: 'cuentaID.nombre', sortable: true, },
                { name: 'Cuenta Contable', selector: 'cuentaID.cuenta', sortable: true, },


                {
                    name: 'Editar', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {

                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        cuentaBancoID: props.cuentaBancoID,
                                        numeroCuenta: props.numeroCuenta,
                                        cuentaID: props.cuentaID.id,
                                        bancoID: props.bancoID.bancoID,
                                        activo: props.activo
                                    },
                                    Id: props.cuentaBancoID
                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },

            ]
        return colRet
    }, [])

    React.useEffect(() => {
        FNGetLocal()
        FnGetAcumula()
        FnGetBanco()


        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */

    const cbAgregar = (item: any) => {
        toast.success('La cuenta se agrego correctamente')
        setState(state => ({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    cuentaBancoID: 0,
                    numeroCuenta: '',
                    bancoID: 0,
                    cuentaID: 0,
                    activo: true
                }
            }
        }))
        FnGetAcumula()
        FNGetDatos()

    }



    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('La cuenta se actualizo correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.cuentaBancoID === item.cuentaBancoID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    cuentaBancoID: 0,
                    numeroCuenta: '',
                    bancoID: 0,
                    cuentaID: 0,
                    activo: true
                }
            }
        }
        ))
        FnGetAcumula()
        FNGetDatos()

    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })


    return (
        <div className="row">
            <div className="col-12">


            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoBancoCuentas)
import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './BancoCuentasParam/Funciones'
import { toast } from 'react-toastify'

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './BancoCuentasParam/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'



type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoCuentasContables = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        parametrosID: 0,
        bancoID: 0,
        cuentaBancoID: 0,
        montoMin: 0,
        montoMax: 0
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
                        var obj = { value: valor.cuentaBancoID, label: valor.numeroCuenta };
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
                { name: 'Id', selector: 'parametrosID', sortable: true, },
                // { name: 'Numero de Cuenta', selector: 'numeroCuenta', sortable: true, },
                {
                    name: 'Activa',
                    selector: 'activo',
                    sortable: true,
                    cell: (props) => <span>{props.activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                { name: 'Banco', selector: 'banco', sortable: true, },
                { name: 'Cuenta Bancaria', selector: 'numeroCuenta', sortable: true, },
                { name: 'Monto Mínimo', selector: 'montoMin', sortable: true, },
                { name: 'Monto Máximo', selector: 'montoMax', sortable: true, },
                { name: 'Nombre Cuenta Contable', selector: 'nombreCuentaContable', sortable: true, },
                { name: 'Cuenta Contable', selector: 'cuentaContable', sortable: true, },


                {
                    name: 'Editar', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        parametrosID: props.parametrosID,
                                        cuentaBancoID: props.cuentaID,
                                        bancoID: props.bancoID,
                                        montoMin: props.montoMin,
                                        montoMax: props.montoMax,
                                    },
                                    Id: props.parametrosID

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
        toast.success('El parametro se agrego correctamente')
        setState(state => ({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    parametrosID: 0,
                    bancoID: 0,
                    cuentaBancoID: 0,
                    montoMin: 0,
                    montoMax: 0
                }
            }
        }))
        FnGetAcumula()
        FNGetDatos()

    }



    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('El parametro se actualizo correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.parametrosID === item.parametrosID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    parametrosID: 0,
                    bancoID: 0,
                    cuentaBancoID: 0,
                    montoMin: 0,
                    montoMax: 0
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

                <Card Title="Cuentas Parametros Banco">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {

                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar cuentas" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"parametrosID"}
                                        defaultSortField={"parametrosID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Cuenta Banco" : "Montos Min/Max"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                optionsBanco={state.OptionsBanco}
                                                optionsCuenta={state.OptionsAcumula}




                                            />
                                        </ModalWin.Body>
                                    </ModalWin>



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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoCuentasContables)
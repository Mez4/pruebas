import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CerrarBalance/Funciones'
import { toast } from 'react-toastify'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CerrarBalance/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { ErrorMessage, Field, Formik } from 'formik'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'



type CatalogosType = {
    Seguridad: IOidc
}

const CerrarBalance = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        cerrado: true
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsUsuario: any[] = []
    const OptionsSucursal: any[] = []
    const OptionsCuenta: any[] = []
    const OptionsBoveda: any[] = []


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
        OptionsUsuario,
        OptionsSucursal,
        OptionsCuenta,
        OptionsBoveda

    })

    const styles = {
        div2: {
            "width": "60px",
            "height": "25px",
            "left": "-.5rem",
            "position": "relative"
        },
        div3: {
            'aling': '20px',
        }
    }


    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    if (respuesta.balanceID !== undefined) {
                        console.log(respuesta);
                        setState(s => ({ ...s, Cargando: false, Error: false, Datos: [respuesta] }))
                    } else {
                        setState(s => ({ ...s, Cargando: false, Error: false, Datos: [] }))
                    }
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }



    const Columns = React.useMemo(() => {

        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'balanceID', sortable: true, },
                { name: 'Clave', selector: 'clave', sortable: true, },
                { name: 'Fecha Creación', selector: 'fechaCreacion', sortable: true, format: (r) => r.fechaCreacion && new Date(r.fechaCreacion).toLocaleDateString() },
                {
                    name: 'Estatus',
                    selector: 'estatus',
                    sortable: true,
                    //cell: (props) => <span>{props.estatus ? "Activo" :  "Inactivo"}</span>
                    cell: (props) => <span>{props.estatus ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name: 'Cerrado',
                    selector: 'cerrado',
                    sortable: true,
                    //cell: (props) => <span>{props.estatus ? "Activo" :  "Inactivo"}</span>
                    cell: (props) => <span>{props.cerrado ? <FaCircle color="green" title="Cerrado" /> : <FaCircle color="red" title="Abierto" />}</span>
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [props.Seguridad])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        console.log(state.DatosMostrar)

        console.log(state.Datos)

        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])


    /** funcion para cerrar balance */

    const cbCerrar = () => {
        toast.success('El Balance se cerró correctamente')
        setState(state => ({ ...state, Datos: [], Form: { ...state.Form, Mostrar: false } }))

    }


    const cbGenerar = () => {
        toast.success('El balance se generó correctamente')
        let generarBalance: any = {
            cerrado: false
        }
        Funciones.FNAdd(props.Seguridad, generarBalance)
            .then((respuesta: any) => {
                FNGetLocal()
            })
            .catch((error: any) => {
                alert("Error al generar el balance" + JSON.stringify(error))

            })
        setState(state => ({
            ...state, Datos: [...state.Datos],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    cerrado: true
                }
            }
        }))
    }



    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    return (
        <div className="row">
            <div className="mt-lg-5 p-3">
                <Card Title="Cierre de Balance">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&

                                <div>
                                    <Formik
                                        initialValues={{}}
                                        onSubmit={(values: any) => { }}>

                                        <div className="row">
                                            <div className="col-10">
                                                <div >
                                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr" >
                                                        <label className="form-check-label" htmlFor={"cerrar"} >Abrir/Cerrar</label>
                                                        <Field disabled={false} type="checkbox" className="form-check-input" id={"cerrar"} name={"cerrar"} style={styles.div2} title="Seleccione para cerrar balance"
                                                            onChange={(value: any) => {

                                                                if (state.Datos.length === 0) {
                                                                    toast.error("No existe un balance abierto, por favor generar uno nuevo")
                                                                } else {
                                                                    setState({ ...state, Form: { ...state.Form, Mostrar: true } })
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <ErrorMessage component="div" name={"cerrar"} className="text-danger" />
                                                </div>
                                            </div>


                                            <div className="col-2">
                                                <button className="ms-2 btn btn-primary waves-effect waves-light" type="button" onClick={() => cbGenerar()}><FiRefreshCcw />   Generar Balance</button>
                                            </div>

                                        </div>
                                    </Formik>




                                    <DataTable
                                        subHeader

                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"bovedaId"}
                                        defaultSortField={"bovedaId"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {"Cerrar Balance"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbCerrar={cbCerrar}
                                                fnCancelar={fnCancelar}
                                                options={state.OptionsUsuario}
                                                options2={state.OptionsSucursal}
                                                options3={state.OptionsCuenta}
                                                options4={state.OptionsBoveda}


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

export default connect(mapStateToProps, mapDispatchToProps)(CerrarBalance)
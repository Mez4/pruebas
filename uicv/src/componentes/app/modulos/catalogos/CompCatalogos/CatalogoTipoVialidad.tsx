import React from 'react'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { connect } from 'react-redux'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as Funciones from './CatalogoTipoVialidad/Funciones'
import DataTable from 'react-data-table-component'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt } from 'react-icons/fa'

// Custom components
import { Card } from '../../../../global'
import { CForm } from './CatalogoTipoVialidad/CForm'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoTipoVialidad = (props: CatalogosType) => {

    const DatosDefecto = { vialidadTipo: '' }
    const Datos: any[] = []
    const [state, setState] = React.useState({
        Datos,
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })
    React.useEffect(() => {

        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                console.log(respuesta)
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
            })
            .catch(error => {
                console.log("Error: ", error)
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            })

    }, [])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { vialidadTipo: '' } } })
    }


    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.vialidadTipoId === item.vialidadTipoId ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { vialidadTipo: '' } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar tipos de Vialidades">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <span>Cargando...</span>}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {state.Datos.length > 0 &&
                                <div>
                                    <div className="text-end">
                                        <button type="button" className="btn btn-secondary btn-sm mb-2"
                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                    <DataTable
                                        data={state.Datos}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"vialidadTipoId"}
                                        defaultSortField={"vialidadTipoId"}
                                        columns={[
                                            {
                                                name: 'Id',
                                                selector: 'vialidadTipoId',
                                                sortable: true,
                                            },
                                            {
                                                name: 'Tipo',
                                                selector: 'vialidadTipo',
                                                sortable: true,
                                            },
                                            {
                                                name: 'Acciones',
                                                sortable: false,
                                                cell: (props) =>
                                                    <button className="asstext" type={"button"} onClick={() => {
                                                        setState({
                                                            ...state,
                                                            Form: {
                                                                ...state.Form, Mostrar: true,
                                                                Datos: { vialidadTipo: props.vialidadTipo },
                                                                Id: props.vialidadTipoId
                                                            }
                                                        })
                                                    }}>
                                                        <FaPencilAlt />
                                                    </button>
                                            },
                                        ]}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Tipo Vialidad</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />}
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
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoTipoVialidad)

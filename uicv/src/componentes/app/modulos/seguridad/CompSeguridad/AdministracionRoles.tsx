import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'

// import { DataGrid } from '@mui/x-data-grid';

/* import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles'; */



// Link
import { Link } from 'react-router-dom'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaTrash } from 'react-icons/fa'
import { FiRefreshCcw } from 'react-icons/fi'
import { GiHouseKeys } from 'react-icons/gi'

// Custom components
import { FiltrarDatos } from '../../../../../global/functions'

// Componentes
import { Card, Spinner } from '../../../../global'
import { iUI } from '../../../../../interfaces/ui/iUI'
import { DBConfia_Seguridad } from '../../../../../interfaces_db/DBConfia/Seguridad'
import axios from 'axios'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../global/variables'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormaAgregar } from './CompAdministracionRoles'
import { toast } from 'react-toastify'
/* import { Button, Typography } from '@mui/material'
 */
type AdministracionUsuariosType = {
    oidc: IOidc,
    ui: iUI
}
const AdministradorRoles = (props: AdministracionUsuariosType) => {

    // Controll our mounted state
    let isMounted = React.useRef(true)

    // Eliminamos un rol (Confirmar)
    const FNEliminar = async (rol: DBConfia_Seguridad.IRoles) => {

        // Generamos el gestor de alertas
        const MySwal = withReactContent(Swal)

        // Mostramos el dialogo de confirmación
        MySwal.fire({
            html:
                <div className='text-center my-2'>
                    <p className='is-size-5'>¿Desea continuar eliminando el rol <strong>{rol.Nombre}</strong>?</p>
                    <p className='is-size-7'>Esta accion eliminara el rol y todos los usuarios perderan los permisos relacionados al mismo</p>
                    <p><strong>Esta accion no es reversible</strong></p>
                    <p><strong>{MySwal.isLoading}</strong></p>
                </div>,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'No',
            confirmButtonText: 'Eliminar',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: async () => {

                // Hacemos la petición a servidor para eliminar el rol con sus permisos
                try {
                    let respuesta = await axios.delete(`${GetServerUrl()}Sistema/Roles/${rol.RolID}`, GenerarCabeceraOIDC(props.oidc))
                    return respuesta.data
                }
                catch {
                    MySwal.showValidationMessage('Ocurrio un error al eliminar el rol')
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    html:
                        <div className='text-center my-2'>
                            <p className='is-size-5'>Eliminado</p>
                            <p className='is-size-7'>El rol ha sido eliminado, valide el acceso a las pantallas de los usuarios</p>
                        </div>,
                    icon: 'success'
                })

                await FNGetLocal()
            }
        })
    }
   /*  // SE CREA UN TEMA DE MUIX
    const theme = createTheme();
    // COLUMNAS DE LIBRERIA MUIX
    const columnsMuix: GridColDef[] = [
        {
            field: 'RolID',
            headerName: 'Id',
            width: 150,
            type: 'number'
        },
        {
            field: 'Nombre',
            headerName: 'Nombre',
            editable: false
        },
        {
            field: 'Descripcion',
            headerName: 'Descripcion',
            editable: false
        },
        {
            field: 'RequiereProducto',
            headerName: 'R.Producto',
            editable: false
        },
        // {
        //     field : 'Nombre',
        //     headerName : 'Nombre',
        //     editable : false
        // },
    ]; */

    const rows = [
        { RolID: 1, Nombre: 'Snow', Descripcion: 'Jon', RequiereProducto: 'Hola' },
        { RolID: 2, Nombre: 'Lannister', Descripcion: 'Cersei', RequiereProducto: 'Hola' },
        { RolID: 3, Nombre: 'Lannister', Descripcion: 'Jaime', RequiereProducto: 'Hola' },
        { RolID: 4, Nombre: 'Stark', Descripcion: 'Arya', RequiereProducto: 'Hola' },
        { RolID: 5, Nombre: 'Targaryen', Descripcion: 'Daenerys', RequiereProducto: 'Hola' },
        { RolID: 6, Nombre: 'Melisandre', Descripcion: null, RequiereProducto: 'Hola' },
        { RolID: 7, Nombre: 'Clifford', Descripcion: 'Ferrara', RequiereProducto: 'Hola' },
        { RolID: 8, Nombre: 'Frances', Descripcion: 'Rossini', RequiereProducto: 'Hola' },
        { RolID: 9, Nombre: 'Roxie', Descripcion: 'Harvey', RequiereProducto: 'Hola' },
    ];
    // Define the columns
    let Columns: IDataTableColumn[] = [
        { name: 'Id', selector: 'RolID', sortable: false, grow: 0 },
        { name: 'Nombre', selector: 'Nombre', sortable: false, grow: 1 },
        { name: 'Descripcion', selector: 'Descripcion', sortable: false, grow: 1 },
        { name: 'R.Producto', selector: 'RequiereProducto', sortable: false, grow: 0, cell: (cprops) => <React.Fragment>{cprops.RequiereProducto ? <span>Si</span> : <span>No</span>}</React.Fragment> },
        { name: 'Icono', selector: 'Icono', sortable: false, grow: 0, cell: (cprops) => <i className={cprops.Icono}></i> },
        {
            name: 'Acciones', sortable: false, grow: 0, cell: (cprops) =>
                <span>
                    <FaTrash title='Eliminar Rol' className='mx-1' style={{ cursor: 'pointer', color: 'darkred' }} onClick={() => FNEliminar(cprops)} />
                    <FaPencilAlt title='Eliminar Rol' className='mx-1' style={{ cursor: 'pointer' }} onClick={() => FNEditar(cprops)} />
                    <Link title='Adminsitrar permisos' className={`has-text-dark ml-1`} to={`/app/seguridad/roles/${cprops.RolID}`}><GiHouseKeys size={16} /></Link>
                </span>
        }
    ]

    // Basic variables
    const [state, setState] = React.useState({
        Roles: undefined as DBConfia_Seguridad.IRoles[] | undefined,
        RolesMostrar: [] as DBConfia_Seguridad.IRoles[],
        Filtro: '',
        Cargando: true,
        Error: false,
        FormaAgregar: false,
        FormaEditar: false,
        Item: undefined as DBConfia_Seguridad.IRoles | undefined,
    })

    // #################################################
    // Effectos de la forma
    // >>

    // Consulta de los roles
    const FNGetLocal = async () => {

        // Cambiamos el estado de la aplicación
        setState(s => ({ ...s, Cargando: true, Error: false, Roles: [] }))

        // Try...
        try {

            // Obtenemos todos los usuarios de la aplicación
            let Roles: DBConfia_Seguridad.IRoles[] = (await axios.get(`${GetServerUrl()}sistema/Roles`, GenerarCabeceraOIDC(props.oidc))).data

            // Definimos el estado
            if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Roles, RolesMostrar: FiltrarDatos(Roles, Columns, state.Filtro) as DBConfia_Seguridad.IRoles[] }))
            }
        }
        catch {
            if (isMounted.current === true)
                setState(s => ({ ...s, Cargando: false, Error: true, Roles: [] }))
        }
    }

    // On use effect
    React.useEffect(() => {
        const query = async () => { await FNGetLocal() }
        query()
        // eslint-disable-next-line
    }, [])

    // On use effect
    // eslint-disable-next-line
    React.useEffect(() => setState(s => ({ ...s, RolesMostrar: FiltrarDatos(s.Roles ?? [], Columns, state.Filtro) })), [state.Roles, state.Filtro])

    // <<
    // Effectos de la forma
    // #################################################

    // #################################################
    // Funciones de la pagina
    // >>

    /** funcion Callback al agregar un item */
    const cbAgregar = (Item: DBConfia_Seguridad.IRoles) => {
        toast.success("Rol agregado")
        setState(s => ({ ...s, Roles: [...s.Roles ?? [], Item], FormaAgregar: false, Item: undefined }))
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (Item: any) => {
        setState(s => ({ ...s, Roles: (s.Roles ?? []).map(Rol => Rol.RolID === Item.RolID ? Item : Rol) }))
        FNCancelar()
    }

    // <<
    // Funciones de la forma de agregar
    // #################################################

    // #################################################
    // Funciones de formas
    // >>

    /** funcion para cancelar */
    const FNCancelar = () => setState(s => ({ ...s, FormaAgregar: false, FormaEditar: false, FormaDesbloqueo: false, FormaConfirmar: false, FormaMembresias: false, item: undefined }))

    /** funcion para agregar */
    const FNAgregar = () => setState(s => ({ ...s, FormaAgregar: true, Item: undefined }))

    /** funcion para bloquear */
    const FNEditar = (Item: DBConfia_Seguridad.IRoles) => setState(s => ({ ...s, FormaEditar: true, Item }))

    // <<
    // Funciones de formas
    // #################################################

    // Regresamos el componente
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Roles y permisos">
                    <Card.Body>
                        {state.Cargando && <Spinner />}
                        {state.Error && <span>Error al cargar los datos...</span>}
                        {!state.Cargando && !state.Error &&
                             <div>
                              
                                  {/* <ThemeProvider theme={theme}>
                                    <div className="" style={{height :400, width : '100%'}}>
                                    <Typography variant="h1">Hola Mundo</Typography>
                                <Button color="secondary">
                                    Click Me
                                </Button>
                                     
                                        
                                    </div>
                                </ThemeProvider> */}
                                <DataTable
                                    subHeader
                                    subHeaderComponent=
                                    {
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="input-group mb-3">
                                                    <input type="text" className="form-control" placeholder="Busqueda de roles" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                    <span className="input-group-text"><FaSearch /> </span>
                                                    <button title={'Agregar rol'} className="btn btn-outline-secondary" type="button" onClick={FNAgregar}><FaPlus /></button>
                                                    <button className="btn btn-outline-secondary" type="button" onClick={FNGetLocal}><FiRefreshCcw /></button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    data={state.RolesMostrar ?? []}
                                    striped
                                    pagination
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"ViviendaTipoId"}
                                    defaultSortField={"ViviendaTipo"}
                                    columns={Columns}
                                />
                            </div> 
                        }
                    </Card.Body>
                </Card>
                <FormaAgregar oidc={props.oidc} cbActualizar={cbActualizar} cbGuardar={cbAgregar} fnCancelar={FNCancelar} mostrar={state.FormaAgregar || state.FormaEditar} Item={state.Item} />
            </div>
        </div>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AdministradorRoles)
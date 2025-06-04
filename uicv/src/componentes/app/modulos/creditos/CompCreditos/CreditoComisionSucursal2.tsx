import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoComisionSucursal2/Funciones'
import * as FnProductos from './CreditoProducto/Funciones'
import * as FnComisiones from './CreditoComision/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaFilter, FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { ActionSelect, Card } from '../../../../global'
import { CForm } from './CreditoComisionSucursal2/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Formik, Form } from 'formik'
import * as Yup from 'yup';
import Select from 'react-select'
import moment from 'moment'

type CatalogosType = {
    oidc: IOidc,
}

const CreditoComisionSucursal2 = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        ProductoID: 0,
        ComisionesID: 0,
        SucursalId:0,
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optProductos: any[] = []
    const optComisiones: any[] = []
    const optComisionesFiltro: any[] = []
    const optSucursales: any[] = []
    const optSucursalesFiltro: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Filtro2: false,
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            ProductoID: undefined,
            SucursalId: undefined,
        },
        optProductos,
        optComisiones,
        optComisionesFiltro,
        optSucursales,
        optSucursalesFiltro,
        isUpdate: false
    })
    const [loading, setLoading] = React.useState(false)


    const FNGetLocal = (valor1: any, valor2: any, valor3: any) => {
        let a= {
            ProductoID: valor1,
            SucursalID: valor2,
            ComisionesID: valor3,
        }
        //setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc, a)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Datos: respuesta, Filtro2: true }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false,Datos: [], Filtro2: false }))
                // }
            })
    }

    const FnGetProductos = () => {
        FnProductos.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var productos = respuesta.map((valor: any) => {
                    var obj = { value: valor.ProductoID, label: `ID: ${ valor.ProductoID } - Empresa: ${ valor.EmpresaNombre } - Producto: ${valor.Producto}` };
                    return obj
                });

                setState(s => ({ ...s, optProductos: productos }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optProductos: [] }))
                // }
            })
    }

    const FnGetComisiones = (ProductoID?: number) => {
        FnComisiones.FNGetByProducto(props.oidc, ProductoID)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var comisiones = respuesta.map((valor: any) => {
                    var obj = { value: valor.ComisionesID, label: valor.Descripcion };
                    return obj
                });

                setState(s => ({ ...s, optComisiones: comisiones }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optComisiones: [] }))
                // }
            })
    }

    const FnGetComisionesFiltro = (ProductoID?:number) => {
        FnComisiones.FNGetComisionesFiltro(props.oidc, ProductoID)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var comisiones = respuesta.map((valor: any) => {
                    var obj = { value: valor.ComisionesID, label: valor.Descripcion };
                    return obj
                });

                setState(s => ({ ...s, optComisionesFiltro: comisiones }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optComisionesFiltro: [] }))
                // }
            })
    }
    const FnGetSucursalesFiltro = (ProductoID?: number) => {
        FnSucursales.FNGetProd(props.oidc, ProductoID)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    return obj
                });

                setState(s => ({ ...s, optSucursalesFiltro: sucursales }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optSucursalesFiltro: [] }))
                // }
            })
    }

    const FnGetSucursales = () => {
        FnSucursales.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    return obj
                });

                setState(s => ({ ...s, optSucursales: sucursales }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optSucursales: [] }))
                // }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Empresa', selector: 'empresaNombre', sortable: true, wrap:true},
                { name: 'Producto', selector: 'Producto', sortable: true, wrap:true},
                { name: 'Sucursal', selector: 'Nombre', sortable: true, wrap: true,},
                { name: 'Comision', selector: 'Descripcion', sortable: true, wrap: true, },
                { name: 'Registró', selector: 'UsuarioRegistro', sortable: true, wrap: true, },
                { name: 'Fecha Registro', selector: 'RegistroFecha', sortable: true, wrap: true, center: true, width: '110px', cell: (props) => <span>{moment(props.RegistroFecha).format('DD/MM/YYYY')}</span>},
                { name: 'Modificó', selector: 'UsuarioModifica', sortable: true, wrap: true, },
                { name: 'Fecha Modificación', selector: 'ModificaFecha', sortable: true, wrap: true,center: true,width:'110px', cell: (props) => <span>{moment(props.ModificaFecha).format('DD/MM/YYYY')}</span>},
                {
                    name: 'Acciones', sortable: false, center: true, width:'60px',
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form,
                                    Mostrar: true,
                                    Datos: {
                                        ProductoID: props.ProductoID,
                                        SucursalId: props.SucursalId,
                                        ComisionesID: props.ComisionesID,
                                    },
                                    ProductoID: props.ProductoID,
                                    SucursalId: props.SucursalId,
                                },
                                isUpdate: true
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            FnGetProductos()
              FnGetSucursales()
              FnGetComisionesFiltro()
              FnGetSucursalesFiltro()
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    React.useEffect(() => {
        FnGetComisiones(state.Form.ProductoID)
    }, [state.Form.ProductoID])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    //const refSucursal = useRef<CreatableSelect<{ value: string; label: string; }, false>>(null)
    const refSucursal = useRef<Select>(null)
    const refComision = useRef<Select>(null)

    const clearFormByLevel = (level: number) => {
        if (level === 0) {
            //const sucursal: any = refSucursal.current?.select
            refSucursal.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
            refComision.current?.select.setValue({ value: '0', label: '' }, "deselect-option")

            //sucursal.select.clearValue()
        }
        if (level === 0 || level === 1 || level === 2 || level === 3) {

        }
    }

    const cbProducto = (value: any) => {
        clearFormByLevel(0)
        FnGetComisionesFiltro(value)
        FnGetSucursalesFiltro(value)
    }

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) =>
        setState({
            ...state, Datos: [...state.Datos, item], Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }, isUpdate: false
        })

 
    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState(s => ({
            ...s, Datos: state.Datos.map(Dato => Dato.ProductoID === item.ProductoID && Dato.SucursalId === item.SucursalId ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }, isUpdate: false
        }))

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Relaciones Sucursales - Comisiones">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                            initialValues={{
                                ProductoID:0,
                                SucursalID:0,
                                ComisionesID:0
                            }}
                            enableReinitialize
                            validationSchema={
                                Yup.object().shape({

                                })}
                            onSubmit={(values: any) => {
                                setLoading(true)
                                setState(s => ({ ...s, Cargando: true}))
                                FNGetLocal(values.ProductoID, values.SucursalID, values.ComisionesID)
                            }}>
                            {({ values }) => (
                                <Form>
                                    <div className="columns is-centered is-mobile is-multiline">
                                        <div className="column is-full-desktop is-full-mobile is-full-tablet" style={{ backgroundColor: '#F7F7F7', padding: '2em', borderRadius: '15px' }}>
                                            <div>
                                                <div style={{ float: 'left' }}><FaFilter /></div>
                                                <div ><label> FILTROS</label></div>
                                            </div>

                                            <div className="row" style={{ textAlign: 'initial' }}>

                                                <div className="column is-one-third-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                <ActionSelect
                                                        disabled={false}
                                                        label="Productos"
                                                        name="ProductoID"
                                                        placeholder="Seleccione el Producto"
                                                        options={state.optProductos}
                                                        valor={values.ProductoID}
                                                        addDefault={true}
                                                        accion={cbProducto}
                                                        //accion2={FnGetSucursalesFiltro}
                                                    />                                                   
                                                     </div>
                                                    <div className="column is-one-third-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                    <ActionSelect
                                                        disabled={false}
                                                        label="Sucursales"
                                                        name="SucursalID"
                                                        placeholder="Seleccione la Sucursal"
                                                        options={state.optSucursales}
                                                        addDefault={true}
                                                        valor={values.SucursalID}
                                                        ref={refSucursal}
                                                    />
                                                    </div>
                                                    <div className="column is-one-third-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                    <ActionSelect
                                                        disabled={false}
                                                        label="Comisiones"
                                                        name="ComisionesID"
                                                        placeholder="Seleccione la Comisión"
                                                        options={state.optComisionesFiltro}
                                                        addDefault={true}
                                                        valor={values.ComisionesID}
                                                        ref={refComision}
                                                    />
                                                    </div>
                                                </div>

                                                <div className="text-end column is-12-mobile is-12-tablet is-12-desktop mt-3">
                                                    <div className="text-end">
                                                    <button disabled={false} type="submit" className="btn btn-primary waves-effect waves-light">
                                                        <span className="">Buscar</span>&nbsp;<FiRefreshCcw />
                                                        
                                                    </button>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>

                           
                            <div className="columns is-centered is-mobile is-multiline">
                            {state.Cargando}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                    <DataTable
                                        subHeader
                                        noDataComponent={<div>No hay datos</div>}
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar sucursal comisión" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => {
                                                                setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, ProductoID: undefined, SucursalId: undefined }, isUpdate: false })
                                                            }
                                                            }
                                                        ><FaPlus /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        responsive
                                        keyField={"ProductoID"}
                                        defaultSortField={"ProductoID"}
                                        columns={Columns}
                                    />}
                                    {/* <CustomActionSelect
                                        disabled={true} // props.Id=== undefined? false : true
                                        label="Nombre de sucursal "
                                        name="Nombre_suc"
                                        placeholder="Nombre de sucursal" options={[]} addDefault={false}
                                    /> */}
                                    <ModalWin open={state.Form.Mostrar} large={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {(state.Form.ProductoID && state.Form.SucursalId) ? "Editar Relación Sucursal - Comisión" : "Agregar Relación Sucursal - Comisión"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                ProductoID={state.Form.ProductoID}
                                                SucursalId={state.Form.SucursalId}
                                                optProductos={state.optProductos}
                                                optComisiones={state.optComisiones}
                                                optSucursales={state.optSucursalesFiltro}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                fnGetComisiones={FnGetComisiones}
                                                isUpdate={state.isUpdate} />
                                        </ModalWin.Body>
                                    </ModalWin>
                            
                            </div>
                            </Form>
                            )}
                            </Formik>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoComisionSucursal2)
import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { Card, CustomFieldDatePicker } from '../../../../global'
import { IOidc } from '../../../../../interfaces/oidc/IOidc';
import { iUI } from '../../../../../interfaces/ui/iUI';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
// import * as Funciones from './Funciones'
import * as Funciones from '../../../modulos/archivo/CompArchivo/InfoPersona/Funciones'
// import * as Funciones from './Funciones'
import { Form, Formik } from 'formik';
// Obtencion de scripts o variables necesarias para minimizar el codigo por pagina
import { HeadersColumns } from './CreditoCobranzaGlobal/scripts'
import { toast } from 'react-toastify';
import { CustomFieldText, Spinner, CustomSelect } from '../../../../global';
import moment from 'moment';

type CreditoCobranzaGlobalType = {
    oidc: IOidc,
    ui: iUI, 
}
 
function CreditoCobranzaGlobal(props: CreditoCobranzaGlobalType) 
{ 
    const [state, setState] = useState<{ data: any[]; loading: boolean }>({ data: [], loading: false });
    const [loading, setLoading] = React.useState(false)
     
     
    // Estructura de las columnas de una tabla
    const Columns = React.useMemo(() => {
        let HeadersColumns: IDataTableColumn[] =
            [
                { name: 'MovimientoID', selector: 'MovimientoID', sortable: true, },
                { name: 'FechaAfectacion', selector: 'FechaAfectacion', sortable: true, width: '6%', cell: (props) => <span>{props.FechaAfectacion ? moment(props.FechaAfectacion).format('DD/MM/YYYY') : ''}</span> }, 
                { name: 'FechaDelMovimiento', selector: 'FechaDelMovimiento', sortable: true, width: '6%',cell: (props) => <span>{props.FechaDelMovimiento ? moment(props.FechaDelMovimiento).format('DD/MM/YYYY')  : ''}</span> },  
                { name: 'Cuenta', selector: 'Cuenta', sortable: true, width: '4%',} ,
                { name: 'NombreCuenta', selector: 'NombreCuenta', sortable: true, 
                    cell: (props) => {
                        const nombreCuenta = props.NombreCuenta ? props.NombreCuenta.replace('Cuenta:', '') : '';
                        return <span>{nombreCuenta}</span>;
                    }
                },
                { name: 'Observaciones', selector: 'Observaciones', sortable: true,width: '8%' },
                { name: 'DistribuidorID', selector: 'DistribuidorID', sortable: true, }, 
                { name: 'ReferenciaDistribuidor', selector: 'ReferenciaDistribuidor', sortable: true, width: '9%' }, 
                { name: 'SucursalCartera', selector: 'SucursalCartera', sortable: true, },
                { name: 'No Cda', selector: 'NoCda', sortable: true, },
                { name: 'Cve Cli', selector: 'CveCli', sortable: true, }, 
                { name: 'Plazo', selector: 'Plazo', sortable: true, },
                { name: 'Nombre Cliente', selector: 'NombreCliente', sortable: true,  width: '8%'},
                { name: 'Capital', selector: 'Capital', sortable: true, },
                { name: 'Interes', selector: 'Interes', sortable: true, },
                { name: 'Manejo Cuenta', selector: 'ManejoCuenta', sortable: true, },
                { name: 'IVA', selector: 'IVA', sortable: true, },
                { name: 'Seguro', selector: 'Seguro', sortable: true, },
                { name: 'Cargo', selector: 'Cargo', sortable: true, },
                { name: 'ImporteTotal', selector: 'ImporteTotal', sortable: true, },
                { name: 'TipoCreditoID', selector: 'TipoCreditoID', sortable: true, },
                { name: 'Descripcion', selector: 'Descripcion', sortable: true,width: '6%' },
 
            ]
        return HeadersColumns
    }, [])
  
     // Inicialización de valores
     const initialValues = {
        FechaInicio: '',  // Puedes establecer un valor por defecto aquí
        FechaFin: '',     // Puedes establecer un valor por defecto aquí
    };

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Cobranza Global 264">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik 
                               initialValues={{
                                FechaInicio: new Date(),
                                FechaFin:new Date(),
                            }}
                                onSubmit={(values: { FechaInicio: Date; FechaFin: Date }) => { 

                                    setState({ data: [], loading: true }); // Resetear data y cargar
                                    setLoading(true)

                                    // Se da formato YYYY-MM-DD a string
                                    const fechaInicio = values.FechaInicio.toISOString().split('T')[0]; 
                                    const fechaFin = values.FechaFin.toISOString().split('T')[0];
                                 
                                    Funciones.FNCobranzaGlobal(props.oidc, {
                                        FechaInicio: fechaInicio,
                                        FechaFin: fechaFin,
                                    })
                                    .then((respuesta) => { 
                                        console.log('RESPUESTA',respuesta)
                                        const data = respuesta as any[];

                                        setState({ data: respuesta as any[], loading: false }); // Conversión a any[]

                                        if(data.length === 0)
                                        {
                                            toast.info("No se encontraron datos."); // Muestra un mensaje si no hay datos
                                        } 
                                        else 
                                        {
                                            toast.success("Los datos se cargaron correctamente."); // Mensaje si hay datos
                                        }
                                        setLoading(false)  
                                    })
                                    .catch((error) => {
                                        setState(prevState => ({ ...prevState, loading: false }));
                                        toast.error("Error al cargar los datos");
                                        setLoading(false)
                                    });                     
                                }}> 
                           
                                <Form>
                                    <div className='columns is-desktop'>
                                        <div className="column is-6-desktop">
                                            <CustomFieldDatePicker
                                                disabled={state.loading}
                                                label='Fecha inicio'
                                                name='FechaInicio'
                                            />
                                        </div>
                                        <div className="column is-6-desktop">
                                            <CustomFieldDatePicker
                                                disabled={state.loading}
                                                label='Fecha fin'
                                                name='FechaFin'
                                            />
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <button
                                            disabled={state.loading}
                                            className='button is-success'
                                            type="submit"
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                            <DataTable
                                columns={Columns}
                                data={state.data}
                                responsive
                                pagination
                            />
                             {loading && <Spinner />}
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}
 


 
const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

export default connect(mapStateToProps, {})(CreditoCobranzaGlobal)
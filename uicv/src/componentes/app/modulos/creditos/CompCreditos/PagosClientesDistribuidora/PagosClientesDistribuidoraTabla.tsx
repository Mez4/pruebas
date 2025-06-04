import React,{useRef, useState, useEffect} from 'react';
import {IOidc } from '../../../../../../interfaces/oidc/IOidc';
import { iUI } from '../../../../../../interfaces/ui/iUI';
import * as Funciones from './Funciones';
// LIBRERIA PARA USAR LA TABLA
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";

type PagosClientesDistribuidoraTablaTipo = {
    // LO QUE RECIBO CUANDO UTILIZO EL COMPONENTE
    oidc: IOidc
    DistribuidorID: number,
    ui: iUI
}
const PagosClientesDistribuidoraTabla = ({oidc, DistribuidorID, ui} : PagosClientesDistribuidoraTablaTipo) => {
    // MONITOREAMOS QUE EL COMPONENTE ESTE MONTADO 
    var isMounted = useRef(true);
    // DECLARAMOS UN ARREGLO VACIO DE LA SOCIA
    const dataPartner: any[] = [];
    // DECLARAMOS UN ARREGLO VACIO DE LOS PAGOS DE LOS CLIENTES DE LA SOCIA
    const dataClients: any[] = [];
    // ESTADO DE LAS VARIABLES
    const [ information, setInformation ]  = useState({
        dataPartner,
        dataClients,
        loading : false,
        errorQuery : false
    });

    // FUNCION QUE SE ALTERARA AL MOMENTO DE LLAMARSE
    const FNgetAcumulated = () => {
        setInformation(s => ({...s , loading : false}));
        Funciones.FNObtenerEstadoSocia(oidc, DistribuidorID)
            .then((res :any) => {
                if (isMounted.current === true) 
                    setInformation(s => ({...s , dataClients : res}))
            }).catch(err => {
                if (isMounted.current === true )
                    setInformation(s => ({...s, errorQuery : true}))
            })
    }

    // SE DEFINE EL CAMBIO DE ESTADO DEL COMPONENTE
    useEffect(() => {
        FNgetAcumulated();
    }, [DistribuidorID]);   

    if (!information.errorQuery) {
        return (
            <div className="container">
                <div className="d-flex justify-content-center">
                    <DataTable 
                        value={information.dataClients} 
                        paginator
                        dataKey='id'
                        >
                        <Column field='currentBalance' header='Saldo actual'></Column>
                        <Column field='overdueBalance' header='Saldo atrasado'></Column>
                        <Column field='daysLate' header='Dias de atraso'></Column>
                        <Column field='lateDeadlines' header='Plazos en atraso'></Column>

                    </DataTable>
                </div>
            </div>
        )
    }
    return null
}
export default PagosClientesDistribuidoraTabla;
import { useState, useMemo, useEffect } from "react";
import DataTable, { IDataTableColumn } from 'react-data-table-component'

type ComparativaSemaforosType = {
    data: {
        Anticipada: any[],
        Puntual: any[],
        Tardia: any[],
        Final: any[],
        Mora: any[]
    },
    loading: boolean
}

export default function SemaforoCobranza(props: ComparativaSemaforosType) {
    const [state, setState] = useState({ Anticipada : [{}], Puntual: [{}], Tardia: [{}], Final: [{}], Mora: [{}] });

    function obtenerDatosSemaforos() {
        const anticipada: any[] = [], puntual: any[] = [], tardia: any[] = [], final: any[] = [], mora: any[] = [];
        props.data.Final.map((element:any) => {
            if(Boolean(element.Final)) {
               final.push(element);
            }
        });
        props.data.Tardia.map((element:any) => {
            if(Boolean(element.Tardia)) {
                tardia.push(element);
            }
        });
        props.data.Puntual.map((element:any) => {
            if(Boolean(element.Puntual)) {
                console.log("PUNTUAL", element)
               puntual.push(element)
            }
        });
        props.data.Anticipada.map((element:any) => {
            if(Boolean(element.Anticipada)) {
                anticipada.push(element);
            }
        });
        props.data.Mora.map((element:any) => {
            if(Boolean(element.Mora)) {
            console.log("ELEMNTORRR", element)
                mora.push(element);
            }
        });

        setState(s => ({ ...s, anticipada: anticipada, puntual: puntual, tardia: tardia, final: final, mora: mora }))
    }

    useEffect(() => {
        obtenerDatosSemaforos()
    }, [props.loading])

    return (
        <>
            <h3 style={{ textAlign: "center" }}> SEMAFORO CORTE PASADO </h3>
            <div className="columns">
                <TablaSemaforo title="Semáforo anticipada" classname="is-6-desktop is-6-tablet" data={props.data.Anticipada} color="#78AC44" />
                <TablaSemaforo title="Semáforo puntual" classname="is-6-desktop is-6-tablet" data={props.data.Puntual} color="#C8E4B4" />
            </div>
            <div className="columns">
                <TablaSemaforo title="Semáforo tardía" classname="is-6-desktop is-6-tablet" data={props.data.Tardia} color="#FFC404" />
                <TablaSemaforo title="Semáforo final" classname="is-6-desktop is-6-tablet" data={props.data.Final} color="#FF3030" />
            </div>
            <div className="columns">
                <TablaSemaforo title="Semáforo mora" classname="is-full-desktop is-full-tablet" data={props.data.Mora} color="#1d1d1d" />
            </div>
        </>
    )
}

function TablaSemaforo(props: { title: string, color: string, classname: string, data: any[] }) {
    const Columns = useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Nombre de la socia',
                    selector: 'Distribuidor',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.Distribuidor}</span>
                },
                {
                    name: 'ID',
                    selector: 'DistribuidorID',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.DistribuidorID}</span>
                },
                {
                    name: 'Monto',
                    selector: 'Monto',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{(props.Monto)?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                /*     {
                        name: 'Pendiente',
                        selector: 'SaldoAtrasado',
                        sortable: true,
                        center: true,
                        cell: (props) => <span>{props.SaldoAtrasado?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                    }, */
                {
                    name: 'Atraso',
                    selector: 'DiasAtraso',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.DiasAtraso}</span>
                },
            ]
        return colRet
    }, [props.data])

    return (
        <div className={`table-container column ${props.classname} is-full-mobile`}>
            <DataTable
                subHeader
                subHeaderComponent={
                    <div style={{ width: "100%", background: props.color }}>
                        <h3 style={{ textAlign: "center", marginTop: 5, color: props.color == "#1d1d1d" ? "#FFFFFF" : "#1d1d1d" }}>{props.title}</h3>
                    </div>
                }
                noDataComponent={<h6>No hay datos para mostrar</h6>}
                columns={Columns}
                data={props.data}
                pagination
                paginationComponentOptions={{
                    noRowsPerPage: false, rowsPerPageText: 'Socias por página',
                    rangeSeparatorText: 'de',
                    selectAllRowsItem: false,
                    selectAllRowsItemText: 'Todos',
                }}
            />
        </div>
    )
}
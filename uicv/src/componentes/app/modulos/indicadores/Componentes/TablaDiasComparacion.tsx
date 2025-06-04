import { useState, useEffect } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';

export default function TablaDiasComparacion(props: { date: string, backgroundColor: string, data: any[], dataPasado: any[] }) {
    const [dias, setDias]: any[] = useState([]);

    const llenarArreglo = () => {
        const array: Date[] = [];
        const date: Date = props.date ? new Date(props.date) : new Date();

        for (let i = 1; i <= 13; i++) {
            const dateAux = date.setDate(date.getDate() + 1);
            array.push(new Date(dateAux));
        }

        setDias(array);
    }

    useEffect(() => {
        llenarArreglo();
    }, [props.date])

    return (
        <div className="columns">
            <div className="table-container column is-full-desktop is-full-tablet is-full-mobile">
                <table className="table is-bordered">
                    <thead>
                        <tr>
                            {dias.map((day, index) => (
                                <th key={index} style={{ backgroundColor: props.backgroundColor, textAlign: "center" }}>
                                    {day.getDate() >= 10 ? day.getDate() : `0${day.getDate()}`}/
                                    {day.getMonth() + 1 >= 10 ? day.getMonth() + 1 : `0${day.getMonth() + 1}`}/
                                    {day.getFullYear()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {props.data.map((item, index) => (
                                <td key={index} style={{ textAlign: "center" }}>
                                    {props.dataPasado[index] < item ? <AiOutlineArrowUp color='green' /> : props.dataPasado[index] != item ?? <AiOutlineArrowDown color='red' />}
                                    {item  < 1 ? "NA" : item.toLocaleString("en-US", { style: 'currency', currency: 'USD', })} -
                                    {
                                        props.dataPasado[index] != 0
                                            ? ((item * 100) / props.dataPasado[index]).toLocaleString('en-US')
                                            : "S/P"
                                    }%
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div >
    )
}
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { FormateoDinero } from '../../../../../../../global/variables';
import TIndicadorSP from './TIndicadorSP';

// Opciones para nuestro grafico
let options: ApexCharts.ApexOptions = {
    chart: {
        type: "pie",
        width: 380
    },
    labels: ['Puntual', 'Impuntual', 'Tardia', 'SinPago'],
    legend: {
        show: true,
        position: 'bottom'
    },
    dataLabels: {
        enabled: false,
        style: {
            colors: ["#000000"]
        },
        formatter: function (val, opts) {
            return `${opts.w.globals.labels[opts.seriesIndex]}: ${FormateoDinero.format(val as number)} %`;
        },
    }
}

const GraficaSociasPendientes = (props: { indicador: TIndicadorSP }) => {

    if (props.indicador.CobranzaPorDistribuidor__DiaCero.length > 0) {

        let Totales = props.indicador.CobranzaPorCoordinador__DiaCero[props.indicador.CobranzaPorCoordinador__DiaCero.length - 1]

        // Chart data
        let series = [
            Totales.Porc_CobranzaPP,
            Totales.Porc_CobranzaPI,
            Totales.Porc_CobranzaPT,
            Totales.Porc_CobranzaSP
        ]

        return (
            <ReactApexChart options={options} series={series} type="pie" width={"100%"} height={"350px"} />
        )
    }
    else return <h3>Sin datos para grafica</h3>
}

export default GraficaSociasPendientes
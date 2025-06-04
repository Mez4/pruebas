import React from 'react'

// Generate a tabs context and type
type AcordionContextType = {
    TabSelecionado: string,
    DefinirEstado(Estado: any): any
}
const AcordionContext = React.createContext<Partial<AcordionContextType>>({})

type TabType = {
    Identificador: string,
    Titulo: string | React.ReactElement,
    children: React.ReactElement
}
const Tab = ({ Identificador, Titulo, children }: TabType) => {
    return (
        <AcordionContext.Consumer>
            {(value) => {
                return (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                aria-controls={'tb_' + Identificador}
                                aria-expanded={Identificador === value.TabSelecionado}
                                data-bs-toggle="collapse"
                                onClick={() => {
                                    if (value.DefinirEstado) {
                                        if (value.TabSelecionado !== Identificador)
                                            value.DefinirEstado({ TabSelecionado: Identificador })
                                        else
                                            value.DefinirEstado({ TabSelecionado: '' })
                                    }
                                }}
                                className={`p-2 accordion-button ${Identificador === value.TabSelecionado ? '' : 'collapsed'}`}
                                type="button"
                            >
                                {Titulo}
                            </button>
                        </h2>
                        <div id={'tb_' + Identificador} className={`accordion-collapse collapse ${Identificador === value.TabSelecionado ? 'show' : '≈'}`}>
                            <div className="accordion-body">
                                {children}
                            </div>
                        </div>
                    </div>
                )
            }}
        </AcordionContext.Consumer>
    )
}

type AcordionType = {
    TabSelecionado: string,
    children: React.ReactElement<TabType>[] | React.ReactElement<TabType>
}
const Acordion = (props: AcordionType) => {

    const [Estado, DefinirEstado] = React.useState({ TabSelecionado: props.TabSelecionado })

    return (
        <AcordionContext.Provider value={{ TabSelecionado: Estado.TabSelecionado, DefinirEstado }}>
            <div className={'accordion'}>
                {props.children}
            </div>
        </AcordionContext.Provider>
    )
}

Acordion.Tab = Tab

export default Acordion
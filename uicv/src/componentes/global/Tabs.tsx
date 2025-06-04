import React from 'react'

// Generate a tabs context and type
enum TabsKind { DEFAULT = 'nav nav-tabs', JUSTIFY = 'nav nav-pills', CUSTOM = 'nav nav-tabs nav-tabs-custom' }
type TabsContextType = {
    TabSelecionado: string
}
const TabsContext = React.createContext<Partial<TabsContextType>>({})

type TabType = {
    Identificador: string,
    Titulo: string | React.ReactElement,
    children: React.ReactElement
}
const Tab = (props: TabType) => {
    return (
        <TabsContext.Consumer>
            {(value) => {
                return (
                    <div className={`tab-pane p-3 ${props.Identificador === value.TabSelecionado ? 'active' : ''}`} role="tabpanel">
                        {props.children}
                    </div>
                )
            }}
        </TabsContext.Consumer>
    )
}

type TabsType = {
    Kind: TabsKind,
    Justified: boolean,
    TabSelecionado: string,
    children: React.ReactElement<TabType>[] | React.ReactElement<TabType>
}
const Tabs = (props: TabsType) => {

    const [Estado, DefinirEstado] = React.useState({ TabSelecionado: props.TabSelecionado })

    return (
        <TabsContext.Provider value={{ TabSelecionado: Estado.TabSelecionado }}>
            <div>
                <ul className={`${props.Kind} ${props.Justified ? 'nav-justified' : ''}`} role="tablist">
                    {Array.isArray(props.children) && (props.children as React.ReactElement<TabType>[]).map((t, tId) =>
                        <li key={'tab__' + tId} className="nav-item">
                            <button onClick={() => DefinirEstado(e => ({ ...e, TabSelecionado: t.props.Identificador }))} className={`nav-link ${t.props.Identificador === Estado.TabSelecionado && 'active'}`} style={{ width: '100%' }} data-bs-toggle="tab" role="tab" aria-selected="false">
                                {t.props.Titulo}
                            </button>
                        </li>
                    )}
                    {!Array.isArray(props.children) &&
                        <li className="nav-item">
                            <button className={`nav-link ${(props.children as React.ReactElement<TabType>).props.Identificador === Estado.TabSelecionado && 'active'}`} data-bs-toggle="tab" role="tab" aria-selected="false">
                                {(props.children as React.ReactElement<TabType>).props.Titulo}
                            </button>
                        </li>
                    }
                </ul>
                <div className="tab-content">
                    {props.children}
                </div>
            </div>
        </TabsContext.Provider>
    )
}

Tabs.TabsKind = TabsKind
Tabs.Tab = Tab

export default Tabs
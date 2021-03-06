import './radio-sporsmal.less'

import { RadioPanelGruppe } from 'nav-frontend-skjema'
import { Systemtittel } from 'nav-frontend-typografi'
import React from 'react'

import { useAppStore } from '../../../data/stores/app-store'
import { RadioSpørsmålProps } from '../../../types/sporsmal'
import { utbetalingSpørsmålVerdier } from '../sporsmal-konstanter'

const RadioSporsmal = ({ tittel, name, spørsmålstekst, svaralternativer }: RadioSpørsmålProps) => {
    const { activeMegArbeidsgiver, setActiveMegArbeidsgiver } = useAppStore()

    const skrivEndringTilGlobalState = (nyValgt: string) => {
        if (name === utbetalingSpørsmålVerdier.NAME) {
            setActiveMegArbeidsgiver(nyValgt)
        }
    }

    return (
        <div className="horisontal-radio">
            <Systemtittel className="utbetaling-tittel">
                {tittel}
            </Systemtittel>
            <RadioPanelGruppe
                name={name}
                description={spørsmålstekst}
                radios={svaralternativer}
                checked={activeMegArbeidsgiver}
                onChange={(_, nyVerdi) => {
                    skrivEndringTilGlobalState(nyVerdi)
                }}
            />
        </div>
    )
}

export default RadioSporsmal

import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import React, { ReactElement, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { RouteParams } from '../../app'
import VidereKnapp from '../../components/knapper/videre-knapp'
import RadioSpørsmålUtbetaling from '../../components/sporsmal/radio-sporsmal/radio-sporsmal-utbetaling'
import { utbetalingSpørsmål, utbetalingSpørsmålVerdier } from '../../components/sporsmal/sporsmal-tekster'
import Vis from '../../components/vis'
import { post } from '../../data/fetcher/fetcher'
import { useAppStore } from '../../data/stores/app-store'
import { ArbeidsgiverInterface } from '../../models/arbeidsgiver'
import { Svaralternativ } from '../../models/sporsmal'
import env from '../../utils/environment'
import { logger } from '../../utils/logger'
import { gåTilNesteSide } from '../../utils/navigasjon'
import { arbeidsgiverNavnPlaceHolder, arbeidsgiverOrgNrPlaceHolder } from './constants'

interface UtbetalingInterface {
    reisetilskuddId: string;
    utbetalingTilArbeidsgiver?: boolean;
}

const Utbetaling = (): ReactElement => {
    const [ visningsfeilmeldinger, settVisningsfeilmeldinger, ] = useState<FeiloppsummeringFeil[]>([])
    const {
        activeMegArbeidsgiver,
        utbetalingspørsmålValidert,
        settUtbetalingspørsmålValidert,
    } = useAppStore()
    const [ skalViseFeil, settSkalViseFeil ] = useState<boolean>(false)

    const { soknadssideID, reisetilskuddID } = useParams<RouteParams>()
    const soknadssideIDTall = Number(soknadssideID)
    const getArbeidsgiver = (): ArbeidsgiverInterface => ({
        navn: 'Arbeids- og velferdsetaten',
        orgNr: '392392482849',
    })

    const history = useHistory()

    const leggInnArbeidsGiverIString = (tekstStreng: string) => tekstStreng.replace(
        arbeidsgiverNavnPlaceHolder, getArbeidsgiver().navn,
    ).replace(
        arbeidsgiverOrgNrPlaceHolder, getArbeidsgiver().orgNr,
    )

    const byttUtSpørsmålsTekster = (svaralternativer: Svaralternativ[]): Svaralternativ[] => (
        [ ...svaralternativer ].map((svaralternativ: Svaralternativ) => (
            { ...svaralternativ, label: leggInnArbeidsGiverIString(svaralternativ.label) }
        )))

    const validerUtbetaling = (): FeiloppsummeringFeil[] => {
        if (activeMegArbeidsgiver === '') {
            return [
                {
                    skjemaelementId: utbetalingSpørsmål.svaralternativer[0].id,
                    feilmelding: 'Du må velge en av alternativene for utbetaling',
                },
            ]
        }
        return []
    }

    useEffect(() => {
        const valideringsfeil: FeiloppsummeringFeil[] = []
        const utbetalingFeil = validerUtbetaling()

        valideringsfeil.push(...utbetalingFeil)
        settVisningsfeilmeldinger(valideringsfeil)

        if (valideringsfeil.length < 1) {
            settUtbetalingspørsmålValidert(true)
        } else {
            settUtbetalingspørsmålValidert(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ activeMegArbeidsgiver, skalViseFeil ])

    const handleVidereKlikk = () => {
        if (utbetalingspørsmålValidert) {
            post<UtbetalingInterface>(`${env.apiUrl}/reisetilskudd`, {
                reisetilskuddId: reisetilskuddID,
                utbetalingTilArbeidsgiver: activeMegArbeidsgiver === utbetalingSpørsmålVerdier.ARBEIDSGIVER,
            }).then(() => {
                gåTilNesteSide(history, soknadssideIDTall)
            }).catch((error) => {
                logger.error('Feil ved oppdatering av skjema', error)
            })
        } else {
            settSkalViseFeil(true)
        }
    }

    return (
        <>
            <RadioSpørsmålUtbetaling
                tittel={utbetalingSpørsmål.tittel}
                name={utbetalingSpørsmål.name}
                spørsmålstekst={leggInnArbeidsGiverIString(utbetalingSpørsmål.spørsmålstekst)}
                svaralternativer={byttUtSpørsmålsTekster(utbetalingSpørsmål.svaralternativer)}
                id={utbetalingSpørsmål.id}
            />
            <Vis hvis={skalViseFeil && visningsfeilmeldinger.length > 0}>
                <Feiloppsummering tittel="For å gå videre må du rette opp følgende:" feil={visningsfeilmeldinger} />
            </Vis>
            <VidereKnapp aktivtSteg={soknadssideIDTall} onClick={handleVidereKlikk} />
        </>
    )
}

export default Utbetaling

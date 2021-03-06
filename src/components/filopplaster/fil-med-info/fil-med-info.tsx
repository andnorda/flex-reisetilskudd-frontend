import './fil-med-info.less'

import { Knapp } from 'nav-frontend-knapper'
import Lenke from 'nav-frontend-lenker'
import { Element, Normaltekst } from 'nav-frontend-typografi'
import React from 'react'

import vedlegg from '../../../assets/vedlegg.svg'
import { del } from '../../../data/fetcher/fetcher'
import { useAppStore } from '../../../data/stores/app-store'
import { Kvittering } from '../../../types/kvittering'
import { DatoFormat, formatertDato } from '../../../utils/dato'
import env from '../../../utils/environment'
import formaterFilstørrelse from '../../../utils/fil-utils'
import { logger } from '../../../utils/logger'
import { tekst } from '../../../utils/tekster'
import Vis from '../../vis'
import SlettFilIkon from './slett-fil-ikon.svg'

interface Props {
    fil: Kvittering;
    fjernKnapp?: boolean;
}

const FilMedInfo = ({ fil, fjernKnapp }: Props) => {
    const { kvitteringer, setKvitteringer } = useAppStore()

    const slettKvittering = (kvitteringSomSkalSlettes: Kvittering) => {
        setKvitteringer(kvitteringer.filter(
            (kvittering) => kvittering.kvitteringId !== kvitteringSomSkalSlettes.kvitteringId,
        ))
        del<string>(`${env.apiUrl}/api/v1/kvittering/${fil.kvitteringId}`)
            .catch((error) => logger.error('Feil under sletting av kvittering', error))
    }

    const håndterKlikk = () => {
        if (slettKvittering) {
            slettKvittering(fil)
        }
    }

    function truncate(fullString: string, stringLen: number, separator: string) {
        if (fullString.length <= stringLen) {
            return fullString
        }
        return fullString.substr(0, 2) + separator + fullString.substr(-3)
    }

    return (
        <div className={` ${fjernKnapp ? 'fil-med-info' : 'fil-med-info-uten-slettknapp'}`}>
            <div className="kvittering">
                <img className="vedleggsikon" src={vedlegg} alt="Vedleggsikon" />
                <Lenke href="#" className="filnavn">{truncate(fil.navn, 15, '...')}</Lenke>
            </div>
            <Normaltekst className="filstorrelse">
                {formaterFilstørrelse(fil.storrelse)}
            </Normaltekst>
            <Normaltekst className="belop">
                {fil.belop + ' kr'}
            </Normaltekst>
            <Normaltekst className="dato">
                {fil.fom ? formatertDato(fil.fom, DatoFormat.NATURLIG_LANG) : ''}
            </Normaltekst>
            <Vis hvis={fjernKnapp}>
                <Knapp className="slett-knapp" onClick={håndterKlikk}>
                    <img src={SlettFilIkon} alt="" />
                    <span>{tekst('fil_med_info.fjern')}</span>
                </Knapp>
            </Vis>
            <Element className="mobil-belop">{tekst('fil_med_info.belop')}:</Element>
            <Element className="mobil-dato">{tekst('fil_med_info.dato')}:</Element>
        </div>
    )
}

export default FilMedInfo

import React, { useState } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Vis from '../Vis';

import { KvitteringInterface, OpplastetKvitteringInterface, TransportmiddelAlternativer } from '../../models/kvittering';
import Fil from './Fil';
import './Filopplaster.less';
import env from '../../utils/environment';
import { logger } from '../../utils/logger';
import { post } from '../../data/fetcher/fetcher';
import Datovelger from '../kvittering/datovelger/Datovelger';
import { useAppStore } from '../../data/stores/app-store';
import { generateId } from '../../utils/random';
import TransportmiddelKvittering from '../kvittering/TransportmiddelKvittering';
import InputSporsmal from '../sporsmal/inputSporsmal/InputSporsmal';
import {
  kvitteringTotaltBeløpSpørsmål,
  kvitteringDatoSpørsmål,
  kvitteringTransportmiddelSpørsmål,
} from '../sporsmal/sporsmalTekster';

const FilopplasterModal: React.FC = () => {
  Modal.setAppElement('#root'); // accessibility measure: https://reactcommunity.org/react-modal/accessibility/

  const [laster, settLaster] = useState<boolean>(false);
  const [dato, settDato] = useState<Date | null>(null);
  const [beløp, settBeløp] = useState<number | null>(null);
  const [valideringsFeil, settValideringsFeil] = useState<FeiloppsummeringFeil[]>([]);
  const {
    kvitteringer, settKvitteringer,
    transportmiddelKvittering, settTransportmiddelKvittering,
    uopplastetFil, settUopplastetFil,
    åpenFilopplasterModal, settÅpenFilopplasterModal,
  } = useAppStore();

  const nyKvittering = (kvittering: KvitteringInterface) => {
    settKvitteringer([...kvitteringer, kvittering]);
  };

  const lukkModal = () => {
    settUopplastetFil(null);
    settÅpenFilopplasterModal(false);
  };

  const fåFeilmeldingTilInput = (
    hvilkenInput : string,
  ) : string | undefined => valideringsFeil.find(
    (element) => element.skjemaelementId === hvilkenInput,
  )?.feilmelding;

  const validerBeløp = (nyttBeløp : number | null): FeiloppsummeringFeil[] => {
    if (!nyttBeløp || nyttBeløp === null) {
      return [{
        skjemaelementId: kvitteringTotaltBeløpSpørsmål.id,
        feilmelding: 'Vennligst skriv inn et gyldig beløp',
      }];
    }
    if (nyttBeløp <= 0) {
      return [{
        skjemaelementId: kvitteringTotaltBeløpSpørsmål.id,
        feilmelding: 'Vennligst skriv inn et positivt beløp',
      }];
    }
    return [];
  };

  const validerDato = (nyDato: Date | null): FeiloppsummeringFeil[] => {
    if (!nyDato || nyDato === null) {
      return [
        {
          skjemaelementId: kvitteringDatoSpørsmål.id,
          feilmelding: 'Vennligst velg en gyldig dato',
        },
      ];
    }
    return [];
  };

  const validerTransportmiddel = (nyttTransportmiddel: TransportmiddelAlternativer)
  : FeiloppsummeringFeil[] => {
    if (nyttTransportmiddel === undefined) {
      return [
        {
          skjemaelementId: kvitteringTransportmiddelSpørsmål.id,
          feilmelding: 'Vennligst velg minst ett transportmiddel',
        },
      ];
    }
    return [];
  };

  const validerKvittering = (
    nyttBeløp: number | null = null,
    nyDato : Date | null = null,
    nyttTransportmiddel : TransportmiddelAlternativer | null = null,
  ) => {
    const datoFeil = validerDato(nyDato || dato);
    const beløpFeil = validerBeløp(nyttBeløp || beløp);
    const transportmiddelFeil = validerTransportmiddel(
      nyttTransportmiddel
      || transportmiddelKvittering,
    );

    const nyeValideringsFeil = [...datoFeil, ...beløpFeil, ...transportmiddelFeil];

    settValideringsFeil(nyeValideringsFeil);
    return nyeValideringsFeil.length === 0;
  };

  const lagreKvittering = (fil: File) => {
    const requestData = new FormData();
    requestData.append('file', fil);

    if (validerKvittering()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      requestData.append('dato', dato!.toString());
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      requestData.append('beløp', beløp!.toString());

      settLaster(true);
      post<OpplastetKvitteringInterface>(`${env.mockApiUrl}/kvittering`, requestData)
        .then((response) => {
          if (response.parsedBody?.dokumentId) {
            const kvittering: KvitteringInterface = {
              id: generateId(),
              navn: fil.name,
              størrelse: fil.size,
              beløp: (beløp || 0.0),
              dato: (dato || new Date()),
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              dokumentId: response.parsedBody!.dokumentId,
              transportmiddel: transportmiddelKvittering,
            };
            nyKvittering(kvittering);
          } else {
            logger.warn('Responsen inneholder ikke noen dokumentId', response.parsedBody);
          }
        })
        .then(() => {
          settLaster(false);
          lukkModal();
          settTransportmiddelKvittering(undefined);
        })
        .catch((error) => {
          logger.error('Feil under opplasting av kvittering', error);
        });
    }
  };

  const parseBelopInput = (belopString: string) => {
    try {
      const kommaTilPunktum = belopString.replace(',', '.');
      const inputBelop = parseFloat(kommaTilPunktum);
      settBeløp(inputBelop);
      validerKvittering(inputBelop, null, null);
    } catch {
      logger.error(`Fikk ikke til å parse beløp ${belopString}`);
    }
  };

  const oppdaterDato = (nyDato: Date): void => {
    settDato(nyDato);
    validerKvittering(null, nyDato, null);
  };

  const handleTransportmiddelChange = (transportmiddel : TransportmiddelAlternativer) => {
    validerKvittering(null, null, transportmiddel);
  };

  return (
    <Modal
      isOpen={åpenFilopplasterModal}
      onRequestClose={() => lukkModal()}
      closeButton
      contentLabel="Modal"
      className="filopplaster-modal"
    >
      <div className="modal-content">
        <Undertittel className="kvittering-header"> Ny kvittering </Undertittel>
        <div className="input-rad">
          <Datovelger
            id={kvitteringDatoSpørsmål.id}
            className="periode-element"
            label="Dato"
            mode="single"
            onChange={(nyDato) => oppdaterDato(nyDato[0])}
            feil={fåFeilmeldingTilInput(kvitteringDatoSpørsmål.id)}
          />
          <InputSporsmal
            tittel={kvitteringTotaltBeløpSpørsmål.tittel}
            inputMode={kvitteringTotaltBeløpSpørsmål.inputMode}
            bredde={kvitteringTotaltBeløpSpørsmål.bredde}
            id={kvitteringTotaltBeløpSpørsmål.id}
            onChange={(value) => parseBelopInput(value)}
            feil={fåFeilmeldingTilInput(kvitteringTotaltBeløpSpørsmål.id)}
          />
        </div>
        <div>
          <TransportmiddelKvittering handleChange={(
            transportmiddel,
          ) => handleTransportmiddelChange(transportmiddel)}
          />
        </div>
        <Fil fil={uopplastetFil} className="opplastede-filer" />
        {laster
          ? (<NavFrontendSpinner className="lagre-kvittering-spinner" />)
          : (
            <Knapp
              htmlType="submit"
              className="lagre-kvittering"
              onClick={() => (
                uopplastetFil ? lagreKvittering(uopplastetFil) : logger.info('Noen har prøvd å laste opp en tom fil')
              )}
            >
              Lagre kvittering
            </Knapp>
          )}
        <Vis hvis={valideringsFeil.length > 0}>
          <Feiloppsummering tittel="For å gå videre må du rette opp følgende:" feil={valideringsFeil} />
        </Vis>
      </div>
    </Modal>
  );
};

export default FilopplasterModal;

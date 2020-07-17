import React, { useState } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import FilopplasterModal from '../filopplaster/FilopplasterModal';
import { IPeriode } from '../../models/periode';
import { IVedlegg } from '../../models/vedlegg';
import './Periode.less';
import Datovelger from '../datovelger/Datovelger';
import OpplastedeFiler from '../filopplaster/OpplastedeFiler';
import DragAndDrop from '../filopplaster/DragAndDrop';
import TotalBelop from './totaltBelop/TotaltBelop';
import PeriodeTittel from './periodeTittel/PeriodeTittel';
import TransportMiddelSporsmal from './transportmiddelSporsmal/TransportMiddelSporsmal';

interface Props {
  periode: IPeriode,
  index?: number,
  onChange?: () => void
}

const tillatteFiltyper = ['image/png', 'image/jpeg'];
const maxFilstørrelse = 1024 * 1024;

const Periode: React.FC<Props> = ({ periode, index, onChange }) => {
  const [transportMiddel, settTransportMiddel] = useState();

  const nårNyttVedlegg = (vedlegg: IVedlegg) => {
    periode.vedlegg.push(vedlegg);
    if (onChange) {
      onChange();
    }
  };

  const nårSlettVedlegg = (vedleggSomSkalSlettes: IVedlegg) => {
    // eslint-disable-next-line no-param-reassign
    periode.vedlegg = periode.vedlegg
      .filter((_vedlegg: IVedlegg) => _vedlegg.navn !== vedleggSomSkalSlettes.navn);
    if (onChange) {
      onChange();
    }
  };

  return (
    <Ekspanderbartpanel
      className="periode-panel"
      key={periode.id}
      tittel={<PeriodeTittel periode={periode} index={index} />}
    >
      <hr />
      <Datovelger className="periode-element" label="Dato" mode="range" onChange={() => { }} />
      <TransportMiddelSporsmal
        periode={periode}
        settTransportMiddel={settTransportMiddel}
        transportMiddel={transportMiddel}
      />
      {TotalBelop(periode)}
      <div className="filopplaster-wrapper periode-element">
        <OpplastedeFiler
          className="opplastede-filer"
          filliste={periode.vedlegg}
          slettVedlegg={nårSlettVedlegg}
        />
        <div className="filopplaster">
          <FilopplasterModal nårNyttVedlegg={nårNyttVedlegg} />
          <DragAndDrop tillatteFiltyper={tillatteFiltyper} maxFilstørrelse={maxFilstørrelse} />
        </div>
      </div>
    </Ekspanderbartpanel>
  );
};

export default Periode;

import React from 'react';
import { Element } from 'nav-frontend-typografi';
import FilMedInfo from './FilMedInfo';
import { VedleggInterface } from '../../models/vedlegg';
import Vis from '../Vis';

interface Props {
  filliste: VedleggInterface[];
  slettVedlegg?: (vedlegg: VedleggInterface) => void;
  className?: string;
}

const OpplastedeFiler: React.FC<Props> = ({ filliste, slettVedlegg, className }) => (
  <div className={className}>
    <Vis hvis={filliste.length > 0}>
      <div className="kvitteringsinfo-tittel">
        <Element className="kvittering-tittel">Kvittering</Element>
        <Element className="belop-tittel">Beløp</Element>
        <Element className="dato-tittel">Dato</Element>
      </div>
    </Vis>

    {filliste.map((fil: VedleggInterface, index: number) => (
      <div key={fil.id}>
        <FilMedInfo fil={fil} slettVedlegg={slettVedlegg} />
        {index === filliste.length - 1 ? '' : <hr />}
      </div>
    ))}
  </div>
);

export default OpplastedeFiler;

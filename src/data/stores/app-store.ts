/* eslint-disable object-property-newline */
import constate from 'constate';
import { useState } from 'react';
import { IPeriode, Transportmiddel } from '../../models/periode';

import { generateId } from '../../utils/random';

const mockPerioder = [
  {
    id: generateId(),
    vedlegg: [],
    fraDato: new Date(),
    tilDato: new Date(),
    transportMiddel: Transportmiddel.taxi,
  },
  {
    id: generateId(),
    vedlegg: [],
    transportMiddel: Transportmiddel.egenBil,
  },
];

export const [AppStoreProvider, useAppStore] = constate(() => {
  const [activeOffentligPrivat, setActiveOffentligPrivat] = useState<string>('');
  const [egenBilChecked, setEgenBilChecked] = useState<boolean>();
  const [syklerChecked, setSyklerChecked] = useState<boolean>();
  const [gårChecked, setGårChecked] = useState<boolean>();
  const [perioder, settPerioder] = useState<IPeriode[]>(mockPerioder);

  return {
    activeOffentligPrivat, setActiveOffentligPrivat,
    egenBilChecked, setEgenBilChecked,
    syklerChecked, setSyklerChecked,
    gårChecked, setGårChecked,
    perioder, settPerioder,
  };
});

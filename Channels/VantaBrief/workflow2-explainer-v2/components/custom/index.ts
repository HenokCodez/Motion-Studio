import React from 'react';
import {withFonts} from '../primitives';

import metaC01 from '../animations/meta/C01.json';
import {C01} from './C01';
import metaC02 from '../animations/meta/C02.json';
import {C02} from './C02';
import metaC03 from '../animations/meta/C03.json';
import {C03} from './C03';
import metaC04 from '../animations/meta/C04.json';
import {C04} from './C04';
import metaC05 from '../animations/meta/C05.json';
import {C05} from './C05';
import metaC06 from '../animations/meta/C06.json';
import {C06} from './C06';
import metaC07 from '../animations/meta/C07.json';
import {C07} from './C07';
import metaC08 from '../animations/meta/C08.json';
import {C08} from './C08';
import metaC09 from '../animations/meta/C09.json';
import {C09} from './C09';
import metaC10 from '../animations/meta/C10.json';
import {C10} from './C10';
import metaC11 from '../animations/meta/C11.json';
import {C11} from './C11';
import metaC12 from '../animations/meta/C12.json';
import {C12} from './C12';
import metaC13 from '../animations/meta/C13.json';
import {C13} from './C13';
import metaC14 from '../animations/meta/C14.json';
import {C14} from './C14';

export const customRegistry: {meta: any; Component: React.FC<any>}[] = [
  {meta: metaC01, Component: withFonts(C01)},
  {meta: metaC02, Component: withFonts(C02)},
  {meta: metaC03, Component: withFonts(C03)},
  {meta: metaC04, Component: withFonts(C04)},
  {meta: metaC05, Component: withFonts(C05)},
  {meta: metaC06, Component: withFonts(C06)},
  {meta: metaC07, Component: withFonts(C07)},
  {meta: metaC08, Component: withFonts(C08)},
  {meta: metaC09, Component: withFonts(C09)},
  {meta: metaC10, Component: withFonts(C10)},
  {meta: metaC11, Component: withFonts(C11)},
  {meta: metaC12, Component: withFonts(C12)},
  {meta: metaC13, Component: withFonts(C13)},
  {meta: metaC14, Component: withFonts(C14)},
];

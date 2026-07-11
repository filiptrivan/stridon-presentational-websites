export type { Brand, BilingualText, BrandParagraph, BrandCatalog } from "./types";

import { dewalt } from "./dewalt";
import { bosch } from "./bosch";
import { stanley } from "./stanley";
import { rems } from "./rems";
import { wiha } from "./wiha";
import { knipex } from "./knipex";
import { gtv } from "./gtv";
import { max } from "./max";
import { hogert } from "./hogert";
import { wera } from "./wera";
import { rubi } from "./rubi";
import { senco } from "./senco";
import { black_and_decker } from "./black-and-decker";
import { mtx } from "./mtx";
import { sparta } from "./sparta";
import { sg_tools } from "./sg-tools";
import { karcher } from "./karcher";
import { wolfcraft } from "./wolfcraft";
import { kwb } from "./kwb";

import type { Brand } from "./types";

export const BRANDS: Brand[] = [
  dewalt,
  bosch,
  stanley,
  rems,
  wiha,
  knipex,
  gtv,
  max,
  hogert,
  wera,
  rubi,
  senco,
  black_and_decker,
  mtx,
  sparta,
  sg_tools,
  karcher,
  wolfcraft,
  kwb,
];

export const getBrandBySlug = (slug: string): Brand | undefined =>
  BRANDS.find((b) => b.slug === slug);

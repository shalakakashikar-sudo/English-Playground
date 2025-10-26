// @/database/db.ts
import { words } from './words';
import { idioms } from './idioms';
import { grammar } from './grammar';
import { quotes } from './quotes';
import { crosswords } from './crosswords';

// This file aggregates all the content from the separated database files
// into a single DB object. This maintains a consistent API for the rest
// of the application while keeping the data sources organized.
export const DB = {
  words,
  idioms,
  grammar,
  quotes,
  crosswords,
};

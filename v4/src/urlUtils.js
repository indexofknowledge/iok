import { STORAGE_TYPES } from './types';
import { DEFL_STORAGE, DEFL_STORAGE_OPTIONS } from './constants';

export const redirectStorage = (storage, options = {}) => {
  const url = new URL(window.location.origin);
  url.pathname = storage;
  const par = url.searchParams;
  Object.keys(options).forEach((key) => {
    par.set(key, options[key]);
  });
  window.location.href = url;
};

export const redirectGuest = () => {
  redirectStorage(STORAGE_TYPES.BLOCKSTACK, { guest: true });
};

export const redirectDefl = () => {
  redirectStorage(DEFL_STORAGE, DEFL_STORAGE_OPTIONS);
};

export const parseParams = () => {
  const url = new URL(window.location.href);
  // hacky, but gets the pathname without params
  const pathname = url.pathname.split('/')[1].split('&')[0];
  const par = new URLSearchParams(window.location.search);

  /**
       * Params parsing logic, mainly for configuring storage
       * and related options. Anything invalid goes to default
       * TODO: hide this from url params (#102)
       * */
  let storage = DEFL_STORAGE;
  const options = JSON.parse(JSON.stringify(DEFL_STORAGE_OPTIONS));
  switch (pathname) {
    case STORAGE_TYPES.BLOCKSTACK:
      storage = STORAGE_TYPES.BLOCKSTACK;
      if (par.has('guest') && par.get('guest') === 'true') {
        options.guest = true;
        options.username = 'guest';
      } else {
        options.guest = false;
      }
      if (par.has('loaduser')) {
        options.loaduser = par.get('loaduser');
      }
      break;
    case STORAGE_TYPES.IPFS:
      storage = STORAGE_TYPES.IPFS;
      if (par.has('hash')) {
        options.hash = par.get('hash');
      } else {
        redirectDefl();
      }
      break;
    default:
      redirectDefl();
  }

  return { storage, options };
};

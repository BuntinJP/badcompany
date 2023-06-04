import { DirectoryOutbound, BCState } from '../types';

/**
 * URLが適正かチェックする。適正の場合はtrueを返す。
 * @param url check対象URL
 * @returns bool
 */
export const checkUrl = (url: string) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    if (urlObj.pathname.includes('-raw-free') || urlObj.pathname.includes('chapters')) return true;
    return false;
  } catch (e) {
    return false;
  }
};

export const checkMEserver = async (url: string) => {
  if (!url) return false;
  const res = await fetch(url);
  if (res.ok) return true;
  return false;
}

export const getDir = async () => {
  return await (
    await fetch('https://manga.buntin.xyz/directory')
  ).json() as DirectoryOutbound;
}

export const getBCstate = async () => {
  return await (
    await fetch('https://manga.buntin.xyz/version/bc')
  ).json() as BCState;
}

export const trimZero = (str: string): string => {
  while (str.startsWith('0')) {
    str = str.slice(1);
  }
  if (str.startsWith('.')) {
    str = '0' + str;
  }
  while (str.endsWith('0') && str.includes('.')) {
    str = str.slice(0, -1);
  }
  if (str.endsWith('.')) {
    str = str.slice(0, -1);
  }
  return str;
};

export const trimedEpsByIndex = (dir: DirectoryOutbound, index: number) => {
  return dir.outbound[index].episodes.map((ep) =>
    trimZero(ep.split('-').shift() || 'err')
  );
}

export const mePost = async (url: string, data: any) => {
  /*   fetch(`${ env.SERVER_URL }/badcompany`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pl),
    }); */
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
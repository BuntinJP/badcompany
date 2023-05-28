

/**
 * URLが適正かチェックする。適正の場合はtrueを返す。
 * @param url check対象URL
 * @returns bool
 */
export const checkUrl = ( url: string ) => {
  if ( !url ) return false;
  try {
    const urlObj = new URL( url );
    if ( urlObj.pathname.includes( '-raw-free' ) || urlObj.pathname.includes( 'chapters' ) ) return true;
    return false;
  } catch ( e ) {
    return false;
  }
};

export const checkMEserver = async ( url: string ) => {
  if ( !url ) return false;
  const res = await fetch( url );
  if ( res.ok ) return true;
  return false;
}

export const sleep = ( ms: number ) => new Promise( ( resolve ) => setTimeout( resolve, ms ) );
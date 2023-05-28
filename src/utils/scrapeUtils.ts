

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

export const sleep = ( ms: number ) => new Promise( ( resolve ) => setTimeout( resolve, ms ) );
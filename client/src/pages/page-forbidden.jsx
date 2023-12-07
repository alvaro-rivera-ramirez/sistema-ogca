import { Helmet } from 'react-helmet-async';

import { UnAuthorized } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function AccessForbidden() {
  return (
    <>
      <Helmet>
        <title> 401 Access Forbidden </title>
      </Helmet>

      <UnAuthorized />
    </>
  );
}

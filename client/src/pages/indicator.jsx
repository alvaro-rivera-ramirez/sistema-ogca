import { Helmet } from 'react-helmet-async';
import {IndicatorListView} from 'src/sections/indicators/view';


// ----------------------------------------------------------------------

export default function IndicatorPage() {
  return (
    <>
      <Helmet>
        <title> Indicadores | OGCA </title>
      </Helmet>
      <IndicatorListView />
    </>
  );
}

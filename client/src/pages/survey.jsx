import { Helmet } from 'react-helmet-async';

import { SurveyView} from 'src/sections/survey/view';

// ----------------------------------------------------------------------

export default function SurveyPage() {
  return (
    <>
      <Helmet>
        <title> Ficha | OGCA </title>
      </Helmet>

      <SurveyView />
    </>
  );
}
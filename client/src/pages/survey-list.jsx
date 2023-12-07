import { Helmet } from 'react-helmet-async';

import { SurveyListView} from 'src/sections/survey/view';

// ----------------------------------------------------------------------

export default function SurveyListPage() {
  return (
    <>
      <Helmet>
        <title> Lista de Fichas | OGCA </title>
      </Helmet>

      <SurveyListView />
    </>
  );
}

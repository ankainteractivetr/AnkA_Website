import { BrowserRouter } from 'react-router';
import { LanguageProvider } from './i18n/LanguageProvider';
import { AppRoutes } from './routes/AppRoutes';
import { browserLanguage, languageStore } from './services';

function App()
{
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LanguageProvider languageStore={languageStore} browserLanguage={browserLanguage}><AppRoutes /></LanguageProvider>
    </BrowserRouter>
  );
}

export default App;

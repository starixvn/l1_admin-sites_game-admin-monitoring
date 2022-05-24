import i18n from 'i18next';
import fetch from 'i18next-fetch-backend';
import languageDetector from 'i18next-browser-languagedetector';
import axios from 'axios';
import configs from '../../configs.json';

export default async function () {
  const i18nConfigPath = configs.I18nConfigPath;
  const i18nOptions = await axios.get(i18nConfigPath).then((data) => data.data);

  await i18n
    .use(fetch)
    .use(languageDetector)
    .init(i18nOptions);

  return i18n;
}

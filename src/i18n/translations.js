import idCommon from "@/locales/id/common.json";
import enCommon from "@/locales/en/common.json";
import idShared from "@/locales/id/shared.json";
import enShared from "@/locales/en/shared.json";
import { DEFAULT_LANGUAGE } from "./localeConfig";

const localeModules = {
  id: import.meta.glob("../locales/id/pages/*.json", { eager: true }),
  en: import.meta.glob("../locales/en/pages/*.json", { eager: true }),
};

const toPageKey = (filePath) =>
  filePath.split("/").pop()?.replace(".json", "") || "";

const normalizePageDictionary = (modules) =>
  Object.fromEntries(
    Object.entries(modules).map(([filePath, moduleValue]) => [
      toPageKey(filePath),
      moduleValue.default || moduleValue,
    ]),
  );

const pageDictionaries = {
  id: normalizePageDictionary(localeModules.id),
  en: normalizePageDictionary(localeModules.en),
};

const commonDictionaries = {
  id: idCommon,
  en: enCommon,
};

const sharedDictionaries = {
  id: idShared,
  en: enShared,
};

export function getCommonDictionary(language) {
  return commonDictionaries[language] || commonDictionaries[DEFAULT_LANGUAGE];
}

export function getPageDictionary(language, pageKey) {
  const languagePages = pageDictionaries[language] || pageDictionaries[DEFAULT_LANGUAGE];
  return languagePages[pageKey] || {};
}

export function getMergedDictionary(language, pageKey) {
  return {
    ...getCommonDictionary(language),
    ...getPageDictionary(language, pageKey),
    ...(sharedDictionaries[language] || sharedDictionaries[DEFAULT_LANGUAGE]),
  };
}

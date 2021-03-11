import React, { useEffect } from 'react';
import LanguageService, { LanguageSetting } from "../services/language-service";
import { LanguageSystemWords } from "../../models/language";

export const useLanguage = (): { language: LanguageSetting, words: LanguageSystemWords, dir: string } => {
    const [ language, setLanguage ] = React.useState<any>(LanguageService.getLanguageSettings());
    const [ callBackID, setCallBackID ] = React.useState<number | null>(null);
    const [ cleanSubscribe, setCleanSubscribe ] = React.useState<boolean>(false);
    useEffect(() => {
        if (!callBackID && !cleanSubscribe) {
            setCallBackID(LanguageService.subscribe((settings) => {
                setLanguage(settings);
            }));
        }
        return () => {
            if (callBackID) {
                setCallBackID(null);
                setCleanSubscribe(true);
                LanguageService.unsubscribe(callBackID);
            }
        }
    }, [ callBackID, cleanSubscribe ]);
    return {language, words: language.words, dir: language.direction};
}
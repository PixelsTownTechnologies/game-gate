import React, {useEffect} from 'react';
import LanguageService, { LanguageBaseWords, LanguageSetting } from "../services/language-service";

export const useLanguage = (): { language: LanguageSetting, words: LanguageBaseWords, dir: string } => {
    const [ language, setLanguage ] = React.useState<any>(LanguageService.getLanguageSettings());
    const [ callBackID, setCallBackID ] = React.useState<number | null>(null);
    useEffect(() => {
        if (!callBackID) {
            setCallBackID(LanguageService.subscribe((settings) => {
                setLanguage(settings);
            }));
        }
        return () => {
            if (callBackID) {
                LanguageService.unsubscribe(callBackID);
                setCallBackID(null);
            }
        }
    }, [callBackID]);
    return {language, words: language.words, dir: language.direction};
}
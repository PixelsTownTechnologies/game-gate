import React, {useEffect} from 'react';
import LanguageService, { LanguageSetting } from "../services/language-service";
import { LanguageSystemWords } from "../../models/language";

export const useLanguage = (): { language: LanguageSetting, words: LanguageSystemWords, dir: string } => {
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
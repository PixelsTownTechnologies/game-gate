import { EnumDTO } from "../../../lib/models/enum";
import EntityWrapper, {
    EntityWrapperConfig,
    EntityWrapperProps,
    EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { enumsService } from "../../../services/service-config";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { getDefaultValidMsg } from "../../../lib/utils/utils";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";

interface ManageEnumsProps extends EntityWrapperProps<EnumDTO> {
}

interface ManageEnumsState extends EntityWrapperState<EnumDTO> {
}


class ManageEnums extends EntityWrapper<EnumDTO, ManageEnumsProps, ManageEnumsState> {

    constructor(props: ManageEnumsProps) {
        super(props, enumsService);
    }

    init = (): void => {
    }

    getConfig(): EntityWrapperConfig {
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            title: word.title.manageEnums,
            icon: 'list alternate'
        };
    }

    getWrapper = () => {
        return Wrapper;
    }

    getSubButtons = () => {
        return null;
    }

    getTableSettings(): TableSetting[] {
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return [
            {
                fieldName: 'id',
                title: word.fields.id,
                type: 'text',
                width: 100,
                center: true
            },
            {
                fieldName: 'name',
                title: word.fields.name,
                type: 'text',
                width: 120
            },
            {
                fieldName: 'data',
                title: word.fields.value,
                type: 'text',
                width: 220
            },
        ];
    }

    getFormFields(): DFormField[][] {
        const words = this.state.word;
        const selectedEnum = this.state.selectedForm;
        if(!selectedEnum){
            return [];
        }
        return [
            [
                {
                    fieldName: 'data',
                    type: selectedEnum.type,
                    fieldTitle: words.fields.value
                }
            ]
        ];
    }

    getActionToTitleMap(): { [p: string]: string } {
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            'edit': words.title.actions.editEnums,
        };
    }

    getMessagesErrorForm(): { code: string; msg: string }[] {
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return [
            ...getDefaultValidMsg(words)
        ];
    }

    showAddButton(): boolean {
        return false;
    }

    showEditButton(): boolean {
        return true;
    }

}

export default connect(generateMapStateEntityToProps([ enumsService.storeName ]))(ManageEnums);
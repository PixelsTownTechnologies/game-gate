import EntityWrapper, {
    EntityWrapperConfig,
    EntityWrapperProps,
    EntityWrapperState
} from "../../../lib/components/wrapper/entity-wrapprt";
import { LanguageSystemWords } from "../../../models/language";
import { Wrapper } from "../../shared/wrapper";
import { TableSetting } from "../../../lib/components/tabels";
import { DFormField } from "../../../lib/components/form/models";
import { getDefaultValidMsg, removeEmpty } from "../../../lib/utils/utils";
import { connect } from "react-redux";
import { generateMapStateEntityToProps } from "../../../lib/store/util";
import { filesService } from "../../../services/service-config";
import { FileDTO } from "../../../models/files";
import { DialogFormActionResult } from "../../../lib/components/form/dialog-form";

interface ManageFilesProps extends EntityWrapperProps<FileDTO> {
}

interface ManageFilesState extends EntityWrapperState<FileDTO> {
}


class ManageFiles extends EntityWrapper<FileDTO, ManageFilesProps, ManageFilesState> {

    constructor(props: ManageFilesProps) {
        super(props, filesService);
    }

    init = (): void => {
    }

    getConfig(): EntityWrapperConfig {
        const word: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            title: word.entities.files.title,
            icon: 'images',
            showDelete: true
        };
    }

    async handleSaveAction(form: FileDTO): Promise<DialogFormActionResult> {
        if (this.state.selectedForm && [ 'edit', 'add' ].includes(this.state.action)) {
            form.file = form.file
            && typeof ( form.file ) === 'string'
            && form.file.split('http').length > 1 ? undefined : form.file;
            form = removeEmpty(form);
        }
        return super.handleSaveAction(form);
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
                title: word.entities.files.fields.id,
                type: 'text',
                width: 100,
                center: true
            },
            {
                fieldName: 'name',
                title: word.entities.files.fields.name,
                type: 'text',
                width: 120
            },
            {
                fieldName: 'file',
                title: word.entities.files.fields.file,
                type: 'link',
                width: 80,
                subSetting: {
                    linkText: word.basic.show
                }
            },
            {
                fieldName: 'file',
                title: word.entities.files.fields.fileURL,
                type: 'text',
                width: 350
            },
        ];
    }

    getFormFields(): DFormField[][] {
        const words = this.state.word as LanguageSystemWords;
        return [
            [
                {
                    fieldName: 'name',
                    type: 'text',
                    fieldTitle: words.entities.files.fields.name
                }
            ],
            [
                {
                    fieldName: 'file',
                    type: 'image',
                    fieldTitle: words.entities.files.fields.file
                }
            ]
        ];
    }

    getActionToTitleMap(): { [p: string]: string } {
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return {
            'edit': words.entities.files.action.edit,
            'add': words.entities.files.action.add
        };
    }

    getMessagesErrorForm(): { code: string; msg: string }[] {
        const words: LanguageSystemWords = this.word() as LanguageSystemWords;
        return [
            ...getDefaultValidMsg(words)
        ];
    }

    showAddButton(): boolean {
        return true;
    }

    showEditButton(): boolean {
        return true;
    }

}

export default connect(generateMapStateEntityToProps([ filesService.storeName ]))(ManageFiles);
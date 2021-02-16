import { generateId } from "../utils/utils";

export interface SizeChangeResult {
    width: number;
    height: number;
    type: 'Mobile' | 'Computer' | 'Tablet';
}


class WindowServiceClass {

    private callBacks: Map<number, ( (value: SizeChangeResult) => void )>;

    constructor() {
        this.callBacks = new Map<number, (value: SizeChangeResult) => void>();
        window.addEventListener('resize', (e) => {
            if (this.callBacks) {
                setTimeout(() => {
                    this.callSubscribe();
                }, 100);
            }
        });
    }

    getScreen() {
        return {width: window.innerWidth, height: window.innerHeight};
    }

    openSelf(url: string) {
        window.open(url, '_self');
    }

    openNew(url: string) {
        window.open(url, '_blank');
    }

    reload() {
        window.open(window.location.href, '_self');
    }

    public subscribe = (callBack: (value: SizeChangeResult) => void) => {
        const newId = generateId();
        const screenType = window.innerWidth < 650 ? 'Mobile' : ( window.innerWidth < 950 ? 'Tablet' : 'Computer' );
        this.callBacks.set(newId, callBack);
        setTimeout(() => {
            callBack({
                width: window.innerWidth,
                height: window.innerHeight,
                type: screenType
            } as SizeChangeResult);
        }, 100);
        return newId;
    }

    public unsubscribe = (callBackId: number) => {
        const newCallBacks = new Map();
        Array.from(this.callBacks.keys()).forEach(key => {
            if (callBackId !== Number(key)) {
                newCallBacks.set(key, this.callBacks.get(Number(key)));
            }
        });
        this.callBacks = newCallBacks;
    }

    private callSubscribe = () => {
        const screenType = window.innerWidth < 650 ? 'Mobile' : ( window.innerWidth < 950 ? 'Tablet' : 'Computer' );
        [ ...this.callBacks.values() as any ].forEach(callback => {
            if (callback) {
                callback({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    type: screenType
                } as SizeChangeResult);
            }
        });
    }

    getSetting = (): SizeChangeResult => {
        const screenType = window.innerWidth < 650 ? 'Mobile' : ( window.innerWidth < 950 ? 'Tablet' : 'Computer' );
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            type: screenType
        };
    }

}

const WindowService = new WindowServiceClass();
export default WindowService;
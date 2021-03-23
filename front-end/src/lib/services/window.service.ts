import { generateId } from "../utils/utils";

export interface SizeChangeResult {
	width: number;
	height: number;
	type: 'Mobile' | 'Computer' | 'Tablet';
}


class WindowServiceClass {
	
	private static timeoutValue: number;
	
	private callBacks: Map<number, ( (value: SizeChangeResult) => void )>;
	private timerCallBack: Map<number, ( () => void )>;
	
	private intervalsIds: any[];
	
	constructor() {
		this.callBacks = new Map<number, (value: SizeChangeResult) => void>();
		this.timerCallBack = new Map<number, () => void>();
		this.intervalsIds = [];
		window.addEventListener('resize', (e) => {
			if (this.callBacks) {
				setTimeout(() => {
					this.callSubscribe();
				}, 100);
			}
		});
		setTimeout(() =>{
			this.addInterval(
				setInterval(() => {
				this.callTimerSubscribe();
			}, WindowServiceClass.timeoutValue
				? WindowServiceClass.timeoutValue : ( 60 * 1000 )));
		}, 5000);
	}
	
	addInterval = (id: any) => {
		this.intervalsIds.push(id);
	}
	
	clearIntervals = () => {
		this.intervalsIds.forEach(id => {
			window.clearInterval(id);
		});
	}
	
	setTimeoutValue = (val: number) => {
		WindowServiceClass.timeoutValue = val;
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
		const screenType = window.innerWidth < 790 ? 'Mobile' : ( window.innerWidth < 1035 ? 'Tablet' : 'Computer' );
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
	
	
	public timerSubscribe = (callBack: () => void) => {
		const newId = generateId();
		this.timerCallBack.set(newId, callBack);
		return newId;
	}
	
	public timerUnsubscribe = (callBackId: number) => {
		const newCallBacks = new Map();
		Array.from(this.timerCallBack.keys()).forEach(key => {
			if (callBackId !== Number(key)) {
				newCallBacks.set(key, this.timerCallBack.get(Number(key)));
			}
		});
		this.timerCallBack = newCallBacks;
	}
	
	private callTimerSubscribe = () => {
		[ ...this.timerCallBack.values() as any ].forEach(callback => {
			if (callback) {
				callback();
			}
		});
	}
	
	private callSubscribe = () => {
		const screenType = window.innerWidth < 790 ? 'Mobile' : ( window.innerWidth < 1035 ? 'Tablet' : 'Computer' );
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
		const screenType = window.innerWidth < 790 ? 'Mobile' : ( window.innerWidth < 1035 ? 'Tablet' : 'Computer' );
		return {
			width: window.innerWidth,
			height: window.innerHeight,
			type: screenType
		};
	}
	
}

const WindowService = new WindowServiceClass();
export default WindowService;
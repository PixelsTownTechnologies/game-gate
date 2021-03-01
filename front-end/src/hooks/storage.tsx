import StorageService from "../lib/services/storage-service";

export function useFavorite(): {
    addToFavorite: (gameId: number) => void, isFavorite: (gameId: number) => boolean, getFavorite: () => number[], removeFromFavorite: (gameId: number) => void
} {
    return {
        getFavorite: () => {
            return JSON.parse(StorageService.load('favoriteGames')) as number[];
        },
        addToFavorite: (gameId: number) => {
            let list = new Set<number>();
            if (StorageService.load('favoriteGames')) {
                list = new Set(JSON.parse(StorageService.load('favoriteGames')) as number[]);
            }
            list.add(gameId);
            StorageService.store('favoriteGames', JSON.stringify([ ...( list as any ) ]));
        },
        removeFromFavorite: (gameId: number) => {
            StorageService.store('favoriteGames', StorageService.load('favoriteGames')
                ? ( JSON.parse(StorageService.load('favoriteGames')) as number[] ).filter(g => g !== gameId) : []);
        },
        isFavorite: (gameId: number): boolean => {
            if(!StorageService.load('favoriteGames') || typeof (StorageService.load('favoriteGames')) !== 'string' ){
                return false;
            }
            if(typeof (JSON.parse(StorageService.load('favoriteGames'))) === 'object' ){
                return  ( JSON.parse(StorageService.load('favoriteGames')) as number[] ).filter(g => g === gameId).length > 0;
            }
            return false;
        }
    } as any;
}
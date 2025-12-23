import {QueryClient,isServer} from '@tanstack/react-query';

export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
            }
        }
    })
}

let browserQueryClient: QueryClient | null = null;

export function getQueryClient() {
    if (isServer) {
        return makeQueryClient();
    }else{
        if(!browserQueryClient)browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}
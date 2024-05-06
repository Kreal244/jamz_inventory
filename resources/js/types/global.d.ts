import { AxiosInstance } from 'axios';
import ziggyRoute from 'ziggy-js';

declare global {
    interface Window {
        axios: AxiosInstance;
    }
    namespace NodeJS {
        interface ProcessEnv {
            AWS_ENDPOINT: string;
        }
    }
    var route: typeof ziggyRoute;
}

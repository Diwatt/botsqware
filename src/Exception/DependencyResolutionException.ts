import { BotsqwareException } from './BotsqwareException';

export class DependencyResolutionException extends BotsqwareException {
    public constructor(message: string) {
        super(message);
        this.name = 'DependencyResolutionException';
    }
}

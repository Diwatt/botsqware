import { BotsqwareException } from './BotsqwareException';

export class ApplicationConfigurationException extends BotsqwareException {
    public constructor(message: string) {
        super(message);
        this.name = 'ApplicationConfigurationException';
    }
}

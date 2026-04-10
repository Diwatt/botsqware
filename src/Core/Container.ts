import { WahaProvider } from '../Api/WahaProvider';
import { DependencyResolutionException } from '../Exception/DependencyResolutionException';
import { WahaConfigurator } from '../Api/WahaConfigurator';
import { AppConfig } from './AppConfig';
import { AppLogger } from './AppLogger';

export interface ClassType<T = unknown> {
    prototype: T;
    name: string;
}

export class Container {
    private static readonly dependencies = new Map<ClassType | symbol, unknown>();
    private static readonly factories = new Map<ClassType | symbol, () => unknown>();

    public static initialize(): void {
        Container.register(AppConfig, () => new AppConfig(), true);
        Container.register(AppLogger, () => new AppLogger(Container.get(AppConfig)), true);
        Container.register(
            WahaProvider,
            () => WahaProvider.create(Container.get(AppConfig), Container.get(AppLogger)),
            true,
        );
        Container.register(
            WahaConfigurator,
            () => new WahaConfigurator(Container.get(AppConfig), Container.get(AppLogger), Container.get(WahaProvider)),
            true,
        );
    }

    public static register<T>(cls: ClassType<T>, factory: () => T, forceCreation = false): void {
        Container.factories.set(cls, factory);

        if (forceCreation) {
            Container.dependencies.set(cls, factory());
        }
    }

    public static get<T>(cls: ClassType<T>): T {
        let instance = Container.dependencies.get(cls) as T;
        if (!instance) {
            const factory = Container.factories.get(cls);
            if (!factory) {
                throw new DependencyResolutionException(`No factory registered for ${cls.name || cls.toString()}`);
            }
            instance = factory() as T;
            Container.dependencies.set(cls, instance);
        }

        return instance;
    }
}
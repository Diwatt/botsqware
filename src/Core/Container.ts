import { DependencyResolutionException } from '../Exception/DependencyResolutionException';
import { AppConfig } from './AppConfig';
import { AppLogger } from './AppLogger';

// biome-ignore lint/suspicious/noExplicitAny: needed for a flexible factory signature
export type ClassType<T = unknown> = new (...args: any[]) => T;

export class Container {
    private static readonly dependencies = new Map<ClassType | symbol, unknown>();
    private static readonly factories = new Map<ClassType | symbol, () => unknown>();

    public static initialize(): void {
        Container.register(AppConfig, () => new AppConfig(), true);
        Container.register(AppLogger, () => new AppLogger(Container.get(AppConfig)), true);
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

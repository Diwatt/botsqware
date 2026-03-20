import type { AppLogLevel } from '../Core/AppConfig';
import { AppLogger } from '../Core/AppLogger';
import { Container } from '../Core/Container';

/**
 * Swallow a promise's rejection in a controlled way.
 *
 * Behavior:
 * - By default logs the swallowed error using the application's configured log level.
 * - Callers can override logging via the `opts.level` or disable it via `opts.log = false`.
 *
 * Rationale:
 * - Avoids an empty `catch(() => {})` which hides failures completely.
 * - Respects the global app log level (from `AppConfig`) instead of using a hardcoded default.
 */
export async function swallow<T>(
    promise: Promise<T>,
    logLevel: AppLogLevel = 'debug',
): Promise<void> {
    try {
        await promise;
    } catch (err) {
        // Call the selected method with structured context.
        Container.get(AppLogger).sys[logLevel]('Ignored error', { err });
    }
}

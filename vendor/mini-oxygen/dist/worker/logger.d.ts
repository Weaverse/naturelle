import { Protocol } from 'devtools-protocol';
import { SourceMapConsumer } from 'source-map';
import { InspectorConnection } from './inspector.js';
import 'ws';

/**
 * Adds event listeners for console messages and exceptions to the inspector connection.
 * Then, it handles logs and errors in the main Node.js process to display them in the terminal.
 * It also formats and displays source maps for errors using information that only exists
 * in the Node.js process, although this is not used for Vite processes because Vite already
 * provides source maps for errors.
 * @param inspector
 */
declare function addInspectorConsoleLogger(inspector: InspectorConnection): void;
/**
 * Creates an Error instance in the Node.js process from an unhandled exception in workerd.
 * @param exceptionDetails
 * @param inspector
 * @returns Resolves to an actual Error instance with stack trace and message.
 */
declare function createErrorFromException(exceptionDetails: Protocol.Runtime.ExceptionDetails, inspector: InspectorConnection): Promise<Error>;
/**
 * Creates an Error instance in the Node.js process from a logged error in workerd.
 * @param ro RemoteObject representing the error logged.
 * @param inspector
 * @returns Resolves to an actual Error instance with stack trace and message.
 */
declare function createErrorFromLog(ro: Protocol.Runtime.RemoteObject, inspector: InspectorConnection): Promise<Error>;
/**
 * Converts a structured-error to a friendly, source-mapped error string.
 * @param sourceMapConsumer source-map to use for mapping locations
 * @param message first line of stack trace (e.g. `Error: message`)
 * @param frames structured stack entries for error location
 */
declare function formatStructuredError(sourceMapConsumer: SourceMapConsumer, message?: string, frames?: Protocol.Runtime.CallFrame[]): string;
/**
 * Converts an unstructured-stack to a friendly, source-mapped error string.
 * @param sourceMapConsumer source-map to use for mapping locations
 * @param stack string stack trace from `Error#stack`
 */
declare function formatStack(sourceMapConsumer: SourceMapConsumer, stack: string): string;

export { addInspectorConsoleLogger, createErrorFromException, createErrorFromLog, formatStack, formatStructuredError };
